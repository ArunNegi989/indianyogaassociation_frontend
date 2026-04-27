"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { COURSE_OPTIONS } from "@/lib/courseOptions";

/* ══════════════════════════════════════
   TYPES  — same fields as original
══════════════════════════════════════ */
interface FormValues {
  courseType: string;
  name: string;
  country: string;
  label: string;
  status: "Active" | "Inactive";
}

/* ══════════════════════════════════════
   UI HELPERS
══════════════════════════════════════ */
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

function Sec({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {badge && <span className={styles.sectionBadge}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function F({ label, hint, req, children }: {
  label: string; hint?: string; req?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

/* ── Star selector (hover effect added) ── */
function StarSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 28, lineHeight: 1, padding: "2px 1px",
            color: s <= (hovered || value) ? "#e07b00" : "#e0d0b0",
            transition: "color .12s, transform .1s",
            transform: s <= (hovered || value) ? "scale(1.18)" : "scale(1)",
          }}
        >★</button>
      ))}
      <span style={{
        marginLeft: 8, fontSize: 12, color: "#a07040", fontWeight: 500,
        background: "#fdf6ec", padding: "2px 10px", borderRadius: 12,
        border: "1px solid #e8d5b5",
      }}>
        {value} / 5
      </span>
    </div>
  );
}

/* ── Image field: upload + URL + live preview ── */
function ImageField({
  label, hint, value, onChange, circular = false, badge,
}: {
  label: string; hint?: string; value: string;
  onChange: (url: string) => void; circular?: boolean; badge?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"upload" | "url">("upload");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    try {
      setUploading(true);
      const fd = new FormData(); fd.append("file", file);
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.url || res.data?.data?.url;
      if (url) { onChange(url); toast.success("Uploaded!"); }
      else toast.error("No URL returned");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  return (
    <F label={label} hint={hint}>
      {/* Tab toggle */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 10, borderRadius: 8,
        overflow: "hidden", border: "1.5px solid #e8d5b5", width: "fit-content",
      }}>
        {(["upload", "url"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            padding: "5px 16px", fontSize: 12, border: "none", cursor: "pointer", fontWeight: 500,
            background: tab === t ? "#c9913d" : "#fdf6ec",
            color: tab === t ? "#fff" : "#8a5f20",
            transition: "all .15s",
          }}>
            {t === "upload" ? "⬆ Upload" : "🔗 URL"}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px",
          borderRadius: 8, border: "1.5px dashed #d4a96a", background: "#fdf8f0",
          color: "#8a5f20", fontSize: 13, cursor: "pointer", fontWeight: 500, width: "fit-content",
        }}>
          {uploading
            ? <><span className={styles.spinner} style={{ width: 14, height: 14 }} /> Uploading…</>
            : <><span style={{ fontSize: 16 }}>📁</span> Choose Image File</>}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} disabled={uploading} />
        </label>
      ) : (
        <div className={styles.inputWrap}>
          <input
            className={`${styles.input} ${styles.inputNoCount}`}
            value={value}
            placeholder="https://images.unsplash.com/photo-xxx"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {/* Live preview */}
      {value && (
        <div style={{
          marginTop: 12, position: "relative", display: "inline-block",
          borderRadius: circular ? "50%" : 10,
          border: "2.5px solid #d4a96a",
          boxShadow: "0 4px 16px rgba(180,120,40,.15)",
          overflow: "hidden",
        }}>
          {badge && !circular && (
            <span style={{
              position: "absolute", top: 8, left: 8, fontSize: 10, fontWeight: 700,
              background: "#f15505", color: "#fff", padding: "2px 8px", borderRadius: 12,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>{badge}</span>
          )}
          <img
            src={value} alt=""
            style={{
              width: circular ? 64 : 200, height: circular ? 64 : 120,
              objectFit: "cover", display: "block",
            }}
            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{
              position: "absolute", top: 4, right: 4, width: 20, height: 20,
              borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "none",
              color: "#fff", fontSize: 11, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
      )}
    </F>
  );
}

/* ── Video field: paste link OR upload MP4 ── */
function VideoField({
  urlValue, fileValue, onUrlChange, onFileChange,
}: {
  urlValue: string; fileValue: string;
  onUrlChange: (v: string) => void; onFileChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"url" | "file">(fileValue ? "file" : "url");

  const detect = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/shorts") || url.includes("youtu.be/shorts"))
      return { label: "YouTube Shorts", emoji: "▶", bg: "#fcebeb", color: "#a32d2d" };
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return { label: "YouTube", emoji: "▶", bg: "#fcebeb", color: "#a32d2d" };
    if (url.includes("instagram.com"))
      return { label: "Instagram Reel", emoji: "📸", bg: "#fbeaf0", color: "#993556" };
    if (url.endsWith(".mp4") || url.includes(".mp4?"))
      return { label: "MP4 File", emoji: "🎬", bg: "#eaf3de", color: "#3b6d11" };
    return { label: "Video Link", emoji: "🔗", bg: "#e6f1fb", color: "#185fa5" };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 200 * 1024 * 1024) { toast.error("Max 200MB for video"); return; }
    try {
      setUploading(true);
      const fd = new FormData(); fd.append("file", file);
      const res = await api.post("/upload/video", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.url || res.data?.data?.url;
      if (url) { onFileChange(url); toast.success("Video uploaded!"); }
      else toast.error("No URL returned");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); }
  };

  const det = detect(urlValue);

  return (
    <F label="Video" req hint="Paste a YouTube / Shorts / Instagram Reel link — or upload an MP4">
      {/* Mode toggle */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 12, borderRadius: 8,
        overflow: "hidden", border: "1.5px solid #e8d5b5", width: "fit-content",
      }}>
        {(["url", "file"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} style={{
            padding: "6px 18px", fontSize: 12, border: "none", cursor: "pointer", fontWeight: 600,
            background: mode === m ? "#c9913d" : "#fdf6ec",
            color: mode === m ? "#fff" : "#8a5f20",
            transition: "all .15s",
          }}>
            {m === "url" ? "🔗 Paste Link" : "⬆ Upload MP4"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <>
          <div className={styles.inputWrap} style={{ marginBottom: 8 }}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={urlValue}
              placeholder="https://youtube.com/shorts/xxxxx  or  https://www.instagram.com/reel/xxxxx"
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>
          {det && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12,
              padding: "4px 12px", borderRadius: 12, background: det.bg, color: det.color, fontWeight: 600,
            }}>
              <span>{det.emoji}</span> Detected: {det.label}
            </span>
          )}
        </>
      ) : (
        <>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 8, border: "1.5px dashed #d4a96a", background: "#fdf8f0",
            color: "#8a5f20", fontSize: 13, cursor: "pointer", fontWeight: 500,
          }}>
            {uploading
              ? <><span className={styles.spinner} style={{ width: 14, height: 14 }} /> Uploading…</>
              : <><span style={{ fontSize: 16 }}>🎬</span> Choose MP4 File</>}
            <input type="file" accept="video/mp4,video/*" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
          </label>
          {fileValue && (
            <div style={{ marginTop: 12 }}>
              <span style={{ fontSize: 12, background: "#eaf3de", color: "#3b6d11", padding: "3px 10px", borderRadius: 10, fontWeight: 500 }}>
                ✓ Video uploaded
              </span>
              <video
                src={fileValue} controls
                style={{ display: "block", marginTop: 10, maxWidth: 300, borderRadius: 10, border: "2px solid #e8d5b5" }}
              />
            </div>
          )}
        </>
      )}
    </F>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function VideoReviewAddEdit() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params?.id as string;
  const isEdit = !!reviewId && reviewId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /* Same state fields as original */
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [rating, setRating] = useState(5);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      courseType: "", name: "", country: "",
      label: "Watch Review", status: "Active",
    },
  });

  /* ── Load for edit ── */
  useEffect(() => {
    if (!isEdit) return;
    setLoadingData(true);
    api.get(`/video-reviews/get/${reviewId}`)
      .then((res) => {
        const d = res.data?.data; if (!d) return;
        setValue("courseType", d.courseType || "");
        setValue("name", d.name || "");
        setValue("country", d.country || "");
        setValue("label", d.label || "Watch Review");
        setValue("status", d.status || "Active");
        setRating(d.rating || 5);
        setThumbnailUrl(d.thumbnail || "");
        setVideoUrl(d.videoUrl || "");
        setVideoFile(d.videoFile || "");
      })
      .catch(() => {
        toast.error("Failed to load");
        router.push("/admin/testimonial/video-testimonial");
      })
      .finally(() => setLoadingData(false));
  }, [isEdit, reviewId]);

  /* ── Submit ── */
  const onSubmit = async (data: FormValues) => {
    if (!videoUrl && !videoFile) {
      toast.error("Please add a video link or upload an MP4");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = { ...data, rating, thumbnail: thumbnailUrl, videoUrl, videoFile };
      if (isEdit) {
        await api.put(`/video-reviews/update/${reviewId}`, payload);
        toast.success("Video review updated!");
      } else {
        await api.post("/video-reviews/create", payload);
        toast.success("Video review added!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/testimonial/video-testimonial"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── States ── */
  if (loadingData) return (
    <div className={styles.loadingWrap}><span className={styles.spinner} /><span>Loading…</span></div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Video {isEdit ? "Updated" : "Added"}!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/testimonial/video-testimonial")}>
          Video Reviews
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Video Review" : "Add Video Review"}</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit" : "Add"} Video Testimonial</h1>
          <p className={styles.pageSubtitle}>YouTube · Shorts · Instagram Reel · MP4 Upload</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
        <div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. COURSE & STATUS ══ */}
        <Sec title="Course & Status" badge="Required">
          <div className={styles.grid2}>
            <F label="Course Type" req hint="This review will appear on the selected course page">
              <div className={`${styles.selectWrap} ${errors.courseType ? styles.inputError : ""}`}>
                <select className={styles.select} {...register("courseType", { required: "Please select a course" })}>
                  <option value="">— Select Course —</option>
                  {COURSE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
              {errors.courseType && <p className={styles.errorMsg}>⚠ {errors.courseType.message}</p>}
            </F>

            <F label="Status">
              <div className={styles.selectWrap}>
                <select className={styles.select} {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 2. REVIEWER INFO ══ */}
        <Sec title="Reviewer Info">
          <div className={styles.grid2}>
            <F label="Name" req>
              <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""}`}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Jessica Williams"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && <p className={styles.errorMsg}>⚠ {errors.name.message}</p>}
            </F>

            <F label="Country">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="USA"
                  {...register("country")}
                />
              </div>
            </F>

            <F label="Button Label" hint='Text shown on play button e.g. "Watch Review"'>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Watch Review"
                  {...register("label")}
                />
              </div>
            </F>
          </div>

          <F label="Rating">
            <StarSelect value={rating} onChange={setRating} />
          </F>
        </Sec>
        <D />

        {/* ══ 3. VIDEO ══ */}
        <Sec title="Video" badge="Required">
          <VideoField
            urlValue={videoUrl}
            fileValue={videoFile}
            onUrlChange={setVideoUrl}
            onFileChange={setVideoFile}
          />
        </Sec>
        <D />

        {/* ══ 4. THUMBNAIL ══ */}
        <Sec title="Thumbnail" badge="Optional">
          <ImageField
            label="Thumbnail Image"
            hint="Shown as poster before video plays — 600×800px recommended. If empty, platform thumbnail is used."
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            badge="Thumbnail"
          />
        </Sec>

      </div>

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/testimonial/video-testimonial" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? <><span className={styles.spinner} /> Saving…</>
            : <><span>✦</span> {isEdit ? "Update" : "Save"} Video Review</>}
        </button>
      </div>
    </div>
  );
}