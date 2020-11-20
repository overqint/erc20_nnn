pragma solidity 0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "./EnhancedMinterPauser.sol";

contract NNNToken is Initializable, EnhancedMinterPauser {

    function __initialize(string memory name, string memory symbol)
        public
        initializer
    {
        __ERC20_init_unchained(name, symbol);
        __ERC20PresetMinterPauser_init_unchained();
        __EnhancedMinterPauser_init_unchained();
    }
}
