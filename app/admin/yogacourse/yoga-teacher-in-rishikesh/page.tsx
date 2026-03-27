"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface BestYogaSchoolData {
  _id: string;
  heroTitle: string;
  status: "Active" | "Inactive";
  createdAt: string;
  accredBadges?: Array<{ label: string; badge: string; imgUrl?: string }>;
  courseCards?: Array<{ title: string; duration: string }>;
  specialtyCourses?: Array<{ title: string }>;
  inlineLinks?: Array<{ text: string; href: string }>;
  bodyParagraphs1?: string[];
  bodyParagraphs2?: string[];
}

export default function BestYogaSchoolListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<BestYogaSchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/best-yoga-school/get");
      const data = res.data?.data;

      if (data) {
        setRows([data]);
      } else {
        setRows([]);
      }
    } catch {
      setError("Failed to load Best Yoga School page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/best-yoga-school/delete`);
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
      await api.put(`/best-yoga-school/update`, { status: next });
      setRows((prev) =>
        prev.map((r) => ({ ...r, status: next }))
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
          <h1 className={styles.listTitle}>Best Yoga School Pages</h1>
          <p className={styles.listSubtitle}>
            Hero · Accreditations · Body Text · Courses (200/300/500hr) · Specialty Courses
          </p>
        </div>
        <Link href="/admin/yogacourse/yoga-teacher-in-rishikesh/add-new" className={styles.addNewBtn}>
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
          <span>Loading Best Yoga School page…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🧘</div>
          <h3 className={styles.emptyTitle}>No Best Yoga School page yet</h3>
          <p className={styles.emptyText}>
            Create your first Best Yoga School page to showcase your yoga teacher training programs, accreditations, and specialty courses.
          </p>
          <Link href="/admin/yogacourse/yoga-teacher-in-rishikesh/add-new" className={styles.addNewBtn}>
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
                <th className={styles.th}>Courses</th>
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
                      <strong>
                        {row.heroTitle
                          ? row.heroTitle.length > 40
                            ? row.heroTitle.slice(0, 40) + "…"
                            : row.heroTitle
                          : "Best Yoga School Page"}
                      </strong>
                      <div className={styles.cellSub}>
                        📝 {(row.bodyParagraphs1?.length || 0) + (row.bodyParagraphs2?.length || 0)} Body Paragraphs
                      </div>
                      <div className={styles.cellSub}>
                        🔗 {row.inlineLinks?.length || 0} Inline Links
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      🎓 {row.courseCards?.length || 0} Main Courses
                    </div>
                    {row.courseCards?.slice(0, 2).map((c, i) => (
                      <div key={i} className={styles.cellSub} style={{ fontSize: "0.72rem" }}>
                        • {c.duration ? `${c.duration}` : c.title?.slice(0, 28) + "…"}
                      </div>
                    ))}
                    <div className={styles.metaChip} style={{ marginTop: "0.25rem" }}>
                      ✨ {row.specialtyCourses?.length || 0} Specialty Courses
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      🏅 {row.accredBadges?.length || 0} Accreditations
                    </div>
                    <div className={styles.metaChip}>
                      📋 {(row.bodyParagraphs1?.length || 0)} Para Block 1
                    </div>
                    <div className={styles.metaChip}>
                      📋 {(row.bodyParagraphs2?.length || 0)} Para Block 2
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
                        href="/admin/yogacourse/best-yoga-school/add-new"
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.heroTitle || "Best Yoga School Page")}
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