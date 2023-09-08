import Image from "next/image";
import { useState, type FC, type ReactNode } from "react";
import { A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { cn } from "../lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useContractRead, type Address } from "wagmi";
import { investmentABI } from "~/utils/abis";
import { type InvestmentProps } from "../pages/my-investments";
import { NumericFormat } from "react-number-format";
import NoInvestments from "./NoInvestments";
// import "swiper/css/navigation";

export interface CarouselItemProps {
  address?: string;
  title: string;
  image: string;
  status: string;
  price: string;
  level?: string;
}

function noDecimal(value) {
  return value / 10 ** 6;
}

const CarouselItem = ({
  address,
  title,
  image,
  status,
  price,
  level,
}: CarouselItemProps) => {
  // console.log("addresss>>>>>", address);

  const { data: contractProgress } = useContractRead({
    address: address as Address,
    abi: investmentABI,
    functionName: "totalSupply",
    select: (data) => Number(data),
  });

  return (
    <div className="w-full  rounded-md">
      <div
        className={cn(
          "relative flex min-h-[358px] w-full flex-col items-center justify-end gap-3 rounded-md bg-cover",
          address === undefined ? "mb-96" : "mb-0"
        )}
        style={{ backgroundImage: `url(${image})` }}
      >
        {level && (
          <div className="absolute right-3 top-2 z-10 rounded-lg bg-white px-2 py-1 text-xs text-black">
            {level}
          </div>
        )}
        <h4 className="z-10 text-center text-2xl font-medium uppercase text-white">
          {title}
        </h4>
        <div className="relative z-10 mt-[16px] flex w-full justify-around gap-3 pb-6 align-middle">
          <div className="flex w-full items-center justify-center gap-4">
            <div className="flex h-fit w-full flex-col border-r-2  pl-4">
              <h4 className="  text-white">Status:</h4>
              <span className="font-bold text-white">{status}</span>
            </div>
            <div className=" flex w-full flex-col border-r-2">
              <h4 className="text-white">Price:</h4>
              <span className="font-bold text-white">
                <NumericFormat
                  value={price}
                  displayType="text"
                  thousandSeparator=","
                  decimalScale={2}
                  prefix="$"
                />
              </span>
            </div>
            <div className="flex h-fit w-full flex-col">
              <h4 className="text-white">Progress:</h4>
              <span className=" font-bold text-white">
                {String(
                  ((noDecimal(contractProgress) / Number(price)) * 100).toFixed(
                    2
                  )
                )}
                %
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 z-10 flex h-3 w-full rounded-b-md bg-[#DCDCDC]">
          <div
            className={` rounded-bl-md bg-progressHighlight`}
            style={{
              width: `${String(
                ((noDecimal(contractProgress) / Number(price)) * 100).toFixed(2)
              )}%`,
            }}
          ></div>
        </div>

        <div className="absolute z-0 flex min-h-[200px] w-full rounded-b-md bg-[url('/projects/car-gradient.svg')] bg-cover"></div>
        <a
          href={`/investment/${address}`}
          className={cn(
            "absolute inset-0 rounded-md",
            "focus:z-10 focus:outline-none focus:ring-2"
          )}
        />
      </div>
    </div>
  );
};

interface CarouselProps {
  id: string;
  className?: string;
  title?: ReactNode;
  prevNavWhite?: boolean;
  items?: InvestmentProps[];
}

const ProjectCarousel: FC<CarouselProps> = ({
  id,
  className,
  title,
  prevNavWhite,
  items,
}) => {
  const [contractAddress, setContractAddress] = useState();

  const [currentSlider, setcurrentSlider] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setcurrentSlider(swiper.activeIndex);
  };

  return (
    <div className={className ?? ""}>
      {title && (
        <div className="ml-[58px] self-start pb-[52px] uppercase">
          {title ?? ""}
        </div>
      )}

      <div className="relative flex max-w-[1338px] items-center overflow-hidden">
        <div
          className={`absolute  left-0 z-20 flex items-center justify-center swiper-prev-${id}`}
        >
          <Image
            src={
              (
                currentSlider == 0 || currentSlider == items?.length - 1
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
            " relative z-10 ml-[58px] flex w-full flex-col items-center"
          )}
        >
          <div className="swiper-wrapper relative z-10 w-full ">
            <Swiper
              modules={[Navigation, A11y]}
              className="swiper w-full"
              spaceBetween={24}
              slidesPerView={3}
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
              {items?.map((item, index) => (
                <SwiperSlide key={index}>
                  <CarouselItem
                    address={item.address}
                    title={item.basicInvestment.car.basicInfo.title ?? ""}
                    image={item.basicInvestment.car.basicInfo.cover.url ?? ""}
                    price={item.basicInvestment.totalInvestment}
                    status={
                      item.basicInvestment.investmentStatus ?? "Not woking"
                    }
                    level={item.level.basicLevel.title}
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

export default ProjectCarousel;