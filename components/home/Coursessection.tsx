"use client";
import React from "react";
import styles from "../../assets/style/Home/Coursessection.module.css";

interface CourseLink {
  label: string;
  href: string;
}

interface Course {
  id: number;
  image: string;
  imageAlt: string;
  title: string;
  duration: string;
  level: string;
  description: React.ReactNode;
  links: CourseLink[];
  enrollHref: string;
  exploreLabel: string;
  exploreHref: string;
}

const courses: Course[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
    imageAlt: "Yoga Retreat in Rishikesh",
    title: "Yoga Retreat in Rishikesh, India",
    duration: "3, 7 Days",
    level: "Beginner",
    description: (
      <>
        Rishikesh is a well-known destination for yoga Retreats and spiritual
        wellbeing. There are various yoga retreats that combine sound healing,
        Ayurveda, Reiki, or trekking. At AYM Yoga School in Rishikesh, we have a
        large no of such Retreats, a few of which are listed below.
      </>
    ),
    links: [
      { label: "3, 7 and 10 days yoga Retreats in rishikesh.", href: "#" },
      {
        label: "3, 7 and 10 days yoga ayurveda Retreats in rishikesh.",
        href: "#",
      },
      {
        label: "3 and 5 days sound / reiki healing retreats in india.",
        href: "#",
      },
    ],
    enrollHref: "#",
    exploreLabel: "Explore Our Retreats",
    exploreHref: "#",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=600&q=80",
    imageAlt: "100 Hour Yoga Courses in Rishikesh",
    title: "100 Hour Yoga Courses in Rishikesh",
    duration: "12 Days",
    level: "Beginner",
    description: (
      <>
        These are the shortest yoga teacher training courses, mostly available
        at top yoga teacher training schools in Rishikesh, India. It is mostly
        suitable for those who can not find time for 200-hour courses and want
        to become a yoga teacher. They come twice for{" "}
        <a href="#" className={styles.inlineLink}>
          100-hour yoga courses
        </a>{" "}
        and then complete a 200-hour course.
      </>
    ),
    links: [
      { label: "100 hr yoga course in rishikesh", href: "#" },
      { label: "85 hours prenatal yoga course in india", href: "#" },
      { label: "85 hrs Aerial yoga course in india", href: "#" },
    ],
    enrollHref: "#",
    exploreLabel: "Explore 100 Hour TTC",
    exploreHref: "#",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1588286840104-8957b019727f?auto=format&fit=crop&w=600&q=80",
    imageAlt: "200 Hour Yoga Teacher Training Rishikesh",
    title: "200 Hour Yoga Teacher Training Rishikesh",
    duration: "24 Days",
    level: "Beginner / Foundation",
    description: (
      <>
        These are the most common and popular{" "}
        <a href="#" className={styles.inlineLink}>
          200-hour yoga courses in Rishikesh, India
        </a>
        . All schools are full of students doing this course. This course
        provides comprehensive information and practical training on all aspects
        of yoga. After completing this course, an individual's yoga and
        spirituality pursuits are either satisfied or ignited, depending on the
        individual. The list of 200-hour yoga teacher training courses in
        Rishikesh, India, at Aym Yoga Ashram is
      </>
    ),
    links: [
      { label: "200 Hour Mutli-style Yoga Teacher Training India.", href: "#" },
      { label: "200 Hr Hatha Yoga Teacher Training Rishikesh.", href: "#" },
      {
        label: "200 Hours Ashtanga Yoga Teacher Training Rishikesh.",
        href: "#",
      },
    ],
    enrollHref: "#",
    exploreLabel: "Explore 200 Hour TTC",
    exploreHref: "#",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80",
    imageAlt: "300 Hour Yoga Teacher Training Rishikesh",
    title: "300 Hour Yoga Teacher Training Rishikesh",
    duration: "28 Days",
    level: "Intermediate",
    description: (
      <>
        The 300-hour yoga teacher training in Rishikesh is designed for those
        who have already completed a{" "}
        <a href="#" className={styles.inlineLink}>
          200-hour yoga TTC
        </a>{" "}
        and wish to deepen their practice and teaching skills. This advanced
        program covers refined asana techniques, advanced pranayama, yoga
        philosophy, and specialized teaching methodology.
      </>
    ),
    links: [
      { label: "300 Hour Hatha Yoga Teacher Training India.", href: "#" },
      { label: "300 Hr Ashtanga Yoga Teacher Training Rishikesh.", href: "#" },
      { label: "300 Hours Yin Yoga Teacher Training India.", href: "#" },
    ],
    enrollHref: "#",
    exploreLabel: "Explore 300 Hour TTC",
    exploreHref: "#",
  },
];

export const CoursesSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.topBorder} />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.superTitle}>
            Authentic Yoga Education Since 2005
          </p>
          <h2 className={styles.mainTitle}>
            Explore Our Yoga Teacher Training Courses &amp; Retreats
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>
        <div className={styles.courseList}>
          {courses.map((course, idx) => (
            <article
              key={course.id}
              className={`${styles.courseCard} ${idx % 2 === 1 ? styles.cardAlt : ""}`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={course.image}
                  alt={course.imageAlt}
                  className={styles.courseImage}
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.style.background =
                      "linear-gradient(135deg, #fdf0dc 0%, #ffe8c2 100%)";
                  }}
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.content}>
                <div className={styles.titleBlock}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <div className={styles.titleUnderline} />
                  <p className={styles.courseMeta}>
                    <span className={styles.metaLabel}>Duration:</span>{" "}
                    <span className={styles.metaValue}>{course.duration}</span>
                    <span className={styles.metaSep}>|</span>
                    <span className={styles.metaLabel}>Level:</span>{" "}
                    <span className={styles.metaValue}>{course.level}</span>
                  </p>
                </div>
                <p className={styles.description}>{course.description}</p>
                <ul className={styles.linkList}>
                  {course.links.map((link) => (
                    <li key={link.label} className={styles.linkItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <a href={link.href} className={styles.courseLink}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.ctaColumn}>
                <a href={course.enrollHref} className={styles.btnEnroll}>
                  Enroll Now
                </a>
                <a href={course.exploreHref} className={styles.btnExplore}>
                  {course.exploreLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default CoursesSection;
