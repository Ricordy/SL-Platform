import React from "react";
import Link from "next/link";

const Puzzle = () => {
  return (
    <section id="puzzle">
      <h2 className="text-2xl pb-6">Puzzle</h2>
      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md md:w-1/3">
          <Link href="/my-puzzle">View My Puzzle</Link>
        </div>
        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md md:w-1/3">
          <Link href="/profile">Claim NFT Puzzle</Link>
        </div>

        <div className="flex flex-col items-center  justify-center bg-gray-200 p-6 rounded-md md:w-1/3">
          <a onClick={()=> window.open("https://testnets.opensea.io/collection/unidentified-contract-slm5tudv7n", "_blank")}>
            <div className="">Buy on OpenSea </div>
          </a>
          <div className="text-xs">Available Soon</div>
        </div>
      </div>
    </section>
  );
};

export default Puzzle;
