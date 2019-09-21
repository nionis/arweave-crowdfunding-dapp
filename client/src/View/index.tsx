import { Instance, getType } from "mobx-state-tree";
import { observer } from "mobx-react";
import Bar from "../components/progress/Bar";
import Step from "./Step";
import MetaMask from "../components/MetaMask";
import Loading from "../components/Loading";
import Model from "./Model";
import VoteModel from "../models/Vote";
import ethStore from "../stores/eth";
import Title from "../components/Title";

let store: Instance<typeof Model>;
let address;

const init = () => {
  if (typeof window === "undefined") return;
  const foundAddress = new URL(window.location.href).searchParams.get(
    "address"
  );
  if (!foundAddress) return;
  if (foundAddress === address) return;

  address = foundAddress;

  const contract = ethStore.getContractAt("crowdfund", address);

  store = Model.create(
    {
      selected: "0",
      crowdfund: {}
    },
    { contract }
  );

  store.crowdfund.sync().then(() => {
    let started = store.crowdfund.getById(store.crowdfund.atTask);
    if (getType(started) === VoteModel) {
      started = store.crowdfund.getById(
        String(Number(store.crowdfund.atTask) - 1)
      );
    }

    store.select(started.id);
  });
};

const Crowdfund = observer(() => {
  const fundraise = store.crowdfund.fundraises.get(store.selected);
  const milestone = store.crowdfund.milestones.get(store.selected);
  const step = fundraise || milestone;

  if (!step) {
    return <Loading />;
  }

  return (
    <>
      <Title
        title="Crowdfunding Name"
        undertext={`Crowdfund Address: ${store.crowdfund.address}`}
      />
      <Bar steps={store.steps} />
      <Step crowdfund={store.crowdfund} step={step} />
    </>
  );
});

const View = observer(() => {
  if (ethStore.isInstalled) init();

  return (
    <div className="container">
      {!ethStore.isInstalled ? (
        <MetaMask />
      ) : !store || store.crowdfund.syncing ? (
        <Loading />
      ) : !store.crowdfund.owner ? (
        <h1>Crowdfund not found</h1>
      ) : (
        <Crowdfund />
      )}
      <style jsx>{`
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
      `}</style>
    </div>
  );
});

export default View;
