import type { AppState } from '../../state/AppState.js'
import type { AgentId } from '../../types/ids.js'
import type { SetAppState, TaskStateBase } from '../../Task.js'

export type MonitorMcpTaskState = TaskStateBase & {
  type: 'monitor_mcp'
  isBackgrounded?: boolean
}

export function killMonitorMcp(_taskId: string, _setAppState: SetAppState): void {}

export function killMonitorMcpTasksForAgent(
  _agentId: AgentId,
  _getAppState: () => AppState,
  _setAppState: SetAppState,
): void {}
