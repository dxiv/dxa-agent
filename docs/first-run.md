# Your first minutes in DXA Agent

You already ran `dxa-agent` from a terminal and see the **interactive UI**. This page explains what to do next, in plain language.

**Not installed yet?** Install from npm: [**`@dxa-dev/agent`**](https://www.npmjs.com/package/@dxa-dev/agent), or use [Non-technical setup](non-technical-setup.md) or [Windows](quick-start-windows.md) / [macOS / Linux](quick-start-mac-linux.md) first.

---

## 1. What you are looking at

- The app runs **in the terminal**. You type **messages** and **slash commands** (they start with `/`).
- The assistant can **propose actions** (read files, run shell commands, etc.). It should ask **before** doing anything risky—read prompts carefully and choose **allow** or **deny** when offered.

---

## 2. Start with `/help`

Type:

```text
/help
```

Press **Enter**. That lists built-in **slash commands** you can use. The exact list can change between versions, but it is always the authoritative menu on your install.

---

## 3. Set up or change your AI provider: `/provider`

If you are unsure your API key or local server is configured correctly, run:

```text
/provider
```

That starts a **guided flow** to pick a provider and model and can save a **profile** (so you rely less on hand-typed environment variables next time).

---

## 4. GitHub Models (optional)

If you use **GitHub Models**, run:

```text
/onboard-github
```

and follow the prompts. (You need a GitHub account and appropriate access per GitHub’s terms.)

---

## 5. Normal questions (no slash)

Anything **without** a leading `/` is sent to the model as a normal request, for example:

- “Explain what `package.json` does in this folder.”
- “Add error handling to the function in `src/foo.ts`.”

**Tip:** `cd` to your **project folder** in the same terminal **before** running `dxa-agent`, so paths and git context match the code you care about.

---

## 6. Leaving the app

- Use the **`/exit`** slash command to leave in a controlled way (you may see a short confirmation depending on version).
- **Ctrl+C** usually interrupts the current work or stops the process; use it if the UI is stuck (you may lose unsaved in-session state).

---

## 7. If something fails immediately

- **Connection / API errors:** see [Troubleshooting](troubleshooting.md) and double-check `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL`.
- **Ripgrep / bash errors:** same guide — install `rg` and Git Bash on Windows if asked.
- **Building from source:** run `bun run doctor:runtime` after setting env vars ([Advanced setup](advanced-setup.md)).

---

## 8. Next steps

- [Troubleshooting](troubleshooting.md) · [Advanced setup](advanced-setup.md) · [README](../README.md) · [VS Code extension](../vscode-extension/dxa-agent-vscode/README.md)
