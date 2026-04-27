"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import toast from "react-hot-toast";
import { COURSE_OPTIONS } from "@/lib/courseOptions";

/* ── BASE URL for resolving relative image paths ── */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

function resolveUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

/* ══════════════════════════════════════
   TYPES — only original form fields
══════════════════════════════════════ */
interface VideoReview {
  _id: string;
  courseType: string;
  name: string;
  country: string;
  thumbnail: string;
  videoUrl: string;
  videoFile: string;
  label: string;
  rating: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

/* ══════════════════════════════════════
   VIDEO SOURCE BADGE
══════════════════════════════════════ */
function VideoSourceBadge({ row }: { row: VideoReview }) {
  let cfg = { label: "—", emoji: "", bg: "#f5f5f5", color: "#999" };
  if (row.videoUrl) {
    if (row.videoUrl.includes("shorts"))
      cfg = { label: "YT Short", emoji: "▶", bg: "#fcebeb", color: "#a32d2d" };
    else if (row.videoUrl.includes("youtube") || row.videoUrl.includes("youtu.be"))
      cfg = { label: "YouTube", emoji: "▶", bg: "#fcebeb", color: "#a32d2d" };
    else if (row.videoUrl.includes("instagram"))
      cfg = { label: "Instagram", emoji: "📸", bg: "#fbeaf0", color: "#993556" };
    else
      cfg = { label: "Link", emoji: "🔗", bg: "#e6f1fb", color: "#185fa5" };
  } else if (row.videoFile) {
    cfg = { label: "Uploaded", emoji: "🎬", bg: "#eaf3de", color: "#3b6d11" };
  }
  if (!row.videoUrl && !row.videoFile)
    return <span style={{ fontSize: 12, color: "#bbb" }}>No video</span>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11,
      padding: "3px 9px", borderRadius: 12, background: cfg.bg, color: cfg.color,
      fontWeight: 600, whiteSpace: "nowrap",
    }}>
      <span>{cfg.emoji}</span>{cfg.label}
    </span>
  );
}

/* ══════════════════════════════════════
   STAR DISPLAY
══════════════════════════════════════ */
function Stars({ count }: { count: number }) {
  const n = Math.max(0, Math.min(5, count || 5));
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ fontSize: 13, color: i < n ? "#e07b00" : "#e0d0b0", lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   THUMBNAIL CELL — resolves relative path
══════════════════════════════════════ */
function ThumbCell({ row }: { row: VideoReview }) {
  const [err, setErr] = useState(false);
  const src = resolveUrl(row.thumbnail);

  return (
    <div style={{
      position: "relative", width: 72, height: 46, borderRadius: 8,
      overflow: "hidden", background: "#f0e8d8", border: "1.5px solid #e8d5b5",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {src && !err ? (
        <>
          <img
            src={src}
            alt={row.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={() => setErr(true)}
          />
          {/* Play overlay */}
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "rgba(241,85,5,.92)", display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,.3)",
            }}>
              <span style={{ color: "#fff", fontSize: 9, marginLeft: 2 }}>▶</span>
            </div>
          </div>
        </>
      ) : (
        <span style={{ fontSize: 22, opacity: 0.3 }}>▶</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   AVATAR CELL — initials fallback
══════════════════════════════════════ */
function AvatarCell({ row }: { row: VideoReview }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#f0e0c0,#e8c890)",
      display: "flex", alignItems: "center", justifyContent: "center",
      border: "2px solid #e8d5b5", fontSize: 13, fontWeight: 700, color: "#c9913d",
    }}>
      {row.name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN LIST PAGE
══════════════════════════════════════ */
export default function VideoReviewsList() {
  const [rows, setRows] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const fetchList = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/video-reviews/get");
      setRows(res.data?.data || []);
    } catch {
      setError("Failed to load video reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete video review by "${name}"?\nThis cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/video-reviews/delete/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted");
    } catch { toast.error("Delete failed."); }
    finally { setDeleting(null); }
  };

  const toggleStatus = async (id: string, current: "Active" | "Inactive") => {
    const next = current === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/video-reviews/update/${id}`, { status: next });
      setRows((prev) => prev.map((r) => r._id === id ? { ...r, status: next } : r));
      toast.success(`Status → ${next}`);
    } catch { toast.error("Status update failed."); }
  };

  /* Filter */
  const filtered = rows.filter((r) => {
    const ms = !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.country?.toLowerCase().includes(search.toLowerCase());
    const mc = !filterCourse || r.courseType === filterCourse;
    return ms && mc;
  });

  /* Group by course — only show groups that have reviews */
  const groups = COURSE_OPTIONS
    .map((opt) => ({ ...opt, reviews: filtered.filter((r) => r.courseType === opt.value) }))
    .filter((g) => g.reviews.length > 0);

  const activeCount = rows.filter((r) => r.status === "Active").length;

  return (
    <div className={styles.listPage}>

      {/* ── Header ── */}
      <div className={styles.listHeader}>
        <div>
          <h1 className={styles.listTitle}>Video Testimonials</h1>
          <p className={styles.listSubtitle}>
            {rows.length} video{rows.length !== 1 ? "s" : ""} total
            {activeCount > 0 && <> · <span style={{ color: "#3b6d11" }}>{activeCount} live</span></>}
            {" · "}grouped by course
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/admin/testimonial/text" className={styles.cancelBtn} style={{ fontSize: 13 }}>
            ★ Text Reviews
          </Link>
          <Link href="/admin/testimonial/video-testimonial/add-new" className={styles.addNewBtn}>
            ＋ Add Video
          </Link>
        </div>
      </div>

      <div className={styles.ornament} style={{ margin: "0.5rem 0 1rem" }}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
        <div className={styles.ornamentLine} /><span>❧</span>
      </div>

      {/* ── Summary cards ── */}
      {rows.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Total Videos", value: rows.length, emoji: "🎬", color: "#8a5f20", bg: "#fdf6ec" },
            { label: "Live / Active", value: activeCount, emoji: "🟢", color: "#3b6d11", bg: "#eaf3de" },
            { label: "Courses Covered", value: groups.length, emoji: "📚", color: "#185fa5", bg: "#e6f1fb" },
          ].map((s) => (
            <div key={s.label} style={{
              padding: "12px 20px", borderRadius: 10, background: s.bg,
              border: `1.5px solid ${s.color}22`, minWidth: 120,
            }}>
              <div style={{ fontSize: 20 }}>{s.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: s.color, opacity: 0.75, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.4rem", flexWrap: "wrap", alignItems: "center" }}>
        <div className={styles.inputWrap} style={{ maxWidth: 220, margin: 0 }}>
          <input
            className={`${styles.input} ${styles.inputNoCount}`}
            style={{ fontSize: 13 }}
            placeholder="🔍 Search name, country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.selectWrap} style={{ maxWidth: 260 }}>
          <select
            className={styles.select}
            style={{ fontSize: 13 }}
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {COURSE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className={styles.selectArrow}>▾</span>
        </div>
        {(search || filterCourse) && (
          <button
            type="button"
            onClick={() => { setSearch(""); setFilterCourse(""); }}
            style={{
              fontSize: 12, color: "#f15505", background: "none",
              border: "1px solid #f15505", borderRadius: 8, padding: "5px 12px", cursor: "pointer",
            }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠ {error}&nbsp;
          <button onClick={fetchList} style={{ textDecoration: "underline", cursor: "pointer" }}>Retry</button>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div className={styles.loadingWrap}><span className={styles.spinner} /><span>Loading videos…</span></div>
      ) : groups.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyOm} style={{ fontSize: 40 }}>🎬</div>
          <h3 className={styles.emptyTitle}>{rows.length === 0 ? "No video reviews yet" : "No results found"}</h3>
          <p className={styles.emptyText}>
            {rows.length === 0
              ? "Add your first video testimonial to get started."
              : "Try changing your search filters."}
          </p>
          {rows.length === 0 && (
            <Link href="/admin/testimonial/video-testimonial/add-new" className={styles.addNewBtn}>
              ＋ Add First Video
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {groups.map((group) => {
            const isOpen = expandedGroup === null || expandedGroup === group.value;
            const activeInGroup = group.reviews.filter((r) => r.status === "Active").length;
            return (
              <div key={group.value} style={{
                borderRadius: 12, border: "1.5px solid #e8d5b5",
                overflow: "hidden", background: "#fff",
              }}>

                {/* Group header — click to collapse/expand */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedGroup(
                      isOpen && expandedGroup === group.value ? null : group.value
                    )
                  }
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "0.75rem 1.2rem",
                    background: "linear-gradient(90deg,#fdf6ec,#fff8f0)",
                    border: "none", cursor: "pointer", textAlign: "left",
                    borderBottom: isOpen ? "1px solid #e8d5b5" : "none",
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 8, background: "#c9913d",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
                  }}>
                    {group.reviews.length}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#5a3800" }}>{group.label}</div>
                    <div style={{ fontSize: 11, color: "#a07040", marginTop: 1 }}>
                      {activeInGroup} active · {group.reviews.length - activeInGroup} inactive
                    </div>
                  </div>
                  <span style={{
                    fontSize: 16, color: "#c9913d",
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform .2s",
                  }}>▾</span>
                </button>

                {/* Table */}
                {isOpen && (
                  <div style={{ overflowX: "auto" }}>
                    <table className={styles.table} style={{ minWidth: 680 }}>
                      <thead>
                        <tr>
                          <th className={styles.th} style={{ width: 32 }}>#</th>
                          <th className={styles.th} style={{ width: 82 }}>Thumbnail</th>
                          <th className={styles.th}>Reviewer</th>
                          <th className={styles.th} style={{ width: 90 }}>Source</th>
                          <th className={styles.th} style={{ width: 90 }}>Rating</th>
                          <th className={styles.th} style={{ width: 80 }}>Added</th>
                          <th className={styles.th} style={{ width: 90 }}>Status</th>
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

                            {/* Thumbnail */}
                            <td className={styles.td}>
                              <ThumbCell row={row} />
                            </td>

                            {/* Reviewer */}
                            <td className={styles.td}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <AvatarCell row={row} />
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: 13, color: "#2c1a08" }}>
                                    {row.name || "—"}
                                  </div>
                                  {row.country && (
                                    <div className={styles.cellSub} style={{ fontSize: 11 }}>
                                      📍 {row.country}
                                    </div>
                                  )}
                                  {row.label && row.label !== "Watch Review" && (
                                    <div style={{ fontSize: 11, color: "#c9913d", marginTop: 2 }}>
                                      🏷 {row.label}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Video source */}
                            <td className={styles.td}>
                              <VideoSourceBadge row={row} />
                            </td>

                            {/* Rating */}
                            <td className={styles.td}>
                              <Stars count={row.rating} />
                            </td>

                            {/* Date */}
                            <td className={styles.td}>
                              <span style={{ fontSize: 11, color: "#7a5c30" }}>
                                {row.createdAt
                                  ? new Date(row.createdAt).toLocaleDateString("en-IN", {
                                      day: "2-digit", month: "short", year: "numeric",
                                    })
                                  : "—"}
                              </span>
                            </td>

                            {/* Status toggle */}
                            <td className={styles.td}>
                              <button
                                className={`${styles.statusBadge} ${row.status === "Active" ? styles.statusActive : styles.statusInactive}`}
                                onClick={() => toggleStatus(row._id, row.status)}
                                style={{ whiteSpace: "nowrap", fontSize: 11 }}
                              >
                                {row.status === "Active" ? "🟢 Live" : "🔴 Off"}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className={styles.td}>
                              <div className={styles.actionBtns}>
                                <Link
                                  href={`/admin/testimonial/video-testimonial/${row._id}`}
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
                                    : "🗑"}
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          <p className={styles.tableCount}>
            {filtered.length} video{filtered.length !== 1 ? "s" : ""} · {groups.length} course{groups.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}