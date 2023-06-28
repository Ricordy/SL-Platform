import React, { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { type Address, useContract, useSigner } from "wagmi";
import { BigNumber, ethers } from "ethers";
import useDebounce from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import { CoinTestAbi, FactoryAbi, InvestAbi } from "../../data/ABIs";
import Modal from "../Modal";
import useModal from "../../hooks/useModal";
import { NumericFormat } from "react-number-format";
import { Button } from "../ui/Button";
import dayjs from "dayjs";

type investmentProps = {
  contractAddress: string;
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
    abi: [
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
            internalType: "address",
            name: "_factoryAddress",
            type: "address",
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
        name: "LEVEL1",
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
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "balanceReceived",
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
        name: "factoryAddress",
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
            name: "_user",
            type: "address",
          },
        ],
        name: "getBalanceReceived",
        outputs: [
          {
            internalType: "uint256",
            name: "_investmentCount",
            type: "uint256",
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
    ] as const,
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
        .invest(BigNumber.from(valueApprovalAndInvestment));

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
        console.log(response);

        toast.success("Saved to the DB");
      } catch (err) {
        toast.error(err.message);
      }

      toggleModalInvest();
    } catch (error) {
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
        console.log(error);
        toast.error(error);
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
                $ 100.00
              </button>
              <button
                onClick={() => setApprovalandInvestment(500)}
                className="inline-block whitespace-nowrap rounded-full bg-puzzleProfitNotice px-[0.65em]  pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-medium leading-none text-tabInactive"
              >
                $ 500.00
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
            className="inline-flex justify-center rounded-md border border-transparent bg-primaryGreen px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:bg-slate-400"
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
