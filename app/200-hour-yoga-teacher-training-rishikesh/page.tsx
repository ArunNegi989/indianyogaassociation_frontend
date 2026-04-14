"use client";
import React, { useState, useEffect } from "react";
import styles from "@/assets/style/200-hour-yoga-teacher-training-rishikesh/Twohundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import StickySectionNav from "@/components/common/StickySectionNav";
import Image from "next/image";
import api from "@/lib/api";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
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
    asanas: Array<{
      n: number;
      name: string;
      sub: string;
      filter?: string;
    }>;
  };
}

interface Content2 {
  evalH2: string;
  evalDesc: string;
  accommodationH2: string;
  accomImages: string[];
  foodH2: string;
  foodImages: string[];
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

  reviews: Array<{
    name: string;
    role: string;
    reviewText: string;
    rating?: number;
  }>;

  requirementsH2: string;
  reqImage: string;

  faqItems: Array<{ q: string; a: string }>;
  knowQA?: Array<{ q: string; a: string }>;

  bookingH2: string;

  // ✅ YAHI IMPORTANT HAI
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

  videosH2?: string;

video1Url?: string;
video1Label?: string;
video1Thumb?: string;

video2Url?: string;
video2Label?: string;
video2Thumb?: string;

video3Url?: string;
video3Label?: string;
video3Thumb?: string;
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
const getEmbedUrl = (url: string) => {
  if (!url) return "";

  if (url.includes("youtu.be")) {
    const id = url.split("/").pop()?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};

const getYoutubeThumb = (url: string) => {
  if (!url) return "";
  const id = url.split("/").pop()?.split("?")[0];
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};
/* ══════════════════════════════
   SVG ICONS FOR COURSE INFO CARD
══════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   COURSE INFO CARD (same as 100hr)
══════════════════════════════════════════════════ */
function CourseInfoCard({ batches }: { batches: Batch[] }) {
  const available = batches.filter((b) => b.totalSeats - b.bookedSeats > 0);
  const startingPrice =
    available.length > 0
      ? Math.min(...available.map((b) => b.dormPrice))
      : 699;
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
        {/* LEFT – details */}
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
        {/* DIVIDER */}
        <div className={styles.icVDiv} />
        {/* RIGHT – fee */}
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
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
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
    <svg viewBox="0 0 40 40" className={styles.cornerOrn} style={{ transform: flip }}>
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
      <circle cx="2" cy="2" r="2" fill="#b8860b" opacity="0.7" />
      <circle cx="10" cy="10" r="1.5" fill="#b8860b" opacity="0.4" />
    </svg>
  );
}

/* ══════════════════════════════
   VINTAGE HEADING
══════════════════════════════ */
function VintageHeading({ children, center = true }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={styles.vintageHeadingWrap} style={{ textAlign: center ? "center" : "left" }}>
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div className={styles.omDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine} />
      </div>
    </div>
  );
}

/* ══════════════════════════════
   BORDER STRIP
══════════════════════════════ */
function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg viewBox="0 0 800 14" preserveAspectRatio="none" className={styles.borderSvg}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon points={`${x},7 ${x + 6},2 ${x + 12},7 ${x + 6},12`} fill="none" stroke="#b8860b" strokeWidth="0.8" />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line x1="0" y1="7" x2="800" y2="7" stroke="#e07b00" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING (same as 100hr)
══════════════════════════════════════════════════ */
function PremiumSeatBooking({ batches }: { batches: Batch[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (batches.length === 0) return;
    const first = batches.find((b) => b.totalSeats - b.bookedSeats > 0);
    if (first) setSelectedId(first._id);
  }, [batches]);

  const selected = batches.find((b) => b._id === selectedId) ?? null;

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <VintageHeading>200 Hour Yoga Teacher Training India</VintageHeading>
      <p className={styles.psbSecSub}>
        Choose your dates &amp; preferred accommodation — prices include tuition and meals
      </p>
      <div className={styles.psbOrnLine}>
        <div className={styles.psbOrnL} />
        <div className={styles.psbOrnDiamond} />
        <div className={styles.psbOrnR} />
      </div>

      <div className={styles.psbLayout}>
        {/* LEFT */}
        <div className={styles.psbLeftPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
          <div className={styles.psbLph}>
            <span className={styles.psbLphTitle}>Select Your Batch</span>
            <div className={styles.psbLegend}>
              <div className={styles.psbLegItem}><div className={`${styles.psbLegDot} ${styles.psbDGreen}`} />Available</div>
              <div className={styles.psbLegItem}><div className={`${styles.psbLegDot} ${styles.psbDOrange}`} />Limited</div>
              <div className={styles.psbLegItem}><div className={`${styles.psbLegDot} ${styles.psbDRed}`} />Full</div>
            </div>
          </div>
          {batches.length === 0 ? (
            <p className={styles.psbNoBatches}>No upcoming batches available at the moment.</p>
          ) : (
            <div className={styles.psbBatchGrid}>
              {batches.map((batch) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const dotCls = full ? styles.psbDRed : low ? styles.psbDOrange : styles.psbDGreen;
                const txtCls = full ? styles.psbSRed : low ? styles.psbSOrange : styles.psbSGreen;
                const statusTxt = full ? "Fully Booked" : low ? "Limited" : "Available";
                const seatsPercent = Math.max(5, (rem / batch.totalSeats) * 100);
                const isSelected = selectedId === batch._id;
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
                    <div className={styles.psbBcStatus}>
                      <div className={`${styles.psbBcDot} ${dotCls}`} />
                      <span className={`${styles.psbBcStxt} ${txtCls}`}>{statusTxt}</span>
                    </div>
                    {!full && (
                      <>
                        <div className={styles.psbBcSeatsBar}>
                          <div className={styles.psbBcSeatsBarFill} style={{ width: `${seatsPercent}%`, background: low ? "linear-gradient(90deg,#c8700a,#e09030)" : "linear-gradient(90deg,#3d6000,#6aa000)" }} />
                        </div>
                        <span className={styles.psbBcSeatsBadge} style={{ color: low ? "#c8700a" : "#3d6000" }}>
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

        {/* RIGHT */}
        <div className={styles.psbRightPanel}>
          <div className={`${styles.psbCn} ${styles.psbCnTl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnTr}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBl}`} />
          <div className={`${styles.psbCn} ${styles.psbCnBr}`} />
          <div className={styles.psbRpHead}>
            <div className={styles.psbRpEyebrow}>Course Overview</div>
            <div className={styles.psbRpCourse}>200 Hour Yoga Teacher Training</div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.psbRpDurTxt}>26 Days · Rishikesh, India</span>
            </div>
          </div>
          <div className={styles.psbRpBody}>
            <div className={styles.psbPriceLbl}>With Accommodation</div>
            <div className={styles.psbPriceRow}>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>${selected ? selected.privatePrice : "—"}<span className={styles.psbPcCur}>USD</span></div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>${selected ? selected.twinPrice : "—"}<span className={styles.psbPcCur}>USD</span></div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>
            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>${selected ? selected.dormPrice : "—"}</span>
                <span className={styles.psbPcCur}>USD</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>
            {selected && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>{selected.inrFee}</span>
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
            {selected ? (
              <a href={`/yoga-registration?batchId=${selected._id}&type=200hr`} className={styles.psbBookBtn}>
                Book Now
                <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
            )}
            {selected?.note && (
              <p className={styles.psbNote}><strong>Note:</strong> {selected.note}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   UNIQUE MODULE CARD (scroll-style numbered design)
══════════════════════════════════════════════════ */
function ModuleCard({ title, intro, items, index }: { title: string; intro: string; items: string[]; index: number }) {
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
            <ul className={`${styles.moduleOl} ${!expanded && items.length > 4 ? styles.moduleOlCollapsed : ""}`}>
              {(expanded ? items : items.slice(0, 4)).map((it, i) => (
                <li key={i}>
                  <span className={styles.moduleOlDot} />
                  {stripHtml(it)}
                </li>
              ))}
            </ul>
            {items.length > 4 && (
              <button className={styles.moduleExpandBtn} onClick={() => setExpanded(!expanded)}>
                {expanded ? "Show Less ↑" : `+${items.length - 4} More Topics ↓`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   INCLUDE / EXCLUDE TABS (same as 100hr)
══════════════════════════════════════════════════ */
function IncludeExcludeTabs({ includedFee, notIncludedFee, includedTitle, notIncludedTitle }: {
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
          {(activeTab === "include" ? includedFee : notIncludedFee)?.map((it, i) => (
            <li key={i}>{stripHtml(it)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   PAGE SKELETON
══════════════════════════════ */
function PageSkeleton() {
  return (
    <div className={styles.root} style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕉️</div>
      <p style={{ color: "#b8860b", fontSize: "1.2rem" }}>Loading yoga journey...</p>
    </div>
  );
}

/* ══════════════════════════════
   FILTER OPTIONS
══════════════════════════════ */
const ASANA_FILTERS = ["All Poses", "Standing", "Sitting", "Lying", "Balancing"] as const;
type AsanaFilter = (typeof ASANA_FILTERS)[number];

function Stars({ n = 5 }: { n?: number }) {
  return <span className={styles.stars}>{"★".repeat(n)}</span>;
}

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
  const [visibleReviews, setVisibleReviews] = useState(6);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  


  const handleLoadMore = () => {
  setVisibleReviews((prev) => prev + 6);

};

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
        const activeC1 = c1List.find((c) => c.status === "Active") || c1List[0] || null;
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
      <div className={styles.root} style={{ padding: "4rem", textAlign: "center" }}>
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
].filter(step => step.title || step.text);

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

      {/* ════ HERO TEXT + STATS ════ */}
      <section className={styles.heroSection2}>
        <div className={styles.heroTextWrap}>
          <VintageHeading>
            {content1?.pageMainH1 || "200 Hour Yoga Teacher Training in Rishikesh"}
          </VintageHeading>
          {[content1?.introPara1, content1?.introPara2, content1?.introPara3, content1?.introPara4]
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className={styles.bodyText}>{stripHtml(para!)}</p>
            ))}
        </div>
        {content1?.stats?.length ? (
          <div className={styles.statsRow}>
            {content1.stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statVal}>{stripHtml(s.value)}</span>
                <span className={styles.statTitle}>{stripHtml(s.title)}</span>
                <span className={styles.statDesc}>{stripHtml(s.desc)}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <BorderStrip />

      {/* ════ AIMS + OVERVIEW + SEAT BOOKING ════ */}
      <section id="dates-fees" className={styles.contentSection}>
        {content1?.aimsH3 && (
          <>
            <h3 className={styles.h3Left}>{stripHtml(content1.aimsH3)}</h3>
            <div className={styles.underlineBar} />
          </>
        )}
        {content1?.aimsIntro && <p className={styles.bodyText}>{stripHtml(content1.aimsIntro)}</p>}
        {content1?.aimsKeyObjLabel && (
          <p className={styles.bodyText}><strong>{stripHtml(content1.aimsKeyObjLabel)}</strong></p>
        )}
        {content1?.aimsBullets?.length ? (
          <ul className={styles.bulletList}>
            {content1.aimsBullets.map((b, i) => <li key={i}>{stripHtml(b)}</li>)}
          </ul>
        ) : null}
        {content1?.aimsOutro && <p className={styles.bodyText}>{stripHtml(content1.aimsOutro)}</p>}

        {/* Overview box */}
        {content1?.overview && (
          <>
            <VintageHeading>
              {stripHtml(content1.overview.h2) || "Overview of 200 Hour Yoga Instructor Course"}
            </VintageHeading>
            <div className={styles.overviewBox}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              {content1.overview.certName && <p className={styles.bodyText}><strong>Name of the certification:</strong> {stripHtml(content1.overview.certName)}</p>}
              {content1.overview.level && <p className={styles.bodyText}><strong>Course level:</strong> {stripHtml(content1.overview.level)}</p>}
              {content1.overview.eligibility && <p className={styles.bodyText}><strong>Requirement/Eligibility:</strong> {stripHtml(content1.overview.eligibility)}</p>}
              {content1.overview.minAge && <p className={styles.bodyText}><strong>Minimum age:</strong> {stripHtml(content1.overview.minAge)}</p>}
              {content1.overview.credits && <p className={styles.bodyText}><strong>Credit points for certificate:</strong> {stripHtml(content1.overview.credits)}</p>}
              {content1.overview.language && <p className={styles.bodyText}><strong>Language:</strong> {stripHtml(content1.overview.language)}</p>}
            </div>
          </>
        )}
      </section>

      {/* ════ PREMIUM SEAT BOOKING ════ */}
      <PremiumSeatBooking batches={batches} />

      <BorderStrip />

      {/* ════ FEE INCLUDED / NOT INCLUDED — NEW TAB STYLE ════ */}
      <section id="curriculum" className={styles.contentSection2}>
        <VintageHeading>
          {content1?.feeIncludedTitle ? "Course Fee Inclusions" : "What's Included"}
        </VintageHeading>
        <IncludeExcludeTabs
          includedFee={content1?.includedFee || []}
          notIncludedFee={content1?.notIncludedFee || []}
          includedTitle={content1?.feeIncludedTitle || ""}
          notIncludedTitle={content1?.feeNotIncludedTitle || ""}
        />

        {/* Syllabus header */}
        <div style={{ marginTop: "2.5rem" }}>
          {content1?.syllabusH3 && (
            <>
              <h3 className={styles.h3Left}>{stripHtml(content1.syllabusH3)}</h3>
              <div className={styles.underlineBar} />
            </>
          )}
          {content1?.syllabusIntro && <p className={styles.bodyText}>{stripHtml(content1.syllabusIntro)}</p>}
        </div>

        {/* Modules 1–4 — NEW DESIGN */}
        <div className={styles.moduleGrid}>
          {modules.slice(0, 4).map((mod, i) => (
            <ModuleCard key={i} title={mod.title} intro={mod.intro} items={mod.items} index={i} />
          ))}
        </div>
      </section>

      <BorderStrip />

      {/* ════ MODULES 5–8 + ASHTANGA ════ */}
      <section id="inclusions" className={styles.contentSection}>
        <div className={styles.moduleGrid}>
          {modules.slice(4, 8).map((mod, i) => (
            <ModuleCard key={i} title={mod.title} intro={mod.intro} items={mod.items} index={i + 4} />
          ))}
        </div>

        {/* Ashtanga */}
        {content1?.ashtanga && (
          <>
            <VintageHeading>{stripHtml(content1.ashtanga.h2) || "Module 8.1: Ashtanga Vinyasa Yoga"}</VintageHeading>
            {content1.ashtanga.subtitle && <p className={styles.centerSubtext}>{stripHtml(content1.ashtanga.subtitle)}</p>}
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                {content1.ashtanga.image && (
                  <img src={imgUrl(content1.ashtanga.image)} alt={content1.ashtanga.imgAlt || "Ashtanga"} className={styles.modImg} />
                )}
              </div>
              <div className={styles.moduleDetailText}>
                {content1.ashtanga.desc && <p className={styles.bodyText}>{stripHtml(content1.ashtanga.desc)}</p>}
                {content1.ashtanga.pills?.filter(Boolean).length ? (
                  <div className={styles.featurePills}>
                    {content1.ashtanga.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>{stripHtml(pill)}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ════ PRIMARY SERIES + HATHA ════ */}
      <section className={styles.contentSection3}>
        {content1?.primary && (
          <div className={styles.primaryCurrCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.h3Left}>{stripHtml(content1.primary.h3) || "Primary Series Curriculum"}</h3>
            <div className={styles.underlineBar} />
            {content1.primary.intro && <p className={styles.bodyText}>{stripHtml(content1.primary.intro)}</p>}
            {content1.primary.foundationItems?.length ? (
              <div className={styles.foundationBox}>
                <div className={styles.foundationHeader}>
                  <span className={styles.foundIcon}>📖</span>
                  <strong>Foundation</strong>
                </div>
                <ul className={styles.foundList}>
                  {content1.primary.foundationItems.map((it, i) => <li key={i}>{stripHtml(it)}</li>)}
                </ul>
              </div>
            ) : null}
          {content1.primary.weekGrid?.length ? (
  <div className={styles.weekGrid}>
    {content1.primary.weekGrid.map((w, i) => {

      const items = Object.keys(w)
        .filter(key => key.startsWith("t"))
        .sort((a, b) => Number(a.replace("t", "")) - Number(b.replace("t", "")))
        .map((key) => {
          const index = key.replace("t", "");
          return {
            t: w[key],
            d: w[`d${index}`],
          };
        })
        .filter(item => item.t && item.d);

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
        )}

        {/* Hatha */}
        {content1?.hatha && (
          <>
            <VintageHeading>{stripHtml(content1.hatha.h2) || "Module 8.2: Hatha Yoga"}</VintageHeading>
            {content1.hatha.subtitle && <p className={styles.centerSubtext}>{stripHtml(content1.hatha.subtitle)}</p>}
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                {content1.hatha.image && <img src={imgUrl(content1.hatha.image)} alt={content1.hatha.imgAlt || "Hatha"} className={styles.modImg} />}
              </div>
              <div className={styles.moduleDetailText}>
                {content1.hatha.desc && <p className={styles.bodyText}>{stripHtml(content1.hatha.desc)}</p>}
                {content1.hatha.pills?.filter(Boolean).length ? (
                  <div className={styles.featurePills}>
                    {content1.hatha.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>{stripHtml(pill)}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ════ HATHA ASANAS ════ */}
      {allAsanas.length > 0 && (
        <section className={styles.contentSection}>
          <VintageHeading>Hatha Yoga Asanas</VintageHeading>
          <p className={styles.centerSubtext}>
            Master these {allAsanas.length} essential postures as part of your comprehensive training
          </p>
          <div className={styles.asanaFilterRow}>
            {ASANA_FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${asanaFilter === f ? styles.filterActive : ""}`}
                onClick={() => setAsanaFilter(f)}
              >
                {f}
                {f !== "All Poses" && (
                  <span style={{ marginLeft: 4, opacity: 0.6, fontSize: "0.75em" }}>
                    ({allAsanas.filter((a) => (a.filter || "All Poses") === f).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          {filteredAsanas.length === 0 ? (
            <p className={styles.centerSubtext} style={{ padding: "2rem 0" }}>No poses found in this category.</p>
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

      <BorderStrip />

      {/* ════ EVALUATION + ACCOMMODATION + FOOD ════ */}
      <section id="facility" className={styles.contentSection4}>
        {content2?.evalH2 && (
          <>
            <VintageHeading center={false}>{stripHtml(content2.evalH2)}</VintageHeading>
            {content2.evalDesc && <p className={styles.bodyText}>{stripHtml(content2.evalDesc)}</p>}
          </>
        )}
        {content2?.accommodationH2 && (
          <>
            <VintageHeading>{stripHtml(content2.accommodationH2)}</VintageHeading>
            {content2.accomImages?.length ? (
              <div className={styles.photoSliderWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <div className={styles.photoSlider}>
                  {content2.accomImages.map((src, i) => (
                    <img key={i} src={imgUrl(src)} alt={`Accommodation ${i + 1}`} className={styles.sliderImg} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
        {content2?.foodH2 && (
          <>
            <VintageHeading>{stripHtml(content2.foodH2)}</VintageHeading>
            {content2.foodImages?.length ? (
              <div className={styles.photoSliderWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <div className={styles.photoSlider}>
                  {content2.foodImages.map((src, i) => (
                    <img key={i} src={imgUrl(src)} alt={`Food ${i + 1}`} className={styles.sliderImg} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <BorderStrip />

      {/* ════ LUXURY + INDIAN FEE + SCHEDULE ════ */}
      <section className={styles.contentSection}>
        {content2?.luxuryH2 && (
          <>
            <VintageHeading>{stripHtml(content2.luxuryH2)}</VintageHeading>
            <div className={styles.luxuryGrid}>
              <div className={styles.luxuryLeft}>
                {(content2.luxFeatures || []).map((it, i) => (
                  <div key={i} className={styles.luxuryItem}>{stripHtml(it)}</div>
                ))}
              </div>
              <div className={styles.luxuryRight}>
                {content2.luxImages?.length ? (
                  <div className={styles.luxuryImgGrid}>
                    {content2.luxImages.map((src, i) => (
                      <img key={i} src={imgUrl(src)} alt={`Luxury room ${i + 1}`} className={`${styles.luxuryImg} ${i === content2.luxImages.length - 1 ? styles.luxuryImgWide : ""}`} />
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
                    <CornerOrnament pos="tl" />
                    <CornerOrnament pos="tr" />
                    <CornerOrnament pos="bl" />
                    <CornerOrnament pos="br" />
                    <span className={styles.indianFeeLabel}>{stripHtml(f.label)}</span>
                    <span className={styles.indianFeePrice}>{stripHtml(f.price)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        {content2?.scheduleH2 && (
          <>
            <VintageHeading>{stripHtml(content2.scheduleH2)}</VintageHeading>
            {content2.schedDesc && <p className={styles.bodyText}>{stripHtml(content2.schedDesc)}</p>}
            <div className={styles.schedLayout}>
              <div className={styles.schedTableWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <table className={styles.schedTable}>
                  <thead>
                    <tr><th>Time</th><th>Schedule</th></tr>
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
              {content2.schedImages?.length ? (
                <div className={styles.schedImgGrid}>
                  {content2.schedImages.map((src, i) => (
                    <img key={i} src={imgUrl(src)} alt={`Yoga class ${i + 1}`} className={styles.schedImg} />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ════ MORE INFO + CTA ════ */}
      <section className={styles.contentSection}>
        {content2?.moreInfoH2 && <VintageHeading>{stripHtml(content2.moreInfoH2)}</VintageHeading>}
        {content2?.instrLangs?.length ? (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}><strong>The medium of instruction:</strong></p>
            <ol className={styles.numberedListSimple}>
              {content2.instrLangs.map((l, i) => (
                <li key={i}>{typeof l === "string" ? stripHtml(l) : stripHtml(l.lang)}</li>
              ))}
            </ol>
          </div>
        ) : null}
        {content2?.visaPassportDesc && (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}><strong>Visa And Passport:</strong></p>
            <p className={styles.bodyText}>{stripHtml(content2.visaPassportDesc)}</p>
          </div>
        )}
        <div className={styles.ctaBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.ctaBannerLeft}>
            <p className={styles.ctaBannerTitle}>We welcome you to AYM School for a wonderful yogic experience!</p>
            <p className={styles.ctaBannerSub}>Join us &amp; become part of the 5000+ international yoga teachers who are proud alumni of the AYM School.</p>
          </div>
          <div className={styles.ctaBannerRight}>
            <p className={styles.ctaBannerBook}>Book Your Spot Today!</p>
            <a href="#dates-fees" className={styles.applyNowBtn}>Apply Now</a>
            <a href="tel:+919528023390" className={styles.phoneBtn}>📱 +91-9528023390</a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ════ PROGRAMS ════ */}
      {content2?.programs?.length ? (
        <section className={styles.contentSection}>
          <VintageHeading>Our New 200 Hour Yoga Programs</VintageHeading>
          <p className={styles.centerSubtext}>Expand your teaching expertise with our specialized certification combinations</p>
          <div className={styles.programGrid}>
            {content2.programs.map((p, i) => (
              <div key={i} className={styles.programCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <h3 className={styles.programTitle}>{stripHtml(p.title)}</h3>
                <p className={styles.programDesc}>{stripHtml(p.desc)}</p>
                <div className={styles.programMeta}>
                  <div><span className={styles.metaLabel}>Duration:</span> {stripHtml(p.duration)}</div>
                  <div><span className={styles.metaLabel}>Start Date:</span> {stripHtml(p.start)}</div>
                  <div><span className={styles.metaLabel}>Price:</span> <s className={styles.oldPrice}>{stripHtml(p.oldPrice)}</s> <strong className={styles.newPrice}>{stripHtml(p.price)}</strong></div>
                </div>
                <a href="#" className={styles.learnMoreBtn}>Learn More</a>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <BorderStrip />

      {/* ════ REQUIREMENTS ════ */}
      {content2?.requirementsH2 && (
        <section className={styles.contentSection}>
          <VintageHeading>{stripHtml(content2.requirementsH2)}</VintageHeading>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementsText}>
              {content2.knowQA?.length
                ? content2.knowQA.map((item, i) => (
                    <div key={i} className={styles.infoBlock}>
                      <h4 className={styles.infoQ}>{stripHtml(item.q)}</h4>
                      {stripHtml(item.a).split("\n\n").map((para, j) => (
                        <p key={j} className={styles.bodyText}>{para}</p>
                      ))}
                    </div>
                  ))
                : null}
            </div>
            {content2.reqImage && (
              <div className={styles.requirementsImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <img src={imgUrl(content2.reqImage)} alt="Yoga practitioner" className={styles.reqImg} />
              </div>
            )}
          </div>
        </section>
      )}

      <BorderStrip />

      {/* ════ REVIEWS ════ */}
    {content2?.reviews?.length ? (
  <section className={styles.contentSection}>
    <VintageHeading>Student Reviews & Success Stories</VintageHeading>
    <p className={styles.centerSubtext}>
      Authentic stories of transformation from students who began just like you.
    </p>

    <div className={styles.reviewsGrid}>
      {content2.reviews
        .slice(0, visibleReviews)
        .map((r, i) => (
          <div key={i} className={styles.reviewCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />

            <div className={styles.reviewHeader}>
              <div>
                <div className={styles.reviewName}>
                  {stripHtml(r.name)}
                </div>
                <div className={styles.reviewRole}>
                  {stripHtml(r.role)}
                </div>
              </div>
            </div>

            <Stars n={r.rating || 5} />

            {r.reviewText && (
              <p className={styles.reviewText}>
                "{stripHtml(r.reviewText)}"
              </p>
            )}
          </div>
        ))}
    </div>

    {/* ✅ Load More Button */}
    {visibleReviews < content2.reviews.length && (
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          onClick={handleLoadMore}
          className={styles.readMoreBtn}
        >
          View More Reviews
        </button>
      </div>
    )}
  </section>
) : null}
      <BorderStrip />
{(content2?.video1Url || content2?.video2Url || content2?.video3Url) && (
  <section className={styles.contentSection}>
    <VintageHeading>
  {stripHtml(content2?.videosH2 || "Video Testimonials")}
</VintageHeading>

    <div className={styles.videoGrid}>
  {[1, 2, 3].map((num) => {
    const url = (content2 as any)[`video${num}Url`];
const label = (content2 as any)[`video${num}Label`];

    if (!url) return null;

    return (
      <div key={num} className={styles.videoCard}>
        <CornerOrnament pos="tl" />
        <CornerOrnament pos="tr" />
        <CornerOrnament pos="bl" />
        <CornerOrnament pos="br" />

        {playingVideo === num ? (
          <iframe
            src={getEmbedUrl(url)}
            className={styles.videoFrame}
            allowFullScreen
          />
        ) : (
          <div
            className={styles.videoThumbWrap}
            onClick={() => setPlayingVideo(num)}
          >
            <img
              src={getYoutubeThumb(url)}
              alt={label || "Video testimonial"}
              className={styles.videoThumb}
            />
            <div className={styles.playBtn}>▶</div>
          </div>
        )}

        {label && (
          <p className={styles.videoLabel}>
            {stripHtml(label)}
          </p>
        )}
      </div>
    );
  })}
</div>
  </section>
)}
      {/* ════ HOW TO BOOK + FAQ ════ */}
      <section className={styles.contentSection}>
 {(content2?.bookingH2 || bookingSteps.length) ? (
  <>
    <VintageHeading>
      {stripHtml(content2?.bookingH2 || "How to book your spot?")}
    </VintageHeading>

    {bookingSteps.length > 0 && (
      <div className={styles.bookingSteps}>
        {bookingSteps.map((s, i) => (
          <div key={i} className={styles.bookingStep}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />

            <div className={styles.bookingStepIcon}>
              {s.icon || "🧘"}
            </div>

            <div className={styles.bookingStepTitle}>
  {stripHtml(s.title || "")}
</div>

<p className={styles.bookingStepText}>
  {stripHtml(s.text || "")}
</p>
          </div>
        ))}
      </div>
    )}
  </>
) : null}

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
            <span className={styles.faqIcon}>
              {openFaq === i ? "−" : "+"}
            </span>
          </button>

          {openFaq === i && (
            <div className={styles.faqAnswer}>
              <p className={styles.bodyText}>
                {stripHtml(faq.a)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  </>
) : null}

    </section>

      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}