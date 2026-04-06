# Python utilities (optional)

These modules are **not** required to install or run the main **DXA Agent** CLI (`npm install -g @dxiv/dxa-agent` or a normal `bun` source build).

They are **optional helpers** for experimenting with OpenAI-compatible routing (for example Atomic Chat, Ollama) outside the TypeScript entrypoints. Use them if you are building a small sidecar or testing provider behaviour.

**Python:** 3.10+ supported; **3.11+** recommended.

## Setup

```bash
pip install -r python/requirements.txt
```

This installs **httpx** (HTTP client used by the helpers), **pytest**, and **pytest-asyncio** (async tests).

## Layout

| File | Role |
| --- | --- |
| `atomic_chat_provider.py` | HTTP helpers aimed at a local Atomic Chat–compatible `/v1` API |
| `ollama_provider.py` | Ollama-oriented helper surface |
| `smart_router.py` | Experimental multi-provider routing sketch |
| `requirements.txt` | Pinned dependency ranges for this folder |

Environment variables used by these scripts (when not passed in code) are documented in the repo root **`.env.example`** under **“OPTIONAL — Python helpers”**. They are **separate** from the variables the main Bun CLI uses for provider selection.

## Tests

From the repository root (uses repo-root [`pytest.ini`](../pytest.ini) for async mode):

```bash
pytest -v
```

## Note

Provider setup for day-to-day DXA Agent use is documented in the main guides: [Advanced Setup](../docs/advanced-setup.md) and the [README](../README.md). Legal / third-party notes: [LEGAL.md](../LEGAL.md).
