import React from "react";
import { NumericFormat } from "react-number-format";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

type historyProps = {
  totalInvested: number;
  showExpectedReturn: boolean;
  className?: string;
};
const InvestmentHistory = (props: historyProps) => {
  return (
    <div className={props.className}>
      <div className="flex flex-col">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                <span className="flex items-center justify-center gap-2">
                  Total Invested:
                  <NumericFormat
                    className="text-bold text-xl"
                    value={props.totalInvested}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    prefix="$ "
                  />
                </span>
                <ChevronUpIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
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
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <h2 className="text-xs pb-3"></h2>
      </div>
      {props.showExpectedReturn && (
        <div className="flex flex-col justify-between ">
          <h2 className="text-xs pb-3">
            Expected Return: <span className="text-bold text-xl">$ 100.00</span>
          </h2>
          <button className="border rounded-md p-2 bg-slate-800 text-slate-50">
            Withdraw
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestmentHistory;
