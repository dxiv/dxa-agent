/**
 * User-Agent string helpers.
 *
 * Kept dependency-free so SDK-bundled code (bridge, cli/transports) can
 * import without pulling in auth.ts and its transitive dependency tree.
 *
 * `bun test` loads TS without build defines — use `--preload ./scripts/test-macro-shim.ts`
 * so `globalThis.MACRO` exists before modules that read version strings load.
 */

export function getDeimosVersionString(): string {
  const G = globalThis as typeof globalThis & {
    MACRO?: { VERSION: string; DISPLAY_VERSION?: string }
  }
  if (G.MACRO) {
    return G.MACRO.DISPLAY_VERSION ?? G.MACRO.VERSION
  }
  return MACRO.DISPLAY_VERSION ?? MACRO.VERSION
}

/** Primary product token for HTTP User-Agent headers (Deimos branding). */
export function getDeimosUserAgent(): string {
  return `deimos/${getDeimosVersionString()}`
}
