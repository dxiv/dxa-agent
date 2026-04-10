import { expect, test } from 'bun:test'

import { roughTokenCountEstimationForMessages } from './tokenEstimation.js'

test('roughTokenCountEstimationForMessages startIndex skips prefix without slice', () => {
  const messages = [
    {
      type: 'user' as const,
      message: { role: 'user' as const, content: 'hello world short' },
    },
    {
      type: 'user' as const,
      message: {
        role: 'user' as const,
        content: 'second message with more text for estimation delta',
      },
    },
  ]
  const full = roughTokenCountEstimationForMessages(messages)
  const tail = roughTokenCountEstimationForMessages(messages, 1)
  const slice1 = roughTokenCountEstimationForMessages(messages.slice(1))
  expect(tail).toBe(slice1)
  expect(full).toBeGreaterThanOrEqual(tail)
})
