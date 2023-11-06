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
  const { investment }: { investment: InvestmentProps } = await hygraph.request(
    gql`
      query ContextInvestment{
        investment(
          where: { address: "${body.contractAddress}" }
        ) {
          basicInvestment {
            totalInvestment
            investmentStatus
            car {
              title
              cover {
                url
              }
              subtitle
              shortDescription
              description
              chassis
              totalProduction
              totalModelProduction
              colorCombination
              gallery {
                url
              }
              chart {
                url
              }
            }
          }
          level {
            profitRange
            basicLevel {
                title
              }
          }
          address
          salesEnd
          salesStart
          estimateClaiming
          restorationPhases {
            title
            deadline
            currentCost
            costExpectation
            restorationStatus
            gallery {
              url
            }
            restorationUpdates {
              title
              date
            }
          }

        }
      }
    `
  );

  res.status(200).json({ currentInvestment: investment });
}
