import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Munger - Yoga Classes in Munger",
  description:
    "Yoga Teacher Training in Munger will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Munger-94-2177",
    },
};

export default function Page() {
  return <PageClient />;
}