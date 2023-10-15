import { Toaster } from "react-hot-toast";
import Head from "next/head";
import AlertMessage from "./ui/AlertMessage";
import {
  useBlockchainInfo,
  useGameContent,
  useInvestments,
  usePosts,
  useUserTransactions,
} from "~/lib/zustand";
import { useEffect } from "react";
import { useAccount } from "wagmi";

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
  const userLevel = useBlockchainInfo((state: any) => state.userLevel);
  const fetchStaticInfo = useBlockchainInfo(
    (state: any) => state.fetchStaticInfo
  );
  const fetchPuzzleInfo = useBlockchainInfo(
    (state: any) => state.fetchPuzzleInfo
  );

  const userTotalInvestedPerLevel = useBlockchainInfo(
    (state: any) => state.userTotalInvestedPerLevel
  );

  const { address } = useAccount();

  useEffect(() => {
    if (!allInvestments || !userInvestments) {
      fetchInvestments();
      fetchUserInvestments();
    }
    if (!posts) {
      fetchPosts();
    }
    if (address && !userLevel) {
      fetchStaticInfo(address);
    }

    // if (address && userLevel) {
    //   fetchPuzzleInfo(address, userLevel);
    // }

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

    if (!userTotalInvestedPerLevel && address) {
      fetchPuzzleInfo(address, userLevel);
    }

    //change to my-investments since it is the only page that needs thisdata
    return () => {};
  }, [userLevel]);
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
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              backgroundColor: "#b0ffd4",
              border: "1px solid #25fa85",
              color: "black",
            },
          },
          error: {
            style: {
              backgroundColor: "#ffb0b5",
              border: "1px solid #f7606b",
              color: "black",
            },
          },
          loading: {
            style: {
              backgroundColor: "#c3dffa",
              border: "1px solid #60aef7",

              color: "black",
            },
          },
        }}
      />
      <main className="mx-auto flex w-full max-w-[1440px] shrink-0 grow flex-col">
        <AlertMessage message="For the best experience, we recommend using our app on desktop." />
        {children}
      </main>
    </div>
  );
}
