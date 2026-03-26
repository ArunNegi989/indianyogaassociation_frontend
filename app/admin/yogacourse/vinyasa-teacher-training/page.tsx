"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface AshtangaVinyasaData {
  _id: string;
  pageH1Title: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  learnItems?: string[];
  whoItems?: string[];
  scheduleRows?: Array<{
    date: string;
    dorm: string;
    shared: string;
    priv: string;
    availability: string;
  }>;
  testimonials?: Array<{
    name: string;
    from: string;
  }>;
}

export default function AshtangaVinyasaTTCListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<AshtangaVinyasaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/ashtanga-vinyasa-ttc");
      const d = res.data?.data;

if (d) {
  setRows([d]); // 👈 wrap in array
} else {
  setRows([]);
}
    } catch {
      setError("Failed to load Ashtanga Vinyasa TTC pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/ashtanga-vinyasa-ttc`);
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
     await api.put(`/ashtanga-vinyasa-ttc/update`, { status: next });
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: next } : r)));
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Status update failed.");
    }
  };

  return (
    <div className={styles.listPage}>
      {/* Header */}
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>Ashtanga Vinyasa TTC Pages</h1>
          <p className={styles.listSubtitle}>
            Intro · Course Details · Who Can Apply · Promo · Teachers · Community · Accommodation · Certification · Schedule · Testimonial
          </p>
        </div>
        <Link href="/admin/yogacourse/vinyasa-teacher-training/add-new" className={styles.addNewBtn}>
          ＋ Add New
        </Link>
      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1.5rem" }}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span>Loading Ashtanga Vinyasa TTC pages…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🧘</div>
          <h3 className={styles.emptyTitle}>No Ashtanga Vinyasa TTC pages yet</h3>
          <p className={styles.emptyText}>
            Create your first Ashtanga Vinyasa TTC page to showcase the course, schedule, and testimonials.
          </p>
          <Link href="/admin/yogacourse/vinyasa-teacher-training/add-new" className={styles.addNewBtn}>
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
                      <strong>{row.pageH1Title || "—"}</strong>
                      
                      <div className={styles.cellSub}>
                        💬 {row.testimonials?.length || 0} Testimonials
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <code className={styles.slugBadge}>{row.slug || "—"}</code>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      📚 {row.learnItems?.length || 0} Learn Items
                    </div>
                    <div className={styles.metaChip}>
                      👥 {row.whoItems?.length || 0} Who Items
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
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <Link
                        className={styles.editBtn}
                       href={`/admin/yogacourse/vinyasa-teacher-training/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageH1Title)}
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
            {rows.length} page{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}