import { describe, expect, test } from 'bun:test'
import { shouldRunStartupChecks } from './replStartupGates.js'

describe('shouldRunStartupChecks', () => {
  test('runs checks after first message submission', () => {
    expect(
      shouldRunStartupChecks({
        isRemoteSession: false,
        hasStarted: false,
        hasHadFirstSubmission: true,
      }),
    ).toBe(true)
  })

  test('skips checks in remote sessions even after submission', () => {
    expect(
      shouldRunStartupChecks({
        isRemoteSession: true,
        hasStarted: false,
        hasHadFirstSubmission: true,
      }),
    ).toBe(false)
  })

  test('does not run checks before first submission', () => {
    expect(
      shouldRunStartupChecks({
        isRemoteSession: false,
        hasStarted: false,
        hasHadFirstSubmission: false,
      }),
    ).toBe(false)
  })
})

