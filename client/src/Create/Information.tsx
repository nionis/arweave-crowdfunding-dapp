import { Instance } from "mobx-state-tree";
import { observer } from "mobx-react";
import Title from "../components/Title";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import CreateModel from "./Model";

interface IInformationProps {
  store: Instance<typeof CreateModel>;
}

const Information = observer(({ store }: IInformationProps) => {
  return (
    <div className="container">
      <Title
        title="Crowdfund Information"
        undertext="The fundraise goal will be setup later."
      />
      <div className="form">
        <div className="top">
          <TextInput
            label="Name"
            placeholder="My amazing new dapp idea"
            onChange={e => (store.name = e.target.value)}
            value={store.name}
            maxCount={32}
          />
          <TextInput
            label="Deadline"
            placeholder="31 (days)"
            onChange={e => (store.deadline = Number(e.target.value))}
            value={store.deadline}
            type="NUMBER"
            info="Enter the amount of days of the funding period. Don't worry, the countdown starts only once you click 'START' later on."
          />
        </div>

        <div className="textInput">
          <TextInput
            label="Description"
            placeholder="Well it all started when.."
            onChange={e => (store.description = e.target.value)}
            value={store.description}
            type="TEXTAREA"
            style={{ height: "20vh", width: "40vw", resize: "none" }}
            maxCount={1000}
          />
        </div>
      </div>
      <div className="button">
        <Button
          style={{ marginTop: "3vh" }}
          disabled={!store.validInputs}
          onClick={() => (store.stage = "MILESTONES")}
        >
          NEXT
        </Button>
      </div>

      <style jsx>{`
        .button {
          width: 100vw;
          display: flex;
          justify-content: center;
          top: 75vh;
          height: 15vh;
          position: fixed;
          align-items: flex-end;
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
      `}</style>
    </div>
  );
});

export default Information;
