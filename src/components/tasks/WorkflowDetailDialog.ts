import type { ReactNode } from 'react'
import type { LocalWorkflowTaskState } from 'src/tasks/LocalWorkflowTask/LocalWorkflowTask.js'
import type { CommandResultDisplay } from '../../commands.js'

type OnDone = (
  result?: string,
  options?: { display?: CommandResultDisplay },
) => void

export function WorkflowDetailDialog(_props: {
  workflow: LocalWorkflowTaskState
  onDone: OnDone
  onKill?: () => void
  onSkipAgent?: (agentId: string) => void
  onRetryAgent?: (agentId: string) => void
  onBack: () => void
}): ReactNode {
  return null
}
