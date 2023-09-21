import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { type PostItemProps, type PostProps } from "../@types/post";
import { cn } from "../lib/utils";
import DOMPurify from "isomorphic-dompurify";

const PostItem: FC<PostItemProps> = ({
  image,
  basic,
  titleColor,
  children,
  slug,
  link,
}) => {
  const purifiedChildren = () => ({
    __html: DOMPurify.sanitize(children as string),
  });

  return (
    <div className="relative flex flex-col gap-6">
      <Image
        className="rounded-md"
        src={image.url}
        alt="{basic.title}"
        width={328}
        height={264}
      />
      <h3 className={cn("text-2xl", titleColor ?? "text-black")}>
        {basic.title}
      </h3>
      {/* <div
        className="text-white"
        dangerouslySetInnerHTML={purifiedChildren()}
      ></div> */}
      <Link
        href={link ? link : `/learn/${slug}`}
        className="self-start border-b-2 border-b-primaryGreen py-1 text-center text-xs uppercase text-primaryGreen"
      >
        Know more
      </Link>
      <a
        href={link ? link : `/learn/${slug}`}
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
  posts = posts.filter((post) => {
    return post.postCategory === "beginners";

  });
  return (
    <section
      className={cn(
        "mx-auto flex w-full max-w-screen-lg flex-col justify-center",
        className,
        contentPadding ? "px-24" : ""
      )}
    >
      <div className="relative flex w-full items-center justify-between pb-[52px]">
        <h3
          className={cn(
            "flex-1  text-2xl uppercase",
            titleCentered ? "text-center" : "",
            titleColor ?? "text-black"
          )}
        >
          {title}

          {buttonMoreLink && buttonMoreText && (
            <Link
              href={buttonMoreLink}
              className="absolute  right-0 rounded-md border-2 px-10 py-1 text-sm uppercase text-white hover:bg-white hover:text-black"
            >
              {buttonMoreText}
            </Link>
          )}
        </h3>
      </div>
      <div className="grid w-full grid-cols-3 justify-between gap-6">
        {posts &&
          posts.map(
            (post, index) =>
              index < 3 && (
                <PostItem
                  key={post.slug}
                  shortDescription={post.shortDescription}
                  basic={post.basic}
                  titleColor="text-white"
                  image={post.image}
                  slug={post.slug}
                  link={post.link}
                >
                  {post.shortDescription.html}
                </PostItem>
              )
          )}
      </div>
    </section>
  );
};

export default Posts;
