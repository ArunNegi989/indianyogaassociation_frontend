import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Varanasi - AYM Yoga School",
  description:
    "Yoga Teacher Training Varanasi will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and meditation practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Varanasi-94-2183",
    },
};

export default function Page() {
  return <PageClient />;
}