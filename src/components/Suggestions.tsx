import React from "react";
import Carousel from "./Carousel";
import { type InvestmentProps } from "~/@types/investment";
import { cn } from "~/lib/utils";
import { useInvestments } from "~/lib/zustand";
import { type Address, useAccount } from "wagmi";

interface SuggestionsProps {
  className?: string;
  items?: InvestmentProps[];
}

const Suggestions = ({ className, items }: SuggestionsProps) => {
  const allInvestments = useInvestments((state) => state.investments);
  const userInvestments = useInvestments((state) => state.userInvestments);
  const { address: walletAddress } = useAccount();

  const getMissingInvestments = (allInvestments, userInv) => {
    // Create a set of investment addresses from the userInv array
    const userInvAddresses = new Set(
      userInv?.map((investment) => investment.address)
    );

    // Filter the allInvestments array to get the missing investments
    let missingInvestments = allInvestments?.filter(
      (investment) => !userInvAddresses.has(investment.address)
    );

    // If the length of missingInvestments is less than 3, add elements from userInv
    if (missingInvestments?.length < 3) {
      for (
        let i = 0;
        missingInvestments?.length < 3 && i < userInv?.length;
        i++
      ) {
        missingInvestments?.push(userInv[i]);
      }
    } else if (missingInvestments?.length > 3) {
      missingInvestments = missingInvestments?.slice(0, 3);
    }

    return missingInvestments;
  };

  if (!items) items = getMissingInvestments(allInvestments, userInvestments);

  return (
    <div
      className={cn(
        "relative z-20 mx-auto flex w-full rounded-t-[56px] bg-black pt-[72px] text-white md:pb-[128px]",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[850px] flex-col gap-[52px]">
        {items && (
          <Carousel
            id="55"
            className="mb-6 max-w-[850px] px-6 pt-0 md:-ml-[58px] md:mb-0 md:px-0 md:pt-6"
            title={
              <h2 className="text-center text-2xl md:text-left">
                Our suggestion for you
              </h2>
            }
            items={items}
            userAddress={walletAddress as Address}
            isLevelDivided={false}
            slidesPerView={3}
            prevNavWhite={true}
          />
        )}
      </div>
    </div>
  );
};

export default Suggestions;
