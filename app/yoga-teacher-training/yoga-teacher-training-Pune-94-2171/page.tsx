import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga teacher training courses in Pune",
  description:
    "Yoga teacher training courses in Pune will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and at what places should it be practiced.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Pune-94-2171",
    },
};

export default function Page() {
  return <PageClient />;
}