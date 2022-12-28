import React from "react";
import { NumericFormat } from "react-number-format";

type PuzzleItemData = {
  level?: number;
  amount: string;
  current: string;
  progress?: string;
  showProgressInsideBar: boolean;
  className?: string;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PuzzleItem: React.FC<PuzzleItemData> = ({
  level,
  amount,
  current,
  progress,
  showProgressInsideBar,
  className,
}) => {
  return (
    <div className={classNames("w-full", className ?? "")}>
      {level && <h2 className="">{`Level ${level}`}</h2>}
      <div className="w-full text-center">
        {amount?.indexOf("/") > -1 ? (
          amount
        ) : (
          <div>
          <NumericFormat
            value={current}
            displayType="text"
            fixedDecimalScale={true}
            decimalSeparator="."
            thousandSeparator=","
            decimalScale={2}
            prefix="$ "
          />
          /
          <NumericFormat
            value={amount}
            displayType="text"
            fixedDecimalScale={true}
            decimalSeparator="."
            thousandSeparator=","
            decimalScale={2}
            prefix="$ "
          />
          </div>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full">
        <div
          className="bg-gray-600 text-xs font-medium text-black-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${Number(current)/Number(amount)}%` }}
        >
          {showProgressInsideBar && (
            <div className="w-full text-center">{Number(current)/Number(amount)}%</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleItem;
