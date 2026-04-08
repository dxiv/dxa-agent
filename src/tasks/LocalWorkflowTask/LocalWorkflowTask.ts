import type { SetAppState, TaskStateBase } from '../../Task.js'

export type LocalWorkflowTaskState = TaskStateBase & {
  type: 'local_workflow'
  workflowName?: string
  summary?: string
  agentCount: number
  isBackgrounded?: boolean
}

export function killWorkflowTask(_taskId: string, _setAppState: SetAppState): void {}
export function skipWorkflowAgent(
  _taskId: string,
  _agentId: string,
  _setAppState: SetAppState,
): void {}
export function retryWorkflowAgent(
  _taskId: string,
  _agentId: string,
  _setAppState: SetAppState,
): void {}
