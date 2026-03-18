"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/dashboard/Classcampusameniti/Classcampusamenities.module.css";
import api from "@/lib/api";

// ── JoditEditor (SSR disabled — it needs the browser DOM) ──
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface FormData {
  classSizeSuperLabel: string;
  classSizeTitle: string;
  classSizeWelcomeText: string;
  classSizeHighlight: string;
  classSizePara: string;
  campusSuperLabel: string;
  campusTitle: string;
  campusHighlight: string;
  campusPara: string;
  amenitiesSuperLabel: string;
  amenitiesTitle: string;
  amenitiesMainPara: string;
  amenitiesSubLabel: string;
  amenities: string[];
  amenityMosaicTag: string;
}

/* ─────────────────────────────────────────
   Reusable single-image uploader
───────────────────────────────────────── */
interface SingleImageProps {
  preview: string;
  badge?: string;
  hint: string;
  error?: string;
  onSelect: (file: File, preview: string) => void;
  onRemove: () => void;
}

function SingleImageUpload({ preview, badge, hint, error, onSelect, onRemove }: SingleImageProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file, URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={handleChange} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload Image</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="preview" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={handleChange} />
            </div>
            <button type="button" className={styles.removeImageBtn}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Jodit config (stable reference)
───────────────────────────────────────── */
const joditConfig = {
  readonly: false,
  height: 220,
  toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "strikethrough", "|",
    "ul", "ol", "|",
    "outdent", "indent", "|",
    "font", "fontsize", "paragraph", "|",
    "superscript", "subscript", "|",
    "align", "|",
    "undo", "redo", "|",
    "hr", "eraser", "copyformat", "|",
    "fullsize",
  ],
  style: { fontFamily: "inherit", fontSize: "14px" },
  placeholder: "",
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export default function AddClassCampusAmenitiesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  // ── Image states (outside RHF — file inputs are uncontrolled) ──
  const [classSizeImageFile, setClassSizeImageFile]       = useState<File | null>(null);
  const [classSizeImagePreview, setClassSizeImagePreview] = useState("");
  const [classSizeImageError, setClassSizeImageError]     = useState("");

  const [campusImageFile, setCampusImageFile]       = useState<File | null>(null);
  const [campusImagePreview, setCampusImagePreview] = useState("");
  const [campusImageError, setCampusImageError]     = useState("");

  const [amenityImageFile, setAmenityImageFile]       = useState<File | null>(null);
  const [amenityImagePreview, setAmenityImagePreview] = useState("");
  const [amenityImageError, setAmenityImageError]     = useState("");

  /* ── react-hook-form ── */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      classSizeSuperLabel: "",
      classSizeTitle: "",
      classSizeWelcomeText: "",
      classSizeHighlight: "",
      classSizePara: "",
      campusSuperLabel: "",
      campusTitle: "",
      campusHighlight: "",
      campusPara: "",
      amenitiesSuperLabel: "",
      amenitiesTitle: "",
      amenitiesMainPara: "",
      amenitiesSubLabel: "",
      amenities: [""],
      amenityMosaicTag: "",
    },
  });

  // Watch values needed for char counts + amenity list UI
  const amenities           = watch("amenities");
  const classSizeSuperLabel  = watch("classSizeSuperLabel");
  const classSizeTitle       = watch("classSizeTitle");
  const classSizeWelcomeText = watch("classSizeWelcomeText");
  const classSizeHighlight   = watch("classSizeHighlight");
  const campusSuperLabel     = watch("campusSuperLabel");
  const campusTitle          = watch("campusTitle");
  const campusHighlight      = watch("campusHighlight");
  const amenitiesSuperLabel  = watch("amenitiesSuperLabel");
  const amenitiesTitle       = watch("amenitiesTitle");
  const amenitiesSubLabel    = watch("amenitiesSubLabel");
  const amenityMosaicTag     = watch("amenityMosaicTag");

  /* ── Amenity helpers ── */
  const updateAmenity = (i: number, val: string) => {
    const updated = [...amenities];
    updated[i] = val;
    setValue("amenities", updated, { shouldValidate: true });
  };
  const addAmenity = () => {
    if (amenities.length >= 10) return;
    setValue("amenities", [...amenities, ""]);
  };
  const removeAmenity = (i: number) => {
    setValue("amenities", amenities.filter((_, idx) => idx !== i));
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    // Images are outside RHF — validate manually
    let hasImgError = false;
    if (!classSizeImageFile) { setClassSizeImageError("Class size image is required"); hasImgError = true; }
    if (!campusImageFile)    { setCampusImageError("Campus photo is required");        hasImgError = true; }
    if (!amenityImageFile)   { setAmenityImageError("Amenity room image is required"); hasImgError = true; }
    if (hasImgError) return;

    try {
      setIsSubmitting(true);

      const fd = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => fd.append(key, item));
        } else {
          fd.append(key, value as string);
        }
      });

      fd.append("classSizeImage", classSizeImageFile!);
      fd.append("campusImage_0", campusImageFile!);
      fd.append("amenityImage", amenityImageFile!);

      await api.post("/class-campus-amenities/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/Classcampusameniti"), 1500);

    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Something went wrong");
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

  return (
    <div className={styles.page}>

      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/dashboard/Classcampusameniti")}>
          Class, Campus & Amenities
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Add Class, Campus & Amenities</h1>
          <p className={styles.pageSubtitle}>Fill in all details to configure this section</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══════════════════════════════════════
            BLOCK 1 — CLASS SIZE
        ══════════════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>AYM Class Size Block</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Label<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Small label above the title (e.g. Small Batches · Personal Attention)</p>
            <div className={`${styles.inputWrap} ${errors.classSizeSuperLabel ? styles.inputError : ""} ${classSizeSuperLabel && !errors.classSizeSuperLabel ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Small Batches · Personal Attention"
                maxLength={80}
                {...register("classSizeSuperLabel", { required: "Super label is required" })} />
              <span className={styles.charCount}>{classSizeSuperLabel?.length ?? 0}/80</span>
            </div>
            {errors.classSizeSuperLabel && <p className={styles.errorMsg}>⚠ {errors.classSizeSuperLabel.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Block Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Main heading for this block</p>
            <div className={`${styles.inputWrap} ${errors.classSizeTitle ? styles.inputError : ""} ${classSizeTitle && !errors.classSizeTitle ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. AYM CLASS SIZE"
                maxLength={60}
                {...register("classSizeTitle", { required: "Title is required" })} />
              <span className={styles.charCount}>{classSizeTitle?.length ?? 0}/60</span>
            </div>
            {errors.classSizeTitle && <p className={styles.errorMsg}>⚠ {errors.classSizeTitle.message}</p>}
          </div>

          {/* ── Class Size Image ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Class Group Photo<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Main image in the class size block — the script overlay text appears on top of this image</p>
            <SingleImageUpload
              preview={classSizeImagePreview}
              badge="AYM Class Group Photo"
              hint="JPG / PNG / WebP · Recommended 800×600px"
              error={classSizeImageError}
              onSelect={(file, preview) => {
                setClassSizeImageFile(file);
                setClassSizeImagePreview(preview);
                setClassSizeImageError("");
              }}
              onRemove={() => { setClassSizeImageFile(null); setClassSizeImagePreview(""); }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Overlay Text<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Script text shown as overlay on the class image (e.g. Welcome to AYM Family)</p>
            <div className={`${styles.inputWrap} ${errors.classSizeWelcomeText ? styles.inputError : ""} ${classSizeWelcomeText && !errors.classSizeWelcomeText ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Welcome to AYM Family"
                maxLength={60}
                {...register("classSizeWelcomeText", { required: "Overlay text is required" })} />
              <span className={styles.charCount}>{classSizeWelcomeText?.length ?? 0}/60</span>
            </div>
            {errors.classSizeWelcomeText && <p className={styles.errorMsg}>⚠ {errors.classSizeWelcomeText.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Highlight Text<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Bold highlighted word/phrase inside the paragraph (e.g. 25 students)</p>
            <div className={`${styles.inputWrap} ${errors.classSizeHighlight ? styles.inputError : ""} ${classSizeHighlight && !errors.classSizeHighlight ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. 25 students"
                maxLength={40}
                {...register("classSizeHighlight", { required: "Highlight text is required" })} />
              <span className={styles.charCount}>{classSizeHighlight?.length ?? 0}/40</span>
            </div>
            {errors.classSizeHighlight && <p className={styles.errorMsg}>⚠ {errors.classSizeHighlight.message}</p>}
          </div>

          {/* ── JoditEditor: classSizePara ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Description Paragraph<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Full description about the class size policy</p>
            <div className={errors.classSizePara ? styles.inputError : ""} style={{ borderRadius: 8, overflow: "hidden" }}>
              <JoditEditor
                value={watch("classSizePara")}
                config={{ ...joditConfig, placeholder: "e.g. At AYM, only 25 students are admitted in one batch…" }}
                onBlur={(val) => setValue("classSizePara", val, { shouldValidate: true })}
              />
            </div>
            <input type="hidden" {...register("classSizePara", {
              validate: (v) => v.replace(/<[^>]*>/g, "").trim() !== "" || "Paragraph is required",
            })} />
            {errors.classSizePara && <p className={styles.errorMsg}>⚠ {errors.classSizePara.message}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══════════════════════════════════════
            BLOCK 2 — CAMPUS
        ══════════════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>AYM Yoga Campus Block</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Label<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Small label above the title (e.g. 5000 sq.mts. · Rishikesh)</p>
            <div className={`${styles.inputWrap} ${errors.campusSuperLabel ? styles.inputError : ""} ${campusSuperLabel && !errors.campusSuperLabel ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. 5000 sq.mts. · Rishikesh"
                maxLength={80}
                {...register("campusSuperLabel", { required: "Super label is required" })} />
              <span className={styles.charCount}>{campusSuperLabel?.length ?? 0}/80</span>
            </div>
            {errors.campusSuperLabel && <p className={styles.errorMsg}>⚠ {errors.campusSuperLabel.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Block Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Main heading for the campus block</p>
            <div className={`${styles.inputWrap} ${errors.campusTitle ? styles.inputError : ""} ${campusTitle && !errors.campusTitle ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. AYM YOGA CAMPUS"
                maxLength={60}
                {...register("campusTitle", { required: "Title is required" })} />
              <span className={styles.charCount}>{campusTitle?.length ?? 0}/60</span>
            </div>
            {errors.campusTitle && <p className={styles.errorMsg}>⚠ {errors.campusTitle.message}</p>}
          </div>

          {/* ── Campus Photo — single image ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Campus Photo<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Main campus image shown in the campus block</p>
            <SingleImageUpload
              preview={campusImagePreview}
              badge="AYM Campus"
              hint="JPG / PNG / WebP · Recommended 1200×800px"
              error={campusImageError}
              onSelect={(file, preview) => {
                setCampusImageFile(file);
                setCampusImagePreview(preview);
                setCampusImageError("");
              }}
              onRemove={() => { setCampusImageFile(null); setCampusImagePreview(""); }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Highlight Text<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Bold text inside the paragraph (e.g. 5000 sq.mts.)</p>
            <div className={`${styles.inputWrap} ${errors.campusHighlight ? styles.inputError : ""} ${campusHighlight && !errors.campusHighlight ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. 5000 sq.mts."
                maxLength={40}
                {...register("campusHighlight", { required: "Highlight text is required" })} />
              <span className={styles.charCount}>{campusHighlight?.length ?? 0}/40</span>
            </div>
            {errors.campusHighlight && <p className={styles.errorMsg}>⚠ {errors.campusHighlight.message}</p>}
          </div>

          {/* ── JoditEditor: campusPara ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Description Paragraph<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Full description about the campus</p>
            <div className={errors.campusPara ? styles.inputError : ""} style={{ borderRadius: 8, overflow: "hidden" }}>
              <JoditEditor
                value={watch("campusPara")}
                config={{ ...joditConfig, placeholder: "e.g. Spread across an expansive 5000 sq.mts., the AYM campus is one of the lushest…" }}
                onBlur={(val) => setValue("campusPara", val, { shouldValidate: true })}
              />
            </div>
            <input type="hidden" {...register("campusPara", {
              validate: (v) => v.replace(/<[^>]*>/g, "").trim() !== "" || "Paragraph is required",
            })} />
            {errors.campusPara && <p className={styles.errorMsg}>⚠ {errors.campusPara.message}</p>}
          </div>
        </div>

        <div className={styles.formDivider} />

        {/* ══════════════════════════════════════
            BLOCK 3 — AMENITIES
        ══════════════════════════════════════ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Amenities Block</h3>
            <span className={styles.sectionBadge}>{amenities.length}/10</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Super Label<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Small label above the title (e.g. Comfort · Nature · Serenity)</p>
            <div className={`${styles.inputWrap} ${errors.amenitiesSuperLabel ? styles.inputError : ""} ${amenitiesSuperLabel && !errors.amenitiesSuperLabel ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. Comfort · Nature · Serenity"
                maxLength={80}
                {...register("amenitiesSuperLabel", { required: "Super label is required" })} />
              <span className={styles.charCount}>{amenitiesSuperLabel?.length ?? 0}/80</span>
            </div>
            {errors.amenitiesSuperLabel && <p className={styles.errorMsg}>⚠ {errors.amenitiesSuperLabel.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Block Title<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Main heading for the amenities block</p>
            <div className={`${styles.inputWrap} ${errors.amenitiesTitle ? styles.inputError : ""} ${amenitiesTitle && !errors.amenitiesTitle ? styles.inputSuccess : ""}`}>
              <input type="text" className={styles.input} placeholder="e.g. AMENITIES"
                maxLength={60}
                {...register("amenitiesTitle", { required: "Title is required" })} />
              <span className={styles.charCount}>{amenitiesTitle?.length ?? 0}/60</span>
            </div>
            {errors.amenitiesTitle && <p className={styles.errorMsg}>⚠ {errors.amenitiesTitle.message}</p>}
          </div>

          {/* ── JoditEditor: amenitiesMainPara ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Main Paragraph<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>First paragraph about accommodation and rooms</p>
            <div className={errors.amenitiesMainPara ? styles.inputError : ""} style={{ borderRadius: 8, overflow: "hidden" }}>
              <JoditEditor
                value={watch("amenitiesMainPara")}
                config={{ ...joditConfig, placeholder: "e.g. Students have fully furnished rooms amid lush gardens…" }}
                onBlur={(val) => setValue("amenitiesMainPara", val, { shouldValidate: true })}
              />
            </div>
            <input type="hidden" {...register("amenitiesMainPara", {
              validate: (v) => v.replace(/<[^>]*>/g, "").trim() !== "" || "Main paragraph is required",
            })} />
            {errors.amenitiesMainPara && <p className={styles.errorMsg}>⚠ {errors.amenitiesMainPara.message}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>List Intro Label</label>
            <p className={styles.fieldHint}>Text shown before the amenity list (e.g. Other amenities include:)</p>
            <div className={styles.inputWrap}>
              <input type="text" className={styles.input} placeholder="e.g. Other amenities include:"
                maxLength={80}
                {...register("amenitiesSubLabel")} />
              <span className={styles.charCount}>{amenitiesSubLabel?.length ?? 0}/80</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Amenities List<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Each item appears with an ॐ bullet in the frontend (max 10)</p>
            {errors.amenities && <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>⚠ All amenity fields must be filled</p>}
            <div className={styles.amenityList}>
              {amenities.map((item, i) => (
                <div key={i} className={styles.amenityRow}>
                  <div className={styles.amenityIndex}>{i + 1}</div>
                  <div className={`${styles.inputWrap} ${styles.amenityInputWrap}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={`e.g. ${["Accommodation ( Private / Shared / Dormitory )", "Spacious yoga hall", "Free Wi-Fi", "Lush Garden area", "Hot / Cold water 24x7"][i] ?? "Add amenity"}`}
                      value={item}
                      maxLength={100}
                      onChange={(e) => updateAmenity(i, e.target.value)}
                    />
                  </div>
                  <button type="button" className={styles.removeAmenityBtn}
                    onClick={() => removeAmenity(i)} disabled={amenities.length <= 1}>✕</button>
                </div>
              ))}
            </div>
            {/* Hidden field so RHF validates amenities array */}
            <input type="hidden" {...register("amenities", {
              validate: (v) => v.every((a) => a.trim() !== "") || "All amenity fields must be filled",
            })} />
            {amenities.length < 10 && (
              <button type="button" className={styles.addAmenityBtn} onClick={addAmenity}>+ Add Amenity</button>
            )}
            {amenities.some((a) => a.trim()) && (
              <div className={styles.amenityPreview}>
                {amenities.filter((a) => a.trim()).map((a, i) => (
                  <span key={i} className={styles.amenityChip}>
                    <span className={styles.amenityChipOm}>ॐ</span>{a}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Amenity Room Image ── */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Amenity Mosaic / Room Image<span className={styles.required}>*</span></label>
            <p className={styles.fieldHint}>Right-side image shown alongside the amenities list (e.g. furnished room / shared room photo)</p>
            <SingleImageUpload
              preview={amenityImagePreview}
              badge="Furnished Rooms"
              hint="JPG / PNG / WebP · Recommended 700×900px"
              error={amenityImageError}
              onSelect={(file, preview) => {
                setAmenityImageFile(file);
                setAmenityImagePreview(preview);
                setAmenityImageError("");
              }}
              onRemove={() => { setAmenityImageFile(null); setAmenityImagePreview(""); }}
            />
          </div>

          {/* Mosaic Tag */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}><span className={styles.labelIcon}>✦</span>Image Tag Label</label>
            <p className={styles.fieldHint}>Text tag shown as an overlay on the room image (e.g. Furnished Rooms)</p>
            <div className={styles.inputWrap}>
              <input type="text" className={styles.input} placeholder="e.g. Furnished Rooms"
                maxLength={40}
                {...register("amenityMosaicTag")} />
              <span className={styles.charCount}>{amenityMosaicTag?.length ?? 0}/40</span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        <div className={styles.formActions}>
          <Link href="/admin/dashboard/Classcampusameniti" className={styles.cancelBtn}>
            ← Cancel
          </Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Section</>}
          </button>
        </div>

      </div>
    </div>
  );
}