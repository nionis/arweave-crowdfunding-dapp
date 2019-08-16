pragma solidity ^0.5.8;

import "../utils/Status/Types.sol";

library TFundraise {
  struct Struct {
    uint256 id;
    uint256 goal;
    uint256 raised;
    uint256 balance;
    uint256 startedAt;
    uint256 timeRequired;
    TStatus.Status status;
    mapping(address => uint256) userFunds;
  }
}