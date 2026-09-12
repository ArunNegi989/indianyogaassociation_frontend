import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Affordable Yoga Teacher Training Sikkim - Yoga Courses in Sikkim",
  description:
    "Yoga Teacher Training Sikkim will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Sikkim-94-2198",
    },
};

export default function Page() {
  return <PageClient />;
}