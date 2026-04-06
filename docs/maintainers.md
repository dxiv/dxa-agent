# Notes for maintainers

## Aligning `src/` with [dxiv/dxa-agent](https://github.com/dxiv/dxa-agent)

This fork keeps its own history, docs, npm package ([**`@dxa-dev/agent`**](https://www.npmjs.com/package/@dxa-dev/agent)), and CI. Runtime code under **`src/`** can be refreshed from upstream when you want feature parity.

1. Add the remote once: `git remote add upstream https://github.com/dxiv/dxa-agent.git` (skip if it already exists).
2. `git fetch upstream main`
3. Inspect diff: `git diff HEAD upstream/main --stat -- src/` (or a path inside `src/`).
4. Bring changes in (examples):
   - **Whole tree:** `git checkout upstream/main -- src/`
   - **Single file:** `git checkout upstream/main -- path/to/file.ts`
5. **`bun install`** then **`bun run build`**, **`bun test --max-concurrency=1`**, **`bun run smoke`**.
6. Re-apply fork-specific bits if needed: root **`package.json`** name, **`scripts/build.ts`** `MACRO.ISSUES_EXPLAINER` / `MACRO.PACKAGE_URL`, **`bin/dxa-agent.mjs`**, **`vscode-extension/dxa-agent-vscode/README.md`** (`@dxa-dev/agent`), and any docs you do not want overwritten.

See also [Troubleshooting → After merging or syncing `src/`](troubleshooting.md#after-merging-or-syncing-src-from-upstream).

## CI overview

| Workflow | Purpose |
| --- | --- |
| [pr-checks.yml](../.github/workflows/pr-checks.yml) | Smoke, tests (`--max-concurrency=1`), provider tests, PR intent scan, **coverage** + **Codecov** (OIDC), optional **typecheck log** artifact on failure |
| [codeql.yml](../.github/workflows/codeql.yml) | **CodeQL Advanced** — Actions, JavaScript/TypeScript, Python on `main`, PRs, and weekly schedule |
| [dependabot-bun-lock.yml](../.github/workflows/dependabot-bun-lock.yml) | Refreshes `bun.lock` on Dependabot PRs when needed |
| [release-artifacts.yml](../.github/workflows/release-artifacts.yml) | Tagged release artifacts |
| [publish-github-packages.yml](../.github/workflows/publish-github-packages.yml) | Publishes to GitHub Packages on `v*` tags (optional secret `GH_PACKAGES_TOKEN`) |

**Codecov:** the coverage job uses **`use_oidc: true`** (see [Codecov GitHub OIDC](https://docs.codecov.com/docs/github-oidc)). Enable the Codecov GitHub app or connect the repo in Codecov’s UI if uploads do not appear. If OIDC is not an option, switch the step to a repository secret **`CODECOV_TOKEN`** and drop `use_oidc`.

**Typecheck:** `tsc --noEmit` is **informational** in CI (`continue-on-error`) because the full tree still has many errors unrelated to day-to-day PRs. The Ubuntu job uploads **`typecheck-log`** when the compiler fails. Long-term goal: shrink errors until typecheck can **block** merges.

## Security (GitHub settings)

In **Settings → Code security and analysis**, turn on **Dependabot alerts** and **Dependabot security updates** so vulnerable dependencies get PRs outside the weekly version-update schedule.

## Lockfiles

Development and CI use **Bun** and **`bun.lock`**. **`package-lock.json`** is gitignored to avoid accidental npm lockfiles. Do not commit a second lockfile unless you deliberately support dual package managers.

## Dependabot

[`.github/dependabot.yml`](../.github/dependabot.yml) opens **GitHub Actions** and **Bun** dependency PRs on the schedule set there (`daily` or `weekly`). Updates are **grouped** (`actions`, `bun-dependencies`) so you get fewer PRs. Any push to that file on `main` makes Dependabot re-read the config and usually queue a run within a few hours. If the Bun ecosystem is unavailable on your org’s GitHub plan, switch that block to `package-ecosystem: "npm"` or disable it.

**Bun PRs:** CI uses `bun install --frozen-lockfile`. [`.github/workflows/dependabot-bun-lock.yml`](../.github/workflows/dependabot-bun-lock.yml) runs on Dependabot PRs that touch `package.json` / `bun.lock`, runs `bun install`, and pushes an updated `bun.lock` when needed. The repo needs **Settings → Actions → General → Workflow permissions → Read and write** (or equivalent) so that job can push to the PR branch.

**Security scan:** `scripts/pr-intent-scan.ts` skips dependency lockfiles so normal `registry.npmjs.org/…/*.tgz` lines in `bun.lock` are not treated as malicious download links.

## Releases (manual checklist)

1. Bump **`package.json`** version (and extension `package.json` if it should track the CLI).
2. Update **[CHANGELOG.md](../CHANGELOG.md)** with a dated bullet list for that version.
3. Commit and push; tag: `git tag v0.x.y && git push origin v0.x.y`.
4. **Release artifacts:** `.github/workflows/release-artifacts.yml` uploads **`dist/cli.mjs`** for each `v*` tag. **GitHub Packages:** `.github/workflows/publish-github-packages.yml` runs on the same tags; optional repo secret **`GH_PACKAGES_TOKEN`** if the default token cannot publish the **`@dxa-dev`** scope. Registry details: [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). To attach the package to **`dxiv/dxa-agent`**, **`package.json`** **`repository.url`** must stay **`https://github.com/dxiv/dxa-agent.git`**; after the next publish, it should list under the repo’s **Packages** (or use the package’s **Settings** on GitHub to **connect repository** once).
5. **npmjs.org:** `npm publish` uses **`publishConfig.registry`** in **`package.json`** (public npm). Use your npm credentials.

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
