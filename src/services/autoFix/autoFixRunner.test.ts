import { describe, expect, test } from 'bun:test'
import { runAutoFixCheck } from './autoFixRunner.js'

describe('runAutoFixCheck', () => {
  test('returns success when lint command exits 0', async () => {
    const result = await runAutoFixCheck({
      lint: 'echo "all clean"',
      timeout: 5000,
      cwd: process.cwd(),
    })
    expect(result.hasErrors).toBe(false)
    expect(result.lintOutput).toContain('all clean')
    expect(result.testOutput).toBeUndefined()
  })

  test('returns errors when lint command exits non-zero', async () => {
    const result = await runAutoFixCheck({
      lint: 'echo "error: unused var" && exit 1',
      timeout: 5000,
      cwd: process.cwd(),
    })
    expect(result.hasErrors).toBe(true)
    expect(result.lintOutput).toContain('unused var')
    expect(result.lintExitCode).toBe(1)
  })

  test('returns errors when test command exits non-zero', async () => {
    const result = await runAutoFixCheck({
      test: 'echo "FAIL test_foo" && exit 1',
      timeout: 5000,
      cwd: process.cwd(),
    })
    expect(result.hasErrors).toBe(true)
    expect(result.testOutput).toContain('FAIL test_foo')
    expect(result.testExitCode).toBe(1)
  })
})

