import { expect, test } from 'bun:test'

import { MCP_SERVER_INSTRUCTIONS_PREAMBLE, SKILL_DISCOVERY_HEADER } from './reminderCopy.js'

test('MCP instructions preamble matches prior prompts.ts shape', () => {
  expect(MCP_SERVER_INSTRUCTIONS_PREAMBLE.startsWith('# MCP Server Instructions\n\n')).toBe(
    true,
  )
  expect(MCP_SERVER_INSTRUCTIONS_PREAMBLE).toContain(
    'The following MCP servers have provided instructions',
  )
  expect(MCP_SERVER_INSTRUCTIONS_PREAMBLE.endsWith('resources:\n\n')).toBe(true)
})

test('skill discovery header is non-empty', () => {
  expect(SKILL_DISCOVERY_HEADER.length).toBeGreaterThan(4)
})
