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
    upvotes: types.maybeNull(types.string),
    downvotes: types.maybeNull(types.string),
    startedAt: types.maybeNull(types.string),
    timeRequired: types.maybeNull(types.string),
    status: types.maybeNull(types.enumeration(VoteStatus)),
    userVote: types.maybeNull(types.string)
  })
  .views(self => ({
    get deadline() {
      return self.startedAt + self.timeRequired;
    }
  }));

export { VoteStatus };
export default Vote;
