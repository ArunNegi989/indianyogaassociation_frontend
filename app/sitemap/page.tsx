import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "XML Sitemap | Indian Yoga Association",
  description:
    "Explore the Indian Yoga Association sitemap to discover yoga teacher training courses, yoga programs, destinations, and important pages across our website.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/sitemap.html",
  },
};

export default function Page() {
  return <PageClient />;
}
