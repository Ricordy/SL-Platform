import { create } from "zustand";
import { GraphQLClient, gql } from "graphql-request";
import { Address, useContractRead } from "wagmi";
import {
  FactoryABI,
  SLCoreABI,
  SLLogicsABI,
  investmentABI,
  paymentTokenABI,
} from "~/utils/abis";
import { BigNumber, ethers } from "ethers";
import { getPuzzleCollectionIds } from "./utils";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_JSONRPC_URL
);

export const useInvestments = create((set) => {
  return {
    investments: undefined,
    userInvestments: undefined,
    sliderInvestments: undefined,
    fetch: async () => {
      try {
        const response = await fetch("/api/investments", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ investments: res.investments });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    fetchUserInvestments: async () => {
      try {
        const response = await fetch("/api/userInvestments", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ userInvestments: res.userInvestments });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    fetchSlider: async () => {
      try {
        const response = await fetch("/api/slider", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ sliderInvestments: res.sliderInvestments });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  };
});

export const usePosts = create((set) => {
  return {
    posts: undefined,
    // addInvestments: (investments: any) =>
    //   set((state: any) => ({ investments: investments })),
    fetch: async () => {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ posts: res.posts });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  };
});

export const useGameContent = create((set) => {
  return {
    levels: undefined,
    pieces: undefined,
    fetchLevels: async () => {
      try {
        const response = await fetch("/api/levels", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ levels: res.levels });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    fetchPieces: async () => {
      try {
        const response = await fetch("/api/pieces", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ pieces: res.pieces });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  };
});

export const useUserTransactions = create((set) => {
  return {
    userTransactions: undefined,
    // addInvestments: (investments: any) =>
    //   set((state: any) => ({ investments: investments })),
    fetch: async () => {
      try {
        const response = await fetch("/api/userTransactions", {
          method: "POST",
        });

        if (response.ok) {
          const res = await response.json();
          set({ userTransactions: res.userTransactions });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  };
});

export const useContractInfo = create((set) => {
  return {
    contractAddress: undefined,
    currentInvestmentInfo: undefined,
    contractTransactions: undefined,
    setAddress: (address: string) => {
      set({
        contractAddress: address,
      });
    },
    fetchCurrentInvestmentInfo: async (address: string) => {
      try {
        const response = await fetch("/api/investmentInfoFromAddress", {
          method: "POST",
          body: JSON.stringify({
            contractAddress: address,
          }),
        });

        if (response.ok) {
          const res = await response.json();
          set({ currentInvestmentInfo: res.currentInvestment });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
    fetchTransactions: async (address: string) => {
      try {
        const response = await fetch("/api/contractTransactions", {
          method: "POST",
          body: JSON.stringify({
            contractAddress: address,
          }),
        });

        if (response.ok) {
          const res = await response.json();
          set({ contractTransactions: res.currentTransactions });
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    },
  };
});

export const useBlockchainInfo = create((set) => {
  return {
    //Investment detail info
    totalSupply: undefined,
    userTotalInvestment: undefined,
    maxToInvest: undefined,
    paymentTokenBalance: undefined,
    contractLevel: undefined,
    userLevel: undefined,
    minToInvest: undefined,
    contractStatus: undefined,
    //Levels and pieces info
    userTotalInvestedPerLevel: undefined,
    userUniquePiecesPerLevel: undefined,
    userAllowedToClaimPiece: undefined,
    userPuzzlePieces: undefined,
    fetchDynamicInfo: async (contractAddress: string, userAddress: string) => {
      if (
        contractAddress !== undefined &&
        contractAddress !== null &&
        contractAddress !== ""
      ) {
        try {
          const investmentContract = new ethers.Contract(
            contractAddress,
            investmentABI,
            provider
          );

          const paymentTokenContract = new ethers.Contract(
            process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
            paymentTokenABI,
            provider
          );

          const totalInvested = await investmentContract.totalSupply();
          const userTotalInvestment = await investmentContract.balanceOf(
            userAddress
          );
          const paymentTokenBalance = await paymentTokenContract.balanceOf(
            userAddress
          );

          set({
            totalSupply: totalInvested,
            userTotalInvestment: userTotalInvestment,
            paymentTokenBalance: paymentTokenBalance,
          });

          return null;
        } catch (err) {
          console.log(err);

          return null;
        }
      }
    },
    fetchStaticInfo: async (userAddress: string, contractAddress?: string) => {
      try {
        const slCoreContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
          SLCoreABI,
          provider
        );

        if (contractAddress) {
          const investmentContract = new ethers.Contract(
            contractAddress,
            investmentABI,
            provider
          );
          const maxToInvest = await investmentContract.getMaxToInvest(),
            minToInvest = await investmentContract.MINIMUM_INVESTMENT(),
            contractLevel = await investmentContract.CONTRACT_LEVEL(),
            userLevel = await slCoreContract.whichLevelUserHas(userAddress);

          set({
            maxToInvest: maxToInvest.div(10 ** 6).toNumber(),
            minToInvest: minToInvest.toNumber(),
            contractLevel: contractLevel,
            userLevel: userLevel,
          });
        }

        const userLevel = await slCoreContract.whichLevelUserHas(userAddress);
        set({
          userLevel: userLevel,
        });
      } catch (err) {
        return null;
      }
    },
    fetchContractStatus: async (contractAddress: string) => {
      try {
        const investmentContract = new ethers.Contract(
          contractAddress,
          investmentABI,
          provider
        );

        const contractStatus = await investmentContract.status();

        set({
          contractStatus: contractStatus,
        });
      } catch (err) {
        return null;
      }
    },
    fetchPuzzleInfo: async (userAddress: string, userLevel: number) => {
      let puzzlePieces = [];
      let totalInvestment = [];
      const slCoreContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
        SLCoreABI,
        provider
      );

      const factoryContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
        FactoryABI,
        provider
      );

      const logicsContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as Address,
        SLLogicsABI,
        provider
      );

      try {
        const puzzlePieceslvl1 =
          await slCoreContract.getUserPuzzlePiecesForUserCurrentLevel(
            userAddress,
            1
          );
        puzzlePieces.push(puzzlePieceslvl1);
        const puzzlePieceslvl2 =
          await slCoreContract.getUserPuzzlePiecesForUserCurrentLevel(
            userAddress,
            2
          );
        puzzlePieces.push(puzzlePieceslvl2);
        const puzzlePieceslvl3 =
          await slCoreContract.getUserPuzzlePiecesForUserCurrentLevel(
            userAddress,
            3
          );
        puzzlePieces.push(puzzlePieceslvl3);

        const userTotalInvestment1 =
          await factoryContract.getAddressTotalInLevel(userAddress, 1);

        totalInvestment.push(userTotalInvestment1);

        const userTotalInvestment2 =
          await factoryContract.getAddressTotalInLevel(userAddress, 2);
        totalInvestment.push(userTotalInvestment2);
        const userTotalInvestment3 =
          await factoryContract.getAddressTotalInLevel(userAddress, 3);
        totalInvestment.push(userTotalInvestment3);
        totalInvestment.push(
          userTotalInvestment1.toNumber() +
            userTotalInvestment2.toNumber() +
            userTotalInvestment3.toNumber()
        );

        const userPuzzlePiecesForLevel = await slCoreContract.balanceOfBatch(
          Array(30).fill(userAddress),
          Array.from({ length: 30 }, (_, k) => BigNumber.from(k))
        );

        set({
          userTotalInvestedPerLevel: totalInvestment,
          userUniquePiecesPerLevel: puzzlePieces,
          userPuzzlePieces: userPuzzlePiecesForLevel,
        });
      } catch (err) {
        return null;
      }
      try {
        const userAllowedToClaimPiece =
          await logicsContract.userAllowedToClaimPiece(
            userAddress,
            userLevel,
            userLevel,
            puzzlePieces[userLevel - 1]
          );

        set({
          userAllowedToClaimPiece: true,
        });
      } catch (err) {
        set({
          userAllowedToClaimPiece: false,
        });
      }
    },
  };
});
