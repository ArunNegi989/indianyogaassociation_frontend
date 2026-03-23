"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";          // ← import toast
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";

interface Content2Row {
  _id: string;
  metaTitle: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export default function Content2ListPage() {
  const router = useRouter();
  const [rows, setRows]             = useState<Content2Row[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError]           = useState("");

  // ── Fetch ──────────────────────────────────────────────
  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/yoga-200hr/content2/get");
      const record = res.data?.data;
      setRows(record ? [record] : []);
    } catch {
      setError("Records load nahi ho sake. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // ── Add New guard ──────────────────────────────────────
  const handleAddNew = () => {
    if (rows.length > 0) {
      toast.error("Record already exists! Please edit or delete it first.");
      return;
    }
    router.push("/admin/yogacourse/200hourscourse/200hrcontent2/add-new");
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (title: string) => {
    if (!confirm(`"${title}" delete karna chahte ho?\nYeh permanently delete ho jayega.`)) return;
    try {
      setDeleting(true);
      await api.delete("/yoga-200hr/content2/delete");
      setRows([]);
      toast.success("Record delete ho gaya 🗑️");
    } catch {
      toast.error("Delete nahi ho saka. Dobara try karo.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Status toggle ──────────────────────────────────────
  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      setTogglingId(id);
      const fd = new FormData();
      fd.append("status", next);
      await api.put("/yoga-200hr/content2/update", fd);
      setRows(prev => prev.map(r => r._id === id ? { ...r, status: next } : r));
      toast.success(`Status updated to ${next}`);
    } catch {
      toast.error("Status update nahi ho saka.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className={styles.listPage}>

      {/* ── Header ── */}
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>200hr Content — Part 2</h1>
          <p className={styles.listSubtitle}>
            Evaluation · Accommodation · Food · Schedule · Programs · Reviews · FAQ · SEO
          </p>
        </div>

        {/* Always visible — shows toast if record already exists */}
        <button
          type="button"
          className={styles.addNewBtn}
          onClick={handleAddNew}
        >
          ＋ Add New
        </button>
      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1.5rem" }}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}{" "}
          <button onClick={fetchList}>Retry</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span>Loading…</span>
        </div>
      ) : rows.length === 0 ? (

        /* ── Empty State ── */
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>ॐ</div>
          <h3 className={styles.emptyTitle}>Koi record nahi mila</h3>
          <p className={styles.emptyText}>Pehla Content Part 2 record banao.</p>
          <button
            type="button"
            className={styles.addNewBtn}
            onClick={handleAddNew}
          >
            ＋ Add New
          </button>
        </div>

      ) : (

        /* ── Table ── */
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Meta Title</th>
                <th className={styles.th}>Slug</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Created</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row._id} className={styles.tr}>

                  {/* # */}
                  <td className={styles.td}>
                    <span className={styles.rowNum}>{idx + 1}</span>
                  </td>

                  {/* Meta Title */}
                  <td className={styles.td}>
                    <span className={styles.rowTitle}>{row.metaTitle || "—"}</span>
                  </td>

                  {/* Slug */}
                  <td className={styles.td}>
                    <code className={styles.slugBadge}>{row.slug || "—"}</code>
                  </td>

                  {/* Status toggle */}
                  <td className={styles.td}>
                    <button
                      type="button"
                      className={`${styles.statusBadge} ${
                        row.status === "Active" ? styles.statusActive : styles.statusInactive
                      }`}
                      onClick={() => toggleStatus(row._id, row.status)}
                      disabled={togglingId === row._id}
                      title="Click to toggle"
                    >
                      {togglingId === row._id
                        ? <span className={styles.spinner} />
                        : row.status}
                    </button>
                  </td>

                  {/* Created */}
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

                  {/* Actions */}
                  <td className={styles.td}>
                    <div className={styles.actionBtns}>
                      <button
                        type="button"
                        className={styles.editBtn}
                        onClick={() =>
                          router.push(
                            `/admin/yogacourse/200hourscourse/200hrcontent2/edit`
                          )
                        }
                        title="Edit"
                      >
                        ✎ Edit
                      </button>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row.metaTitle)}
                        disabled={deleting}
                        title="Delete"
                      >
                        {deleting ? <span className={styles.spinner} /> : "🗑"}
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