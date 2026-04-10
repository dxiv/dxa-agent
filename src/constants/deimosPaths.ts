/**
 * Canonical on-disk paths for Deimos (no legacy Deimos paths).
 */

/** Project-local config: settings, skills, agents, hooks, … */
export const DEIMOS_PROJECT_DIR = '.deimos'

/** Manifest folder inside a cached plugin directory */
export const DEIMOS_PLUGIN_MANIFEST_DIR = '.deimos-plugin'

/** Loaded into every session (project root or under DEIMOS_PROJECT_DIR) */
export const DEIMOS_MEMORY_FILENAME = 'DEIMOS.md'

/** Personal overrides; typically gitignored */
export const DEIMOS_LOCAL_MEMORY_FILENAME = 'DEIMOS.local.md'
