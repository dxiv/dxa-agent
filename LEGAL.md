# Legal information — Deimos

**This document is for transparency. It is not legal advice.** If you need advice for your situation (employer policy, country of use, redistribution), talk to a solicitor or other qualified legal adviser.

---

## 1. What this repository is

**Deimos** is **open source** software: a terminal coding agent with interactive prompts, tools, MCP, slash commands, and multiple model backends. **dxiv** and other contributors maintain it **independently** on GitHub.

This project is **not** affiliated with, endorsed by, or sponsored by Anthropic, PBC, OpenAI, Google, GitHub, or any other model or platform vendor. Documentation may name third-party **products or APIs** only to explain configuration or interoperability (**descriptive use**—see §4).

## 2. Copyright and your licence to use this code

The Deimos maintainers license **the source code and documentation in this repository** under the **MIT License**, unless a specific file states otherwise. The full text is in [LICENSE](LICENSE).

Subject to the MIT conditions, you may use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software.

## 3. Third-party software and services

This project **depends on many other open source packages** (see `package.json`, `bun.lock`, and similar files). Each package remains under **its own licence and copyright**. You are responsible for complying with those licences when you build, ship, or redistribute combined works.

The optional **`python/`** folder adds a separate, **optional** stack (for example **httpx**, **pytest**, and **pytest-asyncio** — see [`python/requirements.txt`](python/requirements.txt)). Nothing in `python/` is required to run the published CLI. If you install those dependencies, their licences apply in addition to the rest of the repo. Root [`pytest.ini`](pytest.ini) only configures running those Python tests.

Optional integrations may call **public APIs** or use **SDKs** published by third parties. Those calls are subject to **those parties’ terms**, not to this repository’s maintainers.

## 4. Trademarks and naming

Names such as **“Anthropic”**, **“Claude”** (models and APIs), **“OpenAI”**, **“Gemini”**, **“GitHub”**, and others are **trademarks** of their respective owners.

Those names may appear in **documentation**, **configuration examples**, or **user-facing text** **only** where helpful to identify a **product**, **API**, or **setting** a user might already recognise. That is **descriptive (nominative) use**: it does **not** mean the trademark owner **built**, **runs**, or **endorses** Deimos, and it does **not** authorize use of their logos or trade dress as if they were ours.

**Deimos** is **our** project name.

## 5. No warranty

The software is provided **“as is”**, without warranty of any kind, as stated in the MIT License.

## 6. Questions or concerns about content

We publish this repository **in good faith** under the terms above.

If you believe **material in this repository** raises a **legitimate concern** (for example, under copyright, trademark, or platform rules), use the hosting provider’s **official reporting process** (for GitHub, that is typically their **legal / DMCA / abuse** flows) and identify **specific** content when possible.

We take **good-faith** reports seriously. **Outcomes** depend on the host, applicable law, and the facts—we cannot promise a particular result.

We do **not** intend **false endorsement**, **trademark confusion**, or **bad-faith** use of anyone’s marks.

## 7. Summary

| Topic | Where to look |
| --- | --- |
| Licence for this repo’s code | [LICENSE](LICENSE) |
| Maintainer-facing contribution norms | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Security reports | [SECURITY.md](SECURITY.md) |
| Plain-language project intro | [README.md](README.md) |
| Maintainer release / labels notes | [docs/maintainers.md](docs/maintainers.md) |
| End-user onboarding | [docs/first-run.md](docs/first-run.md), [docs/setup-checklist.md](docs/setup-checklist.md) |
| Optional Python helpers (not the main CLI) | [python/README.md](python/README.md), [python/requirements.txt](python/requirements.txt) |
| Environment variable examples | [.env.example](.env.example) |

— dxiv / Deimos contributors
