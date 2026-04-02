"use client";

import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-teacher-training-in-india/Yogattcindia.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import api from "@/lib/api"; // your axios instance

/* ─── TYPES ─── */
interface AccredBadge {
  _id: string;
  label: string;
  imgUrl?: string;
  image?: string;
}

interface CourseCard {
  _id: string;
  hours: string;
  title: string;
  desc: string;
  linkLabel: string;
  href?: string;
  imgUrl?: string;
  image?: string;
}

interface QuoteCard {
  _id: string;
  quote: string;
  imgAlt: string;
  imgUrl?: string;
  image?: string;
}

interface Location {
  _id: string;
  name: string;
  desc: string;
}

interface YogaTTCData {
  _id: string;
  slug: string;
  status: string;

  heroImage: string;
  heroImgAlt: string;
  heroTitle: string;
  heroSubTitle: string;

  introPara: string;
  whoWeArePara: string;
  yytPara: string;
  whyAYMPara1: string;
  whyAYMPara2: string;
  whyAYMPara3: string;
  rishikeshDetailPara: string;
  goaDetailPara: string;

  introParagraphs: string[];
  whyAYMParagraphs: string[];
  rishikeshParagraphs: string[];
  goaParagraphs: string[];

  arrivalList: string[];
  feeList: string[];

  accredBadges: AccredBadge[];
  courseCards: CourseCard[];
  quoteCards: QuoteCard[];
  locations: Location[];

  whoWeAreTitle: string;
  yytTitle: string;
  rishikeshTitle: string;
  goaTitle: string;
  whyAYMTitle: string;
  arrivalTitle: string;
  feeTitle: string;
}

/* ─── IMAGE HELPER ─── */
const getImageSrc = (
  image?: string,
  imgUrl?: string,
  fallback?: string,
): string => {
  if (image && image.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  }
  if (imgUrl && imgUrl.length > 0) return imgUrl;
  return fallback || "";
};

/* ─── MANDALA SVG ─── */
const MandalaSVG = ({
  size = 300,
  c1 = "#e07b00",
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
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.22">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const cx = 150 + 60 * Math.cos(r),
          cy = 150 + 60 * Math.sin(r);
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx="18"
            ry="8"
            transform={`rotate(${deg},${cx},${cy})`}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
  </svg>
);

/* ─── CHAKRA SVG ─── */
const ChakraSVG = ({
  size = 32,
  color = "#e07b00",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
    />
    <circle
      cx="50"
      cy="50"
      r="32"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="50"
      cy="50"
      r="18"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.8"
    />
    <circle cx="50" cy="50" r="7" fill={color} opacity="0.45" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={50 + 20 * Math.cos(r)}
          y1={50 + 20 * Math.sin(r)}
          x2={50 + 44 * Math.cos(r)}
          y2={50 + 44 * Math.sin(r)}
          stroke={color}
          strokeWidth="1"
          opacity="0.55"
        />
      );
    })}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontSize="20"
      fill={color}
      fontFamily="serif"
      opacity="0.9"
    >
      ॐ
    </text>
  </svg>
);

/* ─── OM DIVIDER ─── */
const OmDivider = ({ slim = false }: { slim?: boolean }) => (
  <div className={`${styles.omDiv} ${slim ? styles.omSlim : ""}`}>
    <span className={styles.omLine} />
    <ChakraSVG size={slim ? 22 : 30} color="#e07b00" />
    <span className={styles.omLine} />
  </div>
);

/* ─── ACCREDITATION BADGES ─── */
const AccredBadges = ({ badges }: { badges: AccredBadge[] }) => {
  if (!badges || badges.length === 0) return null;
  return (
    <div className={styles.badgesRow}>
      {badges.map((b, i) => {
        const src = getImageSrc(b.image, b.imgUrl);
        return (
          <div key={b._id || i} className={styles.badge}>
            {src ? (
              <img
                src={src}
                alt={b.label}
                className={styles.badgeImg}
                loading="lazy"
              />
            ) : null}
            <span className={styles.badgeLabel}>{b.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── QUOTE CARD ─── */
const QuoteCard = ({ card }: { card: QuoteCard }) => {
  const src = getImageSrc(
    card.image,
    card.imgUrl,
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80",
  );
  return (
    <div className={styles.quoteImgCard}>
      <img
        src={src}
        alt={card.imgAlt}
        className={styles.quoteImg}
        loading="lazy"
      />
      <div className={styles.quoteOverlay}>
        <span className={styles.quoteBar} />
        <p className={styles.quoteCaption}>{card.quote}</p>
      </div>
    </div>
  );
};

/* ─── COURSE CARD ─── */
const CourseCardComp = ({ card }: { card: CourseCard }) => {
  const src = getImageSrc(
    card.image,
    card.imgUrl,
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
  );
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImgWrap}>
        <img
          src={src}
          alt={card.title}
          className={styles.courseImg}
          loading="lazy"
        />
        <div className={styles.courseImgOverlay} />
        <div className={styles.courseHourBadge}>{card.hours} hr</div>
      </div>
      <div className={styles.courseBody}>
        <h3 className={styles.courseTitle}>{card.title}</h3>
        <div className={styles.courseLine} />
        {/* desc may contain HTML from rich text editor */}
        {card.desc ? (
          <div
            className={styles.courseDesc}
            dangerouslySetInnerHTML={{ __html: card.desc }}
          />
        ) : null}
      </div>
      <a href={card.href || "#"} className={styles.courseBtn}>
        {card.linkLabel}
      </a>
    </div>
  );
};

/* ─── LOADING SKELETON ─── */
const LoadingSkeleton = () => (
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
        color: "#e07b00",
        fontSize: "1.2rem",
        opacity: 0.7,
      }}
    >
      <ChakraSVG size={48} color="#e07b00" />
      <p style={{ marginTop: "1rem", fontFamily: "serif" }}>Loading...</p>
    </div>
  </div>
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function YogaTTCIndia() {
  const [data, setData] = useState<YogaTTCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/yoga-ttc-india");
        if (res.data?.success && res.data?.data) {
          setData(res.data.data);
        } else {
          setError("No data found.");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) {
    return (
      <div
        className={styles.page}
        style={{ padding: "4rem", textAlign: "center", color: "#e07b00" }}
      >
        <p>{error || "Something went wrong."}</p>
      </div>
    );
  }

  /* ── Derived hero image URL ── */
  const heroSrc = data.heroImage?.startsWith("/uploads/")
    ? `${process.env.NEXT_PUBLIC_API_URL}${data.heroImage}`
    : data.heroImage || "";

  /* ── Rishikesh & Goa location data ── */
  const rishikeshLoc = data.locations?.find((l) =>
    l.name?.toLowerCase().includes("rishikesh"),
  );
  const goaLoc = data.locations?.find((l) =>
    l.name?.toLowerCase().includes("goa"),
  );

  return (
    <div className={styles.page}>
      {/* Fixed Mandalas */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={430} c1="#e07b00" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={390} c1="#d4a017" c2="#e07b00" sw={0.42} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={230} c1="#e07b00" c2="#d4a017" sw={0.55} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={230} c1="#d4a017" c2="#e07b00" sw={0.55} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ── HERO IMAGE ── */}
      {heroSrc && (
        <section className={styles.heroSection}>
          <img
            src={heroSrc}
            alt={data.heroImgAlt || data.heroTitle || "Yoga Teacher Training"}
            className={styles.heroImage}
            style={{ width: "100%", height: "auto", display: "block" }}
            loading="eager"
          />
        </section>
      )}

      {/* ══════════════════════════════
          SECTION 1 — HERO + WHO WE ARE
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Hero heading */}
          <div className={styles.heroWrap}>
            {data.heroTitle && (
              <h1 className={styles.heroTitle}>{data.heroTitle}</h1>
            )}
            {data.heroSubTitle && (
              <p className={styles.heroSub}>{data.heroSubTitle}</p>
            )}
            <div className={styles.heroUnderline} />
          </div>

          {/* Intro Paragraphs (array) */}
          {data.introParagraphs && data.introParagraphs.length > 0 ? (
            data.introParagraphs.map((para, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))
          ) : data.introPara ? (
            <div
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: data.introPara }}
            />
          ) : null}

          {/* Accreditation badges */}
          <AccredBadges badges={data.accredBadges} />

          {/* Who We Are */}
          {(data.whoWeAreTitle || data.whoWeArePara) && (
            <div className={styles.vintageCard}>
              <span className={styles.cardCorner}>✦</span>
              {data.whoWeAreTitle && (
                <h2 className={styles.cardTitle}>{data.whoWeAreTitle}</h2>
              )}
              <div className={styles.cardUnderline} />
              {data.whoWeArePara && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.whoWeArePara }}
                />
              )}
            </div>
          )}

          {/* YTT Through AYM */}
          {(data.yytTitle ||
            data.yytPara ||
            (data.locations && data.locations.length > 0)) && (
            <div className={`${styles.vintageCard} mt-4`}>
              <span className={styles.cardCorner}>✦</span>
              {data.yytTitle && (
                <h2 className={styles.cardTitle}>{data.yytTitle}</h2>
              )}
              <div className={styles.cardUnderline} />
              {data.yytPara && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.yytPara }}
                />
              )}
              {data.locations && data.locations.length > 0 && (
                <div className="row g-3 mt-1">
                  {data.locations.map((loc, i) => (
                    <div key={loc._id || i} className="col-12 col-md-6">
                      <div className={styles.locationCard}>
                        <div className={styles.locationIcon}>
                          <ChakraSVG
                            size={36}
                            color={i === 0 ? "#e07b00" : "#d4a017"}
                          />
                        </div>
                        <div>
                          <h3 className={styles.locationName}>{loc.name}</h3>
                          <p className={styles.locationDesc}>{loc.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2 — RISHIKESH + GOA + 3 COURSES
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          {/* Rishikesh detail */}
          {(data.rishikeshTitle ||
            data.rishikeshDetailPara ||
            (data.rishikeshParagraphs &&
              data.rishikeshParagraphs.length > 0)) && (
            <div className={styles.locationDetail}>
              {data.rishikeshTitle && (
                <h2 className={styles.locationDetailTitle}>
                  {data.rishikeshTitle}
                </h2>
              )}
              <div className={styles.locationDetailLine} />
              {data.rishikeshParagraphs &&
              data.rishikeshParagraphs.length > 0 ? (
                data.rishikeshParagraphs.map((p, i) => (
                  <div
                    key={i}
                    className={styles.bodyPara}
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))
              ) : data.rishikeshDetailPara ? (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.rishikeshDetailPara }}
                />
              ) : rishikeshLoc?.desc ? (
                <p className={styles.bodyPara}>{rishikeshLoc.desc}</p>
              ) : null}
            </div>
          )}

          {/* Goa detail */}
          {(data.goaTitle ||
            data.goaDetailPara ||
            (data.goaParagraphs && data.goaParagraphs.length > 0)) && (
            <div className={styles.locationDetail}>
              {data.goaTitle && (
                <h2 className={styles.locationDetailTitle}>{data.goaTitle}</h2>
              )}
              <div className={styles.locationDetailLine} />
              {data.goaParagraphs && data.goaParagraphs.length > 0 ? (
                data.goaParagraphs.map((p, i) => (
                  <div
                    key={i}
                    className={styles.bodyPara}
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))
              ) : data.goaDetailPara ? (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.goaDetailPara }}
                />
              ) : goaLoc?.desc ? (
                <p className={styles.bodyPara}>{goaLoc.desc}</p>
              ) : null}
            </div>
          )}

          <OmDivider />

          {/* Course Cards */}
          {data.courseCards && data.courseCards.length > 0 && (
            <div className="row g-4 mt-1">
              {data.courseCards.map((card, i) => (
                <div key={card._id || i} className="col-12 col-md-4">
                  <CourseCardComp card={card} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 3 — WHY AYM + IMAGES + ARRIVAL + FEE
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          {data.whyAYMTitle && (
            <>
              <h2 className={styles.whyTitle}>{data.whyAYMTitle}</h2>
              <div className={styles.whyUnderline} />
            </>
          )}

          {/* whyAYMParagraphs array */}
          {data.whyAYMParagraphs && data.whyAYMParagraphs.length > 0 ? (
            data.whyAYMParagraphs.map((p, i) => (
              <div
                key={i}
                className={styles.bodyPara}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))
          ) : (
            <>
              {data.whyAYMPara1 && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.whyAYMPara1 }}
                />
              )}
              {data.whyAYMPara2 && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.whyAYMPara2 }}
                />
              )}
              {data.whyAYMPara3 && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.whyAYMPara3 }}
                />
              )}
            </>
          )}

          {/* Quote Cards */}
          {data.quoteCards && data.quoteCards.length > 0 && (
            <div className="row g-3 mb-4">
              {data.quoteCards.map((card, i) => (
                <div key={card._id || i} className="col-12 col-md-6">
                  <QuoteCard card={card} />
                </div>
              ))}
            </div>
          )}

          <OmDivider slim />

          {/* Arrival & Includes panels */}
          {((data.arrivalList && data.arrivalList.length > 0) ||
            (data.feeList && data.feeList.length > 0)) && (
            <div className="row g-4 mt-2">
              {/* Arrival & Departure */}
              {data.arrivalList && data.arrivalList.length > 0 && (
                <div className="col-12 col-md-6">
                  <div className={styles.infoPanel}>
                    <h3 className={styles.panelTitle}>
                      {data.arrivalTitle || "Arrival & Departure"}
                    </h3>
                    <div className={styles.panelUnderline} />
                    <ol className={styles.panelList}>
                      {data.arrivalList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Includes in Fee */}
              {data.feeList && data.feeList.length > 0 && (
                <div className="col-12 col-md-6">
                  <div className={styles.infoPanel}>
                    <h3 className={styles.panelTitle}>
                      {data.feeTitle || "Includes in Fee"}
                    </h3>
                    <div className={styles.panelUnderline} />
                    <ol className={styles.panelList}>
                      {data.feeList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
