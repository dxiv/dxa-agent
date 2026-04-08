/**
 * Preload for `bun test`: defines globalThis.MACRO so source files that read
 * MACRO.* (normally inlined by `bun run build`) work under raw TypeScript tests.
 *
 * Usage: bun test --preload ./scripts/test-macro-shim.ts
 */
import '../src/utils/deimosEnvAliases.js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
  version?: string
  name?: string
}

;(globalThis as typeof globalThis & { MACRO: Record<string, unknown> }).MACRO = {
  VERSION: '99.0.0',
  DISPLAY_VERSION: pkg.version ?? '0.0.0',
  BUILD_TIME: new Date().toISOString(),
  ISSUES_EXPLAINER: 'https://github.com/dxiv/dxa-deimos/issues',
  FEEDBACK_CHANNEL: 'https://github.com/dxiv/dxa-deimos/issues',
  PACKAGE_URL: pkg.name ?? '@dxa-dev/deimos',
  NATIVE_PACKAGE_URL: undefined,
}
