import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState, type FC } from "react";
import { NumericFormat } from "react-number-format";
import { A11y, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  type Address,
} from "wagmi";
import { type PuzzleProps } from "~/@types/Puzzle";
import { FactoryABI, SLCoreABI, SLLogicsABI } from "~/utils/abis";
import useGetUserPuzzlePieces from "../hooks/useGetUserPuzzlePieces";
import { cn } from "../lib/utils";
import { CarouselItem } from "./puzzle/Carousel";
import Level from "./puzzle/Level";
import { Button } from "./ui/Button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

function noDecimals(value: number) {
  return value / 10 ** 6;
}

const Puzzle: FC<PuzzleProps> = ({
  className,
  isConnected,
  userAddress,
  puzzlePieces,
  dbLevels,
}) => {
  const [userCanClaimPiece, setUserCanClaimPiece] = useState(false);
  const [userCanClaimLevel, setUserCanClaimLevel] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleSlideChange = (swiper: { activeIndex: number }) => {
    setCurrentLevel(swiper.activeIndex + 1);
  };

  const SlCoreContract = {
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
  };

  const SlFactoryContract = {
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryABI,
  };

  const SlLogicsContract = {
    address: process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as Address,
    abi: SLLogicsABI,
  };

  // const { isSuccess: userAllowedLevel, error: errorUserLevel } =
  //   useContractRead({
  //     address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //     abi: SLCoreABI,
  //     functionName: "_userAllowedToBurnPuzzle",
  //     args: [userAddress, 30],
  //     // onSettled(data, error) {
  //     //   if (!error) {
  //     //     setUserCanClaimLevel(true);
  //     //   }
  //     // },
  //   });

  let { data } = useContractReads({
    contracts: [
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel", // 0
        args: [userAddress, BigNumber.from(1)],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel", // 1
        args: [userAddress, BigNumber.from(2)],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel", // 2
        args: [userAddress, BigNumber.from(3)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel", // 3
        args: [userAddress, BigNumber.from(1)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel", // 4
        args: [userAddress, BigNumber.from(2)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel", // 5
        args: [userAddress, BigNumber.from(3)],
      },
      {
        ...SlCoreContract,
        functionName: "whichLevelUserHas", // 6
        args: [userAddress],
      },
      // {
      //   ...SlLogicsContract,
      //   functionName: "_userAllowedToClaimPiece",
      //   chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
      //   args: [userAddress, 1, 1, 0],
      // },
    ],
    watch: true,
    onError(error) {
      console.log("Error", error);
    },
  });

  data = data ?? [];

  const {
    userPuzzlePieces,
    userPieces,
    userTotalPieces,
    claimPieceProgressValue,
    claimPieceProgress,
  } = useGetUserPuzzlePieces({
    userAddress,
    level: currentLevel,
    totalInvested: data?.[2 + currentLevel] as BigNumber,
    // watch: true,
  });

  // console.log("data>>>>>", data);
  // console.log("currentLEvel == data[6]?????>>>>", currentLevel == data[6]);

  const { data: dataUserAllowed, error: errorUserAllowed } = useContractRead({
    ...SlLogicsContract,
    functionName: "userAllowedToClaimPiece",
    args: [
      userAddress,
      BigNumber.from(currentLevel),
      data?.[6] as BigNumber,
      data?.[currentLevel - 1] as BigNumber,
    ],
    // watch: true,
    enabled: data && currentLevel === data?.[6]?.toNumber(),
    onSettled(data, error) {
      console.log("Erro??>>>>>", error);

      if (!error) {
        // data[6] == currentLevel
        console.log("claimPiece>>>>> TRUE");

        setUserCanClaimPiece(true);
      } else {
        console.log("claimPiece>>>>> FALSE");
        //setUserCanClaimPiece(false);
      }
    },
  });

  const { config: configClaimPiece } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "claimPiece",
    enabled: userCanClaimPiece,
    onError(err) {
      console.log(err);
    },
    // onSuccess() {
    //   toast.success("Puzzle reivindicado com sucesso!");
    // },
  });

  const { write: claimPiece, isLoading: isLoadingClaimPiece } =
    useContractWrite(configClaimPiece);

  const { config: configClaimLevel } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "claimLevel",
    enabled:
      Number(data?.[currentLevel - 1]) > 9 &&
      data?.[6]?.toNumber() == currentLevel,
  });

  const { write: claimLevel, isLoading: isLoadingClaimLevel } =
    useContractWrite(configClaimLevel);
  // console.log("invested>>>", BigNumber.from(data[3]).toNumber());
  // console.log("userHas>>>", data[6]?.toNumber());
  // console.log("userCanClaimPiece>>", userCanClaimPiece);
  // console.log("configClaimLevel>>", configClaimLevel);

  // console.log("dataUserAllowed", dataUserAllowed);
  // console.log("userPieces>>>", data[currentLevel - 1]);

  const levels = dbLevels.map((dbLevel, idx) => ({
    title: dbLevel.basicLevel.title,
    locked: data?.[6]?.lt(idx + 1),
    profitRange: dbLevel.profitRange,
    description: dbLevel.description,
    progress: ((userPieces.length / 10) * 100).toFixed(2),
    invested: noDecimals(Number(data?.[3 + idx])),
    collected: userPieces.length.toString(),
    nft: dbLevel.nft?.url,
  }));

  const [profitNotification, setProfitNotification] = useState(true);

  useEffect(() => {
    // async function callContract() {
    //   const provider = ethers.getDefaultProvider();
    //   const contract = new ethers.Contract(
    //     process.env.NEXT_PUBLIC_LOGICS_ADDRESS as Address,
    //     SLLogicsABI,
    //     provider
    //   );
    //   const works = await contract.userAllowedToClaimPiece(
    //     userAddress,
    //     BigNumber.from(currentLevel),
    //     BigNumber.from(currentLevel), // data?.[6] as BigNumber,
    //     BigNumber.from(3) // data?.[currentLevel - 1] as BigNumber,
    //   );
    //   console.log(works);
    // }
    // void callContract();
    // console.log(userPieces);
    // console.log(userPuzzlePieces);
    // console.log("userAddress", userAddress);
    // console.log("currentLevel", currentLevel);
    // console.log("data?.[6]", data?.[6].toNumber());
    // console.log("data[currentLevel - 1]", data[currentLevel - 1]?.toNumber());
    // console.log("sllogics", process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS);
    // console.log("puzzle", process.env.NEXT_PUBLIC_PUZZLE_ADDRESS);
    // console.log(
    //   "debug",
    //   data?.[6].toNumber(),
    //   "/",
    //   data?.[currentLevel - 1]?.toNumber(),
    //   "/",
    //   currentLevel,
    //   "/",
    //   userAddress,
    //   "/",
    //   "dataUserAllowed",
    //   dataUserAllowed
    // );
    // console.log(data[6].toNumber());
    // console.log(currentLevel);
  }, [currentLevel]);

  return (
    <section
      id="puzzle"
      className={cn("mx-auto flex w-full max-w-[1338px] flex-col", className)}
    >
      {isConnected && (
        <h2 className="ml-[58px] pb-12 text-2xl font-medium uppercase">
          My Puzzle
        </h2>
      )}

      {/*<Tab.Group
        onChange={(index) => {
          setCurrentLevel(index + 1);
        }}
      >
        <Tab.List className="ml-[58px] flex w-full border-b border-b-gray-900/20">
          {levels.map((level) => (
            <Tab
              key={level.title}
              className={({ selected }) =>
                cn(
                  "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal leading-5 ",
                  "focus:outline-none",
                  selected
                    ? "border-b-4 border-primaryGreen bg-white font-semibold text-primaryGreen"
                    : " text-tabInactive hover:bg-white/[0.12] hover:text-tabInactive/80"
                )
              }
            >
              {(level.locked || !isConnected) && (
                <Image
                  alt="Locked"
                  src="/icons/locked.svg"
                  width={20}
                  height={20}
                />
              )}
              {level.title}{" "}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=" flex w-full max-w-screen-2xl">
          {levels.map((level, idx) => {
            return (
              <Tab.Panel
                key={idx}
                className={cn(
                  "w-full rounded-xl pb-[132px] pt-8",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                )}
              >
                <div className="flex flex-col gap-8">
                  {isConnected && (
                    <div className="ml-[58px] mr-[256px] flex flex-col gap-8">
                      {profitNotification && (
                        <div className="relative flex w-full flex-col items-start justify-end rounded-md bg-puzzleProfitNotice p-8">
                          <div className=" items absolute right-4 top-4 flex">
                            <Image
                              onClick={() => setProfitNotification(false)}
                              src="/icons/close.svg"
                              width={18}
                              height={18}
                              alt="Close"
                              className=" cursor-pointer"
                            />
                          </div>
                          <h3 className="ml-[124px]tracking-wider pb-4 text-2xl uppercase">
                            You have{" "}
                            <span className="text-primaryGold">
                              {level.profitRange.split("-")[0]}% to{" "}
                              {level.profitRange.split("-")[1]}% profit
                            </span>
                          </h3>

                          <p className="max-w-xl pb-4 font-light">
                            {level.description}
                          </p>
                          {idx < 2 && (
                            <span className="text-xs font-medium uppercase">
                              Next level:{" "}
                              {levels.at(idx + 1).profitRange.split("-")[0]}% to{" "}
                              {levels.at(idx + 1).profitRange.split("-")[1]}%{" "}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-6">
                        <div className="flex gap-3">
                          <p className="text-md">
                            Progress:{" "}
                            <span className="font-medium">
                              {level.progress}%
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <p className="text-md">
                            Invested:{" "}
                            <span className="font-medium">
                              {level.invested}$
                            </span>
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <p className="text-md">
                            Collected:{" "}
                            <span className="font-medium">
                              {level.collected}
                            </span>{" "}
                            | 10
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-6">
                        <div className="bottom-0 left-0 flex h-[6px] w-full rounded-md bg-progressBackground">
                          <div
                            className={` rounded-md bg-progressHighlight`}
                            style={{ width: `${level.progress}%` }}
                          ></div>
                        </div>
                        <Button
                          onClick={claimPiece}
                          className="whitespace-nowrap px-12"
                          variant="outline"
                          disabled={!userCanClaimPiece}
                        >
                          {isLoadingClaimPiece ? "Loading..." : `Claim Piece`}
                        </Button>
                        {idx < 2 && (
                          <Button
                            onClick={claimLevel}
                            className="whitespace-nowrap px-12"
                            variant="outline"
                            disabled={
                              Number(data[0]) < 10 ||
                              (data[6] as number) > idx + 1
                            }
                          >
                            Claim Level {idx + 2}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {!level.locked && (
                    <Carousel
                      className="pt-5"
                      id={idx.toString()}
                      isConnected={isConnected}
                      userItems={userPuzzlePieces}
                      items={puzzlePieces}
                      // items={investmentData.filter(
                      //   (i) => i.status == investmentStatus
                      // )}
                    />
                  )}
                </div>
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group> */}
      {/* {currentLevel < 2 && (
        <Button
          onClick={claimLevel}
          className="whitespace-nowrap px-12"
          variant="outline"
          disabled={data?.[0].lt(10) || data?.[6].gt(currentLevel + 1)}
        >
          Claim Level {currentLevel + 1}
        </Button>
      )} */}
      {/* <Carousel
        className="pt-5"
        id="1"
        isConnected={isConnected}
        userItems={userPuzzlePieces}
        items={puzzlePieces}
      /> */}
      {isConnected && (
        <div className="relative ml-[-70px] flex max-w-[1408px] items-center overflow-hidden">
          <div
            className={`swiper-prev-22 absolute left-0  z-20 flex h-full items-start justify-center pl-16 pt-[190px]`}
          >
            {currentLevel !== 1 && (
              <Image
                src={"/icons/pagination-previous-black.svg"}
                width={38}
                height={38}
                alt="Previous"
              />
            )}
          </div>
          <section
            className={cn(" relative z-10 flex w-full flex-col items-center ")}
          >
            <div className="swiper-wrapper relative z-10 flex ">
              <Swiper
                modules={[Navigation, A11y]}
                className="swiper w-full"
                spaceBetween={80}
                slidesPerView={1.2}
                navigation={{
                  nextEl: `.swiper-next-22`,
                  prevEl: `.swiper-prev-22`,
                }}
                updateOnWindowResize
                observer
                observeParents
                // initialSlide={0}
                // loop
                centeredSlides
                onSlideChange={(swiperCore) => {
                  const { activeIndex } = swiperCore;
                  setCurrentLevel(activeIndex + 1);
                }}
              >
                {dbLevels.map((level, idx) => (
                  <SwiperSlide
                    key={level.basicLevel.title}
                    className="flex items-center justify-center  "
                  >
                    <Level
                      level={idx + 1}
                      userLevel={data?.[6]?.toNumber() as number}
                      bg={level.bg.url}
                      description={level.description}
                      profitRange={level.profitRange}
                      nextProfitRange={
                        dbLevels?.at(idx + 1)?.profitRange as string
                      }
                      userPieces={userPieces}
                      claimLevel={claimLevel}
                    />
                    <div className="mt-16 flex flex-col">
                      {/* <h2 className="pb-12  text-2xl font-medium uppercase">
                        My Achievements
                      </h2> */}

                      <div className="grid max-w-6xl grid-cols-1 gap-6 pb-36 md:grid-cols-4">
                        {data?.[6]?.gt(currentLevel) ? (
                          <div className="h-90 relative col-span-2 flex flex-col items-center justify-between rounded-md bg-neutral-100">
                            <div
                              className="absolute left-0 top-0 h-full w-full  rounded-md border-2 border-white"
                              style={{
                                boxShadow:
                                  "4px 7px 30px 0px rgba(195, 162, 121, 1)",
                              }}
                            ></div>
                            <div className="absolute left-0 top-0 h-full w-full rounded-lg border-4 border-white bg-zinc-300">
                              <Image
                                alt="NFT"
                                src={dbLevels.at(idx)?.nft?.url as string}
                                // width={498}
                                // height={383}
                                fill
                                className="rounded-[5px]"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          </div>
                        ) : (
                          // </div>
                          <div className="h-90 relative flex flex-col items-center justify-between rounded-md bg-neutral-100">
                            <h2 className="pt-6 text-center text-[24px] font-semibold uppercase leading-normal tracking-wider text-black">
                              Your
                              <br />
                              next NFT
                            </h2>
                            <div className="flex flex-col items-center justify-center gap-3">
                              <span className=" text-center text-[14px] font-normal leading-none tracking-wide text-neutral-600">
                                Progress
                              </span>
                              <span className="text-center text-[40px] font-light leading-10 tracking-widest text-black">
                                <NumericFormat
                                  value={claimPieceProgress?.toString()}
                                  displayType="text"
                                  fixedDecimalScale
                                  decimalSeparator="."
                                  thousandSeparator=","
                                  decimalScale={0}
                                  suffix=" %"
                                />
                              </span>
                              <span className="text-center text-[14px] font-normal leading-none tracking-wide text-neutral-600">
                                You&apos;re almost there!
                              </span>
                              <span className="text-[16px] font-normal leading-normal text-neutral-600">
                                <span className="text-[16px] font-semibold leading-normal text-black">
                                  <NumericFormat
                                    value={
                                      claimPieceProgressValue &&
                                      ethers.utils.formatUnits(
                                        claimPieceProgressValue.toNumber(),
                                        6
                                      )
                                    }
                                    displayType="text"
                                    fixedDecimalScale
                                    decimalSeparator="."
                                    thousandSeparator=","
                                    decimalScale={2}
                                    prefix="$ "
                                  />
                                </span>{" "}
                                |{" "}
                                <NumericFormat
                                  value={(5000 * currentLevel).toString()}
                                  displayType="text"
                                  fixedDecimalScale
                                  decimalSeparator="."
                                  thousandSeparator=","
                                  decimalScale={2}
                                  prefix="$ "
                                />
                              </span>
                            </div>
                            <Button
                              onClick={claimPiece}
                              className="whitespace-nowrap border-emerald-700 px-12 text-emerald-700"
                              variant="outline"
                              disabled={!userCanClaimPiece}
                            >
                              {isLoadingClaimPiece
                                ? "Loading..."
                                : `Claim Piece`}
                            </Button>

                            <div className="bottom-0 left-0 flex h-3 w-full self-end rounded-b-md bg-progressBackground">
                              <div
                                className={cn(
                                  "rounded-bl-md bg-progressHighlight",
                                  Math.abs(claimPieceProgress?.toNumber()) >=
                                    100
                                    ? "rounded-br-md"
                                    : ""
                                )}
                                style={{
                                  width: `${
                                    Math.abs(claimPieceProgress?.toNumber()) >=
                                    100
                                      ? 100
                                      : Math.abs(claimPieceProgress?.toNumber())
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {puzzlePieces
                          .slice((currentLevel - 1) * 10, currentLevel * 10)
                          .map((puzzle, idx) => (
                            <div
                              key={puzzle.tokenid}
                              className="relative rounded-md border-2 border-[#8C9592/20]"
                            >
                              <CarouselItem
                                title={puzzle.title}
                                amount={
                                  userPuzzlePieces
                                    ?.at(idx)
                                    ?.toNumber() as number
                                }
                                isConnected={isConnected}
                                image={
                                  data?.[6]?.gt(currentLevel) ||
                                  ((userPuzzlePieces &&
                                    userPuzzlePieces.at(idx)?.toNumber()) ||
                                    0) > 0
                                    ? puzzle?.imageCollected?.url
                                    : puzzle.image.url
                                }
                              />
                            </div>
                          ))}
                        {currentLevel < 3 && !data?.[6]?.gt(currentLevel) && (
                          <div className="h-90 relative flex flex-col items-center justify-center rounded-md border-2 border-[#C3A279] align-middle">
                            {(userPieces.length < 9 && (
                              <div className="flex flex-col items-center justify-center align-middle ">
                                <Image
                                  src="/nfts/next_level.svg"
                                  alt="Symbol"
                                  width={165}
                                  height={165}
                                  className="mb-2"
                                />
                                <div className="m-2 flex flex-col items-center justify-center text-primaryGold">
                                  <h3>NFT Level {idx + 2}</h3>
                                  <p className="text-center">
                                    You can claim it when you get 10 different
                                    pieces
                                  </p>
                                </div>
                              </div>
                            )) || (
                              <div className="flex flex-col items-center justify-center align-middle ">
                                <Image
                                  src="/nfts/car_completed.svg"
                                  alt="Symbol"
                                  width={165}
                                  height={165}
                                  className="mb-2"
                                />
                                <div className="m-2 flex flex-col items-center justify-center text-primaryGold">
                                  <h3>NFT Level {idx + 2}</h3>
                                  <Button
                                    variant={"outline"}
                                    onClick={claimLevel}
                                    disabled={
                                      userPieces.length < 10 ||
                                      (data?.[6]?.toNumber() as number) >
                                        idx + 2
                                    }
                                    className={cn(
                                      "mt-[32px] border-primaryGold bg-primaryGold font-sans text-[14px] font-medium text-white hover:bg-primaryGold",
                                      (data?.[6]?.toNumber() as number) >
                                        idx + 2
                                        ? "bg-primaryGold text-white"
                                        : ""
                                    )}
                                  >
                                    Claim Level {idx + 2}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          <div
            className={cn(
              "swiper-next-22 absolute right-0 z-20 flex h-full items-start pr-16 pt-[195px]",
              currentLevel > 2 ? "hidden" : ""
            )}
          >
            <Image
              src="/icons/pagination-next-black.svg"
              // className="fill-black text-black"
              width={38}
              height={38}
              alt="Next"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Puzzle;
