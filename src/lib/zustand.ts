import { create } from "zustand";
import { GraphQLClient, gql } from "graphql-request";
import { Address, useContractRead } from "wagmi";
import { SLCoreABI, investmentABI, paymentTokenABI } from "~/utils/abis";
import { ethers } from "ethers";

export const useInvestments = create((set) => {
  return {
    investments: undefined,
    userInvestments: undefined,
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
      console.log("calling tx");
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
    totalSupply: undefined,
    userTotalInvestment: undefined,
    maxToInvest: undefined,
    paymentTokenBalance: undefined,
    contractLevel: undefined,
    userLevel: undefined,
    minToInvest: undefined,
    contractStatus: undefined,
    fetchDynamicInfo: async (contractAddress: string, userAddress: string) => {
      console.log("calling");

      if (
        contractAddress !== undefined &&
        contractAddress !== null &&
        contractAddress !== ""
      ) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(
            `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          );
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
          console.log("fetched: ", totalInvested, userTotalInvestment);

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
    fetchStaticInfo: async (contractAddress: string, userAddress: string) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        );
        const investmentContract = new ethers.Contract(
          contractAddress,
          investmentABI,
          provider
        );

        const slCoreContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
          SLCoreABI,
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
      } catch (err) {
        return null;
      }
    },
    fetchContractStatus: async (contractAddress: string) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
        );
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
  };
});
