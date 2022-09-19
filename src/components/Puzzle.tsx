import React from "react";
import Link from "next/link";

const Puzzle = () => {
  return (
    <section id="puzzle">
      <h2 className="text-2xl pb-6">Puzzle</h2>
      <div className="flex gap-6 justify-between">
        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md w-1/3">
          <Link href="/my-puzzle">View My Puzzle</Link>
        </div>
        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md w-1/3">
          <Link href="/profile">Claim NFT Puzzle</Link>
        </div>

        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md w-1/3">
          <div className="">Buy on Open Sea</div>
          <div className="text-xs">Available Soon</div>
        </div>
      </div>
    </section>
  );
};

export default Puzzle;
