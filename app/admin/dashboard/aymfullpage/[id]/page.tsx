"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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

// Note: File objects are managed in separate state (not in RHF) since they
// cannot be part of defaultValues. imageUrl holds the existing server path.
interface CampusFacility {
  bold: string;
  text: string;
  imageAlt: string;
  imageUrl?: string;
}

interface FormValues {
  alignTitle:          string;
  salutation:          string;
  alignPara1:          string;
  alignPara2:          string;
  alignPara3:          string;
  bodyPlanes:          BodyPlaneItem[];
  planesPara:          string;
  bodyPlanesImageAlt:  string;
  bodyPlanesImageUrl:  string;   // existing server URL (kept for validation)
  outdoorImageAlt:     string;
  outdoorImageUrl:     string;   // existing server URL (kept for validation)
  outdoorCaption:      string;
  highlight1:          string;
  highlight2:          string;
  campusTitle:         string;
  campusFacilities:    CampusFacility[];
  promoCard1:          PromoCard;
  promoCard2:          PromoCard;
  ctaHeading:          string;
  ctaSubtext:          string;
  whatsappLink:        string;
  masterQuote:         string;
  masterAttrib:        string;
  journeyParas:        JourneyPara[];
  namesteText:         string;
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
  existingUrl?:   string;
  altText:        string;
  altPlaceholder: string;
  errorMsg?:      string;
  required?:      boolean;
  onFileChange:   (file: File | null) => void;
  onAltChange:    (alt: string) => void;
}

function ImageUploadField({
  label, hint, file, existingUrl, altText, altPlaceholder,
  errorMsg, required, onFileChange, onAltChange,
}: ImageUploadFieldProps) {
  const inputRef                = useRef<HTMLInputElement>(null);
  const [preview, setPreview]   = useState<string | null>(existingUrl ?? null);
  const [dragOver, setDragOver] = useState(false);
  const isExisting              = !file && !!existingUrl && preview === existingUrl;

  useEffect(() => {
    if (existingUrl && !file) setPreview(existingUrl);
  }, [existingUrl]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target?.result as string);
    r.readAsDataURL(f);
    onFileChange(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  };

  const handleRemove = () => {
    setPreview(null); onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
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
          <p className={styles.dropText}>Drag & drop image here or <span className={styles.dropBrowse}>browse</span></p>
          <p className={styles.dropMeta}>PNG · JPG · WEBP · Max 5 MB</p>
          <input ref={inputRef} type="file" accept="image/*" className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>
      ) : (
        <div className={styles.imagePreviewWrap}>
          {isExisting && <div className={styles.existingImageBadge}>✓ Current Image</div>}
          <img src={preview} alt="Preview" className={styles.imagePreview} />
          <div className={styles.imagePreviewOverlay}>
            <button type="button" className={styles.imageRemoveBtn} onClick={handleRemove}>✕ Remove</button>
            <button type="button" className={styles.imageChangeBtn} onClick={() => inputRef.current?.click()}>✎ Change</button>
          </div>
          {file       && <div className={styles.imageFileName}>{file.name}</div>}
          {isExisting && <div className={styles.imageFileName} style={{ color: "#5a7c52" }}>Saved on server — upload new file to replace</div>}
          <input ref={inputRef} type="file" accept="image/*" className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>
      )}

      {errorMsg && <p className={styles.errorMsg}>⚠ {errorMsg}</p>}

      <div className={`${styles.inputWrap} ${styles.altInputWrap}`}>
        <input type="text" className={styles.input} placeholder={altPlaceholder}
          value={altText} maxLength={120} onChange={(e) => onAltChange(e.target.value)} />
        <span className={styles.charCount}>{altText.length}/120</span>
      </div>
      <p className={styles.fieldHint} style={{ marginTop: "0.4rem" }}>Alt text — important for SEO &amp; accessibility</p>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FACILITY IMAGE UPLOAD (compact)
══════════════════════════════════════════════ */
interface FacilityImageProps {
  file:         File | null;
  existingUrl?: string;
  altText:      string;
  onFileChange: (f: File | null) => void;
  onAltChange:  (v: string) => void;
}

function FacilityImageUpload({
  file, existingUrl, altText, onFileChange, onAltChange,
}: FacilityImageProps) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const isExisting            = !file && !!existingUrl && preview === existingUrl;

  useEffect(() => { if (existingUrl && !file) setPreview(existingUrl); }, [existingUrl]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = (e) => setPreview(e.target?.result as string);
    r.readAsDataURL(f);
    onFileChange(f);
  };

  const handleRemove = () => {
    setPreview(null); onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <p className={styles.fieldHint} style={{ marginBottom: "0.5rem" }}>🖼 Optional facility photo</p>
      {!preview ? (
        <div className={styles.imageDropZone} style={{ padding: "1rem", marginBottom: "0.5rem" }}
          onClick={() => inputRef.current?.click()}>
          <span style={{ fontSize: "1.2rem" }}>📷</span>
          <p className={styles.dropText} style={{ fontSize: "0.8rem" }}>Click to upload facility photo</p>
          <p className={styles.dropMeta}>PNG · JPG · WEBP · Max 5 MB</p>
          <input ref={inputRef} type="file" accept="image/*" className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>
      ) : (
        <div className={styles.imagePreviewWrap} style={{ marginBottom: "0.5rem", maxHeight: "160px" }}>
          {isExisting && <div className={styles.existingImageBadge}>✓ Current</div>}
          <img src={preview} alt="Facility" className={styles.imagePreview} style={{ maxHeight: "140px" }} />
          <div className={styles.imagePreviewOverlay}>
            <button type="button" className={styles.imageRemoveBtn} onClick={handleRemove}>✕ Remove</button>
            <button type="button" className={styles.imageChangeBtn} onClick={() => inputRef.current?.click()}>✎ Change</button>
          </div>
          {file       && <div className={styles.imageFileName}>{file.name}</div>}
          {isExisting && <div className={styles.imageFileName} style={{ color: "#5a7c52" }}>Saved — upload new to replace</div>}
          <input ref={inputRef} type="file" accept="image/*" className={styles.fileInputHidden}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        </div>
      )}
      <div className={styles.inputWrap}>
        <input type="text" className={styles.input} placeholder="Alt text for this facility photo"
          value={altText} maxLength={120} onChange={(e) => onAltChange(e.target.value)} />
        <span className={styles.charCount}>{altText.length}/120</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EDIT PAGE
══════════════════════════════════════════════ */
export default function EditAYMFullPagePage() {
  const router = useRouter();

  /* ── File state (kept outside RHF — File objects can't be in defaultValues) ── */
  const [bodyPlanesImageFile,  setBodyPlanesImageFile]  = useState<File | null>(null);
  const [outdoorImageFile,     setOutdoorImageFile]     = useState<File | null>(null);
  const [facilityImageFiles,   setFacilityImageFiles]   = useState<(File | null)[]>([]);

  const [isLoading,    setIsLoading]    = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [activeTab,    setActiveTab]    = useState<TabKey>("alignment");
  const [expandedFacilities, setExpandedFacilities] = useState<Set<number>>(new Set());

  /* ── React Hook Form ── */
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty },
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
      bodyPlanesImageUrl: "",
      outdoorImageAlt:    "",
      outdoorImageUrl:    "",
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

  /* ── Watch (for char counts & conditionals) ── */
  const watchedValues = watch();

  /* ── Has changes ── */
  const hasFileChange = !!bodyPlanesImageFile || !!outdoorImageFile || facilityImageFiles.some(Boolean);
  const hasChanges    = isDirty || hasFileChange;

  /* ── Plain-text extractor ── */
  const plain = (html: string) => html.replace(/<[^>]*>/g, "").trim();

 
 const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const toAbsUrl = (path: string | undefined | null): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BASE}${path}`;
  };

  /* ══════════════════════════════════════════════
     FETCH
  ══════════════════════════════════════════════ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/aym-full-page/get");
        const raw = res.data.data;

        if (!raw) {
          toast.error("No record found. Please create one first.");
          router.push("/admin/dashboard/aymfullpage");
          return;
        }

        const mapped: FormValues = {
          alignTitle:         raw.alignTitle         ?? "",
          salutation:         raw.salutation         ?? "",
          alignPara1:         raw.alignPara1         ?? "",
          alignPara2:         raw.alignPara2         ?? "",
          alignPara3:         raw.alignPara3         ?? "",
          bodyPlanes:         raw.bodyPlanes         ?? [],
          planesPara:         raw.planesPara         ?? "",
          bodyPlanesImageAlt: raw.bodyPlanesImageAlt ?? "",
          bodyPlanesImageUrl: toAbsUrl(raw.bodyPlanesImage),   // ✅ full URL
          outdoorImageAlt:    raw.outdoorImageAlt    ?? "",
          outdoorImageUrl:    toAbsUrl(raw.outdoorImage),       // ✅ full URL
          outdoorCaption:     raw.outdoorCaption     ?? "",
          highlight1:         raw.highlight1         ?? "",
          highlight2:         raw.highlight2         ?? "",
          campusTitle:        raw.campusTitle        ?? "",
          campusFacilities:   (raw.campusFacilities ?? []).map((f: any) => ({
            bold:     f.bold     ?? "",
            text:     f.text     ?? "",
            imageAlt: f.imageAlt ?? "",
            imageUrl: toAbsUrl(f.imageUrl),   // ✅ full URL
          })),
          promoCard1:  {
            title: raw.promoCard1?.title ?? "",
            text:  raw.promoCard1?.text  ?? "",
            link:  raw.promoCard1?.link  ?? "",
          },
          promoCard2:  {
            title: raw.promoCard2?.title ?? "",
            text:  raw.promoCard2?.text  ?? "",
            link:  raw.promoCard2?.link  ?? "",
          },
          ctaHeading:   raw.ctaHeading   ?? "",
          ctaSubtext:   raw.ctaSubtext   ?? "",
          whatsappLink: raw.whatsappLink ?? "",
          masterQuote:  raw.masterQuote  ?? "",
          masterAttrib: raw.masterAttrib ?? "",
          journeyParas: raw.journeyParas ?? [],
          namesteText:  raw.namesteText  ?? "",
        };

        // reset() sets isDirty = false after initial population
        reset(mapped);
        setFacilityImageFiles(
          new Array((raw.campusFacilities ?? []).length).fill(null)
        );
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load page data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* Loading screen */
  if (isLoading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingOm}>ॐ</div>
        <p className={styles.loadingText}>Loading page content…</p>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     HELPERS
  ══════════════════════════════════════════════ */

  /* Tab error detection using RHF errors */
  const tabHasError = (tab: TabKey): boolean => {
    if (tab === "alignment") {
      return !!(
        errors.alignTitle || errors.salutation ||
        errors.alignPara1 || errors.alignPara2 || errors.alignPara3 ||
        errors.planesPara || errors.bodyPlanesImageUrl || errors.outdoorImageUrl ||
        errors.highlight1 || errors.highlight2
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

  /* Facility helpers */
  const addFacility = () => {
    if (facilityFields.length >= 20) return;
    const idx = facilityFields.length;
    appendFacility({ bold: "", text: "", imageAlt: "", imageUrl: "" });
    setFacilityImageFiles((prev) => [...prev, null]);
    setExpandedFacilities((prev) => new Set(prev).add(idx));
  };

  const handleRemoveFacility = (i: number) => {
    removeFacility(i);
    setFacilityImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setExpandedFacilities((prev) => {
      const n = new Set<number>();
      prev.forEach((v) => {
        if (v < i) n.add(v);
        else if (v > i) n.add(v - 1);
      });
      return n;
    });
  };

  const toggleFacility = (i: number) =>
    setExpandedFacilities((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  /* ══════════════════════════════════════════════
     SUBMIT  →  PUT /aym-full-page/update
  ══════════════════════════════════════════════ */
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    /* ── Validate file-only fields (not in RHF registry) ── */
    let fileError = false;
    if (!bodyPlanesImageFile && !data.bodyPlanesImageUrl) {
      setError("bodyPlanesImageUrl", { message: "Body planes diagram image is required" });
      fileError = true;
    }
    if (!outdoorImageFile && !data.outdoorImageUrl) {
      setError("outdoorImageUrl", { message: "Outdoor group photo is required" });
      fileError = true;
    }
    if (fileError) {
      setActiveTab("alignment");
      return;
    }

    try {
      setIsSubmitting(true);

      const fd = new FormData();

      /* ── Scalar text fields ── */
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
      fd.append("journeyParas",     JSON.stringify(data.journeyParas));
      fd.append("promoCard1",       JSON.stringify(data.promoCard1));
      fd.append("promoCard2",       JSON.stringify(data.promoCard2));
      fd.append("campusFacilities", JSON.stringify(data.campusFacilities));

      /* ── Facility images (indexed) ── */
      data.campusFacilities.forEach((_, i) => {
        if (facilityImageFiles[i]) fd.append(`facilityImage_${i}`, facilityImageFiles[i]!);
      });

      /* ── Main images — only if new file selected ── */
      if (bodyPlanesImageFile) fd.append("bodyPlanesImage", bodyPlanesImageFile);
      if (outdoorImageFile)    fd.append("outdoorImage",    outdoorImageFile);

      await api.put("/aym-full-page/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      toast.success("Changes saved successfully!");
      setTimeout(() => router.push("/admin/dashboard/aymfullpage"), 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Success screen */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Changes Saved!</h2>
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
      {/* ── Toast provider ── */}
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
          <span className={styles.breadcrumbCurrent}>Edit Content</span>
        </div>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Edit AYM Full Page Content</h1>
            <p className={styles.pageSubtitle}>Update all three sections — changes apply to the live page</p>
          </div>
        </div>

        {/* Unsaved-changes banner */}
        {hasChanges && (
          <div className={styles.changesNotice}>
            <span className={styles.changesIcon}>✎</span>
            You have unsaved changes — click{" "}
            <strong style={{ margin: "0 0.25rem" }}>Update Content</strong> to save.
          </div>
        )}

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

        {/* ── Wrap entire content in <form> so handleSubmit works ── */}
        <form onSubmit={handleSubmit(onSubmit, () => {
          // RHF validation failed — navigate to the first tab that has errors
          if (tabHasError("alignment"))   setActiveTab("alignment");
          else if (tabHasError("campus")) setActiveTab("campus");
          else                            setActiveTab("cta");
        })}>

          <div className={styles.formCard}>

            {/* ═══════════ TAB 1: ALIGNMENT ═══════════ */}
            {activeTab === "alignment" && (
              <>
                {/* ── Section Header ── */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Section Header</h3>
                  </div>

                  {/* alignTitle — Jodit via Controller */}
                  <Controller
                    name="alignTitle"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Alignment section title is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Section Title (H2)"
                        hint="Main heading for the Alignment & Adjustment section"
                        value={field.value || ""}
                        height={120}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* salutation — plain register */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>Salutation
                      <span className={styles.required}>*</span>
                    </label>
                    <p className={styles.fieldHint}>Greeting shown below the heading</p>
                    <div className={`${styles.inputWrap} ${errors.salutation ? styles.inputError : ""} ${watchedValues.salutation && !errors.salutation ? styles.inputSuccess : ""}`}>
                      <input
                        type="text"
                        className={styles.input}
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

                {/* ── Body Paragraphs ── */}
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
                    ] as const
                  ).map(({ name, label, hint }, i) => (
                    <Controller
                      key={name}
                      name={name}
                      control={control}
                      rules={{ validate: (v) => !!plain(v || "") || `Paragraph ${i + 1} is required` }}
                      render={({ field, fieldState }) => (
                        <JoditField
                          label={label}
                          hint={hint}
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

                {/* ── Body Planes Diagram Image — Two Column Layout ── */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Body Planes Diagram Image</h3>
                    <span className={styles.sectionBadge}>yogaBodyPlanes</span>
                  </div>
                  
                  <div className={styles.twoColumnSection}>
                    {/* Left: Upload Form */}
                    <div className={styles.twoColumnContent}>
                      <ImageUploadField
                        label="Alignment Diagram Image"
                        hint="Leave unchanged to keep the current image — upload a new file to replace it"
                        file={bodyPlanesImageFile}
                        existingUrl={watchedValues.bodyPlanesImageUrl}
                        altText={watchedValues.bodyPlanesImageAlt || ""}
                        altPlaceholder="e.g. Yoga body planes diagram - Sagittal, Coronal and Transverse planes"
                        errorMsg={errors.bodyPlanesImageUrl?.message}
                        required
                        onFileChange={(f) => {
                          setBodyPlanesImageFile(f);
                          if (f) clearErrors("bodyPlanesImageUrl");
                        }}
                        onAltChange={(v) => setValue("bodyPlanesImageAlt", v, { shouldDirty: true })}
                      />
                    </div>
                    
                    {/* Right: Image Preview */}
                    <div className={styles.twoColumnImage}>
                      {(bodyPlanesImageFile || watchedValues.bodyPlanesImageUrl) && (
                        <>
                          <div className={styles.twoColumnImagePreview}>
                            <img 
                              src={bodyPlanesImageFile ? URL.createObjectURL(bodyPlanesImageFile) : watchedValues.bodyPlanesImageUrl} 
                              alt={watchedValues.bodyPlanesImageAlt || "Body planes diagram preview"}
                            />
                          </div>
                          <p className={styles.twoColumnImageLabel}>
                            {watchedValues.bodyPlanesImageAlt || "Body Planes Diagram"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.formDivider} />

                {/* ── Body Planes List ── */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Body Planes List</h3>
                    <span className={styles.sectionBadge}>{planeFields.length}/8</span>
                  </div>

                  {/* planesPara — Jodit */}
                  <Controller
                    name="planesPara"
                    control={control}
                    rules={{ validate: (v) => !!plain(v || "") || "Planes intro paragraph is required" }}
                    render={({ field, fieldState }) => (
                      <JoditField
                        label="Intro Paragraph"
                        hint="Text shown above the numbered list"
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
                              type="text"
                              className={styles.input}
                              placeholder="Diagram label"
                              maxLength={40}
                              {...register(`bodyPlanes.${i}.label`)}
                            />
                          </div>
                          <div className={styles.inputWrap}>
                            <input
                              type="text"
                              className={styles.input}
                              placeholder="List item"
                              maxLength={60}
                              {...register(`bodyPlanes.${i}.listItem`)}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.removeStatBtn}
                          onClick={() => removePlane(i)}
                          disabled={planeFields.length <= 1}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  {planeFields.length < 8 && (
                    <button
                      type="button"
                      className={styles.addStatBtn}
                      onClick={() => appendPlane({ label: "", listItem: "" })}
                    >+ Add Plane</button>
                  )}
                </div>

                <div className={styles.formDivider} />

                {/* ── Highlight Keywords ── */}
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
                          type="text"
                          className={styles.input}
                          placeholder={ph}
                          maxLength={160}
                          {...register(name, { required: `${label} is required` })}
                        />
                        <span className={styles.charCount}>{(watchedValues[name] || "").length}/160</span>
                      </div>
                      {errors[name] && <p className={styles.errorMsg}>⚠ {errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>

                <div className={styles.formDivider} />

                {/* ── Outdoor Photo — Two Column Layout ── */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Outdoor Group Yoga Photo</h3>
                    <span className={styles.sectionBadge}>yogaoutdoor image</span>
                  </div>
                  
                  <div className={styles.twoColumnSection}>
                    {/* Left: Upload Form */}
                    <div className={styles.twoColumnContent}>
                      <ImageUploadField
                        label="Outdoor Yoga Practice Photo"
                        hint="Leave unchanged to keep the current image — upload a new file to replace it"
                        file={outdoorImageFile}
                        existingUrl={watchedValues.outdoorImageUrl}
                        altText={watchedValues.outdoorImageAlt || ""}
                        altPlaceholder="e.g. Outdoor Yoga Practice by the Ganges, Rishikesh"
                        errorMsg={errors.outdoorImageUrl?.message}
                        required
                        onFileChange={(f) => {
                          setOutdoorImageFile(f);
                          if (f) clearErrors("outdoorImageUrl");
                        }}
                        onAltChange={(v) => setValue("outdoorImageAlt", v, { shouldDirty: true })}
                      />
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>
                          <span className={styles.labelIcon}>✦</span>Photo Overlay Caption
                        </label>
                        <p className={styles.fieldHint}>Text shown on the dark overlay strip at the bottom of the photo</p>
                        <div className={styles.inputWrap}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 🌊 Outdoor Yoga Practice by the Ganges, Rishikesh"
                            maxLength={120}
                            {...register("outdoorCaption")}
                          />
                          <span className={styles.charCount}>{(watchedValues.outdoorCaption || "").length}/120</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right: Image Preview */}
                    <div className={styles.twoColumnImage}>
                      {(outdoorImageFile || watchedValues.outdoorImageUrl) && (
                        <>
                          <div className={styles.twoColumnImagePreview}>
                            <img 
                              src={outdoorImageFile ? URL.createObjectURL(outdoorImageFile) : watchedValues.outdoorImageUrl} 
                              alt={watchedValues.outdoorImageAlt || "Outdoor yoga practice preview"}
                            />
                          </div>
                          <p className={styles.twoColumnImageLabel}>
                            {watchedValues.outdoorImageAlt || "Outdoor Yoga Practice"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════ TAB 2: CAMPUS ═══════════ */}
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
                        hint="Main heading for the Campus section"
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

                {/* Campus Facilities accordion */}
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionIcon}>✦</span>
                    <h3 className={styles.sectionTitle}>Campus Facilities</h3>
                    <span className={styles.sectionBadge}>{facilityFields.length}/20</span>
                  </div>
                  <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                    Edit each facility's bold label, description, and optional photo. Click a row to expand.
                  </p>
                  <div className={styles.statsGrid}>
                    {facilityFields.map((field, i) => {
                      const isOpen = expandedFacilities.has(i);
                      const boldVal = watchedValues.campusFacilities?.[i]?.bold || "";
                      const textVal = watchedValues.campusFacilities?.[i]?.text || "";
                      const hasImg  = !!(watchedValues.campusFacilities?.[i]?.imageUrl || facilityImageFiles[i]);
                      return (
                        <div key={field.id} style={{ border: "1.5px solid #e8d5b5", borderRadius: "10px", overflow: "hidden", background: "#fffdf8" }}>
                          {/* Accordion Header */}
                          <div
                            onClick={() => toggleFacility(i)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem 1rem", cursor: "pointer", background: isOpen ? "rgba(224,123,0,0.06)" : "transparent", borderBottom: isOpen ? "1px solid #e8d5b5" : "none", transition: "background 0.2s" }}
                          >
                            <div className={styles.statIndex} style={{ margin: 0 }}>{i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontFamily: "'Cinzel',serif", fontSize: "0.72rem", fontWeight: 600, color: "#5c2d00", letterSpacing: "0.04em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {boldVal || `Facility ${i + 1}`}
                              </p>
                              {!isOpen && textVal && (
                                <p
                                  style={{ margin: "0.1rem 0 0", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.78rem", color: "#a07840", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                  dangerouslySetInnerHTML={{ __html: textVal.slice(0, 80) + (textVal.length > 80 ? "…" : "") }}
                                />
                              )}
                            </div>
                            {hasImg && (
                              <span style={{ fontSize: "0.7rem", color: "#2a5e1e", background: "rgba(42,94,30,0.1)", border: "1px solid rgba(42,94,30,0.2)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "'Cinzel',serif", flexShrink: 0 }}>📷</span>
                            )}
                            <span style={{ color: "#a07840", fontSize: "0.8rem", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                            <button
                              type="button"
                              className={styles.removeStatBtn}
                              style={{ margin: 0, flexShrink: 0 }}
                              onClick={(e) => { e.stopPropagation(); handleRemoveFacility(i); }}
                              disabled={facilityFields.length <= 1}
                            >✕</button>
                          </div>

                          {/* Expanded Fields */}
                          {isOpen && (
                            <div style={{ padding: "1rem" }}>
                              <div className={styles.fieldGroup} style={{ marginBottom: "1rem" }}>
                                <label className={styles.label} style={{ marginBottom: "0.3rem" }}>
                                  <span className={styles.labelIcon}>✦</span> Bold Label
                                </label>
                                <p className={styles.fieldHint}>e.g. "Location:" or "AYM Garden:"</p>
                                <div className={styles.inputWrap}>
                                  <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Location:"
                                    maxLength={80}
                                    {...register(`campusFacilities.${i}.bold`)}
                                  />
                                  <span className={styles.charCount}>{boldVal.length}/80</span>
                                </div>
                              </div>

                              {/* Facility description — Jodit */}
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

                              <FacilityImageUpload
                                file={facilityImageFiles[i] ?? null}
                                existingUrl={watchedValues.campusFacilities?.[i]?.imageUrl}
                                altText={watchedValues.campusFacilities?.[i]?.imageAlt || ""}
                                onFileChange={(f) => {
                                  setFacilityImageFiles((prev) => {
                                    const updated = [...prev];
                                    updated[i] = f;
                                    return updated;
                                  });
                                }}
                                onAltChange={(v) => setValue(`campusFacilities.${i}.imageAlt`, v, { shouldDirty: true })}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {facilityFields.length < 20 && (
                    <button
                      type="button"
                      className={styles.addStatBtn}
                      onClick={addFacility}
                      style={{ marginTop: "0.9rem" }}
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

                      {/* Card Title */}
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

                      {/* Card Text */}
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

                      {/* Card Link */}
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

            {/* ═══════════ TAB 3: CTA ═══════════ */}
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
                        value={field.value || ""}
                        required
                        errorMsg={fieldState.error?.message}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  {/* WhatsApp Link */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      <span className={styles.labelIcon}>✦</span>
                      WhatsApp Button Link<span className={styles.required}>*</span>
                    </label>
                    <div className={`${styles.inputWrap} ${errors.whatsappLink ? styles.inputError : ""} ${watchedValues.whatsappLink && !errors.whatsappLink ? styles.inputSuccess : ""}`}>
                      <input
                        type="text"
                        className={styles.input}
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
                        type="text"
                        className={styles.input}
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
                          type="button"
                          className={styles.removeStatBtn}
                          style={{ marginTop: "0.5rem" }}
                          onClick={() => removeJourney(i)}
                          disabled={journeyFields.length <= 1}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  {journeyFields.length < 8 && (
                    <button
                      type="button"
                      className={styles.addStatBtn}
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
                        type="text"
                        className={styles.input}
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
                    type="button"
                    className={styles.tabPrevBtn}
                    onClick={() => setActiveTab(activeTab === "cta" ? "campus" : "alignment")}
                  >← Previous</button>
                )}
                {activeTab !== "cta" && (
                  <button
                    type="button"
                    className={styles.tabNextBtn}
                    onClick={() => setActiveTab(activeTab === "alignment" ? "campus" : "cta")}
                  >Next →</button>
                )}
              </div>
              <div className={styles.formActions}>
                <Link href="/admin/dashboard/aymfullpage" className={styles.cancelBtn}>← Cancel</Link>
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""} ${!hasChanges ? styles.submitBtnDisabled : ""}`}
                  disabled={isSubmitting || !hasChanges}
                >
                  {isSubmitting
                    ? <><span className={styles.spinner} /> Saving…</>
                    : <><span>✦</span> Update Content</>}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}