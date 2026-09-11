import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Ayurveda Detox Retreat in Rishikesh India",
  description:
    "We are providing yoga ayurveda detox retreats in rishikesh, Inida.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-ayurveda-detox-retreat.html",
    },
};

export default function Page() {
  return <PageClient />;
}