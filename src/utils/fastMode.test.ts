import { afterEach, describe, expect, mock, test } from 'bun:test'

import * as growthbookActual from 'src/services/analytics/growthbook.js'
import * as analyticsActual from '../services/analytics/index.js'
import * as oauthActual from 'src/constants/oauth.js'
import * as bootstrapStateActual from '../bootstrap/state.js'
import * as authActual from './auth.js'
import * as bundledModeActual from './bundledMode.js'
import * as configActual from './config.js'
import * as debugActual from './debug.js'
import * as envUtilsActual from './envUtils.js'
import * as modelModelActual from './model/model.js'
import * as privacyLevelActual from './privacyLevel.js'
import * as settingsActual from './settings/settings.js'
import * as signalActual from './signal.js'

const originalEnv = { ...process.env }

function clearThirdPartyProviderFlags(): void {
  delete process.env.CLAUDE_CODE_USE_OPENAI
  delete process.env.CLAUDE_CODE_USE_GEMINI
  delete process.env.CLAUDE_CODE_USE_GITHUB
  delete process.env.CLAUDE_CODE_USE_BEDROCK
  delete process.env.CLAUDE_CODE_USE_VERTEX
  delete process.env.CLAUDE_CODE_USE_FOUNDRY
}

async function importFreshFastModeModule() {
  return import(`./fastMode.ts?ts=${Date.now()}-${Math.random()}`)
}

function installCommonMocks(options?: {
  cachedEnabled?: boolean
  apiKey?: string | null
  oauthToken?: string | null
  hasProfileScope?: boolean
  axiosReject?: boolean
}) {
  mock.module('axios', () => ({
    default: {
      get: options?.axiosReject
        ? async () => {
            throw new Error('network fail')
          }
        : async () => ({ data: { enabled: false, disabled_reason: 'preference' } }),
      isAxiosError: () => false,
    },
  }))

  mock.module('src/constants/oauth.js', () => ({
    ...oauthActual,
    getOauthConfig: () => ({ BASE_API_URL: 'https://api.anthropic.com' }),
    OAUTH_BETA_HEADER: 'test-beta',
  }))

  mock.module('src/services/analytics/growthbook.js', () => ({
    ...growthbookActual,
    getFeatureValue_CACHED_MAY_BE_STALE: (_name: string, defaultValue: unknown) =>
      defaultValue,
  }))

  mock.module('../bootstrap/state.js', () => ({
    ...bootstrapStateActual,
    getIsNonInteractiveSession: () => false,
    getKairosActive: () => false,
    preferThirdPartyAuthentication: () => false,
  }))

  mock.module('../services/analytics/index.js', () => ({
    ...analyticsActual,
    logEvent: () => {},
  }))

  mock.module('./auth.js', () => ({
    ...authActual,
    getAnthropicApiKey: () => options?.apiKey ?? null,
    getDeimosCloudOAuthTokens: () =>
      options?.oauthToken ? { accessToken: options.oauthToken } : null,
    handleOAuth401Error: async () => {},
    hasProfileScope: () => options?.hasProfileScope ?? false,
  }))

  mock.module('./bundledMode.js', () => ({
    ...bundledModeActual,
    isInBundledMode: () => true,
  }))

  mock.module('./config.js', () => ({
    ...configActual,
    getGlobalConfig: () => ({
      penguinModeOrgEnabled: options?.cachedEnabled === true,
    }),
    saveGlobalConfig: (updater: (current: Record<string, unknown>) => Record<string, unknown>) =>
      updater({ penguinModeOrgEnabled: options?.cachedEnabled === true }),
  }))

  mock.module('./debug.js', () => ({
    ...debugActual,
    logForDebugging: () => {},
  }))

  mock.module('./envUtils.js', () => ({
    ...envUtilsActual,
    isEnvTruthy: (value: string | undefined) =>
      !!value && value !== '0' && value.toLowerCase() !== 'false',
  }))

  mock.module('./model/model.js', () => ({
    ...modelModelActual,
    getDefaultMainLoopModelSetting: () => 'claude-sonnet-4-6',
    isOpus1mMergeEnabled: () => false,
    parseUserSpecifiedModel: (model: string) => model,
  }))

  mock.module('./privacyLevel.js', () => ({
    ...privacyLevelActual,
    isEssentialTrafficOnly: () => false,
  }))

  mock.module('./settings/settings.js', () => ({
    ...settingsActual,
    getInitialSettings: () => ({ fastMode: true }),
    getSettingsForSource: () => ({}),
    updateSettingsForSource: () => {},
  }))

  mock.module('./signal.js', () => ({
    ...signalActual,
    createSignal: () => {
      const subscribe = () => () => {}
      const emit = () => {}
      return { subscribe, emit }
    },
  }))
}

afterEach(() => {
  mock.restore()
  process.env = { ...originalEnv }
})

describe('fastMode ant-only fallback cleanup', () => {
  test('resolveFastModeStatusFromCache does not force-enable from USER_TYPE=ant', async () => {
    clearThirdPartyProviderFlags()
    process.env.USER_TYPE = 'ant'
    installCommonMocks({ cachedEnabled: false })

    const {
      resolveFastModeStatusFromCache,
      getFastModeUnavailableReason,
    } = await importFreshFastModeModule()

    resolveFastModeStatusFromCache()

    expect(getFastModeUnavailableReason()).toBe(
      'Fast mode is currently unavailable',
    )
  })

  test('prefetchFastModeStatus without auth does not force-enable from USER_TYPE=ant', async () => {
    clearThirdPartyProviderFlags()
    process.env.USER_TYPE = 'ant'
    installCommonMocks({ cachedEnabled: false, apiKey: null, oauthToken: null })

    const {
      prefetchFastModeStatus,
      getFastModeUnavailableReason,
    } = await importFreshFastModeModule()

    await prefetchFastModeStatus()

    expect(getFastModeUnavailableReason()).toBe(
      'Fast mode has been disabled by your organization',
    )
  })

  test('prefetchFastModeStatus network failure does not force-enable from USER_TYPE=ant', async () => {
    clearThirdPartyProviderFlags()
    process.env.USER_TYPE = 'ant'
    installCommonMocks({
      cachedEnabled: false,
      apiKey: 'test-key',
      axiosReject: true,
    })

    const {
      prefetchFastModeStatus,
      getFastModeUnavailableReason,
    } = await importFreshFastModeModule()

    await prefetchFastModeStatus()

    expect(getFastModeUnavailableReason()).toBe(
      'Fast mode unavailable due to network connectivity issues',
    )
  })
})
