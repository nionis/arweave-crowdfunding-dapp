import Web3 from "web3";
import CrowdfundDefinition from "../../contracts/Crowdfund.json";

const definitions = {
  crowdfund: {
    abi: CrowdfundDefinition.abi,
    bytecode: CrowdfundDefinition.bytecode
  }
};

const getContract = (web3: Web3, name: keyof typeof definitions) => {
  const contract = new web3.eth.Contract(definitions[name].abi);
  contract.options.data = definitions[name].bytecode;

  return contract;
};

const getContractAt = (
  web3: Web3,
  name: keyof typeof definitions,
  address: string
) => {
  return new web3.eth.Contract(definitions[name].abi, address);
};

export { getContract, getContractAt };
