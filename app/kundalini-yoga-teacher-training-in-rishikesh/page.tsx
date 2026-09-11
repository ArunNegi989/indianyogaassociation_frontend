import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "200 Hour Kundalini Yoga Teacher Training In Rishikesh India",
  description:
    "This comprehensive and unique Best 200 hour Kundalini Yoga Teacher Training in Rishikesh India organized by AYM Yoga School, Kundalini yoga TTC Course Rishikesh",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/kundalini-yoga-teacher-training-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}