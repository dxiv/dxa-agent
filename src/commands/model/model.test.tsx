import { createRequire } from 'node:module'
import { afterEach, beforeEach, expect, mock, test } from 'bun:test'

const require = createRequire(import.meta.url)

const originalEnv = {
  CLAUDE_CODE_USE_OPENAI: process.env.CLAUDE_CODE_USE_OPENAI,
  CLAUDE_CODE_USE_GITHUB: process.env.CLAUDE_CODE_USE_GITHUB,
  CLAUDE_CODE_USE_GEMINI: process.env.CLAUDE_CODE_USE_GEMINI,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_API_BASE: process.env.OPENAI_API_BASE,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
}

function invalidateModelCommandModuleCache(): void {
  const cache = require.cache as Record<string, unknown>
  for (const key of Object.keys(cache)) {
    const normalized = key.replaceAll('\\', '/')
    if (
      normalized.includes('/commands/model/model.') ||
      normalized.includes('openaiModelOptionsRefresh') ||
      normalized.includes('openaiModelDiscovery')
    ) {
      delete cache[key]
    }
  }
  for (const spec of [
    './model.js',
    '../../utils/model/openaiModelOptionsRefresh.js',
  ] as const) {
    try {
      delete cache[require.resolve(spec)]
    } catch {
      // not loaded yet
    }
  }
}

beforeEach(() => {
  mock.restore()
})

afterEach(() => {
  mock.restore()
  invalidateModelCommandModuleCache()
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
})

test('opens the model picker without awaiting local model discovery refresh', async () => {
  process.env.CLAUDE_CODE_USE_OPENAI = '1'
  delete process.env.CLAUDE_CODE_USE_GITHUB
  delete process.env.CLAUDE_CODE_USE_GEMINI
  process.env.OPENAI_BASE_URL = 'http://127.0.0.1:8080/v1'
  delete process.env.OPENAI_API_BASE
  process.env.OPENAI_MODEL = 'qwen2.5-coder-7b-instruct'

  const refreshOpenAIModelOptionsCache = mock(
    () =>
      new Promise<void>(() => {
        /* never resolves — real discovery must not block the picker */
      }),
  )

  const refreshSpecifier = import.meta.resolve(
    '../../utils/model/openaiModelOptionsRefresh.js',
  )
  mock.module(refreshSpecifier, () => ({
    refreshOpenAIModelOptionsCache,
  }))

  invalidateModelCommandModuleCache()

  const { call } = await import('./model.js')
  const result = await Promise.race([
    call(() => {}, {} as never, ''),
    new Promise(resolve => setTimeout(() => resolve('timeout'), 3000)),
  ])

  expect(result).not.toBe('timeout')
  expect(refreshOpenAIModelOptionsCache).toHaveBeenCalledTimes(1)
})
