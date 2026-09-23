import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Bengaluru – Join Corporate & Wellness Yoga Programs",
  description:
    "Yoga Teacher Training in Bengaluru – Corporate & wellness yoga programs for certification, skill enhancement, and personal growth.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Bengaluru-94-2179",
    },
};

export default function Page() {
  return <PageClient />;
}