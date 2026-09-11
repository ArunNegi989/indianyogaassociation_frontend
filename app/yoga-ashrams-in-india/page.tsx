import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Ashrams in Rishikesh - Yoga Ashrams in India",
  description:
    "Discover inner peace and holistic well-being at AYM Yoga Ashram in Rishikesh, India. Immerse yourself in authentic yoga teachings, serene surroundings, and expert guidance.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-ashrams-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}