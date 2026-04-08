# Python utilities (optional)

These modules are **not** required to install or run the main **Deimos** CLI ([**`@dxa-dev/deimos`**](https://www.npmjs.com/package/@dxa-dev/deimos): `npm install -g @dxa-dev/deimos`, or a normal `bun` source build).

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

## Relation to the main CLI

Provider setup for day-to-day Deimos use is documented in [Advanced Setup](../docs/advanced-setup.md) and the [README](../README.md). Third-party and trademark context: [LEGAL.md](../LEGAL.md).
