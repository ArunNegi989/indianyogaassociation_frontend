import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training in Nepal | Certified Yoga Courses",
  description:
    "Join our yoga teacher training courses in Nepal. Deepen your yoga practice, learn from experienced instructors, and develop the skills to become a certified yoga teacher amidst the peaceful Himalayan landscapes.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-in-nepal.html",
  },
};

export default function Page() {
  return <PageClient />;
}
