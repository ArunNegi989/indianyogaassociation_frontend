import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Rishikesh - AYM Yoga School",
  description:
    "A Yoga Meditation Workshop in Rishikesh will be organized by AYM Yoga School. Focus will be on teaching different types of meditation and yoga practices.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Rishikesh-94-2166",
    },
};

export default function Page() {
  return <PageClient />;
}