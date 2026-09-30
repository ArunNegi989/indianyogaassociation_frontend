"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/blog/Blog.module.css";
import api from "@/lib/api";

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
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ??
  "http://localhost:5000";

function resolveImage(src?: string): string {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("blob:")) return src;
  return `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

function normalise(raw: any): BlogRecord {
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
    author: raw.author ?? "",
    category: raw.category ?? "",
    image: resolveImage(raw.coverImage),
    tags: raw.tags ?? [],
    sectionCount: Array.isArray(raw.content) ? raw.content.length : 0,
    status: raw.status === "Published" ? "Published" : "Draft",
  };
}

/* ════════════════════════════════════════
   COMPONENT
════════════════════════════════════════ */
export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { isMobile, isTablet, width } = useBreakpoint();

  /* ── Fetch all blogs ── */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/blogs/get-all");
        setBlogs((res.data.data ?? []).map(normalise));
      } catch (err) {
        console.error("Fetch blogs error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const toggleStatus = async (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog || togglingId) return;

    const newStatus: BlogStatus =
      blog.status === "Published" ? "Draft" : "Published";

    /* Optimistic update */
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setTogglingId(id);

    try {
      await api.put(`/blogs/update/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Toggle status error:", err);

      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: blog.status } : b))
      );
    } finally {
      setTogglingId(null);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      setIsDeleting(true);
      await api.delete(`/blogs/delete/${deleteModal}`);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteModal));
      setDeleteModal(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ── Sub-components ── */
  const Status = ({ b }: { b: BlogRecord }) => (
    <button
      className={`${styles.statusBadge} ${b.status === "Published" ? styles.statusPublished : styles.statusDraft
        }`}
      onClick={() => toggleStatus(b.id)}
      disabled={togglingId === b.id}
      title="Click to toggle status"
    >
      <span className={styles.statusDot} />
      {togglingId === b.id ? "…" : b.status}
    </button>
  );

  const Actions = ({ b }: { b: BlogRecord }) => (
    <div className={styles.actionBtns}>
      <Link href={`blog/${b.id}`} className={styles.editBtn}>
        <span>✎</span>
        <span className={styles.btnLabel}> Edit</span>
      </Link>
      <button
        className={styles.deleteBtn}
        onClick={() => setDeleteModal(b.id)}
      >
        <span>✕</span>
        <span className={styles.btnLabel}> Delete</span>
      </button>
    </div>
  );

  /* ── Loading screen ── */
  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading blog posts…</p>
        </div>
      </div>
    );
  }

  /* ── Mobile Cards ── */
  const MobileCards = () => (
    <div className={styles.cardList}>
      {blogs.map((b) => (
        <div key={b.id} className={styles.card}>
          {b.image ? (
            <img
              src={b.image}
              alt={b.title}
              className={styles.cardImg}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className={styles.cardImgEmpty}>🖼</div>
          )}
          <div className={styles.cardBody}>
            <p className={styles.blogTitle}>{b.title}</p>
            <p className={styles.blogExcerpt}>{b.excerpt}</p>
            <div className={styles.cardMeta}>
              <span className={styles.categoryChip}>{b.category}</span>
              <span className={styles.sectionCountBadge}>
                📄 {b.sectionCount} blocks
              </span>
              <Status b={b} />
            </div>
            <p className={styles.blogMeta}>
              {b.date}
              {b.author ? ` · ${b.author}` : ""}
            </p>
          </div>
          <div className={styles.cardFooter}>
            <Actions b={b} />
          </div>
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
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.title}
                    className={styles.blogThumb}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.blogThumbEmpty}>🖼</div>
                )}
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td>
                <span className={styles.categoryChip}>{b.category}</span>
              </td>
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
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
                {b.image ? (
                  <img
                    src={b.image}
                    alt={b.title}
                    className={styles.blogThumb}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.blogThumbEmpty}>🖼</div>
                )}
              </td>
              <td>
                <p className={styles.blogTitle}>{b.title}</p>
                <p className={styles.blogExcerpt}>{b.excerpt}</p>
              </td>
              <td>
                <span className={styles.categoryChip}>{b.category}</span>
              </td>
              {width >= 1024 && (
                <td>
                  <p className={styles.blogMeta}>{b.author || "—"}</p>
                </td>
              )}
              {width >= 1024 && (
                <td>
                  <p className={styles.blogMeta}>{b.date}</p>
                </td>
              )}
              {width >= 1024 && (
                <td className={styles.tdCenter}>
                  <span className={styles.sectionCountBadge}>
                    📄 {b.sectionCount}
                  </span>
                </td>
              )}
              <td className={styles.tdCenter}>
                <Status b={b} />
              </td>
              <td className={styles.tdCenter}>
                <Actions b={b} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ── Render ── */
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Blog Posts</h1>
          <p className={styles.pageSubtitle}>
            Manage all blog articles — click status to toggle Published / Draft
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/add-new"
          className={styles.addBtn}
        >
          <span className={styles.addPlus}>+</span>
          <span className={styles.addLabel}>New Blog Post</span>
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {isMobile && <MobileCards />}
      {isTablet && <TabletTable />}
      {!isMobile && !isTablet && <DesktopTable />}

      {!isLoading && blogs.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No blog posts found. Write your first post.</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDeleting && setDeleteModal(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalOm}>ॐ</div>
            <h3 className={styles.modalTitle}>Delete Blog Post?</h3>
            <p className={styles.modalText}>
              This will permanently remove the post and all its content. This
              cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}