import type { Command } from '../../types/command.js'

/** Stub when WORKFLOW_SCRIPTS feature is enabled but upstream command body is absent */
const workflowsCommand: Command = {
  name: 'workflows',
  description: 'Workflow scripts (stub)',
  type: 'local-jsx',
  isEnabled: () => false,
  load: async () => ({
    call: async () => null,
  }),
}

export default workflowsCommand
