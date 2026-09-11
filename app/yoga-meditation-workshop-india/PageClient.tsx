"use client"

// MeditationPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/yoga-meditation-workshop/Meditationpage.module.css";
import Link from "next/link";
import api from "@/lib/api";

/* ─── Types (mirrors SeatBatch from backend) ─── */
interface SeatBatch {
  _id: string;
  startDate: string;
  endDate: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  inrDormPrice: number;
  twinPrice: number;
  inrTwinPrice: number;
  privatePrice: number;
  inrPrivatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  note?: string;
  applyLink?: string;
}

interface MethodCard {
  title: string;
  text: string;
  imageAlt: string;
  image?: string;
}

interface WhyCard {
  icon: string;
  title: string;
  text: string;
}

interface HighlightCard {
  icon: string;
  title: string;
  text: string;
}

interface MeditationSectionData {
  heroImage?: string;
  heroImageAlt: string;
  heroTitle: string;

  whatIsTitle: string;
  whatIsParagraphs: string[];
  videoUrl: string;

  methodsSectionTitle: string;
  methodCards: MethodCard[];
  methodsClosingText: string;

  elevateTitle: string;
  elevateParagraph: string;
  elevateImage?: string;
  elevateImageAlt: string;

  whyChooseTitle: string;
  whyCards: WhyCard[];

  scheduleTitle: string;
  highlightsLabel: string;
  highlightCards: HighlightCard[];

  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
  batchSectionDuration: string;

  ctaBadgeText: string;
  ctaTitle: string;
  ctaPara1: string;
  ctaSubTitle: string;
  ctaPara2: string;
  ctaEnrollLink: string;
  ctaLearnMoreLink: string;
  ctaImage?: string;
  ctaImageAlt: string;
  ctaImageOverlayText: string;
}

type Currency = "USD" | "INR";

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

function shortDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
}

const monthYear = (start: string) => {
  const s = new Date(start);
  return s.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/* ─── Om Divider ─── */
const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

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

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING — driven by SeatBatch[] from API
   Now uses FIXED inrDormPrice / inrTwinPrice / inrPrivatePrice
   from backend instead of calculating via live rate.
══════════════════════════════════════════════════ */
function PremiumSeatBookingMeditation({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
  seatsLoading,
  batchSectionTag,
  batchSectionTitle,
  batchSectionSub,
  batchSectionDuration,
}: {
  seats: SeatBatch[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
  seatsLoading: boolean;
  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
  batchSectionDuration: string;
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
    type: "dorm" | "twin" | "private"
  ) => {
    if (!batch) return { amount: "—", cur: currency };

    const usdMap = {
      dorm: batch.dormPrice,
      twin: batch.twinPrice,
      private: batch.privatePrice,
    };
    const inrMap = {
      dorm: batch.inrDormPrice,
      twin: batch.inrTwinPrice,
      private: batch.inrPrivatePrice,
    };

    if (currency === "INR") {
      const fixedInr = inrMap[type];
      if (fixedInr && fixedInr > 0) {
        return { amount: `₹${fixedInr.toLocaleString("en-IN")}`, cur: "INR" };
      }
      const inr = Math.round((usdMap[type] * rate) / 100) * 100;
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }

    return { amount: `$${usdMap[type]}`, cur: "USD" };
  };

  return (
    <div className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>{batchSectionTag}</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>{batchSectionTitle}</h2>
        <div className={styles.vintageHeadingUnderline}>
          <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
            <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#F15505" strokeWidth="1.2" fill="none" />
            <circle cx="100" cy="4" r="3" fill="#F15505" opacity="0.7" />
            <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
            <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          </svg>
        </div>
      </div>
      <p className={styles.psbSecSub}>{batchSectionSub}</p>
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

          {seatsLoading ? (
            <p className={styles.psbNoBatches}>Loading batches…</p>
          ) : seats.length === 0 ? (
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
                const dormFmt = fmtPrice(batch, "dorm");
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
            <div className={styles.psbRpCourse}>{batchSectionTitle}</div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.psbRpDurTxt}>{batchSectionDuration}</span>
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
                  {fmtPrice(selected, "private").amount}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>
                  {fmtPrice(selected, "twin").amount}
                  <span className={styles.psbPcCur}>{currency}</span>
                </div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>
            <div className={styles.psbPriceLbl}>Dormitory</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>
                  {fmtPrice(selected, "dorm").amount}
                </span>
                <span className={styles.psbPcCur}>{currency}</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>

            {selected && currency === "USD" && selected.inrFee && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>{selected.inrFee}</span>
              </div>
            )}
            {selected && currency === "INR" && selected.usdFee && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>USD Price</span>
                <span className={styles.psbInrAmt}>{selected.usdFee}</span>
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
                  <div className={styles.psbSelDate}>
                    {shortDateRange(selected.startDate, selected.endDate)}, {monthYear(selected.startDate)}
                  </div>
                </>
              ) : (
                <span className={styles.psbSelHint}>← Select a batch to continue</span>
              )}
            </div>
            {selected && selected.bookedSeats < selected.totalSeats ? (
              <Link
                href={selected.applyLink ?? `/yoga-registration?batchId=${selected._id}&type=meditation`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPrice(selected, "dorm").amount} {currency}
                <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
            )}
            {selected?.note && <p className={styles.psbNote}><strong>Note:</strong> {selected.note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CURRENCY RATE HOOK (fallback only — used if fixed INR missing)
══════════════════════════════════════════════════ */
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

/* ═══════ Loading skeleton for the whole page ═══════ */
function PageSkeleton() {
  return (
    <div className={styles.page}>
      <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <div className={styles.omDivider}>
          <span className={styles.omSymbol} style={{ fontSize: "2rem" }}>ॐ</span>
        </div>
        <p>Loading…</p>
      </div>
    </div>
  );
}

/* ─── Component ─── */
const MeditationPage: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(true);

  const [section, setSection] = useState<MeditationSectionData | null>(null);
  const [sectionLoading, setSectionLoading] = useState(true);

  // Page content — meditation-section singleton API
  useEffect(() => {
    api
      .get("/meditation-section")
      .then((res) => {
        const doc = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data;
        setSection(doc ?? null);
      })
      .catch((err) => console.error("Failed to fetch meditation section:", err))
      .finally(() => setSectionLoading(false));
  }, []);

  // Seat batches — dedicated Meditation seats API (dynamic, no static data)
  useEffect(() => {
    api
      .get("/meditation-seats/get-all-batches")
      .then((res) => setSeats(res.data?.data ?? []))
      .catch((err) => console.error("Failed to fetch meditation seat batches:", err))
      .finally(() => setSeatsLoading(false));
  }, []);

  if (sectionLoading) return <PageSkeleton />;

  if (!section) {
    return (
      <div className={styles.page}>
        <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <p>Content not available right now. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        {section.heroImage && (
          <img
            src={getImageUrl(section.heroImage)}
            alt={section.heroImageAlt}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        )}
      </section>

      {/* SECTION 1 — HERO TITLE */}
      <section className={styles.heroSection1}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>{section.heroTitle}</h1>
          <OmDivider />
        </div>
      </section>

      {/* SECTION 2 — WHAT IS MEDITATION */}
      <section className={styles.whatIsSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            <div className={styles.splitContent}>
              <h2 className={styles.splitTitle}>{section.whatIsTitle}</h2>
              <OmDivider />
              {section.whatIsParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={styles.splitPara}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              ))}
            </div>

            <div className={styles.splitVideo}>
              <iframe
                src={section.videoUrl}
                className={styles.meditationVideo}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MEDITATION METHODS */}
      <section className={styles.methodSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>{section.methodsSectionTitle}</h2>
          <OmDivider />

          {section.methodCards.map((card, i) => (
            <div
              key={i}
              className={i % 2 === 1 ? `${styles.methodCard} ${styles.methodCardReverse}` : styles.methodCard}
            >
              <div className={styles.methodContent}>
                <h3 className={styles.methodTitle}>{card.title}</h3>
                <p className={styles.bodyPara}>{card.text}</p>
              </div>
              {card.image && (
                <div className={styles.methodImage}>
                  <img src={getImageUrl(card.image)} alt={card.imageAlt} className={styles.methodImg} />
                  <div className={styles.methodImageCaption}>{card.title}</div>
                </div>
              )}
            </div>
          ))}

          <p className={styles.bodyPara} style={{ marginTop: "1.5rem" }}>
            {section.methodsClosingText}
          </p>
        </div>
      </section>

      {/* SECTION 4 — ELEVATE + WHY CHOOSE */}
      <section className={styles.altSection}>
        <div className={styles.container}>
          <div className={styles.elevateWrapper}>
            <div className={styles.elevateContent}>
              <h2 className={styles.secTitle}>{section.elevateTitle}</h2>
              <OmDivider />
              <p
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: section.elevateParagraph }}
              />
            </div>
            {section.elevateImage && (
              <div className={styles.elevateImage}>
                <img src={getImageUrl(section.elevateImage)} alt={section.elevateImageAlt} className={styles.elevateImg} />
              </div>
            )}
          </div>

          <h2 className={styles.secTitle} style={{ marginTop: "3rem" }}>
            {section.whyChooseTitle}
          </h2>
          <OmDivider />

          <div className={styles.whyGridModern}>
            {section.whyCards.map((card, i) => (
              <div key={i} className={styles.whyCardModern}>
                <div className={styles.whyCardIcon}>{card.icon}</div>
                <h4 className={styles.whyCardTitle}>{card.title}</h4>
                <p className={styles.whyCardText}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — SCHOOL + HIGHLIGHTS + PREMIUM SEAT BOOKING (dynamic) */}
      <section className={styles.scheduleSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitle}>{section.scheduleTitle}</h2>
          <OmDivider />

          <h3 className={styles.subSecTitle}>{section.highlightsLabel}</h3>
          <div className={styles.highlightsGridModern}>
            {section.highlightCards.map((card, i) => (
              <div key={i} className={styles.highlightCard}>
                <div className={styles.highlightCardIcon}>{card.icon}</div>
                <h4 className={styles.highlightCardTitle}>{card.title}</h4>
                <p className={styles.highlightCardText}>{card.text}</p>
              </div>
            ))}
          </div>

          {/* PREMIUM SEAT BOOKING — fully dynamic via API */}
          <PremiumSeatBookingMeditation
            seats={seats}
            currency={currency}
            onCurrencyChange={setCurrency}
            rate={rate}
            rateLoading={rateLoading}
            seatsLoading={seatsLoading}
            batchSectionTag={section.batchSectionTag}
            batchSectionTitle={section.batchSectionTitle}
            batchSectionSub={section.batchSectionSub}
            batchSectionDuration={section.batchSectionDuration}
          />
        </div>
      </section>

      {/* SECTION 6 — CTA CLOSING */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaWrapper}>
            <div className={styles.ctaContent}>
              <div className={styles.ctaBadge}>
                <span>{section.ctaBadgeText}</span>
              </div>
              <h2 className={styles.ctaTitle}>{section.ctaTitle}</h2>
              <div className={styles.ctaDivider}>
                <span className={styles.ctaDividerLine}></span>
                <span className={styles.ctaDividerIcon}>ॐ</span>
                <span className={styles.ctaDividerLine}></span>
              </div>
              <p className={styles.ctaPara}>{section.ctaPara1}</p>

              <h3 className={styles.ctaSubTitle}>{section.ctaSubTitle}</h3>
              <p className={styles.ctaPara}>{section.ctaPara2}</p>

              <div className={styles.ctaButtonGroup}>
                <Link href={section.ctaEnrollLink} className={styles.ctaButton}>
                  Enroll Now
                  <svg className={styles.ctaButtonIcon} viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href={section.ctaLearnMoreLink} className={styles.ctaButtonOutline}>
                  Learn More
                </Link>
              </div>
            </div>

            {section.ctaImage && (
              <div className={styles.ctaImage}>
                <img src={getImageUrl(section.ctaImage)} alt={section.ctaImageAlt} className={styles.ctaImg} />
                <div className={styles.ctaImageOverlay}>
                  <span>{section.ctaImageOverlayText}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default MeditationPage;