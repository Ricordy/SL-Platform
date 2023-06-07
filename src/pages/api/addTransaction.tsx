import { GraphQLClient } from "graphql-request";
import { NextApiRequest, NextApiResponse } from "next";

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
interface CreateTransactionResponse {
  data: {
    createTransaction: {
      id: string;
      amountInvested: number;
      date: string;
      hash: string;
      from: string;
      to: string;
      type: string;
      investment: {
        id: string;
      };
    };
  };
}
interface PublishTransaction {
  data: {
    publishTransaction: {
      id: string;
    };
  };
}

export default async function handler(req: NextApiRequest, res: MyResponse) {
  const body = JSON.parse(req.body);

  const hygraph = new GraphQLClient(process.env.HYGRAPH_CONTENT_API, {
    headers: {
      Authorization: process.env.HYGRAPH_BEARER,
    },
  });

  try {
    const { data }: CreateTransactionResponse = await hygraph.request(
      `
      mutation createTransaction($body: TransactionCreateInput!) {
        createTransaction(data: $body) {
          id
          amountInvested
          date
          hash
          from
          to
          type
          investment {
    			  id
    			}
        }
      }`,
      {
        body,
      }
    );

    if (data && data.createTransaction.id) {
      const { data: publishTransaction }: PublishTransaction =
        await hygraph.request(
          `
        mutation publishTransaction($id: ID!) {
        publishTransaction(where: { id: $id }, to: PUBLISHED) {
          id
        }
      }`,
          {
            id: data.createTransaction.id,
          }
        );
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
}
