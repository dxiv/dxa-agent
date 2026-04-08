/**
 * Parses `.tsc-errors.log` for TS2307 missing relative modules and writes
 * minimal `export {}` stubs so `tsc --noEmit` can resolve imports.
 * Re-run after `bun run typecheck *> .tsc-errors.log` (or redirect stderr too).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const root = join(scriptDir, '..')
const logPath = join(root, process.argv[2] ?? 'tsc-errors-utf8.txt')
const log = readFileSync(logPath, 'utf8')
const lineRe =
  /^(src\/[^\s(]+)\(\d+,\d+\): error TS2307: Cannot find module '([^']+)'/gm

const stubContent = `// Auto-generated stub — replace with real implementation.\nexport {}\n`

const toCreate = new Set<string>()

let m: RegExpExecArray | null
while ((m = lineRe.exec(log))) {
  const fromFile = m[1]!
  const spec = m[2]!
  if (spec.endsWith('.md') || spec.endsWith('.json') || spec.endsWith('.css')) {
    continue
  }
  if (spec.startsWith('src/')) {
    const tsPath = join(root, spec.replace(/\.js$/, '.ts'))
    toCreate.add(tsPath)
    continue
  }
  if (!spec.startsWith('.')) continue
  const fromPath = join(root, fromFile)
  const base = dirname(fromPath)
  const resolved = resolve(base, spec)
  const normalized = resolved.replace(/\\/g, '/')
  const rootNorm = root.replace(/\\/g, '/')
  if (!normalized.startsWith(rootNorm)) continue
  const relFromSrc = normalized.slice(rootNorm.length + 1)
  if (!relFromSrc.startsWith('src/')) continue
  const tsPath = normalized.replace(/\.js$/, '.ts')
  toCreate.add(tsPath)
}

let n = 0
for (const path of toCreate) {
  if (existsSync(path)) continue
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, stubContent)
  n++
  console.log('wrote', path.slice(root.length + 1))
}
console.log(`Done: ${n} new stubs (${toCreate.size} unique targets).`)
