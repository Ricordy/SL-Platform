import type { NextPage } from "next";
import Head from "next/head";
import PuzzleItem from "../components/PuzzleItem";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const Profile: NextPage = () => {
  const ProfileDetails = () => {
    return (
      <div className="">
        <div className="">
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
              0x0c7...1Be <FiExternalLink />
            </a>
          </Link>
        </div>
        <div className="w-3/4">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="font-bold">Total Invested</div>
              <div className="">$ 5000.00</div>
            </div>
            <div className="flex flex-col ">
              <div className="font-bold pt-6">Puzzle Progress</div>
              <div className="flex gap-6">
                <PuzzleItem
                  level={1}
                  amount="$ 5000 / $ 5000"
                  progress="100"
                  showProgressInsideBar={true}
                />
                <button className="border rounded-md self-end p-2 bg-slate-800 text-slate-50">
                  Claim
                </button>
              </div>
            </div>
            <div className="flex gap-6">
              <PuzzleItem
                level={2}
                amount="N/A"
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
    );
  };

  return (
    <>
      <Head>
        <title>Something Legendary | Profile</title>
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl p-4">
        <ProfileDetails />
      </main>
    </>
  );
};

export default Profile;
