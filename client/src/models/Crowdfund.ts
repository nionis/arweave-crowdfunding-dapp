import { types, flow, getEnv } from "mobx-state-tree";
import Fundraise, { FundraiseStatus } from "./Fundraise";
import Milestone, { MilestoneStatus } from "./Milestone";
import Vote, { VoteStatus } from "./Vote";
import Transaction from "./Transaction";
import Donation from "./Donation";
import web3Store from "../stores/web3";

const Crowdfund = types
  .model("Crowdfund", {
    address: types.maybeNull(types.string),
    owner: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    progressiveId: types.maybeNull(types.number),
    atTask: types.maybeNull(types.number),
    fundraises: types.map(Fundraise),
    milestones: types.map(Milestone),
    votes: types.map(Vote),
    transaction: types.optional(Transaction, {}),
    donations: types.optional(types.array(Donation), [])
  })
  .actions(self => ({
    getById(id: string) {
      return (
        self.fundraises.get(id) || self.milestones.get(id) || self.votes.get(id)
      );
    }
  }))
  .actions(self => {
    const web3 = web3Store.getWeb3();
    const contract = getEnv(self).contract;

    const syncCrowdfund = flow(function*() {
      const [
        owner,
        name,
        description,
        atTask,
        progressiveId
      ] = yield Promise.all([
        contract.methods.owner().call(),
        contract.methods.name().call(),
        contract.methods.description().call(),
        contract.methods.atTask().call(),
        contract.methods.progressiveId().call()
      ]);

      self.address = contract._address;
      self.owner = owner;
      self.name = name;
      self.description = description;
      self.atTask = Number(atTask);
      self.progressiveId = Number(progressiveId);
    });

    const syncFundraises = flow(function*() {
      self.fundraises.clear();

      const [
        { goal, raised, balance, startedAt, timeRequired, status },
        userFunds
      ] = yield Promise.all([
        contract.methods.fundraises(0).call(),
        contract.methods.getUserFunds().call()
      ]);

      const fundraise = Fundraise.create({
        id: "0",
        goal: Number(goal),
        raised: Number(raised),
        balance: Number(balance),
        startedAt: Number(startedAt),
        timeRequired: Number(timeRequired),
        status: FundraiseStatus[Number(status)],
        userFunds: Number(userFunds)
      });

      self.fundraises.set(fundraise.id, fundraise);
    });

    const syncMilestones = flow(function*() {
      self.milestones.clear();

      for (let i = 1; i < self.progressiveId; i = i + 2) {
        const {
          id,
          fundingRequired,
          startedAt,
          timeRequired,
          status,
          description,
          report,
          claimed
        } = yield contract.methods.milestones(i).call();

        const milestone = Milestone.create({
          id,
          fundingRequired: Number(fundingRequired),
          startedAt: Number(startedAt),
          timeRequired: Number(timeRequired),
          status: MilestoneStatus[Number(status)],
          description,
          report,
          claimed
        });

        self.milestones.set(milestone.id, milestone);
      }
    });

    const syncVotes = flow(function*() {
      self.votes.clear();

      for (let i = 2; i < self.progressiveId; i = i + 2) {
        const [
          { id, upvotes, downvotes, startedAt, timeRequired, status },
          userVote
        ] = yield Promise.all([
          contract.methods.votes(i).call(),
          contract.methods.getUserVote(i).call()
        ]);

        const vote = Vote.create({
          id,
          upvotes: Number(upvotes),
          downvotes: Number(downvotes),
          startedAt: Number(startedAt),
          timeRequired: Number(timeRequired),
          status: VoteStatus[Number(status)],
          userVote: Number(userVote)
        });

        self.votes.set(vote.id, vote);
      }
    });

    const syncDonations = flow(function*() {
      self.donations.clear();

      const events = yield contract.getPastEvents("Fund");

      events.forEach(event => {
        const { user, amount } = event.returnValues;

        self.donations.push(
          Donation.create({
            user,
            amount: web3.utils.fromWei(amount, "ether")
          })
        );
      });
    });

    return {
      sync: flow(function*() {
        yield syncCrowdfund();
        yield Promise.all([
          syncFundraises(),
          syncMilestones(),
          syncVotes(),
          syncDonations()
        ]);
      })
    };
  })
  .actions(self => {
    const web3 = web3Store.getWeb3();
    const contract = getEnv(self).contract;

    const trackTx = async (fn: () => any) => {
      await self.transaction.run(fn);
      self.transaction.reset();
      // return self.sync();
    };

    return {
      start: flow(function*() {
        yield trackTx(() =>
          contract.methods.start().send({
            from: web3Store.account
          })
        );
      }),

      fund: flow(function*(value: string) {
        yield trackTx(() =>
          contract.methods.fund().send({
            from: web3Store.account,
            value
          })
        );
      }),

      claim: flow(function*() {
        yield trackTx(() =>
          contract.methods.claim().send({
            from: web3Store.account
          })
        );
      }),

      report: flow(function*(text: string) {
        yield trackTx(() =>
          contract.methods.report(text).send({
            from: web3Store.account
          })
        );
      }),

      vote: flow(function*(isUpvote: boolean) {
        yield trackTx(() =>
          contract.methods.vote(isUpvote).send({
            from: web3Store.account
          })
        );
      }),

      voteResult: flow(function*() {
        yield trackTx(() =>
          contract.methods.voteResult().send({
            from: web3Store.account
          })
        );
      })
    };
  });

export default Crowdfund;
