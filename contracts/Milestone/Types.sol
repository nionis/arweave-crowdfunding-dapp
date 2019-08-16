pragma solidity ^0.5.8;

import "../utils/Status/Types.sol";

library TMilestone {
  struct Struct {
    uint256 id;
    uint256 fundingRequired;
    uint256 startedAt;
    uint256 timeRequired;
    TStatus.Status status;
    bytes32 description;
    string report;
    bool claimed;
  }
}