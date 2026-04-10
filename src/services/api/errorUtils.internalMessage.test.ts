import { expect, test } from 'bun:test'

import {
  describeThrowableForUser,
  formatInternalDeimosAssistantError,
  formatToolSkippedAfterDeimosFailure,
} from './errorUtils.js'

test('describeThrowableForUser uses Error message', () => {
  expect(describeThrowableForUser(new Error('bad thing'))).toContain('bad thing')
})

test('describeThrowableForUser falls back when message is empty', () => {
  expect(describeThrowableForUser(new Error(''))).toContain('No details')
})

test('formatInternalDeimosAssistantError includes context and hints', () => {
  const s = formatInternalDeimosAssistantError(new Error('x'))
  expect(s).toContain('Something went wrong inside Deimos')
  expect(s).toContain('x')
  expect(s).toContain('/doctor')
})

test('formatToolSkippedAfterDeimosFailure explains tool skip', () => {
  const s = formatToolSkippedAfterDeimosFailure(new Error('y'))
  expect(s).toContain('before this tool could run')
  expect(s).toContain('y')
})
