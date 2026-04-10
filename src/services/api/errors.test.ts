import { expect, test } from 'bun:test'

import {
  API_ERROR_MESSAGE_PREFIX,
  classifyMaxOutputTokensErrorText,
} from './errors.js'

test('classifyMaxOutputTokensErrorText detects per-turn output cap', () => {
  expect(
    classifyMaxOutputTokensErrorText(
      `${API_ERROR_MESSAGE_PREFIX}: Deimos's response exceeded the 8000 output token maximum. To configure this behavior, set the DEIMOS_MAX_OUTPUT_TOKENS environment variable.`,
    ),
  ).toBe('per_turn_output')
})

test('classifyMaxOutputTokensErrorText detects model context window message', () => {
  expect(
    classifyMaxOutputTokensErrorText(
      `${API_ERROR_MESSAGE_PREFIX}: The model has reached its context window limit.`,
    ),
  ).toBe('model_context_window')
})

test('classifyMaxOutputTokensErrorText returns null for unrelated API errors', () => {
  expect(
    classifyMaxOutputTokensErrorText(
      `${API_ERROR_MESSAGE_PREFIX}: Something else went wrong.`,
    ),
  ).toBe(null)
})
