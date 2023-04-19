import Link from "next/link";
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";

const ourCars = () => {
  return (
    <section className="w-full mx-auto bg-white">
      <div className="flex flex-col w-full relative rounded-bl-[56px] min-h-screen bg-contain bg-right bg-no-repeat bg-opacity-80 bg-[url('/bg/bg-our-cars.jpg')]">
        <div className="absolute flex z-0 top-0 w-full min-h-[83px] bg-[url('/bg/bg-navbar.svg')]"></div>
        <div className="absolute flex z-10 left-0 w-full min-h-screen bg-bottom bg-no-repeat bg-contain bg-[url('/bg/gradient-vertical-header.svg')]"></div>
        <div className="absolute rounded-bl-[56px] flex z-0 bottom-0 w-full min-h-screen bg-left bg-no-repeat bg-cover bg-[url('/bg/gradient-horizontal-header.svg')]"></div>
        <NavBar />
        <div className="flex flex-col justify-center w-full z-20 mx-auto max-w-screen-lg">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="text-white uppercase mb-16 text-3xl tracking-widest">
              Our Cars
            </h3>
            <span className="text-primaryGold uppercase flex self-start rounded-full px-3 border border-primaryGold">
              New
            </span>
            <h3 className="text-white uppercase mb-4 text-5xl tracking-widest">
              Volkswagen
              <br />
              Lorem Ipsum
            </h3>
            <p className="text-white mb-4">
              Discover the world of{" "}
              <span className="font-medium">investment in the classics</span>
              <br />
              and follow the process in{" "}
              <span className="font-medium">real time</span>.
            </p>
            <Link href="/investments">
              <a className="dark:hover:bg-white font-medium dark:hover:text-black text-center uppercase text-sm bg-white text-black rounded-md px-12 py-1.5 self-start">
                Invest now
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
          className="pt-[132px]"
          title={<h2 className="text-2xl">Top Investments</h2>}
        />
        <Carousel
          id="2"
          className="py-[132px]"
          title={<h2 className="text-2xl">Oldest cars</h2>}
        />
      </div>
    </section>
  );
};

export default ourCars;
