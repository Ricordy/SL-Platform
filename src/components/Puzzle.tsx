import React from "react";
import PuzzleItem from "./PuzzleItem";

const Puzzle: React.FC = () => {
  return (
    <section id="puzzle">
      <h2 className="text-2xl">Puzzle</h2>
      <PuzzleItem level={1} amount={100000} progress={25} />
      <PuzzleItem level={2} amount={200000} progress={0} />
    </section>
  );
};

export default Puzzle;
