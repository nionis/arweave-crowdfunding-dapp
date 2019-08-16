interface IText {
  text: string;
  label?: string;
  width?: string;
  height?: string;
  largearea?: boolean;
  padding?: string;
}

const Text = ({ text, label, padding, largearea, width }: IText) => (
  <div>
    <div className="container">
      {label ? <div className="label">{label}</div> : null}
      <div className="text">{text}</div>
    </div>

    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: ${largearea ? "35vw" : "14vw"};

        margin-top: 3vh;
      }

      .label {
        width: 25vh;
        justify-content: center;
        display: flex;
        margin-bottom: 1vh;
        font-size: calc(12px + 0.6vw);
      }

      .text {
        height: ${largearea ? null : "4vh"};
        min-height: ${largearea ? "20vh" : null};
        width: ${largearea ? "35vw" : width ? width : null};
        min-width: 14vw;
        padding: ${largearea ? "1vh" : null};
        background-color: #f3f3f3;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: ${largearea ? "flex-start" : "center"};
        font-size: calc(12px + 0.4vw);
      }
    `}</style>
  </div>
);

export default Text;
