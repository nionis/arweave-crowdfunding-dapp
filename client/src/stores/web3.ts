import Web3 from "../models/Web3";

const web3 = Web3.create();

web3.sync();
setInterval(() => web3.sync(), 1e3);

export default web3;
