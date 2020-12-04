const { expect } = require('chai');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

var constants = require('./include_in_tesfiles.js')

contract('NNNToken (proxy)', async accounts => {
  before(async function () {
    // Deploy a new contract before the tests
    this.nnnToken = await deployProxy(
      constants._t_c.NNNToken,
      [constants._t_c.TOKEN_NAME, constants._t_c.TOKEN_SYMBOL],
      { initializer: "initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.nnnToken.address);
    this.nnnToken.setFeeWalletAddress(accounts[1]);
    this.nnnToken.setTransferFeeDivisor(2000);

    //remove contract deployer address from FEE_EXCLUDED_ROLE
    this.nnnToken.revokeRole(constants._t_c.FEE_EXCLUDED_ROLE, accounts[0])
  });

  it("transfer coins between accounts, fee should be collected", async function () {
    const transferAmount = 10000000000000000000

    this.nnnToken.mintWithoutDecimals(accounts[0], 10, false)
    let balance = (await this.nnnToken.balanceOf(accounts[0])).toString()
    assert.equal(balance, 10000000000000000000);

    this.nnnToken.transfer(accounts[4], "10000000000000000000")
    let accountBalance = (await this.nnnToken.balanceOf(accounts[4])).toString()
    assert.equal(accountBalance, 10000000000000000000 - (transferAmount / constants._t_c.FEE))

    mintingFeeAccount = (await this.nnnToken.feeAddress()).toString()
    let feeCollectorAccountBalance = (await this.nnnToken.balanceOf(mintingFeeAccount)).toString()
    assert.equal(feeCollectorAccountBalance, transferAmount / constants._t_c.FEE)

  });
});