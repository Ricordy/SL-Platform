import { BigNumber, utils } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { type Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  type Address,
} from "wagmi";
import useCheckEntryNFT from "~/hooks/useCheckEntryNFT";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import ProjectCarousel from "../components/ProjectCarousel";

interface InvestmentBlockchainType {
  id: number;
  address: Address;
  amount?: string;
  phase?: string;
  status?: string;
}
interface InvestmentDbType {
  address: Address;
  title: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  colorCombination: string;
}

// interface InvestmentsProps {
//   investments;
//   userTransactions;
// }
interface InvestmentType extends InvestmentDbType, InvestmentBlockchainType {}

// const userInvestments = [1, 2, 3];
// const selectedInvestments = investmentData.filter(
//   (i) => userInvestments.indexOf(i.id) > -1
// );

export interface TransactionProps {
  userTransactions: {
    amountInvested: number;
    hash: string;
    to: string;
    date: string;
    investment: {
      address: string;
      basicInvestment: {
        totalInvestment: number;
        car: {
          basicInfo: {
            cover: {
              url: string;
            };
            title: string;
          };
        };
      };
    };
    totalInvested?: number;
  }[];
}
export interface InvestmentProps {
  address: string;
  basicInvestment: {
    totalInvestment: number;
    investmentStatus: string;
    car: {
      basicInfo: {
        title: string;
        cover: {
          url: string;
        };
      };
    };
  };
}
export interface InvestmentsProps {
  investments: InvestmentProps[];
}
export interface SessionProps {
  session: Session;
}

interface MyInvestmentsProps extends InvestmentsProps, TransactionProps {}

export const TransactionItem = (items, userInvestedContracts) => {
  //console.log(userInvestedContracts);
  const { address } = useAccount();
  return items?.items?.map((item, idx) => {
    const addressContract = item.investment.address;
    // const { amountInvested } = useGetAddressInvestmentinSingleCar({
    //   contractAddress: addressContract,
    //   walletAddress: address,
    //   watch: true,
    // });
    return (
      <section key={idx}>
        <div className="flex items-center justify-between">
          <Image
            className="rounded-md"
            src={item.investment.basicInvestment.car.basicInfo.cover.url}
            width={64}
            height={53}
            alt="Car"
          />
          <span>{item.investment.basicInvestment.car.basicInfo.title}</span>
          <span>{item.amountInvested}</span>
          <span className="text-xs text-primaryGold">
            {userInvestedContracts[item.investment.address]}
          </span>
          <span>{item.date}</span>

          <Link href="#">
            <Image
              src="/icons/external-link.svg"
              width={10}
              height={10}
              alt="External link"
            />
          </Link>
        </div>
        <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
      </section>
    );
  });
};

const MyInvestments: NextPage = (props: MyInvestmentsProps) => {
  const { data: sessionData } = useSession();
  const { isConnected } = useAccount();
  const entryNFTPrice = utils.parseUnits("100", 6);

  // ABIs
  const paymentTokenABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
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
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
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
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
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
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
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
      name: "symbol",
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
      name: "totalSupply",
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
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
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
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;

  const slcoreABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_slLogicsAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_slPermissionsAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ClaimingPaused",
      type: "error",
    },
    {
      inputs: [],
      name: "EntryMintPaused",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "expectedLevel",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "userLevel",
          type: "uint256",
        },
      ],
      name: "IncorrectUserLevel",
      type: "error",
    },
    {
      inputs: [],
      name: "InexistentEntryBatch",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "InvalidAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "input",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "min",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "InvalidLevel",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "input",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "InvalidNumber",
      type: "error",
    },
    {
      inputs: [],
      name: "NoTokensRemaining",
      type: "error",
    },
    {
      inputs: [],
      name: "NotCEO",
      type: "error",
    },
    {
      inputs: [],
      name: "PlatformPaused",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "level",
          type: "uint256",
        },
      ],
      name: "UserMustHaveCompletePuzzle",
      type: "error",
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
          indexed: true,
          internalType: "address",
          name: "claimer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "TokensClaimed",
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
      name: "COLLECTION_IDS",
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
          name: "level",
          type: "uint256",
        },
      ],
      name: "_getPuzzleCollectionIds",
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
      name: "_random",
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
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "_userAllowedToBurnPuzzle",
      outputs: [],
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
      name: "claimLevel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "claimPiece",
      outputs: [],
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
      name: "entryIdsArray",
      outputs: [
        {
          internalType: "uint24",
          name: "",
          type: "uint24",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_entryPrice",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_tokenUri",
          type: "string",
        },
      ],
      name: "generateNewEntryBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getCurrentEntryBatchRemainingTokens",
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
          internalType: "address",
          name: "_user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "level",
          type: "uint256",
        },
      ],
      name: "getUserPuzzlePiecesForUserCurrentLevel",
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
      inputs: [],
      name: "slLogicsAddress",
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
      name: "slPermissionsAddress",
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
          name: "id",
          type: "uint256",
        },
      ],
      name: "unmountEntryID",
      outputs: [
        {
          internalType: "uint256",
          name: "batch",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "cap",
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
          name: "_collectionId",
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
          name: "",
          type: "address",
        },
      ],
      name: "userPuzzlePieces",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenIdOrPuzzleLevel",
          type: "uint256",
        },
      ],
      name: "verifyClaim",
      outputs: [],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "whichLevelUserHas",
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
  ] as const;
  const FactoryABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_slPermissionsAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "reason",
          type: "string",
        },
      ],
      name: "InvalidAddress",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "input",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "min",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "max",
          type: "uint256",
        },
      ],
      name: "InvalidLevel",
      type: "error",
    },
    {
      inputs: [],
      name: "NotCEO",
      type: "error",
    },
    {
      inputs: [],
      name: "PlatformPaused",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "ContractID",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "conAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "conLevel",
          type: "uint256",
        },
      ],
      name: "ContractCreated",
      type: "event",
    },
    {
      inputs: [],
      name: "SLPERMISSIONS_ADDRESS",
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
          internalType: "uint256",
          name: "_totalInvestment",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_paymentTokenAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_level",
          type: "uint256",
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
          name: "_contractAddress",
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
          name: "_user",
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
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_level",
          type: "uint256",
        },
      ],
      name: "getAddressTotalInLevel",
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
          internalType: "uint256",
          name: "_level",
          type: "uint256",
        },
      ],
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
      inputs: [
        {
          internalType: "address",
          name: "_slCoreAddress",
          type: "address",
        },
      ],
      name: "setSLCoreAddress",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "slCoreAddress",
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
  ] as const;

  const { address } = useAccount();

  const SlFactoryContract = {
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryABI,
  };

  const { data }: { data: BigNumber } = useContractReads({
    contracts: [
      {
        ...SlFactoryContract,
        functionName: "getAddressTotal",
        args: [address],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(1)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(2)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(3)],
      },
      // {
      //   ...SlLogicsContract,
      //   functionName: "_userAllowedToClaimPiece",
      //   chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
      //   args: [address, 1, 1, 0],
      // },
    ],
    // watch: true,
    onError(error) {
      console.log("Error", error);
    },
  });

  const { data: contractsTotalSupply }: { data: BigNumber } = useContractReads({
    contracts: [
      {
        ...SlFactoryContract,
        functionName: "getAddressTotal",
        args: [address],
      },
    ],
  });

  const { hasEntryNFT, hasEntryNFTLoading } = useCheckEntryNFT({
    address: address as Address,
  });

  const {
    data: dataLevels,
    error,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: slcoreABI,
    functionName: "whichLevelUserHas",
    args: [sessionData?.user.id as Address],
    // watch: true,
  });

  const [userContracts, setUserContracts] = useState([]);
  const investContracts = [];

  // const { data: userInvestments } = useContractRead({
  //   address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
  //   abi: FactoryAbi,
  //   functionName: "getInvestments",
  //   overrides: { from: address },
  //   // select: (data) => convertData(data),
  //   // onSuccess(data) {
  //   //   data.map((investment) =>
  //   //     Object.assign(
  //   //       investment,
  //   //       investmentData.find(
  //   //         (i) => i.address[3177] == investment.contractAddress
  //   //       )
  //   //     )
  //   //   );
  //   //   console.log(data);
  //   // },
  // });

  const getUserTransactions = async (address: Address) => {
    const {
      transactions: userTransactions,
    }: { transactions: TransactionProps } = await hygraph.request(
      gql`
        query UserTransactions {
          transactions(where: { transactionDetails: { from: "34343434" } }) {
            amountInvested
            date
            investment {
              address
              basicInvestment {
                totalInvestment
                car {
                  basicInfo {
                    cover {
                      url
                    }
                    title
                  }
                }
              }
            }
          }
        }
      `
    );
    return userTransactions;
  };

  // console.log("user transactions>>", props.userTransactions);
  const userInvestedContracts = [];
  props.userTransactions?.map((transaction) => {
    if (userInvestedContracts[transaction.to]) {
      userInvestedContracts[transaction.to] += transaction.amountInvested;
    } else {
      userInvestedContracts[transaction.to] = transaction.amountInvested;
    }
  });
  // console.log("userInvestedContracts", userInvestedContracts);
  // setUserContracts(userInvestedContracts);

  // Approve spend payment token
  const {
    config: configApproveToken,
    isLoading: isLoadingPrepareApprove,
    refetch: refecthPrepareApprove,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: paymentTokenABI,
    functionName: "approve",
    args: [
      process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as Address,
      utils.parseUnits("100", 6),
    ],
    enabled: false,
    onError(err) {
      console.log("configApprove", err.message);

      // toast.error(err.message);
    },
    // onSuccess() {
    //   toast.success("Approved!");
    // },
  });

  const {
    data: approveData,
    write: approve,
    isLoading: isLoadingApprove,
    error: errorApprove,
    isError: isErrorApprove,
    isSuccess: isSuccessApprove,
  } = useContractWrite(configApproveToken);

  const { config: mintEntryNFTConfig, refetch: mintEntryNFTRefetch } =
    usePrepareContractWrite({
      address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
      abi: slcoreABI,
      functionName: "mintEntry",
      enabled: false,
      // onError(err) {
      //toast.error(JSON.stringify(err));
      // console.log("mintEntry", err.data.message);
      // },
      // onSuccess() {
      // console.log("Allowed to mintEntryNFT");
      // },
    });

  const { data: dataMintNFT, write: mintNFT } =
    useContractWrite(mintEntryNFTConfig);

  const { isLoading: isLoadingMintNFT, isSuccess: isSuccessMintNFT } =
    useWaitForTransaction({
      hash: dataMintNFT?.hash,
      onSuccess: () => {
        // setUserMinted(true);
        toast.success("Minted NFT!");
      },
    });

  // Check user Payment Token balance
  const { data: userPaymentTokenBalance } = useBalance({
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    address: sessionData?.user.id as Address,
    // address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    // watch: true,
    enabled: isConnected,
    // chainId: 31337,
  });
  const myMint = async () => {
    console.log(userPaymentTokenBalance);

    try {
      if (
        userPaymentTokenBalance &&
        userPaymentTokenBalance.value < entryNFTPrice
      ) {
        toast.error("You don't have enough balance!");
        return;
      }
      const result = await mintEntryNFTRefetch();
      if (result.error && result.error.stack) {
        if (
          result.error.stack.indexOf("ERC20: transfer amount exceeds balance") >
          -1
        ) {
          return toast.error("You don't have enough balance");
        }
        if (
          result.error.stack.indexOf("SLCore: User have an entry token") > -1
        ) {
          return toast.error("You already minted the NFT!");
        }
        if (result.error.stack.indexOf("ERC20: insufficient allowance") > -1) {
          await refecthPrepareApprove();
          approve?.();
          mintNFT?.();
        }
      } else {
        mintNFT?.();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(getUserTransactions(address));
    // const populateInvestment = async () => {
    //   if (!userInvestments || !investmentData) return;
    //   userInvestments.map((ui, idx) => {
    //     if (ui) {
    //       const inv = investmentData?.find((i) => i.address[31337] == ui[idx]);
    //       if (inv) {
    //         console.log(ui[idx]);
    //         const uc: InvestmentType = {
    //           id: inv.id,
    //           title: inv.title,
    //           address: ui[idx] as Address,
    //           chassis: inv.chassis,
    //           totalProduction: inv.totalProduction,
    //           totalModelProduction: inv.totalModelProduction,
    //           colorCombination: inv.colorCombination,
    //         };
    //         setUserContracts([...userContracts, uc]);
    //       }
    //     }
    //   });
    // };
    // populateInvestment();
    /*
    const getFactory = async () => {
      try {
        let contractAddress: Address;
        const contractsToAdd = [];
        let userInvested: BigNumber;
        for (let i = 0; i < contractCount.toNumber(); i++) {
          contractAddress = await factoryContract
            ?.connect(signerData)
            .getContractDeployed(BigNumber.from(i));
          console.log(contractAddress);

          userInvested = await factoryContract
            .connect(signerData)
            .getAddressOnContract(contractAddress);
          if (userInvested.gt(0)) {
            console.log("adding", contractAddress);

            contractsToAdd.push({
              id: i + 1,
              title: `title-${i}`,
              address: contractAddress,
              abi: InvestAbi,
              phase: "none",
              functionName: "status",
              args: [i],
            });
          }

          // categories["Level 1"].push();
        }

        setContractsToRead(contractsToAdd);
        // console.log(contractsToRead);
      } catch (error) {
        console.log(error);
      }
    };
    getFactory();
    */
    //return () => console.log("Cleanup..");
  }, []);

  // return <div>end</div>;
  if (hasEntryNFTLoading) return <div>Loading...</div>;

  if (!hasEntryNFTLoading && !hasEntryNFT)
    return (
      <div className="mx-auto flex min-h-screen w-full flex-col">
        <NavBar />

        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-[96px] pt-[52px]">
          <div className="grid w-full grid-cols-2 items-start justify-center gap-4">
            <div className="flex w-[434px] flex-col gap-8">
              <div className="flex flex-col rounded-xl  bg-white px-10 py-[72px]">
                <div className="flex flex-col gap-[52px]">
                  <h1 className="text-5xl font-semibold uppercase text-primaryGold">
                    Buy your
                    <br />
                    <span className="font-medium text-black">Entry NFT!</span>
                  </h1>
                  <p className=" text-sm">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. .
                  </p>
                </div>
              </div>
              <Link
                href="/mint-entry-nft"
                className="rounded-xl bg-primaryGold px-3 py-1.5 text-center font-medium uppercase text-white dark:bg-primaryGold dark:text-white"
              >
                Buy it for 100$
              </Link>
              <button
                className="inline-flex justify-center rounded-md border border-transparent bg-orange-800 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
                disabled={!isConnected}
                onClick={myMint as () => void}
              >
                {isLoadingMintNFT ? "Minting..." : "Mint NFT"}
              </button>
            </div>
            <div className="relative flex h-full w-full bg-[url('/bg/bg-buy-entry-nft.jpg')] bg-contain bg-center bg-no-repeat"></div>
          </div>
          <div className="flex justify-center gap-12">
            <div className="flex flex-col">
              <span className="text-primaryGold">
                Total Invested until now:
              </span>
              <span className="text-4xl font-semibold text-white">
                $504.600
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGold">Return expected</span>
              <span className="text-4xl font-semibold text-white">
                $504.600
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGold">NFTs sold until now:</span>
              <span className="text-4xl font-semibold text-white">
                $504.600
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className="mx-auto w-full bg-white">
      <div className="relative flex w-full flex-col rounded-bl-[56px] ">
        <div className="absolute top-0 h-[1092px] w-full rounded-bl-[56px] bg-black"></div>
        <NavBar />

        <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="mb-8 text-3xl uppercase tracking-widest text-white">
              My Investments
              {/* <div>Here{JSON.stringify(props, null, 2)}</div> */}
            </h3>
            <h2 className="mb-12 text-5xl uppercase text-white">
              Welcome{" "}
              <span className="font-medium text-primaryGold">Home, sir</span>
            </h2>
            <div className="grid auto-rows-[1fr] grid-cols-2 gap-12 text-white">
              <div className="flex flex-col  gap-4">
                <span>Overview:</span>
                {data && (
                  <div className="flex flex-1 flex-col gap-8 rounded-md bg-myInvestmentsBackground px-12 py-8">
                    <div className="flex flex-col">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Connected to Blockchain)
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        ${data && data[0]?.div(10 ** 6).toNumber()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-base text-primaryGold">
                        Level 1 - Total Invested (Connected to Blockchain)
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        ${data?.[1].div(10 ** 6).toNumber()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-base text-primaryGold">
                        Level 2 - Total Invested (Connected to Blockchain)
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        ${data[2].div(10 ** 6).toNumber()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <h5 className="text-base text-primaryGold">
                        Level 3 - Total Invested (Connected to Blockchain)
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        ${data[3].div(10 ** 6).toNumber()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <span>Last transactions:</span>
                <div className="flex flex-1 flex-col gap-2 rounded-md bg-myInvestmentsBackground px-4 py-8">
                  {JSON.stringify(userInvestedContracts)}
                  {userInvestedContracts && (
                    <TransactionItem
                      items={props.userTransactions}
                      userInvestedContracts={userInvestedContracts}
                    />
                  )}

                  {/* <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem /> */}
                  <Link
                    className="flex self-start"
                    href="https://etherscan.io/"
                    target="_blank"
                  >
                    See more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative left-1/2 z-20 mx-auto -ml-[570px] mt-[52px]  min-h-[500px] max-w-[1338px]">
        <ProjectCarousel
          id="1"
          prevNavWhite={true}
          title={<h2 className="text-2xl text-white">Active</h2>}
          items={props.investments?.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Active"
          )}
        />

        <ProjectCarousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Upcoming</h2>}
          items={props.investments?.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Upcoming"
          )}
        />
        {/* <Carousel
          id="3"
          className="pt-[132px]"
          title={<h2 className="text-2xl">My favorites</h2>}
          items={props.investments}
        /> */}
        <ProjectCarousel
          id="4"
          className="py-[132px]"
          title={<h2 className="text-2xl">Finished</h2>}
          items={props.investments?.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Finished"
          )}
        />
      </div>
      <div className="relative z-20 mx-auto flex rounded-t-[56px] bg-black pb-[128px] pt-[72px] text-white">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-[52px]">
          <Carousel
            id="4"
            className="w-full pt-[132px]"
            title={<h2 className="text-2xl">Our Suggestions for you</h2>}
            items={props.investments?.filter(
              (investment) =>
                investment.basicInvestment.investmentStatus == "Active"
            )}
          />

          {/* {carouselItems.slice(0, 3).map((item, idx) => (
              <CarouselItem
                key={idx}
                title={item.title}
                image={item.image}
                price={item.price}
              />
            ))} */}
        </div>
      </div>
    </section>
    // <div className="flex flex-col w-full px-6 lg:px-3 mt-16 md:mt-0">
    //   <h2 className="text-2xl py-6">My Investments</h2>

    //   <Tab.Group>
    //     <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
    //       {Object.keys(categories).map((category) => (
    //         <Tab
    //           key={category}
    //           className={({ selected }) =>
    //             classNames(
    //               "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
    //               "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
    //               selected
    //                 ? "bg-white shadow"
    //                 : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
    //             )
    //           }
    //         >
    //           {category}
    //         </Tab>
    //       ))}
    //     </Tab.List>
    //     <Tab.Panels className="mt-2">
    //       {Object.values(categories).map((investments, idx) => (
    //         <Tab.Panel
    //           key={idx}
    //           className={classNames(
    //             "rounded-xl bg-white p-3",
    //             "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
    //           )}
    //         >
    //           {/* {userContracts && JSON.stringify(userContracts)} */}
    //           <ul className="grid  sm:grid-cols-2 grid-cols-1 gap-2">
    //             {Object.values(userContracts).map((investment) => (
    //               <li
    //                 key={investment.address}
    //                 className="relative rounded-md p-3 border  flex  flex-col gap-3 justify-around hover:bg-gray-100"
    //               >
    //                 <h3 className="text-sm font-medium leading-5 pb-3">
    //                   <Link href={`/investment/${investment.address}`}>
    //                     {investment.title ?? "none"}
    //                   </Link>
    //                 </h3>

    //                 {investment?.phase !== "Withdraw" ? (
    //                   <div className="border p-2 text-xs rounded-md">
    //                     {investment?.phase}
    //                   </div>
    //                 ) : (
    //                   <button className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100">
    //                     Withdraw
    //                   </button>
    //                 )}
    //                 <Link href={`/investment/${investment.address}/monitor`}>
    //                   <a className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100 text-center">
    //                     Monitor Investment
    //                   </a>
    //                 </Link>
    //               </li>
    //             ))}
    //           </ul>
    //         </Tab.Panel>
    //       ))}
    //     </Tab.Panels>
    //   </Tab.Group>
    // </div>
  );
};

export default MyInvestments;

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER,
  },
});

export const getServerSideProps: GetServerSideProps<
  MyInvestmentsProps
> = async (ctx) => {
  const session = await getSession(ctx);

  const { investments }: { investments: InvestmentsProps } =
    await hygraph.request(
      gql`
        query Investments {
          investments {
            id
            address
            basicInvestment {
              id
              totalInvestment
              investmentStatus
              car {
                basicInfo {
                  title
                  cover {
                    id
                    url
                  }
                }
              }
            }
          }
        }
      `
    );

  const { transactions: userTransactions }: { transactions: TransactionProps } =
    await hygraph.request(
      gql`
        query UserTransactions {
          transactions(
            where: { from: "${session?.user.id}" }
            orderBy: publishedAt_DESC
          ) {
            amountInvested
            hash
            to
            date
            investment {
              address
              basicInvestment {
                totalInvestment
                car {
                  basicInfo {
                    cover {
                      url
                    }
                    title
                  }
                }
              }
            }
          }
        }
      `
    );

  return {
    props: {
      investments: session ? investments : null,
      userTransactions: session ? userTransactions : null,
    },
  };
};
