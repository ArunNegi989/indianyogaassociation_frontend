import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in Hong Kong | Certified Yoga Courses",
  description:
    "Join our yoga teacher training courses in Hong Kong. Deepen your yoga practice, learn from experienced instructors, and develop the skills to become a certified yoga teacher through immersive training programs.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-in-hong-kong.html",
  },
};

export default function Page() {
  return <PageClient />;
}
