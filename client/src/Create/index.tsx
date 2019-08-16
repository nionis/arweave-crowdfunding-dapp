import { unprotect } from "mobx-state-tree";
import { observer } from "mobx-react";
import CreateModel from "./Model";
import Information from "./Information";
import Milestones from "./Milestones";
import Summary from "./Summary";

const store = CreateModel.create({
  temporary: {}
});
unprotect(store);

const Create = observer(() => {
  return (
    <div className="container">
      {store.stage === "INFORMATION" ? (
        <Information store={store} />
      ) : store.stage === "MILESTONES" ? (
        <Milestones store={store} />
      ) : (
        <Summary store={store} />
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

export default Create;
