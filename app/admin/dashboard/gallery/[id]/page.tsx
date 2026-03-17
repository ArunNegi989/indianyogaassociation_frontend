"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/gallery/Gallery.module.css";
import api from "@/lib/api";

/* ── Types ── */
interface ImageItem {
  file?: File; 
  src: string;
  label: string;
  editingLabel?: boolean;
}

interface FormData {
  tabLabel: string;
  heading: string;
  cols: string;
  images: ImageItem[];
}

interface FormErrors {
  tabLabel?: string;
  heading?: string;
  cols?: string;
  images?: string;
}

const TAB_OPTIONS = [
  "Luxury", "Private", "Twin/Shared", "Male Dorm", "Female Dorm",
  "Yoga Halls", "Food", "Dining Hall", "AYM School", "Other",
];




const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function EditGallerySectionPage() {
  const router = useRouter();
  const params = useParams();
  const sectionId = params?.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    tabLabel: "",
    heading: "",
    cols: "4",
    images: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /* ── Fetch existing data ── */
  useEffect(() => {
    const fetchSection = async () => {
      try {
        setIsLoading(true);
       const res = await api.get(`/gallery-sections/${sectionId}`);
const data = res.data.data;

        
       setForm({
  tabLabel: data.tabLabel,
  heading: data.heading,
  cols: String(data.cols),
  images: data.images.map((img: any) => ({
    src: img.src.startsWith("http") ? img.src : `${BASE_URL}${img.src}`,
    label: img.label,
  })),
});
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (sectionId) fetchSection();
  }, [sectionId]);

  const set = (key: keyof Omit<FormData, "images">, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  /* ── Image handlers ── */
  const addImages = (newImgs: ImageItem[]) => {
    setForm((p) => ({ ...p, images: [...p.images, ...newImgs] }));
    setErrors((p) => ({ ...p, images: undefined }));
  };

  const removeImage = (i: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const updateLabel = (i: number, label: string) =>
    setForm((p) => {
      const imgs = [...p.images];
      imgs[i] = { ...imgs[i], label };
      return { ...p, images: imgs };
    });

  const toggleEditLabel = (i: number, val: boolean) =>
    setForm((p) => {
      const imgs = [...p.images];
      imgs[i] = { ...imgs[i], editingLabel: val };
      return { ...p, images: imgs };
    });

  /* Image drag reorder inside the grid */
  const imgDragIndex = useRef<number | null>(null);

  const handleImgDragStart = (i: number) => { imgDragIndex.current = i; };
  const handleImgDragEnter = (i: number) => {
    if (imgDragIndex.current === null || imgDragIndex.current === i) return;
    const arr = [...form.images];
    const [moved] = arr.splice(imgDragIndex.current, 1);
    arr.splice(i, 0, moved);
    imgDragIndex.current = i;
    setForm((p) => ({ ...p, images: arr }));
  };
  const handleImgDragEnd = () => { imgDragIndex.current = null; };

  /* File upload */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
   const newImgs: ImageItem[] = files.map((f) => ({
  file: f, // 🔥 MUST
  src: URL.createObjectURL(f),
  label: f.name.replace(/\.[^.]+$/, ""),
}));
    addImages(newImgs);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);

  const files = Array.from(e.dataTransfer.files).filter((f) =>
    f.type.startsWith("image/")
  );

  const newImgs: ImageItem[] = files.map((f) => ({
    file: f, // 🔥 MUST (same as file input)
    src: URL.createObjectURL(f),
    label: f.name.replace(/\.[^.]+$/, ""),
  }));

  addImages(newImgs);
};

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    addImages([{ src: url, label: "Gallery Image" }]);
    setUrlInput("");
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.tabLabel.trim()) e.tabLabel = "Tab label is required";
    if (!form.heading.trim()) e.heading = "Section heading is required";
    if (!form.cols) e.cols = "Select column count";
    if (form.images.length === 0) e.images = "Add at least one image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    setIsSubmitting(true);

    const formData = new FormData();

    formData.append("tabLabel", form.tabLabel);
    formData.append("heading", form.heading);
    formData.append("cols", form.cols);

    
   const existingImages = form.images
  .filter((img) => !img.file && !img.src.startsWith("http"))
  .map(({ src, label }) => ({
    src: src.replace(BASE_URL || "", ""),
    label,
  }));
      

    formData.append("existingImages", JSON.stringify(existingImages));

    // 👇 NEW FILE IMAGES
    form.images.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });

    // 👇 URL IMAGES (new ones)
    const urlImages = form.images
      .filter((img) => !img.file && img.src.startsWith("http"))
      .map(({ src, label }) => ({ src, label }));

    if (urlImages.length > 0) {
      formData.append("imagesData", JSON.stringify(urlImages));
    }

    await api.put(`/gallery-sections/update/${sectionId}`, formData);

    setSubmitted(true);
    setTimeout(() => router.push("/admin/dashboard/gallery"), 1500);

  } catch (error: any) {
    alert(error?.response?.data?.message || error?.message || "Failed to update");
  } finally {
    setIsSubmitting(false);
  }
};
  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <p className={styles.successText}>Loading section…</p>
        </div>
      </div>
    );
  }

  /* ── Success ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Section Updated!</h2>
          <p className={styles.successText}>Redirecting to gallery list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/gallery" className={styles.breadcrumbLink}>Gallery</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit Section</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Edit Gallery Section</h1>
          <p className={styles.pageSubtitle}>Update images, label, and layout for this section</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ── Section Identity ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Identity</h3>
          </div>

          {/* Tab Label */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Tab Label<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Name shown on the gallery tab bar</p>
            <div
              className={`${styles.inputWrap} ${errors.tabLabel ? styles.inputError : ""} ${form.tabLabel && !errors.tabLabel ? styles.inputSuccess : ""}`}
              style={{ position: "relative" }}
            >
              <select
                className={styles.select}
                value={form.tabLabel}
                onChange={(e) => set("tabLabel", e.target.value)}
              >
                <option value="">— Select a tab label —</option>
                {TAB_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
            {errors.tabLabel && <p className={styles.errorMsg}>⚠ {errors.tabLabel}</p>}
          </div>

          {/* Section Heading */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Section Heading<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Full heading displayed above the image grid</p>
            <div className={`${styles.inputWrap} ${errors.heading ? styles.inputError : ""} ${form.heading && !errors.heading ? styles.inputSuccess : ""}`}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Luxury Accommodation - AYM Yoga School"
                value={form.heading}
                maxLength={120}
                onChange={(e) => set("heading", e.target.value)}
              />
              <span className={styles.charCount}>{form.heading.length}/120</span>
            </div>
            {errors.heading && <p className={styles.errorMsg}>⚠ {errors.heading}</p>}
          </div>

          {/* Columns */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Grid Columns<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Number of columns in the image grid on desktop</p>
            <div className={`${styles.inputWrap} ${errors.cols ? styles.inputError : ""}`} style={{ maxWidth: 200, position: "relative" }}>
              <select
                className={styles.select}
                value={form.cols}
                onChange={(e) => set("cols", e.target.value)}
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
            {errors.cols && <p className={styles.errorMsg}>⚠ {errors.cols}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ── Images ── */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Images</h3>
            <span className={styles.sectionBadge}>{form.images.length} images · drag to reorder</span>
          </div>

          {errors.images && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.images}</p>}

          {/* Existing image grid with drag-reorder */}
          {form.images.length > 0 && (
            <div className={styles.imageGrid} style={{ marginBottom: "1rem" }}>
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className={styles.imageItem}
                  draggable
                  onDragStart={() => handleImgDragStart(i)}
                  onDragEnter={() => handleImgDragEnter(i)}
                  onDragEnd={handleImgDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  style={{ cursor: "grab" }}
                >
                  <img src={img.src} alt={img.label} className={styles.imageItemImg} />
                  <span className={styles.imageItemLabel}>{img.label}</span>
                  <div className={styles.imageItemOverlay}>
                    <button
                      type="button"
                      className={styles.removeImgBtn}
                      onClick={() => removeImage(i)}
                      title="Remove"
                    >✕</button>
                    <button
                      type="button"
                      className={styles.editLabelBtn}
                      onClick={() => toggleEditLabel(i, true)}
                    >✎ Label</button>
                  </div>
                  {img.editingLabel && (
                    <input
                      type="text"
                      className={styles.inlineLabelInput}
                      value={img.label}
                      autoFocus
                      onChange={(e) => updateLabel(i, e.target.value)}
                      onBlur={() => toggleEditLabel(i, false)}
                      onKeyDown={(e) => { if (e.key === "Enter") toggleEditLabel(i, false); }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            className={`${styles.uploadZone} ${isDragOver ? styles.dragOver : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <span className={styles.uploadIcon}>🖼</span>
            <p className={styles.uploadText}>Click to upload more images or drag & drop</p>
            <p className={styles.uploadSubText}>JPG, PNG, WEBP — multiple files supported</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.uploadInput}
              onChange={handleFileChange}
            />
          </div>

          {/* URL add */}
          <div className={styles.urlRow}>
            <div className={`${styles.inputWrap} ${styles.inputWithPrefix}`}>
              <span className={styles.inputPrefix}>🔗</span>
              <input
                type="text"
                className={`${styles.input} ${styles.inputPrefixed}`}
                placeholder="Paste image URL to add more"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddUrl(); }}
              />
            </div>
            <button type="button" className={styles.addUrlBtn} onClick={handleAddUrl}>
              + Add URL
            </button>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/gallery" className={styles.cancelBtn}>← Cancel</Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><span className={styles.spinner} /> Updating…</>
              : <><span>✦</span> Update Section</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}