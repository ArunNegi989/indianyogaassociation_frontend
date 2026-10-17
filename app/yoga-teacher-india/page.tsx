import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher in India | Yogi Chetan Mahesh Ji",
  description:
    "Meet Yogi Chetan Mahesh Ji, an experienced yoga teacher in India. Explore authentic yoga teachings, traditional practices, and spiritual guidance to deepen your yoga journey.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/yoga-teacher-india.html",
  },
};

export default function Page() {
  return <PageClient />;
}
