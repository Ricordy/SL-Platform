import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "../../public/logo-black.svg";
import logoWhite from "../../public/logo-white.svg";
import ProfileMenu from "./ProfileMenu";
import { ChainIcon, ConnectKitButton } from "connectkit";
import { useAccount, useNetwork } from "wagmi";
import { disconnect } from "@wagmi/core";
import { cn } from "../lib/utils";

interface MenuItemProps {
  link: string;
  text: string;
}

const NavBar = ({ bgWhite = false }: { bgWhite?: boolean }) => {
  const { isConnected, isConnecting, isDisconnected } = useAccount();

  const [navbar, setNavbar] = useState(false);
  const menuItems: MenuItemProps[] = [
    {
      link: "/#investments",
      text: "MyInvestments",
    },
    {
      link: "/#puzzle",
      text: "Puzzle",
    },
    {
      link: "/faq",
      text: "FAQ",
    },
  ];

  return (
    <>
      <nav className="md:flex max-w-screen-lg relative z-50 hidden justify-between w-full mx-auto lg:px-0 shrink-0 py-6">
        <Link href="/">
          <a>
            <Image
              src={bgWhite ? logoBlack : logoWhite}
              alt="Something Legendary logo"
            />
          </a>
        </Link>
        <div className="flex justify-center gap-6 items-center">
          {isConnected && (
            <>
              <Link href="/my-investments">
                <a className={bgWhite ? "text-black" : "text-white"}>
                  my Investments
                </a>
              </Link>
              <Link href="/#investments">
                <a className=" text-white">
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
                </a>
              </Link>
              <ProfileMenu bgWhite={bgWhite} logout={disconnect} />
              <Link href="#">
                <a className="py-2" onClick={disconnect}>
                  <Image
                    src={
                      bgWhite ? "/icons/logout-black.svg" : "/icons/logout.svg"
                    }
                    alt="Logout"
                    width={20}
                    height={18}
                  />
                </a>
              </Link>
            </>
          )}
          {!isConnected && (
            <ConnectKitButton
              customTheme={{
                "--ck-connectbutton-color": "rgba(0, 0, 0)",
                "--ck-connectbutton-background": "rgb(255,255,255)",
                "--ck-connectbutton-hover-background": "rgb(230,230,230)",
                "--ck-connectbutton-hover-color": "rgba(0,0,0,0.8)",
              }}
            />
          )}
        </div>
      </nav>
      <nav className="bg-white shadow-sm flex fixed w-full z-20 md:hidden  drop-shadow-md px-3 py-0 items-center justify-around">
        <div className="justify-between px-4 w-full md:items-center md:flex md:px-8 ">
          <div>
            <div className="flex items-center justify-between py-3 md:py-2 md:block w-full">
              <Link href="/">
                <a>
                  <Image
                    src={bgWhite ? logoBlack : logoWhite}
                    alt="Something Legendary logo"
                  />
                </a>
              </Link>
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none border border-transparent focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
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
                      className="w-6 h-6"
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
            className={`flex-1 justify-self-center pb-3 mt-8 md:block  md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <div className="items-center justify-items-end space-y-4 md:flex  md:space-x-6 md:space-y-0 ">
              <Link href="/#investments">
                <a
                  onClick={() => setNavbar(false)}
                  className={cn("flex px-4 py-2", bgWhite ? "text-black" : "")}
                >
                  Investments
                </a>
              </Link>
              <Link href="/#puzzle">
                <a onClick={() => setNavbar(false)} className="flex px-4 py-2">
                  Puzzle
                </a>
              </Link>
              <Link href="/faq">
                <a
                  onClick={() => setNavbar(false)}
                  className="flex px-4 py-2 pb-4 border-b border-gray-200"
                >
                  FAQ
                </a>
              </Link>
              {isConnected && (
                <>
                  <Link className="flex " href="/profile">
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
                  </Link>
                  <Link className="flex " href="#connect">
                    <a
                      className="flex w-fit px-4 py-2 border rounded-md bg-slate-800 text-slate-50"
                      onClick={disconnect}
                    >
                      Disconnect Wallet
                    </a>
                  </Link>
                </>
              )}
              {!isConnected && <ConnectKitButton />}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
