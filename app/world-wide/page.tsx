import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Teacher Training World Wide",
  description:
    "Join our worldwide yoga teacher training course to become a certified yoga teacher. Deepen your practice, learn from experienced instructors, and unlock your potential as a yoga teacher.",

};

export default function Page() {
  return <PageClient />;
}