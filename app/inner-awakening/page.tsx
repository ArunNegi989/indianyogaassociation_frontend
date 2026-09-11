import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Inner Awakening Program - Spiritual Transformation Yoga in Rishikesh, India",
  description:
    "Inner awaking program in rishikesh with Yogi Chetan Mahesh at AYM Yoga School, the most powerful spiritual tranformation program in rishikesh.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/inner-awakening.html",
    },
};

export default function Page() {
  return <PageClient />;
}