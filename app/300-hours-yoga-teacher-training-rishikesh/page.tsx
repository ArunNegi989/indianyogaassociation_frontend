import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best 300 Hour Yoga Teacher Training in Rishikesh India",
  description:
    "Deepen your yoga practice and become a certified teacher with our best 300 hour yoga teacher training in Rishikesh, India at AYM yoga school.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/300-hours-yoga-teacher-training-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}