/**
 * Polyfill for Promise.withResolvers() (ES2024). Kept so callers can rely on
 * `{ promise, resolve, reject }` without branching on runtime support.
 */
export function withResolvers<T>(): PromiseWithResolvers<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}
