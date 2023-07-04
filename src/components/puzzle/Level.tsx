import { type BigNumber } from "ethers";
import { type ReactNode } from "react";
import { Button } from "../ui/Button";

interface LevelProps {
  level: number;
  bg: string;
  description: ReactNode;
  userPieces: BigNumber[];
  profitRange: string;
  nextProfitRange?: string;
}
const Level = ({
  level,
  bg,
  description,
  userPieces,
  profitRange,
  nextProfitRange,
}: LevelProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="border-primary flex min-h-[395px] max-w-6xl items-center justify-center gap-6 rounded-md border bg-cover text-white"
    >
      <div className="flex w-full flex-col gap-5 p-6 px-16">
        <h2 className="pb-6 text-[40px] font-light uppercase leading-10 tracking-widest">
          Level {level}
        </h2>
        <h3 className="ml-[124px]tracking-wider text-2xl uppercase">
          You have{" "}
          <span className="text-primaryGold">
            {profitRange.split("-")[0]}% to {profitRange.split("-")[1]}% profit
          </span>
        </h3>

        <p className=" text-[16px] font-light leading-normal text-white">
          {description}
        </p>
        {level < 2 && nextProfitRange && (
          <span className="text-[14px] font-normal uppercase leading-none tracking-wide text-white">
            Next level:{" "}
            <span className="text-[14px] font-medium lowercase leading-none tracking-wide text-white">
              {nextProfitRange?.split("-")[0]}% to{" "}
              {nextProfitRange?.split("-")[1]}%{" "}
            </span>
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex h-[238px] w-[238px] flex-col items-center justify-center rounded-full border-8 border-neutral-400/50">
          <span className="w-[119.07px] text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
            Progress:
          </span>
          <span className="w-[91px] text-center text-[48px] font-normal leading-normal text-white">
            {(userPieces.length / 10) * 100}%
          </span>
          <span className="text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
            NFT Collected:
          </span>
          <span>
            <span className={userPieces.length > 0 ? "text-primaryGold" : ""}>
              {userPieces.length}
            </span>{" "}
            | 10
          </span>
        </div>
        <Button
          variant={"outline"}
          className=" border-primaryGold text-primaryGold"
        >
          Claim Level 2
        </Button>
      </div>
    </div>
  );
};

export default Level;
