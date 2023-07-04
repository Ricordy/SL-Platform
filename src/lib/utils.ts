import { clsx, type ClassValue } from "clsx";
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
