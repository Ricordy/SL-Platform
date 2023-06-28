import React, { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { type Address, useContract, useSigner } from "wagmi";
import { ethers } from "ethers";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import { CoinTestAbi, FactoryAbi, InvestAbi } from "../data/ABIs";
import Modal from "./Modal";
import useModal from "../hooks/useModal";
import { NumericFormat } from "react-number-format";

type investmentProps = {
  contractAddress: string;
  title: string;
  amount: string; // Check type
  percentageInvested?: string;
  phase: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  totalInvestment: number;
  maxToInvest: number;
  minToInvest: number;
  colorCombination: string;
  className: string;
  hasEntryNFT: boolean;
  paymentTokenBalance: number;
};

export const InvestmentSidebar = ({
  contractAddress,
  title,
  amount,
  percentageInvested,
  phase,
  chassis,
  totalProduction,
  totalModelProduction,
  totalInvestment,
  maxToInvest,
  minToInvest,
  colorCombination,
  className,
  hasEntryNFT,
  paymentTokenBalance,
}: investmentProps) => {
  const { data: signerData } = useSigner();
  const { isOpen: isOpenModalEntryNFT, toggle: toggleModalEntryNFT } =
    useModal();
  const {
    isOpen: isOpenModalInvest,
    toggle: toggleModalInvest,
    toggleBlur: toggleBlurModalInvest,
    isBlur: isBlurModalInvest,
  } = useModal();
  const [isApproving, setIsApproving] = useState(false);
  const [isInvesting, setisInvesting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [valueApprovalAndInvestment, setApprovalandInvestment] = useState<
    number | null
  >(undefined);
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
    address: contractAddress,
    abi: InvestAbi,
    signerOrProvider: signerData,
  });
  const factoryContract = useContract({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryAbi,
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

  const handleChange = (event) => {
    event.preventDefault();
    setApprovalandInvestment(event.target.value);
  };

  //Wagmi for contract communication
  //Prepare contract writting

  async function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    // toggleBlurModalInvest();
    // toast.success("Seta blur");
    // setApprovalandInvestment(Number(inputRef?.current?.value));

    // let toInvestAmount = valueApprovalAndInvestment;
    // if (toInvestAmount != Number(inputRef?.current?.value)) {
    //   toInvestAmount = Number(inputRef.current.value);
    // }

    if (valueApprovalAndInvestment < minToInvest) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <div className="w-0 flex-1 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Emilia Gates
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Sure! 8:30pm works great!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
      return;
    }

    try {
      const investmentAmountWithDecimals = ethers.utils.parseUnits(
        valueApprovalAndInvestment.toString(),
        6
      );
      const results = await paymentTokenContract
        .connect(signerData)
        .approve(contractAddress, investmentAmountWithDecimals);
      //setIsApproving(true);
      toast.promise(results.wait(), {
        loading: "Approving...",
        success: "Approved",
        error: "Error approving",
      });
      await results.wait();
      //setIsApproving(false);
      // setisInvesting(true);
      const results2 = await investContract
        .connect(signerData)
        .invest(valueApprovalAndInvestment);
      toast.promise(
        results2.wait(),
        {
          loading: "Investing...",
          success: "Invested!",
          error: "Error investing",
        },
        {
          success: {
            duration: 5000,
            icon: "🔥",
          },
        }
      );
      await results2.wait();

      toggleModalInvest();
    } catch (error) {
      if (
        typeof error.reason == "string" &&
        error.reason.indexOf("InvestmentExceedMax") > -1
      ) {
        toast.error("You reached the maximum to invest!");
      } else if (error.reason) {
        toast.error(error.reason);
      } else {
        toast.error(JSON.stringify(error));
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
        <div className="flex w-full justify-between">
          <div className="mt-2">You don&apos;t have an Entry NFT yet.</div>
          <Link href="/mint-entry-nft" passHref legacyBehavior>
            <a className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2">
              Buy Now
            </a>
          </Link>
        </div>
      </Modal>
    );
  }
  function ModalInvestNow() {
    return (
      <Modal
        isOpen={isOpenModalInvest}
        toggle={toggleModalInvest}
        isBlur={isBlurModalInvest}
        toggleBlur={toggleBlurModalInvest}
        title="Make an Investment"
      >
        <div className="flex justify-center gap-6">
          <div className="mt-2">
            <div className="text-sm text-gray-500">Token Balance</div>
            <div className="text-md">
              <NumericFormat
                value={paymentTokenBalance}
                displayType="text"
                fixedDecimalScale={true}
                decimalSeparator="."
                thousandSeparator=","
                decimalScale={2}
                prefix="$ "
              />
            </div>
            <div className="text-sm text-gray-500">Minimal investment:</div>
            <div className="text-md">
              <NumericFormat
                value={minToInvest}
                displayType="text"
                fixedDecimalScale={true}
                decimalSeparator="."
                thousandSeparator=","
                decimalScale={2}
                prefix="$ "
              />
            </div>
            <div className="text-sm text-gray-500">Max. Investment:</div>
            <div className="text-md">
              <NumericFormat
                value={maxToInvest}
                displayType="text"
                fixedDecimalScale={true}
                decimalSeparator="."
                thousandSeparator=","
                decimalScale={2}
                prefix="$ "
              />{" "}
              <span className="text-xs">(10%)</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <input
              className="rounded-md border p-2"
              onChange={handleChange}
              type="number"
              name=""
              id=""
              placeholder="100"
              ref={inputRef}
              min={100}
              value={valueApprovalAndInvestment}
            />
            <button
              type="button"
              disabled={Number(inputRef?.current?.value) < 100}
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
              onClick={(e) => handleClick(e)}
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
            <h4 className="pb-3 font-bold">{title}</h4>
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
            <Link href="#" legacyBehavior>
              <a
                className="flex gap-2 align-middle"
                onClick={() =>
                  window.open(
                    "https://goerli.etherscan.io/address/" +
                      String(contractAddress),
                    "_blank"
                  )
                }
              >
                {formatAddress(contractAddress)} <FiExternalLink />
              </a>
            </Link>
          </div>
          <Link
            className="mb-6 flex justify-center gap-2 rounded-md border p-2 align-middle"
            href="/mercedes-benz"
          >
            More info <FiExternalLink />
          </Link>
          <button
            onClick={() => {
              if (hasEntryNFT) {
                toggleModalInvest();
              } else {
                toggleModalEntryNFT();
              }
            }}
            className="w-full rounded-md border bg-slate-800 p-2 text-slate-50"
          >
            Invest Now
          </button>

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
