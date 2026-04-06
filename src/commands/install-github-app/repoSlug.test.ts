import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.ts'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('dxiv/dxa-agent'), 'dxiv/dxa-agent')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/dxiv/dxa-agent'),
    'dxiv/dxa-agent',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/dxiv/dxa-agent.git'),
    'dxiv/dxa-agent',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:dxiv/dxa-agent.git'),
    'dxiv/dxa-agent',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/dxiv/dxa-agent'),
    'dxiv/dxa-agent',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/dxiv/dxa-agent'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/FakeOrg'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/dxiv/dxa-agent'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/dxiv/dxa-agent'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/dxiv/dxa-agent'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/dxiv/dxa-agent'),
    null,
  )
})
