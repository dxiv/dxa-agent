import { afterEach, expect, mock, test } from 'bun:test'

const originalEnv = {
  DEIMOS_USE_GITHUB: process.env.DEIMOS_USE_GITHUB,
  DEIMOS_USE_OPENAI: process.env.DEIMOS_USE_OPENAI,
  DEIMOS_USE_GEMINI: process.env.DEIMOS_USE_GEMINI,
  DEIMOS_USE_BEDROCK: process.env.DEIMOS_USE_BEDROCK,
  DEIMOS_USE_VERTEX: process.env.DEIMOS_USE_VERTEX,
  DEIMOS_USE_FOUNDRY: process.env.DEIMOS_USE_FOUNDRY,
  DEIMOS_PROVIDER_PROFILE_ENV_APPLIED:
    process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED,
  DEIMOS_PROVIDER_PROFILE_ENV_APPLIED_ID:
    process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED_ID,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
  OPENAI_API_BASE: process.env.OPENAI_API_BASE,
  ANTHROPIC_CUSTOM_MODEL_OPTION: process.env.ANTHROPIC_CUSTOM_MODEL_OPTION,
}

afterEach(() => {
  mock.restore()
  process.env.DEIMOS_USE_GITHUB = originalEnv.DEIMOS_USE_GITHUB
  process.env.DEIMOS_USE_OPENAI = originalEnv.DEIMOS_USE_OPENAI
  process.env.DEIMOS_USE_GEMINI = originalEnv.DEIMOS_USE_GEMINI
  process.env.DEIMOS_USE_BEDROCK = originalEnv.DEIMOS_USE_BEDROCK
  process.env.DEIMOS_USE_VERTEX = originalEnv.DEIMOS_USE_VERTEX
  process.env.DEIMOS_USE_FOUNDRY = originalEnv.DEIMOS_USE_FOUNDRY
  process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED =
    originalEnv.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED
  process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED_ID =
    originalEnv.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED_ID
  process.env.OPENAI_MODEL = originalEnv.OPENAI_MODEL
  process.env.OPENAI_BASE_URL = originalEnv.OPENAI_BASE_URL
  process.env.OPENAI_API_BASE = originalEnv.OPENAI_API_BASE
  process.env.ANTHROPIC_CUSTOM_MODEL_OPTION =
    originalEnv.ANTHROPIC_CUSTOM_MODEL_OPTION
})

test('GitHub provider exposes only default + GitHub model in /model options', async () => {
  process.env.DEIMOS_USE_GITHUB = '1'
  delete process.env.DEIMOS_USE_OPENAI
  delete process.env.DEIMOS_USE_GEMINI
  delete process.env.DEIMOS_USE_BEDROCK
  delete process.env.DEIMOS_USE_VERTEX
  delete process.env.DEIMOS_USE_FOUNDRY
  delete process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED
  delete process.env.DEIMOS_PROVIDER_PROFILE_ENV_APPLIED_ID

  process.env.OPENAI_MODEL = 'github:copilot'
  delete process.env.OPENAI_BASE_URL
  delete process.env.OPENAI_API_BASE
  delete process.env.ANTHROPIC_CUSTOM_MODEL_OPTION

  // This test suite runs many env-mutating tests; force the provider to avoid
  // cross-file race conditions when executing in parallel.
  mock.module('./providers.js', () => ({
    getAPIProvider: () => 'github',
  }))

  const { getModelOptions } = await import(
    `./modelOptions.js?ts=${Date.now()}-${Math.random()}`
  )
  const options = getModelOptions(false)
  const nonDefault = options.filter(option => option.value !== null)

  expect(nonDefault.length).toBe(1)
  expect(nonDefault[0]?.value).toBe('github:copilot')
})
