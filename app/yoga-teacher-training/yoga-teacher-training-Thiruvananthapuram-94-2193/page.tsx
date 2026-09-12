import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Thiruvananthapuram - AYM Yoga School",
  description:
    "Yoga Teacher Training Thiruvananthapuram will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram-94-2193",
    },
};

export default function Page() {
  return <PageClient />;
}