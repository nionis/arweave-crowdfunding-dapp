import { types } from "mobx-state-tree";

const MilestoneStatus = [
  "PENDING", // task is inactive
  "STARTED", // task can take in report
  "SUCCESS", // task did not publish report before deadline
  "FAILURE" // task published report
];

const Milestone = types
  .model("Milestone", {
    id: types.maybeNull(types.string),
    fundingRequired: types.maybeNull(types.number),
    startedAt: types.maybeNull(types.number),
    timeRequired: types.maybeNull(types.number),
    status: types.maybeNull(types.enumeration(MilestoneStatus)),
    description: types.maybeNull(types.string),
    report: types.maybeNull(types.string),
    claimed: types.maybeNull(types.boolean)
  })
  .views(self => ({
    get deadline() {
      return self.startedAt + self.timeRequired;
    }
  }));

export { MilestoneStatus };
export default Milestone;
