import { GraphQLClient, gql } from "graphql-request";
import Link from "next/link";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import { cn } from "~/lib/utils";
import { Tab } from "@headlessui/react";
import ProjectCarousel from "~/components/ProjectCarousel";
import { investmentLevelsData } from "~/data/InvestmentStatuses";

const ourCars = (props) => {
  function reverseInvestments(investments) {
    return investments.slice().reverse();
  }

  function orderInvestmentsByTotalInvestment(investments) {
    return investments
      .slice()
      .sort(
        (a, b) =>
          b.basicInvestment.totalInvestment - a.basicInvestment.totalInvestment
      );
  }

  const lastCarName =
    props.investments[0].basicInvestment.car.basicInfo.title.split(" ")[0];
  const lastCarModel = () => {
    const titleWords =
      props.investments[0].basicInvestment.car.basicInfo.title.split(" ");
    if (titleWords.length > 2) {
      return titleWords.slice(1).join(" ");
    } else {
      return titleWords[1];
    }
  };

  return (
    <section className="max-w-screen mx-auto w-screen overflow-x-hidden bg-white">
      <div
        style={{ "--image-url": `url(${props.investments[0].banner.url})` }}
        className={
          "relative flex h-[1000px] min-h-screen w-full flex-col  rounded-bl-[56px]  bg-opacity-80 bg-[image:var(--image-url)] bg-contain bg-right bg-no-repeat"
        }
      >
        <div className="absolute top-0 z-0 flex min-h-[83px]  w-full bg-[url('/bg/bg-navbar.svg')]"></div>
        <div className="absolute left-0 z-10 flex h-[1000px] min-h-screen w-full bg-[url('/bg/gradient-vertical-header.svg')] bg-contain bg-bottom bg-no-repeat"></div>
        <div className="absolute bottom-0 z-0 flex h-[1000px] min-h-screen  w-full rounded-bl-[56px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat"></div>
        <NavBar />
        <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="mb-16 text-3xl uppercase tracking-widest text-white">
              Our Cars
            </h3>
            <span className="flex self-start rounded-full border border-primaryGold px-3 uppercase text-primaryGold">
              New
            </span>
            <h3 className="mb-4 text-5xl uppercase tracking-widest text-white">
              {lastCarName}
              <br />
              {lastCarModel()}
            </h3>
            <p className="mb-4 text-white">
              Discover the world of{" "}
              <span className="font-medium">investment in the classics</span>
              <br />
              and follow the process in{" "}
              <span className="font-medium">real time</span>.
            </p>
            <Link
              href={`/investment/${props.investments[0].address}`}
              className="self-start rounded-md bg-white px-12 py-1.5 text-center text-sm font-medium uppercase text-black dark:hover:bg-white dark:hover:text-black"
            >
              Invest now
            </Link>
          </div>
        </div>
      </div>
      <div className="relative left-1/2 z-20 mx-auto -ml-[570px] -mt-[300px]  mb-[132px] min-h-[500px] max-w-[1338px]">
        <Tab.Group>
          <Tab.List className="ml-[58px] flex w-fit border-b border-b-gray-900/20">
            {investmentLevelsData.map((investmentLevel) => (
              <Tab
                key={investmentLevel}
                className={({ selected }) =>
                  cn(
                    "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal  leading-5 text-tabInactive",
                    "focus:outline-none",
                    selected
                      ? "border-b-4 border-primaryGreen  font-semibold text-primaryGreen"
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
          <Tab.Panels className="mt-2">
            {investmentLevelsData.map((investmentLevel) => {
              return (
                <Tab.Panel
                  key={investmentLevel}
                  className={cn(
                    " pt-6",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2 "
                  )}
                >
                  <Carousel
                    id={investmentLevel}
                    items={props.investments.filter(
                      (i) =>
                        i.level.basicLevel.title ===
                        investmentLevel.split("l")[0] +
                          "l " +
                          investmentLevel.split("l")[1]
                    )}
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
        <Carousel
          id="1"
          className="pt-[132px]"
          title={<h2 className="text-2xl ">Our cars</h2>}
          items={props.investments}
        />
        <Carousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 1</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 1"
          )}
        />
        <Carousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 2</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 2"
          )}
        />
        <Carousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Level 3</h2>}
          items={props.investments.filter(
            (i) => i.level.basicLevel.title === "Level 3"
          )}
        />
      </div>
    </section>
  );
};

export default ourCars;

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY as string, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER as string,
  },
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { investments } = await hygraph.request(
    gql`
      query AllInvestments {
        investments(orderBy: createdAt_DESC) {
          id
          address
          banner {
            url
          }
          level {
            basicLevel {
              title
            }
            profitRange
          }
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

  return {
    props: {
      investments: investments,
    },
  };
};
