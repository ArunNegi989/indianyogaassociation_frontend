import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Retreat in Lonavala - Yoga Teacher Training in Lonavala",
  description:
    "Yoga Teacher Training in Lonavala Mumbai will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Lonavala-94-2174",
    },
};

export default function Page() {
  return <PageClient />;
}