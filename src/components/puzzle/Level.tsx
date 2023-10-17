import { type BigNumber } from "ethers";
import Image from "next/image";
import { type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/Button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import MyAlertButton from "../MyAlertButton";

interface LevelProps {
  level: number;
  userLevel: number;
  bg: string;
  description: ReactNode;
  userPieces: BigNumber[];
  profitRange: string;
  nextProfitRange?: string;
  claimLevel: (e: any) => void;
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
  const collectedNFTs =
    userLevel && userLevel > level ? 10 : userPieces?.length || 0;
  const percentage = collectedNFTs * 10;

  return (
    <div
      style={{ backgroundImage: `url(${userLevel >= level ? bg : ""})` }}
      className={cn(
        "border-primary flex max-w-6xl flex-col items-center justify-center gap-6 rounded-md border bg-cover md:min-h-[395px] md:flex-row ",
        userLevel
          ? level > userLevel
            ? "bg-contactBackground text-tabInactive"
            : "text-white"
          : "bg-contactBackground text-tabInactive"
      )}
    >
      <div className="flex w-full flex-col gap-5 p-6 md:px-16">
        <h2 className="pb-6 text-center text-[40px] font-light uppercase leading-10 tracking-widest md:text-left">
          Level {level}
        </h2>
        <h3 className="text-2xl uppercase tracking-wider">
          You have{" "}
          <span className="text-primaryGold">
            {profitRange.split("-")[0]}% to {profitRange.split("-")[1]}% profit
          </span>
        </h3>
        <p
          className={cn(
            " text-[16px] font-light leading-normal ",
            userLevel
              ? level > userLevel
                ? "text-tabInactive"
                : "text-white"
              : "text-tabInactive"
          )}
        >
          {description}
        </p>
        {level <= 2 && nextProfitRange && (
          <span
            className={cn(
              "text-[14px] font-normal uppercase leading-none tracking-wide",
              userLevel
                ? level > userLevel
                  ? "text-tabInactive"
                  : "text-white"
                : "text-tabInactive"
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
      <div className="flex w-full flex-col items-center justify-center gap-6 pb-6 md:pb-0">
        <div
          className={cn(
            "relative flex h-[238px] w-[238px] flex-col items-center justify-center  ",
            userLevel
              ? userLevel > level
                ? "border-primaryGold"
                : "border-neutral-400/50"
              : "border-neutral-400/50"
          )}
        >
          <div className="absolute top-0 w-60">
            <CircularProgressbar
              value={percentage}
              text={
                userLevel ? (level > userLevel ? "" : `${percentage}%`) : ""
              }
              strokeWidth={3.5}
              styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                  // Path color
                  stroke: `rgba(195, 162, 121)`, //, ${percentage / 100} for opacity
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: "butt",
                  // Customize transition animation
                  transition: "stroke-dashoffset 0.5s ease 0s",
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                  // Trail color
                  stroke: "#d6d6d6",
                  // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                  strokeLinecap: "butt",
                  // Rotate the trail
                  transform: "rotate(0.25turn)",
                  transformOrigin: "center center",
                },
                // Customize the text
                text: {
                  // Text color
                  fill: "#C3A279",
                  // Text size
                  fontSize: "22px",
                },
              }}
            />
          </div>

          {userLevel ? (
            level > userLevel ? (
              <Image
                src="/icons/locker.svg"
                width={0}
                height={0}
                className="w-2/3"
                alt="Locked"
              />
            ) : (
              <>
                <span className=" absolute top-16 w-[119.07px]  text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
                  Progress:
                </span>
                <span className="absolute top-40 text-center text-[14px] font-normal leading-none tracking-wide text-neutral-400">
                  NFT Collected:
                </span>
                <div></div>
                <span
                  className={`absolute top-48 ${
                    userLevel > level || userPieces?.length > 0
                      ? "text-primaryGold"
                      : ""
                  }`}
                >
                  <span>{collectedNFTs}</span>{" "}
                  <span
                    className={
                      userLevel > level || userPieces?.length > 0
                        ? ""
                        : "text-white"
                    }
                  >
                    | 10
                  </span>
                </span>
              </>
            )
          ) : (
            <Image
              src="/icons/locker.svg"
              width={0}
              height={0}
              className="w-2/3"
              alt="Locked"
            />
          )}
        </div>
        {level < 4 && (
          <MyAlertButton
            triggerButtonLabel={
              level > 2 ? "Claim Final NFT" : `Claim Level ${level + 1}`
            }
            confirmAction={claimLevel}
            triggerButtonClassname={cn(
              " mt-[16px] border-primaryGold bg-primaryGold font-sans text-[14px] font-medium text-white hover:bg-primaryGold",
              userLevel > level ? "bg-primaryGold text-white" : ""
            )}
            variant="outline"
            isTriggerDisabled={collectedNFTs < 10 || userLevel > level}
            alertDescription="Are you sure you want to claim this level? This action cannot be undone."
            confirmLabel="Claim Level"
          />
        )}
      </div>
    </div>
  );
};

export default Level;
