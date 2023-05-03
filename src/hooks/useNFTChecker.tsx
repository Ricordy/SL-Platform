import { Address, useContractRead } from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { useEffect, useState } from "react";

interface HookProps {
  contractAddress: Address;
  walletAddress: Address;
  nftId: number;
  watch?: boolean;
}
const useNFTChecker = ({
  contractAddress,
  walletAddress,
  nftId,
  watch = false,
}: HookProps) => {
  const { data, error, isLoading } = useContractRead({
    address: contractAddress,
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
    functionName: "whichLevelUserHas",
    args: [walletAddress],
    watch,
  });

  const [hasNFT, setHasNFT] = useState(false);

  useEffect(() => {
    if (data) {
      setHasNFT((data as number) > 0);
    }
  }, [data]);
  return { hasNFT, error, isLoading };
};

export default useNFTChecker;
