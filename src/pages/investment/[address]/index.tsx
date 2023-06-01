import Head from "next/head";
import { investmentData } from "../../../data/Investments";
import {
  Address,
  useAccount,
  useBalance,
  useContract,
  useContractRead,
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
import { ethers } from "ethers";
import { InvestmentModal } from "../../../components/modal/InvestmentModal";
import { GraphQLClient, gql } from "graphql-request";
import { log } from "console";

export const ProjectInfo = ({ progress }: { progress: number }) => {
  return (
    <div className="flex pb-4 relative gap-4">
      <div className="flex gap-2 relative pr-4">
        <span>Status:</span>
        <span className="font-medium">Renewing</span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>

      <div className="flex gap-2 relative pr-4">
        <span>Price:</span>
        <span className="font-medium">250.000$</span>
        <div className="absolute right-0 top-0 hidden h-full min-h-[1em] w-px self-stretch border-t-0 bg-gradient-to-tr from-transparent via-black to-transparent opacity-25 dark:opacity-100 lg:block"></div>
      </div>
      <div className="flex gap-2 relative">
        <span>Progress:</span>
        <span className="font-medium">{progress}% Finished</span>
      </div>
    </div>
  );
};
const TransactionItem = () => {
  return (
    <div className="flex items-center justify-between">
      <span>$200.000</span>
      <span className="text-primaryGreen text-xs">$200.000</span>
      <span>9 jun 2022</span>
      <Link href="/#">
        <a>
          <ExternalLink className="w-3 h-3" />
        </a>
      </Link>
    </div>
  );
};
export const phases = [
  {
    status: "done",
    title: "Disassembling and Inspection",
    deadline: "august 25",
    estimatedCost: "3.050.000$",
    currentCost: "250.000$",
    gallery: [{ url: "/slider/car1.jpg" }, { url: "/slider/car2.jpg" }],
    updates: [
      {
        date: "9 jun 2022",
        title: "Delay on something related with some other thing",
      },
      {
        date: "2 jun 2022",
        title: "Problems with something",
      },
      {
        date: "12 nov 2022",
        title: "Finished something very especific about the car",
      },
      {
        date: "12 nov 2022",
        title: "Finished something especific about the car",
      },
    ],
  },
  {
    status: "inprogress",
    title: "Blasting",
    deadline: "august 20",
    estimatedCost: "3.050.000$",
    currentCost: "250.000$",
    gallery: [{ url: "/slider/car1.jpg" }, { url: "/slider/car2.jpg" }],
    updates: [
      {
        date: "9 jun 2022",
        title: "Delay on something related with some other thing",
      },
      {
        date: "2 jun 2022",
        title: "Problems with something",
      },
      {
        date: "12 nov 2022",
        title: "Finished something very especific about the car",
      },
      {
        date: "12 nov 2022",
        title: "Finished something very especific about the car",
      },
    ],
  },
];
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

const Investment = ({ investment }) => {

  investment = investment[0]

  const { address: walletAddress } = useAccount();
  const { data: signerData } = useSigner();
  const { hasEntryNFT } = useCheckEntryNFT({
    address: walletAddress as Address,
    nftId: 10,
  });

  const { data: totalInvestment } = useContractRead({
    address: investment.basicInvestment.address as Address,
    abi: InvestAbi,
    functionName: "totalInvestment",
  });

  const { data: contractTotal } = useContractRead({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: CoinTestAbi,
    functionName: "balanceOf",
    args: [investment.basicInvestment.address as Address],
    watch: true,
  });

  const { data: userTotalInvestment } = useContractRead({
    address: investment.basicInvestment.address as Address,
    abi: InvestAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    watch: true,
  });

  const { data: maxToInvest } = useContractRead({
    address: investment.basicInvestment.address as Address,
    abi: InvestAbi,
    functionName: "getMaxToInvest",
    watch: true,
  });

  const { data: minToInvest } = useContractRead({
    address: investment.basicInvestment.address as Address,
    abi: InvestAbi,
    functionName: "MINIMUM_INVESTMENT",
  });

  // const { data: contracts } = useContractRead({
  //   address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
  //   abi: FactoryAbi,
  //   functionName: "deployedContracts",
  //   args: [0],
  // });

  const { data: paymentTokenBalance } = useBalance({
    address: walletAddress,
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    watch: true,
  });

  const paymentTokenContract = useContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
    abi: CoinTestAbi,
    signerOrProvider: signerData,
  });

  const investContract = useContract({
    address: investment?.address as Address,
    abi: InvestAbi,
    signerOrProvider: signerData,
  });

  const progress =
    (Number(contractTotal) / 10 ** 6 / (Number(totalInvestment) / 10 ** 6)) *
    100;

  const userInvested = (userTotalInvestment as number) > 0 ? true : false;

  
  
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
                {investment?.title}{" "}
                <Image
                  src="/icons/heart-full.svg"
                  width={25}
                  height={20}
                  alt="Like"
                />
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor
              </p>
            </div>

            <InvestmentModal
              className="flex flex-col align-middle justify-between"
              title={investment?.title}
              chassis={investment?.chassis}
              contractAddress={
                investment?.address as Address
              }
              totalProduction={investment?.totalProduction}
              totalModelProduction={investment?.totalModelProduction}
              colorCombination={investment?.colorCombination}
              amount={investment?.amount}
              phase={investment?.phase}
              totalInvestment={Number(totalInvestment) / 10 ** 6}
              maxToInvest={Number(maxToInvest) / 10 ** 6}
              minToInvest={Number(minToInvest)}
              paymentTokenBalance={Number(paymentTokenBalance?.formatted)}
            />
          </div>
          <div className="grid relative grid-cols-1 mb-9 gap-3 md:grid-cols-[2fr_1fr]">
            <div className="flex">
              <Image
                src="/projects/car-1-detail.jpg"
                width={765}
                height={400}
                alt={investment?.title}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Image
                src="/projects/car-1-detail.jpg"
                width={248}
                height={193}
                alt={investment?.title}
                className="rounded-md"
              />
              <Image
                src="/projects/car-1-detail.jpg"
                width={248}
                height={193}
                alt={investment?.title}
                className="rounded-md"
              />
            </div>
          </div>
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
              <ProjectInfo progress={progress} />
              <ProgressBar
                color="bg-progressActiveBackground"
                progress={progress}
              />
              <h3 className="pt-[52px] pb-8">Description</h3>
              <p className="font-normal text-ogBlack">
                Mercedes-Benz introduced the 280SL less than a year after the
                250SL arrived on the scene, and closed out the
                &quot;pagoda&quot; SL line in 1971 after nearly 24,000 were
                built. The 280 was very similar, to its predecessor, using
                clean, elegant lines, intelligent placement of the wheels in
                proportion to the rest of the design, and a tall,
                &quot;pagoda&quot; removable hard top that allowed...
              </p>
            </div>
            <div className="flex flex-col gap-8 w-2/5">
              {userInvested && (
                <div className="flex flex-col gap-2 py-2 border border-tabInactive pl-24 rounded-md">
                  <h4 className="text-ogBlack">Total Invested until now</h4>
                  <span className="text-3xl font-medium tracking-wider text-primaryGreen">
                    <NumericFormat
                      value={Number(userTotalInvestment) / 10 ** 6}
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
                    <span className="text-primaryGold ">1024</span>
                  </h4>
                </div>
              )}
              <div className="flex flex-col gap-2 px-24 py-2 text-ogBlack rounded-md">
                <h3 className="text-black">Especifications</h3>
                <span>Contract Address:</span>
                <span className="text-primaryGreen">
                  <Link
                    href={`https://etherscan.io/address/${
                      investment?.address as Address
                    }`}
                  >
                    <a className="flex items-center gap-3">
                      {formatAddress(
                        investment?.address as Address
                      )}{" "}
                      <FiExternalLink />
                    </a>
                  </Link>
                </span>
                <span>Chassis NR:</span>
                <span className="font-normal text-black pb-2">
                  {investment?.chassis}
                </span>
                <div className="flex w-full justify-between pb-2">
                  <div className="flex flex-col ">
                    <span>Total Production</span>
                    <span className="text-black">
                      {investment?.totalProduction}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span>Total Model Prouction</span>
                    <span className="text-black">
                      {investment?.totalModelProduction}
                    </span>
                  </div>
                </div>
                <span>Color Combination:</span>
                <span className="font-normal text-black pb-8">
                  {investment?.colorCombination}
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
              {userInvested && (
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
                                {phase.deadline}
                              </span>
                            </div>
                            <div className="flex flex-col px-4">
                              <span>Cost Expectation:</span>
                              <span className="text-black">
                                {phase.estimatedCost}
                              </span>
                            </div>
                            <div className="flex flex-col px-4">
                              <span>Current Cost:</span>
                              <span className="text-black">
                                {phase.currentCost}
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
                                  <span className="">{update.date}</span>
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
                    value={Number(userTotalInvestment) / 10 ** 6}
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
                      $410.500{" "}
                      <span className="text-sm text-primaryGreen">(10%)</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex">Maximum:</div>
                    <div className="flex text-2xl font-medium gap-3 items-center">
                      $480.500{" "}
                      <span className="text-sm text-primaryGreen">(12%)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col pb-[52px]">
                  <div className="flex text-secondaryGrey">Sales end:</div>
                  <div className="flex gap-6">
                    <div className="flex flex-col text-2xl font-medium ">
                      <span className="">8 Sep 2022</span>
                      <span>9:00 pm</span>
                    </div>
                    <div className="flex flex-col text-primaryGrey justify-between">
                      <div className="flex gap-3">
                        <div className="flex ">Sales Began:</div>
                        <span className="font-medium">10 Jun 2021</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex">Estimate Claming:</div>
                        <span className="font-medium">10 Sep 2021</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-8 pb-8 justify-center">
                  <InvestmentModal
                    className="flex flex-col align-middle justify-between"
                    title={investment?.title}
                    chassis={investment?.chassis}
                    contractAddress={
                      investment?.address as Address
                    }
                    totalProduction={investment?.totalProduction}
                    totalModelProduction={investment?.totalModelProduction}
                    colorCombination={investment?.colorCombination}
                    amount={investment?.amount}
                    phase={investment?.phase}
                    totalInvestment={Number(totalInvestment) / 10 ** 6}
                    maxToInvest={Number(maxToInvest) / 10 ** 6}
                    minToInvest={Number(minToInvest)}
                    paymentTokenBalance={Number(paymentTokenBalance?.formatted)}
                  />
                  <Button variant="outline">Withdraw</Button>
                </div>
              </div>
              <div className="flex flex-col">
                <h3>Transactions:</h3>
                <div className="flex flex-col flex-1 gap-2 rounded-md py-8 px-4">
                  <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem />
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
                  {investment?.title}
                </h4>
                {investment?.description}
              </div>
              <div className="flex">
                <Image
                  src="/projects/car-details-graph.jpg"
                  width={592}
                  height={498}
                  alt="Graph"
                />
              </div>
            </div>
          </section>

          {/* {hasEntryNFT && (
            <div className="flex w-full gap-6">
              <InvestmentHistory
                contractAddress={
                  investment?.address[
                    process.env.NEXT_PUBLIC_CHAIN_ID as Address
                  ]
                }
                totalInvestment={Number(totalInvestment) / 10 ** 6}
                totalInvested={Number(userTotalInvestment) / 10 ** 6}
                className=" place-self-start flex gap-12 pt-6 justify-start"
              />
              <ExpectedReturn
                contractAddress={
                  investment?.address[
                    process.env.NEXT_PUBLIC_CHAIN_ID as Address
                  ]
                }
                totalInvested={Number(userTotalInvestment) / 10 ** 6}
              />
            </div>
          )} */}
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
  console.log("address>>>>", address);
  
  const { investments:investment } = await hygraph.request(
        gql`
        query ActiveInvestments {
          investments(where: {address: "${address}"}) {
            id
            address
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
  console.log(context);

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

