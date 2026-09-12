import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Arambol - Yoga TTC in Arambol Goa",
  description:
    "Yoga teacher training in Arambol will be organized by AYM Yoga School. Goa is second home of AYM Yoga can join offline and online program in goa.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training/yoga-teacher-training-Arambol-94-2181",
    },
};

export default function Page() {
  return <PageClient />;
}