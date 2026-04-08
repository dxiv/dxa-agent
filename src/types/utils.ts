import type { ReadonlyDeep } from 'type-fest'

/** App state and message snapshots use deep readonly typing at the type level. */
export type DeepImmutable<T> = ReadonlyDeep<T>
