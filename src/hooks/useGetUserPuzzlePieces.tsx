import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, type Address } from "wagmi";
import { SLCoreABI } from "~/utils/abis";

interface HookProps {
  userAddress: Address;
  level: number;
  watch?: boolean;
}
const useGetUserPuzzlePieces = ({
  userAddress,
  level,
  watch = false,
}: HookProps) => {
  const getPuzzleCollectionIds = (level: number) => {
    let increment = 0;
    if (level == 2) {
      increment += 10;
    } else if (level == 3) {
      increment += 20;
    }
    return Array.from({ length: 10 }, (_, k) => BigNumber.from(k + increment));
  };

  const {
    data: userPuzzlePieces,
    error,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "balanceOfBatch",
    args: [Array(10).fill(userAddress), getPuzzleCollectionIds(level)],
    watch,
  });

  const [userPieces, setUserPieces] = useState<BigNumber[]>([]);
  const [userTotalPieces, setUserTotalPieces] = useState(0);

  useEffect(() => {
    if (!userPuzzlePieces) return;

    // console.log("userPuzzlePieces>>", userPuzzlePieces);

    //   console.log("allpieces", puzzlePieces);
    //   puzzlePieces.map((piece) => console.log(piece.toNumber()));

    setUserPieces(userPuzzlePieces.filter((piece) => piece.gt(0)));
    let sum = 0;
    userPieces.map((amount) => (sum += amount.toNumber()));
    setUserTotalPieces(sum);
  }, [userPuzzlePieces]);

  return { userPieces, userPuzzlePieces, userTotalPieces, error, isLoading };
};

export default useGetUserPuzzlePieces;
