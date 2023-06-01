import React, { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { Address, useContract, useSigner } from "wagmi";
import { ethers } from "ethers";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { CoinTestAbi, FactoryAbi, InvestAbi } from "../../data/ABIs";
import Modal from "../Modal";
import useModal from "../../hooks/useModal";
import { NumericFormat } from "react-number-format";
import { Button } from "../ui/Button";

type investmentProps = {
  contractAddress: string;
  title: string;
  percentageInvested?: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  totalInvestment: number;
  maxToInvest: number;
  minToInvest: number;
  colorCombination: string;
  className: string;
  paymentTokenBalance: number;
};

export const InvestmentModal = ({
  contractAddress,
  title,
  percentageInvested,
  chassis,
  totalProduction,
  totalModelProduction,
  totalInvestment,
  maxToInvest,
  minToInvest,
  colorCombination,
  className,
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

  const handleChange = (event) => {
    event.preventDefault();
    setApprovalandInvestment(event.target.value);
  };

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
      toast.error("Amount below the minimum to invest");
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

  function ModalEntryNFT() {
    return (
      <Modal
        isOpen={isOpenModalEntryNFT}
        toggle={toggleModalEntryNFT}
        title="Buy an Entry NFT"
      >
        <div className="flex justify-between w-full">
          <div className="mt-2">You don&apos;t have an Entry NFT yet.</div>
          <Link href="/mint-entry-nft" passHref>
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
        <div className="flex flex-col w-full gap-8 justify-center">
          <div className="mt-[72px] relative items-center flex gap-3">
            <span className="absolute text-tabInactive text-3xl font-medium px-2 left-0">
              $
            </span>
            <input
              className="p-2 pl-8 placeholder:text-tabInactive/60 rounded-md w-full text-tabInactive text-3xl font-medium"
              onChange={handleChange}
              type="number"
              name=""
              id=""
              placeholder="100"
              ref={inputRef}
              min={100}
              value={valueApprovalAndInvestment}
            />
            <div className="flex absolute gap-3 right-0 pr-8">
              <button
                onClick={() => setApprovalandInvestment(100)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice text-tabInactive  px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none"
              >
                $ 100.00
              </button>
              <button
                onClick={() => setApprovalandInvestment(500)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice text-tabInactive  px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none"
              >
                $ 500.00
              </button>
              <button
                onClick={() => setApprovalandInvestment(maxToInvest)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice text-tabInactive  px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none"
              >
                Max
              </button>
            </div>
          </div>
          <div className="flex font-medium items-center mt-8 mb-[20px] gap-3">
            <div className="text-sm  text-gray-500 uppercase">
              Your Balance:
            </div>
            <div className="text-md text-primaryGold">
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
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-start justify-center gap-3">
              <div className="text-sm text-gray-500">Swap Rate:</div>
              <div className="text-md">1 USDC = 1 USD</div>
            </div>
            <div className="flex flex-col items-start justify-center gap-3">
              <div className="text-sm text-gray-500">Min. investment:</div>
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
            </div>
            <div className="flex flex-col items-start justify-center gap-3">
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
                <span className="text-xs text-primaryGold">(10%)</span>
              </div>
            </div>
          </div>

          <Button
            disabled={Number(inputRef?.current?.value) < 100}
            className="inline-flex bg-primaryGreen justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
            onClick={(e) => handleClick(e)}
          >
            Invest now
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <aside className={className}>
        <div className="">
          <Button
            className="bg-primaryGreen text-white"
            onClick={() => {
              toggleModalInvest();
            }}
          >
            Invest Now
          </Button>

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
