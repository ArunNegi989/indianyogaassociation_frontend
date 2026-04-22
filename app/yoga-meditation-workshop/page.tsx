"use client"

// MeditationPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styles from "@/assets/style/yoga-meditation-workshop/Meditationpage.module.css";
import Image from "next/image";
import bannerImage from "@/assets/images/meditation.jpg";
import HowToReach from "@/components/home/Howtoreach";
import heroImg from "@/assets/images/41.png";

/* ─── Types ─── */
interface PricingRow {
  date: string;
  usdFee: string;
  inrFee: string;
  dormPrice: number;
  twinPrice: number;
  privatePrice: number;
  totalSeats: number;
  bookedSeats: number;
  applyLink?: string;
}

/* ─── Data ─── */
const pricingData: PricingRow[] = [
  {
    date: "05th Jan to 29th Jan 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 8,
  },
  {
    date: "03rd Feb to 27th Feb 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 12,
  },
  {
    date: "03rd Mar to 27th Mar 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 5,
  },
  {
    date: "03rd Apr to 27th Apr 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 0,
  },
  {
    date: "03rd May to 27th May 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 20,
  },
  {
    date: "03rd Jun to 27th Jun 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 3,
  },
  {
    date: "03rd Jul to 27th Jul 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 7,
  },
  {
    date: "03rd Aug to 27th Aug 2025",
    usdFee: "$799",
    inrFee: "₹65,000",
    dormPrice: 799,
    twinPrice: 899,
    privatePrice: 999,
    totalSeats: 20,
    bookedSeats: 15,
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

function shortDateRange(dateStr: string) {
  // Handle date format like "05th Jan to 29th Jan 2025"
  return dateStr;
}

const monthYear = (dateStr: string) => {
  const match = dateStr.match(/\d+(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return dateStr;
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
function PremiumSeatBookingMeditation({
  seats,
  currency,
  onCurrencyChange,
  rate,
  rateLoading,
}: {
  seats: PricingRow[];
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  rate: number;
  rateLoading: boolean;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (seats.length === 0) return;
    const firstAvailable = seats.findIndex((s) => s.totalSeats - s.bookedSeats > 0);
    if (firstAvailable !== -1) setSelectedId(firstAvailable);
  }, [seats]);

  const selected = selectedId !== null ? seats[selectedId] : null;

  const fmtPrice = (usd: number) => {
    if (currency === "INR") {
      const inr = Math.round((usd * rate) / 100) * 100;
      return { amount: `₹${inr.toLocaleString("en-IN")}`, cur: "INR" };
    }
    return { amount: `$${usd}`, cur: "USD" };
  };

  return (
    <div className={styles.datesSection} id="dates-fees">
      <div className={styles.psbSecTag}>Upcoming Batches · 2025–2026</div>
      <div className={styles.vintageHeadingWrap}>
        <h2 className={styles.vintageHeading}>Meditation Yoga Teacher Training India</h2>
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
              {seats.map((batch, idx) => {
                const rem = batch.totalSeats - batch.bookedSeats;
                const full = rem <= 0;
                const low = !full && rem <= 5;
                const dotCls = full ? styles.psbDRed : low ? styles.psbDOrange : styles.psbDGreen;
                const txtCls = full ? styles.psbSRed : low ? styles.psbSOrange : styles.psbSGreen;
                const statusTxt = full ? "Fully Booked" : low ? "Limited" : "Available";
                const seatsPercent = Math.max(5, (rem / batch.totalSeats) * 100);
                const isSelected = selectedId === idx;
                const dormFmt = fmtPrice(batch.dormPrice);
                return (
                  <div
                    key={idx}
                    className={[styles.psbBc, full ? styles.psbBcFull : "", isSelected ? styles.psbBcSel : ""].filter(Boolean).join(" ")}
                    onClick={() => { if (!full) setSelectedId(idx); }}
                  >
                    <div className={styles.psbBcTick}>
                      <svg viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={styles.psbBcMonth}>{monthYear(batch.date)}</div>
                    <div className={styles.psbBcDates}>{shortDateRange(batch.date)}</div>
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
            <div className={styles.psbRpCourse}>Meditation Yoga Teacher Training</div>
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
                  <div className={styles.psbSelDate}>{selected.date}</div>
                </>
              ) : (
                <span className={styles.psbSelHint}>← Select a batch to continue</span>
              )}
            </div>
            {selected && !(selected.bookedSeats >= selected.totalSeats) ? (
              <a href={selected.applyLink ?? "/yoga-registration?type=meditation"} className={styles.psbBookBtn}>
                Book Now — {fmtPrice(selected.dormPrice).amount} {currency}
                <svg className={styles.psbArrowIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff3d2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <span className={`${styles.psbBookBtn} ${styles.psbBookBtnDis}`}>Book Now</span>
            )}
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

/* ─── Component ─── */
const MeditationPage: React.FC = () => {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { rate, loading: rateLoading } = useCurrencyRate();

  return (
    <div className={styles.page}>
      <section className={styles.heroSection}>
        <Image
          src={heroImg}
          alt="Yoga Students Group"
          width={1180}
          height={540}
          className={styles.heroImage}
          priority
        />
      </section>
      {/* ══════════════════════════════════════
          SECTION 1 — HERO TITLE + BANNER
      ══════════════════════════════════════ */}
      <section className={styles.heroSection1}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>
            Meditation Yoga Teacher Training Course in Rishikesh India
          </h1>
          <OmDivider />
          {/* <div className={styles.bannerWrap}>
            <Image
              src={bannerImage}
              alt="Learn to Meditate – Meditation Yoga Teacher Training in Rishikesh"
              className={styles.bannerImg}
              priority
            />
          </div> */}
          {/* <h2 className={styles.secTitle} style={{ marginTop: "2rem" }}>
            Meditation Yoga Teacher Training in Rishikesh
          </h2> */}
        </div>
      </section>

     {/* SECTION 2 — WHAT IS MEDITATION - SIMPLE SPLIT LAYOUT */}
<section className={styles.whatIsSection}>
  <div className={styles.container}>
    <div className={styles.splitLayout}>
      {/* Left - Text Content */}
      <div className={styles.splitContent}>
        <h2 className={styles.splitTitle}>What is Meditation?</h2>
        <OmDivider />
        <p className={styles.splitPara}>
          Meditation cannot be explained in words. Words serve as signposts,
          pointing toward something, but they are not the thing itself. As a
          great one once said, "words are the fingers pointing towards the
          moon but they are not the moon itself."
        </p>
        <p className={styles.splitPara}>
          Meditation is that vast inner space within you — a constant and complete bliss and joy. 
          It is the connection to something so much bigger, where you are connected to every living 
          being in the universe. It is the space where you become the complete watcher of everything.
        </p>
        <p className={styles.splitPara}>
          When you open yourself completely and surrender to the divine, that moment of surrender 
          is when you fully accept your life is happening before you. You become the watcher, 
          and everything works through you and for you.
        </p>
      </div>

      {/* Right - Video (autoplay, looped) */}
      <div className={styles.splitVideo}>
        <video
          src="https://cdn.pixabay.com/video/2023/06/26/170521-837432158_large.mp4"
          className={styles.meditationVideo}
          autoPlay
          loop
          muted
          playsInline
          controlsList="nodownload"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</section>

    {/* ══════════════════════════════════════
    SECTION 3 — MEDITATION METHODS WITH IMAGES
══════════════════════════════════════ */}
<section className={styles.methodSection}>
  <div className={styles.container}>
    <h2 className={styles.secTitle}>
      What is your favorite method of meditation?
    </h2>
    <OmDivider />

    {/* Method 1 - Vipassana */}
    <div className={styles.methodCard}>
      <div className={styles.methodContent}>
        <h3 className={styles.methodTitle}>Vipassana Meditation</h3>
        <p className={styles.bodyPara}>
          Vipassana involves sitting in a comfortable meditative posture.
          Focus on your breathing and the fact that you are now sitting. As
          you breathe, repeat in your mind: "in, out, sitting" or "rising,
          falling, sitting." You can focus either on your nostrils or on your
          abdomen. Repeat this a few times and keep your focus with the
          breath. Note that each round is an individual round. Keep repeating
          until you feel comfortable. Usually, after a few rounds of noting,
          meditation comes. If you lose concentration at any point, return
          your awareness to the breath. During meditation, if any thought or
          emotion comes up, try to remain the watcher. Do not attach to any of
          them; just see them come, stay a while, and go.
        </p>
      </div>
      <div className={styles.methodImage}>
        <img 
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=85"
          alt="Person practicing Vipassana meditation"
          className={styles.methodImg}
        />
        <div className={styles.methodImageCaption}>Vipassana Meditation</div>
      </div>
    </div>

    {/* Method 2 - Active Meditation */}
    <div className={`${styles.methodCard} ${styles.methodCardReverse}`}>
      <div className={styles.methodContent}>
        <h3 className={styles.methodTitle}>Active Meditation</h3>
        <p className={styles.bodyPara}>
          Active meditation uses the energy of the body to silence the mind.
          You use lots of energy before sitting still. This could involve
          exercises such as dancing or aerobatic movements. This type of
          meditation increases your blood circulation and heats up the body.
          Your mind's focus and energy shift fully onto the body instead of
          the brain or thoughts. Once the exercises are done, the meditator
          sits for a few minutes to absorb the changes in the body. Focus the
          energy on relaxing the muscles that have been working. This makes it
          easier for beginner meditators to focus and feel only positive
          feelings with minimal mind activity. This method is very new and not
          used traditionally. It is meant for the fast-paced life humans
          experience these days. It trains the mind to shift quickly from
          activity to calm. With practice, the meditator can move to traditional
          static meditation, where sitting still becomes easier.
        </p>
      </div>
      <div className={styles.methodImage}>
        <img 
          src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500&q=85"
          alt="Active meditation practice"
          className={styles.methodImg}
        />
        <div className={styles.methodImageCaption}>Active Meditation</div>
      </div>
    </div>

    {/* Method 3 - Static Meditation */}
    <div className={styles.methodCard}>
      <div className={styles.methodContent}>
        <h3 className={styles.methodTitle}>Static Meditation</h3>
        <p className={styles.bodyPara}>
          Static meditation is a practice in which the meditator sits still,
          focusing inward until reaching a meditative state. Over time,
          meditation can expand into every action throughout the day,
          including brushing teeth, walking, doing chores, practicing Yoga,
          working, and other aspects of daily life. In this context,
          meditation means being fully mindful and aware of actions,
          sensations, and thoughts, both internally and externally. Unlike
          practices with vigorous movement, static meditation emphasizes
          stillness and doing each activity at its natural pace with complete
          energy and attention. This sustained and mindful practice sometimes
          takes more or less time but always centers on careful awareness.
          Through static meditation, one aims to connect to the universe's
          powers, attain advanced meditative stages, and possibly remain in
          such a state for extended periods.
        </p>
      </div>
      <div className={styles.methodImage}>
        <img 
          src="https://images.unsplash.com/photo-1545389336-cf090694435e?w=500&q=85"
          alt="Person in deep static meditation"
          className={styles.methodImg}
        />
        <div className={styles.methodImageCaption}>Static Meditation</div>
      </div>
    </div>

    <p className={styles.bodyPara} style={{ marginTop: "1.5rem" }}>
      If you are interested in exploring a meditation yoga course in
      Rishikesh, meditation yoga classes in Rishikesh, or yoga and
      meditation courses in India, there are numerous opportunities for
      all levels. Whether you are seeking a meditation course for
      beginners in Rishikesh, a mindfulness meditation course in India, or
      prefer an online meditation yoga course in India, you will find
      programs tailored to your needs. For those wishing for a deeper
      experience, a spiritual meditation retreat in Rishikesh or
      meditation yoga training in Rishikesh offers unique chances for
      personal growth and self-discovery.
    </p>
  </div>
</section>

{/* ══════════════════════════════════════
    SECTION 4 — ELEVATE + WHY CHOOSE WITH IMAGES
══════════════════════════════════════ */}
<section className={styles.altSection}>
  <div className={styles.container}>
    {/* Elevate Section with Image */}
    <div className={styles.elevateWrapper}>
      <div className={styles.elevateContent}>
        <h2 className={styles.secTitle}>Elevate Your Practice and Inspire Others</h2>
        <OmDivider />
        <p className={styles.bodyPara}>
          Are you ready to take your yoga journey to the next level and
          empower others in their mindfulness practices? Our{" "}
          <strong>Meditation Yoga Teacher Training program</strong> is crafted
          for those eager to explore the dynamic relationship between
          meditation and yoga. Join us as we embark on a transformative
          journey, equipping you to guide others confidently on their paths to
          self-awareness and tranquillity.
        </p>
      </div>
      <div className={styles.elevateImage}>
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=85"
          alt="Yoga teacher training session"
          className={styles.elevateImg}
        />
      </div>
    </div>

    {/* Why Choose Section with Icon Cards */}
    <h2 className={styles.secTitle} style={{ marginTop: "3rem" }}>
      Why Choose Our Program?
    </h2>
    <OmDivider />
    
    <div className={styles.whyGridModern}>
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>🌟</div>
        <h4 className={styles.whyCardTitle}>Empowering Environment</h4>
        <p className={styles.whyCardText}>
          Traditional meditation focuses on the self and tries to unite the self with the almighty. 
          Using mala beads and mantra chanting helps in focusing on oneself and getting free of distractions.
        </p>
      </div>
      
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>👨‍🏫</div>
        <h4 className={styles.whyCardTitle}>Expert Instructors</h4>
        <p className={styles.whyCardText}>
          Our experienced teachers are passionate about sharing their knowledge and expertise with you. 
          They provide tools and feedback to help you lead confidently and clearly.
        </p>
      </div>
      
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>📚</div>
        <h4 className={styles.whyCardTitle}>Comprehensive Curriculum</h4>
        <p className={styles.whyCardText}>
          Well-rounded curriculum covering yoga philosophy, anatomy, and meditation techniques. 
          Gain deep understanding to enhance your practice and teaching.
        </p>
      </div>
      
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>💪</div>
        <h4 className={styles.whyCardTitle}>Practical Experience</h4>
        <p className={styles.whyCardText}>
          Step into your role as a teacher with ample opportunities to lead meditation sessions 
          and teach asanas, ensuring you're well-prepared for your future students.
        </p>
      </div>
      
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>🦋</div>
        <h4 className={styles.whyCardTitle}>Transformational Journey</h4>
        <p className={styles.whyCardText}>
          Designed for teaching and personal evolution. Cultivate profound insights and develop 
          your mindfulness practice to share authentic experiences.
        </p>
      </div>
      
      <div className={styles.whyCardModern}>
        <div className={styles.whyCardIcon}>🤝</div>
        <h4 className={styles.whyCardTitle}>Building a Strong Community</h4>
        <p className={styles.whyCardText}>
          Connect with driven individuals who share your passion. Share experiences and support 
          one another in this empowering journey.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
    SECTION 5 — SCHOOL + HIGHLIGHTS + PREMIUM SEAT BOOKING
══════════════════════════════════════ */}
<section className={styles.scheduleSection}>
  <div className={styles.container}>
    <h2 className={styles.secTitle}>
      Meditation Course in Rishikesh – AYM Yoga School
    </h2>
    <OmDivider />

    {/* Program Highlights - Enhanced with Cards */}
    <h3 className={styles.subSecTitle}>Program Highlights:</h3>
    <div className={styles.highlightsGridModern}>
      <div className={styles.highlightCard}>
        <div className={styles.highlightCardIcon}>🧘‍♀️</div>
        <h4 className={styles.highlightCardTitle}>Daily Meditation & Yoga</h4>
        <p className={styles.highlightCardText}>
          Daily meditation and yoga practices designed to ignite your confidence and deepen your personal practice.
        </p>
      </div>
      
      <div className={styles.highlightCard}>
        <div className={styles.highlightCardIcon}>🎯</div>
        <h4 className={styles.highlightCardTitle}>Engaging Workshops</h4>
        <p className={styles.highlightCardText}>
          Engaging workshops on cutting-edge meditation techniques, breathwork, and mindfulness practices.
        </p>
      </div>
      
      <div className={styles.highlightCard}>
        <div className={styles.highlightCardIcon}>📖</div>
        <h4 className={styles.highlightCardTitle}>Anatomy & Physiology</h4>
        <p className={styles.highlightCardText}>
          In-depth exploration of the anatomy and physiology related to meditation and its effects on the body.
        </p>
      </div>
      
      <div className={styles.highlightCard}>
        <div className={styles.highlightCardIcon}>🕉️</div>
        <h4 className={styles.highlightCardTitle}>Eight Limbs of Yoga</h4>
        <p className={styles.highlightCardText}>
          Thought-provoking discussions on the Eight Limbs of Yoga and various meditation traditions.
        </p>
      </div>
      
      <div className={styles.highlightCard}>
        <div className={styles.highlightCardIcon}>💻</div>
        <h4 className={styles.highlightCardTitle}>Flexible Training</h4>
        <p className={styles.highlightCardText}>
          Flexible training options, available both online and in-person, to accommodate your lifestyle and schedule.
        </p>
      </div>
    </div>

    {/* ══ PREMIUM SEAT BOOKING — same UI as 500hr page ══ */}
    <PremiumSeatBookingMeditation
      seats={pricingData}
      currency={currency}
      onCurrencyChange={setCurrency}
      rate={rate}
      rateLoading={rateLoading}
    />
  </div>
</section>

   {/* ══════════════════════════════════════
    SECTION 6 — CTA CLOSING
══════════════════════════════════════ */}
<section className={styles.ctaSection}>
  <div className={styles.container}>
    <div className={styles.ctaWrapper}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaBadge}>
          <span>✦ Begin Your Journey ✦</span>
        </div>
        <h2 className={styles.ctaTitle}>
          Is This Meditation Program for You?
        </h2>
        <div className={styles.ctaDivider}>
          <span className={styles.ctaDividerLine}></span>
          <span className={styles.ctaDividerIcon}>ॐ</span>
          <span className={styles.ctaDividerLine}></span>
        </div>
        <p className={styles.ctaPara}>
          If you are passionate about yoga and eager to deepen your knowledge
          while sharing it with others, this training is for you. Whether you
          are a beginner or have extensive experience, we welcome dedicated
          individuals ready to embrace the powerful practice of mindfulness.
        </p>

        <h3 className={styles.ctaSubTitle}>
          Embark on Your Transformative Journey
        </h3>
        <p className={styles.ctaPara}>
          Enroll in our Meditation Yoga Teacher Training program and take a
          significant step toward enhancing your practice and impacting the
          lives of others. Together, we will cultivate a world of mindful
          living, one breath at a time.
        </p>
        
        <div className={styles.ctaButtonGroup}>
          <a href="/contact" className={styles.ctaButton}>
            Enroll Now
            <svg className={styles.ctaButtonIcon} viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/contact" className={styles.ctaButtonOutline}>
            Learn More
          </a>
        </div>
      </div>
      
      <div className={styles.ctaImage}>
        <img 
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&q=85"
          alt="Peaceful meditation"
          className={styles.ctaImg}
        />
        <div className={styles.ctaImageOverlay}>
          <span>Start Your Journey Today</span>
        </div>
      </div>
    </div>
  </div>
</section>

      <HowToReach />
    </div>
  );
};

export default MeditationPage;