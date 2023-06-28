import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col items-stretch bg-buyNFTBackground">
      <Head>
        <title>Something Legendary</title>
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="mx-auto flex w-full max-w-screen-2xl shrink-0 grow flex-col">
        {children}
      </main>
    </div>
  );
}
