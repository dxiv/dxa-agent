import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { z } from 'zod/v4'
import type { SDKResultMessage } from './coreTypes.js'

/** @internal */
export type AnyZodRawShape = z.ZodRawShape

/** @internal */
export type InferShape<S extends AnyZodRawShape> = z.infer<z.ZodObject<S>>

export type SdkMcpToolDefinition<Schema extends AnyZodRawShape> = {
  name: string
  description: string
  inputSchema: z.ZodObject<Schema>
  call: (args: InferShape<Schema>, extra: unknown) => Promise<CallToolResult>
}

export type McpSdkServerConfigWithInstance = {
  name: string
  version?: string
  instance?: unknown
}

export type Options = Record<string, unknown>
export type InternalOptions = Options

export type Query = AsyncIterable<unknown>
export type InternalQuery = Query

export type SDKSession = {
  id: string
}

export type SDKSessionOptions = Record<string, unknown>

export type ListSessionsOptions = {
  dir?: string
  limit?: number
  offset?: number
}

export type GetSessionInfoOptions = { dir?: string }

export type GetSessionMessagesOptions = {
  dir?: string
  limit?: number
  offset?: number
  includeSystemMessages?: boolean
}

export type SessionMutationOptions = { dir?: string }

export type ForkSessionOptions = {
  dir?: string
  upToMessageId?: string
  title?: string
}

export type ForkSessionResult = { sessionId: string }

export type SessionMessage = SDKResultMessage | Record<string, unknown>
