import React from "react";

const InvestmentNumbers = () => {
  return (
    <div className="flex flex-col pt-6">
      <div className="flex justify-between">
        <div className="title">Sales Start</div>
        <div className="text-xs">09:00:00 GMT+1 2023-02-01</div>
      </div>
      <div className="flex justify-between">
        <div className="title">Sales End</div>
        <div className="text-xs">09:00:00 GMT+1 2023-05-01</div>
      </div>
      <div className="flex justify-between">
        <div className="title">Estimate Claiming</div>
        <div className="text-xs">2024-03-01</div>
      </div>
    </div>
  );
};

export default InvestmentNumbers;
