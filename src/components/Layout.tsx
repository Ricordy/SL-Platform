import { Toaster } from "react-hot-toast";
import Head from "next/head";
import AlertMessage from "./ui/AlertMessage";
import {
  useGameContent,
  useInvestments,
  usePosts,
  useUserTransactions,
} from "~/lib/zustand";
import { useEffect } from "react";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const allInvestments = useInvestments((state) => state.investments);
  const fetchInvestments = useInvestments((state) => state.fetch);
  const sliderInvestments = useInvestments((state) => state.sliderInvestments);
  const fetchSliderInvestments = useInvestments((state) => state.fetchSlider);

  const userInvestments = useInvestments((state) => state.userInvestments);
  const fetchUserInvestments = useInvestments(
    (state) => state.fetchUserInvestments
  );
  const userTransactions = useUserTransactions(
    (state) => state.userTransactions
  );
  const fetchUserTransactions = useUserTransactions((state) => state.fetch);
  const posts = usePosts((state) => state.posts);
  const fetchPosts = usePosts((state) => state.fetch);
  const puzzlePieces = useGameContent((state) => state.pieces);
  const dbLevels = useGameContent((state) => state.levels);
  const fetchLevels = useGameContent((state) => state.fetchLevels);
  const fetchPieces = useGameContent((state) => state.fetchPieces);

  useEffect(() => {
    if (!allInvestments || !userInvestments) {
      fetchInvestments();
      fetchUserInvestments();
    }
    if (!posts) {
      fetchPosts();
    }

    if (!userTransactions) {
      fetchUserTransactions();
    }
    if (!puzzlePieces) {
      fetchPieces();
    }
    if (!dbLevels) {
      fetchLevels();
    }
    if (!sliderInvestments) {
      fetchSliderInvestments();
    }

    //change to my-investments since it is the only page that needs thisdata
    return () => {};
  }, []);
  return (
    <div className="flex flex-col items-stretch bg-buyNFTBackground">
      <Head>
        <title>Something Legendary</title>
        <meta
          name="description"
          content="Somenthing Legendary: It is in the solitude that legends are born."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="mx-auto flex w-full max-w-[1440px] shrink-0 grow flex-col">
        <AlertMessage message="For the best experience, we recommend using our app on desktop." />
        {children}
      </main>
    </div>
  );
}
