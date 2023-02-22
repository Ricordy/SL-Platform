import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { NextPage } from "next";

const MintEntryNFT: NextPage = () => {
  const { address: walletAddress } = useAccount();
  const { config: mintConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: PuzzleAbi,
    functionName: "mintEntry",
  });
  const { write: mint, isLoading: mintLoading } = useContractWrite(mintConfig);

  const handleClick = () => {
    mint();
  };
  return (
    <main>
      <h2>Mint your NFT</h2>
      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
        onClick={handleClick}
      >
        Buy Now
      </button>
    </main>
  );
};

export default MintEntryNFT;
