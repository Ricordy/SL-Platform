import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { investmentData } from "../data/Investments";
import {
  Address,
  useAccount,
  useContract,
  useContractRead,
  useContractReads,
  useSigner,
} from "wagmi";
import useCheckEntryNFT from "../hooks/useCheckEntryNFT";
import { InvestAbi, FactoryAbi } from "../data/ABIs";
import { classNames } from "../lib/utils";
import { BigNumber } from "ethers";
import NavBar from "../components/NavBar";
import Image from "next/image";
import { Button } from "../components/ui/Button";
import Carousel, { CarouselItem, carouselItems } from "../components/Carousel";
import ProjectCarousel from "../components/ProjectCarousel";
import { GraphQLClient, gql } from "graphql-request";
import useGetAddressInvestmentinSingleCar from "../hooks/useGetAddressInvestmentinSingleCar";

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

interface InvestmentsProps {
  investments;
  userTransactions;
}
interface InvestmentType extends InvestmentDbType, InvestmentBlockchainType {}

// const userInvestments = [1, 2, 3];
// const selectedInvestments = investmentData.filter(
//   (i) => userInvestments.indexOf(i.id) > -1
// );
export const TransactionItem = (items) => {
  console.log("items inside component", items.items);
  const { address } = useAccount();
  

  
  
  return items.items.map((item, idx) => {
    const addressContract = item.investment.address
    const { amountInvested } = useGetAddressInvestmentinSingleCar({
      contractAddress: addressContract,
      walletAddress: address,
      watch:true
    });
    return(
    <section key={idx} >
      <div className="flex items-center justify-between">
        
        <Image
          className="rounded-md"
          src={item.investment.basicInvestment.car.basicInfo.cover.url}
          width={64}
          height={53}
          alt="Car"
        />
        <span>{item.investment.basicInvestment.car.basicInfo.title}</span>
        <span>{item.amountInvested}</span>
        <span className="text-primaryGold text-xs">{amountInvested}</span>
        <span>{item.date}</span>

        <Link href="#">
          <Image
            src="/icons/external-link.svg"
            width={10}
            height={10}
            alt="External link"
          />
        </Link>
      </div>
      <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
    </section>
  )});
};

const MyInvestments: NextPage = (props) => {
  console.log("userTeansactions", props.userTransactions);
  console.log("investments", props.investments);


  const { address } = useAccount();
  const { hasEntryNFT, hasEntryNFTLoading } = useCheckEntryNFT({
    address,
    nftId: 10,
  });


  const { data: userTotalInvestment } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryAbi,
    functionName: "getAddressTotal",
    args:[address],
    watch:true,
  });

  const [userContracts, setUserContracts] = useState<InvestmentType[]>([]);
  const investContracts = [];
  const [categories] = useState({
    "Level 1": [],
    "Level 2": [],
  });



  const { data: userInvestments } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "ContractID",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "conAddress",
            type: "address",
          },
        ],
        name: "ContractCreated",
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
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            indexed: false,
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "UserInvested",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_contractAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_userAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "addUserInvestment",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "counter",
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
            internalType: "uint256",
            name: "_totalInvestment",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_paymentTokenAddress",
            type: "address",
          },
        ],
        name: "deployNew",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "deployedContracts",
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
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
        ],
        name: "getAddressOnContract",
        outputs: [
          {
            internalType: "uint256",
            name: "userTotal",
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
            name: "user",
            type: "address",
          },
        ],
        name: "getAddressTotal",
        outputs: [
          {
            internalType: "uint256",
            name: "userTotal",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
        ],
        name: "getContractDeployed",
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
        name: "getContractDeployedCount",
        outputs: [
          {
            internalType: "uint256",
            name: "count",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getInvestments",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "contractAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
            ],
            internalType: "struct Factory.UserInvestment[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getLastDeployedContract",
        outputs: [
          {
            internalType: "address",
            name: "contractAddress",
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
            name: "_id",
            type: "uint256",
          },
        ],
        name: "getUserInvestment",
        outputs: [
          {
            components: [
              {
                internalType: "address",
                name: "contractAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
              },
            ],
            internalType: "struct Factory.UserInvestment",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getUserInvestmentCount",
        outputs: [
          {
            internalType: "uint256",
            name: "_userInvestmentCount",
            type: "uint256",
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
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_lgentry",
            type: "address",
          },
        ],
        name: "setEntryAddress",
        outputs: [],
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
        name: "userInvestmentCount",
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
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "userInvestmentHistory",
        outputs: [
          {
            internalType: "address",
            name: "contractAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getInvestments",
    overrides: { from: address },
    // select: (data) => convertData(data),
    // onSuccess(data) {
    //   data.map((investment) =>
    //     Object.assign(
    //       investment,
    //       investmentData.find(
    //         (i) => i.address[3177] == investment.contractAddress
    //       )
    //     )
    //   );
    //   console.log(data);
    // },
  });

  useEffect(() => {
    const populateInvestment = async () => {
      if (!userInvestments || !investmentData) return;
      userInvestments.map((ui, idx) => {
        if (ui) {
          const inv = investmentData?.find((i) => i.address[31337] == ui[idx]);
          if (inv) {
            console.log(ui[idx]);

            const uc: InvestmentType = {
              id: inv.id,
              title: inv.title,
              address: ui[idx] as Address,
              chassis: inv.chassis,
              totalProduction: inv.totalProduction,
              totalModelProduction: inv.totalModelProduction,
              colorCombination: inv.colorCombination,
            };
            setUserContracts([...userContracts, uc]);
          }
        }
      });
    };
    populateInvestment();
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
    return () => console.log("Cleanup..");
  }, []);

  if (hasEntryNFTLoading) return <div>Loading...</div>;

  if (!hasEntryNFTLoading && !hasEntryNFT)
    return (
      <div className="flex flex-col min-h-screen mx-auto w-full">
        <NavBar />
        <div className="flex flex-col gap-[96px] pt-[52px] max-w-screen-lg w-full mx-auto">
          <div className="grid grid-cols-2 w-full gap-4 items-start justify-center">
            <div className="flex flex-col gap-8 w-[434px]">
              <div className="flex flex-col rounded-xl  py-[72px] px-10 bg-white">
                <div className="flex flex-col gap-[52px]">
                  <h1 className="text-primaryGold text-5xl font-semibold uppercase">
                    Buy your
                    <br />
                    <span className="text-black font-medium">Entry NFT!</span>
                  </h1>
                  <p className=" text-sm">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo. .
                  </p>
                </div>
              </div>
              <Link href="/mint-entry-nft">
                <a className="text-center rounded-xl py-1.5 uppercase font-medium px-3 bg-primaryGold text-white dark:text-white dark:bg-primaryGold">
                  Buy it for 100$
                </a>
              </Link>
            </div>
            <div className="flex w-full h-full bg-center bg-contain bg-no-repeat relative bg-[url('/bg/bg-buy-entry-nft.jpg')]"></div>
          </div>
          <div className="flex justify-center gap-12">
            <div className="flex flex-col">
              <span className="text-primaryGold">
                Total Invested until now:
              </span>
              <span className="font-semibold text-4xl text-white">
                $504.600
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGold">Return expected</span>
              <span className="font-semibold text-4xl text-white">
                $504.600
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-primaryGold">NFTs sold until now:</span>
              <span className="font-semibold text-4xl text-white">
                $504.600
              </span>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <section className="w-full mx-auto bg-white">
      <div className="flex flex-col w-full relative rounded-bl-[56px] ">
        <div className="absolute rounded-bl-[56px] top-0 w-full bg-black h-[1092px]"></div>
        <NavBar />
        <div className="flex flex-col justify-center w-full z-20 mx-auto max-w-screen-lg">
          <div className="flex flex-col gap-4 pt-8">
            <h3 className="text-white uppercase mb-8 text-3xl tracking-widest">
              My Investments
            </h3>
            <h2 className="mb-12 text-white text-5xl uppercase">
              Welcome{" "}
              <span className="text-primaryGold font-medium">Home, sir</span>
            </h2>
            <div className="grid grid-cols-2 auto-rows-[1fr] text-white gap-12">
              <div className="flex flex-col  gap-4">
                <span>Overview:</span>
                <div className="flex flex-col flex-1 gap-8 bg-myInvestmentsBackground rounded-md py-8 px-12">
                  <div className="flex flex-col">
                    <h5 className="text-primaryGold text-base">
                      Total Invested (Connected to Blockchain)
                    </h5>
                    <span className="text-4xl font-semibold tracking-widest">
                      ${userTotalInvestment.div(10**6).toNumber()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-primaryGold text-base">
                      Total Invested:
                    </h5>
                    <span className="text-4xl font-semibold tracking-widest">
                      $403.600
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <span>Last transactions:</span>
                <div className="flex flex-col flex-1 gap-2 bg-myInvestmentsBackground rounded-md py-8 px-4">
                  <TransactionItem items={props.userTransactions} />

                  {/* <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem />
                  <div className="flex h-0.5 w-full bg-primaryGold/10"></div>
                  <TransactionItem /> */}
                  <Link
                    className="flex self-start"
                    href="https://etherscan.io/"
                    target="_blank"
                  >
                    See more
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[500px] mt-[52px] relative z-20 left-1/2 -ml-[570px]  max-w-[1338px] mx-auto">
        <ProjectCarousel
          id="1"
          prevNavWhite={true}
          title={<h2 className="text-white text-2xl">Active</h2>}
          items={props.investments.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Active"
          )}
        />

        <ProjectCarousel
          id="2"
          className="pt-[132px]"
          title={<h2 className="text-2xl">Upcoming</h2>}
          items={props.investments.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Upcoming"
          )}
        />
        <Carousel
          id="3"
          className="pt-[132px]"
          title={<h2 className="text-2xl">My favorites</h2>}
          items={props.investments}
        />
        <ProjectCarousel
          id="4"
          className="py-[132px]"
          title={<h2 className="text-2xl">Finished</h2>}
          items={props.investments.filter(
            (investment) =>
              investment.basicInvestment.investmentStatus == "Finished"
          )}
        />
      </div>
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

const hygraph = new GraphQLClient(process.env.HYGRAPH_READ_ONLY_KEY, {
  headers: {
    Authorization: process.env.HYGRAPH_BEARER,
  },
});

export async function getStaticProps({ locale, params }) {
  const { investments } = await hygraph.request(
    gql`
      query Investments {
        investments {
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

  const { transactions: userTransactions } = await hygraph.request(
    gql`
      query UserTransactions {
        transactions(
          where: {
            transactionDetails: {
              from: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            }
          }
        ) {
          amountInvested
          date
          investment {
            address
            basicInvestment {
              totalInvestment
              car {
                basicInfo {
                  cover {
                    url
                  }
                  title
                }
              }
            }
          }
        }
      }
    `
  );

  console.log("oi", userTransactions);

  return {
    props: {
      investments,
      userTransactions,
    },
  };
}
