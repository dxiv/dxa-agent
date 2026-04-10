import * as React from 'react';
import type { Notification } from '../context/notifications.js';
import { Text } from '../ink.js';
import { isDeimosCloudSubscriber } from '../utils/auth.js';
import { isChromeExtensionInstalled, shouldEnableDeimosInChrome } from '../utils/deimosInChrome/setup.js';
import { isRunningOnHomespace } from '../utils/envUtils.js';
import { useStartupNotification } from './notifs/useStartupNotification.js';
function getChromeFlag(): boolean | undefined {
  if (process.argv.includes('--chrome')) {
    return true;
  }
  if (process.argv.includes('--no-chrome')) {
    return false;
  }
  return undefined;
}
export function useChromeExtensionNotification() {
  useStartupNotification(_temp);
}
async function _temp(): Promise<Notification | null> {
  const chromeFlag = getChromeFlag();
  if (!shouldEnableDeimosInChrome(chromeFlag)) {
    return null;
  }
  if (true && !isDeimosCloudSubscriber()) {
    return {
      key: "chrome-requires-subscription",
      jsx: <Text color="error">Deimos in Chrome requires a dxa.dev/deimos subscription</Text>,
      priority: "immediate",
      timeoutMs: 5000
    };
  }
  const installed = await isChromeExtensionInstalled();
  if (!installed && !isRunningOnHomespace()) {
    return {
      key: "chrome-extension-not-detected",
      jsx: <Text color="warning">Chrome extension not detected · https://dxa.dev/deimos/chrome to install</Text>,
      priority: "immediate",
      timeoutMs: 3000
    };
  }
  if (chromeFlag === undefined) {
    return {
      key: "claude-in-chrome-default-enabled",
      text: "Deimos in Chrome enabled \xB7 /chrome",
      priority: "low"
    };
  }
  return null;
}
