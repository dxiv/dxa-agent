import fs from 'node:fs/promises'
import path from 'node:path'

const REPO_ROOT = path.resolve(process.cwd())

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.turbo',
  '.next',
  '.bun',
])

const SKIP_FILES = new Set([
  'bun.lock',
  'bun.lockb',
])

const replacements = [
  ['https://github.com/dxiv/dxa-deimos', 'https://github.com/dxiv/dxa-deimos'],
  ['https://github.com/dxiv/dxa-deimos', 'https://github.com/dxiv/dxa-deimos'],
  ['github.com/dxiv/dxa-deimos', 'github.com/dxiv/dxa-deimos'],
  ['github.com/dxiv/dxa-deimos', 'github.com/dxiv/dxa-deimos'],
  ['https://github.com/dxiv/dxa-deimos', 'https://github.com/dxiv/dxa-deimos'],
  ['github.com/dxiv/dxa-deimos', 'github.com/dxiv/dxa-deimos'],
  ['https://github.com/dxiv/dxa-deimos', 'https://github.com/dxiv/dxa-deimos'],
  ['github.com/dxiv/dxa-deimos', 'github.com/dxiv/dxa-deimos'],
]

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name)
}

function looksBinary(buf) {
  // Heuristic: presence of NUL byte
  return buf.includes(0)
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const ent of entries) {
    const abs = path.join(dir, ent.name)
    const rel = path.relative(REPO_ROOT, abs)

    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue
      await walk(abs)
      continue
    }

    if (!ent.isFile()) continue
    if (SKIP_FILES.has(ent.name)) continue

    let buf
    try {
      buf = await fs.readFile(abs)
    } catch {
      continue
    }

    if (looksBinary(buf)) continue

    const text = buf.toString('utf8')
    let next = text
    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
    }
    if (next !== text) {
      await fs.writeFile(abs, next, 'utf8')
      process.stdout.write(`updated ${rel}\n`)
    }
  }
}

await walk(REPO_ROOT)

