import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.js'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('dxiv/dxa-deimos'), 'dxiv/dxa-deimos')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/dxiv/dxa-deimos'),
    'dxiv/dxa-deimos',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/dxiv/dxa-deimos.git'),
    'dxiv/dxa-deimos',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:dxiv/dxa-deimos.git'),
    'dxiv/dxa-deimos',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/dxiv/dxa-deimos'),
    'dxiv/dxa-deimos',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/dxiv/dxa-deimos'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/incomplete'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/dxiv/dxa-deimos'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/dxiv/dxa-deimos'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/dxiv/dxa-deimos'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/dxiv/dxa-deimos'),
    null,
  )
})
