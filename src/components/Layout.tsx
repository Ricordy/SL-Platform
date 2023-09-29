import { Toaster } from "react-hot-toast";
import Head from "next/head";
import AlertMessage from "./ui/AlertMessage";
import { useInvestments, usePosts } from "~/lib/zustand";
import { useEffect } from "react";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const allInvestments = useInvestments((state) => state.investments);
  const fetchInvestments = useInvestments((state) => state.fetch);
  const posts = usePosts((state) => state.posts);
  const fetchPosts = usePosts((state) => state.fetch);

  useEffect(() => {
    if (!allInvestments) {
      fetchInvestments();
    }
    if (!posts) {
      fetchPosts();
    }
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
