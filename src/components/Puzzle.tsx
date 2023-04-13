import React, { FC } from "react";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { classNames, cn } from "../lib/utils";
import Carousel from "./puzzle/Carousel";
import Image from "next/image";
import { Button } from "./ui/Button";
interface PuzzleProps {
  className?: string;
}

const Puzzle: FC<PuzzleProps> = ({ className }) => {
  const NFTs: number[][] = [
    Array.from({ length: 10 }, (_, k) => k),
    Array(10).fill(0),
  ];
  const levels = [
    {
      title: "Level 1",
      locked: false,
      profitRange: "12-15",
      description:
        "Don't be afraid to invest with lower margins, here the most important margin is the profit margin that naturally accompanies the investment ratio.",

      progress: 42,
      invested: 20000,
      collected: 2,
    },
    {
      title: "Level 2",
      locked: true,
      profitRange: "15-18",
      description:
        "The path is made by walking and you are one step closer to having the intended return! Level 2 of the puzzle takes you to an investment level never before explored with a tailor-made financial return!",
      progress: 0,
      invested: 0,
      collected: 0,
    },
    {
      title: "Level 3",
      locked: true,
      profitRange: "18-20",
      description:
        "There is no going back, you are at the highest point of your investment with the highest profit margins. Nothing ventured, nothing gained, and if risk is your middle name, you're on the right track!",
      progress: 0,
      invested: 0,
      collected: 0,
    },
  ];

  return (
    <section
      id="puzzle"
      className={cn("w-full mx-auto max-w-[1338px] flex flex-col", className)}
    >
      <h2 className="text-2xl uppercase pb-12 ml-[58px]">My Puzzle</h2>
      <Tab.Group>
        <Tab.List className="flex ml-[58px] w-full border-b border-b-gray-900/20">
          {levels.map((level) => (
            <Tab
              key={level.title}
              className={({ selected }) =>
                classNames(
                  "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal  leading-5 text-tabInactive",
                  "focus:outline-none",
                  selected
                    ? "bg-white text-primaryGreen border-b-4 font-semibold border-primaryGreen"
                    : " hover:bg-white/[0.12] hover:text-tabInactive/80"
                )
              }
            >
              {level.title}{" "}
              {level.locked && (
                <Image
                  alt="Locked"
                  src="/icons/locked.svg"
                  width={20}
                  height={20}
                />
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=" max-w-screen-2xl flex w-full">
          {levels.map((level, idx) => {
            return (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl py-8 w-full",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                )}
              >
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-8 ml-[58px] mr-[256px]">
                    <div className="flex  flex-col bg-puzzleProfitNotice p-8 rounded-md">
                      <h3 className="uppercase ml-[124px]tracking-wider text-2xl pb-4">
                        You have{" "}
                        <span className="text-primaryGold">
                          {level.profitRange.split("-")[0]} to{" "}
                          {level.profitRange.split("-")[1]} profit
                        </span>
                      </h3>

                      <p className="font-light pb-4 max-w-xl">
                        {level.description}
                      </p>
                      {idx < 2 && (
                        <span className="uppercase text-xs font-medium">
                          Next level:{" "}
                          {levels.at(idx + 1).profitRange.split("-")[0]}% to{" "}
                          {levels.at(idx + 1).profitRange.split("-")[1]}%{" "}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-6">
                      <div className="flex gap-3">
                        <p className="text-md">
                          Progress:{" "}
                          <span className="font-medium">{level.progress}%</span>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <p className="text-md">
                          Invested:{" "}
                          <span className="font-medium">{level.invested}$</span>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <p className="text-md">
                          Collected:{" "}
                          <span className="font-medium">{level.collected}</span>{" "}
                          | 10
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-6">
                      <div className="bg-progressBackground h-[6px] w-full flex bottom-0 left-0 rounded-md">
                        <div
                          className={` bg-progressHighlight rounded-md`}
                          style={{ width: `${level.progress}%` }}
                        ></div>
                      </div>
                      <Button className="px-12" variant="outline">
                        Claim
                      </Button>
                    </div>
                  </div>
                  {!level.locked && (
                    <Carousel
                      className="pt-5"
                      id={idx.toString()}
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
      </Tab.Group>
    </section>
  );
};

export default Puzzle;
