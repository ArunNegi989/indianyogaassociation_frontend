import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Best Yoga Teachers in India - Yoga Teachers in Rishikesh",
  description:
    "AYM yoga teachers team in rishikesh is dedicated to provide life changing experience to yoga spirants.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-teacher-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}