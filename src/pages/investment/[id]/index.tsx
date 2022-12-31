import Head from "next/head";
import { useRouter } from "next/router";
import InvestmentHistory from "../../../components/InvestmentHistory";
import InvestmentNumbers from "../../../components/InvestmentNumbers";
import { InvestmentSidebar } from "../../../components/InvestmentSidebar";
import PuzzleItem from "../../../components/PuzzleItem";
import Slider from "../../../components/Slider";
import { investmentData } from "../../../data/Investments";
import { useAccount, useContractRead } from "wagmi";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import {abi as InvestAbi} from "../../../artifacts/contracts/Investment.sol/Investment.json"
import {abi as CoinTestAbi} from "../../../artifacts/contracts/CoinTest.sol/CoinTest.json"
import {abi as FactoryAbi} from "../../../artifacts/contracts/Factory.sol/Factory.json"
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";


const factoryAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ContractID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "conAddress",
        type: "address",
      },
    ],
    name: "ContractCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "counter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalInvestment",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_paymentTokenAddress",
        type: "address",
      },
    ],
    name: "deployNew",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "deployedContracts",
    outputs: [
      {
        internalType: "contract Investment",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "getAddressOnContract",
    outputs: [
      {
        internalType: "uint256",
        name: "userTotal",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getAddressTotal",
    outputs: [
      {
        internalType: "uint256",
        name: "userTotal",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastDeployedContract",
    outputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_lgentry",
        type: "address",
      },
    ],
    name: "setEntryAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const Investment = ({ investment }) => {
  const { address } = useAccount();



  // const data = readContract({
  //   address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  //   abi: factoryJson.abi,
  //   functionName: "getAddressTotal",
  //   args: ["0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"],
  // });
  // data.then((resp) => {
  //   console.log(resp);
  // });
  // const contractConfig = {
  //   addressOrName: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  //   contractInterface: factoryJson.abi,
  // };
  const { data: contractTotal } = useContractRead({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: CoinTestAbi,
    functionName: 'balanceOf',
    args: ["0xCafac3dD18aC6c6e92c921884f9E4176737C052c"],
    watch: true
  });
  
  const { data: totInvestment } = useContractRead({
      address: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      abi: InvestAbi,
      functionName: 'totalInvestment',
      watch: true,
  })

  const { data: userTotalInvestment } = useContractRead({
      address: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      abi: InvestAbi,
      functionName: 'balanceOf',
      args: [address],
      watch: true,
  })

  //console.log(address);
  

  //console.log(Number(userTotalInvestment));
  

  
  // useEffect(() => {
  //   if (!test) return;
    
  //   console.log(test);
    
  // }, [test]);


  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="flex max-w-4xl  gap-6 px-3 md:px-0 mt-24 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
          <Slider className="flex flex-col  " />
          {}
          <PuzzleItem
            className="w-full md:col-start-1"
            amount={totInvestment?.toString()}
            current={contractTotal?.toString()}
            progress={investment?.percentage}
            showProgressInsideBar={true}
          />
          <InvestmentNumbers />

          <InvestmentSidebar
            className="md:row-start-1 md:col-start-2 md:row-span-3 flex flex-col align-middle justify-between"
            title={investment?.title}
            chassis={investment?.chassis}
            address={investment?.address}
            totalProduction={investment?.totalProduction}
            totalModelProduction={investment?.totalModelProduction}
            colorCombination={investment?.colorCombination}
            amount={investment?.amount}
            phase={investment?.phase}
          />
          <InvestmentHistory
            className=" place-self-start flex gap-12 pt-6 justify-start"
            totalInvested={Number(userTotalInvestment)}
            showExpectedReturn={true}
            totalInvestment = {Number(totInvestment)}
          />
        </div>
      </main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );
  // console.log(investment);

  return {
    props: { investment },
  };
};

export default Investment;
