import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Ashtanga Yoga Teacher Training School in Mysore - Mysore yoga school",
  description:
    "Best Ashtanga Yoga Teacher Training School in Mysore will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Mysore-94-2170",
    },
};

export default function Page() {
  return <PageClient />;
}