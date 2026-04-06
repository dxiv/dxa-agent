import type { StdoutMessage } from 'src/entrypoints/sdk/controlTypes.js'

/**
 * Shared transport surface for WebSocket / SSE / hybrid CLI↔CCR bridges.
 */
export interface Transport {
  connect(): Promise<void>
  write(message: StdoutMessage): Promise<void>
  close(): void
  setOnData(callback: (data: string) => void): void
  setOnClose(callback: (closeCode?: number) => void): void
  isConnectedStatus(): boolean
  isClosedStatus(): boolean
  setOnConnect?(callback: () => void): void
  getStateLabel?(): string
}
