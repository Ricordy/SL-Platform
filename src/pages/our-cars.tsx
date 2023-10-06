import { GraphQLClient, gql } from "graphql-request";
import Link from "next/link";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import { cn } from "~/lib/utils";
import { Tab } from "@headlessui/react";
import ProjectCarousel from "~/components/ProjectCarousel";
import { investmentLevelsData } from "~/data/InvestmentStatuses";
import { useAccount } from "wagmi";
import { GetServerSideProps } from "next/types";
import { InvestmentProps } from "~/@types/investment";
import { useInvestments } from "~/lib/zustand";
import { useEffect } from "react";

const ourCars = () => {
  const { address: walletAddress } = useAccount();

  const allInvestments = useInvestments((state: any) => state?.investments);

  const lastCarName =
    allInvestments?.[0].basicInvestment.car.basicInfo.title.split(" ")[0];
  const lastCarModel = () => {
    const titleWords =
      allInvestments?.[0].basicInvestment.car.basicInfo.title.split(" ");
    if (titleWords?.length > 2) {
      return titleWords.slice(1).join(" ");
    } else {
      return titleWords?.[1];
    }
  };

  return (
    <section className=" mx-auto w-full  bg-white">
      <div
        style={{ backgroundImage: `url(${allInvestments?.[0].banner.url})` }}
        className={
          "relative flex min-h-screen w-full flex-col bg-cover bg-right  bg-no-repeat md:h-[1000px] md:rounded-bl-[56px] md:bg-contain"
        }
      >
        <div className="absolute top-0 z-0 flex min-h-[83px]  w-full bg-[url('/bg/bg-navbar.svg')]"></div>
        <div className="absolute left-0 z-10 min-h-[968px] w-full bg-[linear-gradient(to_right,rgba(10,10,10,0.8),rgba(16,71,52,0.2)),url('/bg/gradient-vertical-header.svg')] bg-cover bg-bottom bg-no-repeat md:flex md:rounded-bl-[116px]" />
        <div className="absolute bottom-0 z-0 hidden h-[1000px] min-h-screen  w-full rounded-bl-[56px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat md:flex"></div>
        <NavBar />
        <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center px-6 md:px-0">
          <div className="flex flex-col gap-4  pt-24 md:pt-8">
            <h3 className="hidden text-3xl uppercase tracking-widest text-white md:mb-16 md:block">
              Our Cars
            </h3>
            <span className="flex self-start rounded-full border border-primaryGold px-3 uppercase text-primaryGold">
              New
            </span>
            <h3 className="mb-4 text-3xl uppercase tracking-widest text-white md:text-5xl">
              {lastCarName}
              <br />
              {lastCarModel()}
            </h3>
            <p className="mb-4 text-white">
              Discover the world of{" "}
              <span className="font-medium">investment in the classics</span>
              <br className="hidden md:block" /> and follow the process in{" "}
              <span className="font-medium">real time</span>.
            </p>
            <Link
              href={`/investment/${allInvestments?.[0].address}`}
              className="self-start rounded-md bg-white px-12 py-1.5 text-center text-sm font-medium uppercase text-black dark:hover:bg-white dark:hover:text-black"
            >
              Invest now
            </Link>
          </div>
        </div>
      </div>
      <div className="relative z-20 w-full max-w-[1290px] md:left-1/2 md:-ml-[570px] md:-mt-[350px] md:min-h-[500px]">
        <Tab.Group>
          <Tab.List className="flex w-fit border-b border-b-gray-900/20 md:ml-[58px]">
            {investmentLevelsData.map((investmentLevel) => (
              <Tab
                key={investmentLevel}
                className={({ selected }) =>
                  cn(
                    "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal  leading-5 text-tabInactive",
                    "focus:outline-none",
                    selected
                      ? "border-b-4 border-primaryGold  font-semibold text-primaryGold"
                      : " hover:bg-white/[0.12] hover:text-tabInactive/80"
                  )
                }
              >
                {investmentLevel.split("l")[0] +
                  "l " +
                  investmentLevel.split("l")[1]}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2 px-6 md:px-0">
            {investmentLevelsData.map((investmentLevel) => {
              return (
                <Tab.Panel
                  key={investmentLevel}
                  className={cn(
                    " pt-6",
                    "min-h-[420px] ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                  )}
                >
                  <Carousel
                    id={investmentLevel}
                    prevNavWhite={true}
                    // items={zustand.filter(
                    //   (i) =>
                    //     i.level.basicLevel.title ===
                    //     investmentLevel.split("l")[0] +
                    //       "l " +
                    //       investmentLevel.split("l")[1]
                    // )}
                    userAddress={walletAddress!}
                    isLevelDivided={true}
                    currentLevel={
                      investmentLevel.split("l")[0] +
                      "l " +
                      investmentLevel.split("l")[1]
                    }
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
        <Carousel
          id="4"
          className="mb-12 px-6 pt-12 md:mb-0 md:px-0 md:pt-[132px]"
          title={<h2 className="text-2xl ">Our cars</h2>}
          userAddress={walletAddress!}
          isLevelDivided={false}
        />
        {/* <Carousel
          id="5"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 1</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 1"
          )}
        />
        <Carousel
          id="6"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 2</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 2"
          )}
        />
        <Carousel
          id="7"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 3</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 3"
          )}
        /> */}
      </div>
    </section>
  );
};

export default ourCars;
