import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Meditation Yoga Teacher Training Course in Rishikesh India",
  description:
    "Enhance your skills with our Meditation Yoga Teacher Training. Learn key techniques to guide others on their wellness journey. Suitable for all levels, this program offers a supportive environment to elevate your practice. Join us today!",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-meditation-workshop-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}