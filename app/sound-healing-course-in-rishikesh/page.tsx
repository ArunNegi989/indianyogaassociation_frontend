import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Sound Healing Therapy Training Courses in Rishikesh India 2026",
  description:
    "Join the best Sound healing certification Course in Rishikesh, India. Learn the sound healing singing bowls, sound bath meditation along with other sound healing instruments.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/sound-healing-course-in-rishikesh.html",
    },
};

export default function Page() {
  return <PageClient />;
}