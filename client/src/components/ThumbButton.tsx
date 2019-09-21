import { ThumbUp, ThumbDown } from "@material-ui/icons";

enum Type {
  UP,
  DOWN
}

interface IThumbButton {
  type: keyof typeof Type;
  votes?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: any;
}

const ThumbButton = ({
  type,
  votes = "0",
  disabled,
  selected,
  onClick
}: IThumbButton) => {
  const fill =
    disabled && !selected ? "#797979" : type === "UP" ? "green" : "red";

  return (
    <div className="container" onClick={disabled ? () => {} : onClick}>
      {type === "UP" ? (
        <ThumbUp style={{ fill, width: "5vh", height: "5vh", margin: "1vh" }} />
      ) : (
        <ThumbDown
          style={{ fill, width: "5vh", height: "5vh", margin: "1vh" }}
        />
      )}
      <div className="number">{votes}</div>
      <style jsx>{`
        .container {
          background-color: ${disabled ? "white" : "#f4fcff"};
          border-radius: 50%;
          border: ${selected
            ? `solid 2px ${type === "UP" ? "green" : "red"}`
            : "white"};
          width: 7vh;
          height: 7vh;
          align-items: center;
          justify-content: center;
          box-shadow: ${disabled ? null : "0px 4px 4px rgba(0, 0, 0, 0.25)"};
          cursor: ${onClick ? "pointer" : "auto"};
        }

        .number {
          margin-top: 2vh;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ThumbButton;
