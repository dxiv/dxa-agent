/**
 * Maps `DEIMOS_*` process.env keys to internal provider keys when unset,
 * so documentation can standardize on the `DEIMOS_*` prefix. The internal key
 * is only set when the user has not already set it explicitly.
 */
const DEIMOS_ENV_NO_ALIAS = new Set([
  'DEIMOS_CONFIG_DIR',
  'DEIMOS_USE_READABLE_STDIN',
])

export function applyDeimosEnvAliases(): void {
  const env = process.env
  for (const key of Object.keys(env)) {
    if (!key.startsWith('DEIMOS_') || DEIMOS_ENV_NO_ALIAS.has(key)) continue
    const suffix = key.slice('DEIMOS_'.length)
    if (!suffix) continue
    const legacy = `CLAUDE_CODE_${suffix}`
    if (env[legacy] === undefined && env[key] !== undefined) {
      env[legacy] = env[key]
    }
  }
}

applyDeimosEnvAliases()
