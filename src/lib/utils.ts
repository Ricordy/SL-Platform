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

export function getMissingInvestments(allInvestments, userInv) {
  // Check if the inputs are valid arrays
  if (!Array.isArray(allInvestments) || !Array.isArray(userInv)) {
    console.error("Invalid input");
    return [];
  }

  // Create a set of investment addresses from the userInv array
  const userInvAddresses = new Set(
    userInv.map((investment) => investment.address)
  );

  // Filter the allInvestments array to get the missing investments
  let missingInvestments = allInvestments.filter(
    (investment) => !userInvAddresses.has(investment.address)
  );

  // If the length of missingInvestments is less than 3, add elements from userInv
  if (missingInvestments.length < 3) {
    for (let i = 0; missingInvestments.length < 3 && i < userInv.length; i++) {
      missingInvestments.push(userInv[i]);
    }
  } else if (missingInvestments.length > 3) {
    missingInvestments = missingInvestments.slice(0, 3);
  }

  return missingInvestments;
}

export const getPuzzleCollectionIds = (level: number) => {
  let increment = 0;
  if (level == 2) {
    increment += 10;
  } else if (level == 3) {
    increment += 20;
  }
  return Array.from({ length: 10 }, (_, k) => BigNumber.from(k + increment));
};