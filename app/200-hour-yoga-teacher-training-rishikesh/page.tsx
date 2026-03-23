"use client";
import React, { useState, useEffect } from "react";
import styles from "@/assets/style/200-hour-yoga-teacher-training-rishikesh/Twohundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import api from "@/lib/api"; // your axios instance

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface StatItem {
  icon: string;
  value: string;
  title: string;
  desc: string;
}

interface ModuleItem {
  title: string;
  intro: string;
  items: string[];
  body?: string;
}

interface Content1 {
  _id: string;
  slug: string;
  status: string;
  pageMainH1: string;
  heroImage: string;
  heroImgAlt: string;
  introPara1: string;
  introPara2: string;
  introPara3: string;
  introPara4: string;
  stats: StatItem[];
  aimsH3: string;
  aimsIntro: string;
  aimsOutro: string;
  aimsKeyObjLabel: string;
  aimsBullets: string[];
  overview: {
    h2: string;
    certName: string;
    level: string;
    eligibility: string;
    minAge: string;
    credits: string;
    language: string;
  };
  upcomingDatesH2: string;
  upcomingDatesSubtext: string;
  feeIncludedTitle: string;
  feeNotIncludedTitle: string;
  includedFee: string[];
  notIncludedFee: string[];
  syllabusH3: string;
  syllabusIntro: string;
  modules: ModuleItem[];
  ashtanga: {
    h2: string;
    subtitle: string;
    desc: string;
    image: string;
    imgAlt: string;
    pills: string[];
  };
  primary: {
    h3: string;
    subtext: string;
    intro: string;
    foundationItems: string[];
    weekGrid: Array<{
      week: string;
      icon: string;
      items: Array<{ t: string; d: string }>;
    }>;
  };
  hatha: {
    h2: string;
    subtitle: string;
    desc: string;
    image: string;
    imgAlt: string;
    pills: string[];
    asanas: Array<{ n: number; name: string; sub: string }>;
  };
}

interface Content2 {
  evalH2: string;
  evalDesc: string;
  accommodationH2: string;
  accomImages: string[];
  foodH2: string;
  foodImages: string[];
  luxuryH2: string;
  luxFeatures: string[];
  luxImages: string[];
  indianFeeH2: string;
  indianFees: Array<{ label: string; price: string }>;
  scheduleH2: string;
  schedDesc: string;
  schedRows: Array<{ time: string; schedule: string }>;
  schedImages: string[];
  moreInfoH2: string;
  instrLangs: Array<{ lang: string }>;
  visaPassportDesc: string;
  programs: Array<{
    title: string;
    desc: string;
    duration: string;
    start: string;
    oldPrice: string;
    price: string;
  }>;
  reviews: Array<{ name: string; role: string; text: string }>;
  requirementsH2: string;
  reqImage: string;
  faqItems: Array<{ q: string; a: string }>;
  knowQA?: Array<{ q: string; a: string }>;
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

/* ══════════════════════════════════════════════════
   HELPER: Format date range from ISO strings
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   HELPER: Build image URL (handle relative paths)
══════════════════════════════════════════════════ */
function imgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

/* ══════════════════════════════════════════════════
   HELPER: Strip HTML tags → plain text
══════════════════════════════════════════════════ */
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

/* ══════════════════════════════════════════════════
   UI COMPONENTS (unchanged from original)
══════════════════════════════════════════════════ */

function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg
        viewBox="0 0 800 14"
        preserveAspectRatio="none"
        className={styles.borderSvg}
      >
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon
                points={`${x},7 ${x + 6},2 ${x + 12},7 ${x + 6},12`}
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

function VintageHeading({
  children,
  center = true,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={styles.vintageHeadingWrap}
      style={{ textAlign: center ? "center" : "left" }}
    >
      <h2 className={styles.vintageHeading}>{children}</h2>
      <div className={styles.omDivider}>
        <span className={styles.dividerLine} />
        <span className={styles.omSymbol}>ॐ</span>
        <span className={styles.dividerLine} />
      </div>
    </div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  return <span className={styles.stars}>{"★".repeat(n)}</span>;
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

function ModuleCard({
  title,
  intro,
  items,
}: {
  title: string;
  intro: string;
  items: string[];
}) {
  return (
    <div className={styles.moduleCard}>
      <h3 className={styles.moduleCardTitle}>{stripHtml(title)}</h3>
      <div className={styles.moduleCardUl} />
      <p className={styles.moduleCardIntro}>{stripHtml(intro)}</p>
      <ol className={styles.moduleOl}>
        {items.map((it, i) => (
          <li key={i}>{stripHtml(it)}</li>
        ))}
      </ol>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SKELETON / LOADER
══════════════════════════════════════════════════ */
function PageSkeleton() {
  return (
    <div className={styles.root} style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕉️</div>
      <p style={{ color: "#b8860b", fontSize: "1.2rem" }}>
        Loading yoga journey...
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════
   MAIN PAGE COMPONENT
════════════════════════════════════════════════ */
export default function TwoHundredHourYoga() {
  const [content1, setContent1] = useState<Content1 | null>(null);
  const [content2, setContent2] = useState<Content2 | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [asanaFilter, setAsanaFilter] = useState("All Poses");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Fetch all data in parallel ── */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [c1Res, c2Res, batchRes] = await Promise.all([
          api.get("/yoga-200hr/content1"),
          api.get("/yoga-200hr/content2/get"),
          api.get("/200hr-seats/getAllBatches"),
        ]);

        // content1 returns array — pick the active one (or first)
        const c1List: Content1[] = c1Res.data?.data || [];
        const activeC1 =
          c1List.find((c) => c.status === "Active") || c1List[0] || null;
        setContent1(activeC1);

        setContent2(c2Res.data?.data || null);
        setBatches(batchRes.data?.data || []);
      } catch (err: unknown) {
        console.error("API error:", err);
        setError("Failed to load page content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <PageSkeleton />;
  if (error)
    return (
      <div className={styles.root} style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  /* ── Derived data ── */
  const asanaFilters = ["All Poses", "Standing", "Sitting", "Lying", "Balancing"];

  const asanas =
    content1?.hatha?.asanas?.length
      ? content1.hatha.asanas
      : [];

  const modules = content1?.modules || [];

  return (
    <div className={styles.root}>
      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        {content1?.heroImage ? (
          <Image
            src={imgUrl(content1.heroImage)}
            alt={content1.heroImgAlt || "Yoga Students Group"}
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        ) : null}
      </section>

      {/* ── HERO TEXT + STATS ── */}
      <section className={styles.heroSection2}>
        <div className={styles.heroTextWrap}>
          <VintageHeading>
            {content1?.pageMainH1 || "200 Hour Yoga Teacher Training in Rishikesh"}
          </VintageHeading>

          {[
            content1?.introPara1,
            content1?.introPara2,
            content1?.introPara3,
            content1?.introPara4,
          ]
            .filter(Boolean)
            .map((para, i) => (
              <p key={i} className={styles.bodyText}>
                {stripHtml(para!)}
              </p>
            ))}
        </div>

        {/* Stats */}
        {content1?.stats?.length ? (
          <div className={styles.statsRow}>
            {content1.stats.map((s, i) => (
              <div key={i} className={styles.statCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statTitle}>{s.title}</span>
                <span className={styles.statDesc}>{s.desc}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <BorderStrip />

      {/* ── AIMS + OVERVIEW + DATES ── */}
      <section className={styles.contentSection}>
        {/* Aims */}
        {content1?.aimsH3 && (
          <>
            <h3 className={styles.h3Left}>{content1.aimsH3}</h3>
            <div className={styles.underlineBar} />
          </>
        )}
        {content1?.aimsIntro && (
          <p className={styles.bodyText}>{stripHtml(content1.aimsIntro)}</p>
        )}
        {content1?.aimsKeyObjLabel && (
          <p className={styles.bodyText}>
            <strong>{stripHtml(content1.aimsKeyObjLabel)}</strong>
          </p>
        )}
        {content1?.aimsBullets?.length ? (
          <ul className={styles.bulletList}>
            {content1.aimsBullets.map((b, i) => (
              <li key={i}>{stripHtml(b)}</li>
            ))}
          </ul>
        ) : null}
        {content1?.aimsOutro && (
          <p className={styles.bodyText}>{stripHtml(content1.aimsOutro)}</p>
        )}

        {/* Overview */}
        {content1?.overview && (
          <>
            <VintageHeading>
              {content1.overview.h2 || "Overview of 200 Hour Yoga Instructor Course"}
            </VintageHeading>
            <div className={styles.overviewBox}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              {content1.overview.certName && (
                <p className={styles.bodyText}>
                  <strong>Name of the certification:</strong> {stripHtml(content1.overview.certName)}
                </p>
              )}
              {content1.overview.level && (
                <p className={styles.bodyText}>
                  <strong>Course level:</strong> {stripHtml(content1.overview.level)}
                </p>
              )}
              {content1.overview.eligibility && (
                <p className={styles.bodyText}>
                  <strong>Requirement/Eligibility:</strong> {stripHtml(content1.overview.eligibility)}
                </p>
              )}
              {content1.overview.minAge && (
                <p className={styles.bodyText}>
                  <strong>Minimum age:</strong> {stripHtml(content1.overview.minAge)}
                </p>
              )}
              {content1.overview.credits && (
                <p className={styles.bodyText}>
                  <strong>Credit points for certificate:</strong> {stripHtml(content1.overview.credits)}
                </p>
              )}
              {content1.overview.language && (
                <p className={styles.bodyText}>
                  <strong>Language:</strong> {stripHtml(content1.overview.language)}
                </p>
              )}
            </div>
          </>
        )}

        {/* Upcoming Dates — from batches API */}
        <VintageHeading>
          {content1?.upcomingDatesH2 || "Upcoming Course Dates"}
        </VintageHeading>
        {content1?.upcomingDatesSubtext && (
          <p className={styles.centerSubtext}>{content1.upcomingDatesSubtext}</p>
        )}

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
                {batches.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
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
                            <span className={styles.applyDisabled}>Apply Now</span>
                          ) : (
                            <a href="#" className={styles.applyLink}>
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
              <strong>Note:</strong> {batches[0].note}
            </p>
          )}
          <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
            <a href="#" className={styles.joinBtn}>
              Join Your Yoga Journey
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ── FEE INCLUDED / NOT INCLUDED + SYLLABUS ── */}
      <section className={styles.contentSection2}>
        <div className={styles.feeInclGrid}>
          <div className={styles.feeInclCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.feeInclTitle}>
              {content1?.feeIncludedTitle || "Included in 200 Hour yoga ttc course"}
            </h3>
            <div className={styles.feeInclUl} />
            <ol className={styles.feeOl}>
              {(content1?.includedFee || []).map((it, i) => (
                <li key={i}>{stripHtml(it)}</li>
              ))}
            </ol>
          </div>
          <div className={styles.feeInclCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.feeInclTitle}>
              {content1?.feeNotIncludedTitle || "Not Included in 200 hour yoga ttc course"}
            </h3>
            <div className={styles.feeInclUl} />
            <ol className={styles.feeOl}>
              {(content1?.notIncludedFee || []).map((it, i) => (
                <li key={i}>{stripHtml(it)}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.bodyContaint}>
          {content1?.syllabusH3 && (
            <>
              <h3 className={styles.h3Left}>{content1.syllabusH3}</h3>
              <div className={styles.underlineBar} />
            </>
          )}
          {content1?.syllabusIntro && (
            <p className={styles.bodyText}>{stripHtml(content1.syllabusIntro)}</p>
          )}
        </div>

        {/* Modules 1–4 */}
        <div className={styles.moduleGrid}>
          {modules.slice(0, 4).map((mod, i) => (
            <ModuleCard
              key={i}
              title={mod.title}
              intro={mod.intro}
              items={mod.items}
            />
          ))}
        </div>
      </section>

      <BorderStrip />

      {/* ── MODULES 5–8 + ASHTANGA ── */}
      <section className={styles.contentSection}>
        <div className={styles.moduleGrid}>
          {modules.slice(4, 8).map((mod, i) => (
            <ModuleCard
              key={i}
              title={mod.title}
              intro={mod.intro}
              items={mod.items}
            />
          ))}
        </div>

        {/* Ashtanga */}
        {content1?.ashtanga && (
          <>
            <VintageHeading>
              {content1.ashtanga.h2 || "Module 8.1: Ashtanga Vinyasa Yoga"}
            </VintageHeading>
            {content1.ashtanga.subtitle && (
              <p className={styles.centerSubtext}>{content1.ashtanga.subtitle}</p>
            )}
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                {content1.ashtanga.image ? (
                  <img
                    src={imgUrl(content1.ashtanga.image)}
                    alt={content1.ashtanga.imgAlt || "Ashtanga Vinyasa Yoga"}
                    className={styles.modImg}
                  />
                ) : null}
              </div>
              <div className={styles.moduleDetailText}>
                {content1.ashtanga.desc && (
                  <p className={styles.bodyText}>{stripHtml(content1.ashtanga.desc)}</p>
                )}
                {content1.ashtanga.pills?.length ? (
                  <div className={styles.featurePills}>
                    {content1.ashtanga.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>{stripHtml(pill)}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ── PRIMARY SERIES + HATHA ── */}
      <section className={styles.contentSection3}>
        {content1?.primary && (
          <div className={styles.primaryCurrCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <h3 className={styles.h3Left}>
              {content1.primary.h3 || "Primary Series Curriculum"}
            </h3>
            <div className={styles.underlineBar} />
            {content1.primary.intro && (
              <p className={styles.bodyText}>{stripHtml(content1.primary.intro)}</p>
            )}

            {content1.primary.foundationItems?.length ? (
              <div className={styles.foundationBox}>
                <div className={styles.foundationHeader}>
                  <span className={styles.foundIcon}>📖</span>
                  <strong>Foundation</strong>
                </div>
                <ul className={styles.foundList}>
                  {content1.primary.foundationItems.map((it, i) => (
                    <li key={i}>{stripHtml(it)}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {content1.primary.weekGrid?.length ? (
              <div className={styles.weekGrid}>
                {content1.primary.weekGrid.map((w, i) => (
                  <div key={i} className={styles.weekCard}>
                    <div className={styles.weekHeader}>
                      {stripHtml(w.week)} <span>{w.icon}</span>
                    </div>
                    {w.items?.map((it, j) => (
                      <div key={j} className={styles.weekItem}>
                        <span className={styles.weekDot}>●</span>
                        <div>
                          <strong>{stripHtml(it.t)}</strong>
                          <br />
                          <span className={styles.weekDesc}>{stripHtml(it.d)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* Hatha */}
        {content1?.hatha && (
          <>
            <VintageHeading>
              {content1.hatha.h2 || "Module 8.2: Hatha Yoga"}
            </VintageHeading>
            {content1.hatha.subtitle && (
              <p className={styles.centerSubtext}>{content1.hatha.subtitle}</p>
            )}
            <div className={styles.moduleDetailGrid}>
              <div className={styles.moduleDetailImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                {content1.hatha.image ? (
                  <img
                    src={imgUrl(content1.hatha.image)}
                    alt={content1.hatha.imgAlt || "Hatha Yoga"}
                    className={styles.modImg}
                  />
                ) : null}
              </div>
              <div className={styles.moduleDetailText}>
                {content1.hatha.desc && (
                  <p className={styles.bodyText}>{stripHtml(content1.hatha.desc)}</p>
                )}
                {content1.hatha.pills?.length ? (
                  <div className={styles.featurePills}>
                    {content1.hatha.pills.filter(Boolean).map((pill, i) => (
                      <span key={i} className={styles.pill}>{stripHtml(pill)}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ── HATHA ASANAS ── */}
      {asanas.length > 0 && (
        <section className={styles.contentSection}>
          <VintageHeading>Hatha Yoga Asanas</VintageHeading>
          <p className={styles.centerSubtext}>
            Master these {asanas.length} essential postures as part of your comprehensive training
          </p>

          <div className={styles.asanaFilterRow}>
            {asanaFilters.map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${asanaFilter === f ? styles.filterActive : ""}`}
                onClick={() => setAsanaFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className={styles.asanaGrid}>
            {asanas.map((a) => (
              <div key={a.n} className={styles.asanaCard}>
                <span className={styles.asanaNum}>{a.n}</span>
                <div>
                  <div className={styles.asanaName}>{a.name}</div>
                  <div className={styles.asanaSub}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <BorderStrip />

      {/* ── EVALUATION + ACCOMMODATION + FOOD ── */}
      <section className={styles.contentSection4}>
        {content2?.evalH2 && (
          <>
            <VintageHeading center={false}>{content2.evalH2}</VintageHeading>
            {content2.evalDesc && (
              <p className={styles.bodyText}>{stripHtml(content2.evalDesc)}</p>
            )}
          </>
        )}

        {/* Accommodation */}
        {content2?.accommodationH2 && (
          <>
            <VintageHeading>{content2.accommodationH2}</VintageHeading>
            {content2.accomImages?.length ? (
              <div className={styles.photoSliderWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <div className={styles.photoSlider}>
                  {content2.accomImages.map((src, i) => (
                    <img
                      key={i}
                      src={imgUrl(src)}
                      alt={`Accommodation ${i + 1}`}
                      className={styles.sliderImg}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* Food */}
        {content2?.foodH2 && (
          <>
            <VintageHeading>{content2.foodH2}</VintageHeading>
            {content2.foodImages?.length ? (
              <div className={styles.photoSliderWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <div className={styles.photoSlider}>
                  {content2.foodImages.map((src, i) => (
                    <img
                      key={i}
                      src={imgUrl(src)}
                      alt={`Food ${i + 1}`}
                      className={styles.sliderImg}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </section>

      <BorderStrip />

      {/* ── LUXURY + INDIAN FEE + SCHEDULE ── */}
      <section className={styles.contentSection}>
        {content2?.luxuryH2 && (
          <>
            <VintageHeading>{content2.luxuryH2}</VintageHeading>
            <div className={styles.luxuryGrid}>
              <div className={styles.luxuryLeft}>
                {(content2.luxFeatures || []).map((it) => (
                  <div key={it} className={styles.luxuryItem}>{stripHtml(it)}</div>
                ))}
              </div>
              <div className={styles.luxuryRight}>
                {content2.luxImages?.length ? (
                  <div className={styles.luxuryImgGrid}>
                    {content2.luxImages.map((src, i) => (
                      <img
                        key={i}
                        src={imgUrl(src)}
                        alt={`Luxury room ${i + 1}`}
                        className={`${styles.luxuryImg} ${i === content2.luxImages.length - 1 ? styles.luxuryImgWide : ""}`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}

        {/* Indian Fee */}
        {content2?.indianFeeH2 && (
          <>
            <VintageHeading>{content2.indianFeeH2}</VintageHeading>
            {content2.indianFees?.length ? (
              <div className={styles.indianFeeGrid}>
                {content2.indianFees.map((f, i) => (
                  <div key={i} className={styles.indianFeeCard}>
                    <CornerOrnament pos="tl" />
                    <CornerOrnament pos="tr" />
                    <CornerOrnament pos="bl" />
                    <CornerOrnament pos="br" />
                    <span className={styles.indianFeeLabel}>{stripHtml(f.label)}</span>
                    <span className={styles.indianFeePrice}>{stripHtml(f.price)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}

        {/* Schedule */}
        {content2?.scheduleH2 && (
          <>
            <VintageHeading>{content2.scheduleH2}</VintageHeading>
            {content2.schedDesc && (
              <p className={styles.bodyText}>{stripHtml(content2.schedDesc)}</p>
            )}
            <div className={styles.schedLayout}>
              <div className={styles.schedTableWrap}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <table className={styles.schedTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(content2.schedRows || []).map((r, i) => (
                      <tr key={i}>
                        <td>{stripHtml(r.time)}</td>
                        <td>{stripHtml(r.schedule)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {content2.schedImages?.length ? (
                <div className={styles.schedImgGrid}>
                  {content2.schedImages.map((src, i) => (
                    <img
                      key={i}
                      src={imgUrl(src)}
                      alt={`Yoga class ${i + 1}`}
                      className={styles.schedImg}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </section>

      <BorderStrip />

      {/* ── MORE INFO + CTA BANNER ── */}
      <section className={styles.contentSection}>
        {content2?.moreInfoH2 && (
          <VintageHeading>{content2.moreInfoH2}</VintageHeading>
        )}

        {/* Languages */}
        {content2?.instrLangs?.length ? (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}>
              <strong>The medium of instruction:</strong>
            </p>
            <ol className={styles.numberedListSimple}>
              {content2.instrLangs.map((l, i) => (
                <li key={i}>{typeof l === "string" ? l : l.lang}</li>
              ))}
            </ol>
          </div>
        ) : null}

        {/* Visa */}
        {content2?.visaPassportDesc && (
          <div className={styles.infoBlock}>
            <p className={styles.bodyText}>
              <strong>Visa And Passport:</strong>
            </p>
            <p className={styles.bodyText}>{stripHtml(content2.visaPassportDesc)}</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <div className={styles.ctaBannerLeft}>
            <p className={styles.ctaBannerTitle}>
              We welcome you to AYM School for a wonderful yogic experience!
            </p>
            <p className={styles.ctaBannerSub}>
              Join us &amp; become part of the 5000+ international yoga teachers
              who are proud alumni of the AYM School.
            </p>
          </div>
          <div className={styles.ctaBannerRight}>
            <p className={styles.ctaBannerBook}>Book Your Spot Today!</p>
            <a href="#" className={styles.applyNowBtn}>Apply Now</a>
            <a href="tel:+919528023390" className={styles.phoneBtn}>
              📱 +91-9528023390
            </a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ── NEW PROGRAMS ── */}
      {content2?.programs?.length ? (
        <section className={styles.contentSection}>
          <VintageHeading>Our New 200 Hour Yoga Programs</VintageHeading>
          <p className={styles.centerSubtext}>
            Expand your teaching expertise with our specialized certification combinations
          </p>
          <div className={styles.programGrid}>
            {content2.programs.map((p, i) => (
              <div key={i} className={styles.programCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <h3 className={styles.programTitle}>{stripHtml(p.title)}</h3>
                <p className={styles.programDesc}>{stripHtml(p.desc)}</p>
                <div className={styles.programMeta}>
                  <div>
                    <span className={styles.metaLabel}>Duration:</span> {stripHtml(p.duration)}
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Start Date:</span> {stripHtml(p.start)}
                  </div>
                  <div>
                    <span className={styles.metaLabel}>Price:</span>{" "}
                    <s className={styles.oldPrice}>{stripHtml(p.oldPrice)}</s>{" "}
                    <strong className={styles.newPrice}>{stripHtml(p.price)}</strong>
                  </div>
                </div>
                <a href="#" className={styles.learnMoreBtn}>Learn More</a>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <BorderStrip />

      {/* ── REQUIREMENTS ── */}
      {content2?.requirementsH2 && (
        <section className={styles.contentSection}>
          <VintageHeading>
            {content2.requirementsH2}
          </VintageHeading>
          <div className={styles.requirementsGrid}>
            <div className={styles.requirementsText}>
              {/* Dynamic knowQA if available */}
              {content2.knowQA?.length
                ? content2.knowQA.map((item, i) => (
                    <div key={i} className={styles.infoBlock}>
                      <h4 className={styles.infoQ}>{item.q}</h4>
                      {item.a.split("\n\n").map((para, j) => (
                        <p key={j} className={styles.bodyText}>{para}</p>
                      ))}
                    </div>
                  ))
                : null}
            </div>
            {content2.reqImage ? (
              <div className={styles.requirementsImg}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <img
                  src={imgUrl(content2.reqImage)}
                  alt="Yoga practitioner"
                  className={styles.reqImg}
                />
              </div>
            ) : null}
          </div>
        </section>
      )}

      <BorderStrip />

      {/* ── REVIEWS ── */}
      {content2?.reviews?.length ? (
        <section className={styles.contentSection}>
          <VintageHeading>Student Reviews &amp; Success Stories</VintageHeading>
          <p className={styles.centerSubtext}>
            Authentic stories of transformation from students who began just like you.
          </p>
          <div className={styles.reviewsGrid}>
            {content2.reviews.map((r, i) => (
              <div key={i} className={styles.reviewCard}>
                <CornerOrnament pos="tl" />
                <CornerOrnament pos="tr" />
                <CornerOrnament pos="bl" />
                <CornerOrnament pos="br" />
                <div className={styles.reviewHeader}>
                  <div>
                    <div className={styles.reviewName}>{stripHtml(r.name)}</div>
                    <div className={styles.reviewRole}>{stripHtml(r.role)}</div>
                  </div>
                </div>
                <Stars />
                <p className={styles.reviewText}>"{stripHtml(r.text)}"</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a href="#" className={styles.readMoreBtn}>Read More Reviews</a>
          </div>
        </section>
      ) : null}

      <BorderStrip />

      {/* ── HOW TO BOOK + FAQ ── */}
      <section className={styles.contentSection}>
        <VintageHeading>How to book your spot?</VintageHeading>
        <div className={styles.bookingSteps}>
          {[
            {
              icon: "💻",
              title: "Apply Now",
              text: "Click on Apply Now, and you'll be redirected to the application page where you'll enter necessary details about yourself.",
            },
            {
              icon: "👍",
              title: "Confirmation",
              text: "Once we receive your application, we'll review it within 24 hours and send confirmation to your email.",
            },
            {
              icon: "🏛",
              title: "Advance-Deposit",
              text: "After confirmation, you need to deposit an advance fee. Once you deposit you will get a confirmation email.",
            },
            {
              icon: "📝",
              title: "Refund Rules",
              text: "The advance deposit will not be refundable however, you can join us on other schedules in the span of one year.",
            },
          ].map((s, i) => (
            <div key={i} className={styles.bookingStep}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.bookingStepIcon}>{s.icon}</div>
              <div className={styles.bookingStepTitle}>{s.title}</div>
              <p className={styles.bookingStepText}>{s.text}</p>
            </div>
          ))}
        </div>

        {/* FAQ — from content2 */}
        {content2?.faqItems?.length ? (
          <>
            <VintageHeading>Frequently Asked Questions</VintageHeading>
            <div className={styles.faqList}>
              {content2.faqItems.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={styles.faqBtn}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{stripHtml(faq.q)}</span>
                    <span className={styles.faqIcon}>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className={styles.faqAnswer}>
                      <p className={styles.bodyText}>{stripHtml(faq.a)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <BorderStrip />
      <HowToReach />
    </div>
  );
}