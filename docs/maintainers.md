# Notes for maintainers

## Dependabot

[`.github/dependabot.yml`](../.github/dependabot.yml) opens weekly PRs for **GitHub Actions** and **Bun** dependencies. If the Bun ecosystem is unavailable on your org’s GitHub plan, switch that block to `package-ecosystem: "npm"` or disable it.

## Releases (manual checklist)

1. Bump **`package.json`** version (and extension `package.json` if it should track the CLI).
2. Update **[CHANGELOG.md](../CHANGELOG.md)** with a dated bullet list for that version.
3. Commit and push; tag: `git tag v0.x.y && git push origin v0.x.y`.
4. **GitHub Actions** builds **`dist/cli.mjs`** for each `v*` tag and uploads it as a workflow artifact (see `.github/workflows/release-artifacts.yml`). Download from the run’s **Artifacts** if you need the bundle without publishing npm.
5. Publish **`@dxiv/dxa-agent`** to npm when ready (`npm publish` from a clean tree after `bun run build` / `prepack` — use your own npm org credentials).

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

Encourage: **Setup** questions and **Ideas** in [Discussions](https://github.com/dxiv/dxa-agent/discussions); **confirmed bugs** and **scoped work** in Issues.
