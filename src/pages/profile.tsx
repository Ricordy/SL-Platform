import type { NextPage } from "next";
import Head from "next/head";
import PuzzleItem from "../components/PuzzleItem";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import InvestmentHistory from "../components/InvestmentHistory";
import { useAccount, useContractRead } from "wagmi";
import { useEffect } from "react";
import {abi as FactoryAbi} from "../artifacts/contracts/Factory.sol/Factory.json"
import {abi as InvestAbi} from "../artifacts/contracts/Investment.sol/Investment.json"
import {abi as PuzzleAbi} from "../artifacts/contracts/Puzzle.sol/Puzzle.json"




  const Profile: NextPage = () => {
    const { address, isDisconnected } = useAccount();
    const tokenCollectionIds = [0,1,2,3,4,5,6,7,8,9]
    const userArray = [address,address,address,address,address,address,address,address,address,address]
  
    const { data: userBalancePuzzle } = useContractRead({
      address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      abi: PuzzleAbi,
      functionName: 'balanceOfBatch',
      args: [userArray,tokenCollectionIds],
      watch: true,
    });
    const { data: userTotalInvestment } = useContractRead({
      address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      abi: FactoryAbi,
      functionName: 'getAddressTotal',
      args: [address],
      watch: true,
    })
    const { data: totInvestment } = useContractRead({
      address: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
      abi: InvestAbi,
      functionName: 'totalInvestment',
      watch: true,
    })

    function howMany(){
      let total = 0
      for(let i = 0; i < 10; i++){
        userBalancePuzzle[i] != 0? total++:total
      }
      return (Number(userTotalInvestment)/total*5000)
    }


  const ProfileDetails = () => {
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
            <a className="flex align-middle gap-2">
              {address} <FiExternalLink />
            </a>
          </Link>
        </div>
        <div className="">
          <div className="flex flex-col">
            <InvestmentHistory totalInvested={Number(userTotalInvestment)} showExpectedReturn={false} totalInvestment={Number(totInvestment)} />
            <div className="font-bold py-6">Puzzle Progress</div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex gap-6">
                <PuzzleItem
                  level={1}
                  amount = "5000"
                  current= {userTotalInvestment.toString()}
                  showProgressInsideBar={true}
                />
               { (<button className="border rounded-md self-end p-2 bg-slate-800 text-slate-50">
                  Claim
                </button>)}
              </div>
              <div className="flex gap-6">
                <PuzzleItem
                  level={2}
                  amount="100"
                  current="10"
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
