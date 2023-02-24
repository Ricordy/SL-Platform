import type { NextPage } from "next";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { investmentData } from "../data/Investments";
import { useAccount, useContractReads, useSigner } from "wagmi";
import useCheckEntryNFT from "../hooks/useCheckEntryNFT";
import { InvestAbi } from "../data/ABIs";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// TODO: Get from user wallet
const userInvestmentsHelper = [];
let userInvestments = [];
let selectedInvestments = investmentData.filter(
  (i) => userInvestments.indexOf(i.id) > -1
);

const MyInvestments: NextPage = () => {
  const { address } = useAccount();
  const { hasEntryNFT } = useCheckEntryNFT({
    address,
    nftId: 10,
  });

  const investContracts = [];
  const [categories] = useState({
    "Level 1": selectedInvestments,
    "Level 2": [],
  });

  const { data: signerData } = useSigner();

  investmentData.forEach(function (element) {
    console.log(element.address);

    const contract = {
      address:
        process.env.NODE_ENV == "development"
          ? process.env.NEXT_PUBLIC_INVESTMENT_ADDRESS
          : element.address,
      abi: InvestAbi,
    };
    investContracts.push(contract);
  });
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...investContracts[0],
        functionName: "status",
      },
      {
        ...investContracts[1],
        functionName: "status",
      },
      {
        ...investContracts[2],
        functionName: "status",
      },
      {
        ...investContracts[0],
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...investContracts[1],
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...investContracts[2],
        functionName: "balanceOf",
        args: [address],
      },
    ],
  });

  console.log(data);

  let counter = 0;
  investmentData.map(function (element) {
    if (Number(data?.[3 + counter]) > 0) {
      userInvestmentsHelper.push(counter + 1);
      console.log(
        "balance of contract",
        counter,
        ": ",
        Number(data?.[3 + counter])
      );
      console.log("userInvestments: ", userInvestments);
      userInvestments = userInvestmentsHelper.filter(
        (n, i) => userInvestmentsHelper.indexOf(n) === i
      );
      selectedInvestments = investmentData.filter(
        (i) => userInvestments.indexOf(i.id) > -1
      );
    }

    if (data?.[counter] == 0) element.phase = "Paused";
    if (data?.[counter] == 1) element.phase = "In Progress";
    if (data?.[counter] == 2) element.phase = "In Process";
    if (data?.[counter] == 3) element.phase = "In Withdraw";
    if (data?.[counter] == 4) element.phase = "In Withdraw";

    counter++;
  });

  // console.log(investmentData);
  if (!hasEntryNFT)
    return (
      <div className="flex flex-col">
        <h1>You don&apos;t have the Entry NFT</h1>
        <Link href="/mint-entry-nft">
          <a className="border text-center rounded py-1 px-3 bg-slate-800 text-white">
            Buy Now
          </a>
        </Link>
      </div>
    );

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
