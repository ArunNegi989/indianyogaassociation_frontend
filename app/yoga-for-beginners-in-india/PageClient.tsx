// YogaBeginners.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-for-beginners-in-india/Yogabeginners.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Link from "next/link";
import api from "@/lib/api";

/* ─────────────────────────────────────────────────────────
   Uploaded file paths like "/uploads/xxx.jpg" are served from
   the server root (NOT under /api), so build image URLs with
   NEXT_PUBLIC_API_URL directly — `api` (lib/api.ts) already
   has "/api" baked into its baseURL and is only used for the
   JSON calls below.
───────────────────────────────────────────────────────── */
const ASSET_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${ASSET_BASE}${path}`;
};

/* ══════════════════════════════
   TYPES — seat batches (unchanged, separate API)
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

/* ══════════════════════════════
   TYPES — CMS section content (mirrors the backend model)
══════════════════════════════ */
interface InfoRowItem {
  number: string;
  label: string;
}
interface PillarItem {
  icon: string;
  name: string;
  subLabel: string;
  desc: string;
}
interface BenefitItem {
  number: string;
  name: string;
  desc: string;
}
interface QAItem {
  question: string;
  answers: string[];
}
interface InfoCardItem {
  icon: string;
  title: string;
  desc: string;
}

interface BeginnersData {
  heroImage?: string;
  heroImageAlt?: string;

  mainTitle?: string;
  questionText?: string;
  bodyParagraphs?: string[];
  infoRow?: InfoRowItem[];

  secondImage?: string;
  secondImageAlt?: string;

  benefitsFullTitle?: string;
  understandingTitle?: string;
  understandingIntro?: string;
  pillars?: PillarItem[];

  benefitsLabel?: string;
  benefits?: BenefitItem[];

  qaSectionTitle?: string;
  qaItems?: QAItem[];

  moreInfoSectionTitle?: string;
  infoCards?: InfoCardItem[];
  noteText?: string;

  batchSectionTag?: string;
  batchSectionTitle?: string;
  batchSectionSub?: string;
}

/* No hardcoded copy — only safe empty defaults so the page never
   crashes on a missing field while content is being added in the
   admin panel. Every visible text/image comes from the backend. */
function withSafeDefaults(d: BeginnersData | null): Required<BeginnersData> {
  return {
    heroImage: d?.heroImage || "",
    heroImageAlt: d?.heroImageAlt || "",
    mainTitle: d?.mainTitle || "",
    questionText: d?.questionText || "",
    bodyParagraphs: d?.bodyParagraphs || [],
    infoRow: d?.infoRow || [],
    secondImage: d?.secondImage || "",
    secondImageAlt: d?.secondImageAlt || "",
    benefitsFullTitle: d?.benefitsFullTitle || "",
    understandingTitle: d?.understandingTitle || "",
    understandingIntro: d?.understandingIntro || "",
    pillars: d?.pillars || [],
    benefitsLabel: d?.benefitsLabel || "",
    benefits: d?.benefits || [],
    qaSectionTitle: d?.qaSectionTitle || "",
    qaItems: d?.qaItems || [],
    moreInfoSectionTitle: d?.moreInfoSectionTitle || "",
    infoCards: d?.infoCards || [],
    noteText: d?.noteText || "",
    batchSectionTag: d?.batchSectionTag || "",
    batchSectionTitle: d?.batchSectionTitle || "",
    batchSectionSub: d?.batchSectionSub || "",
  };
}

/* ══════════════════════════════
   DATE FORMATTERS
══════════════════════════════ */
const shortDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const d = (dt: Date) =>
    dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  return `${d(s)} – ${d(e)}`;
};

const monthYear = (start: string) =>
  new Date(start).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

/* ══════════════════════════════
   CURRENCY HOOK
══════════════════════════════ */
function useCurrencyRate() {
  const [rate, setRate] = useState<number>(83);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
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
  const ref = React.useRef<HTMLDivElement>(null);

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
        <span>{currency === "USD" ? "🇺🇸" : "🇮🇳"}</span>
        <span>{currency === "USD" ? "English" : "हिन्दी"}</span>
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
              <span>{c === "USD" ? "🇺🇸" : "🇮🇳"}</span>
              <div>
                <span>{c === "USD" ? "English" : "हिन्दी"}</span>
                <span>{c === "USD" ? "US Dollar" : "Indian Rupee"}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PREMIUM SEAT BOOKING
   — batches, pricing & booking logic UNCHANGED (still driven
     by the separate seats API). Only the heading block above
     the grid (tag/title/sub) is now passed in as props so it
     comes from the CMS section instead of being hardcoded.
══════════════════════════════════════════════════ */
function PremiumSeatBooking({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
  seattitle,
  sectionTag,
  sectionSub,
}: {
  seats: SeatBatch[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
  seattitle: string;
  sectionTag: string;
  sectionSub: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!seats.length) return;
    const first = seats.find((s) => s.totalSeats - s.bookedSeats > 0);
    if (first) setSelectedId(first._id);
  }, [seats]);

  const selected = seats.find((s) => s._id === selectedId) ?? null;

  const fmtPrice = (batch: SeatBatch | null, overrideUsd?: number) => {
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
        : overrideUsd ?? 0;
      return {
        amount: `₹${Math.round(usdNum * rate).toLocaleString("en-IN")}`,
        cur: "INR",
      };
    }
    if (batch?.usdFee) {
      const raw = batch.usdFee.trim();
      return { amount: raw.startsWith("$") ? raw : `$${raw}`, cur: "USD" };
    }
    return { amount: `$${overrideUsd ?? batch?.dormPrice ?? 0}`, cur: "USD" };
  };

  return (
    <section className={styles.datesSection} id="dates-fees">
      {sectionTag && <div className={styles.psbSecTag}>{sectionTag}</div>}
      <VintageHeading>{seattitle}</VintageHeading>
      {sectionSub && <p className={styles.psbSecSub}>{sectionSub}</p>}
      <div className={styles.psbOrnLine}>
        <div className={styles.psbOrnL} />
        <div className={styles.psbOrnDiamond} />
        <div className={styles.psbOrnR} />
      </div>

      <div className={styles.psbLayout}>
        {/* LEFT PANEL */}
        <div className={styles.psbLeftPanel}>
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
                  <div
                    className={`${styles.psbLegDot} ${styles.psbDOrange}`}
                  />
                  Limited
                </div>
                <div className={styles.psbLegItem}>
                  <div className={`${styles.psbLegDot} ${styles.psbDRed}`} />
                  Full
                </div>
              </div>
            </div>
          </div>

          {seats.length === 0 ? (
            <p className={styles.psbNoBatches}>
              No upcoming batches available.
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
                const cardPrice = fmtPrice(batch);
                const isSelected = selectedId === batch._id;
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
                              width: `${Math.max(
                                5,
                                (rem / batch.totalSeats) * 100
                              )}%`,
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
          <div className={styles.psbRpHead}>
            <div className={styles.psbRpEyebrow}>Course Overview</div>
            <div className={styles.psbRpCourse}>{seattitle}</div>
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
                12 Days · Rishikesh, India
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
            {selected &&
              (() => {
                const rem = selected.totalSeats - selected.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const pct = full
                  ? 100
                  : Math.round(
                      (selected.bookedSeats / selected.totalSeats) * 100
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
              <Link
                href={`/yoga-registration?batchId=${selected._id}&type=beginners`}
                className={styles.psbBookBtn}
              >
                Book Now — {fmtPrice(selected).amount} {currency}
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
              </Link>
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
   OM DIVIDER
══════════════════════════════ */
const OmSVG: React.FC = () => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" stroke="#e8600a" strokeWidth="2" fill="none" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontSize="26"
      fill="#e8600a"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

const Divider: React.FC = () => (
  <div className={styles.divider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>
      <OmSVG />
    </span>
    <span className={styles.dividerLine} />
  </div>
);

// ===================== MAIN COMPONENT =====================
const YogaBeginners: React.FC = () => {
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  const [pageData, setPageData] = useState<BeginnersData | null>(null);

  useEffect(() => {
    // Seat batches — unchanged, separate endpoint
    api
      .get("/yoga-beginners-seats/get-all-batches")
      .then((res) => setSeats(res.data.data ?? []))
      .catch((err) => console.error("Failed to fetch seat batches:", err));

    // Page content — CMS-managed singleton section
    api
      .get("/yoga-beginners-section")
      .then((res) => {
        const doc = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data;
        setPageData(doc || null);
      })
      .catch((err) => console.error("Failed to fetch yoga beginners section:", err));
  }, []);

  const data = withSafeDefaults(pageData);
  const heroSrc = getImageUrl(data.heroImage);
  const secondImgSrc = getImageUrl(data.secondImage);

  return (
    <div className={`${styles.pageWrapper} ${styles.psbRoot}`}>
      {/* ===== TOP HERO IMAGE ===== */}
      {heroSrc && (
        <section className={styles.heroSection}>
          <img
            src={heroSrc}
            alt={data.heroImageAlt}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ===== MAIN HEADING ===== */}
      <section className={styles.contentSection}>
        <div className={styles.contentContainer}>
          {data.mainTitle && <h1 className={styles.mainTitle}>{data.mainTitle}</h1>}
          <div className={styles.contentBlock}>
            {data.questionText && <p className={styles.questionText}>{data.questionText}</p>}
            {data.bodyParagraphs.map((para, i) => (
              <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
            {data.infoRow.length > 0 && (
              <div className={styles.infoRow}>
                {data.infoRow.map((item, i) => (
                  <div key={i} className={styles.infoItem}>
                    <span className={styles.infoNumber}>{item.number}</span>
                    <span className={styles.infoLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECOND HERO IMAGE ===== */}
      {secondImgSrc && (
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.heroImageBox}>
              <img
                src={secondImgSrc}
                alt={data.secondImageAlt}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ===== BENEFITS SECTION ===== */}
      <section className={styles.benefitsFullSection}>
        <div className={styles.benefitsFullContainer}>
          {data.benefitsFullTitle && (
            <div className={styles.benefitsHeader}>
              <h3 className={styles.benefitsFullTitle}>{data.benefitsFullTitle}</h3>
              <div className={styles.benefitsUnderline}></div>
            </div>
          )}

          {(data.understandingTitle || data.understandingIntro || data.pillars.length > 0) && (
            <div className={styles.understandingBlock}>
              {data.understandingTitle && (
                <h4 className={styles.understandingTitle}>{data.understandingTitle}</h4>
              )}
              {data.understandingIntro && (
                <p
                  className={styles.understandingIntro}
                  dangerouslySetInnerHTML={{ __html: data.understandingIntro }}
                />
              )}
              {data.pillars.length > 0 && (
                <div className={styles.yogaPillarsGrid}>
                  {data.pillars.map((pillar, i) => (
                    <div key={i} className={styles.yogaPillarCard}>
                      <div className={styles.yogaPillarIcon}>
                        <span style={{ fontSize: "1.3rem" }}>{pillar.icon}</span>
                      </div>
                      <div>
                        <h5 className={styles.yogaPillarName}>
                          {pillar.name} {pillar.subLabel && <span>{pillar.subLabel}</span>}
                        </h5>
                        <p className={styles.yogaPillarDesc}>{pillar.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {data.benefitsLabel && <h4 className={styles.understandingTitle}>{data.benefitsLabel}</h4>}

          {data.benefits.length > 0 && (
            <div className={styles.benefitsGrid}>
              {data.benefits.map((b, i) => (
                <div key={i} className={styles.benefitFullCard}>
                  <div className={styles.benefitFullNumber}>{b.number}</div>
                  <div className={styles.benefitFullContent}>
                    <h4 className={styles.benefitFullName}>{b.name}</h4>
                    <p className={styles.benefitFullDesc}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Q&A SECTION ===== */}
      {data.qaItems.length > 0 && (
        <section className={styles.qaSection}>
          <div className={styles.sectionContainer}>
            {data.qaSectionTitle && <h2 className={styles.sectionTitle}>{data.qaSectionTitle}</h2>}
            <Divider />
            <div className={styles.qaGrid}>
              {data.qaItems.map((item, idx) => (
                <div key={idx} className={styles.qaCard}>
                  <h4 className={styles.qaQuestion}>{item.question}</h4>
                  <div className={styles.qaAnswerBlock}>
                    {item.answers.map((para, i) => (
                      <p key={i} className={styles.qaAnswer}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MORE INFORMATION ===== */}
      <section className={styles.moreInfoSection}>
        <div className={styles.sectionContainer}>
          {data.moreInfoSectionTitle && <h2 className={styles.sectionTitle}>{data.moreInfoSectionTitle}</h2>}
          <Divider />
          {data.infoCards.length > 0 && (
            <div className={styles.infoGrid}>
              {data.infoCards.map((card, i) => (
                <div key={i} className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <span style={{ fontSize: "1.4rem" }}>{card.icon}</span>
                  </div>
                  <div className={styles.infoContent}>
                    <h4 className={styles.infoTitle}>{card.title}</h4>
                    <p className={styles.infoDesc}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.noteText && (
            <div className={styles.noteBox}>
              <p className={styles.noteText}>{data.noteText}</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== PREMIUM SEAT BOOKING (batches/pricing unchanged; heading text from CMS) ===== */}
      <PremiumSeatBooking
        seats={seats}
        currency={currency}
        onCurrencyChange={setCurrency}
        rate={rate}
        rateLoading={rateLoading}
        seattitle={data.batchSectionTitle || "Yoga for Beginners in Rishikesh"}
        sectionTag={data.batchSectionTag}
        sectionSub={data.batchSectionSub}
      />

      <HowToReach />
    </div>
  );
};

export default YogaBeginners;