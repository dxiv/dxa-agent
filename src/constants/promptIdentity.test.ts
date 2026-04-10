import { afterEach, expect, test } from 'bun:test'

import { getSystemPrompt, DEFAULT_AGENT_PROMPT } from './prompts.js'
import { CLI_SYSPROMPT_PREFIXES, getCLISyspromptPrefix } from './system.js'
import { GENERAL_PURPOSE_AGENT } from '../tools/AgentTool/built-in/generalPurposeAgent.js'
import { EXPLORE_AGENT } from '../tools/AgentTool/built-in/exploreAgent.js'

const originalSimpleEnv = process.env.DEIMOS_SIMPLE

afterEach(() => {
  process.env.DEIMOS_SIMPLE = originalSimpleEnv
})

test('CLI identity prefixes describe Deimos (not legacy Anthropic CLI wording)', () => {
  expect(getCLISyspromptPrefix()).toContain('Deimos')
  expect(getCLISyspromptPrefix()).not.toContain("Anthropic's official CLI for Deimos")

  for (const prefix of CLI_SYSPROMPT_PREFIXES) {
    expect(prefix).toContain('Deimos')
    expect(prefix).not.toContain("Anthropic's official CLI for Deimos")
  }
})

test('simple mode identity describes Deimos (not legacy Anthropic CLI wording)', async () => {
  process.env.DEIMOS_SIMPLE = '1'

  const prompt = await getSystemPrompt([], 'gpt-4o')

  expect(prompt[0]).toContain('Deimos')
  expect(prompt[0]).not.toContain("Anthropic's official CLI for Deimos")
})

test('built-in agent prompts describe Deimos (not legacy Anthropic CLI wording)', () => {
  expect(DEFAULT_AGENT_PROMPT).toContain('Deimos')
  expect(DEFAULT_AGENT_PROMPT).not.toContain("Anthropic's official CLI for Deimos")

  const generalPrompt = GENERAL_PURPOSE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(generalPrompt).toContain('Deimos')
  expect(generalPrompt).not.toContain("Anthropic's official CLI for Deimos")

  const explorePrompt = EXPLORE_AGENT.getSystemPrompt({
    toolUseContext: { options: {} as never },
  })
  expect(explorePrompt).toContain('Deimos')
  expect(explorePrompt).not.toContain("Anthropic's official CLI for Deimos")
})
