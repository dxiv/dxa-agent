# DXA Agent

**DXA Agent** is a **MIT-licensed** terminal coding agent: one `dxa-agent` command, your choice of model backend (Anthropic Claude, OpenAI-compatible APIs, Gemini, GitHub Models, Ollama, Atomic Chat, and others), plus tools, **MCP**, and slash commands. This repo also includes a **VS Code extension** and a dark terminal theme.

**Legal:** not affiliated with Anthropic, PBC, or any other vendor. Trademarks, MIT terms, and how to raise concerns: **[LEGAL.md](LEGAL.md)** (general information only—not legal advice).

[![PR Checks](https://github.com/dxiv/dxa-agent/actions/workflows/pr-checks.yml/badge.svg?branch=main)](https://github.com/dxiv/dxa-agent/actions/workflows/pr-checks.yml)
[![Release](https://img.shields.io/github/v/tag/dxiv/dxa-agent?label=release&color=0ea5e9)](https://github.com/dxiv/dxa-agent/tags)
[![Discussions](https://img.shields.io/badge/discussions-open-7c3aed)](https://github.com/dxiv/dxa-agent/discussions)
[![Security Policy](https://img.shields.io/badge/security-policy-0f766e)](SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-2563eb)](LICENSE)

[Quick start](#quick-start) · [Setup guides](#setup-guides) · [Providers](#supported-providers) · [Source build](#source-build-and-local-development) · [VS Code](#vs-code-extension) · [Community](#community)

**New to terminals or npm?** **[docs/non-technical-setup.md](docs/non-technical-setup.md)** → [Windows](docs/quick-start-windows.md) or [macOS / Linux](docs/quick-start-mac-linux.md) → **[checklist](docs/setup-checklist.md)** → **[first run](docs/first-run.md)**.
**All docs:** [docs/README.md](docs/README.md).

## Why use it

- One CLI for cloud APIs and local inference
- `/provider` for guided setup and a saved profile
- Bash, file tools, grep/glob, agents, tasks, MCP, web helpers
- Optional VS Code integration from this repo

## Quick start

These commands assume you already know how to use a terminal. Otherwise start with **[docs/non-technical-setup.md](docs/non-technical-setup.md)**.

### Install

```bash
npm install -g @dxiv/dxa-agent
```

Install **[ripgrep](https://github.com/BurntSushi/ripgrep)** (`rg` on your `PATH`). If DXA Agent says `ripgrep not found`, fix that and open a **new** terminal — see [Troubleshooting](docs/troubleshooting.md).

### Start

```bash
dxa-agent
```

Inside DXA Agent:

- run `/provider` for guided provider setup and saved profiles
- run `/onboard-github` for GitHub Models onboarding

### Fastest OpenAI setup

macOS / Linux:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_MODEL=gpt-4o

dxa-agent
```

Windows PowerShell:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-your-key-here"
$env:OPENAI_MODEL="gpt-4o"

dxa-agent
```

### Fastest local Ollama setup

macOS / Linux:

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=qwen2.5-coder:7b

dxa-agent
```

Windows PowerShell:

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:11434/v1"
$env:OPENAI_MODEL="qwen2.5-coder:7b"

dxa-agent
```

## Setup guides

**Index:** [docs/README.md](docs/README.md) · **Checklist:** [docs/setup-checklist.md](docs/setup-checklist.md) · **After install:** [docs/first-run.md](docs/first-run.md) · **Problems:** [docs/troubleshooting.md](docs/troubleshooting.md)

Beginner-friendly:

- [Non-technical setup](docs/non-technical-setup.md)
- [Windows quick start](docs/quick-start-windows.md)
- [macOS / Linux quick start](docs/quick-start-mac-linux.md)

Advanced / source build:

- [Advanced setup](docs/advanced-setup.md) — Bun, profiles, `doctor:*`, env table
- [.env.example](.env.example) — copy to `.env` for a local clone; uncomment **one** provider block (see file header)
- [Android (Termux)](ANDROID_INSTALL.md) — build inside proot Ubuntu

**Optional:** [`python/`](python/) — small Python helpers for experiments; not required for normal CLI install ([`python/README.md`](python/README.md)).

## Supported Providers

| Provider | Setup Path | Notes |
| --- | --- | --- |
| Anthropic (Claude) | `/provider` or env vars | Cloud default path; `ANTHROPIC_API_KEY` — template in [.env.example](.env.example) |
| OpenAI-compatible | `/provider` or env vars | Works with OpenAI, OpenRouter, DeepSeek, Groq, Mistral, LM Studio, and other compatible `/v1` servers |
| Gemini | `/provider` or env vars | Supports API key, access token, or local ADC workflow on current `main` |
| GitHub Models | `/onboard-github` | Interactive onboarding with saved credentials |
| Codex | `/provider` | Uses existing Codex credentials when available |
| Ollama | `/provider` or env vars | Local inference with no API key |
| Atomic Chat | advanced setup | Local Apple Silicon backend |
| Bedrock / Vertex / Foundry | env vars | Additional provider integrations for supported environments |

## What Works

- **Tool-driven coding workflows**: Bash, file read/write/edit, grep, glob, agents, tasks, MCP, and slash commands
- **Streaming responses**: Real-time token output and tool progress
- **Tool calling**: Multi-step tool loops with model calls, tool execution, and follow-up responses
- **Images**: URL and base64 image inputs for providers that support vision
- **Provider profiles**: Guided setup plus saved `.dxa-agent-profile.json` support
- **Local and remote model backends**: Cloud APIs, local servers, and Apple Silicon local inference

## Provider Notes

DXA Agent supports multiple providers, but behaviour is not identical across all of them.

- Anthropic-specific features may not exist on other providers
- Tool quality depends heavily on the selected model
- Smaller local models can struggle with long multi-step tool flows
- Some providers impose lower output caps than the CLI defaults, and DXA Agent adapts where possible

For best results, use models with strong tool/function calling support.

## Agent Routing

DXA Agent can route different agents to different models through settings-based routing. This is useful for cost optimisation or splitting work by model strength.

Add to `~/.claude/settings.json`:

```json
{
  "agentModels": {
    "deepseek-chat": {
      "base_url": "https://api.deepseek.com/v1",
      "api_key": "sk-your-key"
    },
    "gpt-4o": {
      "base_url": "https://api.openai.com/v1",
      "api_key": "sk-your-key"
    }
  },
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "general-purpose": "gpt-4o",
    "frontend-dev": "deepseek-chat",
    "default": "gpt-4o"
  }
}
```

When no routing match is found, the global provider remains the fallback.

> **Note:** `api_key` values in `settings.json` are stored in plaintext. Keep this file private and do not commit it to version control.

## Web Search and Fetch

By default, `WebSearch` works on non-Anthropic models using DuckDuckGo. This gives GPT-4o, DeepSeek, Gemini, Ollama, and other OpenAI-compatible providers a free web search path out of the box.

> **Note:** DuckDuckGo fallback works by scraping search results and may be rate-limited, blocked, or subject to DuckDuckGo's Terms of Service. If you want a more reliable supported option, configure Firecrawl.

For Anthropic-native backends and Codex responses, DXA Agent keeps the native provider web search behaviour.

`WebFetch` works, but its basic HTTP plus HTML-to-markdown path can still fail on JavaScript-rendered sites or sites that block plain HTTP requests.

Set a [Firecrawl](https://firecrawl.dev) API key if you want Firecrawl-powered search/fetch behaviour:

```bash
export FIRECRAWL_API_KEY=your-key-here
```

With Firecrawl enabled:

- `WebSearch` can use Firecrawl's search API while DuckDuckGo remains the default free path for non-Claude models
- `WebFetch` uses Firecrawl's scrape endpoint instead of raw HTTP, handling JS-rendered pages correctly

Free tier at [firecrawl.dev](https://firecrawl.dev) includes 500 credits. The key is optional.

## Source Build And Local Development

```bash
bun install
bun run build
node dist/cli.mjs
```

For API keys when running from a clone, copy **[.env.example](.env.example)** to `.env`, uncomment a single provider section, and replace placeholders (see the comments at the top of that file).

Helpful commands:

- `bun run typecheck`
- `bun run dev`
- `bun test`
- `bun run test:coverage`
- `bun run security:pr-scan -- --base origin/main`
- `bun run smoke`
- `bun run doctor:runtime`
- `bun run verify:privacy`
- focused `bun test ...` for the areas you touch

**Tags:** pushing a `v*` tag runs [release artifacts](.github/workflows/release-artifacts.yml) (uploads `dist/cli.mjs` as a CI artifact). Maintainer checklist: [docs/maintainers.md](docs/maintainers.md).

## Testing And Coverage

DXA Agent uses Bun's built-in test runner for unit tests.

Run the full unit suite:

```bash
bun test
```

Generate unit test coverage:

```bash
bun run test:coverage
```

Open the visual coverage report:

```bash
open coverage/index.html
```

If you already have `coverage/lcov.info` and only want to rebuild the UI:

```bash
bun run test:coverage:ui
```

Use focused test runs when you only touch one area:

- `bun run test:provider`
- `bun run test:provider-recommendation`
- `bun test path/to/file.test.ts`

Recommended contributor validation before opening a PR:

- `bun run build`
- `bun run smoke`
- `bun run test:coverage` for broader unit coverage when your change affects shared runtime or provider logic
- focused `bun test ...` runs for the files and flows you changed

Coverage output is written to `coverage/lcov.info`, and DXA Agent also generates a git-activity-style heatmap at `coverage/index.html`.

## Repository structure

**`src/`** is the terminal agent; it compiles to **`dist/cli.mjs`**. Everything else is docs, build plumbing, optional add-ons, or repo metadata. The diagrams below are a quick visual; **path details** are in the list under them (single place — no separate table).

**Overview** (three bands — read top to bottom)

```mermaid
flowchart TB
  R1["Documentation — not part of the running CLI<br/>docs/ · README.md · ANDROID_INSTALL.md"]
  R2["Terminal agent — the product<br/>src/ → dist/cli.mjs · bin/dxa-agent · package.json · tsconfig.json"]
  R3["Tooling, integrations, and meta<br/>scripts/ · vscode-extension/ · python/ · .github/<br/>.env.example · CONTRIBUTING · CHANGELOG · LEGAL · LICENSE · SECURITY"]
```

**Git clone vs npm install** (`package.json` → `"files"` decides what npm ships)

```mermaid
flowchart LR
  CLONE["Git clone<br/>entire tree"]
  NPM["npm package<br/>bin/<br/>dist/cli.mjs<br/>README.md"]
```

### Paths

#### Documentation

- **`docs/`** — User guides: [index](docs/README.md), [checklist](docs/setup-checklist.md), [first run](docs/first-run.md), [troubleshooting](docs/troubleshooting.md)
- **`ANDROID_INSTALL.md`** — Build inside Termux / proot Ubuntu
- **`README.md`** — Project overview (also included in the npm tarball)

#### Terminal agent

- **`src/`** — Core CLI and runtime (providers, tools, MCP, UI)
- **`bin/`** — `dxa-agent` launcher (runs `dist/cli.mjs` when built)
- **`package.json`** — Metadata, scripts, and the published [`files`](package.json) list
- **`tsconfig.json`** — TypeScript project for `src/`

#### Build and checks

- **`scripts/`** — Build pipeline, `doctor:*`, security scans, coverage helpers

#### Editor add-on

- **`vscode-extension/dxa-agent-vscode/`** — VS Code integration and terminal theme ([extension readme](vscode-extension/dxa-agent-vscode/README.md))

#### Optional

- **`python/`** — Optional utilities ([`python/README.md`](python/README.md)); not required for the CLI

#### Repository / CI

- **`.github/`** — [PR checks](.github/workflows/pr-checks.yml), `v*` [release artifacts](.github/workflows/release-artifacts.yml), Dependabot, issue/PR templates
- **`.env.example`** — Provider env template; copy to `.env` for local development

## VS Code Extension

Packaged as **Editor add-on** in [Repository structure](#repository-structure): [`vscode-extension/dxa-agent-vscode/`](vscode-extension/dxa-agent-vscode/) — launch integration, provider Control Centre UI, and terminal theme ([readme](vscode-extension/dxa-agent-vscode/README.md)).

## Security

If you believe you found a security issue, see [SECURITY.md](SECURITY.md).

## Community

- Use [GitHub Discussions](https://github.com/dxiv/dxa-agent/discussions) for Q&A, ideas, and community conversation
- Use [GitHub Issues](https://github.com/dxiv/dxa-agent/issues) for confirmed bugs and actionable feature work

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for clone → `bun install` → build, PR expectations, and checks. Larger changes: open an issue first.

## Legal / trademarks

**MIT** applies to material in this repository; dependencies have their own licences. Third-party **names** appear only where **descriptive** (see [LEGAL.md](LEGAL.md)). Full licence text: [LICENSE](LICENSE). *Not legal advice—consult a solicitor or other qualified legal adviser if you need a formal opinion.*
