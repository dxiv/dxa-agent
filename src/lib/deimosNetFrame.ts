/** Matches onboarding column width; keeps layout aligned with theme picker below. */
export const WELCOME_V2_WIDTH = 52

/** Inner width between double-line box borders (see rows below). */
export const INNER = 48

/** DEIMOS//NET panel: same double-line width as provider box (`╔` + INNER×`═` + `╗`). */
const NET_LINE_W = INNER + 2

/** Planet canvas width — same as space between `│` columns. */
const NET_INNER = INNER

export type ArtLine = { left: string; mid: string; right?: string }

function clampLine(s: string, w: number): string {
  return s.slice(0, w).padEnd(w)
}

/** Picked once per welcome mount. Always: DEIMOS//NET, “live”, ▮/▯. */
const WELCOME_HEADER_VARIANTS: ReadonlyArray<(live: string) => string> = [
  live =>
    `DEIMOS//NET  VOID-ROUTE · NO-UPLINK · live ${live}`,
  live =>
    `DEIMOS//NET  MARKER · SIGNAL:NULL · live ${live}`,
  live =>
    `DEIMOS//NET  CONVERGENCE · RUPTURE · live ${live}`,
  live =>
    `DEIMOS//NET  UPLINK:NULL · CORRUPT · live ${live}`,
  live =>
    `DEIMOS//NET  DEAD-FREQ · NO-EXIT · live ${live}`,
  live =>
    `DEIMOS//NET  UNIT-LOCK · OVERRIDDEN · live ${live}`,
  live =>
    `DEIMOS//NET  GHOST-ROUTE · ISOLATED · live ${live}`,
  live =>
    `DEIMOS//NET  SECTOR-LOCK · BREACH · live ${live}`,
  live =>
    `DEIMOS//NET  NULL-ROUTE · OFF-GRID · live ${live}`,
  live =>
    `DEIMOS//NET  SIGNAL-LOST · TRACING · live ${live}`,
]

/** Picked once per welcome mount. Always: sol N; slash hints ( /help lives in status row). */
const WELCOME_FOOTER_VARIANTS: ReadonlyArray<(sol: number) => string> = [
  sol => `sol ${sol} · dead-link · /mcp /theme`,
  sol => `sol ${sol} · ghost-link · /mcp /theme`,
  sol => `sol ${sol} · void-trace · /mcp /theme`,
  sol => `sol ${sol} · no-exit · /mcp /theme`,
  sol => `sol ${sol} · dead-air · /mcp /theme`,
  sol => `sol ${sol} · signal-0 · /mcp /theme`,
  sol => `sol ${sol} · off-grid · /mcp /theme`,
  sol => `sol ${sol} · last-beacon · /mcp /theme`,
  sol => `sol ${sol} · hull-breach · /mcp /theme`,
  sol => `sol ${sol} · make-whole · /mcp /theme`,
]

/** Very rare silly lines; still disjoint-paired with footer eggs. Same required tokens. */
const WELCOME_HEADER_EASTER_EGGS: ReadonlyArray<(live: string) => string> = [
  live =>
    `DEIMOS//NET  COFFEE · NOT FOUND · live ${live}`,
  live =>
    `DEIMOS//NET  NOT · A · MOON · live ${live}`,
  live =>
    `DEIMOS//NET  SEND · SNACKS · PLZ · live ${live}`,
  live =>
    `DEIMOS//NET  CTRL · ALT · DEFEAT · live ${live}`,
  live =>
    `DEIMOS//NET  YOUR · PROMPT · WEAK · live ${live}`,
  live =>
    `DEIMOS//NET  HAS · ANYONE · SEEN · PHOBOS · live ${live}`,
]

const WELCOME_FOOTER_EASTER_EGGS: ReadonlyArray<(sol: number) => string> = [
  sol => `sol ${sol} · ducks · /mcp /theme`,
  sol => `sol ${sol} · pizza · /mcp /theme`,
  sol => `sol ${sol} · panic-quietly · /mcp /theme`,
  sol => `sol ${sol} · slop-detected · /mcp /theme`,
  sol => `sol ${sol} · probably-fine · /mcp /theme`,
  sol => `sol ${sol} · blame-router · /mcp /theme`,
]

/** ~1.7%: funny header/footer pair. */
const EASTER_EGG_CHANCE = 0.017
/** ~1.2%: extra-long shooting streak on a normal (non–easter-egg) welcome. */
const RARE_METEOR_BOOST_CHANCE = 0.012

/** Words allowed to repeat (required UI tokens / slash commands). */
const WELCOME_COPY_IGNORED_WORDS = new Set([
  'deimos',
  'net',
  'live',
  'sol',
  'help',
  'mcp',
  'theme',
])

function extractDistinctWords(s: string): Set<string> {
  const normalized = s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const parts = normalized.split(/\s+/).filter(Boolean)
  const out = new Set<string>()
  for (const p of parts) {
    if (p.length < 2) continue
    if (/^\d+$/.test(p)) continue
    if (WELCOME_COPY_IGNORED_WORDS.has(p)) continue
    out.add(p)
  }
  return out
}

function headerAndFooterShareWord(header: string, footer: string): boolean {
  const sh = extractDistinctWords(header)
  const sf = extractDistinctWords(footer)
  for (const w of sh) {
    if (sf.has(w)) return true
  }
  return false
}

function pickDisjointHeaderFooter(
  headers: ReadonlyArray<(live: string) => string>,
  footers: ReadonlyArray<(sol: number) => string>,
): { headerVariant: number; footerVariant: number } | null {
  const hs = [...Array(headers.length).keys()].sort(() => Math.random() - 0.5)
  for (const h of hs) {
    const headerStr = headers[h]!('▮')
    const fs = [...Array(footers.length).keys()].sort(() => Math.random() - 0.5)
    for (const f of fs) {
      if (!headerAndFooterShareWord(headerStr, footers[f]!(0))) {
        return { headerVariant: h, footerVariant: f }
      }
    }
  }
  for (let h = 0; h < headers.length; h++) {
    const headerStr = headers[h]!('▮')
    for (let f = 0; f < footers.length; f++) {
      if (!headerAndFooterShareWord(headerStr, footers[f]!(0))) {
        return { headerVariant: h, footerVariant: f }
      }
    }
  }
  return null
}

export type WelcomeCopyPick = {
  headerVariant: number
  footerVariant: number
  easterEgg: boolean
  /** Longer shooting-star streak (easter eggs always get this for a tiny “event”). */
  meteorBoost: boolean
}

/** Random pair with no overlapping flavor words (required tokens ignored). */
export function pickDisjointWelcomeCopy(): WelcomeCopyPick {
  const rareMeteor = Math.random() < RARE_METEOR_BOOST_CHANCE
  const wantEgg = Math.random() < EASTER_EGG_CHANCE
  if (wantEgg) {
    const egg = pickDisjointHeaderFooter(
      WELCOME_HEADER_EASTER_EGGS,
      WELCOME_FOOTER_EASTER_EGGS,
    )
    if (egg != null) {
      return {
        ...egg,
        easterEgg: true,
        meteorBoost: true,
      }
    }
  }
  const normal = pickDisjointHeaderFooter(
    WELCOME_HEADER_VARIANTS,
    WELCOME_FOOTER_VARIANTS,
  )!
  return {
    ...normal,
    easterEgg: false,
    meteorBoost: rareMeteor,
  }
}

/**
 * Tall panel: stylized Mars + ring + moon.
 * Mars disk uses ~25° obliquity; moon ◆ uses Deimos orbit period vs sol (~1.23 sols).
 * Real Deimos is a small Martian moon (~15 km); rings are sci‑fi flair.
 * Surface: subtle crater pits (low-albedo, heavily cratered body in imagery).
 */
export const PLANET_ART_ROWS = 11

/** Uniform random offset on startup so sol / tilt / light phase differ each launch. */
export const WELCOME_FRAME_RANDOM_SPAN = 1_000_000

/** Animation tick (ms) — slow, heavy; Dead Space–leaning (avoid arcade busyness). */
export const PLANET_TICK_MS = 380

/** Frames per full sunlight sweep around the globe (one “sol” in the HUD). */
const SUN_CYCLE_FRAMES = 145

/**
 * Deimos orbit ~30.31 h vs Mars sidereal sol ~24.62 h → one orbit ≈ 1.231 sols.
 * Moon ◆ period matches that ratio (sci‑fi rings still not physical).
 */
const DEIMOS_ORBIT_SOLS = 30.312 / 24.6227
const MOON_CYCLE_FRAMES = SUN_CYCLE_FRAMES * DEIMOS_ORBIT_SOLS

/** Rare shooting-star bursts: period in frames; streak length inside each period. */
const SHOOT_PERIOD_FRAMES = 620
const SHOOT_STREAK_FRAMES = 14

/** Rarer, faster micro-meteor (shorter streak, steeper path than main shooting star). */
const FAST_METEOR_PERIOD_FRAMES = 1280
const FAST_METEOR_STREAK_FRAMES = 6

/** Mars obliquity (~25.2°) — globe “roll” stays near real Mars, not arcade spins. */
const MARS_OBLIQUITY_RAD = (25.19 * Math.PI) / 180

/** Bias sun phase so mid-run lighting avoids a permanent thin-crescent read. */
const SUN_PHASE_BIAS = 0.42

/** Sol 0 opening: start near-gibbous (majority lit) with a diagonal terminator, then blend to ephemeris. */
const SOL0_OPEN_PHASE = 0.085
const SOL0_OPEN_DRIFT = Math.PI * 0.78
const SOL0_BLEND_OUT_SOLS = 1.12

/**
 * Crater bowl centers in normalized disk coords (dx, dy); rim at ~1 ellipse.
 * Fixed layout — reads as geology, not noise.
 */
const CRATERS: ReadonlyArray<{ cx: number; cy: number; r: number }> = [
  { cx: -0.2, cy: 0.12, r: 0.1 },
  { cx: 0.18, cy: -0.16, r: 0.08 },
  { cx: 0.04, cy: 0.21, r: 0.065 },
  { cx: -0.14, cy: -0.19, r: 0.09 },
  { cx: 0.26, cy: 0.07, r: 0.048 },
  { cx: -0.28, cy: -0.06, r: 0.052 },
  { cx: 0.12, cy: 0.05, r: 0.055 },
]

function craterAlbedo(dx: number, dy: number): number {
  let m = 1
  for (const cr of CRATERS) {
    const d = Math.hypot(dx - cr.cx, dy - cr.cy)
    if (d >= cr.r) continue
    const rim = d / cr.r
    // Bowl: darker floor, soft rim (multiplier ~0.76…1 — keep pits visible, not void-black)
    const pit = 0.76 + 0.24 * rim * rim
    m = Math.min(m, pit)
  }
  return m
}

function starPriority(ch: string): number {
  if (ch === '✦') return 4
  if (ch === '✧') return 3
  if (ch === '′') return 2
  if (ch === '·') return 1
  return 0
}

/**
 * Remove void stars that touch (8-neighbors). Each undirected pair resolved once
 * via forward edges; higher glyph wins, ties drop the lex-larger cell.
 */
function cullTouchingVoidStars(
  grid: string[][],
  R: number,
  W: number,
  isVoid: (c: number, r: number) => boolean,
): void {
  const forwardDirs = [
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ] as const
  for (let pass = 0; pass < 2; pass++) {
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < W; c++) {
        if (!isVoid(c, r)) continue
        const ch = grid[r]![c]
        const p1 = starPriority(ch)
        if (p1 <= 0) continue
        for (const [dr, dc] of forwardDirs) {
          const nr = r + dr
          const nc = c + dc
          if (nr < 0 || nr >= R || nc < 0 || nc >= W) continue
          if (!isVoid(nc, nr)) continue
          const ch2 = grid[nr]![nc]
          const p2 = starPriority(ch2)
          if (p2 <= 0) continue
          if (p1 > p2) grid[nr]![nc] = ' '
          else if (p2 > p1) {
            grid[r]![c] = ' '
            break
          } else grid[nr]![nc] = ' '
        }
      }
    }
  }
}

/** Map Lambert term [0,1] to glyphs — expanded mid/dark bands so the terminator reads larger. */
function shadeToChar(t: number): string {
  if (t < 0.18) return '█'
  if (t < 0.32) return '▓'
  if (t < 0.46) return '▒'
  if (t < 0.58) return '░'
  if (t < 0.7) return ':'
  if (t < 0.82) return '·'
  if (t < 0.92) return '′'
  return '✦'
}

function buildBigPlanetScene(
  frame: number,
  opts?: { meteorBoost?: boolean },
): string[] {
  const W = NET_INNER
  const R = PLANET_ART_ROWS
  const cx = (W - 1) / 2
  const cy = 5
  const rx = W * 0.255
  // Rounder vertical extent so the disk reads as a face-on globe, not an edge-on coin.
  const ry = 4.55
  // Continuous “mission time” in sols — avoids identical lighting every cycle (microwave).
  const solT = frame / SUN_CYCLE_FRAMES
  // Smooth libration around Mars obliquity (no sol-boundary yaw jumps).
  const bodyYaw =
    MARS_OBLIQUITY_RAD +
    0.04 * Math.sin(solT * 0.28) +
    0.024 * Math.sin(solT * 0.15) +
    0.014 * Math.sin(solT * 0.062)
  const cb = Math.cos(bodyYaw)
  const sb = Math.sin(bodyYaw)
  const sunPhaseEphemeris =
    SUN_PHASE_BIAS +
    solT * (Math.PI * 2 + 0.37) +
    0.055 * Math.sin(4 * Math.PI * solT)
  const wOpen = Math.max(0, 1 - solT / SOL0_BLEND_OUT_SOLS)
  const sunPhaseOpening =
    SOL0_OPEN_PHASE +
    solT * SOL0_OPEN_DRIFT +
    0.035 * Math.sin(4 * Math.PI * solT)
  const sunPhase = sunPhaseOpening * wOpen + sunPhaseEphemeris * (1 - wOpen)
  let lx = Math.sin(sunPhase)
  let ly =
    (0.07 + 0.02 * Math.sin(solT * 0.19)) * Math.sin(2 * sunPhase)
  let lz = Math.cos(sunPhase)
  // Small per-sol tilt of the light path — subtle, not wild.
  const tiltX = 0.06 * Math.sin(solT * 0.29) + 0.035 * Math.sin(solT * 0.83)
  const tiltZ = 0.05 * Math.sin(solT * 0.47)
  const cx1 = Math.cos(tiltX)
  const sx1 = Math.sin(tiltX)
  const ly1 = ly * cx1 - lz * sx1
  const lz1 = ly * sx1 + lz * cx1
  const lx1 = lx
  const cz = Math.cos(tiltZ)
  const sz = Math.sin(tiltZ)
  lx = lx1 * cz - ly1 * sz
  ly = lx1 * sz + ly1 * cz
  lz = lz1
  const llen = Math.hypot(lx, ly, lz)
  lx /= llen
  ly /= llen
  lz /= llen

  const grid: string[][] = Array.from({ length: R }, () => Array(W).fill('·'))

  function isOutsidePlanet(c: number, r: number): boolean {
    const px = (c - cx) / rx
    const py = (r - cy) / ry
    return px * px + py * py > 1
  }

  // Sparse void: mixed drift; moduli slightly looser because culling trims neighbors.
  const starDriftSlow = Math.floor(frame / 3)
  const starDriftMid = Math.floor(frame / 2)
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < W; c++) {
      if (!isOutsidePlanet(c, r)) continue
      const seed = (c * 19 + r * 23) % 100
      const drift =
        seed < 6 ? frame : seed < 18 ? starDriftMid : starDriftSlow
      const h = (c * 19 + r * 23 + drift) % 101
      if (h % 41 === 0) grid[r]![c] = '✦'
      else if (h % 37 === 0) grid[r]![c] = '✧'
      else if (h % 31 === 0) grid[r]![c] = '′'
      else if (h % 21 === 0) grid[r]![c] = '·'
      else grid[r]![c] = ' '
    }
  }

  cullTouchingVoidStars(grid, R, W, isOutsidePlanet)

  // Occasional shooting star (background only): ~3 of 4 bursts show a streak.
  const shootStreak = opts?.meteorBoost
    ? SHOOT_STREAK_FRAMES + 6
    : SHOOT_STREAK_FRAMES
  const shootMaxK = opts?.meteorBoost ? 11 : 8
  const shootCycle = Math.floor(frame / SHOOT_PERIOD_FRAMES)
  const shootT = frame % SHOOT_PERIOD_FRAMES
  if (shootT < shootStreak && shootCycle % 4 !== 0) {
    const startC = -2 + (shootCycle * 19) % 5
    for (let k = 0; k < shootMaxK; k++) {
      const c = Math.round(startC + shootT * 2.4 + k * 2.1)
      const r = Math.round(1 + k * 0.85 + shootT * 0.12)
      if (r < 0 || r >= R || c < 0 || c >= W) continue
      if (!isOutsidePlanet(c, r)) continue
      const ch =
        k >= shootMaxK - 2 ? '✦' : k >= shootMaxK - 4 ? '′' : '·'
      grid[r]![c] = ch
    }
  }

  const fastMeteorBoost = opts?.meteorBoost ? 2 : 0
  const fastStreak = FAST_METEOR_STREAK_FRAMES + fastMeteorBoost
  const fastMaxK = 5 + fastMeteorBoost
  const fastCycle = Math.floor(frame / FAST_METEOR_PERIOD_FRAMES)
  const fastT = frame % FAST_METEOR_PERIOD_FRAMES
  if (fastT < fastStreak && fastCycle % 7 !== 0) {
    const startC = 10 + (fastCycle * 11) % 22
    for (let k = 0; k < fastMaxK; k++) {
      const c = Math.round(startC + fastT * 3.6 + k * 1.5)
      const r = Math.round(0 + k * 1.05 + fastT * 0.42)
      if (r < 0 || r >= R || c < 0 || c >= W) continue
      if (!isOutsidePlanet(c, r)) continue
      const ch = k >= fastMaxK - 1 ? '✦' : k >= fastMaxK - 2 ? '′' : '·'
      grid[r]![c] = ch
    }
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < W; c++) {
      const px = (c - cx) / rx
      const py = (r - cy) / ry
      if (px * px + py * py > 1) continue
      const nz = Math.sqrt(Math.max(0, 1 - px * px - py * py))
      const nx = px * cb - py * sb
      const ny = px * sb + py * cb
      const dot = nx * lx + ny * ly + nz * lz
      const u = (dot + 1) / 2
      // Mild gamma: favors █▓▒░ but still lets the lit hemisphere sweep visibly each cycle.
      let t = Math.pow(u, 1.06)
      const bx = px * cb + py * sb
      const by = -px * sb + py * cb
      t *= craterAlbedo(bx, by)
      t = Math.max(0, Math.min(1, t))
      grid[r]![c] = shadeToChar(t)
    }
  }

  const ringRx = W * 0.435
  const ringRy = 1.02
  const ringCy = cy + 0.32
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < W; c++) {
      const dx = (c - cx) / ringRx
      const dy = (r - ringCy) / ringRy
      const d = dx * dx + dy * dy
      if (d < 0.94 || d > 1.06) continue
      const pulse = (Math.floor(frame / 4) + c + r) % 4
      grid[r]![c] = pulse === 0 ? '═' : pulse === 1 ? '─' : pulse === 2 ? '~' : '·'
    }
  }

  const ang = (frame / MOON_CYCLE_FRAMES) * Math.PI * 2 + 0.7
  const mx = Math.round(cx + W * 0.405 * Math.cos(ang))
  const my = Math.round(cy + 2.2 * Math.sin(ang))
  if (mx >= 0 && mx < W && my >= 0 && my < R) {
    const prev = grid[my]![mx]
    if (prev === ' ' || prev === '·' || prev === '′' || prev === '✦') {
      grid[my]![mx] = '◆'
    }
  }

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < W; c++) {
      if (grid[r]![c] === ' ') grid[r]![c] = '·'
    }
  }

  return grid.map(row => row.join(''))
}

/** Full DEIMOS//NET double-line frame (header, planet art, footer) for CLI or web. */
export function buildArt(frame: number, copy: WelcomeCopyPick): ArtLine[] {
  const planetScene = buildBigPlanetScene(frame, {
    meteorBoost: copy.meteorBoost,
  })

  const live = frame % 2 === 0 ? '▮' : '▯'
  const headers = copy.easterEgg
    ? WELCOME_HEADER_EASTER_EGGS
    : WELCOME_HEADER_VARIANTS
  const footers = copy.easterEgg
    ? WELCOME_FOOTER_EASTER_EGGS
    : WELCOME_FOOTER_VARIANTS
  const headerFn = headers[copy.headerVariant % headers.length]!
  const header = clampLine(headerFn(live), INNER)

  const lines: string[] = []
  lines.push(`╔${'═'.repeat(INNER)}╗`)
  lines.push(`║${header}║`)
  lines.push(`╠${'═'.repeat(INNER)}╣`)

  for (const row of planetScene) {
    lines.push(`║${clampLine(row, INNER)}║`)
  }

  // Mars missions use “sol” for a solar day; Deimos has no separate common name for a “day”
  // (it’s tidally locked; orbit ~30.3 h). Here each completed sun phase = one stylized sol.
  const sol = Math.floor(frame / SUN_CYCLE_FRAMES)
  const footerFn = footers[copy.footerVariant % footers.length]!
  const footer = clampLine(footerFn(sol), INNER)
  lines.push(`╠${'═'.repeat(INNER)}╣`)
  lines.push(`║${footer}║`)
  lines.push(`╚${'═'.repeat(INNER)}╝`)

  // Two spaces so `╔` lines up with provider `╔` below; `NET_LINE_W` matches `  ╔`+INNER×`═`+`╗`.
  return lines.map(l => ({ left: '  ', mid: clampLine(l, NET_LINE_W) }))
}

/**
 * Map glyphs that often render as ambiguous / double-width in browser monospace to
 * strict single-column ASCII so box borders stay visually aligned (terminal Ink is cell-based).
 */
const WEB_AMBIGUOUS_GLYPH: Record<string, string> = {
  '✦': '*',
  '✧': '*',
  '′': "'",
  '◆': '*',
  '·': '.',
  '▮': '#',
  '▯': '-',
}

export function normalizeWebAsciiLine(line: string): string {
  let out = ''
  for (const ch of line) {
    out += WEB_AMBIGUOUS_GLYPH[ch] ?? ch
  }
  return out
}
