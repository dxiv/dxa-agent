declare module 'qrcode' {
  export function toString(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<string>
}
