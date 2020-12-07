// Load dependencies
const { expect } = require('chai');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

var my_constants = require('./include_in_tesfiles.js')

// Start test block
contract('NNNToken (proxy)', async accounts => {
  before(async function () {
    // Deploy a new contract before the tests
    this.nnnToken = await deployProxy(
      my_constants._t_c.NNNToken,
      [my_constants._t_c.TOKEN_NAME, my_constants._t_c.TOKEN_SYMBOL],
      { initializer: "initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.nnnToken.address);
    this.nnnToken.setFeeWalletAddress(accounts[1]);
    this.nnnToken.setTransferFeeDivisor(2000);
  });

  it("token name should be " + my_constants._t_c.TOKEN_NAME, async function () {
    expect((await this.nnnToken.name()).toString()).to.equal(my_constants._t_c.TOKEN_NAME);
  });

  it("token symbol should be " + my_constants._t_c.TOKEN_SYMBOL, async function () {
    expect((await this.nnnToken.symbol()).toString()).to.equal(my_constants._t_c.TOKEN_SYMBOL);
  });

  it("token transfer fee should be 1/" + my_constants._t_c.FEE, async function () {
    let tokenTransferFeeDivisor = await this.nnnToken.tokenTransferFeeDivisor();
    //first we need to convert solidities big number to a string and then to a number
    expect(Number(tokenTransferFeeDivisor.toString())).to.eq(my_constants._t_c.FEE)
  });

  it("token transfer fee should be greater than 0", async function () {
    let tokenTransferFeeDivisor = await this.nnnToken.tokenTransferFeeDivisor();
    expect(Number(tokenTransferFeeDivisor.toString())).to.be.greaterThan(0)
  });

  it("token transfer address should be " + accounts[1], async function () {
    let feeAddress = await this.nnnToken.feeAddress();
    assert.equal(feeAddress.toString(), accounts[1]);
  });

  it("fee exclude role should be " + my_constants._t_c.FEE_EXCLUDED_ROLE, async function () {
    let feeExcludeRole = await this.nnnToken.FEE_EXCLUDED_ROLE();
    assert.equal(feeExcludeRole.toString(), my_constants._t_c.FEE_EXCLUDED_ROLE);
  });

  it("mint tokens without decimal places and sent to address WITHOUT substracting a fee", async function () {
    this.nnnToken.mintWithoutDecimals(accounts[0], 1, false)
    let balance = (await this.nnnToken.balanceOf(accounts[0])).toString()
    assert.equal(balance, 1000000000000000000)
  });

  it("mint tokens without decimal places and sent to address WITH substracting a fee", async function () {
    let transferAmountWithDecimalplaces = 1000000000000000000
    await debug(this.nnnToken.mintWithoutDecimals(accounts[3], 1, true))
    let balance = (await this.nnnToken.balanceOf(accounts[3])).toString()
    assert.equal(balance, transferAmountWithDecimalplaces - (transferAmountWithDecimalplaces / my_constants._t_c.FEE))
  });

  it("grant fee exclude role to address", async function () {
    this.nnnToken.grantRole(my_constants._t_c.FEE_EXCLUDED_ROLE, accounts[1])
    let hasFeeExcludeRole = (await this.nnnToken.hasRole(my_constants._t_c.FEE_EXCLUDED_ROLE, accounts[1])).toString()
    assert.equal(hasFeeExcludeRole, "true");
  });

  it("sets minting fee address", async function () {
    let newFeeAdddress = "0xC1b1943A087A738461e77DFF2b84218f69e7759D"
    this.nnnToken.setFeeWalletAddress(newFeeAdddress);
    assert.equal((await this.nnnToken.feeAddress()).toString(), newFeeAdddress);
  });

  it("sets minting fee divisor", async function () {
    let newFee = 1000
    this.nnnToken.setTransferFeeDivisor(1000);
    assert.equal((await this.nnnToken.tokenTransferFeeDivisor()).toString(), newFee);
  });

  it("sets minting fee divisor", async function () {
    let newFee = 1000
    this.nnnToken.setTransferFeeDivisor(1000);
    assert.equal((await this.nnnToken.tokenTransferFeeDivisor()).toString(), newFee);
  });

  it("sets minting fee divisor to 0 and throws exception", async function () {
    await expectRevert(
      this.nnnToken.setTransferFeeDivisor(0),
      'Token transfer fee divisor must be greater than 0',
    );
  });

  it('reverts when transferring tokens to the zero address', async function () {
    // Conditions that trigger a require statement can be precisely tested
    await expectRevert(
      this.nnnToken.transfer(constants.ZERO_ADDRESS, 1000, { from: accounts[0] }),
      'ERC20: transfer to the zero address',
    );
  });

  it("reverts when setting invalid fee address", async function () {
    await expectRevert(
      this.nnnToken.setFeeWalletAddress("1234"),
      'invalid address',
    );

  });
});