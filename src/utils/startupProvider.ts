import { isLocalProviderUrl } from '../services/api/providerConfig.js'
import { getLocalOpenAICompatibleProviderLabel } from './providerDiscovery.js'

export type StartupProviderInfo = {
  name: string
  model: string
  baseUrl: string
  isLocal: boolean
}

/**
 * Same provider/model/endpoint resolution as the CLI startup banner (StartupScreen).
 * Used by onboarding welcome so provider info can render in Ink without duplicating logic.
 */
export function detectStartupProvider(): StartupProviderInfo {
  const useGemini =
    process.env.DEIMOS_USE_GEMINI === '1' ||
    process.env.DEIMOS_USE_GEMINI === 'true'
  const useGithub =
    process.env.DEIMOS_USE_GITHUB === '1' ||
    process.env.DEIMOS_USE_GITHUB === 'true'
  const useOpenAI =
    process.env.DEIMOS_USE_OPENAI === '1' ||
    process.env.DEIMOS_USE_OPENAI === 'true' ||
    process.env.DEIMOS_USE_OPENAI === '1' ||
    process.env.DEIMOS_USE_OPENAI === 'true'

  if (useGemini) {
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    const baseUrl =
      process.env.GEMINI_BASE_URL ||
      'https://generativelanguage.googleapis.com/v1beta/openai'
    return { name: 'Google Gemini', model, baseUrl, isLocal: false }
  }

  if (useGithub) {
    const model = process.env.OPENAI_MODEL || 'github:copilot'
    const baseUrl =
      process.env.OPENAI_BASE_URL || 'https://models.github.ai/inference'
    return { name: 'GitHub Models', model, baseUrl, isLocal: false }
  }

  if (useOpenAI) {
    const rawModel = process.env.OPENAI_MODEL || 'gpt-4o'
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const isLocal = isLocalProviderUrl(baseUrl)
    let name = 'OpenAI'
    if (/deepseek/i.test(baseUrl) || /deepseek/i.test(rawModel)) name = 'DeepSeek'
    else if (/openrouter/i.test(baseUrl)) name = 'OpenRouter'
    else if (/dashscope/i.test(baseUrl)) name = 'Qwen (DashScope)'
    else if (/perplexity\.ai/i.test(baseUrl)) name = 'Perplexity'
    else if (/together/i.test(baseUrl)) name = 'Together AI'
    else if (/groq/i.test(baseUrl)) name = 'Groq'
    else if (/mistral/i.test(baseUrl) || /mistral/i.test(rawModel)) name = 'Mistral'
    else if (/azure/i.test(baseUrl)) name = 'Azure OpenAI'
    else if (/llama/i.test(rawModel)) name = 'Meta Llama'
    else if (isLocal) name = getLocalOpenAICompatibleProviderLabel(baseUrl)

    let displayModel = rawModel
    const codexAliases: Record<
      string,
      { model: string; reasoningEffort?: string }
    > = {
      codexplan: { model: 'gpt-5.4', reasoningEffort: 'high' },
      'gpt-5.4': { model: 'gpt-5.4', reasoningEffort: 'high' },
      'gpt-5.3-codex': { model: 'gpt-5.3-codex', reasoningEffort: 'high' },
      'gpt-5.3-codex-spark': { model: 'gpt-5.3-codex-spark' },
      codexspark: { model: 'gpt-5.3-codex-spark' },
      'gpt-5.2-codex': { model: 'gpt-5.2-codex', reasoningEffort: 'high' },
      'gpt-5.1-codex-max': { model: 'gpt-5.1-codex-max', reasoningEffort: 'high' },
      'gpt-5.1-codex-mini': { model: 'gpt-5.1-codex-mini' },
      'gpt-5.4-mini': { model: 'gpt-5.4-mini', reasoningEffort: 'medium' },
      'gpt-5.2': { model: 'gpt-5.2', reasoningEffort: 'medium' },
    }
    const alias = rawModel.toLowerCase()
    if (alias in codexAliases) {
      const resolved = codexAliases[alias]!
      displayModel = resolved.model
      if (resolved.reasoningEffort) {
        displayModel = `${displayModel} (${resolved.reasoningEffort})`
      }
    }

    return { name, model: displayModel, baseUrl, isLocal }
  }

  const model =
    process.env.ANTHROPIC_MODEL ||
    process.env.CLAUDE_MODEL ||
    'claude-sonnet-4-6'
  return {
    name: 'Anthropic',
    model,
    baseUrl: 'https://api.anthropic.com',
    isLocal: false,
  }
}
