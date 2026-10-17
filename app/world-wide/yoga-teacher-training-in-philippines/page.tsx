import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in the Philippines | Certified Yoga Courses",
  description:
    "Join our yoga teacher training courses in the Philippines. Deepen your yoga practice, learn from experienced instructors, and develop the skills to become a certified yoga teacher in a peaceful tropical setting.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-in-philippines.html",
  },
};

export default function Page() {
  return <PageClient />;
}
