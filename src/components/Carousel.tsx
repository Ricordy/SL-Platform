import Image from "next/image";
import Link from "next/link";
import { useState, type FC, type ReactNode } from "react";
import { A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "../lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { type InvestmentProps } from "~/@types/investment";
import { NumericFormat } from "react-number-format";
import { Button } from "./ui/Button";
import { type Address } from "wagmi";
import { useContractRead } from "wagmi";
import { SLCoreABI } from "~/utils/abis";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import { useInvestments } from "~/lib/zustand";

interface CarouselItemProps {
  title: string;
  image: string;
  price: string;
  address: string;
  level?: string;
  userLevel: number;
}

export const CarouselItem = ({
  title,
  image,
  price,
  address,
  level,
  userLevel,
}: CarouselItemProps) => {
  return (
    <div className=" relative w-full rounded-[6px] border border-transparent hover:border-primaryGold">
      <div
        className={cn(
          "br relative flex min-h-[394px] w-full flex-col items-center justify-end gap-4  rounded-md bg-cover bg-center ",

          userLevel < parseInt(level?.split(" ")[1]) ? " blur-md" : ""
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        {level && (
          <div className=" absolute left-1/2 top-2 z-10 -ml-5 rounded-lg bg-white px-2 py-1 text-xs text-black md:left-auto md:right-3 md:-ml-0">
            {level}
          </div>
        )}
        <h4 className="z-10 max-w-[90%] text-center text-3xl uppercase text-white">
          {title}
        </h4>
        <div className="relative z-10 flex w-full justify-center gap-3 pb-8">
          <div className="flex">
            <div className="flex gap-3">
              <span className="font-light text-white">
                <NumericFormat
                  value={price}
                  displayType="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={0}
                  prefix="$"
                />
              </span>
            </div>
          </div>
        </div>
        <a
          href={`/investment/${address}`}
          className={cn(
            "absolute inset-0 rounded-md ring-primaryGold",
            "z-20 focus:z-10 focus:outline-none focus:ring-2"
          )}
        />
        <div className="absolute z-0 flex min-h-[200px] w-full rounded-b-md bg-[url('/projects/car-gradient.svg')] bg-cover"></div>
      </div>
      {userLevel < parseInt(level?.split(" ")[1]) && (
        <div className=" absolute top-0 flex h-full w-full flex-col items-center justify-center gap-4   text-center align-middle">
          <div className=" w-fit rounded-full border p-3">
            <svg
              width="60"
              height="59"
              viewBox="0 0 60 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="&#240;&#159;&#166;&#134; icon &#34;lock&#34;">
                <path
                  id="Vector"
                  d="M44.5184 20.0849H42.0886V15.2253C42.0886 8.51897 36.6458 3.07617 29.9395 3.07617C23.2332 3.07617 17.7904 8.51897 17.7904 15.2253V20.0849H15.3606C12.6878 20.0849 10.501 22.2717 10.501 24.9445V49.2427C10.501 51.9155 12.6878 54.1024 15.3606 54.1024H44.5184C47.1912 54.1024 49.3781 51.9155 49.3781 49.2427V24.9445C49.3781 22.2717 47.1912 20.0849 44.5184 20.0849ZM29.9395 41.9533C27.2667 41.9533 25.0799 39.7664 25.0799 37.0936C25.0799 34.4208 27.2667 32.234 29.9395 32.234C32.6123 32.234 34.7992 34.4208 34.7992 37.0936C34.7992 39.7664 32.6123 41.9533 29.9395 41.9533ZM22.6501 20.0849V15.2253C22.6501 11.1918 25.906 7.93581 29.9395 7.93581C33.973 7.93581 37.229 11.1918 37.229 15.2253V20.0849H22.6501Z"
                  fill="white"
                />
              </g>
            </svg>
          </div>

          {(userLevel !== 0 && (
            <h4 className="z-10 max-w-[90%] text-center text-3xl uppercase text-white">
              Achieve next <br /> level
            </h4>
          )) || (
            <h4 className="z-10 max-w-[90%] text-center text-3xl uppercase text-white">
              Buy your
              <br /> Membership Card
            </h4>
          )}
          <a href={userLevel !== 0 ? "#puzzle" : "/my-investments"}>
            <Button
              variant={"outline"}
              className=" border-primaryGold text-primaryGold dark:hover:bg-primaryGold"
            >
              {(userLevel !== 0 && "See your progress") || "Buy now"}
            </Button>
          </a>
        </div>
      )}
    </div>
  );
};

type CarouselProps =
  | {
      id: string;
      className?: string;
      title?: ReactNode;
      prevNavWhite?: boolean;
      items?: InvestmentProps[];
      isLevelDivided: false;
      currentLevel?: string;
      seeMoreLabel?: string;
      seeMoreLink?: string;
      seeMoreMr?: string;
      userAddress: Address;
      slidesPerView?: number;
    }
  | {
      id: string;
      className?: string;
      title?: ReactNode;
      prevNavWhite?: boolean;
      items?: InvestmentProps[];
      isLevelDivided: true;
      currentLevel: string;
      seeMoreLabel?: string;
      seeMoreLink?: string;
      seeMoreMr?: string;
      userAddress: Address;
      slidesPerView?: number;
    };

const Carousel: FC<CarouselProps> = ({
  id,
  className,
  title,
  prevNavWhite,
  seeMoreLabel,
  seeMoreLink,
  seeMoreMr,
  items,
  userAddress,
  isLevelDivided,
  currentLevel,
  slidesPerView = 4,
}) => {
  const SlCoreContract = {
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
  };
  const {
    data: userLevel,
    error,
    isLoading,
  } = useContractRead({
    ...SlCoreContract,
    functionName: "whichLevelUserHas",
    args: [userAddress],
  });

  const [currentSlider, setcurrentSlider] = useState(0);

  const { isAboveMd, isBelowMd } = useBreakpoint("md");

  const handleSlideChange = (swiper: any) => {
    setcurrentSlider(swiper.activeIndex);
  };

  const zustand = useInvestments((state) => state.investments);

  if (!items) {
    items = zustand;
  }

  if (isLevelDivided) {
    items = items?.filter((i) => i.level.title === currentLevel);
  }

  return (
    <div className={className ?? ""}>
      <div className="mx-auto flex justify-between">
        {title && (
          <div className="self-start pb-12 text-center font-medium uppercase md:ml-[58px] md:pb-[52px]">
            {title ?? ""}
          </div>
        )}
        {seeMoreLink && seeMoreLabel && (
          <div className={seeMoreMr ?? "md:mr-[260px]"}>
            <Link
              href={seeMoreLink}
              className="border-b-2 border-white text-sm uppercase text-white"
            >
              {seeMoreLabel}
            </Link>
          </div>
        )}
      </div>

      {items && (
        <div className="relative flex w-full items-center">
          {items.length > 2 && (
            <div
              className={cn(
                `absolute left-0 z-20 flex h-full items-center justify-center swiper-prev-${id}`
              )}
            >
              {
                <Image
                  src={
                    prevNavWhite
                      ? "/icons/pagination-previous.svg"
                      : "/icons/pagination-previous-black.svg"
                  }
                  width={38}
                  height={38}
                  alt="Previous"
                />
              }
            </div>
          )}
          {items.length > 2 && (
            <div
              className={cn(
                `absolute right-0 z-20 flex h-full items-center rounded-r-md bg-gradient-to-r from-transparent  to-black px-3 md:-mr-[58px] swiper-next-${id}  `
              )}
            >
              {
                <Image
                  src="/icons/pagination-next.svg"
                  width={38}
                  height={38}
                  alt="Next"
                />
              }
            </div>
          )}
          <section
            className={cn(
              " relative z-10  flex w-full flex-col items-center md:ml-[58px]"
            )}
          >
            <div className="swiper-wrapper relative z-10 flex w-1/2 ">
              <Swiper
                modules={[Navigation, A11y]}
                className="swiper w-full"
                spaceBetween={24}
                centeredSlides={isAboveMd ? false : true}
                slidesPerView={isAboveMd ? slidesPerView : "auto"}
                navigation={{
                  nextEl: `.swiper-next-${id}`,
                  prevEl: `.swiper-prev-${id}`,
                }}
                updateOnWindowResize
                observer
                observeParents
                onSlideChange={handleSlideChange}
              >
                {items.map((item, index) => (
                  <SwiperSlide key={index} className="">
                    <CarouselItem
                      title={item.car?.title}
                      image={item.car?.cover?.url}
                      price={item.totalInvestment.toString()}
                      address={item.address}
                      level={item.level.title}
                      userLevel={Number(userLevel)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Carousel;
