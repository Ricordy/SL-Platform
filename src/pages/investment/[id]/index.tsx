import Head from "next/head";
import { useRouter } from "next/router";
import InvestmentHistory from "../../../components/InvestmentHistory";
import InvestmentNumbers from "../../../components/InvestmentNumbers";
import { InvestmentSidebar } from "../../../components/InvestmentSidebar";
import PuzzleItem from "../../../components/PuzzleItem";
import Slider from "../../../components/Slider";
import { investmentData } from "../../../data/Investments";
import { useAccount, useContractRead } from "wagmi";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

import factoryJson from "../../../artifacts/contracts/Factory.sol/Factory.json";
import { useEffect } from "react";

const Investment = ({ investment }) => {
  const { address } = useAccount();
  // const data = readContract({
  //   address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  //   abi: factoryJson.abi,
  //   functionName: "getAddressTotal",
  //   args: ["0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"],
  // });
  // data.then((resp) => {
  //   console.log(resp);
  // });
  // const contractConfig = {
  //   addressOrName: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  //   contractInterface: factoryJson.abi,
  // };
  const { data: factoryBalance } = useContractRead({
    address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    functionName: "getAddressOnContract",
    args: ["0xCafac3dD18aC6c6e92c921884f9E4176737C052c"],
    overrides: { from: address },
    enabled: true,
    suspense: true,
    watch: true,
    onError(error) {
      console.log("Error", error);
    },
    onSuccess(data) {
      console.log(data);
    },
  });
  useEffect(() => {
    if (!factoryBalance) return;
  }, [factoryBalance]);
  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="flex max-w-4xl  gap-6 px-3 md:px-0 mt-24 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
          <Slider className="flex flex-col  " />
          {}
          <PuzzleItem
            className="w-full md:col-start-1"
            amount={investment?.amount.toString()}
            progress={investment?.percentage}
            showProgressInsideBar={true}
          />
          {`Contract balance: ${factoryBalance}`}
          <InvestmentNumbers />

          <InvestmentSidebar
            className="md:row-start-1 md:col-start-2 md:row-span-3 flex flex-col align-middle justify-between"
            title={investment?.title}
            chassis={investment?.chassis}
            address={address}
            totalProduction={investment?.totalProduction}
            totalModelProduction={investment?.totalModelProduction}
            colorCombination={investment?.colorCombination}
            amount={investment?.amount.toString()}
            phase={investment?.phase}
          />
          <InvestmentHistory
            className=" place-self-start flex gap-12 pt-6 justify-start"
            totalInvested={500000}
            showExpectedReturn={true}
          />
        </div>
      </main>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );
  // console.log(investment);

  return {
    props: { investment },
  };
};

export default Investment;
