/**
 * Open-build stub — full assistant install wizard is internal-only.
 * Exports keep TypeScript and dynamic imports satisfied; runtime paths throw or no-op.
 */
import React from 'react'

export function NewInstallWizard(_props: {
  defaultDir: string
  onInstalled: (dir: string) => void
  onCancel: () => void
  onError: (message: string) => void
}): React.ReactElement | null {
  return null
}

export async function computeDefaultInstallDir(): Promise<string> {
  return ''
}

const _default = null
export default _default
