pragma solidity ^0.5.8;

import "./Types.sol";

library LStatus {
  function equals(TStatus.Status current, TStatus.Status required) internal pure returns(bool) {
    return current == required;
  }

  function mustBe(TStatus.Status current, TStatus.Status required) internal pure {
    require(equals(current, required), "expected different status");
  }
}