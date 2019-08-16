import { CSSProperties } from "react";
import Loading from "./Loading";

enum Type {
  PRIMARY,
  SECONDARY
}

interface IButton {
  children?: any;
  disabled?: boolean;
  type?: keyof typeof Type;
  style?: CSSProperties;
  onClick?: () => void;
  loading?: boolean;
  undertext?: any;
}

const Button = ({
  children,
  disabled,
  type = "PRIMARY",
  style,
  onClick,
  loading = false,
  undertext
}: IButton) => {
  const background = (() => {
    if (disabled) {
      return "#717e82";
    } else if (type === "PRIMARY") {
      return "#006d8b";
    }

    return "rgba(0, 109, 139, 0.15)";
  })();

  return (
    <div className="container">
      <button onClick={onClick} style={style} disabled={disabled}>
        {loading ? (
          <div className="loading">
            <Loading />
          </div>
        ) : (
          <div style={{ fontSize: "calc(12px + 0.4vw)" }}>{children}</div>
        )}
      </button>
      {undertext ? <div className="undertext">{undertext}</div> : null}

      <style jsx>{`
        .undertext {
          font-size: 12px;
        }
        .loading {
          height: 4.5vh;
          width: 5vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          height: 11vh;
        }

        button {
          background: ${background};
          justify-content: space-evenly;
          display: flex;
          align-items: center;

          width: 11vw;
          height: 4.5vh;
          color: ${type === "PRIMARY" ? "white" : "#006d8b"};
          border: none;
          border-radius: 3px;
          margin-left: 3vh;
          margin-right: 3vh;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }
      `}</style>
    </div>
  );
};

export default Button;
