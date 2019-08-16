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
    goal: types.maybeNull(types.number),
    raised: types.maybeNull(types.number),
    balance: types.maybeNull(types.number),
    startedAt: types.maybeNull(types.number),
    timeRequired: types.maybeNull(types.number),
    status: types.maybeNull(types.enumeration(FundraiseStatus)),
    userFunds: types.maybeNull(types.number)
  })
  .views(self => ({
    get deadline() {
      return self.startedAt + self.timeRequired;
    }
  }));

export { FundraiseStatus };
export default Fundraise;
