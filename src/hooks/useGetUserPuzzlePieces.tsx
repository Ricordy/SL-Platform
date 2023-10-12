import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, type Address } from "wagmi";
import { getPuzzleCollectionIds } from "~/lib/utils";
import { useBlockchainInfo } from "~/lib/zustand";
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
  if (level && level > 3) {
    return {
      error: new Error("Invalid level"),
    };
  }
  const claimPieceThreshold = [5000, 10000, 15000];
  const userUniquePiecesPerLevel = useBlockchainInfo(
    (state) => state.userUniquePiecesPerLevel
  );
  let userPuzzlePieces = useBlockchainInfo((state) => state.userPuzzlePieces);



  const [userPieces, setUserPieces] = useState<BigNumber[]>([]);
  const [userTotalPieces, setUserTotalPieces] = useState(0);
  const [claimPieceProgress, setClaimPieceProgress] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [claimPieceProgressValue, setClaimPieceProgressValue] =
    useState<BigNumber>(BigNumber.from(0));

  userPuzzlePieces = useBlockchainInfo(
    (state) => state.userPuzzlePieces
  )?.slice((level - 1) * 10, level * 10);
  useEffect(() => {

    setUserPieces(userPuzzlePieces?.filter((piece) => piece.gt(0)));
  }, [userUniquePiecesPerLevel, level]);

  useEffect(() => {
    const sum = userPieces?.reduce(
      (x, y) => BigNumber.from(x).add(y),
      BigNumber.from(0)
    );
    setUserTotalPieces(sum?.toNumber());
  }, [userPieces]);

  useEffect(() => {
    const claimPieceProgressValue = totalInvested?.sub(
      userUniquePiecesPerLevel[level - 1] *
        ((claimPieceThreshold[level - 1] || 5000) * 10 ** 6)
    );

    const claimPieceProgress = claimPieceProgressValue
      ?.div(claimPieceThreshold[level - 1] || 5000)
      .mul(100)
      .div(10 ** 6);

    setClaimPieceProgress(claimPieceProgress);
    setClaimPieceProgressValue(claimPieceProgressValue);
  }, [userUniquePiecesPerLevel, level]);

  return {
    userPieces,
    userPuzzlePieces,
    userTotalPieces,
    claimPieceProgress,
    claimPieceProgressValue,
  };
};

export default useGetUserPuzzlePieces;
