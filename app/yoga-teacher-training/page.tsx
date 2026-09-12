import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training India - AYM Yoga School",
  description:
    "A Yoga Teacher Training School in India offers yoga course all over the world and All cousre are registered with Yoga Alliance, USA.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training-course-bali.html",
    },
};

export default function Page() {
  return <PageClient />;
}