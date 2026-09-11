import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "100 Hour Yoga Teacher Training in Rishikesh - 100 Hour Yoga Course in Rishikesh",
  description:
    "The 100 hour yoga teacher training in Rishikesh offers an intensive program designed to deepen your understanding of yoga philosophy, anatomy, asanas, and teaching methodologies.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/100-hour-yoga-teacher-training-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}