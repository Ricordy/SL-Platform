import { useState } from "react";
import { Tab } from "@headlessui/react";
import { investmentData } from "../data/Investments";
import { investmentStatusesData } from "../data/InvestmentStatuses";
import { NumericFormat } from "react-number-format";
import { classNames } from "../lib/utils";
import ProjectCarousel from "./ProjectCarousel";
import { CarouselItemProps } from "./ProjectCarousel";

export default function Investments() {
  const [investmentStatuses] = useState(investmentStatusesData);

  return (
    <section
      id="investments"
      className="relative max-w-[1338px] w-full overflow-hidden flex flex-col"
    >
      <h2 className="text-2xl ml-[58px] mb-6 uppercase">My Investments</h2>
      <Tab.Group>
        <Tab.List className="flex ml-[58px] w-fit border-b border-b-gray-900/20">
          {investmentStatuses.map((investmentStatus) => (
            <Tab
              key={investmentStatus}
              className={({ selected }) =>
                classNames(
                  "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal  leading-5 text-tabInactive",
                  "focus:outline-none",
                  selected
                    ? "bg-white text-primaryGreen border-b-4 font-semibold border-primaryGreen"
                    : " hover:bg-white/[0.12] hover:text-tabInactive/80"
                )
              }
            >
              {investmentStatus}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {investmentStatuses.map((investmentStatus, idx) => {
            return (
              <Tab.Panel
                key={idx}
                className={classNames(
                  " pt-6",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                )}
              >
                <ProjectCarousel
                  id={idx.toString()}
                  // items={investmentData.filter(
                  //   (i) => i.status == investmentStatus
                  // )}
                />
                {/* <ul className="grid sm:grid-cols-2 grid-cols-1 gap-2">
                {investmentData
                  .filter((i) => i.status == investmentStatus)
                  .map((investment) => (
                    <li
                      key={investment.id}
                      className="relative rounded-md border  p-3 h-24 bg-gray-200 hover:bg-gray-100"
                    >
                      <h3 className="text-sm font-medium leading-5">
                        {investment.title}
                      </h3>

                      <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                        <li>{investment.phase}</li>
                        <li>&middot;</li>
                        <li>
                          <NumericFormat
                            value={investment.amount}
                            displayType="text"
                            allowLeadingZeros
                            thousandSeparator=","
                            decimalScale={2}
                          />
                        </li>
                        <li>&middot;</li>
                        <li>{investment.percentage}%</li>
                      </ul>

                      <a
                        href={`/investment/${investment.id}`}
                        className={classNames(
                          "absolute inset-0 rounded-md",
                          "ring-gray-400 focus:z-10 focus:outline-none focus:ring-2"
                        )}
                      />
                    </li>
                  ))}
              </ul> */}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </section>
  );
}
