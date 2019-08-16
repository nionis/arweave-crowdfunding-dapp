const path = require("path");

const rootDir = path.join(__dirname, "..", "..");
const nextjsDir = path.join(rootDir, "out");
const arweaveDir = path.join(rootDir, "out-arweave");
const finalDir = path.join(rootDir, "out-final");

module.exports = {
  rootDir,
  nextjsDir,
  arweaveDir,
  finalDir
};
