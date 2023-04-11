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

export interface CarouselItemProps {
  title: string;
  image: string;
  status: string;
  price: string;
  progress: string;
}

const CarouselItem = ({
  title,
  image,
  status,
  price,
  progress,
}: CarouselItemProps) => {
  return (
    <div className=" w-full rounded-md">
      <div
        className={cn(
          "flex flex-col w-full  justify-end items-center min-h-[394px] rounded-md bg-cover relative gap-3",
          image
        )}
      >
        <h4 className="z-10 uppercase text-2xl text-white">{title}</h4>
        <div className="flex z-10 relative gap-3 pb-6 justify-center w-full">
          <div className="flex gap-3 items-center">
            <div className="flex flex-col">
              <h4 className="text-white">Status:</h4>
              <span className="font-light text-white">{status}</span>
            </div>
            <div className="flex flex-col">
              <h4 className="text-white">Price:</h4>
              <span className="font-light text-white">{price}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-light text-white">
                {progress}% Finished
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#DCDCDC] h-3 w-full flex z-10 absolute bottom-0 left-0 rounded-b-md">
          <div
            className={` bg-progressHighlight rounded-bl-md`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
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
  items?: CarouselItemProps[];
}

const localItems = [
  {
    title: "Maserati 3500 GT",
    image: "bg-[url('/projects/car-1.jpg')]",
    price: "US$350.000",
    status: "Renewing",
    progress: "25",
  },
  {
    title: "Chevrolet 200",
    image: "bg-[url('/projects/car-2.jpg')]",
    price: "US$350.000",
    status: "Renewing",
    progress: "15",
  },

  {
    title: "Chevrolet 300",
    image: "bg-[url('/projects/car-3.jpg')]",
    price: "US$350.000",
    status: "Renewing",
    progress: "10",
  },
  {
    title: "Maserati 3500 GT",
    image: "bg-[url('/projects/car-1.jpg')]",
    price: "US$350.000",
    status: "Renewing",
    progress: "25",
  },
  {
    title: "Chevrolet 200",
    image: "bg-[url('/projects/car-2.jpg')]",
    price: "US$350.000",
    status: "Renewing",
    progress: "15",
  },
];

const ProjectCarousel: FC<CarouselProps> = ({
  id,
  className,
  title,
  prevNavWhite,
  items,
}) => {
  items = items ?? localItems;
  return (
    <div className={className ?? ""}>
      {title && (
        <div className="self-start ml-[58px] pb-6 uppercase">{title ?? ""}</div>
      )}
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
            " ml-[58px] z-10 relative items-center flex flex-col w-full"
          )}
        >
          <div className="relative w-full z-10 swiper-wrapper ">
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
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    progress={item.progress}
                    status={item.status}
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

export default ProjectCarousel;
