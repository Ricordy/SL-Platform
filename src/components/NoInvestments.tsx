import { useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/Button";
import { InjectedConnector } from "wagmi/connectors/injected";
import Image from "next/image";
import { cn } from "~/lib/utils";
import Link from "next/link";

type NoInvestmentProps = {
  isConnected: boolean;
  buttonLabel?: string;
  active?: boolean;
  action?: () => void;
  url?: string;
};

const NoInvestments: React.FC<NoInvestmentProps> = ({
  isConnected,
  action,
  buttonLabel = "Connect your wallet",
  active = true,
  url,
}) => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <div className="grid grid-flow-row auto-rows-auto grid-cols-2 justify-center gap-4 overflow-x-hidden  pb-[132px] md:ml-[58px] md:grid-cols-3 ">
      <div className="flex flex-col items-center justify-center rounded-md bg-puzzleProfitNotice p-8 text-justify align-middle">
        <h4 className="mb-4 text-2xl font-medium text-primaryGreen">
          Start your investments
        </h4>
        <p className="mb-8 text-ogBlack opacity-70">
          If you haven't started investing yet, what are you waiting for? Your
          dream is just a click away!
        </p>

        {!url && (
          <Button
            variant={"outline"}
            className=" border-primaryGreen text-primaryGreen"
            onClick={() => connect()}
          >
            {buttonLabel}
          </Button>
        )}
        {url && (
          <Link href={url}>
            <Button
              variant={"outline"}
              className=" border-primaryGreen text-primaryGreen"
            >
              {buttonLabel}
            </Button>
          </Link>
        )}
      </div>
      <div
        className={cn(
          "flex items-center justify-center rounded-md",
          active ? "bg-puzzleProfitNotice" : "bg-contactBackground"
        )}
      >
        <svg
          version="1.2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="64"
          height="64"
        >
          <path
            id="Layer"
            className={cn(
              "text-center",
              active ? "fill-primaryGreen" : "fill-tabInactive"
            )}
            d="m59.3 36.7h-22.6v22.6c0 2.5-2 4.5-4.5 4.5-2.5 0-4.5-2-4.5-4.5v-22.6h-22.6c-2.5 0-4.5-2-4.5-4.5 0-2.5 2-4.5 4.5-4.5h22.6v-22.6c0-2.5 2-4.5 4.5-4.5 2.5 0 4.5 2 4.5 4.5v22.6h22.6c2.5 0 4.5 2 4.5 4.5 0 2.5-2 4.5-4.5 4.5z"
          />
        </svg>
      </div>
      <div
        className={cn(
          "hidden h-[394px] w-[416px] items-center justify-center rounded-md md:flex",
          active ? "bg-puzzleProfitNotice" : "bg-contactBackground"
        )}
      >
        <svg
          version="1.2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="64"
          height="64"
        >
          <path
            id="Layer"
            className={cn(
              "text-center",
              active ? "fill-primaryGreen" : "fill-tabInactive"
            )}
            d="m59.3 36.7h-22.6v22.6c0 2.5-2 4.5-4.5 4.5-2.5 0-4.5-2-4.5-4.5v-22.6h-22.6c-2.5 0-4.5-2-4.5-4.5 0-2.5 2-4.5 4.5-4.5h22.6v-22.6c0-2.5 2-4.5 4.5-4.5 2.5 0 4.5 2 4.5 4.5v22.6h22.6c2.5 0 4.5 2 4.5 4.5 0 2.5-2 4.5-4.5 4.5z"
          />
        </svg>
      </div>
    </div>
  );
};

export default NoInvestments;
