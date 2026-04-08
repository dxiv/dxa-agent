import type { TerminalQuerier } from '../ink/terminal-querier.js'
import type { SystemTheme } from './systemTheme.js'

/**
 * Subscribe to live terminal background (OSC 11) changes for 'auto' theme.
 * Stub: no-op until OSC polling is implemented; returns unsubscribe for symmetry.
 */
export function watchSystemTheme(
  _querier: TerminalQuerier,
  _onTheme: (theme: SystemTheme) => void
): () => void {
  return () => {}
}
