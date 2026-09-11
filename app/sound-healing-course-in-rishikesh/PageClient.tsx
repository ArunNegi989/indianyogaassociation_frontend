"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/sound-healing/Soundhealingpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import api from "@/lib/api";

/* ══════════════════════════════
   TYPES — mirror the backend schema exactly
══════════════════════════════ */
interface LevelItem {
  title: string;
  items: string[];
}
interface BenCardItem {
  icon: string;
  title: string;
  text: string;
}
interface ExpectCardItem {
  icon: string;
  label: string;
  text: string;
}
interface WhyCardItem {
  n: string;
  title: string;
  text: string;
}

interface SoundHealingData {
  _id: string;

  heroImage: string;
  heroImageAlt: string;

  introTitle: string;
  introParagraphs: string[];
  introSignatureText: string;
  introImage: string;
  introImageAlt: string;
  introImageBadge: string;

  whatIsTitle: string;
  whatIsIntro: string;
  levels: LevelItem[];
  bowl1Image: string;
  bowl1Alt: string;
  bowl2Image: string;
  bowl2Alt: string;
  bowl3Image: string;
  bowl3Alt: string;

  aimEyebrow: string;
  aimTitle: string;
  aimParagraphs: string[];
  pillsLabel: string;
  pills: string[];
  aimImage: string;
  aimImageAlt: string;
  aimImageBadge: string;
  aimQuoteText: string;
  aimQuoteAttribution: string;

  benefitsTitle: string;
  benefitsIntro: string;
  benCards: BenCardItem[];
  benefitsImage: string;
  benefitsImageAlt: string;

  expectTitle: string;
  expectIntro: string;
  expectCards: ExpectCardItem[];
  instrLabel: string;
  instruments: string[];

  whyJoinTitle: string;
  whyCards: WhyCardItem[];
  certBannerIcon: string;
  certBannerText: string;

  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
}

/* Resolve a stored path (e.g. "/uploads/xxx.jpg") into a full URL.
   Leaves absolute http(s)/data URLs untouched. */
const getImageUrl = (p?: string) => {
  if (!p) return "";
  if (p.startsWith("http") || p.startsWith("data:")) return p;
  return `${process.env.NEXT_PUBLIC_API_URL}${p}`;
};

/* Strip any stray HTML tags from CMS text so raw markup never leaks into
   the UI as visible text (e.g. a rich-text editor saving "<p>...</p>"
   into a plain field). Also collapses HTML entities for &nbsp; etc. */
const stripHtml = (s?: string) => {
  if (!s) return "";
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

/* Apply stripHtml across an array of strings (e.g. paragraphs, pills, instruments) */
const stripHtmlArray = (arr?: string[]) => (arr ?? []).map((s) => stripHtml(s));

/* ══════════════════════════════
   SEAT BATCH — fetched from the dedicated Sound Healing seats API
══════════════════════════════ */
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
   PREMIUM SEAT BOOKING — driven by the API (SeatBatch[]).
   batchSectionTag / batchSectionTitle / batchSectionSub now come
   from the main section data instead of being hardcoded.
══════════════════════════════════════════════════ */
function PremiumSeatBookingSoundHealing({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
  batchSectionTag,
  batchSectionTitle,
  batchSectionSub,
}: {
  seats: SeatBatch[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvailable = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvailable) setSelectedId(firstAvailable._id);
  }, [seats]);

  const selected = seats.find((s) => s._id === selectedId) ?? null;

  const fmtPrice = (batch: SeatBatch | null) => {
    if (!batch) return { amount: "—", cur: currency };
    if (currency === "INR") {
      if (batch.inrFee) {
        const num = parseFloat(batch.inrFee.replace(/[₹,]/g, "").trim());
        if (!isNaN(num) && num > 100) {
          return { amount: `₹${num.toLocaleString("en-IN")}`, cur: "INR" };
        }
      }
      const usdNum = parseFloat(batch.usdFee?.replace(/[$,]/g, "") || "") || batch.dormPrice;
      return { amount: `₹${Math.round(usdNum * rate).toLocaleString("en-IN")}`, cur: "INR" };
    }
    if (batch.usdFee) {
      const raw = batch.usdFee.trim();
      return { amount: raw.startsWith("$") ? raw : `$${raw}`, cur: "USD" };
    }
    return { amount: `$${batch.dormPrice}`, cur: "USD" };
  };

  return (
    <div className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>{stripHtml(batchSectionTag)}</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>{stripHtml(batchSectionTitle)}</h2>
        <div className={styles.vintageHeadingUnderline}>
          <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
            <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#F15505" strokeWidth="1.2" fill="none" />
            <circle cx="100" cy="4" r="3" fill="#F15505" opacity="0.7" />
            <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
            <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          </svg>
        </div>
      </div>
      <p className={styles.psbSecSub}>{stripHtml(batchSectionSub)}</p>
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
                const cardPrice = fmtPrice(batch);
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
            <div className={styles.psbPriceLbl}>Dormitory</div>
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
            {selected ? (
              <Link href={`/yoga-registration?batchId=${selected._id}&type=sound-healing`} className={styles.psbBookBtn}>
                Book Now — {fmtPrice(selected).amount} {currency}
                <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
            )}
            {selected?.note && <p className={styles.psbNote}><strong>Note:</strong> {stripHtml(selected.note)}</p>}
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

  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [data, setData] = useState<SoundHealingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Main section content — singleton stored as an array, take the first entry
  useEffect(() => {
    api
      .get("/sound-healing-section")
      .then((res) => {
        const list = res.data?.data ?? [];
        setData(list[0] ?? null);
      })
      .catch((err) => console.error("Failed to fetch sound healing content:", err))
      .finally(() => setLoading(false));
  }, []);

  // Seat batches — dedicated Sound Healing seats API
  useEffect(() => {
    api
      .get("/sound-healing-seats/get-all-batches")
      .then((res) => setSeats(res.data.data ?? []))
      .catch((err) => console.error("Failed to fetch seat batches:", err));
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <section className={styles.heroBanner} style={{ background: "#f2ede4" }} />
        <div className={styles.container} style={{ padding: "3rem 0" }}>
          <p style={{ textAlign: "center", opacity: 0.6 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ padding: "3rem 0" }}>
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            Sound Healing content is not available right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ══ HERO BANNER ══ */}
      <section className={styles.heroBanner}>
        <img
          src={getImageUrl(data.heroImage)}
          alt={stripHtml(data.heroImageAlt)}
          className={styles.heroImg}
        />
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
              <h2 className={styles.secTitleOrange}>{stripHtml(data.introTitle)}</h2>
              <div className={styles.omDivider}>
                <span className={styles.divLine} />
                <span className={styles.omGlyph}>ॐ</span>
                <span className={styles.divLine} />
              </div>
              <div className={styles.introTextCard}>
                {stripHtmlArray(data.introParagraphs).map((p, i) => (
                  <p key={i} className={styles.bodyPara}>{p}</p>
                ))}
                <div className={styles.introSignature}>
                  <span className={styles.signatureLine}></span>
                  <span className={styles.signatureText}>{stripHtml(data.introSignatureText)}</span>
                  <span className={styles.signatureLine}></span>
                </div>
              </div>
            </div>
            <div className={styles.introImageWrapper}>
              <div className={styles.introImageCard}>
                <img
                  src={getImageUrl(data.introImage)}
                  alt={stripHtml(data.introImageAlt)}
                  className={styles.introSideImage}
                />
                <div className={styles.introImageOverlay}>
                  <div className={styles.introImageBadge}>
                    <span>{stripHtml(data.introImageBadge)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHAT IS SOUND HEALING SECTION ══ */}
      <section className={styles.whatIsSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>{stripHtml(data.whatIsTitle)}</h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          <p className={styles.bodyPara}>{stripHtml(data.whatIsIntro)}</p>

          {/* Level Cards */}
          <div className={styles.levelsGrid}>
            {data.levels.map((level, idx) => (
              <div key={idx} className={styles.levelCard}>
                <div className={styles.levelCardHeader}>
                  <h3 className={styles.levelCardTitle}>{stripHtml(level.title)}</h3>
                </div>
                <div className={styles.levelCardDivider} />
                <ol className={styles.levelCardList}>
                  {stripHtmlArray(level.items).map((item, i) => (
                    <li key={i} className={styles.levelCardItem}>
                      <span className={styles.levelCardNum}>{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          {/* Three-photo row */}
          <div className={styles.bowlPhotoRow}>
            <div className={styles.bowlPhotoItem}>
              <img src={getImageUrl(data.bowl1Image)} alt={stripHtml(data.bowl1Alt)} className={styles.bowlPhoto} />
            </div>
            <div className={styles.bowlPhotoItem}>
              <img src={getImageUrl(data.bowl2Image)} alt={stripHtml(data.bowl2Alt)} className={styles.bowlPhoto} />
            </div>
            <div className={styles.bowlPhotoItem}>
              <img src={getImageUrl(data.bowl3Image)} alt={stripHtml(data.bowl3Alt)} className={styles.bowlPhoto} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ AIM SECTION ══ */}
      <section className={styles.aimSection}>
        <div className={styles.aimInner}>
          <div className={styles.aimTitleBlock}>
            <span className={styles.aimEyebrow}>{stripHtml(data.aimEyebrow)}</span>
            <h2 className={styles.secTitleOrange}>{stripHtml(data.aimTitle)}</h2>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.omGlyph}>ॐ</span>
              <span className={styles.divLine} />
            </div>
          </div>

          <div className={styles.aimGrid}>
            {/* LEFT */}
            <div className={styles.aimLeft}>
              {stripHtmlArray(data.aimParagraphs).map((p, i) => (
                <p key={i} className={styles.bodyPara}>{p}</p>
              ))}
              <span className={styles.pillsLabel}>{stripHtml(data.pillsLabel)}</span>
              <div className={styles.pillsWrap}>
                {stripHtmlArray(data.pills).map((t) => (
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
                  src={getImageUrl(data.aimImage)}
                  alt={stripHtml(data.aimImageAlt)}
                  className={styles.aimPhoto}
                />
                <span className={styles.aimPhotoBadge}>{stripHtml(data.aimImageBadge)}</span>
              </div>
              <div className={styles.aimQuote}>
                <span className={styles.aimQuoteMark}>"</span>
                <p className={styles.aimQuoteText}>{stripHtml(data.aimQuoteText)}</p>
                <span className={styles.aimQuoteAttr}>{stripHtml(data.aimQuoteAttribution)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BENEFITS ══ */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>{stripHtml(data.benefitsTitle)}</h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitsText}>
              <p className={styles.bodyPara}>{stripHtml(data.benefitsIntro)}</p>
              <div className={styles.benCards}>
                {data.benCards.map((b, i) => (
                  <div key={i} className={styles.benCard}>
                    <div className={styles.benIcon}>{b.icon}</div>
                    <div>
                      <p className={styles.benCardTitle}>{stripHtml(b.title)}</p>
                      <p className={styles.benCardTxt}>{stripHtml(b.text)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.benefitsImgWrap}>
              <img src={getImageUrl(data.benefitsImage)} alt={stripHtml(data.benefitsImageAlt)} className={styles.benefitsImg} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPECT + WHY JOIN + PREMIUM SEAT BOOKING ══ */}
      <section className={styles.expectSection}>
        <div className={styles.container}>
          <h2 className={styles.secTitleOrange}>{stripHtml(data.expectTitle)}</h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>

          <p className={styles.bodyPara}>{stripHtml(data.expectIntro)}</p>

          <div className={styles.expectGrid}>
            {data.expectCards.map((c, i) => (
              <div key={i} className={styles.expectCard}>
                <span className={styles.expectCardIcon}>{c.icon}</span>
                <p className={styles.expectCardLabel}>{stripHtml(c.label)}</p>
                <p className={styles.expectCardTxt}>{stripHtml(c.text)}</p>
              </div>
            ))}
          </div>

          <p className={styles.instrLabel}>{stripHtml(data.instrLabel)}</p>
          <div className={styles.instrRow}>
            {stripHtmlArray(data.instruments).map((t) => (
              <span key={t} className={styles.instrPill}>{t}</span>
            ))}
          </div>

          {/* WHY JOIN */}
          <h2 className={styles.secTitleOrange} style={{ marginTop: "2.8rem" }}>
            {stripHtml(data.whyJoinTitle)}
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.divLine} /><span className={styles.omGlyph}>ॐ</span><span className={styles.divLine} />
          </div>

          <div className={styles.whyGrid}>
            {data.whyCards.map((w, i) => (
              <div key={i} className={styles.whyCard}>
                <span className={styles.whyNum}>{w.n}</span>
                <div>
                  <p className={styles.whyTitle}>{stripHtml(w.title)}</p>
                  <p className={styles.whyTxt}>{stripHtml(w.text)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.certBanner}>
            <div className={styles.certBadge}>{data.certBannerIcon}</div>
            {/* certBannerText is rendered as real HTML on purpose (bold/links etc.
                come from the CMS), so it is NOT passed through stripHtml here.
                Make sure this field is sanitized server-side before it reaches
                the client, since dangerouslySetInnerHTML trusts it as-is. */}
            <p
              className={styles.certTxt}
              dangerouslySetInnerHTML={{ __html: data.certBannerText }}
            />
          </div>

          {/* PREMIUM SEAT BOOKING — dynamic, dedicated Sound Healing seats API */}
          <PremiumSeatBookingSoundHealing
            seats={seats}
            currency={currency}
            onCurrencyChange={setCurrency}
            rate={rate}
            rateLoading={rateLoading}
            batchSectionTag={data.batchSectionTag}
            batchSectionTitle={data.batchSectionTitle}
            batchSectionSub={data.batchSectionSub}
          />
        </div>
      </section>

      <div className={styles.bottomBorder} />
      <HowToReach />
    </div>
  );
}