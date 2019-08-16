import { useState } from "react";
import { Instance } from "mobx-state-tree";
import { observer } from "mobx-react";
import Web3 from "web3";
import Text from "../components/Text";
import Voting from "../components/Voting";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import CrowdfundModel from "../models/Crowdfund";
import FundraiseModel from "../models/Fundraise";
import MilestoneModel from "../models/Milestone";
import web3Store from "../stores/web3";
import { getDeadline, secondsToMs } from "../utils";

type IStep = Instance<typeof FundraiseModel> | Instance<typeof MilestoneModel>;

interface IStepProps {
  crowdfund: Instance<typeof CrowdfundModel>;
  step: IStep;
}

interface IFundraiseProps {
  crowdfund: Instance<typeof CrowdfundModel>;
  fundraise: Instance<typeof FundraiseModel>;
}

interface IMilestoneProps {
  crowdfund: Instance<typeof CrowdfundModel>;
  milestone: Instance<typeof MilestoneModel>;
}

const Fundraise = observer(({ crowdfund, fundraise }: IFundraiseProps) => {
  const [etherInput, setEther] = useState("0");

  const isOwner = crowdfund.owner === web3Store.account;
  const deadline = getDeadline(fundraise.startedAt, fundraise.timeRequired);
  const raised = Web3.utils.fromWei(String(fundraise.raised), "ether");
  const goal = Web3.utils.fromWei(String(fundraise.goal), "ether");
  const status = (() => {
    if (fundraise.status === "PENDING") {
      return "Creator did not start the crowdfund yet";
    } else if (fundraise.status === "STARTED") {
      return "In progress";
    } else if (fundraise.status === "FAILURE") {
      return "Fundraise unsuccessful 😔";
    }

    return "COMPLETED 🎉";
  })();

  const showStart = isOwner && fundraise.status === "PENDING";
  const showFund = fundraise.status === "STARTED";
  const showRefund = fundraise.status === "FAILURE";

  const loading = crowdfund.transaction.status === "PENDING";
  const disabled = loading;
  const disabledFund = etherInput === "0" || disabled;

  const progressWidth = (parseInt(raised) / parseInt(goal)) * 70;

  return (
    <>
      <div className="row">
        <Text label="Fundraising Goal" text={`${raised}/${goal} ETH`} />
        <div className="text">
          <div className="stage">Fundraise</div>
          <div className="status">{status}</div>
          <div className="line" />
        </div>
        <Text label="Deadline" text={deadline} />
      </div>
      <div className="row">
        <Text
          label="Description"
          text={crowdfund.description}
          largearea={true}
        />
        {showFund ? (
          <div className="fund">
            <TextInput
              label="Contribute"
              type="NUMBER"
              width="12vw"
              value={etherInput}
              onChange={e => setEther(e.target.value)}
            />
            <Button
              style={{ width: "12vw", marginTop: "3vh" }}
              onClick={() => {
                crowdfund.fund(Web3.utils.toWei(etherInput, "ether"));
              }}
              loading={loading}
              disabled={disabledFund}
            >
              FUND
            </Button>
          </div>
        ) : null}
        <div className="right">
          <div className="goals">
            <div className="spacing">
              <div className="raised">{`${raised} ETH`}</div>
              <div className="total">{` / out of ${goal} ETH`}</div>
            </div>
          </div>
          <div className="progressBar">
            <div className="progress" />
          </div>
          <div className="containContri">
            <div className="label">Contributers</div>
            <div className="contributers">
              {crowdfund.donations.map(donation => (
                <div className="onecontributer">
                  <div className="address">{donation.user}</div>
                  <div className="eth">{donation.amount} ETH</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showStart ? (
        <Button
          style={{ width: "12vw", marginTop: "3vh" }}
          onClick={crowdfund.start}
          loading={loading}
          disabled={disabled}
        >
          START
        </Button>
      ) : null}

      {showRefund ? (
        <Button
          style={{ width: "12vw", marginTop: "3vh" }}
          loading={loading}
          disabled={disabled}
        >
          GET YOUR REFUND
        </Button>
      ) : null}
      <style jsx>{`
        .goals {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1vh;
        }
        .spacing {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .total {
          font-size: 12px;
          margin-left: 1vh;
          color: #2582c5;
        }
        .raised {
          font-size: calc(12px + 0.6vw);
          color: #090b36;
        }
        .progressBar {
          height: 0.7vh;
          width: 30vw;
          display: flex;
          justify-content: flex-start;
          background-color: #f4fcff;
          margin-bottom: 2vh;
          border: 1px solid #0075ff;
          align-items: center;
        }
        .progress {
          height: 0.7vh;
          width: ${progressWidth}vw;
          max-width: 30vw;
          background-color: #8fcfe0;
          border: 1px solid #0075ff;
        }
        .label {
          width: 25vh;
          justify-content: center;
          display: flex;
          margin-bottom: 1vh;
          font-size: calc(12px + 0.6vw);
        }
        .containContri {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          background-color: #f3f3f3;
          height: 21vh;
          width: 35vw;
        }
        .contributers {
          overflow-x: hidden;
          overflow-y: scroll;
          height: 15.5vh;
          width: 30vw;
          border: 2px solid #c4c4c4;
        }
        .right {
          margin-top: 0.3vh;
          width: 35vw;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        .onecontributer {
          background-color: #f4fcff;
          align-items: center;
          justify-content: space-between;
          height: 4.5vh;
          width: 30vw;
          display: flex;
          flex-direction: row;
          border-bottom: 2px solid #c4c4c4;
        }
        .address {
          margin-left: 1vh;
          font-size: calc(12px + 0.1vw);
        }
        .eth {
          margin-right: 3vh;
          font-size: calc(12px + 0.1vw);
        }
        .fund {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .text {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .stage {
          font-size: calc(12px + 1vw);
          margin-bottom: 2vh;
        }
        .status {
          font-size: calc(12px + 0.8vw);
          margin-bottom: 2vh;
        }
        .line {
          height: 1px;
          width: 35vw;
          background-color: black;
          margin-left: 2vh;
          margin-right: 2vh;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          width: 100vw;
        }
        .container {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          margin-bottom: 4vh;
          width: 75vw;
        }
      `}</style>
    </>
  );
});

const Milestone = observer(({ crowdfund, milestone }: IMilestoneProps) => {
  const [reportInput, setReport] = useState("");

  const isOwner = crowdfund.owner === web3Store.account;
  const { claimed, report } = milestone;
  const deadline = getDeadline(milestone.startedAt, milestone.timeRequired);
  const fundingRequired = Web3.utils.fromWei(
    String(milestone.fundingRequired),
    "ether"
  );

  const showClaim = isOwner && milestone.status !== "PENDING" && !claimed;
  const showReport = isOwner && milestone.status === "STARTED" && !report;
  const showRefund = milestone.status === "FAILURE";

  const voteId = String(Number(milestone.id) + 1);
  const vote = Array.from(crowdfund.votes.values()).find(v => v.id === voteId);

  const status = (() => {
    if (milestone.status === "PENDING") {
      return "Will be started once previous milestone is complete";
    } else if (milestone.status === "STARTED") {
      return "In progress";
    } else if (milestone.status === "FAILURE") {
      return "Milestone unsuccessful 😔";
    } else if (vote.status === "STARTED") {
      return "Voting in progress";
    } else if (vote.status === "FAILURE") {
      return "Voting unsuccessful 😔";
    }

    return "PASSED 🎉";
  })();

  const showVoting = vote.status === "STARTED";
  const showUpdateVoteResult =
    showVoting && isOwner && +new Date() >= secondsToMs(milestone.deadline);

  const loading = crowdfund.transaction.status === "PENDING";
  const disabled = loading;

  return (
    <div className="container">
      <div className="row">
        <Text
          label="Cost"
          text={`${fundingRequired} ETH${claimed ? " (claimed)" : ""}`}
        />
        <div className="text">
          <div className="stage">Milestone</div>
          <div className="status">{status}</div>
          <div className="line" />
        </div>
        <Text label="Deadline" text={deadline} />
      </div>
      <div className="row">
        <Text
          label="Description"
          text={Web3.utils.hexToUtf8(milestone.description)}
          largearea={true}
          // padding="2vh"
        />
        <div>
          {showVoting ? <Voting crowdfund={crowdfund} vote={vote} /> : null}
          {showUpdateVoteResult ? (
            <Button
              style={{ width: "17vw", marginTop: "3vh" }}
              onClick={crowdfund.voteResult}
              loading={loading}
              disabled={disabled}
            >
              UPDATE VOTE RESULT
            </Button>
          ) : null}
        </div>
        {showReport ? (
          <div className="addReport">
            <TextInput
              label="Add a report"
              type="TEXTAREA"
              value={reportInput}
              onChange={e => setReport(e.target.value)}
            />
            <Button
              style={{ width: "12vw", marginTop: "3vh" }}
              onClick={() => crowdfund.report(reportInput)}
              loading={loading}
              disabled={disabled}
            >
              REPORT
            </Button>
          </div>
        ) : null}
        {report ? (
          <Text label="Report" text={report} largearea={true} padding="2vh" />
        ) : null}
      </div>

      {showClaim ? (
        <Button
          style={{ width: "12vw", marginTop: "3vh" }}
          onClick={crowdfund.claim}
          loading={loading}
          disabled={disabled}
        >
          CLAIM
        </Button>
      ) : null}

      {showRefund ? (
        <Button
          style={{ width: "12vw", marginTop: "3vh" }}
          loading={loading}
          disabled={disabled}
        >
          GET YOUR REFUND
        </Button>
      ) : null}

      <style jsx>{`
        .addReport {
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }
        .text {
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        .stage {
          font-size: calc(12px + 1vw);
          margin-bottom: 2vh;
        }
        .status {
          font-size: calc(12px + 0.8vw);
          margin-bottom: 2vh;
        }
        .line {
          height: 1px;
          width: 35vw;
          background-color: black;
          margin-left: 2vh;
          margin-right: 2vh;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          width: 100vw;
        }
      `}</style>
    </div>
  );
});

const Step = observer(({ crowdfund, step }: IStepProps) => {
  const isFundraise = typeof step["goal"] !== "undefined";

  return (
    <div className="container">
      {isFundraise ? (
        <Fundraise
          crowdfund={crowdfund}
          fundraise={step as Instance<typeof FundraiseModel>}
        />
      ) : (
        <Milestone
          crowdfund={crowdfund}
          milestone={step as Instance<typeof MilestoneModel>}
        />
      )}

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          margin-bottom: 4vh;
          width: 75vw;
        }
      `}</style>
    </div>
  );
});

export default Step;
