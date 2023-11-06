export interface TransactionProps {
  userTransactions: {
    amountInvested: number;
    hash: string;
    to: string;
    date: string;
    investment: {
      address: string;
      basicInvestment: {
        totalInvestment: number;
        car: {
          cover: {
            url: string;
          };
          title: string;
        };
      };
    };
    totalInvested?: number;
  }[];
}
