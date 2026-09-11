import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga School in India - Yoga School in Rishikesh",
  description:
    "Yoga school in india - Aym yoga school offers 200 hours, 300 hours and 500 yoga teacher training in rishikesh india Registered with YOGA Alliance, USA and YCB, Ministry of AYUSH.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-school-in-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}