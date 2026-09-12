import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Dharamsala - Yoga in Mcleodganj",
  description:
    "Yoga Teacher Training Dharamsala will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Dharamshala-94-2169",
    },
};

export default function Page() {
  return <PageClient />;
}