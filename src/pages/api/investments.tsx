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
        investments(orderBy: createdAt_DESC, last: 100) {
          id
          address
          highlight
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
              title
              cover {
                id
                url
              }
              description
              gallery {
                url
              }
            }
          }
          restorationPhases(where: { restorationStatus: InProgress }) {
            title
            restorationStatus
          }
        }
      }
    `
  );

  res.status(200).json({ investments: investments });
}
