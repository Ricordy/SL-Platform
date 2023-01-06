import type { NextPage } from "next";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { investmentData } from "../data/Investments";
import {abi as InvestAbi} from "../artifacts/contracts/Investment.sol/Investment.json"
import { useAccount, useContractRead } from "wagmi";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
// TODO: Get from user wallet
const userInvestments = [1, 2, 3];
const selectedInvestments = investmentData.filter(
  (i) => userInvestments.indexOf(i.id) > -1
);



const MyInvestments: NextPage = () => {
  const [categories] = useState({
    "Level 1": selectedInvestments,
    "Level 2": [],
  });

  // investmentData.forEach(function(element) { 
  //   const { data: phase } = useContractRead({
  //     address: element.address,
  //     abi: InvestAbi,
  //     functionName: 'status',
  //   })
    
  //   if(phase == 0)
  //     element.phase= "Paused"
  //   if(phase == 1)
  //     element.phase= "In Progress"
  //   if(phase == 2)
  //     element.phase= "In Process"
  //   if(phase == 3)
  //     element.phase= "In Withdraw"
  //   if(phase == 4)
  //     element.phase= "In Withdraw"
  //   });

  // console.log(investmentData);

  return (
    <div className="flex flex-col w-full px-6 lg:px-3 mt-16 md:mt-0">
      <h2 className="text-2xl py-6">My Investments</h2>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((investments, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className="grid  sm:grid-cols-2 grid-cols-1 gap-2">
                {investments.map((investment) => (
                  
                  <li
                    key={investment.id}
                    className="relative rounded-md p-3 border  flex  flex-col gap-3 justify-around hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5 pb-3">
                      <Link href={`/investment/${investment.id}`}>
                        {investment.title}
                      </Link>
                    </h3>
                    
                    {investment.phase !== "Withdraw" ? (
                      <div className="border p-2 text-xs rounded-md">
                        {investment.phase}
                      </div>
                    ) : (
                      <button className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100">
                        Withdraw
                      </button>
                    )}
                    <Link href={`/investment/${investment.id}/monitor`}>
                      <a className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100 text-center">
                        Monitor Investment
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MyInvestments;
