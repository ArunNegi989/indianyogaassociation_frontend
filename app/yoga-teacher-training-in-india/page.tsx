"use client";

import React, { useEffect, useState } from "react";
import styles from "@/assets/style/yoga-teacher-training-in-india/Yogattcindia.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import ReviewSection from "@/components/common/Reviewsection";
import RatingsSummarySection from "@/components/home/RatingsSummarySection";
import PremiumGallerySection from "@/components/PremiumGallerySection";

/* ─── TYPES ─── */
interface AccredBadge {
  _id: string;
  label: string;
  imgUrl?: string;
  image?: string;
}

interface CourseCard {
  _id: string;
  hours: string;
  title: string;
  desc: string;
  linkLabel: string;
  href?: string;
  imgUrl?: string;
  image?: string;
}

interface QuoteCard {
  _id: string;
  quote: string;
  imgAlt: string;
  imgUrl?: string;
  image?: string;
}

interface Location {
  _id: string;
  name: string;
  desc: string;
}

interface YogaTTCData {
  _id: string;
  slug: string;
  status: string;
  heroImage: string;
  heroImgAlt: string;
  heroTitle: string;
  heroSubTitle: string;
  introPara: string;
  whoWeArePara: string;
  yytPara: string;
  whyAYMPara1: string;
  whyAYMPara2: string;
  whyAYMPara3: string;
  rishikeshDetailPara: string;
  goaDetailPara: string;
  introParagraphs: string[];
  whyAYMParagraphs: string[];
  rishikeshParagraphs: string[];
  goaParagraphs: string[];
  arrivalList: string[];
  feeList: string[];
  accredBadges: AccredBadge[];
  courseCards: CourseCard[];
  quoteCards: QuoteCard[];
  locations: Location[];
  whoWeAreTitle: string;
  yytTitle: string;
  rishikeshTitle: string;
  goaTitle: string;
  whyAYMTitle: string;
  arrivalTitle: string;
  feeTitle: string;
}

/* ─── IMAGE HELPER ─── */
const getImageSrc = (
  image?: string,
  imgUrl?: string,
  fallback?: string,
): string => {
  if (image && image.startsWith("/uploads/")) {
    return `${process.env.NEXT_PUBLIC_API_URL}${image}`;
  }
  if (imgUrl && imgUrl.length > 0) return imgUrl;
  return fallback || "";
};

/* ─── STATIC PLACEHOLDER IMAGES & VIDEO ─── */
const PLACEHOLDER = {
  yoga1:
    "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&q=80",
  yoga2: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&q=80",
  yoga3: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=900&q=80",
  yoga4:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80",
  yoga5: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80",
  rishikesh:
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=900&q=80",
  course1:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  course2:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  course3:
    "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600&q=80",
  videoId: "X-4RQYlTRtk", // YouTube short ID for autoplay embed
};

const getYouTubeEmbed = (videoId: string) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`;

/* ─── MANDALA SVG ─── */
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
    <g fill="none" stroke={c1} strokeWidth={sw * 0.4} opacity="0.22">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const cx = 150 + 60 * Math.cos(r),
          cy = 150 + 60 * Math.sin(r);
        return (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy}
            rx="18"
            ry="8"
            transform={`rotate(${deg},${cx},${cy})`}
          />
        );
      })}
    </g>
    <circle cx="150" cy="150" r="5.5" fill={c1} opacity="0.42" />
    <circle cx="150" cy="150" r="2.5" fill={c2} opacity="0.62" />
  </svg>
);

/* ─── CHAKRA SVG ─── */
const ChakraSVG = ({
  size = 32,
  color = "#F15505",
}: {
  size?: number;
  color?: string;
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={color}
      strokeWidth="1.2"
    />
    <circle
      cx="50"
      cy="50"
      r="32"
      fill="none"
      stroke={color}
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle
      cx="50"
      cy="50"
      r="18"
      fill="none"
      stroke={color}
      strokeWidth="1"
      opacity="0.8"
    />
    <circle cx="50" cy="50" r="7" fill={color} opacity="0.45" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line
          key={deg}
          x1={50 + 20 * Math.cos(r)}
          y1={50 + 20 * Math.sin(r)}
          x2={50 + 44 * Math.cos(r)}
          y2={50 + 44 * Math.sin(r)}
          stroke={color}
          strokeWidth="1"
          opacity="0.55"
        />
      );
    })}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fontSize="20"
      fill={color}
      fontFamily="serif"
      opacity="0.9"
    >
      ॐ
    </text>
  </svg>
);

/* ─── OM DIVIDER ─── */
const OmDivider = ({ label }: { label?: string }) => (
  <div className={styles.omDividerWrap}>
    <div className={styles.omDivLine} />
    <div className={styles.omDivCenter}>
      <ChakraSVG size={28} color="#F15505" />
      {label && <span className={styles.omDivLabel}>{label}</span>}
    </div>
    <div className={styles.omDivLine} />
  </div>
);

/* ─── VINTAGE HEADING ─── */
const VintageHeading = ({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: string;
}) => (
  <div className={styles.vintageHeadingWrap}>
    <h2 className={styles.vintageHeading}>{children}</h2>
    {sub && <p className={styles.vintageHeadingSub}>{sub}</p>}
    <div className={styles.vintageHeadingUnderline}>
      <svg
        viewBox="0 0 200 8"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.headingUndSvg}
      >
        <path
          d="M0,4 Q50,0 100,4 Q150,8 200,4"
          stroke="#F15505"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="100" cy="4" r="3" fill="#F15505" opacity="0.7" />
        <circle cx="10" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
        <circle cx="190" cy="4" r="1.5" fill="#b8860b" opacity="0.5" />
      </svg>
    </div>
  </div>
);

/* ─── TEXT + IMAGE ROW ─── */
const TextImageRow = ({
  children,
  imageUrl,
  imageAlt,
  badge,
  reverse = false,
}: {
  children: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  reverse?: boolean;
}) => (
  <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
    <div className={styles.tiText}>{children}</div>
    <div className={styles.tiImageWrap}>
      <div className={styles.tiImageFrame}>
        <img
          src={imageUrl}
          alt={imageAlt}
          className={styles.tiImage}
          loading="lazy"
        />
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

/* ─── TEXT + VIDEO ROW ─── */
const TextVideoRow = ({
  children,
  videoId,
  reverse = false,
}: {
  children: React.ReactNode;
  videoId: string;
  reverse?: boolean;
}) => (
  <div className={`${styles.tiRow} ${reverse ? styles.tiRowReverse : ""}`}>
    <div className={styles.tiText}>{children}</div>
    <div className={styles.tiVideoWrap}>
      <div className={styles.tiVideoFrame}>
        <iframe
          src={getYouTubeEmbed(videoId)}
          className={styles.videoIframe}
          title="Yoga Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: "none" }}
        />
        <div className={styles.tiVideoBadge}>
          <span className={styles.pulseDot} /> Live Classes
        </div>
      </div>
    </div>
  </div>
);

/* ─── SINGLE BADGE — auto detects shape ─── */
const BadgeItem = ({ b, i }: { b: AccredBadge; i: number }) => {
  const [shape, setShape] = useState<"circle" | "square" | "wide" | null>(null);
  const src = getImageSrc(b.image, b.imgUrl);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio > 1.3)
      setShape("wide"); // landscape / wide logo
    else if (ratio < 0.77)
      setShape("square"); // tall / portrait
    else setShape("circle"); // roughly square → circular frame
  };

  // frame class based on detected shape
  const frameClass = [
    styles.badgeFrame,
    shape === "circle"
      ? styles.badgeFrameCircle
      : shape === "wide"
        ? styles.badgeFrameWide
        : shape === "square"
          ? styles.badgeFrameSquare
          : styles.badgeFrameCircle, // default while loading
  ].join(" ");

  return (
    <div className={styles.badge}>
      <div className={frameClass}>
        {src ? (
          <img
            src={src}
            alt={b.label}
            className={styles.badgeImg}
            loading="lazy"
            onLoad={handleLoad}
          />
        ) : (
          <ChakraSVG size={36} color="#F15505" />
        )}
      </div>
      <span className={styles.badgeLabelText}>{b.label}</span>
    </div>
  );
};

/* ─── ACCREDITATION BADGES ─── */
const AccredBadges = ({ badges }: { badges: AccredBadge[] }) => {
  if (!badges || badges.length === 0) return null;
  return (
    <div className={styles.badgesSection}>
      <p className={styles.badgesSectionLabel}>Internationally Accredited By</p>
      <div className={styles.badgesRow}>
        {badges.map((b, i) => (
          <BadgeItem key={b._id || i} b={b} i={i} />
        ))}
      </div>
    </div>
  );
};

/* ─── COURSE CARD ─── */
const CourseCardComp = ({
  card,
  index,
}: {
  card: CourseCard;
  index: number;
}) => {
  const fallbacks = [
    PLACEHOLDER.course1,
    PLACEHOLDER.course2,
    PLACEHOLDER.course3,
  ];
  const src = getImageSrc(card.image, card.imgUrl, fallbacks[index % 3]);
  return (
    <div className={styles.courseCard}>
      <div className={styles.courseImgWrap}>
        <img
          src={src}
          alt={card.title}
          className={styles.courseImg}
          loading="lazy"
        />
        <div className={styles.courseImgOverlay} />
        <div className={styles.courseHourBadge}>{card.hours} HR</div>
        <div className={styles.courseCardGlow} />
      </div>
      <div className={styles.courseBody}>
        <h3 className={styles.courseTitle}>{card.title}</h3>
        <div className={styles.courseLine} />
        {card.desc ? (
          <div
            className={styles.courseDesc}
            dangerouslySetInnerHTML={{ __html: card.desc }}
          />
        ) : null}
      </div>
      <a href={card.href || "#"} className={styles.courseBtn}>
        <span>{card.linkLabel}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
};

/* ─── QUOTE CARD ─── */
const QuoteCard = ({ card }: { card: QuoteCard }) => {
  const src = getImageSrc(card.image, card.imgUrl, PLACEHOLDER.yoga4);
  return (
    <div className={styles.quoteImgCard}>
      <img
        src={src}
        alt={card.imgAlt}
        className={styles.quoteImg}
        loading="lazy"
      />
      <div className={styles.quoteOverlay}>
        <span className={styles.quoteMarkIcon}>"</span>
        <p className={styles.quoteCaption}>{card.quote}</p>
        <span className={styles.quoteBar} />
      </div>
    </div>
  );
};

/* ─── LOCATION DETAIL SECTION ─── */
const LocationDetail = ({
  title,
  paragraphs,
  fallbackPara,
  imgSrc,
  badge,
  reverse = false,
}: {
  title: string;
  paragraphs: string[];
  fallbackPara?: string;
  imgSrc: string;
  badge?: string;
  reverse?: boolean;
}) => {
  const validParas =
    paragraphs && paragraphs.length > 0
      ? paragraphs
      : fallbackPara
        ? [fallbackPara]
        : [];
  return (
    <div className={styles.locationDetailWrap}>
      <TextImageRow
        imageUrl={imgSrc}
        imageAlt={title}
        badge={badge}
        reverse={reverse}
      >
        <VintageHeading>{title}</VintageHeading>
        {validParas.map((p, i) => (
          <div
            key={i}
            className={styles.bodyPara}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </TextImageRow>
    </div>
  );
};

/* ─── INFO PANEL ─── */
const InfoPanel = ({ title, items }: { title: string; items: string[] }) => (
  <div className={styles.infoPanel}>
    <div className={styles.infoPanelHeader}>
      <ChakraSVG size={32} color="#F15505" />
      <h3 className={styles.panelTitle}>{title}</h3>
    </div>
    <div className={styles.panelUnderline} />
    <ul className={styles.panelList}>
      {items.map((item, i) => (
        <li key={i} className={styles.panelListItem}>
          <span className={styles.panelListNum}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.panelListText}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* ─── LOADING ─── */
const LoadingSkeleton = () => (
  <div
    className={styles.page}
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ textAlign: "center", color: "#F15505" }}>
      <ChakraSVG size={52} color="#F15505" />
      <p
        style={{
          marginTop: "1rem",
          fontFamily: "Montserrat, sans-serif",
          fontSize: ".9rem",
          letterSpacing: ".1em",
          opacity: 0.7,
        }}
      >
        Loading...
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function YogaTTCIndia() {
  const [data, setData] = useState<YogaTTCData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/yoga-ttc-india")
      .then((res) => {
        if (res.data?.success && res.data?.data) setData(res.data.data);
        else setError("No data found.");
      })
      .catch((err: any) => setError(err?.message || "Failed to fetch data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data)
    return (
      <div
        className={styles.page}
        style={{ padding: "4rem", textAlign: "center", color: "#F15505" }}
      >
        <p>{error || "Something went wrong."}</p>
      </div>
    );

  const heroSrc = data.heroImage?.startsWith("/uploads/")
    ? `${process.env.NEXT_PUBLIC_API_URL}${data.heroImage}`
    : data.heroImage || "";

  const introParagraphs =
    data.introParagraphs?.length > 0
      ? data.introParagraphs
      : data.introPara
        ? [data.introPara]
        : [];
  const whyParas =
    data.whyAYMParagraphs?.length > 0
      ? data.whyAYMParagraphs
      : [data.whyAYMPara1, data.whyAYMPara2, data.whyAYMPara3].filter(Boolean);

  return (
    <div className={styles.page}>
      {/* Fixed Mandalas */}
      <div className={styles.mandalaTL} aria-hidden="true">
        <MandalaSVG size={430} c1="#F15505" c2="#d4a017" sw={0.42} />
      </div>
      <div className={styles.mandalaBR} aria-hidden="true">
        <MandalaSVG size={390} c1="#d4a017" c2="#F15505" sw={0.42} />
      </div>
      <div className={styles.mandalaTR} aria-hidden="true">
        <MandalaSVG size={230} c1="#F15505" c2="#d4a017" sw={0.55} />
      </div>
      <div className={styles.mandalaBL} aria-hidden="true">
        <MandalaSVG size={230} c1="#d4a017" c2="#F15505" sw={0.55} />
      </div>
      <div className={styles.chakraGlow} aria-hidden="true" />

      {/* ── HERO IMAGE ── */}
      {heroSrc && (
        <section className={styles.heroSection}>
          <img
            src={heroSrc}
            alt={data.heroImgAlt || data.heroTitle || "Yoga Teacher Training"}
            className={styles.heroImage}
            loading="eager"
          />
        </section>
      )}

      {/* ══════════════════════════════
          SECTION 1 — HERO TITLE + INTRO + BADGES + WHO WE ARE
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionLight}`}>
        <div className="container px-3 px-md-4">
          {/* Hero heading */}
          <div className={styles.heroWrap}>
            {data.heroTitle && (
              <h1 className={styles.heroTitle}>{data.heroTitle}</h1>
            )}
            {data.heroSubTitle && (
              <p className={styles.heroSub}>{data.heroSubTitle}</p>
            )}
            <div className={styles.heroUnderline} />
          </div>

          {/* Intro — text left, image right */}
          {introParagraphs.length > 0 && (
            <TextImageRow
              imageUrl={PLACEHOLDER.yoga1}
              imageAlt="Yoga Teacher Training India"
              badge="Since 2010"
            >
              <>
                {introParagraphs.map((para, i) => (
                  <div
                    key={i}
                    className={styles.bodyPara}
                    dangerouslySetInnerHTML={{ __html: para }}
                  />
                ))}
              </>
            </TextImageRow>
          )}

          {/* Accreditation badges */}
          <AccredBadges badges={data.accredBadges} />

          {/* Who We Are — text left, VIDEO right (autoplay, no controls) */}
          {(data.whoWeAreTitle || data.whoWeArePara) && (
            <div className={styles.sectionSpacer}>
              <TextVideoRow videoId={PLACEHOLDER.videoId}>
                <>
                  <VintageHeading>
                    {data.whoWeAreTitle || "Who We Are"}
                  </VintageHeading>
                  {data.whoWeArePara && (
                    <div
                      className={styles.bodyPara}
                      dangerouslySetInnerHTML={{ __html: data.whoWeArePara }}
                    />
                  )}
                </>
              </TextVideoRow>
            </div>
          )}

          {/* YTT Through AYM — improved location cards */}
          {(data.yytTitle ||
            data.yytPara ||
            (data.locations && data.locations.length > 0)) && (
            <div className={styles.yytSection}>
              <VintageHeading>
                {data.yytTitle ||
                  "Yoga Teacher Training through AYM Yoga School"}
              </VintageHeading>
              {data.yytPara && (
                <div
                  className={styles.bodyPara}
                  dangerouslySetInnerHTML={{ __html: data.yytPara }}
                />
              )}
              {data.locations && data.locations.length > 0 && (
                <div className={styles.locationCardsGrid}>
                  {data.locations.map((loc, i) => (
                    <div key={loc._id || i} className={styles.locationCard}>
                      <div className={styles.locationCardImg}>
                        <img
                          src={
                            i === 0 ? PLACEHOLDER.rishikesh : PLACEHOLDER.goa
                          }
                          alt={loc.name}
                          loading="lazy"
                        />
                        <div className={styles.locationCardImgOverlay} />
                        <div className={styles.locationCardBadge}>
                          {loc.name}
                        </div>
                      </div>
                      <div className={styles.locationCardBody}>
                        <div className={styles.locationCardIcon}>
                          <ChakraSVG
                            size={28}
                            color={i === 0 ? "#F15505" : "#d4a017"}
                          />
                        </div>
                        <h3 className={styles.locationName}>{loc.name}</h3>
                        <p className={styles.locationDesc}>{loc.desc}</p>
                        <div className={styles.locationCardLine} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2 — RISHIKESH + GOA + COURSE CARDS
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionWarm}`}>
        <div className="container px-3 px-md-4">
          {/* Rishikesh detail */}
          {(data.rishikeshTitle ||
            data.rishikeshDetailPara ||
            (data.rishikeshParagraphs &&
              data.rishikeshParagraphs.length > 0)) && (
            <LocationDetail
              title={
                data.rishikeshTitle || "Yoga Teacher Training in Rishikesh"
              }
              paragraphs={data.rishikeshParagraphs || []}
              fallbackPara={data.rishikeshDetailPara}
              imgSrc={PLACEHOLDER.rishikesh}
              badge="Rishikesh, India"
            />
          )}

          {/* Goa detail */}
          {(data.goaTitle ||
            data.goaDetailPara ||
            (data.goaParagraphs && data.goaParagraphs.length > 0)) && (
            <div className={styles.locationDetailSpacer}>
              <LocationDetail
                title={data.goaTitle || "Yoga Teacher Training in Goa"}
                paragraphs={data.goaParagraphs || []}
                fallbackPara={data.goaDetailPara}
                imgSrc={PLACEHOLDER.goa}
                badge="Goa, India"
                reverse={true}
              />
            </div>
          )}

          <OmDivider label="Our Courses" />

          {/* Course Cards — improved design */}
          {data.courseCards && data.courseCards.length > 0 && (
            <div className={styles.courseCardsGrid}>
              {data.courseCards.map((card, i) => (
                <CourseCardComp key={card._id || i} card={card} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 3 — WHY AYM + QUOTE IMAGES + PANELS
      ══════════════════════════════ */}
      <section className={`${styles.section} ${styles.sectionDeep}`}>
        <div className="container px-3 px-md-4">
          {/* Why AYM — text left, image right */}
          {data.whyAYMTitle && (
            <TextImageRow
              imageUrl={PLACEHOLDER.yoga5}
              imageAlt="Why AYM Yoga School"
              badge="Excellence in Yoga"
            >
              <>
                <VintageHeading>{data.whyAYMTitle}</VintageHeading>
                {whyParas.map((p, i) => (
                  <div
                    key={i}
                    className={styles.bodyPara}
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </>
            </TextImageRow>
          )}

          {/* Quote image cards */}
          {data.quoteCards && data.quoteCards.length > 0 && (
            <div className={styles.quoteCardsGrid}>
              {data.quoteCards.map((card, i) => (
                <QuoteCard key={card._id || i} card={card} />
              ))}
            </div>
          )}

          <OmDivider label="Practical Info" />

          {/* Info Panels — improved design */}
          {((data.arrivalList && data.arrivalList.length > 0) ||
            (data.feeList && data.feeList.length > 0)) && (
            <div className={styles.infoPanelsGrid}>
              {data.arrivalList && data.arrivalList.length > 0 && (
                <InfoPanel
                  title={data.arrivalTitle || "Arrival & Departure"}
                  items={data.arrivalList}
                />
              )}
              {data.feeList && data.feeList.length > 0 && (
                <InfoPanel
                  title={data.feeTitle || "Includes in Fee"}
                  items={data.feeList}
                />
              )}
            </div>
          )}
        </div>
      </section>
      <PremiumGallerySection type="both" backgroundColor="warm" />
      {/* ✅ REVIEWS — now a reusable separate component */}
      <ReviewSection RatingsSummaryComponent={<RatingsSummarySection />} />
      <HowToReach />
    </div>
  );
}
