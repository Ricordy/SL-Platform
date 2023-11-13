import { type ReactNode } from "react";

export type PostProps = {
  posts?: PostItemProps[];
  title: string | ReactNode;
  titleCentered?: boolean;
  titleColor?: string;
  buttonMoreText?: string;
  buttonMoreLink?: string;
  className?: string;
  contentPadding?: boolean;
};
export type PostItemProps = {
  title: string;
  image: { url: string };
  shortDescription: { html: string };
  description?: { html: string };
  titleColor?: string;
  slug: string;
  category?: string;
  children: ReactNode;
  postCategory?: string;
  link: string;
};
