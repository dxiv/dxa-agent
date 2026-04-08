# Deimos quick start — macOS and Linux

**Product:** [dxa.dev/deimos/](https://dxa.dev/deimos/) · **npm:** [`@dxa-dev/deimos`](https://www.npmjs.com/package/@dxa-dev/deimos)

**Audience:** macOS or Linux users using **bash** or **zsh** in Terminal (or iTerm, etc.).

**You will:** install Node (if needed), install Deimos with npm, `export` three environment variables for your AI provider, then run `deimos`.

**Other paths:** [Non-technical walkthrough](non-technical-setup.md) · [Windows](quick-start-windows.md) · [Advanced / source build](advanced-setup.md) · [Cheatsheet](CHEATSHEET.md) · [Troubleshooting](troubleshooting.md)

---

## Prerequisites

1. **Node.js 22+** — [https://nodejs.org/](https://nodejs.org/) (LTS that meets v22+) or your distro’s package manager. Check:

   ```bash
   node --version
   npm --version
   ```

2. **Ripgrep (`rg`)** — Required for search features.

   - **macOS (Homebrew):** `brew install ripgrep`
   - **Debian/Ubuntu:** `sudo apt install ripgrep`
   - **Fedora:** `sudo dnf install ripgrep`
   - **Arch:** `sudo pacman -S ripgrep`

   Then run `rg --version`. If Deimos still complains, open a **new** terminal.

---

## Install Deimos

```bash
npm install -g @dxa-dev/deimos
```

If you see `EACCES` / permission errors, either:

- use a Node version manager ([nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), etc.), **or**
- run with `sudo npm install -g @dxa-dev/deimos` (less ideal but common on first setup).

If `deimos` is not found, close the terminal, open a new one, and try again. Check `npm bin -g` is on your `PATH` (`echo $PATH`).

---

## Environment variables (how this works)

These configure the **OpenAI-compatible** path (OpenAI, DeepSeek, Ollama, LM Studio, OpenRouter, …):

| Variable | Purpose |
| --- | --- |
| `DEIMOS_USE_OPENAI` | Set to `1` to enable this mode. |
| `OPENAI_API_KEY` | API secret from the provider (skip for many local setups). |
| `OPENAI_MODEL` | Model id string your host expects. |
| `OPENAI_BASE_URL` | Only if not using `https://api.openai.com/v1`. |

`export` lasts **for this shell session only** unless you add lines to your shell config (below).

---

## Option A — OpenAI (cloud)

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_MODEL=gpt-4o

deimos
```

---

## Option B — DeepSeek (cloud)

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-chat

deimos
```

---

## Option C — Ollama (local)

1. Install Ollama: [https://ollama.com/download](https://ollama.com/download)  
2. Pull a model:

   ```bash
   ollama pull llama3.2:3b
   ```

3. Run:

   ```bash
   export DEIMOS_USE_OPENAI=1
   export OPENAI_BASE_URL=http://localhost:11434/v1
   export OPENAI_MODEL=llama3.2:3b

   Deimos
   ```

Match `OPENAI_MODEL` to a name from `ollama list`.

---

## Option D — LM Studio (local)

1. Install [LM Studio](https://lmstudio.ai/), load a model, enable the **local server** (Developer tab).  
2. Set model id and URL to match LM Studio (port **1234** is typical).

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_MODEL=your-model-name-from-lm-studio

deimos
```

If the server returns auth errors:

```bash
export OPENAI_API_KEY=lmstudio
```

---

## Keep settings in every new terminal (optional)

**zsh (default on recent macOS):** append to `~/.zshrc`:

```bash
export DEIMOS_USE_OPENAI=1
export OPENAI_API_KEY="sk-your-key-here"
export OPENAI_MODEL="gpt-4o"
# export OPENAI_BASE_URL="https://api.deepseek.com/v1"
```

Then run `source ~/.zshrc` or open a new tab.

**bash:** use `~/.bashrc` or `~/.bash_profile` the same way (depends on distro).

**Security:** files in your home directory can contain secrets — `chmod 600 ~/.zshrc` is a good habit; never commit these files to git.

---

## Update or remove

```bash
npm install -g @dxa-dev/deimos@latest
```

```bash
npm uninstall -g @dxa-dev/deimos
```

---

## Next steps

- **[Setup checklist](setup-checklist.md)** — verify prerequisites and env vars.
- **[First run inside Deimos](first-run.md)** — `/help`, `/provider`, exiting safely.
- Full env table and Bun workflows: [Advanced setup](advanced-setup.md) · Issues: [Troubleshooting](troubleshooting.md)
