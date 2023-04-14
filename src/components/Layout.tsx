import NavBar from "./NavBar";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col items-stretch bg-black">
      <Head>
        <title>Something Legendary</title>
      </Head>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex flex-col w-full bg-white max-w-screen-2xl mx-auto grow shrink-0">
        {children}
      </main>
    </div>
  );
}
