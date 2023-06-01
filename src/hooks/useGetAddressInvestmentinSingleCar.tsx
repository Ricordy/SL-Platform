import { Address, useContractRead } from "wagmi";
import { InvestAbi, PuzzleAbi } from "../data/ABIs";
import { useEffect, useState } from "react";

interface HookProps {
  contractAddress: Address;
  walletAddress: Address;
  watch?: boolean;
}
const useGetAddressInvestmentinSingleCar = ({
  contractAddress,
  walletAddress,
  watch = false,
}: HookProps) => {
  const { data, error } = useContractRead({
    address: contractAddress,
    abi: InvestAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    watch,
  });

  
  
  const [amountInvested, setAmountInvested] = useState(0);

  useEffect(() => {
    if (data) {
      setAmountInvested((data as number) / 10**6);
    }
  }, [data]);
  return { amountInvested, error };
};

export default useGetAddressInvestmentinSingleCar;
