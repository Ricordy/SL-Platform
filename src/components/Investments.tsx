import { useState } from "react";
import { Tab } from "@headlessui/react";
import { investmentData } from "../data/Investments";
import { investmentStatusesData } from "../data/InvestmentStatuses";
import { NumericFormat } from "react-number-format";
import { classNames } from "../lib/utils";
import ProjectCarousel from "./ProjectCarousel";
import { CarouselItemProps } from "./ProjectCarousel";
import Link from "next/link";
import Image from "next/image";
import { ConnectKitButton } from "connectkit";

interface InvestmentsProps {
  isConnected: boolean;
  userInvestments,
}
export default function Investments({ isConnected, userInvestments }: InvestmentsProps) {
  const [investmentStatuses] = useState(investmentStatusesData);

  

  return (
    <section
      id="investments"
      className="relative max-w-[1338px] w-full overflow-hidden flex flex-col"
    >
      <div className="flex ml-[58px] w-full justify-between mx-auto">
        <h2 className="text-2xl font-medium mb-[52px] uppercase">
          My Investments
        </h2>
        {isConnected && (
          <div className="mr-[116px]">
            <Link href="/my-investments">
              <a className="border-b-2 border-primaryGreen text-primaryGreen uppercase text-sm">
                See more
              </a>
            </Link>
          </div>
        )}
      </div>
      {isConnected && (
        <Tab.Group>
          <Tab.List className="flex ml-[58px] w-fit border-b border-b-gray-900/20">
            {investmentStatusesData.map((investmentStatus) => (
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
            {investmentStatusesData.map((investmentStatus) => {
              return (
                <Tab.Panel
                  key={investmentStatus}
                  className={classNames(
                    " pt-6",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2"
                  )}
                >

                  <ProjectCarousel
                    id={investmentStatus}
                    items={userInvestments.filter(investment => investment.basicInvestment.investmentStatus == investmentStatus)}
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
      )}
      {!isConnected && (
        <div className="grid ml-[58px] grid-cols-3 grid-flow-row auto-rows-auto justify-center gap-4 ">
          <div className="flex flex-col items-center rounded-md p-8 bg-puzzleProfitNotice">
            <h4 className="mb-4 text-primaryGreen font-medium text-2xl">
              Start your investments
            </h4>
            <p className="mb-8 text-ogBlack">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam.
            </p>
            {!isConnected && (
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
            )}
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
