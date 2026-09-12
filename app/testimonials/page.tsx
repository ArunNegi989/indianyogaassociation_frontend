import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Rishikesh India Reviews, Ratings &amp; Testimonials",
  description:
    "yoga teacher training india reviews - Students Testimonials for Yoga Teacher training certification conducted by AYM Rishikesh India, What students say about indian yoga association Rishikesh India.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/testimonials.html",
    },
};

export default function Page() {
  return <PageClient />;
}