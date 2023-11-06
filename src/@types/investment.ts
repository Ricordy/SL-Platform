import { type Address } from "viem";

export interface InvestmentProps {
  basicInvestment: {
    totalInvestment: number;
    investmentStatus: string;
    car: {
      title: string;
      cover: {
        url: string;
      };
      subtitle: string;
      shortDescription: string;
      description: string;
      chassis: string;
      totalProduction: number;
      totalModelProduction: number;
      colorCombination: string;
      gallery: {
        url: string;
      }[];
      chart: {
        url: string;
      };
    };
  };
  address: Address;
  highlight: boolean;
  salesEnd: string;
  salesStart: string;
  estimateClaiming: string;
  level: {
    title: string;
    profitRange: string;
  };
  restorationPhases?: {
    title: string;
    deadline: string;
    currentCost: number;
    costExpectation: number;
    restorationStatus: string;
    gallery: {
      url: string;
    }[];
    restorationUpdates?: {
      title: string;
      date: string;
    }[];
  }[];
  transactions?: {
    amountInvested: number;
    date: string;
    type: string;
    hash: string;
    from: Address;
    wallet: Address;
  }[];
}

export interface InvestmentPropsItem {
  investment: {
    basicInvestment: {
      totalInvestment: number;
      investmentStatus: string;
      car: {
        title: string;
        cover: {
          url: string;
        };
        subtitle: string;
        shortDescription: string;
        description: string;
        chassis: string;
        totalProduction: number;
        totalModelProduction: number;
        colorCombination: string;
        gallery: {
          url: string;
        }[];
        chart: {
          url: string;
        };
      };
    };
    address: Address;
    salesEnd: string;
    salesStart: string;
    estimateClaiming: string;
    level: {
      profitRange: string;
    };
    restorationPhases?: {
      title: string;
      deadline: string;
      currentCost: number;
      costExpectation: number;
      restorationStatus: string;
      gallery: {
        url: string;
      }[];
      restorationUpdates?: {
        title: string;
        date: string;
      }[];
    }[];
    transactions?: {
      amountInvested: number;
      date: string;
      type: string;
      hash: string;
    }[];
  };
  transactions?: {
    from: Address;
  };
}
