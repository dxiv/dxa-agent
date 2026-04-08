// Open-build stub — full implementation is bundled only when feature('DAEMON') is on.
export async function runDaemonWorker(_kind?: string): Promise<void> {
  throw new Error('Daemon worker is unavailable in the open build.')
}
