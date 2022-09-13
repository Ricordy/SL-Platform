import React from "react";
import InvestmentNumbers from "./InvestmentNumbers";
import { InvestmentSidebar } from "./InvestmentSidebar";
import PuzzleItem from "./PuzzleItem";
import Slider from "./Slider";

const InvestmentDetail = () => {
  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-4xl  gap-6">
        <div className="flex flex-col w-3/4">
          <Slider />
          <PuzzleItem
            amount="$ 129000"
            progress="100"
            showProgressInsideBar={true}
          />
          <InvestmentNumbers />
        </div>
        <InvestmentSidebar />
      </div>
    </div>
  );
};

export default InvestmentDetail;
