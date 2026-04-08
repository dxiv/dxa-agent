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
  export function getSentinelCategory(...args: unknown[]): unknown
}

declare module '@ant/computer-use-mcp/types' {
  export type ComputerUseTypes = Record<string, unknown>
  export type CuPermissionRequest = unknown
  export type CuPermissionResponse = unknown
  export type CoordinateMode = unknown
  export type CuSubGates = unknown
  export type ComputerUseHostAdapter = unknown
  export type Logger = unknown
  export const DEFAULT_GRANT_FLAGS: unknown
}

declare module '*.md' {
  const content: string
  export default content
}

/** Optional native / internal packages (not always installed). */
declare module '@ant/claude-for-chrome-mcp' {
  const m: Record<string, unknown>
  export default m
  export const BROWSER_TOOLS: unknown
  export type ClaudeForChromeContext = unknown
  export function createClaudeForChromeMcpServer(
    ...args: unknown[]
  ): unknown
  export type Logger = unknown
  export type PermissionMode = unknown
}

declare module 'plist' {
  export function parse(data: string | Buffer): unknown
}

declare module 'audio-capture-napi' {
  export function isNativeAudioAvailable(): boolean
  export function isNativeRecordingActive(): boolean
  export function stopNativeRecording(): void
  export function startNativeRecording(
    onData: (data: Buffer) => void,
    onSilenceEnd: () => void,
  ): boolean
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
  export type ComputerExecutor = unknown
  export type DisplayGeometry = unknown
  export type FrontmostApp = unknown
  export type InstalledApp = unknown
  export type ResolvePrepareCaptureResult = unknown
  export type RunningApp = unknown
  export type ScreenshotResult = unknown
  export type ComputerUseSessionContext = unknown
  export type CuCallToolResult = unknown
  export type CuPermissionRequest = unknown
  export type CuPermissionResponse = unknown
  export type ScreenshotDims = unknown
  export const API_RESIZE_PARAMS: unknown
  /** Logical screenshot resize — see computer-use-mcp COORDINATES.md */
  export function targetImageSize(
    physW: number,
    physH: number,
    resizeParams: unknown,
  ): [number, number]
  export const DEFAULT_GRANT_FLAGS: unknown
  export function buildComputerUseTools(...args: unknown[]): unknown
  export function createComputerUseMcpServer(...args: unknown[]): unknown
  export function bindSessionContext(...args: unknown[]): unknown
}

declare module '@ant/computer-use-input' {
  /** Narrowed at runtime in `inputLoader`; stub as permissive for CLI typecheck */
  export type ComputerUseInput = any
  export type ComputerUseInputAPI = any
  export const computerUseInput: any
}

declare module '@ant/computer-use-swift' {
  export const computerUseSwift: Record<string, unknown>
  export type ComputerUseAPI = any
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
