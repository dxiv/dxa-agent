import assert from 'node:assert/strict'
import test from 'node:test'

import type { ValidationError } from '../../utils/settings/validation.js'

import {
  buildEmptyDoctorReport,
  doctorAllServers,
  doctorServer,
  findingsFromValidationErrors,
  sanitizeMcpDoctorConnectionError,
  type McpDoctorDependencies,
} from './doctor.js'
import type { ScopedMcpServerConfig } from './types.js'

function stdioConfig(scope: 'local' | 'project' | 'user' | 'enterprise', command: string) {
  return {
    type: 'stdio' as const,
    command,
    args: [] as string[],
    scope,
  }
}

const emptyServers = {} as Record<string, ScopedMcpServerConfig>

function makeDependencies(overrides: Partial<McpDoctorDependencies> = {}): McpDoctorDependencies {
  return {
    getAllMcpConfigs: async () => ({ servers: emptyServers, errors: [] }),
    getMcpConfigsByScope: () => ({ servers: emptyServers, errors: [] }),
    getProjectMcpServerStatus: () => 'approved',
    isMcpServerDisabled: () => false,
    describeMcpConfigFilePath: scope => `scope://${scope}`,
    clearServerCache: async () => {},
    connectToServer: async (name, config) => ({
      name,
      type: 'connected',
      capabilities: {},
      config,
      cleanup: async () => {},
    }),
    ...overrides,
  }
}

test('sanitizeMcpDoctorConnectionError redacts URL userinfo, bearer tokens, and JWT-shaped strings', () => {
  assert.equal(
    sanitizeMcpDoctorConnectionError('GET https://user:secret@api.example/hook failed'),
    'GET https://***@api.example/hook failed',
  )
  assert.equal(
    sanitizeMcpDoctorConnectionError('Unauthorized: Bearer eyJhbGciOiJIUzI1NiJ9.sig.here'),
    'Unauthorized: Bearer [redacted]',
  )
  assert.equal(
    sanitizeMcpDoctorConnectionError(
      'err eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    ),
    'err [jwt redacted]',
  )
})

test('buildEmptyDoctorReport returns zeroed summary', () => {
  const report = buildEmptyDoctorReport({
    configOnly: true,
    scopeFilter: 'project',
    targetName: 'filesystem',
  })

  assert.equal(report.targetName, 'filesystem')
  assert.equal(report.scopeFilter, 'project')
  assert.equal(report.configOnly, true)
  assert.deepEqual(report.summary, {
    totalReports: 0,
    healthy: 0,
    warnings: 0,
    blocking: 0,
  })
  assert.deepEqual(report.findings, [])
  assert.deepEqual(report.servers, [])
})

test('findingsFromValidationErrors maps missing env warnings into doctor findings', () => {
  const validationErrors: ValidationError[] = [
    {
      file: '.mcp.json',
      path: 'mcpServers.filesystem',
      message: 'Missing environment variables: API_KEY, API_URL',
      suggestion: 'Set the following environment variables: API_KEY, API_URL',
      mcpErrorMetadata: {
        scope: 'project',
        serverName: 'filesystem',
        severity: 'warning',
      },
    },
  ]

  const findings = findingsFromValidationErrors(validationErrors)

  assert.equal(findings.length, 1)
  assert.deepEqual(findings[0], {
    blocking: false,
    code: 'config.missing_env_vars',
    message: 'Missing environment variables: API_KEY, API_URL',
    remediation:
      'Set the following environment variables: API_KEY, API_URL. Open /mcp to review servers, status, and authentication. Check or edit the MCP entry in .mcp.json.',
    scope: 'project',
    serverName: 'filesystem',
    severity: 'warn',
    sourcePath: '.mcp.json',
  })
})

test('findingsFromValidationErrors maps Windows npx warnings into doctor findings', () => {
  const validationErrors: ValidationError[] = [
    {
      file: '.mcp.json',
      path: 'mcpServers.node-tools',
      message: "Windows requires 'cmd /c' wrapper to execute npx",
      suggestion:
        'Change command to "cmd" with args ["/c", "npx", ...]. See: https://dxa.dev/deimos/docs/en/mcp#configure-mcp-servers',
      mcpErrorMetadata: {
        scope: 'project',
        serverName: 'node-tools',
        severity: 'warning',
      },
    },
  ]

  const findings = findingsFromValidationErrors(validationErrors)

  assert.equal(findings.length, 1)
  assert.equal(findings[0]?.code, 'config.windows_npx_wrapper_required')
  assert.equal(findings[0]?.serverName, 'node-tools')
  assert.equal(findings[0]?.severity, 'warn')
  assert.equal(findings[0]?.blocking, false)
})

test('findingsFromValidationErrors maps fatal parse errors into blocking findings', () => {
  const validationErrors: ValidationError[] = [
    {
      file: 'C:/repo/.mcp.json',
      path: '',
      message: 'MCP config is not a valid JSON',
      suggestion: 'Fix the JSON syntax errors in the file',
      mcpErrorMetadata: {
        scope: 'project',
        severity: 'fatal',
      },
    },
  ]

  const findings = findingsFromValidationErrors(validationErrors)

  assert.equal(findings.length, 1)
  assert.equal(findings[0]?.code, 'config.invalid_json')
  assert.equal(findings[0]?.severity, 'error')
  assert.equal(findings[0]?.blocking, true)
})

test('doctorAllServers reports global validation findings once without duplicating them into every server', async () => {
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { filesystem: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'project'
        ? {
            servers: emptyServers,
            errors: [
              {
                file: '.mcp.json',
                path: '',
                message: 'MCP config is not a valid JSON',
                suggestion: 'Fix the JSON syntax errors in the file',
                mcpErrorMetadata: {
                  scope: 'project',
                  severity: 'fatal',
                },
              },
            ],
          }
        : scope === 'local'
          ? { servers: { filesystem: localConfig }, errors: [] }
          : { servers: emptyServers, errors: [] },
  })

  const report = await doctorAllServers({ configOnly: true }, deps)

  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.summary.blocking, 1)
  assert.equal(report.findings.length, 1)
  assert.equal(report.findings[0]?.code, 'config.invalid_json')
  assert.deepEqual(report.servers[0]?.findings, [])
})

test('doctorServer explains same-name shadowing across scopes', async () => {
  const localConfig = stdioConfig('local', 'node-local')
  const userConfig = stdioConfig('user', 'node-user')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: {
        filesystem: localConfig,
      },
      errors: [],
    }),
    getMcpConfigsByScope: scope => {
      switch (scope) {
        case 'local':
          return { servers: { filesystem: localConfig }, errors: [] }
        case 'user':
          return { servers: { filesystem: userConfig }, errors: [] }
        default:
          return { servers: emptyServers, errors: [] }
      }
    },
  })

  const report = await doctorServer('filesystem', { configOnly: true }, deps)
  assert.equal(report.servers.length, 1)
  assert.equal(report.servers[0]?.definitions.length, 2)
  assert.equal(report.servers[0]?.definitions.find(def => def.sourceType === 'local')?.runtimeActive, true)
  assert.equal(report.servers[0]?.definitions.find(def => def.sourceType === 'user')?.runtimeActive, false)
  assert.deepEqual(
    report.servers[0]?.findings.map(finding => finding.code).sort(),
    ['duplicate.same_name_multiple_scopes', 'scope.shadowed'],
  )
})

test('doctorServer reports project servers pending approval', async () => {
  const projectConfig = stdioConfig('project', 'node-project')
  const deps = makeDependencies({
    getMcpConfigsByScope: scope =>
      scope === 'project'
        ? { servers: { sentry: projectConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    getProjectMcpServerStatus: name => (name === 'sentry' ? 'pending' : 'approved'),
  })

  const report = await doctorServer('sentry', { configOnly: true }, deps)
  assert.equal(report.servers.length, 1)
  assert.equal(report.servers[0]?.definitions[0]?.pendingApproval, true)
  assert.equal(report.servers[0]?.definitions[0]?.runtimeActive, false)
  assert.equal(report.servers[0]?.definitions[0]?.runtimeVisible, false)
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'state.pending_project_approval'),
    true,
  )
})

test('doctorServer does not treat disabled servers as runtime-active or live-check targets', async () => {
  let connectCalls = 0
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { github: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { github: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    isMcpServerDisabled: name => name === 'github',
    connectToServer: async (name, config) => {
      connectCalls += 1
      return {
        name,
        type: 'failed',
        config,
        error: 'should not connect',
      }
    },
  })

  const report = await doctorServer('github', { configOnly: false }, deps)

  assert.equal(connectCalls, 0)
  assert.equal(report.summary.blocking, 0)
  assert.equal(report.summary.warnings, 1)
  assert.equal(report.servers[0]?.definitions[0]?.disabled, true)
  assert.equal(report.servers[0]?.definitions[0]?.runtimeActive, false)
  assert.equal(report.servers[0]?.definitions[0]?.runtimeVisible, false)
  assert.equal(report.servers[0]?.liveCheck.result, 'disabled')
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'state.disabled' && finding.severity === 'warn'),
    true,
  )
})

test('doctorAllServers skips live checks in config-only mode', async () => {
  let connectCalls = 0
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { linear: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { linear: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    connectToServer: async (name, config) => {
      connectCalls += 1
      return {
        name,
        type: 'connected',
        capabilities: {},
        config,
        cleanup: async () => {},
      }
    },
  })

  const report = await doctorAllServers({ configOnly: true }, deps)
  assert.equal(connectCalls, 0)
  assert.equal(report.servers[0]?.liveCheck.attempted, false)
  assert.equal(report.servers[0]?.liveCheck.result, 'skipped')
})

test('doctorAllServers honors scopeFilter when collecting names', async () => {
  const pluginConfig = {
    type: 'http' as const,
    url: 'https://example.test/mcp',
    scope: 'dynamic' as const,
    pluginSource: 'plugin:github@official',
  }
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { 'plugin:github:github': pluginConfig },
      errors: [],
    }),
  })

  const report = await doctorAllServers({ configOnly: true, scopeFilter: 'user' }, deps)

  assert.equal(report.summary.totalReports, 0)
  assert.deepEqual(report.servers, [])
})

test('doctorAllServers honors scopeFilter when collecting validation errors', async () => {
  const userConfig = stdioConfig('user', 'node-user')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { filesystem: userConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope => {
      switch (scope) {
        case 'project':
          return {
            servers: emptyServers,
            errors: [
              {
                file: '.mcp.json',
                path: '',
                message: 'MCP config is not a valid JSON',
                suggestion: 'Fix the JSON syntax errors in the file',
                mcpErrorMetadata: {
                  scope: 'project',
                  severity: 'fatal',
                },
              },
            ],
          }
        case 'user':
          return { servers: { filesystem: userConfig }, errors: [] }
        default:
          return { servers: emptyServers, errors: [] }
      }
    },
  })

  const report = await doctorAllServers({ configOnly: true, scopeFilter: 'user' }, deps)

  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.summary.blocking, 0)
  assert.deepEqual(report.findings, [])
  assert.deepEqual(report.servers[0]?.findings, [])
})

test('doctorAllServers includes observed runtime definitions for plugin-only servers', async () => {
  const pluginConfig = {
    type: 'http' as const,
    url: 'https://example.test/mcp',
    scope: 'dynamic' as const,
    pluginSource: 'plugin:github@official',
  }
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { 'plugin:github:github': pluginConfig },
      errors: [],
    }),
  })

  const report = await doctorAllServers({ configOnly: true }, deps)

  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.servers[0]?.definitions.length, 1)
  assert.equal(report.servers[0]?.definitions[0]?.sourceType, 'plugin')
  assert.equal(report.servers[0]?.definitions[0]?.runtimeActive, true)
})

test('doctorAllServers reports disabled plugin servers as disabled, not not-found', async () => {
  const pluginConfig = {
    type: 'http' as const,
    url: 'https://example.test/mcp',
    scope: 'dynamic' as const,
    pluginSource: 'plugin:github@official',
  }
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { 'plugin:github:github': pluginConfig },
      errors: [],
    }),
    isMcpServerDisabled: name => name === 'plugin:github:github',
  })

  const report = await doctorAllServers({ configOnly: true }, deps)

  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.summary.warnings, 1)
  assert.equal(report.summary.blocking, 0)
  assert.equal(report.servers[0]?.definitions.length, 1)
  assert.equal(report.servers[0]?.definitions[0]?.sourceType, 'plugin')
  assert.equal(report.servers[0]?.definitions[0]?.disabled, true)
  assert.equal(report.servers[0]?.definitions[0]?.runtimeActive, false)
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'state.disabled' && !finding.blocking),
    true,
  )
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'state.not_found'),
    false,
  )
})

test('doctorServer converts failed live checks into blocking findings', async () => {
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { github: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { github: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    connectToServer: async (name, config) => ({
      name,
      type: 'failed',
      config,
      error: 'command not found: node-local',
    }),
  })

  const report = await doctorServer('github', { configOnly: false }, deps)

  assert.equal(report.summary.blocking, 1)
  assert.equal(report.servers[0]?.liveCheck.result, 'failed')
  assert.equal(
    report.servers[0]?.findings.some(
      finding => finding.code === 'stdio.command_not_found' && finding.blocking,
    ),
    true,
  )
})

test('doctorServer sanitizes live check errors before exposing them in findings and liveCheck', async () => {
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { github: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { github: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    connectToServer: async (name, config) => ({
      name,
      type: 'failed',
      config,
      error: 'dial https://user:supersecret@example.com/mcp: refused',
    }),
  })

  const report = await doctorServer('github', { configOnly: false }, deps)

  assert.equal(report.servers[0]?.liveCheck.error, 'dial https://***@example.com/mcp: refused')
  const failedFinding = report.servers[0]?.findings.find(f => f.code === 'health.failed')
  assert.ok(failedFinding?.message.includes('https://***@example.com/mcp'))
  assert.ok(!failedFinding?.message.includes('supersecret'))
})

test('doctorServer converts needs-auth live checks into warning findings', async () => {
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { sentry: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { sentry: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    connectToServer: async (name, config) => ({
      name,
      type: 'needs-auth',
      config,
    }),
  })

  const report = await doctorServer('sentry', { configOnly: false }, deps)

  assert.equal(report.summary.warnings, 1)
  assert.equal(report.summary.blocking, 0)
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'auth.needs_auth' && finding.severity === 'warn'),
    true,
  )
})

test('doctorServer includes observed runtime definition for plugin-only targets', async () => {
  const pluginConfig = {
    type: 'http' as const,
    url: 'https://example.test/mcp',
    scope: 'dynamic' as const,
    pluginSource: 'plugin:github@official',
  }
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { 'plugin:github:github': pluginConfig },
      errors: [],
    }),
  })

  const report = await doctorServer('plugin:github:github', { configOnly: true }, deps)

  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.servers[0]?.definitions.length, 1)
  assert.equal(report.servers[0]?.definitions[0]?.sourceType, 'plugin')
  assert.equal(report.servers[0]?.definitions[0]?.runtimeActive, true)
})

test('doctorServer with scopeFilter does not leak runtime definition from another scope when target is absent', async () => {
  let connectCalls = 0
  const localConfig = stdioConfig('local', 'node-local')
  const deps = makeDependencies({
    getAllMcpConfigs: async () => ({
      servers: { github: localConfig },
      errors: [],
    }),
    getMcpConfigsByScope: scope =>
      scope === 'local'
        ? { servers: { github: localConfig }, errors: [] }
        : { servers: emptyServers, errors: [] },
    connectToServer: async (name, config) => {
      connectCalls += 1
      return {
        name,
        type: 'connected',
        capabilities: {},
        config,
        cleanup: async () => {},
      }
    },
  })

  const report = await doctorServer('github', { configOnly: false, scopeFilter: 'user' }, deps)

  assert.equal(connectCalls, 0)
  assert.equal(report.summary.totalReports, 1)
  assert.equal(report.summary.blocking, 1)
  assert.deepEqual(report.servers[0]?.definitions, [])
  assert.equal(report.servers[0]?.liveCheck.result, 'skipped')
  assert.equal(
    report.servers[0]?.findings.some(finding => finding.code === 'state.not_found' && finding.blocking),
    true,
  )
})

test('doctorServer reports blocking not-found state when no definition exists', async () => {
  const report = await doctorServer('missing-server', { configOnly: true }, makeDependencies())

  assert.equal(report.summary.blocking, 1)
  assert.equal(report.servers[0]?.findings.some(finding => finding.code === 'state.not_found' && finding.blocking), true)
})
