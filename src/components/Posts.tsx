import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { PostItemProps, PostProps } from "../@types/post";
import { cn } from "../lib/utils";

const PostItem: FC<PostItemProps> = ({
  image,
  title,
  titleColor,
  children,
  slug,
}) => {
  return (
    <div className="flex flex-col gap-6 relative">
      <Image
        className="rounded-md"
        src={image}
        alt={title}
        width={328}
        height={264}
      />
      <h3 className={cn("text-2xl", titleColor ?? "text-black")}>{title}</h3>
      {children}
      <Link href={`/learn/${slug}`}>
        <a className="text-primaryGreen text-center uppercase border-b-2 text-xs border-b-primaryGreen py-1 self-start">
          Know more
        </a>
      </Link>
      <a
        href={`/learn/${slug}`}
        className={cn(
          "absolute inset-0 rounded-md",
          "ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
        )}
      />
    </div>
  );
};

const Posts: FC<PostProps> = ({
  posts,
  title,
  titleCentered = false,
  titleColor,
  buttonMoreText,
  buttonMoreLink,
  className,
  contentPadding,
}) => {
  return (
    <section
      className={cn(
        "mx-auto flex flex-col w-full max-w-screen-lg justify-center",
        className,
        contentPadding ? "px-24" : ""
      )}
    >
      <div className="flex pb-[52px] w-full items-center relative justify-between">
        <h3
          className={cn(
            "flex-1  text-2xl uppercase",
            titleCentered ? "text-center" : "",
            titleColor ?? "text-black"
          )}
        >
          {title}
          {buttonMoreLink && buttonMoreText && (
            <Link href={buttonMoreLink}>
              <a className="uppercase  hover:text-black hover:bg-white border-2 py-1 px-10 text-sm absolute right-0 rounded-md text-white">
                {buttonMoreText}
              </a>
            </Link>
          )}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full justify-between">
        {posts &&
          posts.map((post) => (
            <PostItem
              key={post.slug}
              title={post.title}
              titleColor="text-white"
              image={post.image}
              slug={post.slug}
            >
              {post.children}
            </PostItem>
          ))}
      </div>
    </section>
  );
};

export default Posts;
