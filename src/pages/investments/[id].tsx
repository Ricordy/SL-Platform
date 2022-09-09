import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { InferGetStaticPropsType } from "next";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { investments } from "../../data/Investments";

const Investment: NextPage = ({
  investment,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>Something Legendary</title>
      </Head>
      <main>
        <h2>Investment {investment.title}</h2>
      </main>
    </>
  );
};

export default Investment;

type Data = {
  status: string;
  investment: {
    id: number;
    title: string;
    amount: number;
    percentage: number;
    phase: string;
  }[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = investments.map((investment) => {
    return {
      params: { id: investment.id.toString() },
    };
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const investment = investments.filter((i) => i.id.toString() === params?.id);

  return {
    props: {
      investment: investment[0],
    },
  };
};
