"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface KundaliniTTCData {
  _id: string;
  status: "Active" | "Inactive";
  createdAt: string;
  // Section titles
  whatIsTitle?: string;
  syllabusBigTitle?: string;
  whyAYMTitle?: string;
  // Arrays for stats
  syllabusModules?: Array<{ id: string; title: string; items: string[] }>;
  highlightCards?: Array<{ id: string; title: string; desc: string }>;
  whyCards?: Array<{ id: string; label: string; desc: string }>;
  benefitItems?: string[];
  scheduleItems?: Array<{ id: string; time: string; activity: string }>;
  facilityItems?: string[];
  refundItems?: string[];
}

export default function KundaliniTTCListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<KundaliniTTCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/kundalini-ttc-content/get");
      const data = res.data?.data;

      if (data) {
        setRows([data]);
      } else {
        setRows([]);
      }
    } catch {
      setError("Failed to load Kundalini TTC page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

const handleDelete = async (id: string, title: string) => {
  try {
    setDeleting(id);
    await api.delete(`/kundalini-ttc-content/delete`);
    setRows([]);
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
      await api.put(`/kundalini-ttc-content/update`, { status: next });
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          status: next,
        }))
      );
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
          <h1 className={styles.listTitle}>Kundalini TTC Pages</h1>
          <p className={styles.listSubtitle}>
            Hero · What is Kundalini · Benefits · Highlights · Syllabus · Eligibility · Facilities · Schedule · Why AYM · Rishikesh · Refund
          </p>
        </div>
        <Link href="/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training/add-new" className={styles.addNewBtn}>
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
          <span>Loading Kundalini TTC page…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🧘</div>
          <h3 className={styles.emptyTitle}>No Kundalini TTC page yet</h3>
          <p className={styles.emptyText}>
            Create your first Kundalini TTC page to showcase your 200-hour Kundalini Yoga Teacher Training program, syllabus, and facilities.
          </p>
          <Link href="/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training/add-new" className={styles.addNewBtn}>
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
                <th className={styles.th}>Syllabus</th>
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
                      <strong>{row.whatIsTitle || "Kundalini TTC Page"}</strong>
                      <div className={styles.cellSub}>
                        🏷️ {row.highlightCards?.length || 0} Highlight Cards
                      </div>
                      <div className={styles.cellSub}>
                        ✅ {row.benefitItems?.length || 0} Benefits
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      📚 {row.syllabusModules?.length || 0} Modules
                    </div>
                    <div className={styles.cellSub} style={{ fontSize: "0.72rem", marginTop: 2 }}>
                      {row.syllabusBigTitle
                        ? row.syllabusBigTitle.length > 36
                          ? row.syllabusBigTitle.slice(0, 36) + "…"
                          : row.syllabusBigTitle
                        : "—"}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      🏛️ {row.whyCards?.length || 0} Why Cards
                    </div>
                    <div className={styles.metaChip}>
                      🕐 {row.scheduleItems?.length || 0} Schedule Rows
                    </div>
                    <div className={styles.metaChip}>
                      🏠 {row.facilityItems?.length || 0} Facilities
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
                        href={`/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.whatIsTitle || "Kundalini TTC Page")}
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