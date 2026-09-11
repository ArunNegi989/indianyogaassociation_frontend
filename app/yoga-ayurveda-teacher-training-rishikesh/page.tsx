import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Ayurveda Course in Rishikesh - India",
  description:
    "Yoga Ayurveda Course in Rishikesh AYM yoga School provides - certified 500-Hour Yoga Teacher Training Course In rishikesh registered with Yoga Alliance, USA",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-ayurveda-teacher-training-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}