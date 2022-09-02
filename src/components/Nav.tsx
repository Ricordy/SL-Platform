import React from "react";
import Link from "next/link";

const Nav: React.FC = () => {
  return (
    <nav className="flex justify-between">
      <Link href="/">
        <a>Logo</a>
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
        <a>Provile</a>
      </Link>
      <Link className=" self-end" href="#connect">
        <a>Connect Wallet</a>
      </Link>
    </nav>
  );
};

export default Nav;
