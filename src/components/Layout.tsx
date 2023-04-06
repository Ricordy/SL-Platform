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
      <Footer className="shrink-0 mt-auto flex w-full max-w-4xl mx-auto p-3 md:p-0 my-6 md:my-12 gap-3 " />
    </div>
  );
}
