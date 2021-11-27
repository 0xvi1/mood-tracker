const hre = require("hardhat");

const main = async () => {
  const [owner, deployer] = await hre.ethers.getSigners();

  // const accountBalance = await deployer.getBalance();
  // console.log("Deploying contracts with account: ", deployer.address);
  // console.log("Account balance: ", accountBalance.toString());

  // compile, deploy, fund the contract
  const MoodContract = await hre.ethers.getContractFactory("MoodContract");
  const moodContract = await MoodContract.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
  await moodContract.deployed();

  console.log("contract deployed by: ", owner.address);
  console.log("contract deployed to: ", moodContract.address);
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
