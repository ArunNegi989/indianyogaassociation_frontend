"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/yoga-goa-in-india/Goayogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import StickySectionNav from "@/components/common/StickySectionNav";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
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

interface CoreProgram {
  _id: string;
  hrs: string;
  tag: string;
  subHeading: string;
  desc: string;
  linkText: string;
  linkHref: string;
}

interface SpecialProgram {
  _id: string;
  title: string;
  desc: string;
}

interface Highlight {
  _id: string;
  num: string;
  title: string;
  body: string;
}

interface ScheduleRow {
  _id: string;
  time: string;
  activity: string;
}

interface BeachImage {
  id: string;
  imgUrl: string;
}

interface ApplyField {
  _id: string;
  label: string;
}

interface ReelVideo {
  _id: string;
  videoUrl: string; // YouTube embed URL OR direct video URL (mp4/webm/etc.)
  videoFile: string; // uploaded file path e.g. /uploads/reel.mp4
  label?: string;
}

interface PageData {
  heroImage: string;
  heroAlt: string;
  introSuperLabel: string;
  introHeading: string;
  introLocation: string;
  introBestTime: string;
  introParagraphs: string[];
  introBigImage: string;
  introSmallImage: string;
  programsSuperLabel: string;
  programsSectionTitle: string;
  programsSubNote: string;
  coreProgramsSectionHeading: string;
  specialProgramsSectionHeading: string;
  arambolDesc: string;
  corePrograms: CoreProgram[];
  specialPrograms: SpecialProgram[];
  beachImages: BeachImage[];
  highlightsSuperLabel: string;
  highlightsSectionTitle: string;
  highlightsSubNote: string;
  highlights: Highlight[];
  bestTimeHeading: string;
  bestTimeText: string;
  curriculumSuperLabel: string;
  curriculumSectionTitle: string;
  learnings: string[];
  focusSectionTitle: string;
  focusBodyText: string;
  mainFocus: string[];
  scheduleSuperLabel: string;
  scheduleSectionTitle: string;
  scheduleImage: string;
  scheduleImageAlt: string;
  scheduleRows: ScheduleRow[];
  batchesSuperLabel: string;
  batchesSectionTitle: string;
  batchesNote: string;
  batchesNoteEmail: string;
  batchesAirportNote: string;
  gallerySuperLabel: string;
  gallerySectionTitle: string;
  schoolName: string;
  address1: string;
  address2: string;
  address3: string;
  phone1: string;
  phone2: string;
  addressSectionTitle: string;
  reachHeading: string;
  reachViaAirLabel: string;
  reachViaAir: string;
  applySectionTitle: string;
  applyEmail: string;
  applyInstructions: string;
  applyDepositAmount: string;
  applyDepositNote: string;
  applyFields: ApplyField[];
  refundSectionTitle: string;
  refundPolicy: string;
  rulesHref: string;
  rulesLinkText: string;
  footerCtaTitle: string;
  footerCtaSub: string;
  footerCtaDatesHref: string;
  footerCtaEmailHref: string;
  joinCtaText: string;
  viewDatesText: string;
  emailUsText: string;
  reelVideos?: ReelVideo[];
}

/* ─── HELPERS ─── */
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

function shortDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
}

function monthYear(start: string): string {
  return new Date(start).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function resolveImg(path: string, base: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path}`;
}

/* ─── Check if a URL is a direct video file (not YouTube/Vimeo embed) ─── */
function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  // Check for common video file extensions
  const videoExtensions = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)(\?.*)?$/i;
  if (videoExtensions.test(url)) return true;
  // Not a YouTube/Vimeo embed URL pattern
  const embedPatterns = /youtube\.com\/embed|vimeo\.com\/video|youtu\.be/i;
  if (embedPatterns.test(url)) return false;
  // If it's a blob or data URL treat as video
  if (url.startsWith("blob:") || url.startsWith("data:video")) return true;
  return false;
}

/* ─── CURRENCY ─── */
type Currency = "USD" | "INR";

const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: " FACILITY", id: "facility" },
  { label: "ACCOMMODATION", id: "accommodation" },
  { label: "LOCATION", id: "location" },
];

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

function fmtPriceAdvanced(
  batch: Batch | null,
  currency: Currency,
  rate: number,
  overrideUsd?: number,
): { amount: string; cur: string } {
  if (!batch && overrideUsd === undefined)
    return { amount: "—", cur: currency };
  if (currency === "INR") {
    if (batch?.inrFee) {
      const num = parseFloat(batch.inrFee.replace(/[₹,]/g, "").trim());
      if (!isNaN(num) && num > 100)
        return { amount: `₹${num.toLocaleString("en-IN")}`, cur: "INR" };
    }
    const usdNum = batch
      ? parseFloat(batch.usdFee.replace(/[$,]/g, "")) || batch.dormPrice
      : (overrideUsd ?? 0);
    const inr = Math.round(usdNum * rate);
    return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
  }
  if (batch?.usdFee) {
    const raw = batch.usdFee.trim();
    return { amount: raw.startsWith("$") ? raw : `$${raw}`, cur: "USD" };
  }
  const fallback = overrideUsd ?? batch?.dormPrice ?? 0;
  return { amount: `$${fallback}`, cur: "USD" };
}

function fmtPrice(usd: number, currency: Currency, rate: number) {
  if (currency === "USD") return { amount: `$${usd}`, cur: "USD" };
  const inr = Math.round((usd * rate) / 100) * 100;
  return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
}

/* ─── CURRENCY DROPDOWN ─── */
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

/* ─── COURSE INFO CARD ─── */
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
    <path d="M8 17v4M16 17v4M8 21h8M9 10l2 2 4-4" />
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
    <path d="M12 6v5.5M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5M10 18l-1.5 3.5M14 18l1.5 3.5M7 11l5 2.5 5-2.5" />
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
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
    available.length > 0 ? Math.min(...available.map((s) => s.dormPrice)) : 699;
  const originalPrice = Math.round((startingPrice * 1.7) / 50) * 50;
  const fmt = (usd: number) => fmtPrice(usd, currency, rate);
  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "28 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "All Levels" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "200 / 300 / 500 Hr" },
    {
      icon: <StyleIcon />,
      label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Hatha, Ashtanga & Vinyasa",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English" },
    { icon: <DateIcon />, label: "LOCATION", value: "Arambol Beach, Goa" },
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
              {fmt(originalPrice).amount}
            </span>
            <span className={styles.icPriceNew}>
              {fmt(startingPrice).amount}
            </span>
            <span className={styles.icPriceCur}>{currency}</span>
          </div>
          <a href="#dates-fees" className={styles.icBookBtn}>
            BOOK NOW
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

/* ─── COURSE TABS ─── */
const COURSE_TABS = [
  {
    label: "200 Hour",
    key: "200hr",
    apiPath: "/goa-200hr-seats/getAllBatches",
  },
  {
    label: "300 Hour",
    key: "300hr",
    apiPath: "/goa-300hr-seats/getAllBatches",
  },
  {
    label: "500 Hour",
    key: "500hr",
    apiPath: "/goa-500hr-seats/getAllBatches",
  },
] as const;
type TabKey = (typeof COURSE_TABS)[number]["key"];

/* ─── PREMIUM SEAT BOOKING ─── */
function PremiumSeatBooking() {
  const [activeTab, setActiveTab] = useState<TabKey>("200hr");
  const [batchCache, setBatchCache] = useState<Record<string, Batch[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const fetchBatches = async (tab: TabKey) => {
    if (batchCache[tab]) return;
    const apiPath = COURSE_TABS.find((t) => t.key === tab)?.apiPath;
    if (!apiPath) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api${apiPath}`);
      const data = await res.json();
      setBatchCache((prev) => ({ ...prev, [tab]: data?.data || [] }));
    } catch {
      setError("Failed to load batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches(activeTab);
    setSelectedId(null);
  }, [activeTab]);

  const seats: Batch[] = batchCache[activeTab] || [];
  const activeTabLabel = COURSE_TABS.find((t) => t.key === activeTab)?.label;

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvail = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvail) setSelectedId(firstAvail._id);
  }, [seats]);

  const selected = seats.find((s) => s._id === selectedId) ?? null;

  const batchCardPrice = (batch: Batch): { amount: string; cur: string } =>
    fmtPriceAdvanced(batch, currency, rate);

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2025–2026</div>
      <h2 className={styles.psbMainTitle}>
        Yoga Teacher Training — Goa, India
      </h2>
      <p className={styles.psbSecSub}>
        Choose your course, dates & preferred accommodation — prices include
        tuition and meals
      </p>
      <div className={styles.psbOrnLine}>
        <div className={styles.psbOrnL} />
        <div className={styles.psbOrnDiamond} />
        <div className={styles.psbOrnR} />
      </div>

      <div className={styles.psbTabBar}>
        {COURSE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.psbTab} ${activeTab === tab.key ? styles.psbTabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.psbLayout}>
        {/* LEFT PANEL */}
        <div className={styles.psbLeftPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
          <div className={styles.psbLph}>
            <span className={styles.psbLphTitle}>
              Select Your Batch — {activeTabLabel}
            </span>
            <div className={styles.psbLphRight}>
              <CurrencyDropdown currency={currency} onChange={setCurrency} />
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
          {loading ? (
            <p className={styles.psbNoBatches}>🕉️ Loading batches...</p>
          ) : error ? (
            <p className={styles.psbNoBatches} style={{ color: "#8a2c00" }}>
              {error}
            </p>
          ) : seats.length === 0 ? (
            <p className={styles.psbNoBatches}>
              No upcoming batches for {activeTabLabel}.
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
                const seatsPercent = full
                  ? 100
                  : Math.max(5, (rem / batch.totalSeats) * 100);
                const isSelected = selectedId === batch._id;
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
              {activeTabLabel} Yoga Teacher Training — Goa
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
                Arambol Beach, Goa, India
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
                    return `₹${Math.round(usdNum * rate).toLocaleString("en-IN")}`;
                  })()}
                </span>
              </div>
            )}
            <div className={styles.psbDivider} />
            {selected &&
              (() => {
                const rem = selected.totalSeats - selected.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const pct = full
                  ? 100
                  : Math.round(
                      (selected.bookedSeats / selected.totalSeats) * 100,
                    );
                return (
                  <div className={styles.psbRpSeatsWrap}>
                    <div className={styles.psbRpSeatsRow}>
                      <span className={styles.psbRpSeatsLbl}>
                        Seats Availability
                      </span>
                      <span
                        className={styles.psbRpSeatsBadge}
                        style={{
                          color: full ? "#8a2c00" : low ? "#c8700a" : "#3d6000",
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
                  </div>
                );
              })()}
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
            {selected ? (
              <a
                href={`/yoga-registration?batchId=${selected._id}&type=${activeTab}`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPriceAdvanced(selected, currency, rate).amount}{" "}
                {currency}
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

/* ═══════════════════════════════════════════════════════
   REEL VIDEO GRID — fully dynamic, lazy-loaded

   Priority logic (per card):
   1. videoFile (uploaded mp4/webm) → <video autoPlay muted loop playsInline>
   2. videoUrl that is a direct video URL (.mp4 etc.) → <video autoPlay muted loop playsInline>
   3. videoUrl that is a YouTube/embed URL → <iframe> with autoplay params

   All videos: no controls shown, autoplay muted loop.
═══════════════════════════════════════════════════════ */

const ReelPlaceholder = () => (
  <div
    style={{
      width: "100%",
      aspectRatio: "9/16",
      background: "linear-gradient(135deg,#1a0a00 0%,#2d1500 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
    }}
  >
    <span style={{ fontSize: "2.5rem", opacity: 0.25 }}>▶</span>
  </div>
);

function LazyReelCard({
  reel,
  index,
  API_BASE,
}: {
  reel: ReelVideo;
  index: number;
  API_BASE: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Resolve file src (uploaded file takes top priority)
  const fileSrc = reel.videoFile ? resolveImg(reel.videoFile, API_BASE) : "";
  const urlSrc = reel.videoUrl || "";

  // Decide render mode
  const useFileSrc = !!fileSrc;
  const useDirectUrl = !useFileSrc && !!urlSrc && isDirectVideoUrl(urlSrc);
  const useIframe = !useFileSrc && !useDirectUrl && !!urlSrc;

  // Ensure YouTube embeds have autoplay + mute params
  const safeIframeSrc = (() => {
    if (!useIframe) return urlSrc;
    try {
      const u = new URL(urlSrc);
      u.searchParams.set("autoplay", "1");
      u.searchParams.set("mute", "1");
      u.searchParams.set("controls", "0");
      u.searchParams.set("playsinline", "1");
      u.searchParams.set("modestbranding", "1");
      return u.toString();
    } catch {
      return urlSrc;
    }
  })();

  return (
    <div
      ref={ref}
      className={styles.reelCard}
      style={{ "--ri": index } as React.CSSProperties}
    >
      <div className={styles.reelVideoWrap}>
        {!visible ? (
          <ReelPlaceholder />
        ) : useFileSrc || useDirectUrl ? (
          // ── Uploaded file OR direct video URL ──
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={useFileSrc ? fileSrc : urlSrc}
            className={styles.reelIframe}
            autoPlay
            muted
            loop
            playsInline
            style={{ objectFit: "cover" }}
            // No controls prop → hides play/pause button
          />
        ) : useIframe ? (
          // ── YouTube embed / external embed URL ──
          <iframe
            src={safeIframeSrc}
            className={styles.reelIframe}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={reel.label || `Reel ${index + 1}`}
            loading="lazy"
            // pointer-events none prevents user clicking pause on iframe
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <ReelPlaceholder />
        )}
        <div className={styles.reelOverlay} />
      </div>
      {reel.label && (
        <div className={styles.reelLabel}>
          <span className={styles.reelPulseDot} />
          {reel.label}
        </div>
      )}
    </div>
  );
}

const DEFAULT_REELS: ReelVideo[] = [
  {
    _id: "1",
    videoUrl:
      "https://www.youtube.com/embed/X-4RQYlTRtk?autoplay=1&mute=1&loop=1&playlist=X-4RQYlTRtk&controls=0&playsinline=1&modestbranding=1",
    videoFile: "",
    label: "Morning Practice",
  },
  {
    _id: "2",
    videoUrl:
      "https://www.youtube.com/embed/lYeh7tUMLHQ?autoplay=1&mute=1&loop=1&playlist=lYeh7tUMLHQ&controls=0&playsinline=1&modestbranding=1",
    videoFile: "",
    label: "Pranayama Session",
  },
  {
    _id: "3",
    videoUrl:
      "https://www.youtube.com/embed/EJ6K-rhqevE?autoplay=1&mute=1&loop=1&playlist=EJ6K-rhqevE&controls=0&playsinline=1&modestbranding=1",
    videoFile: "",
    label: "Beach Meditation",
  },
  {
    _id: "4",
    videoUrl:
      "https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&mute=1&loop=1&playlist=v7AYKMP6rOE&controls=0&playsinline=1&modestbranding=1",
    videoFile: "",
    label: "Yoga Flow",
  },
];

function ReelVideoGrid({
  reels,
  API_BASE,
}: {
  reels?: ReelVideo[];
  API_BASE: string;
}) {
  const items = reels && reels.length > 0 ? reels : DEFAULT_REELS;
  return (
    <section id="facility" className={styles.reelSection}>
      <div className={styles.reelHeader}>
        <span className={styles.superLabel}>FEEL THE ENERGY</span>
        <h2 className={styles.sectionTitle}>Life at Our Goa Ashram</h2>
        <OmDivider />
      </div>
      <div className={styles.reelGrid}>
        {items.slice(0, 4).map((reel, i) => (
          <LazyReelCard
            key={reel._id || i}
            reel={reel}
            index={i}
            API_BASE={API_BASE}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── DAILY SCHEDULE ─── */
function DailyScheduleSection({
  rows,
  scheduleImage,
  superLabel,
  sectionTitle,
  API_BASE,
}: {
  rows: ScheduleRow[];
  scheduleImage: string;
  superLabel: string;
  sectionTitle: string;
  API_BASE: string;
}) {
  const scheduleSrc = resolveImg(scheduleImage, API_BASE);
  return (
    <section className={styles.scheduleSection2}>
      <div className={styles.scheduleContainer}>
        {scheduleSrc && (
          <div className={styles.schedVideoSide}>
            <img
              src={scheduleSrc}
              alt="Daily Schedule"
              className={styles.schedImg}
              loading="lazy"
            />
            <div className={styles.schedVideoOverlay} />
            <div className={styles.schedVideoBadge}>
              <span className={styles.pulseDot} />
              Daily Routine
            </div>
          </div>
        )}
        <div className={styles.schedCardsSide}>
          <span className={styles.eyebrow}>{superLabel}</span>
          <h2 className={styles.schedHeading}>{sectionTitle}</h2>
          <div className={styles.schedGrid}>
            {rows.map((s, i) => (
              <div
                key={s._id}
                className={styles.schedChip}
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className={styles.schedIconBox}>
                  <span className={styles.schedNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className={styles.schedChipText}>
                  <span className={styles.schedTime}>{s.time}</span>
                  <p>{s.activity}</p>
                </div>
                <div className={styles.schedGlow} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CURRICULUM ─── */
function CurriculumSection({
  superLabel,
  sectionTitle,
  learnings,
  focusSectionTitle,
  focusBodyText,
  mainFocus,
}: {
  superLabel: string;
  sectionTitle: string;
  learnings: string[];
  focusSectionTitle: string;
  focusBodyText: string;
  mainFocus: string[];
}) {
  return (
    <section id="curriculum" className={styles.curriculumSection}>
      <div className={`${styles.container} ${styles.currContainer}`}>
        <div className={`${styles.reveal} ${styles.centered}`}>
          <span className={styles.superLabel}>{superLabel}</span>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          <OmDivider />
        </div>
        <div className={`${styles.reveal} ${styles.currGrid}`}>
          {learnings.map((l, i) => (
            <div
              key={i}
              className={styles.currCard}
              style={{ "--i": i } as React.CSSProperties}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--x",
                  `${e.clientX - rect.left}px`,
                );
                e.currentTarget.style.setProperty(
                  "--y",
                  `${e.clientY - rect.top}px`,
                );
              }}
            >
              <div className={styles.currCardNumber}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <p className={styles.currCardText}>{l}</p>
              <div className={styles.currCardGlow} />
            </div>
          ))}
        </div>
        <div className={`${styles.reveal} ${styles.focusSection}`}>
          <h3 className={styles.subHeading}>{focusSectionTitle}</h3>
          <OmDivider align="center" />
          <p className={styles.para}>{focusBodyText}</p>
          <div className={styles.focusChips}>
            {mainFocus.map((f) => (
              <span key={f} className={styles.focusChip}>
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── OM DIVIDER ─── */
function OmDivider({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <div
      className={styles.omDivider}
      style={{ justifyContent: align === "left" ? "flex-start" : "center" }}
    >
      <span className={styles.omLine} />
      <span className={styles.omGlyph}>ॐ</span>
      <span className={styles.omLine} />
    </div>
  );
}

/* ─── MANDALA SVGS ─── */
function MandalaRing({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.14].map((r) => r * size);
  const spokes = 24;
  const petals = 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke="#f15505" strokeWidth="0.7" fill="none">
        {rings.map((r, i) => (
          <circle key={i} cx={c} cy={c} r={r} />
        ))}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return (
            <line
              key={i}
              x1={c + rings[2] * Math.cos(a)}
              y1={c + rings[2] * Math.sin(a)}
              x2={c + rings[0] * Math.cos(a)}
              y2={c + rings[0] * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return (
            <ellipse
              key={i}
              cx={c + r * Math.cos(a)}
              cy={c + r * Math.sin(a)}
              rx={size * 0.07}
              ry={size * 0.025}
              transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${c + r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaFull({
  size = 600,
  opacity = 0.05,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g
        stroke="#f15505"
        strokeWidth="0.6"
        fill="none"
        transform={`translate(${c},${c})`}
      >
        {[0.46, 0.38, 0.3, 0.22, 0.14, 0.07].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          const r0 = size * 0.07,
            r1 = size * 0.46;
          return (
            <line
              key={i}
              x1={r0 * Math.cos(a)}
              y1={r0 * Math.sin(a)}
              x2={r1 * Math.cos(a)}
              y2={r1 * Math.sin(a)}
            />
          );
        })}
        {[8, 16].map((n, ni) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const r = size * (ni === 0 ? 0.32 : 0.2);
            return (
              <ellipse
                key={`${ni}-${i}`}
                cx={r * Math.cos(a)}
                cy={r * Math.sin(a)}
                rx={size * (ni === 0 ? 0.065 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${r * Math.cos(a)} ${r * Math.sin(a)})`}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function GoaYogaPage() {
  const [modal, setModal] = useState<{ src: string; label: string } | null>(
    null,
  );
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [batchSeats, setBatchSeats] = useState<Batch[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const [pageRes, seatsRes] = await Promise.all([
          fetch(`${API_BASE}/api/goa-yoga-page/get`),
          fetch(`${API_BASE}/api/goa-200hr-seats/getAllBatches`),
        ]);
        const pageJson = await pageRes.json();
        const seatsJson = await seatsRes.json();
        if (pageJson.success && pageJson.data) setPageData(pageJson.data);
        else setPageError(true);
        setBatchSeats(seatsJson?.data || []);
      } catch {
        setPageError(true);
      } finally {
        setPageLoading(false);
      }
    };
    fetchPage();
  }, [API_BASE]);

  useEffect(() => {
    if (!pageData) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pageData]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (pageLoading) {
    return (
      <div
        className={styles.page}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.stateBox}>🕉️ Loading...</div>
      </div>
    );
  }
  if (pageError || !pageData) {
    return (
      <div
        className={styles.page}
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.stateBox}>
          Failed to load page. Please refresh.
        </div>
      </div>
    );
  }

  const heroSrc = resolveImg(pageData.heroImage, API_BASE);
  const introBigSrc = resolveImg(pageData.introBigImage, API_BASE);
  const introSmallSrc = resolveImg(pageData.introSmallImage, API_BASE);

  return (
    <div className={styles.page}>
      <div className={styles.pageWatermark} aria-hidden="true">
        <MandalaFull size={700} opacity={0.03} />
      </div>

      {/* ════════ HERO ════════ */}
      <section id="hero" className={styles.heroSection}>
        {heroSrc && (
          <img
            src={heroSrc}
            alt={pageData.heroAlt}
            className={styles.heroImage}
          />
        )}
      </section>

      {/* ════════ COURSE INFO CARD ════════ */}
      <CourseInfoCard seats={batchSeats} currency="USD" rate={83} />
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ════════ INTRO ════════ */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.introContainer}`}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introImages}>
              <div className={styles.imageStack}>
                {introBigSrc && (
                  <div className={styles.imgMain}>
                    <img
                      src={introBigSrc}
                      alt={pageData.heroAlt}
                      loading="lazy"
                    />
                  </div>
                )}
                {introSmallSrc && (
                  <div className={styles.imgAccent}>
                    <img
                      src={introSmallSrc}
                      alt={pageData.introHeading}
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={styles.introText}>
              <span className={styles.superLabel}>
                {pageData.introSuperLabel}
              </span>
              <h2 className={styles.sectionTitle}>{pageData.introHeading}</h2>
              <OmDivider align="left" />
              {pageData.introParagraphs?.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PROGRAMS ════════ */}
      <section
        id="programs"
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRing size={600} opacity={0.05} />
        </div>
        <div className={`${styles.container} ${styles.programcontainer}`}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.programsSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.programsSectionTitle}
            </h2>
            <OmDivider />
            <p className={styles.paraCenter}>{pageData.programsSubNote}</p>
          </div>
          <div className={styles.reveal}>
            <h3 className={styles.subHeading}>
              {pageData.coreProgramsSectionHeading}
            </h3>
            <div className={styles.programsGrid}>
              {pageData.corePrograms?.map((p) => (
                <div key={p._id} className={styles.programCard}>
                  <div className={styles.programHrs}>
                    {p.hrs}
                    <span>HR</span>
                  </div>
                  <div className={styles.programTag}>{p.tag}</div>
                  <h4 className={styles.programTitle}>{p.subHeading}</h4>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <a href={p.linkHref} className={styles.programLink}>
                    {p.linkText}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.reveal} ${styles.specialWrap}`}>
            <h3 className={styles.subHeading}>
              {pageData.specialProgramsSectionHeading}
            </h3>
            <div className={styles.specialGrid}>
              {pageData.specialPrograms?.map((p) => (
                <div key={p._id} className={styles.specialCard}>
                  <span className={styles.specialIcon}>🎵</span>
                  <h4 className={styles.specialTitle}>{p.title}</h4>
                  <p className={styles.specialDesc}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.reveal} ${styles.arambolBox}`}>
            <p className={styles.paraCenter}>{pageData.arambolDesc}</p>
            {pageData.beachImages?.length > 0 && (
              <div className={styles.beachPhotoRow}>
                {pageData.beachImages.map((b) => {
                  const src = resolveImg(b.imgUrl, API_BASE);
                  return src ? (
                    <div key={b.id} className={styles.beachPhoto}>
                      <img src={src} alt={`Beach ${b.id}`} loading="lazy" />
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════ HIGHLIGHTS ════════ */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.highlightcontainer}`}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.highlightsSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.highlightsSectionTitle}
            </h2>
            <OmDivider />
            <p className={styles.paraCenter}>{pageData.highlightsSubNote}</p>
          </div>
          <div className={`${styles.reveal} ${styles.highlightsGrid}`}>
            {pageData.highlights?.map((h) => (
              <div key={h._id} className={styles.highlightCard}>
                <div className={styles.highlightNum}>{h.num}</div>
                <div className={styles.highlightBody}>
                  <h4 className={styles.highlightTitle}>{h.title}</h4>
                  <p className={styles.highlightText}>{h.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`${styles.reveal} ${styles.bestTimeBox}`}>
            <h3 className={styles.subHeading}>{pageData.bestTimeHeading}</h3>
            <OmDivider align="center" />
            <p className={styles.para}>{pageData.bestTimeText}</p>
          </div>
        </div>
      </section>

      {/* ════════ CURRICULUM ════════ */}
      <CurriculumSection
        superLabel={pageData.curriculumSuperLabel}
        sectionTitle={pageData.curriculumSectionTitle}
        learnings={pageData.learnings}
        focusSectionTitle={pageData.focusSectionTitle}
        focusBodyText={pageData.focusBodyText}
        mainFocus={pageData.mainFocus}
      />

      {/* ════════ DAILY SCHEDULE ════════ */}
      <DailyScheduleSection
        rows={pageData.scheduleRows}
        scheduleImage={pageData.scheduleImage}
        superLabel={pageData.scheduleSuperLabel}
        sectionTitle={pageData.scheduleSectionTitle}
        API_BASE={API_BASE}
      />

      {/* ════════ SEAT BOOKING ════════ */}
      <PremiumSeatBooking />
      <div className={`${styles.container} ${styles.introContainer}`}>
        <div className={styles.tableNote}>
          {pageData.batchesNote && (
            <p>
              <strong>Note:</strong> {pageData.batchesNote}{" "}
              {pageData.batchesNoteEmail && (
                <a
                  href={`mailto:${pageData.batchesNoteEmail}`}
                  className={styles.emailLink}
                >
                  {pageData.batchesNoteEmail}
                </a>
              )}
            </p>
          )}
          {pageData.batchesAirportNote && <p>{pageData.batchesAirportNote}</p>}
        </div>
      </div>

      {/* ════════ REEL VIDEO GRID ════════ */}
      <ReelVideoGrid reels={pageData.reelVideos} API_BASE={API_BASE} />

      {/* ════════ INFO GRID ════════ */}
      <section id="apply" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.infoGrid}`}>
            {/* 📍 ADDRESS */}
            <div className={styles.infoCard}>
              <div className={styles.infoTop}>
                <span className={styles.infoIcon}>📍</span>
                <h3 className={styles.infoTitle}>Address</h3>
              </div>
              <OmDivider align="left" />
              <address className={styles.address}>
                {pageData.schoolName && <strong>{pageData.schoolName}</strong>}
                {pageData.address1 && <p>{pageData.address1}</p>}
                {pageData.address2 && <p>{pageData.address2}</p>}
                {pageData.address3 && <p>{pageData.address3}</p>}
                <div className={styles.contactLinks}>
                  {pageData.phone1 && (
                    <a href={`tel:${pageData.phone1}`}>{pageData.phone1}</a>
                  )}
                  {pageData.phone2 && (
                    <a href={`tel:${pageData.phone2}`}>{pageData.phone2}</a>
                  )}
                </div>
              </address>
            </div>

            {/* ✈️ REACH */}
            <div className={styles.infoCard}>
              <div className={styles.infoTop}>
                <span className={styles.infoIcon}>✈️</span>
                <h3 className={styles.infoTitle}>{pageData.reachHeading}</h3>
              </div>
              <OmDivider align="left" />
              <p className={styles.para}>
                {pageData.reachViaAirLabel && (
                  <strong>{pageData.reachViaAirLabel} </strong>
                )}
                {pageData.reachViaAir}
              </p>
            </div>

            {/* 📝 APPLY */}
            <div className={styles.infoCard}>
              <div className={styles.infoTop}>
                <span className={styles.infoIcon}>📝</span>
                <h3 className={styles.infoTitle}>How to Apply</h3>
              </div>
              <OmDivider align="center" />
              {pageData.applyInstructions && (
                <p className={styles.para}>{pageData.applyInstructions}</p>
              )}
              {pageData.applyDepositNote && (
                <p className={styles.note}>{pageData.applyDepositNote}</p>
              )}
              <div className={styles.formFields}>
                {pageData.applyFields?.map((f) => (
                  <span key={f._id} className={styles.fieldChip}>
                    {f.label}
                  </span>
                ))}
              </div>
              {pageData.applyEmail && (
                <a
                  href={`mailto:${pageData.applyEmail}`}
                  className={styles.ctaBtn}
                >
                  Apply Now →
                </a>
              )}
            </div>

            {/* 🔄 REFUND */}
            <div className={styles.infoCard}>
              <div className={styles.infoTop}>
                <span className={styles.infoIcon}>🔄</span>
                <h3 className={styles.infoTitle}>Refund Rules</h3>
              </div>
              <OmDivider align="left" />
              <p className={styles.para}>{pageData.refundPolicy}</p>
              <p className={styles.rulesText}>
                Rules and regulation as per yoga TTC courses at AYM.
              </p>
              {pageData.rulesHref && (
                <Link href={pageData.rulesHref} className={styles.rulesBtn}>
                  More Information Rules & Regulation →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER CTA ════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaFull size={500} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            <div className={styles.footerOm}>ॐ</div>
            <h2 className={styles.footerTitle}>{pageData.footerCtaTitle}</h2>
            <p className={styles.footerSub}>{pageData.footerCtaSub}</p>
            <div className={styles.heroBtns}>
              <a
                href={pageData.footerCtaDatesHref || "#dates-fees"}
                className={styles.btnPrimary}
              >
                Dates
              </a>
              <a
                href={
                  pageData.footerCtaEmailHref || `mailto:${pageData.applyEmail}`
                }
                className={styles.btnOutline}
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <div id="accommodation" className={styles.accommodationSection}>
        <PremiumGallerySection type="both" backgroundColor="warm" />
      </div>

      <ReviewSection courseType="yoga-teacher-training-goa" RatingsSummaryComponent={<RatingsSummarySection />} />

      <div id="location">
        <HowToReach />
      </div>

      {/* ════════ MODAL ════════ */}
      {modal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className={styles.modalMandala} aria-hidden="true">
              <MandalaRing size={200} opacity={0.12} />
            </div>
            <img
              src={modal.src}
              alt={modal.label}
              className={styles.modalImg}
            />
            <div className={styles.modalCaption}>
              <OmDivider />
              <p>{modal.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
