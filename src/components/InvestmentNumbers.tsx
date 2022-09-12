import React from "react";

const InvestmentNumbers = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="title">Swap Rate</div>
        <div className="text-xs">1 USDC = 0.986 USD</div>
      </div>
      <div className="flex justify-between">
        <div className="title">Sales Start</div>
        <div className="text-xs">09:00:00 GMT+1 2023-02-01</div>
      </div>
      <div className="flex justify-between">
        <div className="title">Sales End</div>
        <div className="text-xs">09:00:00 GMT+1 2023-12-01</div>
      </div>
      <div className="flex justify-between">
        <div className="title">Estimate Claiming</div>
        <div className="text-xs">2024-12-04</div>
      </div>
    </div>
  );
};

export default InvestmentNumbers;
