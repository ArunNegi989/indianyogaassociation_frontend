"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/assets/style/Admin/dashboard/whyaymschool/Whyaym.module.css";
// import api from "@/lib/api";

/* ── Types ── */
interface Feature {
  title: string;
  desc: string;
}

interface FormData {
  superTitle: string;
  mainTitle: string;
  introPara: string;
  /* Image */
  imageSrc: string;
  imageAlt: string;
  imgBadgeYear: string;
  imgQuote: string;
  /* Features */
  sideFeatures: Feature[];
  bottomFeatures: Feature[];
}

interface FormErrors {
  superTitle?: string;
  mainTitle?: string;
  introPara?: string;
  imageSrc?: string;
  sideFeatures?: string;
  bottomFeatures?: string;
}

const emptyFeature = (): Feature => ({ title: "", desc: "" });

export default function AddWhyAYMPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    superTitle: "Yoga Teacher Training in Rishikesh",
    mainTitle: "",
    introPara: "",
    imageSrc: "",
    imageAlt: "",
    imgBadgeYear: "Est. 2005",
    imgQuote: "",
    sideFeatures: [emptyFeature(), emptyFeature()],
    bottomFeatures: [emptyFeature(), emptyFeature()],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /* ── Setters ── */
  const set = (key: keyof Omit<FormData, "sideFeatures" | "bottomFeatures">, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  /* ── Feature handlers ── */
  const updateFeature = (
    group: "sideFeatures" | "bottomFeatures",
    i: number,
    field: keyof Feature,
    val: string
  ) => {
    setForm((p) => {
      const arr = [...p[group]];
      arr[i] = { ...arr[i], [field]: val };
      return { ...p, [group]: arr };
    });
    setErrors((p) => ({ ...p, [group]: undefined }));
  };

  const addFeature = (group: "sideFeatures" | "bottomFeatures") => {
    if (form[group].length >= 8) return;
    setForm((p) => ({ ...p, [group]: [...p[group], emptyFeature()] }));
  };

  const removeFeature = (group: "sideFeatures" | "bottomFeatures", i: number) => {
    setForm((p) => ({ ...p, [group]: p[group].filter((_, idx) => idx !== i) }));
  };

  /* Drag reorder features */
  const featureDragIdx = useRef<{ group: string; idx: number } | null>(null);
  const handleFeatureDragStart = (group: "sideFeatures" | "bottomFeatures", i: number) => {
    featureDragIdx.current = { group, idx: i };
  };
  const handleFeatureDragEnter = (group: "sideFeatures" | "bottomFeatures", i: number) => {
    if (!featureDragIdx.current || featureDragIdx.current.group !== group || featureDragIdx.current.idx === i) return;
    const arr = [...form[group]];
    const [moved] = arr.splice(featureDragIdx.current.idx, 1);
    arr.splice(i, 0, moved);
    featureDragIdx.current = { group, idx: i };
    setForm((p) => ({ ...p, [group]: arr }));
  };

  /* ── Image handlers ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    set("imageSrc", url);
    if (!form.imageAlt) set("imageAlt", f.name.replace(/\.[^.]+$/, ""));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const f = e.dataTransfer.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    set("imageSrc", url);
    if (!form.imageAlt) set("imageAlt", f.name.replace(/\.[^.]+$/, ""));
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    set("imageSrc", url);
    setUrlInput("");
  };

  /* ── Validation ── */
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.superTitle.trim()) e.superTitle = "Super title is required";
    if (!form.mainTitle.trim()) e.mainTitle = "Main title is required";
    if (!form.introPara.trim()) e.introPara = "Intro paragraph is required";
    if (!form.imageSrc.trim()) e.imageSrc = "Hero image is required";
    if (form.sideFeatures.some((f) => !f.title.trim() || !f.desc.trim()))
      e.sideFeatures = "All side feature title & description fields must be filled";
    if (form.bottomFeatures.some((f) => !f.title.trim() || !f.desc.trim()))
      e.bottomFeatures = "All bottom feature title & description fields must be filled";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      const payload = { ...form };
      // await api.post("/why-aym/create", payload);
      console.log("Payload:", payload);
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/whyaym"), 1500);
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Section Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  /* ── Feature block builder ── */
  const FeatureBuilder = ({
    group,
    label,
    symbol,
  }: {
    group: "sideFeatures" | "bottomFeatures";
    label: string;
    symbol: string;
  }) => (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{label}</h3>
        <span className={styles.sectionBadge}>{form[group].length} / 8</span>
      </div>

      {errors[group] && (
        <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors[group]}</p>
      )}

      {form[group].map((feat, i) => (
        <div
          key={i}
          className={styles.featureItemCard}
          draggable
          onDragStart={() => handleFeatureDragStart(group, i)}
          onDragEnter={() => handleFeatureDragEnter(group, i)}
          onDragEnd={() => { featureDragIdx.current = null; }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className={styles.featureItemHeader}>
            <span className={styles.featureDragHandle}>⠿</span>
            <span className={styles.featureItemNumber}>{symbol}{i + 1}</span>
            <span className={styles.featureItemType}>{label} #{i + 1}</span>
            <button
              type="button"
              className={styles.featureRemoveBtn}
              onClick={() => removeFeature(group, i)}
              disabled={form[group].length <= 1}
            >✕</button>
          </div>

          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Feature Title<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Bold heading shown before the description (e.g. "The most experienced yoga teachers:")</p>
            <div className={`${styles.inputWrap} ${feat.title && !errors[group] ? styles.inputSuccess : ""}`}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. The most experienced yoga teachers:"
                value={feat.title}
                maxLength={120}
                onChange={(e) => updateFeature(group, i, "title", e.target.value)}
              />
              <span className={styles.charCount}>{feat.title.length}/120</span>
            </div>
          </div>

          {/* Desc */}
          <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>
              Feature Description<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Body text explaining this feature</p>
            <div className={`${styles.inputWrap} ${feat.desc && !errors[group] ? styles.inputSuccess : ""}`}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                placeholder="e.g. The main foundation of yoga teachers' training is laid by the wisdom imparted by the teachers…"
                value={feat.desc}
                maxLength={800}
                rows={3}
                onChange={(e) => updateFeature(group, i, "desc", e.target.value)}
              />
              <span className={styles.charCount}>{feat.desc.length}/800</span>
            </div>
          </div>
        </div>
      ))}

      {form[group].length < 8 && (
        <button type="button" className={styles.addFeatureBtn} onClick={() => addFeature(group)}>
          + Add {label.replace(" Features", "")} Feature
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/whyaym" className={styles.breadcrumbLink}>Why AYM</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Add Why AYM Section</h1>
          <p className={styles.pageSubtitle}>Configure all content — header, hero image, side features & bottom features</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. SECTION HEADER ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Section Header</h3>
          </div>

          {/* Super Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Small label shown above the main heading (e.g. "Yoga Teacher Training in Rishikesh")</p>
            <div className={`${styles.inputWrap} ${errors.superTitle ? styles.inputError : ""} ${form.superTitle && !errors.superTitle ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input}
                placeholder="e.g. Yoga Teacher Training in Rishikesh"
                value={form.superTitle} maxLength={120}
                onChange={(e) => set("superTitle", e.target.value)} />
              <span className={styles.charCount}>{form.superTitle.length}/120</span>
            </div>
            {errors.superTitle && <p className={styles.errorMsg}>⚠ {errors.superTitle}</p>}
          </div>

          {/* Main Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Title (H2)<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Primary heading — the key differentiator question</p>
            <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""} ${form.mainTitle && !errors.mainTitle ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                placeholder="e.g. What Makes AYM Yoga School Different from Other Yoga Schools in Rishikesh, India?"
                value={form.mainTitle} maxLength={300} rows={3}
                onChange={(e) => set("mainTitle", e.target.value)} />
              <span className={styles.charCount}>{form.mainTitle.length}/300</span>
            </div>
            {errors.mainTitle && <p className={styles.errorMsg}>⚠ {errors.mainTitle}</p>}
          </div>

          {/* Intro Para */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Intro Paragraph<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Short introductory text shown below the divider and above the image grid</p>
            <div className={`${styles.inputWrap} ${errors.introPara ? styles.inputError : ""} ${form.introPara && !errors.introPara ? styles.inputSuccess : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`}
                placeholder="e.g. Namaste, yoga lovers! AYM Yoga School stands out among Rishikesh's yoga schools…"
                value={form.introPara} maxLength={500} rows={3}
                onChange={(e) => set("introPara", e.target.value)} />
              <span className={styles.charCount}>{form.introPara.length}/500</span>
            </div>
            {errors.introPara && <p className={styles.errorMsg}>⚠ {errors.introPara}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ 2. HERO IMAGE ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Hero Image</h3>
          </div>

          {errors.imageSrc && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ {errors.imageSrc}</p>}

          <div className={styles.imageUploadArea}>
            {/* Preview */}
            <div className={styles.imagePreviewBox}>
              {form.imageSrc ? (
                <>
                  <img src={form.imageSrc} alt={form.imageAlt || "Hero"} className={styles.imagePreviewImg} />
                  <div className={styles.imagePreviewOverlay}>
                    <button type="button" className={styles.removeImgBtn} onClick={() => set("imageSrc", "")}>✕</button>
                  </div>
                </>
              ) : (
                <div className={styles.imagePreviewEmpty}>
                  <span className={styles.imagePreviewEmptyIcon}>🖼</span>
                  No image yet
                </div>
              )}
            </div>

            {/* Controls */}
            <div className={styles.imageUploadControls}>
              {/* Dropzone */}
              <div
                className={`${styles.uploadZone} ${isDragOver ? styles.uploadZoneDragOver : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <span className={styles.uploadIcon}>📁</span>
                <p className={styles.uploadText}>Click or drag & drop to upload</p>
                <p className={styles.uploadSubText}>JPG · PNG · WEBP</p>
                <input ref={fileInputRef} type="file" accept="image/*" className={styles.uploadInput} onChange={handleFileChange} />
              </div>

              {/* URL input */}
              <div className={styles.urlRow}>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input}
                    placeholder="Or paste image URL…"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddUrl(); }}
                  />
                </div>
                <button type="button" className={styles.addUrlBtn} onClick={handleAddUrl}>Use URL</button>
              </div>

              {/* Meta fields */}
              <div className={styles.imageMetaFields}>
                <div className={styles.fieldGroup} style={{ marginBottom: "0.8rem" }}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Alt Text</label>
                  <p className={styles.fieldHint}>Accessibility & SEO description</p>
                  <div className={`${styles.inputWrap} ${form.imageAlt ? styles.inputSuccess : ""}`}>
                    <input type="text" className={styles.input}
                      placeholder="e.g. AYM Yoga School certified student"
                      value={form.imageAlt} maxLength={150}
                      onChange={(e) => set("imageAlt", e.target.value)} />
                    <span className={styles.charCount}>{form.imageAlt.length}/150</span>
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginBottom: "0.8rem" }}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Badge Year</label>
                  <p className={styles.fieldHint}>Small badge overlaid on the image (e.g. Est. 2005)</p>
                  <div className={`${styles.inputWrap} ${form.imgBadgeYear ? styles.inputSuccess : ""}`}>
                    <input type="text" className={styles.input}
                      placeholder="e.g. Est. 2005"
                      value={form.imgBadgeYear} maxLength={20}
                      onChange={(e) => set("imgBadgeYear", e.target.value)} />
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                  <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Blockquote</label>
                  <p className={styles.fieldHint}>Short quote displayed below the image with quotation marks</p>
                  <div className={`${styles.inputWrap} ${form.imgQuote ? styles.inputSuccess : ""}`}>
                    <input type="text" className={styles.input}
                      placeholder="e.g. Where Ancient Yoga Lives & Transforms Lives"
                      value={form.imgQuote} maxLength={100}
                      onChange={(e) => set("imgQuote", e.target.value)} />
                    <span className={styles.charCount}>{form.imgQuote.length}/100</span>
                  </div>
                  {form.imgQuote && (
                    <div className={styles.quotePreview}>&ldquo;{form.imgQuote}&rdquo;</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══ 3. SIDE FEATURES (right column) ══ */}
        <FeatureBuilder group="sideFeatures" label="Side Features" symbol="🔷" />

        <div className={styles.formDivider} />

        {/* ══ 4. BOTTOM FEATURES ══ */}
        <FeatureBuilder group="bottomFeatures" label="Bottom Features" symbol="🔲" />

        <div className={styles.formDivider} />

        {/* Form Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/dashboard/whyaym" className={styles.cancelBtn}>← Cancel</Link>
          <button type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit} disabled={isSubmitting}
          >
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Section</>}
          </button>
        </div>

      </div>
    </div>
  );
}