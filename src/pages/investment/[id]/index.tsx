import Head from "next/head";

import InvestmentDetail from "../../../components/InvestmentDetail";

const Investment = () => {
  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="">
        <InvestmentDetail />
      </main>
    </>
  );
};

export default Investment;
