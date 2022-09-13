import type { NextPage } from "next";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const MyInvestments: NextPage = () => {
  const [categories] = useState({
    "Level 1": [
      {
        id: 3,
        title: "Volkswagen Beetle",
        amount: "5000000",
        percentage: "100",
        phase: "Funds Collected",
      },
      {
        id: 1,
        title: "Mercedes-benz 280sl Pagoda 1969",
        amount: "129000",
        percentage: "100",
        phase: "Withdraw",
      },
      {
        id: 2,
        title: "Porsche 911 1963",
        amount: "25000000",
        percentage: "60",
        phase: "In progress",
      },
    ],
    "Level 2": [],
  });

  return (
    <div className="w-full px-2 sm:px-0">
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
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className="grid grid-cols-5 gap-2">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 border  flex  flex-col  justify-around hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      <Link href="/investment/1">{post.title}</Link>
                    </h3>
                    {post.phase !== "Withdraw" ? (
                      <button className="border p-2 text-xs rounded-md">
                        {post.phase}
                      </button>
                    ) : (
                      <button className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100">
                        Withdraw
                      </button>
                    )}
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
