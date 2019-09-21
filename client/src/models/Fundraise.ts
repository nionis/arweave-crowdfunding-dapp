import { types } from "mobx-state-tree";

const FundraiseStatus = [
  "PENDING", // task is inactive
  "STARTED", // task can take in funds
  "SUCCESS", // task reached goal before deadline
  "FAILURE" // task did not reach goal
];

const Fundraise = types
  .model("Fundraise", {
    id: types.maybeNull(types.string),
    goal: types.maybeNull(types.string),
    raised: types.maybeNull(types.string),
    balance: types.maybeNull(types.string),
    startedAt: types.maybeNull(types.string),
    timeRequired: types.maybeNull(types.string),
    status: types.maybeNull(types.enumeration(FundraiseStatus)),
    userFunds: types.maybeNull(types.string)
  })
  .views(self => ({
    get deadline() {
      return self.startedAt + self.timeRequired;
    }
  }));

export { FundraiseStatus };
export default Fundraise;
