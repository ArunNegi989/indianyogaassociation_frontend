"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface Row {
  _id: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  evolutionH2?: string;
}

export default function List300hrContent2() {
  const [rows, setRows]         = useState<Row[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/yoga-300hr/content2");
      // API returns { success, data } — wrap single record in array
      const record = res.data?.data || res.data;
      setRows(record && record._id ? [record] : []);
    } catch (e: any) {
      // 404 means no record yet — that's fine, not an error
      if (e?.response?.status === 404) {
        setRows([]);
      } else {
        setError("Failed to load records.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

 const handleDelete = async (id: string) => {
  try {
    setDeleting(id);

    await api.delete("/yoga-300hr/content2/delete");

    setRows([]);

    toast.success("Record deleted successfully");
  } catch {
    toast.error("Delete failed. Please try again.");
  } finally {
    setDeleting(null);
  }
};

  const toggleStatus = async (id: string, cur: "Active" | "Inactive") => {
    const next = cur === "Active" ? "Inactive" : "Active";
    try {
      // FIX: use PATCH /status — never PUT /update for status-only changes
      // PUT /update runs parseData() which would wipe all array fields
      await api.patch("/yoga-300hr/content2/status", { status: next });
      setRows((p) => p.map((r) => (r._id === id ? { ...r, status: next } : r)));
    } catch {
      alert("Status update failed.");
    }
  };

  return (
    <div className={styles.listPage}>
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>300 Hour Yoga — Content Part 2</h1>
          <p className={styles.listSubtitle}>
            Evolution · Career · FAQ · Accommodation · Luxury · Schedule · Outcomes · Ethics · Misconceptions · Reviews
          </p>
        </div>
        {rows.length > 0 ? (
          <button
            className={styles.addNewBtn}
            onClick={() => toast.error("Record already present. Please edit or delete first.")}
          >
            ＋ Add New
          </button>
        ) : (
          <Link href="/admin/yogacourse/300hourscourse/300-content2/add-new" className={styles.addNewBtn}>
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
          <p className={styles.emptyText}>Add your first Content Part 2 record.</p>
          <Link href="/admin/yogacourse/300hourscourse/300-content2/add-new" className={styles.addNewBtn}>
            ＋ Add First Record
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Evolution H2 / Identifier</th>
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
                  <td className={styles.td}>
                    <span className={styles.rowTitle}>{row.evolutionH2 || "300hr Content Part 2"}</span>
                  </td>
                  <td className={styles.td}><code className={styles.slugBadge}>{row.slug || "—"}</code></td>
                  <td className={styles.td}>
                    <button
                      type="button"
                      className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                      onClick={() => toggleStatus(row._id, row.status)}
                      title="Click to toggle"
                    >
                      {row.status}
                    </button>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.dateText}>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <Link
                        className={styles.editBtn}
                        href={`/admin/yogacourse/300hourscourse/300-content2/${row._id}`}
                      >
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id)}
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
          <p className={styles.tableCount}>{rows.length} record{rows.length !== 1 ? "s" : ""} total</p>
        </div>
      )}
    </div>
  );
}