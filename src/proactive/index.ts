/** Open-build stub — proactive UX is gated behind PROACTIVE / KAIROS. */

export function isProactiveActive(): boolean {
  return false
}

export function isProactivePaused(): boolean {
  return false
}

export function activateProactive(_reason: string): void {}

export function deactivateProactive(): void {}

export function pauseProactive(): void {}

export function resumeProactive(): void {}

export function setContextBlocked(_blocked: boolean): void {}

export function subscribeToProactiveChanges(_cb: () => void): () => void {
  return () => {}
}

export function getNextTickAt(): null {
  return null
}
