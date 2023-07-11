import { Tab } from "@headlessui/react";
import type { NextPage } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useContract,
  useContractRead,
  useSigner,
  type Address,
} from "wagmi";
import NftCheckedIcon from "../components/NftCheckedIcon";
import useNFTChecker from "../hooks/useNFTChecker";
import { cn } from "../lib/utils";
import { SLCoreABI } from "~/utils/abis";


const MyPuzzle: NextPage = () => {
  const { data: signerData } = useSigner();

  const { address, isDisconnected } = useAccount();
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

  const { hasNFT: hasLevel2NFT, error } = useNFTChecker({
    contractAddress: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    walletAddress: address,
    nftId: 11,
  });

  const puzzleContract = useContract({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS,
    abi: SLCoreABI,
    signerOrProvider: signerData,
  });

  const { data: userBalancePuzzle } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "balanceOfBatch",
    args: [userArray, tokenCollectionIds],
    watch: true,
  });

  // const { config: burnCallConfig } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //   abi: PuzzleAbi,
  //   functionName: "burn",
  //   enabled: !hasLevel2NFT,
  //   onError(err) {
  //     toast.error(err.message);
  //   },
  //   onSettled(data, error) {
  //     console.log(data, error);
  //   },
  // });
  // const { write: burn } = useContractWrite(burnCallConfig);

  const { data: userBalanceLevel2 } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "balanceOf",
    args: [address, 11],
    watch: true,
  });

  // console.log(userBalancePuzzle);
  const [assets] = useState({
    "Level 1": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,

        nft: userBalancePuzzle?.[0],
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
        // nft: true,
        nft: userBalancePuzzle?.[1],
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,

        nft: userBalancePuzzle?.[2],
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[3],
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[4],
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[5],
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[6],
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[7],
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[8],
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle?.[9],
      },
    ],
    "Level 2": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
      },
    ],
  });

  function countDifferents() {
    let total = 0;
    for (let i = 0; i < 10; i++) {
      if (userBalancePuzzle) userBalancePuzzle[i] != 0 ? total++ : total;
    }
    return total;
  }

  async function handleClick(e) {
    e.preventDefault();
    try {
      const results = await puzzleContract.connect(signerData).burn();
      await results.wait();
      toast.success("NFT Level 2 Claimed!");
    } catch (error) {
      if (error.message) {
        if (error.message.indexOf("Nonce too high.") > -1) {
          toast.error("Nonce too high. Check your wallet.");
        } else {
          toast.error(error.message);
        }
      }
    }
  }

  // useEffect(() => {
  //   if (!userBalancePuzzle) return;
  //   // console.log(userBalancePuzzle);
  // }, [userBalancePuzzle]);

  return (
    <div className="w-full px-6 lg:px-3">
      <h2 className="py-6 text-2xl">My Puzzle</h2>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {Object.keys(assets).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                cn(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {Object.values(assets).map((nfts, idx) => (
            <Tab.Panel
              key={idx}
              className={cn(
                "flex flex-col rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className="grid grid-cols-5 gap-2 pb-3">
                {nfts.map((nft) => (
                  <li
                    key={nft.id}
                    className="relative flex min-h-[100px] flex-col justify-between rounded-md border p-3 hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {nft.title}
                    </h3>

                    <div className="mt-1 flex space-x-1 self-end text-xs font-normal leading-4 text-gray-500">
                      <NftCheckedIcon numberOfItems={nft.nft} />
                    </div>
                  </li>
                ))}
              </ul>
              {idx == 0 && (
                <button
                  className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
                  onClick={handleClick}
                  disabled={countDifferents() < 10}
                >
                  Claim NFT Level 2 ({countDifferents().toString()}/10)
                </button>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MyPuzzle;
