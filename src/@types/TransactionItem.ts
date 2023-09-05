import { type Address } from "wagmi";

export interface TransactionItemProps {
  value: number;
  date: string;
  type: string;
  hash: string;
  divisor?: boolean;
  wallet?: Address;
  from?: Address;
}
