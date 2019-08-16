import ProgressCircle from "./Circle";
import { IStep } from "./types";

interface IBar {
  steps: IStep[];
}

const Bar = ({ steps }: IBar) => (
  <div className="progress">
    {steps.map((step, i) => {
      return <ProgressCircle key={i} {...step} />;
    })}

    <style jsx>{`
      .progress {
        height: 3vh;
        width: 85vw;
        background-color: #f4fcff;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 20px;
        justify-content: space-between;
        margin-bottom: 5vh;
        margin-top: 3vh;
        margin-left: 2vh;
        margin-right: 2vh;
      }
    `}</style>
  </div>
);

export default Bar;
