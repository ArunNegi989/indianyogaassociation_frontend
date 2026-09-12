import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Mumbai - Yoga Classes in Mumbai",
  description:
    "Yoga Teacher Training in Mumbai will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Mumbai-94-2175",
    },
};

export default function Page() {
  return <PageClient />;
}