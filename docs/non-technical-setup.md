# DXA Agent setup for new users

This page is for you if you want DXA Agent running **without** cloning the repo or touching the source code. You will use **Node.js** (to run the installer), a **terminal** (a text window where you type commands), and an account or app from an **AI provider** (OpenAI, Ollama, etc.).

**Already comfortable with terminals and npm?** Skip to [Windows](quick-start-windows.md) or [macOS / Linux](quick-start-mac-linux.md), or go straight to [Advanced setup](advanced-setup.md) for building from source.

---

## 1. What you need before you start

| You need | What it is |
| --- | --- |
| **A computer** | Windows 10/11, macOS, or a common Linux distribution |
| **Node.js 20+** | Free runtime from [nodejs.org](https://nodejs.org/) — download the **LTS** installer and use the defaults |
| **A terminal** | A program that runs text commands (see below) |
| **An AI backend** | Either a **cloud API key** (e.g. OpenAI) **or** a **local** app like [Ollama](https://ollama.com/) so the assistant has a model to talk to |

You do **not** need Bun, Git, or this repository’s source code for the path described here.

---

## 2. How to open a terminal

- **Windows:** Press `Win`, type **PowerShell**, open **Windows PowerShell**. (This guide’s Windows steps assume PowerShell.)
- **macOS:** Open **Terminal** (Spotlight: `Cmd + Space`, type “Terminal”) or use iTerm if you already have it.
- **Linux:** Open “Terminal” from your applications menu (names vary by distro).

---

## 3. Check that Node.js works

In the terminal, type exactly:

```text
node --version
```

Press **Enter**. You should see a version like `v20.x.x` or higher.

Then:

```text
npm --version
```

You should see a version number. If either command fails, reinstall Node from [nodejs.org](https://nodejs.org/) and open a **new** terminal.

---

## 4. Install DXA Agent (one command)

Published package: [**`@dxa-dev/agent`**](https://www.npmjs.com/package/@dxa-dev/agent) on npm.

In the same terminal:

```text
npm install -g @dxa-dev/agent
```

Wait until it finishes. This downloads the DXA Agent command-line tool onto your machine.

**If you see permission errors:** on Mac/Linux you may need `sudo npm install -g @dxa-dev/agent` (you will be prompted for your password). On Windows, run PowerShell **as Administrator** once, or fix npm’s global folder using [npm’s permission docs](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

---

## 5. Tell DXA Agent which AI to use (three “settings”)

DXA Agent needs three pieces of information for the common **OpenAI-compatible** path. You set them as **environment variables** — think of them as temporary settings for that terminal window.

| Setting | Plain English |
| --- | --- |
| `CLAUDE_CODE_USE_OPENAI=1` | “Use the OpenAI-style connection path” (this is how DXA Agent talks to many providers, not only OpenAI). |
| `OPENAI_API_KEY` | Your **secret key** from the provider (or leave unset for some local setups). |
| `OPENAI_MODEL` | Which model name to request (for example `gpt-4o` or an Ollama model name). |

**Important:** In the guides below, settings you type with `export` (Mac/Linux) or `$env:...=` (Windows) usually last **only until you close that terminal**. That is normal. The OS quick starts include an optional **“keep these for every session”** section if you want them saved.

---

## 6. Copy the right commands for your system

Do **not** mix Windows and Mac instructions in the same window.

- **Windows (PowerShell):** [DXA Agent quick start — Windows](quick-start-windows.md)  
- **macOS or Linux:** [DXA Agent quick start — macOS / Linux](quick-start-mac-linux.md)

Each guide has **one provider at a time** (OpenAI, DeepSeek, Ollama, or LM Studio). Pick **one** block, paste the commands, then run:

```text
dxa-agent
```

---

## 7. First success

When it works, DXA Agent opens in the terminal. Next:

1. Use the **[setup checklist](setup-checklist.md)** to confirm each prerequisite.
2. Read **[Your first minutes in DXA Agent](first-run.md)** — try **`/help`**, then **`/provider`**, then a short question in plain English.

---

## 8. If something goes wrong

1. **[Troubleshooting](troubleshooting.md)** — “command not found”, PATH, ripgrep, API errors, Ollama.
2. **[GitHub Discussions](https://github.com/dxiv/dxa-agent/discussions)** — search your error text.
3. **Developers** cloning the repo: [Advanced setup](advanced-setup.md) and the root [README](../README.md).

---

## 9. Legal note (short)

DXA Agent is an independent open source project. Third-party names (OpenAI, Ollama, etc.) refer to those products so you know which service to sign up for — not an endorsement. Details: [LEGAL.md](../LEGAL.md).
