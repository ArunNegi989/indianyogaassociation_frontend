import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga TTC in Rishikesh India - YTTC in Rishikesh",
  description:
    "Yoga Teacher Training Cousre rules and regulation at AYM YOGA SCHOOL, to maintain and improve yogic healthy lifestyle.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-ttc-india.html",
    },
};

export default function Page() {
  return <PageClient />;
}