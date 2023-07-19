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
import { investmentABI } from "~/utils/abis";
interface ActiveInvestmentsProps {
  investments: InvestmentProps[];
}
const Home: NextPage = (props: any) => {
  const { isConnected, isDisconnected, address: walletAddress } = useAccount();

  // const { data: contractTotal } = useContractRead({
  //   address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
  //   abi: CoinTestAbi,
  //   functionName: "balanceOf",
  //   args: [
  //     highlightContractAddress?.address[
  //       process.env.NEXT_PUBLIC_CHAIN_ID as Address
  //     ],
  //   ],
  //   watch: true,
  // });

  const { data: totalInvested } = useContractRead({
    address: props.highlightInvestment?.address,
    abi: investmentABI,
    functionName: "totalSupply",
  });



  // Carousel
  const images = props.slider.investments;
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
        {/* <div className="absolute z-20 h-[615px] w-full rounded-bl-[200px] bg-gradient-to-b from-black to-gray-950"></div> */}
        {/* <div class="relative h-[968px] w-[1444px]">
          <div class="absolute left-0 top-0 h-[968px] w-[1444px] rounded-bl-[50px] rounded-br-[50px] bg-gray-950"></div>
          <img
            class="absolute left-[2px] top-0 h-[784px] w-[1442px] opacity-80"
            src="https://via.placeholder.com/1442x784"
          />
          <div class="absolute left-[1149px] top-[12px] h-[1147px] w-[772px] origin-top-left rotate-90 bg-gradient-to-b from-black to-gray-950"></div>
          <div class="absolute left-0 top-[353px] h-[615px] w-[1442px] rounded-bl-[200px] bg-gradient-to-b from-black to-gray-950"></div>
        </div> */}
        <div className="relative flex min-h-screen w-full flex-col rounded-bl-[126px] bg-opacity-80 bg-cover bg-center bg-no-repeat">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute left-0 min-h-screen w-full rounded-bl-[156px] bg-black bg-opacity-80 bg-cover transition-opacity duration-1000 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${
                  image.basicInvestment.car.basicInfo.cover
                    .url /** image.banner.url its the right one but has decievieng images by now */
                })`,
              }}
            />
          ))}
          <div className="absolute top-0 z-0 flex min-h-[83px] w-full bg-[url('/bg/bg-navbar.svg')]"></div>
          <div className="absolute left-0 z-10 flex min-h-screen w-full rounded-bl-[116px] bg-[url('/bg/gradient-vertical-header.svg')] bg-cover bg-bottom bg-no-repeat"></div>
          <div className="absolute bottom-0 z-0 flex min-h-screen w-full rounded-bl-[116px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat"></div>
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
                href={`/investment/${images[activeIndex].address}`}
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
            seeMoreLabel="See more"
            seeMoreLink="/our-cars"
          />
          {/* Highlight Component */}

          {!isConnected && (
            <Highlight
              investment={props.highlightInvestment}
              totalInvested={totalInvested?.toNumber() / 10 ** 6}
            />
          )}

          {/* {isConnected && (
            <Carousel
              id="2"
              className="py-[132px]"
              title={<h2 className="text-2xl">My Favourites</h2>}
            />
          )} */}
        </div>
        {/* My Investments */}
        <div className=" relative left-1/2 z-20 mx-auto -ml-[570px] mt-[132px] min-h-[396px] w-full max-w-[1338px]">
          <Investments
            isConnected={isConnected}
            userInvestments={props.investments}
          />
        </div>
        {/* My Puzzle */}

        <div className="relative left-1/2 mx-auto -ml-[570px] w-full max-w-[1338px] ">
          <Puzzle
            isConnected={isConnected}
            className="relative flex w-full  max-w-[1338px] flex-col pt-[132px]"
            userAddress={walletAddress as Address}
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

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY as string, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER as string,
  },
});

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

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

  const { investments: activeInvestments }: ActiveInvestmentsProps =
    await hygraph.request(
      gql`
        query ActiveInvestments {
          investments(
            orderBy: createdAt_DESC
            where: { basicInvestment: { investmentStatus: Active } }
          ) {
            id
            address
            highlight
            level {
              basicLevel {
                title
              }
            }
            basicInvestment {
              id
              totalInvested
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
                description
                gallery {
                  url
                }
              }
            }
            restorationPhases(where: { restorationStatus: InProgress }) {
              title
              restorationStatus
            }
          }
        }
      `
    );

  const { investments }: { investments: InvestmentProps[] } =
    await hygraph.request(
      gql`
        query UserInvestments {
          investments(
            where: {
              transactions_some: {
                from: "${session?.user.id}"
              }
            }
          ) {
            id
            address
            level {
              basicLevel {
                title
              }
              profitRange
            }
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
              }
            }
          }
        }
      }
    `
  );

  const { puzzlePieces } = await hygraph.request(
    gql`
      query {
        puzzlePieces(first: 30, orderBy: tokenid_ASC) {
          tokenid
          title
          image {
            url
          }
          imageCollected {
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
          bg {
            url
          }
          nft {
            url
          }
        }
      }
    `
  );

  const highlightInvestment = activeInvestments.find(
    (investment) => investment.highlight === true
  );

  return {
    props: {
      posts,
      activeInvestments,
      highlightInvestment,
      investments,
      slider,
      puzzlePieces,
      levels,
    },
  };
}
