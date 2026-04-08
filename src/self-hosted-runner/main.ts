// Open-build stub — self-hosted runner is bundled only when feature('SELF_HOSTED_RUNNER') is on.
export async function selfHostedRunnerMain(_args: string[]): Promise<void> {
  throw new Error('Self-hosted runner is unavailable in the open build.')
}
