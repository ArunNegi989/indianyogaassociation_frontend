import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Yoga Teacher Training in Gokarna - Best Yoga Retreats",
  description:
    "Best Yoga Teacher Training Gokarna will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Gokarna-94-2180",
    },
};

export default function Page() {
  return <PageClient />;
}