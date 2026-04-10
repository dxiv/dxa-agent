# Deimos advanced setup

**[Deimos](https://github.com/dxiv/dxa-deimos/)** · clone: [github.com/dxiv/dxa-deimos](https://github.com/dxiv/dxa-deimos)

**Who this is for:** Developers and power users who want to **clone this repo**, use **Bun**, run **`bun run build`**, use **profile launchers** (`profile:init`, `dev:profile`), **`doctor:*` diagnostics**, or copy-paste **many provider examples**.

**If you only want the published CLI:** follow [Non-technical setup](non-technical-setup.md) or the OS guides — [Windows](quick-start-windows.md) · [macOS / Linux](quick-start-mac-linux.md). **When something breaks:** [Troubleshooting](troubleshooting.md). **After the REPL starts:** [First run](first-run.md).

**Environment variables:** Mode switches often use the **`DEIMOS_*`** prefix (for example `DEIMOS_USE_OPENAI=1`, `DEIMOS_USE_GEMINI=1`). Provider endpoints and keys usually follow each vendor’s names (`OPENAI_*`, `GEMINI_*`, `CODEX_*`, `ANTHROPIC_*`, AWS/GCP vars, etc.). **`.env.example`** in the repo lists every supported path.

---

## Install options

### Option A: npm

Package page: [**`@dxa-deimos/cli`**](https://www.npmjs.com/package/@dxa-deimos/cli).

```bash
npm install -g @dxa-deimos/cli
```

### Option B: From source with Bun

Use Bun `1.3.11` or newer for source builds on Windows. Older Bun versions can fail during `bun run build`.

```bash
git clone https://github.com/dxiv/dxa-deimos.git
cd dxa-deimos   # default folder name from GitHub; use your clone directory if different

bun install
bun run build
npm link
```

### Option C: Run directly with Bun

```bash
git clone https://github.com/dxiv/dxa-deimos.git
cd dxa-deimos   # default folder name from GitHub; use your clone directory if different

bun install
bun run dev
```

## Provider Examples

### OpenAI

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o
```

### Google Gemini (native SDK)

This is **not** the OpenRouter/OpenAI-compat route below. Uses the Gemini client in-tree.

```bash
export DEIMOS_USE_GEMINI=1
export GEMINI_API_KEY=your-key
export GEMINI_MODEL=gemini-2.0-flash
```

Optional: `GEMINI_BASE_URL` if you use a custom endpoint (see `.env.example`).

### GitHub Models

```bash
export DEIMOS_USE_GITHUB=1
export GITHUB_TOKEN=ghp_...
# Or GH_TOKEN. Default model if unset is often openai/gpt-4.1 — override if needed:
export OPENAI_MODEL=openai/gpt-4.1
```

Use **`/onboard-github`** in `deimos` when you want the guided flow.

### AWS Bedrock

```bash
export DEIMOS_USE_BEDROCK=1
export AWS_REGION=us-east-1
export AWS_BEARER_TOKEN_BEDROCK=...
# Optional: ANTHROPIC_BEDROCK_BASE_URL=...
export ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

### Google Vertex AI

```bash
export DEIMOS_USE_VERTEX=1
export ANTHROPIC_VERTEX_PROJECT_ID=your-gcp-project
export GOOGLE_CLOUD_PROJECT=your-gcp-project
export CLOUD_ML_REGION=us-east5
export ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

### Microsoft Foundry (Azure AI)

```bash
export DEIMOS_USE_FOUNDRY=1
export ANTHROPIC_FOUNDRY_RESOURCE=your-azure-resource-name
export ANTHROPIC_FOUNDRY_API_KEY=your-key
export ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

See **`src/services/api/client.ts`** for `ANTHROPIC_FOUNDRY_BASE_URL` and auth edge cases.

### Codex via ChatGPT auth

`codexplan` maps to GPT-5.4 on the Codex backend with high reasoning.
`codexspark` maps to GPT-5.3 Codex Spark for faster loops.

If you already use the Codex CLI, Deimos reads `~/.codex/auth.json` automatically. You can also point it elsewhere with `CODEX_AUTH_JSON_PATH` or override the token directly with `CODEX_API_KEY`.

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_MODEL=codexplan

# optional if you do not already have ~/.codex/auth.json
export CODEX_API_KEY=...

deimos
```

### DeepSeek

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=sk-...
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-chat
```

### Google Gemini via OpenRouter (OpenAI-compatible)

Uses **`DEIMOS_USE_OPENAI=1`**, not `DEIMOS_USE_GEMINI`.

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=sk-or-...
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export OPENAI_MODEL=google/gemini-2.0-flash-001
```

OpenRouter model availability changes over time. If a model stops working, try another current OpenRouter model before assuming the integration is broken.

### Ollama

```bash
ollama pull llama3.3:70b

export DEIMOS_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.3:70b
```

### Atomic Chat (local, Apple Silicon)

Atomic Chat is aimed at **macOS on Apple Silicon**. On **Windows or Linux**, use **Ollama** or **LM Studio** (OpenAI-compatible sections above) for local models.

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_BASE_URL=http://127.0.0.1:1337/v1
export OPENAI_MODEL=your-model-name
```

No API key is needed for Atomic Chat local models.

Or use the profile launcher:

```bash
bun run dev:atomic-chat
```

Download Atomic Chat from [atomic.chat](https://atomic.chat/). The app must be running with a model loaded before launching.

### LM Studio

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_MODEL=your-model-name
```

### Together AI

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.together.xyz/v1
export OPENAI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo
```

### Groq

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=gsk_...
export OPENAI_BASE_URL=https://api.groq.com/openai/v1
export OPENAI_MODEL=llama-3.3-70b-versatile
```

### Mistral

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=...
export OPENAI_BASE_URL=https://api.mistral.ai/v1
export OPENAI_MODEL=mistral-large-latest
```

### Azure OpenAI

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=your-azure-key
export OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment/v1
export OPENAI_MODEL=gpt-4o
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEIMOS_USE_OPENAI` | Yes | Set to `1` to enable the OpenAI provider |
| `OPENAI_API_KEY` | Yes* | Your API key (`*` not needed for local models like Ollama or Atomic Chat) |
| `OPENAI_MODEL` | Yes | Model name such as `gpt-4o`, `deepseek-chat`, or `llama3.3:70b` |
| `OPENAI_BASE_URL` | No | API endpoint, defaulting to `https://api.openai.com/v1` |
| `CODEX_API_KEY` | Codex only | Codex or ChatGPT access token override |
| `CODEX_AUTH_JSON_PATH` | Codex only | Path to a Codex CLI `auth.json` file |
| `CODEX_HOME` | Codex only | Alternative Codex home directory |
| `DEIMOS_DISABLE_CO_AUTHORED_BY` | No | Suppress the default `Co-Authored-By` trailer in generated git commits |

You can also use `ANTHROPIC_MODEL` to override the model name. `OPENAI_MODEL` takes priority.

## Runtime Hardening

Use these commands to validate your setup and catch mistakes early:

```bash
# quick startup sanity check
bun run smoke

# validate provider env + reachability
bun run doctor:runtime

# print machine-readable runtime diagnostics
bun run doctor:runtime:json

# persist a diagnostics report to reports/doctor-runtime.json
bun run doctor:report

# full local hardening check (smoke + runtime doctor)
bun run hardening:check

# strict hardening (includes project-wide typecheck)
bun run hardening:strict
```

Notes:

- `doctor:runtime` fails fast if `DEIMOS_USE_OPENAI=1` with a placeholder key or a missing key for non-local providers.
- Local providers such as `http://localhost:11434/v1`, `http://10.0.0.1:11434/v1`, and `http://127.0.0.1:1337/v1` can run without `OPENAI_API_KEY`.
- Codex profiles validate `CODEX_API_KEY` or the Codex CLI auth file and probe `POST /responses` instead of `GET /models`.

## Provider Launch Profiles

Use profile launchers to avoid repeated environment setup:

```bash
# one-time profile bootstrap (prefer viable local Ollama, otherwise OpenAI)
bun run profile:init

# preview the best provider/model for your goal
bun run profile:recommend -- --goal coding --benchmark

# auto-apply the best available local/openai provider/model for your goal
bun run profile:auto -- --goal latency

# codex bootstrap (defaults to codexplan and ~/.codex/auth.json)
bun run profile:codex

# openai bootstrap with explicit key
bun run profile:init -- --provider openai --api-key sk-...

# ollama bootstrap with custom model
bun run profile:init -- --provider ollama --model llama3.1:8b

# ollama bootstrap with intelligent model auto-selection
bun run profile:init -- --provider ollama --goal coding

# atomic-chat bootstrap (auto-detects running model)
bun run profile:init -- --provider atomic-chat

# codex bootstrap with a fast model alias
bun run profile:init -- --provider codex --model codexspark

# launch using persisted profile (.deimos-profile.json)
bun run dev:profile

# codex profile (uses CODEX_API_KEY or ~/.codex/auth.json)
bun run dev:codex

# OpenAI profile (requires OPENAI_API_KEY in your shell)
bun run dev:openai

# Ollama profile (defaults: localhost:11434, llama3.1:8b)
bun run dev:ollama

# Atomic Chat profile (Apple Silicon local LLMs at 127.0.0.1:1337)
bun run dev:atomic-chat
```

`profile:recommend` ranks installed Ollama models for `latency`, `balanced`, or `coding`, and `profile:auto` can persist the recommendation directly.

If no profile exists yet, `dev:profile` uses the same goal-aware defaults when picking the initial model.

Use `--provider ollama` when you want a local-only path. Auto mode falls back to OpenAI when no viable local chat model is installed.

Use `--provider atomic-chat` when you want Atomic Chat as the local Apple Silicon provider.

Use `profile:codex` or `--provider codex` when you want the ChatGPT Codex backend.

`dev:openai`, `dev:ollama`, `dev:atomic-chat`, and `dev:codex` run `doctor:runtime` first and only launch the app if checks pass.

For `dev:ollama`, make sure Ollama is running locally before launch.

For `dev:atomic-chat`, make sure Atomic Chat is running with a model loaded before launch.

## Long sessions, context, and token limits

Models enforce a **maximum input size** (context window). Deimos estimates tokens to drive **warnings**, **auto-compact**, and **blocking** before you hit a hard API error. Those estimates are approximate; the provider response is authoritative.

**You cannot raise the real context above what the model supports.** Settings below only change how Deimos plans compaction and surfaces limits. If you set a window **larger** than the model allows, you will still get `prompt is too long` (or similar) from the API.

| Variable | Role |
| --- | --- |
| `DEIMOS_MAX_CONTEXT_TOKENS` | Effective context for Deimos-only math (warnings, blocking, compact thresholds). Integer, clamped between **4096** and **2_000_000**. Overrides `[1m]` suffix and built-in tables when set. Must be ≤ your model’s actual window. |
| `DEIMOS_AUTO_COMPACT_WINDOW` | Caps the window used for auto-compact (compact **earlier** when lower than the resolved window). |
| `DEIMOS_BLOCKING_LIMIT_OVERRIDE` | Token usage at which the app blocks sending until `/compact` (default derives from effective window). |
| `DEIMOS_MAX_OUTPUT_TOKENS` | Upper bound on **assistant output** per turn; still clamped to provider limits. |
| `DEIMOS_FILE_READ_MAX_OUTPUT_TOKENS` | Max tokens injected from a single **file read** (truncation beyond this). |
| `MAX_MCP_OUTPUT_TOKENS` | Max tokens from a single **MCP tool** result. |
| `DEIMOS_DISABLE_1M_CONTEXT` | When truthy, Deimos does not treat models as 1M-capable for budgeting (stricter, compliance-friendly). |

**Continuous work** in long threads: keep **auto-compact** on (default), run **`/compact`** when warned, or start a new session for a clean slate. For OpenAI-shim models missing from `src/utils/model/openaiContextWindows.ts`, Deimos uses a **conservative 8k** window until you add the model — that triggers compact very early; extend the table or set `DEIMOS_MAX_CONTEXT_TOKENS` to match the vendor doc.

Copy-paste names and short comments also live under **OPTIONAL TUNING** in [`.env.example`](../.env.example).

## Optional Python utilities (`python/`)

The [`python/`](../python/) directory contains **optional** Python modules for provider-side experiments (for example local OpenAI-compatible endpoints). They are **not** imported by the main TypeScript CLI build.

- Overview: [`python/README.md`](../python/README.md)
- Tests: `pytest python/tests -v` from the repo root (with dependencies installed)
