const hre = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // compile and deploy the contract, and fund it with 0.1 ETH
  const moodContractFactory = await hre.ethers.getContractFactory(
    "MoodContract"
  );
  const moodContract = await moodContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await moodContract.deployed();

  console.log("contract deployed by: ", owner.address);
  console.log("contract deployed to: ", moodContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    moodContract.address
  );
  console.log(
    "Contract balance initial:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let moodCount;
  moodCount = await moodContract.getMoodsCount();
  console.log("mood count before: ", moodCount.toNumber());

  contractBalance = await hre.ethers.provider.getBalance(moodContract.address);
  console.log(
    "Contract balance before txn:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let moodTxn = await moodContract.setMood("wagmi");
  await moodTxn.wait();

  moodTxn = await moodContract.connect(randomPerson).setMood("gm");

  moodCount = await moodContract.getMoodsCount();
  console.log("mood count after: ", moodCount.toNumber());

  contractBalance = await hre.ethers.provider.getBalance(moodContract.address);
  console.log(
    "Contract balance after txn:",
    hre.ethers.utils.formatEther(contractBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
