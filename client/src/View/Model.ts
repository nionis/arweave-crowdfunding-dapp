import { types } from "mobx-state-tree";
import CrowdfundModel from "../models/Crowdfund";
import { IStep } from "../components/progress/types";

const Model = types
  .model("Bar", {
    selected: types.string,
    crowdfund: CrowdfundModel
  })
  .actions(self => ({
    select(id: string) {
      self.selected = id;
    }
  }))
  .views(self => ({
    get steps() {
      const steps: IStep[] = [];

      if (Number(self.crowdfund.progressiveId) > 0) {
        const fundraises = Array.from(self.crowdfund.fundraises.values());
        const milestones = Array.from(self.crowdfund.milestones.values());

        fundraises.forEach(f => {
          steps.push({
            type: f.status === "SUCCESS" ? "CHECK" : "ETHER",
            selected: self.selected === f.id,
            number: Number(steps.length),
            onClick: () => self.select(f.id)
          });
        });

        milestones.forEach(m => {
          const vote = self.crowdfund.getById(String(Number(m.id) + 1));
          if (!vote) return;

          const type =
            m.status === "SUCCESS" && vote.status === "SUCCESS"
              ? "CHECK"
              : "NUMBER";

          steps.push({
            type,
            selected: self.selected === m.id,
            number: Number(steps.length),
            onClick: () => self.select(m.id)
          });
        });
      }

      return steps.sort((a, b) => {
        return a.number + b.number;
      });
    }
  }));

export default Model;
