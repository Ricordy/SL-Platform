import React, { FC, useState } from "react";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { classNames, cn } from "../lib/utils";
import Carousel from "./puzzle/Carousel";
import Image from "next/image";
import { Button } from "./ui/Button";
import {
  Address,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { BigNumber } from "ethers";
import useGetUserPuzzlePieces from "../hooks/useGetUserPuzzlePieces";
import toast from "react-hot-toast";
interface PuzzleProps {
  className?: string;
  isConnected: boolean;
  userAddress: Address;
  puzzlePieces: {
    tokenid: number;
    title: string;
    image: {
      url: string;
    };
  }[];
  dbLevels: {
    basicLevel: {
      title: string;
    };
    description: string;
    profitRange: string;
  }[];
}
const SLCoreABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_factoryAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_slLogicsAddress",
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
          name: "newContract",
          type: "address",
        },
      ],
      name: "ContractUpgrade",
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
        {
          indexed: false,
          internalType: "uint256",
          name: "quantity",
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
          name: "user",
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
          name: "",
          type: "address",
        },
      ],
      name: "allowedContracts",
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
      name: "ceoAddress",
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
      name: "cfoAddress",
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
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint32",
          name: "position",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "newNumber",
          type: "uint256",
        },
      ],
      name: "changetXPositionInFactor5",
      outputs: [
        {
          internalType: "uint256",
          name: "_final",
          type: "uint256",
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
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "startPosition",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "numberOfResults",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "factor",
          type: "uint256",
        },
      ],
      name: "getMultiplePositionsXInDivisionByY",
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
      inputs: [
        {
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "position",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "factor",
          type: "uint256",
        },
      ],
      name: "getPositionXInDivisionByY",
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
          internalType: "uint32",
          name: "number",
          type: "uint32",
        },
        {
          internalType: "uint32",
          name: "position",
          type: "uint32",
        },
      ],
      name: "incrementXPositionInFactor3",
      outputs: [
        {
          internalType: "uint32",
          name: "_final",
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
          internalType: "uint256",
          name: "level",
          type: "uint256",
        },
      ],
      name: "mintTest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
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
      name: "mountEntryID",
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
          name: "cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currentID",
          type: "uint256",
        },
      ],
      name: "mountEntryValue",
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
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "pauseEntryMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
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
      name: "pausedEntryMint",
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
          name: "_contractAddress",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_allowed",
          type: "bool",
        },
      ],
      name: "setAllowedContracts",
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
          internalType: "address",
          name: "_newCEO",
          type: "address",
        },
      ],
      name: "setCEO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newCFO",
          type: "address",
        },
      ],
      name: "setCFO",
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
          internalType: "uint24",
          name: "value",
          type: "uint24",
        },
      ],
      name: "unmountEntryValue",
      outputs: [
        {
          internalType: "uint256",
          name: "cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currentID",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unpauseEntryMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
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
          name: "user",
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
  ],
  FactoryABI = [
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
        {
          indexed: false,
          internalType: "uint256",
          name: "conLevel",
          type: "uint256",
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
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
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
        {
          internalType: "uint8",
          name: "level",
          type: "uint8",
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
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "level",
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
          name: "level",
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
  SLLogicsABI = [
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
          indexed: false,
          internalType: "address",
          name: "newContract",
          type: "address",
        },
      ],
      name: "ContractUpgrade",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "withdrawer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      name: "TokensWithdrawn",
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
      inputs: [],
      name: "_getEntryPrice",
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
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_currentUserLevel",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_userPuzzlePiecesForUserCurrentLevel",
          type: "uint256",
        },
      ],
      name: "_userAllowedToClaimPiece",
      outputs: [],
      stateMutability: "view",
      type: "function",
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
          name: "",
          type: "address",
        },
      ],
      name: "allowedContracts",
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
      name: "ceoAddress",
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
      name: "cfoAddress",
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
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint32",
          name: "position",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "newNumber",
          type: "uint256",
        },
      ],
      name: "changetXPositionInFactor5",
      outputs: [
        {
          internalType: "uint256",
          name: "_final",
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
          internalType: "uint256",
          name: "_level",
          type: "uint256",
        },
      ],
      name: "getMinClaimAmount",
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
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "startPosition",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "numberOfResults",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "factor",
          type: "uint256",
        },
      ],
      name: "getMultiplePositionsXInDivisionByY",
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
      inputs: [
        {
          internalType: "uint256",
          name: "number",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "position",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "factor",
          type: "uint256",
        },
      ],
      name: "getPositionXInDivisionByY",
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
          internalType: "uint32",
          name: "number",
          type: "uint32",
        },
        {
          internalType: "uint32",
          name: "position",
          type: "uint32",
        },
      ],
      name: "incrementXPositionInFactor3",
      outputs: [
        {
          internalType: "uint32",
          name: "_final",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
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
      name: "mountEntryID",
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
          name: "cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currentID",
          type: "uint256",
        },
      ],
      name: "mountEntryValue",
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
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "pauseEntryMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
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
      name: "pausedEntryMint",
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
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "payEntryFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contractAddress",
          type: "address",
        },
        {
          internalType: "bool",
          name: "_allowed",
          type: "bool",
        },
      ],
      name: "setAllowedContracts",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newCEO",
          type: "address",
        },
      ],
      name: "setCEO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newCFO",
          type: "address",
        },
      ],
      name: "setCFO",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newPrice",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_tokenURI",
          type: "string",
        },
      ],
      name: "setEntryPrice",
      outputs: [],
      stateMutability: "nonpayable",
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
          internalType: "uint24",
          name: "value",
          type: "uint24",
        },
      ],
      name: "unmountEntryValue",
      outputs: [
        {
          internalType: "uint256",
          name: "cap",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currentID",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unpauseEntryMint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenID",
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
          name: "_user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_currentUserLevel",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_userPuzzlePiecesForUserCurrentLevel",
          type: "uint256",
        },
      ],
      name: "userAllowedToClaimPiece",
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
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "withdrawTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

function noDecimals(value) {
  return value / 10 ** 6;
}

const Puzzle: FC<PuzzleProps> = ({
  className,
  isConnected,
  userAddress,
  puzzlePieces,
  dbLevels,
}) => {
  const [userCanClaimPiece, setUserCanClaimPiece] = useState(false);
  const [userCanClaimLevel, setUserCanClaimLevel] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const NFTs: number[][] = [
    Array.from({ length: 10 }, (_, k) => k),
    Array(10).fill(0),
  ];

  const SlCoreContract = {
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
  };

  const SlFactoryContract = {
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryABI,
  };

  const SlLogicsContract = {
    address: process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as Address,
    abi: SLLogicsABI,
  };

  const { userPuzzlePieces, userPieces } = useGetUserPuzzlePieces({
    userAddress,
    level: currentLevel,
    watch: true,
  });

  // const { isSuccess: userAllowedLevel, error: errorUserLevel } =
  //   useContractRead({
  //     address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //     abi: SLCoreABI,
  //     functionName: "_userAllowedToBurnPuzzle",
  //     args: [userAddress, 30],
  //     // onSettled(data, error) {
  //     //   if (!error) {
  //     //     setUserCanClaimLevel(true);
  //     //   }
  //     // },
  //   });

  let { data } = useContractReads({
    contracts: [
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 1],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 2],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 3],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 1],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 2],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 3],
      },
      {
        ...SlCoreContract,
        functionName: "whichLevelUserHas",
        chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
        args: [userAddress],
      },
      // {
      //   ...SlLogicsContract,
      //   functionName: "_userAllowedToClaimPiece",
      //   chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
      //   args: [userAddress, 1, 1, 0],
      // },
    ],
    watch: true,
    onError(error) {
      console.log("Error", error);
    },
  });

  data = data ?? [];

  const { data: dataUserAllowed, error: errorUserAllowed } = useContractRead({
    ...SlLogicsContract,
    functionName: "userAllowedToClaimPiece",
    args: [userAddress, currentLevel, data[6], data[currentLevel - 1]], // TODO: level , numberofpieces
    watch: true,
    enabled: !!data,
    onSettled(data, error) {
      // console.log(
      //   "debug",
      //   data[6],
      //   data[currentLevel - 1],
      //   currentLevel,
      //   error
      // );

      if (!error) {
        // data[6] == currentLevel
        setUserCanClaimPiece(true);
      } else {
        setUserCanClaimPiece(false);
      }
    },
  });

  const { config: configClaimPiece } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "claimPiece",
    enabled: userCanClaimPiece,
    // onError(err) {
    //   toast.error(err.message);
    // },
    // onSuccess() {
    //   toast.success("Puzzle reivindicado com sucesso!");
    // },
  });

  const { write: claimPiece, isLoading: isLoadingClaimPiece } =
    useContractWrite(configClaimPiece);

  const { config: configClaimLevel } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "claimLevel",
    enabled: Number(data[currentLevel - 1]) > 9 && data[6] == currentLevel,
  });

  const { write: claimLevel, isLoading: isLoadingClaimLevel } =
    useContractWrite(configClaimLevel);
  // console.log("invested>>>", BigNumber.from(data[3]).toNumber());
  // console.log("userHas>>>", data[6]?.toNumber());
  // console.log("userCanClaimPiece>>", userCanClaimPiece);
  // console.log("configClaimLevel>>", configClaimLevel);

  // console.log("dataUserAllowed", dataUserAllowed);
  console.log("userPieces>>>", data[currentLevel - 1]);

  const levels = dbLevels.map((dbLevel, idx) => ({
    title: dbLevel.basicLevel.title,
    locked: (data[6] as number) < idx + 1,
    profitRange: dbLevel.profitRange,
    description: dbLevel.description,
    progress: (userPieces.length / 10) * 100,
    invested: noDecimals(Number(data[3 + idx])),
    collected: userPieces.length.toString(),
  }));

  const locallevels = [
    {
      title: "Level 1",
      locked: (data[6] as number) < 1,
      profitRange: "12-15",
      description:
        "Don't be afraid to invest with lower margins, here the most important margin is the profit margin that naturally accompanies the investment ratio.",

      progress: (Number(data[0]) / 10) * 100,
      invested: noDecimals(Number(data[3])),
      collected: userPieces.length.toString(),
    },
    {
      title: "Level 2",
      locked: (data[6] as number) < 2,
      profitRange: "15-18",
      description:
        "The path is made by walking and you are one step closer to having the intended return! Level 2 of the puzzle takes you to an investment level never before explored with a tailor-made financial return!",
      progress: (Number(data[1]) / 10) * 100,
      invested: noDecimals(Number(data[4])),
      collected: userPieces.length.toString(),
    },
    {
      title: "Level 3",
      locked: (data[6] as number) < 3,
      profitRange: "18-20",
      description:
        "There is no going back, you are at the highest point of your investment with the highest profit margins. Nothing ventured, nothing gained, and if risk is your middle name, you're on the right track!",
      progress: (Number(data[2]) / 10) * 100,
      invested: noDecimals(Number(data[5])),
      collected: userPieces.length.toString(),
    },
  ];

  const [profitNotification, setProfitNotification] = useState(true);

  return (
    <section
      id="puzzle"
      className={cn("w-full mx-auto max-w-[1338px] flex flex-col", className)}
    >
      <h2 className="text-2xl font-medium uppercase pb-12 ml-[58px]">
        My Puzzle
      </h2>
      <Tab.Group
        onChange={(index) => {
          setCurrentLevel(index + 1);
        }}
      >
        <Tab.List className="flex ml-[58px] w-full border-b border-b-gray-900/20">
          {levels.map((level) => (
            <Tab
              key={level.title}
              className={({ selected }) =>
                classNames(
                  "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal leading-5 ",
                  "focus:outline-none",
                  selected
                    ? "bg-white text-primaryGreen border-b-4 font-semibold border-primaryGreen"
                    : " hover:bg-white/[0.12] hover:text-tabInactive/80 text-tabInactive"
                )
              }
            >
              {(level.locked || !isConnected) && (
                <Image
                  alt="Locked"
                  src="/icons/locked.svg"
                  width={20}
                  height={20}
                />
              )}
              {level.title}{" "}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=" max-w-screen-2xl flex w-full">
          {levels.map((level, idx) => {
            return (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl pt-8 pb-[132px] w-full",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                )}
              >
                <div className="flex flex-col gap-8">
                  {isConnected && (
                    <div className="flex flex-col gap-8 ml-[58px] mr-[256px]">
                      {profitNotification && (
                        <div className="flex relative w-full justify-end items-start flex-col bg-puzzleProfitNotice p-8 rounded-md">
                          <div className=" absolute flex items top-4 right-4">
                            <Image
                              onClick={() => setProfitNotification(false)}
                              src="/icons/close.svg"
                              width={18}
                              height={18}
                              alt="Close"
                              className=" cursor-pointer"
                            />
                          </div>
                          <h3 className="uppercase ml-[124px]tracking-wider text-2xl pb-4">
                            You have{" "}
                            <span className="text-primaryGold">
                              {level.profitRange.split("-")[0]}% to{" "}
                              {level.profitRange.split("-")[1]}% profit
                            </span>
                          </h3>

                          <p className="font-light pb-4 max-w-xl">
                            {level.description}
                          </p>
                          {idx < 2 && (
                            <span className="uppercase text-xs font-medium">
                              Next level:{" "}
                              {levels.at(idx + 1).profitRange.split("-")[0]}% to{" "}
                              {levels.at(idx + 1).profitRange.split("-")[1]}%{" "}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-6">
                        <div className="flex gap-3">
                          <p className="text-md">
                            Progress:{" "}
                            <span className="font-medium">
                              {level.progress}%
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <p className="text-md">
                            Invested:{" "}
                            <span className="font-medium">
                              {level.invested}$
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <p className="text-md">
                            Collected:{" "}
                            <span className="font-medium">
                              {level.collected}
                            </span>{" "}
                            | 10
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-6">
                        <div className="bg-progressBackground h-[6px] w-full flex bottom-0 left-0 rounded-md">
                          <div
                            className={` bg-progressHighlight rounded-md`}
                            style={{ width: `${level.progress}%` }}
                          ></div>
                        </div>
                        <Button
                          onClick={claimPiece}
                          className="px-12 whitespace-nowrap"
                          variant="outline"
                          disabled={!userCanClaimPiece}
                        >
                          {isLoadingClaimPiece ? "Loading..." : `Claim Piece`}
                        </Button>
                        {idx < 2 && (
                          <Button
                            onClick={claimLevel}
                            className="px-12 whitespace-nowrap"
                            variant="outline"
                            disabled={
                              Number(data[0]) < 10 ||
                              (data[6] as number) > idx + 1
                            }
                          >
                            Claim Level {idx + 2}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {!level.locked && (
                    <Carousel
                      className="pt-5"
                      id={idx.toString()}
                      isConnected={isConnected}
                      userItems={userPuzzlePieces}
                      items={puzzlePieces}
                      // items={investmentData.filter(
                      //   (i) => i.status == investmentStatus
                      // )}
                    />
                  )}
                </div>
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
};

export default Puzzle;
