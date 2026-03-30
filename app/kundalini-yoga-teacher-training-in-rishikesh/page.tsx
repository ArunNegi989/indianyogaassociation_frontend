"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/kundalini-yoga-teacher-training-in-rishikesh/Kundaliniyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import api from "@/lib/api"; // your axios instance

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface SyllabusModule {
  id: string;
  title: string;
  items: string[];
}

interface HighlightCard {
  id: string;
  title: string;
  desc: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
}

interface WhyCard {
  id: string;
  label: string;
  desc: string;
}

interface KundaliniContent {
  _id: string;
  status: string;
  whatIsTitle: string;
  activateTitle: string;
  benefitsTitle: string;
  benefitsIntro1: string;
  benefitsIntro2: string;
  highlightsTitle: string;
  highlightsIntro: string;
  syllabusBigTitle: string;
  syllabusSchool: string;
  courseOverviewTitle: string;
  courseOverviewPara: string;
  readingBoxTitle: string;
  readingBoxNote: string;
  noteBoxTitle: string;
  noteBoxPara: string;
  eligibilityTitle: string;
  locationTitle: string;
  facilitiesTitle: string;
  facilitiesIntro: string;
  facilitiesIntroRich: string;
  scheduleSectionTitle: string;
  whyAYMTitle: string;
  whyRishikeshTitle: string;
  spiritualTitle: string;
  spiritualPara: string;
  naturalTitle: string;
  naturalPara: string;
  typesTitle: string;
  topSchoolsTitle: string;
  topSchoolsPara: string;
  refundTitle: string;
  whatIsParagraphs: string[];
  activateParagraphs: string[];
  eligibilityParagraphs: string[];
  locationParagraphs: string[];
  syllabusModules: SyllabusModule[];
  benefitItems: string[];
  highlightCards: HighlightCard[];
  readingItems: string[];
  facilityItems: string[];
  scheduleItems: ScheduleItem[];
  whyCards: WhyCard[];
  typesItems: string[];
  refundItems: string[];
  heroImage: string;
  classImage: string;
  schedImg1: string;
  schedImg2: string;
}

interface KundaliniSeat {
  _id: string;
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  twinPrice: number;
  privatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  note: string;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Prepend base URL only when path starts with /uploads/ */
const imgSrc = (path: string) =>
  path?.startsWith("/uploads/") ? `${BASE_URL}${path}` : path ?? "";

/** Format a Date string as "3rd Jan 2026" style */
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";
  return `${day}${suffix} ${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear()}`;
};

/* ─────────────────────────────────────────
   MANDALA SVG COMPONENT
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  color1 = "#e07b00",
  color2 = "#d4a017",
  strokeW = 0.5,
}: {
  size?: number;
  color1?: string;
  color2?: string;
  strokeW?: number;
}) => (
  <svg
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width={size}
    height={size}
  >
    <g fill="none" stroke={color1} strokeWidth={strokeW}>
      {[145, 125, 105, 88, 70, 52, 36, 22, 10].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} />
      ))}
    </g>
    <g fill="none" stroke={color2} strokeWidth={strokeW * 0.7} opacity="0.5">
      {[
        [150, 5, 150, 295],
        [5, 150, 295, 150],
        [47, 47, 253, 253],
        [253, 47, 47, 253],
        [10, 100, 290, 200],
        [10, 200, 290, 100],
        [100, 10, 200, 290],
        [200, 10, 100, 290],
      ].map((d, i) => (
        <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
      ))}
    </g>
    <g fill="none" stroke={color2} strokeWidth={strokeW * 0.6} opacity="0.28">
      <ellipse cx="150" cy="150" rx="145" ry="60" />
      <ellipse cx="150" cy="150" rx="60" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="90" />
      <ellipse cx="150" cy="150" rx="90" ry="145" />
    </g>
    <g fill="none" stroke={color1} strokeWidth={strokeW * 0.5} opacity="0.2">
      {[0, 30, 60, 90, 120, 150].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 150 + 148 * Math.cos(rad),
          y1 = 150 + 148 * Math.sin(rad);
        const x2 = 150 - 148 * Math.cos(rad),
          y2 = 150 - 148 * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
    <circle cx="150" cy="150" r="5" fill={color1} opacity="0.45" />
    <circle cx="150" cy="150" r="2.5" fill={color2} opacity="0.6" />
  </svg>
);

/* ─────────────────────────────────────────
   CHAKRA SYMBOL SVG
───────────────────────────────────────── */
const ChakraSVG = ({
  size = 48,
  color = "#e07b00",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="1.2" />
    <circle cx="50" cy="50" r="36" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="1" opacity="0.8" />
    <circle cx="50" cy="50" r="8" fill={color} opacity="0.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={50 + 22 * Math.cos(r)}
          y1={50 + 22 * Math.sin(r)}
          x2={50 + 44 * Math.cos(r)}
          y2={50 + 44 * Math.sin(r)}
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
      );
    })}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontSize="22"
      fill={color}
      fontFamily="serif"
      opacity="0.9"
    >
      ॐ
    </text>
  </svg>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDivider = ({ centered = true }: { centered?: boolean }) => (
  <div className={`${styles.omDiv} ${centered ? styles.omDivCenter : ""}`}>
    <span className={styles.omLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.omLine} />
  </div>
);

/* ─────────────────────────────────────────
   CORNER ORNAMENT
───────────────────────────────────────── */
const CornerOrnamentK = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg viewBox="0 0 40 40" className={styles.kCornerOrn} style={{ transform: flip }}>
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
};

/* ─────────────────────────────────────────
   SEATS CELL
───────────────────────────────────────── */
const SeatsCell = ({ booked, total }: { booked: number; total: number }) => {
  const isFull = booked >= total;
  const remaining = total - booked;
  if (isFull) return <span className={styles.kFullyBooked}>Fully Booked</span>;
  return (
    <span className={styles.kSeatsAvailable}>
      {remaining} / {total} Seats
    </span>
  );
};

/* ─────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────── */
const AccordionItem = ({
  num,
  title,
  items,
}: {
  num: number;
  title: string;
  items: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.accordItem} ${open ? styles.accordOpen : ""}`}>
      <button
        className={styles.accordHead}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={styles.accordNum}>{num}.</span>
        <span className={styles.accordTitle}>{title}</span>
        <span className={styles.accordIcon}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className={styles.accordBody}>
          {items.map((item, i) => (
            <div key={i} className={styles.accordCheck}>
              <span className={styles.checkMark}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────── */
const PageSkeleton = () => (
  <div className={styles.page} style={{ minHeight: "100vh", padding: "2rem" }}>
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {[300, 200, 400, 180, 350].map((h, i) => (
        <div
          key={i}
          style={{
            height: h,
            borderRadius: 8,
            background: "linear-gradient(90deg,#f0e8d8 25%,#e8dcc8 50%,#f0e8d8 75%)",
            backgroundSize: "400% 100%",
            animation: "shimmer 1.4s ease infinite",
          }}
        />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function KundaliniYogaTTC() {
  const [content, setContent] = useState<KundaliniContent | null>(null);
  const [seats, setSeats] = useState<KundaliniSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentRes, seatsRes] = await Promise.all([
          api.get("/kundalini-ttc-content/get"),
          api.get("/kundalini-seats"),
        ]);

        if (contentRes.data?.success) {
          setContent(contentRes.data.data);
        }
        if (seatsRes.data?.success) {
          setSeats(seatsRes.data.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load Kundalini TTC data:", err);
        setError("Failed to load page content. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;

  if (error) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          color: "#b8860b",
        }}
      >
        <p style={{ fontSize: "1.1rem" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#e07b00",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className={styles.page}>
      {/* ── Fixed Mandala Decorations ── */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={380} color1="#e07b00" color2="#d4a017" strokeW={0.45} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={340} color1="#d4a017" color2="#e07b00" strokeW={0.45} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={200} color1="#e07b00" color2="#d4a017" strokeW={0.6} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={200} color1="#d4a017" color2="#e07b00" strokeW={0.6} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section className={styles.heroSection}>
        {content.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc(content.heroImage)}
            alt="Yoga Students Group"
            className={styles.heroImage}
          />
        )}
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — WHAT IS KUNDALINI YOGA
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.whatIsTitle}</h2>
            <OmDivider />
            {content.whatIsParagraphs?.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — ACTIVATE KUNDALINI
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.sectionChakra} aria-hidden="true">
            <ChakraSVG size={120} color="rgba(224,123,0,0.08)" />
          </div>

          <h2 className={styles.sectionTitleCenter}>{content.activateTitle}</h2>
          <OmDivider />
          {content.activateParagraphs?.map((para, i) => (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}

          {/* Benefits */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.benefitsTitle}</h2>
            <OmDivider />
            {content.benefitsIntro1 && (
              <p className={styles.bodyPara}>{content.benefitsIntro1}</p>
            )}
            {content.benefitsIntro2 && (
              <p className={styles.bodyPara}>{content.benefitsIntro2}</p>
            )}
            <div className={styles.benefitGrid}>
              {content.benefitItems?.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <span className={styles.benefitNum}>{i + 1}.</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Highlights */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.highlightsTitle}</h2>
            <OmDivider />
            {content.highlightsIntro && (
              <p className={styles.bodyPara}>{content.highlightsIntro}</p>
            )}
            <div className="row g-3 mt-2">
              {content.highlightCards?.map((h) => (
                <div key={h.id} className="col-12 col-md-6">
                  <div className={styles.highlightItem}>
                    <div className={styles.highlightDot} />
                    <div>
                      <strong className={styles.highlightTitle}>{h.title}:</strong>
                      <span className={styles.highlightDesc}> {h.desc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 4 — SYLLABUS ACCORDION
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.syllabusWrap}>
            <div className={styles.syllabusHeader}>
              <h2 className={styles.syllabusBigTitle}>{content.syllabusBigTitle}</h2>
              <p className={styles.syllabusSchool}>{content.syllabusSchool}</p>
            </div>
            <div className={styles.courseOverview}>
              <h3 className={styles.overviewTitle}>{content.courseOverviewTitle}</h3>
              <div
                className={styles.bodyPara}
                style={{ marginBottom: 0 }}
                dangerouslySetInnerHTML={{ __html: content.courseOverviewPara ?? "" }}
              />
            </div>
            <div className={styles.accordionWrap}>
              {content.syllabusModules?.map((item, i) => (
                <AccordionItem key={item.id} num={i + 1} title={item.title} items={item.items} />
              ))}
            </div>
            <div className={styles.readingBox}>
              <h3 className={styles.readingTitle}>{content.readingBoxTitle}</h3>
              <ul className={styles.readingList}>
                {content.readingItems?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {content.readingBoxNote && (
                <p className={styles.bodyPara} style={{ marginTop: "0.5rem" }}>
                  {content.readingBoxNote}
                </p>
              )}
            </div>
            <div className={styles.noteBox}>
              <h3 className={styles.noteTitle}>{content.noteBoxTitle}</h3>
              <p className={styles.bodyPara} style={{ marginBottom: 0 }}>
                {content.noteBoxPara}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 5 — ELIGIBILITY + LOCATION + FACILITIES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Eligibility */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.eligibilityTitle}</h2>
            <OmDivider />
            {content.eligibilityParagraphs?.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>

          {/* Location */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.locationTitle}</h2>
            <OmDivider />
            {content.locationParagraphs?.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>

          {/* Facilities */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.facilitiesTitle}</h2>
            <OmDivider />
            {content.facilitiesIntroRich ? (
              <div
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: content.facilitiesIntroRich }}
              />
            ) : (
              content.facilitiesIntro && (
                <p className={styles.bodyPara}>{content.facilitiesIntro}</p>
              )
            )}
            <div className="row g-2 mt-2">
              {content.facilityItems?.map((fac, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className={styles.facilityItem}>
                    <span className={styles.facNum}>{i + 1}.</span>
                    <span>{fac}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 6 — DAILY SCHEDULE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-6">
              <h2 className={styles.sectionTitleLeft}>{content.scheduleSectionTitle}</h2>
              <div className={styles.underlineLeft} />
              <div className={styles.scheduleList}>
                {content.scheduleItems?.map((s) => (
                  <div key={s.id} className={styles.schedRow}>
                    <span className={styles.schedTime}>{s.time}</span>
                    <span className={styles.schedSep}>:</span>
                    <span className={styles.schedAct}>{s.activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="row g-2">
                {content.schedImg1 && (
                  <div className="col-6">
                    <div className={styles.schedImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc(content.schedImg1)}
                        alt="Daily schedule"
                        className={styles.schedImg}
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                {content.schedImg2 && (
                  <div className="col-6">
                    <div className={styles.schedImgWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc(content.schedImg2)}
                        alt="Daily practice"
                        className={styles.schedImg}
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 7 — WHY CHOOSE AYM
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitleCenter}>{content.whyAYMTitle}</h2>
          <OmDivider />
          <div className="row g-3 mb-4">
            {content.whyCards?.map((card, i) => (
              <div key={card.id} className="col-12 col-md-6 col-lg-4">
                <div className={styles.whyCard}>
                  <div className={styles.whyNum}>{i + 1}</div>
                  <div>
                    <strong className={styles.whyLabel}>{card.label}</strong>
                    <span className={styles.whyDesc}> - {card.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {content.classImage && (
            <div className={styles.classImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc(content.classImage)}
                alt="AYM Yoga School Kundalini class in Rishikesh"
                className={styles.classImg}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 8 — AVAILABILITY TABLE (from /kundalini-seats)
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`} id="schedule">
        <div className="container px-3 px-md-4">
          <h2 className={styles.sectionTitleCenter}>
            Availability Of The 200 Hour Kundalini Yoga TTC 2026
          </h2>
          <OmDivider />
          <p className={styles.kCenterSubtext}>
            Choose your preferred accommodation. Prices include tuition and meals.
          </p>

          <div className={styles.kTableContainer}>
            <CornerOrnamentK pos="tl" />
            <CornerOrnamentK pos="tr" />
            <CornerOrnamentK pos="bl" />
            <CornerOrnamentK pos="br" />

            <div className={styles.kTableScroll}>
              <table className={styles.kDatesTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Fee</th>
                    <th>Fee (Indian)</th>
                    <th>Room Price</th>
                    <th>Seats</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                        No batches available at the moment.
                      </td>
                    </tr>
                  ) : (
                    seats.map((row, i) => {
                      const isFull = row.bookedSeats >= row.totalSeats;
                      const dateLabel = `${fmtDate(row.startDate)} to ${fmtDate(row.endDate)}`;
                      return (
                        <tr key={row._id}>
                          <td>
                            <span className={styles.kDateCal}>📅</span> {dateLabel}
                          </td>
                          <td>{row.usdFee}</td>
                          <td>{row.inrFee}</td>
                          <td className={styles.kRoomPriceCell}>
                            Dorm{" "}
                            <strong className={styles.kPriceAmt}>${row.dormPrice}</strong> |{" "}
                            Twin{" "}
                            <strong className={styles.kPriceAmt}>${row.twinPrice}</strong> |{" "}
                            Private{" "}
                            <strong className={styles.kPriceAmt}>${row.privatePrice}</strong>
                          </td>
                          <td>
                            <SeatsCell booked={row.bookedSeats} total={row.totalSeats} />
                          </td>
                          <td>
                            {isFull ? (
                              <span className={styles.kApplyDisabled}>Apply Now</span>
                            ) : (
                              <a
                                href={`/yoga-registration?type=kundalini-200hr&batch=${i + 1}`}
                                className={styles.kApplyLink}
                              >
                                Apply Now
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Notes from any batch */}
            {seats.some((s) => s.note) && (
              <p className={styles.kTableNote}>
                <strong>Note:</strong> {seats.find((s) => s.note)?.note}
              </p>
            )}

            <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
              <a href="#" className={styles.kJoinBtn}>
                Join Your Yoga Journey
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 9 — WHY CHOOSE RISHIKESH + REFUND
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.whyRishikeshTitle}</h2>
            <OmDivider />

            {content.spiritualTitle && (
              <h3 className={styles.subHeading}>{content.spiritualTitle}</h3>
            )}
            {content.spiritualPara && (
              <div
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: content.spiritualPara }}
              />
            )}

            {content.naturalTitle && (
              <h3 className={styles.subHeading}>{content.naturalTitle}</h3>
            )}
            {content.naturalPara && (
              <div
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: content.naturalPara }}
              />
            )}

            {content.typesTitle && (
              <h3 className={styles.subHeading}>{content.typesTitle}</h3>
            )}
            {content.typesItems && content.typesItems.length > 0 && (
              <ul className={styles.bulletList}>
                {content.typesItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {content.topSchoolsTitle && (
              <h3 className={styles.subHeading}>{content.topSchoolsTitle}</h3>
            )}
            {content.topSchoolsPara && (
              <p className={styles.bodyPara}>{content.topSchoolsPara}</p>
            )}
          </div>

          {/* Refund Policy */}
          <div className={`${styles.vintageCard} mt-4`}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.sectionTitleCenter}>{content.refundTitle}</h2>
            <OmDivider />
            <div className="row g-3">
              {content.refundItems?.map((policy, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className={styles.policyItem}>
                    <span className={styles.policyNum}>{i + 1}.</span>
                    <span>{policy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <OmDivider />
        </div>
      </section>

      <HowToReach />
    </div>
  );
}