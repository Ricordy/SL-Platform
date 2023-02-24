import Head from "next/head";
import InvestmentHistory from "../../../components/InvestmentHistory";
import InvestmentNumbers from "../../../components/InvestmentNumbers";
import { InvestmentSidebar } from "../../../components/InvestmentSidebar";
import PuzzleItem from "../../../components/PuzzleItem";
import Slider from "../../../components/Slider";
import { investmentData } from "../../../data/Investments";
import { Address, useAccount, useBalance, useContractRead } from "wagmi";
import { GetServerSideProps } from "next";
import { InvestAbi, CoinTestAbi, FactoryAbi } from "../../../data/ABIs";
import { toast } from "react-hot-toast";
import useCheckEntryNFT from "../../../hooks/useCheckEntryNFT";

const Investment = ({ investment }) => {
  const { address: walletAddress } = useAccount();
  const { hasEntryNFT } = useCheckEntryNFT({
    address: walletAddress,
    nftId: 10,
  });

  const { data: totalInvestment } = useContractRead({
    address: investment.address[process.env.NEXT_PUBLIC_CHAIN_ID] as Address,
    abi: InvestAbi,
    functionName: "totalInvestment",
  });

  const { data: contractTotal } = useContractRead({
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: CoinTestAbi,
    functionName: "balanceOf",
    args: [investment.address[process.env.NEXT_PUBLIC_CHAIN_ID] as Address],
    watch: true,
  });

  const { data: totInvestment, error: investmentContractError } =
    useContractRead({
      address: investment.address[process.env.NEXT_PUBLIC_CHAIN_ID] as Address,
      abi: InvestAbi,
      functionName: "totalInvestment",
      watch: true,
      onSuccess(data) {
        console.log(Number(data));
      },
    });

  const { data: userTotalInvestment } = useContractRead({
    address: investment.address[process.env.NEXT_PUBLIC_CHAIN_ID] as Address,
    abi: InvestAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    watch: true,
  });

  const { data: contracts } = useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
    abi: FactoryAbi,
    functionName: "deployedContracts",
    args: [0],
    // watch: true,
    onError(err) {
      console.log("deployed>>>", JSON.stringify(err));
    },
    onSuccess(data) {
      console.log("Deployed>>", JSON.stringify(data));
    },
  });

  const { data: paymentTokenBalance } = useBalance({
    address: walletAddress,
    token: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    onSuccess(data) {
      console.log("paymentTokenBalance>>> ", data.formatted);
    },
  });

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
            amount={(Number(totalInvestment) / 10 ** 6)?.toString()}
            current={(Number(contractTotal) / 10 ** 6)?.toString()}
            progress={investment?.percentage}
            showProgressInsideBar={true}
          />
          <InvestmentNumbers />

          <InvestmentSidebar
            className="md:row-start-1 md:col-start-2 md:row-span-3 flex flex-col align-middle justify-between"
            title={investment?.title}
            chassis={investment?.chassis}
            address={investment.address[process.env.NEXT_PUBLIC_CHAIN_ID]}
            totalProduction={investment?.totalProduction}
            totalModelProduction={investment?.totalModelProduction}
            colorCombination={investment?.colorCombination}
            amount={investment?.amount}
            phase={investment?.phase}
            hasEntryNFT={hasEntryNFT}
            totalInvestment={Number(totalInvestment) / 10 ** 6}
            paymentTokenBalance={Number(paymentTokenBalance?.formatted)}
          />
          {hasEntryNFT && (
            <InvestmentHistory
              className=" place-self-start flex gap-12 pt-6 justify-start"
              totalInvested={Number(userTotalInvestment) / 10 ** 6}
              showExpectedReturn={true}
              totalInvestment={Number(totInvestment) / 10 ** 6}
            />
          )}
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

  return {
    props: { investment },
  };
};

export default Investment;
