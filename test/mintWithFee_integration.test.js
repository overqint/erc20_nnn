const { expect } = require('chai');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

var my_constants = require('./include_in_tesfiles.js')

contract("NNNToken", async accounts => {

  before(async function () {
    // Deploy a new contract before the tests
    this.nnnToken = await deployProxy(
      my_constants._t_c.NNNToken,
      [my_constants._t_c.TOKEN_NAME, my_constants._t_c.TOKEN_SYMBOL],
      { initializer: "__initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.nnnToken.address);
  });

  it("mint coins and transfer with fee to account, fee should be collected", async function () {

    const transferAmount = 10000000000000000000

    this.nnnToken.mintWithoutDecimals(accounts[0], 10)
    let balance = (await this.nnnToken.balanceOf(accounts[0])).toString()
    assert.equal(balance, transferAmount);

    this.nnnToken.mintWithFee(accounts[4], transferAmount.toString())
    let accountBalance = (await this.nnnToken.balanceOf(accounts[4])).toString()
    assert.equal(accountBalance, transferAmount - (transferAmount / my_constants._t_c.FEE))

    let feeCollectorAccountBalance = (await this.nnnToken.balanceOf(accounts[2])).toString()
    assert.equal(feeCollectorAccountBalance, transferAmount / my_constants._t_c.FEE)

  });
});