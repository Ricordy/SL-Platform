import React from "react";
import { InvestmentSidebar } from "./InvestmentSidebar";
import PuzzleItem from "./PuzzleItem";
import Slider from "./Slider";

const InvestmentDetail = () => {
  return (
    <div className="flex w-full max-w-4xl  gap-6">
      <div className="flex flex-col w-3/4">
        <Slider />
        <PuzzleItem level={1} amount={150000} progress={10} />
      </div>
      <InvestmentSidebar />
    </div>
  );
};

export default InvestmentDetail;
