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
    imageAlt: "Best Yoga Teacher Training in Mysore India",
    heading: "Best Yoga Teacher Training in Mysore India",
    headingStyle: "script" as const,
    text: `If you know the benefits of yoga and how it can impact one's life, taking up yoga teacher training in Mysore is a great option to spread your knowledge to others. People embracing this old practice may want to share their experiences and assist others in their inner development. At AYM, we offer exclusive programmes in Rishikesh since 2005.

Through our comprehensive course, we aim to help individuals gain a solid grasp of yoga so that they can instruct with assurance and effectiveness. As the provider of the top YTT course in Mysore, we introduce our students to yoga's roots, from its history, styles and traditions to where it stands today.

Besides focusing on mindfulness and meditation techniques, students are introduced to new research, strategies, ideologies and much more in our institute in Rishikesh. Students get a chance to be a part of a welcoming atmosphere and get complete assistance as they enrol in our 200 hour yoga teacher training in Mysore.`,
  },
  {
    id: 2,
    imageLeft: false,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=700&q=80&fit=crop",
    imageAlt: "Yoga Teacher Training in Mysore",
    heading: "Yoga Teacher Training in Mysore",
    headingStyle: "serif" as const,
    text: `Our goal at AYM is to use the science of yoga by preserving the core teachings while modernizing their ancient knowledge simultaneously. Through yoga, students can discover their nature and inner abilities. As the top 300 hour yoga teacher training in Mysore India, we offer transformative experiences that impact life in many ways.

Our extensive curriculum covers every detail of yoga, including anatomy, physiology, alignment and more. You would discover prevalent injuries along with tips for preventing them. We concentrate on the subtle facets beyond asanas and aim to improve the practice. Each 500 hour yoga teacher training course in Mysore has unique goals and aims. In the comfortable environment of Rishikesh, our teachers promote self-awareness. We create an encouraging atmosphere where students can confidently graduate and become professionals.`,
  },
  {
    id: 3,
    imageLeft: true,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80&fit=crop",
    imageAlt: "Features of Yoga Teacher Training Course in Mysore",
    heading: "Features of Yoga Teacher Training Course in Mysore",
    headingStyle: "serif" as const,
    textList: [
      "Our yoga teacher training course in Mysore is conducted in a spacious and peaceful ambience.",
      "Students are allowed to spend time with like-minded individuals and experienced professionals.",
      "Lodging is offered in a secure, comfortable space where lifestyle is not compromised.",
      "Theoretical and practical classes are conducted besides regular tests and assessments.",
      "We provide all the study materials to make learning easier. Also, access to pre-recorded videos, live sessions, notes and more are provided.",
      "Students are offered basic amenities like hot water, wifi, dietary meals, and more.",
      "Student's progress is recorded and rectified in a non-competitive and non-judgemental atmosphere.",
      "We offer classes six days a week with one day off during the yoga TTC in Mysore.",
      "Students are allowed to participate in excursions and seminars where their knowledge is broadened.",
      "Valuable certification is provided at the end of the courses, making the students' learning evident.",
    ],
  },
  {
    id: 4,
    imageLeft: false,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80&fit=crop",
    imageAlt:
      "200 Hour and 300 Hour Yoga Teacher Training Course in Mysore India",
    heading: "200 Hour Yoga Teacher Training Course in Mysore India",
    headingStyle: "serif" as const,
    subSections: [
      {
        heading: "200 Hour Yoga Teacher Training Course in Mysore India",
        text: `Our 200 hour yoga teacher training in Mysore is a thorough course programme that includes the basics of yoga. It expands its principles, from covering the fundamentals to enlightening the students on meditation, breathing techniques, and more. The skilled and informed instructors at AYM in Rishikesh would help me better understand yoga philosophy. Once the ytt course in Mysore is completed, the students will achieve thorough beginner-level expertise through confidence.`,
      },
      {
        heading: "300 Hour Yoga Teacher Training Course in Mysore",
        text: `At AYM in Rishikesh, our 300 hour YTT in Mysore is designed for students who aspire to become professionals or deepen their knowledge. Through this course program, students would be introduced to topics like Ayurveda, Sanskrit, Mantras, Vedic Texts and more.

Simply put, the updated 300 hour yoga teacher training course in Mysore has been designed to provide a deeper insight. With knowledgeable and committed instructors in the team, we focus on increasing abilities and discovering inner strength while instilling confidence.`,
      },
    ],
  },
  {
    id: 5,
    imageLeft: true,
    image:
      "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=700&q=80&fit=crop",
    imageAlt: "Recognized Yoga Teacher Training Course Certification in Mysore",
    heading: "Recognized Yoga Teacher Training Course Certification in Mysore",
    headingStyle: "serif" as const,
    text: `Regardless of the course program they choose, students enrolling at AYM in Rishikesh are handed over Recognized Yoga Teacher Training courses in Mysore. These certifications hold great value and are accredited, besides meeting the standards of the Yoga Alliances. Once students complete the courses and showcase their expertise and ability towards this practice, they are handed the certificates. Our students can use these yoga TTC certificates in Mysore anywhere in the world to start their journey. Students can begin their yoga studio and teach in reputed yoga institutions worldwide.`,
  },
];

const cityLinks: { name: string; href: string }[] = [
  {
    name: "Jaipur",
    href: "/yoga-teacher-training/yoga-teacher-training-Jaipur",
  },
  {
    name: "Mysore",
    href: "/yoga-teacher-training/yoga-teacher-training-Mysore",
  },
  {
    name: "Haryana",
    href: "/yoga-teacher-training/yoga-teacher-training-Haryana",
  },
  { name: "Agra", href: "/yoga-teacher-training/yoga-teacher-training-Agra" },
  {
    name: "Mumbai",
    href: "/yoga-teacher-training/yoga-teacher-training-Mumbai",
  },
  {
    name: "Coimbatore",
    href: "/yoga-teacher-training/yoga-teacher-training-Coimbatore",
  },
  {
    name: "Uttrakhand",
    href: "/yoga-teacher-training/yoga-teacher-training-Uttrakhand",
  },
  {
    name: "Varkala",
    href: "/yoga-teacher-training/yoga-teacher-training-Varkala",
  },
  {
    name: "Gokarna",
    href: "/yoga-teacher-training/yoga-teacher-training-Gokarna",
  },
  {
    name: "Tamil Nadu",
    href: "/yoga-teacher-training/yoga-teacher-training-Tamil Nadu",
  },
  { name: "Goa", href: "/yoga-teacher-training/yoga-teacher-training-Goa" },
  { name: "Kochi", href: "/yoga-teacher-training/yoga-teacher-training-Kochi" },
  {
    name: "Munger",
    href: "/yoga-teacher-training/yoga-teacher-training-Munger",
  },
  {
    name: "Dharamshala",
    href: "/yoga-teacher-training/yoga-teacher-training-Dharamshala",
  },
  {
    name: "Lonavala",
    href: "/yoga-teacher-training/yoga-teacher-training-Lonavala",
  },
  {
    name: "New Delhi",
    href: "/yoga-teacher-training/yoga-teacher-training-New Delhi",
  },
  {
    name: "Kerala",
    href: "/yoga-teacher-training/yoga-teacher-training-Kerala",
  },
  {
    name: "Puducherry",
    href: "/yoga-teacher-training/yoga-teacher-training-Puducherry",
  },
  {
    name: "Pushkar",
    href: "/yoga-teacher-training/yoga-teacher-training-Pushkar",
  },
  {
    name: "Sikkim",
    href: "/yoga-teacher-training/yoga-teacher-training-Sikkim",
  },
  {
    name: "Gurugram",
    href: "/yoga-teacher-training/yoga-teacher-training-Gurugram",
  },
  { name: "Pune", href: "/yoga-teacher-training/yoga-teacher-training-Pune" },
  {
    name: "Chennai",
    href: "/yoga-teacher-training/yoga-teacher-training-Chennai",
  },
  {
    name: "Varanasi",
    href: "/yoga-teacher-training/yoga-teacher-training-Varanasi",
  },
  {
    name: "Maharashtra",
    href: "/yoga-teacher-training/yoga-teacher-training-Maharashtra",
  },
  {
    name: "Arambol",
    href: "/yoga-teacher-training/yoga-teacher-training-Arambol",
  },
  {
    name: "Thiruvananthapuram",
    href: "/yoga-teacher-training/yoga-teacher-training-Thiruvananthapuram",
  },
  {
    name: "Kolkata",
    href: "/yoga-teacher-training/yoga-teacher-training-Kolkata",
  },
  {
    name: "Rishikesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Rishikesh",
  },
  {
    name: "Himachal Pradesh",
    href: "/yoga-teacher-training/yoga-teacher-training-Himachal Pradesh",
  },
  {
    name: "Bengaluru",
    href: "/yoga-teacher-training/yoga-teacher-training-Bengaluru",
  },
  {
    name: "Auroville",
    href: "/yoga-teacher-training/yoga-teacher-training-Auroville",
  },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const YogaTrainingMysore: React.FC = () => {
  return (
    <div className={styles.page}>
      {/* Top border */}
      <div className={styles.a} />

      <div className={styles.container}>
        {/* ── PAGE TITLE ── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            Yoga Teacher Training in Mysore India
          </h1>
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

              {/* Sub-sections (section 4: 200hr + 300hr) */}
              {"subSections" in section && section.subSections ? (
                section.subSections.map((sub, idx) => (
                  <div key={idx} style={{ marginBottom: "1.2rem" }}>
                    {idx > 0 && (
                      <h3
                        className={styles.headingSerif}
                        style={{ marginTop: "1rem" }}
                      >
                        {sub.heading}
                      </h3>
                    )}
                    <p className={styles.bodyText}>{sub.text}</p>
                  </div>
                ))
              ) : "textList" in section && section.textList ? (
                /* Bullet list (section 3: features) */
                <ul
                  className={styles.bodyText}
                  style={{ paddingLeft: "1.2rem", margin: 0 }}
                >
                  {section.textList.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "0.4rem" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                /* Regular paragraph */
                <p className={styles.bodyText}>{(section as any).text}</p>
              )}
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

export default YogaTrainingMysore;
