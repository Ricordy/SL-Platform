import React, { useState } from "react";
import Image from "next/image";
import logo1 from "../../../public/logo-1.svg";

const TestingGuides = (props: any) => {
  const { mintPaymentToken, closeModal } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="relative flex  min-h-[370px]  w-4/5 flex-col items-center justify-items-center font-sans">
      <TeestingPanels activeIndex={activeIndex} />
      <div className="absolute bottom-0 flex gap-10">
        <button
          className="self-start rounded-md bg-black px-12 py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white"
          onClick={
            activeIndex === 0
              ? closeModal
              : () => setActiveIndex(activeIndex - 1)
          }
        >
          {activeIndex === 0 ? "Close" : "Previous"}
        </button>
        {activeIndex !== 0 && (
          <div className=" flex gap-1 whitespace-nowrap">
            {activeIndex > 3 && (
              <>
                <div
                  onClick={() => setActiveIndex(1)}
                  className="cursor-pointer"
                >
                  {" "}
                  1{" "}
                </div>
                {activeIndex > 4 && <div> ... </div>}
              </>
            )}
            {activeIndex > 2 && (
              <div
                onClick={() => setActiveIndex(activeIndex - 2)}
                className="cursor-pointer"
              >
                {activeIndex - 2}
              </div>
            )}{" "}
            {activeIndex > 1 && (
              <div
                onClick={() => setActiveIndex(activeIndex - 1)}
                className="cursor-pointer"
              >
                {activeIndex - 1}
              </div>
            )}{" "}
            <div className=" font-bold">{activeIndex}</div>
            {activeIndex < 7 && (
              <div
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="cursor-pointer"
              >
                {activeIndex + 1}
              </div>
            )}
            {activeIndex < 6 && (
              <>
                {activeIndex < 5 && <div> ... </div>}
                <div
                  className="cursor-pointer"
                  onClick={() => setActiveIndex(7)}
                >
                  {" "}
                  7{" "}
                </div>
              </>
            )}
          </div>
        )}

        {(activeIndex < 7 && (
          <button
            className="self-start rounded-md bg-black px-12 py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white"
            onClick={() => setActiveIndex(activeIndex + 1)}
          >
            {activeIndex === 0 ? "Begin" : "Next"}
          </button>
        )) || (
          <a
            className="self-start whitespace-nowrap rounded-md bg-black px-12 py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white"
            href="/our-cars"
          >
            Invest now
          </a>
        )}
      </div>
    </div>
  );
};

export default TestingGuides;

type TestingPanelsProps = {
  activeIndex: number;
};

const TeestingPanels = (props: TestingPanelsProps) => {
  const { activeIndex } = props;
  return (
    <>
      {activeIndex === 0 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <Image
            src={logo1 as string}
            alt="Something Legendary logo"
            className="max-h-40 w-full"
          />
          <h3 className="mt-10 text-center text-[27px] uppercase tracking-widest">
            Welcome Legendary Tester!
          </h3>
          <p className="text-justify">
            This beginner’s guide is designed to help users accomplish the
            platform basic tasks. However, please note that it is entirely
            optional, and we encourage users to follow their natural flow
            whenever possible.
          </p>
        </div>
      )}
      {activeIndex === 1 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className="whitespace-nowrap text-center text-[27px] uppercase tracking-widest">
            Step 1. Connect you wallet
          </h3>
          <p className="text-left">
            When you arrive at the Something Legendary platform, you will be
            prompted to connect your wallet. If you already have a wallet,
            simply connect it by following the on-screen instructions.
            <br />
            If you don't have a wallet yet, click [here] to create one.
            <br />
            Once your wallet is connected, you will gain access to the platform.
            However, you won't be able to invest without having the Something
            Legendary membership card (NFT).
          </p>
        </div>
      )}
      {activeIndex === 2 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className="whitespace-nowrap text-center text-[27px] uppercase tracking-widest">
            Step 2: Claim Testnet USDC
          </h3>
          <p className="text-left">
            After purchasing the membership card, you can now claim the testnet
            USDC used to simulate USDC in the testnet. To claim it, click [here]
            and follow the instructions. (add instructions).
          </p>
        </div>
      )}
      {activeIndex === 3 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className="text-center text-[27px] uppercase tracking-widest">
            Step 3: Purchase the Something Legendary Membership Card (NFT)
          </h3>
          <p className="text-left">
            To obtain the Something Legendary membership card (NFT) and gain
            full access to the platform's Level 1 features, navigate to the "My
            Investments" page or click [here] to go directly to the purchase
            page.
          </p>
        </div>
      )}
      {activeIndex === 4 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className="whitespace-nowrap text-center text-[27px] uppercase tracking-widest">
            Step 4: Invest 5000 Testnet USDC
          </h3>
          <p className="text-left">
            With the testnet USDC in your wallet, you can now start investing.
            Choose the Level 1 car you want to invest in and input the amount of
            5000 testnet USDC you want to invest in that car.
          </p>
        </div>
      )}
      {activeIndex === 5 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className="whitespace-nowrap text-center text-[27px] uppercase tracking-widest">
            Step 5: Claim a Level 1 Puzzle Piece
          </h3>
          <p className="text-left">
            Once you've made your investment, you can now claim a Level 1 puzzle
            piece in the "My Puzzle" section on the homepage.
          </p>
        </div>
      )}
      {activeIndex === 6 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className=" text-center text-[27px] uppercase tracking-widest">
            Step 6: View Your NFT in the "My Puzzle" Section
          </h3>
          <p className="text-left">
            After successfully claiming the puzzle piece, you will be able to
            see your NFT in the "My Puzzle" section on the homepage.
          </p>
        </div>
      )}
      {activeIndex === 7 && (
        <div className="flex w-full  flex-col items-center justify-items-center">
          <h3 className=" text-center text-[27px] uppercase tracking-widest">
            Congratulations!
          </h3>
          <p className="text-left">
            Congratulations! You have now completed the Something Legendary
            Beginner's guide. With your Something Legendary membership card and
            invested testnet USDC, you can now explore and participate in the
            Level 1 features and activities on the platform.
            <br />
            <br />
            Happy investing Legend!
          </p>
        </div>
      )}
    </>
  );
};
