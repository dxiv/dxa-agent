# DXA Agent quick start — Windows

**Audience:** Anyone on **Windows 10/11** using **PowerShell** (not CMD unless you know how to translate commands).

**You will:** install Node (if needed), install DXA Agent with npm, set three environment variables for your chosen AI provider, then run `dxa-agent`.

**Other paths:** [Non-technical walkthrough](non-technical-setup.md) · [macOS / Linux](quick-start-mac-linux.md) · [Advanced / source build](advanced-setup.md) · [Troubleshooting](troubleshooting.md)

---

## Prerequisites

1. **Node.js 20+** — [https://nodejs.org/](https://nodejs.org/) (LTS). Then in PowerShell:

   ```powershell
   node --version
   npm --version
   ```

2. **Ripgrep (`rg`)** — DXA Agent uses it for search. If the first run says `ripgrep not found`, install [Ripgrep for Windows](https://github.com/BurntSushi/ripgrep/releases) or `winget install BurntSushi.ripgrep.MSVC`, then open a **new** PowerShell and check `rg --version`.

3. **Git for Windows** (recommended) — gives you `bash.exe` for some agent features. If DXA Agent complains about bash, install [Git for Windows](https://git-scm.com/download/win) and see [Troubleshooting — Windows Git Bash](troubleshooting.md).

---

## Install DXA Agent

```powershell
npm install -g @dxiv/dxa-agent
```

If `dxa-agent` is not found afterward, **close PowerShell completely**, open a new window, and try `dxa-agent` again. If it still fails, see [Troubleshooting](troubleshooting.md).

---

## Environment variables (how this works)

These three variables configure the **OpenAI-compatible** code path (used for OpenAI, DeepSeek, Ollama’s API, LM Studio, and many others):

| Variable | Purpose |
| --- | --- |
| `CLAUDE_CODE_USE_OPENAI` | Set to `1` to enable this provider mode. |
| `OPENAI_API_KEY` | Secret key from your cloud provider (often omitted for local Ollama / LM Studio). |
| `OPENAI_MODEL` | Model id (e.g. `gpt-4o`, `deepseek-chat`, or your Ollama model name). |
| `OPENAI_BASE_URL` | Only if not using default OpenAI — set to your provider’s API base URL. |

The blocks below set them **for the current PowerShell window only**.

---

## Option A — OpenAI (cloud)

Replace `sk-your-key-here` with your key from [OpenAI API keys](https://platform.openai.com/api-keys).

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-your-key-here"
$env:OPENAI_MODEL="gpt-4o"

dxa-agent
```

---

## Option B — DeepSeek (cloud)

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_API_KEY="sk-your-key-here"
$env:OPENAI_BASE_URL="https://api.deepseek.com/v1"
$env:OPENAI_MODEL="deepseek-chat"

dxa-agent
```

---

## Option C — Ollama (local, no cloud key)

1. Install Ollama: [https://ollama.com/download/windows](https://ollama.com/download/windows)  
2. Start Ollama (tray app) and pull a model:

   ```powershell
   ollama pull llama3.2:3b
   ```

3. Run:

   ```powershell
   $env:CLAUDE_CODE_USE_OPENAI="1"
   $env:OPENAI_BASE_URL="http://localhost:11434/v1"
   $env:OPENAI_MODEL="llama3.2:3b"

   DXA Agent
   ```

Use the same model name you pulled (`ollama list` to see names).

---

## Option D — LM Studio (local)

1. Install [LM Studio](https://lmstudio.ai/), download a model, open the **Developer** tab, start the local server (default often port **1234**).  
2. Use the **exact** model identifier LM Studio shows for the API.

```powershell
$env:CLAUDE_CODE_USE_OPENAI="1"
$env:OPENAI_BASE_URL="http://localhost:1234/v1"
$env:OPENAI_MODEL="your-model-name-from-lm-studio"

dxa-agent
```

If you get auth errors, try a dummy key:

```powershell
$env:OPENAI_API_KEY="lmstudio"
```

---

## Keep settings for every new PowerShell (optional)

Session variables disappear when you close the window. To set **user-level** variables (persist across sessions):

```powershell
[System.Environment]::SetEnvironmentVariable("CLAUDE_CODE_USE_OPENAI", "1", "User")
[System.Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-your-key-here", "User")
[System.Environment]::SetEnvironmentVariable("OPENAI_MODEL", "gpt-4o", "User")
# Optional for non-OpenAI endpoints:
# [System.Environment]::SetEnvironmentVariable("OPENAI_BASE_URL", "https://api.deepseek.com/v1", "User")
```

Open a **new** PowerShell after this. **Warning:** your API key is stored in Windows user environment variables — anyone with access to your user account could read them. Prefer session-only vars on shared PCs.

---

## Update or remove

```powershell
npm install -g @dxiv/dxa-agent@latest
```

```powershell
npm uninstall -g @dxiv/dxa-agent
```

---

## Next steps

- **[Setup checklist](setup-checklist.md)** — verify each step if anything fails.
- **[First run inside DXA Agent](first-run.md)** — `/help`, `/provider`, permissions, exiting.
- More providers: [Advanced setup](advanced-setup.md) · Problems: [Troubleshooting](troubleshooting.md)
