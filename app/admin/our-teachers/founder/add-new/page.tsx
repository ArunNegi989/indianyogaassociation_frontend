"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/our-teachers/Founder.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  subtitle: string;
  sectionLabel: string;
  estYear: string;
  ctaText: string;
  bioItems: string[];
}

interface FormErrors {
  name?: string;
  subtitle?: string;
  image?: string;
  bioItems?: string;
}

export default function AddFounderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    subtitle: "",
    sectionLabel: "Founder & Director",
    estYear: "Est. 2005",
    ctaText: "",
    bioItems: [""],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  /* Redirect if founder already exists */
  useEffect(() => {
    let called = false;

    const check = async () => {
      if (called) return;
      called = true;

      try {
        const res = await api.get("/founder/get-founder");
        if (res.data.data) {
          toast.error("Founder already exists. Please edit it instead.");
          router.replace("/admin/dashboard/teachers/founder");
        }
      } catch {}
    };

    check();
  }, [router]);

  /* ── Field helpers ── */
  const set = (key: keyof FormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const updateBio = (idx: number, val: string) => {
    setForm((p) => {
      const bio = [...p.bioItems];
      bio[idx] = val;
      return { ...p, bioItems: bio };
    });
    setErrors((p) => ({ ...p, bioItems: undefined }));
  };
  const addBio = () => {
    if (form.bioItems.length >= 10) return;
    setForm((p) => ({ ...p, bioItems: [...p.bioItems, ""] }));
  };
  const removeBio = (idx: number) =>
    setForm((p) => ({
      ...p,
      bioItems: p.bioItems.filter((_, i) => i !== idx),
    }));

  /* ── Image ── */
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setErrors((p) => ({ ...p, image: undefined }));
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Founder name is required";
    if (!form.subtitle.trim())
      e.subtitle = "Subtitle / designation is required";
    if (!imageFile && !imagePreview) {
      e.image = "A profile photo is required";
    }
    if (!form.bioItems.length || form.bioItems.some((b) => !b.trim())) {
      e.bioItems = "All biography paragraphs must be filled";
    }
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
      fd.append("subtitle", form.subtitle);
      fd.append("sectionLabel", form.sectionLabel);
      fd.append("estYear", form.estYear);
      fd.append("ctaText", form.ctaText);
      form.bioItems
        .filter(Boolean)
        .forEach((b, i) => fd.append(`bio[${i}]`, b));
      if (imageFile) fd.append("image", imageFile);

      await api.post("/founder/create-founder", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/our-teachers/founder"), 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save founder");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Founder Added!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbBtn}
          onClick={() => router.push("/admin/dashboard/teachers")}
        >
          Our Teachers
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <button
          className={styles.breadcrumbBtn}
          onClick={() => router.push("/admin/our-teachers/founder")}
        >
          Founder
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Founder</span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add Founder &amp; Director</h1>
          <p className={styles.pageSubtitle}>
            Fill in all details for the Founder section
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>
        {/* ── SECTION 1: Section Labels ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Labels</h3>
          </div>
          <p className={styles.sectionDesc}>
            Small text shown above the founder's name and overlaid on the photo
            as a badge.
          </p>

          <div className={styles.twoCol}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span> Section Label
              </label>
              <p className={styles.fieldHint}>
                Above the name — e.g. "Founder &amp; Director"
              </p>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Founder & Director"
                  value={form.sectionLabel}
                  maxLength={60}
                  onChange={(e) => set("sectionLabel", e.target.value)}
                />
                <span className={styles.charCount}>
                  {form.sectionLabel.length}/60
                </span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span> Establishment Badge
              </label>
              <p className={styles.fieldHint}>
                Photo overlay — e.g. "Est. 2005"
              </p>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Est. 2005"
                  value={form.estYear}
                  maxLength={20}
                  onChange={(e) => set("estYear", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── SECTION 2: Identity ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Founder Identity</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Full Name <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Displayed as the H2 heading — e.g. Yogi Chetan Mahesh
            </p>
            <div
              className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""} ${form.name && !errors.name ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Yogi Chetan Mahesh"
                value={form.name}
                maxLength={100}
                onChange={(e) => set("name", e.target.value)}
              />
              <span className={styles.charCount}>{form.name.length}/100</span>
            </div>
            {errors.name && <p className={styles.errorMsg}>⚠ {errors.name}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Subtitle / Designation <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Shown below the name — e.g. Founder Of AYM Yoga School
            </p>
            <div
              className={`${styles.inputWrap} ${errors.subtitle ? styles.inputError : ""} ${form.subtitle && !errors.subtitle ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Founder Of AYM Yoga School"
                value={form.subtitle}
                maxLength={120}
                onChange={(e) => set("subtitle", e.target.value)}
              />
              <span className={styles.charCount}>
                {form.subtitle.length}/120
              </span>
            </div>
            {errors.subtitle && (
              <p className={styles.errorMsg}>⚠ {errors.subtitle}</p>
            )}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── SECTION 3: Profile Photo ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>
              Profile Photo <span className={styles.required}>*</span>
            </h3>
          </div>
          <p className={styles.sectionDesc}>
            Displayed in the ornate gold frame on the Teachers page. Square or
            portrait recommended, min 500×500px, max 5MB.
          </p>

          {errors.image && (
            <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>
              ⚠ {errors.image}
            </p>
          )}

          {!imagePreview ? (
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropIcon}>📷</div>
              <p className={styles.dropTitle}>
                Click to upload or drag &amp; drop
              </p>
              <p className={styles.dropSub}>JPG, PNG, WEBP · max 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f);
                }}
              />
            </div>
          ) : (
            <div className={styles.imagePreviewWrap}>
              <div className={styles.imagePreviewFrame}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreviewImg}
                />
                <div className={styles.imagePreviewBadge}>
                  {imageFile
                    ? `${imageFile.name} · ${(imageFile.size / 1024).toFixed(0)} KB`
                    : "Photo"}
                </div>
              </div>
              <div className={styles.imagePreviewActions}>
                <button
                  type="button"
                  className={styles.changeImgBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷 Change Photo
                </button>
                <button
                  type="button"
                  className={styles.removeImgBtn}
                  onClick={removeImage}
                >
                  ✕ Remove
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageFile(f);
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── SECTION 4: Biography ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Biography Paragraphs</h3>
            <span className={styles.sectionBadge}>
              {form.bioItems.length}/10
            </span>
          </div>
          <p className={styles.sectionDesc}>
            Each entry becomes a separate paragraph shown beside the founder's
            photo. Add as many as needed — max 10.
          </p>

          {errors.bioItems && (
            <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>
              ⚠ {errors.bioItems}
            </p>
          )}

          {form.bioItems.map((para, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.listIndex}>{i + 1}</div>
              <div className={`${styles.inputWrap} ${styles.listInputWrap}`}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder={`Paragraph ${i + 1} — e.g. Yogi Chetan Mahesh Ji was born in a Vedic family…`}
                  value={para}
                  maxLength={1000}
                  rows={4}
                  onChange={(e) => updateBio(i, e.target.value)}
                />
                <span
                  className={`${styles.charCount} ${styles.charCountBottom}`}
                >
                  {para.length}/1000
                </span>
              </div>
              <button
                type="button"
                className={styles.removeListBtn}
                onClick={() => removeBio(i)}
                disabled={form.bioItems.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}

          {form.bioItems.length < 10 && (
            <button
              type="button"
              className={styles.addListBtn}
              onClick={addBio}
            >
              + Add Paragraph
            </button>
          )}
        </div>

        <div className={styles.formDivider} />

        {/* ── SECTION 5: CTA Button ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>CTA Button Text</h3>
          </div>
          <p className={styles.sectionDesc}>
            The "More Information" button shown below the biography. Leave blank
            to hide the button.
          </p>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span> Button Label
            </label>
            <p className={styles.fieldHint}>
              e.g. More Information about Yogi Chetan Mahesh Ji
            </p>
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="More Information about Yogi Chetan Mahesh Ji"
                value={form.ctaText}
                maxLength={120}
                onChange={(e) => set("ctaText", e.target.value)}
              />
              <span className={styles.charCount}>
                {form.ctaText.length}/120
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/our-teachers/founder" className={styles.cancelBtn}>
            ← Cancel
          </Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} /> Saving…
              </>
            ) : (
              <>
                <span>✦</span> Add Founder
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
