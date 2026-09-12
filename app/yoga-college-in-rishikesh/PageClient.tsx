"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/assets/style/yoga-college-in-rishikesh/Yogacollegerishikesh.module.css";
import heroImg from "@/assets/images/31.webp";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";

/* ══════════════════════════════════════
   TYPES (mirrors the backend model)
══════════════════════════════════════ */
interface LabelTextItem {
  label: string;
  text: string;
}
interface LabelValItem {
  label: string;
  val: string;
}

interface RegularCourseTab {
  label: string;
  hours: string;
  introText: string;
  extraText: string;
  affiliationText: string;
  aimObjectiveContent: string;
  aimObjectiveBullets: string[];
  durationContent: string;
  eligibilityItems: LabelTextItem[];
  evaluationContent: string;
  evaluationExtra: string;
  syllabusTheory: string[];
  syllabusPractical: string[];
}

interface YogaMasterTab {
  label: string;
  hours: string;
  title: string;
  details: LabelTextItem[];
  eligibility: string[];
  extraDetails: LabelTextItem[];
  contact: string;
  syllabusTheory: string[];
  syllabusPractical: string[];
}

interface CertCardItem {
  title: string;
  exam: string;
  fee: string;
  icon: string;
}

interface InPersonCourseItem {
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  cert: string;
  accreditation: string;
  fees: string;
  included: string;
  badge: string;
  color: string;
  imageAlt: string;
  image?: string;
}

interface YogaCollegeSection {
  heroImage?: string;
  heroImageAlt: string;
  heroTitle: string;
  heroSubtitle: string;

  aimImage1?: string;
  aimImage1Alt: string;
  aimImage2?: string;
  aimImage2Alt: string;
  aimImage3?: string;
  aimImage3Alt: string;

  introImage?: string;
  introImageAlt: string;
  highlightImage?: string;
  highlightImageAlt: string;

  protocolTab: RegularCourseTab;
  wellnessTab: RegularCourseTab;
  teacherTab: RegularCourseTab;
  masterTab: YogaMasterTab;

  highlightBadge: string;
  highlightTitle: string;
  highlightSubtitle: string;

  certSectionLabel: string;
  certSectionTitle: string;
  certCards: CertCardItem[];

  coursesSectionLabel: string;
  coursesSectionTitle: string;
  coursesSectionSub: string;
  inPersonCourses: InPersonCourseItem[];

  collegeSectionLabel: string;
  collegeHeading: string;
  collegeParagraph: string;
  collegeHighlights: string[];
  collegeImage?: string;
  collegeImageAlt: string;
  collegeImageBadge: string;

  collegeCoursesHeading: string;
  collegeCourses: string[];

  maObjectivesHeading: string;
  maObjectives: string[];
  maObjectivesImage?: string;
  maObjectivesImageAlt: string;
  maObjectivesImageBadge: string;

  admissionsSectionLabel: string;
  maEligibilityHeading: string;
  maEligibilityParagraph: string;
  maDetailsGrid: LabelValItem[];
  howToApplyHeading: string;
  howToApplyParagraph: string;

  careerSectionLabel: string;
  careerHeading: string;
  careerParagraphs: string[];
  careerOptions: string[];
  careerImage?: string;
  careerImageAlt: string;
  careerImageBadge: string;

  applyNowLink: string;
  bookNowLink: string;
  moreDetailsLink: string;
}

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

/* Strips HTML tags + inline styles that Jodit (the rich-text editor in the
   admin panel) saves — e.g. <p>, <span style="color:...">. Turns block-level
   tags into line breaks so paragraph structure survives as plain text. */
const stripHtml = (html?: string) => {
  if (!html) return "";
  return html
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/* Renders a Jodit HTML string as clean plain-text paragraphs — no tags,
   no inline styles, just the text with paragraph breaks preserved. */
function CleanText({ html, className }: { html?: string; className?: string }) {
  const text = stripHtml(html);
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>
          {para.split("\n").map((line, j, arr) => (
            <React.Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

/* ══════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════ */
function MandalaSVG({
  size = 300,
  c1 = "#F15505",
  c2 = "#d4a017",
  sw = 0.5,
}: {
  size?: number;
  c1?: string;
  c2?: string;
  sw?: number;
}) {
  return (
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
          ] as number[][]
        ).map((d, i) => (
          <line key={i} x1={d[0]} y1={d[1]} x2={d[2]} y2={d[3]} />
        ))}
      </g>
      <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
      <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
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
    </div>
  );
}

function OmDivider({ label }: { label?: string }) {
  return (
    <div className={styles.omDividerWrap}>
      <div className={styles.omDivLine} />
      <div className={styles.omDivCenter}>
        <span className={styles.omSymbol}>ॐ</span>
        {label && <span className={styles.omDivLabel}>{label}</span>}
      </div>
      <div className={styles.omDivLine} />
    </div>
  );
}

function PulseDot() {
  return <span className={styles.pulseDot} />;
}

/* Replaces the old AutoVideo component — same framed/badge look, but an image */
function MediaImage({
  src,
  alt,
  className,
  badgeText = "AYM Yoga School",
}: {
  src?: string;
  alt: string;
  className?: string;
  badgeText?: string;
}) {
  if (!src) return null;
  return (
    <img
      src={getImageUrl(src)}
      alt={alt}
      className={className || styles.autoVideoIframe}
      loading="lazy"
    />
  );
}

/* ══════════════════════════════════════
   TEXT + IMAGE ROWS
══════════════════════════════════════ */
function TextImageRow({
  children,
  imageUrl,
  imageAlt,
  badge,
  reverse = false,
}: {
  children: React.ReactNode;
  imageUrl?: string;
  imageAlt: string;
  badge?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>{children}</div>
      <div className={styles.tiImageWrap}>
        <div className={styles.tiImageFrame}>
          {imageUrl && (
            <img
              src={getImageUrl(imageUrl)}
              alt={imageAlt}
              className={styles.tiImage}
              loading="lazy"
            />
          )}
          <div className={styles.tiImageOverlay} />
          {badge && <div className={styles.tiImageBadge}>{badge}</div>}
          <div className={styles.tiImageCornerTl} />
          <div className={styles.tiImageCornerBr} />
        </div>
        <div className={styles.tiDotGrid} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={styles.tiDot} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Same layout as TextImageRow but styled like the old "video" slot —
   used where the intro video used to sit (course intro, MA eligibility) */
function TextMediaRow({
  children,
  imageUrl,
  imageAlt,
  reverse = false,
}: {
  children: React.ReactNode;
  imageUrl?: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
      <div className={styles.tiText}>{children}</div>
      <div className={styles.tiVideoWrap}>
        <div className={styles.tiVideoFrame}>
          {imageUrl && (
            <img
              src={getImageUrl(imageUrl)}
              alt={imageAlt}
              className={styles.tiVideoIframe}
              loading="lazy"
            />
          )}
          <div className={styles.tiVideoBadge}>
            <PulseDot /> AYM Yoga School
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SYLLABUS GRID
══════════════════════════════════════ */
function SyllabusGrid({
  theory,
  practical,
}: {
  theory: string[];
  practical: string[];
}) {
  return (
    <div className={styles.syllabusGrid}>
      <div className={styles.syllabusCol}>
        <div className={styles.syllabusColHead}>
          <span className={styles.syllabusColIcon}>📖</span> Theory
        </div>
        {theory.map((t, i) => (
          <div key={i} className={styles.syllabusItem}>
            <span className={styles.syllabusCheck}>✓</span>
            {t}
          </div>
        ))}
      </div>
      <div className={styles.syllabusCol}>
        <div className={styles.syllabusColHead}>
          <span className={styles.syllabusColIcon}>🧘</span> Practical
        </div>
        {practical.map((p, i) => (
          <div key={i} className={styles.syllabusItem}>
            <span className={styles.syllabusCheck}>✓</span>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   AIM IMAGES STRIP
══════════════════════════════════════ */
function AimImagesStrip({ images, alts }: { images: string[]; alts: string[] }) {
  const valid = images.filter(Boolean);
  if (!valid.length) return null;
  return (
    <div className={styles.aimImagesStrip}>
      {valid.map((src, i) => (
        <div
          key={i}
          className={styles.aimImageCard}
          style={{ animationDelay: `${i * 0.12}s` }}
        >
          <img src={getImageUrl(src)} alt={alts[i] || `yoga practice ${i + 1}`} loading="lazy" />
          <div className={styles.aimImageOverlay} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   REGULAR COURSE TAB CONTENT
══════════════════════════════════════ */
function RegularTabContent({
  tab,
  applyNowLink,
  introImage,
  introImageAlt,
  aimImages,
  aimAlts,
}: {
  tab: RegularCourseTab;
  applyNowLink: string;
  introImage?: string;
  introImageAlt: string;
  aimImages: string[];
  aimAlts: string[];
}) {
  return (
    <div className={styles.tabPane}>
      {/* Intro + image side by side (was video) */}
      <div className={styles.tabIntroRow}>
        <div className={styles.tabIntroText}>
          <CleanText html={tab.introText} className={styles.tabBody} />
          <CleanText html={tab.extraText} className={styles.tabBody} />
          <p className={styles.tabBody}>
            <strong className={styles.tabStrong}>Affiliation:</strong>{" "}
            {tab.affiliationText}
          </p>
        </div>
        <div className={styles.tabIntroVideo}>
          <div className={styles.tabVideoFrame}>
            <MediaImage
              src={introImage}
              alt={introImageAlt}
              className={styles.tabVideoIframe}
            />
            <div className={styles.tabVideoBadge}>
              <PulseDot /> Daily Classes
            </div>
          </div>
        </div>
      </div>

      {/* Aim & Objective */}
      <div className={styles.tabSection}>
        <h4 className={styles.tabSectionTitle}>Aim and Objective</h4>
        {tab.aimObjectiveContent && (
          <p className={styles.tabBody}>{tab.aimObjectiveContent}</p>
        )}
        {tab.aimObjectiveBullets?.length > 0 && (
          <ul className={styles.tabUl}>
            {tab.aimObjectiveBullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        )}
        <AimImagesStrip images={aimImages} alts={aimAlts} />
      </div>

      {/* Duration */}
      <div className={styles.tabSection}>
        <h4 className={styles.tabSectionTitle}>Duration of this course</h4>
        <p className={styles.tabBody}>{tab.durationContent}</p>
      </div>

      {/* Eligibility */}
      <div className={styles.tabSection}>
        <h4 className={styles.tabSectionTitle}>Eligibility Criteria</h4>
        <div className={styles.eligibilityGrid}>
          {tab.eligibilityItems?.map((item, j) => (
            <div key={j} className={styles.eligibilityCard}>
              <div className={styles.eligibilityLabel}>{item.label}</div>
              <div className={styles.eligibilityText}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation */}
      <div className={styles.tabSection}>
        <h4 className={styles.tabSectionTitle}>Evaluation</h4>
        <p className={styles.tabBody}>{tab.evaluationContent}</p>
        {tab.evaluationExtra && (
          <p className={styles.tabBodyExtra}>
            <strong>{tab.evaluationExtra}</strong>
          </p>
        )}
      </div>

      {/* Syllabus */}
      <div className={styles.tabSection}>
        <h4 className={styles.tabSectionTitle}>Syllabus</h4>
        <SyllabusGrid theory={tab.syllabusTheory} practical={tab.syllabusPractical} />
      </div>

      <Link href={applyNowLink || "/yoga-registration"} className={styles.applyBtn}>
        Apply Now →
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════
   YOGA MASTER TAB CONTENT
══════════════════════════════════════ */
function MasterTabContent({
  tab,
  applyNowLink,
  introImage,
  introImageAlt,
}: {
  tab: YogaMasterTab;
  applyNowLink: string;
  introImage?: string;
  introImageAlt: string;
}) {
  return (
    <div className={styles.tabPane}>
      <div className={styles.yogaMasterHero}>
        <div className={styles.yogaMasterLeft}>
          <div className={styles.yogaMasterBadge}>🏅 YOGA MASTER (YM)</div>
          <h3 className={styles.yogaMasterTitle}>{tab.title}</h3>
          {tab.details?.map((d, i) => (
            <p key={i} className={styles.tabBody}>
              <strong className={styles.tabStrong}>{d.label}:</strong> {d.text}
            </p>
          ))}
          <div className={styles.yogaMasterEligTitle}>
            Requirement / Eligibility
          </div>
          <ol className={styles.tabOl}>
            {tab.eligibility?.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ol>
        </div>
        <div className={styles.yogaMasterRight}>
          <div className={styles.yogaMasterVideoWrap}>
            <MediaImage
              src={introImage}
              alt={introImageAlt}
              className={styles.yogaMasterVideo}
            />
            <div className={styles.yogaMasterVideoBadge}>
              <PulseDot /> Live Training
            </div>
          </div>
        </div>
      </div>

      <div className={styles.yogaMasterDetails}>
        {tab.extraDetails?.map((d, i) => (
          <div key={i} className={styles.yogaMasterDetailCard}>
            <div className={styles.yogaMasterDetailLabel}>{d.label}</div>
            <div className={styles.yogaMasterDetailVal}>{d.text}</div>
          </div>
        ))}
      </div>

      <p className={styles.tabBodyContact}>{tab.contact}</p>

      <VintageHeading>Syllabus</VintageHeading>
      <SyllabusGrid theory={tab.syllabusTheory} practical={tab.syllabusPractical} />

      <Link href={applyNowLink || "/yoga-registration"} className={styles.applyBtn}>
        Apply Now →
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════
   IN-PERSON COURSE CARD
══════════════════════════════════════ */
function CourseCard({
  course,
  index,
  bookNowLink,
}: {
  course: InPersonCourseItem;
  index: number;
  bookNowLink: string;
}) {
  const isReverse = index % 2 !== 0;
  const details = [
    { icon: "📅", label: "Start Date", value: course.startDate },
    { icon: "🏁", label: "End Date", value: course.endDate },
    { icon: "⏱️", label: "Duration", value: course.duration },
    { icon: "🎓", label: "Certification", value: course.cert },
    { icon: "🏛️", label: "Accreditation", value: course.accreditation },
    { icon: "💰", label: "Fees", value: course.fees },
    { icon: "✅", label: "Included", value: course.included },
  ];

  return (
    <div
      className={`${styles.courseCard} ${isReverse ? styles.courseCardReverse : ""}`}
    >
      <div className={styles.courseCardImgWrap}>
        {course.image && (
          <Image
            src={getImageUrl(course.image)}
            alt={course.imageAlt || course.title}
            fill
            className={styles.courseCardImg}
          />
        )}
        <div className={styles.courseCardImgOverlay} />
        <div
          className={styles.courseCardBadge}
          style={{ background: course.color }}
        >
          {course.badge}
        </div>
        <div className={styles.courseCardHoursTag}>{course.duration}</div>
      </div>
      <div className={styles.courseCardBody}>
        <h3 className={styles.courseCardTitle}>{course.title}</h3>
        <div
          className={styles.courseCardUnderline}
          style={{ background: course.color }}
        />
        <div className={styles.courseCardDetails}>
          {details.map((d, i) => (
            <div key={i} className={styles.courseCardDetailRow}>
              <span className={styles.courseCardDetailIcon}>{d.icon}</span>
              <span className={styles.courseCardDetailLabel}>{d.label}:</span>
              <span className={styles.courseCardDetailVal}>{d.value}</span>
            </div>
          ))}
        </div>
        <Link
          href={bookNowLink || "/yoga-registration"}
          className={styles.bookSpotBtn}
          style={{
            background: `linear-gradient(135deg, ${course.color}, #f15505)`,
          }}
        >
          Book Your Spot →
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function YogaCollegeRishikesh() {
  const [data, setData] = useState<YogaCollegeSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"protocol" | "wellness" | "teacher" | "master">(
    "protocol"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/yoga-college-section");
        const section = res.data?.data?.[0] || null;
        setData(section);
      } catch (err) {
        console.error("Failed to fetch yoga college section:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ padding: "4rem 0", textAlign: "center" }}>
          Loading…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ padding: "4rem 0", textAlign: "center" }}>
          Content not available right now.
        </div>
      </div>
    );
  }

  const tabDefs = [
    { id: "protocol" as const, tab: data.protocolTab },
    { id: "wellness" as const, tab: data.wellnessTab },
    { id: "teacher" as const, tab: data.teacherTab },
    { id: "master" as const, tab: data.masterTab },
  ];

  const aimImages = [data.aimImage1, data.aimImage2, data.aimImage3].filter(
    Boolean
  ) as string[];
  const aimAlts = [data.aimImage1Alt, data.aimImage2Alt, data.aimImage3Alt];

  return (
    <div className={styles.page}>
      {/* Mandalas */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={420} c1="#F15505" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={380} c1="#d4a017" c2="#F15505" sw={0.42} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <Image
          src={data.heroImage ? getImageUrl(data.heroImage) : heroImg}
          alt={data.heroImageAlt || "Yoga College in Rishikesh"}
          width={1460}
          height={580}
          className={styles.heroImage}
          priority
        />
      </section>

      {/* ── HERO TITLE ── */}
      <section className={styles.heroTitleSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>{data.heroTitle}</h1>
          <div className={styles.heroUnderline} />
          <p className={styles.heroSubtitle}>{data.heroSubtitle}</p>
        </div>
      </section>

      {/* ── TABS SECTION ── */}
      <section className={styles.tabsSection}>
        <div className={styles.container}>
          <div className={styles.tabHeaders}>
            {tabDefs.map(({ id, tab }) => (
              <button
                key={id}
                className={`${styles.tabBtn} ${activeTab === id ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <span className={styles.tabBtnHours}>{tab.hours}</span>
                <span className={styles.tabBtnLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.tabContentWrap}>
            {activeTab === "protocol" && (
              <RegularTabContent
                tab={data.protocolTab}
                applyNowLink={data.applyNowLink}
                introImage={data.introImage}
                introImageAlt={data.introImageAlt}
                aimImages={aimImages}
                aimAlts={aimAlts}
              />
            )}
            {activeTab === "wellness" && (
              <RegularTabContent
                tab={data.wellnessTab}
                applyNowLink={data.applyNowLink}
                introImage={data.introImage}
                introImageAlt={data.introImageAlt}
                aimImages={aimImages}
                aimAlts={aimAlts}
              />
            )}
            {activeTab === "teacher" && (
              <RegularTabContent
                tab={data.teacherTab}
                applyNowLink={data.applyNowLink}
                introImage={data.introImage}
                introImageAlt={data.introImageAlt}
                aimImages={aimImages}
                aimAlts={aimAlts}
              />
            )}
            {activeTab === "master" && (
              <MasterTabContent
                tab={data.masterTab}
                applyNowLink={data.applyNowLink}
                introImage={data.introImage}
                introImageAlt={data.introImageAlt}
              />
            )}
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH HIGHLIGHT IMAGE (was autoplay video) ── */}
      <section className={styles.fullVideoSection}>
        <div className={styles.fullVideoWrap}>
          {data.highlightImage && (
            <img
              src={getImageUrl(data.highlightImage)}
              alt={data.highlightImageAlt}
              className={styles.fullVideoIframe}
              loading="lazy"
            />
          )}
          <div className={styles.fullVideoOverlay}>
            <div className={styles.fullVideoTextWrap}>
              <div className={styles.fullVideoBadge}>
                <PulseDot /> {data.highlightBadge}
              </div>
              <h2 className={styles.fullVideoTitle}>{data.highlightTitle}</h2>
              <p className={styles.fullVideoSub}>{data.highlightSubtitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION CARDS ── */}
      <section className={styles.certSection}>
        <div className={styles.container}>
          <OmDivider label={data.certSectionLabel} />
          <VintageHeading>{data.certSectionTitle}</VintageHeading>
          <div className={styles.certGrid}>
            {data.certCards?.map((card, i) => (
              <div key={i} className={styles.certCard}>
                <div className={styles.certCardTop}>
                  <span className={styles.certCardIcon}>{card.icon}</span>
                  <div className={styles.certCardGlow} />
                </div>
                <h3 className={styles.certTitle}>{card.title}</h3>
                <div className={styles.certDivider} />
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Exam Mode</span>
                  <span className={styles.certVal}>{card.exam}</span>
                </div>
                <div className={styles.certRow}>
                  <span className={styles.certLabel}>Exam Fee</span>
                  <span className={styles.certVal}>{card.fee}</span>
                </div>
                <div className={styles.certBtns}>
                  <Link href={data.moreDetailsLink || "/"} className={styles.certBtnOutline}>
                    More Details
                  </Link>
                  <Link
                    href={data.bookNowLink || "/yoga-registration"}
                    className={styles.certBtnFill}
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN-PERSON COURSES ── */}
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <OmDivider label={data.coursesSectionLabel} />
          <VintageHeading>{data.coursesSectionTitle}</VintageHeading>
          <p className={styles.coursesSub}>{data.coursesSectionSub}</p>
          <div className={styles.courseCardsWrap}>
            {data.inPersonCourses?.map((course, i) => (
              <CourseCard
                key={i}
                course={course}
                index={i}
                bookNowLink={data.bookNowLink}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLEGE INFO — text left, image right ── */}
      <section className={styles.collegeSection}>
        <div className={styles.container}>
          <OmDivider label={data.collegeSectionLabel} />
          <TextImageRow
            imageUrl={data.collegeImage}
            imageAlt={data.collegeImageAlt}
            badge={data.collegeImageBadge}
          >
            <VintageHeading center={false}>{data.collegeHeading}</VintageHeading>
            <CleanText html={data.collegeParagraph} className={styles.bodyPara} />

            <div className={styles.collegeHighlights}>
              {data.collegeHighlights?.map((h, i) => (
                <div key={i} className={styles.collegeHighlightChip}>
                  <span className={styles.collegeHighlightDot} />
                  {h}
                </div>
              ))}
            </div>
          </TextImageRow>

          {/* Courses Offered */}
          <div className={styles.collegeCourseWrap}>
            <VintageHeading>{data.collegeCoursesHeading}</VintageHeading>
            <div className={styles.collegeCourseGrid}>
              {data.collegeCourses?.map((c, i) => (
                <div key={i} className={styles.collegeCourseCard}>
                  <span className={styles.collegeCourseNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.collegeCourseText}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MA Objectives + image */}
          <TextImageRow
            imageUrl={data.maObjectivesImage}
            imageAlt={data.maObjectivesImageAlt}
            badge={data.maObjectivesImageBadge}
            reverse={true}
          >
            <VintageHeading center={false}>{data.maObjectivesHeading}</VintageHeading>
            <ol className={styles.objectivesList}>
              {data.maObjectives?.map((o, i) => (
                <li key={i} className={styles.objectivesItem}>
                  <span className={styles.objectivesNum}>{i + 1}.</span>
                  <span>{o}</span>
                </li>
              ))}
            </ol>
          </TextImageRow>
        </div>
      </section>

      {/* ── MA ELIGIBILITY — text left, image right (was video) ── */}
      <section className={styles.maSection}>
        <div className={styles.container}>
          <OmDivider label={data.admissionsSectionLabel} />
          <TextMediaRow
            imageUrl={data.introImage}
            imageAlt={data.introImageAlt}
            reverse={false}
          >
            <>
              <VintageHeading center={false}>{data.maEligibilityHeading}</VintageHeading>
              <p className={styles.bodyPara}>{data.maEligibilityParagraph}</p>
              <div className={styles.maDetailsGrid}>
                {data.maDetailsGrid?.map((d, i) => (
                  <div key={i} className={styles.maDetailCard}>
                    <div className={styles.maDetailLabel}>{d.label}</div>
                    <div className={styles.maDetailVal}>{d.val}</div>
                  </div>
                ))}
              </div>

              <VintageHeading center={false}>{data.howToApplyHeading}</VintageHeading>
              <p className={styles.bodyPara}>{data.howToApplyParagraph}</p>
            </>
          </TextMediaRow>
        </div>
      </section>

      {/* ── CAREER — text left, image right ── */}
      <section className={styles.careerSection}>
        <div className={styles.container}>
          <OmDivider label={data.careerSectionLabel} />
          <TextImageRow
            imageUrl={data.careerImage}
            imageAlt={data.careerImageAlt}
            badge={data.careerImageBadge}
          >
            <VintageHeading center={false}>{data.careerHeading}</VintageHeading>
            {data.careerParagraphs?.map((p, i) => (
              <p key={i} className={styles.bodyPara}>
                {p}
              </p>
            ))}
            <div className={styles.careerOptions}>
              {data.careerOptions?.map((o, i) => (
                <div key={i} className={styles.careerChip}>
                  <span className={styles.careerChipDot} />
                  {o}
                </div>
              ))}
            </div>
          </TextImageRow>
        </div>
      </section>

      <HowToReach />
    </div>
  );
}