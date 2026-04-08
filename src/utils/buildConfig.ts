/**
 * Deimos build-time constants.
 *
 * These replace process.env checks that were only meaningful in the upstream
 * internal build. In Deimos all such gates are permanently disabled so
 * external users cannot activate internal code paths by setting env vars.
 */

/**
 * Compile-time hinge for upstream ant-only branches (always false in open builds).
 * Use instead of the raw `"external" === 'ant'` hinge so TypeScript accepts the comparison
 * while bundlers can still dead-code eliminate ant-only paths.
 */
export const IS_ANT_BUILD = ('external' as string) === 'ant'

/**
 * Hinges for skipping auto-updater / dev-only UI when NODE_ENV is not production.
 */
export const IS_NODE_ENV_TEST_OR_DEV =
  ('production' as string) === 'test' || ('production' as string) === 'development'

/**
 * Always false in Deimos.
 * Replaces all `process.env.USER_TYPE === 'ant'` checks so that no external
 * user can activate internal-only features (commit attribution hooks,
 * system-prompt section clearing, dangerously-skip-permissions bypass, etc.)
 * by setting USER_TYPE in their shell environment.
 */
export function isAntEmployee(): boolean {
  return false
}
