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

const SKIP_FILES = new Set(['bun.lock', 'bun.lockb'])

const replacements = [
  ['Usage: claude ', 'Usage: deimos '],
  ['Usage: claude', 'Usage: deimos'],
  ['Run claude ', 'Run deimos '],
  ['Run `claude', 'Run `deimos'],
  ['run `claude', 'run `deimos'],
  ['`claude --', '`deimos --'],
  ['claude --', 'deimos --'],
  ['claude -p', 'deimos -p'],
  ['claude ssh', 'deimos ssh'],
  ['claude assistant', 'deimos assistant'],
  ['claude remote-control', 'deimos remote-control'],
  ['claude mcp', 'deimos mcp'],
  ['claude update', 'deimos /upgrade'],
  ['claude install', 'deimos install'],
  ['claude --debug', 'deimos --debug'],
]

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name)
}

function looksBinary(buf) {
  return buf.includes(0)
}

function shouldSkipText(text) {
  // Keep server-defined routes/ids and model IDs
  if (text.includes('claude_cli')) return true
  if (/\bclaude-(opus|sonnet|haiku)\b/i.test(text)) return true
  if (/\bclaude-cli:\/\//i.test(text)) return true
  // Keep migration paths and config dirs
  if (text.includes('~/.claude') || text.includes('\\.claude') || text.includes('/.claude')) return true
  // Keep external package names
  if (text.includes('@ant/claude-for-chrome-mcp')) return true
  return false
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
    if (!/\bclaude\b/i.test(text)) continue
    if (shouldSkipText(text)) continue

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

