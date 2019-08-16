// solium-disable security/no-block-members
pragma solidity ^0.5.8;

import "./Types.sol";

library LTasks {
  function isType(TTasks.Types self, TTasks.Types required) internal pure returns(bool) {
    return self == required;
  }

  function requireType(TTasks.Types self, TTasks.Types required) internal pure {
    require(isType(self, required), "expected different type");
  }
}