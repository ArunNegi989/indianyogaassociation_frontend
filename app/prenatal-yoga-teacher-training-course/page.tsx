import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "85 Hour Prenatal Yoga Teacher Training Rishikesh, India",
  description:
    "Yoga Alliance certified prenatal yoga and Garbh Sanskar course in Rishikesh. Ideal for expectant mothers and yoga teachers worldwide. Learn from India’s trusted pregnancy yoga experts.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/prenatal-yoga-teacher-training-course.html",
    },
};

export default function Page() {
  return <PageClient />;
}