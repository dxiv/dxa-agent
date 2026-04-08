# Deimos — VS Code extension

**[Deimos](https://dxa.dev/deimos/)** · **[DXA](https://dxa.dev)** · npm [`@dxa-dev/deimos`](https://www.npmjs.com/package/@dxa-dev/deimos)

VS Code companion for the **`deimos`** CLI: a project-aware **Control Center**, deterministic terminal launch, first-class workflows, and the **Deimos Terminal Black** theme—built to keep editor and shell in the same orbit.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `deimos` command is installed
  - the launch command being used
  - whether the launch shim injects `DEIMOS_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.deimos-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - **Launch deimos** launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch deimos
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `Deimos Terminal Black`

## Requirements

- VS Code `1.95+`
- `deimos` available in your terminal PATH — install from npm: [**`@dxa-dev/deimos`**](https://www.npmjs.com/package/@dxa-dev/deimos) (`npm install -g @dxa-dev/deimos`); [GitHub Packages](https://github.com/orgs/dxa-dev/packages/npm/package/deimos).

## Commands

- `deimos: Open Control Center`
- `deimos: Launch in Terminal`
- `deimos: Launch in Workspace Root`
- `deimos: Open Repository`
- `deimos: Open Setup Guide`
- `deimos: Open Workspace Profile`

## Settings

- `deimos.launchCommand` (default: `deimos`)
- `deimos.terminalName` (default: `deimos`)
- `deimos.useOpenAIShim` (default: `false`)

`deimos.useOpenAIShim` only injects `DEIMOS_USE_OPENAI=1` into terminals launched by the extension. It does not guess or configure a provider by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.deimos-profile.json` file when present.
- If no saved profile exists, the extension falls back to known environment flags available to the VS Code extension host.
- If the source of truth is unclear, the extension shows `unknown` instead of guessing.

## Development

From this folder:

```bash
npm run test
npm run lint
```

To package (optional):

```bash
npm run package
```
