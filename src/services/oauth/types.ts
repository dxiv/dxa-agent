export type SubscriptionType = string | null
export type RateLimitTier = string | null
export type BillingType = string | null

export type OAuthProfilePayload = {
  account: {
    uuid: string
    email: string
    display_name?: string
    created_at?: string
  }
  organization: {
    uuid: string
    has_extra_usage_enabled?: boolean
    billing_type?: string
    subscription_created_at?: string
  }
}

export type OAuthTokenAccountFallback = {
  uuid: string
  emailAddress: string
  organizationUuid: string
}

export type OAuthTokens = {
  accessToken: string
  refreshToken?: string
  expiresAt?: number
  scope?: string
  scopes?: string[]
  subscriptionType?: SubscriptionType
  profile?: OAuthProfilePayload
  tokenAccount?: OAuthTokenAccountFallback
}

export type OAuthTokenExchangeResponse = Record<string, unknown>
export type OAuthProfileResponse = Record<string, unknown>
export type UserRolesResponse = Record<string, unknown>
