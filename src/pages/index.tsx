import type { NextPage } from "next";
import Head from "next/head";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Nav from "../components/Nav";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Something Legendary</title>
        <meta
          name="description"
          content="Something Legendary | It is in the solitude that legends are born."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl p-4">
        <Nav />
        <Hero className="my-12" />
        <Gallery className="flex" />
      </main>
    </>
  );
};

export default Home;
