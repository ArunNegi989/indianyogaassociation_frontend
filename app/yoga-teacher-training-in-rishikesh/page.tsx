"use client";

import React, { useState, useEffect } from "react";
import styles from "@/assets/style/yoga-teacher-training-in-rishikesh/Bestyogaschool.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import StickySectionNav from "@/components/common/StickySectionNav";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface AccredBadge {
  id: string;
  label: string;
  badge: string;
  imgUrl: string;
}

interface CourseCard {
  id: string;
  title: string;
  description: string;
  duration: string;
  certificate: string;
  detailsLabel: string;
  detailsHref: string;
  bookHref: string;
  imgAlt: string;
  imgUrl: string;
  reverse: boolean;
}

interface InlineLink {
  id: string;
  text: string;
  href: string;
}

interface HeroMedia {
  imageSrc: string;
  imageAlt: string;
  videoEmbedUrl: string;
  caption?: string;
}

interface PageData {
  _id: string;
  status: string;
  heroTitle: string;
  heroImage: string;
  accrSectionTitle: string;
  coursesSectionTitle: string;
  specialtySectionTitle: string;
  bodyParagraphs1: string[];
  bodyParagraphs2: string[];
  accredBadges: AccredBadge[];
  courseCards: CourseCard[];
  specialtyCourses: CourseCard[];
  inlineLinks: InlineLink[];
  inlineLinks2: InlineLink[];
  heroMedia?: HeroMedia;
}

const NAV_ITEMS = [
  { label: "INTRO", id: "intro" },
  { label: "COURSES", id: "courses" },
  { label: "SPECIALTY", id: "specialty" },
  { label: "GALLERY", id: "gallery" },
  { label: "REVIEWS", id: "reviews" },
  { label: "LOCATION", id: "location" },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function imgSrc(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

/* ─────────────────────────────────────────
   INLINE SVG MANDALA
───────────────────────────────────────── */
const MandalaSVG = ({
  size = 300,
  c1 = "#F15505",
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
    <g fill="none" stroke={c2} strokeWidth={sw * 0.55} opacity="0.22">
      <ellipse cx="150" cy="150" rx="145" ry="60" />
      <ellipse cx="150" cy="150" rx="60" ry="145" />
      <ellipse cx="150" cy="150" rx="145" ry="95" />
      <ellipse cx="150" cy="150" rx="95" ry="145" />
    </g>
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.18">
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
   CERTIFICATE CARD
───────────────────────────────────────── */
const CertCard = ({ label, badge, imgUrl }: AccredBadge) => (
  <div className={styles.certCard}>
    <div className={styles.certImgWrap}>
      <img
        src={imgSrc(imgUrl)}
        alt={label}
        className={styles.certImg}
        loading="lazy"
      />
      <span className={styles.certBadge}>{badge}</span>
      <span className={styles.certOrg}>
        {badge === "YCB" ? "Ministry of AYUSH" : "Yoga Alliance"}
      </span>
    </div>
    <div className={styles.certBody}>
      <div className={styles.certIconRing}>
        {badge === "YCB" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="14" rx="2" />
            <path d="M8 17v3M16 17v3M8 20h8" />
            <path d="M9 10l2 2 4-4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        )}
      </div>
      <p className={styles.certLabel}>{label}</p>
      <div className={styles.certDots}>
        <span className={styles.certDot} />
        <span className={styles.certDot} />
        <span className={styles.certDot} />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   ENHANCED COURSE CARD COMPONENT
═══════════════════════════════════════════ */
const CourseCardComp = ({
  title,
  description,
  duration,
  certificate,
  detailsLabel,
  detailsHref = "#",
  bookHref = "#",
  imgUrl,
  imgAlt,
  reverse = false,
  tag,
  imgNum,
}: CourseCard & { tag?: string; imgNum?: string }) => (
  <div className={`${styles.courseCardEnhanced} ${reverse ? styles.courseCardRevEnhanced : ""}`}>
    <div className={styles.courseCardInner}>
      <div className={styles.courseMedia}>
        <div className={styles.courseImgWrapper}>
          <img src={imgSrc(imgUrl)} alt={imgAlt} className={styles.courseImgEnhanced} loading="lazy" />
          <div className={styles.courseImgOverlayEnhanced} />
          {imgNum && <span className={styles.courseImgNumber}>{imgNum}</span>}
          <div className={styles.courseDurationBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span>{duration}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.courseContent}>
        {tag && <div className={styles.courseTagEnhanced}>{tag}</div>}
        <h3 className={styles.courseTitleEnhanced}>{title}</h3>
        <div className={styles.courseTitleLineEnhanced} />
        <p className={styles.courseDescriptionEnhanced}>{description}</p>
        
        <div className={styles.courseSpecsGrid}>
          <div className={styles.courseSpecItem}>
            <div className={styles.courseSpecIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 17v4M16 17v4M8 21h8" />
                <path d="M9 10l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className={styles.courseSpecLabel}>Certificate</span>
              <p className={styles.courseSpecValue}>{certificate}</p>
            </div>
          </div>
        </div>
        
        <div className={styles.courseActions}>
          <a href={detailsHref} className={styles.btnPrimaryEnhanced}>
            {detailsLabel}
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
          <a href={bookHref} className={styles.btnSecondaryEnhanced}>
            Book Now
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M5 10h10M10 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   SPECIALTY COURSE CARD (HORIZONTAL FLIP STYLE)
═══════════════════════════════════════════ */
const SpecialtyCourseCard = ({
  title,
  description,
  duration,
  certificate,
  detailsLabel,
  detailsHref = "#",
  bookHref = "#",
  imgUrl,
  imgAlt,
  reverse = false,
}: CourseCard) => (
  <div className={`${styles.scCard} ${reverse ? styles.scCardRev : ""}`}>
    <div className={styles.scImgSide}>
      <img
        src={imgSrc(imgUrl)}
        alt={imgAlt}
        className={styles.scImg}
        loading="lazy"
      />
      <div className={styles.scImgOverlay} />
      {duration && <span className={styles.scChip}>{duration}</span>}
    </div>
    <div className={styles.scBody}>
      {certificate && <p className={styles.scEyebrow}>{certificate}</p>}
      <h3 className={styles.scTitle}>{title}</h3>
      <div className={styles.scTitleLine} />
      {description && <p className={styles.scDesc}>{description}</p>}
      <div className={styles.scMeta}>
        {duration && (
          <div className={styles.scMetaItem}>
            <div className={styles.scMetaIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <span className={styles.scMetaLbl}>Duration</span>
              <p className={styles.scMetaVal}>{duration}</p>
            </div>
          </div>
        )}
        {certificate && (
          <div className={styles.scMetaItem}>
            <div className={styles.scMetaIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 17v4M16 17v4M8 21h8" /><path d="M9 10l2 2 4-4" />
              </svg>
            </div>
            <div>
              <span className={styles.scMetaLbl}>Certificate</span>
              <p className={styles.scMetaVal}>{certificate}</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.scBtns}>
        <a href={detailsHref} className={styles.scBtnPrimary}>
          {detailsLabel}
          <svg viewBox="0 0 20 20" fill="none" width="12" height="12">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </a>
        <a href={bookHref} className={styles.scBtnOutline}>Book Now</a>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   COURSE INFO CARD
═══════════════════════════════════════════ */
const DurationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const LevelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="5" height="7" rx="1" />
    <rect x="9.5" y="9" width="5" height="12" rx="1" />
    <rect x="17" y="4" width="5" height="17" rx="1" />
  </svg>
);

const CertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 17v4M16 17v4M8 21h8" />
    <path d="M9 10l2 2 4-4" />
  </svg>
);

const StyleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="1.5" />
    <path d="M12 6v5.5" />
    <path d="M8.5 13c0 2 1.5 4 3.5 4.5 2-0.5 3.5-2.5 3.5-4.5" />
    <path d="M10 18l-1.5 3.5M14 18l1.5 3.5" />
    <path d="M7 11l5 2.5 5-2.5" />
  </svg>
);

const LangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const DateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
);

function CourseInfoCard() {
  const details = [
    { icon: <DurationIcon />, label: "DURATION", value: "24 Days" },
    { icon: <LevelIcon />, label: "LEVEL", value: "Advanced" },
    { icon: <CertIcon />, label: "CERTIFICATION", value: "500 Hour" },
    {
      icon: <StyleIcon />,
      label: "YOGA STYLE",
      value: "Multistyle",
      sub: "Ashtanga, Vinyasa & Hatha",
    },
    { icon: <LangIcon />, label: "LANGUAGE", value: "English & Hindi" },
    { icon: <DateIcon />, label: "DATE", value: "Check batches below" },
  ];

  return (
    <div className={styles.icWrap}>
      <div className={styles.icCard}>
        <div className={styles.icLeft}>
          <div className={styles.icHdr}>
            <span className={styles.icHdrTxt}>COURSE DETAILS</span>
          </div>
          <div className={styles.icGrid}>
            {details.map((d, i) => (
              <div key={i} className={styles.icItem}>
                <div className={styles.icIcon}>{d.icon}</div>
                <div className={styles.icBody}>
                  <div className={styles.icLbl}>{d.label}</div>
                  <div className={styles.icVal}>{d.value}</div>
                  {d.sub && <div className={styles.icSub}>{d.sub}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.icVDiv} />
        <div className={styles.icRight}>
          <div className={styles.icFeeTop}>
            <span className={styles.icFeeLbl}>COURSE FEE</span>
            <span className={styles.icFeeFrom}>starting from</span>
          </div>
          <div className={styles.icPriceRow}>
            <span className={styles.icPriceOld}>$1799</span>
            <span className={styles.icPriceNew}>$999</span>
            <span className={styles.icPriceCur}>USD</span>
          </div>
          <a href="#apply" className={styles.icBookBtn}>
            BOOK NOW
            <svg viewBox="0 0 20 20" fill="none" className={styles.icBtnArrow}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
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
      Loading...
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════ */
export default function BestYogaSchool() {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaMode, setMediaMode] = useState<"img" | "vid">("img");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await api.get("/best-yoga-school/get");
        if (res?.success && res?.data) {
          setData(res.data);
        } else {
          setError("Content not available.");
        }
      } catch {
        setError("Failed to load page content.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;
  if (error || !data) {
    return (
      <div
        className={styles.page}
        style={{ padding: "4rem", textAlign: "center", color: "#c00" }}
      >
        {error || "Something went wrong."}
      </div>
    );
  }

  const mediaSrc = data.heroMedia?.imageSrc
    ? imgSrc(data.heroMedia.imageSrc)
    : imgSrc(data.heroImage);
  const mediaAlt = data.heroMedia?.imageAlt ?? data.heroTitle ?? "";
  const videoUrl = data.heroMedia?.videoEmbedUrl ?? "";
  const hasVideo = Boolean(videoUrl);

  return (
    <div className={styles.page}>
      {/* ── Mandala Decorations ── */}
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ══ HERO IMAGE with id="hero" for StickySectionNav ══ */}
      {data.heroImage && (
        <section id="hero" className={styles.heroSection}>
          <img
            src={imgSrc(data.heroImage)}
            alt={data.heroTitle || "Yoga Students Group"}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}

      {/* ══ COURSE INFO CARD ══ */}
      <CourseInfoCard />

      {/* ══ STICKY SECTION NAV — exactly like 300hr page ══ */}
      <StickySectionNav items={NAV_ITEMS} triggerId="hero" />

      {/* ══════════════════════════════════════
          SECTION 1 — INTRO + ACCREDITATIONS (ENHANCED WITH MULTIPLE MEDIA)
      ═════════════════════════════════════════ */}
      <section id="intro" className={`${styles.section} ${styles.sectionLight}`}>
        <div className={`container px-3 px-md-4 ${styles.maxx}`}>
          {data.heroTitle && (
            <h1 className={styles.heroTitle}>{data.heroTitle}</h1>
          )}
          <OmDivider />

          {/* Content first, then media gallery */}
          <div className={styles.contentFirstLayout}>
            {/* Text Content */}
            <div className={styles.textContentBlock}>
              <div className={styles.contentIntroEnhanced}>
                <span className={styles.contentBadgeEnhanced}>Welcome to AYM Yoga School</span>
                <h2 className={styles.contentTitleEnhanced}>
                  Best Yoga Teacher Training in <span className={styles.highlightText}>Rishikesh</span>
                </h2>
                <div className={styles.contentUnderlineEnhanced} />
              </div>

              <div className={styles.contentTextEnhanced}>
                <p className={styles.bodyParaEnhanced}>
                  Best Yoga Teacher Training in Rishikesh is written on every school website's wall. 
                  The world capital of yoga, lush green forests surround Rishikesh, the Holy River 
                  mother Ganga, and thousands of spiritual ashrams for learning the best yoga in the world. 
                  It is also a highly recommended and famous destination for the best yoga teacher training 
                  in Rishikesh. Rishikesh is known as a spiritual energy spot. It attracts millions of 
                  devotees worldwide, seeking an inner spiritual journey through yoga.
                </p>
                
                <p className={styles.bodyParaEnhanced}>
                  The Association for Yoga and Meditation - the best yoga school in Rishikesh 
                  (AYM Yoga School in Rishikesh) is registered with the Yoga Alliance USA and situated 
                  in this beautiful lap of green mountains. Our primary objective is to train the best 
                  yoga teachers through the best yoga master, using the best modern technology to 
                  understand the ancient science of yoga. Our syllabus is designed to give the students 
                  complete exposure to yogic techniques in 200 hour residential yoga teacher training 
                  in Rishikesh, 300 hour residential yoga teacher training in Rishikesh and 500 hours 
                  residential yoga teacher teaching certifications in Rishikesh India.
                </p>
              </div>

              {data.inlineLinks?.length > 0 && (
                <div className={styles.linkGroupEnhanced}>
                  {data.inlineLinks.map((link) => (
                    <a key={link.id} href={link.href} className={styles.linkPillEnhanced}>
                      {link.text}
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Media Gallery Block */}
            <div className={styles.mediaGalleryBlock}>
              <div className={styles.mediaGrid}>
                {/* Main Large Image */}
                <div className={styles.mediaMainItem}>
                  {hasVideo && mediaMode === "vid" ? (
                    <iframe 
                      src={videoUrl} 
                      className={styles.mediaMainVideo} 
                      allow="autoplay; encrypted-media" 
                      allowFullScreen
                      title="Yoga Teacher Training Video"
                    />
                  ) : (
                    <img src={mediaSrc} alt={mediaAlt} className={styles.mediaMainImg} loading="lazy" />
                  )}
                  {hasVideo && (
                    <button 
                      className={styles.mediaVideoToggle}
                      onClick={() => setMediaMode(mediaMode === "img" ? "vid" : "img")}
                    >
                      {mediaMode === "img" ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M9 8l6 4-6 4V8z" />
                          </svg>
                          Watch Video
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="2" y="2" width="20" height="20" rx="2" />
                            <circle cx="8.5" cy="8.5" r="2.5" />
                            <path d="M21 15l-5-4-3 3-4-4-6 6" />
                          </svg>
                          View Photo
                        </>
                      )}
                    </button>
                  )}
                  <div className={styles.mediaMainOverlay}>
                    <span className={styles.mediaMainBadge}>Featured</span>
                  </div>
                </div>

                {/* Small Images Grid - Only 3 images */}
                <div className={styles.mediaSmallGrid}>
                  <div className={styles.mediaSmallItem}>
                    <img src="/images/yoga-class-1.jpg" alt="Yoga Class" className={styles.mediaSmallImg} />
                    <div className={styles.mediaSmallOverlay}>
                      <span>Yoga Practice</span>
                    </div>
                  </div>
                  <div className={styles.mediaSmallItem}>
                    <img src="/images/meditation-1.jpg" alt="Meditation" className={styles.mediaSmallImg} />
                    <div className={styles.mediaSmallOverlay}>
                      <span>Meditation</span>
                    </div>
                  </div>
                  <div className={styles.mediaSmallItem}>
                    <img src="/images/ashram-1.jpg" alt="Ashram View" className={styles.mediaSmallImg} />
                    <div className={styles.mediaSmallOverlay}>
                      <span>Ashram Life</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Tags & Pills - Below Images */}
              <div className={styles.mediaFooterEnhanced}>
                {/* Training Options Tags */}
                <div className={styles.trainingTagsEnhanced}>
                  <div className={styles.trainingTag}>
                    <span className={styles.trainingTagIcon}>🧘</span>
                    <span>200 Hour TTC</span>
                  </div>
                  <div className={styles.trainingTag}>
                    <span className={styles.trainingTagIcon}>🕉️</span>
                    <span>300 Hour TTC</span>
                  </div>
                  <div className={styles.trainingTag}>
                    <span className={styles.trainingTagIcon}>✨</span>
                    <span>500 Hour TTC</span>
                  </div>
                </div>

                {/* Additional Pills */}
                <div className={styles.pillsGroupEnhanced}>
                  <span className={styles.pillItem}>✓ Yoga Alliance Certified</span>
                  <span className={styles.pillItem}>✓ 6000+ Graduates</span>
                  <span className={styles.pillItem}>✓ Since 2009</span>
                  <span className={styles.pillItem}>✓ Top Rated School</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accreditations Section */}
          {data.accrSectionTitle && (
            <div className={styles.accrSectionEnhanced}>
              <div className={styles.accrHeadEnhanced}>
                <span className={styles.accrHeadLineEnhanced} />
                <div className={styles.accrHeadInnerEnhanced}>
                  <p className={styles.accrEyebrowEnhanced}>Certified &amp; Recognised</p>
                  <h2 className={styles.accrTitleEnhanced}>{data.accrSectionTitle}</h2>
                  <p className={styles.accrTaglineEnhanced}>
                    Yoga Alliance USA &amp; Ministry of AYUSH, Government of India
                  </p>
                </div>
                <span className={styles.accrHeadLineRevEnhanced} />
              </div>

              {data.accredBadges?.length > 0 && (
                <div className={styles.certGridEnhanced}>
                  {data.accredBadges.map((badge) => (
                    <CertCard key={badge.id} {...badge} />
                  ))}
                </div>
              )}
            </div>
          )}

          {data.bodyParagraphs2?.map((para, i) => (
            <div key={i} className={styles.bodyParaEnhanced} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECTION 2 — COURSE CARDS (ENHANCED)
      ══════════════════════════════════════ */}
      {data.courseCards?.length > 0 && (
        <section id="courses" className={`${styles.sectionEnhanced} ${styles.sectionWarmEnhanced}`}>
          <div className={`container px-3 px-md-4 ${styles.maxx}`}>
            <div className={styles.sectionHeaderEnhanced}>
              <div className={styles.sectionHeaderOrnament}>
                <span className={styles.ornamentLine} />
                <span className={styles.ornamentDot} />
                <span className={styles.ornamentLine} />
              </div>
              <p className={styles.sectionEyebrowEnhanced}>World-Class Training</p>
              <h2 className={styles.sectionTitleEnhanced}>{data.coursesSectionTitle}</h2>
              <div className={styles.sectionUnderlineEnhanced}>
                <svg viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#F15505" strokeWidth="1.2" fill="none" />
                  <circle cx="100" cy="4" r="3" fill="#F15505" opacity="0.7" />
                </svg>
              </div>
              <p className={styles.sectionSubtitleEnhanced}>
                Discover authentic yoga education rooted in ancient wisdom and modern teaching methodology
              </p>
            </div>

            <div className={styles.coursesGridEnhanced}>
              {data.courseCards.map((course, i) => (
                <CourseCardComp
                  key={course.id}
                  {...course}
                  tag={i === 0 ? "Most Popular" : i === 1 ? "Highly Recommended" : "Best Value"}
                  imgNum={course.duration?.match(/\d+/)?.[0]}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          SECTION 3 — SPECIALTY COURSES (REDESIGNED)
      ══════════════════════════════════════ */}
      {data.specialtyCourses?.length > 0 && (
        <section id="specialty" className={`${styles.section} ${styles.sectionDeep}`}>
          <div className={`container px-3 px-md-4 ${styles.maxx}`}>
            {data.specialtySectionTitle && (
              <>
                <h2 className={styles.sectionTitleCenter}>
                  {data.specialtySectionTitle}
                </h2>
              </>
            )}
            <OmDivider />
            {data.specialtyCourses.map((course, i) => (
              <React.Fragment key={course.id}>
                <SpecialtyCourseCard {...course} />
                {i < data.specialtyCourses.length - 1 && (
                  <div className={styles.scDivider}>
                    <span className={styles.scDivLine} />
                    <span className={styles.scDivDot}>◈</span>
                    <span className={styles.scDivLine} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      <div id="gallery">
        <PremiumGallerySection type="both" backgroundColor="warm" />
      </div>

      {/* ✅ REVIEWS — now a reusable separate component */}
      <div id="reviews">
        <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />
      </div>

      <div id="location">
        <HowToReach />
      </div>
    </div>
  );
}