import Image from "next/image";
import { FC, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Navigation, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ConnectKitButton } from "connectkit";

interface CarouselItemProps {
  title: string;
  image: string;
  amount: number;
  isConnected: boolean;
}

const CarouselItem = ({
  title,
  image,
  amount,
  isConnected,
}: CarouselItemProps) => {
  if (isConnected)
    return (
      <div className="flex group justify-center items-center flex-col w-full rounded-md">
        <div className="w-full min-h-full justify-center text-white items-center flex-col flex z-20 absolute rounded-md opacity-0 bg-primaryGold group-hover:opacity-100">
          <span className="font-normal tracking-widest  uppercase text-center text-md">
            {title}
          </span>
          <span className="font-medium text-xl">LOREM</span>
        </div>
        {amount > 0 ? (
          <div
            className={cn(
              "flex flex-col w-full justify-start items-center min-h-[396px] rounded-md bg-center bg-cover relative gap-3",
              image
            )}
          >
            <div className="flex z-10 relative gap-3 pb-6 justify-end items-start w-full">
              <div className="flex gap-3 text-primaryGold justify-center items-center p-3">
                <div className="font-normal flex justify-center items-center text-center text-lg h-10 w-10 border border-primaryGold rounded-full">
                  {amount}
                  <span className="text-md">x</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex w-full flex-col justify-center hover:text-white bg-contactBackground items-center min-h-[396px] rounded-md gap-3"
            )}
          >
            <div className="flex gap-3 justify-center items-center w-full">
              <div className="font-normal tracking-widest text-black uppercase flex flex-col justify-center items-center text-center text-md">
                Next NFT
                <span className="font-medium text-xl">{title}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  if (!isConnected)
    return (
      <div className="flex group justify-center items-center flex-col w-full rounded-md">
        <div className="w-full min-h-full justify-center text-white items-center flex-col flex z-20 absolute rounded-md opacity-0 p-8 bg-primaryGreen group-hover:opacity-100">
          <h3 className="font-medium tracking-widest text-center text-2xl pb-4">
            Buy your entry ticket
          </h3>
          <p className="pb-8 text-center">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam
          </p>
          <ConnectKitButton
            label="CONNECT WALLET"
            customTheme={{
              "--ck-focus-color": "rgb(15, 85, 62)",
              "--ck-connectbutton-font-size": "14px",
              "--ck-connectbutton-font-weight": "500",
              "--ck-connectbutton-color": "rgb(20,116,84)",
              "--ck-connectbutton-background": "rgb(255,255,255)",
              "--ck-connectbutton-hover-background": "rgb(20,116,84)",
              "--ck-connectbutton-hover-color": "rgb(255,255,255)",
              "--ck-connectbutton-border-radius": "6px",
              "--ck-connectbutton-box-shadow": "inset 0 0 0 1px rgb(20,116,84)",
            }}
          />
        </div>

        <div
          className={cn(
            "flex w-full flex-col justify-center hover:text-white bg-contactBackground items-center min-h-[396px] rounded-md gap-3"
          )}
        >
          <div className="flex gap-3 justify-center items-center w-full">
            <div className="font-normal tracking-widest text-black uppercase flex flex-col justify-center items-center text-center text-md">
              Next NFT
              <span className="font-medium text-xl">{title}</span>
            </div>
          </div>
        </div>
      </div>
    );
};

interface CarouselProps {
  id: string;
  isConnected: boolean;
  className?: string;
  title?: ReactNode;
  prevNavWhite?: boolean;
  items?: ReactNode;
}

const items = [
  {
    title: "Engine",
    image: "bg-[url('/nfts/puzzle-1.png')]",
    amount: 1,
  },
  {
    title: "Wheel",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 2,
  },
  {
    title: "Grill",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 5,
  },
  {
    title: "Body",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 0,
  },
  {
    title: "Chevrolet 200",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 0,
  },
];

const Carousel: FC<CarouselProps> = ({
  id,
  isConnected,
  className,
  title,
  prevNavWhite,
}) => {
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
            " ml-[58px] z-10  relative items-center flex flex-col w-full"
          )}
        >
          <div className="flex relative z-10 w-1/2 swiper-wrapper ">
            <Swiper
              modules={[Navigation, A11y]}
              className="swiper "
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
                    isConnected={isConnected}
                    title={item.title}
                    image={item.image}
                    amount={item.amount}
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
