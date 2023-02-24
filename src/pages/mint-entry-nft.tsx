import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { NextPage } from "next";
import useCheckEntryNFT from "../hooks/useCheckEntryNFT";
import router from "next/router";
import Link from "next/link";

const MintEntryNFT: NextPage = () => {
  const { address: walletAddress } = useAccount();
  const { hasEntryNFT } = useCheckEntryNFT({
    address: walletAddress,
    nftId: 10,
  });
  const { config: mintConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: PuzzleAbi,
    functionName: "mintEntry",
    enabled: !hasEntryNFT,
  });
  const { write: mint, isLoading: mintLoading } = useContractWrite(mintConfig);

  const handleClick = () => {
    mint();
  };
  return (
    <main>
      <h2>Mint your NFT</h2>
      {!hasEntryNFT && (
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={handleClick}
        >
          {mintLoading ? "Loading..." : "Buy Now"}
        </button>
      )}
      {hasEntryNFT && <Link href="/#investments">Make an investment</Link>}
    </main>
  );
};

export default MintEntryNFT;
