import { ethers, Wallet } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { Factory } from "../../../typechain-types";
import factoryJson from "../../artifacts/contracts/Factory.sol/Factory.json";
import { AlchemyProvider } from "@ethersproject/providers";
import { Factory__factory } from "../../../typechain-types/factories/contracts/Factory__factory";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const provider = new AlchemyProvider(
  //   "goerli",
  //   process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
  // );
  const provider = new ethers.providers.JsonRpcProvider();
  const walletPrivateKey = process.env.PRIVATE_KEY;
  const paymentTokenAddress = process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS;
  const puzzleContractAddress = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
  const wallet = new Wallet(walletPrivateKey);
  const signer = wallet.connect(provider);

  const factoryContractFactory = new Factory__factory(signer);

  const factoryContract = await factoryContractFactory.attach(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );

  await factoryContract.deployNew(paymentTokenAddress, puzzleContractAddress);
  const deployedContractAddress =
    await factoryContract.getLastDeployedContract();
  res.status(200).json({ newcontract: deployedContractAddress });
}
