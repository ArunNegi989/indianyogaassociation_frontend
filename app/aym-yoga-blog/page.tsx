"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/assets/style/aym-yoga-blog/Blogpage.module.css";

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

// ── All blog data hardcoded ──
export const allBlogs: Blog[] = [
  {
    id: "1",
    slug: "top-5-advantages-yoga-teacher-training-course",
    title: "Top 5 advantages of Yoga Teacher Training Course",
    excerpt:
      "Yoga studios are booming now in every nook and corner of the world. But how do we know if the trainers there are qualified enough to guide others on yoga? These days, thousands of yoga practitioners worldwide are taking their practice to the next level.",
    date: "04 July 2022",
    category: "Yoga Teacher Training",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80",
    tags: ["Yoga Teacher Training", "Rishikesh", "Yoga"],
  },
  {
    id: "2",
    slug: "30-minute-yoga-sequence-to-refresh-rejuvenate",
    title: "30-Minute Yoga Sequence to Refresh & Rejuvenate",
    excerpt:
      "Any practice becomes perfect once there is a routine set for the same, to perform it every day for a given period of time. And the same applies to yoga as well. Are you wondering how to create a simple yoga sequence that you could follow every day?",
    date: "28 June 2022",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
    tags: ["Yoga", "Health", "Fitness"],
  },
  {
    id: "3",
    slug: "the-connection-between-yoga-and-ayurveda",
    title: "The Connection Between Yoga and Ayurveda",
    excerpt:
      "Many of us have this doubt, whether Ayurveda and Yoga are connected, and if so, how? If you are one of them, then this blog is for you!",
    date: "11 June 2022",
    category: "Ayurveda",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
    tags: ["Ayurveda", "Yoga", "Health"],
  },
  {
    id: "4",
    slug: "10-signs-you-need-a-yoga-retreat",
    title: "10 Signs You Need a Yoga Retreat",
    excerpt:
      "Are you wondering what a yoga retreat is? A yoga retreat is a chance to step away from day-to-day life and focus on your practice and inner peace.",
    date: "06 June 2022",
    author: "Yogi Mahesh Chetan",
    category: "Yoga Retreats",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tags: ["Yoga", "Retreat", "Lifestyle"],
  },
  {
    id: "5",
    slug: "how-yoga-can-improve-your-corporate-culture",
    title: "How Yoga Can Improve Your Corporate Culture",
    excerpt:
      "A study conducted by the American Institute of Stress quotes: Almost 75 percent to 90 percent of medical visits in the US are in one way or the other correlated to stress.",
    date: "01 June 2022",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80",
    tags: ["Yoga", "Lifestyle", "Health"],
  },
  {
    id: "6",
    slug: "importance-of-yoga-in-daily-life",
    title: "Importance of Yoga in Daily Life",
    excerpt:
      "Yoga is more than just physical exercise. It is a complete science of life that originated in India many thousands of years ago and continues to benefit millions worldwide.",
    date: "20 May 2022",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80",
    tags: ["Yoga", "Health", "Lifestyle"],
  },
  {
    id: "7",
    slug: "heres-how-digestion-works-and-how-to-improve-yours",
    title: "Here's How Digestion Works & How to Improve Yours",
    excerpt:
      "Food has been a priority since Vedic times. The Upanishads claim that food represents Brahma. The Upanishads regarded food as Brahma, the creator. Living things require food for survival.",
    date: "26 July 2021",
    category: "Health",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    tags: ["Health", "Ayurveda", "Lifestyle"],
  },
  {
    id: "8",
    slug: "celebrate-holi-the-festival-of-colours-in-your-yoga-class",
    title: "Celebrate Holi the festival of colours in your yoga class",
    excerpt:
      "Holi a festival of colors and joy. A celebration that reminds us of the victory of good over evil. The festival of Holi marks the arrival of the spring season.",
    date: "18 March 2021",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1564769610726-59cead6a6f8f?w=800&q=80",
    tags: ["Yoga", "Lifestyle", "International"],
  },
  {
    id: "9",
    slug: "always-stay-positive-with-yoga-2021",
    title: "Always Stay Positive with Yoga - 2021",
    excerpt:
      "2020 was hard on everyone and it has been anything that none of us has expected. It has taught us that life can be seriously unpredictable and sometimes overwhelming.",
    date: "05 March 2021",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
    tags: ["Yoga", "Lifestyle", "Health"],
  },
  {
    id: "10",
    slug: "always-stay-positive-with-yoga-2021",
    title: "Always Stay Positive with Yoga - 2021",
    excerpt:
      "2020 was hard on everyone and it has been anything that none of us has expected. It has taught us that life can be seriously unpredictable and sometimes overwhelming.",
    date: "05 March 2021",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
    tags: ["Yoga", "Lifestyle", "Health"],
  },
];

const MandalaDecor = () => (
  <svg className={styles.mandala} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="100" cy="100" r="95" stroke="#e07b00" strokeWidth="0.6" strokeDasharray="4 3" opacity="0.35" />
    <circle cx="100" cy="100" r="78" stroke="#e07b00" strokeWidth="0.4" opacity="0.25" />
    <circle cx="100" cy="100" r="60" stroke="#e07b00" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.3" />
    <circle cx="100" cy="100" r="42" stroke="#c46a00" strokeWidth="0.5" opacity="0.35" />
    <circle cx="100" cy="100" r="24" stroke="#e07b00" strokeWidth="0.8" opacity="0.4" />
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 100 + 24 * Math.cos(rad); const y1 = 100 + 24 * Math.sin(rad);
      const x2 = 100 + 78 * Math.cos(rad); const y2 = 100 + 78 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e07b00" strokeWidth="0.4" opacity="0.2" />;
    })}
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const cx = 100 + 60 * Math.cos(rad); const cy = 100 + 60 * Math.sin(rad);
      return <circle key={i} cx={cx} cy={cy} r="3.5" fill="#e07b00" opacity="0.25" />;
    })}
    <text x="100" y="107" textAnchor="middle" fontSize="18" fill="#e07b00" opacity="0.5" fontFamily="serif">ॐ</text>
  </svg>
);

// Props se blogs aaye to use karo, warna hardcoded allBlogs use karo
export default function BlogPage({ blogs, recentPosts }: BlogPageProps) {
  const blogList = (blogs && blogs.length > 0) ? blogs : allBlogs;

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(blogList.length / BLOGS_PER_PAGE);
  const visibleBlogs = blogList.slice(0, page * BLOGS_PER_PAGE);
  const hasMore = page < totalPages;
  const latestPosts = recentPosts || blogList.slice(0, 8);

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
          <p className={styles.headerSub}>Ancient wisdom • Modern practice • Timeless transformation</p>
        </div>
        <MandalaDecor />
      </div>

      <div className={styles.layout}>
        {/* ── Main Blog Grid ── */}
        <main className={styles.main}>
          <div className={styles.grid}>
            {visibleBlogs.map((blog, idx) => (
              <Link
                href={`/aym-yoga-blog/${blog.slug}`}
                key={blog.id}
                className={styles.card}
                style={{ animationDelay: `${(idx % BLOGS_PER_PAGE) * 0.07}s` }}
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
                  />
                  <span className={styles.cardCategory}>{blog.category}</span>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {blog.date}
                    </span>
                    {blog.author && <span className={styles.cardAuthor}>· {blog.author}</span>}
                  </div>

                  <h3 className={styles.cardTitle}>{blog.title}</h3>
                  <p className={styles.cardExcerpt}>{blog.excerpt}</p>

                  <div className={styles.cardFooter}>
                    <span className={styles.readMore}>
                      Read Article
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
              <button className={styles.loadMoreBtn} onClick={() => setPage(p => p + 1)}>
                <span className={styles.loadMoreText}>View More Blogs</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </button>
              <p className={styles.loadMoreCount}>
                Showing {Math.min(page * BLOGS_PER_PAGE, blogList.length)} of {blogList.length} articles
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
                  <Link href={`/aym-yoga-blog/${post.slug}`} className={styles.sidePostLink}>
                    <span className={styles.sidePostDot}>›</span>
                    <span className={styles.sidePostTitle}>{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.sideCtaWidget}>
            <div className={styles.sideCtaMandala}>
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
                <circle cx="60" cy="60" r="55" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="60" cy="60" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
                <circle cx="60" cy="60" r="22" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                <text x="60" y="67" textAnchor="middle" fontSize="22" fill="rgba(255,255,255,0.6)" fontFamily="serif">ॐ</text>
              </svg>
            </div>
            <h4 className={styles.sideCtaTitle}>Begin Your Yoga Journey</h4>
            <p className={styles.sideCtaText}>Join our certified Yoga Teacher Training programs in Rishikesh</p>
            <div className={styles.sideCtaBtns}>
              <Link href="/200-hour-ytt" className={styles.sideCtaBtn}>200 Hour YTT</Link>
              <Link href="/300-hour-ytt" className={styles.sideCtaBtn}>300 Hour YTT</Link>
              <Link href="/500-hour-ytt" className={styles.sideCtaBtn}>500 Hour YTT</Link>
            </div>
            <Link href="/register" className={styles.sideCtaRegister}>Register Now →</Link>
          </div>

          <div className={styles.sideWidget}>
            <div className={styles.sideWidgetHeader}>
              <span className={styles.sideWidgetOm}>ॐ</span>
              <h3 className={styles.sideWidgetTitle}>Explore Topics</h3>
            </div>
            <div className={styles.tagCloud}>
              {["Yoga", "Ayurveda", "Rishikesh", "Meditation", "Pranayama", "Health", "Lifestyle", "Fitness", "Yoga Teacher Training", "Retreat", "International", "National"].map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}