"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
  UseFieldArrayReturn,
  FieldValues,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import api from "@/lib/api";
import toast from "react-hot-toast";
import styles from "@/assets/style/Admin/yogacourse/100hourscourse/Contentmodule.module.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ══════════════════════════════
   TYPES
══════════════════════════════ */
interface SylModule    { title: string; desc: string }
interface ScheduleItem { time: string; label: string }
interface WhyChooseCard { icon: string; label: string; desc: string }

interface FormData {
  /* banner */
  bannerImage: string;

  /* hero */
  heroTitle: string;
  heroParagraphs: { value: string }[];

  /* video (main page shared) */
  videoUrl:  string;
  videoFile: string;

  /* transform */
  transformTitle: string;
  transformParagraphs: { value: string }[];
  transformImage: string;

  /* what is */
  whatIsTitle: string;
  whatIsParagraphs: { value: string }[];

  /* why choose */
  whyChooseTitle: string;
  whyChooseParagraphs: { value: string }[];
  whyChooseCards: WhyChooseCard[];

  /* suitable */
  suitableTitle: string;
  suitableItems: { value: string }[];
  suitableImage1: string;
  suitableImage2: string;
  suitableImage3: string;

  /* syllabus */
  syllabusTitle: string;
  syllabusParagraphs: { value: string }[];
  syllabusLeft:  SylModule[];
  syllabusRight: SylModule[];
  syllabusImage1: string;
  syllabusImage2: string;
  syllabusVideoUrl: string;   // ← separate URL field
  syllabusVideoFile: string;  // ← separate File field

  /* schedule */
  scheduleImage: string;
  scheduleVideoUrl: string;   // ← separate URL field
  scheduleVideoFile: string;  // ← separate File field
  scheduleItems: ScheduleItem[];

  /* soul shine */
  soulShineText:  string;
  soulShineImage: string;

  /* enrol */
  enrollTitle: string;
  enrollParagraphs: { value: string }[];
  enrollItems: { value: string }[];
  enrollImage: string;

  /* comprehensive */
  comprehensiveTitle: string;
  comprehensiveParagraphs: { value: string }[];
  comprehensiveVideoUrl: string;   // ← separate URL field
  comprehensiveVideoFile: string;  // ← separate File field

  /* cert */
  certTitle: string;
  certParagraphs: { value: string }[];
  certImage: string;

  /* registration */
  registrationTitle: string;
  registrationParagraphs: { value: string }[];
  registrationImage: string;

  /* fee lists */
  includedItems:    { value: string }[];
  notIncludedItems: { value: string }[];

  /* course info card */
  courseDuration:       string;
  courseLevel:          string;
  courseCertification:  string;
  courseYogaStyle:      string;
  courseYogaStyleSub:   string;
  courseLanguage:       string;
  courseDateInfo:       string;
  courseStartingFeeUSD: number;
  courseOriginalFeeUSD: number;
  bookNowLink:          string;
}

type TFieldName = keyof Pick<FormData,
  | "heroTitle" | "transformTitle" | "whatIsTitle" | "whyChooseTitle"
  | "suitableTitle" | "syllabusTitle" | "soulShineText" | "enrollTitle"
  | "comprehensiveTitle" | "certTitle" | "registrationTitle"
  | "videoUrl" | "bookNowLink"
  | "courseDuration" | "courseLevel" | "courseCertification"
  | "courseYogaStyle" | "courseYogaStyleSub" | "courseLanguage" | "courseDateInfo"
>;

/* ══════════════════════════════
   JODIT CONFIG
══════════════════════════════ */
const joditCfg = (height = 220): object => ({
  readonly: false, toolbar: true, toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, defaultActionOnPaste: "insert_clear_html",
  height, placeholder: "Start typing…",
  buttons: ["bold","italic","underline","strikethrough","|","brush","fontsize","|","align","|","ul","ol","|","link","|","undo","redo"],
  colorPickerDefaultTab: "text",
});

/* ══════════════════════════════
   HELPERS
══════════════════════════════ */
const imgUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_URL}${path}`;
};

/* Default Why Choose Cards */
const DEFAULT_WHY_CHOOSE_CARDS: WhyChooseCard[] = [
  { icon: "star", label: "Expert Teachers", desc: "Certified & experienced yoga masters from Rishikesh tradition" },
  { icon: "users", label: "Small Batches", desc: "Personalised attention with limited seats per batch" },
  { icon: "map-pin", label: "Sacred Location", desc: "Learn in Rishikesh, the world capital of yoga" },
  { icon: "award", label: "Yoga Alliance", desc: "Internationally recognized 100-hour certification" },
  { icon: "coffee", label: "Sattvic Meals", desc: "Fresh vegetarian food included throughout the course" },
  { icon: "book", label: "Holistic Learning", desc: "Asana, pranayama, meditation & philosophy combined" },
];

/* ══════════════════════════════
   DEFAULT VALUES
══════════════════════════════ */
const DEFAULT_VALUES: FormData = {
  bannerImage: "",
  heroTitle: "100 Hour Yoga Teacher Training Course in Rishikesh India",
  heroParagraphs: [{ value: "" }],
  videoUrl: "",
  videoFile: "",
  transformTitle: "Transform Your Practice with a 100 Hour Yoga Course in Rishikesh",
  transformParagraphs: [{ value: "" }],
  transformImage: "",
  whatIsTitle: "What is a 100 Hour Yoga Teacher Training?",
  whatIsParagraphs: [{ value: "" }],
  whyChooseTitle: "Why Choose AYM Yoga School for Your 100 Hour Yoga TTC",
  whyChooseParagraphs: [{ value: "" }],
  whyChooseCards: DEFAULT_WHY_CHOOSE_CARDS,
  suitableTitle: "100 Hours Yoga TTC is suitable for:",
  suitableItems: [{ value: "" }],
  suitableImage1: "",
  suitableImage2: "",
  suitableImage3: "",
  syllabusTitle: "Syllabus of Premier - 100 Hour Yoga Teacher Training Course in Rishikesh, India",
  syllabusParagraphs: [{ value: "" }],
  syllabusLeft:  [{ title: "", desc: "" }],
  syllabusRight: [{ title: "", desc: "" }],
  syllabusImage1: "",
  syllabusImage2: "",
  syllabusVideoUrl: "",   // ← NEW separate field
  syllabusVideoFile: "",  // ← NEW separate field
  scheduleImage: "",
  scheduleVideoUrl: "",   // ← NEW separate field
  scheduleVideoFile: "",  // ← NEW separate field
  scheduleItems: [{ time: "", label: "" }],
  soulShineText: "Let Your Soul Shine",
  soulShineImage: "",
  enrollTitle: "Why Enrol in AYM for a 100 hour Yoga Teacher Training Course in Rishikesh?",
  enrollParagraphs: [{ value: "" }],
  enrollItems: [{ value: "" }],
  enrollImage: "",
  comprehensiveTitle: "Comprehensive 100 Hour Yoga Teacher Training Course in Rishikesh",
  comprehensiveParagraphs: [{ value: "" }],
  comprehensiveVideoUrl: "",   // ← NEW separate field
  comprehensiveVideoFile: "",  // ← NEW separate field
  certTitle: "100 Hour Yoga Teacher Training Course Certification at AYM",
  certParagraphs: [{ value: "" }],
  certImage: "",
  registrationTitle: "Registration Process",
  registrationParagraphs: [{ value: "" }],
  registrationImage: "",
  includedItems:    [{ value: "" }],
  notIncludedItems: [{ value: "" }],
  courseDuration:       "13 Days",
  courseLevel:          "Beginner",
  courseCertification:  "100 Hour",
  courseYogaStyle:      "Multistyle",
  courseYogaStyleSub:   "Ashtanga, Vinyasa & Hatha",
  courseLanguage:       "English & Hindi",
  courseDateInfo:       "1st to 13th of every month",
  courseStartingFeeUSD: 499,
  courseOriginalFeeUSD: 899,
  bookNowLink:          "#dates-fees",
};

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */

/* ── Text field ── */
function TField({
  label, hint, name, placeholder = "", max = 250, required = true,
  register, watch, errors,
}: {
  label: string; hint?: string; name: TFieldName;
  placeholder?: string; max?: number; required?: boolean;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const val = (watch(name) as string) ?? "";
  const err = errors[name];
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.inputWrap} ${err ? styles.inputError : ""} ${val && !err ? styles.inputSuccess : ""}`}>
        <input type="text" className={styles.input} placeholder={placeholder} maxLength={max}
          {...register(name, { required: required ? "Required" : false })} />
        <span className={styles.charCount}>{val.length}/{max}</span>
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err.message as string}</p>}
    </div>
  );
}

/* ── Number field ── */
function NField({
  label, hint, name, required = false, register, errors,
}: {
  label: string; hint?: string; name: "courseStartingFeeUSD" | "courseOriginalFeeUSD";
  required?: boolean;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const err = errors[name];
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.inputWrap} ${err ? styles.inputError : ""}`}>
        <input type="number" className={styles.input} min={0}
          {...register(name, {
            required: required ? "Required" : false,
            valueAsNumber: true,
          })} />
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err.message as string}</p>}
    </div>
  );
}

/* ── Jodit paragraph block ── */
function ParaBlock({
  label, arrayMethods, fieldArrayName, required = false, control,
}: {
  label: string; arrayMethods: AnyFieldArray; fieldArrayName: string;
  required?: boolean; control: Control<FormData>;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.paraStack}>
        {arrayMethods.fields.map((field, i) => (
          <div key={field.id} className={styles.paraItem}>
            <div className={styles.paraItemHeader}>
              <span className={styles.paraNum}>Para {i + 1}</span>
              <button type="button" className={styles.removeItemBtn}
                onClick={() => arrayMethods.remove(i)}
                disabled={arrayMethods.fields.length <= 1}>✕</button>
            </div>
            <div className={styles.joditWrap}>
              <Controller
                name={`${fieldArrayName}.${i}.value` as any}
                control={control}
                rules={required && i === 0 ? { required: "At least one paragraph required" } : {}}
                render={({ field: f }) => (
                  <JoditEditor value={f.value as string} config={joditCfg(200)}
                    onBlur={(v: string) => f.onChange(v)} />
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addItemBtn}
        onClick={() => (arrayMethods.append as (v: FieldValues) => void)({ value: "" })}>
        + Add Paragraph
      </button>
    </div>
  );
}

/* ── Image upload/url field ── */
function ImgField({
  label, hint, fieldName, fileRef, inputRef, previewVal, setValue, onFileChange,
}: {
  label: string; hint?: string;
  fieldName: keyof Pick<FormData,
    "bannerImage"|"scheduleImage"|"soulShineImage"|
    "suitableImage1"|"suitableImage2"|"suitableImage3"|
    "transformImage"|"syllabusImage1"|"syllabusImage2"|
    "enrollImage"|"certImage"|"registrationImage">;
  fileRef: React.MutableRefObject<File | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  previewVal: string;
  setValue: UseFormSetValue<FormData>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={styles.imgUploadRow}>
        <div className={styles.imgPreviewBox}>
          {previewVal
            ? <img src={imgUrl(previewVal)} alt="preview" className={styles.imgPreview} />
            : <span className={styles.imgPreviewEmpty}>🖼</span>}
        </div>
        <div className={styles.imgUploadControls}>
          <div className={styles.imgUploadZone} onClick={() => inputRef.current?.click()}>
            <span>📁 Click to upload</span>
            <span className={styles.imgUploadSub}>JPG · PNG · WEBP</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
          <div className={styles.imgUrlRow}>
            <div className={styles.inputWrap}>
              <input type="text" className={styles.input} placeholder="Or paste image URL…"
                value={previewVal}
                onChange={e => { fileRef.current = null; setValue(fieldName, e.target.value); }} />
            </div>
            {previewVal && (
              <button type="button" className={styles.imgClearBtn}
                onClick={() => { fileRef.current = null; setValue(fieldName, ""); }}>✕</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   VIDEO FIELD WITH TABS — FULLY FIXED
   Each video section gets its OWN urlField & fileField
══════════════════════════════════════════════════════ */
function VideoFieldWithTabs({
  label,
  hint,
  videoUrl,
  videoFile,
  fieldNameUrl,
  fieldNameFile,
  fileRef,
  inputRef,
  setValue,
  onFileChange,
}: {
  label: string;
  hint?: string;
  videoUrl: string;
  videoFile: string;
  fieldNameUrl: keyof Pick<FormData,
    "videoUrl" | "syllabusVideoUrl" | "scheduleVideoUrl" | "comprehensiveVideoUrl">;
  fieldNameFile: keyof Pick<FormData,
    "videoFile" | "syllabusVideoFile" | "scheduleVideoFile" | "comprehensiveVideoFile">;
  fileRef: React.MutableRefObject<File | null>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  setValue: UseFormSetValue<FormData>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // Determine initial tab based on whether a file path exists
  const [tab, setTab] = useState<"link" | "upload">(
    videoFile && !videoFile.startsWith("http") ? "upload" : "link"
  );

  const getEmbedSrc = (url: string) => {
    if (!url) return "";
    if (url.includes("youtu")) {
      let id = "";
      if (url.includes("shorts/")) {
        id = url.split("shorts/")[1]?.split("?")[0];
      } else if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("watch?v=")) {
        id = url.split("watch?v=")[1]?.split("&")[0];
      }
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=0&modestbranding=1&rel=0`;
    }
    if (url.includes("instagram.com/reel/")) {
      const m = url.match(/reel\/([^/?]+)/);
      if (m) return `https://www.instagram.com/reel/${m[1]}/embed`;
    }
    return "";
  };

  const embedSrc = getEmbedSrc(videoUrl);

  const switchToLink = () => {
    setTab("link");
    fileRef.current = null;
    setValue(fieldNameFile, "");
  };

  const switchToUpload = () => {
    setTab("upload");
    setValue(fieldNameUrl, "");
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {hint && <span className={styles.fieldHint} style={{ marginLeft: 8 }}>{hint}</span>}
      </label>

      <div className={styles.videoTabContainer}>
        {(["link", "upload"] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => t === "link" ? switchToLink() : switchToUpload()}
            className={`${styles.videoTab} ${tab === t ? styles.videoTabActive : ""}`}
          >
            {t === "link" ? "🔗 YouTube / Instagram Link" : "📤 Upload MP4"}
          </button>
        ))}
      </div>

      {tab === "link" && (
        <>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.input}
              placeholder="https://youtube.com/shorts/... or https://youtu.be/... or https://instagram.com/reel/..."
              value={videoUrl || ""}
              onChange={e => {
                fileRef.current = null;
                setValue(fieldNameUrl, e.target.value);
                setValue(fieldNameFile, "");
              }}
            />
          </div>
          {videoUrl && (
            <button
              type="button"
              className={styles.imgClearBtn}
              style={{ marginTop: 4 }}
              onClick={() => setValue(fieldNameUrl, "")}
            >
              ✕
            </button>
          )}
          {embedSrc && (
            <div className={styles.videoPreview}>
              <iframe
                src={embedSrc}
                frameBorder="0"
                allowFullScreen
                title={`${label} preview`}
                style={{ width: "100%", height: 220, borderRadius: 8, marginTop: 8 }}
              />
            </div>
          )}
          {videoUrl && !embedSrc && (
            <p style={{ color: "#c8700a", fontSize: "0.82rem", marginTop: 6 }}>
              ⚠ Unrecognised URL format. Please use YouTube or Instagram Reel links.
            </p>
          )}
        </>
      )}

      {tab === "upload" && (
        <>
          <div
            className={styles.videoUploadZone}
            onClick={() => inputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            <span>📁 Click to upload MP4 video</span>
            <br />
            <span className={styles.imgUploadSub}>MP4 recommended · max 100MB</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
          {videoFile && (
            <div style={{ marginTop: 8, fontSize: "0.84rem", color: "#3d6000" }}>
              ✅ {videoFile.startsWith("/uploads/") || videoFile.startsWith("http")
                ? `Saved: ${videoFile.split("/").pop()}`
                : `File selected: ${videoFile}`}
              <button
                type="button"
                className={styles.imgClearBtn}
                style={{ marginLeft: 8 }}
                onClick={() => { fileRef.current = null; setValue(fieldNameFile, ""); }}
              >
                ✕ Clear
              </button>
            </div>
          )}
          {/* Show existing uploaded video preview */}
          {videoFile && (videoFile.startsWith("/uploads/") || videoFile.startsWith("http")) && (
            <video
              src={imgUrl(videoFile)}
              controls
              style={{ marginTop: 8, width: "100%", maxHeight: 220, borderRadius: 8 }}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ── String list field ── */
function ListField({
  label, arrayMethods, fieldArrayName, placeholder, required = true, register,
}: {
  label: string; arrayMethods: AnyFieldArray; fieldArrayName: string;
  placeholder: string; required?: boolean; register: UseFormRegister<FormData>;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.listItems}>
        {arrayMethods.fields.map((field, i) => (
          <div key={field.id} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input type="text" className={styles.input} placeholder={placeholder} maxLength={300}
                {...register(`${fieldArrayName}.${i}.value` as any, {
                  required: required ? "Required" : false,
                })} />
            </div>
            <button type="button" className={styles.removeItemBtn}
              onClick={() => arrayMethods.remove(i)}
              disabled={arrayMethods.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addItemBtn}
        onClick={() => (arrayMethods.append as (v: FieldValues) => void)({ value: "" })}>
        + Add Item
      </button>
    </div>
  );
}

/* ── Why Choose Cards Field ── */
function WhyChooseCardsField({
  control, register, errors,
}: {
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "whyChooseCards",
  });

  const iconOptions = [
    { value: "star", label: "⭐ Star" },
    { value: "users", label: "👥 Users" },
    { value: "map-pin", label: "📍 Map Pin" },
    { value: "award", label: "🏆 Award" },
    { value: "coffee", label: "☕ Coffee" },
    { value: "book", label: "📖 Book" },
    { value: "heart", label: "❤️ Heart" },
    { value: "leaf", label: "🌿 Leaf" },
    { value: "sun", label: "☀️ Sun" },
    { value: "moon", label: "🌙 Moon" },
  ];

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>Why Choose Cards
        <span className={styles.required}>*</span>
      </label>
      <p className={styles.fieldHint}>These are the feature cards shown in the Why Choose section</p>

      <div className={styles.whyCardsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.whyCardItem}>
            <div className={styles.whyCardHeader}>
              <span className={styles.whyCardNum}>Card {index + 1}</span>
              <button type="button" className={styles.removeItemBtn}
                onClick={() => remove(index)}
                disabled={fields.length <= 1}>✕</button>
            </div>
            <div className={styles.whyCardFields}>
              <div className={styles.fieldGroupSm}>
                <label className={styles.labelSm}>Icon</label>
                <select
                  className={styles.select}
                  {...register(`whyChooseCards.${index}.icon` as const)}
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldGroupSm}>
                <label className={styles.labelSm}>Label</label>
                <div className={`${styles.inputWrap} ${errors.whyChooseCards?.[index]?.label ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input}
                    placeholder="e.g., Expert Teachers"
                    {...register(`whyChooseCards.${index}.label`, { required: "Label required" })} />
                </div>
              </div>
              <div className={styles.fieldGroupSm}>
                <label className={styles.labelSm}>Description</label>
                <div className={`${styles.inputWrap} ${errors.whyChooseCards?.[index]?.desc ? styles.inputError : ""}`}>
                  <textarea className={`${styles.input} ${styles.textareaSm}`} rows={2}
                    placeholder="Card description..."
                    {...register(`whyChooseCards.${index}.desc`, { required: "Description required" })} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={styles.addItemBtn}
        onClick={() => append({ icon: "star", label: "", desc: "" })}>
        + Add Card
      </button>
    </div>
  );
}

/* ══════════════════════════════
   MAIN COMPONENT
══════════════════════════════ */
export default function ContentAddPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [isEdit,       setIsEdit]       = useState(false);

  /* ── Image input refs ── */
  const bannerFileRef      = useRef<HTMLInputElement | null>(null);
  const schedImgRef        = useRef<HTMLInputElement | null>(null);
  const soulImgRef         = useRef<HTMLInputElement | null>(null);
  const suit1ImgRef        = useRef<HTMLInputElement | null>(null);
  const suit2ImgRef        = useRef<HTMLInputElement | null>(null);
  const suit3ImgRef        = useRef<HTMLInputElement | null>(null);
  const transformImgRef    = useRef<HTMLInputElement | null>(null);
  const syllabusImg1Ref    = useRef<HTMLInputElement | null>(null);
  const syllabusImg2Ref    = useRef<HTMLInputElement | null>(null);
  const enrollImgRef       = useRef<HTMLInputElement | null>(null);
  const certImgRef         = useRef<HTMLInputElement | null>(null);
  const registrationImgRef = useRef<HTMLInputElement | null>(null);

  /* ── Video input refs (ONE per section) ── */
  const mainVideoInputRef          = useRef<HTMLInputElement | null>(null);
  const syllabusVideoInputRef      = useRef<HTMLInputElement | null>(null);
  const scheduleVideoInputRef      = useRef<HTMLInputElement | null>(null);
  const comprehensiveVideoInputRef = useRef<HTMLInputElement | null>(null);

  /* ── Image File objects ── */
  const bannerFile      = useRef<File | null>(null);
  const schedFile       = useRef<File | null>(null);
  const soulFile        = useRef<File | null>(null);
  const suit1File       = useRef<File | null>(null);
  const suit2File       = useRef<File | null>(null);
  const suit3File       = useRef<File | null>(null);
  const transformFile   = useRef<File | null>(null);
  const syllabusImg1File = useRef<File | null>(null);
  const syllabusImg2File = useRef<File | null>(null);
  const enrollFile      = useRef<File | null>(null);
  const certFile        = useRef<File | null>(null);
  const registrationFile = useRef<File | null>(null);

  /* ── Video File objects (ONE per section) ── */
  const mainVideoFile          = useRef<File | null>(null);
  const syllabusVideoFile      = useRef<File | null>(null);
  const scheduleVideoFile      = useRef<File | null>(null);
  const comprehensiveVideoFile = useRef<File | null>(null);

  const {
    register, control, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: DEFAULT_VALUES });

  /* ── Field Arrays ── */
  const heroParagraphs          = useFieldArray({ control, name: "heroParagraphs" });
  const transformParagraphs     = useFieldArray({ control, name: "transformParagraphs" });
  const whatIsParagraphs        = useFieldArray({ control, name: "whatIsParagraphs" });
  const whyChooseParagraphs     = useFieldArray({ control, name: "whyChooseParagraphs" });
  const suitableItems           = useFieldArray({ control, name: "suitableItems" });
  const syllabusParagraphs      = useFieldArray({ control, name: "syllabusParagraphs" });
  const syllabusLeft            = useFieldArray({ control, name: "syllabusLeft" });
  const syllabusRight           = useFieldArray({ control, name: "syllabusRight" });
  const scheduleItems           = useFieldArray({ control, name: "scheduleItems" });
  const enrollParagraphs        = useFieldArray({ control, name: "enrollParagraphs" });
  const enrollItems             = useFieldArray({ control, name: "enrollItems" });
  const comprehensiveParagraphs = useFieldArray({ control, name: "comprehensiveParagraphs" });
  const certParagraphs          = useFieldArray({ control, name: "certParagraphs" });
  const registrationParagraphs  = useFieldArray({ control, name: "registrationParagraphs" });
  const includedItems           = useFieldArray({ control, name: "includedItems" });
  const notIncludedItems        = useFieldArray({ control, name: "notIncludedItems" });

  /* ── Watched values ── */
  const bannerImageVal       = watch("bannerImage");
  const scheduleImageVal     = watch("scheduleImage");
  const soulShineImageVal    = watch("soulShineImage");
  const suit1Val             = watch("suitableImage1");
  const suit2Val             = watch("suitableImage2");
  const suit3Val             = watch("suitableImage3");
  const transformImageVal    = watch("transformImage");
  const syllabusImage1Val    = watch("syllabusImage1");
  const syllabusImage2Val    = watch("syllabusImage2");
  const enrollImageVal       = watch("enrollImage");
  const certImageVal         = watch("certImage");
  const registrationImageVal = watch("registrationImage");

  /* ── Each video has its own watched URL + File ── */
  const mainVideoUrlVal          = watch("videoUrl");
  const mainVideoFileVal         = watch("videoFile");
  const syllabusVideoUrlVal      = watch("syllabusVideoUrl");
  const syllabusVideoFileVal     = watch("syllabusVideoFile");
  const scheduleVideoUrlVal      = watch("scheduleVideoUrl");
  const scheduleVideoFileVal     = watch("scheduleVideoFile");
  const comprehensiveVideoUrlVal = watch("comprehensiveVideoUrl");
  const comprehensiveVideoFileVal= watch("comprehensiveVideoFile");

  /* ── Load existing content from backend ── */
  useEffect(() => {
    api.get("/100hr-content/get").then(res => {
      const d = res.data.data;
      if (!d) return;
      setIsEdit(true);

      const toV = (arr: string[]) => (arr ?? []).map((v: string) => ({ value: v }));

      // Determine URL vs File for each video field from stored value
      const parseVideoField = (val: string) => {
        if (!val) return { url: "", file: "" };
        if (val.startsWith("http") || val.includes("youtube") || val.includes("instagram")) {
          return { url: val, file: "" };
        }
        return { url: "", file: val }; // it's an uploaded file path
      };

      const mainVid      = parseVideoField(d.videoUrl || d.videoFile || "");
      const syllabusVid  = parseVideoField(d.syllabusVideo || "");
      const scheduleVid  = parseVideoField(d.scheduleVideo || "");
      const compVid      = parseVideoField(d.comprehensiveVideo || "");

      reset({
        bannerImage:             d.bannerImage    ?? "",
        heroTitle:               d.heroTitle      ?? "",
        heroParagraphs:          toV(d.heroParagraphs),
        videoUrl:                mainVid.url,
        videoFile:               mainVid.file,
        transformTitle:          d.transformTitle ?? "",
        transformParagraphs:     toV(d.transformParagraphs),
        transformImage:          d.transformImage ?? "",
        whatIsTitle:             d.whatIsTitle    ?? "",
        whatIsParagraphs:        toV(d.whatIsParagraphs),
        whyChooseTitle:          d.whyChooseTitle ?? "",
        whyChooseParagraphs:     toV(d.whyChooseParagraphs),
        whyChooseCards:          d.whyChooseCards ?? DEFAULT_WHY_CHOOSE_CARDS,
        suitableTitle:           d.suitableTitle  ?? "",
        suitableItems:           toV(d.suitableItems),
        suitableImage1:          d.suitableImage1 ?? "",
        suitableImage2:          d.suitableImage2 ?? "",
        suitableImage3:          d.suitableImage3 ?? "",
        syllabusTitle:           d.syllabusTitle  ?? "",
        syllabusParagraphs:      toV(d.syllabusParagraphs),
        syllabusLeft:            d.syllabusLeft   ?? [{ title:"", desc:"" }],
        syllabusRight:           d.syllabusRight  ?? [{ title:"", desc:"" }],
        syllabusImage1:          d.syllabusImage1 ?? "",
        syllabusImage2:          d.syllabusImage2 ?? "",
        syllabusVideoUrl:        syllabusVid.url,
        syllabusVideoFile:       syllabusVid.file,
        scheduleImage:           d.scheduleImage  ?? "",
        scheduleVideoUrl:        scheduleVid.url,
        scheduleVideoFile:       scheduleVid.file,
        scheduleItems:           d.scheduleItems  ?? [{ time:"", label:"" }],
        soulShineText:           d.soulShineText  ?? "",
        soulShineImage:          d.soulShineImage ?? "",
        enrollTitle:             d.enrollTitle    ?? "",
        enrollParagraphs:        toV(d.enrollParagraphs),
        enrollItems:             toV(d.enrollItems),
        enrollImage:             d.enrollImage    ?? "",
        comprehensiveTitle:      d.comprehensiveTitle ?? "",
        comprehensiveParagraphs: toV(d.comprehensiveParagraphs),
        comprehensiveVideoUrl:   compVid.url,
        comprehensiveVideoFile:  compVid.file,
        certTitle:               d.certTitle      ?? "",
        certParagraphs:          toV(d.certParagraphs),
        certImage:               d.certImage      ?? "",
        registrationTitle:       d.registrationTitle ?? "",
        registrationParagraphs:  toV(d.registrationParagraphs),
        registrationImage:       d.registrationImage ?? "",
        includedItems:           toV(d.includedItems),
        notIncludedItems:        toV(d.notIncludedItems),
        courseDuration:          d.courseDuration       ?? "13 Days",
        courseLevel:             d.courseLevel          ?? "Beginner",
        courseCertification:     d.courseCertification  ?? "100 Hour",
        courseYogaStyle:         d.courseYogaStyle      ?? "Multistyle",
        courseYogaStyleSub:      d.courseYogaStyleSub   ?? "Ashtanga, Vinyasa & Hatha",
        courseLanguage:          d.courseLanguage       ?? "English & Hindi",
        courseDateInfo:          d.courseDateInfo       ?? "1st to 13th of every month",
        courseStartingFeeUSD:    d.courseStartingFeeUSD ?? 499,
        courseOriginalFeeUSD:    d.courseOriginalFeeUSD ?? 899,
        bookNowLink:             d.bookNowLink          ?? "#dates-fees",
      });
    }).catch(() => {});
  }, [reset]);

  /* ── Generic image file handler ── */
  const handleImgFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileRef: React.MutableRefObject<File | null>,
    fieldName: keyof Pick<FormData,
      "bannerImage"|"scheduleImage"|"soulShineImage"|
      "suitableImage1"|"suitableImage2"|"suitableImage3"|
      "transformImage"|"syllabusImage1"|"syllabusImage2"|
      "enrollImage"|"certImage"|"registrationImage">,
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    fileRef.current = f;
    setValue(fieldName, URL.createObjectURL(f));
    e.target.value = "";
  };

  /* ── Generic video file handler ── */
  const handleVideoFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileRef: React.MutableRefObject<File | null>,
    urlField: keyof Pick<FormData, "videoUrl" | "syllabusVideoUrl" | "scheduleVideoUrl" | "comprehensiveVideoUrl">,
    fileField: keyof Pick<FormData, "videoFile" | "syllabusVideoFile" | "scheduleVideoFile" | "comprehensiveVideoFile">,
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;
    fileRef.current = f;
    setValue(urlField, "");       // clear URL when file is selected
    setValue(fileField, f.name);  // show filename
    e.target.value = "";
  };

  /* ══════════════════════
     SUBMIT
  ══════════════════════ */
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      /* ── Image fields ── */
      const imageMappings: Array<{
        file: React.MutableRefObject<File | null>;
        field: string;
        urlField: string;
        dataKey: keyof FormData;
      }> = [
        { file: bannerFile,       field: "bannerImage",       urlField: "bannerImageUrl",       dataKey: "bannerImage" },
        { file: schedFile,        field: "scheduleImage",      urlField: "scheduleImageUrl",      dataKey: "scheduleImage" },
        { file: soulFile,         field: "soulShineImage",     urlField: "soulShineImageUrl",     dataKey: "soulShineImage" },
        { file: suit1File,        field: "suitableImage1",     urlField: "suitableImage1Url",     dataKey: "suitableImage1" },
        { file: suit2File,        field: "suitableImage2",     urlField: "suitableImage2Url",     dataKey: "suitableImage2" },
        { file: suit3File,        field: "suitableImage3",     urlField: "suitableImage3Url",     dataKey: "suitableImage3" },
        { file: transformFile,    field: "transformImage",     urlField: "transformImageUrl",     dataKey: "transformImage" },
        { file: syllabusImg1File, field: "syllabusImage1",     urlField: "syllabusImage1Url",     dataKey: "syllabusImage1" },
        { file: enrollFile,       field: "enrollImage",        urlField: "enrollImageUrl",        dataKey: "enrollImage" },
        { file: certFile,         field: "certImage",          urlField: "certImageUrl",          dataKey: "certImage" },
        { file: registrationFile, field: "registrationImage",  urlField: "registrationImageUrl",  dataKey: "registrationImage" },
      ];

      imageMappings.forEach(({ file, field, urlField, dataKey }) => {
        if (file.current) {
          fd.append(field, file.current);
        } else {
          const val = data[dataKey] as string;
          if (val && !val.startsWith("blob:")) {
            fd.append(urlField, val);
          }
        }
      });

      /* ── Video fields — each section independent ── */
      // Main video
      if (mainVideoFile.current) {
        fd.append("videoFile", mainVideoFile.current);
        fd.append("videoUrl", "");
      } else {
        fd.append("videoUrl", data.videoUrl || "");
        fd.append("videoFile", "");
      }

      // Syllabus video
      if (syllabusVideoFile.current) {
        fd.append("syllabusVideoFile", syllabusVideoFile.current);
        fd.append("syllabusVideoUrl", "");
      } else {
        fd.append("syllabusVideoUrl", data.syllabusVideoUrl || "");
        fd.append("syllabusVideoFile", "");
      }

      // Schedule video
      if (scheduleVideoFile.current) {
        fd.append("scheduleVideoFile", scheduleVideoFile.current);
        fd.append("scheduleVideoUrl", "");
      } else {
        fd.append("scheduleVideoUrl", data.scheduleVideoUrl || "");
        fd.append("scheduleVideoFile", "");
      }

      // Comprehensive video
      if (comprehensiveVideoFile.current) {
        fd.append("comprehensiveVideoFile", comprehensiveVideoFile.current);
        fd.append("comprehensiveVideoUrl", "");
      } else {
        fd.append("comprehensiveVideoUrl", data.comprehensiveVideoUrl || "");
        fd.append("comprehensiveVideoFile", "");
      }

      /* ── JSON payload ── */
      const payload = {
        heroTitle:               data.heroTitle,
        heroParagraphs:          data.heroParagraphs.map(p => p.value),
        transformTitle:          data.transformTitle,
        transformParagraphs:     data.transformParagraphs.map(p => p.value),
        whatIsTitle:             data.whatIsTitle,
        whatIsParagraphs:        data.whatIsParagraphs.map(p => p.value),
        whyChooseTitle:          data.whyChooseTitle,
        whyChooseParagraphs:     data.whyChooseParagraphs.map(p => p.value),
        whyChooseCards:          data.whyChooseCards,
        suitableTitle:           data.suitableTitle,
        suitableItems:           data.suitableItems.map(p => p.value),
        syllabusTitle:           data.syllabusTitle,
        syllabusParagraphs:      data.syllabusParagraphs.map(p => p.value),
        syllabusLeft:            data.syllabusLeft,
        syllabusRight:           data.syllabusRight,
        scheduleItems:           data.scheduleItems,
        soulShineText:           data.soulShineText,
        enrollTitle:             data.enrollTitle,
        enrollParagraphs:        data.enrollParagraphs.map(p => p.value),
        enrollItems:             data.enrollItems.map(p => p.value),
        comprehensiveTitle:      data.comprehensiveTitle,
        comprehensiveParagraphs: data.comprehensiveParagraphs.map(p => p.value),
        certTitle:               data.certTitle,
        certParagraphs:          data.certParagraphs.map(p => p.value),
        registrationTitle:       data.registrationTitle,
        registrationParagraphs:  data.registrationParagraphs.map(p => p.value),
        includedItems:           data.includedItems.map(p => p.value),
        notIncludedItems:        data.notIncludedItems.map(p => p.value),
        courseDuration:          data.courseDuration,
        courseLevel:             data.courseLevel,
        courseCertification:     data.courseCertification,
        courseYogaStyle:         data.courseYogaStyle,
        courseYogaStyleSub:      data.courseYogaStyleSub,
        courseLanguage:          data.courseLanguage,
        courseDateInfo:          data.courseDateInfo,
        courseStartingFeeUSD:    data.courseStartingFeeUSD,
        courseOriginalFeeUSD:    data.courseOriginalFeeUSD,
        bookNowLink:             data.bookNowLink,
      };
      fd.append("data", JSON.stringify(payload));

      if (isEdit) {
        await api.put("/100hr-content/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/100hr-content/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      toast.success(isEdit ? "Content updated!" : "Content saved!");
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/100hourscourse/100hr-content"), 1500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>{isEdit ? "Content Updated!" : "Content Saved!"}</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  const fp = { register, watch, errors, control, setValue };

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/100hourscourse/100hr-content" className={styles.breadcrumbLink}>Page Content</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Content" : "Add Content"}</span>
      </div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Page Content" : "Add Page Content"}</h1>
        <p className={styles.pageSubtitle}>Fill in all content sections for the 100 Hour YTT page</p>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.formCard}>

          {/* ══ BANNER ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Page Banner / Hero Image</h3>
            </div>
            <ImgField label="Banner Image" hint="Main hero image shown at the top of the page"
              fieldName="bannerImage" fileRef={bannerFile} inputRef={bannerFileRef}
              previewVal={bannerImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, bannerFile, "bannerImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ HERO ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Hero Section</h3>
            </div>
            <TField label="Hero Title (H1)" name="heroTitle" max={200} {...fp} />
            <ParaBlock label="Hero Intro Text" arrayMethods={heroParagraphs}
              fieldArrayName="heroParagraphs" required control={fp.control} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ PAGE MAIN VIDEO ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Page Main Video</h3>
              <span style={{ fontSize:"0.78rem", color:"#888", marginLeft:8 }}>
                (shown in "What Is" section, schedule section &amp; video reviews)
              </span>
            </div>
            <VideoFieldWithTabs
              label="Main Page Video"
              videoUrl={mainVideoUrlVal}
              videoFile={mainVideoFileVal}
              fieldNameUrl="videoUrl"
              fieldNameFile="videoFile"
              fileRef={mainVideoFile}
              inputRef={mainVideoInputRef}
              setValue={fp.setValue}
              onFileChange={e => handleVideoFile(e, mainVideoFile, "videoUrl", "videoFile")}
            />
          </div>
          <div className={styles.formDivider} />

          {/* ══ COURSE INFO CARD ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Course Info Card</h3>
              <span style={{ fontSize:"0.78rem", color:"#888", marginLeft:8 }}>
                (Details card shown below hero image)
              </span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <TField label="Duration" name="courseDuration" placeholder="13 Days" max={50} required={false} {...fp} />
              <TField label="Level" name="courseLevel" placeholder="Beginner" max={50} required={false} {...fp} />
              <TField label="Certification" name="courseCertification" placeholder="100 Hour" max={80} required={false} {...fp} />
              <TField label="Yoga Style" name="courseYogaStyle" placeholder="Multistyle" max={80} required={false} {...fp} />
              <TField label="Yoga Style Sub-text" name="courseYogaStyleSub" placeholder="Ashtanga, Vinyasa & Hatha" max={100} required={false} {...fp} />
              <TField label="Language" name="courseLanguage" placeholder="English & Hindi" max={80} required={false} {...fp} />
            </div>
            <TField label="Date / Schedule Info" name="courseDateInfo"
              placeholder="1st to 13th of every month" max={120} required={false} {...fp} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              <NField label="Starting Fee (USD)" hint="e.g. 499"
                name="courseStartingFeeUSD" register={fp.register} errors={fp.errors} />
              <NField label="Original / Crossed-out Fee (USD)" hint="e.g. 899"
                name="courseOriginalFeeUSD" register={fp.register} errors={fp.errors} />
            </div>
            <TField label="Book Now Link" name="bookNowLink"
              hint='Usually "#dates-fees" or a full URL'
              placeholder="#dates-fees" max={300} required={false} {...fp} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ TRANSFORM SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Transform Your Practice</h3>
            </div>
            <TField label="Section Title" name="transformTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={transformParagraphs}
              fieldArrayName="transformParagraphs" control={fp.control} />
            <ImgField label="Right Side Image" fieldName="transformImage"
              fileRef={transformFile} inputRef={transformImgRef}
              previewVal={transformImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, transformFile, "transformImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHAT IS ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>What is 100 Hour YTT?</h3>
            </div>
            <TField label="Section Title" name="whatIsTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={whatIsParagraphs}
              fieldArrayName="whatIsParagraphs" control={fp.control} />
            <p className={styles.fieldHint}>⚡ Uses the "Page Main Video" set above</p>
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHY CHOOSE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Why Choose AYM?</h3>
            </div>
            <TField label="Section Title" name="whyChooseTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={whyChooseParagraphs}
              fieldArrayName="whyChooseParagraphs" control={fp.control} />
            <WhyChooseCardsField control={fp.control} register={fp.register} errors={fp.errors} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ SUITABLE FOR ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Suitable For</h3>
            </div>
            <TField label="Section Title" name="suitableTitle" max={200} {...fp} />
            <ListField label="List Items" arrayMethods={suitableItems}
              fieldArrayName="suitableItems"
              placeholder="e.g. If you want to understand yoga holistically…"
              register={fp.register} />
            <p className={styles.fieldHint} style={{ marginTop:"1rem" }}>Three strip images alongside the list</p>
            <div className={styles.twoColGrid}>
              <ImgField label="Strip Image 1" fieldName="suitableImage1"
                fileRef={suit1File} inputRef={suit1ImgRef}
                previewVal={suit1Val} setValue={fp.setValue}
                onFileChange={e => handleImgFile(e, suit1File, "suitableImage1")} />
              <ImgField label="Strip Image 2" fieldName="suitableImage2"
                fileRef={suit2File} inputRef={suit2ImgRef}
                previewVal={suit2Val} setValue={fp.setValue}
                onFileChange={e => handleImgFile(e, suit2File, "suitableImage2")} />
              <ImgField label="Strip Image 3" fieldName="suitableImage3"
                fileRef={suit3File} inputRef={suit3ImgRef}
                previewVal={suit3Val} setValue={fp.setValue}
                onFileChange={e => handleImgFile(e, suit3File, "suitableImage3")} />
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ SYLLABUS SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Syllabus Section</h3>
            </div>
            <TField label="Syllabus Title" name="syllabusTitle" max={250} {...fp} />
            <ParaBlock label="Intro Paragraphs" arrayMethods={syllabusParagraphs}
              fieldArrayName="syllabusParagraphs" control={fp.control} />

            {/* Left Modules */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Left Column Modules
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.moduleList}>
                {syllabusLeft.fields.map((field, i) => (
                  <div key={field.id} className={styles.moduleCard}>
                    <div className={styles.moduleCardHeader}>
                      <span className={styles.moduleNum}>Module L{i + 1}</span>
                      <button type="button" className={styles.removeItemBtn}
                        onClick={() => syllabusLeft.remove(i)}
                        disabled={syllabusLeft.fields.length <= 1}>✕</button>
                    </div>
                    <div className={styles.moduleFields}>
                      <div className={styles.fieldGroup} style={{ marginBottom:"0.8rem" }}>
                        <label className={styles.labelSm}>Title</label>
                        <div className={`${styles.inputWrap}`}>
                          <input type="text" className={styles.input}
                            placeholder="e.g. Practice of Yoga Techniques" maxLength={100}
                            {...register(`syllabusLeft.${i}.title`, { required: "Title required" })} />
                        </div>
                      </div>
                      <div className={styles.fieldGroup} style={{ marginBottom:0 }}>
                        <label className={styles.labelSm}>Description</label>
                        <div className={`${styles.inputWrap}`}>
                          <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                            placeholder="Module description…" maxLength={400}
                            {...register(`syllabusLeft.${i}.desc`, { required: "Description required" })} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn}
                onClick={() => syllabusLeft.append({ title: "", desc: "" })}>
                + Add Left Module
              </button>
            </div>

            {/* Right Modules */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Right Column Modules
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.moduleList}>
                {syllabusRight.fields.map((field, i) => (
                  <div key={field.id} className={styles.moduleCard}>
                    <div className={styles.moduleCardHeader}>
                      <span className={styles.moduleNum}>Module R{i + 1}</span>
                      <button type="button" className={styles.removeItemBtn}
                        onClick={() => syllabusRight.remove(i)}
                        disabled={syllabusRight.fields.length <= 1}>✕</button>
                    </div>
                    <div className={styles.moduleFields}>
                      <div className={styles.fieldGroup} style={{ marginBottom:"0.8rem" }}>
                        <label className={styles.labelSm}>Title</label>
                        <div className={`${styles.inputWrap}`}>
                          <input type="text" className={styles.input}
                            placeholder="e.g. Practicum" maxLength={100}
                            {...register(`syllabusRight.${i}.title`, { required: "Title required" })} />
                        </div>
                      </div>
                      <div className={styles.fieldGroup} style={{ marginBottom:0 }}>
                        <label className={styles.labelSm}>Description</label>
                        <div className={`${styles.inputWrap}`}>
                          <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                            placeholder="Module description…" maxLength={400}
                            {...register(`syllabusRight.${i}.desc`, { required: "Description required" })} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn}
                onClick={() => syllabusRight.append({ title: "", desc: "" })}>
                + Add Right Module
              </button>
            </div>

            {/* Syllabus Images */}
            <div className={styles.twoColGrid} style={{ marginTop: "1rem" }}>
              <ImgField label="Right Side Image (Top)" fieldName="syllabusImage1"
                fileRef={syllabusImg1File} inputRef={syllabusImg1Ref}
                previewVal={syllabusImage1Val} setValue={fp.setValue}
                onFileChange={e => handleImgFile(e, syllabusImg1File, "syllabusImage1")} />
              
            </div>

            {/* ✅ FIXED: Syllabus Video — own URL & File fields */}
            <VideoFieldWithTabs
              label="Syllabus Right Side Video"
              hint="Video shown below syllabus images"
              videoUrl={syllabusVideoUrlVal}
              videoFile={syllabusVideoFileVal}
              fieldNameUrl="syllabusVideoUrl"
              fieldNameFile="syllabusVideoFile"
              fileRef={syllabusVideoFile}
              inputRef={syllabusVideoInputRef}
              setValue={fp.setValue}
              onFileChange={e => handleVideoFile(e, syllabusVideoFile, "syllabusVideoUrl", "syllabusVideoFile")}
            />
          </div>
          <div className={styles.formDivider} />

          {/* ══ DAILY SCHEDULE ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Daily Schedule</h3>
            </div>

            <div className={styles.twoColGrid}>
              <ImgField label="Left Side Circular Image"
                hint="Ornament image on the left of the schedule"
                fieldName="scheduleImage" fileRef={schedFile} inputRef={schedImgRef}
                previewVal={scheduleImageVal} setValue={fp.setValue}
                onFileChange={e => handleImgFile(e, schedFile, "scheduleImage")} />

              {/* ✅ FIXED: Schedule Video — own URL & File fields */}
              <VideoFieldWithTabs
                label="Schedule Left Side Video"
                hint="Video shown on left of schedule section"
                videoUrl={scheduleVideoUrlVal}
                videoFile={scheduleVideoFileVal}
                fieldNameUrl="scheduleVideoUrl"
                fieldNameFile="scheduleVideoFile"
                fileRef={scheduleVideoFile}
                inputRef={scheduleVideoInputRef}
                setValue={fp.setValue}
                onFileChange={e => handleVideoFile(e, scheduleVideoFile, "scheduleVideoUrl", "scheduleVideoFile")}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Schedule Items
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.schedList}>
                {scheduleItems.fields.map((field, i) => (
                  <div key={field.id} className={styles.schedRow}>
                    <span className={styles.schedRowNum}>{i + 1}</span>
                    <div className={styles.schedRowFields}>
                      <div className={`${styles.inputWrap} ${styles.schedTimeInput}`}>
                        <input type="text" className={styles.input}
                          placeholder="e.g. 07:00 Am – 08:00 Am" maxLength={40}
                          {...register(`scheduleItems.${i}.time`, { required: "Time required" })} />
                      </div>
                      <div className={`${styles.inputWrap} ${styles.schedLabelInput}`}>
                        <input type="text" className={styles.input}
                          placeholder="e.g. Pranayama and Meditation" maxLength={100}
                          {...register(`scheduleItems.${i}.label`, { required: "Label required" })} />
                      </div>
                    </div>
                    <button type="button" className={styles.removeItemBtn}
                      onClick={() => scheduleItems.remove(i)}
                      disabled={scheduleItems.fields.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn}
                onClick={() => scheduleItems.append({ time: "", label: "" })}>
                + Add Schedule Item
              </button>
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ SOUL SHINE BANNER ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Soul Shine Banner</h3>
            </div>
            <TField label="Banner Text" hint="Text overlay shown on the banner image"
              name="soulShineText" placeholder="Let Your Soul Shine" max={100} {...fp} />
            <ImgField label="Banner Image" hint="Full-width banner image with text overlay"
              fieldName="soulShineImage" fileRef={soulFile} inputRef={soulImgRef}
              previewVal={soulShineImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, soulFile, "soulShineImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ WHY ENROL SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Why Enrol Section</h3>
            </div>
            <TField label="Section Title" name="enrollTitle" max={250} {...fp} />
            <ParaBlock label="Intro Paragraphs" arrayMethods={enrollParagraphs}
              fieldArrayName="enrollParagraphs" control={fp.control} />
            <ListField label="Enrol Reasons" arrayMethods={enrollItems}
              fieldArrayName="enrollItems"
              placeholder="e.g. We have a sattvic and spiritual atmosphere…"
              register={fp.register} />
            <ImgField label="Right Side Image" fieldName="enrollImage"
              fileRef={enrollFile} inputRef={enrollImgRef}
              previewVal={enrollImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, enrollFile, "enrollImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ COMPREHENSIVE SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Comprehensive Section</h3>
            </div>
            <TField label="Section Title" name="comprehensiveTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={comprehensiveParagraphs}
              fieldArrayName="comprehensiveParagraphs" control={fp.control} />

            {/* ✅ FIXED: Comprehensive Video — own URL & File fields */}
            <VideoFieldWithTabs
              label="Comprehensive Left Side Video"
              hint="Video shown on left of this section"
              videoUrl={comprehensiveVideoUrlVal}
              videoFile={comprehensiveVideoFileVal}
              fieldNameUrl="comprehensiveVideoUrl"
              fieldNameFile="comprehensiveVideoFile"
              fileRef={comprehensiveVideoFile}
              inputRef={comprehensiveVideoInputRef}
              setValue={fp.setValue}
              onFileChange={e => handleVideoFile(e, comprehensiveVideoFile, "comprehensiveVideoUrl", "comprehensiveVideoFile")}
            />
          </div>
          <div className={styles.formDivider} />

          {/* ══ CERTIFICATION SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Certification</h3>
            </div>
            <TField label="Section Title" name="certTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={certParagraphs}
              fieldArrayName="certParagraphs" control={fp.control} />
            <ImgField label="Right Side Image" fieldName="certImage"
              fileRef={certFile} inputRef={certImgRef}
              previewVal={certImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, certFile, "certImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ REGISTRATION SECTION ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Registration Process</h3>
            </div>
            <TField label="Section Title" name="registrationTitle" max={200} {...fp} />
            <ParaBlock label="Paragraphs" arrayMethods={registrationParagraphs}
              fieldArrayName="registrationParagraphs" control={fp.control} />
            <ImgField label="Left Side Image" fieldName="registrationImage"
              fileRef={registrationFile} inputRef={registrationImgRef}
              previewVal={registrationImageVal} setValue={fp.setValue}
              onFileChange={e => handleImgFile(e, registrationFile, "registrationImage")} />
          </div>
          <div className={styles.formDivider} />

          {/* ══ FEE LISTS ══ */}
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>✦</span>
              <h3 className={styles.sectionTitle}>Fee — Included / Not Included</h3>
            </div>
            <div className={styles.twoColSection}>
              <ListField label="Included in Fee" arrayMethods={includedItems}
                fieldArrayName="includedItems"
                placeholder="e.g. 14 Days Accommodation and 3 Meals / Day"
                register={fp.register} />
              <ListField label="Not Included in Fee" arrayMethods={notIncludedItems}
                fieldArrayName="notIncludedItems"
                placeholder="e.g. Air Ticket and Airport Pickup"
                register={fp.register} />
            </div>
          </div>
          <div className={styles.formDivider} />

          {/* ══ ACTIONS ══ */}
          <div className={styles.formActions}>
            <Link href="/admin/yogacourse/100hourscourse/100hr-content" className={styles.cancelBtn}>
              ← Cancel
            </Link>
            <button type="submit"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
              disabled={isSubmitting}>
              {isSubmitting
                ? <><span className={styles.spinner} /> Saving…</>
                : <><span>✦</span> {isEdit ? "Update Content" : "Save Content"}</>}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

type AnyFieldArray = UseFieldArrayReturn<FormData, any, "id">;