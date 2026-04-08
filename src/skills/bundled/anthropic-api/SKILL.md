# Anthropic API reference (Deimos)

This `/anthropic-api` skill bundles structured reference material for the Anthropic Messages API and SDKs. The model identifiers in this build are **{{OPUS_NAME}}** (`{{OPUS_ID}}`), **{{SONNET_NAME}}** (`{{SONNET_ID}}`), and **{{HAIKU_NAME}}** (`{{HAIKU_ID}}`). The sections below frame how to use the included `<doc>` paths; language-specific files are assembled at runtime.

## Reading Guide

_Reserved for the bundled skill layout — the runtime injects a language-specific reading guide and the documentation set._

## When to Use WebFetch

Use WebFetch when the user needs **post-release model identifiers**, **pricing or quota changes**, **beta or preview features**, or **changelog detail** that may postdate this bundle. Prefer answering from the included files first; use URLs in `shared/live-sources.md` for authoritative, current specifications.

## Common Pitfalls

- **Model IDs**: Follow `shared/models.md` for canonical identifiers; avoid inventing dated suffixes unless the API requires them.
- **Tool use**: Multi-turn tool loops differ from plain chat; follow `shared/tool-use-concepts.md` and the language-specific tool-use pages.
- **Errors**: Map HTTP and API errors with `shared/error-codes.md` before retrying.
