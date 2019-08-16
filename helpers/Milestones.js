const Milestones = web3 => async () => {
  const { time } = require("./OpenZeppelin")(web3);

  const fundraise = {
    name: "test",
    description: "test desc",
    goal: web3.utils.toWei("2"),
    timeRequired: time.duration.weeks(2)
  };

  const milestones = [
    [
      web3.utils.toWei("1"),
      time.duration.weeks(2),
      web3.utils.utf8ToHex("design UI")
    ],
    [
      web3.utils.toWei("1"),
      time.duration.weeks(2),
      web3.utils.utf8ToHex("build UI")
    ]
  ].reduce(
    (all, [fund, rimeRequired, description]) => {
      all.funds.push(fund);
      all.timeRequired.push(rimeRequired);
      all.descriptions.push(description);

      return all;
    },
    {
      funds: [],
      timeRequired: [],
      descriptions: []
    }
  );

  return {
    fundraise,
    milestones
  };
};

module.exports = Milestones;
