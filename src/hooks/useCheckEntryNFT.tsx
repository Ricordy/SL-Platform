import { Address } from "wagmi";
import useNFTChecker from "../hooks/useNFTChecker";

const useCheckEntryNFT = ({
  address,
  nftId,
  watch,
}: {
  address: Address;
  nftId: number;
  watch?: boolean;
}) => {
  const { hasNFT: hasEntryNFT, error: hasEntryNFTError } = useNFTChecker({
    contractAddress: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    walletAddress: address,
    nftId,
    watch,
  });

  return { hasEntryNFT, hasEntryNFTError };
};

export default useCheckEntryNFT;
