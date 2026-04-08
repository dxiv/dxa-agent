# Deimos — notes for maintainers

**Product:** [dxa.dev/deimos/](https://dxa.dev/deimos/) · **Package:** [`@dxa-dev/deimos`](https://www.npmjs.com/package/@dxa-dev/deimos)

## CI overview

| Workflow | Purpose |
| --- | --- |
| [pr-checks.yml](../.github/workflows/pr-checks.yml) | **Typecheck** (blocking), **smoke** (`build` + CLI `--version` / `--help`), **`verify:privacy`**, tests (`--max-concurrency=1`), provider tests, PR intent scan, **coverage** + **Codecov** (OIDC), **typecheck log** artifact on failure |
| [codeql.yml](../.github/workflows/codeql.yml) | **CodeQL Advanced** — Actions, JavaScript/TypeScript, Python on `main`, PRs, and weekly schedule |
| [dependabot-bun-lock.yml](../.github/workflows/dependabot-bun-lock.yml) | Refreshes `bun.lock` on Dependabot PRs when needed |
| [release-artifacts.yml](../.github/workflows/release-artifacts.yml) | Tagged release artifacts |
| [publish-github-packages.yml](../.github/workflows/publish-github-packages.yml) | Publishes to GitHub Packages on `v*` tags (optional secret `GH_PACKAGES_TOKEN`) |

**Codecov:** the coverage job uses **`use_oidc: true`** (see [Codecov GitHub OIDC](https://docs.codecov.com/docs/github-oidc)). Enable the Codecov GitHub app or connect the repo in Codecov’s UI if uploads do not appear. If OIDC is not an option, switch the step to a repository secret **`CODECOV_TOKEN`** and drop `use_oidc`.

**Typecheck:** `tsc --noEmit` is **informational** in CI (`continue-on-error`) because the full tree still has many errors unrelated to day-to-day PRs. The Ubuntu job uploads **`typecheck-log`** when the compiler fails. Long-term goal: shrink errors until typecheck can **block** merges.

**TypeScript 6:** root **`tsconfig.json`** sets **`"ignoreDeprecations": "6.0"`** so the compiler does not stop on the deprecated **`baseUrl`** option (see [TS 6 migration](https://aka.ms/ts6)); the full project typecheck then runs and reports the existing backlog. Fixing that backlog is incremental work—prefer tightening types in files you touch rather than broad `as` casts.

**Ant-only dead code (important):** Many files use **`"external" === 'ant'`** (and similar impossible string comparisons) so the **Bun bundler** can **drop** ant-only branches and avoid resolving modules that are not in the open tree. **Do not replace** these with **`process.env.USER_TYPE === 'ant'`** for TypeScript’s sake alone—that makes both branches “reachable” at build time and **breaks the build** (missing `AntModelSwitchCallout`, etc.). TS2367 on those lines is a known tradeoff until we adopt a typed conditional pattern that still DCEs.

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
4. **Release artifacts:** `.github/workflows/release-artifacts.yml` uploads **`dist/cli.mjs`** for each `v*` tag. **GitHub Packages:** `.github/workflows/publish-github-packages.yml` runs on the same tags; optional repo secret **`GH_PACKAGES_TOKEN`** if the default token cannot publish the **`@dxa-dev`** scope. Registry details: [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). To attach the package to **`dxiv/dxa-deimos`**, **`package.json`** **`repository.url`** must stay **`https://github.com/dxiv/dxa-deimos.git`**; after the next publish, it should list under the repo’s **Packages** (or use the package’s **Settings** on GitHub to **connect repository** once).
5. **npmjs.org:** `npm publish` uses **`publishConfig.registry`** in **`package.json`** (public npm). Use your npm credentials.

## Issue labels

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

Encourage: **Setup** questions and **Ideas** in [Discussions](https://github.com/dxiv/dxa-deimos/discussions); **confirmed bugs** and **scoped work** in Issues.
