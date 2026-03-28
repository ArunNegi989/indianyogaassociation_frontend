"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface PrenatalPageData {
  _id: string;
  pageTitleH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  introSectionTitle?: string;
  featuresSectionTitle?: string;
  schedule?: Array<{ time: string; activity: string }>;
  batches?: Array<{
    startDate: string;
    endDate: string;
    usdFee: string;
    totalSeats: string;
  }>;
  curriculum?: Array<{ title: string; hours: string }>;
  hoursSummary?: Array<{ label: string; value: string }>;
}

export default function PrenatalYogaTTCListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<PrenatalPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/prenatal-page");
      setRows(res.data?.data ? [res.data.data] : []);
    } catch {
      setError("Failed to load Prenatal Yoga pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/prenatal-page`);
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Page deleted successfully");
    } catch {
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/prenatal-page`, { status: next });
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: next } : r)));
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Status update failed.");
    }
  };

  return (
    <div className={styles.listPage}>
      {/* ── Header ── */}
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>Prenatal Yoga Teacher Training Pages</h1>
          <p className={styles.listSubtitle}>
            Rishikesh · Pregnancy Yoga · 85-Hour TTC · Schedule · Batches · Online Course
          </p>
        </div>
        <Link
          href="/admin/yogacourse/prenatal-yoga-course/prenatal-content/add-new"
          className={styles.addNewBtn}
        >
          ＋ Add New
        </Link>
      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1.5rem" }}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>🤰</span>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span>Loading Prenatal Yoga pages…</span>
        </div>
      ) : rows.length === 0 ? (

        /* ── Empty State ── */
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🤰</div>
          <h3 className={styles.emptyTitle}>No Prenatal Yoga pages yet</h3>
          <p className={styles.emptyText}>
            Create your first Prenatal Yoga TTC page to showcase the course details, schedule, upcoming batches, and curriculum.
          </p>
          <Link href="/admin/yogacourse/prenatal-yoga-course/prenatal-content/add-new" className={styles.addNewBtn}>
            ＋ Create First Page
          </Link>
        </div>
      ) : (

        /* ── Table ── */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Page Details</th>
                <th className={styles.th}>URL Slug</th>
                <th className={styles.th}>Content Stats</th>
                <th className={styles.th}>Visibility</th>
                <th className={styles.th}>Created Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row._id} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.rowNum}>{idx + 1}</span>
                  </td>

                  <td className={styles.td}>
                    <div>
                      <strong>{row.pageTitleH1 || row.introSectionTitle || "—"}</strong>
                      <div className={styles.cellSub}>
                        📅 {row.batches?.length || 0} Upcoming Batch{(row.batches?.length || 0) !== 1 ? "es" : ""}
                      </div>
                      <div className={styles.cellSub}>
                        📚 {row.curriculum?.length || 0} Curriculum Modules
                      </div>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <code className={styles.slugBadge}>{row.slug || "—"}</code>
                  </td>

                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      🕐 {row.schedule?.length || 0} Schedule Slots
                    </div>
                    <div className={styles.metaChip}>
                      📋 {row.hoursSummary?.length || 0} Hours Summary Rows
                    </div>
                    <div className={styles.metaChip}>
                      🏫 {row.featuresSectionTitle ? "Features ✓" : "Features —"}
                    </div>
                  </td>

                  <td className={styles.td}>
                    <button
                      className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                      onClick={() => toggleStatus(row._id, row.status)}
                    >
                      {row.status === "Active" ? "🟢 Live" : "🔴 Hidden"}
                    </button>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.dateText}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>

                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <Link
                        className={styles.editBtn}
                       href="/admin/yogacourse/prenatal-yoga-course/prenatal-content/add-new"
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageTitleH1 || row.introSectionTitle || "Prenatal Yoga Page")}
                        disabled={deleting === row._id}
                      >
                        {deleting === row._id ? <span className={styles.spinner} /> : "🗑 Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.tableCount}>
            {rows.length} Prenatal Yoga page{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}