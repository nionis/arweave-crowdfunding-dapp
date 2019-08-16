// solium-disable security/no-block-members
pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Types.sol";
import "../utils/Status/Types.sol";
import "../utils/Status/Logic.sol";

library LMilestone {
  using SafeMath for uint256;
  using LStatus for TStatus.Status;

  function start(TMilestone.Struct storage self) internal {
    self.status = TStatus.Status.STARTED;
    self.startedAt = now;
  }

  function claimedFunds(TMilestone.Struct storage self) internal {
    self.claimed = true;
  }

  function addReport(TMilestone.Struct storage self, string memory report) internal {
    self.report = report;
  }

  function sync(TMilestone.Struct storage self) internal {
    if (!self.status.equals(TStatus.Status.STARTED)) return;

    if (bytes(self.report).length > 0) {
      self.status = TStatus.Status.SUCCESS;
    } else if (now >= self.startedAt.add(self.timeRequired)) {
      self.status = TStatus.Status.FAILURE;
    }
  }
}