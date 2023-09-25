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
import { type InvestmentProps } from "~/@types/investment";
import { type TransactionProps } from "~/@types/transaction";
import useCheckEntryNFT from "~/hooks/useCheckEntryNFT";
import { FactoryABI, SLCoreABI, paymentTokenABI } from "~/utils/abis";
import Carousel, { CarouselItem } from "../components/Carousel";
import NavBar from "../components/NavBar";
import ProjectCarousel from "../components/ProjectCarousel";
import { NumericFormat } from "react-number-format";
import Suggestions from "~/components/Suggestions";
import { getMissingInvestments } from "~/lib/utils";

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

export const TransactionItem = (props) => {
  const { items, userInvestedContracts, numberOfTransactions } = props;

  return (
    items &&
    items?.map((item, idx) => {
      // const { amountInvested } = useGetAddressInvestmentinSingleCar({
      //   contractAddress: addressContract,
      //   walletAddress: address,
      //   watch: true,
      // });

      if (numberOfTransactions === undefined) {
        return (
          item.investment && (
            <section key={idx}>
              ola
              {numberOfTransactions}
              <div className="flex items-center justify-between pb-2">
                <Image
                  className="rounded-md"
                  src={item.investment.basicInvestment.car.basicInfo.cover.url}
                  width={64}
                  height={53}
                  alt="Car"
                />
                <span className=" w-28 truncate">
                  {item.investment.basicInvestment.car.basicInfo.title}
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
                  src={item.investment.basicInvestment.car.basicInfo.cover.url}
                  width={64}
                  height={53}
                  alt="Car"
                />
                <span className=" w-28 truncate">
                  {item.investment.basicInvestment.car.basicInfo.title}
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

const MyInvestments: NextPage = (props: MyInvestmentsProps) => {
  const { data: sessionData } = useSession();
  const { isConnected } = useAccount();
  const entryNFTPrice = utils.parseUnits("100", 6);

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

  // const { data: contractsTotalSupply }: { data: BigNumber } = useContractReads({
  //   contracts: [
  //     {
  //       ...SlFactoryContract,
  //       functionName: "getAddressTotal",
  //       args: [address],
  //     },
  //   ],
  // });

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

  // const { data: userInvestments } = useContractRead({
  //   address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
  //   abi: FactoryAbi,
  //   functionName: "getInvestments",
  //   overrides: { from: address },
  //   // select: (data) => convertData(data),
  //   // onSuccess(data) {
  //   //   data.map((investment) =>
  //   //     Object.assign(
  //   //       investment,
  //   //       investmentData.find(
  //   //         (i) => i.address[3177] == investment.contractAddress
  //   //       )
  //   //     )
  //   //   );
  //   //   console.log(data);
  //   // },
  // });

  // const getUserTransactions = async (address: Address) => {
  //   const {
  //     transactions: userTransactions,
  //   }: { transactions: TransactionProps } = await hygraph.request(
  //     gql`
  //       query UserTransactions {
  //         transactions(where: { transactionDetails: { from: "34343434" } }) {
  //           amountInvested
  //           date
  //           investment {
  //             address
  //             basicInvestment {
  //               totalInvestment
  //               car {
  //                 basicInfo {
  //                   cover {
  //                     url
  //                   }
  //                   title
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `
  //   );
  //   return userTransactions;
  // };

  // console.log("user transactions>>", props.userTransactions);
  const userInvestedContracts = [];
  props.userTransactions?.map((transaction) => {
    if (userInvestedContracts[transaction.to]) {
      userInvestedContracts[transaction.to] += transaction.amountInvested;
    } else {
      userInvestedContracts[transaction.to] = transaction.amountInvested;
    }
  });
  // console.log("userInvestedContracts", userInvestedContracts);
  // setUserContracts(userInvestedContracts);

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
        toast.success("Minted NFT!");
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
        toast.error("You don't have enough balance!");
        return;
      }
      const result = await mintEntryNFTRefetch();
      if (result.error && result.error.stack) {
        if (
          result.error.stack.indexOf("ERC20: transfer amount exceeds balance") >
          -1
        ) {
          return toast.error("You don't have enough balance");
        }
        if (
          result.error.stack.indexOf("SLCore: User have an entry token") > -1
        ) {
          return toast.error("You already minted the NFT!");
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
            loading: "Approving...",
            success: "Approved",
            error: "Error approving",
          });

          const results2 =
            SLCoreContract &&
            (await slcoreSigned?.connect(signerData)?.mintEntry());

          await toast.promise(
            results2.wait(),
            {
              loading: "Minting entry...",
              success: "Minted!",
              error: "Error while minting",
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
    } catch (error) {}
  };

  useEffect(() => {
    // console.log(getUserTransactions(address));
    // const populateInvestment = async () => {
    //   if (!userInvestments || !investmentData) return;
    //   userInvestments.map((ui, idx) => {
    //     if (ui) {
    //       const inv = investmentData?.find((i) => i.address[31337] == ui[idx]);
    //       if (inv) {
    //         console.log(ui[idx]);
    //         const uc: InvestmentType = {
    //           id: inv.id,
    //           title: inv.title,
    //           address: ui[idx] as Address,
    //           chassis: inv.chassis,
    //           totalProduction: inv.totalProduction,
    //           totalModelProduction: inv.totalModelProduction,
    //           colorCombination: inv.colorCombination,
    //         };
    //         setUserContracts([...userContracts, uc]);
    //       }
    //     }
    //   });
    // };
    // populateInvestment();
    /*
    const getFactory = async () => {
      try {
        let contractAddress: Address;
        const contractsToAdd = [];
        let userInvested: BigNumber;
        for (let i = 0; i < contractCount.toNumber(); i++) {
          contractAddress = await factoryContract
            ?.connect(signerData)
            .getContractDeployed(BigNumber.from(i));
          console.log(contractAddress);

          userInvested = await factoryContract
            .connect(signerData)
            .getAddressOnContract(contractAddress);
          if (userInvested.gt(0)) {
            console.log("adding", contractAddress);

            contractsToAdd.push({
              id: i + 1,
              title: `title-${i}`,
              address: contractAddress,
              abi: InvestAbi,
              phase: "none",
              functionName: "status",
              args: [i],
            });
          }

          // categories["Level 1"].push();
        }

        setContractsToRead(contractsToAdd);
        // console.log(contractsToRead);
      } catch (error) {
        console.log(error);
      }
    };
    getFactory();
    */
    //return () => console.log("Cleanup..");
  }, []);

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

  const userInv = extractUniqueInvestments(props.userTransactions);

  function noDecimal(value) {
    return value / 10 ** 6;
  }

  // return <div>end</div>;
  if (hasEntryNFTLoading) return <div>Loading...</div>;

  if (!hasEntryNFTLoading && !hasEntryNFT)
    return (
      <div className="mx-auto flex  min-h-screen w-full flex-col">
        <NavBar />

        <div className="mx-auto flex w-full max-w-screen-lg flex-col gap-[30px] pt-[52px]">
          <div className="grid w-full grid-cols-2 items-start justify-center gap-4">
            <div className="flex w-[434px] flex-col gap-8">
              <div className="flex flex-col rounded-xl  bg-white px-10 py-[72px]">
                <div className="flex flex-col gap-[32px]">
                  <h1 className="text-5xl font-semibold uppercase text-primaryGold">
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
              {/* <Link
                href="/mint-entry-nft"
                className="rounded-xl bg-primaryGold px-3 py-1.5 text-center font-medium uppercase text-white dark:bg-primaryGold dark:text-white"
              >
                Buy it for 100$
              </Link> */}
              <button
                className="rounded-xl bg-primaryGold px-3 py-1.5 text-center font-medium uppercase text-white dark:bg-primaryGold dark:text-white"
                disabled={!isConnected}
                onClick={myMint as () => void}
              >
                {isLoadingMintNFT ? "Minting..." : "Buy it for 100$"}
              </button>
            </div>
            <div className="relative flex h-full w-full bg-[url('/bg/bg-buy-entry-nft.jpg')] bg-contain bg-center bg-no-repeat"></div>
          </div>
          <div className="mt-[64px] flex justify-center gap-10 divide-x-2 pb-10">
            <div className="flex flex-col ">
              <span className="text-primaryGold">Total of entries left:</span>
              <span className="text-4xl font-semibold text-white">
                {data?.[4]?.toNumber()}
              </span>
            </div>
            <div className="flex flex-col pl-[24px]">
              <span className="text-primaryGold">
                Amount of tickets already sold
              </span>
              <span className="text-4xl font-semibold text-white">
                {data?.[6]?.toNumber()}
              </span>
            </div>
            <div className="flex flex-col pl-[24px]">
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

        <div className="z-20 mx-auto flex w-full max-w-screen-lg flex-col justify-center">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="mb-8 text-3xl uppercase tracking-widest text-white">
              My Investments
              {/* <div>Here{JSON.stringify(props, null, 2)}</div> */}
            </h3>
            <h2 className="mb-12 text-5xl uppercase text-white">
              Welcome{" "}
              <span className="font-medium text-primaryGold">Home, Legend</span>
            </h2>
            <div className="grid auto-rows-[1fr] grid-cols-2 gap-12 text-white">
              <div className="flex flex-col  gap-4">
                <span>Overview:</span>
                {data && (
                  <div className="flex flex-1 flex-col gap-2 rounded-md bg-myInvestmentsBackground px-12 py-8 font-medium leading-6">
                    <div className="flex flex-col border-b-2 border-gray-700 px-3 py-4">
                      <h5 className="text-base text-primaryGold">
                        Total Invested
                      </h5>
                      <span className="text-4xl font-semibold tracking-widest">
                        <NumericFormat
                          value={data?.[0].div(10 ** 6).toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 1)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={data?.[1].div(10 ** 6).toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 2)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={data?.[2].div(10 ** 6).toNumber()}
                          displayType="text"
                          decimalSeparator=","
                          thousandSeparator="."
                          decimalScale={0}
                          prefix="$"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3">
                      <h5 className="text-base text-primaryGold">
                        Total Invested (Level 3)
                      </h5>
                      <span className="text-2xl font-medium tracking-widest">
                        <NumericFormat
                          value={data?.[3].div(10 ** 6).toNumber()}
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
                      items={props.userTransactions}
                      userInvestedContracts={userInvestedContracts}
                      numberOfTransactions={numberOfTransactions}
                    />
                  )}

                  {props.userTransactions?.length > 4 &&
                    numberOfTransactions < props.userTransactions.length && (
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

      <div className="relative left-1/2 z-20 mx-auto -ml-[570px] mt-[52px]  min-h-[500px] max-w-[1338px]">
        {userInv && (
          <ProjectCarousel
            id="1"
            prevNavWhite={true}
            title={<h2 className="text-2xl text-white">Active</h2>}
            items={props.userInvestments?.filter(
              (investment) =>
                investment.basicInvestment.investmentStatus == "Active"
            )}
          />
        )}

        {/* {userInv && (
          <ProjectCarousel
            id="2"
            className="pt-[132px]"
            title={<h2 className="text-2xl">Upcoming</h2>}
            items={userInv.filter(
              (investment) =>
                investment.basicInvestment.investmentStatus == "Upcoming"
            )}
          />
        )} */}
        {/* <Carousel
          id="3"
          className="pt-[132px]"
          title={<h2 className="text-2xl">My favorites</h2>}
          items={props.investments}
        /> */}
        {userInv && (
          <ProjectCarousel
            id="4"
            className="py-[132px]"
            title={<h2 className="text-2xl">Finished</h2>}
            items={props.userInvestments?.filter(
              (investment) =>
                investment.basicInvestment.investmentStatus == "Finished"
            )}
          />
        )}
      </div>
      <div className="relative z-20 mx-auto rounded-t-[56px] bg-black pb-[128px] pt-[72px] text-white">
        {
          <h2 className="mb-[52px] ml-[210px] text-2xl font-medium uppercase">
            Our Suggestions for you
          </h2>
        }

        {/* <Carousel
            id="4"
            className="w-full pt-[132px]"
            title={<h2 className="text-2xl">Our Suggestions for you</h2>}
            items={getMissingInvestments(
              props.allInvestments,
              props.userInvestments
            ).filter(
              (investment) =>
                investment.basicInvestment.investmentStatus == "Active"
            )}
          /> */}

        {/* {getMissingInvestments(
            props.allInvestments,
            props.userInvestments
          ).map((investment) => (
            <CarouselItem
              // title="my title"
              // image="/projects/car-1.jpg"
              // price="39595"
              title={investment.basicInvestment.car?.basicInfo.title}
              image={investment.basicInvestment.car?.basicInfo.cover.url}
              price={investment.basicInvestment.totalInvestment.toString()}
              address={investment.address}
              level={investment.level.basicLevel.title}
            />
          ))} */}
        <Suggestions
          investments={getMissingInvestments(
            props.allInvestments,
            props.userInvestments
          )}
        />

        {/* {carouselItems.slice(0, 3).map((item, idx) => (
              <CarouselItem
                key={idx}
                title={item.title}
                image={item.image}
                price={item.price}
              />
            ))} */}
      </div>
    </section>
    // <div className="flex flex-col w-full px-6 lg:px-3 mt-16 md:mt-0">
    //   <h2 className="text-2xl py-6">My Investments</h2>

    //   <Tab.Group>
    //     <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
    //       {Object.keys(categories).map((category) => (
    //         <Tab
    //           key={category}
    //           className={({ selected }) =>
    //             classNames(
    //               "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
    //               "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
    //               selected
    //                 ? "bg-white shadow"
    //                 : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
    //             )
    //           }
    //         >
    //           {category}
    //         </Tab>
    //       ))}
    //     </Tab.List>
    //     <Tab.Panels className="mt-2">
    //       {Object.values(categories).map((investments, idx) => (
    //         <Tab.Panel
    //           key={idx}
    //           className={classNames(
    //             "rounded-xl bg-white p-3",
    //             "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
    //           )}
    //         >
    //           {/* {userContracts && JSON.stringify(userContracts)} */}
    //           <ul className="grid  sm:grid-cols-2 grid-cols-1 gap-2">
    //             {Object.values(userContracts).map((investment) => (
    //               <li
    //                 key={investment.address}
    //                 className="relative rounded-md p-3 border  flex  flex-col gap-3 justify-around hover:bg-gray-100"
    //               >
    //                 <h3 className="text-sm font-medium leading-5 pb-3">
    //                   <Link href={`/investment/${investment.address}`}>
    //                     {investment.title ?? "none"}
    //                   </Link>
    //                 </h3>

    //                 {investment?.phase !== "Withdraw" ? (
    //                   <div className="border p-2 text-xs rounded-md">
    //                     {investment?.phase}
    //                   </div>
    //                 ) : (
    //                   <button className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100">
    //                     Withdraw
    //                   </button>
    //                 )}
    //                 <Link href={`/investment/${investment.address}/monitor`}>
    //                   <a className="border p-2 text-xs rounded-md bg-slate-500 text-slate-100 text-center">
    //                     Monitor Investment
    //                   </a>
    //                 </Link>
    //               </li>
    //             ))}
    //           </ul>
    //         </Tab.Panel>
    //       ))}
    //     </Tab.Panels>
    //   </Tab.Group>
    // </div>
  );
};

export default MyInvestments;

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY as string, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER as string,
  },
});

export const getServerSideProps: GetServerSideProps<
  MyInvestmentsProps
> = async (ctx) => {
  const session = await getSession(ctx);

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

  const { transactions: userTransactions }: { transactions: TransactionProps } =
    await hygraph.request(
      gql`
        query UserTransactions {
          transactions(
            where: { from: "${session?.user.id}" }
            orderBy: publishedAt_DESC
            first: 28
          ) {
            amountInvested
            hash
            to
            date
            investment {
              address
              level {
                basicLevel {
                  title
                }
              }
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
                }
              }
            }
          }
        }
      `
    );

  return {
    props: {
      userInvestments: session ? userInvestments : null,
      userTransactions: session ? userTransactions : null,
      allInvestments: session ? allInvestments : null,
    },
  };
};
