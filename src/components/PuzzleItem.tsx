import React from "react";
import { NumericFormat } from "react-number-format";
import { classNames } from "../lib/utils";

type PuzzleItemData = {
  level?: number;
  amount: string;
  current: string;
  progress?: string;
  showProgressInsideBar: boolean;
  className?: string;
};

const PuzzleItem: React.FC<PuzzleItemData> = ({
  level,
  amount,
  current,
  progress,
  showProgressInsideBar,
  className,
}) => {
  const barWidth = (Number(current) / Number(amount)) * 100;
  // console.log(current, amount, (Number(current) / Number(amount)) * 100);

  const barWidthFormatted = `${barWidth}%`;
  return (
    <div className={classNames("w-full", className ?? "")}>
      {level && <h2 className="text-2xl text-slate-500">{`Level ${level}`}</h2>}
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

      <div className="w-full mt-1 text-xs bg-gray-200 rounded-full">
        {barWidth !== 0 ? (
          <div
            className="bg-gray-600  font-medium text-black-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: barWidth > 100 ? "100%" : barWidthFormatted }}
          >
            {showProgressInsideBar && (
              <div className="w-full text-center text-gray-200">
                {barWidthFormatted}
              </div>
            )}
          </div>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
    </div>
  );
};

export default PuzzleItem;
