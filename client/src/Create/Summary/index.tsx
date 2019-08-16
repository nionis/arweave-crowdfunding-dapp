import { Instance } from "mobx-state-tree";
import { observer } from "mobx-react";
import Bar from "../../components/progress/Bar";
import Title from "../../components/Title";
import Text from "../../components/Text";
import Button from "../../components/Button";
import { IStep } from "../../components/progress/types";
import CreateModel, { Milestone as MilestoneModel } from "../Model";
import web3Store from "../../stores/web3";
import { getDeadline, daysToSeconds } from "../../utils";

interface ISummaryProps {
  store: Instance<typeof CreateModel>;
}

type IFundraiseProps = ISummaryProps;

interface IMilestoneProps {
  store: Instance<typeof MilestoneModel>;
}

const Fundraise = observer(({ store }: IFundraiseProps) => (
  <div className="form">
    <div className="top">
      <Text label="Name" width="30vh" text={store.name} />
      <Text
        label="Deadline"
        width="30vh"
        text={getDeadline(0, daysToSeconds(store.deadline))}
      />
    </div>

    <div className="textInput">
      <Text label="Description" largearea={true} text={store.description} />
    </div>
    <style jsx>{`
      .top {
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        width: 35vw;
        margin-bottom: 3vh;
      }

      .form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 35vw;
        margin-top: 2.5vh;
      }
    `}</style>
  </div>
));

const Milestone = observer(({ store }: IMilestoneProps) => (
  <div className="form">
    <div className="top">
      <Text
        label="Required Funds (ETH)"
        width="30vh"
        text={`${store.requiredFunds}`}
      />
      <Text
        label="Deadline"
        width="30vh"
        text={getDeadline(0, daysToSeconds(store.deadline))}
      />
    </div>

    <div className="textInput">
      <Text label="Description" largearea={true} text={store.description} />
    </div>
    <style jsx>{`
      .top {
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 35vw;
        margin-bottom: 3vh;
      }

      .form {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 35vw;
        margin-top: 2.5vh;
      }
    `}</style>
  </div>
));

const Summary = observer(({ store }: ISummaryProps) => {
  const steps: IStep[] = [
    {
      selected: store.selected == "0",
      type: "ETHER",
      number: 0,
      onClick: () => {
        store.selected = "0";
      }
    },
    ...store.steps
  ];

  const selected = store.milestones.get(store.selected);

  return (
    <div className="container">
      <Title title="Crowdfund Overview" />
      <div className="total">
        <Text
          label="Total Fundraising Goal"
          text={`${String(store.goal)} ETH`}
        />
      </div>

      <Bar steps={steps} />
      {store.selected === "0" ? (
        <Fundraise store={store} />
      ) : (
        <Milestone store={selected} />
      )}

      <div className="button">
        <div className="buttonPosition">
          <Button
            style={{ marginTop: "3vh" }}
            onClick={() => {
              store.temporary = MilestoneModel.create();
              store.stage = "MILESTONES";
            }}
          >
            BACK
          </Button>
        </div>
        <div className="buttonPosition">
          <Button
            style={{ marginTop: "3vh" }}
            onClick={() => {
              const contract = web3Store.getContract("crowdfund");
              const args: any[] = store.deploy;

              store.new(contract.options.data, args);
            }}
            disabled={store.milestones.size === 0}
            undertext={
              store.transaction.hash ? (
                <a
                  href={`https://etherscan.io/tx/${store.transaction.hash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  etherscan
                </a>
              ) : null
            }
          >
            DEPLOY
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

        .label {
          justify-content: center;
          display: flex;
          margin-bottom: 1vh;
        }

        .text {
          height: 20vh;
          padding-left: 1vh;
          padding-top: 1vh;
          width: 35vw;
          background-color: #f4fcff;
          border-radius: 3px;
          border: 1px solid #006d8b;
        }
      `}</style>
    </div>
  );
});

export default Summary;
