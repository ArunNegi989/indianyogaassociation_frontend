"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface AyurvedaCourseData {
  _id: string;
  pageTitleH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  ayurvedaCourses?: Array<{
    level: string;
    fee: string;
    days: string;
    cert: string;
  }>;
  panchaKarmaCourses?: Array<{
    level: string;
    fee: string;
    days: string;
    cert: string;
  }>;
  therapies?: Array<{
    num: string;
    name: string;
    desc: string;
    icon: string;
  }>;
  massageTypes?: Array<{
    num: string;
    name: string;
    desc: string;
  }>;
  doshas?: Array<{
    name: string;
    elements: string;
    color: string;
    symbol: string;
    desc: string;
  }>;
  dailySchedule?: Array<{
    time: string;
    activity: string;
  }>;
  syllabus?: string[];
  included?: string[];
  yogaPricing?: Array<{
    hrs: string;
    title: string;
    price: string;
    note: string;
  }>;
}

export default function AyurvedaCourseListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<AyurvedaCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/ayurveda-course");
      setRows(res.data?.data || []);
    } catch {
      setError("Failed to load Ayurveda courses.");
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
      await api.delete(`/ayurveda-course/delete/${id}`);
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
      await api.put(`/ayurveda-course/update/${id}`, { status: next });
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
          <h1 className={styles.listTitle}>Ayurveda Course Pages</h1>
          <p className={styles.listSubtitle}>
            Ayurveda · Panchakarma · Therapies · Doshas · Schedule · Pricing
          </p>
        </div>
        <Link
          href="/admin/yogacourse/yoga-ayurveda-teacher/add-new"
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
        <span>❧</span>
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
          <span>Loading Ayurveda pages…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🌿</div>
          <h3 className={styles.emptyTitle}>No Ayurveda pages yet</h3>
          <p className={styles.emptyText}>
            Create your first Ayurveda course page to showcase Ayurveda programs, therapies, and doshas.
          </p>
          <Link
            href="/admin/yogacourse/yoga-ayurveda-teacher/add-new"
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
                      <strong>{row.pageTitleH1 || "—"}</strong>
                      <div className={styles.cellSub}>
                        📚 {row.ayurvedaCourses?.length || 0} Ayurveda Courses
                      </div>
                      <div className={styles.cellSub}>
                        🧘 {row.panchaKarmaCourses?.length || 0} Panchakarma Courses
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
                      🌿 {row.doshas?.length || 0} Doshas
                    </div>
                    <div className={styles.metaChip}>
                      💆 {row.therapies?.length || 0} Therapies
                    </div>
                    <div className={styles.metaChip}>
                      📋 {row.syllabus?.length || 0} Syllabus Items
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
                        href={`/admin/yogacourse/yoga-ayurveda-teacher/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageTitleH1)}
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
            {rows.length} Ayurveda page{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}