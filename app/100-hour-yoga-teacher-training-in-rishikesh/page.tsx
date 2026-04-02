"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/100-hour-yoga-teacher-training-in-rishikesh/Hundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/6.webp";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface SylModule {
  title: string;
  desc: string;
}
interface ScheduleItem {
  time: string;
  label: string;
}

interface ContentData {
  bannerImage: string;
  heroTitle: string;
  heroParagraphs: string[];
  transformTitle: string;
  transformParagraphs: string[];
  whatIsTitle: string;
  whatIsParagraphs: string[];
  whyChooseTitle: string;
  whyChooseParagraphs: string[];
  suitableTitle: string;
  suitableItems: string[];
  syllabusTitle: string;
  syllabusParagraphs: string[];
  syllabusLeft: SylModule[];
  syllabusRight: SylModule[];
  scheduleImage: string;
  scheduleItems: ScheduleItem[];
  soulShineText: string;
  soulShineImage: string;
  enrollTitle: string;
  enrollParagraphs: string[];
  enrollItems: string[];
  comprehensiveTitle: string;
  comprehensiveParagraphs: string[];
  certTitle: string;
  certParagraphs: string[];
  registrationTitle: string;
  registrationParagraphs: string[];
  includedItems: string[];
  notIncludedItems: string[];
}

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

/* ══════════════════════════════
   IMAGE HELPER
══════════════════════════════ */
const imgUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_URL}${path}`;
};

/* ══════════════════════════════
   DATE FORMATTER
══════════════════════════════ */
const formatDateRange = (start: string, end: string) => {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

/* ══════════════════════════════
   OM DIVIDER
══════════════════════════════ */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDivider}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        {label && <span className={styles.omDividerLabel}>{label}</span>}
      </div>
      <div className={styles.divLineRight} />
    </div>
  );
}

/* ══════════════════════════════
   CORNER ORNAMENT
══════════════════════════════ */
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
            stroke="#e07b00"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
          <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
          <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════
   SEATS CELL
══════════════════════════════ */
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

/* ══════════════════════════════
   SKELETON LOADER
══════════════════════════════ */
function SkeletonBlock({ h = 24, w = "100%" }: { h?: number; w?: string }) {
  return (
    <div
      style={{
        height: h,
        width: w,
        borderRadius: 6,
        marginBottom: 12,
        background:
          "linear-gradient(90deg, #f0e8d8 25%, #e8d9c0 50%, #f0e8d8 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

/* ══════════════════════════════
   PAGE COMPONENT
══════════════════════════════ */
export default function HundredHourYoga() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [seats, setSeats] = useState<SeatBatch[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch both APIs in parallel ── */
  useEffect(() => {
    Promise.all([
      api.get("/100hr-content/get"),
      api.get("/100hr-seats/get-all-batches"),
    ])
      .then(([contentRes, seatsRes]) => {
        setContent(contentRes.data.data ?? null);
        setSeats(seatsRes.data.data ?? []);
      })
      .catch((err) => console.error("Failed to fetch page data:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading state ── */
  if (loading)
    return (
      <div className={styles.root} style={{ padding: "4rem 2rem" }}>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        {[...Array(6)].map((_, i) => (
          <SkeletonBlock key={i} h={i === 0 ? 400 : 28} />
        ))}
      </div>
    );

  /* ── Fallback if no content ── */
  if (!content)
    return (
      <div
        className={styles.root}
        style={{ padding: "4rem 2rem", textAlign: "center" }}
      >
        <p
          style={{ fontFamily: "serif", color: "#8b4513", fontSize: "1.2rem" }}
        >
          Content not available yet. Please check back soon.
        </p>
      </div>
    );

  return (
    <div className={styles.root}>
      {/* Background mandalas */}

      <div className={styles.grainOverlay} aria-hidden="true" />

      {/* ══ HERO IMAGE ══ */}
      <section className={styles.heroSection}>
        {content.bannerImage ? (
          <img
            src={imgUrl(content.bannerImage)}
            alt="100 Hour Yoga Teacher Training"
            className={styles.heroImage}
            style={{ width: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={heroImg}
            alt="Yoga Students Group"
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ══ HERO TEXT ══ */}
      <section className={styles.heroSection2}>
        <div className={styles.heroMandalaBg} aria-hidden="true"></div>
        <div className={styles.heroTextWrap}>
          <div className={styles.heroTitleRow}>
            <div className={styles.heroTitleLine} />
            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
            <div className={styles.heroTitleLine} />
          </div>
          {content.heroParagraphs.map((para, i) => (
            <p
              key={i}
              className={styles.bodyText}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
      </section>

      {/* ══ TRANSFORM + WHAT IS + WHY CHOOSE + SUITABLE ══ */}
      <section className={styles.contentSection}>
        <VintageHeading>{content.transformTitle}</VintageHeading>
        {content.transformParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <OmDivider />

        <VintageHeading>{content.whatIsTitle}</VintageHeading>
        {content.whatIsParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <OmDivider />

        <VintageHeading>{content.whyChooseTitle}</VintageHeading>
        {content.whyChooseParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <OmDivider />

        <VintageHeading>{content.suitableTitle}</VintageHeading>
        <ol className={styles.vintageList}>
          {content.suitableItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      {/* ══ DATES TABLE — from /100hr-seats/get-all-batches ══ */}
      <section className={styles.datesSection} id="apply">
        <OmDivider label="Upcoming Batches" />
        <VintageHeading>
          Upcoming 100 Hour Yoga Teacher Training India
        </VintageHeading>
        <p className={styles.centerSubtext}>
          Choose your preferred accommodation. Prices include tuition and meals.
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
                    <th>FEE</th>
                    <th>FEE ( Indian )</th>
                    <th>Room Price</th>
                    <th>Seats</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.map((row) => {
                    const isFull = row.bookedSeats >= row.totalSeats;
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
                              href={`/yoga-registration?batchId=${row._id}&type=100hr`}
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
          {/* ── Note from first batch that has one, or fallback ── */}
          {seats.find((s) => s.note) && (
            <p className={styles.tableNote}>
              <strong>Note:</strong> {seats.find((s) => s.note)?.note}
            </p>
          )}
          <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
            <a href="#" className={styles.joinBtn}>
              Join Your Yoga Journey
            </a>
          </div>
        </div>
      </section>

      {/* ══ SYLLABUS ══ */}
      <section className={styles.contentSection}>
        <OmDivider label="Curriculum" />
        <VintageHeading>{content.syllabusTitle}</VintageHeading>

        {content.syllabusParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <div className={styles.syllabusGrid}>
          <div className={styles.syllabusCard}>
            {content.syllabusLeft.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.syllabusCard}>
            {content.syllabusRight.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DAILY SCHEDULE ══ */}
      <section className={styles.scheduleSection}>
        <div className={styles.scheduleLayout}>
          <div className={styles.schedImgCol}>
            <div className={styles.schedImgOrnament}>
              {content.scheduleImage ? (
                <img
                  src={imgUrl(content.scheduleImage)}
                  alt="Yoga Schedule"
                  className={styles.schedImgReal}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=700&q=80"
                  alt="Yoga meditation practice"
                  className={styles.schedImgReal}
                />
              )}
            </div>
          </div>
          <div className={styles.schedBoxCol}>
            <div className={styles.schedBox}>
              <CornerOrnament pos="tl" />
              <CornerOrnament pos="tr" />
              <CornerOrnament pos="bl" />
              <CornerOrnament pos="br" />
              <div className={styles.schedHeader}>Daily Schedule</div>
              <ul className={styles.schedList}>
                {content.scheduleItems.map((item, i) => (
                  <li key={i} className={styles.schedItem}>
                    <span>
                      {item.time} – {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOUL SHINE BANNER + WHY ENROL ══ */}
      <section className={styles.contentSection}>
        <OmDivider />

        {/* Soul Shine Banner */}
        <div className={styles.classBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <img
            src={
              content.soulShineImage
                ? imgUrl(content.soulShineImage)
                : "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=80"
            }
            alt="Yoga class Rishikesh"
            className={styles.classBannerImg}
          />
          <div className={styles.classBannerOverlay} />
          <span className={styles.letYourSoul}>
            {content.soulShineText || "Let Your Soul Shine"}
          </span>
        </div>

        <OmDivider />

        <VintageHeading>{content.enrollTitle}</VintageHeading>
        {content.enrollParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
        <ol className={styles.vintageList}>
          {content.enrollItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
      </section>

      {/* ══ COMPREHENSIVE + CERTIFICATION + REGISTRATION + FEE ══ */}
      <section className={styles.contentSection}>
        <OmDivider />
        <VintageHeading>{content.comprehensiveTitle}</VintageHeading>
        {content.comprehensiveParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <OmDivider />
        <VintageHeading>{content.certTitle}</VintageHeading>
        {content.certParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        <OmDivider />
        <VintageHeading>{content.registrationTitle}</VintageHeading>
        {content.registrationParagraphs.map((p, i) => (
          <p
            key={i}
            className={styles.bodyText}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}

        {/* ── Fee cards ── */}
        <div className={styles.feeGrid}>
          <div className={styles.feeCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <div className={styles.feeCardHeaderGreen}>Included in Fee</div>
            <ul className={styles.feeList}>
              {content.includedItems.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
          <div className={styles.feeCard}>
            <CornerOrnament pos="tl" />
            <CornerOrnament pos="tr" />
            <CornerOrnament pos="bl" />
            <CornerOrnament pos="br" />
            <div className={styles.feeCardHeaderRed}>Not Included</div>
            <ul className={styles.feeList}>
              {content.notIncludedItems.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}
