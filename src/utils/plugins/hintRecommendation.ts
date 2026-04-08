/**
 * Plugin-hint recommendations.
 *
 * Companion to lspRecommendation.ts: where LSP recommendations are triggered
 * by file edits, plugin hints are triggered by CLIs/SDKs emitting a
 * `<deimos-hint />` tag.
 *
 * State persists in GlobalConfig.deimosHints.
 */

import { getFeatureValue_CACHED_MAY_BE_STALE } from '../../services/analytics/growthbook.js'
import {
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  type AnalyticsMetadata_I_VERIFIED_THIS_IS_PII_TAGGED,
  logEvent,
} from '../../services/analytics/index.js'
import type { GlobalConfig } from '../config.js'
import { getGlobalConfig, saveGlobalConfig } from '../config.js'
import {
  type DeimosHint,
  hasShownHintThisSession,
  setPendingHint,
} from '../deimosHints.js'
import { logForDebugging } from '../debug.js'
import { isPluginInstalled } from './installedPluginsManager.js'
import { getPluginById } from './marketplaceManager.js'
import {
  isOfficialMarketplaceName,
  parsePluginIdentifier,
} from './pluginIdentifier.js'
import { isPluginBlockedByPolicy } from './pluginPolicy.js'

const MAX_SHOWN_PLUGINS = 100

function getHintsState(c: GlobalConfig) {
  return c.deimosHints
}

export type PluginHintRecommendation = {
  pluginId: string
  pluginName: string
  marketplaceName: string
  pluginDescription?: string
  sourceCommand: string
}

export function maybeRecordPluginHint(hint: DeimosHint): void {
  if (!getFeatureValue_CACHED_MAY_BE_STALE('tengu_lapis_finch', false)) return
  if (hasShownHintThisSession()) return

  const state = getHintsState(getGlobalConfig())
  if (state?.disabled) return

  const shown = state?.plugin ?? []
  if (shown.length >= MAX_SHOWN_PLUGINS) return

  const pluginId = hint.value
  const { name, marketplace } = parsePluginIdentifier(pluginId)
  if (!name || !marketplace) return
  if (!isOfficialMarketplaceName(marketplace)) return
  if (shown.includes(pluginId)) return
  if (isPluginInstalled(pluginId)) return
  if (isPluginBlockedByPolicy(pluginId)) return

  if (triedThisSession.has(pluginId)) return
  triedThisSession.add(pluginId)

  setPendingHint(hint)
}

const triedThisSession = new Set<string>()

export function _resetHintRecommendationForTesting(): void {
  triedThisSession.clear()
}

export async function resolvePluginHint(
  hint: DeimosHint,
): Promise<PluginHintRecommendation | null> {
  const pluginId = hint.value
  const { name, marketplace } = parsePluginIdentifier(pluginId)

  const pluginData = await getPluginById(pluginId)

  logEvent('tengu_plugin_hint_detected', {
    _PROTO_plugin_name: (name ??
      '') as AnalyticsMetadata_I_VERIFIED_THIS_IS_PII_TAGGED,
    _PROTO_marketplace_name: (marketplace ??
      '') as AnalyticsMetadata_I_VERIFIED_THIS_IS_PII_TAGGED,
    result: (pluginData
      ? 'passed'
      : 'not_in_cache') as AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS,
  })

  if (!pluginData) {
    logForDebugging(
      `[hintRecommendation] ${pluginId} not found in marketplace cache`,
    )
    return null
  }

  return {
    pluginId,
    pluginName: pluginData.entry.name,
    marketplaceName: marketplace ?? '',
    pluginDescription: pluginData.entry.description,
    sourceCommand: hint.sourceCommand,
  }
}

export function markHintPluginShown(pluginId: string): void {
  saveGlobalConfig(current => {
    const prev = getHintsState(current)
    const existing = prev?.plugin ?? []
    if (existing.includes(pluginId)) return current
    return {
      ...current,
      deimosHints: {
        ...prev,
        plugin: [...existing, pluginId],
      },
    }
  })
}

export function disableHintRecommendations(): void {
  saveGlobalConfig(current => {
    const prev = getHintsState(current)
    if (prev?.disabled) return current
    return {
      ...current,
      deimosHints: { ...prev, disabled: true },
    }
  })
}
