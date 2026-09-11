import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Bali - Yoga Course in Bali",
  description:
    "Explore Yoga teacher training in Ubud Bali with 200 hour, 300 hour and 500 hour yoga certification at AYM Yoga School in Bali registered with yoga alliance, usa.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training-course-bali.html",
    },
};

export default function Page() {
  return <PageClient />;
}