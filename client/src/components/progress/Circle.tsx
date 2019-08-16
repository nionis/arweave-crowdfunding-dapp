import { Add, Done } from "@material-ui/icons";
import { IStep } from "./types";

const Circle = ({ type, selected, number, onClick }: IStep) => {
  const style = {
    height: "7vh",
    width: "7vh"
  };
  const icon = (() => {
    if (type === "NUMBER") {
      return String(number);
    } else if (type === "CHECK") {
      return <Done style={style} />;
    } else if (type === "PLUS") {
      return <Add style={style} />;
    } else if (type === "ETHER") {
      return (
        <img
          src="/static/images/eth.png"
          alt="eth"
          style={{
            height: "6.5vh",
            paddingTop: "0.25vh",
            paddingBottom: "0.25vh"
          }}
        />
      );
    }
  })();

  return (
    <div className="container" onClick={onClick}>
      {icon}

      <style jsx>{`
        .container {
          background-color: #f4fcff;
          border-radius: 50%;
          border: ${selected ? "solid 3px #006D8B" : "solid 3px #F4FCFF"};
          color: #006d8b;
          width: 7vh;
          height: 7vh;
          line-height: 7vh;
          text-align: center;
          justify-content: center;
          font-size: calc(12px + 0.4vw);
          font-weight: bold;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        .icon {
          height: 7vh;
          width: 7vh;
        }
      `}</style>
    </div>
  );
};

export default Circle;
