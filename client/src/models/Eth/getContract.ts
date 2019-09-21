import EthAbi from "ethjs-abi";
import {
  abi as CrowdfundAbi,
  bytecode as CrowdfundBytecode
} from "../../contracts/Crowdfund.json";

const definitions = {
  crowdfund: {
    abi: CrowdfundAbi,
    bytecode: CrowdfundBytecode
  }
};

const getContract = (eth: any, name: keyof typeof definitions) => {
  const contract = new eth.contract(
    definitions[name].abi,
    definitions[name].bytecode
  );

  return contract;
};

const getContractAt = (
  eth: any,
  name: keyof typeof definitions,
  address: string
) => {
  return getContract(eth, name).at(address);
};

const events = {
  Fund: definitions.crowdfund.abi.find(
    item => item.type === "event" && item.name === "Fund"
  )
};

const decodeEvent = (name: keyof typeof events, data: string) => {
  console.log(events[name], data);
  return EthAbi.decodeMethod(events[name], data);
};

export { getContract, getContractAt, decodeEvent };
