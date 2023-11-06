import { clsx, type ClassValue } from "clsx";
import { BigNumber } from "ethers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string) => {
  if (address && address.length > 4) {
    return `${address.slice(0, 5)} ... ${address.slice(address.length - 4)}`;
  }
  return null;
};

export const getPuzzleCollectionIds = (level: number) => {
  let increment = 0;
  if (level == 2) {
    increment += 10;
  } else if (level == 3) {
    increment += 20;
  }
  return Array.from({ length: 10 }, (_, k) => BigNumber.from(k + increment));
};

function reverseInvestments(investments: any) {
  return investments.slice().reverse();
}

function orderInvestmentsByTotalInvestment(investments: any) {
  return investments
    .slice()
    .sort((a, b) => b.totalInvestment - a.totalInvestment);
}
