# NNN Gold Token 

The 999.9 token (NNN) is asset-backed by LBMA certified gold. 100 NNN constitute 1g of gold. The token allows tokenholders to exchange it for physical gold

## Audit

The NNN Token smart contract was audited by Red4Sec. All aspects related to the ERC20 standard compatibility and other known ERC20 pitfalls/vulnerabilities were checked, and no issues were found in these areas. Red4Sec also examined other areas such as coding practices and business logic. Issues reported by Red4Sec were fixed prior to deploying the NNN Token smart contract.

Thanks to Red4Sec for their lightning fast auditing service and great support.
## Technical Information

Upgradable ERC20 Contract

Using OpenZeppelin contracts.

Thanks for the outstanding work that openzeppelin puts into it's contract and the great and instant support from their team.

### Deploying Proxy

Using Truffle to deploying Proxy
```
contracts/Migrations.sol
```

Contracts can be deployed with
```
truffle deploy --network <network_name>
```
For local deployment ganache must be started and private keys saved into

```
.secrets.json
```

local deployment:
```
truffle deploy --network development
```

testnet deployment:
```
truffle deploy --network ropsten
```

mainnet deployment:
```
truffle deploy --network mainnet
```

## Testing

tests can be run with:
```
truffle test
```
### running individual tests

choose a test file
```
truffle test/<testname>.js
```

with the .only flag individual test can be run  
```
it.only("should run this test") async function () {
  ...
}
```
## Troubleshooting
### Error: PollingBlockTracker - encountered an error while attempting to update latest block:
Error: ESOCKETTIMEDOUT

add 
```
networkCheckTimeout: 10000
```
to truffle-config.js

More information here: https://github.com/trufflesuite/truffle/issues/3356



