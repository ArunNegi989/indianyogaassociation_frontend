"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Aboutadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Icon options (react-icons/fa names) ─────────────────────── */
const ICON_OPTIONS = [
  "FaLeaf", "FaHeart", "FaBook", "FaUsers", "FaGraduationCap", "FaLightbulb",
  "FaFlask", "FaHandsHelping", "FaOm", "FaStar", "FaGlobe", "FaMedal",
  "FaCertificate", "FaPrayingHands", "FaSeedling", "FaSun",
];

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem {
  text: string;
}

interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

interface ActivityItem {
  icon: string;
  title: string;
  description: string;
}

interface ObjectiveItem {
  text: string;
}

interface TimelineItem {
  year: string;
  title: string;
  paragraphs: ParagraphItem[];
  preview?: string;
  file?: File;
  existingUrl?: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Logo badge
  logoAbbr: string;
  logoFullText: string;
  logoIndiaText: string;

  // Block 1 — School section
  schoolBlockTitle: string;
  schoolParagraphs: ParagraphItem[];
  schoolGalleryLabel: string;
  _schoolGalleryPreview?: string;

  // Highlights grid
  highlights: HighlightItem[];

  // Block 2 — Vision & Mission
  visionMissionBlockTitle: string;
  visionTitle: string;
  visionParagraphs: ParagraphItem[];
  _visionImagePreview?: string;
  missionTitle: string;
  missionParagraphs: ParagraphItem[];
  _missionImagePreview?: string;
  visionMissionProseParagraphs: ParagraphItem[];

  // Block 3 — Aims and Objectives
  objectivesBlockTitle: string;
  objectivesIntroParagraphs: ParagraphItem[];
  objectives: ObjectiveItem[];

  // Block 4 — History of AYM
  historyBlockTitle: string;
  timelineItems: TimelineItem[];

  // Block 5 — Activities
  activitiesBlockTitle: string;
  activitiesIntroParagraphs: ParagraphItem[];
  activities: ActivityItem[];
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",
  logoAbbr: "AYM",
  logoFullText: "ASSOCIATION FOR YOGA & MEDITATION",
  logoIndiaText: "✦ INDIA ✦",

  schoolBlockTitle: "Yoga School in India",
  schoolParagraphs: [{ text: "" }, { text: "" }],
  schoolGalleryLabel: "Yoga Practice",

  highlights: [
    { icon: "FaLeaf", title: "Traditional Wisdom", description: "Ancient yogic practices combined with modern science" },
    { icon: "FaHeart", title: "Holistic Healing", description: "Mind, body, and spirit wellness programs" },
    { icon: "FaBook", title: "Expert Training", description: "Certified yoga teachers with decades of experience" },
    { icon: "FaUsers", title: "Global Community", description: "Students from over 50 countries worldwide" },
  ],

  visionMissionBlockTitle: "Vision and Mission",
  visionTitle: "Our Vision",
  visionParagraphs: [{ text: "" }],
  missionTitle: "Our Mission",
  missionParagraphs: [{ text: "" }],
  visionMissionProseParagraphs: [{ text: "" }],

  objectivesBlockTitle: "Aims and Objectives of AYM India",
  objectivesIntroParagraphs: [{ text: "" }],
  objectives: [
    { text: "Establishment of yoga study centers in India and abroad." },
    { text: "Developing standards for yoga teacher training programs and assisting other schools." },
    { text: "Leading and integrating spiritual communities and yoga schools in India." },
    { text: "Promotion of research in yoga and yoga institutes in India." },
  ],

  historyBlockTitle: "History of AYM",
  timelineItems: [
    { year: "2005", title: "Foundation Year", paragraphs: [{ text: "" }] },
    { year: "2005-2006", title: "National Recognition", paragraphs: [{ text: "" }] },
    { year: "2006+", title: "Global Expansion", paragraphs: [{ text: "" }] },
  ],

  activitiesBlockTitle: "Activities",
  activitiesIntroParagraphs: [{ text: "" }],
  activities: [
    { icon: "FaGraduationCap", title: "Teacher Training", description: "Comprehensive 100, 200, 300, and 500-hour certification programs" },
    { icon: "FaLightbulb", title: "Workshops & Retreats", description: "Specialized sessions on meditation, pranayama, and yoga philosophy" },
    { icon: "FaFlask", title: "Research & Development", description: "Scientific studies on yoga benefits and traditional practices" },
    { icon: "FaHandsHelping", title: "Community Outreach", description: "Spreading yoga awareness and wellness programs across India" },
  ],
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 220,
  toolbarAdaptive: false,
  buttons: [
    "bold", "italic", "underline", "strikethrough", "|",
    "font", "fontsize", "brush", "|",
    "paragraph", "|", "ul", "ol", "|", "align", "|",
    "link", "unlink", "|", "undo", "redo", "|", "eraser", "fullsize",
  ],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
  style: { fontFamily: "inherit", fontSize: "15px" },
};

/* ─────────────────────── Reusable: dynamic paragraph list ─────────────────────── */
function ParagraphList({
  control,
  errors,
  name,
  label,
  minRequired = false,
}: {
  control: Control<FormData, any>;
  errors: any;
  name: string;
  label: string;
  minRequired?: boolean;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/8</span>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: "0.9rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>
              Paragraph {index + 1}
              {minRequired && index === 0 && <span className={styles.required}>*</span>}
            </label>
            <button
              type="button"
              className={styles.removeItemBtn}
              style={{ marginLeft: "auto" }}
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              ✕
            </button>
          </div>
          <div className={styles.editorWrap}>
            <Controller
              name={`${name}.${index}.text` as any}
              control={control}
              rules={minRequired && index === 0 ? { required: "Required" } : undefined}
              render={({ field: f }) => (
                <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
              )}
            />
          </div>
        </div>
      ))}

      {fields.length < 8 && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>
          + Add Paragraph
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: Icon+Title+Description item list (highlights/activities) ─────────────────────── */
function IconItemList({
  control,
  register,
  name,
  fields,
  append,
  remove,
  addLabel,
  max = 8,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: "highlights" | "activities";
  fields: any[];
  append: (v: any) => void;
  remove: (i: number) => void;
  addLabel: string;
  max?: number;
}) {
  return (
    <>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.itemFieldsRow}>
                <div className={styles.inputWrap} style={{ maxWidth: "160px" }}>
                  <select className={styles.select} {...register(`${name}.${index}.icon` as any)}>
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Title"
                    {...register(`${name}.${index}.title` as any, { required: true })}
                  />
                </div>
              </div>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Description"
                  {...register(`${name}.${index}.description` as any, { required: true })}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.removeItemBtn}
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {fields.length < max && (
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => append({ icon: "FaStar", title: "", description: "" })}
        >
          + {addLabel}
        </button>
      )}
    </>
  );
}

/* ─────────────────────── Reusable: single timeline item (own image + nested paragraph array) ─────────────────────── */
function TimelineItemFields({
  control,
  register,
  setValue,
  watch,
  index,
  onRemove,
  canRemove,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const paragraphsArray = useFieldArray({ control, name: `timelineItems.${index}.paragraphs` });
  const preview = watch(`timelineItems.${index}.preview`);

  const handleImage = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(`timelineItems.${index}.preview`, e.target?.result as string);
      setValue(`timelineItems.${index}.file`, file as any);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Timeline #{index + 1}</span>
        <button
          type="button"
          className={styles.removeItemBtn}
          style={{ marginLeft: "auto" }}
          onClick={onRemove}
          disabled={!canRemove}
        >
          ✕
        </button>
      </div>

      <div className={styles.itemFieldsRow}>
        <div className={styles.fieldGroup} style={{ flex: 1 }}>
          <label className={styles.label}>Year / Marker</label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 2005"
              {...register(`timelineItems.${index}.year`, { required: "Required" })}
            />
          </div>
        </div>
        <div className={styles.fieldGroup} style={{ flex: 2 }}>
          <label className={styles.label}>Title</label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Foundation Year"
              {...register(`timelineItems.${index}.title`, { required: "Required" })}
            />
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Image</label>
        <label className={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={(e) => handleImage(e.target.files?.[0] || null)}
          />
          {preview ? (
            <img src={preview} alt="preview" className={styles.imgPreview} />
          ) : (
            <>
              <span className={styles.uploadIcon}>🖼️</span>
              <span className={styles.uploadText}>Click to upload</span>
            </>
          )}
        </label>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Paragraphs</h3>
        <span className={styles.sectionBadge}>{paragraphsArray.fields.length}/6</span>
      </div>

      {paragraphsArray.fields.map((pField, pIndex) => (
        <div key={pField.id} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>
              Paragraph {pIndex + 1}
            </label>
            <button
              type="button"
              className={styles.removeItemBtn}
              style={{ marginLeft: "auto" }}
              onClick={() => paragraphsArray.remove(pIndex)}
              disabled={paragraphsArray.fields.length <= 1}
            >
              ✕
            </button>
          </div>
          <div className={styles.editorWrap}>
            <Controller
              name={`timelineItems.${index}.paragraphs.${pIndex}.text`}
              control={control}
              render={({ field: f }) => (
                <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
              )}
            />
          </div>
        </div>
      ))}

      {paragraphsArray.fields.length < 6 && (
        <button type="button" className={styles.addBtn} onClick={() => paragraphsArray.append({ text: "" })}>
          + Add Paragraph
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function AboutAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [schoolGalleryFile, setSchoolGalleryFile] = useState<File | null>(null);
  const [visionImageFile, setVisionImageFile] = useState<File | null>(null);
  const [missionImageFile, setMissionImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "school" | "highlights" | "visionMission" | "objectives" | "history" | "activities"
  >("hero");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({ defaultValues: INITIAL, mode: "onChange" });

  const watchAll = watch();

  const highlightsArray = useFieldArray({ control, name: "highlights" });
  const objectivesArray = useFieldArray({ control, name: "objectives" });
  const timelineArray = useFieldArray({ control, name: "timelineItems" });
  const activitiesArray = useFieldArray({ control, name: "activities" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/about-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",

          logoAbbr: d.logoAbbr ?? INITIAL.logoAbbr,
          logoFullText: d.logoFullText ?? INITIAL.logoFullText,
          logoIndiaText: d.logoIndiaText ?? INITIAL.logoIndiaText,

          schoolBlockTitle: d.schoolBlockTitle ?? INITIAL.schoolBlockTitle,
          schoolParagraphs: d.schoolParagraphs?.length ? d.schoolParagraphs.map((t: string) => ({ text: t })) : INITIAL.schoolParagraphs,
          schoolGalleryLabel: d.schoolGalleryLabel ?? INITIAL.schoolGalleryLabel,
          _schoolGalleryPreview: d.schoolGalleryImage ? getImageUrl(d.schoolGalleryImage) : "",

          highlights: d.highlights?.length ? d.highlights : INITIAL.highlights,

          visionMissionBlockTitle: d.visionMissionBlockTitle ?? INITIAL.visionMissionBlockTitle,
          visionTitle: d.visionTitle ?? INITIAL.visionTitle,
          visionParagraphs: d.visionParagraphs?.length ? d.visionParagraphs.map((t: string) => ({ text: t })) : INITIAL.visionParagraphs,
          _visionImagePreview: d.visionImage ? getImageUrl(d.visionImage) : "",
          missionTitle: d.missionTitle ?? INITIAL.missionTitle,
          missionParagraphs: d.missionParagraphs?.length ? d.missionParagraphs.map((t: string) => ({ text: t })) : INITIAL.missionParagraphs,
          _missionImagePreview: d.missionImage ? getImageUrl(d.missionImage) : "",
          visionMissionProseParagraphs: d.visionMissionProseParagraphs?.length
            ? d.visionMissionProseParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.visionMissionProseParagraphs,

          objectivesBlockTitle: d.objectivesBlockTitle ?? INITIAL.objectivesBlockTitle,
          objectivesIntroParagraphs: d.objectivesIntroParagraphs?.length
            ? d.objectivesIntroParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.objectivesIntroParagraphs,
          objectives: d.objectives?.length ? d.objectives.map((t: string) => ({ text: t })) : INITIAL.objectives,

          historyBlockTitle: d.historyBlockTitle ?? INITIAL.historyBlockTitle,
          timelineItems: d.timelineItems?.length
            ? d.timelineItems.map((t: any) => ({
                year: t.year ?? "",
                title: t.title ?? "",
                paragraphs: t.paragraphs?.length ? t.paragraphs.map((p: string) => ({ text: p })) : [{ text: "" }],
                existingUrl: t.image ?? "",
                preview: t.image ? getImageUrl(t.image) : "",
              }))
            : INITIAL.timelineItems,

          activitiesBlockTitle: d.activitiesBlockTitle ?? INITIAL.activitiesBlockTitle,
          activitiesIntroParagraphs: d.activitiesIntroParagraphs?.length
            ? d.activitiesIntroParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.activitiesIntroParagraphs,
          activities: d.activities?.length ? d.activities : INITIAL.activities,
        });
      } catch {
        toast.error("Failed to fetch about section data");
        router.replace("/admin/dashboard/about-aym");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Single image handlers ── */
  const makeSingleImageHandler = (
    previewField: keyof FormData,
    setter: (f: File | null) => void
  ) => (file: File | null) => {
    if (!file) return;
    setter(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue(previewField as any, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleHeroImage = makeSingleImageHandler("_heroPreview", setHeroFile);
  const handleSchoolGalleryImage = makeSingleImageHandler("_schoolGalleryPreview", setSchoolGalleryFile);
  const handleVisionImage = makeSingleImageHandler("_visionImagePreview", setVisionImageFile);
  const handleMissionImage = makeSingleImageHandler("_missionImagePreview", setMissionImageFile);

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Simple text fields
      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("logoAbbr", data.logoAbbr);
      formData.append("logoFullText", data.logoFullText);
      formData.append("logoIndiaText", data.logoIndiaText);
      formData.append("schoolBlockTitle", data.schoolBlockTitle);
      formData.append("schoolGalleryLabel", data.schoolGalleryLabel);
      formData.append("visionMissionBlockTitle", data.visionMissionBlockTitle);
      formData.append("visionTitle", data.visionTitle);
      formData.append("missionTitle", data.missionTitle);
      formData.append("objectivesBlockTitle", data.objectivesBlockTitle);
      formData.append("historyBlockTitle", data.historyBlockTitle);
      formData.append("activitiesBlockTitle", data.activitiesBlockTitle);

      // Dynamic paragraph lists (arrays of HTML strings)
      formData.append("schoolParagraphs", JSON.stringify(data.schoolParagraphs.map((p) => p.text)));
      formData.append("visionParagraphs", JSON.stringify(data.visionParagraphs.map((p) => p.text)));
      formData.append("missionParagraphs", JSON.stringify(data.missionParagraphs.map((p) => p.text)));
      formData.append(
        "visionMissionProseParagraphs",
        JSON.stringify(data.visionMissionProseParagraphs.map((p) => p.text))
      );
      formData.append(
        "objectivesIntroParagraphs",
        JSON.stringify(data.objectivesIntroParagraphs.map((p) => p.text))
      );
      formData.append(
        "activitiesIntroParagraphs",
        JSON.stringify(data.activitiesIntroParagraphs.map((p) => p.text))
      );

      // Simple string lists
      formData.append("objectives", JSON.stringify(data.objectives.map((o) => o.text)));

      // Icon+title+description arrays
      formData.append("highlights", JSON.stringify(data.highlights));
      formData.append("activities", JSON.stringify(data.activities));

      // Single images
      if (heroFile) formData.append("heroImage", heroFile);
      if (schoolGalleryFile) formData.append("schoolGalleryImage", schoolGalleryFile);
      if (visionImageFile) formData.append("visionImage", visionImageFile);
      if (missionImageFile) formData.append("missionImage", missionImageFile);

      // Timeline items: year/title/paragraphs (JSON) + per-item image files/existing
      formData.append(
        "timelineData",
        JSON.stringify(
          data.timelineItems.map((t) => ({
            year: t.year,
            title: t.title,
            paragraphs: t.paragraphs.map((p) => p.text),
          }))
        )
      );
      data.timelineItems.forEach((t, i) => {
        if (t.file) formData.append(`timelineImage_${i}`, t.file);
      });
      formData.append(
        "existingTimelineImages",
        JSON.stringify(data.timelineItems.map((t) => (t.file ? null : t.existingUrl ?? null)))
      );

      if (isEdit && sectionId) {
        await api.put(`/about-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/about-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/about-aym"), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading Skeleton ── */
  if (loadingData) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>About Us Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.logoAbbr),
    school: !!(errors.schoolBlockTitle || errors.schoolParagraphs),
    highlights: !!errors.highlights,
    visionMission: !!(errors.visionTitle || errors.missionTitle || errors.visionParagraphs || errors.missionParagraphs),
    objectives: !!(errors.objectivesBlockTitle || errors.objectives),
    history: !!(errors.historyBlockTitle || errors.timelineItems),
    activities: !!(errors.activitiesBlockTitle || errors.activities),
  };

  const tabLabels = {
    hero: "① Hero & Logo",
    school: "② School Section",
    highlights: "③ Highlights",
    visionMission: "④ Vision & Mission",
    objectives: "⑤ Objectives",
    history: "⑥ History",
    activities: "⑦ Activities",
  };

  const tabOrder = ["hero", "school", "highlights", "visionMission", "objectives", "history", "activities"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/about-aym" className={styles.breadcrumbLink}>
          About Us Section
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit About Us Section" : "Add About Us Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, school section, highlights, vision, objectives, history and activities" : "Fill in every section of the About Us page"}
        </p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        {tabOrder.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabErrors[tab] && <span className={styles.tabDot} />}
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ══════════ TAB 1 — HERO & LOGO ══════════ */}
          {activeTab === "hero" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Hero Image</h3>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Hero Banner Image
                  </label>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleHeroImage(e.target.files?.[0] || null)}
                    />
                    {watchAll._heroPreview ? (
                      <img src={watchAll._heroPreview} alt="preview" className={styles.imgPreview} />
                    ) : (
                      <>
                        <span className={styles.uploadIcon}>🏔️</span>
                        <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                        <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                      </>
                    )}
                  </label>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    <span className={styles.labelIcon}>✦</span>
                    Hero Image Alt Text
                  </label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Students Group"
                      {...register("heroImageAlt", { required: "Alt text is required" })}
                    />
                  </div>
                  {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Logo Badge</h3>
                </div>

                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Abbreviation</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. AYM"
                        {...register("logoAbbr", { required: "Required" })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>India Tagline</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. ✦ INDIA ✦"
                        {...register("logoIndiaText")}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Full Organisation Name</label>
                  <p className={styles.fieldHint}>e.g. "ASSOCIATION FOR YOGA & MEDITATION"</p>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="ASSOCIATION FOR YOGA & MEDITATION"
                      {...register("logoFullText")}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 2 — SCHOOL SECTION ══════════ */}
          {activeTab === "school" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Yoga School in India — Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Block Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.schoolBlockTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga School in India"
                    {...register("schoolBlockTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} errors={errors} name="schoolParagraphs" label="School Description Paragraphs" minRequired />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Gallery Image (right side)</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleSchoolGalleryImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._schoolGalleryPreview ? (
                    <img src={watchAll._schoolGalleryPreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Gallery Image Caption / Label</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Practice"
                    {...register("schoolGalleryLabel")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — HIGHLIGHTS ══════════ */}
          {activeTab === "highlights" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Highlights Grid</h3>
                <span className={styles.sectionBadge}>{highlightsArray.fields.length}/8</span>
              </div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                Icon, title and short description for each highlight card.
              </p>

              <IconItemList
                control={control}
                register={register}
                name="highlights"
                fields={highlightsArray.fields}
                append={highlightsArray.append}
                remove={highlightsArray.remove}
                addLabel="Add Highlight"
              />
            </div>
          )}

          {/* ══════════ TAB 4 — VISION & MISSION ══════════ */}
          {activeTab === "visionMission" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Vision & Mission Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Block Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Vision and Mission"
                    {...register("visionMissionBlockTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Vision Image</label>
                    <label className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={(e) => handleVisionImage(e.target.files?.[0] || null)}
                      />
                      {watchAll._visionImagePreview ? (
                        <img src={watchAll._visionImagePreview} alt="preview" className={styles.imgPreview} />
                      ) : (
                        <>
                          <span className={styles.uploadIcon}>🧘</span>
                          <span className={styles.uploadText}>Click to upload</span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Vision Title</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Our Vision"
                        {...register("visionTitle", { required: "Required" })}
                      />
                    </div>
                  </div>
                  <ParagraphList control={control} errors={errors} name="visionParagraphs" label="Vision Paragraphs" minRequired />
                </div>

                <div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Mission Image</label>
                    <label className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={(e) => handleMissionImage(e.target.files?.[0] || null)}
                      />
                      {watchAll._missionImagePreview ? (
                        <img src={watchAll._missionImagePreview} alt="preview" className={styles.imgPreview} />
                      ) : (
                        <>
                          <span className={styles.uploadIcon}>🕉️</span>
                          <span className={styles.uploadText}>Click to upload</span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Mission Title</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Our Mission"
                        {...register("missionTitle", { required: "Required" })}
                      />
                    </div>
                  </div>
                  <ParagraphList control={control} errors={errors} name="missionParagraphs" label="Mission Paragraphs" minRequired />
                </div>
              </div>

              <div className={styles.formDivider} />

              <ParagraphList
                control={control}
                errors={errors}
                name="visionMissionProseParagraphs"
                label="Closing Prose Paragraphs"
              />
            </div>
          )}

          {/* ══════════ TAB 5 — OBJECTIVES ══════════ */}
          {activeTab === "objectives" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Aims & Objectives Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Block Title (H2)</label>
                <div className={`${styles.inputWrap} ${errors.objectivesBlockTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Aims and Objectives of AYM India"
                    {...register("objectivesBlockTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} errors={errors} name="objectivesIntroParagraphs" label="Intro Paragraphs" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Objectives List</h3>
                <span className={styles.sectionBadge}>{objectivesArray.fields.length}/12</span>
              </div>

              <div className={styles.itemsList}>
                {objectivesArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>{index + 1}</span>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="Objective text"
                          {...register(`objectives.${index}.text`, { required: true })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => objectivesArray.remove(index)}
                      disabled={objectivesArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {objectivesArray.fields.length < 12 && (
                <button type="button" className={styles.addBtn} onClick={() => objectivesArray.append({ text: "" })}>
                  + Add Objective
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 6 — HISTORY TIMELINE ══════════ */}
          {activeTab === "history" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>History Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Block Title (H2)</label>
                <div className={`${styles.inputWrap} ${errors.historyBlockTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. History of AYM"
                    {...register("historyBlockTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: "0.6rem" }}>
                <span className={styles.sectionBadge}>{timelineArray.fields.length}/10 timeline entries</span>
              </div>

              {timelineArray.fields.map((field, index) => (
                <TimelineItemFields
                  key={field.id}
                  control={control}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  index={index}
                  onRemove={() => timelineArray.remove(index)}
                  canRemove={timelineArray.fields.length > 1}
                />
              ))}

              {timelineArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => timelineArray.append({ year: "", title: "", paragraphs: [{ text: "" }] })}
                >
                  + Add Timeline Entry
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 7 — ACTIVITIES ══════════ */}
          {activeTab === "activities" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Activities Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Block Title (H2)</label>
                <div className={`${styles.inputWrap} ${errors.activitiesBlockTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Activities"
                    {...register("activitiesBlockTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} errors={errors} name="activitiesIntroParagraphs" label="Intro Paragraphs" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Activities Grid</h3>
                <span className={styles.sectionBadge}>{activitiesArray.fields.length}/8</span>
              </div>

              <IconItemList
                control={control}
                register={register}
                name="activities"
                fields={activitiesArray.fields}
                append={activitiesArray.append}
                remove={activitiesArray.remove}
                addLabel="Add Activity"
              />
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/about-aym" className={styles.cancelBtn}>
              ← Cancel
            </Link>
            <div className={styles.actionsRight}>
              {activeTab !== "hero" && (
                <button
                  key="prev-btn"
                  type="button"
                  className={styles.prevBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tabOrder[tabOrder.indexOf(activeTab) - 1]);
                  }}
                >
                  ← Previous
                </button>
              )}
              {activeTab !== "activities" ? (
                <button
                  key="next-btn"
                  type="button"
                  className={styles.nextBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tabOrder[tabOrder.indexOf(activeTab) + 1]);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  key="submit-btn"
                  type="submit"
                  className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} /> Saving…
                    </>
                  ) : (
                    <>
                      <span>✦</span> {isEdit ? "Update Section" : "Save Section"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}