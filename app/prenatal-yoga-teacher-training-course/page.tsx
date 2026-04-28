"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/prenatal-yoga-teacher-training-course/Pregnancyyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import StickySectionNav from "@/components/common/StickySectionNav";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
/* Helper function to add autoplay and loop parameters to YouTube URLs */

/* Helper function to process YouTube URLs for autoplay and loop */
function processYouTubeUrl(url: string): string {
  if (!url) return "";
  
  // Check if it's a YouTube embed URL
  const isYouTube = url.includes("youtube.com/embed/") || url.includes("youtu.be/");
  
  if (!isYouTube) return url;
  
  // Extract base URL without query params
  const baseUrl = url.split("?")[0];
  
  // Extract video ID
  const videoIdMatch = baseUrl.match(/\/(embed\/|)([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[2] : null;
  
  // Build new URL with autoplay and loop parameters
  const params = new URLSearchParams();
  params.set("autoplay", "1");
  params.set("loop", "1");
  params.set("mute", "1");
  params.set("controls", "1");
  params.set("playsinline", "1");
  params.set("modestbranding", "1");
  params.set("rel", "0");
  
  if (videoId) {
    params.set("playlist", videoId);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

function getYouTubeEmbedWithAutoplay(url: string): string {
  if (!url) return "";
  
  // Check if it's a YouTube URL
  const isYouTube = url.includes("youtube.com/embed/") || url.includes("youtu.be/");
  
  if (!isYouTube) return url;
  
  // Remove any existing query parameters
  let baseUrl = url.split("?")[0];
  
  // Add autoplay and loop parameters
  // Note: For YouTube loops to work, you need to specify a playlist parameter (same as video ID)
  const videoId = extractYouTubeId(url);
  const params = new URLSearchParams();
  params.set("autoplay", "1");
  params.set("loop", "1");
  params.set("mute", "1");
  params.set("controls", "1");
  params.set("playsinline", "1");
  params.set("modestbranding", "1");
  params.set("rel", "0");
  
  // For loop to work, playlist must be set to the same video ID
  if (videoId) {
    params.set("playlist", videoId);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/* Helper function to extract YouTube video ID */
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


interface Batch {
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
  note?: string;
}

interface HeroGridImage {
  _id: string;
  url: string;
  alt: string;
}

interface ScheduleItem {
  _id: string;
  time: string;
  activity: string;
}

interface CurriculumItem {
  _id: string;
  title: string;
  hours: string;
}

interface HoursSummaryItem {
  _id: string;
  label: string;
  value: string;
}

interface HeroGridImage {
  _id: string;
  url: string;
  alt: string;
}

interface ScheduleItem {
  _id: string;
  time: string;
  activity: string;
}



interface FeatureStat {
  num: string;
  label: string;
}


interface CurriculumItem {
  _id: string;
  title: string;
  hours: string;
}

interface HoursSummaryItem {
  _id: string;
  label: string;
  value: string;
}

interface PageData {
  _id: string;
  slug: string;
  status: string;
  onlineVideoPoster?: string;
  // Hero Section
  pageTitleH1: string;
  heroImage: string;
  heroImgAlt: string;

  
  onlineVideoUrl: string;       // External video URL (YouTube/Vimeo)
  onlineVideoType: "local" | "url" | "none";  // Type of video source
  

       // External video URL (YouTube/Vimeo)
  featuresVideoType: "local" | "url" | "none";  // Type of video source
     // Text below the video
 
  onlineHeaderSubtitle?: string;
  onlineHighlightsTitle?: string;
  onlineHighlights?: Array<{ icon: string; text: string }>;
  onlineVideoFile?: string;
  onlineVideoLabel?: string;
  onlineBonusIcon?: string;
  onlineBonusTitle?: string;
  onlineBonusText?: string;
  onlineCtaLabel?: string;
  onlineCtaSub?: string;
  onlineCtaBtnText?: string;
  onlineCtaBtnUrl?: string;
  // Intro Section
  introSectionTitle: string;
  introPara1: string;
  introPara2: string;
  introPara3: string;
  introExtraParagraphs: string[];
  heroGridImages: HeroGridImage[];
  
  // Features Section
  featuresSectionTitle: string;
  featuresSuperLabel: string;
  featuresPara1: string;
  featuresPara2: string;
  featuresExtraParagraphs: string[];
  featuresVideoUrl?: string;
  featuresVideoLabel?: string;
  featuresPills?: string[];
  featuresStats?: FeatureStat[];
  
  // Location Section
  locationSubTitle: string;
  locationPara: string;
  locationImage: string;
  schedule: ScheduleItem[];
  locationBadges?: string[];
  locationMapEmbedUrl?: string;
  locationMapLabel?: string;
  
  // Batch Section
  batchSectionTitle: string;
  joinBtnText: string;
  joinBtnUrl: string;
  
  featuresVideoFile?: string;  // Changed from featuresVideoUrl
  // Costs Section
  costsSectionTitle: string;
  costsPara: string;
  costsExtraParagraphs: string[];
  
  // Online Section
  onlineSectionTitle: string;
  onlinePara: string;
  onlineExtraParagraphs: string[];
  curriculum: CurriculumItem[];
  hoursSummary: HoursSummaryItem[];
  
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
}

type Currency = "USD" | "INR";

const NAV_ITEMS = [
  { label: "INTRO", id: "intro" },
  { label: "FEATURES", id: "features" },
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "COSTS", id: "costs" },
  { label: "ONLINE", id: "online" },
  { label: "GALLERY", id: "gallery" },
  { label: "REVIEWS", id: "reviews" },
  { label: "LOCATION", id: "location" },
];

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

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function imgSrc(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = new Date(start).toLocaleDateString("en-IN", opts);
  const e = new Date(end).toLocaleDateString("en-IN", opts);
  return `${s} - ${e}`;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

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
   MANDALA SVG
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  c1 = "#F15505",
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
    <g fill="none" stroke={c2} strokeWidth={sw * 0.5} opacity="0.2">
      <ellipse cx="150" cy="150" rx="145" ry="62" />
      <ellipse cx="150" cy="150" rx="62" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="95" />
      <ellipse cx="150" cy="150" rx="95" ry="145" />
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw * 0.38} opacity="0.18">
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
   CORNER ORNAMENT
───────────────────────────────────────── */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flip }}
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
   PREMIUM SEAT BOOKING — with Kundalini pricing logic
═══════════════════════════════════════════ */
function PremiumSeatBooking({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
}: {
  seats: Batch[];
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
   * Core price formatter — mirrors Kundalini logic exactly.
   * Priority for INR: stored inrFee → usdFee * rate → fallback dormPrice.
   * For USD: use usdFee string directly → fallback dormPrice.
   */
  const fmtPriceAdvanced = (
    batch: Batch | null,
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
   * Uses usdFee-based pricing (same as Kundalini batchCardPrice).
   */
  const batchCardPrice = (batch: Batch): { amount: string; cur: string } =>
    fmtPriceAdvanced(batch);

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>
          Prenatal Yoga Teacher Training India
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
              Prenatal Yoga Teacher Training
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

            {/* ✅ Info row — mirrors Kundalini logic exactly */}
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
            {/* ✅ Book Now button uses fmtPriceAdvanced(selected) — same as Kundalini */}
            {selected ? (
              <a
                href={`/yoga-registration?batchId=${selected._id}&type=prenatal`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPriceAdvanced(selected).amount} {currency}
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

/* ═══════════════════════════════════════════
   COURSE INFO CARD
═══════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   COURSE INFO CARD (DYNAMIC)
═══════════════════════════════════════════ */
const DurationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const LevelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="14" width="5" height="7" rx="1" />
    <rect x="9.5" y="9" width="5" height="12" rx="1" />
    <rect x="17" y="4" width="5" height="17" rx="1" />
  </svg>
);

const CertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 17v4M16 17v4M8 21h8" />
    <path d="M9 10l2 2 4-4" />
  </svg>
);

const StyleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="4" r="1.5" />
    <path d="M12 6v5.5" />
    <path d="M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5" />
    <path d="M10 18l-1.5 3.5M14 18l1.5 3.5" />
    <path d="M7 11l5 2.5 5-2.5" />
  </svg>
);

const LangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const DateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
);

function CourseInfoCard({ data }: { data: PageData }) {
  const getIconForLabel = (label: string) => {
    switch (label.toLowerCase()) {
      case "duration": return <DurationIcon />;
      case "level": return <LevelIcon />;
      case "certification": return <CertIcon />;
      case "style": return <StyleIcon />;
      case "yoga style": return <StyleIcon />;
      case "language": return <LangIcon />;
      case "date": return <DateIcon />;
      default: return <DurationIcon />;
    }
  };

  const details = (data.courseInfoDetails || [
    { label: "DURATION", value: "24 Days", sub: "" },
    { label: "LEVEL", value: "Beginner to Advanced", sub: "" },
    { label: "CERTIFICATION", value: "85 Hour", sub: "" },
    { label: "STYLE", value: "Prenatal Yoga", sub: "Hatha & Kundalini Based" },
    { label: "LANGUAGE", value: "English & Hindi", sub: "" },
    { label: "DATE", value: "Check batches below", sub: "" },
  ]).map((detail) => ({
    ...detail,
    icon: getIconForLabel(detail.label),
  }));

  const displayPrice = (currency: string = "USD", isOriginal: boolean = false) => {
    if (isOriginal) {
      if (currency === "USD") {
        return `$${data.courseInfoOriginalUsdPrice || 799}`;
      }
      return `₹${(data.courseInfoOriginalInrPrice || 66000).toLocaleString("en-IN")}`;
    }
    if (currency === "USD") {
      return `$${data.courseInfoUsdPrice || 399}`;
    }
    return `₹${(data.courseInfoInrPrice || 33000).toLocaleString("en-IN")}`;
  };

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>{data.courseInfoCardTitle || "COURSE DETAILS"}</span>
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
            <span className={styles.icFeeLbl}>{data.courseInfoFeeLabel || "COURSE FEE"}</span>
            <span className={styles.icFeeFrom}>{data.courseInfoFeeFromText || "starting from"}</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>{displayPrice("USD", true)}</span>
            <span className={styles.icPriceNew}>{displayPrice("USD", false)}</span>
            <span className={styles.icPriceCur}>USD</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            {data.courseInfoBookBtnText || "BOOK NOW"}
            <svg viewBox="0 0 20 20" fill="none" className={styles.icBtnArrow}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
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
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function PregnancyYogaTTC() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  /* ── Fetch Page Content ── */
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data } = await api.get("/prenatal-page");
        if (data?.success && data?.data) {
          setPageData(data.data);
        } else {
          setError("Content not available.");
        }
      } catch {
        setError("Failed to load page content.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchPage();
  }, []);

  /* ── Fetch Batches ── */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/prenatal-seats");
        setBatches(data?.data || []);
      } catch (err) {
        console.error("Batch fetch error:", err);
      } finally {
        setBatchLoading(false);
      }
    };
    fetchBatches();
  }, []);

  if (pageLoading) return <PageSkeleton />;
  if (error || !pageData) {
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
      {/* ── Fixed Mandala Decorations ── */}
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO IMAGE with id="hero" for StickySectionNav ══ */}
      {pageData.heroImage && (
        <section id="hero" className={styles.heroSection}>
          <img
            src={imgSrc(pageData.heroImage)}
            alt={pageData.heroImgAlt || "Prenatal Yoga"}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ══ COURSE INFO CARD ══ */}
      <CourseInfoCard data={pageData} />
      {/* ══ STICKY SECTION NAV — exactly like 300hr page ══ */}
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ══════════════════════════════════════
          SECTION 1 — INTRO + HERO GRID IMAGES
      ══════════════════════════════════════ */}
      <section id="intro" className={`${styles.section} ${styles.sectionLight}`}>
        <div className={`container px-3 px-md-4 ${styles.maxx}`}>
          {/* Page Title */}
          {pageData.pageTitleH1 && (
            <div className={styles.s1TitleRow}>
              <span className={styles.s1TitleFlower}>✿</span>
              <h1 className={styles.heroTitle}>{pageData.pageTitleH1}</h1>
              <span className={styles.s1TitleFlower}>✿</span>
            </div>
          )}
          <div className={styles.titleUnderline} />
          <OmDivider />

          {pageData.introSectionTitle && (
            <h2 className={styles.sectionTitle}>
              {pageData.introSectionTitle}
            </h2>
          )}

          {/* Paragraphs — 2 col newspaper layout */}
          <div className={styles.s1Paras}>
            {pageData.introPara1 && (
              <div
                className={`${styles.bodyPara} ${styles.s1FirstPara}`}
                dangerouslySetInnerHTML={{ __html: pageData.introPara1 }}
              />
            )}
            {pageData.introPara2 && (
              <div
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: pageData.introPara2 }}
              />
            )}
            {pageData.introPara3 && (
              <div
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: pageData.introPara3 }}
              />
            )}
            {pageData.introExtraParagraphs?.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>

          {/* Image Grid */}
          {pageData.heroGridImages?.length > 0 && (
            <div className={styles.s1Grid}>
              {pageData.heroGridImages.map((img, idx) => (
                <div
                  key={img._id}
                  className={`${styles.s1Cell} ${idx === 0 ? styles.s1CellFeatured : ""}`}
                >
                  <img
                    src={imgSrc(img.url)}
                    alt={img.alt || "Prenatal yoga"}
                    className={styles.s1Img}
                    loading="eager"
                  />
                  <div className={styles.s1Overlay} />
                  {img.alt && (
                    <div className={styles.s1Caption}>
                      <span>{img.alt}</span>
                    </div>
                  )}
                  <div className={styles.s1CornerTL} />
                  <div className={styles.s1CornerBR} />
                </div>
              ))}
            </div>
          )}

          {/* Footer ornament */}
          <div className={styles.s1Footer}>
            <span className={styles.s1FooterPetal}>❧</span>
            <span className={styles.s1FooterLine} />
            <span className={styles.s1FooterPetal}>❧</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — FEATURES + LOCATION + SCHEDULE
      ══════════════════════════════════════ */}
     <section id="features" className={`${styles.section} ${styles.sectionWarm}`}>
  <div className={`container px-3 px-md-4 ${styles.maxx}`}>
    {/* ── Features Header ── */}
    {pageData.featuresSectionTitle && (
      <>
        <h2 className={styles.sectionTitle}>
          {pageData.featuresSectionTitle}
        </h2>
        <div className={styles.titleUnderline} />
      </>
    )}

    {/* ── Super Label as styled badge ── */}
    {pageData.featuresSuperLabel && (
      <div className={styles.s2BadgeRow}>
        <span className={styles.s2Badge}>
          {pageData.featuresSuperLabel}
        </span>
      </div>
    )}

    {/* ── Feature paragraphs + side decorative panel ── */}
    <div className={styles.s2FeaturesWrap}>
      {/* Left: paragraphs */}
      <div className={styles.s2FeaturesText}>
        {pageData.featuresPara1 && (
          <div
            className={`${styles.bodyPara} ${styles.s2FirstPara}`}
            dangerouslySetInnerHTML={{ __html: pageData.featuresPara1 }}
          />
        )}
        {pageData.featuresPara2 && (
          <div
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{ __html: pageData.featuresPara2 }}
          />
        )}
        {pageData.featuresExtraParagraphs?.map((para, i) => (
          <div
            key={i}
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {/* Dynamic highlight pills */}
        <div className={styles.s2Pills}>
          {(pageData.featuresPills || [
            "Garbh Sanskar",
            "Pranayama",
            "Meditation",
            "Anatomy",
            "Teaching Practice",
            "Postnatal Care",
          ]).map((tag) => (
            <span key={tag} className={styles.s2Pill}>
              {tag}
            </span>
          ))}
        </div>
      </div>

     {/* Right: Dynamic video embed panel (Local Video or External URL) */}
<div className={styles.s2MediaPanel}>
  <div className={styles.s2VideoWrap}>
    {pageData.featuresVideoType === "local" && pageData.featuresVideoFile ? (
      <video
        className={styles.s2Video}
        controls
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={imgSrc(pageData.featuresVideoFile)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : pageData.featuresVideoType === "url" && pageData.featuresVideoUrl ? (
      <iframe
        className={styles.s2Video}
        src={getYouTubeEmbedWithAutoplay(pageData.featuresVideoUrl)}
        title="Prenatal Yoga Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <div className={styles.s2VideoPlaceholder}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M9 8l6 4-6 4V8z" />
        </svg>
        <span>Video Coming Soon</span>
      </div>
    )}
    <div className={styles.s2VideoFrame} />
  </div>
  <div className={styles.s2MediaLabel}>
    <span className={styles.s2MediaIcon}>▶</span>
    <span>{pageData.featuresVideoLabel || "Watch Our Prenatal Yoga Sessions"}</span>
  </div>
  {/* Dynamic stat badges */}
  <div className={styles.s2Stats}>
    {(pageData.featuresStats || [
      { num: "85+", label: "Hours Training" },
      { num: "500+", label: "Graduates" },
      { num: "15+", label: "Years Experience" }
    ]).map((stat, idx) => (
      <React.Fragment key={idx}>
        <div className={styles.s2Stat}>
          <span className={styles.s2StatNum}>{stat.num}</span>
          <span className={styles.s2StatLbl}>{stat.label}</span>
        </div>
        {idx < (pageData.featuresStats?.length || 3) - 1 && (
          <div className={styles.s2StatDiv} />
        )}
      </React.Fragment>
    ))}
  </div>
</div>
    </div>

    {/* ══ Location + Schedule Card ══ */}
    {(pageData.locationSubTitle || pageData.schedule?.length > 0) && (
      <div className={styles.s2LocationCard}>
        {/* Card top accent bar */}
        <div className={styles.s2CardAccent} />
        <span className={styles.s2CardCorner}>✦</span>

        {pageData.locationSubTitle && (
          <>
            <h2 className={styles.subSectionTitle}>
              {pageData.locationSubTitle}
            </h2>
            <div className={styles.subUnderline} />
          </>
        )}

        {pageData.locationPara && (
          <div
            className={styles.s2LocationPara}
            dangerouslySetInnerHTML={{ __html: pageData.locationPara }}
          />
        )}

        {/* ── Dynamic location badges ── */}
        <div className={styles.s2LocBadges}>
          {(pageData.locationBadges || [
            "📍 Tapovan, Rishikesh",
            "🏔️ Himalayan Foothills",
            "🌊 12 min to Laxman Jhula",
            "🧘 Peaceful Ashram Setting"
          ]).map((badge, idx) => (
            <span key={idx} className={styles.s2LocBadge}>
              {badge}
            </span>
          ))}
        </div>

        {/* ── Schedule + Image/Map row ── */}
        <div className={styles.s2CardBody}>
          {/* Schedule */}
          {pageData.schedule?.length > 0 && (
            <div className={styles.s2ScheduleWrap}>
              <div className={styles.scheduleBlock}>
                <div className={styles.scheduleHeader}>
                  The program, a draft of a schedule:
                </div>
                <div className={styles.scheduleList}>
                  {pageData.schedule.map((row) => (
                    <div key={row._id} className={styles.schedRow}>
                      <span className={styles.schedTime}>{row.time}</span>
                      <span className={styles.schedSep}>:</span>
                      <span className={styles.schedAct}>
                        {row.activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right column: location image + dynamic map embed */}
          <div className={styles.s2RightCol}>
            {pageData.locationImage && (
              <div className={styles.s2LocImgWrap}>
                <img
                  src={imgSrc(pageData.locationImage)}
                  alt={pageData.locationSubTitle || "Location"}
                  className={styles.s2LocImg}
                  loading="lazy"
                />
                <div className={styles.s2LocImgOverlay} />
                <div className={styles.s2LocImgFrame} />
                <span className={styles.s2LocImgTag}>AYM Ashram</span>
              </div>
            )}

            {/* Dynamic Google Map embed */}
            <div className={styles.s2MapWrap}>
              <iframe
                className={styles.s2Map}
                src={pageData.locationMapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.123!2d78.3219!3d30.1087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093f2b6eab7a0f%3A0x1b2c3d4e5f6a7b8c!2sTapovan%2C%20Rishikesh!5e0!3m2!1sen!2sin!4v1234567890"}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AYM Yoga Ashram Location"
              />
              <div className={styles.s2MapLabel}>
                <span>{pageData.locationMapLabel || "📍 Tapovan, Rishikesh, Uttarakhand"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</section>

      {/* ══════════════════════════════════════
          SECTION 3 — PREMIUM SEAT BOOKING (REPLACES BATCH TABLE)
      ══════════════════════════════════════ */}
      <PremiumSeatBooking
        seats={batches}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* ── Costs Section ── */}
      {pageData.costsSectionTitle && (
        <section id="costs" className={styles.costsBlock}>
          <h2 className={styles.sectionTitle}>{pageData.costsSectionTitle}</h2>
          <div className={styles.titleUnderline} />

          {pageData.costsPara && (
            <div
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: pageData.costsPara }}
            />
          )}
          {pageData.costsExtraParagraphs?.map((para, i) => (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </section>
      )}

      {/* ── Online Section ── */}
      {/* ── Online Section ── */}
{pageData.onlineSectionTitle && (
  <section id="online" className={styles.s3Card}>
    <div className={styles.s3CardAccent} />
    <span className={styles.s3CardCorner}>✦</span>

    <div className={styles.s3Header}>
      <div className={styles.s3HeaderOrnament}>
        <span className={styles.s3HeaderLine} />
        <span className={styles.s3HeaderDot} />
        <span className={styles.s3HeaderLine} />
      </div>
      <h2 className={styles.subSectionTitle}>
        {pageData.onlineSectionTitle}
      </h2>
      <div className={styles.subUnderline} />
      <p className={styles.s3HeaderSubtitle}>
        {pageData.onlineHeaderSubtitle || "Comprehensive Online Training for Aspiring Prenatal Yoga Teachers"}
      </p>
    </div>

    {(pageData.onlinePara || pageData.onlineExtraParagraphs?.length > 0) && (
      <div className={styles.s3Intro}>
        {pageData.onlinePara && (
          <div
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{ __html: pageData.onlinePara }}
          />
        )}
        {pageData.onlineExtraParagraphs?.map((para, i) => (
          <div
            key={i}
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}
      </div>
    )}

    {/* Curriculum and Hours Summary - Side by Side */}
    <div className={styles.s3TablesRow}>
      {/* Curriculum Table */}
      {pageData.curriculum?.length > 0 && (
        <div className={styles.s3CurrWrap}>
          <div className={styles.s3CurrHeader}>
            <div className={styles.s3CurrHeaderIcon}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 6h12M4 10h12M4 14h7" />
              </svg>
            </div>
            <span>Curriculum Breakdown</span>
            <div className={styles.s3CurrHeaderBadge}>
              {pageData.curriculum.length} Modules
            </div>
          </div>
          <div className={styles.s3CurrList}>
            {pageData.curriculum.map((item, idx) => (
              <div key={item._id} className={styles.s3CurrItem}>
                <div className={styles.s3CurrNum}>
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className={styles.s3CurrBody}>
                  <span className={styles.s3CurrTitle}>{item.title}</span>
                  <div className={styles.s3CurrBar}>
                    <div
                      className={styles.s3CurrBarFill}
                      style={{
                        width: `${Math.min(100, (parseInt(item.hours) / 50) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className={styles.s3CurrHrs}>
                  {item.hours}
                  <span>hrs</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.s3CurrFooter}>
            <span className={styles.s3CurrFooterIcon}>📖</span>
            <span>Total: {pageData.curriculum.reduce((sum, item) => sum + parseInt(item.hours), 0)} Hours</span>
          </div>
        </div>
      )}

      {/* Hours Summary Table */}
      {pageData.hoursSummary?.length > 0 && (
        <div className={styles.s3HoursWrap}>
          <div className={styles.s3HoursHeader}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className={styles.s3HoursHeaderIcon}>
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4l2.5 2.5" />
            </svg>
            <span>Hours Summary</span>
            <div className={styles.s3HoursHeaderBadge}>
              {pageData.hoursSummary.reduce((sum, row) => sum + parseInt(row.value), 0)} hrs
            </div>
          </div>
          <div className={styles.s3HoursTable}>
            {pageData.hoursSummary.map((row, idx) => (
              <div key={row._id} className={styles.s3HoursRow}>
                <div className={styles.s3HoursLabelCell}>
                  <span className={styles.s3HoursBullet} />
                  <span className={styles.s3HoursLabel}>{row.label}</span>
                </div>
                <div className={styles.s3HoursProgress}>
                  <div 
                    className={styles.s3HoursProgressFill} 
                    style={{ width: `${(parseInt(row.value) / 200) * 100}%` }}
                  />
                </div>
                <div className={styles.s3HoursValue}>
                  {row.value}
                  <span>hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Highlights and Video Section */}
    <div className={styles.s3BottomRow}>
      {/* Highlights Card */}
      <div className={styles.s3HighlightsWrap}>
        <div className={styles.s3HighlightsHeader}>
          <span className={styles.s3HighlightsHeaderIcon}>✨</span>
          <span>{pageData.onlineHighlightsTitle || "What You Get Online"}</span>
          <span className={styles.s3HighlightsHeaderIcon}>✨</span>
        </div>
        <div className={styles.s3HighlightsList}>
          {(pageData.onlineHighlights || [
            { icon: "🎥", text: "Recorded video lectures, lifetime access" },
            { icon: "📄", text: "Downloadable course materials & PDFs" },
            { icon: "🧘", text: "Live Q&A sessions with instructors" },
            { icon: "🏆", text: "Internationally recognised certificate" },
            { icon: "💬", text: "Private student community access" },
            { icon: "🔄", text: "Flexible, self-paced learning schedule" },
          ]).map((h, i) => (
            <div key={i} className={styles.s3HighlightItem}>
              <span className={styles.s3HighlightIcon}>{h.icon}</span>
              <span className={styles.s3HighlightText}>{h.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Video and Bonus */}
   {/* Video and Bonus */}
{/* Video and Bonus */}
<div className={styles.s3RightCol}>
  <div className={styles.s3VideoWrap}>
    {/* Check for local video file */}
    {pageData.onlineVideoFile ? (
      <video
        className={styles.s3Video}
        controls
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={pageData.onlineVideoPoster ? imgSrc(pageData.onlineVideoPoster) : undefined}
      >
        <source src={imgSrc(pageData.onlineVideoFile)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : pageData.onlineVideoType === "url" && pageData.onlineVideoUrl ? (
      /* YouTube/Vimeo URL embed with autoplay and loop */
      <iframe
        className={styles.s3Video}
        src={processYouTubeUrl(pageData.onlineVideoUrl)}
        title="Online Course Preview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <>
        <div className={styles.s3VideoPlaceholder}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M9 8l6 4-6 4V8z" />
          </svg>
          <span>Video Coming Soon</span>
        </div>
        {/* Overlay only shown when no video */}
        <div className={styles.s3VideoOverlay}>
          <div className={styles.s3VideoPlayBtn}>
            <span>▶</span>
          </div>
          <span className={styles.s3VideoTag}>
            {pageData.onlineVideoLabel || "Course Preview"}
          </span>
        </div>
      </>
    )}

    {/* Label shown below video when file or URL exists */}
    {(pageData.onlineVideoFile || pageData.onlineVideoUrl) && pageData.onlineVideoLabel && (
      <div className={styles.s3VideoTag} style={{ textAlign: "center", padding: "6px 0" }}>
        {pageData.onlineVideoLabel}
      </div>
    )}
  </div>

  <div className={styles.s3BonusCard}>
    <div className={styles.s3BonusIcon}>
      {pageData.onlineBonusIcon || "🎁"}
    </div>
    <div className={styles.s3BonusContent}>
      <div className={styles.s3BonusTitle}>
        {pageData.onlineBonusTitle || "Bonus Included"}
      </div>
      <div className={styles.s3BonusText}>
        {pageData.onlineBonusText || "Free access to prenatal yoga community & monthly workshops"}
      </div>
    </div>
  </div>
</div>
    </div>

    <div className={styles.s3Cta}>
      <div className={styles.s3CtaLeft}>
        <span className={styles.s3CtaLabel}>
          {pageData.onlineCtaLabel || "Ready to begin your journey?"}
        </span>
        <span className={styles.s3CtaSub}>
          {pageData.onlineCtaSub || "Join our next online batch · Flexible schedule · Globally certified"}
        </span>
      </div>
      <a href={pageData.onlineCtaBtnUrl || "#batch-section"} className={styles.s3CtaBtn}>
        {pageData.onlineCtaBtnText || "Enrol Now"}
        <svg viewBox="0 0 20 20" fill="none" className={styles.s3CtaBtnArrow}>
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
  </section>
)}
      
      <section id="gallery">
        <PremiumGallerySection type="both" backgroundColor="warm" />
      </section>
      
      {/* ✅ REVIEWS — now a reusable separate component */}
      <section id="reviews">
        <ReviewSection courseType="prenatal-yoga-teacher-training" RatingsSummaryComponent={<RatingsSummarySection />} />
      </section>
      
      <section id="location">
        <HowToReach />
      </section>
    </div>
  );
}