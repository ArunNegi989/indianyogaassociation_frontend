import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Himachal Pradesh",
  description:
    "Yoga Teacher Training in Himachal Pradesh will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Himachal%20Pradesh-94-2178",
    },
};

export default function Page() {
  return <PageClient />;
}