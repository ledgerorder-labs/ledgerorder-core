# LedgerOrder · Audit engine

## Connected application

This module is part of a seven-repository application. Start with the [ledgerorder-frontend integration guide](https://github.com/ledgerorder-labs/ledgerorder-frontend/blob/main/INTEGRATION.md) for complete setup and the frontend → backend → core/review/contracts data flow.

- [ledgerorder-frontend](https://github.com/ledgerorder-labs/ledgerorder-frontend)
- [ledgerorder-backend](https://github.com/ledgerorder-labs/ledgerorder-backend)
- [ledgerorder-contracts](https://github.com/ledgerorder-labs/ledgerorder-contracts)


Sequence-based event comparison and explicit ingestion-range coverage checks for Stellar exports.

**Status: 0.1.0 offline prototype.** Uses normalized synthetic JSON. No live Stellar adapter,
contract deployment, or production security audit is included. It is not approved for a Drips Wave.

## Why this exists

Bell prepares millisecond ledger timing. Export consumers need ordering by ledger and transaction position, plus explicit provider disagreements and missing ingestion ranges even when timestamps are equal.

## Run locally

Node.js 22+; no third-party dependencies. Clone the project repositories into sibling
folders. The CLI and scenario consumer tests import `../ledgerorder-core/index.mjs`.
The core and review renderer also work independently. Packages remain private until a versioned release.

```bash
npm test
npm run demo
```

`npm test` runs meaningful failure cases. CLI exit codes: 0 means no exceptions in the supplied
input, 2 means review required, 1 means invalid input or execution error. The review renderer uses
0 on successful rendering and 1 on invalid input. File digests identify input bytes, not ledger authenticity.

## Repository responsibility

Owns normalized schemas, validation, audit decisions, and exact arithmetic. Has no network or storage side effects.

## Project repositories

- [ledgerorder-core](https://github.com/ledgerorder-labs/ledgerorder-core)
- [ledgerorder-cli](https://github.com/ledgerorder-labs/ledgerorder-cli)
- [ledgerorder-scenarios](https://github.com/ledgerorder-labs/ledgerorder-scenarios)
- [ledgerorder-review](https://github.com/ledgerorder-labs/ledgerorder-review)

## Trust boundaries

Coverage intervals are inclusive and supplied by the export producer. Two providers agreeing does not prove either export complete. Event positions must come from a pinned decoder, never inferred from timestamps or fabricated from cursor strings. payloadDigest represents a SHA-256 hash of canonical event content produced by that decoder; the prototype only validates its shape. Scope labels must identify identical filters and normalization versions. No independent chain verification is implemented.

## Development and next steps

See [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md),
[CONTRIBUTING.md](CONTRIBUTING.md), and [SECURITY.md](SECURITY.md).
The [MIT license](LICENSE) covers this code and synthetic fixtures.

## Sources

- [Bell upgrade guide](https://stellar.org/blog/developers/bell-protocol-30-upgrade-guide)
- [Stellar RPC getEvents](https://developers.stellar.org/docs/data/apis/rpc/api-reference/methods/getEvents)

Researched 23 October 2026. Bell votes are scheduled for 3 November (testnet) and
23 November (mainnet); activation depends on validator approval. This prototype does not assume activation.
