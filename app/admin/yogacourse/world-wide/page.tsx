"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface WorldwidePageRow {
  _id: string;
  pageTitleH1: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  locationsCount?: number;
   locations?: any[];
}

export default function WorldwideListPage() {
  const router = useRouter();
  const [rows, setRows]         = useState<WorldwidePageRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/worldwide/content");

setRows(res.data?.data ? [res.data.data] : []);
    } catch {
      setError("Failed to load worldwide pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
  try {
    setDeleting(id);
    await api.delete("/worldwide/content/delete");
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
      await api.put(`/worldwide/content/update/${id}`, { status: next });
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
          <h1 className={styles.listTitle}>Worldwide — Yoga Teacher Training Pages</h1>
          <p className={styles.listSubtitle}>
            Hero · Stats · Curriculum · Benefits · Locations · Community · CTA
          </p>
        </div>
      
        {hasAnyRecords ? (
          <button
            className={styles.addNewBtn}
            onClick={() => toast.error("Record already present. Please edit or delete first.")}
          >
            ＋ Add New
          </button>
        ) : (
          <Link
            href="/admin/yogacourse/world-wide/add-new"
            className={styles.addNewBtn}
          >
            ＋ Add New
          </Link>
        )}
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
          <span>Loading worldwide pages…</span>
        </div>

      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🌍</div>
          <h3 className={styles.emptyTitle}>No worldwide pages yet</h3>
          <p className={styles.emptyText}>
            Create your first Worldwide landing page to showcase global yoga teacher training locations.
          </p>
          {!hasAnyRecords && (
            <Link
              href="/admin/yogacourse/world-wide/add-new"
              className={styles.addNewBtn}
            >
              ＋ Create First Page
            </Link>
          )}
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
      📊 {row.locations?.length || 0} Locations
    </div>

    <div className={styles.cellSub}>
      📄 Worldwide Page
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
   📊 {row.locations?.length || 0} Locations
  </div>

  <div className={styles.metaChip}>
    🧘 Content Ready
  </div>
</td>

                 <td className={styles.td}>
  <button
    className={`${styles.statusBadge} ${
      row.status === "Active" ? styles.statusActive : styles.statusInactive
    }`}
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
                        href={`/admin/yogacourse/world-wide/${row._id}`}
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
            {rows.length} worldwide page{rows.length !== 1 ? "s" : ""} total
          </p>
        </div>
      )}
    </div>
  );
}