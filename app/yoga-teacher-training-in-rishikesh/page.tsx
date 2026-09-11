import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Yoga teacher training in Rishikesh with Ayurveda and wellness programs",
  description:
    "Join our certified Yoga Teacher Training in Rishikesh combining ancient Ayurveda, wellness therapies, and authentic yoga practice. Transform your body, mind, and soul in the birthplace of yoga.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-training-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}