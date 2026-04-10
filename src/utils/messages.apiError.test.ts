import { expect, test } from 'bun:test'

import { PROMPT_TOO_LONG_ERROR_MESSAGE } from '../services/api/errors.js'
import { createAssistantAPIErrorMessage } from './messages.js'

test('createAssistantAPIErrorMessage preserves promptTooLongSource', () => {
  const m = createAssistantAPIErrorMessage({
    content: PROMPT_TOO_LONG_ERROR_MESSAGE,
    error: 'invalid_request',
    promptTooLongSource: 'client',
  })
  expect(m.promptTooLongSource).toBe('client')
  expect(
    m.message.content.some(
      b => b.type === 'text' && b.text === PROMPT_TOO_LONG_ERROR_MESSAGE,
    ),
  ).toBe(true)
})
