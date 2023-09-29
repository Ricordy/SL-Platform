import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import burguer from "public/icons/burguer-menu.svg";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import {
  Address,
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSignMessage,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import logoBlack from "../../public/logo-black.svg";
import logoMiniBlack from "../../public/logo-mini-black.svg";
import logoWhite from "../../public/logo-white.svg";
import logoMiniWhite from "../../public/logo-mini-white.svg";
import logo1 from "../../public/logo-1.svg";
import logo2 from "../../public/logo-2.svg";
import logo3 from "../../public/logo-3.svg";
import { cn } from "../lib/utils";
import Modal from "./Modal";
import { paymentTokenABI } from "~/utils/abis";
import { BigNumber } from "ethers";
import TestingGuides from "./testingModal/TestingGuides";
import { useBreakpoint } from "~/hooks/useBreakpoints";
import { BurguerMenu } from "./ui/icons/BurguerMenu";

const NavBar = ({ bgWhite = false }: { bgWhite?: boolean }) => {
  const { address, isConnected, status } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [navbar, setNavbar] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);
  const [TestingOpened, setTestingOpened] = useState(false);

  // State
  const [showConnection, setShowConnection] = useState(false);
  const [navIsOpen, setNavIsOpen] = useState(false);

  // Functions
  /**
   * Attempts SIWE and establish session
   */
  const onClickSignIn = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        // nonce is used from CSRF token
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  /**
   * Sign user out
   */
  const onClickSignOut = async () => {
    setLoading(true);
    await signOut();
    disconnect();
    setLoading(false);
  };

  /**
   * Handles hydration issue
   * only show after the window has finished loading
   */
  useEffect(() => {
    setShowConnection(true);
  }, []);

  /**
   * Testing purpuses:
   */

  const PaymentToken = {
    address: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS as Address,
    abi: paymentTokenABI,
  };
  const { config: configMintPaymentToken } = usePrepareContractWrite({
    ...PaymentToken,
    functionName: "mint",
    enabled: TestingOpened,
    args: [1000000 as any as BigNumber],
    onError(err) {},
    // onSuccess() {
    //   toast.success("Puzzle reivindicado com sucesso!");
    // },
  });

  const { write: mintPaymentToken, isLoading: isLoadingMintToken } =
    useContractWrite(configMintPaymentToken);

  const { isAboveMd, isBelowMd } = useBreakpoint("md");

  return (
    <>
      <nav
        className={cn(
          "relative z-30 mx-auto flex w-full items-center justify-between gap-6 px-6 py-6 md:max-w-screen-lg md:flex-col md:gap-12 lg:px-0",

          navIsOpen ? "bg-black" : ""
        )}
      >
        <div
          className={cn(
            "flex w-full flex-col justify-between",
            isAboveMd ? "flex-row gap-6" : ""
          )}
        >
          <Link href="/">
            <Image
              src={bgWhite && !navIsOpen ? logoBlack : logoWhite}
              alt="Something Legendary logo"
            />
          </Link>
          <div
            className={cn(
              " flex w-full items-center justify-center gap-6",
              navIsOpen
                ? "absolute right-0 top-20 z-20 flex-col items-end justify-end bg-black px-6 pb-6"
                : isAboveMd
                ? ""
                : "hidden"
            )}
          >
            {sessionData && isConnected ? (
              <div
                className={cn(
                  "flex w-full items-center justify-end gap-6",
                  navIsOpen ? "items-end" : "",
                  isBelowMd ? "flex-col" : ""
                )}
              >
                <Link
                  className={cn(
                    "text-center",
                    bgWhite && !navIsOpen ? "text-black" : "text-white",
                    isBelowMd && "block w-full rounded-sm bg-white/10 py-2"
                  )}
                  href="/my-investments"
                >
                  my Investments
                </Link>
                <Link
                  className={cn(
                    "text-white",
                    isBelowMd
                      ? "flex w-full justify-center rounded-sm bg-white/10 py-2"
                      : ""
                  )}
                  href="/#investments"
                >
                  <Image
                    src={
                      bgWhite && !navIsOpen
                        ? "/icons/notification-grey.svg"
                        : "/icons/notification-white.svg"
                    }
                    style={{ width: "auto" }}
                    width={0}
                    height={0}
                    alt="Alert"
                  />
                </Link>

                <button
                  className={cn(
                    "w-40 shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-white  px-5 py-1.5 align-middle text-sm font-medium uppercase leading-tight tracking-wide  text-black  md:flex",
                    bgWhite && " bg-black text-white",
                    isBelowMd && "block w-full bg-white/10 py-2 text-white"
                  )}
                  onClick={() =>
                    TestingOpened
                      ? setTestingOpened(false)
                      : setTestingOpened(true)
                  }
                >
                  For tester
                </button>

                <div
                  className={cn(
                    "flex items-center justify-center gap-3 rounded-full border-2 bg-black bg-opacity-0 p-1 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
                    bgWhite && !navIsOpen
                      ? "border-primaryGrey"
                      : "border-white"
                  )}
                >
                  <Image
                    src={
                      bgWhite && !navIsOpen
                        ? "/icons/avatar-grey.svg"
                        : "/icons/avatar.svg"
                    }
                    width={27}
                    height={27}
                    alt="Profile icon"
                  />
                  <span
                    className={cn(
                      " pr-3 text-xs",
                      bgWhite && !navIsOpen
                        ? "text-secondaryGrey"
                        : "text-white"
                    )}
                  >
                    {sessionData.user.id.slice(0, 10)}
                  </span>
                </div>
              </div>
            ) : status === "connected" && showConnection ? (
              <div className="w-full">
                {isConnected ? (
                  <Modal
                    isOpen={isConnected && showConnection}
                    toggle={disconnect}
                    title=""
                    changeClose={true}
                  >
                    <div className="flex w-full flex-col  items-center justify-items-center gap-5 font-sans">
                      <Image
                        src={logo1 as string}
                        alt="Something Legendary logo"
                        className="max-h-40 w-full"
                      />
                      <h3 className="text-center text-[27px] uppercase tracking-widest">
                        Welcome to Something Legendary
                      </h3>
                      <p className="text-center">
                        By connecting your wallet and using Something Legendary,
                        you agree to our Terms of Service and Privacy Policy.
                      </p>
                      <div className="flex gap-3 md:gap-10">
                        <button
                          className="self-start rounded-md bg-black px-12 py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white"
                          onClick={disconnect as () => void}
                        >
                          Cancel
                        </button>
                        <button
                          className="self-start whitespace-nowrap rounded-md bg-black px-12 py-1.5 text-center text-sm uppercase text-white transition-all duration-150 hover:bg-black/80 dark:hover:bg-black dark:hover:text-white"
                          onClick={onClickSignIn as () => void}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </Modal>
                ) : null}
              </div>
            ) : null}
            {showConnection && (
              <div className="flex justify-end gap-6">
                {!isConnected && (
                  <button
                    className={cn(
                      "flex w-40 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-white px-5 align-middle text-sm font-medium uppercase leading-tight tracking-wide text-black",
                      bgWhite && "bg-black text-white",
                      isBelowMd && "block bg-white/10 py-2 text-white"
                    )}
                    onClick={() =>
                      TestingOpened
                        ? setTestingOpened(false)
                        : setTestingOpened(true)
                    }
                  >
                    For tester
                  </button>
                )}
                <button
                  className={cn(
                    " flex w-full items-center justify-end rounded-md font-medium  uppercase md:justify-start",
                    // bgWhite ? "bg-white" : "",
                    isConnected ? "w-full" : "w-[151px]"
                  )}
                  onClick={() => (isConnected ? onClickSignOut() : connect())}
                >
                  {isConnected || loading ? (
                    <Image
                      className="h-[24.74px] w-10 "
                      src={
                        bgWhite && !navIsOpen
                          ? "/icons/logout-black.svg"
                          : "/icons/logout.svg"
                      }
                      alt="Log Out"
                      width={20}
                      height={18}
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex  w-40 items-center justify-center gap-2.5 whitespace-nowrap rounded-md bg-white px-5 py-2.5 text-sm  font-medium uppercase leading-tight tracking-wide text-black md:py-2",
                        bgWhite && "bg-black text-white",
                        navIsOpen && "block bg-white/10 text-white"
                        // isBelowMd && "block "
                      )}
                    >
                      CONNECT WALLET
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {TestingOpened ? (
            <Modal
              isOpen={TestingOpened}
              toggle={() => setTestingOpened(false)}
              title="S "
              titleClassName=" invisible"
            >
              <TestingGuides
                mintPaymentToken={mintPaymentToken}
                closeModal={() => setTestingOpened(false)}
              />
            </Modal>
          ) : null}

          {/** END HERE TESTING PORPUSES */}

          {/* <ConnectKitButton
               customTheme={{
                 "--ck-connectbutton-color": "rgba(0, 0, 0)",
                 "--ck-connectbutton-background": "rgb(255,255,255)",
                 "--ck-connectbutton-hover-background": "rgb(230,230,230)",
                 "--ck-connectbutton-hover-color": "rgba(0,0,0,0.8)",
               }}
             /> */}
        </div>
        <button
          className="flex w-full justify-end rounded-md border-none font-semibold  uppercase leading-none md:hidden"
          onClick={(e) => {
            setNavIsOpen((prev) => !prev);
          }}
        >
          <BurguerMenu className={bgWhite && !navIsOpen ? "fill-black" : ""} />
          {/* <Image className=" " src={bgWhite ? burguer : burguer} alt="menu" /> */}
        </button>
      </nav>
      <nav className="fixed z-20 hidden w-full items-center justify-around  bg-white px-3 py-0 shadow-sm drop-shadow-md">
        <div className="w-full justify-between px-4 md:flex md:items-center md:px-8 ">
          <div>
            <div className="flex w-full items-center justify-between py-3 md:block md:py-2">
              <Link href="/">
                <Image
                  src={
                    bgWhite && !navIsOpen
                      ? (logoBlack as string)
                      : (logoWhite as string)
                  }
                  alt="Something Legendary logo"
                />
              </Link>
              <div className="md:hidden">
                <button
                  className="rounded-md border border-transparent p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0  md:block md:pb-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <div className="items-center justify-items-end space-y-4 md:flex  md:space-x-6 md:space-y-0 ">
              <Link
                onClick={() => setNavbar(false)}
                className={cn("flex px-4 py-2", bgWhite ? "text-black" : "")}
                href="/#investments"
              >
                Investments
              </Link>
              <Link
                onClick={() => setNavbar(false)}
                className="flex px-4 py-2"
                href="/#puzzle"
              >
                Puzzle
              </Link>
              <Link href="/faq" legacyBehavior>
                <a
                  onClick={() => setNavbar(false)}
                  className="flex border-b border-gray-200 px-4 py-2 pb-4"
                >
                  FAQ
                </a>
              </Link>
              {isConnected && (
                <>
                  {/* <Link className="flex " href="/profile">
                    <a
                      onClick={() => setNavbar(false)}
                      className="flex w-fit px-4 py-2"
                    >
                      Profile
                    </a>
                  </Link>
                  <Link className="flex " href="/my-investments">
                    <a
                      onClick={() => setNavbar(false)}
                      className="flex w-fit px-4 py-2"
                    >
                      My Investments
                    </a>
                  </Link>
                  <Link className="flex " href="/my-puzzle">
                    <a
                      onClick={() => setNavbar(false)}
                      className="flex w-fit px-4 py-2"
                    >
                      My Puzzle
                    </a>
                  </Link> */}
                  <Link
                    className="flex w-fit rounded-md border bg-slate-800 px-4 py-2 text-slate-50"
                    onClick={() => disconnect}
                    href="#connect"
                  >
                    Disconnect Wallet2
                  </Link>
                </>
              )}
              {/* {!isConnected && <ConnectKitButton />} */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
