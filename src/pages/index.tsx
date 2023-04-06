import type { NextPage } from "next";
import Head from "next/head";
import Slider from "../components/Slider";
import Hero from "../components/Hero";
import Investments from "../components/Investments";
import Puzzle from "../components/Puzzle";
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/Button";
import Link from "next/link";

const Home: NextPage = (props) => {
  return (
    <>
      <section className="w-full mx-auto">
        <div className="flex flex-col w-full relative rounded-bl-[56px] min-h-screen bg-cover bg-right bg-no-repeat bg-[url('/bg/bg-home.jpg')]">
          <div className="absolute flex z-0 top-0 w-full min-h-[83px] bg-[url('/bg/bg-navbar.svg')]"></div>
          <div className="absolute flex z-10 left-0 w-full min-h-screen bg-bottom bg-no-repeat bg-contain bg-[url('/bg/gradient-vertical-header.svg')]"></div>
          <div className="absolute rounded-bl-[56px] flex z-0 bottom-0 w-full min-h-screen bg-left bg-no-repeat bg-cover bg-[url('/bg/gradient-horizontal-header.svg')]"></div>
          <NavBar />
          <div className="flex flex-col justify-center w-full z-20 mx-auto max-w-screen-lg">
            <div className="flex flex-col gap-12 pt-24">
              <h3 className="text-white uppercase text-5xl tracking-widest">
                New Classic
                <br />
                Available
              </h3>
              <p className="text-white">
                Discover the world of{" "}
                <span className="font-medium">investment in the classics</span>
                <br />
                and follow the process in{" "}
                <span className="font-medium">real time</span>.
              </p>
              <Link href="/investments">
                <a className="dark:hover:bg-white dark:hover:text-black text-center uppercase text-sm bg-white text-black rounded-md px-12 py-1.5 self-start">
                  See More
                </a>
              </Link>
            </div>
          </div>
          {/* <Slider /> */}
        </div>
        <div className="min-h-[500px] -mt-[300px] relative z-20 max-w-screen-lg mx-auto">
          <h3 className="text-white">Our cars</h3>
        </div>
      </section>
      <main className="mx-auto flex flex-col">
        <Investments />
        <Puzzle />
      </main>
    </>
  );
};

export default Home;
