# Python utilities (optional)

These modules are **not** required to install or run the main **DXA Agent** CLI (`npm install -g @dxiv/dxa-agent` or a normal `bun` source build).

They are **optional helpers** for experimenting with OpenAI-compatible routing (for example Atomic Chat, Ollama) outside the TypeScript entrypoints. Use them if you are building a small sidecar or testing provider behaviour.

## Layout

| File | Role |
| --- | --- |
| `atomic_chat_provider.py` | HTTP helpers aimed at a local Atomic Chat–compatible `/v1` API |
| `ollama_provider.py` | Ollama-oriented helper surface |
| `smart_router.py` | Experimental multi-provider routing sketch |

## Tests

From the repository root (with a Python 3 environment and `pytest` / `httpx` installed):

```bash
pytest python/tests -v
```

## Note

Provider setup for day-to-day use is documented in the main guides: [Advanced Setup](../docs/advanced-setup.md) and the [README](../README.md).
