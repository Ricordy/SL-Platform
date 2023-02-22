import { Address, useContractRead } from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { useEffect, useState } from "react";

interface HookProps {
  contractAddress: Address;
  walletAddress: Address;
  nftId: number;
}
const useNFTChecker = ({
  contractAddress,
  walletAddress,
  nftId,
}: HookProps) => {
  const { data, error } = useContractRead({
    address: contractAddress,
    abi: PuzzleAbi,
    functionName: "balanceOf",
    args: [walletAddress, nftId],
  });

  const [hasNFT, setHasNFT] = useState(false);

  useEffect(() => {
    if (data) {
      setHasNFT((data as number) > 0);
    }
  }, [data]);
  return { hasNFT, error };
};

export default useNFTChecker;
