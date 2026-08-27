// YogaAshrams.tsx
"use client";

import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-ashrams-in-india/Yogaashrams.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import api from "@/lib/api";

/* ─────────────────────── Types (mirrors backend model) ─────────────────────── */
interface StatItem {
  num: string;
  label: string;
}
interface TimelineItem {
  icon: string;
  title: string;
  text: string;
}
interface CoursePill {
  title: string;
  link: string;
}
interface IconLabelItem {
  icon: string;
  label: string;
}
interface WhyCard {
  num: string;
  label: string;
  title: string;
  desc: string;
}
interface ActivityItem {
  icon: string;
  text: string;
}
interface CourseLink {
  title: string;
  link: string;
}

interface AshramData {
  _id: string;

  heroImage?: string;
  heroImageAlt: string;

  mainTitle: string;

  featureImage?: string;
  featureImageAlt: string;
  quoteText: string;

  welcomeStats: StatItem[];
  welcomeParagraphs: string[];

  experienceTitle: string;
  experienceParagraphs: string[];
  timelineItems: TimelineItem[];

  bestSectionLabel: string;
  bestSectionTitle: string;
  aboutCardTitle: string;
  aboutCardText: string;
  certBadges: string[];
  coursesCardTitle: string;
  coursesCardText: string;
  coursePills: CoursePill[];

  ashramPhoto?: string;
  ashramPhotoAlt: string;
  photoCaptionTitle: string;
  photoCaptionSub: string;

  whatSectionLabel: string;
  whatSectionTitle: string;
  whatIcons: IconLabelItem[];
  whatParagraphs: string[];
  pullquote: string;
  whatExtraParagraph: string;

  whySectionLabel: string;
  whySectionTitle: string;
  whySectionLink: string;
  whyParagraphs: string[];
  whyCards: WhyCard[];

  actSectionLabel: string;
  actSectionTitle: string;
  actIntroText: string;
  activities: ActivityItem[];
  actBottomText: string;
  coursesHeading: string;
  coursesList: CourseLink[];
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

// ---- Om Symbol SVG (decorative, not content) ----
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="#e8600a" strokeWidth="2" fill="none" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="28"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

// ===================== MAIN COMPONENT =====================
const YogaAshrams: React.FC = () => {
  const [data, setData] = useState<AshramData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/yoga-ashram-section");
        const doc = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setData(doc ?? null);
      } catch (err) {
        setError("Failed to load page content");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>Loading…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.pageWrapper}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          {error || "Content not available yet."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.heroSection}>
        {data.heroImage && (
          <img
            src={getImageUrl(data.heroImage)}
            alt={data.heroImageAlt}
            className={styles.heroImage}
          />
        )}
      </section>

      {/* ===== TITLE SECTION ===== */}
      <section className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>{data.mainTitle}</h1>
        </div>
      </section>

      {/* ===== FEATURE IMAGE ===== */}
      <section className={styles.featureSection}>
        <div className={styles.featureContainer}>
          <div className={styles.featureImageBox} style={{ position: "relative" }}>
            {data.featureImage && (
              <img
                src={getImageUrl(data.featureImage)}
                alt={data.featureImageAlt}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <div className={styles.featureQuote}>
              <span className={styles.quoteMark}>&quot;</span>
              <p>{data.quoteText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WELCOME SECTION ===== */}
      <section className={styles.welcomeSection}>
        <div className={styles.welcomeGrid}>
          <div className={styles.welcomeStats}>
            {data.welcomeStats.map((stat, i) => (
              <div className={styles.statItem} key={i}>
                <span className={styles.statNumber}>{stat.num}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.welcomeContent}>
            {data.welcomeParagraphs.map((p, i) => (
              <p
                key={i}
                className={styles.welcomeText}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE SECTION ===== */}
      <section className={styles.experienceSection}>
        <div className={styles.experienceHeader}>
          <h2 className={styles.experienceTitle}>{data.experienceTitle}</h2>
        </div>

        {data.experienceParagraphs.map((p, i) => (
          <p
            key={i}
            className={`${styles.experienceBody} container`}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <div className={styles.timelineGrid}>
          {data.timelineItems.map((item, i) => (
            <div className={styles.timelineItem} key={i}>
              <div className={styles.timelineIcon}>{item.icon}</div>
              <div className={styles.timelineContent}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BEST HOME FOR YOGA ===== */}
      <section className={styles.bestSection}>
        <p className={styles.sectionLabel}>{data.bestSectionLabel}</p>
        <h2 className={styles.sectionTitle}>{data.bestSectionTitle}</h2>
        <div className={styles.bestGrid}>
          <div className={styles.highlightCard}>
            <h3 className={styles.highlightCardTitle}>{data.aboutCardTitle}</h3>
            <p className={styles.bodyText}>{data.aboutCardText}</p>
            <div className={styles.certBadges}>
              {data.certBadges.map((badge, i) => (
                <span className={styles.badge} key={i}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.highlightCard}>
            <h3 className={styles.highlightCardTitle}>{data.coursesCardTitle}</h3>
            <p className={styles.bodyText}>{data.coursesCardText}</p>
            <div className={styles.coursePills}>
              {data.coursePills.map((pill, i) => (
                <Link href={pill.link} className={styles.pillLink} key={i}>
                  {pill.title} <span className={styles.pillArrow}>›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM ASHRAM PHOTO ===== */}
      <section className={styles.photoSection}>
        <div className={styles.photoFrame}>
          <div className={styles.ashramImageBox} style={{ position: "relative" }}>
            {data.ashramPhoto && (
              <img
                src={getImageUrl(data.ashramPhoto)}
                alt={data.ashramPhotoAlt}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <div className={styles.photoCaptionBar}>
              <p className={styles.photoCaptionTitle}>{data.photoCaptionTitle}</p>
              <span className={styles.photoCaptionSub}>{data.photoCaptionSub}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT IS AN ASHRAM ===== */}
      <section className={styles.whatSection}>
        <p className={styles.sectionLabel}>{data.whatSectionLabel}</p>
        <h2 className={styles.sectionTitle}>{data.whatSectionTitle}</h2>
        <div className={styles.whatInner}>
          <div className={styles.whatVisual}>
            {data.whatIcons.map((item, i) => (
              <div key={i} className={styles.whatIconBlock}>
                <span className={styles.whatIcon}>{item.icon}</span>
                <span className={styles.whatIconLabel}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.whatText}>
            {data.whatParagraphs.map((p, i) => (
              <p
                key={i}
                className={styles.bodyText}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
            <blockquote className={styles.pullquote}>{data.pullquote}</blockquote>
            <p className={styles.bodyText}>{data.whatExtraParagraph}</p>
          </div>
        </div>
      </section>

      {/* ===== WHY IS AYM BEST ===== */}
      <section className={styles.whySection}>
        <div className={styles.whyInner}>
          <p className={styles.sectionLabel}>{data.whySectionLabel}</p>
          <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>
            <Link href={data.whySectionLink}>{data.whySectionTitle}</Link>
          </h2>

          {data.whyParagraphs.map((p, i) => (
            <p
              key={i}
              className={styles.whyBody}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>

        <div className={`${styles.whyGrid} container`}>
          {data.whyCards.map((card, i) => (
            <div key={i} className={styles.whyCard}>
              <p className={styles.whyCardNum}>
                {card.num} — {card.label}
              </p>
              <h3 className={styles.whyCardTitle}>{card.title}</h3>
              <p className={styles.whyCardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ACTIVITIES ===== */}
      <section className={styles.actSection}>
        <p className={styles.sectionLabel}>{data.actSectionLabel}</p>
        <h2 className={styles.sectionTitle}>{data.actSectionTitle}</h2>
        <p className={styles.bodyText}>{data.actIntroText}</p>

        <div className={styles.actGrid}>
          {data.activities.map((a, i) => (
            <div key={i} className={styles.actCard}>
              <span className={styles.actIcon}>{a.icon}</span>
              <p>{a.text}</p>
            </div>
          ))}
        </div>

        <p className={styles.bodyText}>{data.actBottomText}</p>

        <div className={styles.coursesBlock}>
          <p className={styles.coursesHeading}>{data.coursesHeading}</p>
          <ul className={styles.coursesList}>
            {data.coursesList.map((c, i) => (
              <li key={i}>
                <Link href={c.link}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HowToReach />
    </div>
  );
};

export default YogaAshrams;