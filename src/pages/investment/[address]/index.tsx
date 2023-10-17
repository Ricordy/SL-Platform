import { Tab } from "@headlessui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BigNumber, Transaction } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { NumericFormat } from "react-number-format";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import Carousel from "../../../components/Carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {
  useAccount,
  useContract,
  useContractRead,
  usePrepareContractWrite,
  useSigner,
  type Address,
} from "wagmi";
import { type TransactionItemProps } from "~/@types/TransactionItem";
import { type InvestmentProps } from "~/@types/investment";
import { InvestmentModal } from "~/components/modal/InvestmentModal";
import { CONTRACT_STATUS_WITHDRAW } from "~/constants";
import { SLCoreABI, investmentABI, paymentTokenABI } from "~/utils/abis";
import NavBar from "../../../components/NavBar";
import { Button } from "../../../components/ui/Button";
import ProgressBar from "../../../components/ui/ProgressBar";
import { ExternalLink } from "../../../components/ui/icons/External";
import { cn, formatAddress, getMissingInvestments } from "../../../lib/utils";
import { InvestmentsProps } from "~/pages/my-investments";
import { getSession, useSession } from "next-auth/react";
import Suggestions from "~/components/Suggestions";
import { TransactionProps } from "~/@types/transaction";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { useBlockchainInfo, useContractInfo } from "~/lib/zustand";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { A11y, Navigation } from "swiper";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import MyAlertButton from "~/components/MyAlertButton";

dayjs.extend(localizedFormat);

// interface InvestmentProps {
//   investment: {
//     basicInvestment: {
//       totalInvestment: number;
//       investmentStatus: string;
//       car: {
//         basicInfo: {
//           title: string;
//           cover: {
//             url: string;
//           };
//         };
//         subtitle: string;
//         shortDescription: string;
//         description: string;
//         chassis: string;
//         totalProduction: number;
//         totalModelProduction: number;
//         colorCombination: string;
//         gallery: {
//           url: string;
//         }[];
//         chart: {
//           url: string;
//         };
//       };
//     };
//     address: Address;
//     salesEnd: string;
//     salesStart: string;
//     estimateClaiming: string;
//     level: {
//       profitRange: string;
//     };
//     restorationPhases: {
//       title: string;
//       deadline: string;
//       currentCost: number;
//       costExpectation: number;
//       restorationStatus: string;
//       gallery: {
//         url: string;
//       }[];
//       restorationUpdates: {
//         title: string;
//         date: string;
//       }[];
//     }[];
//     transactions: {
//       amountInvested: number;
//       date: string;
//       type: string;
//       hash: string;
//       from: string;
//     }[];
//   };
//   transactions: {
//     from: Address;
//   };
// }

const InvestmentGallery = ({ images }) => {
  return (
    <Gallery>
      <div className="gallery items-center justify-center">
        <div className="grid  justify-around gap-4 ">
          <Item
            original={images[0].url}
            thumbnail={images[0].url}
            width="1432"
            height="955"
          >
            {({ ref, open }) => (
              <Image
                className="col-span-2 row-span-2 h-full w-full cursor-pointer rounded-md"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                alt="Car Image"
                width={767}
                height={400}
                style={{ objectFit: "cover" }}
                onClick={open}
                src={images[0].url}
              />
            )}
          </Item>

          <Item
            original={images[1].url}
            thumbnail={images[1].url}
            width="1432"
            height="955"
          >
            {({ ref, open }) => (
              <Image
                className=" max-h-full w-full cursor-pointer rounded-md object-cover"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                alt="Car Image"
                width={767}
                height={400}
                onClick={open}
                src={images[1].url}
              />
            )}
          </Item>
          <Item
            original={images[2].url}
            thumbnail={images[2].url}
            width="1432"
            height="955"
          >
            {({ ref, open }) => (
              <Image
                className="col-start-3 max-h-full w-full cursor-pointer rounded-md object-cover"
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                alt="Car Image"
                width={248}
                height={100}
                onClick={open}
                src={images[2].url}
              />
            )}
          </Item>
        </div>
      </div>
    </Gallery>
  );
};
export const ProjectInfo = ({
  progress,
  status,
  totalInvestment,
  isFlexCol,
}: {
  progress: number;
  status: string;
  totalInvestment: number;
  isFlexCol?: boolean;
}) => {
  return (
    <div className="relative flex gap-[24px] ">
      <div
        className={cn(
          `relative flex flex-col gap-2 pr-4`,
          isFlexCol ? "" : "md:flex-row"
        )}
      >
        <span>Status:</span>
        <span className="font-medium">{status}</span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>

      <div
        className={cn(
          `relative flex flex-col gap-2 pr-4`,
          isFlexCol ? "" : "md:flex-row"
        )}
      >
        <span>Price:</span>
        <span className="now font-medium">
          <NumericFormat
            value={totalInvestment?.toString()}
            displayType="text"
            fixedDecimalScale={true}
            decimalSeparator=","
            thousandSeparator="."
            decimalScale={0}
            prefix="$ "
          />
        </span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>
      <div
        className={cn(
          `relative flex flex-col gap-2 pr-4`,
          isFlexCol ? "" : "md:flex-row"
        )}
      >
        <span>Progress:</span>
        <span className="font-medium">
          <NumericFormat
            value={progress % 1 === 0 ? progress.toString() : progress}
            displayType="text"
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            suffix="%"
          />{" "}
          Finished
        </span>
      </div>
    </div>
  );
};

const TransactionItem = ({
  value,
  date,
  type,
  hash,
  divisor = true,
  wallet,
  from,
}: TransactionItemProps) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center justify-between py-8 first:pt-4",
        from === wallet ? "bg-primaryGold/20 hover:bg-primaryGold/30" : ""
      )}
    >
      <div className="w-1/4 text-right">
        <NumericFormat
          value={value.toString()}
          displayType="text"
          fixedDecimalScale={true}
          decimalSeparator=","
          thousandSeparator="."
          decimalScale={0}
          prefix="$ "
        />
      </div>
      <span className="text-xs text-primaryGreen">{type}</span>
      <span>{dayjs(date).format("ll")}</span>
      <Link
        href={`https://goerli.etherscan.io/tx/${hash}`}
        className="pr-2"
        target="_blank"
      >
        <ExternalLink className="h-3 w-3" />
      </Link>
      {/* <div className="flex h-0.5 w-full bg-primaryGold/10"></div> */}
    </div>
  );
};

export const badges = {
  inprogress: {
    icon: "/badges/in-progress.svg",
    label: "In Progress",
    text: "text-badgeInProgressText",
    bg: "bg-badgeInProgressBackground",
  },
  done: {
    icon: "/badges/done.svg",
    label: "Done",
    text: "text-primaryGreen",
    bg: "bg-puzzleProfitNotice",
  },
};

type InvestmentDetailsProps = {
  investment?: InvestmentProps;
  address: string;
  transaction?: TransactionProps[];
};

const Investment = ({ address: investmentAddress }: InvestmentDetailsProps) => {
  const { address: walletAddress } = useAccount();
  const { data: signerData } = useSigner();
  const { data: sessionData } = useSession();
  const info = useContractInfo((state) => state.contractAddress);
  const setAddress = useContractInfo((state) => state.setAddress);
  const investment = useContractInfo((state) => state.currentInvestmentInfo);
  const fetchInfoInv = useContractInfo(
    (state) => state.fetchCurrentInvestmentInfo
  );
  const transactions = useContractInfo((state) => state.contractTransactions);
  const fetchTransactions = useContractInfo((state) => state.fetchTransactions);
  const totalSupply = useBlockchainInfo((state) => state.totalSupply);
  const userTotalInvestment = useBlockchainInfo(
    (state) => state.userTotalInvestment
  );
  const paymentTokenBalance = useBlockchainInfo(
    (state) => state.paymentTokenBalance
  );
  const maxToInvest = useBlockchainInfo((state) => state.maxToInvest);
  const minToInvest = useBlockchainInfo((state) => state.minToInvest);
  const contractLevel = useBlockchainInfo((state) => state.contractLevel);
  const userLevel = useBlockchainInfo((state) => state.userLevel);
  const contractStatus = useBlockchainInfo((state) => state.contractStatus);
  const fetchDynamicBcInfo = useBlockchainInfo(
    (state) => state.fetchDynamicInfo
  );
  const fetchContractStatus = useBlockchainInfo(
    (state) => state.fetchContractStatus
  );
  const fetchStaticInfo = useBlockchainInfo((state) => state.fetchStaticInfo);
  const isMounted = useRef(false);
  const { isAboveMd, isBelowMd } = useBreakpoint("md");
  const [tabIndex, setTabIndex] = useState(0);

  const [canWithdraw, setCanWithdraw] = useState(false);

  const investContract = useContract({
    address: investment?.address,
    abi: investmentABI,
    signerOrProvider: signerData,
  });

  useEffect(() => {
    if (!info) {
      setAddress(investmentAddress);
    }
    if (!investment) {
      fetchInfoInv(investmentAddress);
    }
    if (!transactions) {
      fetchTransactions(investmentAddress);
    }
    if (!totalSupply) {
      fetchDynamicBcInfo(investmentAddress, walletAddress);
    }
    if (!maxToInvest) {
      fetchStaticInfo(walletAddress, investmentAddress);
    }
    fetchContractStatus(investmentAddress);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { config: withdrawCallConfig } = usePrepareContractWrite({
    address: investment?.address,
    abi: investmentABI,
    functionName: "withdraw",
    enabled:
      userTotalInvestment &&
      userTotalInvestment.gt(0) &&
      contractStatus == CONTRACT_STATUS_WITHDRAW,
    onSuccess() {
      setCanWithdraw(true);
    },
    onError(err) {
      if (
        err.message &&
        err.message.indexOf("Investment: User already withdrawed") > -1
      ) {
        setCanWithdraw(false);
      } else {
        // toast.error(err.message);
      }
    },
  });

  // const { write: withdraw } = useContractWrite(withdrawCallConfig);

  async function onClickWithdraw() {
    const results = investContract && (await investContract.withdraw());

    try {
      const response = await fetch("/api/addTransaction", {
        method: "POST",
        body: JSON.stringify({
          hash: results?.hash,
          from: walletAddress,
          to: investment?.address,
          amountInvested:
            Number(totalSupply) / 10 ** 6 + (profitMinimumValue || 0),
          date: dayjs(new Date()).format("YYYY-MM-DD"),
          type: "withdraw",
          investment: {
            connect: {
              address: investment?.address,
            },
          },
        }),
      });

      if (!response.ok)
        toast.error(JSON.stringify("Error on fecthing API", response.text));
      // throw new Error(`Something went wrong submitting the form.`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (!investment) {
    if (isMounted.current) {
      return <div></div>;
    }
    return (
      <div className="flex min-h-screen items-center justify-center text-center text-white">
        Investment not found :(
      </div>
    );
  }

  const progress = totalSupply
    ? (totalSupply?.div(10 ** 6).toNumber() /
        investment.basicInvestment.totalInvestment) *
      100
    : 0;

  const phases = investment.restorationPhases?.map((phase) => ({
    status: phase.restorationStatus.toLocaleLowerCase(),
    title: phase.title,
    deadline: phase.deadline,
    estimatedCost: phase.costExpectation,
    currentCost: phase.currentCost,
    gallery: phase.gallery,
    updates: phase.restorationUpdates,
  }));

  // Fake data
  // phases = phases.reduce(function (res, current, index, array) {
  //   return res.concat([current, current]);
  // }, []);

  const profitMinimumPercentage = BigNumber.from(
    investment.level.profitRange.split("-")[0]
  );
  const profitMaximumPercentage = BigNumber.from(
    investment.level.profitRange.split("-")[1]
  );

  const profitMinimumValue =
    userTotalInvestment &&
    profitMinimumPercentage
      .mul(userTotalInvestment)
      .div(10 ** 6)
      .div(100)
      .toNumber();
  const profitMaximumValue =
    userTotalInvestment &&
    profitMaximumPercentage
      .mul(userTotalInvestment)
      .div(10 ** 6)
      .div(100)
      .toNumber();

  function countUniques(transactions: any) {
    const uniqueFromValues = new Set();
    for (let i = 0; i < transactions?.length; i++) {
      if (transactions[i].from !== null) {
        uniqueFromValues.add(transactions[i].from);
      }
    }
    return uniqueFromValues.size;
  }

  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="mx-auto flex  min-h-screen w-full flex-col bg-white md:mt-0 md:px-0">
        <NavBar bgWhite={true} />
        <div className="mx-auto flex h-full w-full max-w-screen-lg flex-col gap-6 px-6 md:gap-12 md:px-0 ">
          <div className="sticky top-0 z-20 mx-auto flex w-full flex-col items-center justify-between bg-white py-4 md:flex-row">
            <div className="flex flex-col gap-6">
              <div className="flex justify-center gap-2 align-middle ">
                <h2 className="text-3xl font-medium md:text-4xl">
                  {investment.basicInvestment.car.basicInfo.title}
                </h2>
                {investment.level.basicLevel.title && (
                  <div className="z-10 mt-2 h-fit w-fit whitespace-nowrap rounded-lg border border-primaryGold bg-white px-2 py-1 text-xs text-primaryGold ">
                    {investment.level.basicLevel.title}
                  </div>
                )}
              </div>

              <p>{investment.basicInvestment.car.subtitle}</p>
            </div>

            <InvestmentModal
              userAddress={walletAddress as Address}
              className="flex flex-col justify-between align-middle"
              title={investment?.basicInvestment.car.basicInfo.title}
              chassis={investment?.basicInvestment.car.chassis}
              contractAddress={investment?.address}
              totalProduction={investment?.basicInvestment.car.totalProduction}
              totalModelProduction={
                investment?.basicInvestment.car.totalModelProduction
              }
              colorCombination={
                investment?.basicInvestment.car.colorCombination
              }
              totalInvestment={Number(totalSupply) / 10 ** 6}
              maxToInvest={
                Number(maxToInvest) -
                userTotalInvestment?.div(10 ** 6).toNumber()
              }
              minToInvest={Number(minToInvest)}
              paymentTokenBalance={Number(paymentTokenBalance?.div(10 ** 6))}
              contractLevel={contractLevel as any as number}
              userLevel={userLevel as any as number}
            />
          </div>
          {investment.basicInvestment.car.gallery.length > 0 && (
            <InvestmentGallery
              images={investment.basicInvestment.car.gallery}
            />
          )}
          <div className="flex max-h-full flex-col items-start justify-between  gap-12 md:flex-row">
            <div className="flex max-h-full flex-col gap-[14px] md:w-[55%]  ">
              <h3 className="flex items-center gap-6 tracking-widest md:pb-[52px]">
                <Image
                  src="/icons/keys.svg"
                  width={35}
                  height={38}
                  alt="General Information"
                />
                General Information
              </h3>
              <ProjectInfo
                progress={progress}
                status={investment.basicInvestment.investmentStatus}
                totalInvestment={investment.basicInvestment.totalInvestment}
              />
              <ProgressBar
                color="bg-progressActiveBackground"
                progress={progress}
              />
              <div className=" h-full max-h-[436px] overflow-scroll">
                <h3 className="pb-5 pt-[52px]">Description</h3>
                <p className="font-normal text-ogBlack">
                  {investment.basicInvestment.car.shortDescription}
                </p>
              </div>
            </div>
            <div className="relative right-0 mr-0 flex flex-col gap-8 md:w-2/5">
              {
                <div className="flex flex-col gap-2 rounded-md border border-b border-tabInactive bg-[#F6F9F8] py-[15px]  text-center">
                  <h4 className="text-ogBlack">Total Invested until now</h4>
                  <span className="text-3xl font-medium tracking-wider text-primaryGreen">
                    <NumericFormat
                      value={totalSupply && totalSupply.div(10 ** 6).toString()}
                      displayType="text"
                      fixedDecimalScale={true}
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={0}
                      prefix="$ "
                    />
                  </span>
                  <h4 className="flex w-full  justify-center gap-3  text-primaryGrey">
                    Investing here: {countUniques(transactions)}
                    <Image
                      src="/icons/mini-avatar.svg"
                      alt="Avatar"
                      width={12}
                      height={12}
                    />{" "}
                    <span className="text-primaryGold ">
                      {/* {investors && investors.toNumber()} */}
                    </span>
                  </h4>
                </div>
              }
              <div className="flex flex-col justify-start gap-5 rounded-md bg-[#F6F9F8] px-6 py-[32px] align-middle text-ogBlack md:px-16">
                <h3 className="text-black">Specifications</h3>
                <div>
                  <span>Contract Address:</span>
                  <span className="text-primaryGreen">
                    <Link
                      href={`https://goerli.etherscan.io/address/${investment?.address}`}
                      className="flex items-center gap-3"
                    >
                      {formatAddress(investment?.address)} <FiExternalLink />
                    </Link>
                  </span>
                </div>
                <div className="flex flex-col ">
                  <span>Chassis NR:</span>
                  <span className="pb-2 font-normal text-black">
                    {investment?.basicInvestment.car.chassis}
                  </span>
                </div>

                <div className="flex w-full justify-between gap-10">
                  <div className="mr-3 flex flex-col ">
                    <span>Total Production</span>
                    <span className="text-black">
                      {investment?.basicInvestment.car.totalProduction}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span>Total Model Prouction</span>
                    <span className="text-black">
                      {investment?.basicInvestment.car.totalModelProduction}
                    </span>
                  </div>
                </div>
                <div className=" flex flex-col">
                  <span>Color Combination:</span>
                  <span className="pb-8 font-normal text-black">
                    {investment?.basicInvestment.car.colorCombination}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <section>
            <h3 className="flex items-center gap-4 py-[52px]">
              <Image
                src="/icons/tasks.svg"
                width={39}
                height={38}
                alt="Tasks"
              />{" "}
              Tasks
            </h3>
          </section>
          <section>
            <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
              <Tab.List className="relative flex w-full md:p-1">
                <div
                  className={cn(
                    `swiper-prev-phases absolute left-3 z-10 flex items-center justify-center`,
                    isAboveMd ? "top-6" : "top-0"
                  )}
                >
                  {
                    <Image
                      src={"/icons/pagination-previous-black.svg"}
                      width={isAboveMd ? 38 : 28}
                      height={isAboveMd ? 38 : 28}
                      alt="Previous"
                    />
                  }
                </div>
                <Swiper
                  className="w-full"
                  pagination
                  slidesPerView={isAboveMd ? 2 : "auto"}
                  centeredSlides={isAboveMd ? false : true}
                  init={false}
                  modules={[Navigation, A11y]}
                  navigation={{
                    nextEl: `.swiper-next-phases`,
                    prevEl: `.swiper-prev-phases`,
                  }}
                  onSlideChange={(s) => setTabIndex(s.activeIndex)}
                >
                  {phases.map((phase) => (
                    <SwiperSlide key={phase.title} className="w-full">
                      <Tab
                        className={({ selected }) =>
                          cn(
                            "flex w-full flex-col items-center justify-between gap-4 border-b-4 py-2.5  text-xl font-light  leading-5 text-primaryGreen",
                            "  focus:outline-none focus:ring-2",
                            selected
                              ? "border-b-4 border-primaryGreen bg-white font-medium ring-transparent"
                              : "text-tabInactive hover:border-b-4 hover:border-primaryGreen hover:bg-black/5 hover:text-primaryGreen"
                          )
                        }
                      >
                        <div
                          className={cn(
                            "flex gap-2 rounded-full px-2 py-1 text-xs",
                            badges[phase.status].bg,
                            badges[phase.status].text
                          )}
                        >
                          <Image
                            src={badges[phase.status].icon}
                            width={12}
                            height={12}
                            alt={badges[phase.status].label}
                          />
                          {badges[phase.status].label}
                        </div>
                        {phase.title}
                      </Tab>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div
                  className={cn(
                    `swiper-next-phases absolute right-3 z-10 flex items-center justify-center`,
                    isAboveMd ? "top-6" : "top-0"
                  )}
                >
                  {
                    <Image
                      src={"/icons/pagination-next-black.svg"}
                      width={isAboveMd ? 38 : 28}
                      height={isAboveMd ? 38 : 28}
                      alt="Next"
                    />
                  }
                </div>
              </Tab.List>
              {userTotalInvestment?.gt(0) && phases.length > 0 && (
                <Tab.Panels className="mt-6 md:mt-[52px]">
                  {phases.map((phase, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={cn(
                        "bg-white md:mx-4",
                        "flex flex-col gap-4 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                      )}
                    >
                      <span
                        className={cn(
                          "hidden gap-1 self-start rounded-full px-2 py-1 text-xs md:flex",
                          badges[phase.status].bg,
                          badges[phase.status].text
                        )}
                      >
                        <Image
                          src={badges[phase.status].icon}
                          width={12}
                          height={12}
                          alt={badges[phase.status].label}
                        />
                        {badges[phase.status].label}
                      </span>
                      <h3 className="hidden md:block">{phase.title}</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col justify-around divide-primaryGrey pb-8 text-primaryGrey md:flex-row md:divide-x">
                            <div className="flex flex-col">
                              <span>Deadline:</span>
                              <span className="text-black">
                                {dayjs(phase.deadline).format("ll")}
                              </span>
                            </div>
                            <div className="flex flex-col md:px-4">
                              <span>Cost Expectation:</span>
                              <span className="text-black">
                                <NumericFormat
                                  value={phase.estimatedCost}
                                  displayType="text"
                                  fixedDecimalScale={true}
                                  decimalSeparator=","
                                  thousandSeparator="."
                                  decimalScale={0}
                                  prefix="$ "
                                />
                              </span>
                            </div>
                            <div className="flex flex-col md:px-4">
                              <span>Current Cost:</span>
                              <span className="text-black">
                                <NumericFormat
                                  value={phase.currentCost}
                                  displayType="text"
                                  fixedDecimalScale={true}
                                  decimalSeparator=","
                                  thousandSeparator="."
                                  decimalScale={0}
                                  prefix="$ "
                                />
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col bg-[#F6F9F8] p-8">
                            <h4 className="flex gap-3 pb-4">
                              <Image
                                src="/icons/updates.svg"
                                width={20}
                                height={20}
                                alt="Updates"
                              />
                              <span>Updates</span>
                            </h4>
                            <div className="flex flex-col gap-2 ">
                              {phase.updates.map((update, idx) => (
                                <div
                                  className={cn(
                                    "flex  flex-col text-tabInactive",
                                    idx > 0 ? "border-t border-tabInactive" : ""
                                  )}
                                  key={update.title}
                                >
                                  <span className="">
                                    {dayjs(update.date).format("lll")}
                                  </span>
                                  <span className="text-black">
                                    {update.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="relative row-start-1 flex w-full md:row-start-auto">
                          <ResponsiveCarousel
                            showStatus={false}
                            showThumbs={false}
                          >
                            {phase.gallery.map((image, idx) => (
                              <div key={idx} className="relative w-full">
                                <Image
                                  src={image.url}
                                  width={960}
                                  height={400}
                                  // objectFit={"contain"}
                                  // layout="fill"
                                  alt="car"
                                />
                              </div>
                            ))}
                          </ResponsiveCarousel>
                        </div>
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              )}
            </Tab.Group>
          </section>

          <section className="">
            <h3 className="flex items-center gap-4 pb-[52px] pt-6 md:pt-[132px]">
              <Image
                src="/icons/investments.svg"
                width={39}
                height={38}
                alt="Investments"
              />{" "}
              Investments
            </h3>
            {(userTotalInvestment && userTotalInvestment > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 ">
                {/** Already invested */}
                <div className="flex h-fit flex-col gap-4 bg-[#F6F9F8] p-10">
                  <div className="flex">Total Invested:</div>
                  <span className="pb-2 text-4xl font-semibold tracking-widest text-primaryGreen">
                    <NumericFormat
                      value={
                        userTotalInvestment
                          ? (Number(userTotalInvestment) / 10 ** 6).toString()
                          : 0
                      }
                      displayType="text"
                      fixedDecimalScale={true}
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={0}
                      prefix="$ "
                    />
                  </span>
                  <div className="flex">Return expected:</div>
                  <div className="flex gap-6 pb-2">
                    <div className="flex flex-col">
                      <div className="flex">Minimum:</div>
                      <div className="flex items-center gap-3 text-2xl font-medium">
                        <NumericFormat
                          value={
                            userTotalInvestment && profitMinimumValue
                              ? (
                                  userTotalInvestment.div(10 ** 6).toNumber() +
                                  profitMinimumValue
                                ).toString()
                              : 0
                          }
                          displayType="text"
                          fixedDecimalScale={true}
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$ "
                        />
                        <span className="text-sm text-primaryGreen">
                          ({profitMinimumPercentage.toNumber()}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex">Maximum:</div>
                      <div className="flex items-center gap-3 text-2xl font-medium">
                        <NumericFormat
                          value={
                            userTotalInvestment && profitMaximumValue
                              ? (
                                  userTotalInvestment.div(10 ** 6).toNumber() +
                                  profitMaximumValue
                                ).toString()
                              : 0
                          }
                          displayType="text"
                          fixedDecimalScale={true}
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$ "
                        />
                        <span className="text-sm text-primaryGreen">
                          ({profitMaximumPercentage.toNumber()}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col pb-[52px]">
                    <div className="flex text-secondaryGrey">Sales end:</div>
                    <div className="flex gap-6">
                      <div className="flex flex-col text-2xl font-medium ">
                        <span className="">
                          {dayjs(investment.salesEnd).format("ll")}
                        </span>
                        <span>
                          {dayjs(investment.salesEnd).format("hh:mm a Z")}
                        </span>
                      </div>
                      <div className="flex flex-col justify-between text-primaryGrey">
                        <div className="flex gap-3">
                          <div className="flex ">Sales Began:</div>
                          <span className="font-medium">
                            {dayjs(investment.salesStart).format("ll")}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex">Estimate Claiming:</div>
                          <span className="font-medium">
                            {dayjs(investment.estimateClaiming).format("ll")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-8">
                    {/* <InvestmentModal
                    className="flex flex-col justify-between align-middle"
                    title={investment?.basicInvestment.car.basicInfo.title}
                    chassis={investment?.basicInvestment.car.chassis}
                    contractAddress={investment?.address}
                    totalProduction={
                      investment?.basicInvestment.car.totalProduction
                    }
                    totalModelProduction={
                      investment?.basicInvestment.car.totalModelProduction
                    }
                    colorCombination={
                      investment?.basicInvestment.car.colorCombination
                    }
                    totalInvestment={Number(totalSupply) / 10 ** 6}
                    maxToInvest={Number(maxToInvest) / 10 ** 6}
                    minToInvest={Number(minToInvest)}
                    paymentTokenBalance={Number(paymentTokenBalance?.formatted)}
                  /> */}
                    {/* <Button
                    disabled={!canWithdraw}
                    variant="outline"
                    onClick={onClickWithdraw}
                  >
                    Withdraw
                  </Button> */}
                    <InvestmentModal
                      userAddress={walletAddress as Address}
                      className="flex flex-col justify-between align-middle"
                      title={investment?.basicInvestment.car.basicInfo.title}
                      chassis={investment?.basicInvestment.car.chassis}
                      contractAddress={investment?.address}
                      totalProduction={
                        investment?.basicInvestment.car.totalProduction
                      }
                      totalModelProduction={
                        investment?.basicInvestment.car.totalModelProduction
                      }
                      colorCombination={
                        investment?.basicInvestment.car.colorCombination
                      }
                      totalInvestment={Number(totalSupply) / 10 ** 6}
                      maxToInvest={
                        Number(maxToInvest) -
                        userTotalInvestment?.div(10 ** 6).toNumber()
                      }
                      minToInvest={Number(minToInvest)}
                      paymentTokenBalance={Number(
                        paymentTokenBalance?.div(10 ** 6)
                      )}
                      contractLevel={contractLevel as any as number}
                      userLevel={userLevel as any as number}
                    />
                    <MyAlertButton
                      triggerButtonLabel={"Withdraw"}
                      confirmAction={onClickWithdraw}
                      triggerButtonClassname={cn()}
                      variant="outline"
                      isTriggerDisabled={!canWithdraw}
                    />
                  </div>
                </div>
                <div className="flex max-h-[492px]   flex-col">
                  <h3>Transactions:</h3>
                  <div className=" mt-8 flex flex-col divide-y-[0.50px] divide-divideTransaction overflow-y-auto scroll-smooth rounded-md px-4">
                    {transactions?.map((transaction) => (
                      <TransactionItem
                        key={transaction.hash}
                        value={transaction.amountInvested}
                        date={transaction.date}
                        type={transaction.type}
                        hash={transaction.hash}
                        wallet={walletAddress}
                        from={transaction.from}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )) || (
              <div className=" ">
                {/** Didnt invest yet */}
                <div className="flex h-fit w-full  justify-between divide-x-2 bg-[#F6F9F8] p-[52px] ">
                  <div className=" flex w-full flex-col items-center justify-between">
                    <div className="flex">Total Invested until now:</div>
                    <span className=" text-4xl font-semibold tracking-widest text-primaryGreen">
                      <NumericFormat
                        value={
                          totalSupply && totalSupply.div(10 ** 6).toString()
                        }
                        displayType="text"
                        fixedDecimalScale={true}
                        decimalSeparator=","
                        thousandSeparator="."
                        decimalScale={0}
                        prefix="$ "
                      />
                    </span>
                    <h4 className="flex  gap-3  text-primaryGrey">
                      Investing here: {countUniques(transactions)}
                      <Image
                        src="/icons/mini-avatar.svg"
                        alt="Avatar"
                        width={12}
                        height={12}
                      />{" "}
                      <span className="text-primaryGold "></span>
                    </h4>
                  </div>
                  <div className=" flex   w-full flex-col items-center gap-4 ">
                    <div>
                      <div className=" self-">Return expected:</div>
                      <div className="flex gap-6 pb-2">
                        <div className="flex flex-col">
                          <div className="flex">Minimum:</div>
                          <div className="flex items-center gap-3 text-2xl font-medium">
                            <span className=" text-primaryGreen">
                              {profitMinimumPercentage.toNumber()}%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex">Maximum:</div>
                          <div className="flex items-center gap-3 text-2xl font-medium">
                            <span className=" text-primaryGreen">
                              {profitMaximumPercentage.toNumber()}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full min-w-fit items-center gap-4 pl-10 ">
                    <div className="">
                      <div className=" text-secondaryGrey">Sales end:</div>
                      <div className="flex gap-6">
                        <div className="flex flex-col text-2xl font-medium ">
                          <span className="">
                            {dayjs(investment.salesEnd).format("ll")}
                          </span>
                          <span>
                            {dayjs(investment.salesEnd).format("hh:mm ")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-3 text-primaryGrey">
                      <div className="flex flex-col gap-1">
                        <div className="flex ">Sales Began:</div>
                        <span className="font-medium">
                          {dayjs(investment.salesStart).format("ll")}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="">Estimate Claiming:</div>
                        <span className="font-medium">
                          {dayjs(investment.estimateClaiming).format("ll")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex justify-center gap-8">
                    <InvestmentModal
                      userAddress={walletAddress as Address}
                      className="flex flex-col justify-between align-middle"
                      title={investment?.basicInvestment.car.basicInfo.title}
                      chassis={investment?.basicInvestment.car.chassis}
                      contractAddress={investment?.address}
                      totalProduction={
                        investment?.basicInvestment.car.totalProduction
                      }
                      totalModelProduction={
                        investment?.basicInvestment.car.totalModelProduction
                      }
                      colorCombination={
                        investment?.basicInvestment.car.colorCombination
                      }
                      totalInvestment={Number(totalSupply) / 10 ** 6}
                      maxToInvest={
                        Number(maxToInvest) -
                        userTotalInvestment?.div(10 ** 6).toNumber()
                      }
                      minToInvest={Number(minToInvest)}
                      paymentTokenBalance={Number(
                        paymentTokenBalance?.div(10 ** 6)
                      )}
                      contractLevel={contractLevel as any as number}
                      userLevel={userLevel as any as number}
                    />
                    <MyAlertButton
                      triggerButtonLabel={"Withdraw"}
                      confirmAction={onClickWithdraw}
                      triggerButtonClassname={cn()}
                      variant="outline"
                      isTriggerDisabled={!canWithdraw}
                    />
                  </div> */}
                </div>
              </div>
            )}
          </section>

          <section>
            <h3 className="flex items-center gap-4 pb-[52px] pt-[132px]">
              <Image
                src="/icons/car.svg"
                width={39}
                height={38}
                alt="Car details"
              />{" "}
              Car details
            </h3>
            <div className="mb-6 grid  grid-flow-dense grid-cols-1 gap-8 md:mb-[132px] md:grid-cols-2">
              <h4 className="row-start-1 pb-8 text-2xl font-medium md:row-auto">
                {investment?.basicInvestment.car.basicInfo.title}
              </h4>
              <div className=" row-start-3 flex flex-col md:row-auto md:row-start-2">
                <div className=" max-h-[358px] overflow-scroll">
                  {investment?.basicInvestment.car.description}
                </div>
              </div>

              <div className="row-start-2 flex md:col-start-2 md:row-span-2 md:row-start-1">
                <Image
                  src={investment.basicInvestment.car.chart.url}
                  width={592}
                  height={498}
                  alt="Graph"
                />
              </div>
            </div>
          </section>
        </div>
        <Suggestions />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.query;

  return {
    props: { address },
  };
};
export default Investment;
