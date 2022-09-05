import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-black.svg";

const Nav: React.FC = () => {
  return (
    <nav className="flex justify-between">
      <Link href="/">
        <a>
          <Image src={logo} alt="Something Legendary logo" />
        </a>
      </Link>
      <Link href="/#investments">
        <a>Investments</a>
      </Link>
      <Link href="/#puzzle">
        <a>Puzzle</a>
      </Link>
      <Link href="/faq">
        <a>FAQ</a>
      </Link>
      <Link href="#profile">
        <a>Profile</a>
      </Link>
      <Link className=" self-end" href="#connect">
        <a>Connect Wallet</a>
      </Link>
    </nav>
  );
};

export default Nav;
