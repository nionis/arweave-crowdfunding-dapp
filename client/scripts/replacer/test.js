const arweave = require("./arweave");

const start = async () => {
  const tx = await arweave.create("hello", "text/plain");
  const res = await arweave.upload(tx);

  console.log(tx.id);
  console.log(res.status);
  console.log(res.statusText);
  console.log(res.data);
};

start();
