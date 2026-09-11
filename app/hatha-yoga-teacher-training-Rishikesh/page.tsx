import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Hatha Yoga Teacher Training in India : Yoga Alliance certified Hatha YTT Rishikesh",
  description:
    "Join our 200-Hour Hatha Yoga Teacher Training in Rishikesh. Yoga Alliance certified, traditional teachings, expert trainers, and life-changing experience.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/hatha-yoga-teacher-training-Rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}