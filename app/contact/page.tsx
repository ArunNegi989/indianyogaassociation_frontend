import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "AYM YOGA SCHOOL - How to Reach US - Contact US",
  description:
    "AYM YOGA SCHOOL, Address - Upper Tapovan, Tapovan, Rishikesh, Uttarakhand 249192",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/contact.html",
    },
};

export default function Page() {
  return <PageClient />;
}