import { isEnvTruthy } from './envUtils.js'

const BEL = '\x07'

function shouldSetTitle(): boolean {
  return (
    !process.env.CI &&
    process.stdout.isTTY &&
    !isEnvTruthy(process.env.DEIMOS_DISABLE_TERMINAL_TITLE)
  )
}

/** Tab/window title: `process.title` plus OSC 0 (Windows Terminal honors both). */
export function setTerminalTitleImmediate(title: string): void {
  if (!shouldSetTitle()) return
  process.title = title
  process.stdout.write(`\x1b]0;${title}${BEL}`)
}

/**
 * Non-blocking typewriter before `main.js` loads — `preAction` runs too late
 * (after a large import), so the tab could stay on the shell default ("claude").
 */
export function startTerminalTitleTypewriter(
  full: string,
  options?: { charDelayMs?: number },
): void {
  if (!shouldSetTitle()) return
  const charDelayMs = options?.charDelayMs ?? 72
  let i = 0
  const step = () => {
    i++
    if (i > full.length) return
    const slice = full.slice(0, i)
    process.title = slice
    process.stdout.write(`\x1b]0;${slice}${BEL}`)
    if (i < full.length) setTimeout(step, charDelayMs)
  }
  step()
}
