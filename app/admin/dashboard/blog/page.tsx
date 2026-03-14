"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/blog/Blog.module.css";
// import api from "@/lib/api";

/* ── Types ── */
type BlogStatus = "Published" | "Draft";

interface BlogRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  category: string;
  image: string;
  tags?: string[];
  sectionCount: number;
  status: BlogStatus;
}

function useBreakpoint() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

/* ── Mock data ── */
const MOCK_BLOGS: BlogRecord[] = [
  { id: "1", slug: "top-5-advantages-yoga-teacher-training-course", title: "Top 5 Advantages of Yoga Teacher Training Course", excerpt: "Yoga studios are booming now in every nook and corner of the world. But how do we know if the trainers there are qualified enough?", date: "04 July 2022", author: "Swami Arvind", category: "Yoga Teacher Training", image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=60", tags: ["Yoga Teacher Training", "Rishikesh", "Yoga"], sectionCount: 11, status: "Published" },
  { id: "2", slug: "30-minute-yoga-sequence-to-refresh-rejuvenate", title: "30-Minute Yoga Sequence to Refresh & Rejuvenate", excerpt: "Any practice becomes perfect once there is a routine set for the same, to perform it every day.", date: "28 June 2022", author: "Priya Sharma", category: "Yoga", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=60", tags: ["Yoga", "Health", "Fitness"], sectionCount: 9, status: "Published" },
  { id: "3", slug: "the-connection-between-yoga-and-ayurveda", title: "The Connection Between Yoga and Ayurveda", excerpt: "Many of us have this doubt, whether Ayurveda and Yoga are connected, and if so, how?", date: "11 June 2022", author: "Dr. Meera Joshi", category: "Ayurveda", image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=60", tags: ["Ayurveda", "Yoga", "Health"], sectionCount: 10, status: "Published" },
  { id: "4", slug: "10-signs-you-need-a-yoga-retreat", title: "10 Signs You Need a Yoga Retreat", excerpt: "Are you wondering what a yoga retreat is? A yoga retreat is a chance to step away from day-to-day life.", date: "06 June 2022", author: "Yogi Mahesh Chetan", category: "Yoga Retreats", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60", tags: ["Yoga", "Retreat", "Lifestyle"], sectionCount: 8, status: "Draft" },
  { id: "5", slug: "importance-of-yoga-in-daily-life", title: "Importance of Yoga in Daily Life", excerpt: "Yoga is more than just physical exercise. It is a complete science of life.", date: "20 May 2022", category: "Yoga", image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&q=60", tags: ["Yoga", "Health", "Lifestyle"], sectionCount: 12, status: "Published" },
];

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const { isMobile, isTablet, width } = useBreakpoint();

  useEffect(() => {
    // const res = await api.get("/blogs");
    // setBlogs(res.data.data);
    setBlogs(MOCK_BLOGS);
  }, []);

  const toggleStatus = (id: string) =>
    setBlogs(blogs.map((b) => b.id === id ? { ...b, status: b.status === "Published" ? "Draft" : "Published" } : b));

  const handleDelete = () => {
    setBlogs(blogs.filter((b) => b.id !== deleteModal));
    setDeleteModal(null);
  };

  /* ── Sub-components ── */
  const Status = ({ b }: { b: BlogRecord }) => (
    <button
      className={`${styles.statusBadge} ${b.status === "Published" ? styles.statusPublished : styles.statusDraft}`}
      onClick={() => toggleStatus(b.id)}
    >
      <span className={styles.statusDot} />{b.status}
    </button>
  );

  const Actions = ({ b }: { b: BlogRecord }) => (
    <div className={styles.actionBtns}>
      <Link href={`blogs/edit/${b.id}`} className={styles.editBtn}>
        <span>✎</span><span className={styles.btnLabel}> Edit</span>
      </Link>
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(b.id)}>
        <span>✕</span><span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Mobile Cards ── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {blogs.map((b) => (
        <div key={b.id} className={styles.card}>
          {b.image
            ? <img src={b.image} alt={b.title} className={styles.cardImg} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            : <div className={styles.cardImgEmpty}>🖼</div>
          }
          <div className={styles.cardBody}>
            <p className={styles.blogTitle}>{b.title}</p>
            <p className={styles.blogExcerpt}>{b.excerpt}</p>
            <div className={styles.cardMeta}>
              <span className={styles.categoryChip}>{b.category}</span>
              <span className={styles.sectionCountBadge}>📄 {b.sectionCount} blocks</span>
              <Status b={b} />
            </div>
            <p className={styles.blogMeta}>{b.date}{b.author ? ` · ${b.author}` : ""}</p>
          </div>
          <div className={styles.cardFooter}><Actions b={b} /></div>
        </div>
      ))}
    </div>
  );

  /* ── Tablet Table ── */
  const TabletTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Cover</th>
            <th>Title</th>
            <th style={{ width: 110 }}>Category</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: 130 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id} className={styles.row}>
              <td className={styles.tdCenter}>
                {b.image
                  ? <img src={b.image} alt={b.title} className={styles.blogThumb} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className={styles.blogThumbEmpty}>🖼</div>
                }
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td><span className={styles.categoryChip}>{b.category}</span></td>
              <td className={styles.tdCenter}><Status b={b} /></td>
              <td className={styles.tdCenter}><Actions b={b} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Desktop Table ── */
  const DesktopTable = () => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: 80 }}>Cover</th>
            <th>Title / Excerpt</th>
            <th style={{ width: 150 }}>Category</th>
            {width >= 1024 && <th style={{ width: 120 }}>Author</th>}
            {width >= 1024 && <th style={{ width: 100 }}>Date</th>}
            {width >= 1024 && <th style={{ width: 90 }}>Blocks</th>}
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 160 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id} className={styles.row}>
              <td className={styles.tdCenter}>
                {b.image
                  ? <img src={b.image} alt={b.title} className={styles.blogThumb} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  : <div className={styles.blogThumbEmpty}>🖼</div>
                }
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td><span className={styles.categoryChip}>{b.category}</span></td>
              {width >= 1024 && <td><p className={styles.blogMeta}>{b.author || "—"}</p></td>}
              {width >= 1024 && <td><p className={styles.blogMeta}>{b.date}</p></td>}
              {width >= 1024 && <td className={styles.tdCenter}><span className={styles.sectionCountBadge}>📄 {b.sectionCount}</span></td>}
              <td className={styles.tdCenter}><Status b={b} /></td>
              <td className={styles.tdCenter}><Actions b={b} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSubtitle}>Manage all blog articles — click status to toggle Published / Draft</p>
        </div>
        <Link href="/admin/dashboard/blog/add-new" className={styles.addBtn}>
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>New Blog Post</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {blogs.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No blog posts found. Write your first post.</p>
        </div>
      )}

      {deleteModal && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Delete Blog Post?</h3>
            <p className={styles.modalText}>This will permanently remove the post and all its content. This cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className={styles.modalConfirm} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}