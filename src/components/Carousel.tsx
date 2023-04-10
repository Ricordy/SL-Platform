import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
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
}

const CarouselItem = ({ title, image, price }: CarouselItemProps) => {
  return (
    <div className="flex flex-col w-full rounded-md">
      <div
        className={cn(
          "flex flex-col justify-end items-center min-h-[394px] rounded-md bg-cover relative gap-3",
          image
        )}
      >
        <h4 className="z-10 uppercase text-3xl text-white">{title}</h4>
        <div className="flex z-10 relative gap-3 pb-6 justify-center w-full">
          <div className="flex">
            <div className="flex gap-3">
              <span className="font-light text-white">{price}</span>
            </div>
          </div>
        </div>
        <div className="flex z-0 absolute rounded-b-md w-full min-h-[200px] bg-[url('/projects/car-gradient.svg')] bg-cover"></div>
      </div>
    </div>
  );
};

interface CarouselProps {
  id: string;
  className?: string;
}

const items = [
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

const Carousel: FC<CarouselProps> = ({ id, className }) => {
  return (
    <div className="relative max-w-[1338px] overflow-hidden flex items-center">
      <div
        className={`flex  absolute items-center justify-center left-0 z-20 swiper-prev-${id}`}
      >
        <Image
          src="/icons/pagination-previous.svg"
          width={38}
          height={38}
          alt="Previous"
        />
      </div>

      <section
        className={cn(
          " ml-[58px] z-10 relative items-center flex flex-col w-full",
          className
        )}
      >
        <div className="flex relative z-10 w-1/2 swiper-wrapper ">
          <Swiper
            modules={[Navigation, A11y]}
            className="swiper "
            spaceBetween={24}
            slidesPerView={4}
            // pagination={{ clickable: true }}
            // navigation={true}
            // pagination={{
            //   clickable: true,
            //   el: `.swiper-pagination-${id}`,
            // }}
            navigation={{
              nextEl: `.swiper-next-${id}`,
              prevEl: `.swiper-prev-${id}`,
            }}
            updateOnWindowResize
            observer
            observeParents
            initialSlide={0}
            // loop={true}
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <CarouselItem
                  title={item.title}
                  image={item.image}
                  price={item.price}
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
  );
};

export default Carousel;
