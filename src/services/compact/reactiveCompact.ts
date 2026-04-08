import type { CompactionResult } from './compact.js'
import type { Message } from '../../types/message.js'
import type { CacheSafeParams } from '../../utils/forkedAgent.js'

export function isReactiveOnlyMode(): boolean {
  return false
}

export async function reactiveCompactOnPromptTooLong(
  _messages: Message[],
  _cacheSafeParams: CacheSafeParams,
  _options: { customInstructions: string | undefined; trigger: string },
): Promise<
  | { ok: true; result: CompactionResult }
  | {
      ok: false
      reason:
        | 'too_few_groups'
        | 'aborted'
        | 'exhausted'
        | 'error'
        | 'media_unstrippable'
    }
> {
  return { ok: false, reason: 'error' }
}
