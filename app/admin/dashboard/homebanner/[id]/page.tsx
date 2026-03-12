"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/homebanner/Editbanner.module.css";

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

// ── Mock data — replace with real API call ──
const mockBanners: Record<string, { bannerName: string; link: string; imageUrl: string }> = {
  "1": { bannerName: "200HR Yoga Teacher Training",   link: "https://aymyoga.com/courses/200hr",      imageUrl: "" },
  "2": { bannerName: "Yin Yoga Retreat – Rishikesh",  link: "https://aymyoga.com/retreats/yin",       imageUrl: "" },
  "3": { bannerName: "Pranayama & Meditation Course", link: "https://aymyoga.com/courses/pranayama",  imageUrl: "" },
  "4": { bannerName: "Ayurveda & Yoga Wellness",      link: "https://aymyoga.com/wellness",           imageUrl: "" },
};

// ── Breakpoint hook ──
function useBreakpoint() {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return { isMobile: width < 480, isTablet: width >= 480 && width < 768, width };
}

export default function EditBannerPage() {
  const router   = useRouter();
  const params   = useParams();
  const id       = params?.id as string;
  const { isMobile } = useBreakpoint();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef  = useRef<HTMLDivElement>(null);

  const [isLoading,   setIsLoading]   = useState(true);
  const [notFound,    setNotFound]    = useState(false);
  const [form,        setForm]        = useState<FormData>({ bannerName: "", link: "", image: null, imagePreview: null });
  const [originalData, setOriginalData] = useState({ bannerName: "", link: "" });
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [isDragging,  setIsDragging]  = useState(false);
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [hasChanges,  setHasChanges]  = useState(false);

  // ── Fetch banner ──
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 800)); // replace with real API
      const data = mockBanners[id];
      if (!data) { setNotFound(true); setIsLoading(false); return; }
      setForm({ bannerName: data.bannerName, link: data.link, image: null, imagePreview: data.imageUrl || null });
      setOriginalData({ bannerName: data.bannerName, link: data.link });
      setIsLoading(false);
    };
    if (id) fetch();
  }, [id]);

  // ── Track changes ──
  useEffect(() => {
    setHasChanges(
      form.bannerName !== originalData.bannerName ||
      form.link       !== originalData.link       ||
      form.image      !== null
    );
  }, [form, originalData]);

  // ── Validation ──
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.bannerName.trim())               e.bannerName = "Banner name is required";
    else if (form.bannerName.trim().length < 3) e.bannerName = "Minimum 3 characters required";
    if (!form.link.trim())                     e.link = "Link is required";
    else if (!/^https?:\/\/.+/.test(form.link.trim())) e.link = "Enter a valid URL starting with https://";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Image processing ──
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors(p => ({ ...p, image: "Only image files allowed (JPG, PNG, WEBP)" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, image: "Image must be under 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setForm(p => ({ ...p, image: file, imagePreview: e.target?.result as string }));
      setErrors(p => ({ ...p, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const removeImage = () => {
    setForm(p => ({ ...p, image: null, imagePreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1400)); // replace with real API
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => router.push("/admin/dashboard/homebanner"), 1500);
  };

  // ── Reset ──
  const handleReset = () => {
    setForm({ bannerName: originalData.bannerName, link: originalData.link, image: null, imagePreview: null });
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ════════════════════════════════════════════
  // LOADING SKELETON
  // ════════════════════════════════════════════
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonBreadcrumb} />
        <div className={styles.skeletonHeader}>
          <div>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
          </div>
          <div className={styles.skeletonBadge} />
        </div>
        <div className={styles.skeletonOrnament} />
        <div className={styles.formCard}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonLabel} style={{ marginTop: "1.6rem" }} />
          <div className={styles.skeletonDropzone} />
          <div className={styles.skeletonLabel} style={{ marginTop: "1.6rem" }} />
          <div className={styles.skeletonInput} />
          <div className={styles.skeletonDivider} />
          <div className={styles.skeletonActions} />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  // NOT FOUND
  // ════════════════════════════════════════════
  if (notFound) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundOm}>ॐ</div>
          <h2 className={styles.notFoundTitle}>Banner Not Found</h2>
          <p className={styles.notFoundText}>The banner with ID "{id}" does not exist or has been deleted.</p>
          <Link href=".." className={styles.notFoundBtn}>← Back to Banners</Link>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  // SUCCESS SCREEN
  // ════════════════════════════════════════════
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Banner Updated!</h2>
          <p className={styles.successText}>Redirecting to banners list…</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  // MAIN FORM
  // ════════════════════════════════════════════
  return (
    <div className={styles.page}>

      {/* ── Unsaved changes bar ── */}
      {hasChanges && (
        <div className={styles.unsavedBar}>
          <span className={styles.unsavedDot} />
          <span className={styles.unsavedText}>You have unsaved changes</span>
          <button className={styles.unsavedReset} onClick={handleReset}>↺ Reset</button>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <Link href=".." className={styles.breadcrumbLink}>Hero Banners</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Banner #{id}</span>
      </div>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Banner</h1>
          <p className={styles.pageSubtitle}>
            {isMobile
              ? "Update banner details below"
              : "Update the fields below · Changes apply to homepage slider"}
          </p>
        </div>
        <div className={styles.headerBadge}>
          <span className={styles.headerBadgeDot} />
          ID: {id}
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

      {/* ── Form Card ── */}
      <div className={styles.formCard}>

        {/* Field 1 — Banner Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Name
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldHint}>Internal reference name for this banner</p>
          <div className={`${styles.inputWrap} ${errors.bannerName ? styles.inputError : ""} ${form.bannerName && !errors.bannerName ? styles.inputSuccess : ""}`}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 200HR Yoga Teacher Training Banner"
              value={form.bannerName}
              maxLength={80}
              onChange={e => {
                setForm(p => ({ ...p, bannerName: e.target.value }));
                if (errors.bannerName) setErrors(p => ({ ...p, bannerName: undefined }));
              }}
            />
            {form.bannerName && (
              <span className={styles.charCount}>{form.bannerName.length}/80</span>
            )}
          </div>
          {errors.bannerName && <p className={styles.errorMsg}>⚠ {errors.bannerName}</p>}
        </div>

        {/* Field 2 — Banner Image */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Image
            <span className={styles.optionalTag}>optional — leave to keep current</span>
          </label>
          <p className={styles.fieldHint}>Recommended: 1920×600px · Max 5MB · JPG, PNG, WEBP</p>

          {!form.imagePreview ? (
            <div
              ref={dropZoneRef}
              className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ""} ${errors.image ? styles.dropZoneError : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
            >
              <div className={styles.dropIconWrap}>
                <span className={styles.dropIconInner}>⬆</span>
              </div>
              <p className={styles.dropTitle}>
                {isDragging ? "Release to upload" : "Drag & drop new image here"}
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
            <div className={styles.previewWrap}>
              <img src={form.imagePreview} alt="Banner preview" className={styles.previewImg} />
              {form.image && <div className={styles.newBadge}>✦ New Image</div>}
              <div className={styles.previewOverlay}>
                <div className={styles.previewMeta}>
                  {form.image
                    ? <><span className={styles.previewName}>{form.image.name}</span>
                       <span className={styles.previewSize}>{(form.image.size / 1024).toFixed(1)} KB</span></>
                    : <span className={styles.previewName}>Current banner image</span>
                  }
                </div>
                <div className={styles.previewBtns}>
                  <button className={styles.previewChange} onClick={() => fileInputRef.current?.click()}>✎ Change</button>
                  <button className={styles.previewRemove} onClick={removeImage}>✕ Remove</button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className={styles.fileInputHidden} onChange={handleFileChange} />
              </div>
            </div>
          )}
          {errors.image && <p className={styles.errorMsg}>⚠ {errors.image}</p>}
        </div>

        {/* Field 3 — Link */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            <span className={styles.labelIcon}>✦</span>
            Banner Link
            <span className={styles.required}>*</span>
          </label>
          <p className={styles.fieldHint}>Page that opens when user clicks this banner</p>
          <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors.link ? styles.inputError : ""} ${form.link && !errors.link ? styles.inputSuccess : ""}`}>
            <span className={styles.inputPrefix}>🔗</span>
            <input
              type="url"
              className={`${styles.input} ${styles.inputPrefixed}`}
              placeholder="https://aymyoga.com/courses/200hr"
              value={form.link}
              onChange={e => {
                setForm(p => ({ ...p, link: e.target.value }));
                if (errors.link) setErrors(p => ({ ...p, link: undefined }));
              }}
            />
          </div>
          {errors.link && <p className={styles.errorMsg}>⚠ {errors.link}</p>}
        </div>

        {/* Divider */}
        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href=".." className={styles.cancelBtn}>← Cancel</Link>
          <button
            className={styles.resetBtn}
            onClick={handleReset}
            disabled={!hasChanges || isSubmitting}
          >
            ↺ Reset
          </button>
          <button
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><span className={styles.spinner} /> Saving…</>
              : <><span>✦</span> Update Banner</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}