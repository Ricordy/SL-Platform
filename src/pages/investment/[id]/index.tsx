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
      <main className="flex max-w-4xl  gap-6 px-3 md:px-0 mt-24 md:mt-0">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3">
          <Slider className="flex flex-col  " />
          <PuzzleItem
            className="w-full md:col-start-1"
            amount={investment?.amount.toString()}
            progress={investment?.percentage}
            showProgressInsideBar={true}
          />
          <InvestmentNumbers />

          <InvestmentSidebar
            className="md:row-start-1 md:col-start-2 md:row-span-3 flex flex-col align-middle justify-between"
            title={investment?.title}
            chassis={investment?.chassis}
            address={investment?.address}
            totalProduction={investment?.totalProduction}
            totalModelProduction={investment?.totalModelProduction}
            colorCombination={investment?.colorCombination}
            amount={investment?.amount.toString()}
            phase={investment?.phase}
          />
          <InvestmentHistory
            className="grid  place-self-start grid-cols-2 gap-12 pt-6 justify-start"
            totalInvested={500000}
            showExpectedReturn={true}
          />
        </div>
      </main>
    </>
  );
};

export default Investment;
