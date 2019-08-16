pragma solidity ^0.5.8;

/**
  * @dev Converts an `address` into `address payable`. Note that this is
  * simply a type cast: the actual underlying value is not changed.
  * copied from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Address.sol
  * not released yet
  */
library Address {
  function toPayable(address account) internal pure returns (address payable) {
    return address(uint160(account));
  }
}