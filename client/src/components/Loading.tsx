import CircularProgress from "@material-ui/core/CircularProgress";

const Loading = () => {
  return (
    <CircularProgress
      style={{
        color: "white",
        width: "3vh",
        height: "3vh",
        margin: "1vh"
      }}
    />
  );
};

export default Loading;
