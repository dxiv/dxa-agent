import { useEffect, useState } from 'react'
import {
  type DeimosUsageLimits,
  currentLimits,
  statusListeners,
} from './subscriberUsageLimits.js'

export function useDeimosUsageLimits(): DeimosUsageLimits {
  const [limits, setLimits] = useState<DeimosUsageLimits>({ ...currentLimits })

  useEffect(() => {
    const listener = (newLimits: DeimosUsageLimits) => {
      setLimits({ ...newLimits })
    }
    statusListeners.add(listener)

    return () => {
      statusListeners.delete(listener)
    }
  }, [])

  return limits
}
