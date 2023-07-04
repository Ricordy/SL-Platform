import { Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { investmentStatusesData } from "../data/InvestmentStatuses";
import { cn } from "../lib/utils";
import ProjectCarousel from "./ProjectCarousel";

interface InvestmentsProps {
  isConnected: boolean;
  userInvestments;
}
export default function Investments({
  isConnected,
  userInvestments,
}: InvestmentsProps) {
  const [investmentStatuses] = useState(investmentStatusesData);

  return (
    <section
      id="investments"
      className="relative flex w-full max-w-[1338px] flex-col overflow-hidden"
    >
      <div className="mx-auto ml-[58px] flex w-full justify-between">
        <h2 className="mb-[52px] text-2xl font-medium uppercase">
          My Investments
        </h2>
        {isConnected && (
          <div className="mr-[116px]">
            <Link
              href="/my-investments"
              className="border-b-2 border-primaryGreen text-sm uppercase text-primaryGreen"
            >
              See more
            </Link>
          </div>
        )}
      </div>
      {isConnected && (
        <Tab.Group>
          <Tab.List className="ml-[58px] flex w-fit border-b border-b-gray-900/20">
            {investmentStatusesData.map((investmentStatus) => (
              <Tab
                key={investmentStatus}
                className={({ selected }) =>
                  cn(
                    "flex min-w-fit justify-center gap-3 px-6 pb-4  text-2xl font-normal  leading-5 text-tabInactive",
                    "focus:outline-none",
                    selected
                      ? "border-b-4 border-primaryGreen bg-white font-semibold text-primaryGreen"
                      : " hover:bg-white/[0.12] hover:text-tabInactive/80"
                  )
                }
              >
                {investmentStatus}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {investmentStatusesData.map((investmentStatus) => {
              return (
                <Tab.Panel
                  key={investmentStatus}
                  className={cn(
                    " pt-6",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                  )}
                >
                  <ProjectCarousel
                    id={investmentStatus}
                    items={userInvestments.filter(
                      (investment) =>
                        investment.basicInvestment.investmentStatus ==
                        investmentStatus
                    )}
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
                        className={cn(
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
      )}
      {!isConnected && (
        <div className="ml-[58px] grid grid-flow-row auto-rows-auto grid-cols-3 justify-center gap-4 ">
          <div className="flex flex-col items-center rounded-md bg-puzzleProfitNotice p-8">
            <h4 className="mb-4 text-2xl font-medium text-primaryGreen">
              Start your investments
            </h4>
            <p className="mb-8 text-ogBlack">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam.
            </p>
            {/* {!isConnected && (
              <ConnectKitButton
                label="CONNECT WALLET"
                customTheme={{
                  "--ck-focus-color": "rgb(15, 85, 62)",
                  "--ck-connectbutton-font-size": "14px",
                  "--ck-connectbutton-color": "rgb(20,116,84)",
                  "--ck-connectbutton-background": "rgb(255,255,255)",
                  "--ck-connectbutton-hover-background": "rgb(20,116,84)",
                  "--ck-connectbutton-hover-color": "rgb(255,255,255)",
                  "--ck-connectbutton-border-radius": "6px",
                  "--ck-connectbutton-box-shadow":
                    "inset 0 0 0 1px rgb(20,116,84)",
                }}
              />
            )} */}
          </div>
          <div className="flex justify-center rounded-md bg-puzzleProfitNotice">
            <Image src="/icons/add.svg" width={63} height={63} alt="Add" />
          </div>
          <div className="flex justify-center rounded-md bg-puzzleProfitNotice">
            <Image src="/icons/add.svg" width={63} height={63} alt="Add" />
          </div>
        </div>
      )}
    </section>
  );
}
function clearQueryForRender(query) {
  const newQuery = [];
  query.map((item) => {
    console.log(item);

    newQuery.push({
      id: item.id,
      address: item.address,
      basicInvestment: {
        totalInvested: item.basicInvestment.totalInvested,
        totalInvestment: item.basicInvestment.totalInvestment,
        investmentStatus: item.basicInvestment.investmentStatus,
        car: {
          id: item.basicInvestment.car.id,
          basicInfo: {
            cover: {
              url: item.basicInvestment.car.basicInfo.cover.url,
            },
            title: item.basicInvestment.car.basicInfo.title,
          },
        },
      },
    });
  });
  return newQuery;
}
