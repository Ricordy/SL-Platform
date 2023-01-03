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
  const puzzleContractAddress = "0xF0C5cC4C5792DFE7996A363A5539021933559CF1";
  const wallet = new Wallet(walletPrivateKey);
  const signer = wallet.connect(provider);

  const factoryContractFactory = new Factory__factory(signer);

  const factoryContract = await factoryContractFactory.attach(
    "0xDaEF5954a79A560c95728de005A456BdC08608e0"
  );

  await factoryContract.deployNew(paymentTokenAddress, puzzleContractAddress);
  const deployedContractAddress =
    await factoryContract.getLastDeployedContract();
  res.status(200).json({ newcontract: deployedContractAddress });
}
