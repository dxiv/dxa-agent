/// <reference types="bun" />
/**
 * Ambient typings for Bun bundler features and build-time defines.
 * Runtime is provided by Bun; MACRO.* is inlined by scripts/build.ts.
 */
declare module 'bun:bundle' {
  export function feature(name: string): boolean
}

declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void
  export function test(name: string, fn: () => void | Promise<void>): void
  export function expect(value: unknown): unknown
  export const mock: { module(path: string, factory: () => unknown): void }
}

declare const MACRO: {
  readonly VERSION: string
  readonly DISPLAY_VERSION: string
  readonly BUILD_TIME: string
  readonly ISSUES_EXPLAINER: string
  readonly FEEDBACK_CHANNEL: string
  readonly PACKAGE_URL: string
  readonly NATIVE_PACKAGE_URL: string | undefined
}
