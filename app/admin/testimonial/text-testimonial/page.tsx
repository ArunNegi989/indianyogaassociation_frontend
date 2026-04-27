"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";

export const COURSE_OPTIONS = [
  { label: "100 Hour Yoga Teacher Training", value: "100-hour-yoga-teacher-training" },
  { label: "200 Hour Yoga Teacher Training", value: "200-hour-yoga-teacher-training" },
  { label: "300 Hour Yoga Teacher Training", value: "300-hour-yoga-teacher-training" },
  { label: "500 Hour Yoga Teacher Training", value: "500-hour-yoga-teacher-training" },
  { label: "Kundalini Yoga Teacher Training", value: "kundalini-yoga-teacher-training" },
  { label: "Yoga Teacher Training Rishikesh", value: "yoga-teacher-training-rishikesh" },
  { label: "Prenatal Yoga Teacher Training", value: "prenatal-yoga-teacher-training" },
  { label: "Vinyasa Yoga Teacher Training", value: "vinyasa-yoga-teacher-training" },
  { label: "Yoga Teacher Training in India", value: "yoga-teacher-training-india" },
  { label: "Hatha Yoga Teacher Training", value: "hatha-yoga-teacher-training" },
  { label: "Yoga Teacher Training Goa", value: "yoga-teacher-training-goa" },
  { label: "Yoga Teacher Training Bali", value: "yoga-teacher-training-bali" },
  { label: "Ayurveda & Yoga TTC", value: "ayurveda-yoga-ttc" },
  { label: "Yoga Teacher Training World Wide", value: "yoga-teacher-training-worldwide" },
];

interface TextReview {
  _id: string;
  courseType: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  review: string;
  courseBadge: string;
  date: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

/* ── Date formatter: "15 Jan 2024" ── */
function fmtDate(raw: string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function TextReviewsList() {
  const [rows, setRows] = useState<TextReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/student-reviews/get");
      setRows(res.data?.data || []);
    } catch {
      setError("Failed to load text reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review by "${name}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/student-reviews/delete/${id}`);
      setRows(prev => prev.filter(r => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/student-reviews/update/${id}`, { status: next });
      setRows(prev => prev.map(r => r._id === id ? { ...r, status: next } : r));
      toast.success(`Status → ${next}`);
    } catch {
      toast.error("Status update failed.");
    }
  };

  // Filter
  const filtered = rows.filter(r => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.review.toLowerCase().includes(search.toLowerCase()) ||
      (r.country || "").toLowerCase().includes(search.toLowerCase());
    const matchCourse = !filterCourse || r.courseType === filterCourse;
    return matchSearch && matchCourse;
  });

  // Group by courseType
  const grouped = COURSE_OPTIONS
    .map(opt => ({
      ...opt,
      reviews: filtered.filter(r => r.courseType === opt.value),
    }))
    .filter(g => g.reviews.length > 0);

  return (
    <div className={styles.listPage}>

      {/* Header */}
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>Text Reviews</h1>
          <p className={styles.listSubtitle}>
            Individual student testimonials · grouped by course
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/admin/testimonial/video" className={styles.cancelBtn} style={{ fontSize: 13 }}>
            ▶ Switch to Videos
          </Link>
          <Link href="/admin/testimonial/text-testimonial/add-new" className={styles.addNewBtn}>
            ＋ Add Review
          </Link>
        </div>
      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1rem" }}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
        <div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", gap: 12, marginBottom: "1.2rem", flexWrap: "wrap",
      }}>
        {[
          { label: "Total", value: rows.length, color: "#7a4f10", bg: "#fdf0e0" },
          { label: "Active", value: rows.filter(r => r.status === "Active").length, color: "#1a7a1a", bg: "#e8f5e8" },
          { label: "Inactive", value: rows.filter(r => r.status === "Inactive").length, color: "#7a1a1a", bg: "#f5e8e8" },
          { label: "Courses", value: grouped.length, color: "#1a4a7a", bg: "#e8f0f5" },
        ].map(s => (
          <div key={s.label} style={{
            padding: "6px 14px", borderRadius: 10,
            background: s.bg, color: s.color,
            fontSize: 12, fontWeight: 600,
            display: "flex", gap: 6, alignItems: "center",
          }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>{s.value}</span>
            <span style={{ opacity: 0.7 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.2rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 260 }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            fontSize: 13, color: "#bbb", pointerEvents: "none",
          }}>🔍</span>
          <input
            className={`${styles.input} ${styles.inputNoCount}`}
            style={{ paddingLeft: 30, fontSize: 13 }}
            placeholder="Search name, country, review…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.selectWrap} style={{ maxWidth: 260 }}>
          <select
            className={styles.select}
            style={{ fontSize: 13 }}
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {COURSE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className={styles.selectArrow}>▾</span>
        </div>
        {(search || filterCourse) && (
          <button
            onClick={() => { setSearch(""); setFilterCourse(""); }}
            style={{
              padding: "0 12px", borderRadius: 8, border: "1px solid #ddd",
              background: "#fff", fontSize: 12, cursor: "pointer", color: "#888",
            }}
          >✕ Clear</button>
        )}
        <span style={{ fontSize: 12, color: "#888", alignSelf: "center" }}>
          {filtered.length} review{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} /><span>Loading reviews…</span>
        </div>
      ) : grouped.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm}>ॐ</div>
          <h3 className={styles.emptyTitle}>
            {search || filterCourse ? "No reviews match your search" : "No text reviews yet"}
          </h3>
          <p className={styles.emptyText}>
            {search || filterCourse ? "Try different filters." : "Add your first student testimonial."}
          </p>
          {!search && !filterCourse && (
            <Link href="/admin/testimonial/text-testimonial/add-new" className={styles.addNewBtn}>
              ＋ Add First Review
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {grouped.map(group => (
            <div key={group.value}>

              {/* Course group header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                marginBottom: "0.75rem", padding: "0.6rem 1rem",
                background: "linear-gradient(90deg,#fdf6ec,transparent)",
                borderLeft: "3px solid #c9913d", borderRadius: "0 8px 8px 0",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#8a5f20" }}>✦ {group.label}</span>
                <span style={{
                  fontSize: 11, background: "#f0ddb8", color: "#7a4f10",
                  padding: "2px 10px", borderRadius: 12, fontWeight: 600,
                }}>
                  {group.reviews.length} review{group.reviews.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th} style={{ width: 36 }}>#</th>
                      <th className={styles.th} style={{ minWidth: 180 }}>Reviewer</th>
                      <th className={styles.th} style={{ width: 90 }}>Badge</th>
                      <th className={styles.th}>Review</th>
                      <th className={styles.th} style={{ width: 90 }}>Rating</th>
                      <th className={styles.th} style={{ width: 105 }}>Completed</th>
                      <th className={styles.th} style={{ width: 100 }}>Added On</th>
                      <th className={styles.th} style={{ width: 80 }}>Status</th>
                      <th className={styles.th} style={{ width: 110 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.reviews.map((row, idx) => (
                      <tr key={row._id} className={styles.tr}>

                        {/* # */}
                        <td className={styles.td}>
                          <span className={styles.rowNum}>{idx + 1}</span>
                        </td>

                        {/* Reviewer — avatar + name + country */}
                        <td className={styles.td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            {row.image ? (
                              <img
                                src={
                                  row.image.startsWith("http")
                                    ? row.image
                                    : `${process.env.NEXT_PUBLIC_API_URL}${row.image}`
                                }
                                alt={row.name}
                                style={{
                                  width: 36, height: 36, borderRadius: "50%",
                                  objectFit: "cover", flexShrink: 0,
                                  border: "1.5px solid #e8d5b5",
                                }}
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            ) : (
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                                background: "linear-gradient(135deg,#f0ddb8,#e8c98a)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 14, fontWeight: 700, color: "#8a5f20",
                              }}>
                                {row.name?.[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#333" }}>
                                {row.name || "—"}
                              </div>
                              {row.country && (
                                <div className={styles.cellSub} style={{ fontSize: 11 }}>
                                  🌍 {row.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Badge */}
                        <td className={styles.td}>
                          {row.courseBadge ? (
                            <span style={{
                              fontSize: 10, fontWeight: 600,
                              background: "#fdf0e0", color: "#8a5f20",
                              padding: "3px 8px", borderRadius: 10,
                              border: "1px solid #e8d5b5",
                              whiteSpace: "nowrap",
                            }}>
                              {row.courseBadge}
                            </span>
                          ) : (
                            <span style={{ color: "#ccc", fontSize: 11 }}>—</span>
                          )}
                        </td>

                        {/* Review text */}
                        <td className={styles.td}>
                          <div style={{
                            fontSize: 12, color: "#555",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            maxWidth: 300,
                            lineHeight: 1.5,
                          }}>
                            {row.review || "—"}
                          </div>
                        </td>

                        {/* Rating */}
                        <td className={styles.td}>
                          <div>
                            <span style={{ color: "#e07b00", fontSize: 13, letterSpacing: 1 }}>
                              {"★".repeat(row.rating || 5)}
                            </span>
                            <span style={{ color: "#e0e0e0", fontSize: 13 }}>
                              {"★".repeat(5 - (row.rating || 5))}
                            </span>
                            <div style={{ fontSize: 10, color: "#aaa" }}>
                              {row.rating || 5}/5
                            </div>
                          </div>
                        </td>

                        {/* Completion date */}
                        <td className={styles.td}>
                          <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>
                            {fmtDate(row.date)}
                          </span>
                        </td>

                        {/* Added on (createdAt) */}
                        <td className={styles.td}>
                          <span style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>
                            {fmtDate(row.createdAt)}
                          </span>
                        </td>

                        {/* Status toggle */}
                        <td className={styles.td}>
                          <button
                            className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                            onClick={() => toggleStatus(row._id, row.status)}
                            title="Click to toggle"
                          >
                            {row.status === "Active" ? "🟢 Live" : "🔴 Off"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className={styles.td}>
                          <div className={styles.actionBtns}>
                            <Link
                              href={`/admin/testimonial/text-testimonial/${row._id}`}
                              className={styles.editBtn}
                            >
                              ✎ Edit
                            </Link>
                            <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => handleDelete(row._id, row.name)}
                              disabled={deleting === row._id}
                            >
                              {deleting === row._id
                                ? <span className={styles.spinner} />
                                : "🗑"
                              }
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <p className={styles.tableCount}>
            {filtered.length} review{filtered.length !== 1 ? "s" : ""} total
            {(search || filterCourse) && ` · filtered from ${rows.length}`}
          </p>
        </div>
      )}
    </div>
  );
}