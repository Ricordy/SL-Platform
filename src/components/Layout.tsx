import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function Layout({ children }) {
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
        {children}
      </main>
    </div>
  );
}
