# Contributing to LedgerOrder

Use Node.js 22 or newer. Run `npm test` and `npm run demo` before opening a pull request.
No dependency installation is needed for this prototype.

Start with an issue describing the failure, a minimal synthetic input, the expected result,
and a proposed acceptance test. Keep protocol adapters separate from the normalized audit model.
Use decimal strings for money and u64 identifiers. Never include keys, personal customer
identities, tokens, or production exports in issues or fixtures.

Pull requests should explain behavior changes and include an edge-case test. Breaking
schema changes require a schemaVersion increment and migration notes. Keep fixtures synthetic
unless their provenance and redistribution permissions have been reviewed.
