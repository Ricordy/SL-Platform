import { create } from "zustand";
import { GraphQLClient, gql } from "graphql-request";
import { Address } from "wagmi";

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
        console.log("response: ", response);

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
        const response = await fetch("/api/investmentInfoFromAddress", {
          method: "POST",
          body: JSON.stringify({
            contractAddress: address,
          }),
        });
        console.log("response: ", response);

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
  };
});
