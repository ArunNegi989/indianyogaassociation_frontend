import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Online Yoga Course to Become a Certified Yoga Teacher Anywhere",
  description:
    "Join our Online Yoga Course to Become a Certified Yoga Teacher from anywhere in the USA, Europe, or India. Yoga Alliance approved 200/300 Hour TTC. Flexible, affordable, and self-paced â€“ start your journey today!",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/online-yoga-course.html",
    },
};

export default function Page() {
  return <PageClient />;
}