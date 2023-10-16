import dayjs from "dayjs";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { useContract, useSigner, type Address } from "wagmi";
import { investmentABI, paymentTokenABI } from "~/utils/abis";
import useDebounce from "../../hooks/useDebounce";
import useModal from "../../hooks/useModal";
import Modal from "../Modal";
import { Button } from "../ui/Button";
import {
  useBlockchainInfo,
  useContractInfo,
  useInvestments,
  useUserTransactions,
} from "~/lib/zustand";
import { cn } from "~/lib/utils";
import MyAlertButton from "../MyAlertButton";

type investmentProps = {
  contractAddress: Address;
  userAddress: string;
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
  contractLevel: number;
  userLevel: number;
};

export const InvestmentModal = ({
  contractAddress,
  userAddress,
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
  contractLevel,
  userLevel,
}: investmentProps) => {
  const { data: signerData } = useSigner();
  const { isOpen: isOpenModalEntryNFT, toggle: toggleModalEntryNFT } =
    useModal();
  const { isOpen: isOpenWrongLevelModal, toggle: toggleWrongLevelModal } =
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
    number | undefined
  >(undefined);
  const debouncedValue = useDebounce<number>(
    valueApprovalAndInvestment || 0,
    500
  );

  const fetchTransactions = useContractInfo((state) => state.fetchTransactions);
  const fetchDynamicInfo = useBlockchainInfo((state) => state.fetchDynamicInfo);
  const fetchPuzzleInfo = useBlockchainInfo((state) => state.fetchPuzzleInfo);
  const fetchUserTransactions = useUserTransactions((state) => state.fetch);
  const fetchUserInvestments = useInvestments(
    (state) => state.fetchUserInvestments
  );

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
  // const { config: investConfig } = usePrepareContractWrite({
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

  //console.log(process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS);

  const paymentTokenContract = useContract({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS,
    abi: paymentTokenABI,
    signerOrProvider: signerData,
  });

  const investContract = useContract({
    address: contractAddress,
    abi: investmentABI,
    signerOrProvider: signerData,
  });

  // const factoryContract = useContract({
  //   address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
  //   abi: FactoryAbi,
  //   signerOrProvider: signerData,
  // });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setApprovalandInvestment(parseInt(event.target.value.replace(/[^\d]/, "")));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
    }
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

    let toastId;

    try {
      const investmentAmountWithDecimals = ethers.utils.parseUnits(
        valueApprovalAndInvestment.toString(),
        6
      );
      const results =
        paymentTokenContract &&
        (await paymentTokenContract
          ?.connect(signerData)
          .approve(contractAddress, investmentAmountWithDecimals));

      await toast.promise(results.wait(), {
        loading: "Approving...",
        success: "Approved",
        error: "Error approving",
      });

      //setIsApproving(false);
      // setisInvesting(true);
      toastId = toast.loading(
        <div className=" py-2 ">
          <div className=" mb-1 text-lg">Making Investment</div>
          <div className=" text-medium font-light">
            We're processing your investment. Hold on for a moment...
          </div>
        </div>
      );
      const results2 =
        investContract &&
        (await investContract
          .connect(signerData)
          .invest(BigNumber.from(valueApprovalAndInvestment)));

      results2.wait();

      // await toast.promise(results2.wait(), {
      //   loading: "Investing...",
      //   success: undi,
      //   error: "Error investing",
      // });

      // Save to hygraph

      try {
        const response = await fetch("/api/addTransaction", {
          method: "POST",
          body: JSON.stringify({
            hash: results2.hash,
            from: userAddress,
            to: contractAddress,
            amountInvested: parseFloat(valueApprovalAndInvestment.toString()),
            date: dayjs(new Date()).format("YYYY-MM-DD"),
            type: "deposit",
            investment: {
              connect: {
                address: contractAddress,
              },
            },
          }),
        });

        if (!response.ok)
          toast.error(JSON.stringify("Error on fecthing API", response.text));
        // throw new Error(`Something went wrong submitting the form.`);

        fetchTransactions(contractAddress);
        fetchDynamicInfo(contractAddress, userAddress);
        fetchPuzzleInfo(userAddress, userLevel);
        fetchUserTransactions();
        fetchUserInvestments();
        toast.dismiss(toastId);
        toast.success(
          <div className=" py-2 ">
            <div className=" mb-1 text-lg">Investment Made</div>
            <div className=" text-medium font-light">
              You've successfully invested in the chosen classic car. Your
              contribution is making restoration dreams come true!
            </div>
          </div>
        );
      } catch (err) {
        // toast.error(err.message);
      }

      toggleModalInvest();
    } catch (error) {
      toast.dismiss(toastId);
      if (
        typeof error.reason === "string" &&
        error.reason.indexOf("InvestmentExceedMax") > -1
      ) {
        toast.error("You reached the maximum to invest!");
      } else if (
        typeof error.reason === "string" &&
        error.reason.indexOf("Not on progress") > -1
      ) {
        toast.error("You cannot invest on this phase!");
      } else if (error.code && error.code == -32603) {
        toast.error("Nonce to high for Metamask");
      } else {
        // toast.error(error);
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

  function ModalWrongLevel() {
    return (
      <Modal
        isOpen={isOpenWrongLevelModal}
        toggle={toggleWrongLevelModal}
        title="Oopss... It seems that you're not such a legend yet"
      >
        <div className="flex w-full flex-col justify-between">
          <div className="mt-2">Try risking a little bit more....</div>
          <div> Until then, take a look at some cars design just for you:</div>
          <div>CARS CARS CARS CARS</div>
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
        <div className="flex w-full flex-col justify-center gap-8">
          <div className="relative mt-[72px] flex items-center gap-3">
            <span className="absolute left-0 px-2 text-3xl font-medium text-tabInactive">
              $
            </span>
            <input
              className="w-full rounded-md p-2 pl-8 text-3xl font-medium text-tabInactive placeholder:text-tabInactive/60"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              type="number"
              name=""
              id=""
              placeholder="100"
              ref={inputRef}
              min={100}
              value={valueApprovalAndInvestment}
            />
            <div className="absolute right-0 flex gap-3 pr-8">
              <button
                onClick={() => setApprovalandInvestment(100)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice px-[0.65em]  pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none text-tabInactive"
              >
                $ 100
              </button>
              <button
                onClick={() => setApprovalandInvestment(500)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice px-[0.65em]  pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none text-tabInactive"
              >
                $ 500
              </button>
              <button
                onClick={() => setApprovalandInvestment(maxToInvest)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice px-[0.65em]  pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none text-tabInactive"
              >
                Max
              </button>
            </div>
          </div>
          <div className="mb-[20px] mt-8 flex items-center gap-3 font-medium">
            <div className="text-sm  uppercase text-gray-500">
              Your Balance:
            </div>
            <div className="text-md text-primaryGold">
              <NumericFormat
                value={paymentTokenBalance.toString()}
                displayType="text"
                fixedDecimalScale
                decimalSeparator=","
                thousandSeparator="."
                decimalScale={0}
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
                  value={minToInvest.toString()}
                  displayType="text"
                  fixedDecimalScale={true}
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={0}
                  prefix="$ "
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-center gap-3">
              <div className="text-sm text-gray-500">Max. Investment:</div>
              <div className="text-md">
                <NumericFormat
                  value={maxToInvest.toString()}
                  displayType="text"
                  fixedDecimalScale={true}
                  decimalSeparator=","
                  thousandSeparator="."
                  decimalScale={0}
                  prefix="$ "
                />{" "}
                <span className="text-xs text-primaryGold">(10%)</span>
              </div>
            </div>
          </div>
          <MyAlertButton
            triggerButtonLabel={"Invest now"}
            confirmAction={(e) => handleClick(e)}
            triggerButtonClassname={cn(
              "inline-flex justify-center rounded-md border border-transparent bg-primaryGreen px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
            )}
            variant="default"
            isTriggerDisabled={Number(inputRef?.current?.value) < 100}
          />
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
              userLevel == 0
                ? toggleModalEntryNFT()
                : contractLevel > userLevel
                ? toggleWrongLevelModal()
                : toggleModalInvest();
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
      <ModalWrongLevel />
    </>
  );
};
