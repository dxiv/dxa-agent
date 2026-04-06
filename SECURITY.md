# Security policy

## Supported versions

Security fixes target the latest **`main`** branch and the latest **`@dxiv/openclaude`** npm release.

| Version | Supported |
| ------- | --------- |
| Latest release | :white_check_mark: |
| Older releases | :x: |
| Unreleased or unofficial builds | :x: |

Security fixes are generally released in the next patch version and may also be
landed directly on `main` before a package release is published.

Static analysis (**CodeQL Advanced**) runs on **`main`**, pull requests, and a weekly schedule, scanning **GitHub Actions**, **JavaScript/TypeScript**, and **Python** (see [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml)). It complements manual review and dependency updates; it is not a substitute for responsible disclosure.

## Reporting a Vulnerability

If you believe you have found a security vulnerability in OpenClaude, please
report it privately.

Preferred reporting channel:

- GitHub Security Advisories / private vulnerability reporting for this
  repository

Please include:

- a clear description of the issue
- affected version, commit, or environment
- reproduction steps or a proof of concept
- impact assessment
- any suggested remediation, if available

Please do **not** open a public issue for an unpatched vulnerability.

## Response Process

Our general goals are:

- initial triage acknowledgment within 7 days
- follow-up after validation when we can reproduce the issue
- coordinated disclosure after a fix is available

Severity, exploitability, and maintenance bandwidth may affect timelines.

## Disclosure and CVEs

Valid reports may be fixed privately first and disclosed after a patch is
available.

If a report is accepted and the issue is significant enough to warrant formal
tracking, we may publish a GitHub Security Advisory and request or assign a CVE
through the appropriate channel. CVE issuance is not guaranteed for every
report.

## Scope

This policy applies to:

- the OpenClaude source code in this repository
- official release artifacts published from this repository
- the `@dxiv/openclaude` npm package

This policy does not cover:

- third-party model providers, endpoints, or hosted services
- local misconfiguration on the reporter's machine
- vulnerabilities in unofficial builds, mirrors, or downstream repackages
