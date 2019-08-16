const { time, expectRevert } = require("../helpers/OpenZeppelin")(web3);
const Milestones = require("../helpers/Milestones")(web3);
const Crowdfund = artifacts.require("./Crowdfund.sol");

contract("Crowdfund", accounts => {
  const [owner, user1, user2] = accounts;
  let crowdfund;

  beforeEach(async () => {
    const { fundraise, milestones } = await Milestones();

    crowdfund = (await Crowdfund.new(
      fundraise.name,
      fundraise.description,
      fundraise.goal,
      fundraise.timeRequired,
      milestones.funds,
      milestones.timeRequired,
      milestones.descriptions
    )).contract;
  });

  it("should fail, not equal funds and deadlines", async () => {
    const { fundraise, milestones } = await Milestones();

    await expectRevert(
      Crowdfund.new(
        "test",
        "test",
        fundraise.goal,
        fundraise.timeRequired,
        [milestones.funds[0]],
        [],
        []
      ),
      "milestone arguments must be equal in length"
    );
  });

  it("should fail, empty funds and deadlines", async () => {
    const { fundraise } = await Milestones();

    await expectRevert(
      Crowdfund.new(
        "test",
        "test",
        fundraise.goal,
        fundraise.timeRequired,
        [],
        [],
        []
      ),
      "must contain atleast one milestone"
    );
  });

  it("should have fundraise and 2 milestones", async () => {
    const fundraise = await crowdfund.methods
      .fundraises(0)
      .call({ from: owner });
    const milestone1 = await crowdfund.methods
      .milestones(1)
      .call({ from: owner });
    const milestone2 = await crowdfund.methods
      .milestones(3)
      .call({ from: owner });

    assert.equal(
      fundraise.goal,
      web3.utils.toWei("2"),
      "fundraise.goal amount should be 2 ether"
    );

    assert.equal(
      milestone1.fundingRequired,
      web3.utils.toWei("1"),
      "milestone1.fundingRequired amount should be 1 ether"
    );

    assert.equal(
      milestone2.fundingRequired,
      web3.utils.toWei("1"),
      "milestone2.fundingRequired amount should be 1 ether"
    );
  });

  it("should start fundraise", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    const fundraise = await crowdfund.methods
      .fundraises(0)
      .call({ from: owner });

    assert.equal(fundraise.status, "1", "fundraise should have started");
  });

  it("should fund 1 ether", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("1"),
      gas: 4600000
    });

    const funded = await crowdfund.methods.getUserFunds().call({ from: owner });

    assert.equal(
      funded,
      web3.utils.toWei("1"),
      "funded amount should be 1 ether"
    );
  });

  it("should fund 1 ether, total 2", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("1"),
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("1"),
      gas: 4600000
    });

    const funded = await crowdfund.methods.getUserFunds().call({ from: owner });

    assert.equal(
      funded,
      web3.utils.toWei("2"),
      "funded amount should be 2 ether"
    );
  });

  it("should refund funds 1 ether", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("1"),
      gas: 4600000
    });

    await time.increase(time.duration.years(2));
    await crowdfund.methods.refund().send({ from: owner, gas: 4600000 });

    const funded = await crowdfund.methods.getUserFunds().call({ from: owner });

    assert.equal(
      funded,
      web3.utils.toWei("0"),
      "funded amount should be 0 ether"
    );
  });

  it("should reach milestone 1", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("2"),
      gas: 4600000
    });

    await crowdfund.methods.report("all good").send({
      from: owner,
      gas: 4600000
    });

    const milestone = await crowdfund.methods
      .milestones("1")
      .call({ from: owner });

    assert.equal(milestone.status, "2");
    assert.equal(await crowdfund.methods.atTask().call({ from: owner }), "2");
  });

  it("should pass vote on milestone 1", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("2"),
      gas: 4600000
    });

    await crowdfund.methods.report("all good").send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.vote(true).send({ from: owner, gas: 4600000 });
    await time.increase(time.duration.weeks(2));
    await crowdfund.methods.voteResult().send({ from: owner, gas: 4600000 });

    const vote = await crowdfund.methods.votes("2").call({ from: owner });

    assert.equal(vote.status, "2");
    assert.equal(await crowdfund.methods.atTask().call({ from: owner }), "3");
  });

  it("should complete crowdfund", async () => {
    await crowdfund.methods.start().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.fund().send({
      from: owner,
      value: web3.utils.toWei("2"),
      gas: 4600000
    });

    await crowdfund.methods.claim().send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.report("all good").send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.vote(true).send({ from: owner, gas: 4600000 });
    await time.increase(time.duration.weeks(2));
    await crowdfund.methods.voteResult().send({ from: owner, gas: 4600000 });

    await crowdfund.methods.report("all good").send({
      from: owner,
      gas: 4600000
    });

    await crowdfund.methods.vote(true).send({ from: owner, gas: 4600000 });
    await time.increase(time.duration.weeks(1));
    await crowdfund.methods.voteResult().send({ from: owner, gas: 4600000 });
  });
});
