"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface BaliPageData {
  _id: string;
  pageTitleH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  introTitle?: string;
  uniquePoints?: Array<{
    icon: string;
    title: string;
    body: string;
  }>;
  courses?: Array<{
    hrs: string;
    tag: string;
    desc: string;
  }>;
  highlights?: string[];
  aymSpecial?: Array<{
    num: string;
    title: string;
    body: string;
  }>;
  chakras?: Array<{
    name: string;
    color: string;
    symbol: string;
    meaning: string;
    mantra: string;
  }>;
}

export default function BaliPageListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<BaliPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/bali-page");
     setRows(res.data?.data ? [res.data.data] : []);
    } catch {
      setError("Failed to load Bali pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/bali-page`);
      setRows(prev => prev.filter(r => r._id !== id));
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
      await api.put(`/bali-page`, { status: next });
      setRows(prev => prev.map(r => r._id === id ? { ...r, status: next } : r));
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Status update failed.");
    }
  };

  const hasAnyRecords = rows.length > 0;

  return (
    <div className={styles.listPage}>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>Bali Yoga Teacher Training Pages</h1>
          <p className={styles.listSubtitle}>
            Bali · Ubud · 200/300/500 Hour TTC · Chakras · AYM Special
          </p>
        </div>
        <Link
          href="/admin/yogacourse/yoga-course-bali/add-new"
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
        <span>🌴</span>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span>Loading Bali pages…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🏝️</div>
          <h3 className={styles.emptyTitle}>No Bali pages yet</h3>
          <p className={styles.emptyText}>
            Create your first Bali Yoga Teacher Training page to showcase courses, chakras, and what makes Bali unique for yoga.
          </p>
          <Link
            href="/admin/yogacourse/yoga-course-bali/add-new"
            className={styles.addNewBtn}
          >
            ＋ Create First Page
          </Link>
        </div>
      ) : (
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
                      <strong>{row.pageTitleH1 || row.introTitle || "—"}</strong>
                      <div className={styles.cellSub}>
                        🧘 {row.courses?.length || 0} Courses (200/300/500 Hr)
                      </div>
                      <div className={styles.cellSub}>
                        ✨ {row.aymSpecial?.length || 0} AYM Special Points
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <code className={styles.slugBadge}>
                      {row.slug || "—"}
                    </code>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      🏝️ {row.uniquePoints?.length || 0} Unique Points
                    </div>
                    <div className={styles.metaChip}>
                      📋 {row.highlights?.length || 0} Highlights
                    </div>
                    <div className={styles.metaChip}>
                      🔮 {row.chakras?.length || 0} Chakras
                    </div>
                  </td>
                  <td className={styles.td}>
                    <button
                      className={`${styles.statusBadge} ${
                        row.status === "Active" ? styles.statusActive : styles.statusInactive
                      }`}
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
                        href={`/admin/yogacourse/yoga-course-bali/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageTitleH1 || row.introTitle || "Bali Page")}
                        disabled={deleting === row._id}
                      >
                        {deleting === row._id ? (
                          <span className={styles.spinner} />
                        ) : (
                          "🗑 Delete"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.tableCount}>
            {rows.length} Bali page{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}