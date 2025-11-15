# Writing Your First Fungible Token (FT)

This guide outlines the skeleton of a basic FT contract in Clarity and key concepts like balances, transfers, and total supply.

Example skeleton:

```clarity
(define-fungible-token token-name)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (ok true))
```
