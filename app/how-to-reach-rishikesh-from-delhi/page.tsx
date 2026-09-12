import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "How To Reach Rishikesh from Delhi",
  description:
    "Learn how to get to Rishikesh with our straightforward guide on transportation options, including trains, buses, and flights. Ideal for travelers seeking both adventure and relaxation.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/how-to-reach-rishikesh-from-delhi.html",
    },
};

export default function Page() {
  return <PageClient />;
}