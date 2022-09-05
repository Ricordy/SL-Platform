import type { NextPage } from "next";
import Head from "next/head";
import Slider from "../components/Slider";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Investments from "../components/Investments";
import PuzzleItem from "../components/PuzzleItem";

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
        <Slider />
        <Investments />
        <PuzzleItem level={1} amount={100000} progress={25} />
        <PuzzleItem level={2} amount={200000} progress={0} />
      </main>
    </>
  );
};

export default Home;
