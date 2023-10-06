import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";

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

export default async function handler(req: NextApiRequest, res: MyResponse) {
  const hygraph = new GraphQLClient(
    process.env.HYGRAPH_READ_ONLY_KEY as string,
    {
      headers: {
        Authorization: process.env.HYGRAPH_BEARER as string,
      },
    }
  );

  const { investments }: any = await hygraph.request(
    gql`
      query AllInvestments {
        investments(orderBy: createdAt_DESC) {
          id
          address
          banner {
            url
          }
          level {
            basicLevel {
              title
            }
            profitRange
          }
          basicInvestment {
            id
            totalInvestment
            investmentStatus
            car {
              basicInfo {
                title
                cover {
                  id
                  url
                }
              }
            }
          }
        }
      }
    `
  );

  res.status(200).json({ investments: investments });
}
