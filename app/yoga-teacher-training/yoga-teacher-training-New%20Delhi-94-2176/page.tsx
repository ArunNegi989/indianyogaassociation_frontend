import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Delhi - Yoga Classes in Delhi",
  description:
    "Yoga Teacher Training in Delhi will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-New%20Delhi-94-2176",
    },
};

export default function Page() {
  return <PageClient />;
}