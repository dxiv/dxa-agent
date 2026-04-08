// Stub — contextCollapse not included in source snapshot (feature-gated)

export type ContextCollapseHealthStats = {
  totalSpawns: number
  totalErrors: number
  lastError?: string
  emptySpawnWarningEmitted: boolean
  totalEmptySpawns: number
}

export type ContextCollapseStats = {
  collapsedSpans: number
  collapsedMessages: number
  stagedSpans: number
  health: ContextCollapseHealthStats
}

const emptyStats: ContextCollapseStats = {
  collapsedSpans: 0,
  collapsedMessages: 0,
  stagedSpans: 0,
  health: {
    totalSpawns: 0,
    totalErrors: 0,
    lastError: undefined,
    emptySpawnWarningEmitted: false,
    totalEmptySpawns: 0,
  },
}

export function getStats(): ContextCollapseStats {
  return emptyStats
}

/** No-op store subscription for stub stats (UI stays static until real impl). */
export function subscribe(_onStoreChange: () => void): () => void {
  return () => {}
}

export function isContextCollapseEnabled(): boolean {
  return false
}

export function getContextCollapseState() {
  return null
}

export function initContextCollapse(): void {}

export function resetContextCollapse(): void {}
