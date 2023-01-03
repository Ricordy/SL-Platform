import React, { useRef } from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ContractResultDecodeError, useContractWrite, usePrepareContractWrite } from "wagmi";
import { BigNumber, BigNumberish } from "ethers";
import {abi as InvestAbi} from "../artifacts/contracts/Investment.sol/Investment.json"
import {abi as CoinTestAbi} from "../artifacts/contracts/CoinTest.sol/CoinTest.json"



type investmentProps = {
  address: string;
  title: string;
  amount: string; // Check type
  percentageInvested?: string;
  phase: string;
  chassis: string;
  totalProduction: number;
  totalModelProduction: number;
  colorCombination: string;
  className: string;
};




export const InvestmentSidebar =  (props: investmentProps) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [valueApprovalAndInvestment , setApprovalandInvestment ] = useState(0);

  const handleChange = (event) => {
    event.preventDefault();
    setApprovalandInvestment (event.target.value);
  };

  


  




  //Wagmi for contract communication
  //Prepare contract writting
  

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleClick(e) {
      e.preventDefault();
      writeApprove?.()
      writeInvest?.()
      closeModal();
  }


      /**
   * Write in the blockchain the approve function called by the user
   */
      const { config: approveCallConfig } = usePrepareContractWrite({
        address: '0xEDa3c4158BF33beFb6629A21514bf0e999786251',
        abi: CoinTestAbi,
        functionName: 'approve',
        args: ["0xDaEF5954a79A560c95728de005A456BdC08608e0" , valueApprovalAndInvestment],
      })
      const { write: writeApprove } = useContractWrite(approveCallConfig)


    /**
     * Write in the blockchain the invest function called by the user 
     */
    const { config: investCallConfig } = usePrepareContractWrite({
      address: '0xDaEF5954a79A560c95728de005A456BdC08608e0',
      abi: InvestAbi,
      functionName: "invest",
      args: [valueApprovalAndInvestment],
      chainId: 5,
      cacheTime: 2,
      onSettled(data, error) {
        console.log('Settled', { data, error })
      },
    })
    const { write: writeInvest, data, isError}  = useContractWrite(investCallConfig)

    
  

  
    
    
  

  function formatAddress(address: string) {
    if (address) {
      return `${address.slice(0, 5)} ... ${address.slice(address.length - 4)}`;
    }
    return null;
  }

  function ModalInvestNow() {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Make an Investment
                  </Dialog.Title>
                  <div className="flex gap-6 justify-center">
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">Swap Rate</div>
                      <div className="text-md">1 USDC = 1 USD</div>
                      <div className="text-sm text-gray-500">
                        Minimal investment:
                      </div>
                      <div className="text-md">$ 100.00</div>
                      <div className="text-sm text-gray-500">
                        Max. Investment:
                      </div>
                      <div className="text-md">
                        $ 12,900.00 <span className="text-xs">(10%)</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      <input
                        className="border p-2 rounded-md"
                        onChange={handleChange}
                        type="number"
                        name=""
                        id=""
                        placeholder="100"
                      />
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={handleClick}
                      >
                        Invest now
                      </button>
                      {valueApprovalAndInvestment}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
    );
  }

  return (
    <>
      <aside className={props.className}>
        <div className="sticky top-0">
          <div className="flex flex-col align-middle">
            <h4 className="font-bold pb-3">{props.title}</h4>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Chassis Nr:</div>
              <div className="text">{props.chassis}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Total Production:</div>
              <div className="text">{props.totalProduction}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">
                Total Model Production:
              </div>
              <div className="text">{props.totalModelProduction}</div>
            </div>
            <div className="pb-3">
              <div className="text-xs text-slate-700">Color combination:</div>
              <div className="text">{props.colorCombination}</div>
            </div>
          </div>
          <div className="pb-6">
            <h3 className="text-xs text-slate-700">Contract address:</h3>
            <Link href="#">
              <a className="flex align-middle gap-2">
                {formatAddress(props.address)} <FiExternalLink />
              </a>
            </Link>
          </div>
          <Link href="/mercedes-benz">
            <a className="flex gap-2 border p-2 rounded-md justify-center mb-6 align-middle">
              More info <FiExternalLink />
            </a>
          </Link>
          <button
            onClick={openModal}
            className="w-full border rounded-md p-2 bg-slate-800 text-slate-50"
          >
            Invest Now
          </button>
          <div className="mt-4 flex flex-col gap-3">
                      <input
                        className="border p-2 rounded-md"
                        onChange={handleChange}
                        type="number"
                        name=""
                        id=""
                        placeholder="100"
                      />
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={handleClick}
                      >
                        Invest now 2
                      </button>
                      {valueApprovalAndInvestment}
                    </div>
        </div>
      </aside>
      <ModalInvestNow />

    </>
  );
};
