# RECOVER

## Getting Started

`cp .env.example .env`

## Deploy

`npx hardhat run scripts/deploy.js --network <network>`

## Estimation smart contract size

```
npx hardhat size-contracts
npx hardhat compile  
```

Note: The Recover smart contract is close to the Ethereum max size (24kB).
