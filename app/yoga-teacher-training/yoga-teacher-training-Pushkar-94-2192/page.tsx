import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Residential Yoga Teacher Training Course in Pushkar India",
  description:
    "Yoga Teacher Training Course in Pushkar will be organized by AYM Yoga School. Focus will be on teaching different types of yoga style.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Pushkar-94-2192",
    },
};

export default function Page() {
  return <PageClient />;
}