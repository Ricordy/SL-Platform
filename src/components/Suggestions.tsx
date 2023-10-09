import React from "react";
import { CarouselItem } from "./Carousel";
import { type InvestmentProps } from "~/@types/investment";
import { cn, getMissingInvestments } from "~/lib/utils";
import { useInvestments } from "~/lib/zustand";

type HeroPops = {
  className?: string;
};

interface SuggestionsProps {
  className?: string;
}

const Suggestions = ({ className }: SuggestionsProps) => {
  const allInvestments = useInvestments((state) => state.investments);
  const userInvestments = useInvestments((state) => state.userInvestments);

  const investments = getMissingInvestments(allInvestments, userInvestments);
  return (
    <section>
      <div className="relative z-20 mx-auto flex rounded-t-[56px] bg-black pt-[72px] text-white md:pb-[128px]">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-[52px] px-6 md:px-0">
          <h3 className="text-center text-2xl uppercase md:text-left">
            Our suggestion for you
          </h3>
          <div
            className={cn(
              "mx-auto flex w-full flex-col gap-[52px] md:max-w-screen-lg md:flex-row",
              className
            )}
          >
            {investments.map((investment) => (
              <CarouselItem
                title={investment.basicInvestment.car?.basicInfo.title}
                image={investment.basicInvestment.car?.basicInfo.cover.url}
                price={investment.basicInvestment.totalInvestment.toString()}
                address={investment.address}
                level={investment.level.basicLevel.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Suggestions;
