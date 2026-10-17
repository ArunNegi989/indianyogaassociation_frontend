import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in Asia | Certified Yoga Courses",
  description:
    "Join our yoga teacher training courses in Asia. Deepen your yoga practice, learn from experienced instructors, and become a certified yoga teacher through immersive training programs across Asia.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-in-asia.html",
  },
};

export default function Page() {
  return <PageClient />;
}
