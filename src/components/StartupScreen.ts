/**
 * Deimos startup screen — filled-block wordmark with blood-red gradient.
 * Called once at CLI startup before the Ink UI renders.
 *
 * Addresses: https://github.com/dxiv/dxa-deimos/issues/55
 */

declare const MACRO: { VERSION: string; DISPLAY_VERSION?: string }

const ESC = '\x1b['
const RESET = `${ESC}0m`
const DIM = `${ESC}2m`

type RGB = [number, number, number]
const rgb = (r: number, g: number, b: number) => `${ESC}38;2;${r};${g};${b}m`

function lerp(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

function gradAt(stops: RGB[], t: number): RGB {
  const c = Math.max(0, Math.min(1, t))
  const s = c * (stops.length - 1)
  const i = Math.floor(s)
  if (i >= stops.length - 1) return stops[stops.length - 1]
  return lerp(stops[i], stops[i + 1], s - i)
}

function paintLine(text: string, stops: RGB[], lineT: number): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const t = text.length > 1 ? lineT * 0.5 + (i / (text.length - 1)) * 0.5 : lineT
    const [r, g, b] = gradAt(stops, t)
    out += `${rgb(r, g, b)}${text[i]}`
  }
  return out + RESET
}

// ─── Colors ───────────────────────────────────────────────────────────────────

// deimos palette (blood red on charcoal).
const SUNSET_GRAD: RGB[] = [
  [255, 140, 140],
  [245, 95, 95],
  [225, 60, 60],
  [195, 40, 40],
  [160, 25, 25],
  [120, 15, 15],
]

const ACCENT: RGB = [255, 90, 90]
const CREAM: RGB = [225, 200, 200]
const DIMCOL: RGB = [125, 105, 105]

// ─── Filled block wordmark: DEIMOS (Mars’s inner moon; myth: Terror) ─────────

const LOGO_DEIMOS = [
  `  ██████╗ ███████╗██╗███╗   ███╗ ██████╗ ███████╗`,
  `  ██╔══██╗██╔════╝██║████╗ ████║██╔═══██╗██╔════╝`,
  `  ██║  ██║█████╗  ██║██╔████╔██║██║   ██║███████╗`,
  `  ██║  ██║██╔══╝  ██║██║╚██╔╝██║██║   ██║╚════██║`,
  `  ██████╔╝███████╗██║██║ ╚═╝ ██║╚██████╔╝███████║`,
  `  ╚═════╝ ╚══════╝╚═╝╚═╝     ╚═╝ ╚═════╝ ╚══════╝`,
]

// ─── Main ─────────────────────────────────────────────────────────────────────

export function printStartupScreen(): void {
  // Skip in non-interactive / CI / print mode
  if (process.env.CI || !process.stdout.isTTY) return

  const out: string[] = []

  out.push('')

  const allLogo = LOGO_DEIMOS
  const total = allLogo.length
  for (let i = 0; i < total; i++) {
    const t = total > 1 ? i / (total - 1) : 0
    out.push(paintLine(allLogo[i]!, SUNSET_GRAD, t))
  }

  out.push('')

  // Tagline + lore (Deimos-branded; welcome panel carries /help once).
  out.push(
    `  ${rgb(...ACCENT)}\u2726${RESET} ${rgb(...CREAM)}Outermost moon · carrier uplink · agents · MCP · worktrees · hooks${RESET} ${rgb(...ACCENT)}\u2726${RESET}`,
  )
  out.push(
    `  ${DIM}${rgb(...DIMCOL)}Named for Terror · ~15 km rock · tide-locked · 30.3 h orbit · rings are fiction${RESET}`,
  )
  out.push('')

  // One line: name + version (no URL; welcome panel has provider context).
  out.push(
    `  ${DIM}${rgb(...DIMCOL)}deimos ${RESET}${rgb(...ACCENT)}v${MACRO.DISPLAY_VERSION ?? MACRO.VERSION}${RESET}`,
  )
  out.push('')

  process.stdout.write(out.join('\n') + '\n')
}
