# Troubleshooting

## `dxa-agent` command not found after `npm install -g`

Published package: [**`@dxa-agent/dxa-agent`**](https://www.npmjs.com/package/@dxa-agent/dxa-agent).

1. **Close the terminal completely** and open a new one — global npm bins are often picked up only in new sessions.
2. **Check npm’s global bin directory** is on your `PATH`:
   - Run `npm prefix -g` — on many systems the binary is under `<that path>/bin` (Mac/Linux) or `<that path>` (some Windows setups).
   - Run `npm bin -g` (older npm) or look for `dxa-agent.cmd` / `dxa-agent` under the global folder.
3. **Windows:** “App execution aliases” can steal `node`/`npm` — Settings → Apps → Advanced app settings → App execution aliases — turn **off** aliases for `node.exe` if the wrong runtime runs.
4. **Fallback without fixing PATH (temporary):**

   ```bash
   npx --yes @dxa-agent/dxa-agent@latest
   ```

   (Still set your provider env vars in the same shell first.) This is slower than a global install but confirms the package works.

## Settings disappeared after closing the terminal

**Expected:** `export` (Mac/Linux) and `$env:...=` (Windows PowerShell) usually apply **only to that window**. Use the **“Keep settings…”** section in [Windows quick start](quick-start-windows.md) or [macOS / Linux quick start](quick-start-mac-linux.md), or set the variables again each time you open a terminal.

## `ripgrep not found` / `rg` missing

DXA Agent expects **`rg`** on your `PATH`. Install [ripgrep](https://github.com/BurntSushi/ripgrep) for your OS, open a **new** terminal, then run `rg --version`.

## Windows: Git Bash (`bash.exe`)

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

## After merging or syncing `src/` from upstream

If you pull a large update to `src/` (for example from [dxiv/dxa-agent](https://github.com/dxiv/dxa-agent)):

1. **`git fetch upstream`** (or your remote name) and merge or cherry-pick as you prefer.
2. From the repo root: **`bun install`** (or `bun install --frozen-lockfile` in CI) so `node_modules` matches **`bun.lock`**.
3. **`bun run build`** — stale **`dist/cli.mjs`** will not reflect new TypeScript until you rebuild.
4. **`bun test --max-concurrency=1`** — same flags as PR CI; catches env-sensitive tests.
5. If something still looks wrong, remove **`dist/`** and rebuild once (generated output only).

Reconcile **branding** after syncing: root **`package.json`**, **`scripts/build.ts`** (`MACRO.*` strings), **`bin/dxa-agent.mjs`**, and **`vscode-extension/dxa-agent-vscode/README.md`** (install line should stay **`@dxa-agent/dxa-agent`** for this fork).

## `dist/cli.mjs` not found

Run `bun run build` from the repository root, or use `bun run dev` for development. The `dxa-agent` shim in `bin/` only runs a **built** `dist/cli.mjs`.

## Provider / model “not found”

- For OpenAI-compatible servers, check `GET /v1/models` (or your host’s equivalent) lists the model id you set in `OPENAI_MODEL`.
- Run `bun run doctor:runtime` after setting env vars to validate reachability.

## VS Code extension shows “command not found”

Install the CLI globally (`npm install -g @dxa-agent/dxa-agent` — [npm package](https://www.npmjs.com/package/@dxa-agent/dxa-agent)) **or** ensure the `dxa-agent` you built is on the **same PATH** VS Code’s integrated terminal uses. See [extension README](../vscode-extension/dxa-agent-vscode/README.md).

## Still stuck?

Search [Discussions](https://github.com/dxiv/dxa-agent/discussions) or open a thread with OS, DXA Agent version, provider, and the **exact** error text (redact API keys).
