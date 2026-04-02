"use client";

import React, { useEffect, useState } from "react";
import styles from "@/assets/style/vinyasa-teacher-training-india/Ashtangavinyasattc.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
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

interface Testimonial {
  _id: string;
  name: string;
  from: string;
  initials: string;
  quote: string;
}

interface PageData {
  heroImage: string;
  heroImgAlt: string;
  promoImage: string;
  pageH1Title: string;
  introMainPara: string;
  courseDetailsTitle: string;
  courseDetailsIntro1: string;
  courseDetailsIntro2: string;
  learnItems: string[];
  whoCanApplyTitle: string;
  whoCanApplyPara1: string;
  whoCanApplyPara2: string;
  whoItems: string[];
  promoSchoolLabel: string;
  promoHeading: string;
  promoLocation: string;
  promoFeeLabel: string;
  promoFeeAmount: string;
  promoBtnLabel: string;
  promoBtnHref: string;
  certTeachersTitle: string;
  certTeachersParagraphs: string[];
  communityTitle: string;
  communityParagraphs: string[];
  accommodationTitle: string;
  accommodationParagraphs: string[];
  certCardTitle: string;
  certCardPara: string;
  certDeepTitle: string;
  certDeepPara: string;
  schedPayBtnLabel: string;
  schedPayBtnHref: string;
  testimSectionTitle: string;
  testimIntroText: string;
  testimonials: Testimonial[];
}

/* ─────────────────────────────────────────
   DATE FORMATTER
───────────────────────────────────────── */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return (
    s.toLocaleDateString("en-IN", opts) +
    " – " +
    e.toLocaleDateString("en-IN", opts)
  );
};

/* ─────────────────────────────────────────
   HTML RENDERER
───────────────────────────────────────── */
function Html({ html, className }: { html: string; className?: string }) {
  const clean = (html || "").replace(/<p>/g, "").replace(/<\/p>/g, " ").trim();
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}

/* ─────────────────────────────────────────
   MANDALA SVG
───────────────────────────────────────── */
function MandalaSVG({
  size = 300,
  c1 = "#e07b00",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) {
  const circles = [145, 125, 106, 88, 70, 52, 36, 22, 10];
  const lines: number[][] = [
    [150, 5, 150, 295],
    [5, 150, 295, 150],
    [47, 47, 253, 253],
    [253, 47, 47, 253],
    [10, 100, 290, 200],
    [10, 200, 290, 100],
    [100, 10, 200, 290],
    [200, 10, 100, 290],
  ];
  const diagonals = [0, 30, 60, 90, 120, 150];
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke={c1} strokeWidth={sw}>
        {circles.map((r, i) => (
          <circle key={i} cx="150" cy="150" r={r} />
        ))}
      </g>
      <g fill="none" stroke={c2} strokeWidth={sw * 0.65} opacity="0.45">
        {lines.map((d, i) => (
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
        {diagonals.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={150 + 148 * Math.cos(rad)}
              y1={150 + 148 * Math.sin(rad)}
              x2={150 - 148 * Math.cos(rad)}
              y2={150 - 148 * Math.sin(rad)}
            />
          );
        })}
      </g>
      <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.25">
        {petals.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const px = 150 + 60 * Math.cos(rad);
          const py = 150 + 60 * Math.sin(rad);
          return (
            <ellipse
              key={deg}
              cx={px}
              cy={py}
              rx="18"
              ry="8"
              transform={"rotate(" + deg + "," + px + "," + py + ")"}
            />
          );
        })}
      </g>
      <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
      <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   LOTUS CHAKRA
───────────────────────────────────────── */
function LotusChakra({
  size = 60,
  color = "#e07b00",
}: {
  size?: number;
  color?: string;
}) {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
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
      {spokes.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={50 + 20 * Math.cos(rad)}
            y1={50 + 20 * Math.sin(rad)}
            x2={50 + 44 * Math.cos(rad)}
            y2={50 + 44 * Math.sin(rad)}
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
}

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
function OmDivider() {
  return (
    <div className={styles.omDiv}>
      <span className={styles.omLine} />
      <LotusChakra size={28} color="#e07b00" />
      <span className={styles.omLine} />
    </div>
  );
}

function SimpleDivider() {
  return (
    <div className={styles.simpleDivider}>
      <span className={styles.omLine} />
    </div>
  );
}

/* ─────────────────────────────────────────
   CORNER ORNAMENT
───────────────────────────────────────── */
function CornerOrnament({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flipMap: Record<string, string> = {
    tl: "scale(1,1)",
    tr: "scale(-1,1)",
    bl: "scale(1,-1)",
    br: "scale(-1,-1)",
  };
  return (
    <svg
      viewBox="0 0 40 40"
      className={styles.cornerOrn}
      style={{ transform: flipMap[pos] }}
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

/* ─────────────────────────────────────────
   BORDER STRIP
───────────────────────────────────────── */
function BorderStrip() {
  const items = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className={styles.borderStrip}>
      <svg
        viewBox="0 0 800 14"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.borderSvg}
      >
        {items.map((i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon
                points={
                  x +
                  ",7 " +
                  (x + 6) +
                  ",2 " +
                  (x + 12) +
                  ",7 " +
                  (x + 6) +
                  ",12"
                }
                fill="none"
                stroke="#b8860b"
                strokeWidth="0.8"
              />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line
          x1="0"
          y1="7"
          x2="800"
          y2="7"
          stroke="#e07b00"
          strokeWidth="0.3"
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   SEATS CELL
───────────────────────────────────────── */
function SeatsCell({ booked, total }: { booked: number; total: number }) {
  if (booked >= total) {
    return <span className={styles.fullyBooked}>Fully Booked</span>;
  }
  return (
    <span className={styles.seatsAvailable}>
      {total - booked} / {total} Seats
    </span>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function AshtangaVinyasaTTC() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

  useEffect(() => {
    Promise.all([api.get("/ashtanga-vinyasa-ttc/"), api.get("/vinyasa-seats")])
      .then(([pageRes, seatsRes]) => {
        setPageData(pageRes.data.data ?? null);
        setSeats(seatsRes.data.data ?? []);
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          fontFamily: "serif",
          color: "#8b4513",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!pageData) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          fontFamily: "serif",
          color: "#8b4513",
        }}
      >
        No data found.
      </div>
    );
  }

  const noteRow = seats.find((s) => s.note);

  return (
    <div className={styles.page}>
      {/* Mandala Decorations */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={420} c1="#e07b00" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={380} c1="#d4a017" c2="#e07b00" sw={0.42} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={220} c1="#e07b00" c2="#d4a017" sw={0.56} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={220} c1="#d4a017" c2="#e07b00" sw={0.56} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* HERO */}
      <section className={styles.heroSection}>
        {pageData.heroImage && (
          <img
            src={BASE_URL + pageData.heroImage}
            alt={pageData.heroImgAlt || "Yoga Students Group"}
            className={styles.heroImage}
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </section>

      {/* SECTION 1 — INTRO + COURSE DETAILS */}
      <section className={styles.section + " " + styles.sectionLight}>
        <div className="container px-3 px-md-4">
          <h1 className={styles.heroTitle}>{pageData.pageH1Title}</h1>
          <SimpleDivider />
          <Html html={pageData.introMainPara} className={styles.bodyPara} />

          {/* Course Details Card */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>{pageData.courseDetailsTitle}</h2>
            <div className={styles.cardUnderline} />
            <Html
              html={pageData.courseDetailsIntro1}
              className={styles.bodyPara}
            />
            <Html
              html={pageData.courseDetailsIntro2}
              className={styles.bodyPara}
            />
            <div className={styles.learnGrid}>
              {pageData.learnItems.map((item, i) => (
                <div key={i} className={styles.learnItem}>
                  <span className={styles.learnNum}>{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Who Can Apply Card */}
          <div className={styles.vintageCard + " mt-4"}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>{pageData.whoCanApplyTitle}</h2>
            <div className={styles.cardUnderline} />
            <Html
              html={pageData.whoCanApplyPara1}
              className={styles.bodyPara}
            />
            <Html
              html={pageData.whoCanApplyPara2}
              className={styles.bodyPara}
            />
            <div className={styles.whoList}>
              {pageData.whoItems.map((item, i) => (
                <div key={i} className={styles.whoItem}>
                  <span className={styles.whoDot} />
                  <span>
                    {i + 1}. {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PROMO + TEACHERS + COMMUNITY + ACCOMMODATION */}
      <section className={styles.section + " " + styles.sectionWarm}>
        <div className="container px-3 px-md-4">
          <OmDivider />

          {/* Promo Banner */}
          <div className={styles.promoBanner}>
            <div className={styles.promoImgSide}>
              {pageData.promoImage && (
                <img
                  src={BASE_URL + pageData.promoImage}
                  alt="Vinyasa Yoga Teacher Training Rishikesh class"
                  className={styles.promoImg}
                  loading="lazy"
                />
              )}
              <div className={styles.promoImgOverlay} />
            </div>
            <div className={styles.promoTextSide}>
              <p className={styles.promoSmall}>{pageData.promoSchoolLabel}</p>
              <h2 className={styles.promoHeading}>{pageData.promoHeading}</h2>
              <p className={styles.promoLocation}>{pageData.promoLocation}</p>
              <div className={styles.promoDivLine} />
              <p className={styles.promoFee}>
                {pageData.promoFeeLabel}{" "}
                <strong>{pageData.promoFeeAmount}</strong>
              </p>

              <a
                href={pageData.promoBtnHref || "#schedule"}
                className={styles.promoBtn}
              >
                {pageData.promoBtnLabel}
              </a>
            </div>
          </div>

          <OmDivider />

          {/* Certified Teachers */}
          <div className={styles.infoBlock}>
            <h2 className={styles.infoTitle}>{pageData.certTeachersTitle}</h2>
            <div className={styles.infoUnderline} />
            {pageData.certTeachersParagraphs.map((para, i) => (
              <Html key={i} html={para} className={styles.bodyPara} />
            ))}
          </div>

          {/* Community */}
          <div className={styles.infoBlock + " mt-4"}>
            <h2 className={styles.infoTitle}>{pageData.communityTitle}</h2>
            <div className={styles.infoUnderline} />
            {pageData.communityParagraphs.map((para, i) => (
              <Html key={i} html={para} className={styles.bodyPara} />
            ))}
          </div>

          {/* Accommodation */}
          <div className={styles.infoBlock + " mt-4"}>
            <h2 className={styles.infoTitle}>{pageData.accommodationTitle}</h2>
            <div className={styles.infoUnderline} />
            {pageData.accommodationParagraphs.map((para, i) => (
              <Html key={i} html={para} className={styles.bodyPara} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — CERTIFICATION + SCHEDULE + TESTIMONIAL */}
      <section
        className={styles.section + " " + styles.sectionDeep}
        id="schedule"
      >
        <div className="container px-3 px-md-4">
          {/* Certification Card */}
          <div className={styles.vintageCard}>
            <span className={styles.cardCorner}>✦</span>
            <h2 className={styles.cardTitle}>{pageData.certCardTitle}</h2>
            <div className={styles.cardUnderline} />
            <Html html={pageData.certCardPara} className={styles.bodyPara} />
            <h3 className={styles.subHeading}>{pageData.certDeepTitle}</h3>
            <div className={styles.subUnderline} />
            <Html html={pageData.certDeepPara} className={styles.bodyPara} />
          </div>

          <BorderStrip />

          {/* Dates Section */}
          <div className={styles.datesSection}>
            <div className={styles.omDivider}>
              <div className={styles.divLineLeft} />
              <div className={styles.omDividerCenter}>
                <MandalaSVG size={52} c1="#e07b00" c2="#d4a017" sw={0.5} />
                <span className={styles.omDividerLabel}>Upcoming Batches</span>
              </div>
              <div className={styles.divLineRight} />
            </div>

            <div className={styles.datesVintageHeadingWrap}>
              <h2 className={styles.datesVintageHeading}>
                Upcoming Ashtanga Vinyasa Yoga Teacher Training Rishikesh
              </h2>
              <div className={styles.datesVintageHeadingUnderline}>
                <svg
                  viewBox="0 0 200 8"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.headingUndSvg}
                >
                  <path
                    d="M0,4 Q50,0 100,4 Q150,8 200,4"
                    stroke="#e07b00"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
                  <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
                  <circle
                    cx="190"
                    cy="4"
                    r="1.5"
                    fill="#b8860b"
                    opacity="0.5"
                  />
                </svg>
              </div>
            </div>

            <p className={styles.centerSubtext}>
              Choose your preferred accommodation. Prices include tuition and
              meals.
            </p>

            <div className={styles.tableContainer}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />

              <div className={styles.tableScroll}>
                {seats.length === 0 ? (
                  <p
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      fontFamily: "serif",
                      color: "#8b4513",
                    }}
                  >
                    No upcoming batches available at the moment.
                  </p>
                ) : (
                  <table className={styles.datesTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Fee</th>
                        <th>Fee (Indian)</th>
                        <th>Room Price</th>
                        <th>Seats</th>
                        <th>Apply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seats.map((row) => {
                        const isFull = row.bookedSeats >= row.totalSeats;
                        const applyHref =
                          "/yoga-registration?batchId=" +
                          row._id +
                          "&type=vinyasa";
                        return (
                          <tr key={row._id}>
                            <td>
                              <span className={styles.dateCal}>📅</span>{" "}
                              {formatDateRange(row.startDate, row.endDate)}
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
                                  href={applyHref}
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
                )}
              </div>

              {noteRow && (
                <p className={styles.tableNote}>
                  <strong>Note:</strong> {noteRow.note}
                </p>
              )}

              <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
                <a
                  href={pageData.schedPayBtnHref || "#"}
                  className={styles.joinBtn}
                >
                  {pageData.schedPayBtnLabel}
                </a>
              </div>
            </div>
          </div>

          <BorderStrip />

          {/* Testimonials */}
          <div className={styles.testimonialBlock + " mt-5"}>
            <h2 className={styles.testimTitle}>
              {pageData.testimSectionTitle}
            </h2>
            <div className={styles.testimUnderline} />
            <p className={styles.testimIntro}>{pageData.testimIntroText}</p>

            {pageData.testimonials.map((t) => (
              <div key={t._id} className={styles.testimCard}>
                <div className={styles.quoteIcon}>"</div>
                <blockquote className={styles.quoteText}>
                  "{t.quote}"
                </blockquote>
                <div className={styles.testimAuthor}>
                  <div className={styles.authorAvatar}>{t.initials}</div>
                  <div>
                    <p className={styles.authorName}>{t.name}</p>
                    <p className={styles.authorFrom}>from {t.from}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
