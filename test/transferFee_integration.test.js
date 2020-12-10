const { expect } = require('chai');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { BN } = require('@openzeppelin/test-helpers');


var my_constants = require('./include_in_tesfiles.js')

contract('NNNToken (proxy)', async accounts => {
  beforeEach(async function () {
    // Deploy a new contract before the tests
    this.nnnToken = await deployProxy(
      my_constants._t_c.NNNToken,
      [my_constants._t_c.TOKEN_NAME, my_constants._t_c.TOKEN_SYMBOL],
      { initializer: "initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.nnnToken.address);
    this.nnnToken.setFeeWalletAddress(accounts[1]);
    this.nnnToken.setTransferFeeDivisor(2000);

    //remove contract deployer address from FEE_EXCLUDED_ROLE
    this.nnnToken.revokeRole(my_constants._t_c.FEE_EXCLUDED_ROLE, accounts[0])
  });

  it("with transfer method send coins between accounts, fee should be collected", async function () {
    const transferAmount = 10000000000000000000

    this.nnnToken.mintWithoutDecimals(accounts[0], 10, false)
    let balance = (await this.nnnToken.balanceOf(accounts[0])).toString()
    assert.equal(balance, 10000000000000000000);

    this.nnnToken.transfer(accounts[4], "10000000000000000000")
    let accountBalance = (await this.nnnToken.balanceOf(accounts[4])).toString()
    assert.equal(accountBalance, 10000000000000000000 - (transferAmount / my_constants._t_c.FEE))

    mintingFeeAccount = (await this.nnnToken.feeAddress()).toString()
    let feeCollectorAccountBalance = (await this.nnnToken.balanceOf(mintingFeeAccount)).toString()
    assert.equal(feeCollectorAccountBalance, transferAmount / my_constants._t_c.FEE)
  });

  it("with transferFrom method send coins between accounts, fee should be collected", async function () {
    const transferAmount = new BN("10000000000000000000");

    this.nnnToken.mintWithoutDecimals(accounts[4], 10, false)
    assert.equal((await this.nnnToken.balanceOf(accounts[4])).toString(), transferAmount.toString());

    // we need to approve the contract deployer address to spend (transfer) the tokens from account 4
    await this.nnnToken.approve(accounts[0], transferAmount, { from: accounts[4] })
    await this.nnnToken.transferFrom(accounts[4], accounts[5], transferAmount)
    let account5Balance = (await this.nnnToken.balanceOf(accounts[5])).toString()
    assert.equal(account5Balance, transferAmount - (transferAmount / my_constants._t_c.FEE))

    mintingFeeAccount = (await this.nnnToken.feeAddress()).toString()
    let feeCollectorAccountBalance = (await this.nnnToken.balanceOf(mintingFeeAccount)).toString()
    assert.equal(feeCollectorAccountBalance, transferAmount / my_constants._t_c.FEE)
  });
}); 