import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in Bihar – Join Corporate & Wellness Yoga Programs",
  description:
    "Yoga Teacher Training in Bihar – Corporate & wellness yoga programs for certification, skill enhancement, and personal growth.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Bihar-94-2172",
  },
};

export default function Page() {
  return <PageClient />;
}
