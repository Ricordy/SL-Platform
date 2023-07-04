import Image from "next/image";
import Link from "next/link";
import { type FC, type ReactNode } from "react";
import { A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "../lib/utils";

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

export const CarouselItem = ({
  title,
  image,
  price,
  address,
}: CarouselItemProps) => {
  return (
    <div className=" w-full rounded-md">
      <div
        className={cn(
          "relative flex min-h-[394px] w-full flex-col items-center justify-end gap-4 rounded-md bg-cover bg-center"
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        <h4 className="z-10 text-3xl uppercase text-white">{title}</h4>
        <div className="relative z-10 flex w-full justify-center gap-3 pb-8">
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
        <div className="absolute z-0 flex min-h-[200px] w-full rounded-b-md bg-[url('/projects/car-gradient.svg')] bg-cover"></div>
      </div>
    </div>
  );
};

interface CarouselProps {
  id: string;
  className?: string;
  title?: ReactNode;
  prevNavWhite?: boolean;
  items?: Object[];
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
      <div className="mx-auto flex justify-between">
        {title && (
          <div className="ml-[58px] self-start pb-[52px] font-medium uppercase">
            {title ?? ""}
          </div>
        )}
        {seeMoreLink && seeMoreLabel && (
          <div className=" mr-[58px]">
            <Link href={seeMoreLink}>
              <a className="border-b-2 border-white text-sm uppercase text-white">
                {seeMoreLabel}
              </a>
            </Link>
          </div>
        )}
      </div>
      <div className="relative flex max-w-[1338px] items-center overflow-hidden">
        <div
          className={`absolute  left-0 z-20 flex items-center justify-center swiper-prev-${id}`}
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
            " relative z-10  ml-[58px] flex w-full flex-col items-center"
          )}
        >
          <div className="swiper-wrapper relative z-10 flex w-1/2 ">
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
              {items?.map((item, index) => (
                <SwiperSlide key={index}>
                  <CarouselItem
                    // title="my title"
                    // image="/projects/car-1.jpg"
                    // price="39595"
                    title={item.basicInvestment.car.basicInfo.title}
                    image={item.basicInvestment.car.basicInfo.cover.url}
                    price={item.basicInvestment.totalInvestment}
                    address={item.address}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
        <div
          className={`absolute right-0 z-20 flex h-full items-center bg-gradient-to-r from-transparent to-black pr-10 swiper-next-${id}`}
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
