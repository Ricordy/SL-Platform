import { Tab } from "@headlessui/react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BigNumber, Transaction } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiExternalLink } from "react-icons/fi";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { NumericFormat } from "react-number-format";
import { Carousel } from "react-responsive-carousel";
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
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (index) => {
    setIsOpen(true);
    setPhotoIndex(index);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const moveNext = (index) => {
    setPhotoIndex(index == 2 ? 0 : index + 1);
  };
  return (
    <Gallery>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <Item
          original={images[0].url}
          thumbnail={images[0].url}
          width="499"
          height="384"
        >
          {({ ref, open }) => (
            <Image
              className="col-span-2 row-span-2 cursor-pointer rounded-md"
              ref={ref as React.MutableRefObject<HTMLImageElement>}
              alt="Car Image"
              width={765}
              height={400}
              onClick={open}
              src={images[0].url}
            />
          )}
        </Item>

        <Item
          original={images[1].url}
          thumbnail={images[1].url}
          width="248"
          height="200"
        >
          {({ ref, open }) => (
            <Image
              className="w-full max-w-full cursor-pointer rounded-md object-cover"
              ref={ref as React.MutableRefObject<HTMLImageElement>}
              alt="Car Image"
              width={248}
              height={200}
              onClick={open}
              src={images[1].url}
            />
          )}
        </Item>
        <Item
          original={images[2].url}
          thumbnail={images[2].url}
          width="248"
          height="200"
        >
          {({ ref, open }) => (
            <Image
              className="col-start-3 w-full max-w-full cursor-pointer rounded-md object-cover"
              ref={ref as React.MutableRefObject<HTMLImageElement>}
              alt="Car Image"
              width={248}
              height={200}
              onClick={open}
              src={images[2].url}
            />
          )}
        </Item>
      </div>
    </Gallery>
  );
};
export const ProjectInfo = ({
  progress,
  status,
  totalInvestment,
}: {
  progress: number;
  status: string;
  totalInvestment: number;
}) => {
  return (
    <div className="relative flex gap-4">
      <div className="relative flex gap-2 pr-4">
        <span>Status:</span>
        <span className="font-medium">{status}</span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>

      <div className="relative flex gap-2 pr-4">
        <span>Price:</span>
        <span className="now font-medium">
          <NumericFormat
            value={totalInvestment.toString()}
            displayType="text"
            fixedDecimalScale={true}
            decimalSeparator=","
            thousandSeparator="."
            decimalScale={2}
            prefix="$ "
          />
        </span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>
      <div className="relative flex gap-2">
        <span>Progress:</span>
        <span className="font-medium">
          <NumericFormat
            value={progress.toString()}
            displayType="text"
            fixedDecimalScale
            decimalSeparator="."
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
          decimalScale={2}
          prefix="$ "
        />
      </div>
      <span className="text-xs text-primaryGreen">{type}</span>
      <span>{dayjs(date).format("ll")}</span>
      <Link
        href={`https://etherscan.io/tx/${hash}`}
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
  investment: InvestmentProps;
  transactions: TransactionProps[];
  userInvestments: InvestmentProps[];
  allInvestments: InvestmentProps[];
};

const Investment = ({
  investment,
  transactions,
  userInvestments,
  allInvestments,
}: InvestmentDetailsProps) => {
  const { address: walletAddress } = useAccount();
  const { data: signerData } = useSigner();
  const { data: sessionData } = useSession();

  const [canWithdraw, setCanWithdraw] = useState(false);
  // console.log(investment);

  const investContract = useContract({
    address: investment?.address,
    abi: investmentABI,
    signerOrProvider: signerData,
  });

  // const SLCoreContract = useContract({
  //   address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS,
  //   abi: SLCoreABI,
  //   signerOrProvider: signerData,
  // });
  // const paymentTokenContract = useContract({
  //   address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
  //   abi: paymentTokenABI,
  //   signerOrProvider: signerData,
  // });

  // const getContractTotal = async () => {
  //   await paymentTokenContract
  //     ?.balanceOf(investment.address)
  //     .then((total) => total.toNumber());
  // };

  const { data: totalSupply } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "totalSupply",
    watch: false,
    // select: (data) => data.div(10 ** 6).toNumber(), // Convert BigInt
    enabled: !!investment,
  });

  const { data: contractLevel } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "CONTRACT_LEVEL",
    watch: false,
    // select: (data) => data.div(10 ** 6).toNumber(), // Convert BigInt
    enabled: !!investment,
  });
  const {
    data: userLevel,
    error,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "whichLevelUserHas",
    args: [sessionData?.user.id as Address],
    // watch: true,
  });

  // const { data: contractTotal1 } = useBalance({
  //   address: investment.address,
  //   token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
  //   // abi: paymentTokenABI,
  //   // args: [investment.address],
  //   // watch: false,
  //   // select: (data) => data.div(10 ** 6), // Convert BigInt
  //   enabled: !!investment,
  // });

  const { data: userTotalInvestment } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "balanceOf",
    args: [walletAddress as Address],
    watch: false,
    enabled: !!investment,
    // select: (data) => data.div(10 ** 6).toNumber(), // Convert BigInt
  });

  const { data: maxToInvest } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "getMaxToInvest",
    watch: false,
    enabled: !!investment,
    select: (data) => data.div(10 ** 6).toNumber(), // Convert BigInt
  });

  const { data: minToInvest } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "MINIMUM_INVESTMENT",
    select: (data) => data.toNumber(), // Convert to number
  });

  // const { data: paymentTokenBalance } = useBalance({
  //   address: walletAddress,
  //   token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
  //   // watch: false,
  // });

  const { data: paymentTokenBalance } = useContractRead({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: paymentTokenABI,
    functionName: "balanceOf",
    args: [walletAddress as Address],
    watch: false,
  });

  const { data: contractStatus } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "status",
    watch: false,
  });

  // console.log("can withdraw?>>>>", contractStatus == CONTRACT_STATUS_WITHDRAW);

  const { config: withdrawCallConfig } = usePrepareContractWrite({
    address: investment.address,
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
        console.log(err.message);

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
      console.log(response);

      toast.success("Saved to the DB");
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    console.log("walletAddress", walletAddress);
    console.log("totalSupply", totalSupply);
    console.log("userTotalInvestment", userTotalInvestment);
    console.log("maxToInvest", maxToInvest);
    console.log("minToInvest", minToInvest);
    console.log("paymentTokenBalance", paymentTokenBalance);
    console.log("contractStatus", contractStatus);

    // getContractTotal().then((data) => {
    //   console.log("contractTotal", data?.toNumber());
    // });
    // return () => {
    //   second
    // }
  }, []);

  // return <div className="text-center text-white">hello</div>;

  if (!investment) {
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

  const phases = investment.restorationPhases.map((phase) => ({
    status: phase.restorationStatus.toLocaleLowerCase(),
    title: phase.title,
    deadline: phase.deadline,
    estimatedCost: phase.costExpectation,
    currentCost: phase.currentCost,
    gallery: phase.gallery,
    updates: phase.restorationUpdates,
  }));

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
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].from !== null) {
        uniqueFromValues.add(transactions[i].from);
      }
    }
    return uniqueFromValues.size;
  }

  console.log("investment", investment);

  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="flex min-h-screen w-full flex-col bg-white  px-3 md:mt-0 md:px-0">
        <NavBar bgWhite={true} />
        <div className="mx-auto flex w-full max-w-screen-lg flex-col">
          <div className="sticky top-0 z-20 mx-auto flex w-full items-center justify-between bg-white py-4">
            <div className="flex flex-col">
              <div className="flex justify-center gap-2 align-middle ">
                <h2 className=" text-4xl font-medium">
                  {investment.basicInvestment.car.basicInfo.title}
                </h2>
                {investment.level.basicLevel.title && (
                  <div className="z-10 mt-2 h-fit w-fit rounded-lg border border-primaryGold bg-white px-2 py-1 text-xs text-primaryGold ">
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
          <div className="flex items-start justify-between gap-6">
            <div className="flex w-3/5 flex-col ">
              <h3 className="flex items-center gap-6 pb-[52px] tracking-widest">
                <Image
                  src="/icons/keys.svg"
                  width={35}
                  height={38}
                  alt="General Information"
                />
                General Information
              </h3>
              {}
              <ProjectInfo
                progress={progress}
                status={investment.basicInvestment.investmentStatus}
                totalInvestment={investment.basicInvestment.totalInvestment}
              />
              <ProgressBar
                color="bg-progressActiveBackground"
                progress={progress}
              />
              <h3 className="pb-8 pt-[52px]">Description</h3>
              <p className="font-normal text-ogBlack">
                {investment.basicInvestment.car.shortDescription}
              </p>
            </div>
            <div className="flex w-2/5 flex-col gap-8  p-6">
              {
                <div className="flex flex-col gap-2 rounded-md border border-b border-tabInactive bg-[#F6F9F8] py-[15px] pl-24">
                  <h4 className="text-ogBlack">Total Invested until now</h4>
                  <span className="text-3xl font-medium tracking-wider text-primaryGreen">
                    <NumericFormat
                      value={totalSupply && totalSupply.div(10 ** 6).toString()}
                      displayType="text"
                      fixedDecimalScale={true}
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      prefix="$ "
                    />
                  </span>
                  <h4 className="flex gap-3 text-primaryGrey">
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
              <div className="flex flex-col justify-start gap-5 rounded-md bg-[#F6F9F8] px-16 py-[32px] align-middle text-ogBlack">
                <h3 className="text-black">Especifications</h3>
                <div>
                  <span>Contract Address:</span>
                  <span className="text-primaryGreen">
                    <Link
                      href={`https://etherscan.io/address/${investment?.address}`}
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
            <Tab.Group>
              <Tab.List className="flex p-1">
                {phases.map((phase) => (
                  <Tab
                    key={phase.title}
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
                ))}
              </Tab.List>
              {userTotalInvestment?.gt(0) && phases.length > 0 && (
                <Tab.Panels className="mt-[52px]">
                  {phases.map((phase, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={cn(
                        " mx-4 bg-white",
                        "flex flex-col gap-4 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                      )}
                    >
                      <span
                        className={cn(
                          "flex gap-1 self-start rounded-full px-2 py-1 text-xs",
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
                      <h3>{phase.title}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-around divide-x divide-primaryGrey pb-8 text-primaryGrey">
                            <div className="flex flex-col">
                              <span>Deadline:</span>
                              <span className="text-black">
                                {dayjs(phase.deadline).format("ll")}
                              </span>
                            </div>
                            <div className="flex flex-col px-4">
                              <span>Cost Expectation:</span>
                              <span className="text-black">
                                <NumericFormat
                                  value={phase.estimatedCost}
                                  displayType="text"
                                  fixedDecimalScale={true}
                                  decimalSeparator=","
                                  thousandSeparator="."
                                  decimalScale={2}
                                  prefix="$ "
                                />
                              </span>
                            </div>
                            <div className="flex flex-col px-4">
                              <span>Current Cost:</span>
                              <span className="text-black">
                                <NumericFormat
                                  value={phase.currentCost}
                                  displayType="text"
                                  fixedDecimalScale={true}
                                  decimalSeparator=","
                                  thousandSeparator="."
                                  decimalScale={2}
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
                        <div className="relative flex w-full">
                          <Carousel showStatus={false} showThumbs={false}>
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
                          </Carousel>
                        </div>
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              )}
            </Tab.Group>
          </section>
          <section className="">
            <h3 className="flex items-center gap-4 pb-[52px] pt-[132px]">
              <Image
                src="/icons/investments.svg"
                width={39}
                height={38}
                alt="Investments"
              />{" "}
              Investments
            </h3>
            <div className="grid grid-cols-2 gap-8 ">
              <div className="flex flex-col gap-4 bg-[#F6F9F8] p-10">
                <div className="flex">Total Invested:</div>
                <span className="pb-2 text-4xl font-semibold tracking-widest text-primaryGreen">
                  <NumericFormat
                    value={(Number(userTotalInvestment) / 10 ** 6).toString()}
                    displayType="text"
                    fixedDecimalScale={true}
                    decimalSeparator=","
                    thousandSeparator="."
                    decimalScale={2}
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
                        decimalScale={2}
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
                        decimalScale={2}
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
                <div className="flex justify-center gap-8 pb-8">
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
                  <Button
                    disabled={!canWithdraw}
                    variant="outline"
                    onClick={onClickWithdraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <h3>Transactions:</h3>
                <div className=" my-8 flex h-40 flex-col divide-y-[0.50px] divide-divideTransaction overflow-y-auto scroll-smooth rounded-md px-4">
                  <TransactionItem
                    key="3333"
                    value={445}
                    date="3333"
                    type="deposit"
                    hash="34343424"
                    wallet="0x343434"
                    from="0x454545"
                  />
                  <TransactionItem
                    key="3333"
                    value={445}
                    date="3333"
                    type="deposit"
                    hash="34343424"
                    wallet="0x343434"
                    from="0x454545"
                  />
                  <TransactionItem
                    key="3333"
                    value={445}
                    date="3333"
                    type="deposit"
                    hash="34343424"
                    wallet="0x343434"
                    from="0x454545"
                  />
                  <TransactionItem
                    key="3333"
                    value={445}
                    date="3333"
                    type="deposit"
                    hash="34343424"
                    wallet="0x343434"
                    from="0x454545"
                  />
                  {investment.transactions.map((transaction) => (
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
            <div className="mb-[132px] grid grid-cols-2 gap-8">
              <div className="flex flex-col">
                <h4 className="pb-8 text-2xl font-medium">
                  {investment?.basicInvestment.car.basicInfo.title}
                </h4>
                {investment?.basicInvestment.car.description}
              </div>
              <div className="flex">
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
        <section>
          <div className="relative z-20 mx-auto flex rounded-t-[56px] bg-black pb-[128px] pt-[72px] text-white">
            <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-[52px]">
              <h3 className="text-2xl uppercase">Our suggestion for you</h3>
              <Suggestions
                investments={getMissingInvestments(
                  allInvestments,
                  userInvestments
                )}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY as string, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER as string,
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.query;
  const session = await getSession(context);
  const { investment }: { investment: InvestmentProps } = await hygraph.request(
    gql`
      query ContextInvestment{
        investment(
          where: { address: "${address}" }
        ) {
          basicInvestment {
            totalInvestment
            investmentStatus
            car {
              basicInfo {
                title
                cover {
                  url
                }
              }
              subtitle
              shortDescription
              description
              chassis
              totalProduction
              totalModelProduction
              colorCombination
              gallery {
                url
              }
              chart {
                url
              }
            }
          }
          level {
            profitRange
            basicLevel {
                title
              }
          }
          address
          salesEnd
          salesStart
          estimateClaiming
          restorationPhases {
            title
            deadline
            currentCost
            costExpectation
            restorationStatus
            gallery {
              url
            }
            restorationUpdates {
              title
              date
            }
          }
          transactions(orderBy: publishedAt_DESC) {
            amountInvested
            date
            type
            hash
            from
          }
        }
      }
    `
  );

  const { transactions }: InvestmentProps = await hygraph.request(
    gql`
      query InvestingHere {
        transactions(
          where: { to: "${address}" }
        ) {
          from
        }
      }
    `
  );

  const { investments: userInvestments }: { investments: InvestmentsProps } =
    await hygraph.request(
      gql`
        query UserInvestments {
          investments(
            where: {
              transactions_some: {
                from: "${session?.user.id}"
              }
            }
          ) {
            id
            address
            level {
              basicLevel {
                title
              }
            }
            basicInvestment {
              id
              totalInvestment
              investmentStatus
              car {
                basicInfo {
                  title
                  cover {
                    id
                    url
                  }
                }
              }
            }
          }
        }
      `
    );

  const { investments: allInvestments }: { investments: InvestmentsProps } =
    await hygraph.request(
      gql`
        query UserInvestments {
          investments {
            id
            address
            level {
              basicLevel {
                title
              }
            }
            basicInvestment {
              id
              totalInvestment
              investmentStatus
              car {
                basicInfo {
                  title
                  cover {
                    id
                    url
                  }
                }
              }
            }
          }
        }
      `
    );

  return {
    props: { investment, transactions, userInvestments, allInvestments },
  };
};
export default Investment;
