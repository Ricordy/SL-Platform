import Link from "next/link";
import { useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import { cn } from "~/lib/utils";
import { Button } from "./ui/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

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
  const { isAboveMd, isBelowMd } = useBreakpoint("md");
  const { disconnect } = useDisconnect();
  const router = useRouter();

  const onClickSignOut = async () => {
    disconnect();
    await signOut();
  };

  return (
    <div className="grid grid-flow-row auto-rows-auto grid-cols-1 justify-center gap-4 overflow-x-hidden  md:ml-[58px] md:grid-cols-3 md:pb-[132px] ">
      <div className="flex flex-col items-center justify-center rounded-md bg-puzzleProfitNotice p-8 text-justify align-middle">
        <h4 className="mb-4 text-2xl font-medium text-primaryGreen">
          Start your investments
        </h4>
        <p className="mb-8 text-ogBlack opacity-70">
          If you haven&apos;t started investing yet, what are you waiting for?
          Your dream is just a click away!
        </p>

        {!url && (
          <Button
            variant={"outline"}
            className=" border-primaryGreen text-primaryGreen"
            onClick={() =>
              isConnected
                ? onClickSignOut()
                : isAboveMd && window.ethereum?.isMetaMask
                ? connect()
                : isAboveMd && !window.ethereum?.isMetaMask
                ? toast.error(
                    <div className=" py-2 ">
                      <div className=" mb-1 text-lg">
                        Wallet Connection Failed
                      </div>
                      <div className=" text-medium  font-light">
                        Oops! We couldn&apos;t connect your wallet. Please
                        ensure you have the wallet extension installed and try
                        again
                      </div>
                    </div>
                  )
                : isBelowMd && !window.ethereum?.isMetaMask
                ? router.push(`dapp://${window.location.host}`)
                : connect()
            }
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
          "hidden items-center justify-center rounded-md md:flex",
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
