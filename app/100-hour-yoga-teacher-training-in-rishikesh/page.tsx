"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/assets/style/100-hour-yoga-teacher-training-in-rishikesh/Hundredhouryoga.module.css";
import StickySectionNav from "@/components/common/StickySectionNav";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/6.webp";
import api from "@/lib/api";
import image1 from "@/assets/images/yoga.png";
import image2 from "@/assets/images/_DSC9732.JPG.jpeg";
import image3 from "@/assets/images/_DSC5018.JPG.jpeg";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";

// ✅ Review section is now a separate reusable component
import ReviewSection from "@/components/common/Reviewsection";
import PremiumGallerySection from "@/components/PremiumGallerySection";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface SylModule {
  title: string;
  desc: string;
}
interface ScheduleItem {
  time: string;
  label: string;
}

interface ContentData {
  bannerImage: string;
  heroTitle: string;
  heroParagraphs: string[];
  transformTitle: string;
  transformParagraphs: string[];
  whatIsTitle: string;
  whatIsParagraphs: string[];
  whyChooseTitle: string;
  whyChooseParagraphs: string[];
  suitableTitle: string;
  suitableItems: string[];
  syllabusTitle: string;
  syllabusParagraphs: string[];
  syllabusLeft: SylModule[];
  syllabusRight: SylModule[];
  scheduleImage: string;
  scheduleItems: ScheduleItem[];
  soulShineText: string;
  soulShineImage: string;
  enrollTitle: string;
  enrollParagraphs: string[];
  enrollItems: string[];
  comprehensiveTitle: string;
  comprehensiveParagraphs: string[];
  certTitle: string;
  certParagraphs: string[];
  registrationTitle: string;
  registrationParagraphs: string[];
  includedItems: string[];
  notIncludedItems: string[];
  videoUrl?: string;
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

const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: "INCLUSIONS", id: "inclusions" },
  { label: "FACILITY", id: "facility" },
  { label: "LOCATION", id: "location" },
];

/* ══════════════════════════════
   IMAGE HELPER
══════════════════════════════ */
const imgUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_URL}${path}`;
};

/* ══════════════════════════════
   DATE FORMATTERS
══════════════════════════════ */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

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
        if (inr && typeof inr === "number") setRate(inr);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { rate, loading };
}

/* ══════════════════════════════
   CURRENCY FORMATTERS
══════════════════════════════ */
function formatPrice(
  usdAmount: number,
  currency: Currency,
  rate: number,
): string {
  if (currency === "USD") return `$${usdAmount}`;
  const inr = Math.round((usdAmount * rate) / 100) * 100;
  return `₹${inr.toLocaleString("en-IN")}`;
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
   WHY CHOOSE ICONS
══════════════════════════════ */
const whyIcons = [
  <svg
    key="1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
  </svg>,
  <svg
    key="2"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="3" />
    <circle cx="15" cy="7" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6M15 14c3.3 0 6 2.7 6 6" />
    <path d="M9 14c3.3 0 6 2.7 6 6H3c0-3.3 2.7-6 6-6z" />
  </svg>,
  <svg
    key="3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>,
  <svg
    key="4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="14" rx="2" />
    <path d="M8 17v4M16 17v4M8 21h8M9 10l2 2 4-4" />
  </svg>,
  <svg
    key="5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M8 12c1-3 3-5 6-5 1 2 1 5-1 7-2 1.5-4 1.5-5 0" />
  </svg>,
  <svg
    key="6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4M8 15c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    <path d="M5 20c0-1.7 3.1-3 7-3s7 1.3 7 3" />
  </svg>,
];

/* ══════════════════════════════
   VIDEO HELPERS
══════════════════════════════ */
const getVideoType = (url: string) => {
  if (!url) return "none";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.endsWith(".mp4")) return "mp4";
  return "unknown";
};

const getYouTubeEmbed = (url: string) => {
  let videoId = "";
  if (url.includes("youtu.be"))
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  else if (url.includes("shorts"))
    videoId = url.split("shorts/")[1]?.split("?")[0];
  else if (url.includes("watch?v="))
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  return videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`
    : "";
};

const getInstagramEmbed = (url: string) => {
  const match = url.match(/instagram\.com\/reel\/([^/?]+)/);
  return match ? `https://www.instagram.com/reel/${match[1]}/embed` : "";
};

function DynamicVideo({ url }: { url: string }) {
  const type = getVideoType(url);
  if (type === "youtube") {
    const embedUrl = getYouTubeEmbed(url);
    if (!embedUrl) return <p>Invalid video URL</p>;
    return (
      <iframe
        className={styles.video}
        src={embedUrl}
        title="YouTube Video"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }
  if (type === "instagram") {
    return (
      <iframe
        className={styles.video}
        src={getInstagramEmbed(url)}
        title="Instagram Reel"
        frameBorder="0"
        allowFullScreen
      />
    );
  }
  if (type === "mp4") {
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className={styles.video}
      >
        <source src="/uploads/yoga-video.mp4" type="video/mp4" />
      </video>
    );
  }
  return <p>No video available</p>;
}

/* ══════════════════════════════════════════════════
   COURSE INFO CARD
══════════════════════════════════════════════════ */
function CourseInfoCard({
  seats,
  currency,
  rate,
}: {
  seats: SeatBatch[];
  currency: Currency;
  rate: number;
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

/* ══════════════════════════════
   OM DIVIDER
══════════════════════════════ */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDivider}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        {label && <span className={styles.omDividerLabel}>{label}</span>}
      </div>
      <div className={styles.divLineRight} />
    </div>
  );
}

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
   VINTAGE HEADING
══════════════════════════════ */
function VintageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.vintageHeadingWrap}>
      <h2 className={styles.vintageHeading}>{children}</h2>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TEXT + IMAGE ROW
══════════════════════════════════════════════════ */
function TextImageRow({
  title,
  paragraphs,
  imageUrl,
  imageAlt,
  reverse = false,
  badge,
}: {
  title: string;
  paragraphs: string[];
  imageUrl: any;
  imageAlt: string;
  reverse?: boolean;
  badge?: string;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>
        <VintageHeading>{title}</VintageHeading>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
      <div className={styles.tiImageWrap}>
        <div className={styles.tiImageFrame}>
          <Image
            src={imageUrl}
            alt={imageAlt || "Yoga Image"}
            width={700}
            height={500}
            className={styles.tiImage}
          />
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

/* ══════════════════════════════════════════════════
   TEXT + VIDEO ROW
══════════════════════════════════════════════════ */
function TextVideoRow({
  title,
  paragraphs,
  videoUrl,
  reverse = false,
}: {
  title: string;
  paragraphs: string[];
  videoUrl: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>
        <VintageHeading>{title}</VintageHeading>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
      <div className={styles.tiVideoWrap}>
        <div className={styles.tiVideoFrame}>
          <DynamicVideo url={videoUrl} />
          <div className={styles.tiVideoBadge}>
            <span className={styles.pulseDot} /> Daily Classes
          </div>
        </div>
        <div className={styles.tiVideoAccent} aria-hidden="true" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   WHY CHOOSE
══════════════════════════════════════════════════ */
function WhyChooseSection({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  const whyPoints = [
    {
      icon: whyIcons[0],
      label: "Expert Teachers",
      desc: "Certified & experienced yoga masters from Rishikesh tradition",
    },
    {
      icon: whyIcons[1],
      label: "Small Batches",
      desc: "Personalised attention with limited seats per batch",
    },
    {
      icon: whyIcons[2],
      label: "Sacred Location",
      desc: "Learn in Rishikesh, the world capital of yoga",
    },
    {
      icon: whyIcons[3],
      label: "Yoga Alliance",
      desc: "Internationally recognized 100-hour certification",
    },
    {
      icon: whyIcons[4],
      label: "Sattvic Meals",
      desc: "Fresh vegetarian food included throughout the course",
    },
    {
      icon: whyIcons[5],
      label: "Holistic Learning",
      desc: "Asana, pranayama, meditation & philosophy combined",
    },
  ];

  return (
    <div className={styles.whySection}>
      <VintageHeading>{title}</VintageHeading>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={styles.bodyText}
          dangerouslySetInnerHTML={{ __html: p }}
        />
      ))}
      <div className={styles.whyGrid}>
        {whyPoints.map((pt, i) => (
          <div
            key={i}
            className={styles.whyCard}
            style={{ "--wi": i } as React.CSSProperties}
          >
            <div className={styles.whyIconWrap}>
              <div className={styles.whyIcon}>{pt.icon}</div>
              <div className={styles.whyIconRing} />
            </div>
            <div className={styles.whyCardBody}>
              <div className={styles.whyCardTitle}>{pt.label}</div>
              <div className={styles.whyCardDesc}>{pt.desc}</div>
            </div>
            <div className={styles.whyCardLine} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SUITABLE FOR
══════════════════════════════════════════════════ */
function SuitableSection({ title, items }: { title: string; items: string[] }) {
  const strips = [
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
    "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",
    "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80",
  ];
  return (
    <div className={styles.suitableSection}>
      <div className={styles.suitableImages}>
        {strips.map((src, i) => (
          <div
            key={i}
            className={styles.suitableStrip}
            style={{ "--si": i } as React.CSSProperties}
          >
            <img src={src} alt={`yoga ${i + 1}`} />
          </div>
        ))}
        <div className={styles.suitableImageBadge}>
          <span>For Everyone</span>
        </div>
      </div>
      <div className={styles.suitableList}>
        <VintageHeading>{title}</VintageHeading>
        <ol className={styles.suitableOl}>
          {items.map((item, i) => (
            <li
              key={i}
              className={styles.suitableLi}
              style={{ "--sli": i } as React.CSSProperties}
            >
              <div className={styles.suitableNum}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className={styles.suitableText}>{item}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING
══════════════════════════════════════════════════ */
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

  const fmtPrice = (usd: number) => {
    if (currency === "INR") {
      const inr = Math.round((usd * rate) / 100) * 100;
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }
    return { amount: `$${usd}`, cur: "USD" };
  };

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <VintageHeading>100 Hour Yoga Teacher Training India</VintageHeading>
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
              100 Hour Yoga Teacher Training
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
                13 Days · Rishikesh, India
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
                href={`/yoga-registration?batchId=${selected._id}&type=100hr`}
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

/* ══════════════════════════════
   SKELETON LOADER
══════════════════════════════ */
function SkeletonBlock({ h = 24, w = "100%" }: { h?: number; w?: string }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 6,
        marginBottom: 12,
        background:
          "linear-gradient(90deg,#f0e8d8 25%,#e8d9c0 50%,#f0e8d8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

/* ══════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function HundredHourYoga() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("include");
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  useEffect(() => {
    Promise.all([
      api.get("/100hr-content/get"),
      api.get("/100hr-seats/get-all-batches"),
    ])
      .then(([contentRes, seatsRes]) => {
        setContent(contentRes.data.data ?? null);
        setSeats(seatsRes.data.data ?? []);
      })
      .catch((err) => console.error("Failed to fetch page data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className={styles.root} style={{ padding: "4rem 2rem" }}>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        {[...Array(6)].map((_, i) => (
          <SkeletonBlock key={i} h={i === 0 ? 400 : 28} />
        ))}
      </div>
    );

  if (!content)
    return (
      <div
        className={styles.root}
        style={{ padding: "4rem 2rem", textAlign: "center" }}
      >
        <p
          style={{ fontFamily: "serif", color: "#8b4513", fontSize: "1.2rem" }}
        >
          Content not available yet. Please check back soon.
        </p>
      </div>
    );

  const defaultVideoUrl =
    content.videoUrl ||
    "https://youtube.com/shorts/X-4RQYlTRtk?si=auhdk5e01w1b66M1";

  return (
    <div className={styles.root}>
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* HERO IMAGE */}
      <section id="hero" className={styles.heroSection}>
        {content.bannerImage ? (
          <img
            src={imgUrl(content.bannerImage)}
            alt="100 Hour Yoga Teacher Training"
            className={styles.heroImage}
            style={{ width: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={heroImg}
            alt="Yoga Students Group"
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* COURSE INFO CARD */}
      <CourseInfoCard seats={seats} currency={currency} rate={rate} />
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* HERO TEXT */}
      <section className={styles.heroSection2}>
        <div className={styles.heroMandalaBg} aria-hidden="true" />
        <div className={styles.heroTextWrap}>
          <div className={styles.heroTitleRow}>
            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
          </div>
          {content.heroParagraphs.map((para, i) => (
            <p
              key={i}
              className={styles.bodyText}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
      </section>

      {/* TRANSFORM */}
      <section className={styles.contentSection}>
        <TextImageRow
          title={content.transformTitle}
          paragraphs={content.transformParagraphs}
          imageUrl={image1}
          imageAlt="Transform your yoga practice in Rishikesh"
          badge="Rishikesh, India"
        />
      </section>

      {/* WHAT IS */}
      <section className={styles.contentSection}>
        <TextVideoRow
          title={content.whatIsTitle}
          paragraphs={content.whatIsParagraphs}
          videoUrl={defaultVideoUrl}
          reverse={true}
        />
      </section>

      {/* WHY CHOOSE */}
      <section className={styles.contentSection}>
        <WhyChooseSection
          title={content.whyChooseTitle}
          paragraphs={content.whyChooseParagraphs}
        />
      </section>

      {/* SUITABLE FOR */}
      <section className={styles.contentSection}>
        <SuitableSection
          title={content.suitableTitle}
          items={content.suitableItems}
        />
      </section>

      {/* PREMIUM SEAT BOOKING */}
      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* SYLLABUS */}
      <section className={styles.contentSection} id="curriculum">
        <OmDivider label="Curriculum" />
        <VintageHeading>{content.syllabusTitle}</VintageHeading>
        {content.syllabusParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
        <div className={styles.splitLayout}>
          <div className={styles.leftCards}>
            {[...content.syllabusLeft, ...content.syllabusRight].map((m, i) => (
              <div
                key={i}
                className={styles.card}
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
                <div className={styles.cardNumber}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
                <div className={styles.cardGlow}></div>
              </div>
            ))}
          </div>
          <div className={styles.rightImage}>
            <div className={styles.imageBox}>
              <Image
                src={image3}
                alt="Yoga"
                width={800}
                height={500}
                className={styles.image}
              />
              <div className={styles.imageShimmer}></div>
            </div>
            <div className={styles.videoBox}>
              <iframe
                src="https://www.youtube.com/embed/EJ6K-rhqevE?autoplay=1&mute=1&loop=1&playlist=EJ6K-rhqevE&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1"
                className={styles.video}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* DAILY SCHEDULE */}
      <section id="facility" className={styles.scheduleSection}>
        <div className={styles.container}>
          <div className={styles.videoSide}>
            <div className={styles.videoWrapper}>
              <DynamicVideo url={defaultVideoUrl} />
            </div>
            <div className={styles.videoOverlay} />
            <div className={styles.videoBadge}>
              <span className={styles.pulseDot} />
              Daily Classes
            </div>
          </div>
          {content.scheduleImage && (
            <div className={styles.centerImage}>
              <img src={imgUrl(content.scheduleImage)} alt="Yoga" />
              <div className={styles.centerBadge}>Since 2010</div>
            </div>
          )}
          <div className={styles.cardsSide}>
            <span className={styles.eyebrow}>Our Routine</span>
            <h2 className={styles.heading}>Daily Schedule</h2>
            <div className={styles.scheduleGrid}>
              {content.scheduleItems.map((item, i) => (
                <div
                  key={i}
                  className={styles.chip}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <div className={styles.iconBox}>
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className={styles.chipText}>
                    <span className={styles.time}>{item.time}</span>
                    <p>{item.label}</p>
                  </div>
                  <div className={styles.glow} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INCLUSIONS */}
      <section id="inclusions" className={styles.contentSection}>
        <div className={styles.classBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <img
            src={
              content.soulShineImage
                ? imgUrl(content.soulShineImage)
                : "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=80"
            }
            alt="Yoga class Rishikesh"
            className={styles.classBannerImg}
          />
          <div className={styles.classBannerOverlay} />
          <span className={styles.letYourSoul}>
            {content.soulShineText || "Let Your Soul Shine"}
          </span>
        </div>

        <TextImageRow
          title={content.enrollTitle}
          paragraphs={[...content.enrollParagraphs]}
          imageUrl={image2}
          imageAlt="Yoga enrollment Rishikesh"
          badge="Enroll Today"
        />

        <div className={styles.enrollCards}>
          {content.enrollItems.map((item, i) => (
            <div key={i} className={styles.enrollCard}>
              <span className={styles.bgNumber}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.cardRow}>
                <div className={styles.topNumber}>{i + 1}</div>
                <div
                  className={styles.cardContent}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              </div>
            </div>
          ))}
        </div>

        <TextVideoRow
          title={content.comprehensiveTitle}
          paragraphs={content.comprehensiveParagraphs}
          videoUrl={defaultVideoUrl}
          reverse={true}
        />
        <TextImageRow
          title={content.certTitle}
          paragraphs={content.certParagraphs}
          imageUrl={image3}
          imageAlt="Yoga Alliance Certification"
          badge="Yoga Alliance Certified"
        />
        <TextImageRow
          title={content.registrationTitle}
          paragraphs={content.registrationParagraphs}
          imageUrl={image2}
          imageAlt="Registration process"
          badge="Easy Registration"
          reverse={true}
        />

        <div className={styles.incWrap}>
          <div className={styles.incTabs}>
            <button
              className={`${styles.incTab} ${activeTab === "include" ? styles.active : ""}`}
              onClick={() => setActiveTab("include")}
            >
              ✓ What Is Included?
            </button>
            <button
              className={`${styles.incTab} ${activeTab === "exclude" ? styles.active : ""}`}
              onClick={() => setActiveTab("exclude")}
            >
              ✕ What Is Not Included?
            </button>
          </div>
          <div className={styles.incContent}>
            <ul className={styles.incList}>
              {(activeTab === "include"
                ? content.includedItems
                : content.notIncludedItems
              )?.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <PremiumGallerySection type="both" backgroundColor="warm" />
      {/* ✅ REVIEWS — now a reusable separate component */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

      {/* LOCATION */}
      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}
