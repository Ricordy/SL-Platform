import { useState } from "react";
import { Tab } from "@headlessui/react";
import investmentData from "../data/Investments.json";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Investments() {
  const [investmentStatuses] = useState(investmentData);

  return (
    <section className="w-full max-w-md px-2 py-16 sm:px-0">
      <h2 className="text-3xl mx-auto my-6">Investments</h2>
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {Object.keys(investmentStatuses).map((investmentStatus) => (
            <Tab
              key={investmentStatus}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {investmentStatus}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(investmentStatuses).map((investmentStatus, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
              )}
            >
              <ul>
                {investmentStatus.map((investment) => (
                  <li
                    key={investment.id}
                    className="relative rounded-md p-3 hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {investment.title}
                    </h3>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                      <li>{investment.phase}</li>
                      <li>&middot;</li>
                      <li>{investment.amount}</li>
                      <li>&middot;</li>
                      <li>{investment.percentage}%</li>
                    </ul>

                    <a
                      href="#"
                      className={classNames(
                        "absolute inset-0 rounded-md",
                        "ring-gray-400 focus:z-10 focus:outline-none focus:ring-2"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
}
