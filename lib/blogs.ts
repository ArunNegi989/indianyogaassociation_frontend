export type ImageLayout = "single" | "two-col" | "three-col" | "wide";

export interface BlogImage {
  src: string;
  caption: string;
}

export interface BlogSection {
  type: "heading" | "subheading" | "paragraph" | "images" | "divider";
  text?: string;
  images?: BlogImage[];
  imageLayout?: ImageLayout;
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  image: string;
  tags?: string[];
  content?: BlogSection[];
}
