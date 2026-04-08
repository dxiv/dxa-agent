import type { ReactNode } from 'react'
import type { MonitorMcpTaskState } from 'src/tasks/MonitorMcpTask/MonitorMcpTask.js'

export function MonitorMcpDetailDialog(_props: {
  task: MonitorMcpTaskState
  onKill?: () => void
  onBack: () => void
}): ReactNode {
  return null
}
