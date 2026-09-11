import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Holidays in India - Yoga Camps in Rishikesh",
  description:
    "Yoga Holidays in Rishikesh India - AYM yoga schools provides in low price yoga classes and stay and food for general health.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-holidays-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}