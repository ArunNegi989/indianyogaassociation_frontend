"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/300-hours-yoga-teacher-training-rishikesh/Yogattc300.module.css";
import HowToReach from "@/components/home/Howtoreach";
import StickySectionNav from "@/components/common/StickySectionNav";
import api from "@/lib/api";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Currency = "USD" | "INR";

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

interface OverviewField {
  _id: string;
  label: string;
  value: string;
  multiline: boolean;
}

interface Module {
  num: number;
  label: string;
  title: string;
  content: string;
  subTitle: string;
  listItems: string[];
  twoCol: boolean;
  _id: string;
}

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

interface ScheduleItem {
  _id: string;
  time: string;
  activity: string;
}

interface Review {
  _id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

interface YouTubeVideo {
  _id: string;
  id: string;
  title: string;
  type: "url" | "file";
  videoId: string;
  videoFile: string;
}

interface Thumbnail {
  src: string;
  alt: string;
}

interface Content1 {
  _id: string;
  slug: string;
  status: string;
  
  
  // Hero Section
  pageMainH1: string;
  heroImage: string;
  heroImgAlt: string;
  
  // Right Side Section (NEW - replaces video)
  rightSideImage: string;
  rightSideImageAlt: string;
  
  // Bottom Thumbnails (NEW - 3 images)
  bottomThumbnails: Thumbnail[];
  
  // Intro Section
  introParagraphs: string[];
  topSectionH2: string;
  topParagraphs: string[];
  
  // Overview Section
  overviewH2: string;
  overviewFields: OverviewField[];
  
  // Dates Section
  upcomingDatesH3: string;
  upcomingDatesSubtext: string;
  
  // Fee Section
  feeIncludedTitle: string;
  includedFee: string[];
  feeNotIncludedTitle: string;
  notIncludedFee: string[];
  
  // Syllabus Section
  syllabusH2: string;
  syllabusIntro: string;
  
  // Modules Section
  modules: Module[];
}

interface OverviewField {
  label: string;
  value: string;
  multiline: boolean;
}

interface Module {
  num: number;
  label: string;
  title: string;
  content: string;
  subTitle: string;
  listItems: string[];
  twoCol: boolean;
}

interface Content2 {
  evolutionH2: string;
  evolutionParas: string[];

   // Yoga Ethics Section - Dynamic Images
   ethicsImage1: string;
   ethicsImage1Alt: string;
   ethicsImage1Label: string;
   ethicsImage2: string;
   ethicsImage2Alt: string;
   ethicsImage2Label: string;
   diplomaBadgeLine1: string;
   diplomaBadgeLine2: string;

  learningImage1: string;
  learningImage1Alt: string;
  learningImage1Label: string;
  learningImage2: string;
  learningImage2Alt: string;
  learningImage2Label: string;
  learningImage3: string;
  learningImage3Alt: string;
  learningImage3Label: string;
  
  // Eligibility Section Image
  eligibilityImage: string;
  eligibilityImageAlt: string;
  
  // Evaluation Section Images (2 images)
  evaluationMainImage: string;
  evaluationMainImageAlt: string;
  evaluationSmallImage: string;
  evaluationSmallImageAlt: string;
  evaluationBadgeLine1: string;
  evaluationBadgeLine2: string;
  evolutionRightImage: string;        // NEW - Dynamic right side image
  evolutionRightImageAlt: string;     // NEW - Alt text for image
  evolutionBadgeText: string;         // NEW - Badge text (e.g., "Yoga Alliance")
  evolutionBadgeSubtext: string;      // NEW - Badge subtext (e.g., "RYT 500 Certified")
  
  markDistH3: string;
  markDistSubText: string;
  markTotalLabel: string;
  markTotalText: string;
  markTheoryLabel: string;
  markTheoryText: string;
  markPracticalLabel: string;
  markPracticalText: string;
  markPracticalDetail: string;
  careerH3: string;
  careerItems: string[];
  feeCard1Title: string;
  feeCard1Items: string[];
  feeCard2Title: string;
  feeCard2Items: string[];
  faqH2: string;
  faqItems: FaqItem[];
  accomH3: string;
  accomImages: string[];
  foodH3: string;
  foodImages: string[];
  luxuryH2: string;
  luxuryFeatures: string[];
  luxuryImages: string[];
  yogaGardenImage: string;
  featuresH2: string;
  featuresList: string[];
  scheduleH3: string;
  scheduleItems: ScheduleItem[];
  scheduleImages: string[];
  learningH2: string;
  learningItems: string[];
  eligibilityH2: string;
  eligibilityTag: string;
  eligibilityParas: string[];
  evaluationH2: string;
  evaluationParas: string[];
  ethicsH2: string;
  ethicsParas: string[];
  ethicsQuote: string;
  ethicsNaturalisticPara: string;
  ethicsRules: string[];
  diplomaImage: string;
  misconH2: string;
  misconParas: string[];
  misconItems: string[];
  reviewsH2: string;
  reviewsSubtext: string;
  reviews: Review[];
  youtubeVideos: YouTubeVideo[];
}

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING — with Kundalini pricing logic
══════════════════════════════════════════════════ */
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

  const monthYear = (start: string) => {
    const s = new Date(start);
    return s.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  const shortDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const d = (dt: Date) =>
      dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    return `${d(s)} – ${d(e)}`;
  };

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>300 Hour Yoga Teacher Training India</h2>
        <div className={styles.vintageHeadingUnderline}>
          <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
            <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#F15505" strokeWidth="1.2" fill="none" />
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
              <CurrencyDropdown currency={currency} onChange={onCurrencyChange} />
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
            <p className={styles.psbNoBatches}>No upcoming batches available at the moment.</p>
          ) : (
            <div className={styles.psbBatchGrid}>
              {seats.map((batch) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const dotCls = full ? styles.psbDRed : low ? styles.psbDOrange : styles.psbDGreen;
                const txtCls = full ? styles.psbSRed : low ? styles.psbSOrange : styles.psbSGreen;
                const statusTxt = full ? "Fully Booked" : low ? "Limited" : "Available";
                const seatsPercent = Math.max(5, (rem / batch.totalSeats) * 100);
                const isSelected = selectedId === batch._id;
                // ✅ uses usdFee-based price, not dormPrice
                const cardPrice = batchCardPrice(batch);
                return (
                  <div
                    key={batch._id}
                    className={[styles.psbBc, full ? styles.psbBcFull : "", isSelected ? styles.psbBcSel : ""].filter(Boolean).join(" ")}
                    onClick={() => { if (!full) setSelectedId(batch._id); }}
                  >
                    <div className={styles.psbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={styles.psbBcMonth}>{monthYear(batch.startDate)}</div>
                    <div className={styles.psbBcDates}>{shortDateRange(batch.startDate, batch.endDate)}</div>
                    {/* ✅ shows usdFee or usdFee*rate, not dormPrice */}
                    <div className={styles.psbBcPrice}>{cardPrice.amount} <span>{cardPrice.cur}</span></div>
                    <div className={styles.psbBcStatus}>
                      <div className={`${styles.psbBcDot} ${dotCls}`} />
                      <span className={`${styles.psbBcStxt} ${txtCls}`}>{statusTxt}</span>
                    </div>
                    {!full && (
                      <>
                        <div className={styles.psbBcSeatsBar}>
                          <div className={styles.psbBcSeatsBarFill} style={{ width: `${seatsPercent}%`, background: low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)" }} />
                        </div>
                        <span className={styles.psbBcSeatsBadge} style={{ color: low ? "#c8700a" : "#3d6000" }}>{rem} / {batch.totalSeats} seats left</span>
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
            <div className={styles.psbRpCourse}>300 Hour Yoga Teacher Training</div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.psbRpDurTxt}>24 Days · Rishikesh, India</span>
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
                  const pct = full ? 100 : Math.round((selected.bookedSeats / selected.totalSeats) * 100);
                  return (
                    <>
                      <div className={styles.psbRpSeatsRow}>
                        <span className={styles.psbRpSeatsLbl}>Seats Availability</span>
                        <span className={styles.psbRpSeatsBadge} style={{ color: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000", borderColor: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000" }}>
                          {full ? "Fully Booked" : `${rem} of ${selected.totalSeats} left`}
                        </span>
                      </div>
                      <div className={styles.psbRpSeatsBar}>
                        <div className={styles.psbRpSeatsBarFill} style={{ width: `${pct}%`, background: full ? "#8a2c00" : low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)" }} />
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
                  <div className={styles.psbSelDate}>{shortDateRange(selected.startDate, selected.endDate)}, {monthYear(selected.startDate)}</div>
                </>
              ) : (
                <span className={styles.psbSelHint}>← Select a batch to continue</span>
              )}
            </div>
            {/* ✅ Book Now button uses fmtPriceAdvanced(selected) — same as Kundalini */}
            {selected ? (
              <a href={`/yoga-registration?batchId=${selected._id}&type=300hr`} className={styles.psbBookBtn}>
                Book Now — {fmtPriceAdvanced(selected).amount} {currency}
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
    </section>
  );
}

/* ══════════════════════════════════════════════════
   CURRENCY DROPDOWN
══════════════════════════════════════════════════ */
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

const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: "INCLUSIONS", id: "inclusions" },
  { label: "FACILITY", id: "facility" },
  { label: "LOCATION", id: "location" },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

/** Image URL helper — if it starts with /uploads/ prefix with API base */
function imgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

function CourseInfoCard({
  seats,
  currency,
  rate,
}: {
  seats: Batch[];
  currency: Currency;
  rate: number;
}) {
  const available = seats.filter((s) => s.totalSeats - s.bookedSeats > 0);
  const startingPrice =
    available.length > 0 ? Math.min(...available.map((s) => s.dormPrice)) : 999;
  const originalPrice = Math.round((startingPrice * 1.8) / 50) * 50;

  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "24 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "Advanced" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "500 Hour" },
    {
      icon: <StyleIcon />,
      label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Ashtanga, Vinyasa & Hatha",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi" },
    { icon: <DateIcon />, label: "DATE", value: "Check batches below" },
  ];

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>COURSE DETAILS</span>
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
            <span className={styles.icFeeLbl}>COURSE FEE</span>
            <span className={styles.icFeeFrom}>starting from</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>
              {formatPrice(originalPrice, currency, rate)}
            </span>
            <span className={styles.icPriceNew}>
              {formatPrice(startingPrice, currency, rate)}
            </span>
            <span className={styles.icPriceCur}>{currency}</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            BOOK NOW
            <svg viewBox="0 0 20 20" fill="none" className={styles.icBtnArrow}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

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
   YOUTUBE EMBED
───────────────────────────────────────── */
const YouTubeEmbed = ({ video }: { video: YouTubeVideo }) => {
  const [playing, setPlaying] = useState(false);

  if (video.type === "file" && video.videoFile) {
    return (
      <div className={styles.videoWrapper}>
        <video
          className={styles.videoIframe}
          controls
          src={imgUrl(video.videoFile)}
          title={video.title}
        />
      </div>
    );
  }

  if (!video.videoId) return null;

  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.videoThumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${video.title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title}
            className={styles.thumbImg}
            loading="lazy"
          />
          <span className={styles.playBtn}>
            <svg viewBox="0 0 68 48" width="58" height="42">
              <rect width="68" height="48" rx="10" fill="#F15505" opacity="0.93" />
              <polygon points="26,13 53,24 26,35" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   IMAGE CAROUSEL
───────────────────────────────────────── */
const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const count = Math.min(4, images.length);
  const visible = Array.from(
    { length: count },
    (_, offset) => images[(idx + offset) % images.length],
  );

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>
      <div className={styles.carouselTrack}>
        {visible.map((src, i) => (
          <div key={i} className={styles.carouselSlide}>
            <img
              src={imgUrl(src)}
              alt={`${alt} ${i + 1}`}
              className={styles.carouselImg}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <button
        className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
        onClick={next}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────── */
const FaqItemComponent = ({
  question,
  answer,
  index = 0,
}: {
  question: string;
  answer: string;
  index?: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqCard} ${open ? styles.faqCardOpen : ""}`}>
      <button className={styles.faqCardQ} onClick={() => setOpen(!open)}>
        <span className={styles.faqCardNum}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.faqCardQText}>{question}</span>
        <span className={`${styles.faqCardChevron} ${open ? styles.faqCardChevronOpen : ""}`}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path
              d="M3 6l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div className={`${styles.faqCardA} ${open ? styles.faqCardAOpen : ""}`}>
        <div className={styles.faqCardAInner}>
          <div className={styles.faqCardAAccent} />
          <p className={styles.faqCardAText}>{answer}</p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SEATS CELL
───────────────────────────────────────── */
function SeatsCell({ booked, total }: { booked: number; total: number }) {
  const isFull = booked >= total;
  const remaining = total - booked;
  if (isFull) return <span className={styles.fullyBooked}>Fully Booked</span>;
  return (
    <span className={styles.seatsAvailable}>
      {remaining} / {total} Seats
    </span>
  );
}

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.reviewStars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#F15505" : "#ddd" }}>
          ★
        </span>
      ))}
    </div>
  );
}

// Icons for CourseInfoCard
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

/* ─────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────── */
function PageSkeleton() {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#999" }}>
      <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Loading...</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SAFE HTML RENDERER
───────────────────────────────────────── */
function SafeHtml({ html }: { html: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
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
   MAIN COMPONENT
───────────────────────────────────────── */
export default function YogaTTC300() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeIncTab, setActiveIncTab] = useState<"include" | "exclude">("include");

  const [content1, setContent1] = useState<Content1 | null>(null);
  const [content2, setContent2] = useState<Content2 | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [seats, setSeats] = useState<Batch[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  /* ── Fetch Content 1 ── */
  useEffect(() => {
    const fetchContent1 = async () => {
      try {
        const { data } = await api.get("/yoga-300hr/content1");
        const record = Array.isArray(data?.data) ? data.data[0] : data?.data;
        setContent1(record || null);
      } catch (err) {
        console.error("300hr content1 fetch error:", err);
      } finally {
        setLoading1(false);
      }
    };
    fetchContent1();
  }, []);

  /* ── Fetch Content 2 ── */
  useEffect(() => {
    const fetchContent2 = async () => {
      try {
        const { data } = await api.get("/yoga-300hr/content2");
        setContent2(data?.data || null);
      } catch (err) {
        console.error("300hr content2 fetch error:", err);
      } finally {
        setLoading2(false);
      }
    };
    fetchContent2();
  }, []);

  /* ── Fetch Batches ── */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/300hr-seats/all");
        setBatches(data?.data || []);
        setSeats(data?.data || []);
      } catch (err) {
        console.error("300hr batch fetch error:", err);
      } finally {
        setBatchesLoading(false);
      }
    };
    fetchBatches();
  }, []);

  if (loading1 || loading2) return <PageSkeleton />;

  const modules = content1?.modules || [];
  const mod = modules[activeModule];

  return (
    <div className={styles.page}>
      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      {content1?.heroImage && (
        <section id="hero" className={styles.heroSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl(content1.heroImage)}
            alt={content1.heroImgAlt || "Hero"}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}
      <CourseInfoCard seats={seats} currency={currency} rate={rate} />

      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      <section className={styles.heroSection2}>
  <div className={`container ${styles.facilityContainer}`}>
    {content1?.pageMainH1 && (
      <h1 className={styles.heroTitle}>{content1.pageMainH1}</h1>
    )}
    <div className={styles.omDivider}>
      <span className={styles.divLine} />
      <span className={styles.omGlyph}>ॐ</span>
      <span className={styles.divLine} />
    </div>
    <div className={styles.hs2Split}>
      {/* LEFT SIDE - Content */}
      <div className={styles.hs2Left}>
        {content1?.introParagraphs && content1.introParagraphs.length > 0 && (
          <div className={styles.bodyText}>
            {content1.introParagraphs.map((para, i) => (
              <SafeHtml key={i} html={para} />
            ))}
          </div>
        )}
      </div>
      
      {/* RIGHT SIDE - Dynamic Image (replaces video) */}
      <div className={styles.hs2Right}>
        <div className={styles.hs2VidWrap}>
          {content1?.rightSideImage ? (
            <img
              src={imgUrl(content1.rightSideImage)}
              alt={content1.rightSideImageAlt || "Yoga in Rishikesh"}
              className={styles.hs2Image}
            />
          ) : (
            <img
              src="/images/ttc-300-hero-poster.jpg"
              alt="Yoga in Rishikesh"
              className={styles.hs2Image}
            />
          )}
          <div className={styles.hs2VidOverlay} />
          <div className={styles.hs2FloatCard}>
            <div className={styles.hs2FloatCardLbl}>Next Batch</div>
            <div className={styles.hs2FloatCardVal}>
              Check dates below for upcoming batches
            </div>
          </div>
          <span className={styles.hs2VidBadge}>Live in Rishikesh</span>
        </div>
        
        {/* Statistics - Keep as is or make dynamic later */}
        <div className={styles.hs2Stats}>
          <div className={styles.hs2Stat}>
            <span className={styles.hs2StatNum}>25+</span>
            <span className={styles.hs2StatLbl}>Years Experience</span>
          </div>
          <div className={styles.hs2StatDiv} />
          <div className={styles.hs2Stat}>
            <span className={styles.hs2StatNum}>5000</span>
            <span className={styles.hs2StatLbl}>Sq Ft Campus</span>
          </div>
          <div className={styles.hs2StatDiv} />
          <div className={styles.hs2Stat}>
            <span className={styles.hs2StatNum}>500+</span>
            <span className={styles.hs2StatLbl}>Graduates</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Feature Pills - Keep as is */}
    <div className={styles.hs2Pills}>
      <div className={styles.hs2Pill}>
        <span className={styles.hs2PillDot} />
        <span className={styles.hs2PillTxt}>Yoga Alliance RYT 500</span>
      </div>
      <div className={styles.hs2Pill}>
        <span className={styles.hs2PillDot} />
        <span className={styles.hs2PillTxt}>Internationally Recognised</span>
      </div>
      <div className={styles.hs2Pill}>
        <span className={styles.hs2PillDot} />
        <span className={styles.hs2PillTxt}>Experienced Teachers</span>
      </div>
      <div className={styles.hs2Pill}>
        <span className={styles.hs2PillDot} />
        <span className={styles.hs2PillTxt}>Holistic Curriculum</span>
      </div>
    </div>
    
    {content1?.topSectionH2 && (
      <h2 className={styles.sectionTitleOrange}>{content1.topSectionH2}</h2>
    )}
    <div className={styles.sectionUnderline} />
    
    {content1?.topParagraphs && content1.topParagraphs.length > 0 && (
      <div className={styles.bodyText}>
        {content1.topParagraphs.map((para, i) => (
          <SafeHtml key={i} html={para} />
        ))}
      </div>
    )}
    
    {/* Dynamic Bottom Thumbnails Gallery - 3 images */}
    <div className={styles.hs2Thumbs}>
      {content1?.bottomThumbnails && content1.bottomThumbnails.length > 0 ? (
        content1.bottomThumbnails.map((thumb, i) => (
          <div key={i} className={styles.hs2Thumb}>
            <img src={imgUrl(thumb.src)} alt={thumb.alt} loading="lazy" />
            <div className={styles.hs2ThumbOv}>
              <div className={styles.hs2PlayBtn}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#fff">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Fallback thumbnails
        <>
          <div className={styles.hs2Thumb}>
            <img src="/images/ttc-300-thumb1.jpg" alt="Yoga practice at sunrise" loading="lazy" />
            <div className={styles.hs2ThumbOv}>
              <div className={styles.hs2PlayBtn}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#fff">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.hs2Thumb}>
            <img src="/images/ttc-300-thumb2.jpg" alt="Meditation session" loading="lazy" />
            <div className={styles.hs2ThumbOv}>
              <div className={styles.hs2PlayBtn}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#fff">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
            </div>
          </div>
          <div className={styles.hs2Thumb}>
            <img src="/images/ttc-300-thumb3.jpg" alt="Teacher training class" loading="lazy" />
            <div className={styles.hs2ThumbOv}>
              <div className={styles.hs2PlayBtn}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#fff">
                  <polygon points="2,1 9,5 2,9" />
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
          SECTION 2 — OVERVIEW + PREMIUM SEAT BOOKING
      ══════════════════════════════════════ */}
      <section id="dates-fees" className={`${styles.section} ${styles.sectionLight}`}>
        <div className={`container ${styles.facilityContainer}`}>
          {content1?.overviewH2 && (
            <>
              <div className={styles.overviewHeaderWrapper}>
                <div className={styles.overviewOmLine}>
                  <span className={styles.overviewLineLeft} />
                  <span className={styles.overviewOmSymbol}>ॐ</span>
                  <span className={styles.overviewLineRight} />
                </div>
                <h2 className={styles.overviewSectionTitle}>{content1.overviewH2}</h2>
                <div className={styles.overviewTitleUnderline} />
              </div>
            </>
          )}
          {content1?.overviewFields && content1.overviewFields.length > 0 && (
            <div className={styles.ovBoxGrid}>
              {content1.overviewFields.map((field, i) => (
                <div key={field._id} className={styles.ovBox}>
                  <div className={styles.ovBoxTop}>
                    <span className={styles.ovBoxNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.ovBoxLabel}>{field.label}</span>
                  </div>
                  <div
                    className={styles.ovBoxValue}
                    dangerouslySetInnerHTML={{ __html: field.value }}
                  />
                </div>
              ))}
            </div>
          )}
          <PremiumSeatBooking
            seats={batches}
            currency={currency}
            onCurrencyChange={setCurrency}
            rate={rate}
            rateLoading={rateLoading}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — INCLUDED / NOT INCLUDED (tabbed design like 100hr page)
      ══════════════════════════════════════ */}
      {(content1?.includedFee?.length || content1?.notIncludedFee?.length) && (
        <section id="inclusions" className={styles.section}>
          <div className={`container ${styles.facilityContainer}`}>
            <div className={styles.incHeaderWrap}>
              <div className={styles.incOmRow}>
                <span className={styles.incOmLine} />
                <span className={styles.incOmGlyph}>ॐ</span>
                <span className={styles.incOmLine} />
              </div>
              <h2 className={styles.sectionTitleOrange}>Course Inclusions</h2>
              <div className={styles.sectionUnderline} />
            </div>
            <div className={styles.incWrap}>
              <div className={styles.incTabs}>
                <button
                  className={`${styles.incTab} ${activeIncTab === "include" ? styles.incTabActive : ""}`}
                  onClick={() => setActiveIncTab("include")}
                  type="button"
                >
                  ✓ {content1?.feeIncludedTitle || "What Is Included?"}
                </button>
                <button
                  className={`${styles.incTab} ${activeIncTab === "exclude" ? styles.incTabActive : ""}`}
                  onClick={() => setActiveIncTab("exclude")}
                  type="button"
                >
                  ✕ {content1?.feeNotIncludedTitle || "What Is Not Included?"}
                </button>
              </div>
              <div className={styles.incContent}>
                <ul className={styles.incList}>
                  {(activeIncTab === "include"
                    ? content1?.includedFee
                    : content1?.notIncludedFee
                  )?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 4 — SYLLABUS TABS (Enhanced)
      ══════════════════════════════════════ */}
      {modules.length > 0 && (
        <section id="curriculum" className={`${styles.section} ${styles.sectionLight}`}>
          <div className={`container ${styles.facilityContainer}`}>
            <div className={styles.syllabusHeaderWrap}>
              <div className={styles.syllabusOrnament}>
                <span className={styles.syllabusOrnLine} />
                <span className={styles.syllabusOrnSymbol}>ॐ</span>
                <span className={styles.syllabusOrnLine} />
              </div>
              {content1?.syllabusH2 && (
                <h2 className={styles.sectionTitleOrange}>{content1.syllabusH2}</h2>
              )}
              <div className={styles.sectionUnderline} />
              {content1?.syllabusIntro && (
                <div className={styles.syllabusIntroText}>
                  <SafeHtml html={content1.syllabusIntro} />
                </div>
              )}
            </div>
            <div className={styles.syllabusTabsWrap}>
              <div className={styles.syllabusTabStrip}>
                {modules.map((m, i) => (
                  <button
                    key={m._id}
                    className={`${styles.syllabusTab} ${activeModule === i ? styles.syllabusTabActive : ""}`}
                    onClick={() => setActiveModule(i)}
                  >
                    <span className={styles.syllabusTabNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.syllabusTabLabel}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
            {mod && (
              <div className={styles.syllabusPanel}>
                <div className={styles.syllabusPanelHeader}>
                  <div className={styles.syllabusPanelNum}>Module {activeModule + 1}</div>
                  <h4 className={styles.syllabusPanelTitle}>{mod.title}</h4>
                  {mod.subTitle && (
                    <p className={styles.syllabusPanelSubTitle}>{mod.subTitle}</p>
                  )}
                </div>
                <div className={styles.syllabusPanelBody}>
                  <div className={`${styles.syllabusPanelText} ${(!mod.listItems || mod.listItems.filter(Boolean).length === 0) ? styles.syllabusPanelTextFull : ""}`}>
                    <SafeHtml html={mod.content} />
                  </div>
                  {mod.listItems && mod.listItems.filter(Boolean).length > 0 && (
                    <div className={styles.syllabusListWrap}>
                      <div className={styles.syllabusListHeader}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#F15505" strokeWidth="1.2"/>
                          <path d="M5 8l2 2 4-4" stroke="#F15505" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Topics Covered</span>
                      </div>
                      {mod.twoCol ? (
                        <div className={styles.syllabusListTwoCol}>
                          {mod.listItems.filter(Boolean).map((item, i) => (
                            <div key={i} className={styles.syllabusListItem}>
                              <span className={styles.syllabusListDot} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.syllabusList}>
                          {mod.listItems.filter(Boolean).map((item, i) => (
                            <div key={i} className={styles.syllabusListItem}>
                              <span className={styles.syllabusListDot} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.syllabusPanelFooter}>
                  <button
                    className={styles.syllabusPrevBtn}
                    onClick={() => setActiveModule(i => Math.max(0, i - 1))}
                    disabled={activeModule === 0}
                  >
                    ← Previous
                  </button>
                  <div className={styles.syllabusDots}>
                    {modules.map((_, i) => (
                      <span
                        key={i}
                        className={`${styles.syllabusDot} ${activeModule === i ? styles.syllabusDotActive : ""}`}
                        onClick={() => setActiveModule(i)}
                      />
                    ))}
                  </div>
                  <button
                    className={styles.syllabusNextBtn}
                    onClick={() => setActiveModule(i => Math.min(modules.length - 1, i + 1))}
                    disabled={activeModule === modules.length - 1}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

     {/* ══════════════════════════════════════
   SECTION 5 — EVOLUTION & CERTIFICATION
══════════════════════════════════════ */}
{content2 && (
  <section className={`${styles.section} ${styles.sectionLight}`}>
    <div className={`container ${styles.facilityContainer}`}>
      <div className={styles.evoHeaderWrap}>
        <div className={styles.evoOrnament}>
          <span className={styles.evoOrnLine} />
          <span className={styles.evoOrnSymbol}>ॐ</span>
          <span className={styles.evoOrnLine} />
        </div>
        {content2.evolutionH2 && (
          <h2 className={styles.sectionTitleOrange}>{content2.evolutionH2}</h2>
        )}
        <div className={styles.sectionUnderline} />
      </div>
      <div className={styles.evoIntroSplit}>
        <div className={styles.evoIntroLeft}>
          {content2.evolutionParas?.map((para, i) => (
            <div key={i} className={styles.bodyPara}>
              <SafeHtml html={para} />
            </div>
          ))}
        </div>
        <div className={styles.evoIntroRight}>
          <div className={styles.evoImgFrame}>
            {/* DYNAMIC IMAGE - REPLACES HARDCODED URL */}
            {content2.evolutionRightImage ? (
              <img
                src={imgUrl(content2.evolutionRightImage)}
                alt={content2.evolutionRightImageAlt || "Yoga meditation in Rishikesh"}
                className={styles.evoRealImg}
              />
            ) : (
              <img
                src="/images/evolution-default.jpg"
                alt="Yoga meditation in Rishikesh"
                className={styles.evoRealImg}
              />
            )}
            <div className={styles.evoImgBadge}>
              <span>{content2.evolutionBadgeText || "Yoga Alliance"}</span>
              <strong>{content2.evolutionBadgeSubtext || "RYT 500 Certified"}</strong>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of your existing code remains the same */}
      {content2.markDistH3 && (
        <div className={styles.evoMarkCard}>
          {/* ... existing mark card code ... */}
        </div>
      )}
      
      {/* ... rest of the section ... */}
    </div>
  </section>
)}

      {/* ══════════════════════════════════════
          SECTION 6 — FAQ + ACCOMMODATION + FOOD
      ══════════════════════════════════════ */}
      {content2 && (
        <section id="facility" className={`${styles.section} ${styles.sectionLight}`}>
          <div className={`container ${styles.facilityContainer}`}>
            {content2.faqH2 && (
              <div className={styles.faqSectionWrap}>
                <div className={styles.faqHeaderRow}>
                  <div className={styles.faqHeaderLeft}>
                    <div className={styles.faqOrnament}>
                      <span className={styles.faqOrnLine} />
                      <span className={styles.faqOrnSymbol}>ॐ</span>
                      <span className={styles.faqOrnLine} />
                    </div>
                    <h2 className={styles.faqMainTitle}>{content2.faqH2}</h2>
                    <div className={styles.faqTitleUnder} />
                    <p className={styles.faqSubtext}>
                      Everything you need to know before enrolling
                    </p>
                  </div>
                </div>
                {content2.faqItems && content2.faqItems.length > 0 && (
                  <div className={styles.faqGrid}>
                    {content2.faqItems.map((faq, idx) => (
                      <FaqItemComponent
                        key={faq._id}
                        question={faq.question}
                        answer={faq.answer}
                        index={idx}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            <PremiumGallerySection type="both" backgroundColor="warm" />
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 7 — LUXURY ROOM & FEATURES
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={styles.section}>
          <div className={`container ${styles.facilityContainer}`}>
            {content2.luxuryH2 && (
              <div className={styles.luxHdrWrap}>
                <div className={styles.luxHdrOmRow}>
                  <span className={styles.luxHdrLine} />
                  <span className={styles.luxHdrOm}>ॐ</span>
                  <span className={styles.luxHdrLine} />
                </div>
                <h2 className={styles.luxHdrTitle}>{content2.luxuryH2}</h2>
                <div className={styles.luxHdrUnderline} />
              </div>
            )}
            <div className={styles.luxLayout}>
              {content2.luxuryFeatures && content2.luxuryFeatures.length > 0 && (
                <div className={styles.luxFeatures}>
                  {content2.luxuryFeatures.map((f, i) => (
                    <div key={i} className={styles.luxFeatureItem}>
                      <div className={styles.luxFeatureIcon}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#F15505" strokeWidth="1.2"/>
                          <path d="M5 8l2 2 4-4" stroke="#F15505" strokeWidth="1.4"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={styles.luxFeatureTxt}>{f}</span>
                    </div>
                  ))}
                </div>
              )}
              {content2.luxuryImages && content2.luxuryImages.length > 0 && (
                <div className={styles.luxImgMosaic}>
                  {content2.luxuryImages.map((src, i) => (
                    <div
                      key={i}
                      className={`${styles.luxImgBlock} ${i === 0 ? styles.luxImgBlockWide : ""}`}
                    >
                      <img
                        src={imgUrl(src)}
                        alt={`Luxury room ${i + 1}`}
                        className={styles.luxImg}
                        loading="lazy"
                      />
                      <div className={styles.luxImgOverlay} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {content2.yogaGardenImage && (
              <div className={styles.luxGardenWrap}>
                <img
                  src={imgUrl(content2.yogaGardenImage)}
                  alt="Yoga in garden"
                  className={styles.luxGardenImg}
                  loading="lazy"
                />
                <div className={styles.luxGardenBadge}>
                  <span>AYM Yoga School</span>
                  <strong>Rishikesh, India</strong>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 8 — FEATURES + DAILY SCHEDULE
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className={`container ${styles.facilityContainer}`}>
            {content2.featuresH2 && (
              <div className={styles.s8HdrWrap}>
                <div className={styles.s8OmRow}>
                  <span className={styles.s8OmLine} />
                  <span className={styles.s8OmGlyph}>ॐ</span>
                  <span className={styles.s8OmLine} />
                </div>
                <h2 className={styles.sectionTitleOrange}>{content2.featuresH2}</h2>
                <div className={styles.sectionUnderline} />
              </div>
            )}
            {content2.featuresList && content2.featuresList.length > 0 && (
              <div className={styles.s8FeatGrid}>
                {content2.featuresList.map((f, i) => (
                  <div key={i} className={styles.s8FeatItem}>
                    <div className={styles.s8FeatNum}>{String(i + 1).padStart(2, "0")}</div>
                    <p className={styles.s8FeatTxt}>{f}</p>
                  </div>
                ))}
              </div>
            )}
            <div className={styles.s8ScheduleLayout}>
              <div className={styles.s8ScheduleLeft}>
                {content2.scheduleH3 && (
                  <div className={styles.s8SchedHdr}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#F15505" strokeWidth="1.6" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <path d="M16 2v4M8 2v4M3 10h18"/>
                    </svg>
                    <h3 className={styles.s8SchedTitle}>{content2.scheduleH3}</h3>
                  </div>
                )}
                {content2.scheduleItems && content2.scheduleItems.length > 0 && (
                  <div className={styles.s8SchedList}>
                    {content2.scheduleItems.map((row, i) => (
                      <div key={row._id} className={styles.s8SchedRow}>
                        <div className={styles.s8SchedTimeBadge}>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.7)" strokeWidth="1.2"/>
                            <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.9)"
                              strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          <span>{row.time}</span>
                        </div>
                        <div className={styles.s8SchedActivity}>{row.activity}</div>
                        <div className={styles.s8SchedDot} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {content2.scheduleImages && content2.scheduleImages.length > 0 && (
                <div className={styles.s8ImgStack}>
                  {content2.scheduleImages.map((src, i) => (
                    <div
                      key={i}
                      className={`${styles.s8ImgBlock} ${i === 0 ? styles.s8ImgBlockTall : ""}`}
                    >
                      <img
                        src={imgUrl(src)}
                        alt={`Schedule ${i + 1}`}
                        className={styles.s8Img}
                        loading="lazy"
                      />
                      <div className={styles.s8ImgOverlay} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

     {/* ══════════════════════════════════════
   SECTION 9 — LEARNING OUTCOMES + ELIGIBILITY + EVALUATION
══════════════════════════════════════ */}
{content2 && (
  <section className={styles.section}>
    <div className={`container ${styles.facilityContainer}`}>
      <div className={styles.s9HeaderWrap}>
        <div className={styles.s9OmRow}>
          <span className={styles.s9OmLine} />
          <span className={styles.s9OmGlyph}>ॐ</span>
          <span className={styles.s9OmLine} />
        </div>
        {content2.learningH2 && (
          <h2 className={styles.sectionTitleOrange}>{content2.learningH2}</h2>
        )}
        <div className={styles.sectionUnderline} />
      </div>
      <div className={styles.s9OutcomesSplit}>
        <div className={styles.s9OutcomesLeft}>
          {content2.learningItems && content2.learningItems.length > 0 && (
            <div className={styles.s9OutcomesGrid}>
              {content2.learningItems.map((item, i) => (
                <div key={i} className={styles.s9OutcomeChip}>
                  <span className={styles.s9ChipNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.s9ChipTxt}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* DYNAMIC 3 IMAGES - MOSAIC GALLERY */}
        <div className={styles.s9ImageMosaic}>
          {/* Image 1 - Tall Image */}
          <div className={`${styles.s9ImgBlock} ${styles.s9ImgTall}`}>
            {content2?.learningImage1 ? (
              <img 
                src={imgUrl(content2.learningImage1)} 
                alt={content2.learningImage1Alt || "Advanced yoga practice in Rishikesh"} 
                className={styles.s9Img} 
                loading="lazy" 
              />
            ) : (
              <img 
                src="/images/s9-outcomes-1.jpg" 
                alt="Advanced yoga practice in Rishikesh" 
                className={styles.s9Img} 
                loading="lazy" 
              />
            )}
            <div className={styles.s9ImgOverlay}>
              <span className={styles.s9ImgLabel}>
                {content2.learningImage1Label || "Advanced Practice"}
              </span>
            </div>
          </div>
          
          {/* Image 2 */}
          <div className={styles.s9ImgBlock}>
            {content2?.learningImage2 ? (
              <img 
                src={imgUrl(content2.learningImage2)} 
                alt={content2.learningImage2Alt || "Yoga certification ceremony"} 
                className={styles.s9Img} 
                loading="lazy" 
              />
            ) : (
              <img 
                src="/images/s9-outcomes-2.jpg" 
                alt="Yoga certification ceremony" 
                className={styles.s9Img} 
                loading="lazy" 
              />
            )}
            <div className={styles.s9ImgOverlay}>
              <span className={styles.s9ImgLabel}>
                {content2.learningImage2Label || "Certification"}
              </span>
            </div>
          </div>
          
          {/* Image 3 */}
          <div className={styles.s9ImgBlock}>
            {content2?.learningImage3 ? (
              <img 
                src={imgUrl(content2.learningImage3)} 
                alt={content2.learningImage3Alt || "Graduation at AYM School"} 
                className={styles.s9Img} 
                loading="lazy" 
              />
            ) : (
              <img 
                src="/images/s9-outcomes-3.jpg" 
                alt="Graduation at AYM School" 
                className={styles.s9Img} 
                loading="lazy" 
              />
            )}
            <div className={styles.s9ImgOverlay}>
              <span className={styles.s9ImgLabel}>
                {content2.learningImage3Label || "Graduation"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Eligibility Section */}
      {content2.eligibilityH2 && (
        <div className={styles.s9Card}>
          <div className={styles.s9CardHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h2 className={styles.s9CardTitle}>{content2.eligibilityH2}</h2>
          </div>
          <div className={styles.s9CardBody}>
            <div className={styles.s9EligSplit}>
              <div className={styles.s9EligLeft}>
                {content2.eligibilityTag && (<div className={styles.s9EligTag}>{content2.eligibilityTag}</div>)}
                {content2.eligibilityParas && content2.eligibilityParas.length > 0 && (
                  <div className={styles.s9EligText}>
                    {content2.eligibilityParas.map((para, i) => (<SafeHtml key={i} html={para} />))}
                  </div>
                )}
              </div>
              <div className={styles.s9EligRight}>
                <div className={styles.s9CertBadge}>
                  <div className={styles.s9CertBig}>RYT 500</div>
                  <div className={styles.s9CertSub}>Yoga Alliance Certified</div>
                </div>
                <div className={styles.s9PrereqBox}>
                  <div className={styles.s9PrereqLabel}>Prerequisite</div>
                  <div className={styles.s9PrereqVal}>200 Hour YTT</div>
                </div>
                <div className={styles.s9EligImgWrap}>
                  {content2?.eligibilityImage ? (
                    <img 
                      src={imgUrl(content2.eligibilityImage)} 
                      alt={content2.eligibilityImageAlt || "Yoga eligibility — student in practice"} 
                      className={styles.s9EligImg} 
                      loading="lazy" 
                    />
                  ) : (
                    <img 
                      src="/images/s9-eligibility.jpg" 
                      alt="Yoga eligibility — student in practice" 
                      className={styles.s9EligImg} 
                      loading="lazy" 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Evaluation Section */}
      {content2.evaluationH2 && (
        <div className={styles.s9Card}>
          <div className={styles.s9CardHeader}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 17v4M16 17v4M8 21h8"/>
              <path d="M9 10l2 2 4-4"/>
            </svg>
            <h2 className={styles.s9CardTitle}>{content2.evaluationH2}</h2>
          </div>
          <div className={styles.s9CardBody}>
            <div className={styles.s9EvalLayout}>
              <div className={styles.s9EvalLeft}>
                {content2.evaluationParas?.map((para, i) => (<div key={i} className={styles.s9EvalPara}><SafeHtml html={para} /></div>))}
                <div className={styles.s9EvalIconGrid}>
                  <div className={styles.s9EvalItem}>
                    <div className={styles.s9EvalIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F15505" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
                    <div className={styles.s9EvalItemTitle}>4-Week Course</div>
                    <div className={styles.s9EvalItemDesc}>24 days residential</div>
                  </div>
                  <div className={styles.s9EvalItem}>
                    <div className={styles.s9EvalIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F15505" strokeWidth="1.6" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                    <div className={styles.s9EvalItemTitle}>Written Exam</div>
                    <div className={styles.s9EvalItemDesc}>Theory & philosophy</div>
                  </div>
                  <div className={styles.s9EvalItem}>
                    <div className={styles.s9EvalIconWrap}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F15505" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
                    <div className={styles.s9EvalItemTitle}>Practical Demo</div>
                    <div className={styles.s9EvalItemDesc}>Teaching assessment</div>
                  </div>
                </div>
              </div>
              <div className={styles.s9EvalRight}>
                <div className={styles.s9EvalImgStack}>
                  {/* Main Evaluation Image */}
                  {content2?.evaluationMainImage ? (
                    <img 
                      src={imgUrl(content2.evaluationMainImage)} 
                      alt={content2.evaluationMainImageAlt || "Evaluation and certification ceremony"} 
                      className={styles.s9EvalMainImg} 
                      loading="lazy" 
                    />
                  ) : (
                    <img 
                      src="/images/s9-eval-main.jpg" 
                      alt="Evaluation and certification ceremony" 
                      className={styles.s9EvalMainImg} 
                      loading="lazy" 
                    />
                  )}
                  <div className={styles.s9EvalImgBadge}>
                    <div className={styles.s9EvalBadgeLine1}>
                      {content2.evaluationBadgeLine1 || "Yoga Alliance USA"}
                    </div>
                    <div className={styles.s9EvalBadgeLine2}>
                      {content2.evaluationBadgeLine2 || "Certification Awarded"}
                    </div>
                  </div>
                  {/* Small Evaluation Image */}
                  {content2?.evaluationSmallImage ? (
                    <img 
                      src={imgUrl(content2.evaluationSmallImage)} 
                      alt={content2.evaluationSmallImageAlt || "Students receiving certificates"} 
                      className={styles.s9EvalSmallImg} 
                      loading="lazy" 
                    />
                  ) : (
                    <img 
                      src="/images/s9-eval-small.jpg" 
                      alt="Students receiving certificates" 
                      className={styles.s9EvalSmallImg} 
                      loading="lazy" 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
)}
{/* ══════════════════════════════════════
   SECTION 10 — YOGA ETHICS
══════════════════════════════════════ */}
{content2 && (
  <section className={`${styles.section} ${styles.sectionLight}`}>
    <div className={`container ${styles.facilityContainer}`}>
      <div className={styles.s10HeaderWrap}>
        <div className={styles.s10OmRow}>
          <span className={styles.s10OmLine} />
          <span className={styles.s10OmGlyph}>ॐ</span>
          <span className={styles.s10OmLine} />
        </div>
        {content2.ethicsH2 && (<h2 className={styles.sectionTitleOrange}>{content2.ethicsH2}</h2>)}
        <div className={styles.sectionUnderline} />
      </div>
      <div className={styles.s10HeroSplit}>
        <div className={styles.s10Left}>
          {content2.ethicsParas && content2.ethicsParas.length > 0 && (
            <div className={styles.s10IntroParas}>
              {content2.ethicsParas.map((para, i) => (<div key={i} className={styles.s10Para}><SafeHtml html={para} /></div>))}
            </div>
          )}
          <div className={styles.s10YnRow}>
            <div className={styles.s10YnChip}>
              <div className={styles.s10YnChipAccent} />
              <div className={styles.s10YnChipBody}>
                <div className={styles.s10YnChipTitle}>Yama</div>
                <div className={styles.s10YnChipDesc}>Ethical disciplines — our relationship with the outer world</div>
              </div>
            </div>
            <div className={styles.s10YnChip}>
              <div className={styles.s10YnChipAccent} />
              <div className={styles.s10YnChipBody}>
                <div className={styles.s10YnChipTitle}>Niyama</div>
                <div className={styles.s10YnChipDesc}>Self-observances — our relationship with our inner world</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* RIGHT SIDE - DYNAMIC PAIR OF IMAGES */}
        <div className={styles.s10Right}>
          {content2.ethicsQuote && (
            <div className={styles.s10QuoteBlock}>
              <div className={styles.s10QuoteMark}>&ldquo;</div>
              <p className={styles.s10QuoteText}>{content2.ethicsQuote}</p>
              <div className={styles.s10QuoteAttrib}>— Yoga Philosophy</div>
            </div>
          )}
          <div className={styles.s10ImgPair}>
            {/* Image 1 - Left */}
            <div className={styles.s10ImgWrap}>
              {content2?.ethicsImage1 ? (
                <img 
                  src={imgUrl(content2.ethicsImage1)} 
                  alt={content2.ethicsImage1Alt || "Yoga ethics in practice"} 
                  className={styles.s10Img} 
                  loading="lazy" 
                />
              ) : (
                <img 
                  src="/images/s10-ethics-1.jpg" 
                  alt="Yoga ethics in practice" 
                  className={styles.s10Img} 
                  loading="lazy" 
                />
              )}
              <div className={styles.s10ImgOverlay}>
                <span className={styles.s10ImgLabel}>
                  {content2.ethicsImage1Label || "Discipline in Practice"}
                </span>
              </div>
            </div>
            
            {/* Image 2 - Right */}
            <div className={styles.s10ImgWrap}>
              {content2?.ethicsImage2 ? (
                <img 
                  src={imgUrl(content2.ethicsImage2)} 
                  alt={content2.ethicsImage2Alt || "AYM campus — yoga shala"} 
                  className={styles.s10Img} 
                  loading="lazy" 
                />
              ) : (
                <img 
                  src="/images/s10-ethics-2.jpg" 
                  alt="AYM campus — yoga shala" 
                  className={styles.s10Img} 
                  loading="lazy" 
                />
              )}
              <div className={styles.s10ImgOverlay}>
                <span className={styles.s10ImgLabel}>
                  {content2.ethicsImage2Label || "AYM Yoga Shala"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {content2.ethicsNaturalisticPara && (
        <div className={styles.s10NaturePara}>
          <div className={styles.s10NatureIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F15505" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <p className={styles.s10NatureText}>{content2.ethicsNaturalisticPara}</p>
        </div>
      )}
      
      {content2.ethicsRules && content2.ethicsRules.length > 0 && (
        <div className={styles.s10RulesWrap}>
          <div className={styles.s10RulesHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFF8EE" strokeWidth="1.6" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span className={styles.s10RulesHeaderTxt}>Student Code of Conduct</span>
          </div>
          <div className={styles.s10RulesGrid}>
            {content2.ethicsRules.map((rule, i) => (
              <div key={i} className={styles.s10RuleCard}>
                <div className={styles.s10RuleNum}>{String(i + 1).padStart(2, "0")}</div>
                <p className={styles.s10RuleTxt}>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {content2.diplomaImage && (
        <div className={styles.s10DiplomaWrap}>
          <img src={imgUrl(content2.diplomaImage)} alt="Students with Diploma certificates — AYM School" className={styles.s10DiplomaImg} loading="lazy" />
          <div className={styles.s10DiplomaBadge}>
            <div className={styles.s10DiplomaBadgeLine1}>
              {content2.diplomaBadgeLine1 || "Yoga Alliance USA"}
            </div>
            <div className={styles.s10DiplomaBadgeLine2}>
              {content2.diplomaBadgeLine2 || "Certified Graduates"}
            </div>
          </div>
        </div>
      )}
    </div>
  </section>
)}

      {/* ══════════════════════════════════════
          SECTION 11 — MISCONCEPTIONS
      ══════════════════════════════════════ */}
      {content2 &&
        (content2.misconH2 || (content2.misconItems?.length ?? 0) > 0) && (
          <section className={styles.section}>
            <div className={`container ${styles.facilityContainer}`}>
              <div className={styles.s11HeaderWrap}>
                <div className={styles.s11OmRow}>
                  <span className={styles.s11OmLine} />
                  <span className={styles.s11OmGlyph}>ॐ</span>
                  <span className={styles.s11OmLine} />
                </div>
                {content2.misconH2 && (<h2 className={styles.sectionTitleOrange}>{content2.misconH2}</h2>)}
                <div className={styles.sectionUnderline} />
              </div>
              {content2.misconParas && content2.misconParas.length > 0 && (
                <div className={styles.s11IntroBand}>
                  <div className={styles.s11IntroTag}>Shake your myths</div>
                  {content2.misconParas.map((para, i) => (<div key={i} className={styles.s11IntroPara}><SafeHtml html={para} /></div>))}
                </div>
              )}
              {content2.misconItems && content2.misconItems.length > 0 && (
                <div className={styles.s11Grid}>
                  {content2.misconItems.map((item, i) => (
                    <div key={i} className={styles.s11Card}>
                      <div className={styles.s11CardNum}>{String(i + 1).padStart(2, "0")}</div>
                      <div className={styles.s11CardDivider} />
                      <p className={styles.s11CardTxt}>{item}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.s11Footer}>
                <div className={styles.s11FooterOmRow}>
                  <span className={styles.s11FooterLine} />
                  <span className={styles.s11FooterOm}>ॐ</span>
                  <span className={styles.s11FooterLine} />
                </div>
                <p className={styles.s11FooterTxt}>
                  By dispelling these misconceptions, more yogis can appreciate the true value of
                  the 300 hours yoga teacher training — not just as a certification, but as a
                  meaningful path toward self-discovery, community, and lifelong learning.
                </p>
                <a href="#dates-fees" className={styles.s11FooterBtn}>
                  Begin Your Journey
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#FFF8EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

      <div className={styles.footerOm}>
        <span className={styles.divLine} />
        <span className={styles.omGlyph}>ॐ</span>
        <span className={styles.divLine} />
      </div>

      <ReviewSection courseType="300-hour-yoga-teacher-training"  RatingsSummaryComponent={<RatingsSummarySection />} />
      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}