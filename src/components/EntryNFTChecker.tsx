import { Address } from "wagmi";
import useNFTChecker from "../hooks/useNFTChecker";

const EntryNFTChecker = ({
  address,
  nftId,
}: {
  address: Address;
  nftId: number;
}) => {
  const { hasNFT } = useNFTChecker({
    contractAddress: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    walletAddress: address,
    nftId,
  });

  return (
    <>
      <p>{hasNFT ? "Well done!" : "You should buy one!"}</p>
    </>
  );
};

export default EntryNFTChecker;
