"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/our-teachers/Teacher.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  role: string;
  years: string;
  order: string;
  bioItems: string[];
  educationItems: string[];
  expertiseItems: string[];
}

interface FormErrors {
  name?: string;
  role?: string;
  years?: string;
  image?: string;
  bioItems?: string;
  educationItems?: string;
  expertiseItems?: string;
}

export default function AddFacultyTeacherPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "", role: "", years: "", order: "",
    bioItems: [""], educationItems: [""], expertiseItems: [""],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  /* ── Helpers ── */
  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const updateList = (
    key: "bioItems" | "educationItems" | "expertiseItems",
    idx: number,
    val: string
  ) => {
    setForm((p) => { const a = [...p[key]]; a[idx] = val; return { ...p, [key]: a }; });
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const addList = (key: "bioItems" | "educationItems" | "expertiseItems", max: number) =>
    setForm((p) => p[key].length >= max ? p : { ...p, [key]: [...p[key], ""] });

  const removeList = (key: "bioItems" | "educationItems" | "expertiseItems", idx: number) =>
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));

  /* ── Image ── */
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Only image files allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImageFile(file);
    setErrors((p) => ({ ...p, image: undefined }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files?.[0]; if (f) handleImageFile(f);
  };

  const removeImage = () => {
    setImageFile(null); setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Validate ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Teacher name is required";
    if (!form.role.trim()) e.role = "Role / specialty is required";
    if (!form.years.trim()) e.years = "Experience is required";
    if (!imageFile) e.image = "A profile photo is required";
    if (form.bioItems.some((b) => !b.trim())) e.bioItems = "All biography paragraphs must be filled";
    if (form.educationItems.some((ed) => !ed.trim())) e.educationItems = "All education entries must be filled";
    if (form.expertiseItems.some((ex) => !ex.trim())) e.expertiseItems = "All expertise entries must be filled";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("role", form.role);
      fd.append("years", form.years);
      fd.append("isGuest", "false");
      if (form.order) fd.append("order", form.order);
      form.bioItems.filter(Boolean).forEach((b, i) => fd.append(`bio[${i}]`, b));
      form.educationItems.filter(Boolean).forEach((e, i) => fd.append(`education[${i}]`, e));
      form.expertiseItems.filter(Boolean).forEach((e, i) => fd.append(`expertise[${i}]`, e));
      if (imageFile) fd.append("image", imageFile);

      await api.post("/teachers/create-teacher", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/our-teachers/teachers"), 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Teacher Added!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbBtn} onClick={() => router.push("/admin/our-teachers/teachers")}>
          Teaching Faculty
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Faculty Teacher</span>
      </div>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add Faculty Teacher</h1>
          <p className={styles.pageSubtitle}>Full profile — bio, education &amp; expertise</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
        <div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ── Basic Info ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
          </div>

          {/* Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span> Teacher Name <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Full name with honorific — e.g. Yogacharya Deepak Ji</p>
            <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${form.name && !errors.name ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Yogacharya Deepak Ji"
                value={form.name} maxLength={100} onChange={(e) => set("name", e.target.value)} />
              <span className={styles.charCount}>{form.name.length}/100</span>
            </div>
            {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
          </div>

          {/* Role */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span> Role / Specialty <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Shown as the role tag — e.g. Hatha Yoga · Teaching Methodology</p>
            <div className={`${styles.inputWrap} ${errors.role ? styles.inputError : ""} ${form.role && !errors.role ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Hatha Yoga · Teaching Methodology"
                value={form.role} maxLength={120} onChange={(e) => set("role", e.target.value)} />
              <span className={styles.charCount}>{form.role.length}/120</span>
            </div>
            {errors.role && <p className={styles.errorMsg}>⚠ {errors.role}</p>}
          </div>

          {/* Years + Order */}
          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span> Experience Badge <span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>Overlay on photo — e.g. 12+ yrs</p>
              <div className={`${styles.inputWrap} ${errors.years ? styles.inputError : ""} ${form.years && !errors.years ? styles.inputSuccess : ""}`}>
                <input type="text" className={styles.input} placeholder="12+ yrs"
                  value={form.years} maxLength={20} onChange={(e) => set("years", e.target.value)} />
              </div>
              {errors.years && <p className={styles.errorMsg}>⚠ {errors.years}</p>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span> Display Order
              </label>
              <p className={styles.fieldHint}>Lower number = appears first</p>
              <div className={styles.inputWrap}>
                <input type="number" className={styles.input} placeholder="e.g. 1"
                  value={form.order} min={1} onChange={(e) => set("order", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── Photo ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Profile Photo <span className={styles.required}>*</span></h3>
          </div>
          <p className={styles.sectionDesc}>
            Shown as the sticky card image beside the bio. Portrait recommended (500×620px), max 5MB.
          </p>

          {errors.image && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.image}</p>}

          {!imagePreview ? (
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropIcon}>📷</div>
              <p className={styles.dropTitle}>Click to upload or drag &amp; drop</p>
              <p className={styles.dropSub}>JPG, PNG, WEBP · max 5MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInputHidden}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>
          ) : (
            <div className={styles.imagePreviewWrap}>
              <div className={styles.imagePreviewFrame}>
                <img src={imagePreview} alt="Preview" className={styles.imagePreviewImg} />
                <div className={styles.imagePreviewBadge}>
                  {imageFile ? `${imageFile.name} · ${(imageFile.size / 1024).toFixed(0)} KB` : "Photo"}
                </div>
              </div>
              <div className={styles.imagePreviewActions}>
                <button type="button" className={styles.changeImgBtn} onClick={() => fileInputRef.current?.click()}>
                  📷 Change Photo
                </button>
                <button type="button" className={styles.removeImgBtn} onClick={removeImage}>✕ Remove</button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInputHidden}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── Bio ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Biography Paragraphs</h3>
            <span className={styles.sectionBadge}>{form.bioItems.length}/8</span>
          </div>
          <p className={styles.sectionDesc}>Each entry = one paragraph in the teacher card (max 8)</p>

          {errors.bioItems && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.bioItems}</p>}

          {form.bioItems.map((para, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.listIndex}>{i + 1}</div>
              <div className={`${styles.inputWrap} ${styles.listInputWrap}`}>
                <textarea className={`${styles.input} ${styles.textarea}`}
                  placeholder={`Paragraph ${i + 1}…`} value={para} maxLength={600} rows={3}
                  onChange={(e) => updateList("bioItems", i, e.target.value)} />
                <span className={`${styles.charCount} ${styles.charCountBottom}`}>{para.length}/600</span>
              </div>
              <button type="button" className={styles.removeListBtn}
                onClick={() => removeList("bioItems", i)} disabled={form.bioItems.length <= 1}>✕</button>
            </div>
          ))}
          {form.bioItems.length < 8 && (
            <button type="button" className={styles.addListBtn} onClick={() => addList("bioItems", 8)}>
              + Add Paragraph
            </button>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── Education ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Education</h3>
            <span className={styles.sectionBadge}>{form.educationItems.length}/8</span>
          </div>
          <p className={styles.sectionDesc}>Each entry = bullet under 🎓 Education in the profile (max 8)</p>

          {errors.educationItems && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.educationItems}</p>}

          {form.educationItems.map((edu, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.listIndex}>{i + 1}</div>
              <div className={`${styles.inputWrap} ${styles.listInputWrap}`}>
                <input type="text" className={styles.input}
                  placeholder="e.g. Master's Degree in Yoga – 2021"
                  value={edu} maxLength={150}
                  onChange={(e) => updateList("educationItems", i, e.target.value)} />
                <span className={styles.charCount}>{edu.length}/150</span>
              </div>
              <button type="button" className={styles.removeListBtn}
                onClick={() => removeList("educationItems", i)} disabled={form.educationItems.length <= 1}>✕</button>
            </div>
          ))}
          {form.educationItems.length < 8 && (
            <button type="button" className={styles.addListBtn} onClick={() => addList("educationItems", 8)}>
              + Add Education
            </button>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── Expertise ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Areas of Expertise</h3>
            <span className={styles.sectionBadge}>{form.expertiseItems.length}/12</span>
          </div>
          <p className={styles.sectionDesc}>Each entry = chip/tag under ✦ Expertise (max 12)</p>

          {errors.expertiseItems && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.expertiseItems}</p>}

          <div className={styles.chipInputGrid}>
            {form.expertiseItems.map((exp, i) => (
              <div key={i} className={styles.chipInputRow}>
                <div className={`${styles.inputWrap} ${styles.chipInputWrap}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Hatha Yoga"
                    value={exp} maxLength={40}
                    onChange={(e) => updateList("expertiseItems", i, e.target.value)} />
                </div>
                <button type="button" className={styles.removeListBtn}
                  onClick={() => removeList("expertiseItems", i)} disabled={form.expertiseItems.length <= 1}>✕</button>
              </div>
            ))}
          </div>
          {form.expertiseItems.length < 12 && (
            <button type="button" className={styles.addListBtn} onClick={() => addList("expertiseItems", 12)}>
              + Add Expertise
            </button>
          )}
          {form.expertiseItems.some((e) => e.trim()) && (
            <div className={styles.chipPreview}>
              <p className={styles.chipPreviewLabel}>Preview:</p>
              <div className={styles.chipPreviewRow}>
                {form.expertiseItems.filter((e) => e.trim()).map((e, i) => (
                  <span key={i} className={styles.previewChip}>{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/our-teachers/teachers" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Add Teacher</>}
          </button>
        </div>

      </div>
    </div>
  );
}