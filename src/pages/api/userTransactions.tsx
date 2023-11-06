import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/react";
import { InvestmentProps } from "~/@types/investment";
import { TransactionProps } from "~/@types/transaction";

interface MyResponse extends NextApiResponse {
  body: {
    investment: {
      id: number;
      title: string;
      amount: number;
      percentage: number;
      status: string;
      phase: string;
    }[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const hygraph = new GraphQLClient(
    process.env.HYGRAPH_READ_ONLY_KEY as string,
    {
      headers: {
        Authorization: process.env.HYGRAPH_BEARER as string,
      },
    }
  );
  const { transactions: userTransactions }: { transactions: TransactionProps } =
    await hygraph.request(
      gql`
        query UserTransactions {
          transactions(
            where: { from: "${session?.user.id}" }
            orderBy: publishedAt_DESC
            first: 28
          ) {
            amountInvested
            hash
            to
            date
            investment {
              address
              level {
                title
              }
              basicInvestment {
                totalInvestment
                investmentStatus
                car {
                  title
                  cover {
                    url
                  }
                }
              }
            }
          }
        }
      `
    );

  res.status(200).json({ userTransactions: userTransactions });
}
