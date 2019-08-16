interface ITitle {
  title: string;
  undertext?: string;
  secondline?: string;
}

const Title = ({ title, undertext, secondline }: ITitle) => (
  <div className="container">
    <div className="title">{title}</div>
    <div className="undertext">{undertext}</div>
    <div className="undertext">{secondline}</div>
    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        height: 12vh;
      }
      .title {
        font-size: calc(12px + 1.3vw);
      }
      .undertext {
        font-size: calc(12px + 0.5vw);
      }
    `}</style>
  </div>
);

export default Title;
