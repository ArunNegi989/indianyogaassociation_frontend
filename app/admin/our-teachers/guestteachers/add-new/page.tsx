"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/our-teachers/Teacher.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  order: string;
  bioItems: string[];
}

interface FormErrors {
  name?: string;
  image?: string;
  bioItems?: string;
}

export default function AddGuestTeacherPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "", order: "", bioItems: [""],
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

  const updateBio = (idx: number, val: string) => {
    setForm((p) => { const a = [...p.bioItems]; a[idx] = val; return { ...p, bioItems: a }; });
    setErrors((p) => ({ ...p, bioItems: undefined }));
  };

  const addBio = () =>
    setForm((p) => p.bioItems.length >= 8 ? p : { ...p, bioItems: [...p.bioItems, ""] });

  const removeBio = (idx: number) =>
    setForm((p) => ({ ...p, bioItems: p.bioItems.filter((_, i) => i !== idx) }));

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
    if (!imageFile) e.image = "A profile photo is required";
    if (form.bioItems.some((b) => !b.trim())) e.bioItems = "All biography paragraphs must be filled";
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

    if (form.order) fd.append("order", form.order);

    form.bioItems
      .filter(Boolean)
      .forEach((b, i) => fd.append(`bio[${i}]`, b));

    if (imageFile) fd.append("image", imageFile);

    await api.post("/guest-teachers/create-guest-teacher", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setSubmitted(true);
    setTimeout(() => router.push("/admin/our-teachers/guestteachers"), 1500);

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
        <h2 className={styles.successTitle}>Guest Teacher Added!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbBtn} onClick={() => router.push("/admin/our-teachers/guestteachers")}>
          Guest Teachers
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Guest Teacher</span>
      </div>

      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add Guest Teacher</h1>
          <p className={styles.pageSubtitle}>Appears in the ornate-frame grid with name &amp; photo</p>
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
            <p className={styles.fieldHint}>Full name with honorific — e.g. Swami Ananda Ji</p>
            <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${form.name && !errors.name ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Swami Ananda Ji"
                value={form.name} maxLength={100} onChange={(e) => set("name", e.target.value)} />
              <span className={styles.charCount}>{form.name.length}/100</span>
            </div>
            {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
          </div>

          {/* Order */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span> Display Order
            </label>
            <p className={styles.fieldHint}>Lower number = appears first in the guest grid</p>
            <div className={styles.inputWrap}>
              <input type="number" className={styles.input} placeholder="e.g. 1"
                value={form.order} min={1} onChange={(e) => set("order", e.target.value)} />
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
            Displayed in the ornate gold frame in the guest grid. Square photo recommended, min 500×500px, max 5MB.
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
          <p className={styles.sectionDesc}>Each entry = one paragraph shown below the photo (max 8)</p>

          {errors.bioItems && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.bioItems}</p>}

          {form.bioItems.map((para, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.listIndex}>{i + 1}</div>
              <div className={`${styles.inputWrap} ${styles.listInputWrap}`}>
                <textarea className={`${styles.input} ${styles.textarea}`}
                  placeholder={`Paragraph ${i + 1}…`} value={para} maxLength={600} rows={3}
                  onChange={(e) => updateBio(i, e.target.value)} />
                <span className={`${styles.charCount} ${styles.charCountBottom}`}>{para.length}/600</span>
              </div>
              <button type="button" className={styles.removeListBtn}
                onClick={() => removeBio(i)} disabled={form.bioItems.length <= 1}>✕</button>
            </div>
          ))}
          {form.bioItems.length < 8 && (
            <button type="button" className={styles.addListBtn} onClick={addBio}>+ Add Paragraph</button>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/our-teachers/guestteachers" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Add Guest Teacher</>}
          </button>
        </div>

      </div>
    </div>
  );
}