"use client";
import React, { useState, useEffect } from "react";
import styles from "../../assets/style/Home/Coursessection.module.css";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

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

/* ══════════════════════════════
   CURRENCY RATE HOOK
══════════════════════════════ */
function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.usd?.inr) setRate(data.usd.inr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
}

const usdStringToNumber = (usd: string): number => {
  if (!usd) return 0;
  const num = parseFloat(usd.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
};

const formatINRFromUSD = (usd: string, rate: number): string => {
  const usdNum = usdStringToNumber(usd);
  if (!usdNum) return "";
  const inr = Math.round(usdNum * rate);
  return `₹${inr.toLocaleString("en-IN")}`;
};

/* ══════════════════════════════
   Props — server se initial data yahan aayega
══════════════════════════════ */
interface Props {
  initialCourses: Course[];
}

export const CoursesSectionClient: React.FC<Props> = ({ initialCourses }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const { rate } = useCurrencyRate();

  // Seats/availability real-time refresh — background mein chalta rahega
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses-section");
        setCourses(res.data.data ?? []);
      } catch (err) {
        console.error("Failed to refresh courses", err);
      }
    };
    const interval = setInterval(fetchCourses, 15000); // har 15 sec refresh
    return () => clearInterval(interval);
  }, []);

  if (!courses.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.a} />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.superTitle}>Authentic Yoga Education Since 2005</p>
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
            const pct = course.totalSeats > 0 ? (filled / course.totalSeats) * 100 : 0;
            const isFull = course.availableSeats <= 0;

            return (
              <article
                key={course._id}
                className={`${styles.courseCard} ${idx % 2 === 1 ? styles.cardAlt : ""}`}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={getImageUrl(course.image)}
                    alt={course.imageAlt || course.title}
                    className={styles.courseImage}
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1024px) 45vw, 280px"
                    style={{ objectFit: "cover" }}
                    loading={idx === 0 ? undefined : "lazy"}
                    priority={idx === 0}
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
                      <span className={styles.metaValue}>{course.duration}</span>
                      <span className={styles.metaSep}>|</span>
                      <span className={styles.metaLabel}>Level:</span>{" "}
                      <span className={styles.metaValue}>{course.level}</span>
                    </p>
                  </div>

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
                  <div className={styles.priceBlock}>
                    <span className={styles.priceINR}>{course.priceUSD}</span>
                    <span className={styles.priceUSD}>
                      {formatINRFromUSD(course.priceUSD, rate)}
                    </span>
                  </div>

                  <div className={styles.seatsBlock}>
                    <div className={styles.seatsRow}>
                      <span className={styles.seatsLabel}>Total Seats</span>
                      <span className={styles.seatsValue}>{course.totalSeats}</span>
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

                  {isFull ? (
                    <span className={`${styles.btnEnroll} ${styles.btnEnrollDisabled}`}>
                      Fully Booked
                    </span>
                  ) : (
                    <Link
                      href={{
                        pathname: "/yoga-registration",
                        query: { courseId: String(course._id) },
                      }}
                      className={styles.btnEnroll}
                    >
                      Enroll Now
                    </Link>
                  )}

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

export default CoursesSectionClient;