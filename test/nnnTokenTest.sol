pragma solidity 0.6.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/NNNToken.sol";

contract TestNNNToken {
    function testInitialBalanceUsingDeployedContract() public {
        NNNToken meta = NNNToken(DeployedAddresses.NNNToken());

        uint256 expected = 10000;

        Assert.equal(
            meta.getBalance(tx.origin),
            expected,
            "Owner should have 10000 MetaCoin initially"
        );
    }

    function testInitialBalanceWithNewNNNToken() public {
        NNNToken meta = new NNNToken();

        uint256 expected = 10000;

        Assert.equal(
            meta.getBalance(tx.origin),
            expected,
            "Owner should have 10000 MetaCoin initially"
        );
    }
}
