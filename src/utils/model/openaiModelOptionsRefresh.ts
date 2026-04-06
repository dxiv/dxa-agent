import {
  getActiveOpenAIModelOptionsCache,
  setActiveOpenAIModelOptionsCache,
} from '../providerProfiles.js'
import type { ModelOption } from './modelOptions.js'
import { discoverOpenAICompatibleModelOptions } from './openaiModelDiscovery.js'
import { getAPIProvider } from './providers.js'

function haveSameModelOptions(
  left: ModelOption[],
  right: ModelOption[],
): boolean {
  if (left.length !== right.length) {
    return false
  }
  return left.every((option, index) => {
    const other = right[index]
    return (
      other !== undefined &&
      option.value === other.value &&
      option.label === other.label &&
      option.description === other.description &&
      option.descriptionForModel === other.descriptionForModel
    )
  })
}

export async function refreshOpenAIModelOptionsCache(): Promise<void> {
  if (getAPIProvider() !== 'openai') {
    return
  }
  try {
    const discoveredOptions = await discoverOpenAICompatibleModelOptions()
    if (discoveredOptions.length === 0) {
      return
    }
    const currentOptions = getActiveOpenAIModelOptionsCache()
    if (haveSameModelOptions(currentOptions, discoveredOptions)) {
      return
    }
    setActiveOpenAIModelOptionsCache(discoveredOptions)
  } catch {
    // Keep /model usable even if endpoint discovery fails.
  }
}
