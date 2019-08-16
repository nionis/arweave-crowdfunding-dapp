import { clone, Instance } from "mobx-state-tree";
import { observer } from "mobx-react";
import Bar from "../components/progress/Bar";
import Title from "../components/Title";
import Text from "../components/Text";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import CreateModel, { Milestone as MilestoneModel } from "./Model";
import { IStep } from "../components/progress/types";

interface IMilestonesProps {
  store: Instance<typeof CreateModel>;
}

const Milestones = observer(({ store }: IMilestonesProps) => {
  const selected = store.milestones.get(store.selected) || store.temporary;

  const steps: IStep[] = [
    ...store.steps,
    {
      selected: !store.selected || store.steps.length === 0,
      type: "PLUS",
      onClick: () => (store.selected = null)
    }
  ];

  return (
    <div className="container">
      <Title
        title="Crowdfund Milestones"
        undertext="Please fill out the information for each milestone."
      />
      <div className="total">
        <Text
          label="Total Fundraising Goal"
          text={`${String(store.goal)} ETH`}
        />
      </div>

      <Bar steps={steps} />
      <div className="form">
        <div className="top">
          <TextInput
            label="Required Funds (ETH)"
            placeholder="100"
            onChange={e => (selected.requiredFunds = Number(e.target.value))}
            value={selected.requiredFunds}
            type="NUMBER"
          />
          <TextInput
            label="Deadline"
            placeholder="31 (days)"
            onChange={e => (selected.deadline = Number(e.target.value))}
            value={selected.deadline}
            type="NUMBER"
            info="Enter the amount of days that it will take for the milestone to be reached. Give youself atlease a week extra."
          />
        </div>

        <div className="textInput">
          <TextInput
            label="Description"
            placeholder="1. UI / UX Designs .."
            onChange={e => (selected.description = e.target.value)}
            value={selected.description}
            type="TEXTAREA"
            style={{ height: "20vh", width: "40vw", resize: "none" }}
            maxCount={32}
          />
        </div>
      </div>

      <div className="button">
        <div className="buttonPosition">
          <Button
            style={{ marginTop: "3vh" }}
            onClick={() => {
              store.temporary = MilestoneModel.create();
              store.stage = "INFORMATION";
            }}
          >
            BACK
          </Button>
        </div>
        <div className="buttonPosition">
          {store.temporary.id === selected.id ? (
            <Button
              style={{ marginTop: "3vh" }}
              disabled={!selected.validInputs}
              onClick={() => {
                store.addMilestone(clone(selected));
                store.temporary = MilestoneModel.create();
              }}
            >
              ADD
            </Button>
          ) : (
            <Button
              style={{ marginTop: "3vh" }}
              disabled={!selected.validInputs}
              onClick={() => {
                store.removeMilestone(selected);
                store.temporary = MilestoneModel.create();
              }}
            >
              REMOVE
            </Button>
          )}
          <Button
            style={{ marginTop: "3vh" }}
            onClick={() => {
              store.stage = "SUMMARY";
              store.temporary = MilestoneModel.create();
              store.selected = "0";
            }}
            disabled={store.milestones.size === 0}
          >
            FINISH
          </Button>
        </div>
      </div>
      <style jsx>{`
        .buttonPosition {
          width: 20vw;
        }

        .button {
          width: 100vw;
          display: flex;
          justify-content: space-between;
          top: 75vh;
          height: 15vh;
          position: fixed;
          align-items: flex-end;
        }

        .total {
          position: fixed;
          width: 90vw;
          display: flex;
          justify-content: flex-end;
          top: 15vh;
        }

        .container {
          display: flex;
          flex-direction: column;
          padding-left: 10vh;
          padding-right: 10vh;
          padding-top: 0;
          padding-bottom: 0;
          flex: 1;
          justify-content: center;
          align-items: center;
        }

        .top {
          flex-direction: row;
          display: flex;
          justify-content: space-between;
          width: 40vw;
          margin-bottom: 3vh;
        }

        .form {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          width: 40vw;
          margin-top: 2.5vh;
        }

        .label {
          justify-content: center;
          display: flex;
          margin-bottom: 1vh;
        }

        .text {
          height: 20vh;
          padding-left: 1vh;
          padding-top: 1vh;
          width: 40vw;
          background-color: #f4fcff;
          border-radius: 3px;
          border: 1px solid #006d8b;
        }
      `}</style>
    </div>
  );
});

export default Milestones;
