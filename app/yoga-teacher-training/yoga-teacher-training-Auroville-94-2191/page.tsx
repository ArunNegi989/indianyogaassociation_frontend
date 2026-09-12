import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "YYoga Teacher Training in Auroville | Wellness & Certification Courses",
  description:
    "Discover Yoga Teacher Training in Auroville – immersive certification courses, wellness yoga sessions, and expert guidance to transform your practice and launch your career as a certified yoga teacher.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Auroville-94-2191",
    },
};

export default function Page() {
  return <PageClient />;
}