# Setup checklist

Use this to verify your machine **before** and **after** installing DXA Agent. Check boxes as you go.

---

## Before you run `dxa-agent`

- [ ] **Node.js 20+** installed (`node --version` shows v20 or higher).
- [ ] **npm** works (`npm --version`).
- [ ] **Ripgrep** installed (`rg --version`). If missing, see [Troubleshooting — ripgrep](troubleshooting.md).
- [ ] **Windows only:** [Git for Windows](https://git-scm.com/download/win) installed if DXA Agent asks for `bash.exe` (see [Troubleshooting](troubleshooting.md)).
- [ ] **Cloud provider:** API key ready **or** **local:** Ollama / LM Studio installed and running with a model loaded.
- [ ] You ran **`npm install -g @dxa-dev/agent`** ([npm](https://www.npmjs.com/package/@dxa-dev/agent)) and a **new** terminal if `dxa-agent` was not found right away.

---

## Environment (pick one provider)

Copy the block for **one** provider from [Windows](quick-start-windows.md) or [macOS / Linux](quick-start-mac-linux.md).

- [ ] `CLAUDE_CODE_USE_OPENAI=1` (or PowerShell `$env:CLAUDE_CODE_USE_OPENAI="1"`).
- [ ] `OPENAI_API_KEY` set if your provider needs a key (often skip for local Ollama).
- [ ] `OPENAI_MODEL` set to a model that exists on your host.
- [ ] `OPENAI_BASE_URL` set if you are **not** using default OpenAI (DeepSeek, Ollama, LM Studio, OpenRouter, etc.).

Remember: variables set with `export` / `$env:` usually **reset when you close the terminal** unless you saved them (see “Keep settings” in the OS guides).

---

## After `dxa-agent` starts

- [ ] You see the interactive UI (not an immediate crash).
- [ ] `/help` shows a command list.
- [ ] You run `/provider` once to confirm or save provider settings.
- [ ] You sent a **small test prompt** (e.g. “List files here and summarize.”).

---

## Still broken?

1. [Troubleshooting](troubleshooting.md)  
2. [GitHub Discussions](https://github.com/dxiv/dxa-agent/discussions) (search your error text)  
3. [Non-technical setup](non-technical-setup.md) (re-read from the top)
