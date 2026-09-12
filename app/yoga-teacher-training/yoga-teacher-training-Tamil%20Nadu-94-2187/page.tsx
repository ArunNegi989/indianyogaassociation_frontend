import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Course in Tamil Nadu - AYM Yoga School",
  description:
    "Yoga Teacher Training Course in Tamil Nadu will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Tamil%20Nadu-94-2187",
    },
};

export default function Page() {
  return <PageClient />;
}