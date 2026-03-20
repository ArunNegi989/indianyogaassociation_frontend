"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/100-hour-yoga-teacher-training-in-rishikesh/Hundredhouryoga.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImg from "@/assets/images/100hours.svg";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ══════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════ */
interface SylModule { title: string; desc: string; }
interface ScheduleItem { time: string; label: string; }

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
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
};

/* ══════════════════════════════════════════════════
   MANDALA SVG
══════════════════════════════════════════════════ */
function MandalaSVG({ size = 400, opacity = 0.13 }: { size?: number; opacity?: number }) {
  const cx = 100, cy = 100;
  const petals12 = Array.from({ length: 12 }, (_, i) => (i * 30 * Math.PI) / 180);
  const petals8  = Array.from({ length: 8  }, (_, i) => (i * 45 * Math.PI) / 180);
  const petals6  = Array.from({ length: 6  }, (_, i) => (i * 60 * Math.PI) / 180);
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, opacity }}>
      {[95, 88, 80, 72, 60, 45, 30, 16].map((r, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} stroke="#8b4513" strokeWidth={i % 2 === 0 ? 0.7 : 0.3} fill="none" />
      ))}
      {petals12.map((a, i) => {
        const x1 = cx + 60 * Math.cos(a), y1 = cy + 60 * Math.sin(a);
        const x2 = cx + 88 * Math.cos(a), y2 = cy + 88 * Math.sin(a);
        const lx = cx + 74 * Math.cos(a + 0.18), ly = cy + 74 * Math.sin(a + 0.18);
        const rx = cx + 74 * Math.cos(a - 0.18), ry = cy + 74 * Math.sin(a - 0.18);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b4513" strokeWidth="0.5" />
            <path d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#8b4513" strokeWidth="0.4" fill="rgba(139,69,19,0.04)" />
          </g>
        );
      })}
      {petals8.map((a, i) => {
        const x1 = cx + 45 * Math.cos(a), y1 = cy + 45 * Math.sin(a);
        const x2 = cx + 60 * Math.cos(a), y2 = cy + 60 * Math.sin(a);
        const lx = cx + 52 * Math.cos(a + 0.25), ly = cy + 52 * Math.sin(a + 0.25);
        const rx = cx + 52 * Math.cos(a - 0.25), ry = cy + 52 * Math.sin(a - 0.25);
        return (
          <g key={i}>
            <path d={`M ${x1} ${y1} Q ${lx} ${ly} ${x2} ${y2} Q ${rx} ${ry} ${x1} ${y1}`}
              stroke="#b8860b" strokeWidth="0.5" fill="rgba(184,134,11,0.05)" />
          </g>
        );
      })}
      {petals6.map((a, i) => {
        const opp = a + Math.PI;
        return (
          <line key={i}
            x1={cx + 30 * Math.cos(a)}   y1={cy + 30 * Math.sin(a)}
            x2={cx + 30 * Math.cos(opp)} y2={cy + 30 * Math.sin(opp)}
            stroke="#8b4513" strokeWidth="0.6" />
        );
      })}
      {petals12.map((a, i) => (
        <circle key={i} cx={cx + 80 * Math.cos(a)} cy={cy + 80 * Math.sin(a)} r="1.8" fill="#8b4513" opacity="0.6" />
      ))}
      {petals8.map((a, i) => (
        <circle key={i} cx={cx + 45 * Math.cos(a)} cy={cy + 45 * Math.sin(a)} r="1.4" fill="#b8860b" opacity="0.5" />
      ))}
      {petals8.map((a, i) => {
        const r1 = 16, r2 = 28;
        const x0 = cx + r1 * Math.cos(a), y0 = cy + r1 * Math.sin(a);
        const xl = cx + r2 * Math.cos(a + 0.45), yl = cy + r2 * Math.sin(a + 0.45);
        const xr = cx + r2 * Math.cos(a - 0.45), yr = cy + r2 * Math.sin(a - 0.45);
        return <polygon key={i} points={`${x0},${y0} ${xl},${yl} ${xr},${yr}`}
          stroke="#b8860b" strokeWidth="0.4" fill="rgba(184,134,11,0.04)" />;
      })}
      <circle cx={cx} cy={cy} r="12" stroke="#8b4513" strokeWidth="0.8" fill="rgba(139,69,19,0.06)" />
      <circle cx={cx} cy={cy} r="5"  stroke="#8b4513" strokeWidth="0.6" fill="rgba(139,69,19,0.1)" />
      <circle cx={cx} cy={cy} r="2"  fill="#8b4513" opacity="0.5" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const inner = i % 2 === 0 ? 91 : 93;
        return (
          <line key={i}
            x1={cx + inner * Math.cos(a)} y1={cy + inner * Math.sin(a)}
            x2={cx + 95   * Math.cos(a)} y2={cy + 95   * Math.sin(a)}
            stroke="#8b4513" strokeWidth="0.5" />
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════
   BORDER STRIP
══════════════════════════════ */
function BorderStrip() {
  return (
    <div className={styles.borderStrip}>
      <svg viewBox="0 0 800 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className={styles.borderSvg}>
        {Array.from({ length: 40 }, (_, i) => {
          const x = i * 20 + 10;
          return (
            <g key={i}>
              <polygon points={`${x},7 ${x+6},2 ${x+12},7 ${x+6},12`} fill="none" stroke="#b8860b" strokeWidth="0.8" />
              <circle cx={x + 6} cy={7} r="1.2" fill="#b8860b" opacity="0.7" />
            </g>
          );
        })}
        <line x1="0" y1="7" x2="800" y2="7" stroke="#e07b00" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════
   OM DIVIDER
══════════════════════════════ */
function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDivider}>
      <div className={styles.divLineLeft} />
      <div className={styles.omDividerCenter}>
        <MandalaSVG size={52} opacity={0.55} />
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
  const flip = { tl: "scale(1,1)", tr: "scale(-1,1)", bl: "scale(1,-1)", br: "scale(-1,-1)" }[pos];
  return (
    <svg viewBox="0 0 40 40" className={styles.cornerOrn} style={{ transform: flip }}>
      <path d="M2,2 L2,18 M2,2 L18,2" stroke="#b8860b" strokeWidth="1.5" fill="none" />
      <path d="M2,2 Q8,8 16,2 Q8,8 2,16" stroke="#b8860b" strokeWidth="0.7" fill="none" />
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
        <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg" className={styles.headingUndSvg}>
          <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#e07b00" strokeWidth="1.2" fill="none" />
          <circle cx="100" cy="4" r="3" fill="#e07b00" opacity="0.7" />
          <circle cx="10"  cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
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
  return <span className={styles.seatsAvailable}>{remaining} / {total} Seats</span>;
}

/* ══════════════════════════════
   SKELETON LOADER
══════════════════════════════ */
function SkeletonBlock({ h = 24, w = "100%" }: { h?: number; w?: string }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 6, marginBottom: 12,
      background: "linear-gradient(90deg, #f0e8d8 25%, #e8d9c0 50%, #f0e8d8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

/* ══════════════════════════════
   PAGE COMPONENT
══════════════════════════════ */
export default function HundredHourYoga() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [seats,   setSeats]   = useState<SeatBatch[]>([]);
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
      .catch(err => console.error("Failed to fetch page data:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading state ── */
  if (loading) return (
    <div className={styles.root} style={{ padding: "4rem 2rem" }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      {[...Array(6)].map((_, i) => <SkeletonBlock key={i} h={i === 0 ? 400 : 28} />)}
    </div>
  );

  /* ── Fallback if no content ── */
  if (!content) return (
    <div className={styles.root} style={{ padding: "4rem 2rem", textAlign: "center" }}>
      <p style={{ fontFamily: "serif", color: "#8b4513", fontSize: "1.2rem" }}>
        Content not available yet. Please check back soon.
      </p>
    </div>
  );

  return (
    <div className={styles.root}>

      {/* Background mandalas */}
      <div className={styles.mandalaFixed} aria-hidden="true">
        <div className={styles.mf1}><MandalaSVG size={700} opacity={0.055} /></div>
        <div className={styles.mf2}><MandalaSVG size={520} opacity={0.045} /></div>
        <div className={styles.mf3}><MandalaSVG size={400} opacity={0.04}  /></div>
        <div className={styles.mf4}><MandalaSVG size={300} opacity={0.035} /></div>
      </div>
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
          <Image src={heroImg} alt="Yoga Students Group" width={1180} height={540} className={styles.heroImage} priority />
        )}
      </section>

      {/* ══ HERO TEXT ══ */}
      <section className={styles.heroSection2}>
        <div className={styles.heroMandalaBg} aria-hidden="true">
          <MandalaSVG size={900} opacity={0.06} />
        </div>
        <div className={styles.heroTextWrap}>
          <div className={styles.heroTitleRow}>
            <div className={styles.heroTitleLine} />
            <h1 className={styles.heroTitle}>{content.heroTitle}</h1>
            <div className={styles.heroTitleLine} />
          </div>
          {content.heroParagraphs.map((para, i) => (
            <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </section>

      <BorderStrip />

      {/* ══ TRANSFORM + WHAT IS + WHY CHOOSE + SUITABLE ══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={320} opacity={0.07} /></div>
        <div className={styles.sectionMandalaR} aria-hidden="true"><MandalaSVG size={260} opacity={0.06} /></div>

        <VintageHeading>{content.transformTitle}</VintageHeading>
        {content.transformParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <OmDivider />

        <VintageHeading>{content.whatIsTitle}</VintageHeading>
        {content.whatIsParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <OmDivider />

        <VintageHeading>{content.whyChooseTitle}</VintageHeading>
        {content.whyChooseParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <OmDivider />

        <VintageHeading>{content.suitableTitle}</VintageHeading>
        <ol className={styles.vintageList}>
          {content.suitableItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      <BorderStrip />

      {/* ══ DATES TABLE — from /100hr-seats/get-all-batches ══ */}
      <section className={styles.datesSection} id="apply">
        <OmDivider label="Upcoming Batches" />
        <VintageHeading>Upcoming 100 Hour Yoga Teacher Training India</VintageHeading>
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
              <p style={{ padding: "2rem", textAlign: "center", fontFamily: "serif", color: "#8b4513" }}>
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
                          Dorm <strong className={styles.priceAmt}>${row.dormPrice}</strong> |{" "}
                          Twin <strong className={styles.priceAmt}>${row.twinPrice}</strong> |{" "}
                          Private <strong className={styles.priceAmt}>${row.privatePrice}</strong>
                        </td>
                        <td>
                          <SeatsCell booked={row.bookedSeats} total={row.totalSeats} />
                        </td>
                        <td>
                          {isFull
                            ? <span className={styles.applyDisabled}>Apply Now</span>
                            : <a
  href={`/yoga-registration?batchId=${row._id}`}
  className={styles.applyLink}
>
  Apply Now
</a>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {/* ── Note from first batch that has one, or fallback ── */}
          {seats.find(s => s.note) && (
            <p className={styles.tableNote}>
              <strong>Note:</strong> {seats.find(s => s.note)?.note}
            </p>
          )}
          <div style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}>
            <a href="#" className={styles.joinBtn}>Join Your Yoga Journey</a>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══ SYLLABUS ══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={280} opacity={0.07} /></div>

        <OmDivider label="Curriculum" />
        <VintageHeading>{content.syllabusTitle}</VintageHeading>

        {content.syllabusParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <div className={styles.syllabusGrid}>
          <div className={styles.syllabusCard}>
            {content.syllabusLeft.map((m, i) => (
              <div key={i} className={styles.syllabusModule}>
                <div className={styles.syllabusModuleIcon}><MandalaSVG size={28} opacity={0.6} /></div>
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
                <div className={styles.syllabusModuleIcon}><MandalaSVG size={28} opacity={0.6} /></div>
                <div>
                  <h3 className={styles.syllabusModuleTitle}>{m.title}</h3>
                  <p className={styles.syllabusModuleDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══ DAILY SCHEDULE ══ */}
      <section className={styles.scheduleSection}>
        <div className={styles.scheduleLayout}>
          <div className={styles.schedImgCol}>
            <div className={styles.schedImgOrnament}>
              <div className={styles.schedMandalaBg}><MandalaSVG size={340} opacity={0.25} /></div>
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
                    <span className={styles.schedDot}><MandalaSVG size={10} opacity={0.8} /></span>
                    <span>{item.time} – {item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <BorderStrip />

      {/* ══ SOUL SHINE BANNER + WHY ENROL ══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaR} aria-hidden="true"><MandalaSVG size={320} opacity={0.07} /></div>

        <OmDivider />

        {/* Soul Shine Banner */}
        <div className={styles.classBanner}>
          <CornerOrnament pos="tl" />
          <CornerOrnament pos="tr" />
          <CornerOrnament pos="bl" />
          <CornerOrnament pos="br" />
          <img
            src={content.soulShineImage
              ? imgUrl(content.soulShineImage)
              : "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1400&q=80"
            }
            alt="Yoga class Rishikesh"
            className={styles.classBannerImg}
          />
          <div className={styles.classBannerOverlay} />
          <span className={styles.letYourSoul}>{content.soulShineText || "Let Your Soul Shine"}</span>
        </div>

        <OmDivider />

        <VintageHeading>{content.enrollTitle}</VintageHeading>
        {content.enrollParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}
        <ol className={styles.vintageList}>
          {content.enrollItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
      </section>

      <BorderStrip />

      {/* ══ COMPREHENSIVE + CERTIFICATION + REGISTRATION + FEE ══ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionMandalaL} aria-hidden="true"><MandalaSVG size={300} opacity={0.065} /></div>

        <OmDivider />
        <VintageHeading>{content.comprehensiveTitle}</VintageHeading>
        {content.comprehensiveParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <OmDivider />
        <VintageHeading>{content.certTitle}</VintageHeading>
        {content.certParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
        ))}

        <OmDivider />
        <VintageHeading>{content.registrationTitle}</VintageHeading>
        {content.registrationParagraphs.map((p, i) => (
          <p key={i} className={styles.bodyText} dangerouslySetInnerHTML={{ __html: p }} />
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
                <li key={i}>
                  <span className={styles.feeDot}><MandalaSVG size={12} opacity={0.7} /></span>
                  {it}
                </li>
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
                <li key={i}>
                  <span className={styles.feeDot}><MandalaSVG size={12} opacity={0.7} /></span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <BorderStrip />
      <HowToReach />
    </div>
  );
}