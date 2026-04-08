# Changelog

Changes for **[Deimos](https://github.com/dxiv/dxa-deimos)** track the **`package.json`** version. **npm:** [@dxa-dev/deimos](https://www.npmjs.com/package/@dxa-dev/deimos). **GitHub Packages:** [dxa-dev/deimos](https://github.com/orgs/dxa-dev/packages/npm/package/deimos).

## 0.2.8

- **Environment:** Document `DEIMOS_*` provider and tuning variables; CLI startup resolves these for internal configuration.

## 0.2.2

- **`package.json`:** `repository` URL uses `https://github.com/dxiv/dxa-deimos.git` (and `bugs`) so GitHub Packages can link the npm package to this repo.
- **VS Code extension:** Version aligned with the CLI package (`0.2.2`).

## 0.2.1

- GitHub Packages publish on `v*` tags; maintainer notes updated.
- **VS Code extension:** Version aligned with the CLI package (`0.2.1`).

## 0.2.0

- **Windows clipboard:** Native copy on Windows writes UTF-8 to a temp file and uses PowerShell `Set-Clipboard` to read that file, avoiding `clip.exe` stdin so non-ASCII text copies correctly. Added `src/ink/termio/osc.test.ts`.
- **Tooling:** TypeScript 6 `ignoreDeprecations` for `baseUrl` (prepare for TS 7 path mapping changes).
- **Dependencies:** Major-range refresh — `chokidar` 5, `cli-boxes` 4, `supports-hyperlinks` 4, `undici` 8, `zod` 4. `lru-cache` stays on **11.2.7** (11.3+ ships ESM with top-level await that breaks the Bun bundle).
- **VS Code extension:** Version aligned with the CLI package (`0.2.0`).

## 0.1.7

- Active development on `main`. Tagged releases: [GitHub Releases](https://github.com/dxiv/dxa-deimos/releases). Detailed history: `git log`.
- Pushing a version tag `v*` triggers a workflow that attaches **`dist/cli.mjs`** as a downloadable artifact on the Actions run (see [maintainers.md](docs/maintainers.md)).
