import Web3 from "web3";

const check = () => {
  const { web3 } = window as Window & { web3: Web3 };

  const foundInWindow = typeof web3 !== "undefined";
  if (!foundInWindow) {
    console.log(`No web3 instance injected.`);
    return undefined;
  }

  console.log(`Injected web3 detected.`);
  return new Web3(web3.currentProvider);
};

const getWeb3 = () => {
  return new Promise<Web3 | undefined>(resolve => {
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === "complete") {
      return resolve(check());
    }

    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolve(check());
    });
  });
};

export default getWeb3;
