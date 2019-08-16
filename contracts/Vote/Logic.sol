// solium-disable security/no-block-members
pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Types.sol";
import "../utils/Status/Types.sol";
import "../utils/Status/Logic.sol";

library LVote {
  using SafeMath for uint256;
  using LStatus for TStatus.Status;

  function getUserVote(TVote.Struct storage self, address user) internal view returns (uint256) {
    return uint256(self.userVotes[user]);
  }

  function start(TVote.Struct storage self) internal {
    self.status = TStatus.Status.STARTED;
    self.startedAt = now;
  }

  function upvote(TVote.Struct storage self, address user) internal {
    self.upvotes = self.upvotes.add(1);
    self.userVotes[user] = TVote.Vote.UPVOTE;
  }

  function downvote(TVote.Struct storage self, address user) internal {
    require(self.downvotes > 0, "cannot downvote when there are no downvotes");

    self.downvotes = self.downvotes.sub(1);
    self.userVotes[user] = TVote.Vote.DOWNVOTE;
  }

  function sync(TVote.Struct storage self) internal {
    if (!self.status.equals(TStatus.Status.STARTED)) return;

    bool reachedDeadline = now >= self.startedAt.add(self.timeRequired);
    if (!reachedDeadline) return;

    if (self.upvotes > self.downvotes) {
      self.status = TStatus.Status.SUCCESS;
    } else {
      self.status = TStatus.Status.FAILURE;
    }
  }
}