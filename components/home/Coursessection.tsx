"use client";
import React, { useState, useEffect } from "react";
import styles from "../../assets/style/Home/Coursessection.module.css";
import api from "@/lib/api";
import Link from "next/link";

interface CourseLink {
  label: string;
  href: string;
}

interface Course {
  _id: string;
  image: string;
  imageAlt: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  links: CourseLink[];
  enrollHref: string;
  exploreLabel: string;
  exploreHref: string;
  priceINR: string;
  priceUSD: string;
  totalSeats: number;
  availableSeats: number;
  order: number;
}

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses-section");
        setCourses(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.topBorder} />
        <div className={styles.container}>
          <div className={styles.courseList}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: "320px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(90deg, #fdf0dc 25%, #ffe8c2 50%, #fdf0dc 75%)",
                  marginBottom: "2rem",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>
    );
  }

  if (!courses.length) return null;

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
          {courses.map((course, idx) => {
            const filled = course.totalSeats - course.availableSeats;
            const pct =
              course.totalSeats > 0 ? (filled / course.totalSeats) * 100 : 0;

            return (
              <article
                key={course._id}
                className={`${styles.courseCard} ${idx % 2 === 1 ? styles.cardAlt : ""}`}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  <img
                    src={getImageUrl(course.image)}
                    alt={course.imageAlt || course.title}
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

                {/* Content */}
                <div className={styles.content}>
                  <div className={styles.titleBlock}>
                    <h3 className={styles.courseTitle}>{course.title}</h3>
                    <div className={styles.titleUnderline} />
                    <p className={styles.courseMeta}>
                      <span className={styles.metaLabel}>Duration:</span>{" "}
                      <span className={styles.metaValue}>
                        {course.duration}
                      </span>
                      <span className={styles.metaSep}>|</span>
                      <span className={styles.metaLabel}>Level:</span>{" "}
                      <span className={styles.metaValue}>{course.level}</span>
                    </p>
                  </div>

                  {/* ✅ HTML description from Jodit editor */}
                  <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />

                  <ul className={styles.linkList}>
                    {course.links.map((link, i) => (
                      <li key={i} className={styles.linkItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <Link href={link.href} className={styles.courseLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Column */}
                <div className={styles.ctaColumn}>
                  {/* Price */}
                  <div className={styles.priceBlock}>
                    <span className={styles.priceINR}>{course.priceINR}</span>
                    <span className={styles.priceUSD}>{course.priceUSD}</span>
                  </div>

                  {/* Seats */}
                  <div className={styles.seatsBlock}>
                    <div className={styles.seatsRow}>
                      <span className={styles.seatsLabel}>Total Seats</span>
                      <span className={styles.seatsValue}>
                        {course.totalSeats}
                      </span>
                    </div>
                    <div className={styles.seatsRow}>
                      <span className={styles.seatsLabel}>Seats Left</span>
                      <span
                        className={`${styles.seatsValue} ${
                          course.availableSeats <= 5 ? styles.seatsUrgent : ""
                        }`}
                      >
                        {course.availableSeats}
                      </span>
                    </div>
                    <div className={styles.seatsBar}>
                      <div
                        className={styles.seatsBarFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className={styles.ctaDivider} />

                  <Link href={course.enrollHref} className={styles.btnEnroll}>
                    Enroll Now
                  </Link>
                  <Link href={course.exploreHref} className={styles.btnExplore}>
                    {course.exploreLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default CoursesSection;
