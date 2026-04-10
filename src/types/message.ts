/**
 * Internal transcript / UI message types (user, assistant, system, progress, etc.).
 */
import type {
  BetaContentBlock,
  BetaMessage,
  BetaToolUseBlock,
} from '@anthropic-ai/sdk/resources/beta/messages/messages.mjs'
import type { APIError } from '@anthropic-ai/sdk'
import type {
  ContentBlockParam,
  ToolResultBlockParam,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources/index.mjs'
import type { UUID } from 'crypto'
import type { SDKAssistantMessageError } from '../entrypoints/sdk/coreTypes.js'
import type { PermissionMode } from './permissions.js'

export type MessageOrigin =
  | { kind: 'task-notification' }
  | { kind: string; [key: string]: unknown }

export type PartialCompactDirection = 'from' | 'up_to'

export type SystemMessageLevel = 'info' | 'warning' | 'error'

export type AssistantMessage = {
  type: 'assistant'
  uuid: UUID
  timestamp: string
  message: BetaMessage
  requestId?: string
  isMeta?: boolean
  isVirtual?: true
  isApiErrorMessage?: boolean
  apiError?: unknown
  error?: SDKAssistantMessageError
  errorDetails?: string
  /**
   * When `message` text is exactly PROMPT_TOO_LONG_ERROR_MESSAGE, distinguishes
   * client-side send blocking vs API rejection for UI copy only.
   */
  promptTooLongSource?: 'client' | 'api'
  advisorModel?: string
  /** Internal (ant): research payload from streaming when present. */
  research?: unknown
}

export type UserMessage = {
  type: 'user'
  uuid: UUID
  timestamp: string
  message: {
    role: 'user'
    content: string | ContentBlockParam[]
  }
  isMeta?: true
  isVisibleInTranscriptOnly?: true
  isVirtual?: true
  isCompactSummary?: true
  toolUseResult?: unknown
  mcpMeta?: {
    _meta?: Record<string, unknown>
    structuredContent?: Record<string, unknown>
  }
  imagePasteIds?: number[]
  sourceToolAssistantUUID?: UUID
  permissionMode?: PermissionMode
  summarizeMetadata?: {
    messagesSummarized: number
    userContext?: string
    direction?: PartialCompactDirection
  }
  origin?: MessageOrigin
  sourceToolUseID?: string
  /** Set during clear-context-and-implement flow when ExitPlanMode is approved. */
  planContent?: string
}

export type NormalizedAssistantMessage<T extends BetaContentBlock = BetaContentBlock> =
  Omit<AssistantMessage, 'message'> & {
    message: BetaMessage & { content: [T] }
  }

export type NormalizedUserMessage = Omit<UserMessage, 'message'> & {
  message: {
    role: 'user'
    content: [ContentBlockParam] | ContentBlockParam[]
  }
}

export type NormalizedMessage =
  | NormalizedUserMessage
  | NormalizedAssistantMessage
  | AttachmentMessage
  | SystemMessage
  | ProgressMessage

export type GroupedToolUseMessage = {
  type: 'grouped_tool_use'
  toolName: string
  messages: NormalizedAssistantMessage[]
  results: NormalizedUserMessage[]
  displayMessage: NormalizedAssistantMessage
  uuid: string
  timestamp: string
  messageId: string
}

export type CollapsedReadSearchGroup = {
  type: 'collapsed_read_search'
  searchCount: number
  readCount: number
  listCount: number
  replCount: number
  memorySearchCount: number
  memoryReadCount: number
  memoryWriteCount: number
  readFilePaths: string[]
  searchArgs: unknown[]
  latestDisplayHint?: string
  messages: CollapsibleMessage[]
  displayMessage: CollapsibleMessage
  uuid: string
  timestamp: string
  teamMemorySearchCount?: number
  teamMemoryReadCount?: number
  teamMemoryWriteCount?: number
  mcpCallCount?: number
  mcpServerNames?: string[]
  bashCount?: number
  gitOpBashCount?: number
  commits?: unknown[]
  pushes?: unknown[]
  branches?: unknown[]
  prs?: unknown[]
  hookTotalMs?: number
  hookCount?: number
  hookInfos?: StopHookInfo[]
  relevantMemories?: { path: string; content: string; mtimeMs: number }[]
}

export type CollapsibleMessage =
  | NormalizedAssistantMessage
  | NormalizedUserMessage
  | GroupedToolUseMessage

type SystemMessageBase = {
  type: 'system'
  uuid: UUID
  timestamp: string
  level?: SystemMessageLevel
}

export type SystemInformationalMessage = SystemMessageBase & {
  subtype: 'informational'
  content: string
}

export type SystemStopHookSummaryMessage = SystemMessageBase & {
  subtype: 'stop_hook_summary'
  hookCount: number
  hookInfos: StopHookInfo[]
  hookErrors: string[]
  hookLabel?: string
  preventedContinuation?: boolean
  stopReason?: string
  hasOutput?: boolean
  totalDurationMs?: number
  toolUseID?: string
}

export type SystemBridgeStatusMessage = SystemMessageBase & {
  subtype: 'bridge_status'
  content: string
}

export type SystemTurnDurationMessage = SystemMessageBase & {
  subtype: 'turn_duration'
  content: string
}

export type SystemThinkingMessage = SystemMessageBase & {
  subtype: 'thinking'
  content: string
}

export type SystemMemorySavedMessage = SystemMessageBase & {
  subtype: 'memory_saved'
  content: string
}

export type SystemStopHookSummaryMessageLoose = SystemStopHookSummaryMessage

export type SystemCompactBoundaryMessage = SystemMessageBase & {
  subtype: 'compact_boundary'
  compact_metadata?: CompactMetadata
}

export type SystemMicrocompactBoundaryMessage = SystemMessageBase & {
  subtype: 'microcompact_boundary'
}

export type SystemPermissionRetryMessage = SystemMessageBase & {
  subtype: 'permission_retry'
}

export type SystemScheduledTaskFireMessage = SystemMessageBase & {
  subtype: 'scheduled_task_fire'
}

export type SystemAPIErrorMessage = SystemMessageBase & {
  subtype: 'api_error'
  level?: 'error'
  cause?: Error
  error: APIError
  retryInMs: number
  retryAttempt: number
  maxRetries: number
}

export type SystemAwaySummaryMessage = SystemMessageBase & {
  subtype: 'away_summary'
}

export type SystemAgentsKilledMessage = SystemMessageBase & {
  subtype: 'agents_killed'
}

export type SystemApiMetricsMessage = SystemMessageBase & {
  subtype: 'api_metrics'
}

export type SystemLocalCommandMessage = SystemMessageBase & {
  subtype: 'local_command'
}

export type SystemMessage =
  | SystemInformationalMessage
  | SystemStopHookSummaryMessage
  | SystemBridgeStatusMessage
  | SystemTurnDurationMessage
  | SystemThinkingMessage
  | SystemMemorySavedMessage
  | SystemCompactBoundaryMessage
  | SystemMicrocompactBoundaryMessage
  | SystemPermissionRetryMessage
  | SystemScheduledTaskFireMessage
  | SystemAPIErrorMessage
  | SystemAwaySummaryMessage
  | SystemAgentsKilledMessage
  | SystemApiMetricsMessage
  | SystemLocalCommandMessage
  | SystemFileSnapshotMessage

export type AttachmentMessage = {
  type: 'attachment'
  uuid: UUID
  timestamp: string
  /** Runtime shape is `Attachment` from `utils/attachments.ts` (kept loose here to avoid import cycles). */
  attachment: unknown
}

export type ProgressMessage<T = unknown> = {
  type: 'progress'
  uuid: UUID
  timestamp: string
  toolUseID: string
  parentToolUseID: string
  data: T
}

export type TombstoneMessage = {
  type: 'tombstone'
  /** Mirrors the inner message id so bridge/flush paths can key tombstones like other messages. */
  uuid: UUID
  message: Message
}

export type ToolUseSummaryMessage = {
  type: 'tool_use_summary'
  summary: string
  preceding_tool_use_ids: string[]
  uuid: UUID
  timestamp: string
}

export type StreamEvent = {
  type: 'stream_event'
  event: unknown
  ttftMs?: number
}

export type RequestStartEvent = {
  type: 'stream_request_start'
}

export type StopHookInfo = {
  command: string
  promptText?: string
  durationMs?: number
}

export type CompactMetadata = {
  trigger: 'manual' | 'auto'
  pre_tokens: number
  preserved_segment?: {
    head_uuid: string
    anchor_uuid: string
    tail_uuid: string
  }
  /** Snapshot of tool names discovered before compact (tool_search / deferred tools). */
  preCompactDiscoveredTools?: string[]
}

export type SystemFileSnapshotMessage = SystemMessageBase & {
  subtype: 'file_snapshot'
  content: string
  isMeta?: boolean
  snapshotFiles: Array<{
    key: string
    path: string
    content: string
  }>
}

export type HookResultMessage = Message

/**
 * Transcript / persisted messages. Stream control types (`StreamEvent`,
 * `RequestStartEvent`, `ToolUseSummaryMessage`) are handled alongside these in
 * `handleMessageFromStream` but are not part of the persisted `Message` union.
 */
export type Message =
  | AttachmentMessage
  | AssistantMessage
  | ProgressMessage
  | SystemMessage
  | UserMessage
  | TombstoneMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup

export type RenderableMessage =
  | NormalizedAssistantMessage
  | NormalizedUserMessage
  | GroupedToolUseMessage
  | CollapsedReadSearchGroup
  | AttachmentMessage
  | ProgressMessage
  | SystemMessage
  | SystemMessage
