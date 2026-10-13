"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/blog/Blog.module.css";
import api from "@/lib/api";

type BlogStatus = "Published" | "Draft";
type StatusFilter = "All" | BlogStatus;
type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

interface BlogRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  timestamp: number;
  author?: string;
  category: string;
  image: string;
  tags?: string[];
  sectionCount: number;
  status: BlogStatus;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

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

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
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
    timestamp: raw.date ? new Date(raw.date).getTime() : 0,
    author: raw.author ?? "",
    category: raw.category ?? "",
    image: resolveImage(raw.coverImage),
    tags: raw.tags ?? [],
    sectionCount: Array.isArray(raw.content) ? raw.content.length : 0,
    status: raw.status === "Published" ? "Published" : "Draft",
  };
}

/* Page numbers with ellipsis: 1 … 4 5 6 … 20 */
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
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

  /* ── Search / filter / sort / pagination state ── */
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  /* Reset to page 1 whenever filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter, sortBy, pageSize]);

  /* ── Derived data ── */
  const categories = useMemo(
    () =>
      Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))).sort(),
    [blogs]
  );

  const statusCounts = useMemo(
    () => ({
      All: blogs.length,
      Published: blogs.filter((b) => b.status === "Published").length,
      Draft: blogs.filter((b) => b.status === "Draft").length,
    }),
    [blogs]
  );

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    const list = blogs.filter((b) => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (categoryFilter !== "All" && b.category !== categoryFilter)
        return false;
      if (!q) return true;
      const haystack = [
        b.title,
        b.excerpt,
        b.author ?? "",
        b.category,
        ...(b.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.timestamp - b.timestamp;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "newest":
        default:
          return b.timestamp - a.timestamp;
      }
    });

    return list;
  }, [blogs, debouncedSearch, statusFilter, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    sortBy !== "newest";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setSortBy("newest");
  };

  /* ── Toggle status ── */
  const toggleStatus = async (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog || togglingId) return;

    const newStatus: BlogStatus =
      blog.status === "Published" ? "Draft" : "Published";

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
      className={`${styles.statusBadge} ${
        b.status === "Published" ? styles.statusPublished : styles.statusDraft
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
      <button className={styles.deleteBtn} onClick={() => setDeleteModal(b.id)}>
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
      {paginated.map((b) => (
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
          {paginated.map((b) => (
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
          {paginated.map((b) => (
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
        <Link href="/admin/dashboard/blog/add-new" className={styles.addBtn}>
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

      {/* ── Toolbar: search + filters ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title, excerpt, author, category or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterRow}>
          <div className={styles.statusTabs}>
            {(["All", "Published", "Draft"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                className={`${styles.statusTab} ${
                  statusFilter === s ? styles.statusTabActive : ""
                }`}
                onClick={() => setStatusFilter(s)}
              >
                {s} <span className={styles.tabCount}>{statusCounts[s]}</span>
              </button>
            ))}
          </div>

          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-asc">Title A → Z</option>
            <option value="title-desc">Title Z → A</option>
          </select>

          {hasActiveFilters && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Results info */}
      {blogs.length > 0 && (
        <p className={styles.resultsInfo}>
          {filtered.length === 0
            ? "No results"
            : `Showing ${startIdx + 1}–${Math.min(
                startIdx + pageSize,
                filtered.length
              )} of ${filtered.length} post${filtered.length > 1 ? "s" : ""}`}
        </p>
      )}

      {filtered.length > 0 && (
        <>
          {isMobile && <MobileCards />}
          {isTablet && <TabletTable />}
          {!isMobile && !isTablet && <DesktopTable />}
        </>
      )}

      {/* Empty states */}
      {blogs.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No blog posts found. Write your first post.</p>
        </div>
      )}

      {blogs.length > 0 && filtered.length === 0 && (
        <div className={styles.empty}>
          <span className={styles.emptyOm}>ॐ</span>
          <p>No posts match your search or filters.</p>
          <button className={styles.clearFiltersBtn} onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.pageSizeWrap}>
            <span>Rows per page</span>
            <select
              className={styles.filterSelect}
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pageControls}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              «
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>

            {getPageNumbers(currentPage, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`e-${i}`} className={styles.pageEllipsis}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${
                    p === currentPage ? styles.pageBtnActive : ""
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )}

            <button
              className={styles.pageBtn}
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
            <button
              className={styles.pageBtn}
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDeleting && setDeleteModal(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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