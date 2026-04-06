/**
 * Optional worktree hook installer for commit attribution (COMMIT_ATTRIBUTION).
 * Loaded dynamically from worktree.ts so missing implementation does not break the bundle.
 */
export async function installPrepareCommitMsgHook(
  _worktreePath: string,
  _worktreeHooksDir: string | undefined,
): Promise<void> {
  // No-op default; replace with hook wiring when attribution is enabled for worktrees.
}
