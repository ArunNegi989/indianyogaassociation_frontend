import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "500 Hour Yoga Teacher Training Course in Rishikesh India - Aym Yoga School",
  description:
    "500 Hour Yoga Teacher Training in Rishikesh, India registered with Yoga Alliance, USA. Residential 500 hour yoga teacher training course in rishikesh provide by AYM Yoga School",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}