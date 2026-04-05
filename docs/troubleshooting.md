# Troubleshooting

## `ripgrep not found` / `rg` missing

OpenClaude expects **`rg`** on your `PATH`. Install [ripgrep](https://github.com/BurntSushi/ripgrep) for your OS, open a **new** terminal, then run `rg --version`.

## Windows: Git Bash / `bash.exe`

If the CLI says it cannot find bash, install [Git for Windows](https://git-scm.com/downloads/win) and ensure `bash.exe` is available. If Git is installed but not on `PATH`, set:

`CLAUDE_CODE_GIT_BASH_PATH` → full path to `bash.exe` (for example `C:\Program Files\Git\bin\bash.exe`).

## `401` / `403` / “invalid API key”

- Confirm the key is for the **same** host as `OPENAI_BASE_URL` (OpenAI vs OpenRouter vs a proxy).
- No stray quotes or spaces when exporting env vars.
- For **Codex**, check `~/.codex/auth.json` or `CODEX_API_KEY` per [advanced setup](advanced-setup.md).

## Ollama: connection errors

- Ollama must be running: `ollama serve` (or the app running in the background).
- Default API base is `http://localhost:11434/v1` — use `OPENAI_BASE_URL` if you changed the port.
- Pick a model you actually pulled: `ollama pull <name>`.

## `bun run build` fails

- Use **Bun 1.3.11+** (see [advanced setup](advanced-setup.md)).
- Run `bun install --frozen-lockfile` from the repo root.
- On Windows, prefer a normal path without odd permissions (avoid syncing-only folders if builds fail mysteriously).

## `dist/cli.mjs` not found

Run `bun run build` from the repository root, or use `bun run dev` for development. The `openclaude` shim in `bin/` only runs a **built** `dist/cli.mjs`.

## Provider / model “not found”

- For OpenAI-compatible servers, check `GET /v1/models` (or your host’s equivalent) lists the model id you set in `OPENAI_MODEL`.
- Run `bun run doctor:runtime` after setting env vars to validate reachability.

## VS Code extension shows “command not found”

Install the CLI globally (`npm install -g @dxiv/openclaude`) **or** ensure the `openclaude` you built is on the **same PATH** VS Code’s integrated terminal uses. See [extension README](../vscode-extension/openclaude-vscode/README.md).

## Still stuck?

Search [Discussions](https://github.com/dxiv/OpenClaude/discussions) or open a thread with OS, OpenClaude version, provider, and the **exact** error text (redact API keys).
