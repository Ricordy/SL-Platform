import { Address } from "wagmi";
import useNFTChecker from "../hooks/useNFTChecker";

const useCheckEntryNFT = ({
  address,
  nftId,
}: {
  address: Address;
  nftId: number;
}) => {
  const { hasNFT: hasEntryNFT, error: hasEntryNFTError } = useNFTChecker({
    contractAddress: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    walletAddress: address,
    nftId,
  });

  return { hasEntryNFT, hasEntryNFTError };
};

export default useCheckEntryNFT;
