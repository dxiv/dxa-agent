// Open-build stub — full implementation is bundled only when feature('DAEMON') is on.
export async function daemonMain(_args: string[]): Promise<void> {
  throw new Error('Daemon mode is unavailable in the open build.')
}
