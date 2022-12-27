import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";
import { Address } from "wagmi";

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

const   paymentTokenAddress: Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        investmentAddress: Address = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c",
        puzzleAddress: Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        investmentValue: BigNumberish = 10000;

async function main() {
    const accounts: SignerWithAddress[] = await ethers.getSigners();
    const owner: SignerWithAddress = accounts[0];
    const firstInvestor: SignerWithAddress = accounts[1];
  
    const paymentTokenFactory = new CoinTest__factory(owner);
    const puzzleContractFactory = new Puzzle__factory(owner);
  
    const paymentTokenContract: CoinTest =  paymentTokenFactory.attach(paymentTokenAddress);
    const puzzleContract: Puzzle =  puzzleContractFactory.attach(puzzleAddress);
   
    console.log(
      "Minting 10K tokens to Investor1: "
    );
    await paymentTokenContract.connect(firstInvestor).mint(investmentValue);
    console.log(
        "Approving 10K tokens to be spend by Puzzle and Investment Contract from Investor1: "
      );
    await paymentTokenContract.connect(firstInvestor).approve(puzzleAddress, investmentValue);
    await paymentTokenContract.connect(firstInvestor).approve(investmentAddress, investmentValue);
    console.log(
        "Minting entry for Investor1: "
      );
    await puzzleContract.connect(firstInvestor).mintEntry();
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });