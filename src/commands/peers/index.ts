import type { Command } from '../../types/command.js'

const peersCommand: Command = {
  name: 'peers',
  description: 'UDS inbox peers (stub)',
  type: 'local-jsx',
  isEnabled: () => false,
  load: async () => ({
    call: async () => null,
  }),
}

export default peersCommand
