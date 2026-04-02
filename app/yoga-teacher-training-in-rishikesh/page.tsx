"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/yoga-teacher-training-in-rishikesh/Bestyogaschool.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface AccredBadge {
  id: string;
  label: string;
  badge: string;
  imgUrl: string;
}

interface CourseCard {
  id: string;
  title: string;
  description: string;
  duration: string;
  certificate: string;
  detailsLabel: string;
  detailsHref: string;
  bookHref: string;
  imgAlt: string;
  imgUrl: string;
  reverse: boolean;
}

interface InlineLink {
  id: string;
  text: string;
  href: string;
}

interface PageData {
  _id: string;
  status: string;
  heroTitle: string;
  heroImage: string;
  accrSectionTitle: string;
  coursesSectionTitle: string;
  specialtySectionTitle: string;
  bodyParagraphs1: string[];
  bodyParagraphs2: string[];
  accredBadges: AccredBadge[];
  courseCards: CourseCard[];
  specialtyCourses: CourseCard[];
  inlineLinks: InlineLink[];
  inlineLinks2: InlineLink[];
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function imgSrc(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

/* ─────────────────────────────────────────
   INLINE SVG MANDALA
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  c1 = "#e07b00",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) => (
  <svg
    viewBox="0 0 300 300"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g fill="none" stroke={c1} strokeWidth={sw}>
      {[145, 125, 106, 88, 70, 52, 36, 22, 10].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.65} opacity="0.45">
      {(
        [
          [150, 5, 150, 295],
          [5, 150, 295, 150],
          [47, 47, 253, 253],
          [253, 47, 47, 253],
          [10, 100, 290, 200],
          [10, 200, 290, 100],
          [100, 10, 200, 290],
          [200, 10, 100, 290],
        ] as number[][]
      ).map((d, i) => (
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
      ))}
    </g>
    <g fill="none" stroke={c2} strokeWidth={sw * 0.55} opacity="0.22">
      <ellipse cx="150" cy="150" rx="145" ry="60" />
      <ellipse cx="150" cy="150" rx="60" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="95" />
      <ellipse cx="150" cy="150" rx="95" ry="145" />
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.18">
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={150 + 148 * Math.cos(r)}
            y1={150 + 148 * Math.sin(r)}
            x2={150 - 148 * Math.cos(r)}
            y2={150 - 148 * Math.sin(r)}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.6" />
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.omDiv}>
    <span className={styles.omLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   CERTIFICATE CARD
───────────────────────────────────────── */
const CertCard = ({ label, badge, imgUrl }: AccredBadge) => (
  <div className={styles.certCard}>
    <div className={styles.certImgWrap}>
      <img
        src={imgSrc(imgUrl)}
        alt={label}
        className={styles.certImg}
        loading="lazy"
      />
    </div>
    <div className={styles.certBadge}>{badge}</div>
    <p className={styles.certLabel}>{label}</p>
  </div>
);

/* ─────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────── */
const CourseCardComp = ({
  title,
  description,
  duration,
  certificate,
  detailsLabel,
  detailsHref = "#",
  bookHref = "#",
  imgUrl,
  imgAlt,
  reverse = false,
}: CourseCard) => (
  <div
    className={`${styles.courseCard} ${reverse ? styles.courseCardRev : ""}`}
  >
    <div className={styles.courseImgWrap}>
      <img
        src={imgSrc(imgUrl)}
        alt={imgAlt}
        className={styles.courseImg}
        loading="lazy"
      />
      <div className={styles.courseImgOverlay} />
    </div>
    <div className={styles.courseBody}>
      <h3 className={styles.courseTitle}>{title}</h3>
      <div className={styles.courseTitleLine} />
      <p className={styles.bodyPara}>{description}</p>
      <div className={styles.courseMeta}>
        <p className={styles.metaRow}>
          <strong className={styles.metaLabel}>Duration:</strong> {duration}
        </p>
        <p className={styles.metaRow}>
          <strong className={styles.metaLabel}>Certificate:</strong>{" "}
          {certificate}
        </p>
      </div>
      <div className={styles.courseBtns}>
        <a href={detailsHref} className={styles.btnOrange}>
          {detailsLabel}
        </a>
        <a href={bookHref} className={styles.btnOutline}>
          Book Now
        </a>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
const PageSkeleton = () => (
  <div
    className={styles.page}
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ textAlign: "center", color: "#b87333", fontSize: "1.5rem" }}>
      🕉️ Loading...
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════ */
export default function BestYogaSchool() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get("/best-yoga-school/get");
        if (res?.success && res?.data) {
          setData(res.data);
        } else {
          setError("Content not available.");
        }
      } catch {
        setError("Failed to load page content.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;
  if (error || !data) {
    return (
      <div
        className={styles.page}
        style={{ padding: "4rem", textAlign: "center", color: "#c00" }}
      >
        {error || "Something went wrong."}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Mandala Decorations ── */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={400} c1="#e07b00" c2="#d4a017" sw={0.44} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={360} c1="#d4a017" c2="#e07b00" sw={0.44} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={210} c1="#e07b00" c2="#d4a017" sw={0.58} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={210} c1="#d4a017" c2="#e07b00" sw={0.58} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO IMAGE ══ */}
      {data.heroImage && (
        <section className={styles.heroSection}>
          <img
            src={imgSrc(data.heroImage)}
            alt={data.heroTitle || "Yoga Students Group"}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 1 — INTRO + ACCREDITATIONS
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Hero Title */}
          {data.heroTitle && (
            <h1 className={styles.heroTitle}>{data.heroTitle}</h1>
          )}
          <OmDivider />

          {/* Body Paragraphs 1 */}
          {data.bodyParagraphs1?.length > 0 && (
            <div className={styles.bodyText}>
              {data.bodyParagraphs1.map((para, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </div>
          )}

          {/* Inline Links 1 */}
          {data.inlineLinks?.length > 0 && (
            <p className={styles.bodyPara}>
              {data.inlineLinks.map((link, i) => (
                <React.Fragment key={link.id}>
                  <a href={link.href} className={styles.inlineLink}>
                    {link.text}
                  </a>
                  {i < data.inlineLinks.length - 1 && ", "}
                </React.Fragment>
              ))}
              .
            </p>
          )}

          {/* Accreditations */}
          {data.accrSectionTitle && (
            <div className={styles.accrSection}>
              <h2 className={styles.accrTitle}>{data.accrSectionTitle}</h2>
              <div className={styles.accrUnderline} />

              {data.accredBadges?.length > 0 && (
                <div className={styles.certGrid}>
                  {data.accredBadges.map((badge) => (
                    <CertCard key={badge.id} {...badge} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Body Paragraphs 2 */}
          {data.bodyParagraphs2?.length > 0 && (
            <div className={styles.bodyText}>
              {data.bodyParagraphs2.map((para, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </div>
          )}

          {/* Inline Links 2 */}
          {data.inlineLinks2?.length > 0 && (
            <p className={styles.bodyPara}>
              {data.inlineLinks2.map((link, i) => (
                <React.Fragment key={link.id}>
                  <a href={link.href} className={styles.inlineLink}>
                    {link.text}
                  </a>
                  {i < data.inlineLinks2.length - 1 && ", "}
                </React.Fragment>
              ))}
              .
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — COURSE CARDS
      ══════════════════════════════════════ */}
      {data.courseCards?.length > 0 && (
        <section className={`${styles.section} ${styles.sectionWarm}`}>
          <div className="container px-3 px-md-4">
            {data.coursesSectionTitle && (
              <h2 className={styles.sectionTitleCenter}>
                {data.coursesSectionTitle}
              </h2>
            )}
            <OmDivider />

            {data.courseCards.map((course) => (
              <CourseCardComp key={course.id} {...course} />
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 3 — SPECIALTY COURSES
      ══════════════════════════════════════ */}
      {data.specialtyCourses?.length > 0 && (
        <section className={`${styles.section} ${styles.sectionDeep}`}>
          <div className="container px-3 px-md-4">
            {data.specialtySectionTitle && (
              <h2 className={styles.sectionTitleCenter}>
                {data.specialtySectionTitle}
              </h2>
            )}
            <OmDivider />

            {data.specialtyCourses.map((course) => (
              <CourseCardComp key={course.id} {...course} />
            ))}
          </div>
        </section>
      )}

      <HowToReach />
    </div>
  );
}
