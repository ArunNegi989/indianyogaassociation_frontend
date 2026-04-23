"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
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

interface IntroItem {
  paragraph: string;
  media: string;
  mediaAlt: string;
  mediaType: "image" | "video";
}

interface SyllabusModule {
  label: string;
  text: string;
}

interface Review {
  name: string;
  platform: string;
  initial: string;
  rating: number;
  text: string;
}

interface PageContent {
  _id: string;
  pageMainH1: string;
  heroImgAlt: string;
  heroImage: string;
  shivaImage: string;
  evalImage: string;
  standApartH2: string;
  gainsH2: string;
  seatSectionH2: string;
  seatSectionSubtext: string;
  tableNoteText: string;
  tableNoteEmail: string;
  tableNoteAirportText: string;
  credibilityH2: string;
  durationH2: string;
  syllabusH2: string;
  eligibilityH3: string;
  evaluationH3: string;
  includedTitle: string;
  includedNote: string;
  notIncludedTitle: string;
  fictionH3: string;
  reviewsSectionH2: string;
  refundH3: string;
  refundPara: string;
  applyH3: string;
  applyPara: string;
  indianFeeH3: string;
  introItems: IntroItem[];
  introParas: string[];
  standApartParas: string[];
  gainsParas: string[];
  credibilityParas: string[];
  durationParas: string[];
  syllabusParas: string[];
  eligibilityParas: string[];
  evaluationParas: string[];
  fictionParas: string[];
  includedItems: string[];
  notIncludedItems: string[];
  indianFees: string[];
  syllabusModules: SyllabusModule[];
  reviews: Review[];
  accomImages: string[];
  foodImages: string[];
}

type Currency = "USD" | "INR";

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

function imgSrc(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

const Para = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

// Icons for CourseInfoCard
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
   COURSE INFO CARD
══════════════════════════════ */
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

const NAV_ITEMS = [
  { label: "DATES & FEES", id: "dates-fees" },
  { label: "CURRICULUM", id: "curriculum" },
  { label: "INCLUSIONS", id: "inclusions" },
  { label: "FACILITY", id: "facility" },
  { label: "LOCATION", id: "location" },
];

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

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING — with Currency Switcher
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
        <h2 className={styles.vintageHeading}>
          500 Hour Yoga Teacher Training India
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
              500 Hour Yoga Teacher Training
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
            {selected ? (
              <a
                href={`/yoga-registration?batchId=${selected._id}&type=500hr`}
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

/* ─────────────────────────────────────────
   ENHANCED INTRO SECTION
───────────────────────────────────────── */
function EnhancedIntroSection({ items }: { items: IntroItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.enhancedIntroSection}>
      <div className="container px-3 px-md-4">
        <h1 className={styles.heroTitle}>
          500 Hour Yoga Teacher Training Course in Rishikesh
        </h1>
        <div className={styles.omDiv}>
          <span className={styles.divLine} />
          <span className={styles.omGlyph}>ॐ</span>
          <span className={styles.divLine} />
        </div>

        <div className={styles.introItemsWrapper}>
          {items.map((item, index) => {
            const mediaUrl = item.media ? imgSrc(item.media) : "";
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
                <div className={styles.introItemImage}>
                  {mediaUrl ? (
                    isVideo ? (
                      <video
                        src={mediaUrl}
                        className={styles.introItemVideo}
                        controls
                        playsInline
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={item.mediaAlt || `Intro media ${index + 1}`}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className={styles.introItemImagePlaceholder}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="20"
                          height="20"
                          rx="2"
                          strokeWidth="1.5"
                        />
                        <circle cx="8.5" cy="8.5" r="2.5" strokeWidth="1.5" />
                        <path d="M21 15l-5-4-3 3-4-4-6 6" strokeWidth="1.5" />
                      </svg>
                    </div>
                  )}
                  <div className={styles.introItemImageOverlay}>
                    <span>{isVideo ? "🎥" : "✦"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   STAND APART SECTION
───────────────────────────────────────── */
function StandApartSection({ content }: { content: PageContent }) {
  const PILLS = [
    "Anatomy & Kinesiology",
    "Yoga Philosophy",
    "Teaching Methodology",
    "Pranayama & Meditation",
    "Yoga Nidra",
  ];

  const STATS = [
    { num: "17+", label: "Years of Excellence" },
    { num: "5000+", label: "Yogis Trained" },
    { num: "60+", label: "Countries Reached" },
    { num: "RYS 500", label: "Yoga Alliance Certified" },
  ];

  return (
    <section className={`${styles.section} ${styles.sectionLight}`}>
      <div className="container px-3 px-md-4">
        <div className={styles.block}>
          {content.standApartH2 && (
            <h2
              className={styles.saTitle}
              dangerouslySetInnerHTML={{ __html: content.standApartH2 }}
            />
          )}
          {content.standApartH2 && <div className={styles.saUnderline} />}
          <div className={styles.saBodyText}>
            {content.standApartParas?.map((para, i) => (
              <Para key={i} html={para} />
            ))}
          </div>

          <div className={styles.omDiv}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          {content.gainsH2 && (
            <h2
              className={styles.saTitle}
              dangerouslySetInnerHTML={{ __html: content.gainsH2 }}
            />
          )}
          {content.gainsH2 && <div className={styles.saUnderline} />}

          <div className={styles.gainsWrap}>
            <div className={styles.gainsFloat}>
              <div className={styles.imgStack}>
                {content.shivaImage ? (
                  <img
                    src={imgSrc(content.shivaImage)}
                    alt="Yoga practice at AYM School Rishikesh"
                    className={styles.stackImg}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.imgPlaceholder}>
                    <svg
                      className={styles.imgPlaceholderIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span>Course image</span>
                  </div>
                )}
                <span className={styles.imgBadge}>500 Hr Advanced TTC</span>
              </div>

              <div className={styles.statRow}>
                {STATS.map((s) => (
                  <div key={s.label} className={styles.statCard}>
                    <div className={styles.statNum}>{s.num}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.gainsText}>
              {content.gainsParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
              <div className={styles.featurePills}>
                {PILLS.map((pill) => (
                  <span key={pill} className={styles.pill}>
                    <span className={styles.pillDot} />
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   VIDEO SECTION - LOOPING WITHOUT CONTROLS
───────────────────────────────────────── */
function VideoSection() {
  const videoUrl = "vid.mp4";

  const overlayText =
    "Experience the Journey of 500 Hour Yoga Teacher Training";
  const subText = "Watch Our Students' Transformation";

  return (
    <section className={styles.videoSection}>
      <div className="container px-3 px-md-4">
        <div className={styles.videoWrapper}>
          <div className={styles.videoContainerShort}>
            <video
              className={styles.videoIframe}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className={styles.videoOverlay}>
              <div className={styles.videoTextOverlay}>
                <span className={styles.videoBadge}>✦ Featured Video ✦</span>
                <h3 className={styles.videoTitle}>{overlayText}</h3>
                <p className={styles.videoSubtitle}>{subText}</p>
                <div className={styles.videoPlayIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16" fill="currentColor" />
                  </svg>
                  <span>Watch Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PREMIUM MASONRY GRID
───────────────────────────────────────── */
function PremiumMasonryGrid({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const getMasonryItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(images.length, 12); i++) {
      let size = "medium";
      if (i === 0) size = "large";
      else if (i === 1) size = "tall";
      else if (i === 2) size = "small";
      else if (i === 5) size = "wide";
      else if (i === 7) size = "large";
      else if (i === 9) size = "tall";

      items.push({
        id: i,
        src: images[i],
        size: size,
      });
    }
    return items;
  };

  const masonryItems = getMasonryItems();

  return (
    <>
      <div className={styles.premiumMasonry}>
        <div className={styles.masonryGrid}>
          {masonryItems.map((item, idx) => (
            <div
              key={idx}
              className={`${styles.masonryItem} ${styles[`masonry${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`]}`}
              onClick={() => openModal(idx)}
            >
              <div className={styles.masonryInner}>
                <img src={imgSrc(item.src)} alt={`${title} ${idx + 1}`} />
                <div className={styles.masonryOverlay}>
                  <div className={styles.masonryIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                  <span className={styles.masonryText}>View Image</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length > 12 && (
          <div className={styles.masonryMore} onClick={() => openModal(12)}>
            <div className={styles.masonryMoreInner}>
              <span className={styles.masonryMoreCount}>
                +{images.length - 12}
              </span>
              <span className={styles.masonryMoreText}>More Photos</span>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <PremiumImageModal
          images={images}
          currentIndex={currentIndex}
          onClose={() => setModalOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   PREMIUM IMAGE MODAL
───────────────────────────────────────── */
function PremiumImageModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className={styles.premiumModalOverlay} onClick={onClose}>
      <div
        className={styles.premiumModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.premiumModalClose} onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <button
          className={`${styles.premiumModalNav} ${styles.premiumModalNavPrev}`}
          onClick={onPrev}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.premiumModalImageWrapper}>
          <img
            src={imgSrc(images[currentIndex])}
            alt={`Gallery ${currentIndex + 1}`}
            className={styles.premiumModalImage}
          />
          <div className={styles.premiumModalInfo}>
            <div className={styles.premiumModalCounter}>
              <span className={styles.premiumModalCurrent}>
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className={styles.premiumModalDivider}>/</span>
              <span className={styles.premiumModalTotal}>
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <button
          className={`${styles.premiumModalNav} ${styles.premiumModalNavNext}`}
          onClick={onNext}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M9 18l6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className={styles.premiumModalThumbnails}>
          {images.slice(0, 8).map((img, idx) => (
            <div
              key={idx}
              className={`${styles.premiumModalThumb} ${idx === currentIndex ? styles.premiumModalThumbActive : ""}`}
              onClick={() => {
                const newIndex = idx;
                if (newIndex < currentIndex) {
                  for (let i = 0; i < currentIndex - newIndex; i++) onPrev();
                } else if (newIndex > currentIndex) {
                  for (let i = 0; i < newIndex - currentIndex; i++) onNext();
                }
              }}
            >
              <img src={imgSrc(img)} alt={`Thumb ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
const Stars = ({ n = 5 }: { n?: number }) => (
  <div className={styles.stars}>{Array(n).fill("★").join("")}</div>
);

/* ─────────────────────────────────────────
   PAGE SKELETON
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

/* ══════════════════════════════════════════════════
   INCLUDE/EXCLUDE TABS - COPIED FROM 100hr PAGE
══════════════════════════════════════════════════ */
function IncludeExcludeTabs({
  includedItems,
  notIncludedItems,
}: {
  includedItems: string[];
  notIncludedItems: string[];
}) {
  const [activeTab, setActiveTab] = useState<"include" | "exclude">("include");

  if (
    (!includedItems || includedItems.length === 0) &&
    (!notIncludedItems || notIncludedItems.length === 0)
  ) {
    return null;
  }

  return (
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
          {(activeTab === "include" ? includedItems : notIncludedItems)?.map(
            (it, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function YogaTTC500() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seats, setSeats] = useState<Batch[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await api.get("/yoga-500hr/content");
        if (data?.success && data?.data) {
          setContent(data.data);
        } else {
          setError("Content not available.");
        }
      } catch {
        setError("Failed to load page content.");
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const { data } = await api.get("/500hr-seats");
        if (data?.data) {
          setSeats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch seats:", error);
      }
    };
    fetchSeats();
  }, []);

  if (loading) return <PageSkeleton />;
  if (error || !content) {
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
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* HERO - with id="hero" for StickySectionNav */}
      {content.heroImage && (
        <section id="hero" className={styles.heroSection}>
          <img
            src={imgSrc(content.heroImage)}
            alt={content.heroImgAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* COURSE INFO CARD */}
      <CourseInfoCard seats={seats} currency={currency} rate={rate} />

      {/* STICKY SECTION NAV - appears when hero scrolls out of view */}
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ENHANCED INTRO SECTION */}
      {content.introItems && content.introItems.length > 0 ? (
        <EnhancedIntroSection items={content.introItems} />
      ) : (
        <section className={styles.heroSection2}>
          <div className="container px-3 px-md-4">
            {content.pageMainH1 && (
              <h1
                className={styles.heroTitle}
                dangerouslySetInnerHTML={{ __html: content.pageMainH1 }}
              />
            )}
            <div className={styles.omDiv}>
              <span className={styles.divLine} />
              <span className={styles.omGlyph}>ॐ</span>
              <span className={styles.divLine} />
            </div>
            <div className={styles.bodyText}>
              {content.introParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STAND APART + GAINS SECTION */}
      <StandApartSection content={content} />

      {/* PREMIUM SEAT BOOKING */}
      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
      />

      {/* INDIAN FEE + CREDIBILITY + DURATION */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {content.indianFees?.length > 0 && (
            <div className={styles.indianFeeBlock}>
              {content.indianFeeH3 && (
                <>
                  <h3
                    className={styles.indianFeeTitle}
                    dangerouslySetInnerHTML={{ __html: content.indianFeeH3 }}
                  />
                  <div className={styles.sectionUnderlineCentered} />
                </>
              )}
              <div className={styles.feeChipsRow}>
                {content.indianFees.map((fee, i) => {
                  const parts = fee.split(":");
                  const roomType = parts[0]?.trim() || fee;
                  const price = parts[1]?.trim() || "";
                  return (
                    <div key={i} className={styles.feeChipCard}>
                      <div className={styles.feeChipIcon}>
                        {i === 0 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        )}
                        {i === 1 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        )}
                        {i === 2 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            <line x1="12" y1="12" x2="12" y2="16" />
                            <line x1="10" y1="14" x2="14" y2="14" />
                          </svg>
                        )}
                        {i === 3 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.feeChipBody}>
                        <span className={styles.feeChipType}>{roomType}</span>
                        {price && (
                          <span className={styles.feeChipPrice}>{price}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.credDurWrap}>
            {content.credibilityH2 && (
              <div className={styles.credDurBlock}>
                <div className={styles.credDurHdr}>
                  <div className={styles.credDurIconWrap}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <path d="M8 17v4M16 17v4M8 21h8" />
                      <path d="M9 10l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className={styles.credDurTitle}
                      dangerouslySetInnerHTML={{
                        __html: content.credibilityH2,
                      }}
                    />
                    <div className={styles.credDurLine} />
                  </div>
                </div>
                <div className={styles.bodyText}>
                  {content.credibilityParas?.map((para, i) => (
                    <Para key={i} html={para} />
                  ))}
                </div>
              </div>
            )}

            {content.durationH2 && (
              <div className={styles.credDurBlock}>
                <div className={styles.credDurHdr}>
                  <div className={styles.credDurIconWrap}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  </div>
                  <div>
                    <h2
                      className={styles.credDurTitle}
                      dangerouslySetInnerHTML={{ __html: content.durationH2 }}
                    />
                    <div className={styles.credDurLine} />
                  </div>
                </div>
                <div className={styles.bodyText}>
                  {content.durationParas?.map((para, i) => (
                    <Para key={i} html={para} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <VideoSection />

      {/* SYLLABUS + ELIGIBILITY + EVALUATION */}
      <section className={styles.section}>
        <div className="container px-3 px-md-4">
          <div className={styles.syllabusSection}>
            {content.syllabusH2 && (
              <div className={styles.syllabusTitleWrap}>
                <div className={styles.syllabusOrnLeft}>
                  <span />
                  <span />
                </div>
                <div className={styles.syllabusTitleBlock}>
                  <h2
                    className={styles.syllabusMH2}
                    dangerouslySetInnerHTML={{ __html: content.syllabusH2 }}
                  />
                  <div className={styles.syllabusMUnderline} />
                </div>
                <div className={styles.syllabusOrnRight}>
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div className={styles.syllabusMBodyText}>
              {content.syllabusParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>

            {content.syllabusModules?.length > 0 && (
              <div className={styles.syllabusMGrid}>
                {content.syllabusModules.map((s, i) => (
                  <div key={i} className={styles.syllabusMCard}>
                    <div className={styles.syllabusMCardNum}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className={styles.syllabusMCardBody}>
                      <div className={styles.syllabusMCardLabel}>{s.label}</div>
                      <div
                        className={styles.syllabusMCardText}
                        dangerouslySetInnerHTML={{ __html: s.text }}
                      />
                    </div>
                    <div className={styles.syllabusMCardAccent} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="row g-4 mt-2 align-items-stretch">
            <div className="col-12 col-md-6">
              {content.eligibilityH3 && (
                <div className={styles.eligibilityCard}>
                  <div className={styles.eligibilityCardHeader}>
                    <div className={styles.eligibilityCardIcon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className={styles.eligibilityCardTitle}
                        dangerouslySetInnerHTML={{
                          __html: content.eligibilityH3,
                        }}
                      />
                      <div className={styles.eligibilityCardLine} />
                    </div>
                  </div>
                  <div className={styles.eligibilityCardBody}>
                    {content.eligibilityParas?.map((para, i) => (
                      <Para
                        key={i}
                        html={para}
                        className={styles.eligibilityPara}
                      />
                    ))}
                  </div>
                </div>
              )}

              {content.evaluationH3 && (
                <div
                  className={`${styles.eligibilityCard} ${styles.evaluationCard}`}
                >
                  <div className={styles.eligibilityCardHeader}>
                    <div
                      className={`${styles.eligibilityCardIcon} ${styles.evaluationCardIcon}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <rect x="9" y="2" width="6" height="4" rx="1" />
                        <path d="M3 6h18M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
                        <path d="M9 11l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className={styles.eligibilityCardTitle}
                        dangerouslySetInnerHTML={{
                          __html: content.evaluationH3,
                        }}
                      />
                      <div className={styles.eligibilityCardLine} />
                    </div>
                  </div>
                  <div className={styles.eligibilityCardBody}>
                    {content.evaluationParas?.map((para, i) => (
                      <Para
                        key={i}
                        html={para}
                        className={styles.eligibilityPara}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {content.evalImage && (
              <div className="col-12 col-md-6 mt-5">
                <img
                  src={imgSrc(content.evalImage)}
                  alt="Evaluation process"
                  className={styles.evalImg}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* INCLUDE/EXCLUDE TABS SECTION */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <IncludeExcludeTabs
            includedItems={content.includedItems || []}
            notIncludedItems={content.notIncludedItems || []}
          />

          {content.fictionH3 && (
            <div className={styles.fictionBox}>
              <h3
                className={styles.fictionTitle}
                dangerouslySetInnerHTML={{ __html: content.fictionH3 }}
              />
              <div className={styles.fictionUnderline} />
              <div className={styles.bodyText}>
                {content.fictionParas?.map((para, i) => (
                  <Para key={i} html={para} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* ACCOMMODATION SECTION */}
      {content.accomImages?.length > 0 && (
        <section className={styles.premiumGallerySection}>
          <div className="container px-3 px-md-4">
            <div className={styles.premiumGalleryHeader}>
              <span className={styles.premiumGalleryBadge}>Peaceful Stay</span>
              <h2 className={styles.premiumGalleryTitle}>Accommodation</h2>
              <div className={styles.premiumGalleryUnderline}>
                <span className={styles.premiumGalleryUnderlineLeft}></span>
                <span className={styles.premiumGalleryUnderlineIcon}>✦</span>
                <span className={styles.premiumGalleryUnderlineRight}></span>
              </div>
              <p className={styles.premiumGallerySubtext}>
                Comfortable and serene living spaces designed for your spiritual
                journey
              </p>
            </div>
            <PremiumMasonryGrid
              images={content.accomImages}
              title="Accommodation"
            />
          </div>
        </section>
      )}
      
      {/* FOOD SECTION */}
      {content.foodImages?.length > 0 && (
        <section className={styles.premiumGallerySection}>
          <div className="container px-3 px-md-4">
            <div className={styles.premiumGalleryHeader}>
              <span className={styles.premiumGalleryBadge}>
                Nourishing Meals
              </span>
              <h2 className={styles.premiumGalleryTitle}>Sattvic Food</h2>
              <div className={styles.premiumGalleryUnderline}>
                <span className={styles.premiumGalleryUnderlineLeft}></span>
                <span className={styles.premiumGalleryUnderlineIcon}>✦</span>
                <span className={styles.premiumGalleryUnderlineRight}></span>
              </div>
              <p className={styles.premiumGallerySubtext}>
                Wholesome vegetarian meals prepared with love and ancient
                Ayurvedic wisdom
              </p>
            </div>
            <PremiumMasonryGrid images={content.foodImages} title="Food" />
          </div>
        </section>
      )}
      
      {/* REVIEWS */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

      <HowToReach />
    </div>
  );
}