import React from "react";
import { NumericFormat } from "react-number-format";

type historyProps = {
  totalInvested: number;
};
const InvestmentHistory = (props: historyProps) => {
  return (
    <div className="grid grid-cols-2 gap-12 pt-6 justify-start">
      <div className="flex flex-col">
        <h2 className="text-xs pb-3">
          Total Invested:{" "}
          <span className="text-bold text-xl">
            <NumericFormat
              value={props.totalInvested}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              // fixedDecimalScale={true}
              prefix="$ "
            />
          </span>
        </h2>
        <table>
          <thead>
            <tr>
              <th className="text-center">Amount</th>
              <th className="text-center">Date</th>
              <th className="text-center">Transaction Id</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>3,000</td>
              <td>2022-03-01</td>
              <td>0x999999999</td>
            </tr>
            <tr className="bg-gray-100">
              <td>1,500</td>
              <td>2022-02-22</td>
              <td>0x999999998</td>
            </tr>
            <tr>
              <td>500</td>
              <td>2022-01-04</td>
              <td>0x999999997</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-between ">
        <h2 className="text-xs pb-3">
          Expected Return: <span className="text-bold text-xl">$ 100.00</span>
        </h2>
        <button className="border rounded-md p-2 bg-slate-800 text-slate-50">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default InvestmentHistory;
