# Deimos — local agent playbook

**[dxa.dev/deimos/](https://dxa.dev/deimos/)** · [Documentation index](docs/README.md) · [Cheatsheet](docs/CHEATSHEET.md)

Practical guide to run Deimos with a **local model** (for example Ollama), work safely, and get reliable day-to-day results from a **source checkout**. For installs from npm, see the [README](README.md) quick start; this document assumes you are in a **git clone** with Bun available.

## 1. What you have

- A terminal agent loop: read/write files, shell commands, tools, MCP, slash commands.
- Saved provider profiles (`profile:init`, `dev:profile`) and a profile file (`.deimos-profile.json` in the project root — gitignored).
- Runtime checks (`doctor:runtime`) and optional JSON reports (`doctor:report`).

## 2. Daily start (fast path)

From the **repository root**:

```powershell
bun run dev:profile
```

Shortcuts:

```powershell
# low-latency preset (see package.json for the exact model)
bun run dev:fast

# stronger coding preset
bun run dev:code
```

If the environment is healthy, Deimos should start with the profile you last saved.

## 3. One-time setup (if needed)

### 3.1 Initialize a local profile

```powershell
bun run profile:init -- --provider ollama --model llama3.1:8b
```

Or ask for a recommendation by goal:

```powershell
bun run profile:init -- --provider ollama --goal coding
```

Preview recommendations before saving:

```powershell
bun run profile:recommend -- --goal coding --benchmark
```

### 3.2 Confirm the profile file

```powershell
Get-Content .\.deimos-profile.json
```

On macOS / Linux:

```bash
cat .deimos-profile.json
```

### 3.3 Validate the environment

```powershell
bun run doctor:runtime
```

## 4. Health and diagnostics

### 4.1 Human-readable checks

```powershell
bun run doctor:runtime
```

### 4.2 JSON diagnostics (automation or logs)

```powershell
bun run doctor:runtime:json
```

### 4.3 Persist a runtime report

```powershell
bun run doctor:report
```

Output: `reports/doctor-runtime.json`

### 4.4 Hardening

```powershell
bun run hardening:check
bun run hardening:strict
```

## 5. Provider modes

### 5.1 Local (Ollama)

```powershell
bun run profile:init -- --provider ollama --model llama3.1:8b
bun run dev:profile
```

Expected:

- No cloud API key for pure local Ollama.
- `OPENAI_BASE_URL` should be `http://localhost:11434/v1` when using the OpenAI-compatible path to Ollama.

### 5.2 OpenAI-compatible (cloud)

```powershell
bun run profile:init -- --provider openai --api-key sk-... --model gpt-4o
bun run dev:profile
```

Expected:

- A real API key; placeholder values should fail fast.

## 6. Troubleshooting

### 6.1 `Script not found` or missing npm script

**Cause:** Commands were run outside the repo root, or Bun/npm is not using this package’s `package.json`.

**Fix:** `cd` to the clone root (where `package.json` lives), then rerun:

```powershell
bun run dev:profile
```

### 6.2 `ollama` not found

**Cause:** Ollama is not installed or not on `PATH` in this terminal.

**Fix:** Install Ollama from [ollama.com](https://ollama.com), open a **new** terminal, then:

```powershell
ollama --version
```

### 6.3 Provider reachability failed for localhost

**Cause:** Ollama is not serving.

**Fix:** In one terminal:

```powershell
ollama serve
```

In another:

```powershell
bun run doctor:runtime
```

### 6.4 Missing key for a non-local URL

**Cause:** The profile points at a remote base URL without credentials.

**Fix:** Re-run `profile:init` for Ollama, or supply the correct key for the remote provider.

### 6.5 Placeholder API key errors

**Cause:** A template value was left in place of a real key.

**Fix:** Use a real key for cloud providers; for local Ollama, keep localhost and no key as appropriate.

## 7. Suggested local models

Examples (hardware-dependent):

- Fast / general: `llama3.1:8b`
- Stronger coding (if the machine can handle it): `qwen2.5-coder:14b`
- Very constrained hardware: smaller instruct models

Switch model:

```powershell
bun run profile:init -- --provider ollama --model qwen2.5-coder:14b
bun run dev:profile
```

Repository shortcuts (see `package.json`):

```powershell
bun run profile:fast
bun run profile:code
```

Goal-based selection:

```powershell
bun run profile:init -- --provider ollama --goal latency
bun run profile:init -- --provider ollama --goal balanced
bun run profile:init -- --provider ollama --goal coding
```

`profile:auto` picks a best-available profile across providers — pin `--provider ollama` when you want to stay local.

## 8. Prompt patterns (copy/paste)

**Understand the codebase**

- “Map this repository’s layout and explain the path from the CLI entrypoint to tool execution.”
- “List the riskiest modules here and why.”

**Refactor**

- “Refactor this module for clarity without changing behaviour; run the project’s tests or smoke checks and summarize impact.”

**Debug**

- “Reproduce the failure, find root cause, patch, and validate with commands.”

**Reliability**

- “Add clear errors for invalid provider environment variables.”
- “Emit a JSON diagnostic suitable for CI artifacts.”

**Review**

- “Review unstaged changes; prioritize real bugs and suggest concrete fixes.”

## 9. Safe working habits

- Run `doctor:runtime` before chasing provider issues.
- Prefer `dev:profile` over hand-editing environment variables when a profile exists.
- Keep `.deimos-profile.json` out of version control (already gitignored).
- Capture `doctor:report` when asking others for help.

## 10. Quick recovery checklist

```powershell
bun run doctor:runtime
bun run doctor:report
bun run smoke
```

If local inference is slow, check what Ollama is doing:

```powershell
ollama ps
```

If local mode fails outright:

```powershell
ollama --version
ollama serve
bun run doctor:runtime
bun run dev:profile
```

## 11. Command reference (clone / dev)

```powershell
bun run profile:init -- --provider ollama --model llama3.1:8b
bun run profile:init -- --provider openai --api-key sk-... --model gpt-4o

bun run dev:profile
bun run dev:ollama
bun run dev:openai

bun run doctor:runtime
bun run doctor:runtime:json
bun run doctor:report

bun run smoke
bun run hardening:check
bun run hardening:strict
```

## 12. Success criteria

Your setup is in good shape when:

- `bun run doctor:runtime` passes provider and reachability checks.
- `bun run dev:profile` starts the CLI normally.
- The active model in the UI matches the profile you expect.

For packaged installs (`npm install -g @dxa-dev/deimos`), use the `deimos` command and the guides under [docs/](docs/README.md) instead of `bun run dev:*` unless you are developing this repository.
