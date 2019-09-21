import { types, flow, getEnv } from "mobx-state-tree";
import Fundraise, { FundraiseStatus } from "./Fundraise";
import Milestone, { MilestoneStatus } from "./Milestone";
import Vote, { VoteStatus } from "./Vote";
import Transaction from "./Transaction";
import Donation from "./Donation";
import ethStore from "../stores/eth";
import { decodeEvent } from "../models/Eth/getContract";

const Crowdfund = types
  .model("Crowdfund", {
    syncing: false,
    address: types.maybeNull(types.string),
    owner: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    progressiveId: types.maybeNull(types.string),
    atTask: types.maybeNull(types.string),
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
    const eth = ethStore.getEth();
    const contract = getEnv(self).contract;

    const syncCrowdfund = flow(function*() {
      const ops = {
        from: ethStore.account
      };

      const [
        owner,
        name,
        description,
        atTask,
        progressiveId
      ] = yield Promise.all([
        contract.owner(ops).then(res => res[0]),
        contract.name(ops).then(res => res[0]),
        contract.description(ops).then(res => res[0]),
        contract.atTask(ops).then(res => res[0]),
        contract.progressiveId(ops).then(res => res[0])
      ]);

      self.address = contract.address;
      self.owner = owner;
      self.name = name;
      self.description = description;
      self.atTask = atTask.toString();
      self.progressiveId = progressiveId.toString();
    });

    const syncFundraises = flow(function*() {
      const ops = {
        from: ethStore.account
      };

      self.fundraises.clear();

      const [
        { id, goal, raised, balance, startedAt, timeRequired, status },
        userFunds
      ] = yield Promise.all([
        contract.fundraises(0, {
          from: ethStore.account
        }),
        contract.getUserFunds(ops).then(res => res[0])
      ]);

      const fundraise = Fundraise.create({
        id: id.toString(),
        goal: goal.toString(),
        raised: raised.toString(),
        balance: balance.toString(),
        startedAt: startedAt.toString(),
        timeRequired: timeRequired.toString(),
        status: FundraiseStatus[status.toString()],
        userFunds: userFunds.toString()
      });

      self.fundraises.set(fundraise.id, fundraise);
    });

    const syncMilestones = flow(function*() {
      const ops = {
        from: ethStore.account
      };

      self.milestones.clear();

      for (let i = 1; i < Number(self.progressiveId); i = i + 2) {
        const {
          id,
          fundingRequired,
          startedAt,
          timeRequired,
          status,
          description,
          report,
          claimed
        } = yield contract.milestones(i, {
          from: ethStore.account
        });

        const milestone = Milestone.create({
          id: id.toString(),
          fundingRequired: fundingRequired.toString(),
          startedAt: startedAt.toString(),
          timeRequired: timeRequired.toString(),
          status: MilestoneStatus[status.toString()],
          description,
          report,
          claimed
        });

        self.milestones.set(milestone.id, milestone);
      }
    });

    const syncVotes = flow(function*() {
      const ops = {
        from: ethStore.account
      };

      self.votes.clear();

      for (let i = 2; i < Number(self.progressiveId); i = i + 2) {
        const [
          { id, upvotes, downvotes, startedAt, timeRequired, status },
          userVote
        ] = yield Promise.all([
          contract.votes(i, ops),
          contract.getUserVote(i, ops).then(res => res[0])
        ]);

        const vote = Vote.create({
          id: id.toString(),
          upvotes: upvotes.toString(),
          downvotes: downvotes.toString(),
          startedAt: startedAt.toString(),
          timeRequired: timeRequired.toString(),
          status: VoteStatus[status.toString()],
          userVote: userVote.toString()
        });

        self.votes.set(vote.id, vote);
      }
    });

    const syncDonations = flow(function*() {
      const ops = {
        from: ethStore.account
      };

      self.donations.clear();

      // const donations = yield eth
      //   .getLogs({
      //     fromBlock: "earliest",
      //     toBlock: "latest",
      //     address: contract.address,
      //     topics: [
      //       "0xda8220a878ff7a89474ccffdaa31ea1ed1ffbb0207d5051afccc4fbaf81f9bcd",
      //       "0x00000000000000000000000003ae6f5f16362c6a00fc77295da0be4dc5c9e315"
      //     ]
      //   })
      //   .then(logs => {
      //     return logs.map(log => {
      //       console.log(log);
      //       return decodeEvent("Fund", log.data);
      //     });
      //   });

      // console.log("logs", donations);

      // TODO: events
      // events.forEach(event => {
      //   const { user, amount } = event.returnValues;

      //   self.donations.push(
      //     Donation.create({
      //       user,
      //       amount: Eth.fromWei(amount, "ether")
      //     })
      //   );
      // });
    });

    return {
      sync: flow(function*() {
        self.syncing = true;

        yield syncCrowdfund();
        yield Promise.all([
          syncFundraises(),
          syncMilestones(),
          syncVotes(),
          syncDonations()
        ]);

        self.syncing = false;
      })
    };
  })
  .actions(self => {
    const contract = getEnv(self).contract;

    const trackTx = async (fn: () => any) => {
      await self.transaction.run(fn);
      self.transaction.reset();

      return self.sync();
    };

    return {
      start: flow(function*() {
        yield trackTx(() =>
          contract.start({
            from: ethStore.account
          })
        );
      }),

      fund: flow(function*(value: string) {
        yield trackTx(() =>
          contract.fund({
            from: ethStore.account,
            value
          })
        );
      }),

      claim: flow(function*() {
        yield trackTx(() =>
          contract.claim({
            from: ethStore.account
          })
        );
      }),

      report: flow(function*(text: string) {
        yield trackTx(() =>
          contract.report(text, {
            from: ethStore.account
          })
        );
      }),

      vote: flow(function*(isUpvote: boolean) {
        yield trackTx(() =>
          contract.vote(isUpvote, {
            from: ethStore.account
          })
        );
      }),

      voteResult: flow(function*() {
        yield trackTx(() =>
          contract.voteResult({
            from: ethStore.account
          })
        );
      })
    };
  });

export default Crowdfund;
