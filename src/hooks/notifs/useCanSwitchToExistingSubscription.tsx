import * as React from 'react';
import { getOauthProfileFromApiKey } from 'src/services/oauth/getOauthProfile.js';
import type { OAuthProfileResponse } from 'src/services/oauth/types.js';
import { isDeimosCloudSubscriber } from 'src/utils/auth.js';
import { Text } from '../../ink.js';
import { logEvent } from '../../services/analytics/index.js';
import { type GlobalConfig, getGlobalConfig, saveGlobalConfig } from '../../utils/config.js';
import { useStartupNotification } from './useStartupNotification.js';
const MAX_SHOW_COUNT = 3;

/**
 * Hook to check if the user has a subscription on Console but isn't logged into it.
 */
export function useCanSwitchToExistingSubscription() {
  useStartupNotification(_temp2);
}

/**
 * Checks if the user has a subscription but is not currently logged into it.
 * This helps inform users they should run /login to access their subscription.
 */
async function _temp2() {
  if ((getGlobalConfig().subscriptionNoticeCount ?? 0) >= MAX_SHOW_COUNT) {
    return null;
  }
  const subscriptionType = await getExistingClaudeSubscription();
  if (subscriptionType === null) {
    return null;
  }
  saveGlobalConfig(_temp);
  logEvent("tengu_switch_to_subscription_notice_shown", {});
  return {
    key: "switch-to-subscription",
    jsx: <Text color="suggestion">Use your existing Deimos {subscriptionType} plan with Deimos<Text color="text" dimColor={true}>{" "}· /login to activate</Text></Text>,
    priority: "low" as const
  };
}
function _temp(current: GlobalConfig) {
  return {
    ...current,
    subscriptionNoticeCount: (current.subscriptionNoticeCount ?? 0) + 1
  };
}
async function getExistingClaudeSubscription(): Promise<'Max' | 'Pro' | null> {
  // If already using subscription auth, there is nothing to switch to
  if (isDeimosCloudSubscriber()) {
    return null;
  }
  const profile = await getOauthProfileFromApiKey();
  if (!profile) {
    return null;
  }
  const account = profile.account as
    | (NonNullable<OAuthProfileResponse['account']> & {
        has_claude_max?: boolean;
        has_claude_pro?: boolean;
      })
    | undefined;
  if (!account) {
    return null;
  }
  if (account.has_claude_max) {
    return 'Max';
  }
  if (account.has_claude_pro) {
    return 'Pro';
  }
  return null;
}
