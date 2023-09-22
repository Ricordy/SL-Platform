import { Tab } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { investmentStatusesData } from "../data/InvestmentStatuses";
import { cn } from "../lib/utils";
import ProjectCarousel from "./ProjectCarousel";
import { Button } from "./ui/Button";
import NoInvestments from "./NoInvestments";

interface InvestmentsProps {
  isConnected: boolean;
  userInvestments;
}
export default function Investments({
  isConnected,
  userInvestments,
}: InvestmentsProps) {
  const [investmentStatuses] = useState(investmentStatusesData);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  return (
    <section
      id="investments"
      className="relative flex w-full flex-col px-6 md:px-0"
    >
      <div className="mx-auto flex w-full justify-between md:pl-[58px]">
        <h2 className="mb-12 text-2xl font-medium uppercase md:mb-[52px]">
          My Investments
        </h2>
        {isConnected && (
          <div className="md:mr-36">
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
          <Tab.List className="flex w-fit border-b border-b-gray-900/20 md:ml-[58px]">
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
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-200 focus:outline-none focus:ring-2 "
                  )}
                >
                  {investmentStatus == investmentStatusesData[0] &&
                    userInvestments.filter(
                      (investment) =>
                        investment.basicInvestment.investmentStatus ==
                        investmentStatus
                    ).length == 0 && (
                      <NoInvestments
                        active={false}
                        buttonLabel="Start Investing"
                        isConnected={isConnected}
                        url="/our-cars"
                      />
                    )}
                  <ProjectCarousel
                    id={investmentStatus}
                    items={userInvestments.filter(
                      (investment) =>
                        investment.basicInvestment.investmentStatus ==
                        investmentStatus
                    )}
                  />
                </Tab.Panel>
              );
            })}
          </Tab.Panels>
        </Tab.Group>
      )}
      {!isConnected && <NoInvestments isConnected={isConnected} />}
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
