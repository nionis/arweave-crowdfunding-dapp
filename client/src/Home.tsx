import { useState } from "react";
import Eth from "ethjs";
import { observer } from "mobx-react";
import TextInput from "./components/TextInput";
import Button from "./components/Button";
import ethStore from "./stores/eth";
import Link from "./components/Link";

const Home = observer(() => {
  const [viewAddress, setViewAddress] = useState("");
  const validViewAddress = Eth.isAddress(viewAddress);
  const createButtonText = (() => {
    if (!ethStore.isInstalled) {
      return "please install metamask";
    } else if (!ethStore.isLoggedIn) {
      return "please unlock metamask";
    }

    return "";
  })();

  return (
    <div className="container">
      <div className="title">
        <p>
          Create a crowdfund with a verifiable and immutable <br />
          project plan powered by{" "}
          <a
            href="https://www.arweave.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Arweave
          </a>
        </p>
      </div>

      <div className="buttons">
        <Link page="Create">
          <Button disabled={!ethStore.isLoggedIn} undertext={createButtonText}>
            CREATE
          </Button>
        </Link>
        <a
          href="https://gitcoin.co/issue/ArweaveTeam/Bounties/12/3274"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button type="SECONDARY">LEARN MORE</Button>
        </a>
      </div>

      <div className="lineBreak">
        <div className="line" />
        <div>or</div>
        <div className="line" />
      </div>

      <div className="bottom">
        <TextInput
          label="View Crowdfund:"
          placeholder="Enter Crowdfund's Ethereum Address"
          style={{ width: "32.5vh" }}
          onChange={e => setViewAddress(e.target.value)}
        />
        <Link
          page="View"
          beforeClick={() => {
            const newUrl =
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              `?address=${viewAddress}`;

            window.history.pushState({ path: newUrl }, "", newUrl);
          }}
        >
          <Button style={{ marginTop: "4vh" }} disabled={!validViewAddress}>
            GO
          </Button>
        </Link>
      </div>

      <style jsx>{`
        .bottom {
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 2vh;
        }
        .line {
          height: 1px;
          width: 15vw;
          background-color: black;
          margin-left: 2vh;
          margin-right: 2vh;
        }
        .lineBreak {
          flex-direction: row;
          display: flex;
          align-items: center;
        }
        .buttons {
          flex-direction: row;
          display: flex;
          margin-top: 2vh;
          margin-bottom: 6vh;
        }
        a {
          color: #006d8b;
          text-decoration: none;
        }
        p {
          text-align: center;
        }
        .title {
          display: flex;
          justify-content: center;
          margin-top: 10vh;
          font-size: calc(12px + 0.6vw);
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
});

export default Home;
