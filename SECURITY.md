# Security policy

This is an unaudited offline prototype. It neither signs nor submits transactions.
Its inputs are untrusted, normalized JSON, not verified ledger proofs. Do not use its
reports to authorize withdrawals, release customer funds, or certify solvency.

Report vulnerabilities privately through GitHub's security advisory interface when available.
If it is unavailable, ask the maintainer for a private reporting channel without publishing
exploit details. Do not upload customer exports or credentials. Only version 0.1.x is in scope.

Production adapters must validate XDR with a pinned official Stellar SDK, bind network
identity to a verified passphrase, enforce resource limits, authenticate mapping updates,
and record provenance. A checksum of a file proves file identity, not blockchain authenticity.
