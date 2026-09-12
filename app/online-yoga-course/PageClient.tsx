"use client";
import React, { useEffect, useState, useRef } from "react";
import api from "@/lib/api";
import styles from "@/assets/style/online-yoga-course/Onlineyogacourse.module.css";
import Link from "next/link";
import HowToReach from "@/components/home/Howtoreach";
import Script from "next/script";

/* ═══════════════════════════════════════════
   TYPES — mirror the backend model exactly
═══════════════════════════════════════════ */
type Currency = "USD" | "INR";

interface BatchRow {
  _id: string;
  startDate: string;
  endDate: string;
  usd200: string;
  usd300: string;
  inr200?: string;
  inr300?: string;
  totalSeats: number;
  bookedSeats: number;
  note?: string;
}

interface IconTextItem {
  icon: string;
  title: string;
  desc: string;
}

interface CourseCardData {
  title: string;
  duration: string;
  style: string;
  sessions: string;
  cert: string;
  fee: string;
  benefits: string[];
  applyBtnText: string;
  bookBtnText: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface CurriculumAreaData {
  title: string;
  symbol: string;
  color: string;
  lines: string[];
  image?: string | null;
}

interface RecordedCourseData {
  title: string;
  price: string;
  features: string[];
  applyBtnText: string;
}

interface InfoBlockData {
  heading: string;
  paragraphs: string[];
}

interface OtherCourseData {
  title: string;
  hours: string;
  price: string;
  enquireBtnText: string;
  image?: string | null;
}

interface OnlineCourseSectionData {
  _id: string;
  heroImage?: string | null;
  heroImageAlt: string;

  introEyebrow: string;
  introTitle: string;
  introParagraphs: string[];

  whyEyebrow: string;
  whyTitle: string;
  whyReasons: IconTextItem[];
  whyImage?: string | null;
  whyImageAlt: string;
  whyImageBadgeText: string;
  whyVideoEmbedUrl: string;
  whyVideoBadgeText: string;

  benefitsEyebrow: string;
  benefitsTitle: string;
  keyBenefits: IconTextItem[];

  coursesEyebrow: string;
  coursesTitle: string;
  liveCourses: CourseCardData[];

  seatBookingEyebrow: string;
  seatBookingTitle: string;
  seatBookingSubtitle: string;

  noteBoxText: string;
  faqEyebrow: string;
  faqTitle: string;
  faqs: FaqItem[];

  curriculumEyebrow: string;
  curriculumTitle: string;
  curriculumAreas: CurriculumAreaData[];

  recordedEyebrow: string;
  recordedTitle: string;
  recordedCourses: RecordedCourseData[];
  infoBlocks: InfoBlockData[];

  otherEyebrow: string;
  otherTitle: string;
  otherCourses: OtherCourseData[];
}

/* ─────────────────────────────────────────────
   IMAGE URL HELPER
───────────────────────────────────────────── */
const getImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

/* ═══════════════════════════════════════════
   SEAT BOOKING HELPERS
═══════════════════════════════════════════ */
const shortDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
};

const monthYear = (start: string) =>
  new Date(start).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83);
  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    )
      .then((r) => r.json())
      .then((data) => { if (data?.usd?.inr) setRate(data.usd.inr); })
      .catch(() => {});
  }, []);
  return rate;
}

/* ═══════════════════════════════════════════
   CURRENCY DROPDOWN
═══════════════════════════════════════════ */
function CurrencyDropdown({
  currency,
  onChange,
}: {
  currency: Currency;
  onChange: (c: Currency) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.sbCurrDrop} ref={ref}>
      <button
        className={styles.sbCurrDropBtn}
        onClick={() => setOpen((p) => !p)}
        type="button"
      >
        <span>{currency === "USD" ? "🇺🇸" : "🇮🇳"}</span>
        <span>{currency === "USD" ? "English" : "हिन्दी"}</span>
        <svg
          className={`${styles.sbCurrDropArrow} ${open ? styles.sbCurrDropArrowOpen : ""}`}
          viewBox="0 0 12 8"
          fill="none"
        >
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className={styles.sbCurrDropMenu}>
          {(["USD", "INR"] as Currency[]).map((c) => (
            <button
              key={c}
              className={`${styles.sbCurrDropItem} ${currency === c ? styles.sbCurrDropItemActive : ""}`}
              onClick={() => { onChange(c); setOpen(false); }}
              type="button"
            >
              <span>{c === "USD" ? "🇺🇸" : "🇮🇳"}</span>
              <div>
                <span>{c === "USD" ? "English" : "हिन्दी"}</span>
                <span>{c === "USD" ? "US Dollar" : "Indian Rupee"}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SEAT BOOKING COMPONENT (inline)
   — header text now comes from backend via props
═══════════════════════════════════════════ */
function OnlineSeatBooking({
  batches,
  eyebrow,
  title,
  subtitle,
}: {
  batches: BatchRow[];
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [courseTab, setCourseTab] = useState<"200" | "300">("200");
  const rate = useCurrencyRate();

  useEffect(() => {
    if (!batches.length) return;
    const first = batches.find((b) => b.totalSeats - b.bookedSeats > 0);
    if (first) setSelectedId(first._id);
  }, [batches]);

  const selected = batches.find((b) => b._id === selectedId) ?? null;

  const fmtPrice = (batch: BatchRow | null, course: "200" | "300"): string => {
    if (!batch) return "—";
    const usdVal = course === "200" ? batch.usd200 : batch.usd300;

    if (currency === "INR") {
      const inrVal = course === "200" ? batch.inr200 : batch.inr300;

      if (inrVal && inrVal.trim() !== "") {
        const inrNum = parseFloat(inrVal.replace(/[₹,]/g, ""));
        if (!isNaN(inrNum)) {
          return `₹${inrNum.toLocaleString("en-IN")}`;
        }
      }

      const usdNum = parseFloat(usdVal.replace(/[$,]/g, ""));
      return `₹${Math.round(usdNum * rate).toLocaleString("en-IN")}`;
    }

    const raw = usdVal.trim();
    return raw.startsWith("$") ? raw : `$${raw}`;
  };

  return (
    <section className={styles.sbSection} id="seat-booking">
      <span className={styles.sectionEyebrow}>{eyebrow}</span>
      <div className={styles.vintageHeadingWrap} style={{ textAlign: "center" }}>
        <h2 className={styles.vintageHeading}>{title}</h2>
        <div className={styles.headingUnderline} style={{ justifyContent: "center" }}>
          <div className={styles.headingDiamond} />
        </div>
      </div>
      <p className={styles.sbSecSub}>{subtitle}</p>
      <div className={styles.sbOrnLine}>
        <div className={styles.sbOrnL} />
        <div className={styles.sbOrnDiamond} />
        <div className={styles.sbOrnR} />
      </div>

      <div className={styles.sbLayout}>
        <div className={styles.sbLeftPanel}>
          <div className={styles.sbLph}>
            <span className={styles.sbLphTitle}>Select Your Batch</span>
            <div className={styles.sbLphRight}>
              <CurrencyDropdown currency={currency} onChange={setCurrency} />
              <div className={styles.sbLegend}>
                <div className={styles.sbLegItem}>
                  <div className={`${styles.sbLegDot} ${styles.sbDGreen}`} />
                  Available
                </div>
                <div className={styles.sbLegItem}>
                  <div className={`${styles.sbLegDot} ${styles.sbDOrange}`} />
                  Limited
                </div>
                <div className={styles.sbLegItem}>
                  <div className={`${styles.sbLegDot} ${styles.sbDRed}`} />
                  Full
                </div>
              </div>
            </div>
          </div>

          {batches.length === 0 ? (
            <p className={styles.sbNoBatches}>No upcoming batches available.</p>
          ) : (
            <div className={styles.sbBatchGrid}>
              {batches.map((batch) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 3;
                const dotCls = full ? styles.sbDRed : low ? styles.sbDOrange : styles.sbDGreen;
                const txtCls = full ? styles.sbSRed : low ? styles.sbSOrange : styles.sbSGreen;
                const statusTxt = full ? "Fully Booked" : low ? "Limited" : "Available";
                const isSelected = selectedId === batch._id;

                return (
                  <div
                    key={batch._id}
                    className={[
                      styles.sbBc,
                      full ? styles.sbBcFull : "",
                      isSelected ? styles.sbBcSel : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => { if (!full) setSelectedId(batch._id); }}
                  >
                    <div className={styles.sbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={styles.sbBcMonth}>{monthYear(batch.startDate)}</div>
                    <div className={styles.sbBcDates}>{shortDateRange(batch.startDate, batch.endDate)}</div>

                    <div className={styles.sbBcPrices}>
                      <div className={styles.sbBcPriceRow}>
                        <span className={styles.sbBcCourseLabel}>200 Hr</span>
                        <span className={styles.sbBcPriceAmt}>
                          {fmtPrice(batch, "200")} <span className={styles.sbBcPriceCur}>{currency}</span>
                        </span>
                      </div>
                      <div className={styles.sbBcPriceRow}>
                        <span className={styles.sbBcCourseLabel}>300 Hr</span>
                        <span className={styles.sbBcPriceAmt}>
                          {fmtPrice(batch, "300")} <span className={styles.sbBcPriceCur}>{currency}</span>
                        </span>
                      </div>
                    </div>

                    <div className={styles.sbBcStatus}>
                      <div className={`${styles.sbBcDot} ${dotCls}`} />
                      <span className={`${styles.sbBcStxt} ${txtCls}`}>{statusTxt}</span>
                    </div>

                    {!full && (
                      <>
                        <div className={styles.sbBcSeatsBar}>
                          <div
                            className={styles.sbBcSeatsBarFill}
                            style={{
                              width: `${Math.max(5, (rem / batch.totalSeats) * 100)}%`,
                              background: low
                                ? "linear-gradient(90deg,#c8700a,#e09030)"
                                : "linear-gradient(90deg,#3d6000,#6aa000)",
                            }}
                          />
                        </div>
                        <span
                          className={styles.sbBcSeatsBadge}
                          style={{ color: low ? "#c8700a" : "#3d6000" }}
                        >
                          {rem} / {batch.totalSeats} seats left
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.sbRightPanel}>
          <div className={styles.sbRpHead}>
            <div className={styles.sbRpEyebrow}>Course Overview</div>
            <div className={styles.sbRpCourse}>Live Online Yoga Teacher Training</div>
            <div className={styles.sbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.sbRpDurTxt}>24–28 Days · Online · Rishikesh Tradition</span>
            </div>
            <div className={styles.sbCurrBadge}>
              {currency === "USD" ? "🇺🇸 Prices in USD" : "🇮🇳 Prices in INR"}
            </div>
          </div>

          <div className={styles.sbRpBody}>
            <div className={styles.sbCourseTabs}>
              <button
                className={`${styles.sbCourseTab} ${courseTab === "200" ? styles.sbCourseTabActive : ""}`}
                onClick={() => setCourseTab("200")}
                type="button"
              >
                200 Hour
              </button>
              <button
                className={`${styles.sbCourseTab} ${courseTab === "300" ? styles.sbCourseTabActive : ""}`}
                onClick={() => setCourseTab("300")}
                type="button"
              >
                300 Hour
              </button>
            </div>

            <div className={styles.sbCourseDetail}>
              <div className={styles.sbCourseDetailRow}>
                <span className={styles.sbCdLabel}>Duration</span>
                <span className={styles.sbCdVal}>{courseTab === "200" ? "24 Days" : "28 Days"}</span>
              </div>
              <div className={styles.sbCourseDetailRow}>
                <span className={styles.sbCdLabel}>Style</span>
                <span className={styles.sbCdVal}>
                  {courseTab === "200" ? "Hatha + Ashtanga" : "Hatha + Multi-Style"}
                </span>
              </div>
              <div className={styles.sbCourseDetailRow}>
                <span className={styles.sbCdLabel}>Sessions</span>
                <span className={styles.sbCdVal}>15 Days · 2 Classes/Day</span>
              </div>
              <div className={styles.sbCourseDetailRow}>
                <span className={styles.sbCdLabel}>Certificate</span>
                <span className={styles.sbCdVal}>Yoga Alliance, USA</span>
              </div>
            </div>

            <div className={styles.sbPriceLbl}>Course Fee</div>
            <div className={styles.sbPriceBlock}>
              <div className={styles.sbPriceAmt}>{selected ? fmtPrice(selected, courseTab) : "—"}</div>
              <div className={styles.sbPriceCur}>{currency}</div>
            </div>

            <div className={styles.sbDivider} />

            {selected && (() => {
              const rem = selected.totalSeats - selected.bookedSeats;
              const full = rem <= 0;
              const low = !full && rem <= 3;
              const pct = full ? 100 : Math.round((selected.bookedSeats / selected.totalSeats) * 100);
              return (
                <div className={styles.sbRpSeatsWrap}>
                  <div className={styles.sbRpSeatsRow}>
                    <span className={styles.sbRpSeatsLbl}>Seats Availability</span>
                    <span
                      className={styles.sbRpSeatsBadge}
                      style={{
                        color: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                        borderColor: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                      }}
                    >
                      {full ? "Fully Booked" : `${rem} of ${selected.totalSeats} left`}
                    </span>
                  </div>
                  <div className={styles.sbRpSeatsBar}>
                    <div
                      className={styles.sbRpSeatsBarFill}
                      style={{
                        width: `${pct}%`,
                        background: full
                          ? "#8a2c00"
                          : low
                          ? "linear-gradient(90deg,#c8700a,#e09030)"
                          : "linear-gradient(90deg,#3d6000,#6aa000)",
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            <div className={styles.sbSelDisplay}>
              {selected ? (
                <>
                  <div className={styles.sbSelLabel}>Selected Batch</div>
                  <div className={styles.sbSelDate}>
                    {shortDateRange(selected.startDate, selected.endDate)},{" "}
                    {monthYear(selected.startDate)}
                  </div>
                </>
              ) : (
                <span className={styles.sbSelHint}>← Select a batch to continue</span>
              )}
            </div>

            {selected ? (
              <a
                href={`/registration?batchId=${selected._id}&type=${courseTab}hr-online`}
                className={styles.sbBookBtn}
              >
                Book Now — {fmtPrice(selected, courseTab)} {currency}
                <svg className={styles.sbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className={`${styles.sbBookBtn} ${styles.sbBookBtnDis}`}>Book Now</span>
            )}

            {selected?.note && (
              <p className={styles.sbNote}>
                <strong>Note:</strong> {selected.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SHARED UI COMPONENTS
───────────────────────────────────────────── */
function VintageHeading({
  children,
  center = true,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={styles.vintageHeadingWrap} style={{ textAlign: center ? "center" : "left" }}>
      <Tag className={styles.vintageHeading}>{children}</Tag>
      <div className={styles.headingUnderline} style={{ justifyContent: center ? "center" : "flex-start" }}>
        <div className={styles.headingDiamond} />
      </div>
    </div>
  );
}

const CalendarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
    <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="1" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const VideoIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 1l2 4 4.5.7-3.2 3.1.7 4.5L8 11.2 4 13.3l.7-4.5L1.5 5.7 6 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const DollarIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <text x="8" y="12" textAnchor="middle" fontSize="9" fill="currentColor" fontFamily="serif">$</text>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────
   COURSE CARD COMPONENT — button texts now dynamic
───────────────────────────────────────────── */
function CourseCard({
  title, duration, style, sessions, cert, fee, benefits, applyBtnText, bookBtnText,
}: CourseCardData) {
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseCardHeader}>
        <h3 className={styles.courseCardTitle}>{title}</h3>
        <span className={styles.courseCardFeeTag}>{fee}</span>
      </div>
      <div className={styles.courseCardBody}>
        <div className={styles.courseCardLeft}>
          <ul className={styles.courseDetailList}>
            <li>
              <span className={styles.detailIcon}><CalendarIcon /></span>
              <span><strong>Duration:</strong>&nbsp;{duration}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><UserIcon /></span>
              <span><strong>Course Style:</strong>&nbsp;{style}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><VideoIcon /></span>
              <span><strong>Live Interactive Sessions:</strong>&nbsp;{sessions}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><StarIcon /></span>
              <span><strong>Certificate:</strong>&nbsp;{cert}</span>
            </li>
            <li>
              <span className={styles.detailIcon}><DollarIcon /></span>
              <span><strong>Course Fee:</strong>&nbsp;{fee}</span>
            </li>
          </ul>
          <div className={styles.courseActions}>
            <Link href="/registration" className={styles.btnPrimary}>{applyBtnText || "Apply Now"}</Link>
            <Link href="/registration" className={styles.btnOutline}>{bookBtnText || "Book Now"}</Link>
          </div>
        </div>
        <div className={styles.courseCardRight}>
          <p className={styles.benefitsListTitle}>Key Benefits</p>
          <ul className={styles.benefitsList}>
            {(benefits || []).map((b, j) => (
              <li key={j} className={styles.benefitsListItem}>
                <span className={styles.benefitCheck}><CheckIcon /></span>
                <span>
                  {b.includes(" - ") ? (
                    <><strong>{b.split(" - ")[0]}</strong>{" — " + b.split(" - ").slice(1).join(" - ")}</>
                  ) : b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCHEMA BUILDER — built dynamically from fetched section
───────────────────────────────────────────── */
function buildSchema(section: OnlineCourseSectionData) {
  const siteUrl = "https://aymyogaschool.com";
  const pageUrl = `${siteUrl}/online-yoga-course`;

  const courseInstances = (section.liveCourses || []).map((c) => ({
    "@type": "CourseInstance",
    name: c.title,
    courseMode: "online",
    description: `${c.style}. ${c.sessions}.`,
  }));

  const recordedInstances = (section.recordedCourses || []).map((c) => ({
    "@type": "CourseInstance",
    name: c.title,
    courseMode: "online",
    description: (c.features || []).join(", "),
  }));

  const offers = [
    ...(section.liveCourses || []).map((c) => ({
      "@type": "Offer",
      name: c.title,
      priceCurrency: "USD",
      price: (c.fee || "").match(/[\d,.]+/)?.[0]?.replace(/,/g, "") || "0",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/registration`,
    })),
    ...(section.recordedCourses || []).map((c) => ({
      "@type": "Offer",
      name: c.title,
      priceCurrency: "USD",
      price: (c.price || "").match(/[\d,.]+/)?.[0]?.replace(/,/g, "") || "0",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/registration`,
    })),
  ];

  const otherCourseSchemas = (section.otherCourses || []).map((oc, i) => ({
    "@type": "Course",
    "@id": `${pageUrl}#other-course-${i}`,
    name: `${oc.title} (Online)`,
    description: `A specialized ${oc.hours} online course focused on ${oc.title}.`,
    provider: { "@id": `${siteUrl}/#organization` },
    offers: {
      "@type": "Offer",
      price: (oc.price || "").match(/[\d,.]+/)?.[0]?.replace(/,/g, "") || "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/contact`,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Online Yoga Course", item: pageUrl },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: section.introTitle,
        description: (section.introParagraphs?.[0] || "").replace(/<[^>]*>/g, "").slice(0, 300),
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        about: { "@id": `${pageUrl}#course` },
        mainEntity: { "@id": `${pageUrl}#faq` },
        inLanguage: "en-IN",
        isPartOf: { "@id": `${siteUrl}/#website` },
      },
      {
        "@type": "Course",
        "@id": `${pageUrl}#course`,
        name: section.introTitle,
        description: (section.introParagraphs?.[0] || "").replace(/<[^>]*>/g, ""),
        provider: {
          "@type": "EducationalOrganization",
          "@id": `${siteUrl}/#organization`,
          name: "AYM Yoga School",
        },
        educationalCredentialAwarded: "Yoga Alliance, USA Certificate",
        inLanguage: ["en", "hi"],
        teaches: (section.curriculumAreas || []).map((a) => a.title),
        syllabusSections: (section.curriculumAreas || []).map((a) => ({
          "@type": "Syllabus",
          name: a.title,
          description: (a.lines || []).join(", "),
        })),
        hasCourseInstance: [...courseInstances, ...recordedInstances],
        offers,
      },
      ...otherCourseSchemas,
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: (section.faqs || []).map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT — everything driven by backend data
───────────────────────────────────────────── */
export default function OnlineYogaCourse() {
  const [section, setSection] = useState<OnlineCourseSectionData | null>(null);
  const [sectionLoading, setSectionLoading] = useState(true);

  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(true);

  useEffect(() => {
    fetchSection();
    fetchBatches();
  }, []);

  const fetchSection = async () => {
    try {
      const response = await api.get("/online-course-section");
      if (response.data.success && response.data.data?.length) {
        // latest section (backend returns sorted by createdAt desc)
        setSection(response.data.data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSectionLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await api.get("/online-seats/get-all-batches");
      if (response.data.success) {
        setBatches(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBatchesLoading(false);
    }
  };

  if (sectionLoading) {
    return (
      <div className={styles.page} style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className={styles.page} style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Content coming soon.</p>
      </div>
    );
  }

  const schema = buildSchema(section);

  return (
    <>
      <Script
        id="online-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className={styles.page}>
        {/* Mandala watermark */}
        <div className={styles.mandalaWatermark} aria-hidden="true">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" stroke="#F15505" strokeWidth="0.5" opacity="0.07">
              {[30, 60, 90, 120, 150, 180, 210, 240].map((r, i) => (
                <circle key={i} cx="250" cy="250" r={r} />
              ))}
              {Array.from({ length: 36 }, (_, i) => {
                const a = (((i * 360) / 36) * Math.PI) / 180;
                return (
                  <line key={i} x1="250" y1="250"
                    x2={250 + 240 * Math.cos(a)} y2={250 + 240 * Math.sin(a)} />
                );
              })}
              {[60, 120, 180].map((r, i) => (
                <polygon key={i}
                  points={Array.from({ length: 8 }, (_, j) => {
                    const a = (((j * 360) / 8) * Math.PI) / 180;
                    return `${250 + r * Math.cos(a)},${250 + r * Math.sin(a)}`;
                  }).join(" ")}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* ══ HERO IMAGE ══ */}
        {section.heroImage && (
          <section className={styles.heroSection}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getImageUrl(section.heroImage)}
              alt={section.heroImageAlt || "Hero"}
              className={styles.heroImage}
            />
          </section>
        )}

        {/* ══ INTRO ══ */}
        <section className={`${styles.section} ${styles.introSection}`}>
          <div className={styles.container}>
            <div className={styles.introText}>
              <span className={styles.sectionEyebrow}>{section.introEyebrow}</span>
              {/* ── SINGLE H1 ON THE PAGE (SEO) ── */}
              <VintageHeading as="h1">{section.introTitle}</VintageHeading>
              {(section.introParagraphs || []).map((p, i) => (
                <p key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ WHY CHOOSE ══ */}
        <section className={styles.whySection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.whyEyebrow}</span>
            <VintageHeading>{section.whyTitle}</VintageHeading>
            <div className={styles.whySplit}>
              <div className={styles.whyLeft}>
                <div className={styles.whyGrid}>
                  {(section.whyReasons || []).map((item, i) => (
                    <div
                      key={i}
                      className={styles.whyCard}
                      style={{ "--wi": i } as React.CSSProperties}
                    >
                      <div className={styles.whyIconBox}>{item.icon}</div>
                      <div className={styles.whyCardBody}>
                        <div className={styles.whyCardTitle}>{item.title}</div>
                        <div className={styles.whyCardDesc}>{item.desc}</div>
                      </div>
                      <div className={styles.whyCardLine} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.whyRight}>
                {section.whyImage && (
                  <div className={styles.whyImageBox}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(section.whyImage)} alt={section.whyImageAlt || "Why choose us"} />
                    <div className={styles.whyCornerTl} />
                    <div className={styles.whyCornerBr} />
                    {section.whyImageBadgeText && (
                      <div className={styles.whyImageBadge}>{section.whyImageBadgeText}</div>
                    )}
                  </div>
                )}
                {section.whyVideoEmbedUrl && (
                  <div className={styles.whyVideoBox}>
                    <iframe
                      src={section.whyVideoEmbedUrl}
                      title="AYM Yoga School"
                      allow="autoplay"
                      allowFullScreen
                    />
                    {section.whyVideoBadgeText && (
                      <div className={styles.whyVideoBadge}>
                        <span className={styles.pulseDot} /> {section.whyVideoBadgeText}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ KEY BENEFITS ══ */}
        <section className={styles.benefitsSection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.benefitsEyebrow}</span>
            <VintageHeading>{section.benefitsTitle}</VintageHeading>
            <div className={styles.benefitsGrid}>
              {(section.keyBenefits || []).map((item, i) => (
                <div
                  key={i}
                  className={styles.benefitCard}
                  style={{ "--bi": i } as React.CSSProperties}
                >
                  <div className={styles.benefitIconWrap}>{item.icon}</div>
                  <div className={styles.benefitCardNum}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.benefitTitle}>{item.title}</div>
                  <div className={styles.benefitDesc}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ LIVE COURSES ══ */}
        <section className={styles.coursesSection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.coursesEyebrow}</span>
            <VintageHeading>{section.coursesTitle}</VintageHeading>
            {(section.liveCourses || []).map((course, i) => (
              <CourseCard key={i} {...course} />
            ))}
          </div>
        </section>

        {/* ══ SEAT BOOKING ══ */}
        <section className={styles.scheduleSection}>
          <div className={styles.container}>
            {batchesLoading ? (
              <p>Loading...</p>
            ) : (
              <OnlineSeatBooking
                batches={batches}
                eyebrow={section.seatBookingEyebrow}
                title={section.seatBookingTitle}
                subtitle={section.seatBookingSubtitle}
              />
            )}
          </div>
        </section>

        {/* ══ NOTE + FAQ ══ */}
        <section className={styles.aboutSection}>
          <div className={styles.container}>
            {section.noteBoxText && (
              <div className={styles.noteBox} dangerouslySetInnerHTML={{ __html: section.noteBoxText }} />
            )}
            <span className={styles.sectionEyebrow}>{section.faqEyebrow}</span>
            <VintageHeading>{section.faqTitle}</VintageHeading>
            <div className={styles.faqGrid}>
              {(section.faqs || []).map((item, i) => (
                <div
                  key={i}
                  className={styles.faqCard}
                  style={{ "--fi": i } as React.CSSProperties}
                >
                  <p className={styles.faqQ}>{item.q}</p>
                  <p className={styles.faqA}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CURRICULUM ══ */}
        <section className={styles.curriculumSection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.curriculumEyebrow}</span>
            <VintageHeading>{section.curriculumTitle}</VintageHeading>
            <div className={styles.chakraGrid}>
              {(section.curriculumAreas || []).map((area, i) => (
                <div
                  key={i}
                  className={styles.chakraCard}
                  style={{ "--ci": i } as React.CSSProperties}
                >
                  <div className={styles.chakraCardBg}>{area.symbol}</div>
                  {area.image && (
                    <div className={styles.chakraImageWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(area.image)}
                        alt={area.title}
                        width={130}
                        height={130}
                        className={styles.chakraImage}
                      />
                    </div>
                  )}
                  <h4 className={styles.chakraTitle} style={{ color: area.color }}>
                    {area.title}
                  </h4>
                  <div className={styles.chakraCardDivider} />
                  {(area.lines || []).map((line, j) => (
                    <p key={j} className={styles.chakraLine}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ RECORDED COURSES ══ */}
        <section className={styles.recordedSection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.recordedEyebrow}</span>
            <VintageHeading>{section.recordedTitle}</VintageHeading>
            <div className={styles.recordedGrid}>
              {(section.recordedCourses || []).map((rc, i) => (
                <div key={i} className={styles.recordedCard}>
                  <div className={styles.recordedCardHeader}>
                    <span className={styles.recordedCardIcon}>✎</span>
                    <h4 className={styles.recordedCardTitle}>{rc.title}</h4>
                    <div className={styles.recordedCardPrice}>
                      <span className={styles.recordedPriceAmt}>{rc.price}</span>
                      <span className={styles.recordedPriceCur}>USD</span>
                    </div>
                  </div>
                  <div className={styles.recordedCardBody}>
                    <ul className={styles.recordedFeatureList}>
                      {(rc.features || []).map((f, j) => (
                        <li key={j} className={styles.recordedFeatureItem}>
                          <span className={styles.featureCheckIcon}><CheckIcon /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/registration" className={styles.recordedApplyBtn}>
                      {rc.applyBtnText || "Apply Now"}
                      <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {(section.infoBlocks || []).length > 0 && (
              <div className={styles.infoBox}>
                {section.infoBlocks.map((block, i) => (
                  <React.Fragment key={i}>
                    <h4 className={styles.infoBoxTitle}>{block.heading}</h4>
                    {(block.paragraphs || []).map((p, j) => (
                      <p key={j} className={styles.infoBoxText} dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══ OTHER LIVE COURSES ══ */}
        <section className={styles.otherSection}>
          <div className={styles.container}>
            <span className={styles.sectionEyebrow}>{section.otherEyebrow}</span>
            <VintageHeading>{section.otherTitle}</VintageHeading>
            <div className={styles.otherGrid}>
              {(section.otherCourses || []).map((oc, i) => (
                <div
                  key={i}
                  className={styles.otherCard}
                  style={{ "--oi": i } as React.CSSProperties}
                >
                  {oc.image && (
                    <div className={styles.otherCardImage}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getImageUrl(oc.image)} alt={oc.title} />
                      <div className={styles.otherCardImageOverlay} />
                    </div>
                  )}
                  <div className={styles.otherCardBody}>
                    <h4 className={styles.otherTitle}>{oc.title}</h4>
                    <p className={styles.otherMeta}>{oc.hours} · {oc.price}</p>
                    <Link href="/contact" className={styles.otherCardBtn}>
                      {oc.enquireBtnText || "Enquire Now"}
                      <svg viewBox="0 0 16 16" fill="none" style={{ width: 12, height: 12 }}>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowToReach />
      </div>
    </>
  );
}