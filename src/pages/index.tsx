import { GraphQLClient, gql } from "graphql-request";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, type Address, useContractRead } from "wagmi";
import { type InvestmentProps } from "~/@types/investment";
import { type SliderProps } from "~/@types/slider";
import Investments from "~/components/Investments";
import Posts from "~/components/Posts";
import Puzzle from "~/components/Puzzle";
import Highlight from "~/components/investment/Highlight";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import { SLCoreABI, investmentABI } from "~/utils/abis";
import { cn } from "~/lib/utils";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DOMPurify from "isomorphic-dompurify";
import { useInvestments } from "~/lib/zustand";

interface ActiveInvestmentsProps {
  investments: InvestmentProps[];
}
const Home: NextPage = (props: any) => {
  const { isConnected, isDisconnected, address: walletAddress } = useAccount();

  // Carousel
  const sliderInvestments = useInvestments((state) => state.sliderInvestments);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prevIndex) => (prevIndex + 1) % sliderInvestments?.length
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [sliderInvestments?.length]);

  return (
    <>
      <section className="mx-auto w-full bg-white">
        <div className="relative flex min-h-[968px] w-full flex-col rounded-bl-[50px] bg-opacity-80 bg-cover bg-center bg-no-repeat">
          {sliderInvestments?.map((image, index) => (
            <div
              key={index}
              className={`absolute left-0 min-h-[968px] w-full rounded-bl-[156px] bg-black bg-opacity-80 bg-cover transition-opacity duration-1000 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${
                  image.basicInvestment.car?.basicInfo.cover
                    .url /** image.banner.url its the right one but has decievieng images by now */
                })`,
              }}
            />
          ))}
          <div className="absolute top-0 z-0 flex min-h-[83px] w-full bg-[url('/bg/bg-navbar.svg')]" />
          <div className="absolute left-0 z-10 min-h-[968px] w-full bg-[linear-gradient(to_right,rgba(10,10,10,0.8),rgba(16,71,52,0.2)),url('/bg/gradient-vertical-header.svg')] bg-cover bg-bottom bg-no-repeat md:flex md:rounded-bl-[116px]" />
          <div className="absolute bottom-0 z-0 hidden min-h-[968px] w-full rounded-bl-[50px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat md:flex" />
          {/* </div>
          <div className="absolute left-0 z-10 flex min-h-screen w-full rounded-bl-[116px] bg-[url('/bg/gradient-vertical-header.svg')] bg-cover bg-bottom bg-no-repeat"></div>
          <div className="absolute bottom-0 z-0 flex min-h-screen w-full rounded-bl-[116px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat"></div> */}
          {/* <div className="absolute top-0 z-10 h-[968px] w-[1444px] rounded-bl-[50px] rounded-br-[50px] bg-gray-950" /> */}
          <NavBar />
          <div className="z-10 mx-auto flex w-full max-w-screen-lg flex-col justify-center">
            <div className="flex flex-col gap-12 px-6 pt-24 md:px-0">
              <h3
                className="text-3xl uppercase tracking-widest text-white md:text-5xl"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    sliderInvestments?.at(activeIndex).basicInvestment.car
                      ?.sliderTitle
                  ),
                }}
              />
              <p
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    sliderInvestments?.at(activeIndex).basicInvestment.car
                      ?.sliderDescription
                  ),
                }}
              />
              <Link
                href={`/investment/${sliderInvestments?.[activeIndex].address}`}
                className="self-start rounded-md bg-white px-12 py-1.5 text-center text-sm uppercase text-black dark:hover:bg-white dark:hover:text-black"
              >
                See More
              </Link>
            </div>
          </div>
          <div className="absolute left-16 top-[512px] z-40 -translate-x-1/2 transform space-x-2 md:left-[235px]">
            {sliderInvestments?.map((_, index) => (
              <button
                key={index}
                className={`h-2.5 w-2.5 rounded-full ${
                  activeIndex === index ? "bg-white" : "bg-gray-500"
                } focus:outline-none`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>
        <div className="relative z-20 -mt-[350px] min-h-[500px] w-full max-w-[1224px]  px-6 md:left-1/2 md:-ml-[570px] md:-mt-[350px] md:px-0">
          <Carousel
            id="1"
            className="pb-12 md:pb-0"
            prevNavWhite={true}
            title={<h2 className="text-2xl text-white">Our cars</h2>}
            seeMoreLabel="See more"
            seeMoreLink="/our-cars"
            seeMoreMr="md:mr-36"
            userAddress={walletAddress!}
            isLevelDivided={false}
          />
          {/* Highlight Component */}
        </div>
        {!isConnected && <Highlight className="mx-auto max-w-screen-lg" />}
        <div
          className={cn(
            "relative left-auto z-20 mx-auto w-full md:left-1/2  md:-ml-[570px] md:min-h-[532px] md:max-w-[1282px]",
            isConnected ? "md:mt-[132px]" : "mt-12 md:mt-0"
          )}
        >
          <Investments isConnected={isConnected} />
        </div>
        {/* My Puzzle */}
        <div className="relative mx-auto w-full max-w-[1282px] md:left-1/2 md:-ml-[570px] ">
          <Puzzle
            isConnected={isConnected}
            className="relative flex w-full  max-w-[1338px] flex-col pt-12 md:pt-[132px]"
            userAddress={walletAddress as Address}
          />
        </div>
        <div className="hidden w-full rounded-t-3xl bg-black pb-[132px] pt-[72px] md:flex">
          <Posts
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

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY as string, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER as string,
  },
});

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  const { slider }: any = await hygraph.request(
    gql`
      query SliderHome {
        slider(where: { title: "Home" }) {
          id
          title
          investments {
            banner {
              url
            }
            address
            basicInvestment {
              car {
                basicInfo {
                  cover {
                    url
                  }
                  title
                }
                sliderTitle
                sliderDescription
              }
            }
          }
        }
      }
    `
  );

  return {
    props: {
      slider,
    },
  };
}
