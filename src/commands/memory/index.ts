import type { Command } from '../../commands.js'

const memory: Command = {
  type: 'local-jsx',
  name: 'memory',
  description: 'Edit Deimos memory files',
  load: () => import('./memory.js'),
}

export default memory
