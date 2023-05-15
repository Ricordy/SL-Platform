import { ReactNode } from "react";

export type PostProps = {
  posts: PostItemProps[];
  title: string | ReactNode;
  titleCentered?: boolean;
  titleColor?: string;
  buttonMoreText?: string;
  buttonMoreLink?: string;
  className?: string;
  contentPadding?: boolean;
};
export type PostItemProps = {
  image: { url: string };
  basic: { title: string };
  shortDescription: { html: string };
  description?: { html: string };
  titleColor?: string;
  slug: string;
  category?: string;
  children: ReactNode;
};
