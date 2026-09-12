import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Coimbatore India",
  description:
    "Yoga Teacher Training in Coimbatore India will be organized by AYM Yoga School. Focus will be on teaching different types of Yoga Style registered with Yoga Alliance, USA.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Coimbatore-94-2182",
    },
};

export default function Page() {
  return <PageClient />;
}