import {
  useState,
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  CSSProperties
} from "react";
import Information from "./Information";

enum Types {
  SINGLE,
  NUMBER,
  TEXTAREA
}

type ITextInputInherited = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface ITextInput extends ITextInputInherited {
  label: string;
  type?: keyof typeof Types;
  maxCount?: number;
  info?: string;
  width?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TextInput = ({
  label,
  type = "SINGLE",
  width,
  maxCount,
  info,
  placeholder,
  onChange,
  value,
  style = {}
}: ITextInput) => {
  const [count, setCount] = useState(0);
  const [maxReached, setMaxReached] = useState(false);

  const finalValue = (() => {
    if (type === "NUMBER" && value === 0) {
      return "";
    }

    return value;
  })();

  const change: ITextInput["onChange"] = e => {
    if (maxCount) {
      const length = e.target.value.split("").length;
      setCount(length);

      if (length >= maxCount) {
        setMaxReached(true);
        return;
      } else {
        setMaxReached(false);
      }
    }

    if (!maxReached) onChange(e);
  };

  return (
    <div className="textInput">
      <div className="label">
        {label}
        {info ? <Information text={info} style={{ marginLeft: "3px" }} /> : ""}
      </div>
      {type === "TEXTAREA" ? (
        <textarea
          placeholder={placeholder}
          className="text"
          onChange={change}
          value={finalValue}
          style={style}
        />
      ) : (
        <input
          placeholder={placeholder}
          className="text"
          type={type === "SINGLE" ? "text" : "number"}
          onChange={change}
          value={finalValue}
          style={style}
        />
      )}

      {maxCount > 0 ? (
        <div className="smallText">
          {count}/{maxCount}
        </div>
      ) : null}

      <style jsx>{`
        .smallText {
          color: #006d8b;
          font-size: 12px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .textInput {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-top: 3vh;
          width: ${type === "TEXTAREA" ? style.width : width ? width : "14vw"};
        }
        .label {
          width: 30vh;
          justify-content: center;
          display: flex;
          margin-bottom: 1vh;
          font-size: calc(12px + 0.6vw);
        }
        .text {
          height: 4vh;
          width: ${width ? width : "14vw"};
          background-color: #f4fcff;
          border-radius: 3px;
          border: 1px solid #006d8b;
          padding-left: 1vh;
        }
      `}</style>
    </div>
  );
};

export default TextInput;
