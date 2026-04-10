# Deimos — terminal cheatsheet

**[Deimos](https://github.com/dxiv/dxa-deimos/)** · terminal-native agent

Quick reference for the interactive `deimos` CLI. **Install:** [README.md](../README.md) (Quick start). **First session:** [first-run.md](first-run.md). **Doc index:** [docs/README.md](README.md). **When something breaks:** [troubleshooting.md](troubleshooting.md).

---

## Essential slash commands

Slash commands use the form `/name` (hyphens as shown). Examples you will use often:

| Command | Typical use |
|--------|-------------|
| `/help` | List commands and built-in help |
| `/compact` | Shrink context / transcript footprint |
| `/context` | Inspect or adjust what is in context |
| `/mcp` | Manage Model Context Protocol servers and related options |
| `/permissions` | Review or change tool permission behavior |

Other common entries (same naming pattern): `/provider` (provider setup), `/config` (settings), `/doctor` (diagnostics), `/clear` (clear UI), `/exit` (leave the session), `/keybindings` (keyboard shortcuts). Plugins and feature flags can add more; **`/help` stays authoritative**.

### All commands defined under `src/commands/**/index.ts`

Alphabetical by registered `name` (folder names may differ, e.g. `bridge` → `/remote-control`):

`/add-dir` · `/agents` · `/branch` · `/buddy` · `/btw` · `/chrome` · `/clear` · `/color` · `/compact` · `/config` · `/context` · `/copy` · `/cost` · `/desktop` · `/diff` · `/doctor` · `/effort` · `/exit` · `/export` · `/extra-usage` · `/fast` · `/feedback` · `/files` · `/fork` · `/heapdump` · `/help` · `/hooks` · `/ide` · `/install-github-app` · `/install-slack-app` · `/keybindings` · `/login` · `/logout` · `/mcp` · `/memory` · `/mobile` · `/model` · `/onboard-github` · `/output-style` · `/passes` · `/peers` · `/permissions` · `/plan` · `/pr-comments` · `/privacy-settings` · `/provider` · `/rate-limit-options` · `/release-notes` · `/reload-plugins` · `/remote-control` · `/remote-env` · `/rename` · `/resume` · `/rewind` · `/sandbox` · `/session` · `/skills` · `/stats` · `/status` · `/stickers` · `/tag` · `/tasks` · `/terminal-setup` · `/theme` · `/think-back` · `/thinkback-play` · `/usage` · `/upgrade` · `/vim` · `/voice` · `/web-setup` · `/workflows`

---

## Keyboard

| Keys | Role |
|------|------|
| **Esc** | In chat: cancel the current line / operation where supported. In prompts and confirmations: **no** / go back / dismiss (see on-screen hints). |
| **Enter** | In confirmation dialogs: **yes** / accept (along with **`y`**; **`n`** is **no**). |

Defaults live in `src/keybindings/defaultBindings.ts`. Change them with **`/keybindings`** (and your user keybindings file).

---

## Permissions

Use **`/permissions`** when you need stricter or looser tool access, or when the assistant keeps stopping for approval. Read the prompts carefully before allowing broad access (e.g. full filesystem or shell).

---

## MCP

Use **`/mcp`** to connect external tools and data sources. Configure servers through the guided UI; keep credentials in environment variables or your OS secret store, not in chat logs.

---

## Updating

- **Installed CLI version:** `deimos --version`
- **Refresh the global npm package** (same package as in the README): e.g. `npm install -g @dxa-deimos/cli`
- In-session upgrades may also be available via **`/upgrade`** when your build supports it.

---

**Deimos** · [github.com/dxiv/dxa-deimos/](https://github.com/dxiv/dxa-deimos/) · [Documentation index](README.md) · npm [`@dxa-deimos/cli`](https://www.npmjs.com/package/@dxa-deimos/cli)
