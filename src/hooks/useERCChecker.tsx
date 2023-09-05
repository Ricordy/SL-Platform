import { Address, useContractRead } from "wagmi";
import { PuzzleAbi } from "../data/ABIs";
import { useEffect, useState } from "react";

interface HookProps {
  contractAddress: Address;
  walletAddress: Address;
  watch?: boolean;
}
const useERCChecker = ({
  contractAddress,
  walletAddress,
  watch = false,
}: HookProps) => {
  const { data, error } = useContractRead({
    address: contractAddress,
    abi: PuzzleAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    watch,
  });

  const [hasERC, setHasERC] = useState(false);

  useEffect(() => {
    if (data) {
      setHasERC((data as number) > 0);
    }
  }, [data]);
  return { hasERC, error };
};

export default useERCChecker;
