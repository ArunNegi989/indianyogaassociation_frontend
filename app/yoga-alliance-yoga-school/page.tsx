import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Registered Yoga School in Rishikesh Yoga Alliance, USA &amp; YCB, Ministry of AYUSH",
  description:
    "Registered Yoga Teacher Training School in India offers 200 hour, 300 hour and 500 hour yoga teacher training certificate in Rishikesh India",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-alliance-yoga-school.html",
    },
};

export default function Page() {
  return <PageClient />;
}