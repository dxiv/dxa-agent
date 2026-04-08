import { useContext, useEffect } from 'react'
import stripAnsi from 'strip-ansi'
import { OSC, osc } from '../termio/osc.js'
import { TerminalWriteContext } from '../useTerminalNotification.js'

/**
 * Declaratively set the terminal tab/window title.
 *
 * Pass a string to set the title. ANSI escape sequences are stripped
 * automatically so callers don't need to know about terminal encoding.
 * Pass `null` to opt out — the hook becomes a no-op and leaves the
 * terminal title untouched.
 *
 * Windows: `process.title` (conhost) plus OSC 0 via Ink (Windows Terminal uses
 * the sequence for the tab title). Other platforms: OSC 0 only.
 */
export function useTerminalTitle(title: string | null): void {
  const writeRaw = useContext(TerminalWriteContext)

  useEffect(() => {
    if (title === null || !writeRaw) return

    const clean = stripAnsi(title)
    const seq = osc(OSC.SET_TITLE_AND_ICON, clean)

    if (process.platform === 'win32') {
      process.title = clean
      writeRaw(seq)
    } else {
      writeRaw(seq)
    }
  }, [title, writeRaw])
}
