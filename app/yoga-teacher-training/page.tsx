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
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&q=80&fit=crop",
    imageAlt: "Yoga teacher training class in India",
    heading: "Qualified yoga training in India",
    headingStyle: "serif" as const,
    text: `AYM Yoga School is located in Rishikesh and Goa. We are a famous yoga and meditation institution in India, specializing in teacher training, yoga gurus in india. We are a non-profit organization that aims to teach quality yoga classes to anyone who wants to become a qualified yoga instructor. AYM Yoga School also helps you relieve emotional problems through yoga therapy retreat. In addition, if you are in India, AYM Yoga School will also fully operate our facilities here.`,
  },
  {
    id: 2,
    imageLeft: false,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop",
    imageAlt: "Yoga meditation class AYM India",
    heading: "Experience the art of yoga and mediatation at AYM in India",
    headingStyle: "script" as const,
    text: `AYM Yoga School is a professional yoga and meditation school located in Rishikesh and Goa. Our area of expertise is to provide high-quality yoga teacher training and yoga retreat service to anyone willing to enjoy the benefits of yoga in India. Enjoy Mantras, Pranayama, yoga prayer with our yoga teachers. Our outstanding achievements are widely recognized by students and professors all over the world. And if you live in India or plan to visit, we also provide our facilities and training courses there.`,
  },
  {
    id: 3,
    imageLeft: true,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop",
    imageAlt: "Best yoga meditation centre India",
    heading: "Best yoga and mediation centre in India",
    headingStyle: "serif" as const,
    text: `India is part of the Asia region. Most of India forms a peninsula, which means that all three sides are surrounded by water. The Himalayas, located in the north, are the highest mountains in the world. India borders are the Bay of Bengal in the southeast region and the Arabian Sea in the southwest. In addition, India is also a country with rich history that could date back into early civilisation era. India is also the birthplace of yoga, its origins can be traced back to 5,000 years ago, the Indian-Saraswati civilization in northern India`,
  },
  {
    id: 4,
    imageLeft: false,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop",
    imageAlt: "Experience yoga and meditation at AYM India",
    heading: "Experience the art of yoga and mediatation at AYM in India",
    headingStyle: "script" as const,
    text: `India is a country that makes up most of South Asia. It has New Delhi as a capital that was built in the 20th century. The Indian government is a constitutional republic, representing a very diverse population of thousands of ethnic groups and hundreds of languages. India is about one-sixth of the world's population, second only to China. India is also a birthplace of yoga which could trace back into 5,000 years ago by Indus-Sarasvati civilization in Northern India`,
  },
  {
    id: 5,
    imageLeft: true,
    image: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop",
    imageAlt: "Top yoga meditation centre India",
    heading: "Top yoga and mediation centre in India",
    headingStyle: "serif" as const,
    text: `As one of India's best yoga and meditation centers, the goal of AYM Yoga School is to help you learn the correct yoga retreat to solve emotional pain and personal problems, we help you to open your seven chakras. And whether you want to become a yoga instructor or relax, we also offer qualified courses in Rishikesh and Goa.`,
  },
];

const cityLinks: { name: string; href: string }[] = [
  { name: "Jaipur", href: "/yoga-teacher-training/yoga-teacher-training-Jaipur" },
  { name: "Mysore", href: "/yoga-teacher-training/yoga-teacher-training-Mysore" },
  { name: "Haryana", href: "/yoga-teacher-training/yoga-teacher-training-Haryana" },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra" },
  { name: "Mumbai", href: "/yoga-teacher-training/yoga-teacher-training-Mumbai" },
  { name: "Coimbatore", href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore" },
  { name: "Uttrakhand", href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand" },
  { name: "Varkala", href: "/yoga-teacher-training/yoga-teacher-training-Varkala" },
  { name: "Gokarna", href: "/yoga-teacher-training/yoga-teacher-training-Gokarna" },
  { name: "Tamil Nadu", href: "/yoga-teacher-training/yoga-teacher-training-Tamil Nadu" },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi" },
  { name: "Munger", href: "/yoga-teacher-training/yoga-teacher-training-Munger" },
  { name: "Dharamshala", href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala" },
  { name: "Lonavala", href: "/yoga-teacher-training/yoga-teacher-training-Lonavala" },
  { name: "New Delhi", href: "/yoga-teacher-training/yoga-teacher-training-New Delhi" },
  { name: "Kerala", href: "/yoga-teacher-training/yoga-teacher-training-Kerala" },
  { name: "Puducherry", href: "/yoga-teacher-training/yoga-teacher-training-Puducherry" },
  { name: "Pushkar", href: "/yoga-teacher-training/yoga-teacher-training-Pushkar" },
  { name: "Sikkim", href: "/yoga-teacher-training/yoga-teacher-training-Sikkim" },
  { name: "Gurugram", href: "/yoga-teacher-training/yoga-teacher-training-Gurugram" },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune" },
  { name: "Chennai", href: "/yoga-teacher-training/yoga-teacher-training-Chennai" },
  { name: "Varanasi", href: "/yoga-teacher-training/yoga-teacher-training-Varanasi" },
  { name: "Maharashtra", href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra" },
  { name: "Arambol", href: "/yoga-teacher-training/yoga-teacher-training-Arambol" },
  { name: "Thiruvananthapuram", href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram" },
  { name: "Kolkata", href: "/yoga-teacher-training/yoga-teacher-training-Kolkata" },
  { name: "Rishikesh", href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh" },
  { name: "Himachal Pradesh", href: "/yoga-teacher-training/yoga-teacher-training-Himachal Pradesh" },
  { name: "Himachal Pradesh", href: "/yoga-teacher-training/yoga-teacher-training-Himachal Pradesh" },
  { name: "Bengaluru", href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru" },
  { name: "Auroville", href: "/yoga-teacher-training/yoga-teacher-training-Auroville" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTraining: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.topBorder} />

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
              section.imageLeft ? styles.sectionImageLeft : styles.sectionImageRight
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
      <div className={styles.topBorder} />
    </div>
  );
};

export default YogaTraining;