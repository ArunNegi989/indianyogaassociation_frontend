import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in India - Yoga Teacher Training Course in India",
  description:
    "Yoga Teacher Training in India, best yoga teacher training course in india offer by AYM yoga School in Rishikesh India, all yoga courses are registered with Yoga Alliance, USA.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}