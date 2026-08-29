"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Beginnersadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem {
  text: string;
}
interface InfoRowItem {
  number: string;
  label: string;
}
interface PillarItem {
  icon: string;
  name: string;
  subLabel: string;
  desc: string;
}
interface BenefitItem {
  number: string;
  name: string;
  desc: string;
}
interface QAItem {
  question: string;
  answers: ParagraphItem[];
}
interface InfoCardItem {
  icon: string;
  title: string;
  desc: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Main heading section
  mainTitle: string;
  questionText: string;
  bodyParagraphs: ParagraphItem[];
  infoRow: InfoRowItem[];

  // Second hero image
  secondImageAlt: string;
  _secondImagePreview?: string;

  // Benefits & Understanding section
  benefitsFullTitle: string;
  understandingTitle: string;
  understandingIntro: string;
  pillars: PillarItem[];

  benefitsLabel: string;
  benefits: BenefitItem[];

  // Q&A section
  qaSectionTitle: string;
  qaItems: QAItem[];

  // More information section
  moreInfoSectionTitle: string;
  infoCards: InfoCardItem[];
  noteText: string;

  // Batch section intro (heading only — NOT the seat grid/booking UI,
  // which is handled by the existing PremiumSeatBooking component)
  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  mainTitle: "Yoga Teacher Training Course for Beginners in Rishikesh",
  questionText:
    "Are you planning to join a beginner's yoga course in Rishikesh for the first time but feel confused because you don't have much yoga experience?",
  bodyParagraphs: [{ text: "" }, { text: "" }],
  infoRow: [
    { number: "12", label: "Days Course" },
    { number: "Beginner", label: "Friendly" },
    { number: "Peaceful", label: "Ashram" },
  ],

  secondImageAlt: "Yoga Teacher Training Course for Beginners in Rishikesh",

  benefitsFullTitle: "Understanding of Yoga & Benefit for Beginners Course in Rishikesh",
  understandingTitle: "Understanding of Yoga",
  understandingIntro: "",
  pillars: [
    { icon: "🧘", name: "Asanas", subLabel: "(Postures)", desc: "Physical positions that enhance flexibility, strength, and balance." },
    { icon: "🌬️", name: "Pranayama", subLabel: "(Breath Control)", desc: "Techniques that focus on breath awareness and control to promote relaxation and energy." },
    { icon: "☸️", name: "Meditation", subLabel: "", desc: "Practices aimed at calming the mind and promoting inner peace." },
  ],

  benefitsLabel: "Benefits of Yoga",
  benefits: [
    { number: "01", name: "Increased Flexibility", desc: "Regular practice helps loosen tight muscles, improving overall flexibility and range of motion" },
    { number: "02", name: "Enhanced Strength", desc: "Many yoga poses require different muscle groups, helping build and tone muscles" },
    { number: "03", name: "Stress Relief", desc: "Yoga encourages relaxation and helps alleviate stress through mindfulness and deep breathing" },
    { number: "04", name: "Improved Focus", desc: "Mindfulness practices enhance concentration and mental clarity" },
    { number: "05", name: "Better Posture", desc: "Yoga promotes awareness of body alignment, which can lead to better posture and reduce injury risk" },
  ],

  qaSectionTitle: "Yoga Beginners Course in Rishikesh - Students Questions",
  qaItems: [
    { question: "", answers: [{ text: "" }] },
    { question: "", answers: [{ text: "" }] },
  ],

  moreInfoSectionTitle: "More Information on Beginners' Yoga Course",
  infoCards: [
    { icon: "💆", title: "Ayurvedic Massage", desc: "Course participants can avail one ayurvedic massage per week" },
    { icon: "🍽️", title: "Three Meals Daily", desc: "Nutritious and healthy meals provided throughout the course" },
    { icon: "🛏️", title: "Private Rooms", desc: "Private rooms with free WiFi and attached bathrooms available" },
    { icon: "📅", title: "Class Schedule", desc: "Classes conducted Monday to Saturday, Sundays off" },
    { icon: "🗺️", title: "Tours & Excursions", desc: "Tours in and around Rishikesh planned (at course director's discretion)" },
  ],
  noteText:
    "You may refer to the course start dates and end dates for each month, as well as the fee structure in the section below. Please reach out to us to confirm your seats for the yoga course for beginners. We welcome you to be part of this course. Namaste.",

  batchSectionTag: "Upcoming Batches · 2026–2027",
  batchSectionTitle: "Yoga for Beginners in Rishikesh",
  batchSectionSub: "Choose your dates & preferred accommodation — prices include tuition and meals",
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 180,
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

/* ─────────────────────── Reusable: single rich-text field ─────────────────────── */
function RichTextField({
  control,
  name,
  label,
  required = true,
}: {
  control: Control<FormData, any>;
  name: keyof FormData;
  label: string;
  required?: boolean;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.editorWrap}>
        <Controller
          name={name as any}
          control={control}
          rules={required ? { required: true } : undefined}
          render={({ field }) => (
            <JoditEditor value={field.value as string} config={joditConfig} onBlur={(c) => field.onChange(c)} />
          )}
        />
      </div>
    </div>
  );
}

/* ─────────────────────── Reusable: rich-text paragraph list ─────────────────────── */
function ParagraphList({
  control,
  name,
  label,
  max = 6,
}: {
  control: Control<FormData, any>;
  name: string;
  label: string;
  max?: number;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: "0.9rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>
              Paragraph {index + 1}
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
              render={({ field: f }) => (
                <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />
              )}
            />
          </div>
        </div>
      ))}

      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>
          + Add Paragraph
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function BeginnersAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [secondImageFile, setSecondImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "intro" | "understanding" | "benefits" | "qa" | "moreinfo" | "batchintro"
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

  const infoRowArray = useFieldArray({ control, name: "infoRow" });
  const pillarsArray = useFieldArray({ control, name: "pillars" });
  const benefitsArray = useFieldArray({ control, name: "benefits" });
  const qaArray = useFieldArray({ control, name: "qaItems" });
  const infoCardsArray = useFieldArray({ control, name: "infoCards" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/yoga-beginners-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          questionText: d.questionText ?? INITIAL.questionText,
          bodyParagraphs: d.bodyParagraphs?.length
            ? d.bodyParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.bodyParagraphs,
          infoRow: d.infoRow?.length ? d.infoRow : INITIAL.infoRow,
          secondImageAlt: d.secondImageAlt ?? INITIAL.secondImageAlt,
          _secondImagePreview: d.secondImage ? getImageUrl(d.secondImage) : "",
          benefitsFullTitle: d.benefitsFullTitle ?? INITIAL.benefitsFullTitle,
          understandingTitle: d.understandingTitle ?? INITIAL.understandingTitle,
          understandingIntro: d.understandingIntro ?? INITIAL.understandingIntro,
          pillars: d.pillars?.length ? d.pillars : INITIAL.pillars,
          benefitsLabel: d.benefitsLabel ?? INITIAL.benefitsLabel,
          benefits: d.benefits?.length ? d.benefits : INITIAL.benefits,
          qaSectionTitle: d.qaSectionTitle ?? INITIAL.qaSectionTitle,
          qaItems: d.qaItems?.length
            ? d.qaItems.map((q: any) => ({
                question: q.question,
                answers: (q.answers || []).map((t: string) => ({ text: t })),
              }))
            : INITIAL.qaItems,
          moreInfoSectionTitle: d.moreInfoSectionTitle ?? INITIAL.moreInfoSectionTitle,
          infoCards: d.infoCards?.length ? d.infoCards : INITIAL.infoCards,
          noteText: d.noteText ?? INITIAL.noteText,
          batchSectionTag: d.batchSectionTag ?? INITIAL.batchSectionTag,
          batchSectionTitle: d.batchSectionTitle ?? INITIAL.batchSectionTitle,
          batchSectionSub: d.batchSectionSub ?? INITIAL.batchSectionSub,
        });
      } catch {
        toast.error("Failed to fetch yoga beginners section data");
        router.replace("/admin/dashboard/yoga-for-beginners/yoga-beginners-content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Image handlers ── */
  const handleHeroImage = (file: File | null) => {
    if (!file) return;
    setHeroFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_heroPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleSecondImage = (file: File | null) => {
    if (!file) return;
    setSecondImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_secondImagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("mainTitle", data.mainTitle);
      formData.append("questionText", data.questionText);
      formData.append("bodyParagraphs", JSON.stringify(data.bodyParagraphs.map((p) => p.text)));
      formData.append("infoRow", JSON.stringify(data.infoRow));

      formData.append("secondImageAlt", data.secondImageAlt);

      formData.append("benefitsFullTitle", data.benefitsFullTitle);
      formData.append("understandingTitle", data.understandingTitle);
      formData.append("understandingIntro", data.understandingIntro);
      formData.append("pillars", JSON.stringify(data.pillars));

      formData.append("benefitsLabel", data.benefitsLabel);
      formData.append("benefits", JSON.stringify(data.benefits));

      formData.append("qaSectionTitle", data.qaSectionTitle);
      formData.append(
        "qaItems",
        JSON.stringify(data.qaItems.map((q) => ({ question: q.question, answers: q.answers.map((a) => a.text) })))
      );

      formData.append("moreInfoSectionTitle", data.moreInfoSectionTitle);
      formData.append("infoCards", JSON.stringify(data.infoCards));
      formData.append("noteText", data.noteText);

      formData.append("batchSectionTag", data.batchSectionTag);
      formData.append("batchSectionTitle", data.batchSectionTitle);
      formData.append("batchSectionSub", data.batchSectionSub);

      if (heroFile) formData.append("heroImage", heroFile);
      if (secondImageFile) formData.append("secondImage", secondImageFile);

      if (isEdit && sectionId) {
        await api.put(`/yoga-beginners-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/yoga-beginners-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-for-beginners/yoga-beginners-content"), 1500);
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
          <h2 className={styles.successTitle}>Yoga Beginners Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt),
    intro: !!(errors.mainTitle || errors.questionText || errors.bodyParagraphs || errors.infoRow),
    understanding: !!(errors.secondImageAlt || errors.benefitsFullTitle || errors.understandingTitle || errors.understandingIntro || errors.pillars),
    benefits: !!(errors.benefitsLabel || errors.benefits),
    qa: !!(errors.qaSectionTitle || errors.qaItems),
    moreinfo: !!(errors.moreInfoSectionTitle || errors.infoCards || errors.noteText),
    batchintro: !!(errors.batchSectionTag || errors.batchSectionTitle || errors.batchSectionSub),
  };

  const tabLabels = {
    hero: "① Hero Image",
    intro: "② Intro & Info Row",
    understanding: "③ Understanding of Yoga",
    benefits: "④ Benefits of Yoga",
    qa: "⑤ Q&A",
    moreinfo: "⑥ More Info & Note",
    batchintro: "⑦ Batch Section Intro",
  };

  const tabOrder = ["hero", "intro", "understanding", "benefits", "qa", "moreinfo", "batchintro"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-for-beginners/yoga-beginners-content" className={styles.breadcrumbLink}>
          Yoga for Beginners
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga Beginners Section" : "Add Yoga Beginners Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, intro, benefits, Q&A and more-info content" : "Fill in the page content (seat batches are managed separately)"}
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
          {/* ══════════ TAB 1 — HERO IMAGE ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Top Hero Image</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Banner Image</label>
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
                      <span className={styles.uploadIcon}>🧘</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Image Alt Text</label>
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
          )}

          {/* ══════════ TAB 2 — INTRO & INFO ROW ══════════ */}
          {activeTab === "intro" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Main Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Yoga Teacher Training Course for Beginners in Rishikesh"
                    {...register("mainTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Question Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="Opening question paragraph"
                    {...register("questionText", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="bodyParagraphs" label="Body Paragraphs" max={5} />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Info Row (3 stat pills)</h3>
                <span className={styles.sectionBadge}>{infoRowArray.fields.length}/6</span>
              </div>
              <div className={styles.itemsList}>
                {infoRowArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "160px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 12"
                            {...register(`infoRow.${index}.number`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Days Course"
                            {...register(`infoRow.${index}.label`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => infoRowArray.remove(index)}
                      disabled={infoRowArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {infoRowArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => infoRowArray.append({ number: "", label: "" })}
                >
                  + Add Info Item
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 3 — UNDERSTANDING OF YOGA ══════════ */}
          {activeTab === "understanding" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Second Hero Image</h3>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleSecondImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._secondImagePreview ? (
                    <img src={watchAll._secondImagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image Alt Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Teacher Training Course for Beginners"
                    {...register("secondImageAlt", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Benefits Section Full Title (H3)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Understanding of Yoga & Benefit for Beginners Course in Rishikesh"
                    {...register("benefitsFullTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Understanding of Yoga" Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Understanding of Yoga"
                    {...register("understandingTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="understandingIntro" label="Understanding Intro Text" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Yoga Pillars (Asanas / Pranayama / Meditation)</h3>
                <span className={styles.sectionBadge}>{pillarsArray.fields.length}/6</span>
              </div>
              {pillarsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Pillar #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => pillarsArray.remove(index)}
                      disabled={pillarsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="🧘"
                        {...register(`pillars.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Asanas"
                        {...register(`pillars.${index}.name`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ maxWidth: "180px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. (Postures)"
                        {...register(`pillars.${index}.subLabel`)}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Pillar description"
                        {...register(`pillars.${index}.desc`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {pillarsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => pillarsArray.append({ icon: "✦", name: "", subLabel: "", desc: "" })}
                >
                  + Add Pillar
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 4 — BENEFITS OF YOGA ══════════ */}
          {activeTab === "benefits" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Benefits of Yoga" Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Benefits of Yoga"
                    {...register("benefitsLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Benefit Cards</h3>
                <span className={styles.sectionBadge}>{benefitsArray.fields.length}/10</span>
              </div>
              {benefitsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Benefit #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => benefitsArray.remove(index)}
                      disabled={benefitsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "90px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="01"
                        {...register(`benefits.${index}.number`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Increased Flexibility"
                        {...register(`benefits.${index}.name`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Benefit description"
                        {...register(`benefits.${index}.desc`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {benefitsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    benefitsArray.append({ number: String(benefitsArray.fields.length + 1).padStart(2, "0"), name: "", desc: "" })
                  }
                >
                  + Add Benefit
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 5 — Q&A ══════════ */}
          {activeTab === "qa" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Beginners Course in Rishikesh - Students Questions"
                    {...register("qaSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Questions &amp; Answers</h3>
                <span className={styles.sectionBadge}>{qaArray.fields.length}/10</span>
              </div>
              {qaArray.fields.map((field, index) => (
                <QAFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={index}
                  onRemove={() => qaArray.remove(index)}
                  canRemove={qaArray.fields.length > 1}
                />
              ))}
              {qaArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => qaArray.append({ question: "", answers: [{ text: "" }] })}
                >
                  + Add Question
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 6 — MORE INFO & NOTE ══════════ */}
          {activeTab === "moreinfo" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. More Information on Beginners' Yoga Course"
                    {...register("moreInfoSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Info Cards</h3>
                <span className={styles.sectionBadge}>{infoCardsArray.fields.length}/10</span>
              </div>
              {infoCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => infoCardsArray.remove(index)}
                      disabled={infoCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="💆"
                        {...register(`infoCards.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Ayurvedic Massage"
                        {...register(`infoCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Card description"
                        {...register(`infoCards.${index}.desc`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {infoCardsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => infoCardsArray.append({ icon: "✦", title: "", desc: "" })}
                >
                  + Add Info Card
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Note Box Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="e.g. You may refer to the course start dates and end dates..."
                    {...register("noteText", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 7 — BATCH SECTION INTRO ══════════ */}
          {activeTab === "batchintro" && (
            <div className={styles.sectionBlock}>
              <p className={styles.fieldHint} style={{ marginBottom: "1.2rem" }}>
                This is only the heading block shown just above the seat/batch
                booking grid. The batch dates, pricing and booking button
                themselves are managed separately (seat batches API) and are
                not part of this form.
              </p>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Tag</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Upcoming Batches · 2026–2027"
                    {...register("batchSectionTag", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Heading (course title)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga for Beginners in Rishikesh"
                    {...register("batchSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Subtitle</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Choose your dates & preferred accommodation — prices include tuition and meals"
                    {...register("batchSectionSub", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-beginners" className={styles.cancelBtn}>
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
              {activeTab !== "batchintro" ? (
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

/* ─────────────────────── Reusable: one Q&A item (question + dynamic answer paragraphs) ─────────────────────── */
function QAFields({
  control,
  register,
  index,
  onRemove,
  canRemove,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const answersArray = useFieldArray({ control, name: `qaItems.${index}.answers` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Question #{index + 1}</span>
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

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Question</label>
        <div className={styles.inputWrap}>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            rows={2}
            placeholder="e.g. What will be learned in the Yoga Beginners Course at AYM?"
            {...register(`qaItems.${index}.question`, { required: "Required" })}
          />
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Answer Paragraphs</h3>
        <span className={styles.sectionBadge}>{answersArray.fields.length}/8</span>
      </div>
      {answersArray.fields.map((field, aIndex) => (
        <div key={field.id} style={{ marginBottom: "0.7rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.3rem" }}>
            <label className={styles.label} style={{ marginBottom: 0, fontSize: "0.66rem" }}>
              Paragraph {aIndex + 1}
            </label>
            <button
              type="button"
              className={styles.removeItemBtn}
              style={{ marginLeft: "auto" }}
              onClick={() => answersArray.remove(aIndex)}
              disabled={answersArray.fields.length <= 1}
            >
              ✕
            </button>
          </div>
          <div className={styles.inputWrap}>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows={3}
              placeholder="Answer paragraph text"
              {...register(`qaItems.${index}.answers.${aIndex}.text`, { required: true })}
            />
          </div>
        </div>
      ))}
      {answersArray.fields.length < 8 && (
        <button type="button" className={styles.addBtn} onClick={() => answersArray.append({ text: "" })}>
          + Add Paragraph
        </button>
      )}
    </div>
  );
}