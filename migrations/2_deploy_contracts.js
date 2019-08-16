const Milestones = require("../helpers/Milestones")(web3);
const Crowdfund = artifacts.require("./Crowdfund.sol");

module.exports = function(deployer) {
  deployer.then(async () => {
    const { fundraise, milestones } = await Milestones();

    return deployer.deploy(
      Crowdfund,
      fundraise.name,
      fundraise.description,
      fundraise.goal,
      fundraise.timeRequired,
      milestones.funds,
      milestones.timeRequired,
      milestones.descriptions
    );
  });
};
