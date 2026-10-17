import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in Switzerland | Certified Yoga Courses",
  description:
    "Join our yoga teacher training courses in Switzerland. Deepen your yoga practice, learn from experienced instructors, and develop the skills to become a certified yoga teacher amidst the beautiful Swiss Alps.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-in-switzerland.html",
  },
};

export default function Page() {
  return <PageClient />;
}
