import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "3, 7 & 14 Days - Yoga Retreat Course in Rishikesh India",
  description:
    "Discover inner peace and rejuvenation at our all-inclusive Yoga retreat. Explore daily yoga, meditation, and wellness in a serene natural setting. Book your transformative escape today!",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-retreats-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}