import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Maharashtra - Yoga School in Maharashtra",
  description:
    "Yoga Teacher Training in Maharashtra will be organized by AYM Yoga School. Focus will be on teaching different types of yoga and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Maharashtra-94-2189",
    },
};

export default function Page() {
  return <PageClient />;
}