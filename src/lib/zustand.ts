import { create } from "zustand";
import activeInvestments from "./hygrpah";
import { GraphQLClient, gql } from "graphql-request";

export const useInvestments = create((set) => {
  return {
    investments: undefined,
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
