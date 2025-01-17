import { type Address } from "wagmi";
import useNFTChecker from "../hooks/useNFTChecker";

const useCheckEntryNFT = ({
  address,
  watch,
}: {
  address: Address;
  watch?: boolean;
}) => {
  const {
    hasNFT: hasEntryNFT,
    error: hasEntryNFTError,
    isLoading: hasEntryNFTLoading,
  } = useNFTChecker({
    contractAddress: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    walletAddress: address,
    watch,
  });

  return { hasEntryNFT, hasEntryNFTError, hasEntryNFTLoading };
};

export default useCheckEntryNFT;
