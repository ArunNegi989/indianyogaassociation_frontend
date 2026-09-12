import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Course in Kolkata - Yoga school in Kolkata",
  description:
    "Yoga Teacher Training Course in Kolkata will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Kolkata-94-2196",
    },
};

export default function Page() {
  return <PageClient />;
}