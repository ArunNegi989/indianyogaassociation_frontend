import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training in Goa India - Yoga School in Goa",
  description:
    "Yoga Teacher Training in Goa, India is one of the affordable and best place in goa as well in india for yoga teacher training in goa and retreats in goa india.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-goa-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}