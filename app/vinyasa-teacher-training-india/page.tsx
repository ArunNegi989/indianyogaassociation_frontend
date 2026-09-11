import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Vinyasa Yoga Teacher Training in Rishikesh - 200 Hour Ashtanga Yoga Course in Rishikesh",
  description:
    "Join our 200-hour Vinyasa Yoga Teacher Training in Rishikesh, India. Deepen your practice, gain Yoga Alliance certification, and train with experienced instructors in the world's yoga capital.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/vinyasa-teacher-training-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}