import React, { useEffect, useMemo, useState } from 'react'
import { Box, Text } from 'src/ink.js'
import {
  INNER,
  PLANET_ART_ROWS,
  PLANET_TICK_MS,
  WELCOME_FRAME_RANDOM_SPAN,
  WELCOME_V2_WIDTH,
  buildArt,
  pickDisjointWelcomeCopy,
} from '../../lib/deimosNetFrame.js'
import { env } from '../../utils/env.js'
import { detectStartupProvider } from '../../utils/startupProvider.js'

const TOP_RULE = `  ╔${'═'.repeat(INNER)}╗`
const SEP_RULE = `  ╠${'═'.repeat(INNER)}╣`
const BOT_RULE = `  ╚${'═'.repeat(INNER)}╝`

/**
 * Onboarding welcome: large ASCII planet view + provider box (shared detection
 * with StartupScreen via `detectStartupProvider`).
 */
export function WelcomeV2(): React.ReactNode {
  if (env.terminal === 'Apple_Terminal') {
    return <WelcomeAscii appleTerminal />
  }
  return <WelcomeAscii />
}

type WelcomeAsciiProps = {
  /** Apple Terminal: random frame on mount, no animation tick. */
  appleTerminal?: boolean
}

function WelcomeAscii({ appleTerminal }: WelcomeAsciiProps): React.ReactNode {
  const [frame, setFrame] = useState(
    () => Math.floor(Math.random() * WELCOME_FRAME_RANDOM_SPAN),
  )
  const [copyVariants] = useState(() => pickDisjointWelcomeCopy())
  const p = useMemo(() => detectStartupProvider(), [])

  useEffect(() => {
    if (appleTerminal) return
    const id = setInterval(() => setFrame(f => f + 1), PLANET_TICK_MS)
    return () => clearInterval(id)
  }, [appleTerminal])

  const art = useMemo(
    () => buildArt(frame, copyVariants),
    [frame, copyVariants],
  )

  const epMax = INNER - 11
  const ep =
    p.baseUrl.length > epMax
      ? `${p.baseUrl.slice(0, Math.max(0, epMax - 3))}...`
      : p.baseUrl
  const providerColor = p.isLocal ? 'success' : 'claude'
  const modeWord = p.isLocal ? 'local' : 'cloud'
  const modeColor = p.isLocal ? 'success' : 'claude'

  const planetStart = 3
  const planetEnd = planetStart + PLANET_ART_ROWS

  return (
    <Box flexDirection="column" width={WELCOME_V2_WIDTH}>
      {art.map((l, i) => {
        const isPlanetRow = i >= planetStart && i < planetEnd
        return (
          <Text
            key={i}
            dimColor={!isPlanetRow}
            color={isPlanetRow ? 'subtle' : undefined}
          >
            {l.left}
            {l.mid}
            {l.right ?? ''}
          </Text>
        )
      })}
      <Text dimColor>{TOP_RULE}</Text>
      <ProviderRow label="Provider" value={p.name} valueColor={providerColor} />
      <ProviderRow label="Model" value={p.model} />
      <ProviderRow label="Endpoint" value={ep} />
      <Text dimColor>{SEP_RULE}</Text>
      <StatusRow modeWord={modeWord} modeColor={modeColor} />
      <Text dimColor>{BOT_RULE}</Text>
    </Box>
  )
}

function ProviderRow({
  label,
  value,
  valueColor = 'claude',
}: {
  label: string
  value: string
  valueColor?: 'claude' | 'success'
}): React.ReactNode {
  const head = ` ${label.padEnd(9)} `
  const tailLen = INNER - head.length
  const v = value.slice(0, tailLen)
  const pad = ' '.repeat(Math.max(0, tailLen - v.length))
  return (
    <Text>
      <Text dimColor>  ║</Text>
      <Text color="subtle">{head}</Text>
      <Text color={valueColor}>{v}</Text>
      <Text dimColor>{pad}</Text>
      <Text dimColor>║</Text>
    </Text>
  )
}

function StatusRow({
  modeWord,
  modeColor,
}: {
  modeWord: string
  modeColor: 'claude' | 'success'
}): React.ReactNode {
  const mid = `    Ready — `
  const help = '/help'
  const used =
    2 + 1 + 1 + modeWord.length + mid.length + help.length
  const pad = Math.max(0, INNER - used)
  return (
    <Text>
      <Text dimColor>  ║</Text>
      <Text dimColor>  </Text>
      <Text color={modeColor}>●</Text>
      <Text dimColor> </Text>
      <Text color={modeColor}>{modeWord}</Text>
      <Text color="subtle">{mid}</Text>
      <Text color="claude">{help}</Text>
      <Text dimColor>{' '.repeat(pad)}</Text>
      <Text dimColor>║</Text>
    </Text>
  )
}
