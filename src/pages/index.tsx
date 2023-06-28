import type { NextPage } from "next";
import { investmentData } from "../data/Investments";
import Hero from "../components/Hero";
import Investments from "../components/Investments";
import Puzzle from "../components/Puzzle";
import NavBar from "../components/NavBar";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import Carousel from "../components/Carousel";
import Posts from "../components/Posts";
import { PostItemProps } from "../@types/post";
import { type Address, useAccount, useContractRead } from "wagmi";
import { Carousel as C2 } from "react-responsive-carousel";
import Image from "next/image";
import { CoinTestAbi, InvestAbi } from "../data/ABIs";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";
import ProjectCarousel from "../components/ProjectCarousel";
import { ProjectInfo, badges } from "./investment/[address]";

const Home: NextPage = (props) => {
  const { isConnected, isDisconnected, address } = useAccount();
  const highlightContractAddress = investmentData.find(
    (investment) => investment.id === 1
  );

  const { data: contractTotal } = useContractRead({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: CoinTestAbi,
    functionName: "balanceOf",
    args: [
      highlightContractAddress?.address[
        process.env.NEXT_PUBLIC_CHAIN_ID as Address
      ],
    ],
    watch: true,
  });

  const { data: totalInvestment } = useContractRead({
    address:
      highlightContractAddress.address[
        process.env.NEXT_PUBLIC_CHAIN_ID as Address
      ],
    abi: InvestAbi,
    functionName: "totalInvestment",
  });

  const progress =
    (Number(contractTotal) / 10 ** 6 / (Number(totalInvestment) / 10 ** 6)) *
    100;

  // Carousel
  // const images = ["/bg/bg-home.jpg", "/bg/bg-our-cars.jpg"];
  const images = props.slider.image;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <section className="mx-auto w-full bg-white">
        <div className="relative flex min-h-screen w-full flex-col rounded-bl-[56px] bg-black bg-opacity-80 bg-cover bg-right bg-no-repeat">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute h-full w-full rounded-bl-[56px] bg-black bg-opacity-80 bg-cover bg-right transition-opacity duration-1000 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image.url})` }}
            />
          ))}
          <div className="absolute top-0 z-0 flex min-h-[83px] w-full bg-[url('/bg/bg-navbar.svg')]"></div>
          <div className="absolute left-0 z-10 flex min-h-screen w-full bg-[url('/bg/gradient-vertical-header.svg')] bg-contain bg-bottom bg-no-repeat"></div>
          <div className="absolute bottom-0 z-0 flex min-h-screen w-full rounded-bl-[56px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat"></div>
          <NavBar />
          <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center">
            <div className="flex flex-col gap-12 pt-24">
              <h3 className="text-5xl uppercase tracking-widest text-white">
                New Classic
                <br />
                in town!
              </h3>
              <p className="text-white">
                There&apos;s a new classic ready to be invested!
                <br />
                Don&apos;t miss your limited opportunity to get on this boat.
              </p>
              <Link
                href="/investments"
                className="self-start rounded-md bg-white px-12 py-1.5 text-center text-sm uppercase text-black dark:hover:bg-white dark:hover:text-black"
              >
                See More
              </Link>
            </div>
          </div>
          <div className="absolute left-[270px] top-[550px] z-40 -translate-x-1/2 transform space-x-2">
            {images.map((_, index) => (
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
        <div className="relative left-1/2 z-20 mx-auto -ml-[570px] -mt-[100px]  min-h-[500px] max-w-[1338px]">
          <Carousel
            id="1"
            items={props.activeInvestments}
            prevNavWhite={true}
            title={<h2 className="text-2xl text-white">Our cars</h2>}
            //seeMoreLabel="See more"
            //seeMoreLink="/our-cars"
          />
          {isDisconnected && (
            <div className="ml-[58px] flex flex-col py-[132px]">
              <h2 className="mb-[52px] text-2xl font-medium uppercase">
                Highlight
              </h2>
              <div className="flex gap-6">
                <div className="relative flex w-full">
                  <C2 showStatus={false} showThumbs={false}>
                    {[
                      "/projects/car-1-detail.jpg",
                      "/projects/car-1-detail.jpg",
                    ].map((image, idx) => (
                      <div key={idx} className="relative w-full">
                        <Image src={image} width={528} height={396} alt="car" />
                      </div>
                    ))}
                  </C2>
                </div>
                <div className="flex flex-col">
                  <h2 className="pb-8 text-3xl font-medium text-primaryGreen">
                    Mercedes Benz 280 Sl
                  </h2>
                  <ProjectInfo progress={progress} />
                  <p>
                    Mercedes-Benz introduced the 280SL less than a year after
                    the 250SL arrived on the scene, and closed out the “pagoda”
                    SL line in 1971 after nearly 24,000 were built. The 280 was
                    very similar, to its predecessor, using clean, elegant
                    lines, intelligent placement of the wheels in ...
                  </p>
                  <div className="flex gap-4 py-8">
                    <Image
                      src="/icons/tasks.svg"
                      width={22}
                      height={22}
                      alt="Tasks"
                    />
                    <span className="pr-2 text-xl font-medium">Blasting</span>
                    <span
                      className={cn(
                        "flex gap-2 rounded-full px-2 py-1 text-xs",
                        badges["inprogress"].bg,
                        badges["inprogress"].text
                      )}
                    >
                      <Image
                        src={badges["inprogress"].icon}
                        width={12}
                        height={12}
                        alt={badges["inprogress"].label}
                      />
                      {badges["inprogress"].label}
                    </span>
                  </div>
                  <Button variant="outline" className="self-start">
                    Know more
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* {isConnected && (
            <Carousel
              id="2"
              className="py-[132px]"
              title={<h2 className="text-2xl">My Favourites</h2>}
            />
          )} */}
        </div>

        <div className=" relative left-1/2 z-20 mx-auto -ml-[570px] w-full max-w-[1338px]">
          <Investments
            isConnected={isConnected}
            userInvestments={props.investments}
          />
        </div>
        <div className="relative left-1/2 mx-auto -ml-[570px] w-full max-w-[1338px]">
          <Puzzle
            isConnected={isConnected}
            className="relative flex w-full  max-w-[1338px] flex-col pt-[132px]"
            userAddress={address}
            puzzlePieces={props.puzzlePieces}
            dbLevels={props.levels}
          />
        </div>
        <div className="flex w-full rounded-t-3xl bg-black pb-[132px] pt-[72px]">
          <Posts
            posts={props.posts}
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

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER,
  },
});

export async function getStaticProps({ locale, params }) {
  const { posts } = await hygraph.request(
    gql`
      query MyQuery {
        posts {
          id
          slug
          basic {
            title
          }
          shortDescription {
            html
          }
          image {
            url
          }
          postCategory
          locale
        }
      }
    `
  );

  const { investments: activeInvestments } = await hygraph.request(
    gql`
      query ActiveInvestments {
        investments(where: { basicInvestment: { investmentStatus: Active } }) {
          id
          address
          basicInvestment {
            id
            totalInvestment
            investmentStatus
            car {
              basicInfo {
                title
                cover {
                  id
                  url
                }
              }
            }
          }
        }
      }
    `
  );

  const { investments } = await hygraph.request(
    gql`
      query UserInvestments {
        investments(
          where: {
            transactions_some: {
              from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            }
          }
        ) {
          id
          address
          basicInvestment {
            totalInvested
            totalInvestment
            investmentStatus
            car {
              id
              basicInfo {
                cover {
                  url
                }
                title
              }
            }
          }
        }
      }
    `
  );

  const { slider } = await hygraph.request(
    gql`
      query SliderHome {
        slider(where: { title: "Home" }) {
          id
          title
          image {
            id
            url
          }
        }
      }
    `
  );

  const { puzzlePieces } = await hygraph.request(
    gql`
      query {
        puzzlePieces {
          tokenid
          title
          image {
            url
          }
        }
      }
    `
  );

  const { levels } = await hygraph.request(
    gql`
      query {
        levels {
          basicLevel {
            title
          }
          description
          profitRange
        }
      }
    `
  );

  return {
    props: {
      posts,
      activeInvestments,
      investments,
      slider,
      puzzlePieces,
      levels,
    },
  };
}
