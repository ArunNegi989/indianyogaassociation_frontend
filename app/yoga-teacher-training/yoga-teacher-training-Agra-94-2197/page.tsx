import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Agra | Wellness & Certification Courses",
  description:
    "Join our Yoga Teacher Training in Agra for 200â€‘hour certification, wellness yoga sessions, and immersive training to become a certified yoga instructor. Perfect for beginners and seasoned practitioners.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Agra-94-2197",
    },
};

export default function Page() {
  return <PageClient />;
}