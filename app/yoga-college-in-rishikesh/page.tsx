import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga College in Rishikesh : M. A. Yoga Diploma",
  description:
    "Yoga College in rishikesh provides Yoga Dimploma, Yoga Courses in rishikesh and M.A. Yoga in Haridwar, Rishikesh, India.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-college-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}