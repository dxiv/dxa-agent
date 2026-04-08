import type { LoadedPlugin } from '../../types/plugin.js'

/**
 * Top-level /plugin command UI navigation (tabs, flows). Passed as `setViewState` into child screens.
 */
export type ViewState =
  | { type: 'help' }
  | { type: 'validate'; path: string }
  | {
      type: 'browse-marketplace'
      targetMarketplace: string
      targetPlugin?: string
    }
  | { type: 'discover-plugins'; targetPlugin?: string }
  | {
      type: 'manage-plugins'
      targetPlugin?: string
      targetMarketplace?: string
      action?: 'enable' | 'disable' | 'uninstall'
    }
  | { type: 'marketplace-list' }
  | { type: 'add-marketplace'; initialValue?: string }
  | {
      type: 'manage-marketplaces'
      targetMarketplace?: string
      action?: 'remove' | 'update'
    }
  | { type: 'marketplace-menu' }
  | { type: 'menu' }
  | { type: 'plugin-options'; plugin: LoadedPlugin; pluginId: string }

export type PluginSettingsProps = {
  onComplete: (message?: string, options?: unknown) => void
  args?: string[]
  showMcpRedirectMessage?: boolean
}
