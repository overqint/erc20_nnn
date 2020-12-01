# NNN Gold Token 

Upgradable ERC20 Contract

Code Architecture inspiration from https://github.com/PresearchOfficial/PRE-Token

Using OpenZeppelin contracts.

## Troubleshooting
### Error: PollingBlockTracker - encountered an error while attempting to update latest block:
Error: ESOCKETTIMEDOUT

add 
```
networkCheckTimeout: 10000
```
to truffle-config.js

More information here: https://github.com/trufflesuite/truffle/issues/3356
