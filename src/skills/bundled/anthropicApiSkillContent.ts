// Content for the anthropic-api bundled skill.
// Each .md file is inlined as a string at build time via Bun's text loader.

import csharpMessagesApi from './anthropic-api/csharp/messages-api.md'
import curlExamples from './anthropic-api/curl/examples.md'
import goMessagesApi from './anthropic-api/go/messages-api.md'
import javaMessagesApi from './anthropic-api/java/messages-api.md'
import phpMessagesApi from './anthropic-api/php/messages-api.md'
import pythonAgentSdkPatterns from './anthropic-api/python/agent-sdk/patterns.md'
import pythonAgentSdkReadme from './anthropic-api/python/agent-sdk/README.md'
import pythonMessagesApiBatches from './anthropic-api/python/messages-api/batches.md'
import pythonMessagesApiFilesApi from './anthropic-api/python/messages-api/files-api.md'
import pythonMessagesApiReadme from './anthropic-api/python/messages-api/README.md'
import pythonMessagesApiStreaming from './anthropic-api/python/messages-api/streaming.md'
import pythonMessagesApiToolUse from './anthropic-api/python/messages-api/tool-use.md'
import rubyMessagesApi from './anthropic-api/ruby/messages-api.md'
import skillPrompt from './anthropic-api/SKILL.md'
import sharedErrorCodes from './anthropic-api/shared/error-codes.md'
import sharedLiveSources from './anthropic-api/shared/live-sources.md'
import sharedModels from './anthropic-api/shared/models.md'
import sharedPromptCaching from './anthropic-api/shared/prompt-caching.md'
import sharedToolUseConcepts from './anthropic-api/shared/tool-use-concepts.md'
import typescriptAgentSdkPatterns from './anthropic-api/typescript/agent-sdk/patterns.md'
import typescriptAgentSdkReadme from './anthropic-api/typescript/agent-sdk/README.md'
import typescriptMessagesApiBatches from './anthropic-api/typescript/messages-api/batches.md'
import typescriptMessagesApiFilesApi from './anthropic-api/typescript/messages-api/files-api.md'
import typescriptMessagesApiReadme from './anthropic-api/typescript/messages-api/README.md'
import typescriptMessagesApiStreaming from './anthropic-api/typescript/messages-api/streaming.md'
import typescriptMessagesApiToolUse from './anthropic-api/typescript/messages-api/tool-use.md'

// @[MODEL LAUNCH]: Update the model IDs/names below. These are substituted into {{VAR}}
// placeholders in the .md files at runtime before the skill prompt is sent.
// After updating these constants, manually update the two files that still hardcode models:
//   - anthropic-api/SKILL.md (Current Models pricing table)
//   - anthropic-api/shared/models.md (full model catalog with legacy versions and alias mappings)
export const SKILL_MODEL_VARS = {
  OPUS_ID: 'claude-opus-4-6',
  OPUS_NAME: 'Claude Opus 4.6',
  SONNET_ID: 'claude-sonnet-4-6',
  SONNET_NAME: 'Claude Sonnet 4.6',
  HAIKU_ID: 'claude-haiku-4-5',
  HAIKU_NAME: 'Claude Haiku 4.5',
  // Previous Sonnet ID — used in "do not append date suffixes" example in SKILL.md.
  PREV_SONNET_ID: 'claude-sonnet-4-5',
} satisfies Record<string, string>

export const SKILL_PROMPT: string = skillPrompt

export const SKILL_FILES: Record<string, string> = {
  'csharp/messages-api.md': csharpMessagesApi,
  'curl/examples.md': curlExamples,
  'go/messages-api.md': goMessagesApi,
  'java/messages-api.md': javaMessagesApi,
  'php/messages-api.md': phpMessagesApi,
  'python/agent-sdk/README.md': pythonAgentSdkReadme,
  'python/agent-sdk/patterns.md': pythonAgentSdkPatterns,
  'python/messages-api/README.md': pythonMessagesApiReadme,
  'python/messages-api/batches.md': pythonMessagesApiBatches,
  'python/messages-api/files-api.md': pythonMessagesApiFilesApi,
  'python/messages-api/streaming.md': pythonMessagesApiStreaming,
  'python/messages-api/tool-use.md': pythonMessagesApiToolUse,
  'ruby/messages-api.md': rubyMessagesApi,
  'shared/error-codes.md': sharedErrorCodes,
  'shared/live-sources.md': sharedLiveSources,
  'shared/models.md': sharedModels,
  'shared/prompt-caching.md': sharedPromptCaching,
  'shared/tool-use-concepts.md': sharedToolUseConcepts,
  'typescript/agent-sdk/README.md': typescriptAgentSdkReadme,
  'typescript/agent-sdk/patterns.md': typescriptAgentSdkPatterns,
  'typescript/messages-api/README.md': typescriptMessagesApiReadme,
  'typescript/messages-api/batches.md': typescriptMessagesApiBatches,
  'typescript/messages-api/files-api.md': typescriptMessagesApiFilesApi,
  'typescript/messages-api/streaming.md': typescriptMessagesApiStreaming,
  'typescript/messages-api/tool-use.md': typescriptMessagesApiToolUse,
}
