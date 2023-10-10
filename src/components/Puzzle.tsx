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
  useContract,
  useSigner,
} from "wagmi";
import { type PuzzleProps } from "~/@types/Puzzle";
import { FactoryABI, SLCoreABI, SLLogicsABI } from "~/utils/abis";
import useGetUserPuzzlePieces from "../hooks/useGetUserPuzzlePieces";
import { cn, getPuzzleCollectionIds } from "../lib/utils";
import { CarouselItem } from "./puzzle/Carousel";
import Level from "./puzzle/Level";
import { Button } from "./ui/Button";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import { useBlockchainInfo, useGameContent } from "~/lib/zustand";

function noDecimals(value: number) {
  return value / 10 ** 6;
}

const Puzzle: FC<PuzzleProps> = ({ className, isConnected, userAddress }) => {
  const puzzlePieces = useGameContent((state) => state.pieces);
  const dbLevels = useGameContent((state) => state.levels);
  const [isLoadingClaimPiece, setIsLoadingClaimPiece] = useState(false);
  const [userCanClaimLevel, setUserCanClaimLevel] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const userLevel = useBlockchainInfo((state) => state.userLevel);
  const userTotalInvestedPerLevel = useBlockchainInfo(
    (state) => state.userTotalInvestedPerLevel
  );
  const userUniquePiecesPerLevel = useBlockchainInfo(
    (state) => state.userUniquePiecesPerLevel
  );

  const userAllowedToClaimPiece = useBlockchainInfo(
    (state) => state.userAllowedToClaimPiece
  );
  const fetchPuzzleInfo = useBlockchainInfo(
    (state: any) => state.fetchPuzzleInfo
  );

  const handleSlideChange = (swiper: { activeIndex: number }) => {
    setCurrentLevel(swiper.activeIndex + 1);
  };

  const { data: signerData } = useSigner();

  const SLCoreContract = useContract({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    signerOrProvider: signerData,
  });

  const {
    userPuzzlePieces,
    userPieces,
    claimPieceProgressValue,
    claimPieceProgress,
  } = useGetUserPuzzlePieces({
    userAddress,
    level: currentLevel,
    totalInvested: userTotalInvestedPerLevel?.[currentLevel - 1] as BigNumber,
    // watch: true,
  });

  // const { config: configClaimPiece } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //   abi: SLCoreABI,
  //   functionName: "claimPiece",
  //   enabled: userAllowedToClaimPiece && currentLevel === userLevel?.toNumber(),
  //   onError(err) {},
  //   onSuccess() {
  //     console.log("success");

  //     fetchPuzzleInfo(userAddress, userLevel);
  //   },
  // });

  // const { write: claimPiece, isLoading: isLoadingClaimPiece } =
  //   useContractWrite(configClaimPiece);

  // const { config: configClaimLevel } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
  //   abi: SLCoreABI,
  //   functionName: "claimLevel",
  //   enabled:
  //     Number(userUniquePiecesPerLevel?.[currentLevel - 1]) > 9 &&
  //     userLevel?.toNumber() == currentLevel,
  // });

  // const { write: claimLevel, isLoading: isLoadingClaimLevel } =
  //   useContractWrite(configClaimLevel);

  const actionClaimPiece = async (e: any) => {
    e.preventDefault();
    setIsLoadingClaimPiece(true);
    if (userAllowedToClaimPiece && currentLevel === userLevel?.toNumber()) {
      try {
        const results = await SLCoreContract?.claimPiece();
        const abc = await results?.wait();
      } catch (error) {}

      fetchPuzzleInfo(userAddress, userLevel);
    }
    setIsLoadingClaimPiece(false);
  };

  const actionClaimLevel = async (e: any) => {
    e.preventDefault();

    if (userAllowedToClaimPiece && currentLevel === userLevel?.toNumber()) {
      try {
        const results = await SLCoreContract?.claimLevel();
        const abc = await results?.wait();
      } catch (error) {}

      fetchPuzzleInfo(userAddress, userLevel);
    }
  };

  const levels = dbLevels?.map((dbLevel, idx) => ({
    title: dbLevel.basicLevel.title,
    locked: userLevel?.lt(idx + 1),
    profitRange: dbLevel.profitRange,
    description: dbLevel.description,
    progress: userPieces && ((userPieces.length / 10) * 100).toFixed(0),
    invested: noDecimals(Number(userTotalInvestedPerLevel?.[idx])),
    collected: userPieces && userPieces.length.toString(),
    nft: dbLevel.nft?.url,
  }));

  const [profitNotification, setProfitNotification] = useState(true);
  const { isAboveMd, isBelowMd } = useBreakpoint("md");

  // useEffect(() => {
  //   if (!userAllowedToClaimPiece || !userTotalInvestedPerLevel) {
  //     console.log("fetched");

  //     fetchPuzzleInfo(userAddress, userLevel);
  //   }
  //   return () => {};
  // }, []);

  return (
    <section
      id="puzzle"
      className={cn(
        "mx-auto flex w-full max-w-[1338px] flex-col px-6 md:px-0",
        className
      )}
    >
      {isConnected && (
        <h2 className="pb-12 text-2xl font-medium uppercase md:ml-[58px]">
          My Puzzle
        </h2>
      )}

      {isConnected && (
        <div className="relative flex max-w-[1408px] items-center overflow-hidden md:ml-[-70px]">
          <div
            className={`swiper-prev-22 absolute left-0 z-20 flex h-full items-start justify-center pl-3 pt-6 md:pl-16 md:pt-[190px]`}
          >
            {currentLevel !== 1 && (
              <Image
                src={
                  isAboveMd || levels.at(currentLevel - 1)?.locked
                    ? "/icons/pagination-previous-black.svg"
                    : "/icons/pagination-previous.svg"
                }
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
                slidesPerView={isAboveMd ? 1.2 : "auto"}
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
                {dbLevels?.map((level, idx) => (
                  <SwiperSlide
                    key={level.basicLevel.title}
                    className={cn(
                      "flex items-center justify-center  ",
                      currentLevel - 1 !== idx ? "blur-md" : ""
                    )}
                  >
                    <Level
                      level={idx + 1}
                      userLevel={userLevel?.toNumber() as number}
                      bg={level.bg.url}
                      description={level.description}
                      profitRange={level.profitRange}
                      nextProfitRange={
                        dbLevels?.at(idx + 1)?.profitRange as string
                      }
                      userPieces={userPieces as BigNumber[]}
                      claimLevel={actionClaimLevel}
                    />
                    <div className="mt-16 flex flex-col">
                      <div className="grid max-w-6xl grid-cols-1 gap-6 pb-36 md:grid-cols-4">
                        {userLevel?.gt(currentLevel) ? (
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
                          (userPieces && userPieces.length < 9 && (
                            // </div>
                            <div className="h-90 relative flex flex-col items-center justify-between gap-6 rounded-md bg-neutral-100">
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
                                    decimalSeparator=","
                                    thousandSeparator="."
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
                                        noDecimals(
                                          claimPieceProgressValue.toNumber()
                                        )
                                      }
                                      displayType="text"
                                      fixedDecimalScale
                                      decimalSeparator=","
                                      thousandSeparator="."
                                      decimalScale={0}
                                      prefix="$ "
                                    />
                                  </span>{" "}
                                  |{" "}
                                  <NumericFormat
                                    value={(5000 * currentLevel).toString()}
                                    displayType="text"
                                    fixedDecimalScale
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    decimalScale={0}
                                    prefix="$ "
                                  />
                                </span>
                              </div>
                              <Button
                                onClick={actionClaimPiece}
                                className="whitespace-nowrap border-emerald-700 px-12 text-emerald-700"
                                variant="outline"
                                disabled={!userAllowedToClaimPiece}
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
                                      Math.abs(
                                        claimPieceProgress?.toNumber()
                                      ) >= 100
                                        ? 100
                                        : Math.abs(
                                            claimPieceProgress?.toNumber()
                                          )
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )) || (
                            // </div>
                            <div className="h-90 relative flex flex-col items-center justify-between rounded-md bg-neutral-100 align-middle">
                              <div className="mt-[132px] flex flex-col justify-center align-middle ">
                                <h2 className="pt-6 text-center text-[24px] font-semibold uppercase leading-normal tracking-wider text-[#C3A279]">
                                  You got all
                                  <br />
                                  Pieces
                                </h2>
                                <span className=" text-center text-[14px] font-normal  text-neutral-600">
                                  Your final NFT is ready
                                </span>
                              </div>

                              <div className="bottom-0 left-0 flex h-3 w-full self-end rounded-b-md bg-progressBackground">
                                <div
                                  className={cn(
                                    "rounded-bl-md bg-[#C3A279]",
                                    Math.abs(
                                      claimPieceProgress?.toNumber() || 0
                                    ) >= 100
                                      ? "rounded-br-md"
                                      : ""
                                  )}
                                  style={{
                                    width: `${
                                      Math.abs(
                                        claimPieceProgress?.toNumber() || 0
                                      ) >= 100
                                        ? 100
                                        : Math.abs(
                                            claimPieceProgress?.toNumber() || 0
                                          )
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}

                        {puzzlePieces
                          ?.slice((currentLevel - 1) * 10, currentLevel * 10)
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
                                  userLevel?.gt(currentLevel) ||
                                  ((userPuzzlePieces &&
                                    userPuzzlePieces.at(idx)?.toNumber()) ||
                                    0) > 0
                                    ? puzzle?.imageCollected?.url
                                    : puzzle.image.url
                                }
                              />
                            </div>
                          ))}
                        {currentLevel < 4 && !userLevel?.gt(currentLevel) && (
                          <div className="h-90 relative flex flex-col items-center justify-center rounded-md border-2 border-[#C3A279] align-middle">
                            {(userPieces && userPieces.length < 9 && (
                              <div className="flex flex-col items-center justify-center align-middle ">
                                <Image
                                  src="/nfts/next_level.svg"
                                  alt="Symbol"
                                  width={165}
                                  height={165}
                                  className="mb-2"
                                />
                                <div className="m-2 flex flex-col items-center justify-center text-primaryGold">
                                  <h3>
                                    {idx < 2
                                      ? `NFT Level ${idx + 2}`
                                      : `Final NFT`}
                                  </h3>
                                  <p className="text-center">
                                    You can claim it when you
                                  </p>
                                  <p>get 10 different pieces</p>
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
                                  <h3>
                                    {" "}
                                    {idx < 2
                                      ? `NFT Level ${idx + 2}`
                                      : `Final NFT`}
                                  </h3>
                                  <Button
                                    variant={"outline"}
                                    onClick={actionClaimLevel}
                                    disabled={
                                      (userPieces && userPieces.length < 10) ||
                                      (userLevel?.toNumber() as number) >
                                        idx + 2
                                    }
                                    className={cn(
                                      "mt-[32px] border-primaryGold bg-primaryGold font-sans text-[14px] font-medium text-white hover:bg-primaryGold",
                                      (userLevel?.toNumber() as number) >
                                        idx + 2
                                        ? "bg-primaryGold text-white"
                                        : ""
                                    )}
                                  >
                                    {idx < 2
                                      ? `Claim Level ${idx + 2}`
                                      : "CLAIM FINAL LEVEL"}
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
              "swiper-next-22 absolute right-0 z-20 flex h-full items-start pr-3 pt-6 md:pr-16 md:pt-[190px]",
              currentLevel > 2 ? "hidden" : ""
            )}
          >
            <Image
              src={
                isAboveMd || levels.at(currentLevel - 1)?.locked
                  ? "/icons/pagination-next-black.svg"
                  : "/icons/pagination-next.svg"
              }
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
