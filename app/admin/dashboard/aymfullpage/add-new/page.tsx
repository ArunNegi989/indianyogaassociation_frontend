"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import styles from "@/assets/style/Admin/dashboard/aymfullpage/AymFullPage.module.css";
import api from "@/lib/api";

/* ── JoditEditor (SSR-safe) ── */
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
interface BodyPlaneItem  { label: string; listItem: string; }
interface PromoCard      { title: string; text: string; link: string; }
interface JourneyPara    { text: string; }

// ✅ Added imageAlt to match edit form
interface CampusFacility { bold: string; text: string; imageAlt: string; }

interface FormValues {
  alignTitle:         string;
  salutation:         string;
  alignPara1:         string;
  alignPara2:         string;
  alignPara3:         string;
  bodyPlanes:         BodyPlaneItem[];
  planesPara:         string;
  bodyPlanesImageAlt: string;
  outdoorImageAlt:    string;
  outdoorCaption:     string;
  highlight1:         string;
  highlight2:         string;
  campusTitle:        string;
  campusFacilities:   CampusFacility[];
  promoCard1:         PromoCard;
  promoCard2:         PromoCard;
  ctaHeading:         string;
  ctaSubtext:         string;
  whatsappLink:       string;
  masterQuote:        string;
  masterAttrib:       string;
  journeyParas:       JourneyPara[];
  namesteText:        string;
}

type TabKey = "alignment" | "campus" | "cta";

/* ══════════════════════════════════════════════
   JODIT CONFIG HOOK
══════════════════════════════════════════════ */
function useJoditConfig(height = 250) {
  return useCallback(
    () => ({
      readonly: false,
      height,
      toolbarButtonSize: "small" as const,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "|",
        "link", "unlink", "|",
        "align", "|",
        "undo", "redo", "|",
        "hr", "eraser", "copyformat", "|",
        "fullsize",
      ],
      statusbar: false,
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html" as const,
      style: {
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "0.95rem",
        color: "#3d1f00",
        background: "#fffdf8",
      },
      theme: "default",
    }),
    [height]
  );
}

/* ══════════════════════════════════════════════
   JODIT FIELD WRAPPER
══════════════════════════════════════════════ */
interface JoditFieldProps {
  label:     string;
  hint?:     string;
  value:     string;
  height?:   number;
  required?: boolean;
  errorMsg?: string;
  onChange:  (val: string) => void;
}

function JoditField({
  label, hint, value, height = 220, required, errorMsg, onChange,
}: JoditFieldProps) {
  const config   = useJoditConfig(height);
  const stripped = value.replace(/<[^>]*>/g, "");

  return (
    <div className={styles.fieldGroup}>
      {label && (
        <label className={styles.label}>
          <span className={styles.labelIcon}>✦</span>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div style={{
        border: errorMsg ? "1.5px solid #c0392b" : "1.5px solid #e8d5b5",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}>
        <JoditEditor
          value={value}
          config={config()}
          onBlur={(newContent) => onChange(newContent)}
          onChange={() => {}}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
        {errorMsg
          ? <p className={styles.errorMsg} style={{ margin: 0 }}>⚠ {errorMsg}</p>
          : <span />}
        <span className={styles.charCount} style={{ position: "static" }}>
          {stripped.length} chars
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   IMAGE UPLOAD FIELD
══════════════════════════════════════════════ */
interface ImageUploadFieldProps {
  label:          string;
  hint:           string;
  file:           File | null;
  altText:        string;
  altPlaceholder: string;
  errorMsg?:      string;
  required?:      boolean;
  onFileChange:   (file: File | null) => void;
  onAltChange:    (alt: string) => void;
}

function ImageUploadField({
  label, hint, file, altText, altPlaceholder,
  errorMsg, required, onFileChange, onAltChange,
}: ImageUploadFieldProps) {
  const inputRef                = useRef<HTMLInputElement>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
    onFileChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <p className={styles.fieldHint}>{hint}</p>

      {!preview ? (
        <div
          className={`${styles.imageDropZone} ${dragOver ? styles.imageDropZoneActive : ""} ${errorMsg ? styles.imageDropZoneError : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <span className={styles.dropIcon}>🖼</span>
          <p className={styles.dropText}>
            Drag & drop image here or <span className={styles.dropBrowse}>browse</span>
          </p>
          <p className={styles.dropMeta}>PNG · JPG · WEBP · Max 5 MB</p>
          <input
            ref={inputRef} type="file" accept="image/*"
            className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      ) : (
        <div className={styles.imagePreviewWrap}>
          <img src={preview} alt="Preview" className={styles.imagePreview} />
          <div className={styles.imagePreviewOverlay}>
            <button type="button" className={styles.imageRemoveBtn} onClick={handleRemove}>
              ✕ Remove
            </button>
            <button type="button" className={styles.imageChangeBtn}
              onClick={() => inputRef.current?.click()}>
              ✎ Change
            </button>
          </div>
          {file && <div className={styles.imageFileName}>{file.name}</div>}
          <input
            ref={inputRef} type="file" accept="image/*"
            className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {errorMsg && <p className={styles.errorMsg}>⚠ {errorMsg}</p>}

      <div className={`${styles.inputWrap} ${styles.altInputWrap}`}>
        <input
          type="text" className={styles.input}
          placeholder={altPlaceholder}
          value={altText} maxLength={120}
          onChange={(e) => onAltChange(e.target.value)}
        />
        <span className={styles.charCount}>{altText.length}/120</span>
      </div>
      <p className={styles.fieldHint} style={{ marginTop: "0.4rem" }}>
        Alt text — important for SEO &amp; accessibility
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ✅ FACILITY IMAGE UPLOAD (compact) — same as edit form
══════════════════════════════════════════════ */
interface FacilityImageProps {
  file:         File | null;
  altText:      string;
  onFileChange: (f: File | null) => void;
  onAltChange:  (v: string) => void;
}

function FacilityImageUpload({
  file, altText, onFileChange, onAltChange,
}: FacilityImageProps) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target?.result as string);
    r.readAsDataURL(f);
    onFileChange(f);
  };

  const handleRemove = () => {
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <p className={styles.fieldHint} style={{ marginBottom: "0.5rem" }}>🖼 Optional facility photo</p>

      {!preview ? (
        <div
          className={styles.imageDropZone}
          style={{ padding: "1rem", marginBottom: "0.5rem" }}
          onClick={() => inputRef.current?.click()}
        >
          <span style={{ fontSize: "1.2rem" }}>📷</span>
          <p className={styles.dropText} style={{ fontSize: "0.8rem" }}>
            Click to upload facility photo
          </p>
          <p className={styles.dropMeta}>PNG · JPG · WEBP · Max 5 MB</p>
          <input
            ref={inputRef} type="file" accept="image/*"
            className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      ) : (
        <div className={styles.imagePreviewWrap} style={{ marginBottom: "0.5rem", maxHeight: "160px" }}>
          <img src={preview} alt="Facility" className={styles.imagePreview} style={{ maxHeight: "140px" }} />
          <div className={styles.imagePreviewOverlay}>
            <button type="button" className={styles.imageRemoveBtn} onClick={handleRemove}>✕ Remove</button>
            <button type="button" className={styles.imageChangeBtn} onClick={() => inputRef.current?.click()}>✎ Change</button>
          </div>
          {file && <div className={styles.imageFileName}>{file.name}</div>}
          <input
            ref={inputRef} type="file" accept="image/*"
            className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      <div className={styles.inputWrap}>
        <input
          type="text" className={styles.input}
          placeholder="Alt text for this facility photo"
          value={altText} maxLength={120}
          onChange={(e) => onAltChange(e.target.value)}
        />
        <span className={styles.charCount}>{altText.length}/120</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════ */
export default function AddAYMFullPagePage() {
  const router = useRouter();

  /* ── File state (outside RHF — File objects can't be in defaultValues) ── */
  const [bodyPlanesImageFile, setBodyPlanesImageFile] = useState<File | null>(null);
  const [outdoorImageFile,    setOutdoorImageFile]    = useState<File | null>(null);
  // ✅ Per-facility image files array
  const [facilityImageFiles,  setFacilityImageFiles]  = useState<(File | null)[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [activeTab,    setActiveTab]    = useState<TabKey>("alignment");
  const [expandedFacilities, setExpandedFacilities] = useState<Set<number>>(new Set());

  /* ── Image-level error state (not in RHF) ── */
  const [imgErrors, setImgErrors] = useState<{
    bodyPlanesImage?: string;
    outdoorImage?: string;
  }>({});

  /* ── React Hook Form ── */
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      alignTitle:         "",
      salutation:         "",
      alignPara1:         "",
      alignPara2:         "",
      alignPara3:         "",
      bodyPlanes:         [],
      planesPara:         "",
      bodyPlanesImageAlt: "",
      outdoorImageAlt:    "",
      outdoorCaption:     "",
      highlight1:         "",
      highlight2:         "",
      campusTitle:        "",
      campusFacilities:   [],
      promoCard1:         { title: "", text: "", link: "" },
      promoCard2:         { title: "", text: "", link: "" },
      ctaHeading:         "",
      ctaSubtext:         "",
      whatsappLink:       "",
      masterQuote:        "",
      masterAttrib:       "",
      journeyParas:       [],
      namesteText:        "",
    },
  });

  /* ── Field Arrays ── */
  const {
    fields: planeFields,
    append: appendPlane,
    remove: removePlane,
  } = useFieldArray({ control, name: "bodyPlanes" });

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({ control, name: "campusFacilities" });

  const {
    fields: journeyFields,
    append: appendJourney,
    remove: removeJourney,
  } = useFieldArray({ control, name: "journeyParas" });

  const watchedValues = watch();

  /* ── Plain-text extractor ── */
  const plain = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  /* ── Tab error detection ── */
  const tabHasError = (tab: TabKey): boolean => {
    if (tab === "alignment") {
      return !!(
        errors.alignTitle || errors.salutation ||
        errors.alignPara1 || errors.alignPara2 || errors.alignPara3 ||
        errors.planesPara || errors.highlight1 || errors.highlight2 ||
        imgErrors.bodyPlanesImage || imgErrors.outdoorImage
      );
    }
    if (tab === "campus") {
      return !!(errors.campusTitle || errors.promoCard1 || errors.promoCard2);
    }
    if (tab === "cta") {
      return !!(
        errors.ctaHeading || errors.ctaSubtext || errors.whatsappLink ||
        errors.masterQuote || errors.masterAttrib || errors.namesteText
      );
    }
    return false;
  };

  /* ── Facility helpers ── */
  const addFacility = () => {
    if (facilityFields.length >= 20) return;
    const idx = facilityFields.length;
    // ✅ imageAlt added to default values
    appendFacility({ bold: "", text: "", imageAlt: "" });
    // ✅ push null slot for the new facility's image file
    setFacilityImageFiles((prev) => [...prev, null]);
    setExpandedFacilities((prev) => new Set(prev).add(idx));
  };

  const handleRemoveFacility = (i: number) => {
    removeFacility(i);
    // ✅ also remove the corresponding image file slot
    setFacilityImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setExpandedFacilities((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => { if (v < i) next.add(v); else if (v > i) next.add(v - 1); });
      return next;
    });
  };

  const toggleFacility = (i: number) =>
    setExpandedFacilities((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  /* ══════════════════════════════════════════════
     SUBMIT → POST /aym-full-page/create
  ══════════════════════════════════════════════ */
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    /* ── Validate file fields (not in RHF) ── */
    const newImgErrors: typeof imgErrors = {};
    if (!bodyPlanesImageFile) newImgErrors.bodyPlanesImage = "Body planes diagram image is required";
    if (!outdoorImageFile)    newImgErrors.outdoorImage    = "Outdoor group photo is required";

    if (Object.keys(newImgErrors).length > 0) {
      setImgErrors(newImgErrors);
      setActiveTab("alignment");
      return;
    }
    setImgErrors({});

    try {
      setIsSubmitting(true);

      const fd = new FormData();

      /* ── Scalar fields ── */
      const scalarKeys: (keyof FormValues)[] = [
        "alignTitle", "salutation", "alignPara1", "alignPara2", "alignPara3",
        "planesPara", "bodyPlanesImageAlt", "outdoorImageAlt", "outdoorCaption",
        "highlight1", "highlight2", "campusTitle",
        "ctaHeading", "ctaSubtext", "whatsappLink",
        "masterQuote", "masterAttrib", "namesteText",
      ];
      scalarKeys.forEach((k) => {
        const v = data[k];
        if (v !== null && v !== undefined) fd.append(k, String(v));
      });

      /* ── JSON arrays / objects ── */
      fd.append("bodyPlanes",       JSON.stringify(data.bodyPlanes));
      fd.append("campusFacilities", JSON.stringify(data.campusFacilities));
      fd.append("journeyParas",     JSON.stringify(data.journeyParas));
      fd.append("promoCard1",       JSON.stringify(data.promoCard1));
      fd.append("promoCard2",       JSON.stringify(data.promoCard2));

      /* ── Main images ── */
      if (bodyPlanesImageFile) fd.append("bodyPlanesImage", bodyPlanesImageFile);
      if (outdoorImageFile)    fd.append("outdoorImage",    outdoorImageFile);

      // ✅ Facility images (indexed) — same pattern as edit form
      data.campusFacilities.forEach((_, i) => {
        if (facilityImageFiles[i]) fd.append(`facilityImage_${i}`, facilityImageFiles[i]!);
      });

      await api.post("/aym-full-page/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      toast.success("Page content saved successfully!");
      setTimeout(() => router.push("/admin/dashboard/aymfullpage"), 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Page Content Saved!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "alignment", label: "Alignment & Adjustment", icon: "🧘" },
    { key: "campus",    label: "Campus Section",          icon: "🏛️" },
    { key: "cta",       label: "CTA & Journey",           icon: "✨" },
  ];

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />

      <div className={styles.page}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink}
            onClick={() => router.push("/admin/dashboard/aymfullpage")}>
            AYM Full Page
          </button>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>Add New</span>
        </div>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Add AYM Full Page Content</h1>
          <p className={styles.pageSubtitle}>Configure all three page sections below</p>
        </div>

        <div className={styles.ornament}>
          <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
          <div className={styles.ornamentLine} /><span>❧</span>
        </div>

        {/* Tabs */}
        <div className={styles.tabNav}>
          {tabs.map((t) => (
            <button key={t.key}
              className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabBtnActive : ""} ${tabHasError(t.key) ? styles.tabBtnError : ""}`}
              onClick={() => setActiveTab(t.key)}>
              <span>{t.icon}</span>
              <span className={styles.tabLabel}>{t.label}</span>
              {tabHasError(t.key) && <span className={styles.tabErrorDot}>!</span>}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            if (tabHasError("alignment"))   setActiveTab("alignment");
            else if (tabHasError("campus")) setActiveTab("campus");
            else                            setActiveTab("cta");
          })}
        >
          <div className={styles.formCard}>

            {/* ══════════ TAB 1: ALIGNMENT ══════════ */}
            {activeTab === "alignment" && (
              <>
                {/* Section Header */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Section Header</h3>
                  </div>

                  <Controller
                    name="alignTitle"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Alignment section title is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Section Title (H2)"
                        hint={`e.g. "Yoga Alliance's Alignment and Adjustment Certification course in India, at AYM"`}
                        value={field.value || ""}
                        height={120}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Salutation
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>Greeting shown below the heading</p>
                    <div className={`${styles.inputWrap} ${errors.salutation ? styles.inputError : ""} ${watchedValues.salutation && !errors.salutation ? styles.inputSuccess : ""}`}>
                      <input
                        type="text" className={styles.input}
                        placeholder="e.g. Nameste! yogis"
                        maxLength={80}
                        {...register("salutation", { required: "Salutation is required" })}
                      />
                      <span className={styles.charCount}>{(watchedValues.salutation || "").length}/80</span>
                    </div>
                    {errors.salutation && <p className={styles.errorMsg}>⚠ {errors.salutation.message}</p>}
                  </div>
                </div>

                <div className={styles.formDivider} />

                {/* Body Paragraphs */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Body Paragraphs</h3>
                  </div>

                  {(
                    [
                      { name: "alignPara1" as const, label: "Paragraph 1", hint: "Intro about yoga schools and alignment curriculum" },
                      { name: "alignPara2" as const, label: "Paragraph 2", hint: "About body planes and their role in yoga teaching" },
                      { name: "alignPara3" as const, label: "Paragraph 3", hint: "Using body planes correctly in lesson planning" },
                    ]
                  ).map(({ name, label, hint }, i) => (
                    <Controller
                      key={name}
                      name={name}
                      control={control}
                      rules={{ validate: (v) => !!plain(v || "") || `Paragraph ${i + 1} is required` }}
                      render={({ field, fieldState }) => (
                        <JoditField
                          label={label}
                          hint={
                            name === "alignPara1"
                              ? `e.g. "There are numerous Yoga schools worldwide that offer certifications; however, how many incorporate alignment and adjustment into their curriculum?"`
                              : name === "alignPara2"
                              ? `e.g. "There are three planes of the body that yoga experts use in teaching postures."`
                              : `e.g. "By knowing the different body planes correctly, you can use this in designing your yoga lesson planning."`
                          }
                          value={field.value || ""}
                          required
                          errorMsg={fieldState.error?.message}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  ))}
                </div>

                <div className={styles.formDivider} />

                {/* Body Planes Diagram Image */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Body Planes Diagram Image</h3>
                    <span className={styles.sectionBadge}>yogaBodyPlanes</span>
                  </div>
                  <ImageUploadField
                    label="Alignment Diagram Image"
                    hint="Diagram showing Sagittal, Coronal & Transverse planes"
                    file={bodyPlanesImageFile}
                    altText={watchedValues.bodyPlanesImageAlt || ""}
                    altPlaceholder="e.g. Yoga body planes diagram - Sagittal, Coronal and Transverse planes"
                    errorMsg={imgErrors.bodyPlanesImage}
                    required
                    onFileChange={(f) => {
                      setBodyPlanesImageFile(f);
                      if (f) setImgErrors((p) => ({ ...p, bodyPlanesImage: undefined }));
                    }}
                    onAltChange={(v) => setValue("bodyPlanesImageAlt", v)}
                  />
                </div>

                <div className={styles.formDivider} />

                {/* Body Planes List */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Body Planes List</h3>
                    <span className={styles.sectionBadge}>{planeFields.length}/8</span>
                  </div>

                  <Controller
                    name="planesPara"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Planes intro paragraph is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Intro Paragraph"
                        hint='e.g. "The three planes of movement in different postures of Yoga, and a Yoga teacher should have deep knowledge of them:"'
                        value={field.value || ""}
                        height={120}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <p className={styles.fieldHint} style={{ marginBottom: "0.9rem" }}>
                    Diagram label = text under image column · List item = numbered list text
                  </p>
                  <div className={styles.statsGrid}>
                    {planeFields.map((field, i) => (
                      <div key={field.id} className={styles.statRow}>
                        <div className={styles.statIndex}>{i + 1}</div>
                        <div className={styles.statFields}>
                          <div className={styles.inputWrap}>
                            <input
                              type="text" className={styles.input}
                              placeholder="e.g. Sagittal plane"
                              maxLength={40}
                              {...register(`bodyPlanes.${i}.label`)}
                            />
                          </div>
                          <div className={styles.inputWrap}>
                            <input
                              type="text" className={styles.input}
                              placeholder="e.g. Sagittal (Longitudinal) plane."
                              maxLength={60}
                              {...register(`bodyPlanes.${i}.listItem`)}
                            />
                          </div>
                        </div>
                        <button
                          type="button" className={styles.removeStatBtn}
                          onClick={() => removePlane(i)}
                          disabled={planeFields.length <= 1}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  {planeFields.length < 8 && (
                    <button
                      type="button" className={styles.addStatBtn}
                      onClick={() => appendPlane({ label: "", listItem: "" })}
                    >+ Add Plane</button>
                  )}
                </div>

                <div className={styles.formDivider} />

                {/* Highlight Keywords */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Highlight Keywords</h3>
                  </div>
                  {([
                    { name: "highlight1" as const, label: "Highlight Text 1", ph: "e.g. 200 Hour Yoga TTC in Rishikesh with Alignment Focus" },
                    { name: "highlight2" as const, label: "Highlight Text 2", ph: "e.g. Advanced Yoga Teacher Training with Alignment in Rishikesh." },
                  ]).map(({ name, label, ph }) => (
                    <div key={name} className={styles.fieldGroup}>
                      <label className={styles.label}>
                        <span className={styles.labelIcon}>✦</span>{label}
                        <span className={styles.required}>*</span>
                      </label>
                      <div className={`${styles.inputWrap} ${errors[name] ? styles.inputError : ""} ${watchedValues[name] && !errors[name] ? styles.inputSuccess : ""}`}>
                        <input
                          type="text" className={styles.input}
                          placeholder={ph} maxLength={160}
                          {...register(name, { required: `${label} is required` })}
                        />
                        <span className={styles.charCount}>{(watchedValues[name] || "").length}/160</span>
                      </div>
                      {errors[name] && <p className={styles.errorMsg}>⚠ {errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>

                <div className={styles.formDivider} />

                {/* Outdoor Group Photo */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Outdoor Group Yoga Photo</h3>
                    <span className={styles.sectionBadge}>yogaoutdoor image</span>
                  </div>
                  <ImageUploadField
                    label="Outdoor Yoga Practice Photo"
                    hint="Full-width banner image shown at the bottom of the Alignment section"
                    file={outdoorImageFile}
                    altText={watchedValues.outdoorImageAlt || ""}
                    altPlaceholder="e.g. Outdoor Yoga Practice by the Ganges, Rishikesh"
                    errorMsg={imgErrors.outdoorImage}
                    required
                    onFileChange={(f) => {
                      setOutdoorImageFile(f);
                      if (f) setImgErrors((p) => ({ ...p, outdoorImage: undefined }));
                    }}
                    onAltChange={(v) => setValue("outdoorImageAlt", v)}
                  />
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Photo Overlay Caption
                    </label>
                    <p className={styles.fieldHint}>Text shown on the dark overlay strip at the bottom of the photo</p>
                    <div className={styles.inputWrap}>
                      <input
                        type="text" className={styles.input}
                        placeholder="e.g. 🌊 Outdoor Yoga Practice by the Ganges, Rishikesh"
                        maxLength={120}
                        {...register("outdoorCaption")}
                      />
                      <span className={styles.charCount}>{(watchedValues.outdoorCaption || "").length}/120</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ══════════ TAB 2: CAMPUS ══════════ */}
            {activeTab === "campus" && (
              <>
                {/* Campus Title */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Campus Section Heading</h3>
                  </div>
                  <Controller
                    name="campusTitle"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Campus section title is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Section Title (H2)"
                        hint='e.g. "Campus: AYM Yoga school / Yoga ashram in Rishikesh"'
                        value={field.value || ""}
                        height={120}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className={styles.formDivider} />

                {/* Campus Facilities */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Campus Facilities</h3>
                    <span className={styles.sectionBadge}>{facilityFields.length}/20</span>
                  </div>
                  <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                    Each facility item appears as a <strong>bold label</strong> + description text on the frontend.
                    You can also add an optional photo per facility.
                  </p>

                  <div className={styles.statsGrid}>
                    {facilityFields.map((field, i) => {
                      const isOpen  = expandedFacilities.has(i);
                      const boldVal = watchedValues.campusFacilities?.[i]?.bold || "";
                      const textVal = watchedValues.campusFacilities?.[i]?.text || "";
                      // ✅ show 📷 badge in header when a file is selected
                      const hasImg  = !!facilityImageFiles[i];
                      return (
                        <div key={field.id} style={{ border: "1.5px solid #e8d5b5", borderRadius: "10px", overflow: "hidden", background: "#fffdf8" }}>
                          {/* Accordion Header */}
                          <div
                            onClick={() => toggleFacility(i)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", cursor: "pointer", background: isOpen ? "rgba(224,123,0,0.06)" : "transparent", borderBottom: isOpen ? "1px solid #e8d5b5" : "none", transition: "background 0.2s" }}
                          >
                            <div className={styles.statIndex} style={{ margin: 0 }}>{i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "0.72rem", fontWeight: 600, color: "#5c2d00", letterSpacing: "0.04em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {boldVal || `Facility ${i + 1}`}
                              </p>
                              {!isOpen && textVal && (
                                <p
                                  style={{ margin: "0.1rem 0 0", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", color: "#a07840", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                  dangerouslySetInnerHTML={{ __html: textVal.slice(0, 80) + (textVal.length > 80 ? "…" : "") }}
                                />
                              )}
                            </div>
                            {/* ✅ photo badge — same as edit form */}
                            {hasImg && (
                              <span style={{ fontSize: "0.7rem", color: "#2a5e1e", background: "rgba(42,94,30,0.1)", border: "1px solid rgba(42,94,30,0.2)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "'Cinzel',serif", flexShrink: 0 }}>📷</span>
                            )}
                            <span style={{ color: "#a07840", fontSize: "0.8rem", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                            <button
                              type="button" className={styles.removeStatBtn} style={{ margin: 0, flexShrink: 0 }}
                              onClick={(e) => { e.stopPropagation(); handleRemoveFacility(i); }}
                              disabled={facilityFields.length <= 1}
                            >✕</button>
                          </div>

                          {/* Expanded */}
                          {isOpen && (
                            <div style={{ padding: "1rem" }}>
                              <div className={styles.fieldGroup} style={{ marginBottom: "1rem" }}>
                                <label className={styles.label} style={{ marginBottom: "0.3rem" }}>
                                  <span className={styles.labelIcon}>✦</span> Bold Label
                                </label>
                                <p className={styles.fieldHint}>e.g. "Location:" or "AYM Garden:"</p>
                                <div className={styles.inputWrap}>
                                  <input
                                    type="text" className={styles.input}
                                    placeholder='e.g. Location: or AYM Garden:'
                                    maxLength={80}
                                    {...register(`campusFacilities.${i}.bold`)}
                                  />
                                  <span className={styles.charCount}>{boldVal.length}/80</span>
                                </div>
                              </div>

                              <div className={styles.fieldGroup} style={{ marginBottom: "0.5rem" }}>
                                <label className={styles.label} style={{ marginBottom: "0.3rem" }}>
                                  <span className={styles.labelIcon}>✦</span> Description Text
                                </label>
                                <Controller
                                  name={`campusFacilities.${i}.text`}
                                  control={control}
                                  render={({ field }) => (
                                    <JoditField
                                      label=""
                                      value={field.value || ""}
                                      height={180}
                                      onChange={field.onChange}
                                    />
                                  )}
                                />
                              </div>

                              {/* ✅ Facility image upload — same component as edit form */}
                              <FacilityImageUpload
                                file={facilityImageFiles[i] ?? null}
                                altText={watchedValues.campusFacilities?.[i]?.imageAlt || ""}
                                onFileChange={(f) => {
                                  setFacilityImageFiles((prev) => {
                                    const updated = [...prev];
                                    updated[i] = f;
                                    return updated;
                                  });
                                }}
                                onAltChange={(v) =>
                                  setValue(`campusFacilities.${i}.imageAlt`, v)
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {facilityFields.length < 20 && (
                    <button
                      type="button" className={styles.addStatBtn}
                      onClick={addFacility} style={{ marginTop: "0.9rem" }}
                    >+ Add Facility</button>
                  )}
                </div>

                <div className={styles.formDivider} />

                {/* Promo Cards */}
                {(["promoCard1", "promoCard2"] as const).map((cardKey, ci) => (
                  <div key={cardKey}>
                    <div className={styles.sectionBlock}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.sectionIcon}>✦</span>
                        <h3 className={styles.sectionTitle}>Promo Card {ci + 1}</h3>
                        <span className={styles.sectionBadge}>{ci === 0 ? "Yoga for Beginners" : "Yoga in India"}</span>
                      </div>

                      <Controller
                        name={`${cardKey}.title`}
                        control={control}
                        rules={{ validate: (v) => !!plain(v || "") || `Promo card ${ci + 1} title is required` }}
                        render={({ field, fieldState }) => (
                          <JoditField
                            label="Card Title"
                            value={field.value || ""}
                            height={120}
                            required
                            errorMsg={fieldState.error?.message}
                            onChange={field.onChange}
                          />
                        )}
                      />

                      <Controller
                        name={`${cardKey}.text`}
                        control={control}
                        rules={{ validate: (v) => !!plain(v || "") || `Promo card ${ci + 1} text is required` }}
                        render={({ field, fieldState }) => (
                          <JoditField
                            label="Card Text"
                            value={field.value || ""}
                            height={220}
                            required
                            errorMsg={fieldState.error?.message}
                            onChange={field.onChange}
                          />
                        )}
                      />

                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          <span className={styles.labelIcon}>✦</span>
                          "More information" Link<span className={styles.required}>*</span>
                        </label>
                        <div className={`${styles.inputWrap} ${styles.inputWithPrefix} ${errors[cardKey]?.link ? styles.inputError : ""} ${watchedValues[cardKey]?.link && !errors[cardKey]?.link ? styles.inputSuccess : ""}`}>
                          <span className={styles.inputPrefix}>🔗</span>
                          <input
                            type="text"
                            className={`${styles.input} ${styles.inputPrefixed}`}
                            placeholder="/yoga-for-beginners or https://…"
                            {...register(`${cardKey}.link`, { required: `Promo card ${ci + 1} link is required` })}
                          />
                        </div>
                        {errors[cardKey]?.link && (
                          <p className={styles.errorMsg}>⚠ {errors[cardKey]?.link?.message}</p>
                        )}
                      </div>
                    </div>
                    {ci === 0 && <div className={styles.formDivider} />}
                  </div>
                ))}
              </>
            )}

            {/* ══════════ TAB 3: CTA ══════════ */}
            {activeTab === "cta" && (
              <>
                {/* CTA Banner */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>CTA Banner</h3>
                  </div>

                  <Controller
                    name="ctaHeading"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "CTA heading is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="CTA Heading"
                        hint='e.g. "Begin Your Journey to Inner Peace"'
                        value={field.value || ""}
                        height={120}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <Controller
                    name="ctaSubtext"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "CTA subtext is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="CTA Subtext"
                        hint='e.g. "Transform your mind, body, and spirit with our expert-led yoga classes."'
                        value={field.value || ""}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      WhatsApp Button Link<span className={styles.required}>*</span>
                    </label>
                    <div className={`${styles.inputWrap} ${errors.whatsappLink ? styles.inputError : ""} ${watchedValues.whatsappLink && !errors.whatsappLink ? styles.inputSuccess : ""}`}>
                      <input
                        type="text" className={styles.input}
                        placeholder="e.g. https://wa.me/918476898395"
                        maxLength={120}
                        {...register("whatsappLink", { required: "WhatsApp link is required" })}
                      />
                      <span className={styles.charCount}>{(watchedValues.whatsappLink || "").length}/120</span>
                    </div>
                    {errors.whatsappLink && <p className={styles.errorMsg}>⚠ {errors.whatsappLink.message}</p>}
                  </div>
                </div>

                <div className={styles.formDivider} />

                {/* Master Quote */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Master Quote Block</h3>
                  </div>

                  <Controller
                    name="masterQuote"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Master quote is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Quote Text"
                        hint='e.g. "The beauty of Yoga is, it shows you fitness with a side of spirituality and happiness."'
                        value={field.value || ""}
                        height={150}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Attribution
                      <span className={styles.required}>*</span>
                    </label>
                    <div className={`${styles.inputWrap} ${errors.masterAttrib ? styles.inputError : ""} ${watchedValues.masterAttrib && !errors.masterAttrib ? styles.inputSuccess : ""}`}>
                      <input
                        type="text" className={styles.input}
                        placeholder="e.g. — Yogi Chetan Mahesh Ji"
                        maxLength={100}
                        {...register("masterAttrib", { required: "Attribution is required" })}
                      />
                      <span className={styles.charCount}>{(watchedValues.masterAttrib || "").length}/100</span>
                    </div>
                    {errors.masterAttrib && <p className={styles.errorMsg}>⚠ {errors.masterAttrib.message}</p>}
                  </div>
                </div>

                <div className={styles.formDivider} />

                {/* Journey Paragraphs */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Journey Paragraphs</h3>
                    <span className={styles.sectionBadge}>{journeyFields.length}/8</span>
                  </div>
                  <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                    Motivational body text shown below the master quote
                  </p>
                  <div className={styles.statsGrid}>
                    {journeyFields.map((field, i) => (
                      <div
                        key={field.id}
                        className={`${styles.statRow} ${styles.journeyRow}`}
                        style={{ alignItems: "flex-start" }}
                      >
                        <div className={styles.statIndex} style={{ marginTop: "0.5rem" }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <Controller
                            name={`journeyParas.${i}.text`}
                            control={control}
                            render={({ field }) => (
                              <JoditField
                                label=""
                                value={field.value || ""}
                                height={180}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                        <button
                          type="button" className={styles.removeStatBtn} style={{ marginTop: "0.5rem" }}
                          onClick={() => removeJourney(i)}
                          disabled={journeyFields.length <= 1}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  {journeyFields.length < 8 && (
                    <button
                      type="button" className={styles.addStatBtn}
                      onClick={() => appendJourney({ text: "" })}
                    >+ Add Paragraph</button>
                  )}
                </div>

                <div className={styles.formDivider} />

                {/* Closing Namaste */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Closing Namaste Text</h3>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Closing Line
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>Final text before "Namaste!" e.g. "May you always be happy, healthy and peaceful."</p>
                    <div className={`${styles.inputWrap} ${errors.namesteText ? styles.inputError : ""} ${watchedValues.namesteText && !errors.namesteText ? styles.inputSuccess : ""}`}>
                      <input
                        type="text" className={styles.input}
                        placeholder="e.g. May you always be happy, healthy and peaceful."
                        maxLength={200}
                        {...register("namesteText", { required: "Namaste closing text is required" })}
                      />
                      <span className={styles.charCount}>{(watchedValues.namesteText || "").length}/200</span>
                    </div>
                    {errors.namesteText && <p className={styles.errorMsg}>⚠ {errors.namesteText.message}</p>}
                  </div>
                </div>
              </>
            )}

            <div className={styles.formDivider} />

            {/* Bottom Actions */}
            <div className={styles.formActionsRow}>
              <div className={styles.tabNavBtns}>
                {activeTab !== "alignment" && (
                  <button
                    type="button" className={styles.tabPrevBtn}
                    onClick={() => setActiveTab(activeTab === "cta" ? "campus" : "alignment")}
                  >← Previous</button>
                )}
                {activeTab !== "cta" && (
                  <button
                    type="button" className={styles.tabNextBtn}
                    onClick={() => setActiveTab(activeTab === "alignment" ? "campus" : "cta")}
                  >Next →</button>
                )}
              </div>
              <div className={styles.formActions}>
                <Link href="/admin/dashboard/aymfullpage" className={styles.cancelBtn}>← Cancel</Link>
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? <><span className={styles.spinner} /> Saving…</>
                    : <><span>✦</span> Save All Content</>}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}