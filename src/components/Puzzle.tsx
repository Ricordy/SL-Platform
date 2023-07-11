import { BigNumber } from "ethers";
import Image from "next/image";
import { useEffect, useState, type FC } from "react";
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

  console.log("PP", puzzlePieces[0]?.imageCollected.url);

  const NFTs: {
    tokenid: number;
    title: string;
    url: string;
  }[] = [{ tokenid: 1, title: "Tablier", url: "" }];

  const SlCoreContract = {
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
  };

  const SlFactoryContract = {
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryABI,
  };

  const SlLogicsContract = {
    address: process.env.NEXT_PUBLIC_LOGICS_ADDRESS as Address,
    abi: SLLogicsABI,
  };

  const { userPuzzlePieces, userPieces, userTotalPieces } =
    useGetUserPuzzlePieces({
      userAddress,
      level: currentLevel,
      // watch: true,
    });

  console.log(
    "total pieces",
    userTotalPieces,
    "/",
    userPieces,
    "/",
    userPuzzlePieces
  );

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
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 1],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 2],
      },
      {
        ...SlCoreContract,
        functionName: "getUserPuzzlePiecesForUserCurrentLevel",
        args: [userAddress, 3],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 1],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 2],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [userAddress, 3],
      },
      {
        ...SlCoreContract,
        functionName: "whichLevelUserHas",
        // chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
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
    //enabled: data && currentLevel === data?.[6]?.toNumber(),
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
    enabled: Number(data?.[currentLevel - 1]) > 9 && data?.[6] == currentLevel,
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
    locked: (data[6] as number) < idx + 1,
    profitRange: dbLevel.profitRange,
    description: dbLevel.description,
    progress: (userPieces.length / 10) * 100,
    invested: noDecimals(Number(data[3 + idx])),
    collected: userPieces.length.toString(),
  }));

  const [profitNotification, setProfitNotification] = useState(true);

  useEffect(() => {
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
    //   data[6],
    //   "/",
    //   data[currentLevel - 1],
    //   "/",
    //   currentLevel,
    //   "/",
    //   userAddress,
    //   "/",
    //   dataUserAllowed
    // );
  }, []);

  return (
    <section
      id="puzzle"
      className={cn("mx-auto flex w-full max-w-[1338px] flex-col", className)}
    >
      {/* <h2 className="ml-[58px] pb-12 text-2xl font-medium uppercase">
        My Puzzle
      </h2>
      <Tab.Group
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
      {isConnected && (
        <Level
          level={1}
          bg={dbLevels?.at(0)?.bg.url as string}
          description={dbLevels?.at(0)?.description}
          profitRange={dbLevels?.at(0)?.profitRange as string}
          nextProfitRange={dbLevels?.at(1)?.profitRange as string}
          userPieces={userPieces}
        />
      )}
      {/* <Carousel
        className="pt-5"
        id="1"
        isConnected={isConnected}
        userItems={userPuzzlePieces}
        items={puzzlePieces}
      /> */}
      {isConnected && (
        <div className="flex flex-col">
          <h2 className="ml-[58px] pb-12 pt-16 text-2xl font-medium uppercase">
            My Achievements
          </h2>
          <div className="grid max-w-6xl grid-cols-1 gap-6 pb-36 md:grid-cols-4">
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
                  {levels.find((level) => level.title == "Level 1")?.progress}%
                </span>
                <span className="text-center text-[14px] font-normal leading-none tracking-wide text-neutral-600">
                  You&apos;re almost there!
                </span>
                <span className="text-[16px] font-normal leading-normal text-neutral-600">
                  <span className="text-[16px] font-semibold leading-normal text-black">
                    {noDecimals(Number(data?.[3])) - userTotalPieces * 5000}
                  </span>{" "}
                  | 5.000$
                </span>
              </div>
              <Button
                onClick={claimPiece}
                className="whitespace-nowrap border-emerald-700 px-12 text-emerald-700"
                variant="outline"
                disabled={!userCanClaimPiece}
              >
                {isLoadingClaimPiece ? "Loading..." : `Claim Piece`}
              </Button>
              <div className="bottom-0 left-0 flex h-3 w-full self-end rounded-b-md bg-progressBackground">
                <div
                  className={` rounded-b-md bg-progressHighlight`}
                  style={{
                    width: `${
                      levels.find((level) => level.title == "Level 1")
                        ?.progress as number
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            {puzzlePieces.map((puzzle) => (
              <div key={puzzle.tokenid} className="relative">
                <CarouselItem
                  title={puzzle.title}
                  amount={
                    userPuzzlePieces?.at(puzzle.tokenid)?.toNumber() as number
                  }
                  isConnected={isConnected}
                  image={
                    (userPuzzlePieces &&
                      userPuzzlePieces.at(puzzle?.tokenid)?.toNumber()) ||
                    0 > 0
                      ? puzzle?.imageCollected?.url
                      : puzzle.image.url
                  }
                />
              </div>
              // <div
              //   key={puzzle.tokenid}
              //   className="flex h-[393px] flex-col items-center justify-center rounded-md border-2 border-tabInactive/20"
              // >
              //   {userPuzzlePieces &&
              //   userPuzzlePieces?.at(puzzle.tokenid)?.gt(0) ? (
              //     <Image
              //       src={puzzle.imageCollected.url}
              //       alt={puzzle.title}
              //       width={165}
              //       height={165}
              //     />
              //   ) : (
              //     <Image
              //       src={puzzle.image.url}
              //       alt={puzzle.title}
              //       width={165}
              //       height={165}
              //     />
              //   )}

              //   <h3 className="text-center text-sm uppercase text-tabInactive">
              //     Piece
              //     <br />
              //     <span className="text-2xl">{puzzle.title}</span>
              //   </h3>
              // </div>
            ))}
            <div className="h-90 relative flex flex-col items-center justify-between rounded-md border-2 border-tabInactive/20">
              <Image
                src="/nfts/next_level.svg"
                alt="Symbol"
                width={165}
                height={165}
              />
              <div className="flex flex-col items-center justify-center text-primaryGold">
                <h3>NFT Level 2</h3>
                <p className="text-center">
                  You can claim it when you get 10 different pieces
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Puzzle;
