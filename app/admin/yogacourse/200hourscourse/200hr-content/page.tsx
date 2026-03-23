"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface Content1Row {
  _id: string;
  pageMainH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function Content1ListPage() {
  const router = useRouter();
  const [rows, setRows]         = useState<Content1Row[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/yoga-200hr/content1");
      setRows(res.data?.data || []);
    } catch {
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/yoga-200hr/content1/delete/${id}`);
      setRows(prev => prev.filter(r => r._id !== id));
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/yoga-200hr/content1/update/${id}`, { status: next });
      setRows(prev => prev.map(r => r._id === id ? { ...r, status: next } : r));
    } catch {
      alert("Status update failed.");
    }
  };

  return (
    <div className={styles.listPage}>

      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>200 Hour Yoga — Content Part 1</h1>
          <p className={styles.listSubtitle}>
            Hero · Intro · Stats · Aims · Overview · Fee · Syllabus · Modules 1–8 · Ashtanga · Hatha · Asanas
          </p>
        </div>
      
{rows.length > 0 ? (
  <button
    className={styles.addNewBtn}
   onClick={() =>
  toast.error("Record already present. Please edit or delete first.")
}
  >
    ＋ Add New
  </button>
) : (
  <Link
    href="/admin/yogacourse/200hourscourse/200hr-content/add-new"
    className={styles.addNewBtn}
  >
    ＋ Add New
  </Link>
)}


      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1.5rem" }}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
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
          <span>Loading…</span>
        </div>

      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>ॐ</div>
          <h3 className={styles.emptyTitle}>No records yet</h3>
          <p className={styles.emptyText}>Add your first Content Part 1 record.</p>
          {rows.length === 0 && (
  <Link
    href="/admin/yogacourse/200hourscourse/200hr-content/add-new"
    className={styles.addNewBtn}
  >
    ＋ Add First Record
  </Link>
)}
        </div>

      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Page Title (H1)</th>
                <th className={styles.th}>Slug</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Created</th>
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
                    <span className={styles.rowTitle}>{row.pageMainH1 || "—"}</span>
                  </td>

                  <td className={styles.td}>
                    <code className={styles.slugBadge}>{row.slug || "—"}</code>
                  </td>

                  <td className={styles.td}>
                    <button
                      type="button"
                      className={`${styles.statusBadge} ${
                        row.status === "Active" ? styles.statusActive : styles.statusInactive
                      }`}
                      onClick={() => toggleStatus(row._id, row.status)}
                      title="Click to toggle"
                    >
                      {row.status}
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
                        href={`/admin/yogacourse/200hourscourse/200hr-content/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageMainH1)}
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
            {rows.length} record{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}