"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "@/assets/style/vinyasa-teacher-training-india/Ashtangavinyasattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface SeatBatch {
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

interface Testimonial {
  _id: string;
  name: string;
  from: string;
  initials: string;
  quote: string;
}

// interface PageData {
//   heroImage: string;
//   heroImgAlt: string;
//   promoImage: string;
//   pageH1Title: string;
//   introMainPara: string;

//   courseDetailsTitle: string;
//   courseDetailsIntro1: string;
//   courseDetailsIntro2: string;
//   learnItems: string[];

//   whoCanApplyTitle: string;
//   whoCanApplyPara1: string;
//   whoCanApplyPara2: string;
//   whoItems: string[];

//   promoSchoolLabel: string;
//   promoHeading: string;
//   promoLocation: string;
//   promoFeeLabel: string;
//   promoFeeAmount: string;
//   promoBtnLabel: string;
//   promoBtnHref: string;

//   certTeachersTitle: string;
//   certTeachersPara: string;
//   certTeachersPara2: string;
//   certTeachersParagraphs: string[];

//   communityTitle: string;
//   communityPara: string;
//   communityParagraphs: string[];

//   accommodationTitle: string;
//   accommodationPara1: string;
//   accommodationParagraphs: string[];

//   certCardTitle: string;
//   certCardPara: string;
//   certDeepTitle: string;
//   certDeepPara: string;

//   schedBookLabel: string;
//   schedRegisterText: string;
//   schedPayText: string;
//   schedDepositAmount: string;
//   schedPayBtnLabel: string;
//   schedPayBtnHref: string;

//   testimSectionTitle: string;
//   testimIntroText: string;
//   testimonials: Testimonial[];

//   courseInfoCardTitle: string;
//   courseInfoFeeLabel: string;
//   courseInfoFeeFromText: string;
//   courseInfoBookBtnText: string;
//   courseInfoUsdPrice: number;
//   courseInfoInrPrice: number;
//   courseInfoOriginalUsdPrice: number;
//   courseInfoOriginalInrPrice: number;
//   courseInfoDetails: Array<{
//     label: string;
//     value: string;
//     sub: string;
//   }>;
//   courseDetailsImage: string;
//   courseDetailsImageAlt: string;
//   whoCanApplyVideo: string;
// }
interface PageData {
  // Hero Section
  heroImage: string;
  communityPlaceholderImage?: string; 
  heroImgAlt: string;
  promoImage: string;
  pageH1Title: string;
  introMainPara: string;


  certTeachersPlaceholderImage?: string;  // Optional fallback

  accommodationPlaceholderImage?: string;  // Optional fallback


  // Course Details Section
  courseDetailsTitle: string;
  courseDetailsIntro1: string;
  courseDetailsIntro2: string;
  courseDetailsImage: string;
  courseDetailsImageAlt: string;
  learnItems: string[];

  // Who Can Apply Section
  whoCanApplyTitle: string;
  whoCanApplyPara1: string;
  whoCanApplyPara2: string;
  whoCanApplyVideo: string;  // Changed from whoCanApplyVideoUrl to match backend
  whoItems: string[];

  // Promo Banner Section
  promoSchoolLabel: string;
  promoHeading: string;
  promoLocation: string;
  promoFeeLabel: string;
  promoFeeAmount: string;
  promoBtnLabel: string;
  promoBtnHref: string;

  // Certified Teachers Section
  certTeachersTitle: string;
  certTeachersPara: string;
  certTeachersPara2: string;
  certTeachersParagraphs: string[];
  certTeachersImage?: string;  // Optional - add if you have this
  certTeachersImageAlt?: string;  // Optional - add if you have this

  // Community Section
  communityTitle: string;
  communityPara: string;
  communityParagraphs: string[];
  communityImage?: string;  // Optional - add if you have this
  communityImageAlt?: string;  // Optional - add if you have this

  // Accommodation Section
  accommodationTitle: string;
  accommodationPara1: string;
  accommodationParagraphs: string[];
  accommodationImage?: string;  // Optional - add if you have this
  accommodationImageAlt?: string;  // Optional - add if you have this

  // Certification Section
  certCardTitle: string;
  certCardPara: string;
  certDeepTitle: string;
  certDeepPara: string;

  // Schedule Section
  schedBookLabel: string;
  schedRegisterText: string;
  schedPayText: string;
  schedDepositAmount: string;
  schedPayBtnLabel: string;
  schedPayBtnHref: string;

  // Testimonial Section
  testimSectionTitle: string;
  testimIntroText: string;
  testimonials: Testimonial[];

  // Course Info Card Section
  courseInfoCardTitle: string;
  courseInfoFeeLabel: string;
  courseInfoFeeFromText: string;
  courseInfoBookBtnText: string;
  courseInfoUsdPrice: number;
  courseInfoInrPrice: number;
  courseInfoOriginalUsdPrice: number;
  courseInfoOriginalInrPrice: number;
  courseInfoDetails: Array<{
    label: string;
    value: string;
    sub: string;
  }>;
}

type Currency = "USD" | "INR";

/* ─────────────────────────────────────────
   HELPER: Get Full URL
───────────────────────────────────────── */
const getFullUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
  return BASE_URL + path;
};

/* ─────────────────────────────────────────
   DATE FORMATTER
───────────────────────────────────────── */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return (
    s.toLocaleDateString("en-IN", opts) +
    " – " +
    e.toLocaleDateString("en-IN", opts)
  );
};

const shortDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
};

const monthYear = (start: string) => {
  return new Date(start).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

/* ─────────────────────────────────────────
   CURRENCY HOOK
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
        if (data?.usd?.inr) setRate(data.usd.inr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { rate, loading };
}

function formatPrice(usd: number, currency: Currency, rate: number) {
  if (currency === "USD") return `$${usd}`;
  const inr = Math.round((usd * rate) / 100) * 100;
  return `₹${inr.toLocaleString("en-IN")}`;
}

/* ─────────────────────────────────────────
   HTML RENDERER
───────────────────────────────────────── */
function Html({ html, className }: { html: string; className?: string }) {
  if (!html || html.trim() === "" || html === "<p><br></p>") return null;
  const clean = html.replace(/<p>/g, "").replace(/<\/p>/g, " ").trim();
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}

function RenderParas({
  paragraphs,
  fallbacks,
  className,
}: {
  paragraphs: string[];
  fallbacks?: string[];
  className?: string;
}) {
  const validParas = (paragraphs || []).filter(
    (p) => p && p.trim() !== "" && p !== "<p><br></p>",
  );
  if (validParas.length > 0) {
    return (
      <>
        {validParas.map((para, i) => (
          <Html key={i} html={para} className={className} />
        ))}
      </>
    );
  }
  const validFallbacks = (fallbacks || []).filter(
    (p) => p && p.trim() !== "" && p !== "<p><br></p>",
  );
  return (
    <>
      {validFallbacks.map((para, i) => (
        <Html key={i} html={para} className={className} />
      ))}
    </>
  );
}

/* ─────────────────────────────────────────
   CURRENCY DROPDOWN
───────────────────────────────────────── */
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
        <div className={styles.currDropMenu}>
          {(["USD", "INR"] as Currency[]).map((c) => (
            <button
              key={c}
              className={`${styles.currDropItem} ${currency === c ? styles.currDropItemActive : ""}`}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
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

/* ─────────────────────────────────────────
   SVG ICONS FOR COURSE INFO CARD
───────────────────────────────────────── */
const DurationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const LevelIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="14" width="5" height="7" rx="1" />
    <rect x="9.5" y="9" width="5" height="12" rx="1" />
    <rect x="17" y="4" width="5" height="17" rx="1" />
  </svg>
);
const CertIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 17v4M16 17v4M8 21h8" />
    <path d="M9 10l2 2 4-4" />
  </svg>
);
const StyleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="4" r="1.5" />
    <path d="M12 6v5.5" />
    <path d="M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5" />
    <path d="M10 18l-1.5 3.5M14 18l1.5 3.5" />
    <path d="M7 11l5 2.5 5-2.5" />
  </svg>
);
const LangIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const DateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
);

/* ─────────────────────────────────────────
   COURSE INFO CARD (Dynamic)
───────────────────────────────────────── */
function CourseInfoCard({
  seats,
  currency,
  rate,
  pageData,
}: {
  seats: SeatBatch[];
  currency: Currency;
  rate: number;
  pageData: PageData | null;
}) {
  const available = seats.filter((s) => s.totalSeats - s.bookedSeats > 0);
  
  const currentUsdPrice = pageData?.courseInfoUsdPrice ?? 
    (available.length > 0 ? Math.min(...available.map((s) => s.dormPrice)) : 699);
  const currentInrPrice = pageData?.courseInfoInrPrice ?? currentUsdPrice * 83;
  const originalUsdPrice = pageData?.courseInfoOriginalUsdPrice ?? 
    Math.round((currentUsdPrice * 1.8) / 50) * 50;
  const originalInrPrice = pageData?.courseInfoOriginalInrPrice ?? originalUsdPrice * 83;

  const formatPriceForCard = (usdPrice: number, inrPrice: number): string => {
    if (currency === "USD") return `$${usdPrice}`;
    const inr = Math.round(inrPrice / 100) * 100;
    return `₹${inr.toLocaleString("en-IN")}`;
  };

  const getCourseDetails = () => {
    if (pageData?.courseInfoDetails && pageData.courseInfoDetails.length > 0) {
      return pageData.courseInfoDetails.map((detail: any) => ({
        icon: getIconForLabel(detail.label),
        label: detail.label,
        value: detail.value,
        sub: detail.sub || "",
      }));
    }
    return [
      { icon: <DurationIcon />, label: "DURATION", value: "26 Days", sub: "" },
      { icon: <LevelIcon />, label: "LEVEL", value: "All Levels", sub: "" },
      { icon: <CertIcon />, label: "CERTIFICATION", value: "200 Hour", sub: "" },
      { icon: <StyleIcon />, label: "YOGA STYLE", value: "Ashtanga Vinyasa", sub: "Flow & Dynamic Practice" },
      { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi", sub: "" },
      { icon: <DateIcon />, label: "DATE", value: "Multiple Batches Available", sub: "" },
    ];
  };

  const getIconForLabel = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("duration")) return <DurationIcon />;
    if (labelLower.includes("level")) return <LevelIcon />;
    if (labelLower.includes("certif")) return <CertIcon />;
    if (labelLower.includes("style") || labelLower.includes("yoga")) return <StyleIcon />;
    if (labelLower.includes("language")) return <LangIcon />;
    if (labelLower.includes("date")) return <DateIcon />;
    return <DurationIcon />;
  };

  const details = getCourseDetails();
  const cardTitle = pageData?.courseInfoCardTitle || "COURSE DETAILS";
  const feeLabel = pageData?.courseInfoFeeLabel || "COURSE FEE";
  const feeFromText = pageData?.courseInfoFeeFromText || "starting from";
  const bookBtnText = pageData?.courseInfoBookBtnText || "BOOK NOW";

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>{cardTitle}</span>
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
            <span className={styles.icFeeLbl}>{feeLabel}</span>
            <span className={styles.icFeeFrom}>{feeFromText}</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>
              {formatPriceForCard(originalUsdPrice, originalInrPrice)}
            </span>
            <span className={styles.icPriceNew}>
              {formatPriceForCard(currentUsdPrice, currentInrPrice)}
            </span>
            <span className={styles.icPriceCur}>{currency}</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            {bookBtnText}
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

/* ─────────────────────────────────────────
   VINTAGE HEADING
───────────────────────────────────────── */
function VintageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.vintageHeadingWrap}>
      <h2 className={styles.vintageHeading}>{children}</h2>
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
  );
}

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDividerNew}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        <LotusChakra size={28} color="#F15505" />
        {label && <span className={styles.omDividerLabel}>{label}</span>}
      </div>
      <div className={styles.divLineRight} />
    </div>
  );
}

function SimpleDivider() {
  return (
    <div className={styles.simpleDivider}>
      <span className={styles.omLine} />
    </div>
  );
}

/* ─────────────────────────────────────────
   LOTUS CHAKRA
───────────────────────────────────────── */
function LotusChakra({
  size = 60,
  color = "#F15505",
}: {
  size?: number;
  color?: string;
}) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
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
        r="32"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.6"
      />
      <circle
        cx="50"
        cy="50"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.8"
      />
      <circle cx="50" cy="50" r="7" fill={color} opacity="0.45" />
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={50 + 20 * Math.cos(rad)}
            y1={50 + 20 * Math.sin(rad)}
            x2={50 + 44 * Math.cos(rad)}
            y2={50 + 44 * Math.sin(rad)}
            stroke={color}
            strokeWidth="1"
            opacity="0.55"
          />
        );
      })}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="20"
        fill={color}
        fontFamily="serif"
        opacity="0.9"
      >
        ॐ
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────
   MANDALA SVG
───────────────────────────────────────── */
function MandalaSVG({
  size = 300,
  c1 = "#F15505",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) {
  const circles = [145, 125, 106, 88, 70, 52, 36, 22, 10];
  const lines: number[][] = [
    [150, 5, 150, 295],
    [5, 150, 295, 150],
    [47, 47, 253, 253],
    [253, 47, 47, 253],
    [10, 100, 290, 200],
    [10, 200, 290, 100],
    [100, 10, 200, 290],
    [200, 10, 100, 290],
  ];
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke={c1} strokeWidth={sw}>
        {circles.map((r, i) => (
          <circle key={i} cx="150" cy="150" r={r} />
        ))}
      </g>
      <g fill="none" stroke={c2} strokeWidth={sw * 0.65} opacity="0.45">
        {lines.map((d, i) => (
          <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
        ))}
      </g>
      <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.25">
        {petals.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const px = 150 + 60 * Math.cos(rad),
            py = 150 + 60 * Math.sin(rad);
          return (
            <ellipse
              key={deg}
              cx={px}
              cy={py}
              rx="18"
              ry="8"
              transform={`rotate(${deg},${px},${py})`}
            />
          );
        })}
      </g>
      <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
      <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   CORNER ORNAMENT
───────────────────────────────────────── */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flipMap: Record<string, string> = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  };
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flipMap[pos] }}
    >
      <path
        d="M2,2 L2,18 M2,2 L18,2"
        stroke="#b8860b"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M2,2 Q8,8 16,2 Q8,8 2,16"
        stroke="#b8860b"
        strokeWidth="0.7"
        fill="none"
      />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   SEATS CELL
───────────────────────────────────────── */
function SeatsCell({ booked, total }: { booked: number; total: number }) {
  if (booked >= total)
    return <span className={styles.fullyBooked}>Fully Booked</span>;
  return (
    <span className={styles.seatsAvailable}>
      {total - booked} / {total} Seats
    </span>
  );
}

/* ─────────────────────────────────────────
   PULSE DOT
───────────────────────────────────────── */
function PulseDot() {
  return <span className={styles.pulseDot} />;
}

/* ─────────────────────────────────────────
   DYNAMIC VIDEO (with local file support)
───────────────────────────────────────── */
function DynamicVideo({ url, className }: { url: string; className?: string }) {
  const [videoError, setVideoError] = useState(false);
  
  // Check if it's a local file path
  if (url && !url.startsWith('http') && !url.includes('youtube') && !url.includes('youtu.be') && !url.includes('instagram')) {
    const fullUrl = getFullUrl(url);
    if (!videoError && fullUrl) {
      return (
        <video
          src={fullUrl}
          className={className || styles.videoFrame}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          style={{ pointerEvents: "none" }}
        />
      );
    }
    if (videoError) {
      return (
        <div className={styles.videoPlaceholder}>
          <span>🎥</span>
          <p>Video not available</p>
        </div>
      );
    }
  }
  
  // Handle YouTube/Instagram URLs
  let embedUrl = "";
  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;
  } else if (url.includes("shorts")) {
    const id = url.split("shorts/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;
  } else if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;
  } else if (url.includes("instagram.com/reel")) {
    const match = url.match(/reel\/([^/?]+)/);
    if (match) embedUrl = `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  
  if (!embedUrl) return null;
  return (
    <iframe
      src={embedUrl}
      className={className || styles.videoFrame}
      title="Yoga Video"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
      style={{ pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────
   TEXT IMAGE ROW (with proper URL handling)
───────────────────────────────────────── */
function TextImageRow({
  title,
  children,
  imageUrl,
  imageAlt,
  badge,
  reverse = false,
}: {
  title?: string;
  children: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  reverse?: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const fullImageUrl = getFullUrl(imageUrl);
  
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>
        {title && <VintageHeading>{title}</VintageHeading>}
        {children}
      </div>
      <div className={styles.tiImageWrap}>
        <div className={styles.tiImageFrame}>
          {fullImageUrl && !imageError ? (
            <img
              src={fullImageUrl}
              alt={imageAlt}
              className={styles.tiImage}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <span>🖼️</span>
              <p>Image not available</p>
            </div>
          )}
          <div className={styles.tiImageOverlay} />
          {badge && <div className={styles.tiImageBadge}>{badge}</div>}
          <div className={styles.tiImageCornerTl} />
          <div className={styles.tiImageCornerBr} />
        </div>
        <div className={styles.tiDotGrid} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.tiDot} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TEXT VIDEO ROW (with proper URL handling)
───────────────────────────────────────── */
function TextVideoRow({
  title,
  children,
  videoUrl,
  reverse = false,
}: {
  title?: string;
  children: React.ReactNode;
  videoUrl: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>
        {title && <VintageHeading>{title}</VintageHeading>}
        {children}
      </div>
      <div className={styles.tiVideoWrap}>
        <div className={styles.tiVideoFrame}>
          <DynamicVideo url={videoUrl} className={styles.videoFrame} />
          <div className={styles.tiVideoBadge}>
            <PulseDot /> Live Classes
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PREMIUM SEAT BOOKING
═══════════════════════════════════════════ */
function PremiumSeatBooking({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
}: {
  seats: SeatBatch[];
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

  const fmtPrice = (
    batch: SeatBatch | null,
    overrideUsd?: number,
  ): { amount: string; cur: string } => {
    if (!batch && overrideUsd === undefined) return { amount: "—", cur: currency };

    if (currency === "INR") {
      if (batch?.inrFee) {
        const num = parseFloat(batch.inrFee.replace(/[₹,]/g, "").trim());
        if (!isNaN(num) && num > 100) {
          return { amount: `₹${num.toLocaleString("en-IN")}`, cur: "INR" };
        }
      }
      const usdNum = batch
        ? parseFloat(batch.usdFee.replace(/[$,]/g, "")) || batch.dormPrice
        : overrideUsd ?? 0;
      const inr = Math.round(usdNum * rate);
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }

    if (batch?.usdFee) {
      const raw = batch.usdFee.trim();
      return { amount: raw.startsWith("$") ? raw : `$${raw}`, cur: "USD" };
    }
    const fallback = overrideUsd ?? batch?.dormPrice ?? 0;
    return { amount: `$${fallback}`, cur: "USD" };
  };

  const batchCardPrice = (batch: SeatBatch): { amount: string; cur: string } =>
    fmtPrice(batch);

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className="container px-3 px-md-4">
        <div className={styles.psbSecTag}>Upcoming Batches · 2025–2026</div>
        <VintageHeading>
          Ashtanga Vinyasa Yoga Teacher Training Rishikesh
        </VintageHeading>
        <p className={styles.psbSecSub}>
          Choose your dates &amp; preferred accommodation — prices include
          tuition and meals
        </p>
        <div className={styles.psbOrnLine}>
          <div className={styles.psbOrnL} />
          <div className={styles.psbOrnDiamond} />
          <div className={styles.psbOrnR} />
        </div>

        <div className={styles.psbLayout}>
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
                  const seatsPercent = Math.max(5, (rem / batch.totalSeats) * 100);
                  const isSelected = selectedId === batch._id;
                  const cardPrice = batchCardPrice(batch);

                  return (
                    <div
                      key={batch._id}
                      className={[
                        styles.psbBc,
                        full ? styles.psbBcFull : "",
                        isSelected ? styles.psbBcSel : "",
                      ].filter(Boolean).join(" ")}
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

          <div className={styles.psbRightPanel}>
            <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
            <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
            <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
            <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
            <div className={styles.psbRpHead}>
              <div className={styles.psbRpEyebrow}>Course Overview</div>
              <div className={styles.psbRpCourse}>
                Ashtanga Vinyasa Yoga Teacher Training
              </div>
              <div className={styles.psbRpDur}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                  <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className={styles.psbRpDurTxt}>
                  26 Days · Rishikesh, India
                </span>
              </div>
              <div className={styles.psbCurrBadge}>
                {currency === "USD" ? "🇺🇸 Prices in USD" : "🇮🇳 Prices in INR"}
              </div>
            </div>
            <div className={styles.psbRpBody}>
              <div className={styles.psbPriceLbl}>With Accommodation</div>
              <div className={styles.psbPriceRow}>
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

              {selected && currency === "USD" && (
                <div className={styles.psbInrRow}>
                  <span className={styles.psbInrLbl}>USD Price</span>
                  <span className={styles.psbInrAmt}>
                    {selected.usdFee.startsWith("$") ? selected.usdFee : `$${selected.usdFee}`}
                  </span>
                </div>
              )}
              {selected && currency === "INR" && (
                <div className={styles.psbInrRow}>
                  <span className={styles.psbInrLbl}>Indian Price</span>
                  <span className={styles.psbInrAmt}>
                    {(() => {
                      if (selected.inrFee) {
                        const num = parseFloat(selected.inrFee.replace(/[₹,]/g, "").trim());
                        if (!isNaN(num) && num > 100)
                          return `₹${num.toLocaleString("en-IN")}`;
                      }
                      const usdNum = parseFloat(selected.usdFee.replace(/[$,]/g, "")) || selected.dormPrice;
                      const inr = Math.round(usdNum * rate);
                      return `₹${inr.toLocaleString("en-IN")}`;
                    })()}
                  </span>
                </div>
              )}

              <div className={styles.psbDivider} />
              {selected && (() => {
                const rem = selected.totalSeats - selected.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const pct = full ? 100 : Math.round((selected.bookedSeats / selected.totalSeats) * 100);
                return (
                  <div className={styles.psbRpSeatsWrap}>
                    <div className={styles.psbRpSeatsRow}>
                      <span className={styles.psbRpSeatsLbl}>Seats Availability</span>
                      <span className={styles.psbRpSeatsBadge} style={{
                        color: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                        borderColor: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
                      }}>
                        {full ? "Fully Booked" : `${rem} of ${selected.totalSeats} left`}
                      </span>
                    </div>
                    <div className={styles.psbRpSeatsBar}>
                      <div className={styles.psbRpSeatsBarFill} style={{
                        width: `${pct}%`,
                        background: full ? "#8a2c00" : low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)",
                      }} />
                    </div>
                  </div>
                );
              })()}
              <div className={styles.psbSelDisplay}>
                {selected ? (
                  <>
                    <div className={styles.psbSelLabel}>Selected Batch</div>
                    <div className={styles.psbSelDate}>
                      {shortDateRange(selected.startDate, selected.endDate)}, {monthYear(selected.startDate)}
                    </div>
                  </>
                ) : (
                  <span className={styles.psbSelHint}>← Select a batch to continue</span>
                )}
              </div>
              {selected ? (
                <a href={`/yoga-registration?batchId=${selected._id}&type=vinyasa`} className={styles.psbBookBtn}>
                  Book Now — {fmtPrice(selected).amount} {currency}
                  <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ) : (
                <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
              )}
              {selected?.note && <p className={styles.psbNote}><strong>Note:</strong> {selected.note}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AshtangaVinyasaTTC() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  const defaultVideoUrl = "https://youtube.com/shorts/X-4RQYlTRtk?si=auhdk5e01w1b66M1";

  useEffect(() => {
    Promise.all([api.get("/ashtanga-vinyasa-ttc/"), api.get("/vinyasa-seats")])
      .then(([pageRes, seatsRes]) => {
        setPageData(pageRes.data.data ?? null);
        setSeats(seatsRes.data.data ?? []);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", fontFamily: "serif", color: "#8b4513" }}>
        Loading…
      </div>
    );
  }

  if (!pageData) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", fontFamily: "serif", color: "#8b4513" }}>
        No data found.
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={420} c1="#F15505" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={380} c1="#d4a017" c2="#F15505" sw={0.42} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={220} c1="#F15505" c2="#d4a017" sw={0.56} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={220} c1="#d4a017" c2="#F15505" sw={0.56} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      <section className={styles.heroSection}>
        {pageData.heroImage && (
          <img
            src={getFullUrl(pageData.heroImage)}
            alt={pageData.heroImgAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        )}
      </section>

      <CourseInfoCard seats={seats} currency={currency} rate={rate} pageData={pageData} />
      
      <section className={styles.section + " " + styles.sectionLight}>
        <div className="container px-3 px-md-4">
          <div className={styles.heroTitleRow}>
            <h1 className={styles.heroTitle}>{pageData.pageH1Title}</h1>
          </div>
          <SimpleDivider />

          <Html html={pageData.introMainPara} className={styles.bodyPara} />

          <TextImageRow
            title={pageData.courseDetailsTitle}
            imageUrl={pageData.courseDetailsImage}
            imageAlt={pageData.courseDetailsImageAlt || "Ashtanga Vinyasa Yoga Teacher Training"}
            badge="Rishikesh, India"
          >
            <Html html={pageData.courseDetailsIntro1} className={styles.bodyPara} />
            <Html html={pageData.courseDetailsIntro2} className={styles.bodyPara} />
            <div className={styles.learnGrid}>
              {pageData.learnItems.map((item, i) => (
                <div key={i} className={styles.learnItem}>
                  <span className={styles.learnNum}>{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </TextImageRow>

          <div className={styles.sectionSpacer} />
          <TextVideoRow
            title={pageData.whoCanApplyTitle}
            videoUrl={pageData.whoCanApplyVideo || defaultVideoUrl}
            reverse={true}
          >
            <Html html={pageData.whoCanApplyPara1} className={styles.bodyPara} />
            <Html html={pageData.whoCanApplyPara2} className={styles.bodyPara} />
            <div className={styles.whoList}>
              {pageData.whoItems.map((item, i) => (
                <div key={i} className={styles.whoItem}>
                  <span className={styles.whoDot} />
                  <span>{i + 1}. {item}</span>
                </div>
              ))}
            </div>
          </TextVideoRow>
        </div>
      </section>

      <section className={styles.section + " " + styles.sectionWarm}>
  <div className="container px-3 px-md-4">
    <OmDivider />

    {/* Promo Banner - already dynamic */}
    <div className={styles.promoBanner}>
      <div className={styles.promoImgSide}>
        {pageData.promoImage && (
          <img
            src={getFullUrl(pageData.promoImage)}
            alt="Vinyasa Yoga Teacher Training Rishikesh class"
            className={styles.promoImg}
            loading="lazy"
          />
        )}
        <div className={styles.promoImgOverlay} />
      </div>
      <div className={styles.promoTextSide}>
        <p className={styles.promoSmall}>{pageData.promoSchoolLabel}</p>
        <h2 className={styles.promoHeading}>{pageData.promoHeading}</h2>
        <p className={styles.promoLocation}>{pageData.promoLocation}</p>
        <div className={styles.promoDivLine} />
        <p className={styles.promoFee}>
          {pageData.promoFeeLabel} <strong>{pageData.promoFeeAmount}</strong>
        </p>
        <a href={pageData.promoBtnHref || "#dates-fees"} className={styles.promoBtn}>
          {pageData.promoBtnLabel}
        </a>
      </div>
    </div>

    <OmDivider />

    {/* Certified Teachers — text left, dynamic image right */}
    <TextImageRow
      title={pageData.certTeachersTitle}
      imageUrl={pageData.certTeachersImage || pageData.certTeachersPlaceholderImage || ""}
      imageAlt={pageData.certTeachersImageAlt || "Certified Yoga Teachers Rishikesh"}
      badge="Expert Teachers"
    >
      <RenderParas
        paragraphs={pageData.certTeachersParagraphs}
        fallbacks={[pageData.certTeachersPara, pageData.certTeachersPara2]}
        className={styles.bodyPara}
      />
    </TextImageRow>

    <div className={styles.sectionSpacer} />

    {/* Community — text right, dynamic image left */}
    <TextImageRow
      title={pageData.communityTitle}
      imageUrl={pageData.communityImage || pageData.communityPlaceholderImage || ""}
      imageAlt={pageData.communityImageAlt || "Yoga Community Rishikesh"}
      badge="Global Community"
      reverse={true}
    >
      <RenderParas
        paragraphs={pageData.communityParagraphs}
        fallbacks={[pageData.communityPara]}
        className={styles.bodyPara}
      />
    </TextImageRow>

    <div className={styles.sectionSpacer} />

    {/* Accommodation — text left, dynamic image right */}
    <TextImageRow
      title={pageData.accommodationTitle}
      imageUrl={pageData.accommodationImage || pageData.accommodationPlaceholderImage || ""}
      imageAlt={pageData.accommodationImageAlt || "Yoga Accommodation Rishikesh"}
      badge="Comfortable Stay"
    >
      <Html html={pageData.accommodationPara1} className={styles.bodyPara} />
      <RenderParas
        paragraphs={pageData.accommodationParagraphs}
        className={styles.bodyPara}
      />
    </TextImageRow>
  </div>
</section>

      <section className={styles.section + " " + styles.sectionDeep}>
        <div className="container px-3 px-md-4">
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>{pageData.certCardTitle}</h2>
            <div className={styles.cardUnderline} />
            <Html html={pageData.certCardPara} className={styles.bodyPara} />
            <h3 className={styles.subHeading}>{pageData.certDeepTitle}</h3>
            <div className={styles.subUnderline} />
            <Html html={pageData.certDeepPara} className={styles.bodyPara} />
          </div>
        </div>
      </section>

      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      <PremiumGallerySection type="both" backgroundColor="warm" />
      <ReviewSection  courseType="vinyasa-yoga-teacher-training" RatingsSummaryComponent={<RatingsSummarySection />} />
      <HowToReach />
    </div>
  );
}