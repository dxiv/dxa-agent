import * as React from 'react'
import { Text } from '../../ink.js'

type Props = {
  selected: boolean
}

/** Footer pill for Tungsten / tmux session (internal ant build). */
export function TungstenPill({ selected }: Props): React.ReactElement {
  return (
    <Text
      key={selected ? 'selected' : 'normal'}
      color="background"
      inverse={selected}
    >
      tmux
    </Text>
  )
}
