import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Courses in Haryana - Yoga Classes in Haryana",
  description:
    "Our Yoga Teacher Training in Haryana offers comprehensive instruction in various yoga styles, empowering you to become a confident instructor. Join us for a transformative experience amidst serene landscapes.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Haryana-94-2186",
    },
};

export default function Page() {
  return <PageClient />;
}