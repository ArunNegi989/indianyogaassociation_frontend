import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Yoga Teacher Training in Kerala India",
  description:
    "Best Yoga Teacher Training in Kerala, India will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Kerala-94-2168",
    },
};

export default function Page() {
  return <PageClient />;
}