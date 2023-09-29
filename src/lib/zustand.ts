import { create } from "zustand";
import { GraphQLClient, gql } from "graphql-request";

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
          console.log("resposta: ", res);

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
