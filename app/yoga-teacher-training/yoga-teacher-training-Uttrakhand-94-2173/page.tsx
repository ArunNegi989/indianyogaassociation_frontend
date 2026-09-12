import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Uttrakhand - AYM Yoga School",
  description:
    "Yoga Teacher Training in Uttrakhand will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Uttrakhand-94-2173",
    },
};

export default function Page() {
  return <PageClient />;
}