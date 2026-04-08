import type {
  ConfigScope,
  MCPServerConnection,
  McpDeimosCloudProxyServerConfig,
  McpHTTPServerConfig,
  McpSSEServerConfig,
  McpStdioServerConfig,
} from '../../services/mcp/types.js'

type ServerInfoBase = {
  name: string
  scope: ConfigScope
  client: MCPServerConnection
  isAuthenticated?: boolean
}

export type StdioServerInfo = ServerInfoBase & {
  transport: 'stdio'
  config: McpStdioServerConfig
}

export type SSEServerInfo = ServerInfoBase & {
  transport: 'sse'
  config: McpSSEServerConfig
}

export type HTTPServerInfo = ServerInfoBase & {
  transport: 'http'
  config: McpHTTPServerConfig
}

export type DeimosCloudServerInfo = ServerInfoBase & {
  transport: 'claudeai-proxy'
  config: McpDeimosCloudProxyServerConfig
}

export type ServerInfo =
  | StdioServerInfo
  | SSEServerInfo
  | HTTPServerInfo
  | DeimosCloudServerInfo

/** Agent frontmatter MCP — may need pre-auth before the agent runs */
export type AgentMcpServerInfo = {
  name: string
  needsAuth?: boolean
  url?: string
  transport?: string
  /** stdio agent MCP — from `extractAgentMcpServers` */
  command?: string
  /** Agents whose frontmatter references this inline server */
  sourceAgents: string[]
  /** Whether OAuth credentials already exist for this server (HTTP/SSE) */
  isAuthenticated?: boolean
}

export type MCPViewState =
  | { type: 'list' }
  | { type: string; [key: string]: unknown }
