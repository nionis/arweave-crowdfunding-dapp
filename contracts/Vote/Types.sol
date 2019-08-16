pragma solidity ^0.5.8;

import "../utils/Status/Types.sol";

library TVote {
  enum Vote {
    NONE,
    UPVOTE,
    DOWNVOTE
  }

  struct Struct {
    uint256 id;
    uint256 upvotes;
    uint256 downvotes;
    uint256 startedAt;
    uint256 timeRequired;
    TStatus.Status status;
    mapping(address => Vote) userVotes;
  }
}