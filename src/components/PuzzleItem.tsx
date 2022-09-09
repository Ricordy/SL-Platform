import React from "react";

type PuzzleItemData = {
  level: number;
  amount: number;
  progress: number;
};

const PuzzleItem: React.FC<PuzzleItemData> = ({ level, amount, progress }) => {
  return (
    <div className="py-6">
      <h2 className="font-bold">{`Level ${level}`}</h2>
      <div className="w-full text-center">{amount}</div>
      <div className="w-full bg-gray-200 rounded-full">
        <div
          className="bg-gray-600 text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-l-full"
          style={{ width: `${progress}%` }}
        >
          {progress}
        </div>
      </div>
    </div>
  );
};

export default PuzzleItem;
