import { BigNumber, utils } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import type { GetServerSideProps, NextPage } from "next";
import { type Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  type Address,
  useSigner,
  useContract,
} from "wagmi";
import { InvestmentPropsItem, type InvestmentProps } from "~/@types/investment";
import { type TransactionProps } from "~/@types/transaction";
import useCheckEntryNFT from "~/hooks/useCheckEntryNFT";
import { FactoryABI, SLCoreABI, paymentTokenABI } from "~/utils/abis";
import Carousel, { CarouselItem } from "../components/Carousel";
import NavBar from "../components/NavBar";
import ProjectCarousel from "../components/ProjectCarousel";
import { NumericFormat } from "react-number-format";
import Suggestions from "~/components/Suggestions";
import { cn, getMissingInvestments } from "~/lib/utils";
import {
  useBlockchainInfo,
  useInvestments,
  useUserTransactions,
} from "~/lib/zustand";
import MyAlertButton from "~/components/MyAlertButton";

interface InvestmentBlockchainType {
  id: number;
  address: Address;
  amount?: string;
  phase?: string;
  status?: string;
}
interface InvestmentDbType {
  address: Address;
  title: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  colorCombination: string;
}

// interface InvestmentsProps {
//   investments;
//   userTransactions;
// }
interface InvestmentType extends InvestmentDbType, InvestmentBlockchainType {}

// const userInvestments = [1, 2, 3];
// const selectedInvestments = investmentData.filter(
//   (i) => userInvestments.indexOf(i.id) > -1
// );

export interface InvestmentsProps {
  userInvestments: InvestmentProps[];
}
export interface SessionProps {
  session: Session;
}

interface MyInvestmentsProps
  extends InvestmentsProps,
    TransactionProps,
    InvestmentsProps {}

export const TransactionItem = ({
  items,
  userInvestedContracts,
  numberOfTransactions,
}: {
  items: TransactionProps;
}) => {
  return (
    items &&
    items?.map((item, idx) => {
      if (numberOfTransactions === undefined) {
        return (
          item.investment && (
            <section key={idx}>
              {numberOfTransactions}
              <div className="flex items-center justify-between pb-2">
                <Image
                  className="rounded-md"
                  src={item.investment.car.cover.url}
                  width={64}
                  height={53}
                  alt="Car"
                />
                <span className=" hidden w-28 truncate md:flex">
                  {item.investment.car.title}
                </span>
                <span className=" text-primaryGold">
                  <NumericFormat
                    value={item.amountInvested}
                    displayType="text"
                    decimalSeparator=","
                    thousandSeparator="."
                    decimalScale={0}
                    prefix="$"
                  />
                </span>
                <span className="text-xs text-primaryGold">
                  {userInvestedContracts[item.investment.address]}
                </span>
                <span>{item.date}</span>

                <Link href="#">
                  <Image
                    src="/icons/external-link-gold.svg"
                    width={10}
                    height={10}
                    alt="External link"
                  />
                </Link>
              </div>
            </section>
          )
        );
      } else {
        return (
          item.investment &&
          idx < numberOfTransactions && (
            <section key={idx}>
              <div className="flex items-center justify-between pb-2">
                <Image
                  className="rounded-md"
                  src={item.investment.car.cover.url}
                  width={64}
                  height={53}
                  alt="Car"
                />
                <span className=" hidden w-28 truncate md:flex">
                  {item.investment.car.title}
                </span>
                <span className=" text-primaryGold">
                  <NumericFormat
                    value={item.amountInvested}
                    displayType="text"
                    decimalSeparator=","
                    thousandSeparator="."
                    decimalScale={0}
                    prefix="$"
                  />
                </span>
                {/* <span className="text-xs text-primaryGold">
                  {userInvestedContracts[item.investment.address]}
                </span> */}
                <span>{item.date}</span>

                <Link href="#">
                  <Image
                    src="/icons/external-link-gold.svg"
                    width={10}
                    height={10}
                    alt="External link"
                  />
                </Link>
              </div>
            </section>
          )
        );
      }
    })
  );
};

const MyInvestments: NextPage = () => {
  const { data: sessionData } = useSession();
  const { isConnected } = useAccount();
  const entryNFTPrice = utils.parseUnits("100", 6);
  const userInvestments = useInvestments((state) => state.userInvestments);
  const finishedInvestments = userInvestments?.filter(
    (investment) => investment.investmentStatus == "Finished"
  );
  const activeInvestments = userInvestments?.filter(
    (investment) => investment.investmentStatus == "Active"
  );
  const { address } = useAccount();
  const [numberOfTransactions, setNumberOfTransactions] = useState(4);
  const SlFactoryContract = {
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryABI,
  };

  const SLCoreContract = {
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
  };

  const incrementTransaction = () => {
    setNumberOfTransactions(numberOfTransactions + 4);
  };

  const userTotalInvestedPerLevel = useBlockchainInfo(
    (state) => state.userTotalInvestedPerLevel
  );

  const { data }: { data: BigNumber } = useContractReads({
    contracts: [
      {
        ...SlFactoryContract,
        functionName: "getAddressTotal",
        args: [address],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(1)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(2)],
      },
      {
        ...SlFactoryContract,
        functionName: "getAddressTotalInLevel",
        args: [address, BigNumber.from(3)],
      },
      {
        ...SLCoreContract,
        functionName: "getCurrentEntryBatchRemainingTokens",
      },
      {
        ...SlFactoryContract,
        functionName: "getTotalInvestedInPlatform",
      },
      {
        ...SLCoreContract,
        functionName: "getAllSoldEntryNfts",
      },
      // {
      //   ...SlLogicsContract,
      //   functionName: "_userAllowedToClaimPiece",
      //   chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
      //   args: [address, 1, 1, 0],
      // },
    ],
    // watch: true,
    onError(error) {},
  });

  const { hasEntryNFT, hasEntryNFTLoading } = useCheckEntryNFT({
    address: address as Address,
  });

  const {
    data: dataLevels,
    error,
    isLoading,
  } = useContractRead({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
    abi: SLCoreABI,
    functionName: "whichLevelUserHas",
    args: [sessionData?.user.id as Address],
    // watch: true,
  });

  const [userContracts, setUserContracts] = useState([]);
  const investContracts = [];

  const userTransactions = useUserTransactions(
    (state) => state.userTransactions
  );

  const userInvestedContracts = [];
  userTransactions?.map((transaction) => {
    if (userInvestedContracts[transaction.to]) {
      userInvestedContracts[transaction.to] += transaction.amountInvested;
    } else {
      userInvestedContracts[transaction.to] = transaction.amountInvested;
    }
  });

  // Approve spend payment token
  const {
    config: configApproveToken,
    isLoading: isLoadingPrepareApprove,
    refetch: refecthPrepareApprove,
  } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: paymentTokenABI,
    functionName: "approve",
    args: [
      process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as Address,
      utils.parseUnits("100", 6),
    ],
    enabled: false,
    onError(err) {
      // toast.error(err.message);
    },
    // onSuccess() {
    //   toast.success("Approved!");
    // },
  });

  const {
    data: approveData,
    write: approve,
    isLoading: isLoadingApprove,
    error: errorApprove,
    isError: isErrorApprove,
    isSuccess: isSuccessApprove,
  } = useContractWrite(configApproveToken);

  const { config: mintEntryNFTConfig, refetch: mintEntryNFTRefetch } =
    usePrepareContractWrite({
      address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS as Address,
      abi: SLCoreABI,
      functionName: "mintEntry",
      enabled: false,
    });

  const { data: dataMintNFT, write: mintNFT } =
    useContractWrite(mintEntryNFTConfig);

  const { isLoading: isLoadingMintNFT, isSuccess: isSuccessMintNFT } =
    useWaitForTransaction({
      hash: dataMintNFT?.hash,
      onSuccess: () => {
        // setUserMinted(true);
        // toast.success("Minted NFT!");
      },
    });

  // Check user Payment Token balance
  const { data: userPaymentTokenBalance } = useBalance({
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    address: sessionData?.user.id as Address,
    // address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    // watch: true,
    enabled: isConnected,
    // chainId: 31337,
  });

  const { data: signerData } = useSigner();

  const paymentTokenContract = useContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
    abi: paymentTokenABI,
    signerOrProvider: signerData,
  });

  const slcoreSigned = useContract({
    address: process.env.NEXT_PUBLIC_PUZZLE_ADDRESS,
    abi: SLCoreABI,
    signerOrProvider: signerData,
  });

  const myMint = async () => {
    try {
      if (
        userPaymentTokenBalance &&
        userPaymentTokenBalance.value < entryNFTPrice
      ) {
        toast.error(
          <div className=" py-2 ">
            <div className=" mb-1 text-lg">Insufficient Funds </div>
            <div className=" text-medium font-light">
              Uh-oh! It seems your wallet lacks the funds needed for the
              Membership Card. Top up your balance and try again
            </div>
          </div>
        );
        return;
      }
      const result = await mintEntryNFTRefetch();
      if (result.error && result.error.stack) {
        if (
          result.error.stack.indexOf("ERC20: transfer amount exceeds balance") >
          -1
        ) {
          return toast.error(
            <div className=" py-2 ">
              <div className=" mb-1 text-lg">Insufficient Funds </div>
              <div className=" text-medium font-light">
                Uh-oh! It seems your wallet lacks the funds needed for the
                Membership Card. Top up your balance and try again
              </div>
            </div>
          );
        }
        if (
          result.error.stack.indexOf("SLCore: User have an entry token") > -1
        ) {
          return toast.error(
            <div className=" py-2 ">
              <div className=" mb-1 text-lg">Already a member </div>
              <div className=" text-medium font-light">
                You already minted the NFT!
              </div>
            </div>
          );
        }
        if (result.error.stack.indexOf("ERC20: insufficient allowance") > -1) {
          //await refecthPrepareApprove();
          // approve?.();
          // mintNFT?.();
          const results =
            paymentTokenContract &&
            (await paymentTokenContract
              ?.connect(signerData)
              .approve(
                process.env.NEXT_PUBLIC_SLLOGIC_ADDRESS as any as Address,
                entryNFTPrice
              ));

          await toast.promise(results.wait(), {
            loading: "Transaction approval in progress...",
            success: "Transaction successfully approved",
            error: "Insufficient funds to complete the transaction.",
          });

          const results2 =
            SLCoreContract &&
            (await slcoreSigned?.connect(signerData)?.mintEntry());

          await toast.promise(
            results2.wait(),
            {
              loading: (
                <div className=" py-2 ">
                  <div className=" mb-1 text-lg">
                    Purchasing Membership Card
                  </div>
                  <div className=" text-medium font-light">
                    Purchasing your Membership Card. Sit tight!
                  </div>
                </div>
              ),
              success: (
                <div className=" py-2 ">
                  <div className=" mb-1 text-lg">Membership Card Acquired </div>
                  <div className=" text-medium font-light">
                    You are now a proud holder of the Something Legendary
                    Membership Card. Welcome to the community!
                  </div>
                </div>
              ),
              error: (
                <div className=" py-2 ">
                  <div className=" mb-1 text-lg">Network Issue </div>
                  <div className=" text-medium font-light">
                    We're experiencing network issues at the moment. Please try
                    again later or check your internet connection.
                  </div>
                </div>
              ),
            },
            {
              success: {
                duration: 5000,
                icon: "🔥",
              },
            }
          );
        }
      } else {
        mintNFT?.();
      }
    } catch (error) {
      toast.error(
        "Network Issue: We're experiencing network issues at the moment. Please try again later or check your internet connection."
      );
    }
  };

  function extractUniqueInvestments(queryResult) {
    // Use a map to store unique investments by their address
    const uniqueInvestments = new Map();

    // Iterate over each transaction
    queryResult &&
      queryResult.forEach((transaction) => {
        // Check if the transaction has an investment
        if (transaction.investment) {
          // Use the investment address as the unique identifier
          const address = transaction.investment.address;

          // If the investment is not already in the map, add it
          if (!uniqueInvestments.has(address)) {
            uniqueInvestments.set(address, transaction.investment);
          }
        }
      });

    // Convert the map values to an array and return it
    return Array.from(uniqueInvestments.values());
  }

  const userInv = extractUniqueInvestments(userTransactions);

  function noDecimal(value) {
    return value / 10 ** 6;
  }

  // return <div>end</div>;
  if (hasEntryNFTLoading) return <div>Loading...</div>;

  if (!hasEntryNFTLoading && !hasEntryNFT)
    return (
      <div className="mx-auto flex  min-h-screen w-full flex-col">
        <NavBar />

        <div className="mx-auto flex w-full flex-col gap-[30px] px-6 md:px-0 md:pt-[52px]">
          <div className="grid w-full grid-cols-1 items-start justify-center gap-4 md:grid-cols-2">
            <div className="row-start-2 flex flex-col gap-8 md:row-start-auto md:ml-40 md:w-[434px]">
              <div className="flex flex-col rounded-xl  bg-white px-10 py-6 md:py-[72px]">
                <div className="flex flex-col gap-[32px]">
                  <h1 className="text-3xl font-semibold uppercase text-primaryGold md:text-5xl">
                    Buy your
                    <br />
                    <span className="font-medium text-black">
                      Membership Card!
                    </span>
                  </h1>
                  <p className=" text-sm">
                    You're one step closer to living the adventure you've always
                    dreamed of. The opportunity to restore a luxury classic and
                    earn money from it! Get your entrance ticket now, choose the
                    project of your dreams and follow the whole process in real
                    time. The future starts here.
                  </p>
                </div>
              </div>
              {/* <button
                className="rounded-xl bg-primaryGold px-3 py-1.5 text-center font-medium uppercase text-white dark:bg-primaryGold dark:text-white"
                disabled={!isConnected}
                onClick={myMint as () => void}
              >
                {isLoadingMintNFT ? "Minting..." : "Buy it for 100$"}
              </button> */}
              <MyAlertButton
                triggerButtonLabel={
                  isLoadingMintNFT ? "Minting..." : "Buy it for 100$"
                }
                confirmAction={myMint}
                triggerButtonClassname={cn(
                  "rounded-xl bg-primaryGold px-3 py-1.5 text-center font-medium uppercase text-white dark:bg-primaryGold dark:text-white"
                )}
                variant="default"
                isTriggerDisabled={!isConnected}
                alertDescription="Are you sure you want to mint this entry? This action cannot be undone."
                confirmLabel="Mint Entry"
                alertTitle="Mint Membership Card?"
              />
            </div>
            <div className="relative row-start-1 flex h-full w-full items-center justify-center md:row-start-auto">
              <Image
                src="/bg/bg-buy-entry-nft.jpg"
                width={250}
                height={68}
                alt="Previous"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-10 pb-10 md:mt-[64px] md:flex-row md:divide-x-2">
            <div className="flex flex-col ">
              <span className="text-primaryGold">Total of entries left:</span>
              <span className="text-4xl font-semibold text-white">
                {data?.[4]?.toNumber()}
              </span>
            </div>
            <div className="flex flex-col md:pl-[24px]">
              <span className="text-primaryGold">
                Amount of tickets already sold
              </span>
              <span className="text-4xl font-semibold text-white">
                {data?.[6]?.toNumber()}
              </span>
            </div>
            <div className="flex flex-col md:pl-[24px]">
              <span className="text-primaryGold">
                Total invested in classics:
              </span>
              <span className="text-4xl font-semibold text-white">
                <NumericFormat
                  value={noDecimal(data?.[5]?.toNumber()) || 0}
                  displayType="text"
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={0}
                  prefix="$"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className="mx-auto w-full bg-white">
      <div className="relative flex w-full flex-col rounded-bl-[56px] ">
        <div className="absolute top-0 h-[1092px] w-full rounded-bl-[56px] bg-black"></div>
        <NavBar />

        <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center px-6 md:px-0">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="mb-8 text-3xl uppercase tracking-widest text-white">
              My Investments
            </h3>
            <h2 className="mb-12 text-3xl uppercase text-white md:text-5xl">
              Welcome{" "}
              <span className="font-medium text-primaryGold">Home, Legend</span>
            </h2>
            <div className="grid auto-rows-[1fr] grid-cols-1 gap-12 text-white md:grid-cols-2">
              <div className="flex flex-col  gap-4">
                <span>Overview:</span>
                {data && (
                  <div className="flex flex-1 flex-col gap-2 rounded-md bg-myInvestmentsBackground px-6 py-4 font-medium leading-6 md:px-12 md:py-8">
                    <div className="flex flex-col border-b-2 border-gray-700 px-3 py-4">
                      <h5 className="text-base text-primaryGold">
                        Total Invested
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        <NumericFormat
                          value={userTotalInvestedPerLevel?.[3] / 10 ** 6}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col items-start justify-between px-3 md:flex-row md:items-center">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 1)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={userTotalInvestedPerLevel?.[0]
                            .div(10 ** 6)
                            .toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col items-start justify-between px-3 md:flex-row md:items-center">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 2)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={userTotalInvestedPerLevel?.[1]
                            .div(10 ** 6)
                            .toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex flex-col items-start justify-between px-3 md:flex-row md:items-center">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 3)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={userTotalInvestedPerLevel?.[2]
                            .div(10 ** 6)
                            .toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <span>Last transactions:</span>
                <div className="flex max-h-[282px] flex-1 flex-col gap-2 overflow-scroll rounded-md bg-myInvestmentsBackground px-4 py-8">
                  {userInvestedContracts && (
                    <TransactionItem
                      items={userTransactions}
                      userInvestedContracts={userInvestedContracts}
                      numberOfTransactions={numberOfTransactions}
                    />
                  )}
                  {userTransactions?.length > 4 &&
                    numberOfTransactions < userTransactions.length && (
                      <button
                        className="flex self-start"
                        onClick={incrementTransaction}
                      >
                        See more
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative left-auto z-20 mx-auto w-full px-6  md:left-1/2 md:-ml-[570px] md:mt-[52px] md:min-h-[532px] md:max-w-[1220px] md:px-0">
        {userInv && (
          <ProjectCarousel
            id="1"
            className="pt-6 md:pt-0"
            prevNavWhite={true}
            title={<h2 className="text-2xl md:text-white">Active</h2>}
            items={activeInvestments}
            showNoInvestments={true}
          />
        )}

        {userInv && (
          <ProjectCarousel
            id="4"
            className="py-12 md:py-[132px]"
            title={<h2 className="text-2xl">Finished</h2>}
            titleColor={activeInvestments?.length == 0 ? "text-white" : ""}
            items={finishedInvestments}
            showNoInvestments={true}
          />
        )}
      </div>

      <Suggestions />
    </section>
  );
};

export default MyInvestments;
