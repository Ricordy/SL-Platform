import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-black.svg";
import ProfileMenu from "./ProfileMenu";
import MenuExample from "./MenuExample";

const Nav = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const toggleWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <nav className="flex justify-between max-w-4xl mx-auto py-6">
      <Link href="/">
        <a>
          <Image src={logo} alt="Something Legendary logo" />
        </a>
      </Link>
      <Link href="/#investments">
        <a className="px-4 py-2">Investments</a>
      </Link>
      <Link href="/#puzzle">
        <a className="px-4 py-2">Puzzle</a>
      </Link>
      <Link href="/faq">
        <a className="px-4 py-2">FAQ</a>
      </Link>
      {walletConnected && <ProfileMenu logout={toggleWallet} />}
      {!walletConnected && (
        <Link className=" self-end" href="#connect">
          <a className="px-4 py-2 border rounded-sm" onClick={toggleWallet}>
            Connect Wallet
          </a>
        </Link>
      )}
    </nav>
  );
};

export default Nav;
