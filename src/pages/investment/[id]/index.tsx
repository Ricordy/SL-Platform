import Head from "next/head";
import { useRouter } from "next/router";
import InvestmentHistory from "../../../components/InvestmentHistory";
import InvestmentNumbers from "../../../components/InvestmentNumbers";
import { InvestmentSidebar } from "../../../components/InvestmentSidebar";
import PuzzleItem from "../../../components/PuzzleItem";
import Slider from "../../../components/Slider";
import { investmentData } from "../../../data/Investments";

const Investment = () => {
  const router = useRouter();
  const { id } = router.query;
  const [investment] = investmentData.filter(
    (i) => i.id.toString() === id?.toString()
  );

  return (
    <>
      <Head>
        <title>Something Legendary | Investment</title>
      </Head>
      <main className="">
        <div className="flex flex-col">
          <div className="flex max-w-4xl  gap-6">
            <div className="flex flex-col w-3/4">
              <Slider />
              <PuzzleItem
                amount={investment?.amount.toString()}
                progress="100"
                showProgressInsideBar={true}
              />
              <InvestmentNumbers />
              <InvestmentHistory totalInvested={500000} />
            </div>
            <InvestmentSidebar
              title={investment?.title}
              chassis={investment?.chassis}
              address={investment?.address}
              totalProduction={investment?.totalProduction}
              totalModelProduction={investment?.totalModelProduction}
              colorCombination={investment?.colorCombination}
              amount={investment?.amount.toString()}
              phase={investment?.phase}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Investment;
