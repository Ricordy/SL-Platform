import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import logoBlack from "../../public/logo-black.svg";
import logoWhite from "../../public/logo-white.svg";
import { cn } from "../lib/utils";

const NavBar = ({ bgWhite = false }: { bgWhite?: boolean }) => {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const [navbar, setNavbar] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { data: sessionData } = useSession();

  // State
  const [showConnection, setShowConnection] = useState(false);

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
    await signOut();
  };

  /**
   * Handles hydration issue
   * only show after the window has finished loading
   */
  useEffect(() => {
    setShowConnection(true);
  }, []);

  return (
    <>
      <nav className="relative z-20 mx-auto hidden w-full max-w-screen-lg shrink-0 justify-between gap-12 py-6 md:flex lg:px-0">
        <Link href="/">
          <Image
            src={bgWhite ? logoBlack : logoWhite}
            alt="Something Legendary logo"
          />
        </Link>
        <div className="flex items-center justify-center gap-6">
          <div className="flex w-full  items-center justify-end gap-4">
            {sessionData ? (
              <div className="flex w-full items-center justify-between gap-3">
                {/* {sessionData?.user?.id ? (
                      <Image
                        width={"80"}
                        height={"80"}
                        alt={`${sessionData.user.id}`}
                        className="mx-auto my-4 border-8 border-white/30"
                        src={`${renderDataURI({
                          seed: sessionData.user.id,
                          size: 10,
                          scale: 8,
                        })}`}
                      />
                    ) : null} */}
                {/* <code className="block rounded bg-black/20 p-4 text-white">
                    {JSON.stringify(sessionData)}
                  </code> */}
                <Link
                  className={cn(
                    "w-44 text-center",
                    bgWhite ? "text-black" : "text-white"
                  )}
                  href="/my-investments"
                >
                  my Investments
                </Link>
                <Link className="w-12 text-white" href="/#investments">
                  <Image
                    src={
                      bgWhite
                        ? "/icons/notification-grey.svg"
                        : "/icons/notification-white.svg"
                    }
                    width={16}
                    height={19}
                    alt="Alert"
                  />
                </Link>
                <div
                  className={cn(
                    "flex w-44 items-center justify-center gap-3 rounded-full border-2 bg-black bg-opacity-0 p-1 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
                    bgWhite ? "border-primaryGrey" : "border-white"
                  )}
                >
                  <Image
                    src={
                      bgWhite ? "/icons/avatar-grey.svg" : "/icons/avatar.svg"
                    }
                    width={27}
                    height={27}
                    alt="Profile icon"
                  />
                  <span
                    className={cn(
                      " text-xs",
                      bgWhite ? "text-secondaryGrey" : "text-white"
                    )}
                  >
                    {sessionData.user.id.slice(0, 10)}
                  </span>
                </div>
                {/* Sign Out */}
                <button
                  className="flex w-12 items-center justify-center rounded-full py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={onClickSignOut as () => void}
                >
                  <Image
                    src={
                      bgWhite ? "/icons/logout-black.svg" : "/icons/logout.svg"
                    }
                    alt="Sign Out"
                    className="w-5"
                    width={20}
                    height={18}
                  />
                </button>
                {showConnection && isConnected && (
                  <button
                    className={cn(
                      "flex w-12 items-center justify-center rounded-full py-3 font-semibold text-white no-underline transition",

                      "bg-red-400/50 hover:bg-red-400"
                    )}
                    onClick={() => disconnect()}
                  >
                    <Image
                      src={
                        bgWhite
                          ? "/icons/logout-black.svg"
                          : "/icons/logout.svg"
                      }
                      alt="Log Out"
                      className="w-5"
                      width={20}
                      height={18}
                    />
                  </button>
                )}
              </div>
            ) : showConnection ? (
              <div className="w-full text-right">
                {isConnected ? (
                  <button
                    className="self-end rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                    onClick={onClickSignIn as () => void}
                  >
                    Sign In
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {!isConnected && (
            <button
              className=" w-50 whitespace-nowrap rounded-full bg-white/20 px-10 py-3 font-semibold text-slate-800 no-underline transition hover:bg-white/30"
              onClick={() => connect()}
            >
              Connect Wallet
            </button>
          )}

          {/* <ConnectKitButton
               customTheme={{
                 "--ck-connectbutton-color": "rgba(0, 0, 0)",
                 "--ck-connectbutton-background": "rgb(255,255,255)",
                 "--ck-connectbutton-hover-background": "rgb(230,230,230)",
                 "--ck-connectbutton-hover-color": "rgba(0,0,0,0.8)",
               }}
             /> */}
        </div>
      </nav>
      <nav className="fixed z-20 flex w-full items-center justify-around bg-white  px-3 py-0 shadow-sm drop-shadow-md md:hidden">
        <div className="w-full justify-between px-4 md:flex md:items-center md:px-8 ">
          <div>
            <div className="flex w-full items-center justify-between py-3 md:block md:py-2">
              <Link href="/">
                <Image
                  src={bgWhite ? logoBlack : logoWhite}
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
                  <Link className="flex " href="#connect" legacyBehavior>
                    <a
                      className="flex w-fit rounded-md border bg-slate-800 px-4 py-2 text-slate-50"
                      onClick={disconnect}
                    >
                      Disconnect Wallet
                    </a>
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
