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
        factoryAddress: Address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        puzzleAddress: Address = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        investmentValue: BigNumberish = 10000;

async function main() {
    const accounts: SignerWithAddress[] = await ethers.getSigners();
    const owner: SignerWithAddress = accounts[0];
    const firstInvestor: SignerWithAddress = accounts[1];
  

    const PuzzleFactory = new Puzzle__factory(owner);
    const CoinTestFactory = new CoinTest__factory(owner);
    const InvestFactory = new Investment__factory(owner);


  
    const PuzzleContract: Puzzle =  PuzzleFactory.attach(puzzleAddress);
    const InvestContract: Investment =  InvestFactory.attach(investmentAddress);
    const CoinContract: CoinTest =  CoinTestFactory.attach(paymentTokenAddress);

    
    await PuzzleContract.connect(firstInvestor).mintTest();
    await CoinContract.connect(firstInvestor).mint(10000);
    await CoinContract.connect(firstInvestor).approve(InvestContract.address,10000);
    await InvestContract.connect(firstInvestor).invest(10000);



  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });