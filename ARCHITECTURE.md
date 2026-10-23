# Architecture

## Component boundary

Owns normalized schemas, validation, audit decisions, and exact arithmetic. Has no network or storage side effects.

The project pipeline is: normalized export → core audit → CLI report with input digest → local HTML review.
The scenarios repository independently supplies fault inputs to consumers. The four repositories
have separate responsibilities; the sibling import is a deliberate development-only contract.
Before independent package releases, replace it with pinned package versions and cross-version tests.

## Data contract

Input contains left and right schemaVersion 1 exports. Each has network, scope, provider, startLedger/endLedger (inclusive), ranges [{start,end}] (inclusive), and events [{id,ledger,transactionIndex,eventIndex,payloadDigest}]. closeTimeSeconds is optional informational metadata. Network, scope and requested windows must match; provider labels must differ. payloadDigest is a 64-character lower-case hexadecimal SHA-256 from the upstream canonical decoder. See core/sample.json.

## Failure behavior

Validation errors fail the run rather than reporting success. Audit exceptions remain visible in the result.
The caller owns authenticated input collection, mapping governance, database transactions, and recovery.
All prototype processing occurs in memory; large inputs require explicit size bounds before production.

## Integration work not yet implemented

- Official Stellar SDK/XDR decoding and real testnet fixture capture.
- Independently authenticated ledger provenance and filter identity.
- Durable ingestion/checkpoint database with crash recovery.
- Production authorization, signed mapping history, tenant privacy controls.

Synthetic samples use descriptive identifiers and cannot be submitted to Stellar. No private keys are required.
