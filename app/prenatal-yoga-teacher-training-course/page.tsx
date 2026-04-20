"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/prenatal-yoga-teacher-training-course/Pregnancyyogattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

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

interface PageData {
  _id: string;
  slug: string;
  status: string;
  pageTitleH1: string;
  heroImage: string;
  heroImgAlt: string;
  introSectionTitle: string;
  introPara1: string;
  introPara2: string;
  introPara3: string;
  introExtraParagraphs: string[];
  heroGridImages: HeroGridImage[];
  featuresSectionTitle: string;
  featuresSuperLabel: string;
  featuresPara1: string;
  featuresPara2: string;
  featuresExtraParagraphs: string[];
  locationSubTitle: string;
  locationPara: string;
  locationImage: string;
  schedule: ScheduleItem[];
  batchSectionTitle: string;
  joinBtnText: string;
  joinBtnUrl: string;
  costsSectionTitle: string;
  costsPara: string;
  costsExtraParagraphs: string[];
  onlineSectionTitle: string;
  onlinePara: string;
  onlineExtraParagraphs: string[];
  curriculum: CurriculumItem[];
  hoursSummary: HoursSummaryItem[];
}

type Currency = "USD" | "INR";

function formatPrice(usdAmount: number, currency: Currency, rate: number): string {
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

  return (
    <section className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>Prenatal Yoga Teacher Training India</h2>
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
                const dormFmt = fmtPrice(batch.dormPrice);
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
                    <div className={styles.psbBcPrice}>{dormFmt.amount} <span>{dormFmt.cur}</span></div>
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
            <div className={styles.psbRpCourse}>Prenatal Yoga Teacher Training</div>
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
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>{selected ? fmtPrice(selected.privatePrice).amount : "—"}<span className={styles.psbPcCur}>{currency}</span></div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>{selected ? fmtPrice(selected.twinPrice).amount : "—"}<span className={styles.psbPcCur}>{currency}</span></div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>
            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>{selected ? fmtPrice(selected.dormPrice).amount : "—"}</span>
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
                <span className={styles.psbInrAmt}>${selected.dormPrice} USD</span>
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
              <a href={`/yoga-registration?batchId=${selected._id}&type=prenatal`} className={styles.psbBookBtn}>
                Book Now — {fmtPrice(selected.dormPrice).amount} {currency}
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

/* ═══════════════════════════════════════════
   COURSE INFO CARD
═══════════════════════════════════════════ */
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

function CourseInfoCard({ seats, currency, rate }: { seats: Batch[]; currency: Currency; rate: number }) {
  const available = seats.filter((s) => s.totalSeats - s.bookedSeats > 0);
  const startingPrice = available.length > 0 ? Math.min(...available.map((s) => s.dormPrice)) : 999;
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

/* ─────────────────────────────────────────
   CURRENCY RATE HOOK
───────────────────────────────────────── */
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
      {/* <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={400} c1="#F15505" c2="#d4a017" sw={0.44} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={360} c1="#d4a017" c2="#F15505" sw={0.44} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={210} c1="#F15505" c2="#d4a017" sw={0.58} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={210} c1="#d4a017" c2="#F15505" sw={0.58} />
      </div> */}
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO IMAGE ══ */}
      {pageData.heroImage && (
        <section className={styles.heroSection}>
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
      <CourseInfoCard seats={batches} currency={currency} rate={rate} />

      {/* ══════════════════════════════════════
          SECTION 1 — INTRO + HERO GRID IMAGES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
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
            <h2 className={styles.sectionTitle}>{pageData.introSectionTitle}</h2>
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
              <div className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: pageData.introPara2 }} />
            )}
            {pageData.introPara3 && (
              <div className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: pageData.introPara3 }} />
            )}
            {pageData.introExtraParagraphs?.map((para, i) => (
              <div key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
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
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          {/* ── Features Header ── */}
          {pageData.featuresSectionTitle && (
            <h2 className={styles.sectionTitle}>{pageData.featuresSectionTitle}</h2>
          )}
          <div className={styles.titleUnderline} />

          {/* ── Super Label as styled badge (not plain <p>) ── */}
          {pageData.featuresSuperLabel && (
            <div className={styles.s2BadgeRow}>
              <span className={styles.s2Badge}>{pageData.featuresSuperLabel}</span>
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

              {/* Static highlight pills */}
              <div className={styles.s2Pills}>
                {["Garbh Sanskar", "Pranayama", "Meditation", "Anatomy", "Teaching Practice", "Postnatal Care"].map((tag) => (
                  <span key={tag} className={styles.s2Pill}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Right: static decorative video embed panel */}
            <div className={styles.s2MediaPanel}>
              <div className={styles.s2VideoWrap}>
                <iframe
                  className={styles.s2Video}
                  src="https://www.youtube.com/embed/videoseries?list=PLwwRib57Ak3D0GRQv3p01nHDpFMFVsMRd&autoplay=0&mute=1"
                  title="Prenatal Yoga at AYM"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <div className={styles.s2VideoFrame} />
              </div>
              <div className={styles.s2MediaLabel}>
                <span className={styles.s2MediaIcon}>▶</span>
                <span>Watch Our Prenatal Yoga Sessions</span>
              </div>
              {/* Static stat badges */}
              <div className={styles.s2Stats}>
                <div className={styles.s2Stat}>
                  <span className={styles.s2StatNum}>85+</span>
                  <span className={styles.s2StatLbl}>Hours Training</span>
                </div>
                <div className={styles.s2StatDiv} />
                <div className={styles.s2Stat}>
                  <span className={styles.s2StatNum}>500+</span>
                  <span className={styles.s2StatLbl}>Graduates</span>
                </div>
                <div className={styles.s2StatDiv} />
                <div className={styles.s2Stat}>
                  <span className={styles.s2StatNum}>15+</span>
                  <span className={styles.s2StatLbl}>Years Experience</span>
                </div>
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
                <h2 className={styles.subSectionTitle}>{pageData.locationSubTitle}</h2>
              )}
              <div className={styles.subUnderline} />

              {pageData.locationPara && (
                <div
                  className={styles.s2LocationPara}
                  dangerouslySetInnerHTML={{ __html: pageData.locationPara }}
                />
              )}

              {/* ── Static location badges ── */}
              <div className={styles.s2LocBadges}>
                <span className={styles.s2LocBadge}>📍 Tapovan, Rishikesh</span>
                <span className={styles.s2LocBadge}>🏔️ Himalayan Foothills</span>
                <span className={styles.s2LocBadge}>🌊 12 min to Laxman Jhula</span>
                <span className={styles.s2LocBadge}>🧘 Peaceful Ashram Setting</span>
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
                            <span className={styles.schedAct}>{row.activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right column: location image + static map embed */}
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

                  {/* Static Google Map embed */}
                  <div className={styles.s2MapWrap}>
                    <iframe
                      className={styles.s2Map}
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.123!2d78.3219!3d30.1087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093f2b6eab7a0f%3A0x1b2c3d4e5f6a7b8c!2sTapovan%2C%20Rishikesh!5e0!3m2!1sen!2sin!4v1234567890"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="AYM Yoga Ashram Location"
                    />
                    <div className={styles.s2MapLabel}>
                      <span>📍 Tapovan, Rishikesh, Uttarakhand</span>
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
        <div className={styles.costsBlock}>
          <h2 className={styles.sectionTitle}>
            {pageData.costsSectionTitle}
          </h2>
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
        </div>
      )}

      {/* ── Online Section ── */}
      {pageData.onlineSectionTitle && (
  <div className={styles.s3Card}>
    <div className={styles.s3CardAccent} />
    <span className={styles.s3CardCorner}>✦</span>

    <h2 className={styles.subSectionTitle}>{pageData.onlineSectionTitle}</h2>
    <div className={styles.subUnderline} />

    {(pageData.onlinePara || pageData.onlineExtraParagraphs?.length > 0) && (
      <div className={styles.s3Intro}>
        {pageData.onlinePara && (
          <div className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: pageData.onlinePara }} />
        )}
        {pageData.onlineExtraParagraphs?.map((para, i) => (
          <div key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
        ))}
      </div>
    )}

    <div className={styles.s3Body}>

      {/* ── Left: Curriculum + Hours Summary stacked ── */}
      <div className={styles.s3LeftCol}>

        {pageData.curriculum?.length > 0 && (
          <div className={styles.s3CurrWrap}>
            <div className={styles.s3CurrHeader}>
              <span className={styles.s3CurrHeaderIcon}>
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h12M4 10h12M4 14h7" />
                </svg>
              </span>
              <span>Curriculum Breakdown</span>
            </div>
            <div className={styles.s3CurrList}>
              {pageData.curriculum.map((item, idx) => (
                <div key={item._id} className={styles.s3CurrItem}>
                  <div className={styles.s3CurrNum}>{String(idx + 1).padStart(2, "0")}</div>
                  <div className={styles.s3CurrBody}>
                    <span className={styles.s3CurrTitle}>{item.title}</span>
                    <div className={styles.s3CurrBar}>
                      <div
                        className={styles.s3CurrBarFill}
                        style={{ width: `${Math.min(100, (parseInt(item.hours) / 40) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.s3CurrHrs}>{item.hours}<span>hrs</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hours Summary sits directly below curriculum */}
        {pageData.hoursSummary?.length > 0 && (
          <div className={styles.s3HoursWrap}>
            <div className={styles.s3HoursHeader}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={styles.s3HoursHeaderIcon}>
                <circle cx="10" cy="10" r="8" /><path d="M10 6v4l2.5 2.5" />
              </svg>
              <span>Hours Summary</span>
            </div>
            <div className={styles.s3HoursTable}>
              {pageData.hoursSummary.map((row) => (
                <div key={row._id} className={styles.s3HoursRow}>
                  <span className={styles.s3HoursLabel}>{row.label}</span>
                  <span className={styles.s3HoursDash}>—</span>
                  <span className={styles.s3HoursValue}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Right: Highlights + Video only ── */}
      <div className={styles.s3Right}>

        <div className={styles.s3HighlightsWrap}>
          <div className={styles.s3HighlightsHeader}>What You Get Online</div>
          <div className={styles.s3HighlightsList}>
            {[
              { icon: "🎥", text: "Recorded video lectures, lifetime access" },
              { icon: "📄", text: "Downloadable course materials & PDFs" },
              { icon: "🧘", text: "Live Q&A sessions with instructors" },
              { icon: "🏆", text: "Internationally recognised certificate" },
              { icon: "💬", text: "Private student community access" },
              { icon: "🔄", text: "Flexible, self-paced learning schedule" },
            ].map((h, i) => (
              <div key={i} className={styles.s3HighlightItem}>
                <span className={styles.s3HighlightIcon}>{h.icon}</span>
                <span className={styles.s3HighlightText}>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.s3VideoWrap}>
          <iframe
            className={styles.s3Video}
            src="https://www.youtube.com/embed/videoseries?list=PLwwRib57Ak3D0GRQv3p01nHDpFMFVsMRd&mute=1"
            title="Online Prenatal Yoga Training"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className={styles.s3VideoOverlay}>
            <span className={styles.s3VideoTag}>▶ Course Preview</span>
          </div>
        </div>

      </div>
    </div>

    <div className={styles.s3Cta}>
      <div className={styles.s3CtaLeft}>
        <span className={styles.s3CtaLabel}>Ready to begin your journey?</span>
        <span className={styles.s3CtaSub}>Join our next online batch · Flexible schedule · Globally certified</span>
      </div>
      <a href="#batch-section" className={styles.s3CtaBtn}>
        Enrol Now
        <svg viewBox="0 0 20 20" fill="none" className={styles.s3CtaBtnArrow}>
          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>

  </div>
)}

      <HowToReach />
    </div>
  );
}