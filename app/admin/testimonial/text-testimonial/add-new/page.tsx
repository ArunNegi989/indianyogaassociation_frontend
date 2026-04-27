"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { COURSE_OPTIONS } from "@/lib/courseOptions";

interface FormValues {
  courseType: string;
  name: string;
  country: string;
  rating: number;
  review: string;
  courseBadge: string;
  date: string;
  status: "Active" | "Inactive";
}

function StarSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 28, color: s <= value ? "#e07b00" : "#e0e0e0",
          transition: "color .15s, transform .1s", padding: 2,
          transform: s <= value ? "scale(1.1)" : "scale(1)",
        }}>★</button>
      ))}
      <span style={{
        fontSize: 12, color: "#888", marginLeft: 6,
        background: "#fdf0e0", padding: "2px 8px",
        borderRadius: 10, fontWeight: 600,
      }}>{value}/5</span>
    </div>
  );
}

function Sec({ title, badge, children }: {
  title: string; badge?: string; children: React.ReactNode;
}) {
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

function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

/* ══════════════════════════════════════════
   IMAGE FIELD — styled upload + URL paste
══════════════════════════════════════════ */
function ImageField({
  label, hint, value, onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (value && !value.startsWith("blob:")) {
      setLocalPreview("");
    }
  }, [value]);

  const processFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB allowed");
      return;
    }

    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setLocalPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/upload", fd);
      const url = res.data?.url;
      if (url) {
        onChange(url);
        setLocalPreview("");
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload succeeded but no URL returned");
        setLocalPreview("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setLocalPreview("");
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await processFile(file);
    }
  };

  const displaySrc = localPreview
    ? localPreview
    : value?.startsWith("http")
      ? value
      : value
        ? `${process.env.NEXT_PUBLIC_API_URL}${value}`
        : "";

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap", marginTop: 8 }}>

        {/* ── Left: Upload zone + URL input ── */}
        <div style={{ flex: 1, minWidth: 240 }}>

          {/* Drag & drop zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "20px 16px",
              borderRadius: 12,
              border: `2px dashed ${dragOver ? "#c9913d" : uploading ? "#e8c98a" : "#d4b896"}`,
              background: dragOver
                ? "#fdf0e0"
                : uploading
                  ? "#fdf6ec"
                  : "#fffcf8",
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "all .2s",
              marginBottom: 12,
            }}
          >
            {/* Icon */}
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: uploading ? "#f5e8d0" : "#fdf0e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, border: "1.5px solid #e8d5b5",
              transition: "all .2s",
            }}>
              {uploading ? (
                <span className={styles.spinner} style={{ width: 20, height: 20 }} />
              ) : "📷"}
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#7a4f10", margin: 0 }}>
                {uploading ? "Uploading…" : "Click to upload or drag & drop"}
              </p>
              <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>
                PNG, JPG, WEBP, GIF · Max 5MB
              </p>
            </div>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              style={{ display: "none" }}
              onChange={handleFile}
              disabled={uploading}
            />
          </label>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            marginBottom: 10, color: "#bbb", fontSize: 11,
          }}>
            <div style={{ flex: 1, height: 1, background: "#e8d5b5" }} />
            <span style={{ fontWeight: 500 }}>or paste image URL</span>
            <div style={{ flex: 1, height: 1, background: "#e8d5b5" }} />
          </div>

          {/* URL input */}
          <div className={styles.inputWrap}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={localPreview ? "" : value?.startsWith("http") ? value : ""}
              placeholder="https://example.com/photo.jpg"
              onChange={e => {
                setLocalPreview("");
                onChange(e.target.value);
              }}
            />
          </div>
        </div>

        {/* ── Right: Avatar preview ── */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            border: displaySrc ? "3px solid #c9913d" : "2.5px dashed #ddd",
            overflow: "hidden", background: "#f5ece0",
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: displaySrc ? "0 4px 16px rgba(201,145,61,0.2)" : "none",
            transition: "all .3s",
          }}>
            {displaySrc ? (
              <>
                <img
                  src={displaySrc}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => { setLocalPreview(""); onChange(""); }}
                  style={{
                    position: "absolute", top: 4, right: 4,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(0,0,0,0.6)", color: "#fff",
                    border: "none", cursor: "pointer",
                    fontSize: 10, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    lineHeight: 1, fontWeight: 700,
                  }}
                  title="Remove image"
                >✕</button>
              </>
            ) : (
              <span style={{ fontSize: 28, opacity: 0.3 }}>👤</span>
            )}
          </div>

          <p style={{
            fontSize: 10, color: displaySrc ? "#c9913d" : "#bbb",
            textAlign: "center", fontWeight: displaySrc ? 600 : 400,
            margin: 0,
          }}>
            {localPreview ? "⏳ Uploading…" : displaySrc ? "✓ Photo set" : "No photo"}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function TextReviewAddEdit() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params?.id as string;
  const isEdit = !!reviewId && reviewId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [rating, setRating] = useState(5);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      courseType: "", name: "", country: "", rating: 5,
      review: "", courseBadge: "", date: "", status: "Active",
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    setLoadingData(true);
    api.get(`/student-reviews/get/${reviewId}`)
      .then(res => {
        const d = res.data?.data;
        if (!d) return;
        setValue("courseType", d.courseType || "");
        setValue("name", d.name || "");
        setValue("country", d.country || "");
        setValue("review", d.review || "");
        setValue("courseBadge", d.courseBadge || "");
        // Date fix: ISO → YYYY-MM-DD for input[type=date]
        if (d.date) {
          const dateStr = new Date(d.date).toISOString().split("T")[0];
          setValue("date", dateStr);
        }
        setValue("status", d.status || "Active");
        setRating(d.rating || 5);
        setImageUrl(d.image || "");
      })
      .catch(() => {
        toast.error("Failed to load review");
        router.push("/admin/testimonial/text-testimonial");
      })
      .finally(() => setLoadingData(false));
  }, [isEdit, reviewId]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const payload = { ...data, rating, image: imageUrl };
      if (isEdit) {
        await api.put(`/student-reviews/update/${reviewId}`, payload);
        toast.success("Review updated!");
      } else {
        await api.post("/student-reviews/create", payload);
        toast.success("Review added!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/testimonial/text-testimonial"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return (
    <div className={styles.loadingWrap}>
      <span className={styles.spinner} /><span>Loading…</span>
    </div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Review {isEdit ? "Updated" : "Added"}!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/testimonial/text-testimonial")}
        >
          Text Reviews
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Review" : "Add Review"}
        </span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit" : "Add"} Text Review
          </h1>
          <p className={styles.pageSubtitle}>Single student testimonial</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. COURSE & STATUS ══ */}
        <Sec title="Course & Status" badge="Required">
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Course Type <span className={styles.required}>*</span>
              </label>
              <div className={`${styles.selectWrap} ${errors.courseType ? styles.inputError : ""}`}>
                <select
                  className={styles.select}
                  {...register("courseType", { required: "Select a course" })}
                >
                  <option value="">— Select Course —</option>
                  {COURSE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
              {errors.courseType && (
                <p className={styles.errorMsg}>⚠ {errors.courseType.message}</p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Status
              </label>
              <div className={styles.selectWrap}>
                <select className={styles.select} {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 2. REVIEWER INFO ══ */}
        <Sec title="Reviewer Info">

          {/* Row 1 — Name + Country */}
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Full Name <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Sarah Mitchell"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className={styles.errorMsg}>⚠ {errors.name.message}</p>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Country
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="United States"
                  {...register("country")}
                />
              </div>
            </div>
          </div>

          {/* Row 2 — Course Badge + Date */}
          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Course Badge
              </label>
              <p className={styles.fieldHint}>
                Short label shown on review card (e.g. "200 Hr YTTC")
              </p>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="200 Hr YTTC"
                  {...register("courseBadge")}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>
                Training Completion Date <span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Date when student completed the course</p>
              <div className={styles.inputWrap}>
                <input
                  type="date"
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("date", { required: "Date is required" })}
                />
              </div>
              {errors.date && (
                <p className={styles.errorMsg}>⚠ {errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <ImageField
            label="Profile Photo"
            hint="Upload a photo or paste URL — shown as circular avatar on review card"
            value={imageUrl}
            onChange={setImageUrl}
          />

        </Sec>
        <D />

        {/* ══ 3. REVIEW CONTENT ══ */}
        <Sec title="Review Content">

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Star Rating
            </label>
            <StarSelect value={rating} onChange={setRating} />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Review Text <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrap}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={5}
                placeholder="This training completely transformed my understanding of yoga…"
                {...register("review", { required: "Review text is required" })}
              />
            </div>
            {errors.review && (
              <p className={styles.errorMsg}>⚠ {errors.review.message}</p>
            )}
          </div>

        </Sec>

      </div>

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/testimonial/text-testimonial" className={styles.cancelBtn}>
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
            : <><span>✦</span> {isEdit ? "Update" : "Save"} Review</>
          }
        </button>
      </div>

    </div>
  );
}