import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "How to apply yoga teacher training course in rishikesh, india",
  description:
    "How to apply yoga teacher training course in rishikesh - Join our yoga classes for a healthier, balanced life. Register now!",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-registration.html",
    },
};

export default function Page() {
  return <PageClient />;
}