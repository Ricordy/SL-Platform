import React from "react";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";

export const InvestmentSidebar = () => {
  return (
    <aside className="w-1/3 flex flex-col align-middle justify-between">
      <div className="flex flex-col align-middle">
        <h4 className="font-bold">Aston Martin DB5 1964</h4>
        <Link href="#">
          <a className="flex align-middle gap-2">
            0x0c7...1Be <FiExternalLink />
          </a>
        </Link>
      </div>
      <div>
        Estimated ROI: <span className="font-bold">20%</span>
      </div>
      <button className="border rounded-md p-2 bg-slate-800 text-slate-50">
        Invest Now
      </button>
    </aside>
  );
};
