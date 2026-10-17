import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title:
    "Yoga Teacher Training Course in Pokhara, Nepal | Indian Yoga Association",
  description:
    "Join our yoga teacher training course in Pokhara, Nepal. Deepen your practice, learn from experienced yoga instructors, and become a certified yoga teacher in a peaceful Himalayan setting.",

  alternates: {
    canonical:
      "https://www.indianyogaassociation.com/world-wide/yoga-teacher-training-course-in-pokhara.html",
  },
};

export default function Page() {
  return <PageClient />;
}
