import type { NextPage } from "next";
import Head from "next/head";
import Slider from "../components/Slider";
import Hero from "../components/Hero";
import Investments from "../components/Investments";
import Puzzle from "../components/Puzzle";

const Home: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>Something Legendary</title>
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl p-4">
        <Hero className="my-12" />
        <Slider />
        <Investments />
        <Puzzle />
      </main>
    </>
  );
};

export default Home;
