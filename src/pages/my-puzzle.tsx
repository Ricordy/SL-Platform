import type { NextPage } from "next";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import {abi as PuzzleAbi} from "../artifacts/contracts/Puzzle.sol/Puzzle.json"
import { count } from "console";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}


const MyPuzzle: NextPage = () => {


  const { address, isDisconnected } = useAccount();
  const tokenCollectionIds = [0,1,2,3,4,5,6,7,8,9]
  const userArray = [address,address,address,address,address,address,address,address,address,address]

  const { data: userBalancePuzzle } = useContractRead({
    address: '0xF0C5cC4C5792DFE7996A363A5539021933559CF1',
    abi: PuzzleAbi,
    functionName: 'balanceOfBatch',
    args: [userArray],
    watch: true,
  });

  const { config: burnCallConfig } = usePrepareContractWrite({
    address: '0xF0C5cC4C5792DFE7996A363A5539021933559CF1',
    abi: PuzzleAbi,
    functionName: 'burn',
  })
  const { write: writeBurn } = useContractWrite(burnCallConfig)

  const { data: userBalanceLevel2 } = useContractRead({
    address: '0xF0C5cC4C5792DFE7996A363A5539021933559CF1',
    abi: PuzzleAbi,
    functionName: 'balanceOf',
    args: [address,11],
    watch: true,
  });

  
  console.log(userBalancePuzzle);
  

  const [categories] = useState({
    "Level 1": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,
        nft: (userBalancePuzzle[0] == 1? true: false) ||  false,
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[1] == 1? true: false,
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[2] == 1? true: false,
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[3] == 1? true: false,
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[4] == 1? true: false,
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[5] == 1? true: false,
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
        nft: (userBalancePuzzle[6] == 1? true: false)? null: 0,
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[7] == 1? true: false,
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[8] == 1? true: false,
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
        nft: userBalancePuzzle[9] == 1? true: false,
      },
    ],
    "Level 2": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,
        nft: false,
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
    ],
  });

  function countDifferents() {
    let total = 0
    for(let i = 0; i < 10; i++){
      if(userBalancePuzzle[i] != null)
        (userBalancePuzzle[i] != 0? total++:total) || 0
    }
    console.log(total);
    
    return total
  }


  




  function handleClick(e) {
    e.preventDefault()
    writeBurn()
    
  }

  return (
    <div className="w-full px-6 lg:px-3">
      <h2 className="text-2xl py-6">My Puzzle</h2>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
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
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "flex flex-col rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className="grid grid-cols-5 gap-2">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative flex flex-col justify-between rounded-md p-3 border min-h-[100px] hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>

                    <div className="mt-1 flex self-end space-x-1 text-xs font-normal leading-4 text-gray-500">
                      {post.nft && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {idx == 0 && (
                <button className="border mt-6 self-center rounded-md p-2" onClick={handleClick}>
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
