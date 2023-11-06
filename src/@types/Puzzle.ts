import { type Address } from "wagmi";

export interface PuzzleProps {
  className?: string;
  isConnected: boolean;
  userAddress: Address;
  puzzlePieces?: {
    tokenid: number;
    title: string;
    image: {
      url: string;
    };
    imageCollected: {
      url: string;
    };
  }[];
  dbLevels?: {
    title: string;
    bg: {
      url: string;
    };
    nft: {
      url: string;
    };
    description: string;
    profitRange: string;
  }[];
}
