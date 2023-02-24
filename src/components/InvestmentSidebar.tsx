import React, { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useAccount,
  useSigner,
  useNetwork,
  Address,
} from "wagmi";
import { ethers } from "ethers";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { CoinTestAbi, InvestAbi } from "../data/ABIs";
import Modal from "./Modal";
import useModal from "../hooks/useModal";

type investmentProps = {
  address: string;
  title: string;
  amount: string; // Check type
  percentageInvested?: string;
  phase: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  totalInvestment: number;
  colorCombination: string;
  className: string;
  hasEntryNFT: boolean;
  paymentTokenBalance: number;
};

export const InvestmentSidebar = ({
  address,
  title,
  amount,
  percentageInvested,
  phase,
  chassis,
  totalProduction,
  totalModelProduction,
  totalInvestment,
  colorCombination,
  className,
  hasEntryNFT,
  paymentTokenBalance,
}: investmentProps) => {
  const { address: walletAddress } = useAccount();
  const { data: signerData } = useSigner();
  const { isOpen: isOpenModalEntryNFT, toggle: toggleModalEntryNFT } =
    useModal();
  const { isOpen: isOpenModalInvest, toggle: toggleModalInvest } = useModal();
  const [isApproving, setIsApproving] = useState(false);
  const [isInvesting, setisInvesting] = useState(false);
  const inputRef = useRef(null);
  const [valueApprovalAndInvestment, setApprovalandInvestment] = useState(0);
  const [msg, setMsg] = useState("");
  const debouncedValue = useDebounce<number>(valueApprovalAndInvestment, 500);

  /**
   * Write in the blockchain the approve function called by the user
   */
  // const { config: approveCallConfig } = usePrepareContractWrite({
  //   address: "0xEDa3c4158BF33beFb6629A21514bf0e999786251",
  //   abi: CoinTestAbi,
  //   functionName: "approve",
  //   args: ["0xDaEF5954a79A560c95728de005A456BdC08608e0", debouncedValue],
  //   enabled: true,
  //   // onSuccess(data) {
  //   //   console.log(data);
  //   // },
  // });
  /**
   * Write in the blockchain the invest function called by the user
   */
  // const { config: investCallConfig } = usePrepareContractWrite({
  //   address: "0xDaEF5954a79A560c95728de005A456BdC08608e0",
  //   abi: InvestAbi,
  //   functionName: "invest",
  //   args: [debouncedValue],
  //   enabled: true,
  //   // onSettled(data, error) {
  //   //   console.log("Settled", { data, error });
  //   // },
  //   onError(error) {
  //     console.warn("ERROR: ", { error });
  //   },
  // });

  const paymentTokenContract = useContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
    abi: CoinTestAbi,
    signerOrProvider: signerData,
  });

  const investContract = useContract({
    address: process.env.NEXT_PUBLIC_INVESTMENT_ADDRESS,
    abi: InvestAbi,
    signerOrProvider: signerData,
  });
  // const { config: mintConfig } = usePrepareContractWrite({
  //   address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
  //   abi: CoinTestAbi,
  //   functionName: "mint",
  //   args: [ethers.utils.parseUnits("10000", 6)],
  //   onError(err) {
  //     toast.error(err.message);
  //   },
  // });

  // const { write: writeApprove } = useContractWrite(approveCallConfig);
  // const { write: writeInvest } = useContractWrite(investCallConfig);

  // const { write: mint, isLoading: mintLoading } = useContractWrite(mintConfig);

  // const handleChange = (event) => {
  // event.preventDefault();
  // setApprovalandInvestment(event.target.value);
  // };

  //Wagmi for contract communication
  //Prepare contract writting

  async function handleClick(e) {
    e.preventDefault();

    setApprovalandInvestment(inputRef.current.value);
    console.log("inoput: ", inputRef.current.value);

    let toInvestAmount = valueApprovalAndInvestment;
    if (toInvestAmount != inputRef.current.value) {
      toInvestAmount = inputRef.current.value;
    }
    // setIsOpen(false);
    invest(toInvestAmount);
  }

  async function invest(toInvestAmount) {
    try {
      const results = await paymentTokenContract
        .connect(signerData)
        .approve(
          process.env.NEXT_PUBLIC_INVESTMENT_ADDRESS,
          ethers.utils.parseUnits(toInvestAmount.toString(), 6)
        );
      setIsApproving(true);
      await results.wait();
      setIsApproving(false);
      setisInvesting(true);
      const results2 = await investContract
        .connect(signerData)
        .invest(ethers.utils.parseUnits(toInvestAmount.toString(), 0));
      await results2.wait();
      setisInvesting(false);
    } catch (error) {
      console.error(error);
      toast.error(error.reason);
      if (error.reason) {
        setMsg(error.reason);
      } else {
        setMsg(JSON.stringify(error));
      }
    }
  }

  function formatAddress(address: string) {
    if (address) {
      return `${address.slice(0, 5)} ... ${address.slice(address.length - 4)}`;
    }
    return null;
  }

  function ModalEntryNFT() {
    return (
      <Modal
        isOpen={isOpenModalEntryNFT}
        toggle={toggleModalEntryNFT}
        title="Buy an Entry NFT"
      >
        <div className="flex gap-6 justify-center">
          <div className="mt-2">You don&apos;t have an Entry NFT yet.</div>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              className="border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white"
              href="/mint-entry-nft"
            >
              Buy Now 32
            </Link>

            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={handleClick}
            >
              Buy Now
            </button>
          </div>
        </div>
      </Modal>
    );
  }
  function ModalInvestNow() {
    return (
      <Modal
        isOpen={isOpenModalInvest}
        toggle={toggleModalInvest}
        title="Make an Investment"
      >
        <div className="flex gap-6 justify-center">
          <div className="mt-2">
            <div className="text-sm text-gray-500">Token Balance</div>
            <div className="text-md">{paymentTokenBalance}</div>
            <div className="text-sm text-gray-500">Minimal investment:</div>
            <div className="text-md">$ 100.00</div>
            <div className="text-sm text-gray-500">Max. Investment:</div>
            <div className="text-md">
              {totalInvestment} <span className="text-xs">(10%)</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <input
              className="border p-2 rounded-md"
              //onChange={handleChange}
              type="number"
              name=""
              id=""
              placeholder="100"
              ref={inputRef}
            />
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={handleClick}
            >
              Invest now
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // if (hasNFTError) return <h2>{hasNFTError.message}</h2>;

  return (
    <>
      <aside className={className}>
        <div className="sticky top-0">
          <div className="flex flex-col align-middle">
            <h4 className="font-bold pb-3">{title}</h4>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Chassis Nr:</div>
              <div className="text">{chassis}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Total Production:</div>
              <div className="text">{totalProduction}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">
                Total Model Production:
              </div>
              <div className="text">{totalModelProduction}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Color combination:</div>
              <div className="text">{colorCombination}</div>
            </div>
          </div>
          <div className="pb-6">
            <h3 className="text-xs text-slate-700">Contract address:</h3>
            <Link href="#">
              <a
                className="flex align-middle gap-2"
                onClick={() =>
                  window.open(
                    "https://goerli.etherscan.io/address/" + String(address),
                    "_blank"
                  )
                }
              >
                {formatAddress(address)} <FiExternalLink />
              </a>
            </Link>
          </div>
          <Link href="/mercedes-benz">
            <a className="flex gap-2 border p-2 rounded-md justify-center mb-6 align-middle">
              More info <FiExternalLink />
            </a>
          </Link>
          <button
            onClick={() => {
              if (hasEntryNFT) {
                toggleModalInvest();
              } else {
                toggleModalEntryNFT();
              }
            }}
            className="w-full border rounded-md p-2 bg-slate-800 text-slate-50"
          >
            Invest Now
          </button>

          {/* <div className="mt-4 flex flex-col gap-3">
            <input
              className="border p-2 rounded-md"
              //onChange={handleChange}
              type="number"
              name=""
              id=""
              placeholder="100"
              ref={inputRef}
            />
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={() => mint?.()}
            >
              Mint $10000
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={(e) => handleClick(e)}
            >
              Invest now 2
            </button> */}
          <div>
            {isApproving && (
              <div>
                Approving {valueApprovalAndInvestment} to be spend... (This will
                be a box)
              </div>
            )}
            {isInvesting && (
              <div>
                Investing {valueApprovalAndInvestment} into the smartcontract...
                (This will be a box)
              </div>
            )}
          </div>
        </div>
      </aside>
      <ModalInvestNow />
      <ModalEntryNFT />
    </>
  );
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
