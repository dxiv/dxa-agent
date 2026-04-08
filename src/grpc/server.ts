import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import path from 'path'
import { randomUUID } from 'crypto'
import type { NonNullableUsage } from '../entrypoints/sdk/sdkUtilityTypes.js'
import { QueryEngine } from '../QueryEngine.js'
import { getTools } from '../tools.js'
import { getDefaultAppState } from '../state/AppStateStore.js'
import { AppState } from '../state/AppState.js'
import type { Message } from '../types/message.js'
import type {
  PermissionAllowDecision,
  PermissionDenyDecision,
} from '../types/permissions.js'
import { FileStateCache, READ_FILE_STATE_CACHE_SIZE } from '../utils/fileStateCache.js'

/** Inbound Chat stream payload (proto oneof fields as optional properties). */
type GrpcClientMessage = {
  request?: GrpcChatRequest
  input?: { prompt_id: string; reply: string }
  cancel?: unknown
}

type GrpcChatRequest = {
  message?: string
  working_directory?: string
  model?: string
  session_id?: string
}

function isNonNullableUsage(value: unknown): value is NonNullableUsage {
  if (value === null || typeof value !== 'object') return false
  const u = value as Record<string, unknown>
  return (
    typeof u.input_tokens === 'number' &&
    typeof u.output_tokens === 'number'
  )
}

function textFromStreamEvent(event: unknown): string | null {
  if (event === null || typeof event !== 'object') return null
  const e = event as Record<string, unknown>
  if (e.type !== 'content_block_delta') return null
  const delta = e.delta
  if (delta === null || typeof delta !== 'object') return null
  const d = delta as Record<string, unknown>
  if (d.type !== 'text_delta' || typeof d.text !== 'string') return null
  return d.text
}

function isToolResultBlock(
  block: unknown,
): block is {
  type: 'tool_result'
  tool_use_id: string
  content?: unknown
  is_error?: boolean
} {
  if (block === null || typeof block !== 'object') return false
  const b = block as Record<string, unknown>
  return b.type === 'tool_result' && typeof b.tool_use_id === 'string'
}

function toolResultOutputString(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content
    .map((c) => {
      if (c === null || typeof c !== 'object') return ''
      const o = c as Record<string, unknown>
      return o.type === 'text' && typeof o.text === 'string' ? o.text : ''
    })
    .join('\n')
}

/** `APIUserMessagePlaceholder` is opaque at compile time; narrow to tool blocks. */
function userMessageContentBlocks(message: unknown): unknown[] | null {
  if (message === null || typeof message !== 'object') return null
  const content = (message as { content?: unknown }).content
  return Array.isArray(content) ? content : null
}

const userDeniedViaGrpc = {
  behavior: 'deny' as const,
  message: 'User denied via gRPC',
  decisionReason: { type: 'asyncAgent', reason: 'user_reply' } as const,
} satisfies PermissionDenyDecision

const PROTO_PATH = path.resolve(import.meta.dirname, '../proto/deimos.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
const deimosProto = protoDescriptor.deimos.v1

const MAX_SESSIONS = 1000

export class GrpcServer {
  private server: grpc.Server
  private sessions: Map<string, Message[]> = new Map()

  constructor() {
    this.server = new grpc.Server()
    this.server.addService(deimosProto.AgentService.service, {
      Chat: this.handleChat.bind(this),
    })
  }

  start(port: number = 50051, host: string = 'localhost') {
    this.server.bindAsync(
      `${host}:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, boundPort) => {
        if (error) {
          // Avoid logging `error` — may include paths or host details (clear-text logging).
          console.error('Failed to start gRPC server')
          return
        }
        console.log(`gRPC Server running at ${host}:${boundPort}`)
      }
    )
  }

  private handleChat(call: grpc.ServerDuplexStream<GrpcClientMessage, Record<string, unknown>>) {
    let engine: QueryEngine | null = null
    let appState: AppState = getDefaultAppState()
    const fileCache: FileStateCache = new FileStateCache(READ_FILE_STATE_CACHE_SIZE, 25 * 1024 * 1024)

    // To handle ActionRequired (ask user for permission)
    const pendingRequests = new Map<string, (reply: string) => void>()

    // Accumulated messages from previous turns for multi-turn context
    let previousMessages: Message[] = []
    let sessionId = ''
    let interrupted = false

    call.on('data', async (clientMessage) => {
      try {
        if (clientMessage.request) {
          if (engine) {
            call.write({
              error: {
                message: 'A request is already in progress on this stream',
                code: 'ALREADY_EXISTS'
              }
            })
            return
          }
          interrupted = false
          const req = clientMessage.request
          sessionId = req.session_id || ''
          previousMessages = []

          // Load previous messages from session store (cross-stream persistence)
          if (sessionId && this.sessions.has(sessionId)) {
            previousMessages = [...this.sessions.get(sessionId)!]
          }

          const toolNameById = new Map<string, string>()

          engine = new QueryEngine({
            cwd: req.working_directory || process.cwd(),
            tools: getTools(appState.toolPermissionContext), // Gets all available tools
            commands: [], // Slash commands
            mcpClients: [],
            agents: [],
            ...(previousMessages.length > 0 ? { initialMessages: previousMessages } : {}),
            includePartialMessages: true,
            canUseTool: async (tool, input, context, assistantMsg, toolUseID) => {
              if (toolUseID) {
                toolNameById.set(toolUseID, tool.name)
              }
              // Notify client of the tool call first
              call.write({
                tool_start: {
                  tool_name: tool.name,
                  arguments_json: JSON.stringify(input),
                  tool_use_id: toolUseID
                }
              })

              // Ask user for permission
              const promptId = randomUUID()
              const question = `Approve ${tool.name}?`
              call.write({
                action_required: {
                  prompt_id: promptId,
                  question,
                  type: 'CONFIRM_COMMAND'
                }
              })

              return new Promise<PermissionAllowDecision | PermissionDenyDecision>((resolve) => {
                pendingRequests.set(promptId, (reply) => {
                  if (reply.toLowerCase() === 'yes' || reply.toLowerCase() === 'y') {
                    resolve({ behavior: 'allow' } satisfies PermissionAllowDecision)
                  } else {
                    resolve(userDeniedViaGrpc)
                  }
                })
              })
            },
            getAppState: () => appState,
            setAppState: (updater) => { appState = updater(appState) },
            readFileCache: fileCache,
            userSpecifiedModel: req.model,
            fallbackModel: req.model,
          })

          // Track accumulated response data for FinalResponse
          let fullText = ''
          let promptTokens = 0
          let completionTokens = 0

          const generator = engine.submitMessage(req.message ?? '')

          for await (const msg of generator) {
            if (msg.type === 'stream_event') {
              const deltaText = textFromStreamEvent(msg.event)
              if (deltaText !== null) {
                call.write({
                  text_chunk: {
                    text: deltaText,
                  },
                })
                fullText += deltaText
              }
            } else if (msg.type === 'user') {
              // Extract tool results
              const blocks = userMessageContentBlocks(msg.message)
              if (blocks) {
                for (const block of blocks) {
                  if (!isToolResultBlock(block)) continue
                  const outputStr = toolResultOutputString(block.content)
                  call.write({
                    tool_result: {
                      tool_name: toolNameById.get(block.tool_use_id) ?? block.tool_use_id,
                      tool_use_id: block.tool_use_id,
                      output: outputStr,
                      is_error: block.is_error ?? false,
                    },
                  })
                }
              }
            } else if (msg.type === 'result' && msg.subtype === 'success') {
              // Extract real token counts and final text from the result
              if (msg.result) {
                fullText = msg.result
              }
              const usage = msg.usage
              if (isNonNullableUsage(usage)) {
                promptTokens = usage.input_tokens
                completionTokens = usage.output_tokens
              }
            }
          }

          if (!interrupted) {
            // Save messages for multi-turn context in subsequent requests
            previousMessages = [...engine.getMessages()]

            // Persist to session store for cross-stream resumption
            if (sessionId) {
              if (!this.sessions.has(sessionId) && this.sessions.size >= MAX_SESSIONS) {
                // Evict oldest session (Map preserves insertion order)
                const oldest = this.sessions.keys().next().value
                if (oldest !== undefined) {
                  this.sessions.delete(oldest)
                }
              }
              this.sessions.set(sessionId, previousMessages)
            }

            call.write({
              done: {
                full_text: fullText,
                prompt_tokens: promptTokens,
                completion_tokens: completionTokens
              }
            })
          }

          engine = null

        } else if (clientMessage.input) {
          const promptId = clientMessage.input.prompt_id
          const reply = clientMessage.input.reply
          if (
            typeof promptId === 'string' &&
            typeof reply === 'string' &&
            pendingRequests.has(promptId)
          ) {
            pendingRequests.get(promptId)!(reply)
            pendingRequests.delete(promptId)
          }
        } else if (clientMessage.cancel) {
          interrupted = true
          if (engine) {
            engine.interrupt()
          }
          call.end()
        }
      } catch {
        // Do not log or forward the caught value — .message / stack can include OAuth tokens,
        // API keys, or paths (CodeQL js/clear-text-logging).
        console.error('Error processing gRPC chat stream')
        call.write({
          error: {
            message: 'Internal server error',
            code: 'INTERNAL',
          },
        })
        call.end()
      }
    })

    call.on('end', () => {
      interrupted = true
      // Unblock any pending permission prompts so canUseTool can return
      for (const resolve of pendingRequests.values()) {
        resolve('no')
      }
      if (engine) {
        engine.interrupt()
      }
      engine = null
      pendingRequests.clear()
    })
  }
}
