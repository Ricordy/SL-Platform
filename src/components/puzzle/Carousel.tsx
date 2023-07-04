import Image from "next/image";
import { useState, type FC, type ReactNode } from "react";
import { A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "../../lib/utils";

// Import Swiper styles
import { type BigNumber } from "ethers";
import "swiper/css";

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
      <div className="group flex w-full flex-col items-center justify-center rounded-md">
        <div className="absolute z-20 flex min-h-full w-full flex-col items-center justify-center rounded-md bg-primaryGold text-white opacity-0 group-hover:opacity-100">
          <span className="text-md text-center  font-normal uppercase tracking-widest">
            {title}
          </span>
          <span className="text-xl font-medium">LOREM</span>
        </div>
        {amount > 0 ? (
          <div
            className={cn(
              "relative flex min-h-[396px] w-full flex-col items-center justify-start gap-3 rounded-md bg-cover bg-center"
            )}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="relative z-10 flex w-full items-start justify-end gap-3 pb-6">
              <div className="flex items-center justify-center gap-3 p-3 text-primaryGold">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primaryGold text-center text-lg font-normal">
                  {amount}
                  <span className="text-md">x</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "flex min-h-[396px] w-full flex-col items-center justify-center gap-3 rounded-md bg-contactBackground hover:text-white"
            )}
          >
            <div className="flex w-full items-center justify-center gap-3">
              <div className="text-md flex flex-col items-center justify-center text-center font-normal uppercase tracking-widest text-black">
                Next NFT
                <span className="text-xl font-medium">{title}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  if (!isConnected)
    return (
      <div className="group flex w-full flex-col items-center justify-center rounded-md">
        <div className="absolute z-20 flex min-h-full w-full flex-col items-center justify-center rounded-md bg-primaryGreen p-8 text-white opacity-0 group-hover:opacity-100">
          <h3 className="pb-4 text-center text-2xl font-medium tracking-widest">
            Buy your entry ticket
          </h3>
          <p className="pb-8 text-center">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam
          </p>
          {/* <ConnectKitButton
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
          /> */}
        </div>

        <div
          className={cn(
            "flex min-h-[396px] w-full flex-col items-center justify-center gap-3 rounded-md bg-contactBackground hover:text-white"
          )}
        >
          <div className="flex w-full items-center justify-center gap-3">
            <div className="text-md flex flex-col items-center justify-center text-center font-normal uppercase tracking-widest text-black">
              Next NFT
              <span className="text-xl font-medium">{title}</span>
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
  userItems?: readonly BigNumber[];
  items: {
    tokenid: number;
    title: string;
    image: {
      url: string;
    };
  }[];
}

const localItems = [
  {
    id: 1,
    title: "Engine",
    image: "bg-[url('/nfts/puzzle-1.png')]",
    amount: 1,
  },
  {
    id: 2,
    title: "Wheel",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 2,
  },
  {
    id: 3,
    title: "Grill",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 5,
  },
  {
    id: 4,
    title: "Body",
    image: "bg-[url('/nfts/puzzle-2.png')]",
    amount: 0,
  },
  {
    id: 5,
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
  items,
  userItems,
}) => {
  const [currentSlider, setcurrentSlider] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setcurrentSlider(swiper.activeIndex);
  };

  return (
    <div className={className ?? ""}>
      {title && (
        <div className="ml-[58px] self-start pb-6 uppercase">{title ?? ""}</div>
      )}
      <div className="relative flex max-w-[1338px] items-center overflow-hidden">
        <div
          className={`absolute  left-0 z-20 flex items-center justify-center swiper-prev-${id}`}
        >
          <Image
            src={
              (
                currentSlider == 0 || currentSlider == items.length - 1
                  ? true
                  : false
              )
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
              onSlideChange={handleSlideChange}
            >
              {items?.map((item, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <CarouselItem
                      isConnected={isConnected}
                      title={item.title}
                      image={item.image.url}
                      amount={
                        userItems && userItems.length > 0
                          ? userItems[index].toNumber()
                          : 0
                      }
                    />
                  </SwiperSlide>
                );
              })}
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
