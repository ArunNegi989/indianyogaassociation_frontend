"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/style/aym-yoga-blog/Blogpage.module.css";
import HowToReach from "@/components/home/Howtoreach";
import api from "@/lib/api";
import { resolveImage } from "@/lib/Imageutils";

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  image: string;
  tags?: string[];
}

interface BlogPageProps {
  blogs?: Blog[];
  recentPosts?: Blog[];
}

const BLOGS_PER_PAGE = 9;

/* ── Slugify — must match backend slugify() exactly ── */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalise(raw: any): Blog {
  return {
    id: raw._id ?? raw.id,
    slug: raw.slug ?? "",
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? "",
    date: raw.date
      ? new Date(raw.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "",
    author: raw.author || undefined,
    category: raw.category ?? "",
    image: resolveImage(raw.coverImage),
    tags: raw.tags ?? [],
  };
}

const MandalaDecor = () => (
  <svg
    className={styles.mandala}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="100"
      cy="100"
      r="95"
      stroke="#F15505"
      strokeWidth="0.6"
      strokeDasharray="4 3"
      opacity="0.35"
    />
    <circle
      cx="100"
      cy="100"
      r="78"
      stroke="#F15505"
      strokeWidth="0.4"
      opacity="0.25"
    />
    <circle
      cx="100"
      cy="100"
      r="60"
      stroke="#F15505"
      strokeWidth="0.6"
      strokeDasharray="2 4"
      opacity="0.3"
    />
    <circle
      cx="100"
      cy="100"
      r="42"
      stroke="#f15505"
      strokeWidth="0.5"
      opacity="0.35"
    />
    <circle
      cx="100"
      cy="100"
      r="24"
      stroke="#F15505"
      strokeWidth="0.8"
      opacity="0.4"
    />
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 100 + 24 * Math.cos(rad);
      const y1 = 100 + 24 * Math.sin(rad);
      const x2 = 100 + 78 * Math.cos(rad);
      const y2 = 100 + 78 * Math.sin(rad);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#F15505"
          strokeWidth="0.4"
          opacity="0.2"
        />
      );
    })}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const cx2 = 100 + 60 * Math.cos(rad);
      const cy2 = 100 + 60 * Math.sin(rad);
      return (
        <circle
          key={i}
          cx={cx2}
          cy={cy2}
          r="3.5"
          fill="#F15505"
          opacity="0.25"
        />
      );
    })}
    <text
      x="100"
      y="107"
      textAnchor="middle"
      fontSize="18"
      fill="#F15505"
      opacity="0.5"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

export default function BlogPage({
  blogs: propBlogs,
  recentPosts,
}: BlogPageProps) {
  const [blogList, setBlogList] = useState<Blog[]>(propBlogs ?? []);
  const [isLoading, setIsLoading] = useState(
    !propBlogs || propBlogs.length === 0,
  );
  const [page, setPage] = useState(1);

  /* ── Fetch published blogs from API if none passed via props ── */
  useEffect(() => {
    if (propBlogs && propBlogs.length > 0) return;

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/blogs/get-all");
        const published: Blog[] = (res.data.data ?? [])
          .filter((b: any) => b.status === "Published")
          .map(normalise);
        setBlogList(published);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totalPages = Math.ceil(blogList.length / BLOGS_PER_PAGE);
  const visibleBlogs = blogList.slice(0, page * BLOGS_PER_PAGE);
  const hasMore = page < totalPages;
  const latestPosts = recentPosts ?? blogList.slice(0, 8);

  /* ── Skeleton grid while loading ── */
  if (isLoading) {
    return (
      <div className={styles.pageRoot}>
        <div className={styles.pageHeader}>
          <MandalaDecor />
          <div className={styles.headerInner}>
            <p className={styles.headerSuper}>AYM Yoga School</p>
            <h1 className={styles.headerTitle}>Yoga Blog & Insights</h1>
            <div className={styles.omDivider}>
              <span className={styles.divLine} />
              <span className={styles.omSym}>ॐ</span>
              <span className={styles.divLine} />
            </div>
            <p className={styles.headerSub}>
              Ancient wisdom • Modern practice • Timeless transformation
            </p>
          </div>
          <MandalaDecor />
        </div>
        <div className={styles.layout}>
          <main className={styles.main}>
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={styles.card}
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className={styles.cardImgWrap}
                    style={{ background: "rgba(224,123,0,0.08)" }}
                  />
                  <div className={styles.cardBody}>
                    <div
                      style={{
                        height: 10,
                        width: "40%",
                        background: "rgba(160,120,64,0.15)",
                        borderRadius: 4,
                        marginBottom: 10,
                      }}
                    />
                    <div
                      style={{
                        height: 16,
                        width: "90%",
                        background: "rgba(160,120,64,0.15)",
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    />
                    <div
                      style={{
                        height: 10,
                        width: "60%",
                        background: "rgba(160,120,64,0.10)",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <MandalaDecor />
        <div className={styles.headerInner}>
          <p className={styles.headerSuper}>AYM Yoga School</p>
          <h1 className={styles.headerTitle}>Yoga Blog & Insights</h1>
          <div className={styles.omDivider}>
            <span className={styles.divLine} />
            <span className={styles.omSym}>ॐ</span>
            <span className={styles.divLine} />
          </div>
          <p className={styles.headerSub}>
            Ancient wisdom • Modern practice • Timeless transformation
          </p>
        </div>
        <MandalaDecor />
      </div>

      <div className={styles.layout}>
        {/* ── Main Blog Grid ── */}
        <main className={styles.main}>
          {blogList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "#a07840",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              <p style={{ fontSize: "2rem" }}>ॐ</p>
              <p>No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {visibleBlogs.map((blog, idx) => (
                  <Link
                    href={`/blog/aym-yoga-blog/${blog.slug}`}
                    key={blog.id}
                    className={styles.card}
                    style={{
                      animationDelay: `${(idx % BLOGS_PER_PAGE) * 0.07}s`,
                    }}
                  >
                    <span className={`${styles.corner} ${styles.cornerTL}`} />
                    <span className={`${styles.corner} ${styles.cornerTR}`} />
                    <span className={`${styles.corner} ${styles.cornerBL}`} />
                    <span className={`${styles.corner} ${styles.cornerBR}`} />

                    <div className={styles.cardImgWrap}>
                      <div className={styles.cardImgOverlay} />
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={styles.cardImg}
                        unoptimized={blog.image.includes("localhost")}
                      />
                      <span className={styles.cardCategory}>
                        {blog.category}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {blog.date}
                        </span>
                        {blog.author && (
                          <span className={styles.cardAuthor}>
                            · {blog.author}
                          </span>
                        )}
                      </div>
                      <h3 className={styles.cardTitle}>{blog.title}</h3>
                      <p className={styles.cardExcerpt}>{blog.excerpt}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.readMore}>
                          Read Article
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className={styles.loadMoreWrap}>
                  <div className={styles.loadMoreDivider}>
                    <span className={styles.divLineGold} />
                    <span className={styles.loadMoreOm}>ॐ</span>
                    <span className={styles.divLineGold} />
                  </div>
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <span className={styles.loadMoreText}>View More Blogs</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </button>
                  <p className={styles.loadMoreCount}>
                    Showing {Math.min(page * BLOGS_PER_PAGE, blogList.length)}{" "}
                    of {blogList.length} articles
                  </p>
                </div>
              )}

              {!hasMore && (
                <div className={styles.endMessage}>
                  <span className={styles.divLineGold} />
                  <span className={styles.endOm}>ॐ</span>
                  <span className={styles.divLineGold} />
                </div>
              )}
            </>
          )}
        </main>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetHeader}>
              <span className={styles.sideWidgetOm}>ॐ</span>
              <h3 className={styles.sideWidgetTitle}>Latest Articles</h3>
            </div>
            <ul className={styles.sidePostList}>
              {latestPosts.map((post) => (
                <li key={post.id} className={styles.sidePostItem}>
                  <Link
                    href={`/blog/aym-yoga-blog/${post.slug}`}
                    className={styles.sidePostLink}
                  >
                    <span className={styles.sidePostDot}>›</span>
                    <span className={styles.sidePostTitle}>{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sideCtaWidget}>
            <div className={styles.sideCtaMandala}>
              <svg
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="80"
                height="80"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.6"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="22"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="0.8"
                />
                <text
                  x="60"
                  y="67"
                  textAnchor="middle"
                  fontSize="22"
                  fill="rgba(255,255,255,0.6)"
                  fontFamily="serif"
                >
                  ॐ
                </text>
              </svg>
            </div>
            <h4 className={styles.sideCtaTitle}>Begin Your Yoga Journey</h4>
            <p className={styles.sideCtaText}>
              Join our certified Yoga Teacher Training programs in Rishikesh
            </p>
            <div className={styles.sideCtaBtns}>
              <Link href="/200-hour-ytt" className={styles.sideCtaBtn}>
                200 Hour YTT
              </Link>
              <Link href="/300-hour-ytt" className={styles.sideCtaBtn}>
                300 Hour YTT
              </Link>
              <Link href="/500-hour-ytt" className={styles.sideCtaBtn}>
                500 Hour YTT
              </Link>
            </div>
            <Link href="/register" className={styles.sideCtaRegister}>
              Register Now →
            </Link>
          </div>

          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetHeader}>
              <span className={styles.sideWidgetOm}>ॐ</span>
              <h3 className={styles.sideWidgetTitle}>Explore Topics</h3>
            </div>
            <div className={styles.tagCloud}>
              {[
                "Yoga",
                "Ayurveda",
                "Rishikesh",
                "Meditation",
                "Pranayama",
                "Health",
                "Lifestyle",
                "Fitness",
                "Yoga Teacher Training",
                "Retreat",
                "International",
                "National",
              ].map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <HowToReach />
    </div>
  );
}
