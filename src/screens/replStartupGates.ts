/**
 * Startup gates for the REPL.
 *
 * Prevents startup plugin checks and recommendation dialogs from stealing
 * focus before the user has interacted with the prompt.
 */
export function shouldRunStartupChecks(options: {
  isRemoteSession: boolean
  hasStarted: boolean
  hasHadFirstSubmission: boolean
}): boolean {
  if (options.isRemoteSession) return false
  if (options.hasStarted) return false
  if (!options.hasHadFirstSubmission) return false
  return true
}

