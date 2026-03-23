"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/dashboard/Classcampusameniti/Classcampusamenities.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

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

interface SingleImageProps {
  preview: string;
  badge?: string;
  hint: string;
  error?: string;
  onSelect: (file: File, preview: string) => void;
  onRemove: () => void;
}

function SingleImageUpload({
  preview,
  badge,
  hint,
  error,
  onSelect,
  onRemove,
}: SingleImageProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file, URL.createObjectURL(file));
    e.target.value = "";
  };
  return (
    <div>
      <div
        className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}
      >
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={handleChange} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>
                Click to Upload Image
              </span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="preview" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input
                type="file"
                accept="image/*"
                className={styles.imagePreviewOverlayInput}
                onChange={handleChange}
              />
            </div>
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

const joditConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  enableDragAndDropFileToEditor: false,
  buttons: [
    "source",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "font",
    "fontsize",
    "brush",
    "|",
    "paragraph",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "link",
    "|",
    "undo",
    "redo",
    "|",
    "selectall",
    "cut",
    "copy",
    "paste",
  ],
  uploader: { insertImageAsBase64URI: true },
  height: 220,
  colors: {
    picks: [
      "#000000",
      "#888888",
      "#ffffff",
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff9900",
      "#9900ff",
      "#ff6600",
    ],
  },
  placeholder: "",
} as any;

function isEditorEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").trim() === "";
}

interface JoditFieldProps {
  label: string;
  hint?: string;
  contentRef: React.MutableRefObject<string>;
  error?: string;
  onClearError: () => void;
  placeholder?: string;
  height?: number;
}
function JoditField({
  label,
  hint,
  contentRef,
  error,
  onClearError,
  placeholder = "Start typing here...",
  height = 220,
}: JoditFieldProps) {
  const config = { ...joditConfig, placeholder, height };
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        <span className={styles.required}>*</span>
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div
        className={error ? styles.inputError : ""}
        style={{ borderRadius: 8, overflow: "hidden" }}
      >
        <JoditEditor
          config={config}
          onChange={(val) => {
            contentRef.current = val;
            if (!isEditorEmpty(val)) onClearError();
          }}
        />
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

export default function AddClassCampusAmenitiesPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [classSizeImageFile, setClassSizeImageFile] = useState<File | null>(
    null,
  );
  const [classSizeImagePreview, setClassSizeImagePreview] = useState("");
  const [classSizeImageError, setClassSizeImageError] = useState("");

  const [campusImageFile, setCampusImageFile] = useState<File | null>(null);
  const [campusImagePreview, setCampusImagePreview] = useState("");
  const [campusImageError, setCampusImageError] = useState("");

  const [amenityImageFile, setAmenityImageFile] = useState<File | null>(null);
  const [amenityImagePreview, setAmenityImagePreview] = useState("");
  const [amenityImageError, setAmenityImageError] = useState("");

  const classSizeParaRef = useRef<string>("");
  const campusParaRef = useRef<string>("");
  const amenitiesParaRef = useRef<string>("");

  const [classSizeParaError, setClassSizeParaError] = useState("");
  const [campusParaError, setCampusParaError] = useState("");
  const [amenitiesParaError, setAmenitiesParaError] = useState("");

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

  const amenities = watch("amenities");
  const classSizeSuperLabel = watch("classSizeSuperLabel");
  const classSizeTitle = watch("classSizeTitle");
  const classSizeWelcomeText = watch("classSizeWelcomeText");
  const classSizeHighlight = watch("classSizeHighlight");
  const campusSuperLabel = watch("campusSuperLabel");
  const campusTitle = watch("campusTitle");
  const campusHighlight = watch("campusHighlight");
  const amenitiesSuperLabel = watch("amenitiesSuperLabel");
  const amenitiesTitle = watch("amenitiesTitle");
  const amenitiesSubLabel = watch("amenitiesSubLabel");
  const amenityMosaicTag = watch("amenityMosaicTag");

  const updateAmenity = (i: number, val: string) => {
    const updated = [...amenities];
    updated[i] = val;
    setValue("amenities", updated, { shouldValidate: true });
  };
  const addAmenity = () => {
    if (amenities.length >= 10) return;
    setValue("amenities", [...amenities, ""]);
  };
  const removeAmenity = (i: number) =>
    setValue(
      "amenities",
      amenities.filter((_, idx) => idx !== i),
    );

  const onSubmit = async (data: FormData) => {
    let hasError = false;
    if (isEditorEmpty(classSizeParaRef.current)) {
      setClassSizeParaError("Paragraph is required");
      hasError = true;
    } else setClassSizeParaError("");
    if (isEditorEmpty(campusParaRef.current)) {
      setCampusParaError("Paragraph is required");
      hasError = true;
    } else setCampusParaError("");
    if (isEditorEmpty(amenitiesParaRef.current)) {
      setAmenitiesParaError("Main paragraph is required");
      hasError = true;
    } else setAmenitiesParaError("");
    if (!classSizeImageFile) {
      setClassSizeImageError("Class size image is required");
      hasError = true;
    }
    if (!campusImageFile) {
      setCampusImageError("Campus photo is required");
      hasError = true;
    }
    if (!amenityImageFile) {
      setAmenityImageError("Amenity room image is required");
      hasError = true;
    }
    if (hasError) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();

      // Append all plain text fields (exclude rich-text & amenities — sent separately)
      const {
        classSizePara: _a,
        campusPara: _b,
        amenitiesMainPara: _c,
        amenities: _am,
        ...rest
      } = data;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v as string));

      // FIX: amenities sent as individual entries → backend reads req.body.amenities as array
      amenities.forEach((item) => fd.append("amenities", item));

      // Rich-text from Jodit refs
      fd.append("classSizePara", classSizeParaRef.current);
      fd.append("campusPara", campusParaRef.current);
      fd.append("amenitiesMainPara", amenitiesParaRef.current);

      // FIX: multer field names must match exactly
      fd.append("classSizeImage", classSizeImageFile!); // → multer: classSizeImage
      fd.append("campusImage_0", campusImageFile!); // → multer: campusImage_0
      fd.append("amenityImage", amenityImageFile!); // → multer: amenityImage

      await api.post("/class-campus-amenities/create", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);
      setTimeout(
        () => router.push("/admin/dashboard/Classcampusameniti"),
        1500,
      );
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
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
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/dashboard/Classcampusameniti")}
        >
          Class, Campus & Amenities
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add Section</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Add Class, Campus & Amenities</h1>
          <p className={styles.pageSubtitle}>
            Fill in all details to configure this section
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
        {/* ══ BLOCK 1 — CLASS SIZE ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>AYM Class Size Block</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Super Label
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Small label above the title (e.g. Small Batches · Personal
              Attention)
            </p>
            <div
              className={`${styles.inputWrap} ${errors.classSizeSuperLabel ? styles.inputError : ""} ${classSizeSuperLabel && !errors.classSizeSuperLabel ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Small Batches · Personal Attention"
                maxLength={80}
                {...register("classSizeSuperLabel", {
                  required: "Super label is required",
                })}
              />
              <span className={styles.charCount}>
                {classSizeSuperLabel?.length ?? 0}/80
              </span>
            </div>
            {errors.classSizeSuperLabel && (
              <p className={styles.errorMsg}>
                ⚠ {errors.classSizeSuperLabel.message}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Block Title
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>Main heading for this block</p>
            <div
              className={`${styles.inputWrap} ${errors.classSizeTitle ? styles.inputError : ""} ${classSizeTitle && !errors.classSizeTitle ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. AYM CLASS SIZE"
                maxLength={60}
                {...register("classSizeTitle", {
                  required: "Title is required",
                })}
              />
              <span className={styles.charCount}>
                {classSizeTitle?.length ?? 0}/60
              </span>
            </div>
            {errors.classSizeTitle && (
              <p className={styles.errorMsg}>
                ⚠ {errors.classSizeTitle.message}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Class Group Photo
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Main image — overlay text appears on top of this
            </p>
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
              onRemove={() => {
                setClassSizeImageFile(null);
                setClassSizeImagePreview("");
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Image Overlay Text
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Script text shown as overlay on the class image
            </p>
            <div
              className={`${styles.inputWrap} ${errors.classSizeWelcomeText ? styles.inputError : ""} ${classSizeWelcomeText && !errors.classSizeWelcomeText ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Welcome to AYM Family"
                maxLength={60}
                {...register("classSizeWelcomeText", {
                  required: "Overlay text is required",
                })}
              />
              <span className={styles.charCount}>
                {classSizeWelcomeText?.length ?? 0}/60
              </span>
            </div>
            {errors.classSizeWelcomeText && (
              <p className={styles.errorMsg}>
                ⚠ {errors.classSizeWelcomeText.message}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Highlight Text
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Bold highlighted phrase inside the paragraph (e.g. 25 students)
            </p>
            <div
              className={`${styles.inputWrap} ${errors.classSizeHighlight ? styles.inputError : ""} ${classSizeHighlight && !errors.classSizeHighlight ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. 25 students"
                maxLength={40}
                {...register("classSizeHighlight", {
                  required: "Highlight text is required",
                })}
              />
              <span className={styles.charCount}>
                {classSizeHighlight?.length ?? 0}/40
              </span>
            </div>
            {errors.classSizeHighlight && (
              <p className={styles.errorMsg}>
                ⚠ {errors.classSizeHighlight.message}
              </p>
            )}
          </div>

          <JoditField
            label="Description Paragraph"
            hint="Full description about the class size policy"
            contentRef={classSizeParaRef}
            error={classSizeParaError}
            onClearError={() => setClassSizeParaError("")}
            placeholder="e.g. At AYM, only 25 students are admitted in one batch…"
            height={250}
          />
        </div>

        <div className={styles.formDivider} />

        {/* ══ BLOCK 2 — CAMPUS ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>AYM Yoga Campus Block</h3>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Super Label
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Small label above the title (e.g. 5000 sq.mts. · Rishikesh)
            </p>
            <div
              className={`${styles.inputWrap} ${errors.campusSuperLabel ? styles.inputError : ""} ${campusSuperLabel && !errors.campusSuperLabel ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. 5000 sq.mts. · Rishikesh"
                maxLength={80}
                {...register("campusSuperLabel", {
                  required: "Super label is required",
                })}
              />
              <span className={styles.charCount}>
                {campusSuperLabel?.length ?? 0}/80
              </span>
            </div>
            {errors.campusSuperLabel && (
              <p className={styles.errorMsg}>
                ⚠ {errors.campusSuperLabel.message}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Block Title
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Main heading for the campus block
            </p>
            <div
              className={`${styles.inputWrap} ${errors.campusTitle ? styles.inputError : ""} ${campusTitle && !errors.campusTitle ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. AYM YOGA CAMPUS"
                maxLength={60}
                {...register("campusTitle", { required: "Title is required" })}
              />
              <span className={styles.charCount}>
                {campusTitle?.length ?? 0}/60
              </span>
            </div>
            {errors.campusTitle && (
              <p className={styles.errorMsg}>⚠ {errors.campusTitle.message}</p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Campus Photo
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Main campus image shown in this block
            </p>
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
              onRemove={() => {
                setCampusImageFile(null);
                setCampusImagePreview("");
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Highlight Text
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Bold text inside the paragraph (e.g. 5000 sq.mts.)
            </p>
            <div
              className={`${styles.inputWrap} ${errors.campusHighlight ? styles.inputError : ""} ${campusHighlight && !errors.campusHighlight ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. 5000 sq.mts."
                maxLength={40}
                {...register("campusHighlight", {
                  required: "Highlight text is required",
                })}
              />
              <span className={styles.charCount}>
                {campusHighlight?.length ?? 0}/40
              </span>
            </div>
            {errors.campusHighlight && (
              <p className={styles.errorMsg}>
                ⚠ {errors.campusHighlight.message}
              </p>
            )}
          </div>

          <JoditField
            label="Description Paragraph"
            hint="Full description about the campus"
            contentRef={campusParaRef}
            error={campusParaError}
            onClearError={() => setCampusParaError("")}
            placeholder="e.g. Spread across an expansive 5000 sq.mts.…"
            height={250}
          />
        </div>

        <div className={styles.formDivider} />

        {/* ══ BLOCK 3 — AMENITIES ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>Amenities Block</h3>
            <span className={styles.sectionBadge}>{amenities.length}/10</span>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Super Label
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Small label above the title (e.g. Comfort · Nature · Serenity)
            </p>
            <div
              className={`${styles.inputWrap} ${errors.amenitiesSuperLabel ? styles.inputError : ""} ${amenitiesSuperLabel && !errors.amenitiesSuperLabel ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Comfort · Nature · Serenity"
                maxLength={80}
                {...register("amenitiesSuperLabel", {
                  required: "Super label is required",
                })}
              />
              <span className={styles.charCount}>
                {amenitiesSuperLabel?.length ?? 0}/80
              </span>
            </div>
            {errors.amenitiesSuperLabel && (
              <p className={styles.errorMsg}>
                ⚠ {errors.amenitiesSuperLabel.message}
              </p>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Block Title
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Main heading for the amenities block
            </p>
            <div
              className={`${styles.inputWrap} ${errors.amenitiesTitle ? styles.inputError : ""} ${amenitiesTitle && !errors.amenitiesTitle ? styles.inputSuccess : ""}`}
            >
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. AMENITIES"
                maxLength={60}
                {...register("amenitiesTitle", {
                  required: "Title is required",
                })}
              />
              <span className={styles.charCount}>
                {amenitiesTitle?.length ?? 0}/60
              </span>
            </div>
            {errors.amenitiesTitle && (
              <p className={styles.errorMsg}>
                ⚠ {errors.amenitiesTitle.message}
              </p>
            )}
          </div>

          <JoditField
            label="Main Paragraph"
            hint="First paragraph about accommodation and rooms"
            contentRef={amenitiesParaRef}
            error={amenitiesParaError}
            onClearError={() => setAmenitiesParaError("")}
            placeholder="e.g. Students have fully furnished rooms amid lush gardens…"
            height={250}
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>List Intro Label
            </label>
            <p className={styles.fieldHint}>
              Text shown before the amenity list (e.g. Other amenities include:)
            </p>
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Other amenities include:"
                maxLength={80}
                {...register("amenitiesSubLabel")}
              />
              <span className={styles.charCount}>
                {amenitiesSubLabel?.length ?? 0}/80
              </span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Amenities List
              <span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Each item appears with an ॐ bullet in the frontend (max 10)
            </p>
            {errors.amenities && (
              <p className={styles.errorMsg} style={{ marginBottom: "0.8rem" }}>
                ⚠ All amenity fields must be filled
              </p>
            )}
            <div className={styles.amenityList}>
              {amenities.map((item, i) => (
                <div key={i} className={styles.amenityRow}>
                  <div className={styles.amenityIndex}>{i + 1}</div>
                  <div
                    className={`${styles.inputWrap} ${styles.amenityInputWrap}`}
                  >
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={
                        [
                          "Accommodation ( Private / Shared / Dormitory )",
                          "Spacious yoga hall",
                          "Free Wi-Fi",
                          "Lush Garden area",
                          "Hot / Cold water 24x7",
                        ][i] ?? "Add amenity"
                      }
                      value={item}
                      maxLength={100}
                      onChange={(e) => updateAmenity(i, e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.removeAmenityBtn}
                    onClick={() => removeAmenity(i)}
                    disabled={amenities.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <input
              type="hidden"
              {...register("amenities", {
                validate: (v) =>
                  v.every((a) => a.trim() !== "") ||
                  "All amenity fields must be filled",
              })}
            />
            {amenities.length < 10 && (
              <button
                type="button"
                className={styles.addAmenityBtn}
                onClick={addAmenity}
              >
                + Add Amenity
              </button>
            )}
            {amenities.some((a) => a.trim()) && (
              <div className={styles.amenityPreview}>
                {amenities
                  .filter((a) => a.trim())
                  .map((a, i) => (
                    <span key={i} className={styles.amenityChip}>
                      <span className={styles.amenityChipOm}>ॐ</span>
                      {a}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Amenity Mosaic / Room
              Image<span className={styles.required}>*</span>
            </label>
            <p className={styles.fieldHint}>
              Right-side image shown alongside the amenities list
            </p>
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
              onRemove={() => {
                setAmenityImageFile(null);
                setAmenityImagePreview("");
              }}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>✦</span>Image Tag Label
            </label>
            <p className={styles.fieldHint}>
              Text tag shown as overlay on the room image (e.g. Furnished Rooms)
            </p>
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Furnished Rooms"
                maxLength={40}
                {...register("amenityMosaicTag")}
              />
              <span className={styles.charCount}>
                {amenityMosaicTag?.length ?? 0}/40
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        <div className={styles.formActions}>
          <Link
            href="/admin/dashboard/Classcampusameniti"
            className={styles.cancelBtn}
          >
            ← Cancel
          </Link>
          <button
            type="button"
            className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} /> Saving…
              </>
            ) : (
              <>
                <span>✦</span> Save Section
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
