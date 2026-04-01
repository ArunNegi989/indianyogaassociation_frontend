"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/homeCoursessection/Coursessection.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

/* ─────────────────────── Types ─────────────────────── */
interface CourseLink {
  label: string;
  href: string;
}

interface CourseRecord {
  _id: string;
  image: string;
  imageAlt: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  links: CourseLink[];
  enrollHref: string;
  exploreLabel: string;
  exploreHref: string;
  priceINR: string;
  priceUSD: string;
  totalSeats: number;
  seatsLeft: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

type SortField = "title" | "level" | "seatsLeft" | "updatedAt" | "order";
type SortDir = "asc" | "desc";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`; // slash hata do
};

/* ─────────────────────── Main ─────────────────────── */
export default function CoursesSectionListPage() {
  const router = useRouter();
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("order");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get("/courses-section");
        setRecords(res.data.data ?? []);
      } catch (err) {
        toast.error("Failed to fetch courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  /* sort toggle */
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  /* filtered + sorted */
  const filtered = records
    .filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.level.toLowerCase().includes(search.toLowerCase()) ||
      r.duration.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let av: string | number = a[sortField] as any;
      let bv: string | number = b[sortField] as any;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  /* delete */
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/courses-section/${deleteId}`);
      setRecords((p) => p.filter((r) => r._id !== deleteId));
      setDeleteId(null);
      toast.success("Course deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field
      ? <span className={styles.sortActive}>{sortDir === "asc" ? " ↑" : " ↓"}</span>
      : <span className={styles.sortInactive}> ⇅</span>;

  /* loading skeleton */
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.listPageHeader}>
          <div>
            <div className={styles.skeletonTitle} style={{ width: "300px", height: "36px", marginBottom: "8px" }} />
            <div className={styles.skeletonText} style={{ width: "400px", height: "20px" }} />
          </div>
        </div>
        <div className={styles.statsBar}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeletonStat} style={{ width: "150px", height: "44px" }} />
          ))}
        </div>
        <div className={styles.skeletonTable}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: "60px" }} />
          ))}
        </div>
      </div>
    );
  }

  const totalSeats = records.reduce((s, r) => s + (r.totalSeats || 0), 0);
  const totalSeatsLeft = records.reduce((s, r) => s + (r.seatsLeft || 0), 0);

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard")}>
          Dashboard
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Courses Section</span>
      </div>

      {/* Header */}
      <div className={styles.listPageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Courses & Retreats</h1>
          <p className={styles.pageSubtitle}>Manage all yoga teacher training courses and retreat listings</p>
        </div>
        <Link href="/admin/dashboard/homeCoursessection/add-new" className={styles.addNewBtn}>
          <span>✦</span> Add New Course
        </Link>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>📚</span>
          <span className={styles.statPillLabel}>Total Courses</span>
          <span className={styles.statPillVal}>{records.length}</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>🪑</span>
          <span className={styles.statPillLabel}>Total Seats</span>
          <span className={styles.statPillVal}>{totalSeats}</span>
        </div>
        <div className={styles.statPill}>
          <span className={styles.statPillIcon}>✅</span>
          <span className={styles.statPillLabel}>Seats Available</span>
          <span className={styles.statPillVal}>{totalSeatsLeft}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search by title, level, duration…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🧘</div>
          <h3 className={styles.emptyTitle}>{search ? "No results found" : "No courses yet"}</h3>
          <p className={styles.emptyText}>
            {search ? "Try a different search term" : "Click 'Add New Course' to create your first course listing"}
          </p>
          {!search && (
            <Link href="/admin/dashboard/homeCoursessection/add-new" className={styles.emptyAddBtn}>
              + Add First Course
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Image</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("title")}>
                  Title <SortIcon field="title" />
                </th>
                <th className={styles.th}>Duration</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("level")}>
                  Level <SortIcon field="level" />
                </th>
                <th className={styles.th}>Price</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("seatsLeft")}>
                  Seats <SortIcon field="seatsLeft" />
                </th>
                <th className={styles.th}>Links</th>
                <th className={`${styles.th} ${styles.thSortable}`} onClick={() => toggleSort("updatedAt")}>
                  Updated <SortIcon field="updatedAt" />
                </th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, i) => {
                const filled = rec.totalSeats - rec.seatsLeft;
                const pct = rec.totalSeats > 0 ? (filled / rec.totalSeats) * 100 : 0;
                return (
                  <tr key={rec._id} className={styles.tr}>
                    <td className={`${styles.td} ${styles.tdNum}`}>{i + 1}</td>
                    <td className={styles.td}>
                      {rec.image ? (
                        <img
                          src={getImageUrl(rec.image)}
                          alt={rec.imageAlt || rec.title}
                          className={styles.thumbImg}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : <span className={styles.naText}>—</span>}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.titleCell}>
                        <span className={styles.titleText} title={rec.title}>
                          {rec.title.length > 55 ? rec.title.slice(0, 55) + "…" : rec.title}
                        </span>
                        <span className={styles.subText}>{rec.exploreLabel}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.subText}>{rec.duration}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.levelBadge}>{rec.level}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.pricePill}>
                        <span className={styles.priceINR}>{rec.priceINR}</span>
                        <span className={styles.priceUSD}>{rec.priceUSD}</span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.seatsCell}>
                        <span className={`${styles.seatsText} ${rec.seatsLeft <= 5 ? styles.seatsUrgent : ""}`}>
                          {rec.seatsLeft} / {rec.totalSeats} left
                        </span>
                        <div className={styles.seatsBar}>
                          <div className={styles.seatsBarFill} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className={`${styles.td} ${styles.tdCenter}`}>
                      <span className={styles.countBadge}>{rec.links?.length || 0}</span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.subText}>{formatDate(rec.updatedAt)}</span>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionBtns}>
                        <Link
                          href={`/admin/dashboard/homeCoursessection/${rec._id}`}
                          className={styles.editBtn}
                        >
                          ✏️ Edit
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => setDeleteId(rec._id)}>
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <p className={styles.resultCount}>
          Showing {filtered.length} of {records.length} course{records.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className={styles.modalBackdrop} onClick={() => !deleting && setDeleteId(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3 className={styles.modalTitle}>Delete Course?</h3>
            <p className={styles.modalText}>
              This will permanently remove the course listing. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancelBtn}
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={styles.modalDeleteBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <><span className={styles.spinner} /> Deleting…</> : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}