// Stub — full cached microcompact implementation not in source snapshot

export type CacheEditsBlock = Record<string, unknown>

export type PinnedCacheEdits = {
  userMessageIndex: number
  block: CacheEditsBlock
}

export type CachedMCState = {
  registeredTools: Set<string>
  toolOrder: string[]
  deletedRefs: Set<string>
  pinnedEdits: PinnedCacheEdits[]
}

export function createCachedMCState(): CachedMCState {
  return {
    registeredTools: new Set(),
    toolOrder: [],
    deletedRefs: new Set(),
    pinnedEdits: [],
  }
}

export function registerToolResult(state: CachedMCState, toolUseId: string): void {
  state.registeredTools.add(toolUseId)
}

export function registerToolMessage(state: CachedMCState, groupIds: string[]): void {
  for (const id of groupIds) {
    state.toolOrder.push(id)
  }
}

export function getToolResultsToDelete(_state: CachedMCState): string[] {
  return []
}

export function createCacheEditsBlock(
  _state: CachedMCState,
  _toolIds: string[],
): CacheEditsBlock | null {
  return null
}

export function markToolsSentToAPI(_state: CachedMCState): void {}

export function resetCachedMCState(state: CachedMCState): void {
  state.registeredTools.clear()
  state.toolOrder.length = 0
  state.deletedRefs.clear()
  state.pinnedEdits.length = 0
}

export function getCachedMCConfig(): {
  triggerThreshold: number
  keepRecent: number
} {
  return { triggerThreshold: 0, keepRecent: 0 }
}

export function isCachedMicrocompactEnabled(): boolean {
  return false
}

export function isModelSupportedForCacheEditing(_model: string): boolean {
  return false
}
