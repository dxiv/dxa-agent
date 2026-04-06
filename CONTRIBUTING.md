# Contributing to DXA Agent

Thanks for contributing. I merge patches that are **small, tested, and easy to review**.

## Before you start

- Read **[LEGAL.md](LEGAL.md)** once (copyright, third-party deps, trademarks—short).
- Search [issues](https://github.com/dxiv/dxa-agent/issues) and [discussions](https://github.com/dxiv/dxa-agent/discussions) before opening a new thread.
- **Issues:** confirmed bugs and concrete feature work. **Discussions:** setup questions, ideas.
- **Larger changes:** open an issue first so scope is agreed.
- **Security:** [SECURITY.md](SECURITY.md) (private report, not a public issue).

**Docs map:** [docs/README.md](docs/README.md) · [npm package](https://www.npmjs.com/package/@dxa-dev/agent) · [Non-technical setup](docs/non-technical-setup.md) · [Setup checklist](docs/setup-checklist.md) · [First run](docs/first-run.md) · [Troubleshooting](docs/troubleshooting.md) · [README](README.md) · [Advanced setup](docs/advanced-setup.md) · [Android](ANDROID_INSTALL.md) · [Python helpers (optional)](python/README.md).

**Secrets:** never commit API keys, tokens, or `.env` — redact them in logs and issue text. `.gitignore` already excludes `.env*`.

## Local Setup

Install dependencies:

```bash
bun install
```

Build the CLI:

```bash
bun run build
```

Smoke test:

```bash
bun run smoke
```

Run the app locally:

```bash
bun run dev
```

If you are working on provider setup or saved profiles, useful commands include:

```bash
bun run profile:init
bun run dev:profile
```

## Development Workflow

- Keep PRs focused on one problem or feature.
- Avoid mixing unrelated cleanup into the same change.
- Preserve existing repo patterns unless the change is intentionally refactoring them.
- Add or update tests when the change affects behaviour.
- Update docs when setup, commands, or user-facing behaviour changes.

**Commits:** short, human descriptions are preferred (what you changed and why), not corporate boilerplate—think “fixed bash path on windows” not “Address issue with shell resolution module.”

## Validation

At minimum, run the most relevant checks for your change.

Common checks:

```bash
bun run typecheck
bun run build
bun run smoke
bun test --max-concurrency=1
```

Focused tests:

```bash
bun test ./path/to/test-file.test.ts
```

When working on provider/runtime setup, this can also help:

```bash
bun run doctor:runtime
```

## First PR checklist

Use this when you want your branch to match what CI runs on GitHub:

1. Branch from current **`main`** (or the branch the maintainer asked for).
2. **`bun install`** — use **Bun**; do not add **`package-lock.json`** (this repo is Bun-first; the file is ignored).
3. **`bun run build`** and **`bun run smoke`**.
4. **`bun test --max-concurrency=1`** — same as the Linux job in [`.github/workflows/pr-checks.yml`](.github/workflows/pr-checks.yml).
5. For larger or security-sensitive diffs: **`bun run security:pr-scan -- --base origin/main`** (adjust `--base` if your default branch differs).
6. **`bun run typecheck`** — optional signal today (CI treats it as informational); fix new errors in files you touch when practical.
7. Describe what you changed, why, and which commands you ran in the PR body.

## Pull Requests

Good PRs usually include:

- a short explanation of what changed
- why it changed
- the user or developer impact
- the exact checks you ran

If the PR touches UI, terminal presentation, or the VS Code extension, include screenshots when useful.

If the PR changes provider behaviour, mention which provider path was tested.

## Code Style

- Follow the existing code style in the touched files.
- Prefer small, readable changes over broad rewrites.
- Do not reformat unrelated files just because they are nearby.
- Keep comments useful and concise.

## Provider Changes

DXA Agent supports multiple provider paths. If you change provider logic:

- be explicit about which providers are affected
- avoid breaking third-party providers while fixing first-party behaviour
- test the exact provider/model path you changed when possible
- call out any limitations or follow-up work in the PR description

## Good first issues

Look for issues labelled **`good first issue`** (create the label in GitHub if it does not exist yet). Small doc fixes and focused tests are ideal starters.

## Maintainer notes

Release labels, npm checklist, and suggested GitHub labels: [docs/maintainers.md](docs/maintainers.md).

## Community

Please be respectful and constructive with other contributors.

Maintainers may ask for:

- narrower scope
- focused follow-up PRs
- stronger validation
- docs updates for behaviour changes

That is normal and helps keep the project reviewable as it grows.
