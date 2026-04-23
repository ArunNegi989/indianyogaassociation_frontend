"use client";
import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-teacher-training-course-bali/Baliyogapage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import Image from "next/image";
import heroImgFallback from "@/assets/images/17.webp";
import api from "@/lib/api";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";

/* ─── Types ─── */
interface UniquePoint {
  icon: string;
  title: string;
  body: string;
}

interface Course {
  hrs: string;
  tag: string;
  color: string;
  desc?: string;
}

interface AymSpecial {
  num: string;
  title: string;
  body: string;
}

interface Chakra {
  name: string;
  color: string;
  symbol: string;
  meaning: string;
  mantra: string;
}

interface BaliPageData {
  _id: string;
  slug: string;
  status: string;

  /* HERO */
  pageTitleH1?: string;
  heroImgAlt?: string;
  heroCaption?: string;
  heroImage?: string;

  /* INTRO */
  introBannerTitle?: string;
  introBannerText?: string;
  introText?: string;
  introParagraphs?: string[];

  /* UNIQUE */
  introSuperLabel?: string;
  introTitle?: string;
  introParaCenter?: string;
  uniquePointsSectionTitle?: string;
  uniquePointsSuperLabel?: string;
  uniquePointsCenterPara?: string;
  uniquePoints?: UniquePoint[];
  uniquePointsParagraphs?: string[];

  /* DEST */
  destSuperLabel?: string;
  destTitle?: string;
  destPara1?: string;
  destPara2?: string;
  destHighlights?: string[];
  groupImage?: string;
  templeImage?: string;
  riceImage?: string;

  /* COURSES */
  coursesSuperLabel?: string;
  coursesSectionTitle?: string;
  coursesCenterPara?: string;
  courses?: Course[];

  /* HIGHLIGHTS */
  highlightsSuperLabel?: string;
  highlightsSectionTitle?: string;
  highlightsPara1?: string;
  highlightsPara2?: string;
  highlights?: string[];
  practiceImage?: string;
  teacherImage?: string;

  /* AYM */
  aymSpecialSuperLabel?: string;
  aymSpecialSectionTitle?: string;
  aymSpecial?: AymSpecial[];
  aymSpecialParagraphs?: string[];

  /* FOOTER / TEACHER STRIP */
  gardenImage?: string;
  ubudImage?: string;
  pullQuoteText?: string;
  teacherCaptionText?: string;

  footerTitle?: string;
  footerLoc?: string;
  footerMail?: string;
  footerTag?: string;
}

/* ─── Helpers ─── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const imgUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

/* Strips HTML tags to check if real text exists */
const hasText = (s?: string) =>
  !!s && s.replace(/<[^>]*>/g, "").trim().length > 0;

/* Renders backend HTML safely — prevents raw <p> tags showing as text */
const Html = ({ html, className }: { html: string; className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

/* ════════════════════════ MAIN ════════════════════════ */
export default function BaliYogaPage() {
  const [data, setData] = useState<BaliPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bali-page")
      .then((res) => {
        const d = res.data?.data;
        if (d) setData(d);
      })
      .catch((err) => console.error("Bali page API error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
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
    }, 50);
    return () => clearTimeout(timer);
  }, [loading]);

  /* ── Derived arrays — pure dynamic ── */
  const uniquePoints: UniquePoint[] = data?.uniquePoints ?? [];
  const courses: Course[] = data?.courses ?? [];
  const highlights: string[] = data?.highlights ?? [];
  const aymSpecial: AymSpecial[] = data?.aymSpecial ?? [];
  const destHighlights: string[] = data?.destHighlights ?? [];

  if (loading) {
    return (
      <div
        className={styles.page}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", color: "#f15505", opacity: 0.7 }}>
          Loading...
        </p>
      </div>
    );
  }

  const heroImage = imgUrl(data?.heroImage);

  return (
    <div className={styles.page}>
      {/* ══ Global mandala watermark ══ */}
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={800} opacity={0.025} />
      </div>

      {/* ════════════ HERO ════════════ */}
      <section className={styles.heroSection}>
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={data?.heroImgAlt || "Yoga Students Group Bali"}
            className={styles.heroImage}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image
            src={heroImgFallback}
            alt="Yoga Students Group"
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ════════════ INTRO BANNER ════════════ */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.introBanner}`}>
            <div className={styles.introBannerDeco} aria-hidden="true">
              <MandalaRing size={180} opacity={0.1} />
            </div>
            <div className={styles.introBannerText}>
              <OmBar />
              <h2 className={styles.sectionTitle}>
                {data?.introBannerTitle ||
                  "Bali: Take Your 200 Hour Yoga Teacher Training to the Next Level in Paradise"}
              </h2>

              {hasText(data?.introBannerText) && (
                <Html html={data!.introBannerText!} className={styles.para} />
              )}

              {(data?.introParagraphs ?? []).map((p, i) => (
                <Html key={i} html={p} className={styles.para} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ WHAT MAKES BALI UNIQUE ════════════ */}
      {(uniquePoints.length > 0 || hasText(data?.uniquePointsCenterPara)) && (
        <section className={`${styles.section} ${styles.sectionTinted}`}>
          <div className={styles.mandalaBg} aria-hidden="true">
            <MandalaRing size={600} opacity={0.05} />
          </div>
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.centered}`}>
              <span className={styles.superLabel}>
                {data?.uniquePointsSuperLabel || "Sacred Island"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data?.uniquePointsSectionTitle ||
                  "What Make Bali Unique for Yoga Teacher Training in Bali"}
              </h2>
              <OmBar />

              {hasText(data?.uniquePointsCenterPara) && (
                <Html
                  html={data!.uniquePointsCenterPara!}
                  className={styles.paraCenter}
                />
              )}

              {(data?.uniquePointsParagraphs ?? []).map((p, i) => (
                <Html key={i} html={p} className={styles.paraCenter} />
              ))}
            </div>

            {uniquePoints.length > 0 && (
              <div className={`${styles.reveal} ${styles.uniqueGrid}`}>
                {uniquePoints.map((u) => (
                  <div key={u.title} className={styles.uniqueCard}>
                    <span className={styles.uniqueIcon}>{u.icon}</span>
                    <h4 className={styles.uniqueTitle}>{u.title}</h4>
                    <p className={styles.uniqueBody}>{u.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════════ DESTINATION ════════════ */}
      <section id="destination" className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.reveal} ${styles.destWrap}`}>
            {/* LEFT CONTENT */}
            <div className={styles.destContentCard}>
              <span className={styles.superLabel}>
                {data?.destSuperLabel || "Our Location"}
              </span>

              <h2 className={styles.sectionTitle}>
                {data?.destTitle || "Our Destination"}
              </h2>

              <OmBar align="left" />

              {hasText(data?.destPara1) && (
                <Html html={data!.destPara1!} className={styles.para} />
              )}

              {hasText(data?.destPara2) && (
                <Html html={data!.destPara2!} className={styles.para} />
              )}

              {destHighlights.length > 0 && (
                <div className={styles.destPills}>
                  {destHighlights.map((p) => (
                    <span key={p} className={styles.destPill}>
                      ✦ {p}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT VISUAL */}
            <div className={styles.destVisual}>
              {/* TOP 2 IMAGES */}
              <div className={styles.destTopRow}>
                {imgUrl(data?.templeImage) && (
                  <div className={styles.destTopImg}>
                    <img src={imgUrl(data?.templeImage)} alt="Bali temple" />
                  </div>
                )}

                {imgUrl(data?.riceImage) && (
                  <div className={styles.destTopImg}>
                    <img
                      src={imgUrl(data?.riceImage)}
                      alt="Rice terraces Ubud"
                    />
                  </div>
                )}
              </div>

              {/* BOTTOM FULL IMAGE */}
              {imgUrl(data?.groupImage) && (
                <div className={styles.destBottomImg}>
                  <img src={imgUrl(data?.groupImage)} alt="Yoga group Bali" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FULL-WIDTH IMAGE BREAK ════════════ */}
      {imgUrl(data?.gardenImage) && (
        <div className={styles.imgBreak}>
          <img
            src={imgUrl(data?.gardenImage)}
            alt="Yoga in Bali garden"
            className={styles.imgBreakPhoto}
          />
          <div className={styles.imgBreakVeil} />
          <div className={styles.imgBreakQuote}>
            <OmBar />
            {hasText(data?.pullQuoteText) ? (
              <div className={styles.pullQuote}>
                <span className={styles.qMark}>&ldquo;</span>
                <Html html={data!.pullQuoteText!} />
                <span className={styles.qMark}>&rdquo;</span>
              </div>
            ) : (
              <p className={styles.pullQuote}>
                <span className={styles.qMark}>&ldquo;</span>
                Yoga is not about touching your toes.
                <br />
                It is what you learn on the way down.
                <span className={styles.qMark}>&rdquo;</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* ════════════ COURSES ════════════ */}
      {courses.length > 0 && (
        <section
          id="courses"
          className={`${styles.section} ${styles.sectionTinted}`}
        >
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
                {data?.coursesSuperLabel || "Programmes"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data?.coursesSectionTitle || "Courses Provided"}
              </h2>
              <OmBar />
              {hasText(data?.coursesCenterPara) && (
                <Html
                  html={data!.coursesCenterPara!}
                  className={styles.paraCenter}
                />
              )}
            </div>

            <div className={`${styles.reveal} ${styles.coursesRow}`}>
              {courses.map((c) => (
                <div
                  key={c.hrs}
                  className={styles.courseCard}
                  style={{ "--cc": c.color } as React.CSSProperties}
                >
                  <div className={styles.courseCardMandala} aria-hidden="true">
                    <MandalaRing size={220} opacity={0.1} />
                  </div>
                  <div className={styles.courseHrs}>
                    {c.hrs}
                    <sub>HR</sub>
                  </div>
                  <div className={styles.courseTag}>{c.tag} Programme</div>
                  <h3 className={styles.courseTitle}>
                    {c.hrs}-Hour Yoga Teacher Training in Bali
                  </h3>
                  {hasText(c.desc) && (
                    <Html html={c.desc!} className={styles.courseDesc} />
                  )}
                  <a href="#apply" className={styles.courseBtn}>
                    Enquire →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════ HIGHLIGHTS ════════════ */}
      {(highlights.length > 0 ||
        hasText(data?.highlightsPara1) ||
        hasText(data?.highlightsPara2)) && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.hlGrid}`}>
              <div className={styles.hlLeft}>
                <span className={styles.superLabel}>
                  {data?.highlightsSuperLabel || "Curriculum"}
                </span>
                <h2 className={styles.sectionTitle}>
                  {data?.highlightsSectionTitle || "Highlights of the Courses"}
                </h2>
                <OmBar align="left" />

                {hasText(data?.highlightsPara1) && (
                  <Html html={data!.highlightsPara1!} className={styles.para} />
                )}
                {hasText(data?.highlightsPara2) && (
                  <Html html={data!.highlightsPara2!} className={styles.para} />
                )}

                {highlights.length > 0 && (
                  <ul className={styles.hlList}>
                    {highlights.map((h, i) => (
                      <li key={i} className={styles.hlItem}>
                        <span className={styles.hlBullet}>✦</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.hlRight}>
                {imgUrl(data?.practiceImage) && (
                  <div className={styles.hlImageWrap}>
                    <img
                      src={imgUrl(data?.practiceImage)}
                      alt="Yoga practice Bali"
                    />
                    <div className={styles.hlImageFrame} />
                    <div className={styles.hlImageMandala} aria-hidden="true">
                      <MandalaRing size={160} opacity={0.15} />
                    </div>
                  </div>
                )}
                {imgUrl(data?.teacherImage) && (
                  <div className={styles.hlImageWrap2}>
                    <img
                      src={imgUrl(data?.teacherImage)}
                      alt="Yoga teacher Bali"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════ WHAT MAKES AYM SPECIAL ════════════ */}
      {aymSpecial.length > 0 && (
        <section className={`${styles.section} ${styles.sectionTinted}`}>
          <div className={styles.container}>
            <div className={`${styles.reveal} ${styles.centered}`}>
              <span className={styles.superLabel}>
                {data?.aymSpecialSuperLabel || "Why AYM"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data?.aymSpecialSectionTitle ||
                  "What makes AYM yoga school training special?"}
              </h2>
              <OmBar />
              {(data?.aymSpecialParagraphs ?? []).map((p, i) => (
                <Html key={i} html={p} className={styles.paraCenter} />
              ))}
            </div>
            <div className={`${styles.reveal} ${styles.aymGrid}`}>
              {aymSpecial.map((a) => (
                <div key={a.num} className={styles.aymCard}>
                  <div className={styles.aymNum}>{a.num}</div>
                  <h4 className={styles.aymTitle}>{a.title}</h4>
                  <p className={styles.aymBody}>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════ TEACHER PHOTO STRIP ════════════ */}
      {imgUrl(data?.ubudImage) && (
        <section className={styles.teacherStrip}>
          <div className={styles.teacherStripMandala} aria-hidden="true">
            <MandalaRing size={300} opacity={0.1} />
          </div>

          <div className={styles.teacherImgWrap}>
            <img
              src={imgUrl(data?.ubudImage)}
              alt="Yoga teacher Bali garden"
              className={styles.teacherImg}
            />
            <div className={styles.teacherImgVeil} />
          </div>
          <div className={styles.teacherCaption}>
            <OmBar dark />
            {hasText(data?.teacherCaptionText) ? (
              <Html html={data!.teacherCaptionText!} />
            ) : (
              <p>
                Experience the transformative power of yoga in the heart of Bali
              </p>
            )}
          </div>
        </section>
      )}
      <PremiumGallerySection type="both" backgroundColor="warm" />
      {/* ✅ REVIEWS — now a reusable separate component */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />

      <HowToReach />
    </div>
  );
}

/* ─────────────── SUB-COMPONENTS ─────────────── */
function OmBar({
  align = "center",
  dark = false,
}: {
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={styles.omBar}
      style={{ justifyContent: align === "left" ? "flex-start" : "center" }}
    >
      <span
        className={styles.omBarLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,0.6),transparent)",
              }
            : {}
        }
      />
      <span
        className={styles.omBarGlyph}
        style={dark ? { color: "#f5b800" } : {}}
      >
        ॐ
      </span>
      <span
        className={styles.omBarLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,0.6),transparent)",
              }
            : {}
        }
      />
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
  const rings = [0.46, 0.36, 0.26, 0.15].map((r) => r * size);
  const spokes = 24,
    petals = 16;
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
              rx={size * 0.065}
              ry={size * 0.022}
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
  const radii = [0.47, 0.39, 0.31, 0.23, 0.15, 0.08].map((r) => r * size);
  const colors = [
    "#f15505",
    "#F15505",
    "#f15505",
    "#f15505",
    "#F15505",
    "#f15505",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g transform={`translate(${c},${c})`}>
        {radii.map((r, i) => (
          <circle
            key={i}
            cx={0}
            cy={0}
            r={r}
            stroke={colors[i]}
            strokeWidth="0.65"
            fill="none"
          />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return (
            <line
              key={i}
              stroke="#f15505"
              strokeWidth="0.5"
              x1={radii[4] * Math.cos(a)}
              y1={radii[4] * Math.sin(a)}
              x2={radii[0] * Math.cos(a)}
              y2={radii[0] * Math.sin(a)}
            />
          );
        })}
        {[
          { n: 8, rOuter: 0.34 },
          { n: 16, rOuter: 0.22 },
        ].map(({ n, rOuter }, gi) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const R = rOuter * size;
            return (
              <ellipse
                key={`${gi}-${i}`}
                stroke="#f15505"
                strokeWidth="0.55"
                fill="none"
                cx={R * Math.cos(a)}
                cy={R * Math.sin(a)}
                rx={size * (gi === 0 ? 0.07 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${R * Math.sin(a)})`}
              />
            );
          }),
        )}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * 2 * Math.PI;
          const r0 = radii[5],
            r1 = radii[4];
          return (
            <line
              key={`star-${i}`}
              stroke="#F15505"
              strokeWidth="0.6"
              x1={r0 * Math.cos(a)}
              y1={r0 * Math.sin(a)}
              x2={r1 * Math.cos(a + Math.PI / 8)}
              y2={r1 * Math.sin(a + Math.PI / 8)}
            />
          );
        })}
      </g>
    </svg>
  );
}
