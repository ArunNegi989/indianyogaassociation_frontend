"use client";

import React, { useState, useEffect } from "react";
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

/* ─────────────────────────────────────────
   MANDALA SVG
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   SEATS CELL
───────────────────────────────────────── */
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
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={400} c1="#e07b00" c2="#d4a017" sw={0.44} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={360} c1="#d4a017" c2="#e07b00" sw={0.44} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={210} c1="#e07b00" c2="#d4a017" sw={0.58} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={210} c1="#d4a017" c2="#e07b00" sw={0.58} />
      </div>
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

      {/* ══════════════════════════════════════
          SECTION 1 — INTRO + HERO GRID IMAGES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Page Title */}
          {pageData.pageTitleH1 && (
            <h1 className={styles.heroTitle}>{pageData.pageTitleH1}</h1>
          )}
          <div className={styles.titleUnderline} />

          {/* Intro Section Title */}
          {pageData.introSectionTitle && (
            <h2 className={styles.sectionTitle}>
              {pageData.introSectionTitle}
            </h2>
          )}

          {/* Intro Paragraphs */}
          {pageData.introPara1 && (
            <div
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: pageData.introPara1 }}
            />
          )}
          {pageData.introPara2 && (
            <div
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: pageData.introPara2 }}
            />
          )}
          {pageData.introPara3 && (
            <div
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: pageData.introPara3 }}
            />
          )}
          {pageData.introExtraParagraphs?.map((para, i) => (
            <div
              key={i}
              className={styles.bodyPara}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}

          {/* Hero Grid Images */}
          {pageData.heroGridImages?.length > 0 && (
            <div className={styles.heroImageGrid}>
              {pageData.heroGridImages.map((img) => (
                <div key={img._id} className={styles.heroImgWrap}>
                  <img
                    src={imgSrc(img.url)}
                    alt={img.alt || "Prenatal yoga"}
                    className={styles.heroImg}
                    loading="eager"
                  />
                  <div className={styles.heroImgOverlay} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — FEATURES + LOCATION + SCHEDULE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          {/* Features Section */}
          {pageData.featuresSectionTitle && (
            <h2 className={styles.sectionTitle}>
              {pageData.featuresSectionTitle}
            </h2>
          )}
          <div className={styles.titleUnderline} />

          {pageData.featuresSuperLabel && (
            <p className={styles.superLabel}>{pageData.featuresSuperLabel}</p>
          )}

          {pageData.featuresPara1 && (
            <div
              className={styles.bodyPara}
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

          {/* Location + Schedule */}
          {(pageData.locationSubTitle || pageData.schedule?.length > 0) && (
            <div className={styles.vintageCard}>
              <span className={styles.cardCorner}>✦</span>

              {pageData.locationSubTitle && (
                <h2 className={styles.subSectionTitle}>
                  {pageData.locationSubTitle}
                </h2>
              )}
              <div className={styles.subUnderline} />

              {pageData.locationPara && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: pageData.locationPara }}
                />
              )}

              <div className="row g-4 align-items-start mt-2">
                {/* Schedule List */}
                {pageData.schedule?.length > 0 && (
                  <div className="col-12 col-lg-6">
                    <div className={styles.scheduleBlock}>
                      <div className={styles.scheduleHeader}>
                        The program, a draft of a schedule:
                      </div>
                      <div className={styles.scheduleList}>
                        {pageData.schedule.map((row) => (
                          <div key={row._id} className={styles.schedRow}>
                            <span className={styles.schedTime}>{row.time}</span>
                            <span className={styles.schedSep}>:</span>
                            <span className={styles.schedAct}>
                              {row.activity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Image */}
                {pageData.locationImage && (
                  <div className="col-12 col-lg-6">
                    <div className={styles.locationImgWrap}>
                      <img
                        src={imgSrc(pageData.locationImage)}
                        alt={pageData.locationSubTitle || "Location"}
                        className={styles.locationImg}
                        loading="lazy"
                      />
                      <div className={styles.locationImgFrame} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — BATCH TABLE
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          {pageData.batchSectionTitle && (
            <h2 className={styles.sectionTitle}>
              {pageData.batchSectionTitle}
            </h2>
          )}
          <div className={styles.titleUnderline} />

          {/* Batch Table */}
          <div className={styles.tableContainer}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <div className={styles.tableScroll}>
              <table className={styles.datesTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>FEE</th>
                    <th>FEE (Indian)</th>
                    <th>Room Price</th>
                    <th>Seats</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {batchLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        Loading upcoming batches...
                      </td>
                    </tr>
                  ) : batches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No upcoming batches found.
                      </td>
                    </tr>
                  ) : (
                    batches.map((batch) => {
                      const isFull = batch.bookedSeats >= batch.totalSeats;
                      return (
                        <tr key={batch._id}>
                          <td className={styles.dateCell}>
                            <span className={styles.dateCal}>📅</span>{" "}
                            {formatDateRange(batch.startDate, batch.endDate)}
                          </td>
                          <td>{stripHtml(batch.usdFee)}</td>
                          <td>{stripHtml(batch.inrFee)}</td>
                          <td className={styles.roomPriceCell}>
                            Dorm{" "}
                            <strong className={styles.priceAmt}>
                              ${batch.dormPrice}
                            </strong>{" "}
                            | Twin{" "}
                            <strong className={styles.priceAmt}>
                              ${batch.twinPrice}
                            </strong>{" "}
                            | Private{" "}
                            <strong className={styles.priceAmt}>
                              ${batch.privatePrice}
                            </strong>
                          </td>
                          <td>
                            <SeatsCell
                              booked={batch.bookedSeats}
                              total={batch.totalSeats}
                            />
                          </td>
                          <td>
                            {isFull ? (
                              <span className={styles.applyDisabled}>
                                Apply Now
                              </span>
                            ) : (
                              <a
                                href={`/yoga-registration?batchId=${batch._id}&type=prenatal`}
                                className={styles.applyLink}
                              >
                                Apply Now
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {batches[0]?.note && (
              <p className={styles.tableNote}>
                <strong>Note:</strong> {stripHtml(batches[0].note)}
              </p>
            )}

            <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
              <a href={pageData.joinBtnUrl || "#"} className={styles.joinBtn}>
                {pageData.joinBtnText || "Join Your Yoga Journey"}
              </a>
            </div>
          </div>

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
            <div className={styles.vintageCard}>
              <span className={styles.cardCorner}>✦</span>

              <h2 className={styles.subSectionTitle}>
                {pageData.onlineSectionTitle}
              </h2>
              <div className={styles.subUnderline} />

              {pageData.onlinePara && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: pageData.onlinePara }}
                />
              )}
              {pageData.onlineExtraParagraphs?.map((para, i) => (
                <div
                  key={i}
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}

              {/* Curriculum List */}
              {pageData.curriculum?.length > 0 && (
                <ul className={styles.bulletList}>
                  {pageData.curriculum.map((item) => (
                    <li key={item._id}>
                      {item.title} – {item.hours} Hours
                    </li>
                  ))}
                </ul>
              )}

              {/* Hours Summary */}
              {pageData.hoursSummary?.length > 0 && (
                <div className={styles.hoursSummary}>
                  {pageData.hoursSummary.map((row) => (
                    <div key={row._id} className={styles.hoursRow}>
                      <span className={styles.hoursLabel}>{row.label}</span>
                      <span className={styles.hoursSep}>–</span>
                      <span className={styles.hoursValue}>{row.value}</span>
                    </div>
                  ))}
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
