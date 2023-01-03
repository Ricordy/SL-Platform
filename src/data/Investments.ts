import { useState } from "react";
import { useContractRead } from "wagmi";
import {abi as InvestAbi} from "../artifacts/contracts/Investment.sol/Investment.json"




export const investmentData = [
  {
    id: 1,
    address: "0xDaEF5954a79A560c95728de005A456BdC08608e0",
    title: "Mercedes-benz 280sl Pagoda 1969",
    amount: "129000",
    percentage: "100",
    phase: "phase1",
    status: "Active",
    chassis: "113044-10-010413",
    totalProduction: 23885,
    totalModelProduction: 8047,
    colorCombination: "124 G Arabian Grey with Cognac MBTEX",
  },
  {
    id: 2,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB49",
    title: "Porsche 911 1963",
    amount: "250000",
    percentage: "25",
    phase: "In progress",
    status: "Active",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 3,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB50",
    title: "Volkswagen Beetle",
    amount: "400000",
    percentage: "100",
    phase: "Funds Collected",
    status: "Active",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 4,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB51",
    title: "Ford Mustang Shelby GT350 1965",
    amount: "25000000",
    percentage: "25",
    phase: "In process",
    status: "Active",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 5,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB52",
    title: "Bugatti Type 57 Atlantic 1938",
    amount: "15000000",
    percentage: "65",
    phase: "Refunding",
    status: "Removed",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 6,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB53",
    title: "Jaguar E-Type 1961",
    amount: "10000000",
    percentage: "50",
    phase: "Begining Soon",
    status: "Upcoming",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 7,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB54",
    title: "Ferrari 250 GTO 1962",
    amount: "10000000",
    percentage: "50",
    phase: "Begining Soon",
    status: "Upcoming",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
  {
    id: 8,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB55",
    title: "Ford F-100",
    amount: "10000000",
    percentage: "50",
    phase: "Closed",
    status: "Finished",
    chassis: "",
    totalProduction: 0,
    totalModelProduction: 0,
    colorCombination: "",
  },
];




//   const { data } = useContractRead({
//     address: '0xCafac3dD18aC6c6e92c921884f9E4176737C052c',
//     abi: InvestAbi,
//     functionName: 'status',
//   })
  
  





// investmentData[0].phase = String(data)
// console.log(investmentData[0].phase);
