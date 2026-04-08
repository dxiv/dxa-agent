# Deimos on Android (Termux)

Run Deimos on Android with **Termux** + **proot-distro** (Ubuntu). **Bun** is used to build the CLI; Bun’s Linux build runs inside Ubuntu, not on bare Termux.

**Link hub:** [dxa.dev/deimos/](https://dxa.dev/deimos/) · **Desktop / npm:** the published CLI is [**`@dxa-dev/deimos`**](https://www.npmjs.com/package/@dxa-dev/deimos) — use that path on Windows, macOS, or Linux instead of this Android build when you can.

Third-party apps (Termux, OpenRouter, model hosts) are governed by their own terms; this guide covers only building and running Deimos in this environment.

---

## Prerequisites

- ~700MB free storage
- [Termux](https://f-droid.org/en/packages/com.termux/) from **F-Droid** (avoid the Play Store build for this workflow)
- An [OpenRouter](https://openrouter.ai) API key if you follow the OpenRouter example below (their terms apply)

---

## Installation

### Step 1 — Update Termux

```bash
pkg update && pkg upgrade
```

Press `N` or Enter for config conflict prompts.

### Step 2 — Install Termux packages

```bash
pkg install git proot-distro
```

(`git` clones the repo; the actual build uses **Bun inside Ubuntu** in later steps.)

### Step 3 — Clone this repository

By default, `git clone` creates a folder named **`dxa-deimos`** (the repository name). If you cloned into a different path, `cd` there instead.

```bash
cd ~
git clone https://github.com/dxiv/dxa-deimos.git
cd dxa-deimos   # or your chosen clone directory
```

Stay on this clone path for all later `cd` commands.

### Step 4 — Install Ubuntu via proot

```bash
proot-distro install ubuntu
```

This downloads ~200–400MB. Wait for it to complete.

### Step 5 — Install Bun inside Ubuntu

```bash
proot-distro login ubuntu
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version  # should show 1.3.11+
```

### Step 6 — Install deps and build

From **inside** Ubuntu, point at your clone (adjust only if your home layout differs):

```bash
cd /data/data/com.termux/files/home/dxa-deimos
bun install
bun run build
```

You should see a successful build ending with `dist/cli.mjs`.

### Step 7 — Save env vars permanently

Still inside Ubuntu, add your OpenRouter config to `.bashrc`:

```bash
echo 'export DEIMOS_USE_OPENAI=1' >> ~/.bashrc
echo 'export OPENAI_API_KEY=your_openrouter_key_here' >> ~/.bashrc
echo 'export OPENAI_BASE_URL=https://openrouter.ai/api/v1' >> ~/.bashrc
echo 'export OPENAI_MODEL=qwen/qwen3.6-plus-preview:free' >> ~/.bashrc
source ~/.bashrc
```

Replace `your_openrouter_key_here` with your actual key from [openrouter.ai/keys](https://openrouter.ai/keys).

### Step 8 — Run Deimos

```bash
node dist/cli.mjs
```

Select **3** (3rd-party platform) at the login screen. Your env vars will be detected automatically.

---

## Restarting After Closing Termux

Every time you reopen Termux after killing it, run:

```bash
proot-distro login ubuntu
cd /data/data/com.termux/files/home/dxa-deimos
node dist/cli.mjs
```

---

## Example free-tier model (OpenRouter)

**`qwen/qwen3.6-plus-preview:free`** is a reasonable default to try on OpenRouter’s free tier as of this writing—large context and strong tool use for many coding tasks.

> OpenRouter **pricing and availability** change; confirm on [their model page](https://openrouter.ai/qwen/qwen3.6-plus-preview:free) before relying on a free tier.

---

## Alternative Free Models (OpenRouter)

| Model ID | Context | Notes |
|---|---|---|
| `qwen/qwen3-coder:free` | 262K | Best for pure coding tasks |
| `openai/gpt-oss-120b:free` | 131K | OpenAI open model, strong tool calling |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262K | Hybrid MoE, good general use |
| `meta-llama/llama-3.3-70b-instruct:free` | 66K | Reliable, widely tested |

Switch models anytime:
```bash
export OPENAI_MODEL=qwen/qwen3-coder:free
node dist/cli.mjs
```

---

## Why not some other free hosts?

Some free inference hosts hit **tokens-per-minute** limits with large system prompts. OpenRouter’s free tier has been workable here with **request** caps instead—check each host’s current limits.

---

## Tips

- **Don't swipe Termux away** from recent apps mid-session — use the home button to minimize instead.
- The Ubuntu environment persists between Termux sessions; your build and config are saved.
- Run `bun run build` again only if you pull updates to the Deimos repo.
