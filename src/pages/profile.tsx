import type { NextPage } from "next";
import Head from "next/head";
import PuzzleItem from "../components/PuzzleItem";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import InvestmentHistory from "../components/InvestmentHistory";
import {
  Address,
  useAccount,
  useContract,
  useContractRead,
  useSigner,
} from "wagmi";
import { FactoryAbi, InvestAbi, PuzzleAbi } from "../data/ABIs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BigNumber } from "ethers";

const Profile: NextPage = () => {
  const [, setHasEntryNFT] = useState(false);
  const { data: signerData } = useSigner();
  const { address } = useAccount();
  const tokenCollectionIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const userArray = [
    address,
    address,
    address,
    address,
    address,
    address,
    address,
    address,
    address,
    address,
  ];

  const { data: userBalancePuzzle } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: PuzzleAbi,
    functionName: "balanceOfBatch",
    args: [userArray, tokenCollectionIds],
    watch: true,
  });

  const { data: minClaimAmount } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_factoryAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_paymentTokenAddress",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "Burned",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "burnedIds",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "amount",
            type: "uint256[]",
          },
        ],
        name: "BurnedAndMinted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "collection",
            type: "uint8",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "max_amount",
            type: "uint256",
          },
        ],
        name: "Max",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint8",
            name: "collection",
            type: "uint8",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "user",
            type: "address",
          },
        ],
        name: "Minted",
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
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            indexed: false,
            internalType: "uint256[]",
            name: "values",
            type: "uint256[]",
          },
        ],
        name: "TransferBatch",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "TransferSingle",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "string",
            name: "value",
            type: "string",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "URI",
        type: "event",
      },
      {
        inputs: [],
        name: "AC",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "BREAK",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "CHAIR",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "CHASIS",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "DOOR",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ENTRY_NFT_PRICE",
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
        inputs: [],
        name: "GLASS",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "LEVEL1",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "LEVEL2",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "LIGHT",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "MAX_PER_COLLECTION",
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
        inputs: [],
        name: "MIN_CLAIM_AMOUNT",
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
        inputs: [],
        name: "MOTOR",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "STEERING",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "WHEEL",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "balanceOf",
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
            internalType: "address[]",
            name: "accounts",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
        ],
        name: "balanceOfBatch",
        outputs: [
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "base_uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "claim",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "factoryAddress",
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
        inputs: [
          {
            internalType: "uint8",
            name: "collection",
            type: "uint8",
          },
        ],
        name: "getMaxCollection",
        outputs: [
          {
            internalType: "uint256",
            name: "max",
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
            name: "account",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "mintEntry",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "mintTest",
        outputs: [],
        stateMutability: "nonpayable",
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
        name: "paymentTokenAddress",
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
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeBatchTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "pure",
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
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "uri",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
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
        name: "verifyBurn",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
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
        name: "verifyClaim",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "MIN_CLAIM_AMOUNT",
  });

  const { data: userTotalInvestment } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: [
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
    ],
    functionName: "getAddressTotal",
    args: [address as Address],
    // onSuccess(data) {
    //   console.log(data.toString());
    // },
    // watch: true,
  });

  // console.log("min amount", minClaimAmount.toString());

  function howMany() {
    let total = 0;
    // const userTotalInvestmentNumber = Number(userTotalInvestment) / 10 ** 6;


    if (userTotalInvestment?.lt(minClaimAmount as BigNumber)) {
      return userTotalInvestment;
    } else {
      if (userBalancePuzzle) {
        for (let i = 0; i < 10; i++) {


          total += Number(userBalancePuzzle[i]);
        }
        if (total > 0) {
          return Number(userTotalInvestment) / 10 ** 6 - total * 5000;
        } else {
          return Number(userTotalInvestment) / 10 ** 6;
        }
      }
    }
  }

  const ProfileDetails = () => {
    const puzzleContract = useContract({
      address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS,
      abi: PuzzleAbi,
      signerOrProvider: signerData,
    });

    async function handleClick(event) {
      event.preventDefault();
      try {
        const results = await puzzleContract.connect(signerData).claim();
        await results.wait();
      } catch (error) {
        if (error.reason) {
          if (error.reason.indexOf("Puzzle: Missing Entry NFT") > -1) {
            toast.error("You don't have the Entry NFT");
          } else if (error.reason.indexOf("User not able to claim") > -1) {
            toast.error("You haven't invested enough to Claim");
          } else {
            toast.error(error.reason);
          }
        } else if (error.data) {
          if (error.data.indexOf("Transaction ran out of gas") > -1) {
            toast.error("Transaction ran out of gas");
          } else {
            toast.error(error.data);
          }
        } else {
          toast.error(JSON.stringify(error));
        }
      }
    }

    return (
      <div className="">
        <div className="flex pb-6 gap-6">
          <div className="border w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.5}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <Link href="#">
            <a
              className="flex align-middle gap-2"
              onClick={() =>
                window.open(
                  "https://goerli.etherscan.io/address/" + String(address),
                  "_blank"
                )
              }
            >
              {address} <FiExternalLink />
            </a>
          </Link>
        </div>
        <div className="">
          <div className="flex flex-col">
            <InvestmentHistory
              contractAddress={
                process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address
              }
              totalInvested={Number(userTotalInvestment) / 10 ** 6}
              totalInvestment={Number(minClaimAmount) / 10 ** 6}
            />
            <div className="font-bold py-6">Puzzle Progress</div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex gap-6">
                <PuzzleItem
                  level={1}
                  amount={(Number(minClaimAmount) / 10 ** 6).toString()}
                  current={howMany()?.toString()}
                  showProgressInsideBar={true}
                />
                {
                  <button
                    className="border rounded-md self-end p-2 bg-slate-800 text-slate-50"
                    onClick={handleClick}
                  >
                    Claim
                  </button>
                }
              </div>
              <div className="flex gap-6">
                <PuzzleItem
                  level={2}
                  amount="10000"
                  current="0"
                  progress="0"
                  showProgressInsideBar={true}
                />
                <button disabled className="border rounded-md self-end p-2">
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Something Legendary | Profile</title>
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl px-6 lg:px-3 mt-16 md:mt-0">
        <h2 className="text-2xl py-6">Profile</h2>
        <ProfileDetails />
      </main>
    </>
  );
};

export default Profile;
