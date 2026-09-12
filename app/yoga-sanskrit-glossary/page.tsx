import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Yoga Sanskrit Glossary : Yoga Teacher Training India",
  description:
    "Yoga Asana Name in Sanskrit, Sanskrit name of asana, yoga sanskrit name, yoga pose in sanskrit, Yoga Sanskrit Glossary, here you can find yoga words in Sanskrit language and use in daily life.",

    alternates: {
      canonical: "https://www.indianyogaassociation.com/yoga-sanskrit-glossary.html",
    },
};

export default function Page() {
  return <PageClient />;
}