import { types } from "mobx-state-tree";

const VoteStatus = [
  "PENDING", // task is inactive
  "STARTED", // task can take in votes
  "SUCCESS", // more upvores
  "FAILURE" // more downvotes
];

const Vote = types
  .model("Vote", {
    id: types.maybeNull(types.string),
    upvotes: types.maybeNull(types.number),
    downvotes: types.maybeNull(types.number),
    startedAt: types.maybeNull(types.number),
    timeRequired: types.maybeNull(types.number),
    status: types.maybeNull(types.enumeration(VoteStatus)),
    userVote: types.maybeNull(types.number)
  })
  .views(self => ({
    get deadline() {
      return self.startedAt + self.timeRequired;
    }
  }));

export { VoteStatus };
export default Vote;
