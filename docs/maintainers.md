# Notes for maintainers

## Dependabot

[`.github/dependabot.yml`](../.github/dependabot.yml) opens weekly PRs for **GitHub Actions** and **Bun** dependencies. If the Bun ecosystem is unavailable on your org’s GitHub plan, switch that block to `package-ecosystem: "npm"` or disable it.

**Bun PRs:** CI uses `bun install --frozen-lockfile`. [`.github/workflows/dependabot-bun-lock.yml`](../.github/workflows/dependabot-bun-lock.yml) runs on Dependabot PRs that touch `package.json` / `bun.lock`, runs `bun install`, and pushes an updated `bun.lock` when needed. The repo needs **Settings → Actions → General → Workflow permissions → Read and write** (or equivalent) so that job can push to the PR branch.

**Security scan:** `scripts/pr-intent-scan.ts` skips dependency lockfiles so normal `registry.npmjs.org/…/*.tgz` lines in `bun.lock` are not treated as malicious download links.

## Releases (manual checklist)

1. Bump **`package.json`** version (and extension `package.json` if it should track the CLI).
2. Update **[CHANGELOG.md](../CHANGELOG.md)** with a dated bullet list for that version.
3. Commit and push; tag: `git tag v0.x.y && git push origin v0.x.y`.
4. **GitHub Actions** builds **`dist/cli.mjs`** for each `v*` tag and uploads it as a workflow artifact (see `.github/workflows/release-artifacts.yml`). Download from the run’s **Artifacts** if you need the bundle without publishing npm.
5. Publish **`@dxiv/openclaude`** to npm when ready (`npm publish` from a clean tree after `bun run build` / `prepack` — use your own npm org credentials).

## Suggested issue labels

Creating these in the GitHub UI helps triage (names are suggestions):

| Label | Use |
| --- | --- |
| `bug` | Reproducible defect |
| `enhancement` | Feature or improvement |
| `documentation` | Docs only |
| `good first issue` | Small, scoped, newcomer-friendly |
| `provider` | Provider / API behaviour |
| `windows` / `linux` / `macos` | Platform-specific |
| `extension` | VS Code extension |

## Discussions

Encourage: **Setup** questions and **Ideas** in [Discussions](https://github.com/dxiv/OpenClaude/discussions); **confirmed bugs** and **scoped work** in Issues.
