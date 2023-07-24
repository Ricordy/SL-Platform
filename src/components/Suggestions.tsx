import React from "react";
import { CarouselItem } from "./Carousel";
import { type InvestmentProps } from "~/@types/investment";
import { cn } from "~/lib/utils";

type HeroPops = {
  className?: string;
};

interface SuggestionsProps {
  investments: InvestmentProps[];
  className?: string;
}

const Suggestions = ({ investments, className }: SuggestionsProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex  w-full max-w-screen-lg gap-[52px]",
        className
      )}
    >
      {investments.map((investment) => (
        <CarouselItem
          // title="my title"
          // image="/projects/car-1.jpg"
          // price="39595"
          title={investment.basicInvestment.car?.basicInfo.title}
          image={investment.basicInvestment.car?.basicInfo.cover.url}
          price={investment.basicInvestment.totalInvestment.toString()}
          address={investment.address}
          level={investment.level.basicLevel.title}
        />
      ))}
    </div>
  );
};

export default Suggestions;
