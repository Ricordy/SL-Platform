import { GraphQLClient, gql } from "graphql-request";
import Link from "next/link";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import { cn } from "~/lib/utils";

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
    <section className="mx-auto w-full bg-white">
      <div
        style={{ "--image-url": `url(${props.investments[0].banner.url})` }}
        className={
          "relative flex min-h-screen w-full flex-col rounded-bl-[56px] bg-opacity-80 bg-[image:var(--image-url)] bg-contain bg-right bg-no-repeat"
        }
      >
        <div className="absolute top-0 z-0 flex min-h-[83px] w-full bg-[url('/bg/bg-navbar.svg')]"></div>
        <div className="absolute left-0 z-10 flex min-h-screen w-full bg-[url('/bg/gradient-vertical-header.svg')] bg-contain bg-bottom bg-no-repeat"></div>
        <div className="absolute bottom-0 z-0 flex min-h-screen w-full rounded-bl-[56px] bg-[url('/bg/gradient-horizontal-header.svg')] bg-cover bg-left bg-no-repeat"></div>
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
        <Carousel
          id="1"
          prevNavWhite={true}
          title={<h2 className="text-2xl text-white">Our cars</h2>}
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
