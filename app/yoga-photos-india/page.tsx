import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Photo Gallery - Yoga in Action & Campus Life",
  description:
    "Explore the Aym Yoga School photo gallery and experience the spirit of yoga through vibrant images of classes, teacher training, campus life, and serene moments in Rishikesh, India.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-photos-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}