import { useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/Button";
import { InjectedConnector } from "wagmi/connectors/injected";
import Image from "next/image";

type NoInvestmentProps = {
  isConnected: boolean;
};

const NoInvestments: React.FC<NoInvestmentProps> = ({ isConnected }) => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  return (
    <div className="ml-[58px] grid grid-flow-row auto-rows-auto grid-cols-3 justify-center gap-4 pb-[132px] ">
      <div className="flex flex-col items-center rounded-md bg-puzzleProfitNotice p-8">
        <h4 className="mb-4 text-2xl font-medium text-primaryGreen">
          Start your investments
        </h4>
        <p className="mb-8 text-ogBlack">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam.
        </p>

        <Button
          variant={"outline"}
          className=" border-primaryGreen text-primaryGreen"
          onClick={() => (isConnected ? disconnect() : connect())}
        >
          {isConnected ? (
            <Image
              src={"/icons/logout.svg"}
              alt="Log Out"
              className="w-5"
              width={20}
              height={18}
            />
          ) : (
            "Connect Wallet"
          )}
        </Button>
      </div>
      <div className="flex justify-center rounded-md bg-puzzleProfitNotice">
        <Image src="/icons/add.svg" width={63} height={63} alt="Add" />
      </div>
      <div className="flex justify-center rounded-md bg-puzzleProfitNotice">
        <Image src="/icons/add.svg" width={63} height={63} alt="Add" />
      </div>
    </div>
  );
};

export default NoInvestments;
