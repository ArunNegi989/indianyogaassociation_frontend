"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/style/world-wide/Worldwidepage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import heroImgFallback from "@/assets/images/18.webp";
import api from "@/lib/api"; // ← your axios instance

/* ─── Types ─── */
interface Stat {
  val: string;
  label: string;
}

interface Benefit {
  num: string;
  text: string;
}

interface Location {
  name: string;
  flag: string;
  href: string;
  region: string;
}

interface WorldwideData {
  slug: string;
  status: string;

  pageTitleH1: string;
  heroImgAlt: string;
  heroImage: string;

  topParagraphs: string[];

  statsTitle: string;
  stats: Stat[];

  curriculumTitle: string;
  curriculumSubHeading: string;
  curriculumIntro: string;
  curriculumParagraphs: string[];
  curriculumItems: string[];
  curriculumRightImage: string;
  curriculumRightImageAlt: string;

  teacherTeamTitle: string;
  teacherTeamSubtitle: string;
  teacherTeamDescription: string;
  teacherTeamLeftImage: string;
  teacherTeamLeftImageAlt: string;
  teacherTeamBadgeValue: string;
  teacherTeamBadgeLabel: string;

  benefitsHeading: string;
  benefitsTitle: string;
  benefitsSubtext: string;
  benefits: Benefit[];

  wellnessTitle: string;
  wellnessDescription: string;

  communityTitle: string;
  communitySubtext: string;
  communityDescription: string;

  locationsTitle: string;
  locationsSubtext: string;
  locations: Location[];

  footerTitle: string;
  footerSubtext: string;
  footerMetaText: string;
}



/* ─── Base URL for uploaded images ─── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const resolveImg = (path?: string) => {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
};
const images = [
  "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1600",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600",
  "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1600",
];
/* ═══════════════════════ MAIN ═══════════════════════ */
export default function WorldwidePage() {
  const [data, setData] = useState<WorldwideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);


   
useEffect(() => {
  let index = 0;
  const slider = sliderRef.current;
  if (!slider) return;

  const slides = slider.children.length;

  const interval = setInterval(() => {
    index++;

    slider.style.transition = "transform 0.8s ease";
    slider.style.transform = `translateX(-${index * 100}%)`;

    if (index === slides - 1) {
      setTimeout(() => {
        slider.style.transition = "none";
        slider.style.transform = "translateX(0)";
        index = 0;
      }, 800);
    }
  }, 4000);

  return () => clearInterval(interval);
}, []);
  /* ── Fetch from backend using axios ── */
  useEffect(() => {
    api
      .get("/worldwide/content")
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          throw new Error("Invalid response");
        }
      })
      .catch((err) => {
        console.error("WorldwidePage fetch error:", err);
        setError(err.message || "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Scroll reveal (runs after data loads) ── */
  useEffect(() => {
    if (!data) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(`.${styles.reveal}`)
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [data]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className={styles.page}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "1.2rem",
            color: "#f15505",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !data) {
    return (
      <div className={styles.page}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            fontSize: "1.1rem",
            color: "#c00",
          }}
        >
          Content could not be loaded. Please try again later.
        </div>
      </div>
    );
  }

  const heroSrc = resolveImg(data.heroImage);

  return (
    <div className={styles.page}>
      {/* ── Global mandala watermark ── */}
      <div className={styles.pageWm} aria-hidden="true">
        <MandalaFull size={800} opacity={0.025} />
      </div>

      {/* ════════ HERO SECTION ════════ */}
      <section className={styles.heroSection}>
        {heroSrc ? (
          <img
            src={heroSrc}
            alt={data.heroImgAlt || "Yoga Students Group"}
            className={styles.heroImage}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <Image
            src={heroImgFallback}
            alt={data.heroImgAlt || "Yoga Students Group"}
            width={1180}
            height={540}
            className={styles.heroImage}
            priority
          />
        )}
      </section>

      {/* ════════ STATS BAR ════════ */}
      {data.stats?.length > 0 && (
        <div className={styles.statsBar}>
          <div className="container">
            <div className="row g-0">
              {data.stats.map((s) => (
                <div key={s.label} className="col-6 col-md-3">
                  <div className={styles.statCell}>
                    <span className={styles.statVal}>{s.val}</span>
                    <span className={styles.statLbl}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ CURRICULUM ════════ */}
     <section id="curriculum" className={styles.section}>
  <div className={styles.mandalaBg} aria-hidden="true">
    <MandalaRing size={580} opacity={0.04} />
  </div>

  <div className="container">

    {/* TOP ROW */}
    <div className={`row ${styles.reveal}`}>
      
      {/* LEFT CONTENT */}
      <div className="col-12 col-lg-6">
        <span className={styles.superLabel}>
          {data.curriculumSubHeading || "What You'll Study"}
        </span>

        <h2 className={styles.sectionTitle}>
          {data.curriculumTitle || "Course Curriculum"}
        </h2>

        <OmBar align="left" />

        {data.topParagraphs?.map((para, i) => (
          <p key={i} className={styles.para}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}

        {data.curriculumIntro && (
          <p className={styles.para}
            dangerouslySetInnerHTML={{ __html: data.curriculumIntro }}
          />
        )}

        {data.curriculumParagraphs?.map((para, i) => (
          <p key={i} className={styles.para}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}
      </div>

      {/* RIGHT IMAGE */}
      <div className="col-12 col-lg-6 mt-4 mt-lg-0">
        <div className={styles.curriculumImgWrap}>
          <img
            src={
              resolveImg(data.curriculumRightImage) ||
              "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80"
            }
            alt={data.curriculumRightImageAlt || "Yoga curriculum"}
            className={styles.curriculumImg}
          />
          <div className={styles.imgMandalaCorner} aria-hidden="true">
            <MandalaRing size={180} opacity={0.18} />
          </div>
        </div>
      </div>

    </div>

    {/* 🔥 FULL WIDTH CARDS */}
    {data.curriculumItems?.length > 0 && (
      <div className={`${styles.curriculumGrid} ${styles.fullWidthGrid}`}>
        {data.curriculumItems.map((c, i) => (
          <div key={i} className={styles.curriculumCard}>
            
            <div className={styles.cardNumber}>
              {String(i + 1).padStart(2, "0")}
            </div>

            <p className={styles.cardText}>{c}</p>

          </div>
        ))}
      </div>
    )}

  </div>
</section>

      {/* ════════ TEACHER TEAM ════════ */}
      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className="container">
          <div className={`row align-items-center ${styles.reveal}`}>
            <div className="col-12 col-lg-5 mb-4 mb-lg-0">
              <div className={styles.teamImgWrap}>
                <img
                  src={
                    resolveImg(data.teacherTeamLeftImage) ||
                    "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=900&q=80"
                  }
                  alt={
                    data.teacherTeamLeftImageAlt || "Experienced yoga teachers"
                  }
                  className={styles.teamImg}
                />
                {(data.teacherTeamBadgeValue || data.teacherTeamBadgeLabel) && (
                  <div className={styles.teamImgBadge}>
                    <span className={styles.teamBadgeVal}>
                      {data.teacherTeamBadgeValue}
                    </span>
                    <span className={styles.teamBadgeLbl}>
                      {data.teacherTeamBadgeLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-7 ps-lg-5">
              <span className={styles.superLabel}>
                {data.teacherTeamSubtitle || "Our Faculty"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data.teacherTeamTitle || "Experienced Yoga Teacher Team"}
              </h2>
              <OmBar align="left" />
              {data.teacherTeamDescription && (
                <p
                  className={styles.para}
                  dangerouslySetInnerHTML={{
                    __html: data.teacherTeamDescription,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BENEFITS ════════ */}
      {data.benefits?.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <div className={`text-center mb-4 ${styles.reveal}`}>
              <span className={styles.superLabel}>
                {data.benefitsHeading || "Transformation"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data.benefitsTitle || "How will you Benefit from this Course?"}
              </h2>
              <OmBar />
              {data.benefitsSubtext && (
                <p
                  className={`${styles.paraCenter} mx-auto`}
                  style={{ maxWidth: 760 }}
                  dangerouslySetInnerHTML={{ __html: data.benefitsSubtext }}
                />
              )}
            </div>

            <div className={`row g-3 ${styles.reveal}`}>
              {data.benefits.map((b) => (
                <div key={b.num} className="col-12 col-md-6">
                  <div className={styles.benefitCard}>
                    <div className={styles.benefitNum}>{b.num}</div>
                    <p className={styles.benefitText}>{b.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Wellness Box */}
            {(data.wellnessTitle || data.wellnessDescription) && (
              <div className={`${styles.wellnessBox} ${styles.reveal} mt-5`}>
                <div className={styles.wellnessMandala} aria-hidden="true">
                  <MandalaRing size={200} opacity={0.1} />
                </div>
                <div className="row align-items-center">
                  <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
                    <div className={styles.wellnessIcon}>🌿</div>
                    <h3
                      className={styles.wellnessTitle}
                      dangerouslySetInnerHTML={{
                        __html: data.wellnessTitle || "Commit to Wellness",
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-9">
                    <p
                      className={styles.para}
                      style={{ margin: 0 }}
                      dangerouslySetInnerHTML={{
                        __html: data.wellnessDescription || "",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ════════ JOIN COMMUNITY ════════ */}
      {(data.communityTitle || data.communityDescription) && (
        <section className={`${styles.section} ${styles.sectionTinted}`}>
          <div className={styles.mandalaBgR} aria-hidden="true">
            <MandalaRing size={500} opacity={0.04} />
          </div>
          <div className="container">
            <div className={styles.reveal}>
              <span className={styles.superLabel}  style={{textAlign:"center"}}>
                {data.communitySubtext || "Worldwide Network"}
              </span>
              <h2 className={styles.sectionTitle} style={{textAlign:"center"}}>{data.communityTitle}</h2>
              <OmBar align="center" />
              {data.communityDescription && (
                <p
                  className={styles.para}
                 
                  dangerouslySetInnerHTML={{
                    __html: data.communityDescription,
                  }}
                />
              )}

              <div className={styles.fullSlider}>
  <div className={styles.sliderWrapper} ref={sliderRef}>
  
  {images.map((img, i) => (
    <div key={i} className={styles.fullSlide}>
      <img src={img} alt="Yoga Slide" />
    </div>
  ))}

  {/* 🔥 duplicate first image */}
  <div className={styles.fullSlide}>
    <img src={images[0]} alt="Yoga Slide" />
  </div>

</div>
</div>
            </div>
          </div>
        </section>
      )}

      {/* ════════ WORLDWIDE LOCATIONS GRID ════════ */}
      {data.locations?.length > 0 && (
        <section
          id="locations"
          className={`${styles.section} ${styles.locationsSection}`}
        >
          <div className="container">
            <div className={`text-center mb-5 ${styles.reveal}`}>
              <span className={styles.superLabel}>
                {data.locationsSubtext || "Our Global Reach"}
              </span>
              <h2 className={styles.sectionTitle}>
                {data.locationsTitle ||
                  "Yoga Teacher Training Locations Worldwide"}
              </h2>
              <OmBar />
            </div>

            <div className={`row g-3 ${styles.reveal}`}>
              {data.locations.map((loc) => (
                <div key={loc.name} className="col-12 col-sm-6 col-lg-4">
                  <div className={styles.locationCard}>
                    <div className={styles.locationCardInner}>
                      <div className={styles.cardMandala} aria-hidden="true">
                        <MandalaRing size={120} opacity={0.08} />
                      </div>
                      <div className={styles.locationTop}>
                        <span className={styles.locationFlag}>{loc.flag}</span>
                        <span className={styles.locationRegion}>
                          {loc.region}
                        </span>
                      </div>
                      <h3 className={styles.locationName}>{loc.name}</h3>
                      <Link
                        href={loc.href}
                        className={styles.readMoreBtn}
                        aria-label={`Read more about ${loc.name}`}
                      >
                        <span className={styles.readMoreArrow}>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                        <span className={styles.readMoreText}>Read more</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ FOOTER CTA ════════ */}
      <section className={styles.footerCta}>
        <div className={styles.footerCtaMandala} aria-hidden="true">
          <MandalaFull size={600} opacity={0.09} />
        </div>
        <div className="container">
          <div className={`text-center ${styles.footerCtaInner}`}>
            <div className={styles.footerOm}>ॐ</div>
            <h2 className={styles.footerTitle}>
              {data.footerTitle || "Begin Your Sacred Journey"}
            </h2>
            <OmBar dark />
            {data.footerSubtext && (
              <p className={styles.footerSub}>{data.footerSubtext}</p>
            )}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
              <Link href="/apply" className={styles.btnPrimary}>
                Apply Now
              </Link>
              <a
                href="mailto:aymyogaschool@gmail.com"
                className={styles.btnGhost}
              >
                Email Us
              </a>
            </div>
            {data.footerMetaText && (
              <div
                className={styles.footerMeta}
                dangerouslySetInnerHTML={{ __html: data.footerMetaText }}
              />
            )}
          </div>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}

/* ─── SHARED COMPONENTS ─── */
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
        className={styles.omLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)",
              }
            : {}
        }
      />
      <span className={styles.omGlyph} style={dark ? { color: "#f5b800" } : {}}>
        ॐ
      </span>
      <span
        className={styles.omLine}
        style={
          dark
            ? {
                background:
                  "linear-gradient(90deg,transparent,rgba(245,184,0,.55),transparent)",
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
      <g stroke="#f15505" strokeWidth="0.75" fill="none">
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
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <g transform={`translate(${c},${c})`} stroke="#f15505" fill="none">
        {[0.47, 0.39, 0.31, 0.23, 0.15, 0.08].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r * size} strokeWidth="0.65" />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * 2 * Math.PI;
          return (
            <line
              key={i}
              strokeWidth="0.5"
              x1={size * 0.08 * Math.cos(a)}
              y1={size * 0.08 * Math.sin(a)}
              x2={size * 0.47 * Math.cos(a)}
              y2={size * 0.47 * Math.sin(a)}
            />
          );
        })}
        {[
          { n: 8, r: 0.34 },
          { n: 16, r: 0.22 },
        ].map(({ n, r }, gi) =>
          Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * 2 * Math.PI;
            const R = r * size;
            return (
              <ellipse
                key={`${gi}-${i}`}
                strokeWidth="0.55"
                cx={R * Math.cos(a)}
                cy={R * Math.sin(a)}
                rx={size * (gi === 0 ? 0.07 : 0.04)}
                ry={size * 0.02}
                transform={`rotate(${(i / n) * 360} ${R * Math.cos(a)} ${R * Math.sin(a)})`}
              />
            );
          }),
        )}
      </g>
    </svg>
  );
}
