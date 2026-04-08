// Open-build stub — background session CLI is bundled only when feature('BG_SESSIONS') is on.
export async function psHandler(_args: string[]): Promise<void> {
  throw new Error('Background sessions are unavailable in the open build.')
}

export async function logsHandler(_sessionId?: string): Promise<void> {
  throw new Error('Background sessions are unavailable in the open build.')
}

export async function attachHandler(_sessionId?: string): Promise<void> {
  throw new Error('Background sessions are unavailable in the open build.')
}

export async function killHandler(_sessionId?: string): Promise<void> {
  throw new Error('Background sessions are unavailable in the open build.')
}

export async function handleBgFlag(_args: string[]): Promise<void> {
  throw new Error('Background sessions are unavailable in the open build.')
}
