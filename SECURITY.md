# Security Model

This document describes, honestly, what this application does and does not protect. It is written for instructors and maintainers.

## What this application is

The Agentic Governance Boardroom is a **fully client-side** React single-page application. It has **no backend, no server, no database, and no network calls** to any first-party service. Everything it does runs in the user's browser. The only data it stores is a small "access gate" profile in the browser's `localStorage` on the user's own device.

## What this means for security

Because the entire application ships to the browser, **anything in the code or the bundle is visible to anyone** who opens browser developer tools or reads the public source. This is an inherent property of client-side web applications and cannot be engineered away without adding a backend.

Consequently:

- **The access gate is deterrence, not authentication.** The class passcodes (e.g. the dynamic year keys and the instructor-view passcode) are present in the shipped bundle. A determined user can read them. The gate's purpose is to stop a shared link from being trivially opened by anyone who stumbles on it, and to let an instructor hand out a code — not to enforce a real access boundary.
- **The "instructor view" is a convenience toggle, not a privilege boundary.** It unlocks an alternate UI. It does not protect any sensitive data, because there is no sensitive data and no server to protect it on.
- **There are no secrets in this repository.** No API keys, no credentials, no tokens. The optional `VITE_INSTRUCTOR_PASSCODE` build variable is, by design, not secret — it ships in the client bundle and is documented as such.

## What IS protected / hardened

Within the constraints of a client-side app, the following hardening is in place and should be maintained:

1. **No secrets in source control.** `.env*` is gitignored (except `.env.example`). No credentials are committed.
2. **No XSS sinks.** The only place the app builds raw HTML is the exported report (`src/utils/report.ts`). Every dynamic value interpolated into that HTML is passed through an `esc()` HTML-escaping function, so author-supplied scenario content or any state value cannot inject script. The app does not use `dangerouslySetInnerHTML` or `eval`.
3. **No sensitive data in storage.** `localStorage` holds only the non-sensitive access-gate profile. No personal data is collected or transmitted.
4. **Clean dependencies.** `npm audit` reports zero vulnerabilities. The CI workflow re-runs the audit on every push so regressions surface immediately.
5. **Honest naming.** The access gate is named and documented as an access gate, not as "security," to prevent anyone from mistaking it for protection.

## If you need real access control

If this tool is ever used in a context that requires genuine gating — for example, restricting access to enrolled students, or running graded assessments where scores must not be inspectable or forgeable — that requires a **backend**: a small server or serverless function that holds the real secret, validates access server-side, and (for grading) computes scores server-side so the client cannot see or tamper with the logic. That is a separate piece of work and is intentionally out of scope for this teaching tool.

## Reporting

This is a teaching artifact maintained by the Amsterdam Digital Transformation Lab. For issues, open a GitHub issue. Do not include any real personal data in issue reports.
