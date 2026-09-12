import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "FAQ - Find Answers to Common Questions - Yoga Course in Rishikesh",
  description:
    "AYM school offers registered yoga certification courses, yoga in rishikesh india. we provides all information about yoga courses and yoga workshops in india.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-ttc-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}