import Image from "next/image";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import type { HighlightProps } from "~/@types/HighlightInvestment";
import { cn } from "~/lib/utils";
import { ProjectInfo, badges } from "~/pages/investment/[address]";
import { Button } from "../ui/Button";

const Highlight = ({ investment, totalInvested }: HighlightProps) => {
  const currentPhase = investment.restorationPhases?.at(0);
  return (
    <div className="ml-[58px] flex flex-col py-[132px]">
      <h2 className=" text-2xl font-medium uppercase">Highlight</h2>
      <div className="flex gap-6">
        <div className="relative flex  w-1/3">
          <Carousel showStatus={false} showThumbs={false}>
            {investment.basicInvestment.car.gallery.map((image, idx) => (
              <div key={idx} className="relative max-h-[405px] w-full">
                <Image
                  src={image.url}
                  width={528}
                  height={396}
                  alt={investment.basicInvestment.car.basicInfo.title}
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="flex flex-col">
          <h2 className="pb-8 text-3xl font-medium text-primaryGreen">
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
          />
          <p>{investment.basicInvestment.car.description}</p>
          {currentPhase && (
            <div className="flex gap-4 py-8">
              <Image
                src="/icons/tasks.svg"
                width={22}
                height={22}
                style={{ width: "auto" }}
                alt="Tasks"
              />
              <span className="whitespace-nowrap pr-2 text-xl font-medium">
                {currentPhase.title}
              </span>
              <span
                className={cn(
                  "flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-2 py-1 text-xs",
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
