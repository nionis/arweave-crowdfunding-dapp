import Eth from "ethjs";
import { types, flow, Instance } from "mobx-state-tree";
import { IStep } from "../components/progress/types";
import Transaction from "../models/Transaction";
import { daysToSeconds } from "../utils";
import ethStore from "../stores/eth";

const Milestone = types
  .model("Milestone", {
    id: types.optional(types.string, () =>
      String(Math.floor(Math.random() * 1e8))
    ),
    requiredFunds: 0,
    deadline: 0,
    description: ""
  })
  .views(self => ({
    get validInputs() {
      return self.requiredFunds && self.deadline && self.description;
    }
  }));

const Create = types
  .model("Create", {
    stage: types.optional(
      types.enumeration(["INFORMATION", "MILESTONES", "SUMMARY"]),
      "INFORMATION"
    ),
    name: "",
    deadline: 0,
    description: "",
    selected: types.maybeNull(types.string),
    temporary: Milestone,
    milestones: types.map(Milestone),
    transaction: types.optional(Transaction, {})
  })
  .views(self => ({
    get validInputs() {
      return self.name && self.deadline && self.description;
    },

    get goal() {
      const milestones = Array.from(self.milestones.values());

      return milestones.reduce((result, milestone) => {
        return result + milestone.requiredFunds;
      }, 0);
    },

    get steps() {
      const milestones = Array.from(self.milestones.values());

      const steps: IStep[] = milestones.map((m, i) => {
        return {
          selected: self.selected == m.id,
          type: "NUMBER",
          number: i + 1,
          onClick: () => {
            self.selected = m.id;
          }
        };
      });

      return steps;
    }
  }))
  .views(self => ({
    get deploy() {
      const name = self.name;
      const description = self.description;
      const fund_goal = Eth.toWei(self.goal, "ether");
      const fund_timeRequired = daysToSeconds(self.deadline);

      const { funds, timeRequired, descriptions } = Array.from(
        self.milestones.values()
      ).reduce(
        (all, { requiredFunds, deadline, description }) => {
          all.funds.push(Eth.toWei(requiredFunds, "ether"));
          all.timeRequired.push(daysToSeconds(deadline));
          all.descriptions.push(Eth.fromUtf8(description));

          return all;
        },
        {
          funds: [],
          timeRequired: [],
          descriptions: []
        }
      );

      return [
        name,
        description,
        fund_goal,
        fund_timeRequired,
        funds,
        timeRequired,
        descriptions
      ];
    }
  }))
  .actions(self => {
    return {
      new: flow(function*(args: any[]) {
        yield self.transaction.run(() => {
          return ethStore.getContract("crowdfund").new(...args, {
            from: ethStore.account
          });
        });
      }),

      addMilestone(milestone: Instance<typeof Milestone>) {
        self.selected = null;
        self.milestones.set(milestone.id, milestone);
      },
      removeMilestone(milestone: Instance<typeof Milestone>) {
        self.selected = null;
        self.milestones.delete(milestone.id);
      }
    };
  });

export { Milestone };
export default Create;
