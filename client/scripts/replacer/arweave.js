const Arweave = require("arweave/node");
const keyfile = require("../../arweave-keyfile.json");

const arweave = Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443
});

const create = async (data, contentType) => {
  const transaction = await arweave.createTransaction(
    {
      data
    },
    keyfile
  );

  transaction.addTag("Content-Type", contentType);

  await arweave.transactions.sign(transaction, keyfile);

  return transaction;
};

const upload = tx => {
  return arweave.transactions.post(tx);
};

module.exports = {
  create,
  upload
};
