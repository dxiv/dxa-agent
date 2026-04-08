import type { OAuthTokens } from '../../services/oauth/types.js'
import { createFallbackStorage } from './fallbackStorage.js'
import { macOsKeychainStorage } from './macOsKeychainStorage.js'
import { linuxSecretStorage } from './linuxSecretStorage.js'
import { windowsCredentialStorage } from './windowsCredentialStorage.js'
import { plainTextStorage } from './plainTextStorage.js'

export interface SecureStorageData {
  /** Primary: Deimos / Anthropic web subscription OAuth tokens. */
  deimosCloudOauth?: OAuthTokens
  /** @deprecated Legacy key; still read for migration (see auth.ts). */
  claudeAiOauth?: OAuthTokens
  mcpOAuth?: Record<
    string,
    {
      serverName: string
      serverUrl: string
      accessToken: string
      refreshToken?: string
      expiresAt: number
      scope?: string
      clientId?: string
      clientSecret?: string
      discoveryState?: {
        authorizationServerUrl: string
        resourceMetadataUrl?: string
      }
      stepUpScope?: string
    }
  >
  mcpOAuthClientConfig?: Record<string, { clientSecret: string }>
  /** XAA IdP id_token cache keyed by normalized issuer (see `issuerKey`). */
  mcpXaaIdp?: Record<string, { idToken: string; expiresAt: number }>
  /** XAA IdP confidential client secrets keyed by normalized issuer. */
  mcpXaaIdpConfig?: Record<string, { clientSecret: string }>
  trustedDeviceToken?: string
  pluginSecrets?: Record<string, Record<string, string>>
}

export interface SecureStorage {
  name: string
  read(): SecureStorageData | null
  readAsync(): Promise<SecureStorageData | null>
  update(data: SecureStorageData): { success: boolean; warning?: string }
  delete(): boolean
}

/**
 * Get the appropriate secure storage implementation for the current platform.
 * Prefers native OS vaults (Keychain, libsecret, Credential Locker) with a plaintext fallback.
 */
export function getSecureStorage(): SecureStorage {
  if (process.platform === 'darwin') {
    return createFallbackStorage(macOsKeychainStorage, plainTextStorage)
  }

  if (process.platform === 'linux') {
    return createFallbackStorage(linuxSecretStorage, plainTextStorage)
  }

  if (process.platform === 'win32') {
    return createFallbackStorage(windowsCredentialStorage, plainTextStorage)
  }

  return plainTextStorage
}
