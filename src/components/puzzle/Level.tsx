import { type BigNumber } from "ethers";
import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";

interface LevelProps {
  level: number;
  userLevel: number;
  bg: string;
  description: ReactNode;
  userPieces: BigNumber[];
  profitRange: string;
  nextProfitRange?: string;
  claimLevel: (() => void) | undefined;
}
const Level = ({
  level,
  userLevel,
  bg,
  description,
  userPieces,
  profitRange,
  nextProfitRange,
  claimLevel,
}: LevelProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${userLevel >= level ? bg : ""})` }}
      className={cn(
        "border-primary flex min-h-[395px] max-w-6xl items-center justify-center gap-6 rounded-md border bg-cover ",
        level > userLevel
          ? "bg-contactBackground text-tabInactive"
          : "text-white"
      )}
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
        <p
          className={cn(
            " text-[16px] font-light leading-normal ",
            level > userLevel ? "text-tabInactive" : "text-white"
          )}
        >
          {description}
        </p>
        {level <= 2 && nextProfitRange && (
          <span
            className={cn(
              "text-[14px] font-normal uppercase leading-none tracking-wide",
              level > userLevel ? "text-tabInactive" : "text-white"
            )}
          >
            Next level:{" "}
            <span className="text-[14px] font-medium lowercase leading-none tracking-wide">
              {nextProfitRange?.split("-")[0]}% to{" "}
              {nextProfitRange?.split("-")[1]}%{" "}
            </span>
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div
          className={cn(
            "flex h-[238px] w-[238px] flex-col items-center justify-center rounded-full border-8 ",
            userLevel > level ? "border-primaryGold" : "border-neutral-400/50"
          )}
        >
          {level > userLevel ? (
            <Image
              src="/icons/locker.svg"
              width={0}
              height={0}
              className="w-2/3"
              alt="Locked"
            />
          ) : (
            <>
              <span className="w-[119.07px] text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
                Progress:
              </span>
              <span
                className={cn(
                  "w-[91px] text-center text-[48px] font-normal leading-normal ",
                  userLevel > level ? "text-primaryGold" : "text-white"
                )}
              >
                {userLevel > level ? "100" : (userPieces.length / 10) * 100}%
              </span>
              <span className="text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
                NFT Collected:
              </span>
              <span
                className={
                  userLevel > level || userPieces.length > 0
                    ? "text-primaryGold"
                    : ""
                }
              >
                <span>{userLevel > level ? 10 : userPieces.length}</span>{" "}
                <span
                  className={
                    userLevel > level || userPieces.length > 0
                      ? ""
                      : "text-white"
                  }
                >
                  | 10
                </span>
              </span>
            </>
          )}
        </div>
        {level < 3 && (
          <Button
            variant={"outline"}
            onClick={claimLevel}
            disabled={userLevel > level}
            className={cn(
              " border-primaryGold text-primaryGold hover:bg-primaryGold dark:hover:bg-primaryGold",
              userLevel > level ? "bg-primaryGold text-white" : ""
            )}
          >
            Claim Level {level + 1}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Level;
