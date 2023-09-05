import { FC } from "react";

interface NFTCheckedIconProps {
  numberOfItems: number;
}

const NftCheckedIcon: FC<NFTCheckedIconProps> = ({ numberOfItems }) => {
  const cards = [];
  for (let i = 0; i < numberOfItems; i++) {
    cards.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  return <>{cards}</>;
};

export default NftCheckedIcon;
