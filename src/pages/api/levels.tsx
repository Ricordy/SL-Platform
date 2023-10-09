import path from "path";
import { promises as fs } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { GraphQLClient, gql } from "graphql-request";
import { PostProps } from "~/@types/post";

interface MyResponse extends NextApiResponse {
  body: {
    posts: PostProps;
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

  const { levels }: any = await hygraph.request(
    gql`
      query {
        levels {
          basicLevel {
            title
          }
          description
          profitRange
          bg {
            url
          }
          nft {
            url
          }
        }
      }
    `
  );

  res.status(200).json({ levels: levels });
}
