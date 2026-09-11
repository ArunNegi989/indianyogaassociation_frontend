import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training for Beginners in Rishikesh - Yoga Beginner Course",
  description:
    "Yoga beginners course in rishikesh at aym yoga school we are providing 100 hours and 200 hour yoga teacher training for beginners in rishikesh registered with yoga alliance, USA. RYS 200.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-for-beginners-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}