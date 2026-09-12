import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training Fees in India | 200 Hour Yoga TTC Rishikesh",
  description:
    "How to Pay, Payment options for yoga Courses retreats Conducted at Association for yoga and Meditation india, A registered yoga school ashram in rishikesh india.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/200-hour-yoga-ttc-fees.html",
    },
};

export default function Page() {
  return <PageClient />;
}