/**
 * Tool progress payload types (serializable UI / SDK). Kept broad so callers can
 * evolve shapes without tight coupling across tools.
 */
export type AgentToolProgress = unknown
/** Shell tool progress payload (Bash / PowerShell); matches ShellProgressMessage props. */
export type BashProgress = {
  output: string
  fullOutput: string
  elapsedTimeSeconds: number
  totalLines: number
  totalBytes?: number
  taskId?: string
  timeoutMs?: number
}
export type MCPProgress = unknown
export type REPLToolProgress = unknown
export type SkillToolProgress = unknown
export type TaskOutputProgress = unknown
export type ToolProgressData = unknown
export type WebSearchProgress = unknown
export type ShellProgress = unknown
export type SdkWorkflowProgress = unknown
export type PowerShellProgress = BashProgress
