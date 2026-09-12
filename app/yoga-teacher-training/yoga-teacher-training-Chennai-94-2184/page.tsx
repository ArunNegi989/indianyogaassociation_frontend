import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Chennai - yoga course in chennai",
  description:
    "Aym yoga school offering offline and online yoga teacher training program, we are also providing online teacher training in Chennai registered with Yoga Alliance and Govt of India.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Chennai-94-2184",
    },
};

export default function Page() {
  return <PageClient />;
}