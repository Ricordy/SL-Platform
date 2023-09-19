import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import type { HighlightProps } from "~/@types/HighlightInvestment";
import { cn } from "~/lib/utils";
import { ProjectInfo, badges } from "~/pages/investment/[address]";
import { Button } from "../ui/Button";

const Highlight = ({
  investment,
  totalInvested,
  className,
}: HighlightProps) => {
  const currentPhase = investment.restorationPhases?.at(0);
  return (
    <div
      className={cn(
        "ml-[58px] flex flex-col gap-12 px-6 md:px-0 md:py-[132px]",
        className ?? ""
      )}
    >
      <h2 className=" text-2xl font-medium uppercase">Highlight</h2>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative flex  min-w-[50%]">
          <Carousel showStatus={false} showThumbs={false}>
            {investment.basicInvestment.car.gallery.map((image, idx) => (
              <div key={idx} className="relative max-h-[405px] w-full">
                <Image
                  src={image.url}
                  width={528}
                  height={396}
                  className="rounded-md"
                  alt={investment.basicInvestment.car.basicInfo.title}
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="flex flex-col gap-[32px] md:max-w-[50%]">
          <h2 className="text-3xl font-medium text-primaryGreen">
            {investment.basicInvestment.car.basicInfo.title}
          </h2>
          <ProjectInfo
            status={investment.basicInvestment.investmentStatus}
            totalInvestment={investment.basicInvestment.totalInvestment}
            progress={
              (Number(totalInvested) /
                Number(investment.basicInvestment.totalInvestment)) *
              100
            }
            isFlexCol
          />
          <p className=" max-h-24 overflow-scroll">
            {investment.basicInvestment.car.description}
          </p>
          {currentPhase && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex w-full items-center justify-start">
                <div className="w-10">
                  <Image
                    src="/icons/tasks.svg"
                    width={22}
                    height={22}
                    style={{ width: "auto" }}
                    alt="Tasks"
                  />
                </div>
                <span className="whitespace-nowrap pr-2 text-xl font-medium">
                  {currentPhase.title}
                </span>
              </div>
              <span
                className={cn(
                  "flex w-36 items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 py-1 text-xs md:w-full ",
                  badges[currentPhase.restorationStatus.toLocaleLowerCase()].bg,
                  badges[currentPhase.restorationStatus.toLocaleLowerCase()]
                    .text
                )}
              >
                <Image
                  src={
                    badges[currentPhase.restorationStatus.toLocaleLowerCase()]
                      .icon
                  }
                  className="w-4"
                  width={12}
                  height={12}
                  alt={
                    badges[currentPhase.restorationStatus.toLocaleLowerCase()]
                      .label
                  }
                />
                {
                  badges[currentPhase.restorationStatus.toLocaleLowerCase()]
                    .label
                }
              </span>
            </div>
          )}

          <Link href={`/investment/${investment.address}`}>
            <Button variant="outline" className="self-start">
              Know more
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Highlight;
