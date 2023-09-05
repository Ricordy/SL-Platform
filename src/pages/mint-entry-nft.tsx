import {
  Address,
  useAccount,
  useSigner,
  useContract,
  erc20ABI,
  useBalance,
} from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { NextPage } from "next";
import useCheckEntryNFT from "../hooks/useCheckEntryNFT";
import { utils } from "ethers";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SLCoreABI } from "../utils/abis";

const MintEntryNFT: NextPage = () => {
  const { address: walletAddress } = useAccount();
  const { data: signerData } = useSigner();
  const entryNFTPrice = utils.parseUnits("100", 6);
  const { data: userPaymentTokenBalance } = useBalance({
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    address: walletAddress,
    watch: true,
  });
  const { hasEntryNFT } = useCheckEntryNFT({
    address: walletAddress as Address,
  });
  // const { config: mintConfig } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //   abi: PuzzleAbi,
  //   functionName: "mintEntry",
  //   enabled: !hasEntryNFT,
  // });
  // const {
  //   write: mint,
  //   isLoading: mintLoading,
  //   data: mintData,
  // } = useContractWrite(mintConfig);

  const puzzleContract = useContract({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS,
    abi: SLCoreABI,
    signerOrProvider: signerData,
  });

  const paymentTokenContract = useContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
    abi: erc20ABI,
    signerOrProvider: signerData,
  });

  const [userMinted, setUserMinted] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState(false);

  const handleClick = async () => {
    try {
      if (
        userPaymentTokenBalance &&
        userPaymentTokenBalance.value < entryNFTPrice
      ) {
        toast.error("You don't have enough balance!");
        return;
      }
      if (paymentTokenContract && puzzleContract) {
        setIsMinting(true);
        const tx1 = await paymentTokenContract.approve(
          process.env.NEXT_PUBLIC_LOGICS_ADDRESS as Address,
          entryNFTPrice
        );

        await toast.promise(tx1.wait(), {
          loading: "Approving...",
          success: "Approved ",
          error: "Error approving",
        });



        const tx = await puzzleContract.mintEntry();

        toast.promise(tx.wait(), {
          loading: "Minting",
          success: "Minted!",
          error: "Error minting your NFT",
        });

        await tx.wait();
        setUserMinted(true);
        setIsMinting(false);
      }
    } catch (error) {
      setIsMinting(false);
      if (typeof error === "object" && error !== null) {
        const parsedError = JSON.parse(JSON.stringify(error));

        toast.error(parsedError.message);
      } else {

      }
    }
  };

  useEffect(() => {
    if (hasEntryNFT && hasEntryNFT === true) {
      setUserMinted(hasEntryNFT);
    }
  }, [userMinted, hasEntryNFT]);

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <h2 className="pb-6 text-3xl">Mint your NFT</h2>

      {!userMinted && (
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={handleClick}
        >
          {isMinting ? "Minting..." : "Mint Now"}
        </button>
      )}
      {userMinted && (
        <Link href="/#investments" passHref>
          <a className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2">
            Make an investment
          </a>
        </Link>
      )}
    </main>
  );
};

export default MintEntryNFT;
