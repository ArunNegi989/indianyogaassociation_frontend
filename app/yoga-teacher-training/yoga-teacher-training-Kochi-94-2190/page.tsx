import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Kochi India",
  description:
    "Yoga Teacher Training in Kochi will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Kochi-94-2190",
    },
};

export default function Page() {
  return <PageClient />;
}