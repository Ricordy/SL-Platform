import { useEffect, useState } from "react";
import { useContractRead, type Address } from "wagmi";
import { SLCoreABI } from "~/utils/abis";

interface HookProps {
  contractAddress: Address;
  walletAddress: Address;
  watch?: boolean;
}
const useNFTChecker = ({
  contractAddress,
  walletAddress,
  watch = false,
}: HookProps) => {
  const { data, error, isLoading } = useContractRead({
    address: contractAddress,
    abi: SLCoreABI,
    functionName: "whichLevelUserHas",
    args: [walletAddress],
    watch,
  });

  const [hasNFT, setHasNFT] = useState(false);

  useEffect(() => {
    if (data) {
      setHasNFT((data as number) > 0);
    }
  }, [data]);
  return { hasNFT, error, isLoading };
};

export default useNFTChecker;
