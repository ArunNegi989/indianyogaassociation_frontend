"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/hatha-yoga-teacher-training-Rishikesh/Hathayogapage.module.css";
import { PremiumSeatBooking } from "@/app/100-hour-yoga-teacher-training-in-rishikesh/page";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";

/* ══════════════════════════════════════
   TYPES
══════════════════════════════════════ */
interface CertCard {
  _id?: string;
  hours: string;
  sub: string;
  href?: string;
  imgUrl?: string;
  image?: string;
}

interface HathaYogaData {
  _id: string;
  slug?: string;
  status?: string;
  heroImgAlt?: string;
  heroImage?: string;
  introSectionTitle?: string;
  introSideImgAlt?: string;
  introSideImage?: string;
  whatSuperLabel?: string;
  whatTitle?: string;
  benefitsSuperLabel?: string;
  benefitsTitle?: string;
  benefitsSideImgAlt?: string;
  benefitsSideImage?: string;
  pullQuote?: string;
  certSuperLabel?: string;
  certTitle?: string;
  certPara?: string;
  ashramSuperLabel?: string;
  ashramTitle?: string;
  ashramImgAlt?: string;
  ashramImage?: string;
  curriculumSuperLabel?: string;
  curriculumTitle?: string;
  pricingSuperLabel?: string;
  pricingTitle?: string;
  pricingIntroPara?: string;
  registrationFormLink?: string;
  tableNote?: string;
  joinBtnLabel?: string;
  joinBtnHref?: string;
  pricingProgrammePara?: string;
  footerTitle?: string;
  footerSubtitle?: string;
  applyBtnLabel?: string;
  applyBtnHref?: string;
  contactBtnLabel?: string;
  contactEmail?: string;
  introParagraphs?: string[];
  whatParagraphs?: string[];
  ashramParagraphs?: string[];
  programmeParagraphs?: string[];
  accreditations?: string[];
  benefitsList?: string[];
  courseDetailsList?: string[];
  benefitsIntroPara?: string;
  certCards?: CertCard[];
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


type Currency = "USD" | "INR";

/* ══════════════════════════════
   SVG ICONS FOR INFO CARD
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
   CURRENCY HOOK — Live Rate
══════════════════════════════ */
function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83); // fallback INR per USD
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
      .catch(() => {
        // Use fallback rate silently
      })
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
}


/* ══════════════════════════════
   VINTAGE HEADING
══════════════════════════════ */
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


/* ══════════════════════════════
   CURRENCY DROPDOWN
══════════════════════════════ */
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
        <span className={styles.currDropLabel}>{currency}</span>
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
                <span className={styles.currDropItemCode}>{c}</span>
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


/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const imgSrc = (image?: string, imgUrl?: string, fallback = ""): string => {
  if (image && image.startsWith("/uploads/")) return `${BASE_URL}${image}`;
  if (imgUrl && imgUrl.length > 0) return imgUrl;
  return fallback;
};

const formatDate = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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



/* ══════════════════════════════════════════════════
   COURSE INFO CARD — with currency
══════════════════════════════════════════════════ */
function CourseInfoCard({
  seats,
  currency,
  rate,
  onCurrencyChange,
}: {
  seats: Batch[];
  currency: Currency;
  rate: number;
  onCurrencyChange: (c: Currency) => void;
}) {
  const available = seats.filter((s) => s.totalSeats - s.bookedSeats > 0);
  const startingPrice =
    available.length > 0 ? Math.min(...available.map((s) => s.dormPrice)) : 499;
  const originalPrice = Math.round((startingPrice * 1.8) / 50) * 50;

  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "13 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "Beginner" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "100 Hour" },
    {
      icon: <StyleIcon />,
      label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Ashtanga, Vinyasa & Hatha",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi" },
    { icon: <DateIcon />, label: "DATE", value: "1st to 13th of every month" },
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
            {/* FIX 3: Render the CurrencyDropdown that was silently dropped */}
            {/* <CurrencyDropdown currency={currency} onChange={onCurrencyChange} /> */}
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

/* ══════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════ */
function OrnamentDivider() {
  return (
    <div className={styles.ornamentDivider}>
      <span className={styles.ornLine} />
      <span className={styles.ornGlyph}>❧</span>
      <span className={styles.ornLine} />
    </div>
  );
}

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

function MandalaRingSVG({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const n = 24;
  const cx = size / 2;
  const r1 = size * 0.44;
  const r2 = size * 0.35;
  const r3 = size * 0.24;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
    >
      <g stroke="#f15505" strokeWidth="0.8" fill="none">
        <circle cx={cx} cy={cx} r={r1} />
        <circle cx={cx} cy={cx} r={r2} />
        <circle cx={cx} cy={cx} r={r3} />
        <circle cx={cx} cy={cx} r={size * 0.12} />
        {Array.from({ length: n }).map((_, i) => {
          const a = (i / n) * 2 * Math.PI;
          const x1 = cx + r3 * Math.cos(a),
            y1 = cx + r3 * Math.sin(a);
          const x2 = cx + r1 * Math.cos(a),
            y2 = cx + r1 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 2 * Math.PI;
          const x1 = cx + (r2 - 12) * Math.cos(a),
            y1 = cx + (r2 - 12) * Math.sin(a);
          const x2 = cx + (r2 + 12) * Math.cos(a),
            y2 = cx + (r2 + 12) * Math.sin(a);
          return (
            <ellipse
              key={i}
              cx={(x1 + x2) / 2}
              cy={(y1 + y2) / 2}
              rx={14}
              ry={5}
              transform={`rotate(${(i / 8) * 360} ${(x1 + x2) / 2} ${(y1 + y2) / 2})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaSVG({
  opacity = 0.05,
  size = 600,
}: {
  opacity?: number;
  size?: number;
}) {
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
        transform={`translate(${size / 2},${size / 2})`}
      >
        {[0.46, 0.38, 0.28, 0.18, 0.09].map((r, ri) => (
          <circle key={ri} cx={0} cy={0} r={r * size} />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return (
            <line
              key={i}
              x1={size * 0.09 * Math.cos(a)}
              y1={size * 0.09 * Math.sin(a)}
              x2={size * 0.46 * Math.cos(a)}
              y2={size * 0.46 * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 2 * Math.PI;
          const r = size * 0.32;
          return (
            <ellipse
              key={i}
              cx={r * Math.cos(a)}
              cy={r * Math.sin(a)}
              rx={size * 0.07}
              ry={size * 0.025}
              transform={`rotate(${(i / 12) * 360} ${r * Math.cos(a)} ${r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════
   LOADING STATE
══════════════════════════════════════ */
function LoadingSpinner() {
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
      <div
        style={{
          textAlign: "center",
          color: "#F15505",
          fontSize: "1.1rem",
          opacity: 0.75,
        }}
      >
        {/* <MandalaRingSVG size={80} opacity={0.6} /> */}
        <p
          style={{
            marginTop: "1rem",
            fontFamily: "serif",
            letterSpacing: "0.05em",
          }}
        >
          Loading…
        </p>
      </div>
    </div>
  );
}



/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function HathaYogaPage() {
  const [pageData, setPageData] = useState<HathaYogaData | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  // FIX 1: Removed duplicate `const rate = 83` — useCurrencyRate already provides rate
  const { rate, loading: rateLoading } = useCurrencyRate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");

  /* Intersection observer for scroll-reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pageData]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pageRes, batchRes] = await Promise.all([
          api.get("/hatha-yoga"),
          api.get("/hathayoga-seats/getAllBatches"),
        ]);

        if (pageRes.data?.success) setPageData(pageRes.data.data);
        else setError("Page data not found.");

        if (batchRes.data?.success) {
          setBatches(batchRes.data.data || []);
          // FIX 2: Also populate `seats` so PremiumSeatBooking receives data
          setSeats(batchRes.data.data || []);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load page.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !pageData) {
    return (
      <div
        className={styles.page}
        style={{ padding: "4rem", textAlign: "center", color: "#F15505" }}
      >
        <p>{error || "Something went wrong."}</p>
      </div>
    );
  }

  const d = pageData; // shorthand

  /* Image helpers */
  const heroSrc = imgSrc(d.heroImage, undefined, "");
  const introSrc = imgSrc(
    d.introSideImage,
    undefined,
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80",
  );
  const benefitSrc = imgSrc(
    d.benefitsSideImage,
    undefined,
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  );
  const ashramSrc = imgSrc(
    d.ashramImage,
    undefined,
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  );

  return (
    <div className={styles.page}>
      {/* Mandala BG watermark */}
      <div className={styles.mandalaWatermark} aria-hidden="true">
        <MandalaSVG opacity={0.04} size={700} />
      </div>

      {/* ══ HERO IMAGE ══ */}
      {heroSrc && (
        <section className={styles.heroSection}>
          <img
            src={heroSrc}
            alt={d.heroImgAlt || "Hatha Yoga Teacher Training"}
            className={styles.heroImage}
            style={{ width: "100%", height: "auto", display: "block" }}
            loading="eager"
          />
        </section>
      )}

      {/* ══ COURSE INFO CARD ══ */}
      <CourseInfoCard
        seats={batches}
        currency={currency}
        rate={rate}
        onCurrencyChange={setCurrency}
      />

      {/* ══════════════════════ INTRO ══════════════════════ */}
      <section className={`${styles.section} ${styles.introSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              {d.introSectionTitle && (
                <h2 className={styles.sectionTitle}>{d.introSectionTitle}</h2>
              )}
              <OrnamentDivider />

              {/* Intro paragraphs (HTML from rich text editor) */}
              {d.introParagraphs && d.introParagraphs.length > 0
                ? d.introParagraphs.map((p, i) => (
                    <div
                      key={i}
                      className={styles.para}
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  ))
                : null}
            </div>

            <div className={styles.introImage}>
              <div className={styles.imageFrame}>
                <img
                  src={introSrc}
                  alt={d.introSideImgAlt || "Yoga class in Rishikesh"}
                />
                <div className={styles.imageCaption}>
                  Morning Satsang · AYM Ashram
                </div>
              </div>

              {/* Accreditations */}
              {d.accreditations && d.accreditations.length > 0 && (
                <div className={styles.accredBox}>
                  <p className={styles.accredTitle}>Accreditations</p>
                  {d.accreditations.map((a, i) => (
                    <span key={i} className={styles.accredBadge}>
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ WHAT IS HATHA ══════════════════════ */}
      <section className={`${styles.section} ${styles.whatSection}`}>
        <div className={styles.mandalaBg} aria-hidden="true">
          {/* <MandalaRingSVG size={500} opacity={0.06} /> */}
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            {d.whatSuperLabel && (
              <p className={styles.superLabel}>{d.whatSuperLabel}</p>
            )}
            {d.whatTitle && (
              <h2 className={styles.sectionTitle}>{d.whatTitle}</h2>
            )}
            {/* <OrnamentDivider /> */}

            {d.whatParagraphs && d.whatParagraphs.length > 0
              ? d.whatParagraphs.map((p, i) => (
                  <div
                    key={i}
                    className={styles.paraCenter}
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BENEFITS ══════════════════════ */}
      <section className={`${styles.section} ${styles.benefitsSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.benefitsGrid}`}>
            <div className={styles.benefitsLeft}>
              {d.benefitsSuperLabel && (
                <p className={styles.superLabel}>{d.benefitsSuperLabel}</p>
              )}
              {d.benefitsTitle && (
                <h2 className={styles.sectionTitle}>{d.benefitsTitle}</h2>
              )}
              <OrnamentDivider />

              {d.benefitsIntroPara && (
                <div
                  className={styles.para}
                  dangerouslySetInnerHTML={{ __html: d.benefitsIntroPara }}
                />
              )}

              {d.benefitsList && d.benefitsList.length > 0 && (
                <ol className={styles.benefitsList}>
                  {d.benefitsList.map((b, i) => (
                    <li key={i} className={styles.benefitItem}>
                      <span className={styles.benefitNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className={styles.benefitsRight}>
              <div className={styles.imageFrameTall}>
                <img
                  src={benefitSrc}
                  alt={d.benefitsSideImgAlt || "Yoga Ashram Rishikesh"}
                />
              </div>
              {d.pullQuote && (
                <div className={styles.pullQuote}>
                  <span className={styles.quoteGlyph}>"</span>
                  {d.pullQuote}
                  <span className={styles.quoteGlyph}>"</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ CERTIFICATION ══════════════════════ */}
      <section className={`${styles.section} ${styles.certSection}`}>
        <div className={styles.certBg} aria-hidden="true">
          <MandalaRingSVG size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            {d.certSuperLabel && (
              <p className={styles.superLabel}>{d.certSuperLabel}</p>
            )}
            {d.certTitle && (
              <h2 className={styles.sectionTitle}>{d.certTitle}</h2>
            )}
            {/* <OrnamentDivider /> */}
            {d.certPara && (
              <div
                className={styles.paraCenter}
                dangerouslySetInnerHTML={{ __html: d.certPara }}
              />
            )}
          </div>

          {d.certCards && d.certCards.length > 0 && (
            <div className={`${styles.reveal} ${styles.certCards}`}>
              {d.certCards.map((c, i) => {
                const cardSrc = imgSrc(
                  c.image,
                  c.imgUrl,
                  [
                    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
                    "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=600&q=80",
                    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80",
                  ][i] || "",
                );
                return (
                  <a
                    key={c._id || i}
                    href={c.href || "#"}
                    className={styles.certCard}
                  >
                    <div className={styles.certCardImg}>
                      {cardSrc && <img src={cardSrc} alt={c.hours} />}
                      <div className={styles.certCardOverlay} />
                    </div>
                    <div className={styles.certCardBody}>
                      <h3 className={styles.certCardTitle}>{c.hours}</h3>
                      <p className={styles.certCardSub}>Hatha Yoga Course</p>
                      <p className={styles.certCardProg}>{c.sub}</p>
                      <span className={styles.certCardLink}>Explore →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ ASHRAM ══════════════════════ */}
      <section className={`${styles.section} ${styles.ashramSection}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.ashramGrid}`}>
            <div className={styles.ashramText}>
              {d.ashramSuperLabel && (
                <p className={styles.superLabel}>{d.ashramSuperLabel}</p>
              )}
              {d.ashramTitle && (
                <h2
                  className={styles.sectionTitle}
                  dangerouslySetInnerHTML={{
                    __html: d.ashramTitle.replace(/,\s*/g, ",<br/>"),
                  }}
                />
              )}
              <OrnamentDivider />

              {d.ashramParagraphs && d.ashramParagraphs.length > 0
                ? d.ashramParagraphs.map((p, i) => (
                    <div
                      key={i}
                      className={styles.para}
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  ))
                : null}
            </div>

            <div className={styles.ashramImage}>
              <div className={styles.imageFrame}>
                <img
                  src={ashramSrc}
                  alt={d.ashramImgAlt || "AYM Yoga Ashram"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM SEAT BOOKING with currency switcher */}
      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
        seattitle="Hatha Yoga Training in Rishikesh"
      />

      {/* ══════════════════════ CURRICULUM ══════════════════════ */}
      {d.courseDetailsList && d.courseDetailsList.length > 0 && (
        <section
          id="curriculum"
          className={`${styles.section} ${styles.curriculumSection}`}
        >
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.centered}`}>
              {d.curriculumSuperLabel && (
                <p className={styles.superLabel}>{d.curriculumSuperLabel}</p>
              )}
              {d.curriculumTitle && (
                <h2
                  className={styles.sectionTitle}
                  dangerouslySetInnerHTML={{ __html: d.curriculumTitle }}
                />
              )}
              {/* <OrnamentDivider /> */}
            </div>

            <div className={`${styles.reveal} ${styles.curriculumGrid}`}>
              {d.courseDetailsList.map((item, i) => (
                <div key={i} className={styles.curriculumItem}>
                  <span className={styles.curriculumNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.curriculumText}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ PRICING / BATCHES ══════════════════════ */}
    
      {/* ══════════════════════ FOOTER CTA ══════════════════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaRingSVG size={400} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            {/* <span className={styles.footerOm}>ॐ</span> */}
            {d.footerTitle && (
              <h2 className={styles.footerTitle}>{d.footerTitle}</h2>
            )}
            {d.footerSubtitle && (
              <p className={styles.footerSub}>{d.footerSubtitle}</p>
            )}
            <div className={styles.heroBtns}>
              <a
                href={d.applyBtnHref || "#apply"}
                className={styles.btnPrimary}
              >
                {d.applyBtnLabel || "Apply Now"}
              </a>
              {d.contactEmail && (
                <a
                  href={`mailto:${d.contactEmail}`}
                  className={styles.btnOutline}
                >
                  {d.contactBtnLabel || "Contact Us"}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <PremiumGallerySection type="both" backgroundColor="warm" />
            <ReviewSection RatingsSummaryComponent={<RatingsSummarySection/>} />
            <div id="location">
              <HowToReach />
            </div>

      <HowToReach />
    </div>
  );
}