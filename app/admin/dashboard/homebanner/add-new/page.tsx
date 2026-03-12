"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "@/assets/style/Admin/dashboard/homebanner/Addbanner.module.css";
import Link from "next/link";

interface FormData {
  bannerName: string;
  link: string;
  image: File | null;
  imagePreview: string | null;
}

interface FormErrors {
  bannerName?: string;
  link?: string;
  image?: string;
}

export default function AddBannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    bannerName: "",
    link: "",
    image: null,
    imagePreview: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.bannerName.trim()) e.bannerName = "Banner name is required";
    else if (form.bannerName.trim().length < 3)
      e.bannerName = "Name must be at least 3 characters";
    if (!form.link.trim()) e.link = "Link is required";
    else if (!/^https?:\/\/.+/.test(form.link.trim()))
      e.link = "Enter a valid URL (e.g. https://example.com)";
    if (!form.image) e.image = "Please upload a banner image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Image handling ── */
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Only image files are allowed (JPG, PNG, WEBP)",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be smaller than 5MB",
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: e.target?.result as string,
      }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.push("/admin/home/hero"), 1500);
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Banner Added!</h2>
          <p className={styles.successText}>Redirecting to banners list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/dashboard/homebanner")}
        >
          Hero Banners
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Banner</span>
      </div>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Add New Banner</h1>
          <p className={styles.pageSubtitle}>
            Fill in the details below to add a new hero banner
          </p>
        </div>
      </div>

      {/* ── Ornament ── */}
      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* ── Form card ── */}
      <div className={styles.formCard}>
        {/* ── Field 1: Banner Name ── */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Name
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldHint}>
            This name is for internal reference only
          </p>
          <div
            className={`${styles.inputWrap} ${errors.bannerName ? styles.inputError : ""} ${form.bannerName && !errors.bannerName ? styles.inputSuccess : ""}`}
          >
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 200HR Yoga Teacher Training Banner"
              value={form.bannerName}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, bannerName: e.target.value }));
                if (errors.bannerName)
                  setErrors((prev) => ({ ...prev, bannerName: undefined }));
              }}
              maxLength={80}
            />
            {form.bannerName && (
              <span className={styles.charCount}>
                {form.bannerName.length}/80
              </span>
            )}
          </div>
          {errors.bannerName && (
            <p className={styles.errorMsg}>⚠ {errors.bannerName}</p>
          )}
        </div>

        {/* ── Field 2: Banner Image ── */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Image
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldHint}>
            Recommended size: 1920×600px · Max 5MB · JPG, PNG, WEBP
          </p>

          {!form.imagePreview ? (
            /* Drop zone */
            <div
              ref={dropZoneRef}
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""} ${errors.image ? styles.dropZoneError : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className={styles.dropIcon}>
                <span className={styles.dropIconInner}>⬆</span>
              </div>
              <p className={styles.dropTitle}>
                {isDragging
                  ? "Release to upload"
                  : "Drag & drop your image here"}
              </p>
              <p className={styles.dropSub}>
                or <span className={styles.dropBrowse}>browse files</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            /* Preview */
            <div className={styles.previewWrap}>
              <img
                src={form.imagePreview}
                alt="Banner preview"
                className={styles.previewImg}
              />
              <div className={styles.previewOverlay}>
                <div className={styles.previewMeta}>
                  <span className={styles.previewName}>{form.image?.name}</span>
                  <span className={styles.previewSize}>
                    {form.image
                      ? (form.image.size / 1024).toFixed(1) + " KB"
                      : ""}
                  </span>
                </div>
                <div className={styles.previewActions}>
                  <button
                    className={styles.previewChange}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    ✎ Change
                  </button>
                  <button
                    className={styles.previewRemove}
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
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
          {errors.image && <p className={styles.errorMsg}>⚠ {errors.image}</p>}
        </div>

        {/* ── Field 3: Link ── */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Link
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldHint}>
            Page that opens when user clicks this banner
          </p>
          <div
            className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.link ? styles.inputError : ""} ${form.link && !errors.link ? styles.inputSuccess : ""}`}
          >
            <span className={styles.inputPrefix}>🔗</span>
            <input
              type="url"
              className={`${styles.input} ${styles.inputPrefixed}`}
              placeholder="https://aymyoga.com/courses/200hr"
              value={form.link}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, link: e.target.value }));
                if (errors.link)
                  setErrors((prev) => ({ ...prev, link: undefined }));
              }}
            />
          </div>
          {errors.link && <p className={styles.errorMsg}>⚠ {errors.link}</p>}
        </div>

        {/* ── Divider ── */}
        <div className={styles.formDivider} />

        {/* ── Form actions ── */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/homebanner" className={styles.cancelBtn}>
            ← Cancel
          </Link>
          <button
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
                <span>✦</span> Add Banner
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
