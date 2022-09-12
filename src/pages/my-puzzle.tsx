import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const MyPuzzle: NextPage = () => {
  let [categories] = useState({
    "Level 1": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,
        nft: false,
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
        nft: true,
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
        nft: true,
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
    ],
    "Level 2": [
      {
        id: 1,
        title: "Wheel",
        date: "5h ago",
        commentCount: 5,
        nft: false,
      },
      {
        id: 2,
        title: "Engine",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 3,
        title: "Box",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 4,
        title: "Body",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 5,
        title: "Seat",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 6,
        title: "Sterring Wheel",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 7,
        title: "Grill",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 8,
        title: "Glass",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 9,
        title: "Chassis",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
      {
        id: 10,
        title: "Exhaust",
        date: "2h ago",
        commentCount: 3,
        nft: false,
      },
    ],
  });

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-gray-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-400 focus:outline-none focus:ring-2"
              )}
            >
              <ul className="grid grid-cols-5 gap-2">
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 border  hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>

                    <ul className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                      {post.nft && (
                        <svg
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
                      )}
                    </ul>

                    <a
                      href="#"
                      className={classNames(
                        "absolute inset-0 rounded-md",
                        "ring-gray-400 focus:z-10 focus:outline-none focus:ring-2"
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default MyPuzzle;
