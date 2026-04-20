"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/assets/style/hatha-yoga-teacher-training-Rishikesh/Hathayogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

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
  /* Banner fields (optional — falls back to sensible defaults) */
  bannerDuration?: string;
  bannerLevel?: string;
  bannerCertification?: string;
  bannerYogaStyle?: string;
  bannerYogaStyleSub?: string;
  bannerLanguage?: string;
  bannerDate?: string;
  bannerDateSub?: string;
  bannerFeeStrike?: string;
  bannerFeeMain?: string;
  bannerBookHref?: string;
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

/* ── Inline SVG icons for banner ── */
function IconClock() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
    </svg>
  );
}
function IconLevel() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconCert() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><polyline points="9 11 12 14 22 4" />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0 1 12 0v2" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 3a14 14 0 0 1 0 18M3 12h18" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ══════════════════════════════════════
   COURSE DETAILS BANNER  (NEW)
══════════════════════════════════════ */
function CourseDetailsBanner({
  d,
  batches,
}: {
  d: HathaYogaData;
  batches: Batch[];
}) {
  /* Derive fee from first available batch, or fall back to page-level fields */
  const firstBatch = batches[0];
  const feeStrike = d.bannerFeeStrike ?? "";
  const feeMain = d.bannerFeeMain ?? firstBatch?.usdFee ?? "";
  const bookHref = d.bannerBookHref ?? "/yoga-registration?type=hatha";

  /* Derive date label */
  const dateLabel =
    d.bannerDate ??
    (firstBatch
      ? `${formatDate(firstBatch.startDate)}`
      : "Every Month");
  const dateSub =
    d.bannerDateSub ??
    (firstBatch ? "Flexible batch dates" : "Flexible batch dates");

  /* Certification from first certCard hours, or fallback */
  const certLabel =
    d.bannerCertification ??
    (d.certCards && d.certCards.length > 0 ? d.certCards[0].hours : "200 Hour");

  const items = [
    {
      icon: <IconClock />,
      label: "Duration",
      value: d.bannerDuration ?? "28 Days",
      sub: "",
    },
    {
      icon: <IconLevel />,
      label: "Level",
      value: d.bannerLevel ?? "All Levels",
      sub: "",
    },
    {
      icon: <IconCert />,
      label: "Certification",
      value: certLabel,
      sub: "",
    },
    {
      icon: <IconPerson />,
      label: "Yoga Style",
      value: d.bannerYogaStyle ?? "Hatha Yoga",
      sub: d.bannerYogaStyleSub ?? "Traditional & Classical",
    },
    {
      icon: <IconGlobe />,
      label: "Language",
      value: d.bannerLanguage ?? "English",
      sub: "",
    },
    {
      icon: <IconCalendar />,
      label: "Date",
      value: dateLabel,
      sub: dateSub,
    },
  ];

  return (
    <section className={styles.courseDetailsBannerSection}>
      <div className={styles.container}>
        <div className={styles.bannerWrap}>
          {/* Tab label */}
          <span className={styles.bannerLabelTab}>Course Details</span>

          {/* 3×2 detail grid */}
          <div className={styles.bannerDetailsGrid}>
            {items.map((item, i) => (
              <div key={i} className={styles.bannerDetailItem}>
                <div className={styles.bannerDetailHeader}>
                  <span className={styles.bannerDetailIcon}>{item.icon}</span>
                  <span className={styles.bannerDetailLabel}>{item.label}</span>
                </div>
                <div className={styles.bannerDetailValue}>{item.value}</div>
                {item.sub && (
                  <div className={styles.bannerDetailSub}>{item.sub}</div>
                )}
              </div>
            ))}
          </div>

          {/* Fee + CTA sidebar */}
          <div className={styles.bannerFeeBox}>
            <div className={styles.bannerFeeLabel}>
              Course Fee
              <span className={styles.bannerFeeFrom}>starting from</span>
            </div>
            <div className={styles.bannerFeeAmount}>
              {feeStrike && (
                <span className={styles.bannerFeeStrike}>{feeStrike}</span>
              )}
              <span className={styles.bannerFeeMain}>{feeMain}</span>
              <span className={styles.bannerFeeCurr}>USD</span>
            </div>
            <a href={bookHref} className={styles.bannerBookBtn}>
              Book Now →
            </a>
          </div>
        </div>
      </div>
    </section>
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
        <MandalaRingSVG size={80} opacity={0.6} />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (batchRes.data?.success) setBatches(batchRes.data.data || []);
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
            loading="eager"
          />
          <div className={styles.heroFade} aria-hidden="true" />
        </section>
      )}

      {/* ══ COURSE DETAILS BANNER (NEW) ══ */}
      <CourseDetailsBanner d={d} batches={batches} />

      {/* ══════════════════════ INTRO ══════════════════════ */}
     <section className={`${styles.sections} ${styles.introSection}`}>
  <div className={styles.container}>
    <div className={`${styles.reveal} ${styles.introGrid}`}>
 
      {/* ── LEFT: Text + accreditations ── */}
      <div className={styles.introText}>
        {d.introSectionTitle && (
          <h2 className={styles.sectionsTitleAccent}>{d.introSectionTitle}</h2>
        )}
        <OrnamentDivider />
        {d.introParagraphs && d.introParagraphs.length > 0
          ? d.introParagraphs.map((p, i) => (
              <div key={i} className={styles.para} dangerouslySetInnerHTML={{ __html: p }} />
            ))
          : null}
 
        {d.accreditations && d.accreditations.length > 0 && (
          <div className={styles.accredBox}>
            <p className={styles.accredTitle}>Accreditations</p>
            {d.accreditations.map((a, i) => (
              <span key={i} className={styles.accredBadge}>{a}</span>
            ))}
          </div>
        )}
      </div>
 
      {/* ── RIGHT: Media stack ── */}
      <div className={styles.introMediaStack}>
 
        {/* Primary large image */}
        <div className={styles.introMainImg}>
          <img
            src={introSrc}
            alt={d.introSideImgAlt || "Yoga class in Rishikesh"}
          />
          <div className={styles.introImgOverlay} />
          <div className={styles.introImgCaption}>Morning Satsang · AYM Ashram</div>
        </div>
 
        {/* Two floating thumbnail cards below */}
        <div className={styles.introThumbRow}>
          <div className={styles.introThumb}>
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80"
              alt="Pranayama practice"
            />
            <div className={styles.introThumbLabel}>Pranayama</div>
          </div>
          <div className={styles.introThumb}>
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80"
              alt="Meditation session"
            />
            <div className={styles.introThumbLabel}>Meditation</div>
          </div>
        </div>
 
        {/* Floating stat badge */}
        <div className={styles.introStatBadge}>
          <span className={styles.introStatNum}>500+</span>
          <span className={styles.introStatText}>Students Certified Annually</span>
        </div>
 
      </div>
    </div>
  </div>
</section>

      {/* ══════════════════════ WHAT IS HATHA ══════════════════════ */}
      <section className={`${styles.section} ${styles.whatSection}`}>
        <div className={styles.whatOverlay}  />
        <div className={styles.whatBorderTop}  />
        <div className={styles.whatBorderBottom}  />
        <div className={styles.whatMandalaBg} >
          {/* <MandalaRingSVG size={500} opacity={1} /> */}
        </div>
        <div className={`${styles.container} ${styles.whatContainer}`}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            {d.whatSuperLabel && (
              <p className={styles.whatSuperLabel}>{d.whatSuperLabel}</p>
            )}
            {d.whatTitle && (
              <h2 className={styles.whatTitle}>{d.whatTitle}</h2>
            )}
            <div className={styles.whatOrnamentDivider}>
              <span className={styles.whatOrnLine} />
              <span className={styles.whatOrnGlyph}>❧</span>
              <span className={styles.whatOrnLine} />
            </div>
            {d.whatParagraphs && d.whatParagraphs.length > 0 ? (
              <div className={styles.whatParagraphsBox}>
                {d.whatParagraphs.map((p, i) => (
                  <div
                    key={i}
                    className={styles.whatPara}
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ══════════════════════ BENEFITS ══════════════════════ */}
    <section className={`${styles.section} ${styles.benefitsSection}`}>
 
  {/* Full-bleed video backdrop */}
  <div className={styles.benefitsVideoBg} aria-hidden="true">
    <video
      autoPlay
      muted
      loop
      playsInline
      className={styles.benefitsVideo}
      poster="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80"
    >
      {/* Free stock yoga video from Pexels CDN */}
      <source
        src="https://videos.pexels.com/video-files/3576382/3576382-uhd_2560_1440_25fps.mp4"
        type="video/mp4"
      />
    </video>
    <div className={styles.benefitsVideoOverlay} />
  </div>
 
  <div className={styles.container}>
    <div className={`${styles.reveal} ${styles.benefitsContentWrap}`}>
 
      {/* Header */}
      <div className={styles.benefitsHeader}>
        {d.benefitsSuperLabel && (
          <p className={styles.benefitsSuperLabelDark}>{d.benefitsSuperLabel}</p>
        )}
        {d.benefitsTitle && (
          <h2 className={styles.benefitsTitleDark}>{d.benefitsTitle}</h2>
        )}
        <div className={styles.whatOrnamentDivider}>
          <span className={styles.whatOrnLine} />
          <span className={styles.whatOrnGlyph}>❧</span>
          <span className={styles.whatOrnLine} />
        </div>
        {d.benefitsIntroPara && (
          <div
            className={styles.benefitsIntroParaDark}
            dangerouslySetInnerHTML={{ __html: d.benefitsIntroPara }}
          />
        )}
      </div>
 
      {/* Pill grid */}
      {d.benefitsList && d.benefitsList.length > 0 && (
        <div className={styles.benefitsPillGrid}>
          {d.benefitsList.map((b, i) => (
            <div key={i} className={styles.benefitPill}>
              <span className={styles.benefitPillNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.benefitPillText}>{b}</span>
            </div>
          ))}
        </div>
      )}
 
      {/* Pull quote at bottom */}
      {d.pullQuote && (
        <div className={styles.pullQuoteDark}>
          <span className={styles.quoteGlyphDark}>"</span>
          {d.pullQuote}
          <span className={styles.quoteGlyphDark}>"</span>
        </div>
      )}
 
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
              <p className={styles.certSuperLabel}>{d.certSuperLabel}</p>
            )}
            {d.certTitle && (
              <h2 className={styles.certSectionTitle}>{d.certTitle}</h2>
            )}
            <div className={styles.certOrnamentDivider}>
              <span className={styles.certOrnLine} />
              <span className={styles.certOrnGlyph}>❧</span>
              <span className={styles.certOrnLine} />
            </div>
            {d.certPara && (
              <div
                className={styles.certParaCenter}
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
    <div className={`${styles.reveal} ${styles.ashramLayout}`}>
 
      {/* LEFT: Text column */}
      <div className={styles.ashramText}>
        {d.ashramSuperLabel && (
          <p className={styles.superLabel}>{d.ashramSuperLabel}</p>
        )}
        {d.ashramTitle && (
          <h2
            className={styles.sectionTitleAccent}
            dangerouslySetInnerHTML={{
              __html: d.ashramTitle.replace(/,\s*/g, ",<br/>"),
            }}
          />
        )}
        <OrnamentDivider />
        {d.ashramParagraphs && d.ashramParagraphs.length > 0
          ? d.ashramParagraphs.map((p, i) => (
              <div key={i} className={styles.para} dangerouslySetInnerHTML={{ __html: p }} />
            ))
          : null}
      </div>
 
      {/* RIGHT: Mosaic image gallery */}
      <div className={styles.ashramMosaic}>
 
        {/* Large primary image */}
        <div className={styles.ashramMosaicMain}>
          <img
            src={ashramSrc}
            alt={d.ashramImgAlt || "AYM Yoga Ashram Rishikesh"}
          />
          <div className={styles.ashramMosaicOverlay} />
          <div className={styles.ashramMosaicLabel}>AYM Ashram · Rishikesh</div>
        </div>
 
        {/* Two smaller images stacked */}
        <div className={styles.ashramMosaicSide}>
          <div className={styles.ashramMosaicSmall}>
            <img
              src="https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80"
              alt="Yoga hall interior"
            />
            <span className={styles.ashramMosaicSmallLabel}>Yoga Hall</span>
          </div>
          <div className={styles.ashramMosaicSmall}>
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80"
              alt="Ganga riverside practice"
            />
            <span className={styles.ashramMosaicSmallLabel}>Riverside Practice</span>
          </div>
        </div>
 
      </div>
    </div>
  </div>
</section>

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
              <OrnamentDivider />
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
      <section
        id="apply"
        className={`${styles.section} ${styles.pricingSection}`}
      >
        <div className={styles.pricingBg} aria-hidden="true">
          <MandalaRingSVG size={800} opacity={0.04} />
        </div>

        <div className={styles.container}>
          {/* Heading */}
          <div className={`${styles.reveal} ${styles.centered}`}>
            {d.pricingSuperLabel && (
              <p className={styles.superLabel}>{d.pricingSuperLabel}</p>
            )}
            {d.pricingTitle && (
              <h2
                className={styles.sectionTitle}
                dangerouslySetInnerHTML={{ __html: d.pricingTitle }}
              />
            )}
            <OrnamentDivider />
            {d.pricingIntroPara && (
              <p className={styles.paraCenter}>
                {d.pricingIntroPara}{" "}
                {d.registrationFormLink && (
                  <a
                    href={d.registrationFormLink}
                    className={styles.inlineLink}
                  >
                    Registration Form
                  </a>
                )}
              </p>
            )}
          </div>

          {/* Batches Table */}
          {batches.length > 0 ? (
            <div className={`${styles.reveal} ${styles.tableContainer}`}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />

              <div className={styles.tableScroll}>
                <table className={styles.datesTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>FEE (USD)</th>
                      <th>FEE (INR)</th>
                      <th>Room Price</th>
                      <th>Seats</th>
                      <th>Apply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((row) => {
                      const isFull = row.bookedSeats >= row.totalSeats;
                      const dateLabel = `${formatDate(row.startDate)} – ${formatDate(row.endDate)}`;
                      return (
                        <tr key={row._id}>
                          <td className={styles.dateCell}>
                            <span className={styles.dateCal}>📅</span>{" "}
                            {dateLabel}
                          </td>
                          <td>{row.usdFee}</td>
                          <td>{row.inrFee}</td>
                          <td className={styles.roomPriceCell}>
                            Dorm{" "}
                            <strong className={styles.priceAmt}>
                              ${row.dormPrice}
                            </strong>{" "}
                            | Twin{" "}
                            <strong className={styles.priceAmt}>
                              ${row.twinPrice}
                            </strong>{" "}
                            | Private{" "}
                            <strong className={styles.priceAmt}>
                              ${row.privatePrice}
                            </strong>
                          </td>
                          <td>
                            <SeatsCell
                              booked={row.bookedSeats}
                              total={row.totalSeats}
                            />
                          </td>
                          <td>
                            {isFull ? (
                              <span className={styles.applyDisabled}>
                                Apply Now
                              </span>
                            ) : (
                              <a
                                href="/yoga-registration?type=hatha"
                                className={styles.applyLink}
                              >
                                Apply Now
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {(d.tableNote || batches.find((b) => b.note)) && (
                <p className={styles.tableNote}>
                  <strong>Note:</strong>{" "}
                  {d.tableNote || batches.find((b) => b.note)?.note}
                </p>
              )}

              {(d.joinBtnLabel || d.joinBtnHref) && (
                <div className={styles.joinBtnWrapper}>
                  <a href={d.joinBtnHref || "#"} className={styles.joinBtn}>
                    {d.joinBtnLabel || "Join Your Yoga Journey"}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className={`${styles.paraCenter} ${styles.paraMuted}`}>
              No upcoming batches at the moment. Please check back soon.
            </p>
          )}

          {((d.programmeParagraphs && d.programmeParagraphs.length > 0) ||
            d.pricingProgrammePara) && (
            <div className={`${styles.reveal} ${styles.programmeBox}`}>
              {d.programmeParagraphs && d.programmeParagraphs.length > 0
                ? d.programmeParagraphs.map((p, i) => (
                    <div
                      key={i}
                      className={styles.para}
                      dangerouslySetInnerHTML={{ __html: p }}
                    />
                  ))
                : d.pricingProgrammePara && (
                    <div
                      className={styles.para}
                      dangerouslySetInnerHTML={{
                        __html: d.pricingProgrammePara,
                      }}
                    />
                  )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ FOOTER CTA ══════════════════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaRingSVG size={400} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            <span className={styles.footerOm}>ॐ</span>
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

      <HowToReach />
    </div>
  );
}