/** Declarations for optional / internal packages not shipped in this repo. */

declare module 'asciichart' {
  function plot(
    data: number[],
    cfg?: Record<string, unknown>,
  ): string
  export default plot
}

declare module '@ant/computer-use-mcp/sentinelApps' {
  export const sentinelApps: Record<string, unknown>
}

declare module '@ant/computer-use-mcp/types' {
  export type ComputerUseTypes = Record<string, unknown>
}

declare module '*.md' {
  const content: string
  export default content
}

/** Optional native / internal packages (not always installed). */
declare module '@ant/claude-for-chrome-mcp' {
  const m: Record<string, unknown>
  export default m
}

declare module 'plist' {
  export function parse(data: string | Buffer): unknown
}

declare module 'audio-capture-napi' {
  export function isNativeAudioAvailable(): boolean
}

declare module 'image-processor-napi' {
  export function processImage(input: unknown): unknown
}

declare module '@aws-sdk/client-sts' {
  export class STSClient {
    constructor(config?: unknown)
    send(command: unknown): Promise<unknown>
  }
  export class GetCallerIdentityCommand {
    constructor(input?: unknown)
  }
}

declare module 'cacache' {
  export function get(cache: string, key: string): Promise<unknown>
}

declare module '@ant/computer-use-mcp' {
  export const computerUseMcp: Record<string, unknown>
}

declare module '@ant/computer-use-input' {
  export const computerUseInput: Record<string, unknown>
}

declare module '@ant/computer-use-swift' {
  export const computerUseSwift: Record<string, unknown>
}

declare module 'url-handler-napi' {
  export function registerHandler(cb: (url: string) => void): void
}

declare module '@anthropic-ai/mcpb' {
  export type Mcpb = Record<string, unknown>
}

declare module '@aws-sdk/client-bedrock' {
  export class BedrockRuntimeClient {
    constructor(config?: unknown)
    send(command: unknown): Promise<unknown>
  }
}
