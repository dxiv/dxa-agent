import type { Command } from '../../types/command.js'

const forkCommand: Command = {
  name: 'fork',
  description: 'Fork subagent (stub)',
  type: 'local-jsx',
  isEnabled: () => false,
  load: async () => ({
    call: async () => null,
  }),
}

export default forkCommand
