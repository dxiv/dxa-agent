import { afterEach, expect, test } from 'bun:test'

import { getMaxOutputTokensForModel } from '../services/api/anthropicMessages.js'
import {
  DEIMOS_MAX_CONTEXT_TOKENS_CEILING,
  getContextWindowForModel,
  getModelMaxOutputTokens,
} from './context.js'

const originalEnv = {
  DEIMOS_USE_OPENAI: process.env.DEIMOS_USE_OPENAI,
  DEIMOS_MAX_OUTPUT_TOKENS: process.env.DEIMOS_MAX_OUTPUT_TOKENS,
  DEIMOS_MAX_CONTEXT_TOKENS: process.env.DEIMOS_MAX_CONTEXT_TOKENS,
  USER_TYPE: process.env.USER_TYPE,
}

afterEach(() => {
  if (originalEnv.DEIMOS_USE_OPENAI === undefined) {
    delete process.env.DEIMOS_USE_OPENAI
  } else {
    process.env.DEIMOS_USE_OPENAI = originalEnv.DEIMOS_USE_OPENAI
  }
  if (originalEnv.DEIMOS_MAX_OUTPUT_TOKENS === undefined) {
    delete process.env.DEIMOS_MAX_OUTPUT_TOKENS
  } else {
    process.env.DEIMOS_MAX_OUTPUT_TOKENS =
      originalEnv.DEIMOS_MAX_OUTPUT_TOKENS
  }
  if (originalEnv.DEIMOS_MAX_CONTEXT_TOKENS === undefined) {
    delete process.env.DEIMOS_MAX_CONTEXT_TOKENS
  } else {
    process.env.DEIMOS_MAX_CONTEXT_TOKENS =
      originalEnv.DEIMOS_MAX_CONTEXT_TOKENS
  }
  if (originalEnv.USER_TYPE === undefined) {
    delete process.env.USER_TYPE
  } else {
    process.env.USER_TYPE = originalEnv.USER_TYPE
  }
})

test('deepseek-chat uses provider-specific context and output caps', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.DEIMOS_MAX_OUTPUT_TOKENS

  expect(getContextWindowForModel('deepseek-chat')).toBe(128_000)
  expect(getModelMaxOutputTokens('deepseek-chat')).toEqual({
    default: 8_192,
    upperLimit: 8_192,
  })
  expect(getMaxOutputTokensForModel('deepseek-chat')).toBe(8_192)
})

test('deepseek-chat clamps oversized max output overrides to the provider limit', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  process.env.DEIMOS_MAX_OUTPUT_TOKENS = '32000'

  expect(getMaxOutputTokensForModel('deepseek-chat')).toBe(8_192)
})

test('gpt-4o uses provider-specific context and output caps', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.DEIMOS_MAX_OUTPUT_TOKENS

  expect(getContextWindowForModel('gpt-4o')).toBe(128_000)
  expect(getModelMaxOutputTokens('gpt-4o')).toEqual({
    default: 16_384,
    upperLimit: 16_384,
  })
  expect(getMaxOutputTokensForModel('gpt-4o')).toBe(16_384)
})

test('gpt-4o clamps oversized max output overrides to the provider limit', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  process.env.DEIMOS_MAX_OUTPUT_TOKENS = '32000'

  expect(getMaxOutputTokensForModel('gpt-4o')).toBe(16_384)
})

test('gpt-5.4 family uses provider-specific context and output caps', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.DEIMOS_MAX_OUTPUT_TOKENS

  expect(getContextWindowForModel('gpt-5.4')).toBe(1_050_000)
  expect(getModelMaxOutputTokens('gpt-5.4')).toEqual({
    default: 128_000,
    upperLimit: 128_000,
  })

  expect(getContextWindowForModel('gpt-5.4-mini')).toBe(400_000)
  expect(getModelMaxOutputTokens('gpt-5.4-mini')).toEqual({
    default: 128_000,
    upperLimit: 128_000,
  })

  expect(getContextWindowForModel('gpt-5.4-nano')).toBe(400_000)
  expect(getModelMaxOutputTokens('gpt-5.4-nano')).toEqual({
    default: 128_000,
    upperLimit: 128_000,
  })
})

test('gpt-5.4 family keeps large max output overrides within provider limits', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  process.env.DEIMOS_MAX_OUTPUT_TOKENS = '200000'

  expect(getMaxOutputTokensForModel('gpt-5.4')).toBe(128_000)
  expect(getMaxOutputTokensForModel('gpt-5.4-mini')).toBe(128_000)
  expect(getMaxOutputTokensForModel('gpt-5.4-nano')).toBe(128_000)
})

test('unknown OpenAI-shim model uses conservative 8k context window', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.DEIMOS_MAX_OUTPUT_TOKENS

  const err = console.error
  console.error = () => {}
  try {
    expect(getContextWindowForModel('unknown-vendor-model-xyz')).toBe(8_000)
  } finally {
    console.error = err
  }
})

test('unknown OpenAI-shim model caps max output vs 8k window (avoids negative effective context)', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.DEIMOS_MAX_OUTPUT_TOKENS

  const err = console.error
  console.error = () => {}
  try {
    expect(getModelMaxOutputTokens('unknown-vendor-model-xyz')).toEqual({
      default: 2_000,
      upperLimit: 2_000,
    })
  } finally {
    console.error = err
  }
})

test('DEIMOS_MAX_CONTEXT_TOKENS applies for any user (not ant-only)', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  delete process.env.USER_TYPE
  process.env.DEIMOS_MAX_CONTEXT_TOKENS = '500000'
  expect(getContextWindowForModel('gpt-4o')).toBe(500_000)
})

test('DEIMOS_MAX_CONTEXT_TOKENS below floor is ignored', () => {
  process.env.DEIMOS_USE_OPENAI = '1'
  process.env.DEIMOS_MAX_CONTEXT_TOKENS = '100'
  expect(getContextWindowForModel('gpt-4o')).toBe(128_000)
})

test('DEIMOS_MAX_CONTEXT_TOKENS is clamped to ceiling', () => {
  delete process.env.DEIMOS_USE_OPENAI
  delete process.env.USER_TYPE
  process.env.DEIMOS_MAX_CONTEXT_TOKENS = '999999999'
  expect(getContextWindowForModel('claude-sonnet-4-5')).toBe(
    DEIMOS_MAX_CONTEXT_TOKENS_CEILING,
  )
})
