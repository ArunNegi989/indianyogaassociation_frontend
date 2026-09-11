import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "200 Hour Yoga Teacher Training in Rishikesh India",
  description:
    "Immerse yourself in this life-changing 200 Hour Yoga Teacher Training in Rishikesh, India. Learn to teach yoga from experienced instructors in the yoga capital of the world.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}