import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { cn } from "../lib/utils";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import "swiper/css/navigation";

interface CarouselItemProps {
  title: string;
  image: string;
  price: string;
  address?: string;
}

export const CarouselItem = ({ title, image, price, address}: CarouselItemProps) => {
  return (
    <div className=" w-full rounded-md">
      <div
        className={cn(
          "flex flex-col w-full justify-end items-center min-h-[394px] rounded-md bg-cover bg-center relative gap-4"
        )}
        style={{backgroundImage: `url(${image})`}}
      >
        <h4 className="z-10 uppercase text-3xl text-white">{title}</h4>
        <div className="flex z-10 relative gap-3 pb-8 justify-center w-full">
          <div className="flex">
            <div className="flex gap-3">
              <span className="font-light text-white">{price}</span>
            </div>
          </div>
        </div>
        <a
          href={`/investment/${address}`}
          className={cn(
            "absolute inset-0 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-2"
          )}
        />
        <div className="flex z-0 absolute rounded-b-md w-full min-h-[200px] bg-[url('/projects/car-gradient.svg')] bg-cover"></div>
      </div>
    </div>
  );
};

interface CarouselProps {
  id: string;
  className?: string;
  title?: ReactNode;
  prevNavWhite?: boolean;
  items?: ReactNode;
  seeMoreLabel?: string;
  seeMoreLink?: string;
}

export const carouselItems = [
  {
    title: "Maserati 3500 GT",
    image: "bg-[url('/projects/car-1.jpg')]",
    price: "US$350.000",
  },
  {
    title: "Chevrolet 200",
    image: "bg-[url('/projects/car-2.jpg')]",
    price: "US$350.000",
  },

  {
    title: "Chevrolet 300",
    image: "bg-[url('/projects/car-3.jpg')]",
    price: "US$350.000",
  },
  {
    title: "Maserati 3500 GT",
    image: "bg-[url('/projects/car-1.jpg')]",
    price: "US$350.000",
  },
  {
    title: "Chevrolet 200",
    image: "bg-[url('/projects/car-2.jpg')]",
    price: "US$350.000",
  },
];

const Carousel: FC<CarouselProps> = ({
  id,
  className,
  title,
  prevNavWhite,
  seeMoreLabel,
  seeMoreLink,
  items,
}) => {
  return (
    <div className={className ?? ""}>
      <div className="flex justify-between mx-auto">
        {title && (
          <div className="self-start font-medium ml-[58px] pb-[52px] uppercase">
            {title ?? ""}
          </div>
        )}
        {seeMoreLink && seeMoreLabel && (
          <div className=" mr-[58px]">
            <Link href={seeMoreLink}>
              <a className="border-b-2 border-white text-white uppercase text-sm">
                {seeMoreLabel}
              </a>
            </Link>
          </div>
        )}
      </div>
      <div className="relative max-w-[1338px] overflow-hidden flex items-center">
        <div
          className={`flex  absolute items-center justify-center left-0 z-20 swiper-prev-${id}`}
        >
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
        </div>
        <section
          className={cn(
            " ml-[58px] z-10  relative items-center flex flex-col w-full"
          )}
        >
          <div className="flex relative z-10 w-1/2 swiper-wrapper ">
            {/* {JSON.stringify(items)} */}
            <Swiper
              modules={[Navigation, A11y]}
              className="swiper w-full"
              spaceBetween={24}
              slidesPerView={4}
              navigation={{
                nextEl: `.swiper-next-${id}`,
                prevEl: `.swiper-prev-${id}`,
              }}
              updateOnWindowResize
              observer
              observeParents
              initialSlide={0}
              loop={true}
            >
              
              {items.map((item, index) => (
                <SwiperSlide key={index}>
                  <CarouselItem
                    // title="my title"
                    // image="/projects/car-1.jpg"
                    // price="39595"
                    title={item.basicInvestment.car.basicInfo.title}
                    image={item.basicInvestment.car.basicInfo.cover.url}
                    price={item.basicInvestment.totalInvestment}
                    address={item.basicInvestment.address}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
        <div
          className={`flex bg-gradient-to-r from-transparent to-black h-full absolute items-center right-0 pr-10 z-20 swiper-next-${id}`}
        >
          <Image
            src="/icons/pagination-next.svg"
            width={38}
            height={38}
            alt="Next"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
