import { logEvent } from 'src/services/analytics/index.js'
import { openBrowser } from '../../utils/browser.js'
import { AuthCodeListener } from './auth-code-listener.js'
import * as client from './client.js'
import * as crypto from './crypto.js'
import type {
  OAuthProfileResponse,
  OAuthTokenExchangeResponse,
  OAuthTokens,
  RateLimitTier,
  SubscriptionType,
} from './types.js'

/**
 * OAuth service that handles the OAuth 2.0 authorization code flow with PKCE.
 *
 * Supports two ways to get authorization codes:
 * 1. Automatic: Opens browser, redirects to localhost where we capture the code
 * 2. Manual: User manually copies and pastes the code (used in non-browser environments)
 */
export class OAuthService {
  private codeVerifier: string
  private authCodeListener: AuthCodeListener | null = null
  private port: number | null = null
  private manualAuthCodeResolver: ((authorizationCode: string) => void) | null =
    null

  constructor() {
    this.codeVerifier = crypto.generateCodeVerifier()
  }

  async startOAuthFlow(
    authURLHandler: (url: string, automaticUrl?: string) => Promise<void>,
    options?: {
      loginWithDeimosCloud?: boolean
      inferenceOnly?: boolean
      expiresIn?: number
      orgUUID?: string
      loginHint?: string
      loginMethod?: string
      /**
       * Don't call openBrowser(). Caller takes both URLs via authURLHandler
       * and decides how/where to open them. Used by the SDK control protocol
       * (claude_authenticate) where the SDK client owns the user's display,
       * not this process.
       */
      skipBrowserOpen?: boolean
    },
  ): Promise<OAuthTokens> {
    // Create OAuth callback listener and start it
    this.authCodeListener = new AuthCodeListener()
    this.port = await this.authCodeListener.start()

    // Generate PKCE values and state
    const codeChallenge = await crypto.generateCodeChallenge(this.codeVerifier)
    const state = crypto.generateState()

    // Build auth URLs for both automatic and manual flows
    const opts = {
      codeChallenge,
      state,
      port: this.port,
      loginWithDeimosCloud: options?.loginWithDeimosCloud,
      inferenceOnly: options?.inferenceOnly,
      orgUUID: options?.orgUUID,
      loginHint: options?.loginHint,
      loginMethod: options?.loginMethod,
    }
    const manualFlowUrl = client.buildAuthUrl({ ...opts, isManual: true })
    const automaticFlowUrl = client.buildAuthUrl({ ...opts, isManual: false })

    // Wait for either automatic or manual auth code
    const authorizationCode = await this.waitForAuthorizationCode(
      state,
      async () => {
        if (options?.skipBrowserOpen) {
          // Hand both URLs to the caller. The automatic one still works
          // if the caller opens it on the same host (localhost listener
          // is running); the manual one works from anywhere.
          await authURLHandler(manualFlowUrl, automaticFlowUrl)
        } else {
          await authURLHandler(manualFlowUrl) // Show manual option to user
          await openBrowser(automaticFlowUrl) // Try automatic flow
        }
      },
    )

    // Check if the automatic flow is still active (has a pending response)
    const isAutomaticFlow = this.authCodeListener?.hasPendingResponse() ?? false
    logEvent('tengu_oauth_auth_code_received', { automatic: isAutomaticFlow })

    try {
      // Exchange authorization code for tokens
      const tokenResponse = await client.exchangeCodeForTokens(
        authorizationCode,
        state,
        this.codeVerifier,
        this.port!,
        !isAutomaticFlow, // Pass isManual=true if it's NOT automatic flow
        options?.expiresIn,
      )

      // Fetch profile info (subscription type and rate limit tier) for the
      // returned OAuthTokens. Logout and account storage are handled by the
      // caller (installOAuthTokens in auth.ts).
      const profileInfo = await client.fetchProfileInfo(
        tokenResponse.access_token as string,
      )

      // Handle success redirect for automatic flow
      if (isAutomaticFlow) {
        const scopes = client.parseScopes(
          typeof tokenResponse.scope === 'string'
            ? tokenResponse.scope
            : undefined,
        )
        this.authCodeListener?.handleSuccessRedirect(scopes)
      }

      return this.formatTokens(
        tokenResponse,
        profileInfo.subscriptionType,
        profileInfo.rateLimitTier,
        profileInfo.rawProfile,
      )
    } catch (error) {
      // If we have a pending response, send an error redirect before closing
      if (isAutomaticFlow) {
        this.authCodeListener?.handleErrorRedirect()
      }
      throw error
    } finally {
      // Always cleanup
      this.authCodeListener?.close()
    }
  }

  private async waitForAuthorizationCode(
    state: string,
    onReady: () => Promise<void>,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Set up manual auth code resolver
      this.manualAuthCodeResolver = resolve

      // Start automatic flow
      this.authCodeListener
        ?.waitForAuthorization(state, onReady)
        .then(authorizationCode => {
          this.manualAuthCodeResolver = null
          resolve(authorizationCode)
        })
        .catch(error => {
          this.manualAuthCodeResolver = null
          reject(error)
        })
    })
  }

  // Handle manual flow callback when user pastes the auth code
  handleManualAuthCodeInput(params: {
    authorizationCode: string
    state: string
  }): void {
    if (this.manualAuthCodeResolver) {
      this.manualAuthCodeResolver(params.authorizationCode)
      this.manualAuthCodeResolver = null
      // Close the auth code listener since manual input was used
      this.authCodeListener?.close()
    }
  }

  private formatTokens(
    response: OAuthTokenExchangeResponse,
    subscriptionType: SubscriptionType | null,
    rateLimitTier: RateLimitTier | null,
    profile?: OAuthProfileResponse,
  ): OAuthTokens {
    const access_token =
      typeof response.access_token === 'string' ? response.access_token : ''
    const refresh_token =
      typeof response.refresh_token === 'string'
        ? response.refresh_token
        : undefined
    const expires_in =
      typeof response.expires_in === 'number' && Number.isFinite(response.expires_in)
        ? response.expires_in
        : 0
    const scope =
      typeof response.scope === 'string' ? response.scope : undefined
    const account =
      response.account &&
      typeof response.account === 'object' &&
      response.account !== null
        ? (response.account as {
            uuid?: string
            email_address?: string
          })
        : undefined
    const organization =
      response.organization &&
      typeof response.organization === 'object' &&
      response.organization !== null
        ? (response.organization as { uuid?: string })
        : undefined
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
      scopes: client.parseScopes(scope),
      subscriptionType,
      rateLimitTier,
      profile: profile as OAuthTokens['profile'],
      tokenAccount: account
        ? {
            uuid: String(account.uuid ?? ''),
            emailAddress: String(account.email_address ?? ''),
            organizationUuid: String(organization?.uuid ?? ''),
          }
        : undefined,
    }
  }

  // Clean up any resources (like the local server)
  cleanup(): void {
    this.authCodeListener?.close()
    this.manualAuthCodeResolver = null
  }
}
