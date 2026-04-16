"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/yoga-goa-in-india/Goayogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";

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

interface CoreProgram {
  _id: string;
  hrs: string;
  tag: string;
  subHeading: string;
  desc: string;
  linkText: string;
  linkHref: string;
}

interface SpecialProgram {
  _id: string;
  title: string;
  desc: string;
}

interface Highlight {
  _id: string;
  num: string;
  title: string;
  body: string;
}

interface ScheduleRow {
  _id: string;
  time: string;
  activity: string;
}

interface CampusImage {
  _id: string;
  id: string;
  label: string;
  imgUrl: string;
}

interface BeachImage {
  id: string;
  imgUrl: string;
}

interface ApplyField {
  _id: string;
  label: string;
}

interface PageData {
  // Hero
  heroImage: string;
  heroAlt: string;
  // Intro
  introSuperLabel: string;
  introHeading: string;
  introLocation: string;
  introBestTime: string;
  introParagraphs: string[];
  introBigImage: string;
  introSmallImage: string;
  // Programs
  programsSuperLabel: string;
  programsSectionTitle: string;
  programsSubNote: string;
  coreProgramsSectionHeading: string;
  specialProgramsSectionHeading: string;
  arambolDesc: string;
  corePrograms: CoreProgram[];
  specialPrograms: SpecialProgram[];
  beachImages: BeachImage[];
  // Highlights
  highlightsSuperLabel: string;
  highlightsSectionTitle: string;
  highlightsSubNote: string;
  highlights: Highlight[];
  bestTimeHeading: string;
  bestTimeText: string;
  // Curriculum
  curriculumSuperLabel: string;
  curriculumSectionTitle: string;
  learnings: string[];
  focusSectionTitle: string;
  focusBodyText: string;
  mainFocus: string[];
  // Schedule
  scheduleSuperLabel: string;
  scheduleSectionTitle: string;
  scheduleImage: string;
  scheduleImageAlt: string;
  scheduleRows: ScheduleRow[];
  // Batches
  batchesSuperLabel: string;
  batchesSectionTitle: string;
  batchesNote: string;
  batchesNoteEmail: string;
  batchesAirportNote: string;
  // Gallery
  gallerySuperLabel: string;
  gallerySectionTitle: string;
  campusImages: CampusImage[];
  // Address
  schoolName: string;
  address1: string;
  address2: string;
  address3: string;
  phone1: string;
  phone2: string;
  addressSectionTitle: string;
  // Reach
  reachHeading: string;
  reachViaAirLabel: string;
  reachViaAir: string;
  // Apply
  applySectionTitle: string;
  applyEmail: string;
  applyInstructions: string;
  applyDepositAmount: string;
  applyDepositNote: string;
  applyFields: ApplyField[];
  // Refund
  refundSectionTitle: string;
  refundPolicy: string;
  rulesHref: string;
  rulesLinkText: string;
  // Footer CTA
  footerCtaTitle: string;
  footerCtaSub: string;
  footerCtaDatesHref: string;
  footerCtaEmailHref: string;
  joinCtaText: string;
  viewDatesText: string;
  emailUsText: string;
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

function resolveImg(path: string, base: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path}`;
}

/* ─────────────────────────────────────────
   COURSE TABS
───────────────────────────────────────── */
const COURSE_TABS = [
  {
    label: "200 Hour",
    key: "200hr",
    apiPath: "/goa-200hr-seats/getAllBatches",
  },
  {
    label: "300 Hour",
    key: "300hr",
    apiPath: "/goa-300hr-seats/getAllBatches",
  },
  {
    label: "500 Hour",
    key: "500hr",
    apiPath: "/goa-500hr-seats/getAllBatches",
  },
] as const;

type TabKey = (typeof COURSE_TABS)[number]["key"];

/* ─────────────────────────────────────────
   SEAT BOOKING SECTION
───────────────────────────────────────── */
function SeatBookingSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("200hr");
  const [batchCache, setBatchCache] = useState<Record<string, Batch[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  const fetchBatches = async (tab: TabKey) => {
    if (batchCache[tab]) return;
    const apiPath = COURSE_TABS.find((t) => t.key === tab)?.apiPath;
    if (!apiPath) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api${apiPath}`);
      const data = await res.json();
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
    <div className={styles.wrapper}>
      {/* Tab Bar */}
      <div className={styles.tabBar}>
        {COURSE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.stateBox}>🕉️ Loading batches...</div>
        ) : error ? (
          <div className={`${styles.stateBox} ${styles.stateError}`}>
            {error}
          </div>
        ) : currentBatches.length === 0 ? (
          <div className={styles.stateBox}>
            No upcoming batches available for {activeTabLabel}.
          </div>
        ) : (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
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
                      <td className={styles.tdDate}>
                        <span className={styles.calIcon}>📅</span>{" "}
                        {formatDateRange(batch.startDate, batch.endDate)}
                      </td>
                      <td>{batch.usdFee}</td>
                      <td>{batch.inrFee}</td>
                      <td className={styles.tdRoom}>
                        Dorm{" "}
                        <strong className={styles.price}>
                          ${batch.dormPrice}
                        </strong>{" "}
                        | Twin{" "}
                        <strong className={styles.price}>
                          ${batch.twinPrice}
                        </strong>{" "}
                        | Private{" "}
                        <strong className={styles.price}>
                          ${batch.privatePrice}
                        </strong>
                      </td>
                      <td>
                        {isFull ? (
                          <span className={styles.fullyBooked}>
                            Fully Booked
                          </span>
                        ) : (
                          <span className={styles.seatsAvailable}>
                            {remaining} / {batch.totalSeats} Seats
                          </span>
                        )}
                      </td>
                      <td>
                        {isFull ? (
                          <span className={styles.applyDisabled}>
                            Apply Now
                          </span>
                        ) : (
                          <a
                            href={`/yoga-registration?batchId=${batch._id}&type=${activeTab}`}
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
        )}

        {currentBatches[0]?.note && (
          <p className={styles.note}>
            <strong>Note:</strong> {currentBatches[0].note}
          </p>
        )}
      </div>
    </div>
  );
}

/* ════════════════ MAIN PAGE ════════════════ */
export default function GoaYogaPage() {
  const [modal, setModal] = useState<{ src: string; label: string } | null>(
    null,
  );
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  /* ── Fetch page data ── */
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/goa-yoga-page/get`);
        const json = await res.json();
        if (json.success && json.data) {
          setPageData(json.data);
        } else {
          setPageError(true);
        }
      } catch {
        setPageError(true);
      } finally {
        setPageLoading(false);
      }
    };
    fetchPage();
  }, [API_BASE]);

  /* ── Scroll reveal ── */
  useEffect(() => {
    if (!pageData) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [pageData]);

  /* ── Escape closes modal ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── States ── */
  if (pageLoading) {
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
        <div className={styles.stateBox}>🕉️ Loading...</div>
      </div>
    );
  }

  if (pageError || !pageData) {
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
        <div className={styles.stateBox}>
          Failed to load page. Please refresh.
        </div>
      </div>
    );
  }

  /* ── Resolved image URLs ── */
  const heroSrc = resolveImg(pageData.heroImage, API_BASE);
  const introBigSrc = resolveImg(pageData.introBigImage, API_BASE);
  const introSmallSrc = resolveImg(pageData.introSmallImage, API_BASE);
  const scheduleSrc = resolveImg(pageData.scheduleImage, API_BASE);

  return (
    <div className={styles.page}>
      {/* ══ Mandala watermark ══ */}
      <div className={styles.pageWatermark} aria-hidden="true">
        <MandalaFull size={700} opacity={0.03} />
      </div>

      {/* ════════ HERO ════════ */}
      <section className={styles.heroSection}>
        {heroSrc && (
          <img
            src={heroSrc}
            alt={pageData.heroAlt}
            className={styles.heroImage}
          />
        )}
      </section>

      {/* ════════ INTRO ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introGrid}`}>
            <div className={styles.introText}>
              <span className={styles.superLabel}>
                {pageData.introSuperLabel}
              </span>
              <h2 className={styles.sectionTitle}>{pageData.introHeading}</h2>
              <OmDivider align="left" />
              {pageData.introParagraphs?.map((para, i) => (
                <p key={i} className={styles.para}>
                  {para}
                </p>
              ))}
            </div>

            <div className={styles.introImages}>
              <div className={styles.imageStack}>
                {introBigSrc && (
                  <div className={styles.imgMain}>
                    <img src={introBigSrc} alt={pageData.heroAlt} />
                  </div>
                )}
                {introSmallSrc && (
                  <div className={styles.imgAccent}>
                    <img src={introSmallSrc} alt={pageData.introHeading} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ PROGRAMS ════════ */}
      <section
        id="programs"
        className={`${styles.section} ${styles.sectionAlt}`}
      >
        <div className={styles.mandalaBg} aria-hidden="true">
          <MandalaRing size={600} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.programsSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.programsSectionTitle}
            </h2>
            <OmDivider />
            <p className={styles.paraCenter}>{pageData.programsSubNote}</p>
          </div>

          {/* Core programs */}
          <div className={styles.reveal}>
            <h3 className={styles.subHeading}>
              {pageData.coreProgramsSectionHeading}
            </h3>
            <div className={styles.programsGrid}>
              {pageData.corePrograms?.map((p) => (
                <div key={p._id} className={styles.programCard}>
                  <div className={styles.programHrs}>
                    {p.hrs}
                    <span>HR</span>
                  </div>
                  <div className={styles.programTag}>{p.tag}</div>
                  <h4 className={styles.programTitle}>{p.subHeading}</h4>
                  <p className={styles.programDesc}>{p.desc}</p>
                  <a href={p.linkHref} className={styles.programLink}>
                    {p.linkText}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Special programs */}
          <div className={`${styles.reveal} ${styles.specialWrap}`}>
            <h3 className={styles.subHeading}>
              {pageData.specialProgramsSectionHeading}
            </h3>
            <div className={styles.specialGrid}>
              {pageData.specialPrograms?.map((p) => (
                <div key={p._id} className={styles.specialCard}>
                  <span className={styles.specialIcon}>🎵</span>
                  <h4 className={styles.specialTitle}>{p.title}</h4>
                  <p className={styles.specialDesc}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arambol + beach images */}
          <div className={`${styles.reveal} ${styles.arambolBox}`}>
            <p className={styles.paraCenter}>{pageData.arambolDesc}</p>
            {pageData.beachImages?.length > 0 && (
              <div className={styles.beachPhotoRow}>
                {pageData.beachImages.map((b) => {
                  const src = resolveImg(b.imgUrl, API_BASE);
                  return src ? (
                    <div key={b.id} className={styles.beachPhoto}>
                      <img src={src} alt={`Beach ${b.id}`} />
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════ HIGHLIGHTS ════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.highlightsSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.highlightsSectionTitle}
            </h2>
            <OmDivider />
            <p className={styles.paraCenter}>{pageData.highlightsSubNote}</p>
          </div>

          <div className={`${styles.reveal} ${styles.highlightsGrid}`}>
            {pageData.highlights?.map((h) => (
              <div key={h._id} className={styles.highlightCard}>
                <div className={styles.highlightNum}>{h.num}</div>
                <div className={styles.highlightBody}>
                  <h4 className={styles.highlightTitle}>{h.title}</h4>
                  <p className={styles.highlightText}>{h.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.reveal} ${styles.bestTimeBox}`}>
            <h3 className={styles.subHeading}>{pageData.bestTimeHeading}</h3>
            <OmDivider align="left" />
            <p className={styles.para}>{pageData.bestTimeText}</p>
          </div>
        </div>
      </section>

      {/* ════════ CURRICULUM ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div
          className={styles.mandalaBg}
          style={{ right: "-80px", left: "auto" }}
          aria-hidden="true"
        >
          <MandalaRing size={500} opacity={0.05} />
        </div>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.curriculumSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.curriculumSectionTitle}
            </h2>
            <OmDivider />
          </div>

          <div className={`${styles.reveal} ${styles.learnGrid}`}>
            {pageData.learnings?.map((l, i) => (
              <div key={i} className={styles.learnItem}>
                <span className={styles.learnNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p>{l}</p>
              </div>
            ))}
          </div>

          <div className={`${styles.reveal} ${styles.focusSection}`}>
            <h3 className={styles.subHeading}>{pageData.focusSectionTitle}</h3>
            <OmDivider align="left" />
            <p className={styles.para}>{pageData.focusBodyText}</p>
            <div className={styles.focusChips}>
              {pageData.mainFocus?.map((f) => (
                <span key={f} className={styles.focusChip}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SCHEDULE ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.scheduleSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.scheduleSectionTitle}
            </h2>
            <OmDivider />
          </div>

          <div className={`${styles.reveal} ${styles.scheduleGrid}`}>
            {scheduleSrc && (
              <div className={styles.scheduleImage}>
                <img src={scheduleSrc} alt={pageData.scheduleImageAlt} />
                <div className={styles.scheduleImageOverlay} />
              </div>
            )}
            <div className={styles.scheduleTable}>
              <div className={styles.scheduleHeader}>
                {pageData.scheduleSectionTitle}
              </div>
              {pageData.scheduleRows?.map((s, i) => (
                <div
                  key={s._id}
                  className={`${styles.scheduleRow} ${i % 2 === 0 ? styles.scheduleRowAlt : ""}`}
                >
                  <span className={styles.scheduleTime}>{s.time}</span>
                  <span className={styles.scheduleActivity}>{s.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BATCHES ════════ */}
      <section className={styles.section} id="dates">
        <div className={styles.container}>
          <OmDivider />
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.batchesSuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.batchesSectionTitle}
            </h2>
            <OmDivider />
          </div>

          <SeatBookingSection />

          <div className={styles.tableNote}>
            {pageData.batchesNote && (
              <p>
                <strong>Note:</strong> {pageData.batchesNote}{" "}
                {pageData.batchesNoteEmail && (
                  <a
                    href={`mailto:${pageData.batchesNoteEmail}`}
                    className={styles.emailLink}
                  >
                    {pageData.batchesNoteEmail}
                  </a>
                )}
              </p>
            )}
            {pageData.batchesAirportNote && (
              <p>{pageData.batchesAirportNote}</p>
            )}
          </div>

          {pageData.joinCtaText && (
            <div className={styles.ctaRow}>
              <a
                href={pageData.footerCtaDatesHref || "#dates"}
                className={styles.joinBtn}
              >
                {pageData.joinCtaText}
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ════════ CAMPUS GALLERY ════════ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.centered}`}>
            <span className={styles.superLabel}>
              {pageData.gallerySuperLabel}
            </span>
            <h2 className={styles.sectionTitle}>
              {pageData.gallerySectionTitle}
            </h2>
            <OmDivider />
          </div>

          <div className={`${styles.reveal} ${styles.campusGrid}`}>
            {pageData.campusImages?.map((img) => {
              const src = resolveImg(img.imgUrl, API_BASE);
              return (
                <button
                  key={img._id}
                  className={styles.campusCard}
                  onClick={() => src && setModal({ src, label: img.label })}
                  aria-label={`View ${img.label}`}
                >
                  {src ? (
                    <img src={src} alt={img.label} />
                  ) : (
                    <div className={styles.campusPlaceholder}>🖼️</div>
                  )}
                  <div className={styles.campusOverlay}>
                    <span className={styles.campusLabel}>{img.label}</span>
                    {src && <span className={styles.campusZoom}>⊕ View</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ INFO GRID ════════ */}
      <section id="apply" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.infoGrid}`}>
            {/* Address */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📍</span>
              <h3 className={styles.infoTitle}>
                {pageData.addressSectionTitle}
              </h3>
              <OmDivider align="left" />
              <address className={styles.address}>
                {pageData.schoolName && (
                  <>
                    <strong>{pageData.schoolName}</strong>
                    <br />
                  </>
                )}
                {pageData.address1 && (
                  <>
                    {pageData.address1}
                    <br />
                  </>
                )}
                {pageData.address2 && (
                  <>
                    {pageData.address2}
                    <br />
                  </>
                )}
                {pageData.address3 && (
                  <>
                    {pageData.address3}
                    <br />
                  </>
                )}
                <br />
                {pageData.phone1 && (
                  <>
                    <a href={`tel:${pageData.phone1}`}>{pageData.phone1}</a>
                    <br />
                  </>
                )}
                {pageData.phone2 && (
                  <a href={`tel:${pageData.phone2}`}>{pageData.phone2}</a>
                )}
              </address>
            </div>

            {/* How to reach */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>✈️</span>
              <h3 className={styles.infoTitle}>{pageData.reachHeading}</h3>
              <OmDivider align="left" />
              <p className={styles.para}>
                {pageData.reachViaAirLabel && (
                  <strong>{pageData.reachViaAirLabel} </strong>
                )}
                {pageData.reachViaAir}
              </p>
            </div>

            {/* How to apply */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📝</span>
              <h3 className={styles.infoTitle}>{pageData.applySectionTitle}</h3>
              <OmDivider align="left" />
              {pageData.applyInstructions && (
                <p className={styles.para}>{pageData.applyInstructions}</p>
              )}
              {pageData.applyEmail && (
                <p className={styles.para}>
                  <a
                    href={`mailto:${pageData.applyEmail}`}
                    className={styles.emailLink}
                  >
                    {pageData.applyEmail}
                  </a>
                </p>
              )}
              {pageData.applyDepositNote && (
                <p className={styles.para}>{pageData.applyDepositNote}</p>
              )}
              {pageData.applyDepositAmount && !pageData.applyDepositNote && (
                <p className={styles.para}>
                  Deposit <strong>{pageData.applyDepositAmount}</strong> to
                  confirm your seat.
                </p>
              )}
              <div className={styles.formFields}>
                {pageData.applyFields?.map((f) => (
                  <span key={f._id} className={styles.formField}>
                    · {f.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Refund */}
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🔄</span>
              <h3 className={styles.infoTitle}>
                {pageData.refundSectionTitle}
              </h3>
              <OmDivider align="left" />
              <p className={styles.para}>{pageData.refundPolicy}</p>
              {pageData.rulesHref && pageData.rulesLinkText && (
                <a href={pageData.rulesHref} className={styles.rulesLink}>
                  {pageData.rulesLinkText}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER CTA ════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerMandala} aria-hidden="true">
          <MandalaFull size={500} opacity={0.1} />
        </div>
        <div className={styles.container}>
          <div className={styles.footerCtaInner}>
            <div className={styles.footerOm}>ॐ</div>
            <h2 className={styles.footerTitle}>{pageData.footerCtaTitle}</h2>
            <p className={styles.footerSub}>{pageData.footerCtaSub}</p>
            <div className={styles.heroBtns}>
              <a
                href={pageData.footerCtaDatesHref || "#dates"}
                className={styles.btnPrimary}
              >
                {pageData.viewDatesText}
              </a>

              <a
                href={
                  pageData.footerCtaEmailHref || `mailto:${pageData.applyEmail}`
                }
                className={styles.btnOutline}
              >
                {pageData.emailUsText}
              </a>
            </div>
          </div>
        </div>
      </section>

      <HowToReach />

      {/* ════════ MODAL ════════ */}
      {modal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.modalClose}
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className={styles.modalMandala} aria-hidden="true">
              <MandalaRing size={200} opacity={0.12} />
            </div>
            <img
              src={modal.src}
              alt={modal.label}
              className={styles.modalImg}
            />
            <div className={styles.modalCaption}>
              <OmDivider />
              <p>{modal.label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SUB-COMPONENTS ─── */
function OmDivider({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <div
      className={styles.omDivider}
      style={{ justifyContent: align === "left" ? "flex-start" : "center" }}
    >
      <span className={styles.omLine} />
      <span className={styles.omGlyph}>ॐ</span>
      <span className={styles.omLine} />
    </div>
  );
}

function MandalaRing({
  size = 300,
  opacity = 0.08,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
  const rings = [0.46, 0.36, 0.26, 0.14].map((r) => r * size);
  const spokes = 24;
  const petals = 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g stroke="#f15505" strokeWidth="0.7" fill="none">
        {rings.map((r, i) => (
          <circle key={i} cx={c} cy={c} r={r} />
        ))}
        {Array.from({ length: spokes }).map((_, i) => {
          const a = (i / spokes) * 2 * Math.PI;
          return (
            <line
              key={i}
              x1={c + rings[2] * Math.cos(a)}
              y1={c + rings[2] * Math.sin(a)}
              x2={c + rings[0] * Math.cos(a)}
              y2={c + rings[0] * Math.sin(a)}
            />
          );
        })}
        {Array.from({ length: petals }).map((_, i) => {
          const a = (i / petals) * 2 * Math.PI;
          const r = rings[1];
          return (
            <ellipse
              key={i}
              cx={c + r * Math.cos(a)}
              cy={c + r * Math.sin(a)}
              rx={size * 0.07}
              ry={size * 0.025}
              transform={`rotate(${(i / petals) * 360} ${c + r * Math.cos(a)} ${c + r * Math.sin(a)})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function MandalaFull({
  size = 600,
  opacity = 0.05,
}: {
  size?: number;
  opacity?: number;
}) {
  const c = size / 2;
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
        transform={`translate(${c},${c})`}
      >
        {[0.46, 0.38, 0.3, 0.22, 0.14, 0.07].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          const r0 = size * 0.07,
            r1 = size * 0.46;
          return (
            <line
              key={i}
              x1={r0 * Math.cos(a)}
              y1={r0 * Math.sin(a)}
              x2={r1 * Math.cos(a)}
              y2={r1 * Math.sin(a)}
            />
          );
        })}
        {[8, 16].map((n, ni) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const r = size * (ni === 0 ? 0.32 : 0.2);
            return (
              <ellipse
                key={`${ni}-${i}`}
                cx={r * Math.cos(a)}
                cy={r * Math.sin(a)}
                rx={size * (ni === 0 ? 0.065 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${r * Math.cos(a)} ${r * Math.sin(a)})`}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}
