#!/usr/bin/env node

/**
 * deimos CLI — https://github.com/dxiv/dxa-deimos/
 *
 * If dist/cli.mjs exists (built), run that.
 * Otherwise, tell the user to build first or use `bun run dev`.
 */

import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '..', 'dist', 'cli.mjs')

if (existsSync(distPath)) {
  await import(pathToFileURL(distPath).href)
} else {
  console.error(`
  deimos: dist/cli.mjs not found.

  From a clone of this repo, in the project root:
    bun install
    bun run build

  Or without a separate build step:
    bun run dev

  Published installs (npm i -g @dxa-deimos/cli) already include dist/.
  See README.md and docs/setup-checklist.md.
`)
  process.exit(1)
}
