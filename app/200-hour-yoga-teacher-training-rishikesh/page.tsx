"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/200-hour-yoga-teacher-training-rishikesh/Twohundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import StickySectionNav from "@/components/common/StickySectionNav";
import Image from "next/image";
import api from "@/lib/api";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
type Currency = "USD" | "INR";
interface StatItem {
  icon: string;
  value: string;
  title: string;
  desc: string;
}
interface ModuleItem {
  title: string;
  intro: string;
  items: string[];
  body?: string;
}

interface Content1 {
  _id: string;
  slug: string;
  status: string;
  pageMainH1: string;
  heroImage: string;
  heroImgAlt: string;
  introPara1: string;
  introPara2: string;
  introPara3: string;
  introPara4: string;
  stats: StatItem[];
  aimsH3: string;
  aimsIntro: string;
  aimsOutro: string;
  aimsKeyObjLabel: string;
  aimsBullets: string[];
  overview: {
    h2: string;
    certName: string;
    level: string;
    eligibility: string;
    minAge: string;
    credits: string;
    language: string;
  };
  upcomingDatesH2: string;
  upcomingDatesSubtext: string;
  feeIncludedTitle: string;
  feeNotIncludedTitle: string;
  includedFee: string[];
  notIncludedFee: string[];
  syllabusH3: string;
  syllabusIntro: string;
  modules: ModuleItem[];
  ashtanga: {
    h2: string;
    subtitle: string;
    desc: string;
    image: string;
    imgAlt: string;
    pills: string[];
  };
  primary: {
    h3: string;
    subtext: string;
    intro: string;
    foundationItems: string[];
    weekGrid: Array<{
      week: string;
      icon: string;
      items: Array<{ t: string; d: string }>;
      [key: string]: any;
    }>;
  };
  hatha: {
    h2: string;
    subtitle: string;
    desc: string;
    image: string;
    imgAlt: string;
    pills: string[];
    asanas: Array<{ n: number; name: string; sub: string; filter?: string }>;
  };
}

interface Content2 {
  evalH2: string;
  evalDesc: string;
  luxuryH2: string;
  luxFeatures: string[];
  luxImages: string[];
  indianFeeH2: string;
  indianFees: Array<{ label: string; price: string }>;
  scheduleH2: string;
  schedDesc: string;
  schedRows: Array<{ time: string; activity: string }>;
  schedImages: string[];
  moreInfoH2: string;
  instrLangs: Array<{ lang: string } | string>;
  visaPassportDesc: string;
  programs: Array<{
    title: string;
    desc: string;
    duration: string;
    start: string;
    oldPrice: string;
    price: string;
  }>;
  requirementsH2: string;
  reqImage: string;
  faqItems: Array<{ q: string; a: string }>;
  knowQA?: Array<{ q: string; a: string }>;
  bookingH2: string;
  step1Icon?: string;
  step1Title?: string;
  bookingStep1Desc?: string;
  step2Icon?: string;
  step2Title?: string;
  bookingStep2Desc?: string;
  step3Icon?: string;
  step3Title?: string;
  bookingStep3Desc?: string;
  step4Icon?: string;
  step4Title?: string;
  bookingStep4Desc?: string;
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

const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: "INCLUSIONS", id: "inclusions" },
  { label: "FACILITY", id: "facility" },
  { label: "LOCATION", id: "location" },
];

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
function imgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
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

/* ══════════════════════════════
   SVG ICONS
══════════════════════════════ */
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

/* ══════════════════════════════
   CORNER ORNAMENT
══════════════════════════════ */
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

/* ══════════════════════════════
   VINTAGE HEADING — 2 col layout
   Left: heading+divider  Right: paragraph
══════════════════════════════ */
function VintageHeading({
  children,
  para,
}: {
  children: React.ReactNode;
  para?: React.ReactNode;
}) {
  if (para) {
    return (
      <div className={styles.vintageHeadingWrap}>
        <div className={styles.vintageHeadingLeft}>
          <h2 className={styles.vintageHeading}>{children}</h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine}></span>
          </div>
        </div>
        <div className={styles.vintageHeadingPara}>{para}</div>
      </div>
    );
  }
  return (
    <div className={styles.vintageHeadingWrap}>
      <h2 className={styles.vintageHeading}>{children}</h2>

      <div className={styles.omDivider}>
        <span className={styles.dividerLine}></span>
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine}></span>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   VIDEO SECTION — premium autoplay
══════════════════════════════ */
function VideoSection() {
  return (
    <div className={styles.videoSection}>
      <div className={styles.videoCard}>
        <iframe
          src="https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&mute=1&loop=1&playlist=v7AYKMP6rOE&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="200 Hour Yoga Teacher Training Rishikesh"
        />
        <div className={styles.videoOverlay} />
        <div className={styles.videoBadge}>
          <div className={styles.videoPulse} />
          <span className={styles.videoBadgeTxt}>
            Yoga Teacher Training · Rishikesh
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   COURSE INFO CARD
══════════════════════════════ */
function CourseInfoCard({ batches }: { batches: Batch[] }) {
  const available = batches.filter((b) => b.totalSeats - b.bookedSeats > 0);
  const startingPrice =
    available.length > 0 ? Math.min(...available.map((b) => b.dormPrice)) : 699;
  const originalPrice = Math.round((startingPrice * 1.8) / 50) * 50;

  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "26 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "All Levels" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "200 Hour" },
    {
      icon: <StyleIcon />,
      label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Ashtanga, Vinyasa & Hatha",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi" },
    { icon: <DateIcon />, label: "DATE", value: "1st of every month" },
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
            <span className={styles.icPriceOld}>${originalPrice}</span>
            <span className={styles.icPriceNew}>${startingPrice}</span>
            <span className={styles.icPriceCur}>USD</span>
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

/* ══════════════════════════════
   OVERVIEW GRID with icons + image
══════════════════════════════ */
const overviewIcons: Record<string, string> = {
  certName: "🏅",
  level: "📊",
  eligibility: "✅",
  minAge: "🎂",
  credits: "⭐",
  language: "🌐",
};

const yogaImages = [
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=400&h=200&fit=crop",
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=200&fit=crop",
];

/* ══════════════════════════════
   MODULE CARD
══════════════════════════════ */
function ModuleCard({
  title,
  intro,
  items,
  index,
}: {
  title: string;
  intro: string;
  items: string[];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const moduleNum = String(index + 1).padStart(2, "0");
  return (
    <div className={styles.moduleCard}>
      <div className={styles.moduleCardAccent} />
      <div className={styles.moduleCardInner}>
        <div className={styles.moduleCardHeader}>
          <span className={styles.moduleCardNum}>{moduleNum}</span>
          <h3 className={styles.moduleCardTitle}>{stripHtml(title)}</h3>
        </div>
        <p className={styles.moduleCardIntro}>{stripHtml(intro)}</p>
        {items.length > 0 && (
          <>
            <ul className={styles.moduleOl}>
              {(expanded ? items : items.slice(0, 4)).map((it, i) => (
                <li key={i}>
                  <span className={styles.moduleOlDot} />
                  {stripHtml(it)}
                </li>
              ))}
            </ul>
            {items.length > 4 && (
              <button
                className={styles.moduleExpandBtn}
                onClick={() => setExpanded(!expanded)}
              >
                {expanded
                  ? "Show Less ↑"
                  : `+${items.length - 4} More Topics ↓`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════
   INCLUDE / EXCLUDE TABS
══════════════════════════════ */
function IncludeExcludeTabs({
  includedFee,
  notIncludedFee,
  includedTitle,
  notIncludedTitle,
}: {
  includedFee: string[];
  notIncludedFee: string[];
  includedTitle: string;
  notIncludedTitle: string;
}) {
  const [activeTab, setActiveTab] = useState<"include" | "exclude">("include");
  return (
    <div className={styles.incWrap}>
      <div className={styles.incTabs}>
        <button
          className={`${styles.incTab} ${activeTab === "include" ? styles.active : ""}`}
          onClick={() => setActiveTab("include")}
        >
          ✓ {includedTitle || "What Is Included?"}
        </button>
        <button
          className={`${styles.incTab} ${activeTab === "exclude" ? styles.active : ""}`}
          onClick={() => setActiveTab("exclude")}
        >
          ✕ {notIncludedTitle || "What Is Not Included?"}
        </button>
      </div>
      <div className={styles.incContent}>
        <ul className={styles.incList}>
          {(activeTab === "include" ? includedFee : notIncludedFee)?.map(
            (it, i) => (
              <li key={i}>{stripHtml(it)}</li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   PREMIUM SEAT BOOKING
══════════════════════════════ */
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

  const fmtPrice = (usd: number) => {
    if (currency === "INR") {
      const inr = Math.round((usd * rate) / 100) * 100;
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }
    return { amount: `$${usd}`, cur: "USD" };
  };

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

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <VintageHeading>200 Hour Yoga Teacher Training India</VintageHeading>
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
                const dormFmt = fmtPrice(batch.dormPrice);
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
                      {dormFmt.amount} <span>{dormFmt.cur}</span>
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
              200 Hour Yoga Teacher Training
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
                  {selected ? fmtPrice(selected.privatePrice).amount : "—"}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>
                  {selected ? fmtPrice(selected.twinPrice).amount : "—"}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>
            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>
                  {selected ? fmtPrice(selected.dormPrice).amount : "—"}
                </span>
                <span className={styles.psbPcCur}>{currency}</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>
            {selected && currency === "USD" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>{selected.inrFee}</span>
              </div>
            )}
            {selected && currency === "INR" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>USD Price</span>
                <span className={styles.psbInrAmt}>
                  ${selected.dormPrice} USD
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
                href={`/yoga-registration?batchId=${selected._id}&type=200hr`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPrice(selected.dormPrice).amount} {currency}
                <svg
                  className={styles.psbArrowIcon}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="#fff"
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

/* ══════════════════════════════
   CURRENCY HOOK
══════════════════════════════ */
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
        if (inr) setRate(inr);
      })
      .finally(() => setLoading(false));
  }, []);
  return { rate, loading };
}

/* ══════════════════════════════
   PAGE SKELETON
══════════════════════════════ */
function PageSkeleton() {
  return (
    <div
      className={styles.root}
      style={{ padding: "4rem 2rem", textAlign: "center" }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕉️</div>
      <p style={{ color: "#e07b00", fontSize: "1.2rem" }}>
        Loading yoga journey...
      </p>
    </div>
  );
}

const ASANA_FILTERS = [
  "All Poses",
  "Standing",
  "Sitting",
  "Lying",
  "Balancing",
] as const;
type AsanaFilter = (typeof ASANA_FILTERS)[number];

/* ════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════ */
export default function TwoHundredHourYoga() {
  const [content1, setContent1] = useState<Content1 | null>(null);
  const [content2, setContent2] = useState<Content2 | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asanaFilter, setAsanaFilter] = useState<AsanaFilter>("All Poses");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [c1Res, c2Res, batchRes] = await Promise.all([
          api.get("/yoga-200hr/content1"),
          api.get("/yoga-200hr/content2/get"),
          api.get("/200hr-seats/getAllBatches"),
        ]);
        const c1List: Content1[] = c1Res.data?.data || [];
        const activeC1 =
          c1List.find((c) => c.status === "Active") || c1List[0] || null;
        setContent1(activeC1);
        setContent2(c2Res.data?.data || null);
        setBatches(batchRes.data?.data || []);
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load page content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PageSkeleton />;
  if (error)
    return (
      <div
        className={styles.root}
        style={{ padding: "4rem", textAlign: "center" }}
      >
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  const allAsanas = content1?.hatha?.asanas || [];
  const modules = content1?.modules || [];
  const filteredAsanas =
    asanaFilter === "All Poses"
      ? allAsanas
      : allAsanas.filter((a) => (a.filter || "All Poses") === asanaFilter);

  const bookingSteps = [
    {
      icon: content2?.step1Icon,
      title: content2?.step1Title,
      text: content2?.bookingStep1Desc,
    },
    {
      icon: content2?.step2Icon,
      title: content2?.step2Title,
      text: content2?.bookingStep2Desc,
    },
    {
      icon: content2?.step3Icon,
      title: content2?.step3Title,
      text: content2?.bookingStep3Desc,
    },
    {
      icon: content2?.step4Icon,
      title: content2?.step4Title,
      text: content2?.bookingStep4Desc,
    },
  ].filter((step) => step.title || step.text);

  // Overview items array for rendering
  const overviewItems = content1?.overview
    ? [
        {
          key: "certName",
          label: "Name of the certification",
          value: content1.overview.certName,
        },
        { key: "level", label: "Course level", value: content1.overview.level },
        {
          key: "eligibility",
          label: "Requirement/Eligibility",
          value: content1.overview.eligibility,
        },
        {
          key: "minAge",
          label: "Minimum age",
          value: content1.overview.minAge,
        },
        {
          key: "credits",
          label: "Credit points for certificate",
          value: content1.overview.credits,
        },
        {
          key: "language",
          label: "Language",
          value: content1.overview.language,
        },
      ].filter((item) => item.value)
    : [];

  return (
    <div className={styles.root}>
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ════ HERO IMAGE ════ */}
      <section id="hero" className={styles.heroSection}>
        {content1?.heroImage && (
          <Image
            src={imgUrl(content1.heroImage)}
            alt={content1.heroImgAlt || "200 Hour Yoga Teacher Training"}
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ════ COURSE INFO CARD ════ */}
      <CourseInfoCard batches={batches} />

      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ════ HERO TEXT + VIDEO + STATS ════ */}
      <section className={styles.heroSection2}>
        {/* Heading left + first para right */}
        <VintageHeading
          para={
            content1?.introPara1 ? (
              <span className={styles.bodyText}>
                {stripHtml(content1.introPara1)}
              </span>
            ) : undefined
          }
        >
          {content1?.pageMainH1 ||
            "200 Hour Yoga Teacher Training in Rishikesh"}
        </VintageHeading>

        {/* Video Section */}
        <VideoSection />

        {/* Remaining intro paragraphs */}
        {[content1?.introPara2, content1?.introPara3, content1?.introPara4]
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className={styles.bodyText}>
              {stripHtml(para!)}
            </p>
          ))}

        {/* Stats — glass cards */}
        {content1?.stats?.length ? (
          <div className={styles.statsRow}>
            {content1.stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statVal}>{stripHtml(s.value)}</span>
                <span className={styles.statTitle}>{stripHtml(s.title)}</span>
                <span className={styles.statDesc}>{stripHtml(s.desc)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* ════ AIMS + OVERVIEW ════ */}
      <section id="dates-fees" className={styles.contentSection}>
        {/* h3Left with image on right */}
        {content1?.aimsH3 && (
          <div className={styles.h3LeftWrap}>
            <div className={styles.h3LeftContent}>
              <h3 className={styles.h3Left}>{stripHtml(content1.aimsH3)}</h3>
              <div className={styles.underlineBar} />
              {content1?.aimsIntro && (
                <p className={styles.bodyText}>
                  {stripHtml(content1.aimsIntro)}
                </p>
              )}
              {content1?.aimsKeyObjLabel && (
                <p className={styles.bodyText}>
                  <strong>{stripHtml(content1.aimsKeyObjLabel)}</strong>
                </p>
              )}
              {content1?.aimsBullets?.length ? (
                <ul className={styles.bulletList}>
                  {content1.aimsBullets.map((b, i) => (
                    <li key={i}>{stripHtml(b)}</li>
                  ))}
                </ul>
              ) : null}
              {content1?.aimsOutro && (
                <p className={styles.bodyText}>
                  {stripHtml(content1.aimsOutro)}
                </p>
              )}
            </div>
            <div className={styles.h3LeftImage}>
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=450&fit=crop"
                alt="Yoga practice Rishikesh"
              />
            </div>
          </div>
        )}

        {/* Overview with alternating images */}
        {content1?.overview && (
          <>
            <VintageHeading
              para={
                <span className={styles.bodyText}>
                  A comprehensive certification program designed to transform
                  passionate practitioners into confident, knowledgeable yoga
                  teachers.
                </span>
              }
            >
              {stripHtml(content1.overview.h2) ||
                "Overview of 200 Hour Yoga Instructor Course"}
            </VintageHeading>
            <div className={styles.overviewGrid}>
              {overviewItems.map((item, i) => (
                <div className={styles.overviewItem}>
                  <div className={styles.overviewItemIcon}>
                    {overviewIcons[item.key] || "📌"}
                  </div>

                  <div className={styles.overviewItemText}>
                    <strong>{item.label}</strong>
                    {stripHtml(item.value)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ════ PREMIUM SEAT BOOKING ════ */}
      <PremiumSeatBooking
        seats={batches}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* ════ FEE INCLUDED + SYLLABUS + MODULES 1-4 ════ */}
      <section id="curriculum" className={styles.contentSection2}>
        <div style={{ marginTop: "2.5rem" }}>
          {content1?.syllabusH3 && (
            <>
              <h3 className={styles.h3Left}>
                {stripHtml(content1.syllabusH3)}
              </h3>
              <div className={styles.underlineBar} />
            </>
          )}
          {content1?.syllabusIntro && (
            <p className={styles.bodyText}>
              {stripHtml(content1.syllabusIntro)}
            </p>
          )}
        </div>

        <div className={styles.moduleGrid}>
          {modules.slice(0, 8).map((mod, i) => (
            <ModuleCard
              key={i}
              title={mod.title}
              intro={mod.intro}
              items={mod.items}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ════ MODULES 5-8 + ASHTANGA ════ */}
      <section id="inclusions" className={styles.contentSection}>
        {content1?.ashtanga && (
          <>
            <VintageHeading
              para={
                content1.ashtanga.subtitle ? (
                  <span className={styles.bodyText}>
                    {stripHtml(content1.ashtanga.subtitle)}
                  </span>
                ) : undefined
              }
            >
              {stripHtml(content1.ashtanga.h2) ||
                "Module 8.1: Ashtanga Vinyasa Yoga"}
            </VintageHeading>
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                {content1.ashtanga.image && (
                  <img
                    src={imgUrl(content1.ashtanga.image)}
                    alt={content1.ashtanga.imgAlt || "Ashtanga"}
                    className={styles.modImg}
                  />
                )}
              </div>
              <div>
                {content1.ashtanga.desc && (
                  <p className={styles.bodyText}>
                    {stripHtml(content1.ashtanga.desc)}
                  </p>
                )}
                {content1.ashtanga.pills?.filter(Boolean).length ? (
                  <div className={styles.featurePills}>
                    {content1.ashtanga.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>
                        {stripHtml(pill)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ════ CONTENT SECTION 3 — Primary Series + Hatha (Split Layout) ════ */}
      <section className={styles.contentSection3}>
        {content1?.primary && (
          <div className={styles.section3Split}>
            <div className={styles.section3Left}>
              <div className={styles.primaryCurrCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <h3 className={styles.h3Left}>
                  {stripHtml(content1.primary.h3) ||
                    "Primary Series Curriculum"}
                </h3>
                <div className={styles.underlineBar} />
                {content1.primary.intro && (
                  <p className={styles.bodyText}>
                    {stripHtml(content1.primary.intro)}
                  </p>
                )}
                {content1.primary.foundationItems?.length ? (
                  <div className={styles.foundationBox}>
                    <div className={styles.foundationHeader}>
                      <span className={styles.foundIcon}>📖</span>
                      <strong>Foundation</strong>
                    </div>
                    <ul className={styles.foundList}>
                      {content1.primary.foundationItems.map((it, i) => (
                        <li key={i}>{stripHtml(it)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {content1.primary.weekGrid?.length ? (
                  <div className={styles.weekGrid}>
                    {content1.primary.weekGrid.map((w, i) => {
                      const items = Object.keys(w)
                        .filter((key) => key.startsWith("t"))
                        .sort(
                          (a, b) =>
                            Number(a.replace("t", "")) -
                            Number(b.replace("t", "")),
                        )
                        .map((key) => {
                          const index = key.replace("t", "");
                          return { t: w[key], d: w[`d${index}`] };
                        })
                        .filter((item) => item.t && item.d);
                      return (
                        <div key={i} className={styles.weekCard}>
                          <div className={styles.weekHeader}>
                            {stripHtml(w.week)} <span>{w.icon}</span>
                          </div>
                          {items.map((it, j) => (
                            <div key={j} className={styles.weekItem}>
                              <span className={styles.weekDot}>●</span>
                              <div>
                                <strong>{stripHtml(it.t)}</strong>
                                <br />
                                <span className={styles.weekDesc}>
                                  {stripHtml(it.d)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.section3Right}>
              <img
                src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=700&h=900&fit=crop"
                alt="Yoga Primary Series practice"
              />
            </div>
          </div>
        )}

        {/* Hatha */}
        {content1?.hatha && (
          <>
            <VintageHeading
              para={
                content1.hatha.subtitle ? (
                  <span className={styles.bodyText}>
                    {stripHtml(content1.hatha.subtitle)}
                  </span>
                ) : undefined
              }
            >
              {stripHtml(content1.hatha.h2) || "Module 8.2: Hatha Yoga"}
            </VintageHeading>
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                {content1.hatha.image && (
                  <img
                    src={imgUrl(content1.hatha.image)}
                    alt={content1.hatha.imgAlt || "Hatha"}
                    className={styles.modImg}
                  />
                )}
              </div>
              <div>
                {content1.hatha.desc && (
                  <p className={styles.bodyText}>
                    {stripHtml(content1.hatha.desc)}
                  </p>
                )}
                {content1.hatha.pills?.filter(Boolean).length ? (
                  <div className={styles.featurePills}>
                    {content1.hatha.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>
                        {stripHtml(pill)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ════ HATHA ASANAS — modern grid cards ════ */}
      {allAsanas.length > 0 && (
        <section className={styles.contentSection}>
          <VintageHeading
            para={
              <span className={styles.centerSubtext}>
                Master these {allAsanas.length} essential postures as part of
                your comprehensive training
              </span>
            }
          >
            Hatha Yoga Asanas
          </VintageHeading>
          <div className={styles.asanaFilterRow}>
            {ASANA_FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${asanaFilter === f ? styles.filterActive : ""}`}
                onClick={() => setAsanaFilter(f)}
              >
                {f}
                {f !== "All Poses" && (
                  <span
                    style={{ marginLeft: 4, opacity: 0.7, fontSize: "0.75em" }}
                  >
                    (
                    {
                      allAsanas.filter((a) => (a.filter || "All Poses") === f)
                        .length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
          {filteredAsanas.length === 0 ? (
            <p className={styles.centerSubtext} style={{ padding: "2rem 0" }}>
              No poses found in this category.
            </p>
          ) : (
            <div className={styles.asanaGrid}>
              {filteredAsanas.map((a) => (
                <div key={a.n} className={styles.asanaCard}>
                  <span className={styles.asanaNum}>{a.n}</span>
                  <div>
                    <div className={styles.asanaName}>{stripHtml(a.name)}</div>
                    <div className={styles.asanaSub}>{stripHtml(a.sub)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ════ LUXURY + INDIAN FEE + SCHEDULE ════ */}
      <section className={styles.contentSection}>
        {content2?.luxuryH2 && (
          <>
            <VintageHeading
              para={
                <span className={styles.bodyText}>
                  Experience world-class facilities designed to support your
                  yoga journey with comfort and serenity.
                </span>
              }
            >
              {stripHtml(content2.luxuryH2)}
            </VintageHeading>
            <div className={styles.luxuryGrid}>
              <div className={styles.luxuryLeft}>
                {(content2.luxFeatures || []).map((it, i) => (
                  <div key={i} className={styles.luxuryItem}>
                    {stripHtml(it)}
                  </div>
                ))}
              </div>
              <div className={styles.luxuryRight}>
                {content2.luxImages?.length ? (
                  <div className={styles.luxuryImgGrid}>
                    {content2.luxImages.map((src, i) => (
                      <img
                        key={i}
                        src={imgUrl(src)}
                        alt={`Luxury room ${i + 1}`}
                        className={`${styles.luxuryImg} ${i === content2.luxImages.length - 1 ? styles.luxuryImgWide : ""}`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}

        {content2?.indianFeeH2 && (
          <>
            <VintageHeading>{stripHtml(content2.indianFeeH2)}</VintageHeading>
            {content2.indianFees?.length ? (
              <div className={styles.indianFeeGrid}>
                {content2.indianFees.map((f, i) => (
                  <div key={i} className={styles.indianFeeCard}>
                    <span className={styles.indianFeeLabel}>
                      {stripHtml(f.label)}
                    </span>
                    <span className={styles.indianFeePrice}>
                      {stripHtml(f.price)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* Schedule — full height image beside table */}
        {content2?.scheduleH2 && (
          <>
            <VintageHeading
              para={
                content2.schedDesc ? (
                  <span className={styles.bodyText}>
                    {stripHtml(content2.schedDesc)}
                  </span>
                ) : undefined
              }
            >
              {stripHtml(content2.scheduleH2)}
            </VintageHeading>
            <div className={styles.schedLayout}>
              <div className={styles.schedTableWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <table className={styles.schedTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content2.schedRows || []).map((r, i) => (
                      <tr key={i}>
                        <td>{stripHtml(r.time)}</td>
                        <td>{stripHtml(r.activity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Full height image */}
              <div className={styles.schedImgGrid}>
                {content2.schedImages?.length ? (
                  <img
                    src={imgUrl(content2.schedImages[0])}
                    alt="Yoga class schedule"
                    className={styles.schedImg}
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=800&fit=crop"
                    alt="Yoga class"
                    className={styles.schedImg}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </section>

      {/* ════ MORE INFO + CTA ════ */}
      <section className={styles.contentSection}>
        {" "}
        <VintageHeading>Course Fee Inclusions</VintageHeading>
        <IncludeExcludeTabs
          includedFee={content1?.includedFee || []}
          notIncludedFee={content1?.notIncludedFee || []}
          includedTitle={content1?.feeIncludedTitle || ""}
          notIncludedTitle={content1?.feeNotIncludedTitle || ""}
        />
        {content2?.moreInfoH2 && (
          <VintageHeading>{stripHtml(content2.moreInfoH2)}</VintageHeading>
        )}
        {content2?.instrLangs?.length ? (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}>
              <strong>The medium of instruction:</strong>
            </p>
            <ol className={styles.numberedListSimple}>
              {content2.instrLangs.map((l, i) => (
                <li key={i}>
                  {typeof l === "string" ? stripHtml(l) : stripHtml(l.lang)}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {content2?.visaPassportDesc && (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}>
              <strong>Visa And Passport:</strong>
            </p>
            <p className={styles.bodyText}>
              {stripHtml(content2.visaPassportDesc)}
            </p>
          </div>
        )}
        <div className={styles.ctaBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.ctaBannerLeft}>
            <p className={styles.ctaBannerTitle}>
              We welcome you to AYM School for a wonderful yogic experience!
            </p>
            <p className={styles.ctaBannerSub}>
              Join us &amp; become part of the 5000+ international yoga teachers
              who are proud alumni of the AYM School.
            </p>
          </div>
          <div className={styles.ctaBannerRight}>
            <p className={styles.ctaBannerBook}>Book Your Spot Today!</p>
            <a href="#dates-fees" className={styles.applyNowBtn}>
              Apply Now
            </a>
            <a href="tel:+919528023390" className={styles.phoneBtn}>
              📱 +91-9528023390
            </a>
          </div>
        </div>
      </section>

      {/* ════ PROGRAMS — pricing cards ════ */}
      {content2?.programs?.length ? (
        <section className={styles.contentSection}>
          <VintageHeading
            para={
              <span className={styles.centerSubtext}>
                Expand your teaching expertise with our specialized
                certification combinations
              </span>
            }
          >
            Our New 200 Hour Yoga Programs
          </VintageHeading>
          <div className={styles.programGrid}>
            {content2.programs.map((p, i) => (
              <div key={i} className={styles.programCard}>
                <h3 className={styles.programTitle}>{stripHtml(p.title)}</h3>
                <p className={styles.programDesc}>{stripHtml(p.desc)}</p>
                <div className={styles.programMeta}>
                  <div>
                    <span className={styles.metaLabel}>Duration:</span>{" "}
                    {stripHtml(p.duration)}
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Start Date:</span>{" "}
                    {stripHtml(p.start)}
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Price:</span>{" "}
                    <s className={styles.oldPrice}>{stripHtml(p.oldPrice)}</s>{" "}
                    <strong className={styles.newPrice}>
                      {stripHtml(p.price)}
                    </strong>
                  </div>
                </div>
                <a href="#" className={styles.learnMoreBtn}>
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ════ REQUIREMENTS — left content full height, right image ════ */}
      {content2?.requirementsH2 && (
        <section className={styles.contentSection}>
          <VintageHeading>{stripHtml(content2.requirementsH2)}</VintageHeading>

          <div className={styles.requirementsTextFull}>
            {/* 🔥 FIRST 2 Q&A */}
            {content2.knowQA?.slice(0, 2).map((item, i) => (
              <div key={i} className={styles.infoBlock}>
                <h4 className={styles.infoQ}>{stripHtml(item.q)}</h4>
                {stripHtml(item.a)
                  .split("\n\n")
                  .map((para, j) => (
                    <p key={j} className={styles.bodyText}>
                      {para}
                    </p>
                  ))}
              </div>
            ))}

            {/* 🔥 VIDEO WITH HEADING */}
            <div className={styles.videoSectionWrap}>
              <h4 className={styles.infoQ}>Experience Our Yoga Training</h4>

              <div className={styles.reqVideoBox}>
                <iframe
                  src="https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&mute=1&loop=1&playlist=v7AYKMP6rOE&controls=0&modestbranding=1&rel=0&showinfo=0"
                  className={styles.reqVideo}
                  allow="autoplay; encrypted-media"
                />
              </div>
            </div>

            {/* 🔥 REST Q&A */}
            {content2.knowQA?.slice(2).map((item, i) => (
              <div key={i + 2} className={styles.infoBlock}>
                <h4 className={styles.infoQ}>{stripHtml(item.q)}</h4>
                {stripHtml(item.a)
                  .split("\n\n")
                  .map((para, j) => (
                    <p key={j} className={styles.bodyText}>
                      {para}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ════ HOW TO BOOK — step flow cards ════ */}
      <section className={styles.contentSection}>
        {content2?.bookingH2 || bookingSteps.length ? (
          <>
            <VintageHeading>
              {stripHtml(content2?.bookingH2 || "How to book your spot?")}
            </VintageHeading>
            {bookingSteps.length > 0 && (
              <div className={styles.bookingSteps}>
                {bookingSteps.map((s, i) => (
                  <div key={i} className={styles.bookingStep}>
                    <div className={styles.bookingStepIconWrap}>
                      <span className={styles.bookingStepIcon}>
                        {s.icon || ["🔍", "📝", "💳", "✅"][i] || "🧘"}
                      </span>
                    </div>
                    <div className={styles.bookingStepCard}>
                      <div className={styles.bookingStepNum}>Step {i + 1}</div>
                      <div className={styles.bookingStepTitle}>
                        {stripHtml(s.title || "")}
                      </div>
                      <p className={styles.bookingStepText}>
                        {stripHtml(s.text || "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {/* FAQ — modern accordion */}
        {content2?.faqItems?.length ? (
          <>
            <VintageHeading>Frequently Asked Questions</VintageHeading>
            <div className={styles.faqList}>
              {content2.faqItems.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={styles.faqBtn}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{stripHtml(faq.q)}</span>
                    <span
                      className={styles.faqIcon}
                      style={{
                        transform:
                          openFaq === i ? "rotate(45deg)" : "rotate(0)",
                      }}
                    >
                      {openFaq === i ? "×" : "+"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className={styles.faqAnswer}>
                      <p className={styles.bodyText}>{stripHtml(faq.a)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>
      <PremiumGallerySection type="both" backgroundColor="warm" />
      {/* ✅ REVIEWS — now a reusable separate component */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}
