import Link from "next/link";
import Carousel from "../components/Carousel";
import NavBar from "../components/NavBar";
import { GraphQLClient, gql } from "graphql-request";

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

  return (
    <section className="mx-auto w-full bg-white">
      <div className="relative flex min-h-screen w-full flex-col rounded-bl-[56px] bg-opacity-80 bg-[url('/bg/bg-our-cars.jpg')] bg-contain bg-right bg-no-repeat">
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
              Volkswagen
              <br />
              Lorem Ipsum
            </h3>
            <p className="mb-4 text-white">
              Discover the world of{" "}
              <span className="font-medium">investment in the classics</span>
              <br />
              and follow the process in{" "}
              <span className="font-medium">real time</span>.
            </p>
            <Link
              href="/investments"
              className="self-start rounded-md bg-white px-12 py-1.5 text-center text-sm font-medium uppercase text-black dark:hover:bg-white dark:hover:text-black"
            >
              Invest now
            </Link>
          </div>
        </div>
      </div>
      <div className="relative left-1/2 z-20 mx-auto -ml-[570px] -mt-[300px]  min-h-[500px] max-w-[1338px]">
        <Carousel
          id="1"
          prevNavWhite={true}
          title={<h2 className="text-2xl text-white">Our cars</h2>}
          seeMoreLabel="See more"
          seeMoreLink="/our-cars"
          items={props.investments}
        />
        <Carousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Top Investments</h2>}
          items={orderInvestmentsByTotalInvestment(props.investments)}
        />
        <Carousel
          id="2"
          className="py-[132px]"
          title={<h2 className="text-2xl">Oldest cars</h2>}
          items={reverseInvestments(props.investments)}
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
