import type { Command } from '../commands.js'
import type { ConnectedMCPServer } from '../services/mcp/types.js'

/**
 * Stub: MCP skill discovery from `skill://` resources. Replace with a real
 * implementation when the MCP_SKILLS feature is wired up.
 */
async function fetchMcpSkillsForClientImpl(
  _client: ConnectedMCPServer,
): Promise<Command[]> {
  return []
}

/** Memoization cache keyed by MCP server name (see `fetchCommandsForClient`). */
const fetchMcpSkillsCache = new Map<string, unknown>()

export const fetchMcpSkillsForClient = Object.assign(
  fetchMcpSkillsForClientImpl,
  { cache: fetchMcpSkillsCache },
)
