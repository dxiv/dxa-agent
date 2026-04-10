# Deimos — 5-minute demo script (recording-safe)

**Brand:** [Deimos @ DXA](https://github.com/dxiv/dxa-deimos/) · [Docs index](README.md) · [Cheatsheet](CHEATSHEET.md)

**Audience:** Anyone evaluating a terminal coding agent.  
**Goal:** Show a real project workflow, tool use, context awareness, and MCP visibility—without exposing secrets or personal paths.

**Approximate runtime:** 5 minutes (adjust pacing if you take questions).

---

> **Security — read before you record**
>
> - Do **not** paste API keys, tokens, passwords, or private URLs into the terminal or chat while recording.
> - Configure credentials **outside** the session: use environment variables (or your OS secret store) and reference them only by **name** on camera—for example, “I already set `YOUR_PROVIDER_API_KEY` in my profile.”
> - Use **placeholder** values in any on-screen examples (`YOUR_PROJECT`, `sk-example-not-a-real-key`).
> - Prefer a **throwaway** or **public sample** repository for demos when possible.

---

## Before you go live (off camera)

1. Open **`YOUR_PROJECT`** in your editor (optional: use the Deimos VS Code extension’s Control Center if you want that angle).
2. Ensure `deimos` is on your `PATH` and your provider is configured via **env vars** or a saved profile—**no keys typed during the demo**.
3. Close unrelated tabs and notifications; hide or blur anything that could leak account or machine details.

---

## Minute 0:00–0:45 — Open the workspace and start Deimos

**Say:**

> “I’m going to work in a local project called **YOUR_PROJECT**. Deimos is a terminal agent: one command, and I stay in the repo I care about.”

**Do:**

1. `cd` into **`YOUR_PROJECT`** (use a short generic path on screen, not a home directory with a real username).
2. Run `deimos`.

**Say:**

> “From here I can switch providers, run slash commands, and approve tools—same mental model as other agent UIs, but in the terminal.”

---

## Minute 0:45–3:15 — Small coding task + tool use

**Say:**

> “I’ll ask for something small and local: a clear change I can verify—like adding a constant, fixing a typo, or adding a one-line doc comment—so we see **read → propose → apply** without a risky refactor.”

**Example prompt (adapt to YOUR_PROJECT):**

> “In `YOUR_FILE`, add a short comment above `YOUR_FUNCTION` explaining what it returns. Don’t change behavior.”

**Do:**

1. Let Deimos **read** the relevant files (or search the tree) using its tools.
2. When a **tool** runs (read file, patch, run a safe command), **narrate briefly**: “It’s proposing a read here; I’ll approve” / “It’s suggesting an edit; I’ll review the diff.”
3. After the change, run your usual quick check (e.g. unit test or typecheck) **only if** it’s fast and safe for the recording—skip if it would leak paths or secrets.

**Say:**

> “The important part is the loop: grounded in the repo, tools are visible, and I stay in control of approvals.”

---

## Minute 3:15–4:00 — Context: `/context` or compaction

**Say:**

> “Long sessions fill the model context. Deimos lets me **inspect** what’s using tokens and, when needed, **compact** so we don’t lose the thread.”

**Do (pick one):**

- Run **`/context`** and point at the summary: messages, files in play, token-style breakdown (wording may vary by version).
- **Or** mention **`/compact`** in one sentence: “If this thread gets huge, I can run **`/compact`** to roll history into a summary and keep going.”

**Say:**

> “So I’m not flying blind on ‘how full’ the session is.”

---

## Minute 4:00–4:45 — MCP: `/mcp` and the status line

**Say:**

> “MCP connects external tools and data sources. I want to see what’s connected without digging through config files on a screen share.”

**Do:**

1. Run **`/mcp`** (or open the MCP UI your build exposes).
2. Point to the **MCP status** in the interface—e.g. connected servers, counts, or health—**without** scrolling past server URLs or credentials.

**Say:**

> “If something’s misconfigured, I’ll spot it here before I waste a turn debugging ‘why didn’t that tool exist?’”

---

## Minute 4:45–5:00 — Close

**Say:**

> “That’s the shape of a Deimos session: **project-first**, **visible tools**, **`/context`** for awareness, **`/mcp`** for integrations—credentials stay in **environment variables**, not in the transcript.”

**Optional one-liner:**

> “Docs and install: see the repo README and `docs/README.md`; first-time setup: `docs/first-run.md`.”

---

## Placeholder cheat sheet (keep on a sticky note)

| On screen / in speech | Meaning |
|----------------------|--------|
| `YOUR_PROJECT` | Your demo repo root (generic name) |
| `YOUR_FILE` / `YOUR_FUNCTION` | Concrete but non-sensitive symbols |
| `YOUR_PROVIDER_API_KEY` | Env var **name** only—never the value |

Do **not** display strings that look like real API keys (for example, never show a live `sk-…` or `ghp_…` value).
