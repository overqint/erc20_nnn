pragma solidity 0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "./ManagedEnhancedERC20.sol";

contract NNNToken is Initializable, ManagedEnhancedERC20 {
    using SafeMath for uint256;

    function initialize(string memory name, string memory symbol)
        public
        initializer
    {
        __Context_init_unchained();
        __AccessControl_init_unchained();
        __ERC20_init_unchained(name, symbol);
        __Pausable_init_unchained();
        __ManagedEnhancedERC20_init_unchained();
    }


}
