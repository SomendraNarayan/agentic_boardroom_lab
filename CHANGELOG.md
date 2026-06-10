# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/), and the project adheres to
[Semantic Versioning](https://semver.org/).

## [1.0.0]

Initial public release.

- Twelve-quarter executive simulation of the transition to autonomous agentic operations.
- Gated resilience scoring model in a single authoritative module (`src/scoring/`):
  generated value is realized through a continuous resilience multiplier set by the gap
  between performance and the weakest governance control, with a recovery-dependent floor.
- Trajectory-derived outcome profiles computed from the shape of the whole run.
- Terminal-failure conditions with a one-time recovery-quarter warning, so failure is
  always foreseeable and recoverable by an attentive player.
- Largest-remainder market-share apportionment, capped competitor catch-up dynamics,
  delayed scenarios, and a crisis system.
- Scoring self-check harness run in CI alongside type-check, dependency audit, and build.
- Client-side classroom access gate (deterrence, documented in `SECURITY.md`).
