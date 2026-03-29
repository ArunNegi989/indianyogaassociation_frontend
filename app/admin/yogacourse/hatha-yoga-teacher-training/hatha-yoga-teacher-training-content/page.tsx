"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface HathaYogaData {
  _id: string;
  introSectionTitle: string;
  slug: string;
  status: "Active" | "Inactive";
  createdAt: string;
  certCards?: Array<{ hours: string }>;
  courseDetailsList?: string[];
  benefitsList?: string[];
  pricingRows?: Array<{ date: string }>;
  accreditations?: string[];
}

export default function HathaYogaListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<HathaYogaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/hatha-yoga");
      const data = res.data?.data;
      if (data) {
        setRows([data]);
      } else {
        setRows([]);
      }
    } catch {
      setError("Failed to load Hatha Yoga page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/hatha-yoga/delete`);
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
      await api.put(`/hatha-yoga/update`, { status: next });
      setRows((prev) => prev.map((r) => ({ ...r, status: next })));
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
          <h1 className={styles.listTitle}>Hatha Yoga Page</h1>
          <p className={styles.listSubtitle}>
            Hero · Intro · What is Hatha · Benefits · Certification · Ashram · Curriculum · Pricing · Footer CTA
          </p>
        </div>
        <button
  className={styles.addNewBtn}
  onClick={() => {
    if (rows.length > 0) {
      toast.error("Page already exists. Please edit instead.");
      return;
    }

    router.push("/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content/add-new");
  }}
>
  ＋ Add New
</button>
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
          <span>Loading Hatha Yoga page…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🧘</div>
          <h3 className={styles.emptyTitle}>No Hatha Yoga page yet</h3>
          <p className={styles.emptyText}>
            Create your first Hatha Yoga page to showcase your hatha yoga teacher training programs, benefits, curriculum, and pricing.
          </p>
          <Link href="/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content/add-new" className={styles.addNewBtn}>
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
                      <strong>{row.introSectionTitle || "Hatha Yoga Page"}</strong>
                      <div className={styles.cellSub}>🎓 {row.certCards?.length || 0} Cert Cards</div>
                      <div className={styles.cellSub}>📅 {row.pricingRows?.length || 0} Pricing Rows</div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <code className={styles.slugBadge}>{row.slug || "—"}</code>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.metaChip}>✅ {row.benefitsList?.length || 0} Benefits</div>
                    <div className={styles.metaChip}>📋 {row.courseDetailsList?.length || 0} Curriculum Items</div>
                    <div className={styles.metaChip}>🏅 {row.accreditations?.length || 0} Accreditations</div>
                  </td>
                  <td className={styles.td}>
                    <button
                      className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                      onClick={() => toggleStatus(row._id, row.status)}
                    >
                      {row.status === "Active" ? "🟢 Live" : "🔴 Hidden"}
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
                      <Link className={styles.editBtn} href={`/admin/yogacourse/hatha-yoga-teacher-training/hatha-yoga-teacher-training-content/${row._id}`}>
                        ✎ Edit
                      </Link>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(row._id, row.introSectionTitle || "this page")}
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