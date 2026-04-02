"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/300-hours-yoga-teacher-training-rishikesh/Yogattc300.module.css";
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

interface OverviewField {
  _id: string;
  label: string;
  value: string;
  multiline: boolean;
}

interface Module {
  num: number;
  label: string;
  title: string;
  content: string;
  subTitle: string;
  listItems: string[];
  twoCol: boolean;
  _id: string;
}

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
}

interface ScheduleItem {
  _id: string;
  time: string;
  activity: string;
}

interface Review {
  _id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
}

interface YouTubeVideo {
  _id: string;
  id: string;
  title: string;
  type: "url" | "file";
  videoId: string;
  videoFile: string;
}

interface Content1 {
  _id: string;
  pageMainH1: string;
  heroImage: string;
  heroImgAlt: string;
  introParagraphs: string[];
  topSectionH2: string;
  topParagraphs: string[];
  overviewH2: string;
  overviewFields: OverviewField[];
  upcomingDatesH3: string;
  upcomingDatesSubtext: string;
  feeIncludedTitle: string;
  includedFee: string[];
  feeNotIncludedTitle: string;
  notIncludedFee: string[];
  syllabusH2: string;
  syllabusIntro: string;
  modules: Module[];
}

interface Content2 {
  evolutionH2: string;
  evolutionParas: string[];
  markDistH3: string;
  markDistSubText: string;
  markTotalLabel: string;
  markTotalText: string;
  markTheoryLabel: string;
  markTheoryText: string;
  markPracticalLabel: string;
  markPracticalText: string;
  markPracticalDetail: string;
  careerH3: string;
  careerItems: string[];
  feeCard1Title: string;
  feeCard1Items: string[];
  feeCard2Title: string;
  feeCard2Items: string[];
  faqH2: string;
  faqItems: FaqItem[];
  accomH3: string;
  accomImages: string[];
  foodH3: string;
  foodImages: string[];
  luxuryH2: string;
  luxuryFeatures: string[];
  luxuryImages: string[];
  yogaGardenImage: string;
  featuresH2: string;
  featuresList: string[];
  scheduleH3: string;
  scheduleItems: ScheduleItem[];
  scheduleImages: string[];
  learningH2: string;
  learningItems: string[];
  eligibilityH2: string;
  eligibilityTag: string;
  eligibilityParas: string[];
  evaluationH2: string;
  evaluationParas: string[];
  ethicsH2: string;
  ethicsParas: string[];
  ethicsQuote: string;
  ethicsNaturalisticPara: string;
  ethicsRules: string[];
  diplomaImage: string;
  misconH2: string;
  misconParas: string[];
  misconItems: string[];
  reviewsH2: string;
  reviewsSubtext: string;
  reviews: Review[];
  youtubeVideos: YouTubeVideo[];
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

/** Image URL helper — if it starts with /uploads/ prefix with API base */
function imgUrl(path: string): string {
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

/* ─────────────────────────────────────────
   YOUTUBE EMBED
───────────────────────────────────────── */
const YouTubeEmbed = ({ video }: { video: YouTubeVideo }) => {
  const [playing, setPlaying] = useState(false);

  // FILE type — render HTML5 video
  if (video.type === "file" && video.videoFile) {
    return (
      <div className={styles.videoWrapper}>
        <video
          className={styles.videoIframe}
          controls
          src={imgUrl(video.videoFile)}
          title={video.title}
        />
      </div>
    );
  }

  // URL type — YouTube embed
  if (!video.videoId) return null;

  return (
    <div className={styles.videoWrapper}>
      {playing ? (
        <iframe
          className={styles.videoIframe}
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className={styles.videoThumb}
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${video.title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title}
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
   IMAGE CAROUSEL
───────────────────────────────────────── */
const Carousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);
  const count = Math.min(4, images.length);
  const visible = Array.from(
    { length: count },
    (_, offset) => images[(idx + offset) % images.length],
  );

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.carouselBtn} ${styles.carouselBtnLeft}`}
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>
      <div className={styles.carouselTrack}>
        {visible.map((src, i) => (
          <div key={i} className={styles.carouselSlide}>
            <img
              src={imgUrl(src)}
              alt={`${alt} ${i + 1}`}
              className={styles.carouselImg}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <button
        className={`${styles.carouselBtn} ${styles.carouselBtnRight}`}
        onClick={next}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────── */
const FaqItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ""}`}>
      <button className={styles.faqQ} onClick={() => setOpen(!open)}>
        <span className={styles.faqIcon}>›</span>
        {question}
      </button>
      {open && (
        <div className={styles.faqA}>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

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
   STAR RATING
───────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.reviewStars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? "#e07b00" : "#ddd" }}>
          ★
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────── */
function PageSkeleton() {
  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#999" }}>
      <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Loading...</div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SAFE HTML RENDERER
───────────────────────────────────────── */
function SafeHtml({ html }: { html: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function YogaTTC300() {
  const [activeModule, setActiveModule] = useState(0);

  const [content1, setContent1] = useState<Content1 | null>(null);
  const [content2, setContent2] = useState<Content2 | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);

  /* ── Fetch Content 1 ── */
  useEffect(() => {
    const fetchContent1 = async () => {
      try {
        const { data } = await api.get("/yoga-300hr/content1");
        const record = Array.isArray(data?.data) ? data.data[0] : data?.data;
        setContent1(record || null);
      } catch (err) {
        console.error("300hr content1 fetch error:", err);
      } finally {
        setLoading1(false);
      }
    };
    fetchContent1();
  }, []);

  /* ── Fetch Content 2 ── */
  useEffect(() => {
    const fetchContent2 = async () => {
      try {
        const { data } = await api.get("/yoga-300hr/content2");
        setContent2(data?.data || null);
      } catch (err) {
        console.error("300hr content2 fetch error:", err);
      } finally {
        setLoading2(false);
      }
    };
    fetchContent2();
  }, []);

  /* ── Fetch Batches ── */
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get("/300hr-seats/all");
        setBatches(data?.data || []);
      } catch (err) {
        console.error("300hr batch fetch error:", err);
      } finally {
        setBatchesLoading(false);
      }
    };
    fetchBatches();
  }, []);

  // While critical content is loading
  if (loading1 || loading2) return <PageSkeleton />;

  const modules = content1?.modules || [];
  const mod = modules[activeModule];

  return (
    <div className={styles.page}>
      {/* Mandala decorations */}
      <div className={styles.mandalaTopLeft} aria-hidden="true" />
      <div className={styles.mandalaBottomRight} aria-hidden="true" />

      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      {content1?.heroImage && (
        <section className={styles.heroSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl(content1.heroImage)}
            alt={content1.heroImgAlt || "Hero"}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}

      <section className={styles.heroSection2}>
        <div className="container">
          <div className={styles.topBorderLine} />

          {/* H1 */}
          {content1?.pageMainH1 && (
            <h1 className={styles.heroTitle}>{content1.pageMainH1}</h1>
          )}

          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omGlyph}>ॐ</span>
            <span className={styles.divLine} />
          </div>

          {/* Intro Paragraphs */}
          {content1?.introParagraphs && content1.introParagraphs.length > 0 && (
            <div className={styles.bodyText}>
              {content1.introParagraphs.map((para, i) => (
                <SafeHtml key={i} html={para} />
              ))}
            </div>
          )}

          {/* Top Section H2 */}
          {content1?.topSectionH2 && (
            <h2 className={styles.sectionTitleOrange}>
              {content1.topSectionH2}
            </h2>
          )}
          <div className={styles.sectionUnderline} />

          {/* Top Paragraphs */}
          {content1?.topParagraphs && content1.topParagraphs.length > 0 && (
            <div className={styles.bodyText}>
              {content1.topParagraphs.map((para, i) => (
                <SafeHtml key={i} html={para} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — OVERVIEW + COURSE DATES
      ══════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container">
          {content1?.overviewH2 && (
            <h2 className={styles.sectionTitleOrange}>{content1.overviewH2}</h2>
          )}
          <div className={styles.sectionUnderline} />

          {/* Overview Fields */}
          {content1?.overviewFields && content1.overviewFields.length > 0 && (
            <div className={styles.overviewList}>
              {content1.overviewFields.map((field) => (
                <p key={field._id}>
                  <strong>{field.label}:</strong> {field.value}
                </p>
              ))}
            </div>
          )}

          {/* ── DATES TABLE ── */}
          <div className={styles.datesBox}>
            {content1?.upcomingDatesH3 && (
              <h3 className={styles.datesTitle}>{content1.upcomingDatesH3}</h3>
            )}
            {content1?.upcomingDatesSubtext && (
              <p className={styles.datesSubtitle}>
                {content1.upcomingDatesSubtext}
              </p>
            )}

            <div className={styles.tableScroll}>
              <table className={styles.datesTable}>
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
                  {batchesLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "var(--muted)",
                          fontStyle: "italic",
                        }}
                      >
                        Loading batches...
                      </td>
                    </tr>
                  ) : batches.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "2rem",
                          color: "var(--muted)",
                        }}
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
                          <td>{batch.usdFee}</td>
                          <td>{batch.inrFee}</td>
                          <td className={styles.roomPriceCell}>
                            Dorm{" "}
                            <strong className={styles.priceVal}>
                              ${batch.dormPrice}
                            </strong>
                            <span className={styles.priceSep}> | </span>
                            Twin{" "}
                            <strong className={styles.priceVal}>
                              ${batch.twinPrice}
                            </strong>
                            <span className={styles.priceSep}> | </span>
                            Private{" "}
                            <strong className={styles.priceVal}>
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
                                href={`/yoga-registration?batchId=${batch._id}&type=300hr`}
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
              <p className={styles.datesNote}>
                <strong>Note:</strong> {batches[0].note}
              </p>
            )}

            <div
              className="text-center mt-3"
              style={{ padding: "1rem 0 0.5rem" }}
            >
              <a href="#" className={styles.btnPrimary}>
                Reserve Your Spot Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 3 — INCLUDED / NOT INCLUDED
      ══════════════════════════════════════ */}
      {(content1?.includedFee?.length || content1?.notIncludedFee?.length) && (
        <section className={styles.section}>
          <div className="container">
            <div className="row g-4">
              {/* Included */}
              {content1?.includedFee && content1.includedFee.length > 0 && (
                <div className="col-md-6">
                  {content1?.feeIncludedTitle && (
                    <h3 className={styles.includedTitle}>
                      {content1.feeIncludedTitle}
                    </h3>
                  )}
                  <div className={styles.sectionUnderlineLeft} />
                  <ol className={styles.inclList}>
                    {content1.includedFee.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Not Included */}
              {content1?.notIncludedFee &&
                content1.notIncludedFee.length > 0 && (
                  <div className="col-md-6">
                    {content1?.feeNotIncludedTitle && (
                      <h3 className={styles.notIncludedTitle}>
                        {content1.feeNotIncludedTitle}
                      </h3>
                    )}
                    <div className={styles.sectionUnderlineLeft} />
                    <ol className={styles.inclList}>
                      {content1.notIncludedFee.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ol>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 4 — SYLLABUS TABS
      ══════════════════════════════════════ */}
      {modules.length > 0 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className="container">
            {content1?.syllabusH2 && (
              <h2 className={styles.sectionTitleOrange}>
                {content1.syllabusH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content1?.syllabusIntro && (
              <div className={styles.bodyPara}>
                <SafeHtml html={content1.syllabusIntro} />
              </div>
            )}

            {/* Module Tabs */}
            <div className={styles.moduleTabs}>
              {modules.map((m, i) => (
                <button
                  key={m._id}
                  className={`${styles.moduleTab} ${activeModule === i ? styles.moduleTabActive : ""}`}
                  onClick={() => setActiveModule(i)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Active Module Content */}
            {mod && (
              <div className={styles.moduleContent}>
                <h4 className={styles.moduleContentTitle}>{mod.title}</h4>
                <div className={styles.moduleContentText}>
                  <SafeHtml html={mod.content} />
                </div>
                {mod.subTitle && (
                  <p className={styles.moduleSubTitle}>
                    <strong>{mod.subTitle}</strong>
                  </p>
                )}
                {mod.listItems &&
                  mod.listItems.filter(Boolean).length > 0 &&
                  (mod.twoCol ? (
                    <div className="row">
                      <div className="col-md-6">
                        {mod.listItems
                          .filter(Boolean)
                          .slice(
                            0,
                            Math.ceil(mod.listItems.filter(Boolean).length / 2),
                          )
                          .map((item, i) => (
                            <p key={i} className={styles.moduleListItem}>
                              {i + 1}. {item}
                            </p>
                          ))}
                      </div>
                      <div className="col-md-6">
                        {mod.listItems
                          .filter(Boolean)
                          .slice(
                            Math.ceil(mod.listItems.filter(Boolean).length / 2),
                          )
                          .map((item, i) => (
                            <p key={i} className={styles.moduleListItem}>
                              {Math.ceil(
                                mod.listItems.filter(Boolean).length / 2,
                              ) +
                                i +
                                1}
                              . {item}
                            </p>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {mod.listItems.filter(Boolean).map((item, i) => (
                        <p key={i} className={styles.moduleListItem}>
                          {i + 1}. {item}
                        </p>
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 5 — EVOLUTION & CERTIFICATION
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={styles.section}>
          <div className="container">
            {content2.evolutionH2 && (
              <h2 className={styles.sectionTitleOrange}>
                {content2.evolutionH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.evolutionParas?.map((para, i) => (
              <div key={i} className={styles.bodyPara}>
                <SafeHtml html={para} />
              </div>
            ))}

            {/* Mark Distribution */}
            {content2.markDistH3 && (
              <h3 className={styles.subHeading}>{content2.markDistH3}</h3>
            )}
            {content2.markDistSubText && (
              <p className={styles.bodyPara}>{content2.markDistSubText}</p>
            )}

            <div className={styles.bodyText}>
              {content2.markTotalLabel && content2.markTotalText && (
                <p>
                  <strong>{content2.markTotalLabel}:</strong>{" "}
                  {content2.markTotalText}
                </p>
              )}
              {content2.markTheoryLabel && content2.markTheoryText && (
                <p>
                  <strong>{content2.markTheoryLabel}:</strong>{" "}
                  {content2.markTheoryText}
                </p>
              )}
              {content2.markPracticalLabel && content2.markPracticalText && (
                <p>
                  <strong>{content2.markPracticalLabel}:</strong>{" "}
                  {content2.markPracticalText}
                </p>
              )}
            </div>

            {content2.markPracticalDetail && (
              <div className={styles.bodyPara}>
                <SafeHtml html={content2.markPracticalDetail} />
              </div>
            )}

            {/* Career */}
            {content2.careerH3 && (
              <h3 className={styles.subHeading} style={{ marginTop: "2rem" }}>
                {content2.careerH3}
              </h3>
            )}
            {content2.careerItems && content2.careerItems.length > 0 && (
              <div className="row g-3 mt-1">
                {content2.careerItems.map((career, i) => (
                  <div key={i} className="col-md-4 col-sm-6">
                    <div className={styles.careerChip}>{career}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Cards */}
            <div className="row g-4 mt-3">
              {content2.feeCard1Title && (
                <div className="col-md-6">
                  <div className={styles.feeCardLight}>
                    <h4 className={styles.feeCardTitle}>
                      {content2.feeCard1Title}
                    </h4>
                    {content2.feeCard1Items?.map((item, i) => (
                      <p key={i}>{item}</p>
                    ))}
                    <a href="#" className={styles.btnOutlineWhite}>
                      Read More
                    </a>
                  </div>
                </div>
              )}
              {content2.feeCard2Title && (
                <div className="col-md-6">
                  <div className={styles.feeCardDark}>
                    <h4 className={styles.feeCardTitle}>
                      {content2.feeCard2Title}
                    </h4>
                    {content2.feeCard2Items?.map((item, i) => (
                      <p key={i}>{item}</p>
                    ))}
                    <a href="#" className={styles.btnOutlineWhite}>
                      Read More
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 6 — FAQ + ACCOMMODATION + FOOD
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className="container">
            {content2.faqH2 && (
              <h2 className={styles.sectionTitleOrange}>{content2.faqH2}</h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.faqItems && content2.faqItems.length > 0 && (
              <div className={styles.faqWrap}>
                {content2.faqItems.map((faq) => (
                  <FaqItem
                    key={faq._id}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            )}

            {/* Accommodation */}
            {content2.accomH3 && (
              <h3 className={styles.subHeadingCentered}>{content2.accomH3}</h3>
            )}
            <div className={styles.sectionUnderlineCentered} />
            {content2.accomImages && content2.accomImages.length > 0 && (
              <Carousel images={content2.accomImages} alt="Accommodation" />
            )}

            {/* Food */}
            {content2.foodH3 && (
              <h3
                className={styles.subHeadingCentered}
                style={{ marginTop: "3rem" }}
              >
                {content2.foodH3}
              </h3>
            )}
            <div className={styles.sectionUnderlineCentered} />
            {content2.foodImages && content2.foodImages.length > 0 && (
              <Carousel images={content2.foodImages} alt="Food" />
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 7 — LUXURY ROOM & FEATURES
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={styles.section}>
          <div className="container">
            {content2.luxuryH2 && (
              <h2 className={styles.sectionTitleCentered}>
                {content2.luxuryH2}
              </h2>
            )}
            <div className={styles.sectionUnderlineCentered} />

            <div className="row align-items-start g-4">
              {/* Luxury Features */}
              {content2.luxuryFeatures &&
                content2.luxuryFeatures.length > 0 && (
                  <div className="col-md-6">
                    <ul className={styles.luxuryList}>
                      {content2.luxuryFeatures.map((f, i) => (
                        <li key={i}>
                          <span className={styles.luxuryBullet}>●</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Luxury Images */}
              {content2.luxuryImages && content2.luxuryImages.length > 0 && (
                <div className="col-md-6">
                  <div className="row g-2">
                    {content2.luxuryImages.map((src, i) => (
                      <div key={i} className={i === 2 ? "col-12" : "col-6"}>
                        <img
                          src={imgUrl(src)}
                          alt={`Luxury room ${i + 1}`}
                          className={styles.luxuryImg}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Yoga Garden Image */}
            {content2.yogaGardenImage && (
              <div className="mt-4">
                <img
                  src={imgUrl(content2.yogaGardenImage)}
                  alt="Yoga in garden"
                  className={styles.fullWidthImg}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 8 — FEATURES + DAILY SCHEDULE
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className="container">
            {content2.featuresH2 && (
              <h2 className={styles.sectionTitleOrange}>
                {content2.featuresH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.featuresList && content2.featuresList.length > 0 && (
              <ol className={styles.featuresList}>
                {content2.featuresList.map((f, i) => (
                  <li key={i}>
                    <strong>{i + 1}:</strong> {f}
                  </li>
                ))}
              </ol>
            )}

            <div className="row g-4 mt-3">
              {/* Schedule */}
              <div className="col-lg-6">
                {content2.scheduleH3 && (
                  <h3 className={styles.subHeadingOrange}>
                    {content2.scheduleH3}
                  </h3>
                )}
                {content2.scheduleItems &&
                  content2.scheduleItems.length > 0 && (
                    <div className={styles.scheduleTable}>
                      {content2.scheduleItems.map((row) => (
                        <div key={row._id} className={styles.scheduleRow}>
                          <span className={styles.scheduleTime}>
                            {row.time}
                          </span>
                          <span className={styles.scheduleActivity}>
                            {row.activity}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Schedule Images */}
              {content2.scheduleImages &&
                content2.scheduleImages.length > 0 && (
                  <div className="col-lg-6">
                    <div className="row g-2 h-100">
                      {content2.scheduleImages.map((src, i) => (
                        <div key={i} className={i === 0 ? "col-12" : "col-6"}>
                          <img
                            src={imgUrl(src)}
                            alt={`Schedule ${i + 1}`}
                            className={styles.scheduleImg}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 9 — LEARNING OUTCOMES + ELIGIBILITY + EVALUATION
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={styles.section}>
          <div className="container">
            {/* Learning Outcomes */}
            {content2.learningH2 && (
              <h2 className={styles.sectionTitleOrange}>
                {content2.learningH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.learningItems && content2.learningItems.length > 0 && (
              <ol className={styles.outcomesList}>
                {content2.learningItems.map((item, i) => (
                  <li key={i}>
                    <strong>{i + 1}:</strong> {item}
                  </li>
                ))}
              </ol>
            )}

            {/* Eligibility */}
            {content2.eligibilityH2 && (
              <h2
                className={styles.sectionTitleOrange}
                style={{ marginTop: "2.5rem" }}
              >
                {content2.eligibilityH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.eligibilityTag && (
              <h3 className={styles.sectionTitleOrangeSmall}>
                {content2.eligibilityTag}
              </h3>
            )}

            {content2.eligibilityParas?.map((para, i) => (
              <div key={i} className={styles.bodyPara}>
                <SafeHtml html={para} />
              </div>
            ))}

            {/* Evaluation */}
            {content2.evaluationH2 && (
              <h2
                className={styles.sectionTitleOrange}
                style={{ marginTop: "2.5rem" }}
              >
                {content2.evaluationH2}
              </h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.evaluationParas?.map((para, i) => (
              <div key={i} className={styles.bodyPara}>
                <SafeHtml html={para} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 10 — YOGA ETHICS
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={`${styles.section} ${styles.sectionLight}`}>
          <div className="container">
            {content2.ethicsH2 && (
              <h2 className={styles.sectionTitleOrange}>{content2.ethicsH2}</h2>
            )}
            <div className={styles.sectionUnderline} />

            {content2.ethicsParas?.map((para, i) => (
              <div key={i} className={styles.bodyText}>
                <SafeHtml html={para} />
              </div>
            ))}

            {content2.ethicsQuote && (
              <p className={styles.quoteText}>
                &ldquo;{content2.ethicsQuote}&rdquo;
              </p>
            )}

            {content2.ethicsNaturalisticPara && (
              <p className={styles.bodyPara}>
                {content2.ethicsNaturalisticPara}
              </p>
            )}

            {content2.ethicsRules && content2.ethicsRules.length > 0 && (
              <>
                {content2.ethicsRules.map((rule, i) => (
                  <div key={i} className={styles.ethicsRule}>
                    <span className={styles.ethicsNum}>{i + 1}-</span>
                    <p className={styles.ethicsText}>{rule}</p>
                  </div>
                ))}
              </>
            )}

            {content2.diplomaImage && (
              <div className="mt-4">
                <img
                  src={imgUrl(content2.diplomaImage)}
                  alt="Students with Diploma certificates"
                  className={styles.fullWidthImg}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 11 — MISCONCEPTIONS
      ══════════════════════════════════════ */}
      {content2 &&
        (content2.misconH2 || (content2.misconItems?.length ?? 0) > 0) && (
          <section className={styles.section}>
            <div className="container">
              <div className={styles.misconceptionsBox}>
                {content2.misconH2 && (
                  <h2 className={styles.sectionTitleOrange}>
                    {content2.misconH2}
                  </h2>
                )}
                <div className={styles.sectionUnderline} />

                {content2.misconParas?.map((para, i) => (
                  <div key={i} className={styles.bodyPara}>
                    <SafeHtml html={para} />
                  </div>
                ))}

                {content2.misconItems && content2.misconItems.length > 0 && (
                  <ol className={styles.miscList}>
                    {content2.misconItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </section>
        )}

      {/* ══════════════════════════════════════
          SECTION 12 — STUDENT REVIEWS & VIDEOS
      ══════════════════════════════════════ */}
      {content2 && (
        <section className={`${styles.section} ${styles.sectionGray}`}>
          <div className="container">
            {content2.reviewsH2 && (
              <h2 className={styles.sectionTitleDark}>{content2.reviewsH2}</h2>
            )}
            {content2.reviewsSubtext && (
              <p className={styles.sectionSubDark}>{content2.reviewsSubtext}</p>
            )}

            {/* Reviews */}
            {content2.reviews && content2.reviews.length > 0 && (
              <div className="row g-4 mt-2">
                {content2.reviews.map((r) => {
                  const initial = r.name ? r.name.charAt(0).toUpperCase() : "?";
                  return (
                    <div key={r._id} className="col-md-4">
                      <div className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewInitial}>{initial}</div>
                          <div>
                            <p className={styles.reviewName}>{r.name}</p>
                            <p className={styles.reviewRole}>{r.role}</p>
                          </div>
                        </div>
                        <StarRating rating={r.rating || 5} />
                        <p className={styles.reviewText}>
                          <span className={styles.reviewOpenQ}>&ldquo;</span>
                          {r.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* YouTube Videos */}
            {content2.youtubeVideos && content2.youtubeVideos.length > 0 && (
              <div className="row g-4 mt-3">
                {content2.youtubeVideos.map((video) => (
                  <div
                    key={video._id}
                    className={
                      content2.youtubeVideos.length === 1
                        ? "col-12"
                        : "col-md-6"
                    }
                  >
                    <YouTubeEmbed video={video} />
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-4">
              <a href="#" className={styles.btnPrimary}>
                Read More Reviews
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Footer OM */}
      <div className={styles.footerOm}>
        <span className={styles.divLine} />
        <span className={styles.omGlyph}>ॐ</span>
        <span className={styles.divLine} />
      </div>

      <HowToReach />
    </div>
  );
}
