const { expect } = require("chai");

describe("MoodContract", function () {
  it("Should set the first mood and the total should be 1", async function () {
    const MoodContract = await hre.ethers.getContractFactory("MoodContract");
    const moodContract = await MoodContract.deploy();
    await moodContract.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    const setMoodTx = await moodContract.setMood("wagmi");

    // wait until the transaction is mined
    await setMoodTx.wait();

    expect(await moodContract.getMoodsCount()).to.equal(1);

    const allMoods = await moodContract.getAllMoods();
  });
});
