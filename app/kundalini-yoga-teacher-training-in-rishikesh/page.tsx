"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/kundalini-yoga-teacher-training-in-rishikesh/Kundaliniyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import StickySectionNav from "@/components/common/StickySectionNav"; // ✅ Import sticky nav

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

interface IntroItem {
  paragraph: string;
  media: string;
  mediaAlt: string;
  mediaType: "image" | "video";
}

interface KundaliniContent {

  
  _id: string;
  status: string;
  refundIcons?: string[];
  refundColors?: Array<{ color: string; bg: string; border: string }>;
  // Section 9 - Why Rishikesh Banner
  whyRishikeshBannerImage?: string;
  whyRishikeshBannerImageAlt?: string;
  whyRishikeshBannerTag?: string;
  whyRishikeshBannerStats?: Array<{ num: string; label: string }>;
  
  // Section 9 - Icons
  spiritualIcon?: string;
  naturalIcon?: string;
  typesIcon?: string;
  topSchoolsIcon?: string;
  aymPillText?: string;
  
  // Section 9 - Refund
  refundTagLine?: string;
  refundHeaderSub?: string;
  refundTrustItems?: Array<{ icon: string; text: string }>;

  
  scheduleTagLine?: string;
    scheduleHeaderSub?: string;
    schedulePhaseLabels?: Array<{ label: string; color: string }>;
    scheduleNoteIcon?: string;
    scheduleNoteText?: string;
    scheduleStats?: Array<{ icon: string; num: string; label: string }>;
    scheduleQuoteText?: string;
    scheduleQuoteAuthor?: string;
    scheduleImg1Tag?: string;
    scheduleImg2Tag?: string;
  
  
  // Section 1 - What is Kundalini
  whatIsTitle: string;
  whatIsIntroItems?: IntroItem[];
  whatIsParagraphs?: string[];
  whatIsImage?: string;
  whatIsImageAlt?: string;
  
  // Section 2 - Activate & Benefits
  activateTitle: string;
  activateParagraphs: string[];
  activateImage?: string;
  activateImageAlt?: string;
  
  // Section 3 - Benefits Card
  benefitsTitle: string;
  benefitsIntro1: string;
  benefitsIntro2: string;
  benefitItems: string[];
  
  // Section 4 - Course Highlights
  highlightsTitle: string;
  highlightsIntro: string;
  highlightCards: HighlightCard[];
  
  // Section 5 - Syllabus/Curriculum
  syllabusBigTitle: string;
  syllabusSchool: string;
  courseOverviewTitle: string;
  courseOverviewPara: string;
  syllabusModules: SyllabusModule[];
  readingBoxTitle: string;
  readingBoxNote: string;
  readingItems: string[];
  noteBoxTitle: string;
  noteBoxPara: string;
  
  // Syllabus Header Dynamic Fields
  sylHeaderBgImage?: string;
  sylHeaderBgImageAlt?: string;
  sylBadges?: string[];
  courseOverviewBadgeText?: string;
  curriculumImage?: string;
  curriculumImageAlt?: string;
  
  // Section 6 - Eligibility
  eligibilityTitle: string;
  eligibilityParagraphs: string[];
  eligibilityImage?: string;
  eligibilityImageAlt?: string;
  eligibilityBadgeTitle?: string;
  eligibilityBadgeSub?: string;
  eligibilityChip1Num?: string;
  eligibilityChip1Label?: string;
  eligibilityChip2Num?: string;
  eligibilityChip2Label?: string;
  eligibilityPills?: Array<{ icon: string; text: string }>;
  
  // Section 7 - Location
  locationTitle: string;
  locationParagraphs: string[];
  locationBannerImage?: string;
  locationBannerImageAlt?: string;
  locationStackTopImage?: string;
  locationStackTopImageAlt?: string;
  locationStackTopLabel?: string;
  locationStackBottomImage?: string;
  locationStackBottomImageAlt?: string;
  locationStackBottomLabel?: string;
  locationStats?: Array<{ num: string; label: string }>;
  
  // Section 8 - Facilities
  facilitiesTitle: string;
  facilitiesIntro: string;
  facilitiesIntroRich: string;
  facilityItems: string[];
  facilitiesVideoUrl?: string;
  facilitiesVideoPoster?: string;
  facilitiesVideoTag?: string;
  facilitiesVideoText?: string;
  facilityIconCards?: Array<{ icon: string; label: string; desc: string }>;
  
  // Section 9 - Daily Schedule
  scheduleSectionTitle: string;
  scheduleItems: ScheduleItem[];
  schedImg1: string;
  schedImg2: string;
  
  // Section 10 - Why Choose AYM
  whyAYMTitle: string;
  whyCards: WhyCard[];
  classImage: string;
  
  // Section 11 - Why Rishikesh
  whyRishikeshTitle: string;
  spiritualTitle: string;
  spiritualPara: string;
  naturalTitle: string;
  naturalPara: string;
  typesTitle: string;
  typesItems: string[];
  topSchoolsTitle: string;
  topSchoolsPara: string;
  
  // Section 12 - Refund Policy
  refundTitle: string;
  refundItems: string[];
  
  // Course Info Card
  courseInfoCardTitle?: string;
  courseInfoFeeLabel?: string;
  courseInfoFeeFromText?: string;
  courseInfoBookBtnText?: string;
  courseInfoUsdPrice?: number;
  courseInfoInrPrice?: number;
  courseInfoOriginalUsdPrice?: number;
  courseInfoOriginalInrPrice?: number;
  courseInfoDetails?: Array<{ label: string; value: string; sub: string }>;
  
  // Hero
  heroImage: string;
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

type Currency = "USD" | "INR";

/* ─────────────────────────────────────────
   STATIC DEMO INTRO ITEMS (images + videos)
───────────────────────────────────────── */
const DEMO_INTRO_ITEMS: IntroItem[] = [
  {
    paragraph: `<strong>Kundalini Yoga</strong> is the yoga of awareness. It is a powerful and transformative practice that awakens the dormant spiritual energy within each of us. Unlike other forms of yoga that focus primarily on physical postures, Kundalini Yoga combines dynamic breathing techniques <strong>(pranayama)</strong>, meditation, mantra chanting, and specific sets of exercises called <strong>kriyas</strong> to elevate consciousness and unlock your full potential.`,
    media:
      "https://images.pexels.com/photos/3822725/pexels-photo-3822725.jpeg?auto=compress&cs=tinysrgb&w=800",
    mediaAlt: "Kundalini Yoga meditation practice",
    mediaType: "image",
  },
  {
    paragraph: `The practice works directly on the <strong>nervous system and endocrine system</strong>, balancing the chakras and clearing energetic blockages. As the kundalini energy — often described as a coiled serpent at the base of the spine — rises through the seven chakras, practitioners experience heightened awareness, emotional release, and spiritual awakening.`,
    media:
      "https://images.pexels.com/photos/8436560/pexels-photo-8436560.jpeg?auto=compress&cs=tinysrgb&w=800",
    mediaAlt: "Kundalini Yoga kriya practice",
    mediaType: "image",
  },
  {
    paragraph: `<strong>Regular practice of Kundalini Yoga</strong> offers numerous benefits: reduced stress and anxiety, improved mental clarity, increased vitality, emotional balance, and a deep sense of inner peace. The technology of Kundalini Yoga works quickly and effectively, making it accessible for both beginners and experienced practitioners seeking profound transformation.`,
    media: "https://cdn.pixabay.com/video/2021/02/04/63734-507693979_large.mp4",
    mediaAlt: "Kundalini Yoga breathwork demonstration",
    mediaType: "video",
  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const imgSrc = (path: string) =>
  path?.startsWith("/uploads/") ? `${BASE_URL}${path}` : (path ?? "");

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

function formatPrice(
  usdAmount: number,
  currency: Currency,
  rate: number,
): string {
  if (currency === "USD") {
    return `$${usdAmount}`;
  }
  const inr = Math.round((usdAmount * rate) / 100) * 100;
  return `₹${inr.toLocaleString("en-IN")}`;
}

// Date helpers for PremiumSeatBooking
const shortDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
};

const monthYear = (start: string) => {
  const s = new Date(start);
  return s.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/* ─────────────────────────────────────────
   MANDALA SVG COMPONENT
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  color1 = "#F15505",
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
  color = "#F15505",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
    />
    <circle
      cx="50"
      cy="50"
      r="36"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="50"
      cy="50"
      r="20"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.8"
    />
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
   ENHANCED INTRO SECTION (What is Kundalini Yoga)
───────────────────────────────────────── */
function EnhancedIntroSection({
  items,
  paragraphs,
}: {
  items?: IntroItem[];
  paragraphs?: string[];
}) {
  const displayItems = items && items.length > 0 ? items : DEMO_INTRO_ITEMS;
  const hasItems = displayItems.length > 0;

  if (!hasItems && (!paragraphs || paragraphs.length === 0)) {
    return null;
  }

  return (
    <div className={styles.enhancedIntroSection}>
      <div className={`container px-3 px-md-4 ${styles.maxx}`}>
        {hasItems ? (
          <div className={styles.introItemsWrapper}>
            {displayItems.map((item, index) => {
              const mediaUrl = item.media;
              const isVideo = item.mediaType === "video";

              return (
                <div
                  key={index}
                  className={`${styles.introItem} ${index % 2 === 1 ? styles.introItemReverse : ""}`}
                >
                  <div className={styles.introItemContent}>
                    <div
                      className={styles.introItemText}
                      dangerouslySetInnerHTML={{ __html: item.paragraph }}
                    />
                  </div>
                  <div className={styles.introItemMedia}>
                    {mediaUrl ? (
                      isVideo ? (
                        <video
                          src={mediaUrl}
                          className={styles.introItemVideo}
                          controls
                          playsInline
                          preload="metadata"
                          muted
                          loop
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={item.mediaAlt || `Kundalini Yoga ${index + 1}`}
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className={styles.introItemMediaPlaceholder}>
                        <ChakraSVG size={60} color="#F15505" />
                        <span>Kundalini Yoga</span>
                      </div>
                    )}
                    <div className={styles.introItemMediaOverlay}>
                      <span>{isVideo ? "▶" : "✦"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.introTextOnly}>
            {paragraphs?.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.currDrop} ref={ref}>
      <button
        className={styles.currDropBtn}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="listbox"
        type="button"
      >
        <span className={styles.currDropFlag}>
          {currency === "USD" ? "🇺🇸" : "🇮🇳"}
        </span>
        <span className={styles.currDropLabel}>
          {currency === "USD" ? "English" : "हिन्दी"}
        </span>
        <svg
          className={`${styles.currDropArrow} ${open ? styles.currDropArrowOpen : ""}`}
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M1 1l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className={styles.currDropMenu} role="listbox">
          {(["USD", "INR"] as Currency[]).map((c) => (
            <button
              key={c}
              className={`${styles.currDropItem} ${currency === c ? styles.currDropItemActive : ""}`}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              role="option"
              aria-selected={currency === c}
              type="button"
            >
              <span className={styles.currDropItemFlag}>
                {c === "USD" ? "🇺🇸" : "🇮🇳"}
              </span>
              <div className={styles.currDropItemText}>
                <span className={styles.currDropItemCode}>
                  {c === "USD" ? "English" : "हिन्दी"}
                </span>
                <span className={styles.currDropItemName}>
                  {c === "USD" ? "US Dollar" : "Indian Rupee"}
                </span>
              </div>
              {currency === c && (
                <svg
                  className={styles.currDropCheck}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   COURSE INFO CARD
═══════════════════════════════════════════ */
function CourseInfoCard({
  content,
  currency,
  rate,
}: {
  content: KundaliniContent;
  currency: Currency;
  rate: number;
}) {
  // Use independent pricing from content, not from seats
  const currentPrice = currency === "USD" 
    ? content.courseInfoUsdPrice || 999
    : content.courseInfoInrPrice || 82000;
  
  const originalPrice = currency === "USD"
    ? content.courseInfoOriginalUsdPrice || 1799
    : content.courseInfoOriginalInrPrice || 148000;

  const displayPrice = (): string => {
    if (currency === "USD") {
      return `$${currentPrice}`;
    }
    return `₹${currentPrice.toLocaleString("en-IN")}`;
  };

  const displayOriginalPrice = (): string => {
    if (currency === "USD") {
      return `$${originalPrice}`;
    }
    return `₹${originalPrice.toLocaleString("en-IN")}`;
  };

  const DurationIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
  const LevelIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="14" width="5" height="7" rx="1" />
      <rect x="9.5" y="9" width="5" height="12" rx="1" />
      <rect x="17" y="4" width="5" height="17" rx="1" />
    </svg>
  );
  const CertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 17v4M16 17v4M8 21h8" />
      <path d="M9 10l2 2 4-4" />
    </svg>
  );
  const StyleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 6v5.5" />
      <path d="M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5" />
      <path d="M10 18l-1.5 3.5M14 18l1.5 3.5" />
      <path d="M7 11l5 2.5 5-2.5" />
    </svg>
  );
  const LangIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
  const DateIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="16" cy="15" r="1" fill="currentColor" />
    </svg>
  );

  function getIconForLabel(label: string) {
    switch (label.toLowerCase()) {
      case "duration": return <DurationIcon />;
      case "level": return <LevelIcon />;
      case "certification": return <CertIcon />;
      case "yoga style": return <StyleIcon />;
      case "language": return <LangIcon />;
      case "date": return <DateIcon />;
      default: return <DurationIcon />;
    }
  }

  const details = (content.courseInfoDetails || [
    { label: "DURATION", value: "24 Days", sub: "" },
    { label: "LEVEL", value: "Beginner to Advanced", sub: "" },
    { label: "CERTIFICATION", value: "200 Hour", sub: "" },
    { label: "YOGA STYLE", value: "Kundalini Yoga", sub: "As taught by Yogi Bhajan" },
    { label: "LANGUAGE", value: "English & Hindi", sub: "" },
    { label: "DATE", value: "Check batches below", sub: "" },
  ]).map(detail => ({
    ...detail,
    icon: getIconForLabel(detail.label),
  }));

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>{content.courseInfoCardTitle || "COURSE DETAILS"}</span>
          </div>
          <div className={styles.icGrid}>
            {details.map((d, i) => (
              <div key={i} className={styles.icItem}>
                <div className={styles.icIcon}>{d.icon}</div>
                <div className={styles.icBody}>
                  <div className={styles.icLbl}>{d.label}</div>
                  <div className={styles.icVal}>{d.value}</div>
                  {d.sub && <div className={styles.icSub}>{d.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.icVDiv} />
        <div className={styles.icRight}>
          <div className={styles.icFeeTop}>
            <span className={styles.icFeeLbl}>{content.courseInfoFeeLabel || "COURSE FEE"}</span>
            <span className={styles.icFeeFrom}>{content.courseInfoFeeFromText || "starting from"}</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>{displayOriginalPrice()}</span>
            <span className={styles.icPriceNew}>{displayPrice()}</span>
            <span className={styles.icPriceCur}>{currency}</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            {content.courseInfoBookBtnText || "BOOK NOW"}
            <svg viewBox="0 0 20 20" fill="none" className={styles.icBtnArrow}>
              <path
                d="M4 10h12M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREMIUM SEAT BOOKING — with 500hr pricing logic
═══════════════════════════════════════════ */
function PremiumSeatBooking({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
}: {
  seats: KundaliniSeat[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvailable = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvailable) setSelectedId(firstAvailable._id);
  }, [seats]);

  const selected = seats.find((s) => s._id === selectedId) ?? null;

  /**
   * Core price formatter — mirrors 500hr logic exactly.
   * Priority for INR: stored inrFee → usdFee * rate → fallback dormPrice.
   * For USD: use usdFee string directly → fallback dormPrice.
   */
  const fmtPrice = (
    batch: KundaliniSeat | null,
    overrideUsd?: number,
  ): { amount: string; cur: string } => {
    if (!batch && overrideUsd === undefined) return { amount: "—", cur: currency };

    if (currency === "INR") {
      // Priority 1: stored inrFee
      if (batch?.inrFee) {
        const num = parseFloat(batch.inrFee.replace(/[₹,]/g, "").trim());
        if (!isNaN(num) && num > 100) {
          return { amount: `₹${num.toLocaleString("en-IN")}`, cur: "INR" };
        }
      }
      // Priority 2: usdFee * live rate
      const usdNum = batch
        ? parseFloat(batch.usdFee.replace(/[$,]/g, "")) || batch.dormPrice
        : overrideUsd ?? 0;
      const inr = Math.round(usdNum * rate);
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }

    // USD: use usdFee string directly
    if (batch?.usdFee) {
      const raw = batch.usdFee.trim();
      return { amount: raw.startsWith("$") ? raw : `$${raw}`, cur: "USD" };
    }
    // Fallback
    const fallback = overrideUsd ?? batch?.dormPrice ?? 0;
    return { amount: `$${fallback}`, cur: "USD" };
  };

  /**
   * Price shown on each batch card in the LEFT panel.
   * Uses usdFee-based pricing (same as 500hr batchCardPrice).
   */
  const batchCardPrice = (batch: KundaliniSeat): { amount: string; cur: string } =>
    fmtPrice(batch);

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>
          200 Hour Kundalini Yoga Teacher Training India
        </h2>
        <div className={styles.vintageHeadingUnderline}>
          <svg
            viewBox="0 0 200 8"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.headingUndSvg}
          >
            <path
              d="M0,4 Q50,0 100,4 Q150,8 200,4"
              stroke="#F15505"
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="100" cy="4" r="3" fill="#F15505" opacity="0.7" />
            <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
            <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          </svg>
        </div>
      </div>
      <p className={styles.psbSecSub}>
        Choose your dates &amp; preferred accommodation — prices include tuition
        and meals
      </p>
      <div className={styles.psbOrnLine}>
        <div className={styles.psbOrnL} />
        <div className={styles.psbOrnDiamond} />
        <div className={styles.psbOrnR} />
      </div>

      <div className={styles.psbLayout}>
        {/* LEFT PANEL */}
        <div className={styles.psbLeftPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
          <div className={styles.psbLph}>
            <span className={styles.psbLphTitle}>Select Your Batch</span>
            <div className={styles.psbLphRight}>
              <CurrencyDropdown
                currency={currency}
                onChange={onCurrencyChange}
              />
              <div className={styles.psbLegend}>
                <div className={styles.psbLegItem}>
                  <div className={`${styles.psbLegDot} ${styles.psbDGreen}`} />
                  Available
                </div>
                <div className={styles.psbLegItem}>
                  <div className={`${styles.psbLegDot} ${styles.psbDOrange}`} />
                  Limited
                </div>
                <div className={styles.psbLegItem}>
                  <div className={`${styles.psbLegDot} ${styles.psbDRed}`} />
                  Full
                </div>
              </div>
            </div>
          </div>

          {rateLoading && (
            <div className={styles.rateLoader}>
              <div className={styles.rateLoaderDot} />
              <span>Loading live exchange rate...</span>
            </div>
          )}

          {seats.length === 0 ? (
            <p className={styles.psbNoBatches}>
              No upcoming batches available at the moment.
            </p>
          ) : (
            <div className={styles.psbBatchGrid}>
              {seats.map((batch) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const dotCls = full
                  ? styles.psbDRed
                  : low
                    ? styles.psbDOrange
                    : styles.psbDGreen;
                const txtCls = full
                  ? styles.psbSRed
                  : low
                    ? styles.psbSOrange
                    : styles.psbSGreen;
                const statusTxt = full
                  ? "Fully Booked"
                  : low
                    ? "Limited"
                    : "Available";
                const seatsPercent = Math.max(
                  5,
                  (rem / batch.totalSeats) * 100,
                );
                const isSelected = selectedId === batch._id;
                // ✅ uses usdFee-based price, not dormPrice
                const cardPrice = batchCardPrice(batch);

                return (
                  <div
                    key={batch._id}
                    className={[
                      styles.psbBc,
                      full ? styles.psbBcFull : "",
                      isSelected ? styles.psbBcSel : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      if (!full) setSelectedId(batch._id);
                    }}
                  >
                    <div className={styles.psbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline
                          points="1.5,5 4,7.5 8.5,2.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.psbBcMonth}>
                      {monthYear(batch.startDate)}
                    </div>
                    <div className={styles.psbBcDates}>
                      {shortDateRange(batch.startDate, batch.endDate)}
                    </div>
                    {/* ✅ shows usdFee or usdFee*rate, not dormPrice */}
                    <div className={styles.psbBcPrice}>
                      {cardPrice.amount} <span>{cardPrice.cur}</span>
                    </div>
                    <div className={styles.psbBcStatus}>
                      <div className={`${styles.psbBcDot} ${dotCls}`} />
                      <span className={`${styles.psbBcStxt} ${txtCls}`}>
                        {statusTxt}
                      </span>
                    </div>
                    {!full && (
                      <>
                        <div className={styles.psbBcSeatsBar}>
                          <div
                            className={styles.psbBcSeatsBarFill}
                            style={{
                              width: `${seatsPercent}%`,
                              background: low
                                ? "linear-gradient(90deg,#c8700a,#e09030)"
                                : "linear-gradient(90deg,#3d6000,#6aa000)",
                            }}
                          />
                        </div>
                        <span
                          className={styles.psbBcSeatsBadge}
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

        {/* RIGHT PANEL */}
        <div className={styles.psbRightPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
          <div className={styles.psbRpHead}>
            <div className={styles.psbRpEyebrow}>Course Overview</div>
            <div className={styles.psbRpCourse}>
              200 Hour Kundalini Yoga Teacher Training
            </div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="rgba(255,243,210,0.8)"
                  strokeWidth="1.2"
                />
                <path
                  d="M8 4.5V8.5L10.5 10"
                  stroke="rgba(255,243,210,0.8)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span className={styles.psbRpDurTxt}>
                24 Days · Rishikesh, India
              </span>
            </div>
            <div className={styles.psbCurrBadge}>
              {currency === "USD" ? "🇺🇸 Prices in USD" : "🇮🇳 Prices in INR"}
            </div>
          </div>
          <div className={styles.psbRpBody}>
            <div className={styles.psbPriceLbl}>With Accommodation</div>
            <div className={styles.psbPriceRow}>
              {/* Private Room */}
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>
                  {selected
                    ? currency === "INR"
                      ? `₹${Math.round(selected.privatePrice * rate)}`
                      : `$${selected.privatePrice}`
                    : "—"}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              {/* Twin Room */}
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>
                  {selected
                    ? currency === "INR"
                      ? `₹${Math.round(selected.twinPrice * rate)}`
                      : `$${selected.twinPrice}`
                    : "—"}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>

            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>
                  {selected
                    ? currency === "INR"
                      ? `₹${Math.round(selected.dormPrice * rate)}`
                      : `$${selected.dormPrice}`
                    : "—"}
                </span>
                <span className={styles.psbPcCur}>{currency}</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>

            {/* ✅ Info row — mirrors 500hr logic exactly */}
            {selected && currency === "USD" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>USD Price</span>
                <span className={styles.psbInrAmt}>
                  {selected.usdFee.startsWith("$")
                    ? selected.usdFee
                    : `$${selected.usdFee}`}
                </span>
              </div>
            )}
            {selected && currency === "INR" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>
                  {(() => {
                    if (selected.inrFee) {
                      const num = parseFloat(
                        selected.inrFee.replace(/[₹,]/g, "").trim(),
                      );
                      if (!isNaN(num) && num > 100)
                        return `₹${num.toLocaleString("en-IN")}`;
                    }
                    const usdNum =
                      parseFloat(selected.usdFee.replace(/[$,]/g, "")) ||
                      selected.dormPrice;
                    const inr = Math.round(usdNum * rate);
                    return `₹${inr.toLocaleString("en-IN")}`;
                  })()}
                </span>
              </div>
            )}

            <div className={styles.psbDivider} />
            {selected && (
              <div className={styles.psbRpSeatsWrap}>
                {(() => {
                  const rem = selected.totalSeats - selected.bookedSeats;
                  const full = rem <= 0;
                  const low = !full && rem <= 5;
                  const pct = full
                    ? 100
                    : Math.round(
                        (selected.bookedSeats / selected.totalSeats) * 100,
                      );
                  return (
                    <>
                      <div className={styles.psbRpSeatsRow}>
                        <span className={styles.psbRpSeatsLbl}>
                          Seats Availability
                        </span>
                        <span
                          className={styles.psbRpSeatsBadge}
                          style={{
                            color: full
                              ? "#8a2c00"
                              : low
                                ? "#c8700a"
                                : "#3d6000",
                            borderColor: full
                              ? "#8a2c00"
                              : low
                                ? "#c8700a"
                                : "#3d6000",
                          }}
                        >
                          {full
                            ? "Fully Booked"
                            : `${rem} of ${selected.totalSeats} left`}
                        </span>
                      </div>
                      <div className={styles.psbRpSeatsBar}>
                        <div
                          className={styles.psbRpSeatsBarFill}
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
                    </>
                  );
                })()}
              </div>
            )}
            <div className={styles.psbSelDisplay}>
              {selected ? (
                <>
                  <div className={styles.psbSelLabel}>Selected Batch</div>
                  <div className={styles.psbSelDate}>
                    {shortDateRange(selected.startDate, selected.endDate)},{" "}
                    {monthYear(selected.startDate)}
                  </div>
                </>
              ) : (
                <span className={styles.psbSelHint}>
                  ← Select a batch to continue
                </span>
              )}
            </div>
            {/* ✅ Book Now button uses fmtPrice(selected) — same as 500hr */}
            {selected ? (
              <a
                href={`/yoga-registration?type=kundalini-200hr&batchId=${selected._id}`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPrice(selected).amount} {currency}
                <svg
                  className={styles.psbArrowIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="#fff3d2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>
                Book Now
              </span>
            )}
            {selected?.note && (
              <p className={styles.psbNote}>
                <strong>Note:</strong> {selected.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CURRENCY RATE HOOK
───────────────────────────────────────── */
function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    )
      .then((r) => r.json())
      .then((data) => {
        const inr = data?.usd?.inr;
        if (inr && typeof inr === "number") setRate(inr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
}

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
            background:
              "linear-gradient(90deg,#f0e8d8 25%,#e8dcc8 50%,#f0e8d8 75%)",
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
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

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
            background: "#F15505",
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

  // ✅ Define navigation items for sticky nav
  const NAV_ITEMS = [
    { label: "DATES & FEES", id: "dates-fees" },
    { label: "CURRICULUM", id: "curriculum" },
    { label: "BENEFITS", id: "benefits" },
    { label: "SCHEDULE", id: "schedule" },
    { label: "LOCATION", id: "location" },
  ];

  return (
    <div className={styles.page}>
      {/* ── Fixed Mandala Decorations ── */}

      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* SECTION 1 — HERO */}
      <section id="hero" className={styles.heroSection}>
        {content.heroImage && (
          <img
            src={imgSrc(content.heroImage)}
            alt="Yoga Students Group"
            className={styles.heroImage}
          />
        )}
      </section>

      {/* COURSE INFO CARD */}
      <CourseInfoCard content={content} currency={currency} rate={rate} />
      {/* ✅ STICKY NAVIGATION (from 100hr page) */}
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ══════════════════════════════════════
        SECTION 2 — WHAT IS KUNDALINI YOGA (Enhanced)
      ══════════════════════════════════════ */}
     <section className={`${styles.section} ${styles.sectionWarm}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    <div className={styles.whatIsBlock}>
      {/* Left: text content */}
      <div className={styles.whatIsLeft}>
        <div className={styles.whatIsInner}>
          <span className={styles.secTagline}>Ancient Wisdom · Modern Practice</span>
          <h2 className={styles.sectionTitleLeft}>{content.whatIsTitle}</h2>
          <div className={styles.underlineLeft} />
          <OmDivider centered={false} />
          <div className={styles.whatIsTextBody}>
            {content.whatIsParagraphs?.map((para, i) => (
              <div
                key={i}
                className={`${styles.bodyPara} ${i === 0 ? styles.whatIsFirstPara : ""}`}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
          <div className={styles.whatIsPills}>
            {[
              { icon: "🧘", text: "Awakens Kundalini Energy" },
              { icon: "🌬️", text: "Pranayama & Breathwork" },
              { icon: "🕉️", text: "Mantra & Meditation" },
              { icon: "⚡", text: "Chakra Activation" },
            ].map((pill, i) => (
              <div key={i} className={styles.whatIsPill}>
                <span className={styles.whatIsPillIcon}>{pill.icon}</span>
                <span className={styles.whatIsPillText}>{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: image - NOW DYNAMIC */}
      <div className={styles.whatIsRight}>
        <div className={styles.whatIsImgWrap}>
          <div className={styles.whatIsImgFrame} aria-hidden="true" />
          {content.whatIsImage ? (
            <img
              src={imgSrc(content.whatIsImage)}
              alt={content.whatIsImageAlt || "Kundalini Yoga meditation practice"}
              className={styles.whatIsImg}
              loading="lazy"
            />
          ) : (
            <div className={styles.whatIsImgPlaceholder}>
              <ChakraSVG size={80} color="#F15505" />
              <span>Kundalini Yoga Image</span>
            </div>
          )}
          <div className={styles.whatIsImgOverlay} />
          <div className={styles.whatIsImgBadge}>
            <ChakraSVG size={28} color="#f5c87a" />
            <div>
              <div className={styles.whatIsImgBadgeTitle}>Yoga of Awareness</div>
              <div className={styles.whatIsImgBadgeSub}>Transform · Awaken · Elevate</div>
            </div>
          </div>
          <div className={styles.whatIsFloatChip}>
            <span className={styles.whatIsFloatChipNum}>5000+</span>
            <span className={styles.whatIsFloatChipLabel}>Years of Tradition</span>
          </div>
        </div>
        {/* Decorative mandala behind image */}
        <div className={styles.whatIsMandalaDecor} aria-hidden="true">
          <MandalaSVG size={320} color1="rgba(241,85,5,0.12)" color2="rgba(212,160,23,0.09)" strokeW={0.6} />
        </div>
      </div>
    </div>
  </div>
</section>

     {/* SECTION 3 — ACTIVATE KUNDALINI (BENEFITS) */}
     <section id="benefits" className={`${styles.section} ${styles.sectionLight}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    <div className={styles.sectionChakra} aria-hidden="true">
      <ChakraSVG size={120} color="rgba(224,123,0,0.08)" />
    </div>

    {/* ── Activate Intro Row ── */}
    <h2 className={styles.sectionTitleCenter}>{content.activateTitle}</h2>
    <OmDivider />
    <div className={styles.activateIntroRow}>
      <div className={styles.activateIntroText}>
        {content.activateParagraphs?.map((para, i) =>
          i === 0 ? (
            <div key={i} className={styles.activatePullQuote}>
              <div dangerouslySetInnerHTML={{ __html: para }} />
            </div>
          ) : (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ),
        )}
      </div>
      <div className={styles.activateIntroImageWrap}>
        {content.activateImage ? (
          <img
            src={imgSrc(content.activateImage)}
            alt={content.activateImageAlt || "Kundalini Yoga practice"}
            className={styles.activateIntroImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.activateIntroImagePlaceholder}>
            <ChakraSVG size={60} color="#F15505" />
            <span>Kundalini Yoga Image</span>
          </div>
        )}
        <div className={styles.activateIntroImageBadge}>
          <ChakraSVG size={18} color="#f5c87a" />
          <span>Transform · Awaken · Evolve</span>
        </div>
      </div>
    </div>

    {/* ── Benefits Card ── */}
    <div className={styles.benefitsCardWrap}>
      <span className={styles.cardCorner}>✦</span>
      <h2 className={styles.sectionTitleCenter}>{content.benefitsTitle}</h2>
      <OmDivider />
      {content.benefitsIntro1 && (
        <p className={`${styles.bodyPara} ${styles.textCenter} ${styles.textItalic}`}>
          {content.benefitsIntro1}
        </p>
      )}
      {content.benefitsIntro2 && (
        <p className={`${styles.bodyPara} ${styles.textCenter} ${styles.textItalic}`}>
          {content.benefitsIntro2}
        </p>
      )}
      {content.benefitItems && content.benefitItems.length > 0 && (
        <div className={styles.benefitsGrid}>
          {content.benefitItems.map((benefit, i) => (
            <div key={i} className={styles.benefitGridCard}>
              <div className={styles.benefitGridNum}>{i + 1}</div>
              <p className={styles.benefitGridText}>{benefit}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* ── Highlights Card ── */}
    {content.highlightCards && content.highlightCards.length > 0 && (
      <div className={`${styles.vintageCard} mt-4`}>
        <span className={styles.cardCorner}>✦</span>
        <h2 className={styles.sectionTitleCenter}>
          {content.highlightsTitle}
        </h2>
        <OmDivider />
        {content.highlightsIntro && (
          <p className={styles.hlIntro}>{content.highlightsIntro}</p>
        )}
        <div className={styles.hlStrip}>
          {[
            { icon: "🧘", num: "200", label: "Hours Training" },
            { icon: "📅", num: "24", label: "Days Residential" },
            { icon: "👨‍🏫", num: "5+", label: "Expert Teachers" },
            { icon: "🌿", num: "3", label: "Meals Daily" },
            { icon: "📜", num: "RYT", label: "Certification" },
          ].map((s, i) => (
            <div key={i} className={styles.hlStripItem}>
              <span className={styles.hlStripIcon}>{s.icon}</span>
              <span className={styles.hlStripNum}>{s.num}</span>
              <span className={styles.hlStripLabel}>{s.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.activateHlGrid}>
          {content.highlightCards.map((h, i) => {
            const palette = [
              {
                color: "#F15505",
                bg: "rgba(241,85,5,.08)",
                tagColor: "#b85f00",
                tag: "Core Practice",
                icon: "🌅",
              },
              {
                color: "#1a6fa8",
                bg: "rgba(26,111,168,.08)",
                tagColor: "#0c447c",
                tag: "Pranayama",
                icon: "🌬",
              },
              {
                color: "#603ca0",
                bg: "rgba(96,60,160,.08)",
                tagColor: "#3c2870",
                tag: "Naad Yoga",
                icon: "🎵",
              },
              {
                color: "#2d7a2d",
                bg: "rgba(45,122,45,.08)",
                tagColor: "#1a4a1a",
                tag: "Student-Centred",
                icon: "🤝",
              },
              {
                color: "#c8890a",
                bg: "rgba(200,137,10,.08)",
                tagColor: "#7a5228",
                tag: "Community",
                icon: "🌐",
              },
              {
                color: "#8b0000",
                bg: "rgba(139,0,0,.08)",
                tagColor: "#5a0000",
                tag: "Advanced",
                icon: "🔥",
              },
            ];
            const p = palette[i % palette.length];
            const isWide =
              content.highlightCards.length % 2 !== 0 &&
              i === content.highlightCards.length - 1;
            return (
              <div
                key={h.id}
                className={`${styles.activateHlCard} ${isWide ? styles.activateHlCardWide : ""}`}
              >
                <div
                  className={styles.activateHlAccent}
                  style={{ background: p.color }}
                />
                <div className={styles.activateHlCardBody}>
                  <div className={styles.activateHlCardHead}>
                    <div
                      className={styles.activateHlIconWrap}
                      style={{
                        background: p.bg,
                        border: `1.5px solid ${p.color}33`,
                      }}
                    >
                      {p.icon}
                    </div>
                    <div className={styles.activateHlTitle}>{h.title}</div>
                  </div>
                  <div className={styles.activateHlDesc}>{h.desc}</div>
                  <span
                    className={styles.activateHlTag}
                    style={{
                      background: p.bg,
                      color: p.tagColor,
                      border: `1px solid ${p.color}33`,
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
</section>

      {/* SECTION 4 — SYLLABUS (CURRICULUM) */}
      <section id="curriculum" className={`${styles.section} ${styles.sectionWarm}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    <div className={styles.syllabusWrap}>
      <div className={styles.syllabusHeader}>
        <div className={styles.sylHeaderBg} aria-hidden="true" />
        <div className={styles.sylHeaderOverlay} aria-hidden="true" />
        <div className={styles.sylHeaderContent}>
          <h2 className={styles.syllabusBigTitle}>
            {content.syllabusBigTitle}
          </h2>
          <p className={styles.syllabusSchool}>
            {content.syllabusSchool}
          </p>
          <div className={styles.sylOmRow}>
            <span className={styles.sylOmLine} />
            <span className={styles.sylOmGlyph}>ॐ</span>
            <span className={styles.sylOmLine} />
          </div>
          <div className={styles.sylBadgeRow}>
            <span className={styles.sylBadge}>200 Hours</span>
            <span className={styles.sylBadge}>Rishikesh, India</span>
            <span className={styles.sylBadge}>
              Yoga Alliance Certified
            </span>
            <span className={styles.sylBadge}>24 Days</span>
          </div>
        </div>
      </div>
      <div className={styles.courseOverviewRow}>
        <div className={styles.courseOverviewLeft}>
          <h3 className={styles.overviewTitle}>
            {content.courseOverviewTitle}
          </h3>
          <div
            className={styles.bodyPara}
            style={{ marginBottom: 0 }}
            dangerouslySetInnerHTML={{
              __html: content.courseOverviewPara ?? "",
            }}
          />
        </div>
        <div className={styles.courseOverviewImgWrap}>
          {content.curriculumImage ? (
            <img
              src={imgSrc(content.curriculumImage)}
              alt={content.curriculumImageAlt || "Kundalini Yoga teacher training"}
              className={styles.courseOverviewImg}
              loading="lazy"
            />
          ) : (
            <div className={styles.courseOverviewImgPlaceholder}>
              <ChakraSVG size={60} color="#F15505" />
              <span>Curriculum Image</span>
            </div>
          )}
          <div className={styles.courseOverviewImgBadge}>
            <span>Learn · Practice · Teach</span>
          </div>
        </div>
      </div>
      <div className={styles.accordionWrap}>
        {content.syllabusModules?.map((item, i) => (
          <AccordionItem
            key={item.id}
            num={i + 1}
            title={item.title}
            items={item.items}
          />
        ))}
      </div>
      <div className={styles.sylBottomRow}>
        <div className={styles.readingBox}>
          <h3 className={styles.readingTitle}>
            {content.readingBoxTitle}
          </h3>
          <ul className={styles.readingList}>
            {content.readingItems?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          {content.readingBoxNote && (
            <p className={styles.bodyPara} style={{ marginTop: ".5rem" }}>
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
  </div>
</section>

      {/* SECTION 5 — ELIGIBILITY + LOCATION + FACILITIES */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    {/* Eligibility Block */}
    <div className={styles.eligibilityBlock}>
      <div className={styles.eligImgPanel}>
        {content.eligibilityImage ? (
          <img
            src={imgSrc(content.eligibilityImage)}
            alt={content.eligibilityImageAlt || "Yoga students"}
            className={styles.eligImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.eligImgPlaceholder}>
            <ChakraSVG size={60} color="#F15505" />
            <span>Eligibility Image</span>
          </div>
        )}
        <div className={styles.eligImgOverlay} />
        <div className={styles.eligImgBadge}>
          <span className={styles.eligBadgeIcon}>🌍</span>
          <div>
            <div className={styles.eligBadgeTitle}>{content.eligibilityBadgeTitle || "Open to All"}</div>
            <div className={styles.eligBadgeSub}>
              {content.eligibilityBadgeSub || "No prerequisites required"}
            </div>
          </div>
        </div>
        <div className={`${styles.eligChip} ${styles.eligChip1}`}>
          <span className={styles.eligChipNum}>{content.eligibilityChip1Num || "0"}</span>
          <span className={styles.eligChipLabel}>{content.eligibilityChip1Label || "Age Limit"}</span>
        </div>
        <div className={`${styles.eligChip} ${styles.eligChip2}`}>
          <span className={styles.eligChipNum}>{content.eligibilityChip2Num || "All"}</span>
          <span className={styles.eligChipLabel}>{content.eligibilityChip2Label || "Backgrounds"}</span>
        </div>
      </div>
      <div className={styles.eligContent}>
        <div className={styles.eligContentInner}>
          <div className={styles.secTagline}>WHO CAN JOIN</div>
          <h2 className={styles.sectionTitleLeft}>
            {content.eligibilityTitle}
          </h2>
          <div className={styles.underlineLeft} />
          {content.eligibilityParagraphs?.map((para, i) => (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
          <div className={styles.eligPills}>
            {(content.eligibilityPills || [
              { icon: "✓", text: "No prior yoga experience needed" },
              { icon: "✓", text: "No age restriction" },
              { icon: "✓", text: "All nationalities welcome" },
              { icon: "✓", text: "Open to all fitness levels" },
            ]).map((pill, i) => (
              <div key={i} className={styles.eligPill}>
                <span className={styles.eligPillIcon}>{pill.icon || "✓"}</span>
                <span>{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Location Block */}
    <div id="location" className={styles.locationBlock}>
      <div className={styles.locationBanner}>
        {content.locationBannerImage ? (
          <img
            src={imgSrc(content.locationBannerImage)}
            alt={content.locationBannerImageAlt || "Rishikesh mountains"}
            className={styles.locationBannerImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.locationBannerPlaceholder}>
            <ChakraSVG size={80} color="#F15505" />
            <span>Location Banner</span>
          </div>
        )}
        <div className={styles.locationBannerOverlay} />
        <div className={styles.locationBannerContent}>
          <div className={styles.secTaglineLight}>OUR SACRED HOME</div>
          <h2 className={styles.locationBannerTitle}>
            {content.locationTitle}
          </h2>
          <div className={styles.locationBannerDivider} />
          <div className={styles.locationStatRow}>
            {(content.locationStats || [
              { num: "3", label: "Rivers confluence" },
              { num: "2500+", label: "Metres altitude" },
              { num: "100+", label: "Years of yoga legacy" },
              { num: "∞", label: "Himalayan energy" },
            ]).map((stat, i) => (
              <div key={i} className={styles.locationStat}>
                <span className={styles.locationStatNum}>{stat.num}</span>
                <span className={styles.locationStatLabel}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.locationBody}>
        <div className={styles.locationText}>
          {content.locationParagraphs?.map((para, i) => (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
        <div className={styles.locationImgStack}>
          <div className={styles.locationStackTop}>
            {content.locationStackTopImage ? (
              <img
                src={imgSrc(content.locationStackTopImage)}
                alt={content.locationStackTopImageAlt || "Yoga class"}
                loading="lazy"
              />
            ) : (
              <div className={styles.locationStackPlaceholder}>
                <ChakraSVG size={40} color="#F15505" />
              </div>
            )}
            <div className={styles.locationStackLabel}>{content.locationStackTopLabel || "Practice Hall"}</div>
          </div>
          <div className={styles.locationStackBottom}>
            {content.locationStackBottomImage ? (
              <img
                src={imgSrc(content.locationStackBottomImage)}
                alt={content.locationStackBottomImageAlt || "Ashram view"}
                loading="lazy"
              />
            ) : (
              <div className={styles.locationStackPlaceholder}>
                <ChakraSVG size={40} color="#F15505" />
              </div>
            )}
            <div className={styles.locationStackLabel}>{content.locationStackBottomLabel || "Himalayan Setting"}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Facilities Block */}
    <div className={styles.facilitiesBlock}>
      <div className={styles.facilitiesHeader}>
        <span className={styles.cardCorner}>✦</span>
        <div className={styles.secTagline}>WHAT'S INCLUDED</div>
        <h2 className={styles.sectionTitleCenter}>
          {content.facilitiesTitle}
        </h2>
        <OmDivider />
        {content.facilitiesIntroRich ? (
          <div
            className={`${styles.bodyPara} ${styles.textCenter}`}
            style={{ maxWidth: 740, margin: "0 auto 1.5rem" }}
            dangerouslySetInnerHTML={{
              __html: content.facilitiesIntroRich,
            }}
          />
        ) : (
          content.facilitiesIntro && (
            <p
              className={`${styles.bodyPara} ${styles.textCenter}`}
              style={{ maxWidth: 740, margin: "0 auto 1.5rem" }}
            >
              {content.facilitiesIntro}
            </p>
          )
        )}
      </div>
      <div className={styles.facilitiesVideoBanner}>
        {content.facilitiesVideoUrl ? (
          <video
            className={styles.facilitiesVideo}
            autoPlay
            muted
            loop
            playsInline
            poster={content.facilitiesVideoPoster ? imgSrc(content.facilitiesVideoPoster) : undefined}
          >
            <source src={content.facilitiesVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className={styles.facilitiesVideoPlaceholder}>
            <ChakraSVG size={80} color="#F15505" />
            <span>Facilities Video</span>
          </div>
        )}
        <div className={styles.facilitiesVideoOverlay}>
          <div className={styles.facilitiesVideoText}>
            <span className={styles.facilitiesVideoTag}>
              {content.facilitiesVideoTag || "LIVE · BREATHE · GROW"}
            </span>
            <p>
              {content.facilitiesVideoText || "Everything you need for a transformative 24-day residential experience"}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.facilitiesIconGrid}>
        {(content.facilityIconCards || [
          { icon: "🏠", label: "Accommodation", desc: "Spacious furnished rooms with attached bathrooms" },
          { icon: "👨‍🏫", label: "Expert Guidance", desc: "Access to highly skilled yoga professionals" },
          { icon: "📚", label: "Study Materials", desc: "Online resources, yoga mats, books, and more" },
          { icon: "📹", label: "CCTV Security", desc: "24/7 surveillance for your safety & peace of mind" },
          { icon: "🕐", label: "24/7 Support", desc: "Around-the-clock management assistance" },
          { icon: "🎓", label: "Workshops", desc: "Seminars, workshops, and yoga-related events" },
          { icon: "🥤", label: "Detox Drinks", desc: "Fresh detox drinks and juices daily" },
          { icon: "🥗", label: "3 Meals Daily", desc: "Vegetarian and healthy meals three times a day" },
          { icon: "📶", label: "Free Wifi", desc: "Free wifi and 24/7 hot water service" },
          { icon: "📿", label: "Mala Provided", desc: "A piece of Mala gifted to every student" },
          { icon: "🌿", label: "Nature Excursions", desc: "Guided trips to elevate your experience" },
          { icon: "📜", label: "Certification", desc: "Yoga Alliance TTC certificate upon completion" },
        ]).map((fac, i) => (
          <div key={i} className={styles.facilityIconCard}>
            <div className={styles.facilityIconCircle}>
              <span className={styles.facilityIconEmoji}>{fac.icon}</span>
            </div>
            <div className={styles.facilityIconLabel}>{fac.label}</div>
            <div className={styles.facilityIconDesc}>{fac.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* SECTION 6 — DAILY SCHEDULE */}
      <section id="schedule" className={`${styles.section} ${styles.schedSection}`}>
  <div className={styles.schedBgTexture} aria-hidden="true" />
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    <div className={styles.schedHeaderWrap}>
      <div className={styles.secTagline}>{content.scheduleTagLine || "24-DAY RESIDENTIAL PROGRAM"}</div>
      <h2 className={styles.sectionTitleCenter}>
        {content.scheduleSectionTitle}
      </h2>
      <OmDivider />
      <p className={styles.schedHeaderSub}>
        {content.scheduleHeaderSub || "A carefully structured day balancing intense practice with rest, study &amp; spiritual integration."}
      </p>
    </div>
    <div className={styles.schedLayout}>
      <div className={styles.schedTimelineCol}>
        {(() => {
          const schedItems = content.scheduleItems ?? [];
          const phases = content.schedulePhaseLabels || [
            { label: "🌅 Morning Practice", color: "#e8720c" },
            { label: "☀️ Midday Session", color: "#c8890a" },
            { label: "🌙 Evening Practice", color: "#7a3a9a" }
          ];
          const third = Math.ceil(schedItems.length / 3);
          
          const phaseItems = [
            { ...phases[0], items: schedItems.slice(0, third) },
            { ...phases[1], items: schedItems.slice(third, third * 2) },
            { ...phases[2], items: schedItems.slice(third * 2) },
          ];
          
          return phaseItems.map((phase, pi) => (
            <div key={pi} className={styles.schedPhaseBlock}>
              <div
                className={styles.schedPhaseLabel}
                style={{
                  color: phase.color,
                  borderColor: phase.color,
                  background: `${phase.color}14`,
                }}
              >
                {phase.label}
              </div>
              <div className={styles.schedTimeline}>
                {phase.items.map((s, i) => (
                  <div key={s.id} className={styles.schedTimelineRow}>
                    <div className={styles.schedDotCol}>
                      <div
                        className={styles.schedDot}
                        style={{
                          borderColor: phase.color,
                          background: i === 0 ? phase.color : "#fff",
                        }}
                      />
                      {i < phase.items.length - 1 && (
                        <div
                          className={styles.schedLine}
                          style={{ background: `${phase.color}33` }}
                        />
                      )}
                    </div>
                    <div className={styles.schedRowContent}>
                      <span
                        className={styles.schedTimeBadge}
                        style={{ color: phase.color }}
                      >
                        {s.time}
                      </span>
                      <span className={styles.schedActivity}>
                        {s.activity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ));
        })()}
        <div className={styles.schedNoteStrip}>
          <span className={styles.schedNoteIcon}>{content.scheduleNoteIcon || "📌"}</span>
          <span className={styles.schedNoteText}>
            {content.scheduleNoteText || "Schedule may vary slightly by week. Self-study &amp; personal practice time is built into each day."}
          </span>
        </div>
      </div>
      <div className={styles.schedRightCol}>
        <div className={styles.schedImgGrid}>
          {content.schedImg1 && (
            <div className={styles.schedImgCard}>
              <img
                src={imgSrc(content.schedImg1)}
                alt="Daily schedule"
                className={styles.schedImg}
                loading="lazy"
              />
              <div className={styles.schedImgOverlay}>
                <span className={styles.schedImgTag}>
                  {content.scheduleImg1Tag || "Morning Practice"}
                </span>
              </div>
            </div>
          )}
          {content.schedImg2 && (
            <div className={styles.schedImgCard}>
              <img
                src={imgSrc(content.schedImg2)}
                alt="Daily practice"
                className={styles.schedImg}
                loading="lazy"
              />
              <div className={styles.schedImgOverlay}>
                <span className={styles.schedImgTag}>
                  {content.scheduleImg2Tag || "Evening Sadhana"}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={styles.schedStatsRow}>
          {(content.scheduleStats || [
            { icon: "⏰", num: "14+", label: "Hrs Practice" },
            { icon: "🧘", num: "3", label: "Sessions Daily" },
            { icon: "🌿", num: "3", label: "Meals Daily" },
            { icon: "📖", num: "4+", label: "Theory Hrs" },
          ]).map((stat, i) => (
            <div key={i} className={styles.schedStat}>
              <span className={styles.schedStatIcon}>{stat.icon}</span>
              <span className={styles.schedStatNum}>{stat.num}</span>
              <span className={styles.schedStatLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.schedQuoteCard}>
          <span className={styles.schedQuoteMark}>"</span>
          <p className={styles.schedQuoteText}>
            {content.scheduleQuoteText || "Sadhana is the foundation. When you practice every day with discipline and devotion, transformation becomes inevitable."}
          </p>
          <span className={styles.schedQuoteAuthor}>
            {content.scheduleQuoteAuthor || "— Yogi Bhajan"}
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* SECTION 7 — WHY CHOOSE AYM */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <div className={`container px-3 px-md-4 ${styles.maxx}`}>
          <div className={styles.whyHeroBanner}>
            <img
              src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="AYM Yoga School"
              className={styles.whyHeroBannerImg}
              loading="lazy"
            />
            <div className={styles.whyHeroBannerOverlay} />
            <div className={styles.whyHeroBannerContent}>
              <div className={styles.secTaglineLight}>THE AYM DIFFERENCE</div>
              <h2 className={styles.whyHeroBannerTitle}>
                {content.whyAYMTitle}
              </h2>
              <div className={styles.whyHeroBannerDivider} />
              <div className={styles.whyTrustBadgeRow}>
                {[
                  { icon: "🏆", text: "Yoga Alliance Certified" },
                  { icon: "🌍", text: "6000+ Graduates" },
                  { icon: "⭐", text: "Top Rated School" },
                  { icon: "📅", text: "Est. 2009" },
                ].map((b, i) => (
                  <div key={i} className={styles.whyTrustBadge}>
                    <span>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.whyCardGrid}>
            {content.whyCards?.map((card, i) => {
              const palette = [
                { accent: "#F15505", bg: "rgba(241,85,5,0.06)", icon: "🕉️" },
                { accent: "#1a6fa8", bg: "rgba(26,111,168,0.06)", icon: "📍" },
                { accent: "#2d7a2d", bg: "rgba(45,122,45,0.06)", icon: "🧑‍🏫" },
                { accent: "#c8890a", bg: "rgba(200,137,10,0.06)", icon: "📚" },
                { accent: "#7a3a9a", bg: "rgba(122,58,154,0.06)", icon: "✨" },
                { accent: "#8b1a1a", bg: "rgba(139,26,26,0.06)", icon: "🔥" },
              ];
              const p = palette[i % palette.length];
              return (
                <div
                  key={card.id}
                  className={styles.whyEnhCard}
                  style={
                    {
                      "--why-accent": p.accent,
                      "--why-bg": p.bg,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={styles.whyEnhCardAccent}
                    style={{ background: p.accent }}
                  />
                  <div className={styles.whyEnhCardBody}>
                    <div className={styles.whyEnhCardHead}>
                      <div
                        className={styles.whyEnhIconWrap}
                        style={{
                          background: p.bg,
                          borderColor: `${p.accent}44`,
                        }}
                      >
                        <span className={styles.whyEnhIcon}>{p.icon}</span>
                      </div>
                      <div
                        className={styles.whyEnhNum}
                        style={{ color: p.accent }}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div className={styles.whyEnhLabel}>{card.label}</div>
                    <div className={styles.whyEnhDesc}>{card.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.whyTestimonialStrip}>
            <div className={styles.whyTestimonialLeft}>
              <div className={styles.whyTestBigNum}>
                6,000<span>+</span>
              </div>
              <div className={styles.whyTestBigLabel}>
                Yoga teachers trained worldwide
              </div>
            </div>
            <div className={styles.whyTestimonialDivider} />
            <div className={styles.whyTestimonialRight}>
              <div className={styles.whyTestQuote}>
                "AYM completely transformed my understanding of Kundalini
                energy. The teachers are deeply knowledgeable and the setting in
                Rishikesh is magical."
              </div>
              <div className={styles.whyTestAuthor}>
                — Sarah M., United Kingdom
              </div>
            </div>
          </div>
          {content.classImage && (
            <div className={styles.whyClassImgWrap}>
              <img
                src={imgSrc(content.classImage)}
                alt="AYM Yoga School Kundalini class"
                className={styles.whyClassImg}
                loading="lazy"
              />
              <div className={styles.whyClassImgOverlay}>
                <div className={styles.whyClassImgCaption}>
                  <span className={styles.whyClassImgCaptionTag}>
                    OUR COMMUNITY
                  </span>
                  <span className={styles.whyClassImgCaptionText}>
                    Join a global family of conscious practitioners
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 8 — PREMIUM SEAT BOOKING
      ══════════════════════════════════════ */}
      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* SECTION 9 — WHY CHOOSE RISHIKESH + REFUND */}
      <section className={`${styles.section} ${styles.sectionLight} ${styles.sec9Wrap}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    {/* ── WHY RISHIKESH ── */}
    <div className={styles.whyRishikeshBlock}>
      {/* Full-width panorama banner */}
      <div className={styles.wrBanner}>
        {content.whyRishikeshBannerImage ? (
          <img
            src={imgSrc(content.whyRishikeshBannerImage)}
            alt={content.whyRishikeshBannerImageAlt || "Rishikesh Himalayan landscape"}
            className={styles.wrBannerImg}
            loading="lazy"
          />
        ) : (
          <div className={styles.wrBannerPlaceholder}>
            <ChakraSVG size={80} color="#F15505" />
            <span>Banner Image</span>
          </div>
        )}
        <div className={styles.wrBannerOverlay} />
        <div className={styles.wrBannerContent}>
          <span className={styles.wrBannerTag}>
            {content.whyRishikeshBannerTag || "Sacred City · Yoga Capital of the World"}
          </span>
          <h2 className={styles.wrBannerTitle}>
            {content.whyRishikeshTitle}
          </h2>
          <div className={styles.wrBannerDivider} />
          <div className={styles.wrBannerStats}>
            {(content.whyRishikeshBannerStats || [
              { num: "5000+", label: "Years of yoga heritage" },
              { num: "200+", label: "Ashrams & schools" },
              { num: "3", label: "Sacred rivers" },
              { num: "∞", label: "Himalayan serenity" },
            ]).map((s, i) => (
              <div key={i} className={styles.wrBannerStat}>
                <span className={styles.wrBannerStatNum}>{s.num}</span>
                <span className={styles.wrBannerStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column content area */}
      <div className={styles.wrBody}>
        {/* LEFT — Spiritual + Natural columns */}
        <div className={styles.wrLeft}>
          {content.spiritualTitle && (
            <div className={styles.wrPillar}>
              <div className={styles.wrPillarIcon}>{content.spiritualIcon || "🕉️"}</div>
              <div className={styles.wrPillarContent}>
                <h3 className={styles.wrPillarTitle}>{content.spiritualTitle}</h3>
                {content.spiritualPara && (
                  <div className={styles.wrPillarPara} dangerouslySetInnerHTML={{ __html: content.spiritualPara }} />
                )}
              </div>
            </div>
          )}
          {content.naturalTitle && (
            <div className={styles.wrPillar}>
              <div className={styles.wrPillarIcon}>{content.naturalIcon || "🌿"}</div>
              <div className={styles.wrPillarContent}>
                <h3 className={styles.wrPillarTitle}>{content.naturalTitle}</h3>
                {content.naturalPara && (
                  <div className={styles.wrPillarPara} dangerouslySetInnerHTML={{ __html: content.naturalPara }} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Types + Top Schools */}
        <div className={styles.wrRight}>
          {content.typesTitle && (
            <div className={styles.wrRightCard}>
              <div className={styles.wrRightCardHeader}>
                <span className={styles.wrRightCardIcon}>{content.typesIcon || "📋"}</span>
                <h3 className={styles.wrRightCardTitle}>{content.typesTitle}</h3>
              </div>
              {content.typesItems && content.typesItems.length > 0 && (
                <ul className={styles.wrTypesList}>
                  {content.typesItems.map((item, i) => (
                    <li key={i} className={styles.wrTypesItem}>
                      <span className={styles.wrTypesArrow}>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {content.topSchoolsTitle && (
            <div className={`${styles.wrRightCard} ${styles.wrRightCardAccent}`}>
              <div className={styles.wrRightCardHeader}>
                <span className={styles.wrRightCardIcon}>{content.topSchoolsIcon || "🏆"}</span>
                <h3 className={styles.wrRightCardTitle}>{content.topSchoolsTitle}</h3>
              </div>
              {content.topSchoolsPara && (
                <p className={styles.wrRightCardPara}>{content.topSchoolsPara}</p>
              )}
              <div className={styles.wrAymPill}>
                <span className={styles.wrAymPillDot} />
                <span>{content.aymPillText || "AYM Yoga School — Ranked among Rishikesh's finest"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── OM DIVIDER ── */}
    <OmDivider />

    {/* ── REFUND POLICY ── */}
    <div className={styles.refundBlock}>
      {/* Header */}
      <div className={styles.refundHeader}>
        <span className={styles.cardCorner}>✦</span>
        <div className={styles.secTagline}>{content.refundTagLine || "TRANSPARENCY & TRUST"}</div>
        <h2 className={styles.sectionTitleCenter}>{content.refundTitle}</h2>
        <OmDivider />
        <p className={styles.refundHeaderSub}>
          {content.refundHeaderSub || "We believe in clear, fair policies. Here's everything you need to know about our cancellation terms."}
        </p>
      </div>

      {/* Policy grid */}
      <div className={styles.refundGrid}>
        {(content.refundItems || []).map((policy, i) => {
          const icons = content.refundIcons || ["💰", "❌", "📧", "⚠️"];
          const colors = content.refundColors || [
            { color: "#3d6000", bg: "rgba(61,96,0,0.07)", border: "rgba(61,96,0,0.2)" },
            { color: "#8a2c00", bg: "rgba(138,44,0,0.07)", border: "rgba(138,44,0,0.2)" },
            { color: "#1a6fa8", bg: "rgba(26,111,168,0.07)", border: "rgba(26,111,168,0.2)" },
            { color: "#c8890a", bg: "rgba(200,137,10,0.07)", border: "rgba(200,137,10,0.2)" }
          ];
          const a = colors[i % colors.length];
          return (
            <div key={i} className={styles.refundCard} style={
              { "--rc-color": a.color, "--rc-bg": a.bg, "--rc-border": a.border } as React.CSSProperties
            }>
              <div className={styles.refundCardAccentBar} style={{ background: a.color }} />
              <div className={styles.refundCardBody}>
                <div className={styles.refundCardHead}>
                  <div className={styles.refundCardIconWrap} style={{ background: a.bg, border: `1.5px solid ${a.border}` }}>
                    <span className={styles.refundCardIcon}>{icons[i % icons.length]}</span>
                  </div>
                  <span className={styles.refundCardNum} style={{ color: a.color }}>0{i + 1}</span>
                </div>
                <p className={styles.refundCardText}>{policy}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom trust note */}
      <div className={styles.refundTrustStrip}>
        {(content.refundTrustItems || [
          { icon: "📩", text: "All cancellations must be made via email" },
          { icon: "🔒", text: "Your deposit secures your seat" },
          { icon: "🔄", text: "Flexible rebooking to future batches" }
        ]).map((item, i) => (
          <React.Fragment key={i}>
            <div className={styles.refundTrustItem}>
              <span className={styles.refundTrustIcon}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
            {i < (content.refundTrustItems?.length || 3) - 1 && <div className={styles.refundTrustDivider} />}
          </React.Fragment>
        ))}
      </div>
    </div>

    <OmDivider />
  </div>
</section>
      <PremiumGallerySection type="both" backgroundColor="warm" />
      {/* ✅ REVIEWS — now a reusable separate component */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

      <HowToReach />
    </div>
  );
}