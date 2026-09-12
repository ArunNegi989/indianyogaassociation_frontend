import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Pondicherry - yoga classes in pondicherry",
  description:
    "Yoga Teacher Training in Pondicherry will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Puducherry-94-2185",
    },
};

export default function Page() {
  return <PageClient />;
}