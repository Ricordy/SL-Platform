import type { NextPage } from "next";
import Head from "next/head";
import Slider from "../components/Slider";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import Investments from "../components/Investments";
import PuzzleItem from "../components/PuzzleItem";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Something Legendary</title>
        <meta
          name="description"
          content="Something Legendary | It is in the solitude that legends are born."
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/public/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/public/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/public/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/public/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/public/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/public/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/public/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/public/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/public/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/public/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/public/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/public/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/public/favicon-16x16.png"
        />
        <link rel="manifest" href="/public/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main className="container mx-auto flex flex-col max-w-4xl p-4">
        <Nav />
        <Hero className="my-12" />
        <Slider />
        <Investments />
        <PuzzleItem level={1} amount={100000} progress={25} />
        <PuzzleItem level={2} amount={200000} progress={0} />
      </main>
      <Footer />
    </>
  );
};

export default Home;
