import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { getSession } from "next-auth/react";
import { InvestmentProps } from "~/@types/investment";

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
  const body = JSON.parse(req.body);
  const hygraph = new GraphQLClient(
    process.env.HYGRAPH_READ_ONLY_KEY as string,
    {
      headers: {
        Authorization: process.env.HYGRAPH_BEARER as string,
      },
    }
  );
  const { transactions }: InvestmentProps = await hygraph.request(
    gql`
      query InvestingHere {
        transactions(
          where: { to: "${body.contractAddress}" }
          orderBy: publishedAt_DESC
          last:100
        ) {
            amountInvested
            date
            type
            hash
            from
        }
      }
    `
  );

  res.status(200).json({ currentTransactions: transactions });
}
