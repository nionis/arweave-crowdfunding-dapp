import Link from "next/link";
import MetaMask from "./MetaMask";

const Header = () => {
  return (
    <div className="header">
      <Link href={`/`} scroll={false}>
        <img
          src="/static/images/arweave-logo.png"
          alt="Arweave Logo"
          width="125"
        />
      </Link>
      <MetaMask />

      <style jsx>{`
        img {
          cursor: pointer;
        }
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 9vh;
          margin-top: 1vh;
          width: 97.5vw;
          padding-left: 2.5vh;
          padding-right: 2.5vh;
          padding-top: 2.5vh;
        }
      `}</style>
    </div>
  );
};

export default Header;
