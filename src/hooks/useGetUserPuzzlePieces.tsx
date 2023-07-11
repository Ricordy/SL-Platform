import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, type Address } from "wagmi";
import { SLCoreABI } from "~/utils/abis";

interface HookProps {
  userAddress: Address;
  level: number;
  watch?: boolean;
  totalInvested: BigNumber;
}
const useGetUserPuzzlePieces = ({
  userAddress,
  level,
  watch = false,
  totalInvested,
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
  const [claimPieceProgress, setClaimPieceProgress] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [claimPieceProgressValue, setClaimPieceProgressValue] = useState(0);
  useEffect(() => {
    if (!userPuzzlePieces) return;

    setUserPieces(userPuzzlePieces.filter((piece) => piece.gt(0)));
  }, [userPuzzlePieces]);

  useEffect(() => {
    const sum = userPieces.reduce(
      (x, y) => BigNumber.from(x).add(y),
      BigNumber.from(0)
    );
    setUserTotalPieces(sum.toNumber());
  }, [userPieces]);

  useEffect(() => {
    const claimPieceProgressValue = totalInvested
      .div(10 ** 6)
      .sub(userTotalPieces * 5000);
    console.log(claimPieceProgressValue.toNumber());

    const claimPieceProgress = claimPieceProgressValue.div(5000).mul(100);
    console.log(claimPieceProgress.toNumber());
    /* {((noDecimals(Number(data?.[3])) - userTotalPieces * 5000) /
                    5000) *
                    100} */
    setClaimPieceProgress(claimPieceProgress);
    setClaimPieceProgressValue(claimPieceProgressValue.toNumber());
  }, [userTotalPieces]);

  return {
    userPieces,
    userPuzzlePieces,
    userTotalPieces,
    claimPieceProgress,
    claimPieceProgressValue,
    error,
    isLoading,
  };
};

export default useGetUserPuzzlePieces;
