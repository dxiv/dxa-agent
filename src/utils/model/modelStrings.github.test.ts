import { afterEach, expect, test } from 'bun:test'

import { resetModelStringsForTestingOnly } from '../../bootstrap/state.js'
import { parseUserSpecifiedModel } from './model.js'
import { getModelStrings } from './modelStrings.js'

const originalEnv = {
  DEIMOS_USE_GITHUB: process.env.DEIMOS_USE_GITHUB,
  DEIMOS_USE_OPENAI: process.env.DEIMOS_USE_OPENAI,
  DEIMOS_USE_GEMINI: process.env.DEIMOS_USE_GEMINI,
  DEIMOS_USE_BEDROCK: process.env.DEIMOS_USE_BEDROCK,
  DEIMOS_USE_VERTEX: process.env.DEIMOS_USE_VERTEX,
  DEIMOS_USE_FOUNDRY: process.env.DEIMOS_USE_FOUNDRY,
}

function clearProviderFlags(): void {
  delete process.env.DEIMOS_USE_GITHUB
  delete process.env.DEIMOS_USE_OPENAI
  delete process.env.DEIMOS_USE_GEMINI
  delete process.env.DEIMOS_USE_BEDROCK
  delete process.env.DEIMOS_USE_VERTEX
  delete process.env.DEIMOS_USE_FOUNDRY
}

afterEach(() => {
  process.env.DEIMOS_USE_GITHUB = originalEnv.DEIMOS_USE_GITHUB
  process.env.DEIMOS_USE_OPENAI = originalEnv.DEIMOS_USE_OPENAI
  process.env.DEIMOS_USE_GEMINI = originalEnv.DEIMOS_USE_GEMINI
  process.env.DEIMOS_USE_BEDROCK = originalEnv.DEIMOS_USE_BEDROCK
  process.env.DEIMOS_USE_VERTEX = originalEnv.DEIMOS_USE_VERTEX
  process.env.DEIMOS_USE_FOUNDRY = originalEnv.DEIMOS_USE_FOUNDRY
  resetModelStringsForTestingOnly()
})

test('GitHub provider model strings are concrete IDs', () => {
  clearProviderFlags()
  process.env.DEIMOS_USE_GITHUB = '1'

  const modelStrings = getModelStrings()

  for (const value of Object.values(modelStrings)) {
    expect(typeof value).toBe('string')
    expect(value.trim().length).toBeGreaterThan(0)
  }
})

test('GitHub provider model strings are safe to parse', () => {
  clearProviderFlags()
  process.env.DEIMOS_USE_GITHUB = '1'

  const modelStrings = getModelStrings()

  expect(() => parseUserSpecifiedModel(modelStrings.sonnet46 as any)).not.toThrow()
})
