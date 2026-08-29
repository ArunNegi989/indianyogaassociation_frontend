import React from "react";
import type { Metadata } from "next";
import styles from "@/assets/style/Yoga-retreat/Yogaretreatpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import PremiumGallerySection from "@/components/PremiumGallerySection";
import Link from "next/link";
import api from "@/lib/api";

/* ─────────────────────────────────────────────────────────
   `api` (lib/api.ts) already has baseURL = NEXT_PUBLIC_API_URL + "/api",
   so it's used for the JSON call below. Uploaded file paths like
   "/uploads/xxx.jpg" are served from the server root (NOT under
   /api), so image URLs are built separately with ASSET_BASE.
───────────────────────────────────────────────────────── */
const ASSET_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${ASSET_BASE}${path}`;
};

/* Axios doesn't plug into Next's fetch-cache the way native fetch does,
   so without this the page could get statically cached at build time
   and never pick up admin-panel edits. Force it to always render fresh. */
export const dynamic = "force-dynamic";

/* ─────────────────────── Types (mirror the backend model) ─────────────────────── */
interface StatItem {
  num: string;
  label: string;
}
interface PackageItem {
  title: string;
  price: string;
}
interface OverviewItem {
  label: string;
  value: string;
}
interface StripItem {
  label: string;
  image?: string;
}
interface BlockItem {
  title: string;
  paragraphs: string[];
  priceFrom: string;
  priceNote: string;
}
interface InfoBlockItem {
  title: string;
  paragraphs: string[];
}
interface RouteItem {
  icon: string;
  title: string;
  badge: string;
  desc: string;
}

interface RetreatData {
  _id?: string;
  heroImage?: string;
  heroImageAlt?: string;
  pageTitle?: string;

  s1Paragraphs?: string[];
  s1Stats?: StatItem[];
  s1Image?: string;
  s1PanelTags?: string[];
  s1Caption?: string;

  s2Title?: string;
  s2Intro?: string;
  packages?: PackageItem[];
  overview?: OverviewItem[];
  applyButtonText?: string;
  applyButtonLink?: string;

  photoStrip?: StripItem[];
  s3Blocks?: BlockItem[];

  s4Blocks?: BlockItem[];
  infoBlocks?: InfoBlockItem[];
  whyChooseText?: string;
  affordableTitle?: string;
  affordableParagraphs?: string[];
  affordableCardTitle?: string;
  affordableCardSub?: string;
  affordableFeatures?: string[];

  reachTitle?: string;
  reachParagraphs?: string[];
  routes?: RouteItem[];
  bookNowText?: string;
  bookNowLink?: string;
  paypalText?: string;
  paypalLink?: string;
}

/* Route card accent/badge styles cycle through these three looks. */
const ROUTE_ACCENT_CLASSES = ["routeAccent", "routeAccentDark", "routeAccentMid"] as const;
const ROUTE_BADGE_CLASSES = ["routeBadge", "routeBadgeDark", "routeBadgeMid"] as const;

/* ─────────────────────── Data fetching ─────────────────────── */
async function getRetreatData(): Promise<RetreatData | null> {
  try {
    const res = await api.get("/yoga-retreat-section");
    const doc = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data;
    return doc || null;
  } catch (err) {
    console.error("Failed to fetch yoga retreat section:", err);
    return null;
  }
}

/* No hardcoded copy here — only safe empty defaults so the page
   never crashes on a missing field while content is being added
   in the admin panel. Every piece of visible text/image comes
   from the backend document. */
function withSafeDefaults(d: RetreatData | null): Required<RetreatData> {
  return {
    _id: d?._id || "",
    heroImage: d?.heroImage || "",
    heroImageAlt: d?.heroImageAlt || "",
    pageTitle: d?.pageTitle || "",

    s1Paragraphs: d?.s1Paragraphs || [],
    s1Stats: d?.s1Stats || [],
    s1Image: d?.s1Image || "",
    s1PanelTags: d?.s1PanelTags || [],
    s1Caption: d?.s1Caption || "",

    s2Title: d?.s2Title || "",
    s2Intro: d?.s2Intro || "",
    packages: d?.packages || [],
    overview: d?.overview || [],
    applyButtonText: d?.applyButtonText || "",
    applyButtonLink: d?.applyButtonLink || "",

    photoStrip: d?.photoStrip || [],
    s3Blocks: d?.s3Blocks || [],

    s4Blocks: d?.s4Blocks || [],
    infoBlocks: d?.infoBlocks || [],
    whyChooseText: d?.whyChooseText || "",
    affordableTitle: d?.affordableTitle || "",
    affordableParagraphs: d?.affordableParagraphs || [],
    affordableCardTitle: d?.affordableCardTitle || "",
    affordableCardSub: d?.affordableCardSub || "",
    affordableFeatures: d?.affordableFeatures || [],

    reachTitle: d?.reachTitle || "",
    reachParagraphs: d?.reachParagraphs || [],
    routes: d?.routes || [],
    bookNowText: d?.bookNowText || "",
    bookNowLink: d?.bookNowLink || "",
    paypalText: d?.paypalText || "",
    paypalLink: d?.paypalLink || "",
  };
}

/* ─────────────────────── Metadata (fully dynamic from backend) ─────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const data = await getRetreatData();
  return {
    title: data?.pageTitle || "",
    description: data?.s2Intro || "",
  };
}

const OmDivider = () => (
  <div className={styles.omDivider}>
    <span className={styles.dividerLine} />
    <span className={styles.omSymbol}>ॐ</span>
    <span className={styles.dividerLine} />
  </div>
);

export default async function YogaRetreatPage() {
  const raw = await getRetreatData();
  const data = withSafeDefaults(raw);

  const heroSrc = getImageUrl(data.heroImage);
  const s1ImgSrc = getImageUrl(data.s1Image);

  return (
    <div className={styles.page}>
      {heroSrc && (
        <section className={styles.heroSection}>
          <img
            src={heroSrc}
            alt={data.heroImageAlt}
            width={1180}
            height={540}
            className={styles.heroImage}
          />
        </section>
      )}
      {/* TOP BORDER */}
      <div className={styles.a} />

      <section className={styles.heroSection1}>
        <div className={styles.container}>
          {data.pageTitle && <h1 className={styles.pageTitle}>{data.pageTitle}</h1>}
          <OmDivider />

          <div className={styles.s1TwoCol}>
            {/* LEFT — text */}
            <div className={styles.s1TextCol}>
              {data.s1Paragraphs.map((para, i) => (
                <p key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
              ))}

              {data.s1Stats.length > 0 && (
                <div className={styles.s1Stats}>
                  {data.s1Stats.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div className={styles.s1Stat}>
                        <span className={styles.s1StatNum}>{stat.num}</span>
                        <span className={styles.s1StatLbl}>{stat.label}</span>
                      </div>
                      {i < data.s1Stats.length - 1 && <div className={styles.s1StatDiv} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — image */}
            <div className={styles.s1ImgCol}>
              {s1ImgSrc && (
                <img src={s1ImgSrc} alt="Yoga retreat in Rishikesh" className={styles.s1Img} />
              )}
              {data.s1PanelTags.length > 0 && (
                <div className={styles.s1ImgPanel}>
                  <span className={styles.s1PanelOm}>ॐ</span>
                  {data.s1PanelTags.map((tag, i) => (
                    <React.Fragment key={i}>
                      <div className={styles.s1PanelRule} />
                      <p className={styles.s1PanelTag}>{tag}</p>
                    </React.Fragment>
                  ))}
                </div>
              )}
              {data.s1Caption && (
                <div className={styles.s1ImgCaption}>
                  <span>{data.s1Caption}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* section2 */}
      <section className={styles.scheduleSection} id="schedule">
        <div className={styles.container}>
          {data.s2Title && <h2 className={styles.secTitle}>{data.s2Title}</h2>}
          <OmDivider />

          {data.s2Intro && <p className={styles.scheduleIntro}>{data.s2Intro}</p>}

          <div className={styles.scheduleGrid}>
            {/* LEFT — Pricing card */}
            {data.packages.length > 0 && (
              <div className={styles.scheduleCard}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>🧘</span>
                  <div>
                    <p className={styles.cardHeadTitle}>Yoga Retreats in Rishikesh</p>
                    <p className={styles.cardHeadSub}>Pricing &amp; Packages</p>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  {data.packages.map((pkg, i) => (
                    <div key={i} className={styles.pkgRow}>
                      <div className={styles.pkgLeft}>
                        <div className={styles.pkgDot} />
                        <span className={styles.pkgName}>{pkg.title}</span>
                      </div>
                      <span className={styles.pkgPrice}>{pkg.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RIGHT — Overview card */}
            {data.overview.length > 0 && (
              <div className={styles.scheduleCard}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>📋</span>
                  <div>
                    <p className={styles.cardHeadTitle}>Yoga Retreats Overview</p>
                    <p className={styles.cardHeadSub}>What's Included</p>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  {data.overview.map((item, i) => (
                    <div key={i} className={styles.ovRow}>
                      <div className={styles.ovContent}>
                        <p className={styles.ovLabel}>{item.label}</p>
                        <p className={styles.ovValue}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {data.applyButtonText && data.applyButtonLink && (
            <div className={styles.applyWrap}>
              <Link href={data.applyButtonLink} className={styles.applyBtn}>
                {data.applyButtonText}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* section 3 */}
      <section className={styles.photoSection}>
        {data.photoStrip.length > 0 && (
          <div className={styles.photoStrip}>
            {data.photoStrip.map((item, i) => (
              <div key={i} className={styles.stripCell}>
                {item.image && (
                  <img src={getImageUrl(item.image)} alt={item.label} className={styles.stripImg} />
                )}
                {item.label && <span className={styles.stripLabel}>{item.label}</span>}
              </div>
            ))}
          </div>
        )}

        {data.s3Blocks.length > 0 && (
          <div className={styles.s3Inner}>
            <div className={styles.s3Grid}>
              {data.s3Blocks.map((block, i) => (
                <div key={i} className={styles.contentBox}>
                  <div className={styles.contentBoxInner}>
                    {block.title && <h2 className={styles.secTitle}>{block.title}</h2>}
                    <OmDivider />
                    {block.paragraphs.map((para, pi) => (
                      <p key={pi} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                    {block.priceFrom && (
                      <div className={styles.pricePill}>
                        <span className={styles.priceLabel}>From</span>
                        <span className={styles.priceVal}>{block.priceFrom}</span>
                      </div>
                    )}
                    {block.priceNote && <p className={styles.priceNote}>{block.priceNote}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4 */}
      <section className={styles.altSection}>
        <div className={styles.s4Inner}>
          {data.s4Blocks.length > 0 && (
            <div className={styles.s4TopGrid}>
              {data.s4Blocks.map((block, i) => (
                <div key={i} className={styles.contentBox}>
                  <div className={styles.contentBoxInner}>
                    {block.title && <h2 className={styles.secTitle}>{block.title}</h2>}
                    <OmDivider />
                    {block.paragraphs.map((para, pi) => (
                      <p key={pi} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                    {block.priceFrom && (
                      <div className={styles.pricePill}>
                        <span className={styles.priceLabel}>From</span>
                        <span className={styles.priceVal}>{block.priceFrom}</span>
                      </div>
                    )}
                    {block.priceNote && <p className={styles.priceNote}>{block.priceNote}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Schedule / Book / Refund — Full Width ── */}
          {data.infoBlocks.length > 0 && (
            <section className={styles.infoBlocksSection}>
              <div className={styles.infoBlocksWrap}>
                {data.infoBlocks.map((block, i) => (
                  <div key={i} className={styles.infoBlock}>
                    {block.title && <h2 className={styles.secTitle}>{block.title}</h2>}
                    <OmDivider />
                    {block.paragraphs.map((para, pi) => (
                      <p key={pi} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.whyChooseText && (
            <div className={styles.s4Divider}>
              <span className={styles.s4DivLine} />
              <span className={styles.s4DivText}>{data.whyChooseText}</span>
              <span className={styles.s4DivLine} />
            </div>
          )}

          {/* Affordable block */}
          {(data.affordableTitle || data.affordableParagraphs.length > 0 || data.affordableFeatures.length > 0) && (
            <div className={styles.affordableWrap}>
              <div className={styles.affordableText}>
                {data.affordableTitle && (
                  <h2 className={styles.secTitle} style={{ textAlign: "left" }}>
                    {data.affordableTitle}
                  </h2>
                )}
                <OmDivider />
                {data.affordableParagraphs.map((para, i) => (
                  <p key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
                ))}
              </div>

              {(data.affordableCardTitle || data.affordableFeatures.length > 0) && (
                <div className={styles.affordableCard}>
                  <div className={styles.affordableCardHead}>
                    {data.affordableCardTitle && (
                      <p className={styles.affordableCardHeadTitle}>{data.affordableCardTitle}</p>
                    )}
                    {data.affordableCardSub && (
                      <p className={styles.affordableCardHeadSub}>{data.affordableCardSub}</p>
                    )}
                  </div>
                  <div className={styles.affordableCardBody}>
                    {data.affordableFeatures.map((f, i) => (
                      <div key={i} className={styles.affordableFeature}>
                        <div className={styles.featDot} />
                        <span className={styles.featText}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <PremiumGallerySection type="both" backgroundColor="warm" />

      {/* section 6 */}
      <section className={styles.reachSection} id="book">
        <div className={styles.container}>
          {data.reachTitle && <h2 className={styles.secTitle}>{data.reachTitle}</h2>}
          <OmDivider />

          <div className={styles.reachTwoCol}>
            {/* LEFT — text + CTAs */}
            <div className={styles.reachTextCol}>
              {data.reachParagraphs.map((para, i) => (
                <p key={i} className={styles.bodyPara} dangerouslySetInnerHTML={{ __html: para }} />
              ))}

              {(data.bookNowText || data.paypalText) && (
                <div className={styles.bookBtnGroup}>
                  {data.bookNowText && data.bookNowLink && (
                    <Link href={data.bookNowLink} className={styles.bookNowBtn}>
                      {data.bookNowText}
                    </Link>
                  )}
                  {data.paypalText && data.paypalLink && (
                    <Link href={data.paypalLink} className={styles.paypalBtn}>
                      <span className={styles.paypalText}>{data.paypalText}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — route cards */}
            {data.routes.length > 0 && (
              <div className={styles.routesCol}>
                {data.routes.map((route, i) => {
                  const accentClass = styles[ROUTE_ACCENT_CLASSES[i % 3]];
                  const badgeClass = styles[ROUTE_BADGE_CLASSES[i % 3]];
                  return (
                    <div key={i} className={styles.routeCard}>
                      <div className={accentClass} />
                      <div className={styles.routeBody}>
                        <div className={styles.routeHead}>
                          <span className={styles.routeIcon}>{route.icon}</span>
                          <span className={styles.routeTitle}>{route.title}</span>
                          <span className={badgeClass}>{route.badge}</span>
                        </div>
                        <p className={styles.routeDesc}>{route.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <HowToReach />
      {/* BOTTOM BORDER */}
      <div className={styles.bottomBorder} />
    </div>
  );
}