# Changelog

Changes for **[DXA Agent](https://github.com/dxiv/dxa-agent)** track the **`package.json`** version. **npm:** [@dxa-dev/agent](https://www.npmjs.com/package/@dxa-dev/agent).

## 0.2.0

- **Tooling:** TypeScript 6 `ignoreDeprecations` for `baseUrl` (prepare for TS 7 path mapping changes).
- **Dependencies:** Major-range refresh — `chokidar` 5, `cli-boxes` 4, `supports-hyperlinks` 4, `undici` 8, `zod` 4. `lru-cache` stays on **11.2.7** (11.3+ ships ESM with top-level await that breaks the Bun bundle).
- **VS Code extension:** Version aligned with the CLI package (`0.2.0`).

## 0.1.7

- Active development on `main`. Tagged releases: [GitHub Releases](https://github.com/dxiv/dxa-agent/releases). Detailed history: `git log`.
- Pushing a version tag `v*` triggers a workflow that attaches **`dist/cli.mjs`** as a downloadable artifact on the Actions run (see [maintainers.md](docs/maintainers.md)).
