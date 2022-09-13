import React from "react";
import PuzzleItem from "./PuzzleItem";

const Puzzle = () => {
  return (
    <section id="puzzle">
      <h2 className="text-2xl">Puzzle</h2>
      <PuzzleItem
        level={1}
        amount="20 %"
        progress="20"
        showProgressInsideBar={false}
      />
      <PuzzleItem
        level={2}
        amount="N/A"
        progress="0"
        showProgressInsideBar={false}
      />
    </section>
  );
};

export default Puzzle;
