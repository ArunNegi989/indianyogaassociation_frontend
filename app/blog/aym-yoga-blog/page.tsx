import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training India - AYM Yoga Blog",
  description:
    "yoga teacher training india at AYM Yoga School Registered with Yoga Alliance, USA and International Yoga Alliance, India",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/blog/aym-yoga-blog.html",
    },
};

export default function Page() {
  return <PageClient />;
}