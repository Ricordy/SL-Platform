import type { NextPage } from "next";
import Head from "next/head";
import Slider from "../components/Slider";
import Hero from "../components/Hero";
import Investments from "../components/Investments";
import Puzzle from "../components/Puzzle";
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import Carousel from "../components/Carousel";
import Posts from "../components/Posts";
import { PostItemProps } from "../@types/post";

const posts: PostItemProps[] = [
  {
    title: "Lorem Ipsum Dolor sit amet elit eiusmod",
    image: "/posts/post-1.jpg",
    slug: "lorem-1",
    children: (
      <p className="text-primaryGrey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam...
      </p>
    ),
  },
  {
    title: "Lorem Ipsum Dolor sit amet elit eiusmod",
    image: "/posts/post-2.jpg",
    slug: "lorem-2",
    children: (
      <p className="text-primaryGrey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam...
      </p>
    ),
  },
  {
    title: "Lorem Ipsum Dolor sit amet elit eiusmod",
    image: "/posts/post-3.jpg",
    slug: "lorem-3",
    children: (
      <p className="text-primaryGrey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam...
      </p>
    ),
  },
];

const Home: NextPage = (props) => {
  return (
    <>
      <section className="w-full mx-auto bg-white">
        <div className="flex flex-col w-full relative rounded-bl-[56px] min-h-screen bg-cover bg-right bg-no-repeat bg-black bg-opacity-80 bg-[url('/bg/bg-home.jpg')]">
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
        </div>
        <div className="min-h-[500px] -mt-[300px] relative z-20 left-1/2 -ml-[570px]  max-w-[1338px] mx-auto">
          <Carousel
            id="1"
            prevNavWhite={true}
            title={<h2 className="text-white text-2xl">Our cars</h2>}
            seeMoreLabel="See more"
            seeMoreLink="/our-cars"
          />
          <Carousel
            id="2"
            className="py-12"
            title={<h2 className="text-2xl">My Favourites</h2>}
          />
        </div>

        <div className="min-h-[500px] w-full relative z-20 left-1/2 -ml-[570px] max-w-[1338px] mx-auto">
          <Investments />
        </div>
        <div className="mx-auto w-full relative left-1/2 -ml-[570px] max-w-[1338px]">
          <Puzzle className="relative max-w-[1338px] w-full  flex flex-col pt-[132px]" />
        </div>
        <div className="flex bg-black w-full rounded-t-3xl pb-[132px] pt-[72px]">
          <Posts
            posts={posts}
            title="Learn More"
            titleColor="text-white"
            buttonMoreLink="https://beta.somethinglegendary.com/learn"
            buttonMoreText="See More"
          />
        </div>
      </section>
    </>
  );
};

export default Home;
