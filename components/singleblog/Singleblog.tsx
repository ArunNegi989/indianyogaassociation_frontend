"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/style/Singleblog/Singleblog.module.css";

/* ================================================================
   TYPES
   ================================================================ */
export type SectionType =
  | "heading" | "subheading" | "paragraph" | "images" | "divider"
  | "list" | "quote" | "code" | "video" | "table" | "callout" | "spacer" | "html";

export type ImageLayout = "single" | "two-col" | "three-col" | "wide";
export type ListType = "unordered" | "ordered";
export type CalloutVariant = "info" | "warning" | "success" | "tip" | "danger";

export interface BlogImage {
  src: string;
  caption?: string;
  altText?: string;
}

export interface BlogSection {
  type: SectionType;
  text?: string;
  listType?: ListType;
  listItems?: string[];
  quoteAuthor?: string;
  codeLanguage?: string;
  videoUrl?: string;
  videoCaption?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  calloutVariant?: CalloutVariant;
  calloutTitle?: string;
  spacerHeight?: number;
  images?: BlogImage[];
  imageLayout?: ImageLayout;
}

export interface Blog {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  coverImage: string;
  image?: string;
  tags?: string[];
  content?: BlogSection[];
  status?: string;
}

interface SingleBlogProps {
  blog: Blog;
  relatedPosts?: Blog[];
  recentPosts?: Blog[];
}

/* ================================================================
   IMAGE URL HELPER
   ================================================================ */
const BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api\/?$/, "");

function resolveImg(src?: string): string {
  if (!src) return "/placeholder.jpg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("blob:")) return "/placeholder.jpg";
  return `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

/* ================================================================
   LAYOUT HELPER
   ================================================================ */
function getLayoutClass(layout: ImageLayout | undefined, count: number): string {
  if (layout === "single") return styles.gridOne;
  if (layout === "two-col") return styles.gridTwo;
  if (layout === "three-col") return styles.gridThree;
  if (layout === "wide") return styles.gridWide;
  if (count === 1) return styles.gridOne;
  if (count === 2) return styles.gridTwo;
  return styles.gridThree;
}

/* ================================================================
   VIDEO URL EMBED HELPER
   YouTube / Vimeo ko embed URL mein convert karta hai
   ================================================================ */
function getEmbedUrl(url: string): string {
  if (!url) return "";
  // YouTube: watch?v= or youtu.be/
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

/* ================================================================
   CALLOUT CONFIG
   ================================================================ */
const CALLOUT_CONFIG: Record<CalloutVariant, { icon: string; label: string }> = {
  info: { icon: "ℹ️", label: "Information" },
  tip: { icon: "💡", label: "Tip" },
  success: { icon: "✅", label: "Success" },
  warning: { icon: "⚠️", label: "Warning" },
  danger: { icon: "🚨", label: "Important" },
};

/* ================================================================
   SVG ORNAMENT
   ================================================================ */
const OrnamentTop = () => (
  <svg
    className={styles.ornamentTop}
    viewBox="0 0 400 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <line x1="0" y1="20" x2="155" y2="20" stroke="#F15505" strokeWidth="0.8" />
    <circle cx="165" cy="20" r="4" fill="none" stroke="#F15505" strokeWidth="0.8" />
    <text x="200" y="26" textAnchor="middle" fontSize="18" fill="#F15505" fontFamily="serif">ॐ</text>
    <circle cx="235" cy="20" r="4" fill="none" stroke="#F15505" strokeWidth="0.8" />
    <line x1="245" y1="20" x2="400" y2="20" stroke="#F15505" strokeWidth="0.8" />
    <circle cx="165" cy="20" r="8" fill="none" stroke="#F15505" strokeWidth="0.4" opacity="0.4" />
    <circle cx="235" cy="20" r="8" fill="none" stroke="#F15505" strokeWidth="0.4" opacity="0.4" />
  </svg>
);

/* ================================================================
   OM DIVIDER
   ================================================================ */
const OmDivider = () => (
  <div className={styles.innerDivider}>
    <span className={styles.innerLine} />
    <span className={styles.innerOm}>ॐ</span>
    <span className={styles.innerLine} />
  </div>
);

/* ================================================================
   IMAGE GRID BLOCK
   ================================================================ */
const ArticleImages = ({
  images,
  imageLayout,
}: {
  images: BlogImage[];
  imageLayout?: ImageLayout;
}) => {
  const layoutClass = getLayoutClass(imageLayout, images.length);
  return (
    <div className={`${styles.articleImgGrid} ${layoutClass}`}>
      {images.map((img, i) => {
        const resolvedSrc = resolveImg(img.src);
        return (
          <figure key={i} className={styles.articleImgFigure}>
            <div className={styles.articleImgWrap}>
              <Image
                src={resolvedSrc}
                alt={img.altText || img.caption || "Blog image"}
                fill
                sizes={
                  imageLayout === "single" || imageLayout === "wide"
                    ? "100vw"
                    : "(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
                }
                className={styles.articleImg}
                unoptimized
              />
              <div className={styles.articleImgSheen} />
            </div>
            {img.caption && (
              <figcaption className={styles.articleImgCaption}>
                {img.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
};

/* ================================================================
   LIST BLOCK
   ================================================================ */
const ListBlock = ({ listType, listItems }: { listType?: ListType; listItems?: string[] }) => {
  if (!listItems || listItems.length === 0) return null;
  if (listType === "ordered") {
    return (
      <ol className={styles.contentList}>
        {listItems.map((item, i) => (
          <li key={i} className={styles.contentListItem}>{item}</li>
        ))}
      </ol>
    );
  }
  return (
    <ul className={styles.contentList}>
      {listItems.map((item, i) => (
        <li key={i} className={styles.contentListItem}>{item}</li>
      ))}
    </ul>
  );
};

/* ================================================================
   QUOTE BLOCK
   ================================================================ */
const QuoteBlock = ({ text, quoteAuthor }: { text?: string; quoteAuthor?: string }) => (
  <blockquote className={styles.contentQuote}>
    <span className={styles.quoteIcon}>❝</span>
    <p className={styles.quoteText}>{text}</p>
    {quoteAuthor && <cite className={styles.quoteAuthor}>— {quoteAuthor}</cite>}
  </blockquote>
);

/* ================================================================
   CODE BLOCK
   ================================================================ */
const CodeBlock = ({ text, codeLanguage }: { text?: string; codeLanguage?: string }) => (
  <div className={styles.contentCodeWrap}>
    {codeLanguage && codeLanguage !== "plaintext" && (
      <div className={styles.codeLangBadge}>{codeLanguage}</div>
    )}
    <pre className={styles.contentCode}>
      <code>{text}</code>
    </pre>
  </div>
);

/* ================================================================
   VIDEO BLOCK
   ================================================================ */
const VideoBlock = ({ videoUrl, videoCaption }: { videoUrl?: string; videoCaption?: string }) => {
  if (!videoUrl) return null;
  const embedUrl = getEmbedUrl(videoUrl);
  return (
    <div className={styles.contentVideoWrap}>
      <div className={styles.contentVideoFrame}>
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={videoCaption || "Video"}
          className={styles.contentVideoIframe}
        />
      </div>
      {videoCaption && <p className={styles.contentVideoCaption}>{videoCaption}</p>}
    </div>
  );
};

/* ================================================================
   TABLE BLOCK
   ================================================================ */
const TableBlock = ({
  tableHeaders,
  tableRows,
}: {
  tableHeaders?: string[];
  tableRows?: string[][];
}) => {
  if (!tableHeaders || tableHeaders.length === 0) return null;
  return (
    <div className={styles.contentTableWrap}>
      <table className={styles.contentTable}>
        <thead>
          <tr>
            {tableHeaders.map((h, i) => (
              <th key={i} className={styles.contentTh}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(tableRows ?? []).map((row, rIdx) => (
            <tr key={rIdx} className={styles.contentTr}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className={styles.contentTd}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ================================================================
   CALLOUT BLOCK
   ================================================================ */
const CalloutBlock = ({
  calloutVariant = "info",
  calloutTitle,
  text,
}: {
  calloutVariant?: CalloutVariant;
  calloutTitle?: string;
  text?: string;
}) => {
  const config = CALLOUT_CONFIG[calloutVariant];
  return (
    <div className={`${styles.contentCallout} ${styles[`callout${calloutVariant.charAt(0).toUpperCase() + calloutVariant.slice(1)}`]}`}>
      <div className={styles.calloutHeader}>
        <span className={styles.calloutIcon}>{config.icon}</span>
        <span className={styles.calloutTitle}>{calloutTitle || config.label}</span>
      </div>
      {text && <p className={styles.calloutText}>{text}</p>}
    </div>
  );
};

/* ================================================================
   SPACER BLOCK
   ================================================================ */
const SpacerBlock = ({ spacerHeight = 40 }: { spacerHeight?: number }) => (
  <div style={{ height: `${spacerHeight}px` }} aria-hidden="true" />
);

/* ================================================================
   DIVIDER BLOCK
   ================================================================ */
const DividerBlock = () => (
  <div className={styles.contentDivider}>
    <span className={styles.dividerLeft} />
    <span className={styles.dividerSymbol}>✦ ॐ ✦</span>
    <span className={styles.dividerRight} />
  </div>
);

/* ================================================================
   HTML BLOCK — dangerouslySetInnerHTML (safe for trusted admin content)
   ================================================================ */
const HtmlBlock = ({ text }: { text?: string }) => (
  <div
    className={styles.contentHtml}
    dangerouslySetInnerHTML={{ __html: text || "" }}
  />
);

/* ================================================================
   PARAGRAPH BLOCK
   Jodit se aaya HTML safely render hoga — tags UI mein nahi dikhenge
   ================================================================ */
const ParagraphBlock = ({ text }: { text?: string }) => (
  <div
    className={styles.contentPara}
    dangerouslySetInnerHTML={{ __html: text || "" }}
  />
);

/* ================================================================
   MAIN CONTENT RENDERER — Har block type properly render hota hai
   ================================================================ */
const RenderSections = ({ sections }: { sections: BlogSection[] }) => (
  <>
    {sections.map((s, i) => {
      switch (s.type) {
        case "heading":
          return <h2 key={i} className={styles.contentH2}>{s.text}</h2>;

        case "subheading":
          return <h3 key={i} className={styles.contentH3}>{s.text}</h3>;

        case "paragraph":
          return <ParagraphBlock key={i} text={s.text} />;

        case "images":
          return s.images && s.images.length > 0 ? (
            <ArticleImages key={i} images={s.images} imageLayout={s.imageLayout} />
          ) : null;

        case "list":
          return <ListBlock key={i} listType={s.listType} listItems={s.listItems} />;

        case "quote":
          return <QuoteBlock key={i} text={s.text} quoteAuthor={s.quoteAuthor} />;

        case "code":
          return <CodeBlock key={i} text={s.text} codeLanguage={s.codeLanguage} />;

        case "video":
          return <VideoBlock key={i} videoUrl={s.videoUrl} videoCaption={s.videoCaption} />;

        case "table":
          return <TableBlock key={i} tableHeaders={s.tableHeaders} tableRows={s.tableRows} />;

        case "callout":
          return (
            <CalloutBlock
              key={i}
              calloutVariant={s.calloutVariant}
              calloutTitle={s.calloutTitle}
              text={s.text}
            />
          );

        case "spacer":
          return <SpacerBlock key={i} spacerHeight={s.spacerHeight} />;

        case "divider":
          return <DividerBlock key={i} />;

        case "html":
          return <HtmlBlock key={i} text={s.text} />;

        default:
          return null;
      }
    })}
  </>
);

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function SingleBlog({
  blog,
  relatedPosts = [],
  recentPosts = [],
}: SingleBlogProps) {
  const heroImage = resolveImg(blog.coverImage || blog.image);

  /* Date formatting */
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.pageRoot}>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <div className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <Image
            src={heroImage}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
            unoptimized
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* Rotating Mandala */}
        <svg className={styles.heroMandala} viewBox="0 0 300 300" fill="none" aria-hidden="true">
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line key={i}
                x1={150 + 35 * Math.cos(rad)} y1={150 + 35 * Math.sin(rad)}
                x2={150 + 130 * Math.cos(rad)} y2={150 + 130 * Math.sin(rad)}
                stroke="white" strokeWidth="0.5" opacity="0.25"
              />
            );
          })}
          {[140,110,80,50,20].map((r, i) => (
            <circle key={i} cx="150" cy="150" r={r} stroke="white" strokeWidth="0.6"
              opacity={0.15 + i * 0.03} strokeDasharray={i % 2 === 0 ? "4 3" : "none"} />
          ))}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle key={i} cx={150 + 90 * Math.cos(rad)} cy={150 + 90 * Math.sin(rad)}
                r="5" fill="white" opacity="0.2" />
            );
          })}
        </svg>

        {/* Hero Content */}
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span className={styles.breadSep}>›</span>
            <Link href="/blog/aym-yoga-blog" className={styles.breadLink}>Blog</Link>
            <span className={styles.breadSep}>›</span>
            <span className={styles.breadCurrent}>{blog.category}</span>
          </nav>

          <span className={styles.heroCategory}>{blog.category}</span>
          <h1 className={styles.heroTitle}>{blog.title}</h1>

          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <time dateTime={blog.date}>{formattedDate}</time>
            </span>
            {blog.author && (
              <span className={styles.metaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {blog.author}
              </span>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <span className={styles.metaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {blog.tags[0]}{blog.tags.length > 1 ? ` +${blog.tags.length - 1}` : ""}
              </span>
            )}
          </div>
        </div>

        {/* Wave */}
        <svg className={styles.heroWave} viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="#fdf6ec" />
        </svg>
      </div>

      {/* ══════════════════════════════
          BODY
      ══════════════════════════════ */}
      <div className={styles.layout}>

        {/* ── Article ── */}
        <article className={styles.article}>
          <OrnamentTop />

          <p className={styles.lead}>{blog.excerpt}</p>

          <OmDivider />

          <div className={styles.content}>
            {blog.content && blog.content.length > 0 ? (
              <RenderSections sections={blog.content} />
            ) : (
              <p className={styles.contentPlaceholder}>
                Content abhi available nahi hai. Please check back soon.
              </p>
            )}
          </div>

          <OmDivider />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className={styles.articleTags}>
              <span className={styles.tagsLabel}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                Topics:
              </span>
              {blog.tags.map((tag) => (
                <span key={tag} className={styles.articleTag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Back button */}
          <div className={styles.backRow}>
            <Link href="/blog/aym-yoga-blog" className={styles.backBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <div className={styles.sideWidget}>
              <div className={styles.sideWidgetHeader}>
                <span className={styles.sideOm}>ॐ</span>
                <h3 className={styles.sideWidgetTitle}>Recent Posts</h3>
              </div>
              <ul className={styles.recentList}>
                {recentPosts.map((post) => {
                  const postImg = resolveImg(post.coverImage || post.image);
                  const postDate = post.date
                    ? new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "";
                  return (
                    <li key={post._id || post.id} className={styles.recentItem}>
                      <Link href={`/blog/aym-yoga-blog/${post.slug}`} className={styles.recentLink}>
                        <div className={styles.recentImgWrap}>
                          <Image src={postImg} alt={post.title} fill sizes="72px" className={styles.recentImg} unoptimized />
                          <div className={styles.recentImgSheen} />
                        </div>
                        <div className={styles.recentInfo}>
                          <span className={styles.recentCategory}>{post.category}</span>
                          <p className={styles.recentTitle}>{post.title}</p>
                          <span className={styles.recentDate}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {postDate}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.recentViewAll}>
                <Link href="/blog/aym-yoga-blog" className={styles.recentViewAllLink}>View All Articles →</Link>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className={styles.sideWidget}>
              <div className={styles.sideWidgetHeader}>
                <span className={styles.sideOm}>ॐ</span>
                <h3 className={styles.sideWidgetTitle}>In This Category</h3>
              </div>
              <ul className={styles.relatedList}>
                {relatedPosts.map((post) => {
                  const relImg = resolveImg(post.coverImage || post.image);
                  const relDate = post.date
                    ? new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "";
                  return (
                    <li key={post._id || post.id} className={styles.relatedItem}>
                      <Link href={`/blog/aym-yoga-blog/${post.slug}`} className={styles.relatedLink}>
                        <div className={styles.relatedImgWrap}>
                          <Image src={relImg} alt={post.title} fill sizes="56px" className={styles.relatedImg} unoptimized />
                        </div>
                        <div className={styles.relatedInfo}>
                          <p className={styles.relatedTitle}>{post.title}</p>
                          <span className={styles.relatedDate}>{relDate}</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* CTA Widget */}
          <div className={styles.sideCtaWidget}>
            <div className={styles.ctaMandalaBg} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" width="100%" height="100%">
                {[95,75,55,35].map((r, i) => (
                  <circle key={i} cx="100" cy="100" r={r}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"
                    strokeDasharray={i % 2 === 0 ? "3 3" : "none"} />
                ))}
                <text x="100" y="110" textAnchor="middle" fontSize="36"
                  fill="rgba(255,255,255,0.25)" fontFamily="serif">ॐ</text>
              </svg>
            </div>
            <div className={styles.ctaContent}>
              <h4 className={styles.ctaTitle}>Start Your Yoga Journey</h4>
              <p className={styles.ctaText}>Join AYM Yoga School's world-class teacher training programs</p>
              <Link href="/register" className={styles.ctaBtn}>Enquire Now</Link>
            </div>
          </div>

          {/* Upcoming Batches */}
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetHeader}>
              <span className={styles.sideOm}>ॐ</span>
              <h3 className={styles.sideWidgetTitle}>Upcoming Batches</h3>
            </div>
            <div className={styles.batchList}>
              {[
                { label: "200 Hour YTT", href: "/200-hour-ytt", dates: "Aug – Nov 2025", price: "₹21,000" },
                { label: "300 Hour YTT", href: "/300-hour-ytt", dates: "Aug – Nov 2025", price: "₹25,000" },
                { label: "500 Hour YTT", href: "/500-hour-ytt", dates: "Aug – Dec 2025", price: "₹45,000" },
              ].map((batch) => (
                <Link href={batch.href} key={batch.label} className={styles.batchItem}>
                  <div>
                    <p className={styles.batchLabel}>{batch.label}</p>
                    <p className={styles.batchDates}>{batch.dates}</p>
                  </div>
                  <span className={styles.batchPrice}>{batch.price}</span>
                </Link>
              ))}
              <Link href="/register" className={styles.batchRegister}>Register Now →</Link>
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}