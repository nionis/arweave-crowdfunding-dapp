// solium-disable no-unused-vars, security/no-block-members
pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Types.sol";
import "../utils/Status/Types.sol";
import "../utils/Status/Logic.sol";

library LFundraise {
  using SafeMath for uint256;
  using LStatus for TStatus.Status;

  function getUserFunds(TFundraise.Struct storage self, address user) internal view returns (uint256) {
    return self.userFunds[user];
  }

  function start(TFundraise.Struct storage self) internal {
    self.status = TStatus.Status.STARTED;
    self.startedAt = now;
  }

  function addFunds(TFundraise.Struct storage self, address user, uint256 amount) internal {
    self.raised = self.raised.add(amount);
    self.balance = self.balance.add(amount);
    self.userFunds[user] = self.userFunds[user].add(amount);
  }

  function removeFunds(TFundraise.Struct storage self, address user, uint256 amount) internal {
    require(self.balance >= amount, "amount is larger than balance");
    require(self.userFunds[user] >= amount, "amount is larger than user funds");

    self.balance = self.balance.sub(amount);
    self.userFunds[user] = self.userFunds[user].sub(amount);
  }

  function refund(TFundraise.Struct storage self, address payable user) internal {
    // send back a percentage of the funds if some milestones were claimed
    uint256 funds = self.balance.mul(self.userFunds[user]).div(self.raised);

    removeFunds(self, user, funds);
    user.transfer(funds);
  }

  function claimFunds(TFundraise.Struct storage self, address payable owner, uint256 amount) internal {
    require(self.balance >= amount, "amount is larger than balance");

    self.balance = self.balance.sub(amount);
    owner.transfer(amount);
  }

  function sync(TFundraise.Struct storage self) internal {
    if (!self.status.equals(TStatus.Status.STARTED)) return;

    if (self.raised >= self.goal) {
      self.status = TStatus.Status.SUCCESS;
    } else if (now >= self.startedAt.add(self.timeRequired)) {
      self.status = TStatus.Status.FAILURE;
    }
  }
}