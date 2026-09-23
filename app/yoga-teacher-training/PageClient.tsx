import React from "react";
import styles from "@/assets/style/yoga-teacher-training/Yogatraining.module.css";
import Link from "next/link";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const sections = [
  {
    id: 1,
    imageLeft: true,
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop",
    imageAlt: "Yoga teacher training class in India",
    heading: "Qualified yoga training in India",
    headingStyle: "serif" as const,
    text: `AYM Yoga School is located in Rishikesh and Goa. We are a famous yoga and meditation institution in India, specializing in teacher training, yoga gurus in india. We are a non-profit organization that aims to teach quality yoga classes to anyone who wants to become a qualified yoga instructor. AYM Yoga School also helps you relieve emotional problems through yoga therapy retreat. In addition, if you are in India, AYM Yoga School will also fully operate our facilities here.`,
  },
  {
    id: 2,
    imageLeft: false,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop",
    imageAlt: "Yoga meditation class AYM India",
    heading: "Experience the art of yoga and mediatation at AYM in India",
    headingStyle: "script" as const,
    text: `AYM Yoga School is a professional yoga and meditation school located in Rishikesh and Goa. Our area of expertise is to provide high-quality yoga teacher training and yoga retreat service to anyone willing to enjoy the benefits of yoga in India. Enjoy Mantras, Pranayama, yoga prayer with our yoga teachers. Our outstanding achievements are widely recognized by students and professors all over the world. And if you live in India or plan to visit, we also provide our facilities and training courses there.`,
  },
  {
    id: 3,
    imageLeft: true,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop",
    imageAlt: "Best yoga meditation centre India",
    heading: "Best yoga and mediation centre in India",
    headingStyle: "serif" as const,
    text: `India is part of the Asia region. Most of India forms a peninsula, which means that all three sides are surrounded by water. The Himalayas, located in the north, are the highest mountains in the world. India borders are the Bay of Bengal in the southeast region and the Arabian Sea in the southwest. In addition, India is also a country with rich history that could date back into early civilisation era. India is also the birthplace of yoga, its origins can be traced back to 5,000 years ago, the Indian-Saraswati civilization in northern India`,
  },
  {
    id: 4,
    imageLeft: false,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop",
    imageAlt: "Experience yoga and meditation at AYM India",
    heading: "Experience the art of yoga and mediatation at AYM in India",
    headingStyle: "script" as const,
    text: `India is a country that makes up most of South Asia. It has New Delhi as a capital that was built in the 20th century. The Indian government is a constitutional republic, representing a very diverse population of thousands of ethnic groups and hundreds of languages. India is about one-sixth of the world's population, second only to China. India is also a birthplace of yoga which could trace back into 5,000 years ago by Indus-Sarasvati civilization in Northern India`,
  },
  {
    id: 5,
    imageLeft: true,
    image:
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop",
    imageAlt: "Top yoga meditation centre India",
    heading: "Top yoga and mediation centre in India",
    headingStyle: "serif" as const,
    text: `As one of India's best yoga and meditation centers, the goal of AYM Yoga School is to help you learn the correct yoga retreat to solve emotional pain and personal problems, we help you to open your seven chakras. And whether you want to become a yoga instructor or relax, we also offer qualified courses in Rishikesh and Goa.`,
  },
];

const cityLinks: { name: string; href: string }[] = [
  {
    name: "Jaipur",
    href: "/yoga-teacher-training/yoga-teacher-training-Jaipur-94-2194",
  },
  {
    name: "Mysore",
    href: "/yoga-teacher-training/yoga-teacher-training-Mysore-94-2170",
  },
  {
    name: "Haryana",
    href: "/yoga-teacher-training/yoga-teacher-training-Haryana-94-2186",
  },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra-94-2197" },
  {
    name: "Mumbai",
    href: "/yoga-teacher-training/yoga-teacher-training-Mumbai-94-2175",
  },
  {
    name: "Coimbatore",
    href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore-94-2182",
  },
  {
    name: "Uttrakhand",
    href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand-94-2173",
  },
  {
    name: "Varkala",
    href: "/yoga-teacher-training/yoga-teacher-training-Varkala-94-2188",
  },
  {
    name: "Gokarna",
    href: "/yoga-teacher-training/yoga-teacher-training-Gokarna-94-2180",
  },
  {
    name: "Tamil Nadu",
    href: "/yoga-teacher-training/yoga-teacher-training-Tamil%20Nadu-94-2187",
  },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa-94-2167" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi-94-2190" },
  {
    name: "Munger",
    href: "/yoga-teacher-training/yoga-teacher-training-Munger-94-2177",
  },
  {
    name: "Dharamshala",
    href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala-94-2169",
  },
  {
    name: "Lonavala",
    href: "/yoga-teacher-training/yoga-teacher-training-Lonavala-94-2174",
  },
  {
    name: "New Delhi",
    href: "/yoga-teacher-training/yoga-teacher-training-New%20Delhi-94-2176",
  },
  {
    name: "Kerala",
    href: "/yoga-teacher-training/yoga-teacher-training-Kerala-94-2168",
  },
  {
    name: "Puducherry",
    href: "/yoga-teacher-training/yoga-teacher-training-Puducherry-94-2185",
  },
  {
    name: "Pushkar",
    href: "/yoga-teacher-training/yoga-teacher-training-Pushkar-94-2192",
  },
  {
    name: "Sikkim",
    href: "/yoga-teacher-training/yoga-teacher-training-Sikkim-94-2198",
  },
  {
    name: "Gurugram",
    href: "/yoga-teacher-training/yoga-teacher-training-Gurugram-94-2195",
  },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune-94-2171" },
  {
    name: "Chennai",
    href: "/yoga-teacher-training/yoga-teacher-training-Chennai-94-2184",
  },
  {
    name: "Varanasi",
    href: "/yoga-teacher-training/yoga-teacher-training-Varanasi-94-2183",
  },
  {
    name: "Maharashtra",
    href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra-94-2189",
  },
  {
    name: "Arambol",
    href: "/yoga-teacher-training/yoga-teacher-training-Arambol-94-2181",
  },
  {
    name: "Thiruvananthapuram",
    href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram-94-2193",
  },
  {
    name: "Kolkata",
    href: "/yoga-teacher-training/yoga-teacher-training-Kolkata-94-2196",
  },
  {
    name: "Rishikesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh-94-2166",
  },
  {
    name: "Himachal Pradesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Himachal%20Pradesh-94-2178",
  },
  
  {
    name: "Bengaluru",
    href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru-94-2179",
  },
  {
    name: "Auroville",
    href: "/yoga-teacher-training/yoga-teacher-training-Auroville-94-2191",
  },
  {
    name: "Bihar",
    href: "/yoga-teacher-training/yoga-teacher-training-Bihar-94-2172",
  },
  
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTraining: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.a} />

      <div className={styles.container}>
        {/* ── PAGE TITLE ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Yoga Teacher Training in India</h1>
          <div className={styles.titleUnderline}>
            <div className={styles.underlineLine} />
          </div>
        </div>

        {/* ── ALTERNATING SECTIONS ── */}
        {sections.map((section) => (
          <div
            key={section.id}
            className={`${styles.section} ${
              section.imageLeft
                ? styles.sectionImageLeft
                : styles.sectionImageRight
            }`}
          >
            {/* Image */}
            <div className={styles.imgWrap}>
              <img
                src={section.image}
                alt={section.imageAlt}
                className={styles.sectionImg}
                loading="lazy"
              />
            </div>

            {/* Text */}
            <div className={styles.textWrap}>
              <h2
                className={
                  section.headingStyle === "script"
                    ? styles.headingScript
                    : styles.headingSerif
                }
              >
                {section.heading}
              </h2>
              <div className={styles.headingUnderline}>
                <div className={styles.headingUnderlineLine} />
              </div>
              <p className={styles.bodyText}>{section.text}</p>
            </div>
          </div>
        ))}

        {/* ── CITY LINKS ── */}
        <div className={styles.citySection}>
          <h3 className={styles.cityHeading}>
            Indian Yoga is also easily reachable from :
          </h3>
          <div className={styles.cityLinksWrap}>
            {cityLinks.map((city, i) => (
              <React.Fragment key={i}>
                <Link href={city.href} className={styles.cityLink}>
                  {city.name}
                </Link>
                {i < cityLinks.length - 1 && (
                  <span className={styles.citySep}>, </span>
                )}
              </React.Fragment>
            ))}
            <span className={styles.cityDot}>.</span>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className={styles.a} />
    </div>
  );
};

export default YogaTraining;
