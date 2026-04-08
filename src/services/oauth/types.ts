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
    organization_type?: string
    rate_limit_tier?: string
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
  /** Present for Claude.ai subscriber tokens; mirrored in secure storage. */
  rateLimitTier?: RateLimitTier
  profile?: OAuthProfilePayload
  tokenAccount?: OAuthTokenAccountFallback
}

export type OAuthTokenExchangeResponse = Record<string, unknown>
/** Response body from `/api/oauth/profile` and `/api/claude_cli_profile` */
export type OAuthProfileResponse = Partial<OAuthProfilePayload> & Record<string, unknown>
export type UserRolesResponse = Record<string, unknown>

/** Guest-pass / referral API campaign id (e.g. `claude_code_guest_pass`). */
export type ReferralCampaign = string

export type ReferrerRewardInfo = {
  currency: string
  amount_minor_units: number
}

export type ReferralEligibilityResponse = {
  eligible: boolean
  remaining_passes?: number | null
  referrer_reward?: ReferrerRewardInfo | null
  referral_code_details?: {
    referral_link?: string
    campaign?: string
  } | null
}

export type ReferralRedemptionsResponse = {
  redemptions?: unknown[]
  limit?: number
}
