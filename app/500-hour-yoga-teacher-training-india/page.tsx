"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";
import seatStyles from "@/assets/style/500-hour-yoga-teacher-training-india/Yogattc500.module.css";
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

/** Resolve image path — if it already starts with http leave it, else prepend API base */
function imgSrc(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

/** Render a paragraph string safely. */
const Para = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

/* ─────────────────────────────────────────
   TAB CONFIG
───────────────────────────────────────── */
const COURSE_TABS = [
  { label: "100 Hour", key: "100hr", apiPath: "/100hr-seats/get-all-batches" },
  { label: "200 Hour", key: "200hr", apiPath: "/200hr-seats/getAllBatches" },
  { label: "300 Hour", key: "300hr", apiPath: "/300hr-seats/all" },
  { label: "500 Hour", key: "500hr", apiPath: "/500hr-seats" },
] as const;

type TabKey = (typeof COURSE_TABS)[number]["key"];

/* ─────────────────────────────────────────
   SEAT BOOKING SECTION
───────────────────────────────────────── */
function SeatBookingSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("500hr");
  const [batchCache, setBatchCache] = useState<Record<string, Batch[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async (tab: TabKey) => {
    if (batchCache[tab]) return;
    const apiPath = COURSE_TABS.find((t) => t.key === tab)?.apiPath;
    if (!apiPath) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(apiPath);
      setBatchCache((prev) => ({ ...prev, [tab]: data?.data || [] }));
    } catch {
      setError("Failed to load batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const currentBatches: Batch[] = batchCache[activeTab] || [];
  const activeTabLabel = COURSE_TABS.find((t) => t.key === activeTab)?.label;

  return (
    <div className={seatStyles.wrapper}>
      {/* Tab Bar */}
      <div className={seatStyles.tabBar}>
        {COURSE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${seatStyles.tab} ${activeTab === tab.key ? seatStyles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className={seatStyles.tableContainer}>
        {loading ? (
          <div className={seatStyles.stateBox}>🕉️ Loading batches...</div>
        ) : error ? (
          <div className={`${seatStyles.stateBox} ${seatStyles.stateError}`}>
            {error}
          </div>
        ) : currentBatches.length === 0 ? (
          <div className={seatStyles.stateBox}>
            No upcoming batches available for {activeTabLabel}.
          </div>
        ) : (
          <div className={seatStyles.tableScroll}>
            <table className={seatStyles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fee (USD)</th>
                  <th>Fee (Indian)</th>
                  <th>Room Price</th>
                  <th>Seats</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.map((batch) => {
                  const isFull = batch.bookedSeats >= batch.totalSeats;
                  const remaining = batch.totalSeats - batch.bookedSeats;
                  return (
                    <tr key={batch._id}>
                      <td className={seatStyles.tdDate}>
                        <span className={seatStyles.calIcon}>📅</span>{" "}
                        {formatDateRange(batch.startDate, batch.endDate)}
                      </td>
                      <td>{batch.usdFee}</td>
                      <td>{batch.inrFee}</td>
                      <td className={seatStyles.tdRoom}>
                        Dorm{" "}
                        <strong className={seatStyles.price}>
                          ${batch.dormPrice}
                        </strong>{" "}
                        | Twin{" "}
                        <strong className={seatStyles.price}>
                          ${batch.twinPrice}
                        </strong>{" "}
                        | Private{" "}
                        <strong className={seatStyles.price}>
                          ${batch.privatePrice}
                        </strong>
                      </td>
                      <td>
                        {isFull ? (
                          <span className={seatStyles.fullyBooked}>
                            Fully Booked
                          </span>
                        ) : (
                          <span className={seatStyles.seatsAvailable}>
                            {remaining} / {batch.totalSeats} Seats
                          </span>
                        )}
                      </td>
                      <td>
                        {isFull ? (
                          <span className={seatStyles.applyDisabled}>
                            Apply Now
                          </span>
                        ) : (
                          <a
                            href={`/yoga-registration?batchId=${batch._id}&type=${activeTab}`}
                            className={seatStyles.applyLink}
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
        )}

        {currentBatches[0]?.note && (
          <p className={seatStyles.note}>
            <strong>Note:</strong> {currentBatches[0].note}
          </p>
        )}

        <div className={seatStyles.ctaRow}>
          <a href="#" className={seatStyles.joinBtn}>
            Join Your Yoga Journey
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   YOUTUBE EMBED
───────────────────────────────────────── */
const YouTubeEmbed = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.videoThumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className={styles.thumbImg}
            loading="lazy"
          />
          <span className={styles.playBtn}>
            <svg viewBox="0 0 68 48" width="58" height="42">
              <rect
                width="68"
                height="48"
                rx="10"
                fill="#e07b00"
                opacity="0.93"
              />
              <polygon points="26,13 53,24 26,35" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   CAROUSEL
───────────────────────────────────────── */
const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  const len = images.length;
  const [visibleCount, setVisibleCount] = useState(4);

  React.useEffect(() => {
    const update = () => {
      if (window.innerWidth < 576) setVisibleCount(1);
      else if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 992) setVisibleCount(3);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + len) % len);
  const next = () => setIdx((i) => (i + 1) % len);
  const visible = Array.from(
    { length: visibleCount },
    (_, o) => images[(idx + o) % len],
  );

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.carBtn} ${styles.carBtnL}`}
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>
      <div
        className={styles.carTrack}
        style={{ gridTemplateColumns: `repeat(${visibleCount}, 1fr)` }}
      >
        {visible.map((src, i) => (
          <div key={i} className={styles.carSlide}>
            <img
              src={imgSrc(src)}
              alt={`${alt} ${i + 1}`}
              className={styles.carImg}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <button
        className={`${styles.carBtn} ${styles.carBtnR}`}
        onClick={next}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   STAR RATING
───────────────────────────────────────── */
const Stars = ({ n = 5 }: { n?: number }) => (
  <div className={styles.stars}>{Array(n).fill("★").join("")}</div>
);

/* ─────────────────────────────────────────
   OM DIVIDER
───────────────────────────────────────── */
const OmDiv = () => (
  <div className={styles.omDiv}>
    <span className={styles.divLine} />
    <span className={styles.omGlyph}>ॐ</span>
    <span className={styles.divLine} />
  </div>
);

/* ─────────────────────────────────────────
   PAGE SKELETON (loading state)
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
   MAIN PAGE
───────────────────────────────────────── */
export default function YogaTTC500() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO ══ */}
      {content.heroImage && (
        <section className={styles.heroSection}>
          <img
            src={imgSrc(content.heroImage)}
            alt={content.heroImgAlt || "Yoga Students Group"}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ══ INTRO ══ */}
      <section className={styles.heroSection2}>
        <div className="container px-3 px-md-4">
          {content.pageMainH1 && (
            <h1
              className={styles.heroTitle}
              dangerouslySetInnerHTML={{ __html: content.pageMainH1 }}
            />
          )}
          <OmDiv />
          <div className={styles.bodyText}>
            {content.introParas?.map((para, i) => (
              <Para key={i} html={para} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT MAKES AYM + GAINS ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className={styles.block}>
            {content.standApartH2 && (
              <>
                <h2
                  className={styles.blockTitle}
                  dangerouslySetInnerHTML={{ __html: content.standApartH2 }}
                />
                <div className={styles.blockUnderline} />
              </>
            )}
            <div className={styles.bodyText}>
              {content.standApartParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>

            {content.gainsH2 && (
              <>
                <h2
                  className={styles.blockTitle}
                  style={{ marginTop: "2rem" }}
                  dangerouslySetInnerHTML={{ __html: content.gainsH2 }}
                />
                <div className={styles.blockUnderline} />
              </>
            )}
            <div className={styles.bodyText}>
              {content.gainsParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>

            {content.shivaImage && (
              <div className={styles.shivaImgWrap}>
                <img
                  src={imgSrc(content.shivaImage)}
                  alt="Yoga practice"
                  className={styles.shivaImg}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ SEAT BOOKING ══ */}
      <section className={styles.section} id="dates">
        <div className="container px-3 px-md-4">
          <OmDiv />
          {content.seatSectionH2 && (
            <h2
              className={styles.sectionTitleCentered}
              dangerouslySetInnerHTML={{ __html: content.seatSectionH2 }}
            />
          )}
          <div className={styles.sectionUnderlineCentered} />

          <SeatBookingSection />

          {(content.tableNoteText || content.tableNoteAirportText) && (
            <div className={styles.tableNote}>
              {content.tableNoteText && <Para html={content.tableNoteText} />}
              {content.tableNoteAirportText && (
                <Para html={content.tableNoteAirportText} />
              )}
            </div>
          )}

          {content.accomImages?.length > 0 && (
            <>
              <h3 className={styles.subHeadingCentered}>Accommodation</h3>
              <div className={styles.sectionUnderlineCentered} />
              <Carousel images={content.accomImages} alt="Accommodation" />
            </>
          )}
        </div>
      </section>

      {/* ══ FOOD + INDIAN FEE + CREDIBILITY + DURATION ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {content.foodImages?.length > 0 && (
            <>
              <h3 className={styles.subHeadingCentered}>Food</h3>
              <div className={styles.sectionUnderlineCentered} />
              <Carousel images={content.foodImages} alt="Food" />
            </>
          )}

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
              <div className="row g-3 justify-content-center mt-2">
                {content.indianFees.map((fee, i) => (
                  <div key={i} className="col-6 col-sm-6 col-lg-3">
                    <div className={styles.feeChip}>{fee}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.block} style={{ marginTop: "2.5rem" }}>
            {content.credibilityH2 && (
              <>
                <h2
                  className={styles.blockTitleCentered}
                  dangerouslySetInnerHTML={{ __html: content.credibilityH2 }}
                />
                <div className={styles.blockUnderlineCentered} />
              </>
            )}
            <div className={styles.bodyText}>
              {content.credibilityParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>

            {content.durationH2 && (
              <>
                <h2
                  className={styles.blockTitleCentered}
                  style={{ marginTop: "1.8rem" }}
                  dangerouslySetInnerHTML={{ __html: content.durationH2 }}
                />
                <div className={styles.blockUnderlineCentered} />
              </>
            )}
            <div className={styles.bodyText}>
              {content.durationParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SYLLABUS + ELIGIBILITY + EVALUATION ══ */}
      <section className={styles.section}>
        <div className="container px-3 px-md-4">
          <div className={styles.block}>
            {content.syllabusH2 && (
              <>
                <h2
                  className={styles.blockTitleCentered}
                  dangerouslySetInnerHTML={{ __html: content.syllabusH2 }}
                />
                <div className={styles.blockUnderlineCentered} />
              </>
            )}
            <div className={styles.bodyText}>
              {content.syllabusParas?.map((para, i) => (
                <Para key={i} html={para} />
              ))}
            </div>

            {content.syllabusModules?.length > 0 && (
              <div className={styles.syllabusGrid}>
                {content.syllabusModules.map((s, i) => (
                  <div key={i} className={styles.syllabusItem}>
                    <span className={styles.syllabusLabel}>{s.label}</span>{" "}
                    <span dangerouslySetInnerHTML={{ __html: s.text }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="row g-4 mt-2 align-items-start">
            <div className="col-12 col-md-6">
              {content.eligibilityH3 && (
                <div className={styles.blockSmall}>
                  <h3
                    className={styles.blockSmallTitle}
                    dangerouslySetInnerHTML={{ __html: content.eligibilityH3 }}
                  />
                  <div className={styles.blockSmallLine} />
                  <div className={styles.bodyPara}>
                    {content.eligibilityParas?.map((para, i) => (
                      <Para key={i} html={para} />
                    ))}
                  </div>
                </div>
              )}

              {content.evaluationH3 && (
                <div
                  className={styles.blockSmall}
                  style={{ marginTop: "1.5rem" }}
                >
                  <h3
                    className={styles.blockSmallTitle}
                    dangerouslySetInnerHTML={{ __html: content.evaluationH3 }}
                  />
                  <div className={styles.blockSmallLine} />
                  <div className={styles.bodyPara}>
                    {content.evaluationParas?.map((para, i) => (
                      <Para key={i} html={para} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {content.evalImage && (
              <div className="col-12 col-md-6">
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

      {/* ══ INCLUDED / NOT INCLUDED + FACT FROM FICTION ══ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          <div className="row g-4">
            {/* Included */}
            {content.includedItems?.length > 0 && (
              <div className="col-12 col-md-6">
                {content.includedTitle && (
                  <>
                    <h3
                      className={styles.inclTitle}
                      dangerouslySetInnerHTML={{
                        __html: content.includedTitle,
                      }}
                    />
                    <div className={styles.inclLine} />
                  </>
                )}
                <ol className={styles.inclList}>
                  {content.includedItems.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
                {content.includedNote && (
                  <Para
                    html={content.includedNote}
                    className={styles.inclNote}
                  />
                )}
              </div>
            )}

            {/* Not Included */}
            {content.notIncludedItems?.length > 0 && (
              <div className="col-12 col-md-6">
                {content.notIncludedTitle && (
                  <>
                    <h3
                      className={styles.inclTitle}
                      dangerouslySetInnerHTML={{
                        __html: content.notIncludedTitle,
                      }}
                    />
                    <div className={styles.inclLine} />
                  </>
                )}
                <ol className={styles.inclList}>
                  {content.notIncludedItems.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Fiction Block */}
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

      {/* ══ STUDENT REVIEWS + REFUND + HOW TO APPLY ══ */}
      <section className={styles.section}>
        <div className="container px-3 px-md-4">
          {content.reviewsSectionH2 && (
            <>
              <h2
                className={styles.sectionTitleCentered}
                dangerouslySetInnerHTML={{ __html: content.reviewsSectionH2 }}
              />
              <div className={styles.sectionUnderlineCentered} />
            </>
          )}

          {content.reviews?.length > 0 && (
            <div className="row g-4 mt-1">
              {content.reviews.map((r, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      {r.initial ? (
                        <div className={styles.reviewInitial}>{r.initial}</div>
                      ) : (
                        <div className={styles.reviewInitial}>
                          {r.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex-grow-1 overflow-hidden">
                        <div
                          className={styles.reviewName}
                          dangerouslySetInnerHTML={{ __html: r.name }}
                        />
                        <div
                          className={styles.reviewPlatform}
                          dangerouslySetInnerHTML={{ __html: r.platform }}
                        />
                      </div>
                      <span className={styles.googleG}>G</span>
                    </div>
                    <Stars n={r.rating || 5} />
                    <div
                      className={styles.reviewText}
                      dangerouslySetInnerHTML={{ __html: r.text }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <a href="#" className={styles.btnPrimary}>
              Read More Reviews
            </a>
          </div>

          <div className="row g-4 mt-4">
            {content.refundH3 && (
              <div className="col-12 col-md-6">
                <div className={styles.infoBlock}>
                  <h3
                    className={styles.infoBlockTitle}
                    dangerouslySetInnerHTML={{ __html: content.refundH3 }}
                  />
                  <div className={styles.infoBlockLine} />
                  <Para html={content.refundPara} className={styles.bodyPara} />
                </div>
              </div>
            )}
            {content.applyH3 && (
              <div className="col-12 col-md-6">
                <div className={styles.infoBlock}>
                  <h3
                    className={styles.infoBlockTitle}
                    dangerouslySetInnerHTML={{ __html: content.applyH3 }}
                  />
                  <div className={styles.infoBlockLine} />
                  <Para html={content.applyPara} className={styles.bodyPara} />
                </div>
              </div>
            )}
          </div>

          <OmDiv />
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
