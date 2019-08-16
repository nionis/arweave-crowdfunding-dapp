pragma solidity ^0.5.8;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "solidity-linked-list/contracts/StructuredLinkedList.sol";
import "./Types.sol";
import "./Logic.sol";
import "../Fundraise/Types.sol";
import "../Fundraise/Logic.sol";
import "../Milestone/Types.sol";
import "../Milestone/Logic.sol";
import "../Vote/Types.sol";
import "../Vote/Logic.sol";
import "../utils/Address.sol";
import "../utils/Status/Types.sol";
import "../utils/Status/Logic.sol";

contract Tasks is Ownable {
  using Address for address;
  using StructuredLinkedList for StructuredLinkedList.List;
  using LTasks for TTasks.Types;
  using LFundraise for TFundraise.Struct;
  using LMilestone for TMilestone.Struct;
  using LVote for TVote.Struct;
  using LStatus for TStatus.Status;

  StructuredLinkedList.List private list;
  mapping(uint256 => TTasks.Types) public taskTypes;
  mapping(uint256 => TFundraise.Struct) public fundraises;
  mapping(uint256 => TMilestone.Struct) public milestones;
  mapping(uint256 => TVote.Struct) public votes;
  uint256 public atTask = 0;
  uint256 public progressiveId = 0;

  event Fund(address indexed user, uint256 amount);

  function addFundraise(uint256 goal, uint256 timeRequired) internal {
    uint256 id = progressiveId++;

    taskTypes[id] = TTasks.Types.FUNDRAISE;
    fundraises[id] = TFundraise.Struct(id, goal, 0, 0, 0, timeRequired, TStatus.Status.PENDING);
    list.push(id, true);
  }

  function addMilestone(uint256 fundingRequired, uint256 timeRequired, bytes32 description) internal {
    uint256 id = progressiveId++;

    taskTypes[id] = TTasks.Types.MILESTONE;
    milestones[id] = TMilestone.Struct(id, fundingRequired, 0, timeRequired, TStatus.Status.PENDING, description, "", false);
    list.push(id, true);
  }

  function addVote(uint256 timeRequired) internal {
    uint256 id = progressiveId++;

    taskTypes[id] = TTasks.Types.VOTE;
    votes[id] = TVote.Struct(id, 0, 0, 0, timeRequired, TStatus.Status.PENDING);
    list.push(id, true);
  }

  function startInternal() internal {
    TTasks.Types taskType = taskTypes[atTask];

    if (taskType == TTasks.Types.FUNDRAISE) {
      fundraises[atTask].sync();
      fundraises[atTask].status.mustBe(TStatus.Status.PENDING);
      fundraises[atTask].start();
    } else if (taskType == TTasks.Types.MILESTONE) {
      milestones[atTask].sync();
      milestones[atTask].status.mustBe(TStatus.Status.PENDING);
      milestones[atTask].start();
    } else {
      votes[atTask].sync();
      votes[atTask].status.mustBe(TStatus.Status.PENDING);
      votes[atTask].start();
    }
  }

  function goToNextTask() internal {
    if (atTask == progressiveId) return;

    atTask++;
    startInternal();
  }

  function start() external {
    require(atTask == 0, "atTask should be 0");
    require(list.sizeOf() > 0, "no tasks exist");
    startInternal();
  }

  function fund() external payable {
    TTasks.Types taskType = taskTypes[atTask];
    taskType.requireType(TTasks.Types.FUNDRAISE);

    TFundraise.Struct storage fundraise = fundraises[atTask];

    fundraise.sync();
    fundraise.status.mustBe(TStatus.Status.STARTED);

    fundraise.addFunds(msg.sender, msg.value);

    fundraise.sync();
    if (fundraise.status.equals(TStatus.Status.SUCCESS)) {
      goToNextTask();
    }

    emit Fund(msg.sender, msg.value);
  }

  function refund() external {
    TTasks.Types taskType = taskTypes[atTask];
    require(taskType.isType(TTasks.Types.FUNDRAISE) || taskType.isType(TTasks.Types.VOTE), "refund needs to be fundraise or vote");

    if (taskType == TTasks.Types.FUNDRAISE) {
      fundraises[atTask].sync();
      fundraises[atTask].status.mustBe(TStatus.Status.FAILURE);
    } else {
      votes[atTask].sync();
      votes[atTask].status.mustBe(TStatus.Status.FAILURE);
    }

    TFundraise.Struct storage fundraise = fundraises[atTask];
    fundraise.refund(msg.sender);
  }

  function claim() external {
    TTasks.Types taskType = taskTypes[atTask];
    taskType.requireType(TTasks.Types.MILESTONE);

    TMilestone.Struct storage milestone = milestones[atTask];

    milestone.sync();
    milestone.status.mustBe(TStatus.Status.STARTED);
    require(!milestone.claimed, "milestone funds already claimed");

    TFundraise.Struct storage fundraise = fundraises[0];
    fundraise.claimFunds(owner().toPayable(), milestone.fundingRequired);
    milestone.claimedFunds();
  }

  function report(string calldata reportTxt) external {
    TTasks.Types taskType = taskTypes[atTask];
    taskType.requireType(TTasks.Types.MILESTONE);

    TMilestone.Struct storage milestone = milestones[atTask];

    milestone.sync();
    milestone.status.mustBe(TStatus.Status.STARTED);

    milestone.addReport(reportTxt);
    milestone.sync();

    if (milestone.status.equals(TStatus.Status.SUCCESS)) {
      goToNextTask();
    }
  }

  function vote(bool isUpvote) external {
    TTasks.Types taskType = taskTypes[atTask];
    taskType.requireType(TTasks.Types.VOTE);

    TVote.Struct storage _vote = votes[atTask];

    _vote.sync();
    _vote.status.mustBe(TStatus.Status.STARTED);
    require(_vote.getUserVote(msg.sender) == uint256(TVote.Vote.NONE), "user already voted");

    if (isUpvote) {
      _vote.upvote(msg.sender);
    } else {
      _vote.downvote(msg.sender);
    }
    _vote.sync();

    if (_vote.status.equals(TStatus.Status.SUCCESS)) {
      goToNextTask();
    }
  }

  function voteResult() external {
    TTasks.Types taskType = taskTypes[atTask];
    taskType.requireType(TTasks.Types.VOTE);

    TVote.Struct storage _vote = votes[atTask];

    _vote.sync();

    if (_vote.status.equals(TStatus.Status.SUCCESS)) {
      goToNextTask();
    }
  }

  function getUserFunds() external view returns(uint256) {
    return fundraises[0].getUserFunds(msg.sender);
  }

  function getUserVote(uint256 id) external view returns(uint256) {
    return votes[id].getUserVote(msg.sender);
  }
}