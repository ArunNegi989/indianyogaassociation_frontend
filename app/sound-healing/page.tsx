"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/sound-healing/Soundhealingpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";

const IMG = {
  hero: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=85",

  c1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  c2: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80",
  c3: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  c4: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
  c5: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  c6: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  c7: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",

  /* Three-photo row */
  bowl1:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=85",
  bowl2:
    "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=85",
  bowl3: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=85",

  /* Benefits side image */
  benefits:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=85",
};

/* ─── Level cards data ─── */
const levels = [
  {
    title: "Level 1 — 2 Days · 3 Hours/Day",
    items: [
      "Introduction & History of Sound Healing.",
      "How to play the bowls.",
      "Intro Drum Stick, Leather sticks & getting Creative with Sounds.",
      "Intensity of Sound.",
      "Charged water therapy.",
      "Tingsha Aura Cleansing.",
      "Bowl notes, Chakra notes.",
      "Metals used and benefits.",
      "Planet Connection.",
    ],
  },
  {
    title: "Level 2 — 3 Days · 3 Hours/Day",
    items: [
      "Understanding Signals of body.",
      "Sound Healing with intensity.",
      "Group Healing Session.",
      "Hot water Massage.",
      "Stick Massage.",
      "Sounds on herbs & Potli Sound.",
    ],
  },
  {
    title: "Level 3 — 5 Days · 3 Hours/Day",
    items: [
      "Chakra theory & 5 body element.",
      "Chakra balancing.",
      "Diseases therapies.",
      "Body Sound Massage.",
      "Distance Healing.",
      "Gong Therapy, Happy Pan, Rain stick, Shamanic Drum.",
      "Herb information.",
      "Brain Wave theory.",
      "Nada Yoga.",
    ],
  },
];

const scheduleRows = [
  {
    id: "sh-1",
    date: "Every Monday (Ongoing)",
    usdFee: "$100 / $180 / $250",
    inrFee: "₹8,999 / ₹14,999 / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 20,
    bookedSeats: 6,
    note: "Fees are for Level 1 / Level 2 / Level 3 respectively.",
  },
  {
    id: "sh-2",
    date: "05 May 2025 – 06 May 2025",
    usdFee: "$100 / — / —",
    inrFee: "₹8,999 / — / —",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 15,
    bookedSeats: 10,
    note: "",
  },
  {
    id: "sh-3",
    date: "12 May 2025 – 16 May 2025",
    usdFee: "— / — / $250",
    inrFee: "— / — / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 12,
    bookedSeats: 5,
    note: "",
  },
  {
    id: "sh-4",
    date: "02 Jun 2025 – 04 Jun 2025",
    usdFee: "— / $180 / —",
    inrFee: "— / ₹14,999 / —",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 10,
    bookedSeats: 10,
    note: "",
  },
  {
    id: "sh-5",
    date: "16 Jun 2025 – 20 Jun 2025",
    usdFee: "$100 / $180 / $250",
    inrFee: "₹8,999 / ₹14,999 / ₹19,999",
    roomPrice: { shared: 500, twin: 800, private: 1200 },
    totalSeats: 20,
    bookedSeats: 3,
    note: "",
  },
];

type Currency = "USD" | "INR";

function formatPrice(usdAmount: number, currency: Currency, rate: number): string {
  if (currency === "USD") {
    return `$${usdAmount}`;
  }
  const inr = Math.round((usdAmount * rate) / 100) * 100;
  return `₹${inr.toLocaleString("en-IN")}`;
}

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

/* ══════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════ */

type CornerPos = "tl" | "tr" | "bl" | "br";

function CornerOrnament({ pos }: { pos: CornerPos }) {
  const flip = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  }[pos];

  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.shCornerOrn}
      style={{ transform: flip }}
      aria-hidden="true"
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

  if (isFull) {
    return <span className={styles.shFullyBooked}>Fully Booked</span>;
  }

  return (
    <span className={styles.shSeatsAvailable}>
      {remaining} / {total} Seats
    </span>
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

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING — from 500hr page
══════════════════════════════════════════════════ */
function PremiumSeatBookingSoundHealing({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
}: {
  seats: typeof scheduleRows;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvailable = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvailable) setSelectedId(firstAvailable.id);
  }, [seats]);

  const selected = seats.find((s) => s.id === selectedId) ?? null;

  const fmtPrice = (usd: number) => {
    if (currency === "INR") {
      const inr = Math.round((usd * rate) / 100) * 100;
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }
    return { amount: `$${usd}`, cur: "USD" };
  };

  // Convert room prices to USD equivalent (assuming 1 USD = 85 INR roughly)
  const getUsdPrice = (inr: number) => Math.round(inr / 85);

  return (
    <div className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2026–2027</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>Sound Healing Teacher Training India</h2>
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
                const isSelected = selectedId === batch.id;
                const dormPriceUsd = getUsdPrice(batch.roomPrice.shared);
                const dormFmt = fmtPrice(dormPriceUsd);
                return (
                  <div
                    key={batch.id}
                    className={[styles.psbBc, full ? styles.psbBcFull : "", isSelected ? styles.psbBcSel : ""].filter(Boolean).join(" ")}
                    onClick={() => { if (!full) setSelectedId(batch.id); }}
                  >
                    <div className={styles.psbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={styles.psbBcMonth}>{batch.date.includes("Every") ? "Weekly" : monthYear(batch.date.split(" – ")[0])}</div>
                    <div className={styles.psbBcDates}>{batch.date}</div>
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
            <div className={styles.psbRpCourse}>Sound Healing Teacher Training</div>
            <div className={styles.psbRpDur}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" />
                <path d="M8 4.5V8.5L10.5 10" stroke="rgba(255,243,210,0.8)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className={styles.psbRpDurTxt}>2–5 Days · Rishikesh, India</span>
            </div>
            <div className={styles.psbCurrBadge}>
              {currency === "USD" ? "🇺🇸 Prices in USD" : "🇮🇳 Prices in INR"}
            </div>
          </div>
          <div className={styles.psbRpBody}>
            <div className={styles.psbPriceLbl}>With Accommodation</div>
            <div className={styles.psbPriceRow}>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>{selected ? fmtPrice(getUsdPrice(selected.roomPrice.private)).amount : "—"}<span className={styles.psbPcCur}>{currency}</span></div>
                <div className={styles.psbPcLbl}>Private Room</div>
              </div>
              <div className={styles.psbPriceCard}>
                <div className={styles.psbPcAmt}>{selected ? fmtPrice(getUsdPrice(selected.roomPrice.twin)).amount : "—"}<span className={styles.psbPcCur}>{currency}</span></div>
                <div className={styles.psbPcLbl}>Twin / Shared</div>
              </div>
            </div>
            <div className={styles.psbPriceLbl}>Without Accommodation</div>
            <div className={styles.psbPriceWide}>
              <div className={styles.psbPwLeft}>
                <span className={styles.psbPcAmt} style={{ fontSize: "1rem" }}>{selected ? fmtPrice(getUsdPrice(selected.roomPrice.shared)).amount : "—"}</span>
                <span className={styles.psbPcCur}>{currency}</span>
              </div>
              <span className={styles.psbFoodBadge}>Food Included</span>
            </div>

            {selected && currency === "USD" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>Indian Price</span>
                <span className={styles.psbInrAmt}>₹{selected.roomPrice.shared} / day</span>
              </div>
            )}
            {selected && currency === "INR" && (
              <div className={styles.psbInrRow}>
                <span className={styles.psbInrLbl}>USD Price</span>
                <span className={styles.psbInrAmt}>${getUsdPrice(selected.roomPrice.shared)} USD</span>
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
                  <div className={styles.psbSelDate}>{selected.date}</div>
                </>
              ) : (
                <span className={styles.psbSelHint}>← Select a batch to continue</span>
              )}
            </div>
            {selected && !(selected.bookedSeats >= selected.totalSeats) ? (
              <Link href="/yoga-registration?type=sound-healing" className={styles.psbBookBtn}>
                Book Now — {fmtPrice(getUsdPrice(selected.roomPrice.shared)).amount} {currency}
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
   CURRENCY RATE HOOK
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

/* ══════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════ */
export default function SoundHealingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  return (
    <div className={styles.page}>
      {/* ══ HERO BANNER ══ */}
      <section className={styles.heroBanner}>
        <img
          src={IMG.hero}
          alt="Singing bowl on mandala cloth"
          className={styles.heroImg}
        />
        <div className={styles.heroTextOverlay}>
          <h1 className={styles.heroTitle}>SOUND HEALING COURSE</h1>
        </div>
      </section>

      {/* ══ INTRO SECTION WITH SIDE IMAGE ══ */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introWrapper}>
            <div className={styles.introContent}>
              <div className={styles.introDecorTop}>
                <span className={styles.introDecorLine}></span>
                <span className={styles.introDecorDot}>✧</span>
                <span className={styles.introDecorLine}></span>
              </div>
              <h2 className={styles.secTitleOrange}>
                Best Sound Healing Therapy Training Courses in Rishikesh, India
              </h2>
              <div className={styles.omDivider}>
                <span className={styles.divLine} />
                <span className={styles.omGlyph}>ॐ</span>
                <span className={styles.divLine} />
              </div>
              <div className={styles.introTextCard}>
                <p className={styles.bodyPara}>
                  Are you someone looking for inner peace? Every person has a unique
                  path they take to find the inner peace where their true selves
                  reside. The sound healing course is the best solution for you. At
                  AYM yoga school, we are the best centers that help you learn the
                  best yoga sound healing. Be it self-realization or spiritual
                  explorations. Sound healing yoga courses are a way of adding life to
                  your lifestyle. Therefore, today sound healing is the growing trend
                  used for healing.
                </p>
                <div className={styles.introSignature}>
                  <span className={styles.signatureLine}></span>
                  <span className={styles.signatureText}>Heal through vibrations</span>
                  <span className={styles.signatureLine}></span>
                </div>
              </div>
            </div>
            <div className={styles.introImageWrapper}>
              <div className={styles.introImageCard}>
                <img
                  src={IMG.c3}
                  alt="Sound healing with singing bowls"
                  className={styles.introSideImage}
                />
                <div className={styles.introImageOverlay}>
                  <div className={styles.introImageBadge}>
                    <span>Vibrational Healing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AIM SECTION ══ */}
      <section className={styles.aimSection}>
        <div className={styles.aimInner}>
          <div className={styles.aimTitleBlock}>
            <span className={styles.aimEyebrow}>AYM · Rishikesh</span>
            <h2 className={styles.secTitleOrange}>What Does Sound Healing Aim at?</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.omGlyph}>ॐ</span>
              <span className={styles.divLine} />
            </div>
          </div>

          <div className={styles.aimGrid}>
            {/* LEFT */}
            <div className={styles.aimLeft}>
              <p className={styles.bodyPara}>
                Stress is a major reason behind every toxicity and negativity. And
                this is what yoga sound healing course aims at. It helps in improving
                the health and well-being of a person. Used over the years, it has
                successfully achieved a place in the modern industry.
              </p>
              <p className={styles.bodyPara}>
                Sound healing aims to restore the body's natural frequencies and to
                cure humanity. Therefore, keeping in mind the well-being of humans
                and how badly stress can affect their lives, we at AYM have come up
                with a sound healing course in Rishikesh.
              </p>
              <span className={styles.pillsLabel}>What it restores</span>
              <div className={styles.pillsWrap}>
                {["Natural Frequencies","Mental Equilibrium","Chakra Alignment",
                  "Stress Release","Spiritual Clarity","Emotional Balance","Inner Peace"
                ].map((t) => (
                  <div key={t} className={styles.pill}>
                    <span className={styles.pillDot} />
                    <span className={styles.pillTxt}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.aimRight}>
              <div className={styles.aimPhotoWrap}>
                <img
                  src={IMG.bowl2}
                  alt="Sound healing bowl"
                  className={styles.aimPhoto}
                />
                <span className={styles.aimPhotoBadge}>Singing Bowl Therapy</span>
              </div>
              <div className={styles.aimQuote}>
                <span className={styles.aimQuoteMark}>"</span>
                <p className={styles.aimQuoteText}>
                  Sound is the medicine of the future — it works at the cellular level
                  to restore what stress quietly takes away.
                </p>
                <span className={styles.aimQuoteAttr}>— Ancient Vedic Wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BENEFITS ══ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>
            What are the Benefits of a Sound Healing Course?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitsText}>
              <p className={styles.bodyPara}>
                Why is sound healing so popular among youths? Sound healing has been growing,
                especially because of the benefits it offers — physical, mental, and emotional.
                Here are the most highly recognised benefits of our Sound Healing Courses in Rishikesh:
              </p>
              <div className={styles.benCards}>
                {[
                  { icon: "🧘", title: "Relaxing", text: "One of the greatest benefits of sound healing is deep relaxation. The noises penetrate our system, which as a result, helps in restoring it to balance." },
                  { icon: "✨", title: "Eliminates Energetic Blockages", text: "The music's vibrations heal, open, clear, and balance the chakras before releasing trapped energy — acting as a deep tissue massage for the soul." },
                  { icon: "🌿", title: "Improves Lifestyle", text: "Be it depression, anxiety, or tension — all are decreased by sound healing. It restores mental equilibrium and clarity, resulting in a greater sensation of well-being." },
                  { icon: "❤️", title: "Improves Health", text: "From better sleep and lowered cholesterol to a decrease in chronic pain, blood pressure, and a lower risk of heart disease — all improved with sound healing." },
                ].map((b) => (
                  <div key={b.title} className={styles.benCard}>
                    <div className={styles.benIcon}>{b.icon}</div>
                    <div>
                      <p className={styles.benCardTitle}>{b.title}</p>
                      <p className={styles.benCardTxt}>{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.benefitsImgWrap}>
              <img src={IMG.benefits} alt="Sound healing teacher with bowls" className={styles.benefitsImg} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPECT + WHY JOIN + PREMIUM SEAT BOOKING ══ */}
      <section className={styles.expectSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>
            What can you Expect at AYM for Sound Healing Teacher Training Course?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>

          <p className={styles.bodyPara}>
            When looking for the best sound healing training course, you'll surely come across the
            Association for Yoga and Meditation. Whether you have past experience or are new in this
            field, you can acquire full knowledge and different forms of sound healing training courses.
            We place a lot of emphasis during training sessions on students deepening their own practice
            — cultivating skills and helping you create your distinctive teaching methods.
          </p>

          <div className={styles.expectGrid}>
            {[
              { icon: "🎓", label: "All Levels Welcome", text: "Beginners and experienced practitioners alike — complete knowledge from ground up." },
              { icon: "🧑‍🏫", label: "Expert Teachers", text: "Highly skilled, reputed instructors trained to teach in the most effective, friendly environment." },
              { icon: "📋", label: "Self-Assessment Skills", text: "Develop self-deepened evaluation and the ability to gauge your own instructional effectiveness." },
              { icon: "🍽️", label: "Meals & Amenities", text: "Top-notch meals and comfortable amenities available at an additional cost." },
              { icon: "📅", label: "Flexible Programs", text: "3-day and 7-day programs that fit your schedule and deepen your practice at your pace." },
              { icon: "🏔️", label: "Rishikesh Setting", text: "Learn in the spiritual capital of yoga, surrounded by the Himalayas and the sacred Ganges." },
            ].map((c) => (
              <div key={c.label} className={styles.expectCard}>
                <span className={styles.expectCardIcon}>{c.icon}</span>
                <p className={styles.expectCardLabel}>{c.label}</p>
                <p className={styles.expectCardTxt}>{c.text}</p>
              </div>
            ))}
          </div>

          <p className={styles.instrLabel}>Instruments & Therapies You Will Learn</p>
          <div className={styles.instrRow}>
            {["Singing Bowls","Gong Therapy","Shamanic Drum","Tingsha","Happy Pan",
              "Rain Stick","Sound Baths","Magnets","Nada Yoga","Brain Wave Theory"].map((t) => (
              <span key={t} className={styles.instrPill}>{t}</span>
            ))}
          </div>

          {/* WHY JOIN */}
          <h2 className={styles.secTitleOrange} style={{ marginTop: "2.8rem" }}>
            Why Should You Join AYM?
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>

          <div className={styles.whyGrid}>
            {[
              { n: "01", title: "Licensed Courses", text: "We offer licensed sound healing yoga training courses recognised internationally, at highly affordable prices." },
              { n: "02", title: "Yoga Alliance Certified", text: "Graduates receive a Yoga Alliance, USA certificate — globally recognised and career-defining." },
              { n: "03", title: "Start Teaching Immediately", text: "Our certification lets you begin your own teaching journey the moment your course ends." },
              { n: "04", title: "Best Choice for Students", text: "Among the many YTT centres in Rishikesh, AYM stands apart for its quality, care, and community." },
            ].map((w) => (
              <div key={w.n} className={styles.whyCard}>
                <span className={styles.whyNum}>{w.n}</span>
                <div>
                  <p className={styles.whyTitle}>{w.title}</p>
                  <p className={styles.whyTxt}>{w.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.certBanner}>
            <div className={styles.certBadge}>🏅</div>
            <p className={styles.certTxt}>
              Students who successfully complete the <strong>sound healing certification program</strong> will
              receive a certificate from <strong>Yoga Alliance, USA</strong> — helping you start your
              own journey immediately after course completion.
            </p>
          </div>

          {/* PREMIUM SEAT BOOKING - EXACT UI FROM 500hr PAGE */}
          <PremiumSeatBookingSoundHealing
            seats={scheduleRows}
            currency={currency}
            onCurrencyChange={setCurrency}
            rate={rate}
            rateLoading={rateLoading}
          />
        </div>
      </section>

      <div className={styles.bottomBorder} />
      <HowToReach />
    </div>
  );
}