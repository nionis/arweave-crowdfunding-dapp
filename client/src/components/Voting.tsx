import { Instance } from "mobx-state-tree";
import ThumbButton from "./ThumbButton";
import Text from "./Text";
import CrowdfundModel from "../models/Crowdfund";
import VoteModel from "../models/Vote";

interface IVoting {
  crowdfund: Instance<typeof CrowdfundModel>;
  vote: Instance<typeof VoteModel>;
}

const Voting = ({ crowdfund, vote }: IVoting) => {
  const userVoted = vote.userVote === 1 || vote.userVote === 2;
  const disabled = userVoted;

  return (
    <div className="container">
      <Text label="Voting Deadline" text="January 01, 2023" />
      <div className="icons">
        <ThumbButton
          type="UP"
          disabled={disabled}
          selected={vote.userVote === 1}
          votes={vote.upvotes}
          onClick={() => crowdfund.vote(true)}
        />
        <ThumbButton
          type="DOWN"
          disabled={disabled}
          selected={vote.userVote === 2}
          votes={vote.downvotes}
          onClick={() => crowdfund.vote(false)}
        />
      </div>

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 29vh;
          width: 20vw;
        }

        .icons {
          display: flex;
          height: 15vh;
          width: 20vw;
          flex-direction: row;
          justify-content: space-evenly;
        }
      `}</style>
    </div>
  );
};

export default Voting;
