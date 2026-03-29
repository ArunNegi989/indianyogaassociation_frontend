"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

interface GoaPageData {
  _id: string;
  status: "Active" | "Inactive";
  createdAt: string;
  // Hero
  heroTitle?: string;
  // Intro
  introHeading?: string;
  // Programs
  corePrograms?: Array<{ hrs: string; tag: string }>;
  specialPrograms?: Array<{ title: string }>;
  // Schedule
  scheduleRows?: Array<{ time: string; activity: string }>;
  // Highlights
  highlights?: Array<{ title: string }>;
  // Batches section
  batchesSectionTitle?: string;
  // Gallery
  campusImages?: Array<{ label: string }>;
  // Learnings / focus
  learnings?: string[];
  mainFocus?: string[];
}

export default function GoaYogaListPage() {
  const router = useRouter();
  const [rows, setRows] = useState<GoaPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/goa-yoga-page/get");
      const data = res.data?.data;
      setRows(data ? [data] : []);
    } catch {
      setError("Failed to load Goa Yoga page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string) => {
   
    try {
      setDeleting(id);
      await api.delete("/goa-yoga-page/delete");
      toast.success("Page deleted successfully");
      await fetchList();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      await api.put("/goa-yoga-page/update", { status: next });
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
          <h1 className={styles.listTitle}>Goa Yoga Teacher Training Page</h1>
          <p className={styles.listSubtitle}>
            Hero · Intro · Programs · Highlights · Curriculum · Schedule · Batches · Gallery · Address
          </p>
        </div>
       <Link
  href={rows.length === 0 ? "/admin/yogacourse/yoga-goa-in-india/yoga-goa-content/add-new" : "#"}
  className={styles.addNewBtn}
  onClick={(e) => {
    if (rows.length > 0) {
      e.preventDefault();
    toast.error("Record already present. Please edit or delete the existing record to add a new one.");
    }
  }}
>
  ＋ Add New
</Link>
      </div>

      <div className={styles.ornament}>
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
          <span>Loading Goa Yoga page…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>🌊</div>
          <h3 className={styles.emptyTitle}>No Goa Yoga page yet</h3>
          <p className={styles.emptyText}>
            Create your Goa Yoga Teacher Training page with programs, schedule, campus gallery, and batch booking details.
          </p>
          <Link href="/admin/yogacourse/yoga-goa-in-india/yoga-goa-content/add-new" className={styles.addNewBtn}>
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
                <th className={styles.th}>Programs</th>
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
                          ? row.heroTitle.length > 42
                            ? row.heroTitle.slice(0, 42) + "…"
                            : row.heroTitle
                          : "Goa Yoga TTC Page"}
                      </strong>
                      <div className={styles.cellSub}>
                        📍 {row.introHeading ? row.introHeading.slice(0, 36) + "…" : "Arambol, North Goa"}
                      </div>
                      <div className={styles.cellSub}>
                        🎓 {row.batchesSectionTitle || "Upcoming Batches"}
                      </div>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <div className={styles.metaChip}>
                      📚 {row.corePrograms?.length || 0} Core Programs
                    </div>
                    {row.corePrograms?.slice(0, 3).map((p, i) => (
                      <div key={i} className={styles.cellSub} style={{ fontSize: "0.72rem" }}>
                        • {p.hrs}hr — {p.tag}
                      </div>
                    ))}
                    <div className={styles.metaChip} style={{ marginTop: "0.25rem" }}>
                      🎵 {row.specialPrograms?.length || 0} Specialty Programs
                    </div>
                  </td>

                  <td className={styles.td}>
                    <div className={styles.metaChip}>⭐ {row.highlights?.length || 0} Highlights</div>
                    <div className={styles.metaChip}>📋 {row.learnings?.length || 0} Learnings</div>
                    <div className={styles.metaChip}>🔵 {row.mainFocus?.length || 0} Focus Points</div>
                    <div className={styles.metaChip}>🕐 {row.scheduleRows?.length || 0} Schedule Rows</div>
                    <div className={styles.metaChip}>🖼️ {row.campusImages?.length || 0} Gallery Images</div>
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
                        href={`/admin/yogacourse/yoga-goa-in-india/yoga-goa-content/${row._id}`}
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
          <p className={styles.tableCount}>{rows.length} page total</p>
        </div>
      )}
    </div>
  );
}