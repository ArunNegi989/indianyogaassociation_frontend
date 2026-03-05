// ═══════════════════════════════════════════════════════
// FILE LOCATION: src/components/singleblog/Singleblog.tsx
// ═══════════════════════════════════════════════════════
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/style/Singleblog/Singleblog.module.css";
import type { Blog, BlogSection, BlogImage } from "@/lib/blogs";

interface SingleBlogProps {
  blog: Blog;
  relatedPosts?: Blog[];   // Same category posts
  recentPosts?: Blog[];    // Latest posts across all categories ← NEW
}

/* ─── SVG Ornament ───────────────────────────────────── */
const OrnamentsTop = () => (
  <svg
    className={styles.ornamentTop}
    viewBox="0 0 400 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <line x1="0" y1="20" x2="155" y2="20" stroke="#e07b00" strokeWidth="0.8" />
    <circle cx="165" cy="20" r="4" fill="none" stroke="#e07b00" strokeWidth="0.8" />
    <text x="200" y="26" textAnchor="middle" fontSize="18" fill="#e07b00" fontFamily="serif">ॐ</text>
    <circle cx="235" cy="20" r="4" fill="none" stroke="#e07b00" strokeWidth="0.8" />
    <line x1="245" y1="20" x2="400" y2="20" stroke="#e07b00" strokeWidth="0.8" />
    <circle cx="165" cy="20" r="8" fill="none" stroke="#e07b00" strokeWidth="0.4" opacity="0.4" />
    <circle cx="235" cy="20" r="8" fill="none" stroke="#e07b00" strokeWidth="0.4" opacity="0.4" />
  </svg>
);

/* ─── Om Divider ─────────────────────────────────────── */
const OmDivider = () => (
  <div className={styles.innerDivider}>
    <span className={styles.innerLine} />
    <span className={styles.innerOm}>ॐ</span>
    <span className={styles.innerLine} />
  </div>
);

/* ─── Article Image Grid ─────────────────────────────── */
const ArticleImages = ({ images }: { images: BlogImage[] }) => (
  <div
    className={[
      styles.articleImgGrid,
      images.length === 1 ? styles.gridOne :
      images.length === 2 ? styles.gridTwo :
      styles.gridThree,
    ].join(" ")}
  >
    {images.map((img, i) => (
      <figure key={i} className={styles.articleImgFigure}>
        <div className={styles.articleImgWrap}>
          <Image
            src={img.src}
            alt={img.caption}
            fill
            sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
            className={styles.articleImg}
          />
          <div className={styles.articleImgSheen} />
        </div>
        <figcaption className={styles.articleImgCaption}>{img.caption}</figcaption>
      </figure>
    ))}
  </div>
);

/* ─── Rich Content Renderer ──────────────────────────── */
const RenderSections = ({ sections }: { sections: BlogSection[] }) => (
  <>
    {sections.map((s, i) => {
      switch (s.type) {
        case "heading":
          return <h2 key={i} className={styles.contentH2}>{s.text}</h2>;
        case "subheading":
          return <h3 key={i} className={styles.contentH3}>{s.text}</h3>;
        case "paragraph":
          return <p key={i} className={styles.contentPara}>{s.text}</p>;
        case "images":
          return s.images ? <ArticleImages key={i} images={s.images} /> : null;
        case "divider":
          return <OmDivider key={i} />;
        default:
          return null;
      }
    })}
  </>
);

/* ─── Main Component ─────────────────────────────────── */
export default function SingleBlog({ blog, relatedPosts = [], recentPosts = [] }: SingleBlogProps) {
  return (
    <div className={styles.pageRoot}>

      {/* ══════════ HERO ══════════ */}
      <div className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            sizes="100vw"
            className={styles.heroImg}
          />
          <div className={styles.heroOverlay} />
        </div>

        {/* Rotating mandala */}
        <svg
          className={styles.heroMandala}
          viewBox="0 0 300 300"
          fill="none"
          aria-hidden="true"
        >
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
          {[140, 110, 80, 50, 20].map((r, i) => (
            <circle key={i} cx="150" cy="150" r={r}
              stroke="white" strokeWidth="0.6"
              opacity={0.15 + i * 0.03}
              strokeDasharray={i % 2 === 0 ? "4 3" : "none"}
            />
          ))}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle key={i}
                cx={150 + 90 * Math.cos(rad)}
                cy={150 + 90 * Math.sin(rad)}
                r="5" fill="white" opacity="0.2"
              />
            );
          })}
        </svg>

        <div className={styles.heroContent}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span className={styles.breadSep}>›</span>
            <Link href="/aym-yoga-blog" className={styles.breadLink}>AYM Blog</Link>
            <span className={styles.breadSep}>›</span>
            <span className={styles.breadCurrent}>{blog.category}</span>
          </nav>

          <span className={styles.heroCategory}>{blog.category}</span>
          <h1 className={styles.heroTitle}>{blog.title}</h1>

          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <time dateTime={blog.date}>{blog.date}</time>
            </span>
            {blog.author && (
              <span className={styles.metaItem}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {blog.author}
              </span>
            )}
          </div>
        </div>

        {/* Wave cutout */}
        <svg className={styles.heroWave} viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none">
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="#fdf6ec" />
        </svg>
      </div>

      {/* ══════════ BODY ══════════ */}
      <div className={styles.layout}>

        {/* ── Article ── */}
        <article className={styles.article}>
          <OrnamentsTop />

          {/* Lead excerpt */}
          <p className={styles.lead}>{blog.excerpt}</p>

          <OmDivider />

          {/* Rich content sections */}
          <div className={styles.content}>
            {blog.content ? (
              <RenderSections sections={blog.content} />
            ) : (
              <p className={styles.contentPlaceholder}>
                Full blog content goes here. Add a <code>content</code> array to this blog in <code>src/lib/blogs.ts</code>.
              </p>
            )}
          </div>

          <OmDivider />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className={styles.articleTags}>
              <span className={styles.tagsLabel}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Topics:
              </span>
              {blog.tags.map(tag => (
                <span key={tag} className={styles.articleTag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Back button */}
          <div className={styles.backRow}>
            <Link href="/aym-yoga-blog" className={styles.backBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Blog
            </Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>

          {/* ── Recent Posts Widget ── NEW ── */}
          {recentPosts.length > 0 && (
            <div className={styles.sideWidget}>
              <div className={styles.sideWidgetHeader}>
                <span className={styles.sideOm}>ॐ</span>
                <h3 className={styles.sideWidgetTitle}>Recent Posts</h3>
              </div>
              <ul className={styles.recentList}>
                {recentPosts.map(post => (
                  <li key={post.id} className={styles.recentItem}>
                    <Link href={`/aym-yoga-blog/${post.slug}`} className={styles.recentLink}>
                      <div className={styles.recentImgWrap}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="72px"
                          className={styles.recentImg}
                        />
                        <div className={styles.recentImgSheen} />
                      </div>
                      <div className={styles.recentInfo}>
                        <span className={styles.recentCategory}>{post.category}</span>
                        <p className={styles.recentTitle}>{post.title}</p>
                        <span className={styles.recentDate}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {post.date}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className={styles.recentViewAll}>
                <Link href="/aym-yoga-blog" className={styles.recentViewAllLink}>
                  View All Articles →
                </Link>
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
                {relatedPosts.map(post => (
                  <li key={post.id} className={styles.relatedItem}>
                    <Link href={`/aym-yoga-blog/${post.slug}`} className={styles.relatedLink}>
                      <div className={styles.relatedImgWrap}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="56px"
                          className={styles.relatedImg}
                        />
                      </div>
                      <div className={styles.relatedInfo}>
                        <p className={styles.relatedTitle}>{post.title}</p>
                        <span className={styles.relatedDate}>{post.date}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Widget */}
          <div className={styles.sideCtaWidget}>
            <div className={styles.ctaMandalaBg} aria-hidden="true">
              <svg viewBox="0 0 200 200" fill="none" width="100%" height="100%">
                {[95, 75, 55, 35].map((r, i) => (
                  <circle key={i} cx="100" cy="100" r={r}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"
                    strokeDasharray={i % 2 === 0 ? "3 3" : "none"}
                  />
                ))}
                <text x="100" y="110" textAnchor="middle" fontSize="36"
                  fill="rgba(255,255,255,0.25)" fontFamily="serif">ॐ</text>
              </svg>
            </div>
            <div className={styles.ctaContent}>
              <h4 className={styles.ctaTitle}>Start Your Yoga Journey</h4>
              <p className={styles.ctaText}>
                Join AYM Yoga School's world-class teacher training programs
              </p>
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
              ].map(batch => (
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