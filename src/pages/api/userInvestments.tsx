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
  const hygraph = new GraphQLClient(
    process.env.HYGRAPH_READ_ONLY_KEY as string,
    {
      headers: {
        Authorization: process.env.HYGRAPH_BEARER as string,
      },
    }
  );
  const { investments }: { investments: InvestmentProps[] } =
    await hygraph.request(
      gql`
        query UserInvestments {
          investments(
            where: {
              transactions_some: {
                from: "${session?.user.id}"
              }
            }
          ) {
            id
            address
            level {
              basicLevel {
                title
              }
              profitRange
            }
            basicInvestment {
              totalInvested
              totalInvestment
              investmentStatus
              car {
                id
                basicInfo {
                  cover {
                    url
                  }
                  title
                }
              }
            }
          }
        }
      `
    );

  console.log(investments);

  res.status(200).json({ userInvestments: investments });
}
