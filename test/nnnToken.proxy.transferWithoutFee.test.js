const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20Approve,
} = require('./ERC20.behavior');

var my_constants = require('./include_in_tesfiles.js')

const supply = 100;

contract('NNNToken (proxy)', async accounts => {
  beforeEach(async function () {
    // Deploy a new contract before the tests
    this.token = await deployProxy(
      my_constants._t_c.NNNToken,
      [my_constants._t_c.TOKEN_NAME, my_constants._t_c.TOKEN_SYMBOL],
      { initializer: "initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.token.address);
    this.token.setFeeWalletAddress(accounts[1]);
    this.token.setTransferFeeDivisor(2000);
    this.token.mint(accounts[0], 100)
    this.token.grantRole(my_constants._t_c.FEE_EXCLUDED_ROLE, accounts[2])
    this.token.grantRole(my_constants._t_c.FEE_EXCLUDED_ROLE, accounts[3])
  });
  const initialHolder = accounts[0]
  const recipient = accounts[2]
  const anotherAccount = accounts[3];

  const initialSupply = new BN(supply);

  describe('transferFrom', function () {
    shouldBehaveLikeERC20Transfer('ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
      return this.token.transferFrom(from, to, amount);
    });

    describe('when the sender is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(this.token.transferFrom(ZERO_ADDRESS, recipient, initialSupply),
          'ERC20: transfer from the zero address',
        );
      });
    });
  });

  describe('transfer', function () {
    shouldBehaveLikeERC20Transfer('ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
      return this.token.transfer(to, amount);
    });
  });
});
