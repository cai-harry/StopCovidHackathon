# StopCovidHackathon

## Local blockchain environment

- Start a local blockchain (ganache)
- You can import the mnemonic in [super_insecure_mnemonic.txt](super_insecure_mnemonic.txt) to reuse the private keys hardcoded in [`.env`](.env)
- `npm install` at top level will fetch truffle dependencies to deploy smart contracts
- `truffle migrate --network private` to deploy the smart contract (might change to have trusted aggregator deploy from backend instead)

