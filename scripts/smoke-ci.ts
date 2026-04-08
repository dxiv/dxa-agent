/**
 * CI-safe smoke: built CLI must respond to --version and --help without hanging.
 * Runs non-interactively (stdio piped); does not print env or secrets.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const cli = join(root, 'dist', 'cli.mjs')

function runCli(
  args: string[],
  timeoutMs: number,
): Promise<{ code: number | null; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd: root,
      env: {
        ...process.env,
        CI: '1',
        FORCE_COLOR: '0',
        NO_COLOR: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      reject(
        new Error(
          `smoke-ci: timeout after ${timeoutMs}ms (node dist/cli.mjs ${args.join(' ')})`,
        ),
      )
    }, timeoutMs)

    let stderr = ''
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk
    })
    child.stdout?.resume()

    child.on('error', err => {
      clearTimeout(timer)
      reject(err)
    })
    child.on('close', code => {
      clearTimeout(timer)
      resolve({ code, stderr })
    })
  })
}

async function main(): Promise<void> {
  if (!existsSync(cli)) {
    console.error('smoke-ci: dist/cli.mjs missing. Run bun run build first.')
    process.exit(1)
  }

  const v = await runCli(['--version'], 15_000)
  if (v.code !== 0) {
    console.error(
      `smoke-ci: --version exited ${v.code}${v.stderr ? `\n${v.stderr}` : ''}`,
    )
    process.exit(1)
  }

  const h = await runCli(['--help'], 45_000)
  if (h.code !== 0) {
    console.error(
      `smoke-ci: --help exited ${h.code}${h.stderr ? `\n${h.stderr}` : ''}`,
    )
    process.exit(1)
  }

  console.log('smoke-ci: ok (--version and --help)')
}

main().catch(e => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
