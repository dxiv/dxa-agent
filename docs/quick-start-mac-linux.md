# DXA Agent quick start — macOS and Linux

**Audience:** macOS or Linux users using **bash** or **zsh** in Terminal (or iTerm, etc.).

**You will:** install Node (if needed), install DXA Agent with npm, `export` three environment variables for your AI provider, then run `dxa-agent`.

**Other paths:** [Non-technical walkthrough](non-technical-setup.md) · [Windows](quick-start-windows.md) · [Advanced / source build](advanced-setup.md) · [Troubleshooting](troubleshooting.md) · [npm package](https://www.npmjs.com/package/@dxa-dev/agent)

---

## Prerequisites

1. **Node.js 20+** — [https://nodejs.org/](https://nodejs.org/) (LTS) or your distro’s package manager. Check:

   ```bash
   node --version
   npm --version
   ```

2. **Ripgrep (`rg`)** — Required for search features.

   - **macOS (Homebrew):** `brew install ripgrep`
   - **Debian/Ubuntu:** `sudo apt install ripgrep`
   - **Fedora:** `sudo dnf install ripgrep`
   - **Arch:** `sudo pacman -S ripgrep`

   Then run `rg --version`. If DXA Agent still complains, open a **new** terminal.

---

## Install DXA Agent

```bash
npm install -g @dxa-dev/agent
```

If you see `EACCES` / permission errors, either:

- use a Node version manager ([nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), etc.), **or**
- run with `sudo npm install -g @dxa-dev/agent` (less ideal but common on first setup).

If `dxa-agent` is not found, close the terminal, open a new one, and try again. Check `npm bin -g` is on your `PATH` (`echo $PATH`).

---

## Environment variables (how this works)

These configure the **OpenAI-compatible** path (OpenAI, DeepSeek, Ollama, LM Studio, OpenRouter, …):

| Variable | Purpose |
| --- | --- |
| `CLAUDE_CODE_USE_OPENAI` | Set to `1` to enable this mode. |
| `OPENAI_API_KEY` | API secret from the provider (skip for many local setups). |
| `OPENAI_MODEL` | Model id string your host expects. |
| `OPENAI_BASE_URL` | Only if not using `https://api.openai.com/v1`. |

`export` lasts **for this shell session only** unless you add lines to your shell config (below).

---

## Option A — OpenAI (cloud)

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_MODEL=gpt-4o

dxa-agent
```

---

## Option B — DeepSeek (cloud)

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_API_KEY=sk-your-key-here
export OPENAI_BASE_URL=https://api.deepseek.com/v1
export OPENAI_MODEL=deepseek-chat

dxa-agent
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
   export CLAUDE_CODE_USE_OPENAI=1
   export OPENAI_BASE_URL=http://localhost:11434/v1
   export OPENAI_MODEL=llama3.2:3b

   DXA Agent
   ```

Match `OPENAI_MODEL` to a name from `ollama list`.

---

## Option D — LM Studio (local)

1. Install [LM Studio](https://lmstudio.ai/), load a model, enable the **local server** (Developer tab).  
2. Set model id and URL to match LM Studio (port **1234** is typical).

```bash
export CLAUDE_CODE_USE_OPENAI=1
export OPENAI_BASE_URL=http://localhost:1234/v1
export OPENAI_MODEL=your-model-name-from-lm-studio

dxa-agent
```

If the server returns auth errors:

```bash
export OPENAI_API_KEY=lmstudio
```

---

## Keep settings in every new terminal (optional)

**zsh (default on recent macOS):** append to `~/.zshrc`:

```bash
export CLAUDE_CODE_USE_OPENAI=1
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
npm install -g @dxa-dev/agent@latest
```

```bash
npm uninstall -g @dxa-dev/agent
```

---

## Next steps

- **[Setup checklist](setup-checklist.md)** — verify prerequisites and env vars.
- **[First run inside DXA Agent](first-run.md)** — `/help`, `/provider`, exiting safely.
- Full env table and Bun workflows: [Advanced setup](advanced-setup.md) · Issues: [Troubleshooting](troubleshooting.md)
