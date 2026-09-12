import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "International Yoga Competition 2026 - Rishikesh",
  description:
    "AYM yoga school organizing 7th International Online yoga championship The online yoga competition offers a platform for yoga practitioners worldwide to demonstrate their mastery of yoga poses, flows, and techniques via virtual submissions.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/international-yoga-competition.html",
    },
};

export default function Page() {
  return <PageClient />;
}