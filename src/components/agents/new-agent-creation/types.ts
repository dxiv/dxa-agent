import type { AgentColorName } from '../../../tools/AgentTool/agentColorManager.js'
import type { AgentMemoryScope } from '../../../tools/AgentTool/agentMemory.js'
import type { CustomAgentDefinition } from '../../../tools/AgentTool/loadAgentsDir.js'
import type { SettingSource } from '../../../utils/settings/constants.js'

/**
 * Data collected across CreateAgentWizard steps (incrementally filled).
 */
export type GeneratedAgentPayload = {
  identifier: string
  whenToUse: string
  systemPrompt: string
}

export type AgentWizardData = {
  agentType?: string
  description?: string
  whenToUse?: string
  systemPrompt?: string
  color?: string
  location?: SettingSource
  model?: string
  tools?: string[]
  memory?: string
  method?: 'generate' | 'manual'
  generationPrompt?: string
  isGenerating?: boolean
  wasGenerated?: boolean
  selectedModel?: string
  selectedTools?: string[]
  selectedColor?: AgentColorName
  selectedMemory?: AgentMemoryScope
  finalAgent?: CustomAgentDefinition
  generatedAgent?: GeneratedAgentPayload
}
