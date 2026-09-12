import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Volunteer Course in Rishikesh - AYM Yoga School",
  description:
    "How to become a registered yoga teacher, post-yoga teacher training course, and yoga volunteer with AYM Yoga School.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-volunteer.html",
    },
};

export default function Page() {
  return <PageClient />;
}