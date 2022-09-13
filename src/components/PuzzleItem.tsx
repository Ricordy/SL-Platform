import React from "react";

type PuzzleItemData = {
  level?: number;
  amount?: string;
  progress?: string;
  showProgressInsideBar: boolean;
};

const PuzzleItem: React.FC<PuzzleItemData> = ({
  level,
  amount,
  progress,
  showProgressInsideBar,
}) => {
  return (
    <div className="w-full">
      {level && <h2 className="">{`Level ${level}`}</h2>}
      <div className="w-full text-center">{amount}</div>

      <div className="w-full bg-gray-200 rounded-full">
        <div
          className="bg-gray-600 text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-full"
          style={{ width: `${progress}%` }}
        >
          {showProgressInsideBar && (
            <div className="w-full text-center">{progress}%</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleItem;
