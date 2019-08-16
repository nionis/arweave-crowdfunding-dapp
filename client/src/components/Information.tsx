import { CSSProperties } from "react";
import Tooltip from "@material-ui/core/Tooltip";

interface IInformationProps {
  text: string;
  style?: CSSProperties;
}

const Information = ({ text, style = {} }: IInformationProps) => (
  <div className="container" style={style}>
    <Tooltip title={text}>
      <span>?</span>
    </Tooltip>

    <style jsx>{`
      .container {
        background-color: #000000;
        border-radius: 50%;
        color: #ffffff;
        width: 1.8vh;
        height: 1.8vh;
        line-height: 1.8vh;
        text-align: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        cursor: help;
      }
    `}</style>
  </div>
);

export default Information;
