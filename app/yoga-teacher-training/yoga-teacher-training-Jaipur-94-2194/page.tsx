import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Yoga Teacher Training in Japur - Yoga Classes in Jaipur",
  description:
    "Best yoga teacher training in Jaipur will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation program.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Jaipur-94-2194",
    },
};

export default function Page() {
  return <PageClient />;
}