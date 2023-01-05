import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-etherscan";
import hre from "hardhat";

import {
  CoinTest,
  CoinTest__factory,
  Factory,
  Factory__factory,
  Puzzle,
  Puzzle__factory,
  Investment,
  Investment__factory,
} from "../typechain-types";

async function main() {
  const accounts: SignerWithAddress[] = await ethers.getSigners();
  const owner: SignerWithAddress = accounts[0];

  const paymentTokenFactory = new CoinTest__factory(owner);
  const factoryContractFactory = new Factory__factory(owner);
  const puzzleContractFactory = new Puzzle__factory(owner);
  const investmentFactory = new Investment__factory(owner);

  const paymentTokenContract: CoinTest = await paymentTokenFactory.deploy();

  const factoryContract: Factory = await factoryContractFactory.deploy();
  const puzzleContract: Puzzle = await puzzleContractFactory.deploy(
    factoryContract.address,
    paymentTokenContract.address
  );
  await factoryContract.deployNew(100000, paymentTokenContract.address);
  const investmentAddress = await factoryContract.getLastDeployedContract();
  const investmentContract: Investment =
    investmentFactory.attach(investmentAddress);

  console.log(
    "Payment Token address deployed at: ",
    paymentTokenContract.address
  );
  console.log("Puzzle deployed at: ", puzzleContract.address);
  console.log("Factory deployed at: ", factoryContract.address);
  console.log("Investment deployed at: ", investmentContract.address);

  // console.log(
  //   "Verifying contracts on Goerli:"
  // );
  // sleep(10000)
  // await hre.run("verify:verify", {
  //   address: paymentTokenContract.address,

  // })
  // await hre.run("verify:verify", {
  //   address: puzzleContract.address,
  //   arguments: [factoryContract.address, paymentTokenContract.address],
  // })
  // await hre.run("verify:verify", {
  //   address: factoryContract.address,
  // })
  // await hre.run("verify:verify", {
  //   address: investmentContract.address,
  //   arguments: [100000, paymentTokenContract.address],
  // })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
