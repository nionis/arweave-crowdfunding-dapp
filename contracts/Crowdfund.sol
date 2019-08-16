pragma solidity ^0.5.8;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./Tasks/Contract.sol";

contract Crowdfund is Tasks {
  using SafeMath for uint256;

  string public name;
  string public description;

  constructor(
    string memory _name,
    string memory _description,
    uint256 fund_goal,
    uint256 fund_timeRequired,
    uint256[] memory mile_fundingRequired,
    uint256[] memory mile_timeRequired,
    bytes32[] memory mile_descriptions
  ) public {
    require(
      mile_fundingRequired.length == mile_timeRequired.length &&
      mile_fundingRequired.length == mile_descriptions.length,
      "milestone arguments must be equal in length"
    );
    require(mile_timeRequired.length >= 1, "must contain atleast one milestone");

    name = _name;
    description = _description;

    addFundraise(fund_goal, fund_timeRequired);

    for (uint256 i = 0; i < mile_timeRequired.length; i++) {
      addMilestone(mile_fundingRequired[i], mile_timeRequired[i], mile_descriptions[i]);
      addVote(mile_timeRequired[i]);
    }
  }
}