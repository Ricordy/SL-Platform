import Head from "next/head";
import { investmentData } from "../../../data/Investments";
import {
  Address,
  useAccount,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { GetServerSideProps } from "next";
import { InvestAbi, CoinTestAbi, FactoryAbi } from "../../../data/ABIs";
import useCheckEntryNFT from "../../../hooks/useCheckEntryNFT";
import NavBar from "../../../components/NavBar";
import Image from "next/image";
import ProgressBar from "../../../components/ui/ProgressBar";
import { cn, formatAddress } from "../../../lib/utils";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { Tab } from "@headlessui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { ExternalLink } from "../../../components/ui/icons/External";
import { Button } from "../../../components/ui/Button";
import { NumericFormat } from "react-number-format";
import { CarouselItem, carouselItems } from "../../../components/Carousel";
import Modal from "../../../components/Modal";
import useModal from "../../../hooks/useModal";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { InvestmentModal } from "../../../components/modal/InvestmentModal";
import { GraphQLClient, gql } from "graphql-request";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { CONTRACT_STATUS_WITHDRAW } from "../../../constants";

dayjs.extend(localizedFormat);

interface InvestmentProps {
  investment: {
    basicInvestment: {
      totalInvestment: number;
      investmentStatus: string;
      car: {
        basicInfo: {
          title: string;
          cover: {
            url: string;
          };
        };
        subtitle: string;
        shortDescription: string;
        description: string;
        chassis: string;
        totalProduction: number;
        totalModelProduction: number;
        colorCombination: string;
        gallery: {
          url: string;
        }[];
        chart: {
          url: string;
        };
      };
    };
    address: Address;
    salesEnd: string;
    salesStart: string;
    estimateClaiming: string;
    level: {
      profitRange: string;
    };
    restorationPhases: {
      title: string;
      deadline: string;
      currentCost: number;
      costExpectation: number;
      restorationStatus: string;
      gallery: {
        url: string;
      }[];
      restorationUpdates: {
        title: string;
        date: string;
      }[];
    }[];
    transactions: {
      amountInvested: number;
      date: string;
      type: string;
      hash: string;
    }[];
  };
}

const InvestmentGallery = ({ images }) => {
  return (
    <div className="grid relative grid-cols-1 mb-9 gap-3 md:grid-cols-[2fr_1fr]">
      <div className="flex">
        <Image
          src={images[0].url}
          width={765}
          height={400}
          alt="Gallery"
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col gap-3">
        <Image
          src={images[1].url}
          width={248}
          height={193}
          alt="Gallery"
          className="rounded-md"
        />
        <Image
          src={images[2].url}
          width={248}
          height={193}
          alt="Gallery"
          className="rounded-md"
        />
      </div>
    </div>
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
    <div className="flex pb-4 relative gap-4">
      <div className="flex gap-2 relative pr-4">
        <span>Status:</span>
        <span className="font-medium">{status}</span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>

      <div className="flex gap-2 relative pr-4">
        <span>Price:</span>
        <span className="font-medium">
          <NumericFormat
            value={totalInvestment}
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
      <div className="flex gap-2 relative">
        <span>Progress:</span>
        <span className="font-medium">
          <NumericFormat
            value={progress}
            displayType="text"
            fixedDecimalScale={true}
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
const TransactionItem = ({ value, date, type, hash, divisor = true }) => {
  return (
    <div className="flex items-center justify-between">
      <span>
        <NumericFormat
          value={value}
          displayType="text"
          fixedDecimalScale={true}
          decimalSeparator=","
          thousandSeparator="."
          decimalScale={2}
          prefix="$ "
        />
      </span>
      <span className="text-primaryGreen text-xs">{type}</span>
      <span>{dayjs(date).format("ll")}</span>
      <Link href={`https://etherscan.io/tx/${hash}`} target="_blank">
        <a>
          <ExternalLink className="w-3 h-3" />
        </a>
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

const Investment = ({ investment }: InvestmentProps) => {
  const { address: walletAddress } = useAccount();

  const [canWithdraw, setCanWithdraw] = useState(false);
  // console.log(investment);

  const investmentABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_totalInvestment",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_entryNFTAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_paymentTokenAddress",
          type: "address",
        },
        {
          internalType: "uint8",
          name: "_contractLevel",
          type: "uint8",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxAllowed",
          type: "uint256",
        },
      ],
      name: "InvestmentExceedMax",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "ContractFilled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "profit",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "ContractRefilled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "SLWithdraw",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "UserInvest",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "time",
          type: "uint256",
        },
      ],
      name: "Withdraw",
      type: "event",
    },
    {
      inputs: [],
      name: "CONTRACT_LEVEL",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MINIMUM_INVESTMENT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "enum Investment.Status",
          name: "_newStatus",
          type: "uint8",
        },
      ],
      name: "changeStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "entryNFTAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMaxToInvest",
      outputs: [
        {
          internalType: "uint256",
          name: "maxToInvest",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "invest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "investors",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "paymentTokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_profitRate",
          type: "uint256",
        },
      ],
      name: "refill",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "returnProfit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "status",
      outputs: [
        {
          internalType: "enum Investment.Status",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalContractBalanceStable",
      outputs: [
        {
          internalType: "uint256",
          name: "totalBalance",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalInvestment",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "userWithdrawed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "withdrawSL",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;

  const { data: totalSupply } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "totalSupply",
    watch: true,
  });

  const { data: contractTotal } = useContractRead({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: CoinTestAbi,
    functionName: "balanceOf",
    args: [investment.address],
    watch: true,
  });

  const { data: userTotalInvestment } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "balanceOf",
    args: [walletAddress],
    watch: true,
  });

  const { data: investors } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "investors",
    watch: true,
    // staleTime: Infinity,
  });

  const { data: maxToInvest } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "getMaxToInvest",
    watch: true,
  });

  const { data: minToInvest } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "MINIMUM_INVESTMENT",
  });

  const { data: paymentTokenBalance } = useBalance({
    address: walletAddress,
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    watch: true,
  });

  const { data: contractStatus } = useContractRead({
    address: investment.address,
    abi: investmentABI,
    functionName: "status",
    watch: true,
  });

  const { config: withdrawCallConfig } = usePrepareContractWrite({
    address: investment.address,
    abi: investmentABI,
    functionName: "withdraw",
    enabled:
      userTotalInvestment?.gt(0) && contractStatus == CONTRACT_STATUS_WITHDRAW,
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
        toast.error(err.message);
      }
    },
  });

  const { write: withdraw } = useContractWrite(withdrawCallConfig);

  const progress =
    (totalSupply?.div(10 ** 6).toNumber() /
      investment.basicInvestment.totalInvestment) *
    100;

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
    totalSupply &&
    profitMinimumPercentage
      .mul(totalSupply)
      .div(10 ** 6)
      .div(100)
      .toNumber();
  const profitMaximumValue =
    totalSupply &&
    profitMaximumPercentage
      .mul(totalSupply)
      .div(10 ** 6)
      .div(100)
      .toNumber();

  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="flex flex-col bg-white w-full min-h-screen  px-3 md:px-0 md:mt-0">
        <NavBar bgWhite={true} />
        <div className="max-w-screen-lg w-full mx-auto flex flex-col">
          <div className="sticky top-0 flex justify-between items-center z-20 bg-white py-4 w-full mx-auto">
            <div className="flex flex-col ">
              <h2 className="text-4xl font-medium">
                {investment?.basicInvestment.car.basicInfo.title}{" "}
                <Image
                  src="/icons/heart-full.svg"
                  width={25}
                  height={20}
                  alt="Like"
                />
              </h2>
              <p>{investment.basicInvestment.car.subtitle}</p>
            </div>
            <InvestmentModal
              userAddress={walletAddress}
              className="flex flex-col align-middle justify-between"
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
                Number(maxToInvest) / 10 ** 6 -
                userTotalInvestment?.div(10 ** 6)?.toNumber()
              }
              minToInvest={Number(minToInvest)}
              paymentTokenBalance={
                Number(paymentTokenBalance?.formatted) / 10 ** 6
              }
            />
          </div>
          {investment.basicInvestment.car.gallery.length > 0 && (
            <InvestmentGallery
              images={investment.basicInvestment.car.gallery}
            />
          )}
          <div className="flex justify-between items-start gap-6">
            <div className="flex flex-col w-3/5 ">
              <h3 className="tracking-widest items-center flex gap-6 pb-[52px]">
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
              <h3 className="pt-[52px] pb-8">Description</h3>
              <p className="font-normal text-ogBlack">
                {investment.basicInvestment.car.shortDescription}
              </p>
            </div>
            <div className="flex flex-col gap-8 w-2/5">
              {
                <div className="flex flex-col gap-2 py-2 border border-tabInactive pl-24 rounded-md">
                  <h4 className="text-ogBlack">Total Invested until now</h4>
                  <span className="text-3xl font-medium tracking-wider text-primaryGreen">
                    <NumericFormat
                      value={Number(totalSupply) / 10 ** 6}
                      displayType="text"
                      fixedDecimalScale={true}
                      decimalSeparator=","
                      thousandSeparator="."
                      decimalScale={2}
                      prefix="$ "
                    />
                  </span>
                  <h4 className="text-primaryGrey">
                    Investing here:{" "}
                    <Image
                      src="/icons/mini-avatar.svg"
                      alt="Avatar"
                      width={12}
                      height={12}
                    />{" "}
                    <span className="text-primaryGold ">
                      {investors && investors.toNumber()}
                    </span>
                  </h4>
                </div>
              }
              <div className="flex flex-col gap-2 px-24 py-2 text-ogBlack rounded-md">
                <h3 className="text-black">Especifications</h3>
                <span>Contract Address:</span>
                <span className="text-primaryGreen">
                  <Link
                    href={`https://etherscan.io/address/${investment?.address}`}
                  >
                    <a className="flex items-center gap-3">
                      {formatAddress(investment?.address)} <FiExternalLink />
                    </a>
                  </Link>
                </span>
                <span>Chassis NR:</span>
                <span className="font-normal text-black pb-2">
                  {investment?.basicInvestment.car.chassis}
                </span>
                <div className="flex w-full justify-between pb-2">
                  <div className="flex flex-col ">
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
                <span>Color Combination:</span>
                <span className="font-normal text-black pb-8">
                  {investment?.basicInvestment.car.colorCombination}
                </span>
              </div>
            </div>
          </div>
          <section>
            <h3 className="flex py-[52px] items-center gap-4">
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
                        "w-full gap-4 flex flex-col justify-between items-center py-2.5 font-light  border-b-4 text-xl  leading-5 text-primaryGreen",
                        "  focus:outline-none focus:ring-2",
                        selected
                          ? "bg-white font-medium ring-transparent border-b-4 border-primaryGreen"
                          : "text-tabInactive hover:bg-black/5 hover:border-b-4 hover:border-primaryGreen hover:text-primaryGreen"
                      )
                    }
                  >
                    <div
                      className={cn(
                        "flex gap-2 text-xs py-1 px-2 rounded-full",
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
              {userTotalInvestment?.gt(0) && (
                <Tab.Panels className="mt-[52px]">
                  {phases.map((phase, idx) => (
                    <Tab.Panel
                      key={idx}
                      className={cn(
                        " bg-white mx-4",
                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 gap-4 flex flex-col"
                      )}
                    >
                      <span
                        className={cn(
                          "flex gap-1 text-xs self-start py-1 px-2 rounded-full",
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
                          <div className="flex justify-around divide-x divide-primaryGrey text-primaryGrey pb-8">
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
                          <div className="flex flex-col">
                            <h4 className="flex gap-3 pb-4">
                              <Image
                                src="/icons/updates.svg"
                                width={20}
                                height={20}
                                alt="Updates"
                              />
                              <span>Updates</span>
                            </h4>
                            <div className="flex flex-col gap-2">
                              {phase.updates.map((update, idx) => (
                                <div
                                  className={cn(
                                    "text-tabInactive  flex flex-col",
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
                        <div className="flex w-full relative">
                          <Carousel showStatus={false} showThumbs={false}>
                            {phase.gallery.map((image, idx) => (
                              <div key={idx} className="w-full relative">
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
            <h3 className="flex pt-[132px] pb-[52px] items-center gap-4">
              <Image
                src="/icons/investments.svg"
                width={39}
                height={38}
                alt="Investments"
              />{" "}
              Investments
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex">Total Invested:</div>
                <span className="text-primaryGreen text-4xl font-semibold tracking-widest pb-2">
                  <NumericFormat
                    value={Number(totalSupply) / 10 ** 6}
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
                    <div className="flex text-2xl font-medium gap-3 items-center">
                      <NumericFormat
                        value={
                          Number(totalSupply) / 10 ** 6 + profitMinimumValue
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
                    <div className="flex text-2xl font-medium gap-3 items-center">
                      <NumericFormat
                        value={
                          Number(totalSupply) / 10 ** 6 + profitMaximumValue
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
                    <div className="flex flex-col text-primaryGrey justify-between">
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
                <div className="flex gap-8 pb-8 justify-center">
                  <InvestmentModal
                    className="flex flex-col align-middle justify-between"
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
                  />
                  <Button
                    disabled={!canWithdraw}
                    variant="outline"
                    onClick={withdraw}
                  >
                    Withdraw
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <h3>Transactions:</h3>
                <div className="flex flex-col divide-y-2 flex-1 gap-2 rounded-md py-8 px-4">
                  {investment.transactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.hash}
                      value={transaction.amountInvested}
                      date={transaction.date}
                      type={transaction.type}
                      hash={transaction.hash}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="flex pt-[132px] pb-[52px] items-center gap-4">
              <Image
                src="/icons/car.svg"
                width={39}
                height={38}
                alt="Car details"
              />{" "}
              Car details
            </h3>
            <div className="grid grid-cols-2 gap-8 mb-[132px]">
              <div className="flex flex-col">
                <h4 className="font-medium text-2xl pb-8">
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
          <div className="flex text-white bg-black relative pb-[128px] pt-[72px] z-20 rounded-t-[56px] mx-auto">
            <div className="flex w-full max-w-screen-lg flex-col gap-[52px] mx-auto">
              <h3 className="uppercase text-2xl">Our suggestion for you</h3>
              <div className="flex gap-6 mx-auto max-w-screen-lg w-full">
                {carouselItems.slice(0, 3).map((item, idx) => (
                  <CarouselItem
                    key={idx}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER,
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { address } = context.query;
  const { investment }: InvestmentProps = await hygraph.request(
    gql`
      query {
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
          transactions {
            amountInvested
            date
            type
            hash
          }
        }
      }
    `
  );

  return {
    props: { investment },
  };
};
export default Investment;

// export async function getStaticProps({ locale, params }) {

//   const { investments:activeInvestments } = await hygraph.request(
//     gql`
//     query ActiveInvestments{
//       investments {
//         id
//         basicInvestment {
//           id
//           address
//           totalInvestment
//           investmentStatus
//           car {
//             basicInfo {
//               title
//               cover {
//                 id
//                 url
//               }
//             }
//           }
//         }
//       }
//     }
//     `
//   );

//   return {
//     props: {
//       activeInvestments,
//     },
//   };
// }
