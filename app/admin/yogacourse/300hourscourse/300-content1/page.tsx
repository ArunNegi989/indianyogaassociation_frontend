"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface Row {
  _id: string;
  pageMainH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function List300hrContent1() {
  const [rows, setRows]         = useState<Row[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const fetchList = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/yoga-300hr/content1");
      setRows(res.data?.data || []);
    } catch { setError("Failed to load records."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/yoga-300hr/content1/delete/${id}`);
      setRows(p => p.filter(r => r._id !== id));
    } catch { alert("Delete failed. Please try again."); }
    finally { setDeleting(null); }
  };

  const toggleStatus = async (id: string, cur: "Active" | "Inactive") => {
    const next = cur === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/yoga-300hr/content1/update/${id}`, { status: next });
      setRows(p => p.map(r => r._id === id ? { ...r, status: next } : r));
    } catch { alert("Status update failed."); }
  };

  return (
    <div className={styles.listPage}>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>300 Hour Yoga — Content Part 1</h1>
          <p className={styles.listSubtitle}>Hero · Intro · Overview · Fee · Syllabus · Modules 1–9</p>
        </div>
        {rows.length > 0 ? (
          <button className={styles.addNewBtn}
            onClick={() => toast.error("Record already present. Please edit or delete first.")}>
            ＋ Add New
          </button>
        ) : (
          <Link href="/admin/yogacourse/300hourscourse/300-content1/add-new" className={styles.addNewBtn}>
            ＋ Add New
          </Link>
        )}
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingWrap}><span className={styles.spinner} /><span>Loading…</span></div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>ॐ</div>
          <h3 className={styles.emptyTitle}>No records yet</h3>
          <p className={styles.emptyText}>Add your first Content Part 1 record.</p>
          <Link href="/admin/yogacourse/300hourscourse/300-content1/add-new" className={styles.addNewBtn}>
            ＋ Add First Record
          </Link>
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
                  <td className={styles.td}><span className={styles.rowNum}>{idx + 1}</span></td>
                  <td className={styles.td}><span className={styles.rowTitle}>{row.pageMainH1 || "—"}</span></td>
                  <td className={styles.td}><code className={styles.slugBadge}>{row.slug || "—"}</code></td>
                  <td className={styles.td}>
                    <button type="button"
                      className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                      onClick={() => toggleStatus(row._id, row.status)} title="Click to toggle">
                      {row.status}
                    </button>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.dateText}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <Link className={styles.editBtn}
                        href={`/admin/yogacourse/300hourscourse/300-content1/${row._id}`}>✎ Edit</Link>
                      <button type="button" className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.pageMainH1)}
                        disabled={deleting === row._id}>
                        {deleting === row._id ? <span className={styles.spinner} /> : "🗑 Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.tableCount}>{rows.length} record{rows.length !== 1 ? "s" : ""} total</p>
        </div>
      )}
    </div>
  );
}