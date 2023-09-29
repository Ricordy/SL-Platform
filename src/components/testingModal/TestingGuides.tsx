import React, { useState } from "react";
import Image from "next/image";
import logo1 from "../../../public/logo-1.svg";

const TestingGuides = (props: any) => {
  const { mintPaymentToken, closeModal } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="relative flex w-full flex-col items-center justify-items-center gap-[52px] font-sans md:w-4/5">
      <TeestingPanels
        activeIndex={activeIndex}
        mintPaymentToken={mintPaymentToken}
        setActiveIndex={setActiveIndex}
      />
      <div className="relative bottom-0 flex w-full items-center gap-10">
        {(activeIndex === 0 && (
          <button
            className="w-36 rounded-md bg-black py-1.5 text-center text-sm uppercase text-white md:px-[3.95rem] "
            onClick={
              activeIndex === 0
                ? closeModal
                : () => setActiveIndex(activeIndex - 1)
            }
          >
            Close
          </button>
        )) || (
          <button
            className="relative z-10 rounded-md bg-black px-8 py-1.5 text-center text-sm uppercase text-white md:px-[3.1rem] "
            onClick={
              activeIndex === 0
                ? closeModal
                : () => setActiveIndex(activeIndex - 1)
            }
          >
            Previous
          </button>
        )}
        {/** PAGINATION */}

        {activeIndex !== 0 && (
          <div className=" absolute hidden  w-full items-center justify-center  gap-1 whitespace-nowrap md:flex">
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
            className="right-0 w-36 rounded-md bg-black py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white md:px-[3.95rem]"
            onClick={() => setActiveIndex(activeIndex + 1)}
          >
            {activeIndex === 0 ? "Begin" : "Next"}
          </button>
        )) || (
          <a
            className="right-0 w-36 whitespace-nowrap rounded-md bg-primaryGreen py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-primaryGreen/80 md:px-10"
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
  mintPaymentToken: any;
  setActiveIndex: any;
};

const TeestingPanels = (props: TestingPanelsProps) => {
  const { activeIndex, mintPaymentToken, setActiveIndex } = props;
  return (
    <>
      {activeIndex === 0 && (
        <div className="flex w-full flex-col items-center justify-items-center gap-[35px]">
          <Image
            src={logo1 as string}
            alt="Something Legendary logo"
            className="max-h-20 w-full md:max-h-40"
          />
          <h3 className=" text-center text-2xl uppercase tracking-widest md:text-3xl ">
            Welcome Legendary Tester!
          </h3>
          <p className=" text-justify">
            This beginner&apos;s guide is designed to help users accomplish the
            platform basic tasks. However, please note that it is entirely
            optional, and we encourage users to follow their natural flow
            whenever possible.
          </p>
        </div>
      )}
      {activeIndex === 1 && (
        <div className="flex w-full flex-col  items-center justify-items-center gap-[52px]">
          <h3 className="whitespace-nowrap text-center text-2xl uppercase tracking-widest md:text-3xl">
            Step 1 <br /> <p className="font-normal">Connect your wallet</p>
          </h3>
          <p className="text-justify ">
            When you arrive at the{" "}
            <text className=" font-medium"> Something Legendary </text> platform
            , you will be prompted to connect your wallet. If you already have a
            wallet, simply connect it by following the on-screen instructions.
            <br />
            If you don't have a wallet yet,{" "}
            <a
              className=" font-medium text-primaryGold"
              href="https://metamask.io/download/"
              target="__blank"
            >
              click here
            </a>{" "}
            to create one.
            <br />
            Once your wallet is connected, you will gain access to the platform.
            However, you won't be able to invest without having the Something
            Legendary{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=4"
              target="__blank"
            >
              Membership Card
            </a>
            .
          </p>
        </div>
      )}
      {activeIndex === 2 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className="whitespace-nowrap text-center text-2xl uppercase tracking-widest md:text-3xl">
            Step 2<br /> <p className="font-normal">Claim Testnet USDC</p>
          </h3>
          <p className="text-justify">
            To obtain your{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=4"
              target="__blank"
            >
              Membership Card
            </a>
            , you'll require some funds. These funds are represented by{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=2"
              target="__blank"
            >
              testnet USDC
            </a>
            , which simulates real USDC in our testing environment. However,
            before claiming these testnet USDC, it's important to ensure you're
            connected to the Goerli network instead of the Ethereum Mainnet. To
            make this network switch,{" "}
            <a
              className=" font-medium text-primaryGold"
              href="https://metaschool.so/articles/how-to-change-add-new-network-metamask-wallet/"
              target="__blank"
            >
              click here
            </a>{" "}
            and follow the instructions. Once you're on the Goerli network, you
            can proceed to claim your testnet USDC by{" "}
            <a
              className=" cursor-pointer font-medium text-primaryGold"
              onClick={mintPaymentToken}
            >
              clicking here!
            </a>
          </p>
        </div>
      )}
      {activeIndex === 3 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className="text-center text-2xl uppercase tracking-widest md:text-3xl">
            Step 3<br />
            <p className="font-normal">
              Purchase the <br /> Membership Card
            </p>
          </h3>
          <p className="text-justify">
            To obtain the Something Legendary{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=4"
              target="__blank"
            >
              Membership Card
            </a>{" "}
            and gain full access to the platform's Level 1 features, navigate to
            the "My Investments" page or{" "}
            <a className=" font-medium text-primaryGold" href="/my-investments">
              click here
            </a>{" "}
            to go directly to the purchase page.
          </p>
        </div>
      )}
      {activeIndex === 4 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className="text-center text-2xl uppercase tracking-widest md:whitespace-nowrap md:text-3xl">
            Step 4<br />
            <p className="font-normal"> Invest 5000 Testnet USDC</p>
          </h3>
          <p className="text-justify">
            With the{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=2"
              target="__blank"
            >
              testnet USDC
            </a>{" "}
            in your wallet, you can now start investing. Choose the Level 1 car
            you want to invest in and input the amount of{" "}
            <text className=" font-medium">5000 testnet USDC</text> you want to
            invest in that car.
          </p>
        </div>
      )}
      {activeIndex === 5 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className="text-center text-2xl uppercase tracking-widest md:whitespace-nowrap md:text-3xl">
            Step 5 <br />
            <p className="font-normal"> Claim a Level 1 Puzzle Piece</p>
          </h3>
          <p className="text-justify">
            Once you've made your investment, you can now claim a Level 1{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=5"
              target="__blank"
            >
              puzzle piece
            </a>{" "}
            in the <text className=" font-medium"> "My Puzzle"</text> section on
            the homepage.
          </p>
        </div>
      )}
      {activeIndex === 6 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className=" text-center text-2xl uppercase tracking-widest md:text-3xl">
            Step 6 <br />
            <p className="font-normal">
              {" "}
              View Your NFT in the <br /> "My Puzzle" Section
            </p>
          </h3>
          <p className="text-justify">
            After successfully claiming the{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=5"
              target="__blank"
            >
              puzzle piece
            </a>
            , you will be able to see your NFT in the{" "}
            <text className=" font-medium"> "My Puzzle"</text> section on the
            homepage.
          </p>
        </div>
      )}
      {activeIndex === 7 && (
        <div className="flex w-full  flex-col items-center justify-items-center  gap-[52px]">
          <h3 className=" text-center text-2xl uppercase tracking-widest md:text-3xl">
            Congratulations!
          </h3>
          <p className="text-justify">
            Congratulations! You have now completed the{" "}
            <a
              className=" font-medium text-primaryGold"
              onClick={() => setActiveIndex(0)}
            >
              Something Legendary Beginner's guide
            </a>
            . With your{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=4"
              target="__blank"
            >
              Something Legendary Membership Card
            </a>{" "}
            and invested{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=2"
              target="__blank"
            >
              testnet USDC
            </a>
            , you can now explore and participate in the{" "}
            <a
              className=" font-medium text-primaryGold"
              href="/Something-Legendary-Beginner's-guide.pdf#page=6"
              target="__blank"
            >
              Level 1
            </a>{" "}
            features and activities on the platform.
            <br />
            <br />
            Happy investing Legend!
          </p>
        </div>
      )}
    </>
  );
};
