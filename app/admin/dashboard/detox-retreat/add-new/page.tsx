"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Detoxadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem {
  text: string;
}
interface TextItem {
  text: string;
}
interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
}
interface StepItem {
  title: string;
  desc: string;
}
interface SystemItem {
  description: string;
  providesLabel: string;
  providesList: TextItem[];
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  mainTitle: string;

  // Section 1 — Intro
  s1Para1: string;
  s1HighlightText: string;
  s1Para2: string;
  _s1ImagePreview?: string;
  s1ImageBadge: string;
  s1ConclusionQuote: string;

  // Section 2 — How to correct
  s2Label: string;
  s2Title: string;
  s2Body: string;
  benefits: BenefitItem[];

  // Section 3 — Method
  s3Label: string;
  s3Title: string;
  s3Body: string;
  steps: StepItem[];
  finalStepTitle: string;
  finalStepDesc: string;

  // Section 4 — Massage
  s4Label: string;
  s4Title: string;
  badges: TextItem[];
  _massagePreview?: string;
  overlayQuote: string;

  // Section 5 — Two systems
  s5Label: string;
  s5Title: string;
  systems: SystemItem[];

  // Section 6 — Packages
  s6Label: string;
  s6Title: string;
  packages: TextItem[];
  priceNote: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",
  mainTitle: "DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION",

  s1Para1: "",
  s1HighlightText: "",
  s1Para2: "",
  s1ImageBadge: "Ayurveda Detox",
  s1ConclusionQuote: "",

  s2Label: "Holistic Healing",
  s2Title: "HOW TO CORRECT THIS PROBLEM?",
  s2Body: "",
  benefits: [
    { icon: "⚖️", title: "Weight Loss", desc: "" },
    { icon: "✨", title: "Clearer Skin", desc: "" },
    { icon: "🧠", title: "Mental Clarity", desc: "" },
  ],

  s3Label: "Our Method",
  s3Title: "COMPLETE METHOD TO DETOXIFICATION THROUGH YOGA, AYURVEDA, AND DIET",
  s3Body: "",
  steps: [
    { title: "Digestive Detox", desc: "" },
    { title: "Gut Detox", desc: "" },
    { title: "Breathing & Lungs Detox", desc: "" },
    { title: "Muscles, Bones & Skin", desc: "" },
    { title: "Blood Purification", desc: "" },
    { title: "Digital Detox", desc: "" },
  ],
  finalStepTitle: "Complete Detox",
  finalStepDesc: "",

  s4Label: "Experience",
  s4Title: "AYURVEDA MASSAGE THERAPY",
  badges: [{ text: "Abhyanga" }, { text: "Shirodhara" }, { text: "Nasya" }],
  overlayQuote: "Healing begins where toxins end.",

  s5Label: "Our Approach",
  s5Title: "WE HAVE TWO SYSTEMS FOR DETOXIFICATION AT AYM DETOX SCHOOL IN RISHIKESH",
  systems: [
    {
      description: "",
      providesLabel: "what to expect:",
      providesList: [{ text: "" }],
    },
    {
      description: "",
      providesLabel: "we will provide you:",
      providesList: [{ text: "" }],
    },
  ],

  s6Label: "Plans",
  s6Title: "PRICE AND PACKAGES",
  packages: [{ text: "3 Days" }, { text: "7 Days" }, { text: "10 Days" }, { text: "15 Days" }],
  priceNote: "Price will let you know after consultation with our Ayurveda Doctor (by Email)",
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

/* ─────────────────────── Reusable: plain-text repeatable list ─────────────────────── */
function TextItemList({
  control,
  register,
  name,
  label,
  placeholder,
  max = 10,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  placeholder?: string;
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
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={placeholder || "Text"}
                  {...register(`${name}.${index}.text` as any, { required: true })}
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
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>
          + Add
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function DetoxAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [s1ImageFile, setS1ImageFile] = useState<File | null>(null);
  const [massageFile, setMassageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "intro" | "correct" | "method" | "massage" | "systems" | "packages"
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

  const benefitsArray = useFieldArray({ control, name: "benefits" });
  const stepsArray = useFieldArray({ control, name: "steps" });
  const badgesArray = useFieldArray({ control, name: "badges" });
  const systemsArray = useFieldArray({ control, name: "systems" });
  const packagesArray = useFieldArray({ control, name: "packages" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/detox-retreat-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          s1Para1: d.s1Para1 ?? INITIAL.s1Para1,
          s1HighlightText: d.s1HighlightText ?? INITIAL.s1HighlightText,
          s1Para2: d.s1Para2 ?? INITIAL.s1Para2,
          _s1ImagePreview: d.s1Image ? getImageUrl(d.s1Image) : "",
          s1ImageBadge: d.s1ImageBadge ?? INITIAL.s1ImageBadge,
          s1ConclusionQuote: d.s1ConclusionQuote ?? INITIAL.s1ConclusionQuote,
          s2Label: d.s2Label ?? INITIAL.s2Label,
          s2Title: d.s2Title ?? INITIAL.s2Title,
          s2Body: d.s2Body ?? INITIAL.s2Body,
          benefits: d.benefits?.length ? d.benefits : INITIAL.benefits,
          s3Label: d.s3Label ?? INITIAL.s3Label,
          s3Title: d.s3Title ?? INITIAL.s3Title,
          s3Body: d.s3Body ?? INITIAL.s3Body,
          steps: d.steps?.length ? d.steps : INITIAL.steps,
          finalStepTitle: d.finalStepTitle ?? INITIAL.finalStepTitle,
          finalStepDesc: d.finalStepDesc ?? INITIAL.finalStepDesc,
          s4Label: d.s4Label ?? INITIAL.s4Label,
          s4Title: d.s4Title ?? INITIAL.s4Title,
          badges: d.badges?.length ? d.badges.map((t: string) => ({ text: t })) : INITIAL.badges,
          _massagePreview: d.massageImage ? getImageUrl(d.massageImage) : "",
          overlayQuote: d.overlayQuote ?? INITIAL.overlayQuote,
          s5Label: d.s5Label ?? INITIAL.s5Label,
          s5Title: d.s5Title ?? INITIAL.s5Title,
          systems: d.systems?.length
            ? d.systems.map((s: any) => ({
                ...s,
                providesList: (s.providesList || []).map((t: string) => ({ text: t })),
              }))
            : INITIAL.systems,
          s6Label: d.s6Label ?? INITIAL.s6Label,
          s6Title: d.s6Title ?? INITIAL.s6Title,
          packages: d.packages?.length ? d.packages.map((t: string) => ({ text: t })) : INITIAL.packages,
          priceNote: d.priceNote ?? INITIAL.priceNote,
        });
      } catch {
        toast.error("Failed to fetch detox retreat section data");
        router.replace("/admin/dashboard/detox-retreat");
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
  const handleS1Image = (file: File | null) => {
    if (!file) return;
    setS1ImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_s1ImagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleMassageImage = (file: File | null) => {
    if (!file) return;
    setMassageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_massagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("mainTitle", data.mainTitle);
      formData.append("s1Para1", data.s1Para1);
      formData.append("s1HighlightText", data.s1HighlightText);
      formData.append("s1Para2", data.s1Para2);
      formData.append("s1ImageBadge", data.s1ImageBadge);
      formData.append("s1ConclusionQuote", data.s1ConclusionQuote);

      formData.append("s2Label", data.s2Label);
      formData.append("s2Title", data.s2Title);
      formData.append("s2Body", data.s2Body);
      formData.append("benefits", JSON.stringify(data.benefits));

      formData.append("s3Label", data.s3Label);
      formData.append("s3Title", data.s3Title);
      formData.append("s3Body", data.s3Body);
      formData.append("steps", JSON.stringify(data.steps));
      formData.append("finalStepTitle", data.finalStepTitle);
      formData.append("finalStepDesc", data.finalStepDesc);

      formData.append("s4Label", data.s4Label);
      formData.append("s4Title", data.s4Title);
      formData.append("badges", JSON.stringify(data.badges.map((b) => b.text)));
      formData.append("overlayQuote", data.overlayQuote);

      formData.append("s5Label", data.s5Label);
      formData.append("s5Title", data.s5Title);
      formData.append(
        "systems",
        JSON.stringify(
          data.systems.map((s) => ({
            ...s,
            providesList: s.providesList.map((p) => p.text),
          }))
        )
      );

      formData.append("s6Label", data.s6Label);
      formData.append("s6Title", data.s6Title);
      formData.append("packages", JSON.stringify(data.packages.map((p) => p.text)));
      formData.append("priceNote", data.priceNote);

      if (heroFile) formData.append("heroImage", heroFile);
      if (s1ImageFile) formData.append("s1Image", s1ImageFile);
      if (massageFile) formData.append("massageImage", massageFile);

      if (isEdit && sectionId) {
        await api.put(`/detox-retreat-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/detox-retreat-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/detox-retreat"), 1500);
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
          <h2 className={styles.successTitle}>Detox Retreat Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.mainTitle),
    intro: !!(errors.s1Para1 || errors.s1HighlightText || errors.s1Para2 || errors.s1ImageBadge || errors.s1ConclusionQuote),
    correct: !!(errors.s2Label || errors.s2Title || errors.s2Body || errors.benefits),
    method: !!(errors.s3Label || errors.s3Title || errors.s3Body || errors.steps || errors.finalStepTitle || errors.finalStepDesc),
    massage: !!(errors.s4Label || errors.s4Title || errors.badges || errors.overlayQuote),
    systems: !!(errors.s5Label || errors.s5Title || errors.systems),
    packages: !!(errors.s6Label || errors.s6Title || errors.packages || errors.priceNote),
  };

  const tabLabels = {
    hero: "① Hero & Title",
    intro: "② Detox Intro",
    correct: "③ Benefits",
    method: "④ Method Steps",
    massage: "⑤ Massage",
    systems: "⑥ Two Systems",
    packages: "⑦ Packages",
  };

  const tabOrder = ["hero", "intro", "correct", "method", "massage", "systems", "packages"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/detox-retreat" className={styles.breadcrumbLink}>
          Detox Retreat
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Detox Retreat Section" : "Add Detox Retreat Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, intro, benefits, method, massage, systems and packages" : "Fill in every section of the Detox Retreat page"}
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
          {/* ══════════ TAB 1 — HERO & TITLE ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Hero Image</h3>
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
                      <span className={styles.uploadIcon}>🌿</span>
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

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Main Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. DETOXIFICATION RETREAT THROUGH HERBS, YOGA, AYURVEDA, AND NUTRITION"
                    {...register("mainTitle", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — DETOX INTRO ══════════ */}
          {activeTab === "intro" && (
            <div className={styles.sectionBlock}>
              <RichTextField control={control} name="s1Para1" label="Intro Paragraph" />
              <RichTextField control={control} name="s1HighlightText" label="Highlight Box Text" />
              <RichTextField control={control} name="s1Para2" label="Toxin Explanation Paragraph" />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleS1Image(e.target.files?.[0] || null)}
                  />
                  {watchAll._s1ImagePreview ? (
                    <img src={watchAll._s1ImagePreview} alt="preview" className={styles.imgPreview} />
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
                <label className={styles.label}>Image Badge Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Ayurveda Detox"
                    {...register("s1ImageBadge", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="s1ConclusionQuote" label="Conclusion Quote" />
            </div>
          )}

          {/* ══════════ TAB 3 — BENEFITS (HOW TO CORRECT) ══════════ */}
          {activeTab === "correct" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Holistic Healing"
                      {...register("s2Label", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. HOW TO CORRECT THIS PROBLEM?"
                      {...register("s2Title", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <RichTextField control={control} name="s2Body" label="Section Body Text" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Benefit Cards</h3>
                <span className={styles.sectionBadge}>{benefitsArray.fields.length}/6</span>
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
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="⚖️"
                        {...register(`benefits.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Weight Loss"
                        {...register(`benefits.${index}.title`, { required: true })}
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
              {benefitsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => benefitsArray.append({ icon: "✨", title: "", desc: "" })}
                >
                  + Add Benefit
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 4 — METHOD STEPS ══════════ */}
          {activeTab === "method" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Our Method"
                      {...register("s3Label", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. COMPLETE METHOD TO DETOXIFICATION..."
                      {...register("s3Title", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <RichTextField control={control} name="s3Body" label="Section Body Text" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Steps (numbered automatically)</h3>
                <span className={styles.sectionBadge}>{stepsArray.fields.length}/10</span>
              </div>
              {stepsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Step #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => stepsArray.remove(index)}
                      disabled={stepsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.fieldGroup}>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Step title"
                        {...register(`steps.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Step description"
                        {...register(`steps.${index}.desc`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {stepsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => stepsArray.append({ title: "", desc: "" })}
                >
                  + Add Step
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Highlighted Final Step</h3>
              </div>
              <div className={styles.fieldGroup}>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Complete Detox"
                    {...register("finalStepTitle", { required: "Required" })}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="Final step description"
                    {...register("finalStepDesc", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 5 — MASSAGE ══════════ */}
          {activeTab === "massage" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Experience"
                      {...register("s4Label", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. AYURVEDA MASSAGE THERAPY"
                      {...register("s4Title", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="badges"
                label="Therapy Badges"
                placeholder="e.g. Abhyanga"
                max={8}
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Massage Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleMassageImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._massagePreview ? (
                    <img src={watchAll._massagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>💆</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Overlay Quote</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Healing begins where toxins end."
                    {...register("overlayQuote", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 6 — TWO SYSTEMS ══════════ */}
          {activeTab === "systems" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Our Approach"
                      {...register("s5Label", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. WE HAVE TWO SYSTEMS FOR DETOXIFICATION..."
                      {...register("s5Title", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              {systemsArray.fields.map((field, sIndex) => (
                <SystemCardFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={sIndex}
                  onRemove={() => systemsArray.remove(sIndex)}
                  canRemove={systemsArray.fields.length > 1}
                />
              ))}
              {systemsArray.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    systemsArray.append({ description: "", providesLabel: "", providesList: [{ text: "" }] })
                  }
                >
                  + Add System
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 7 — PACKAGES ══════════ */}
          {activeTab === "packages" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Plans"
                      {...register("s6Label", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. PRICE AND PACKAGES"
                      {...register("s6Title", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="packages"
                label="Package Durations"
                placeholder="e.g. 7 Days"
                max={8}
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Price Note</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Price will let you know after consultation with our Ayurveda Doctor (by Email)"
                    {...register("priceNote", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/detox-retreat" className={styles.cancelBtn}>
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
              {activeTab !== "packages" ? (
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

/* ─────────────────────── Reusable: one system card (nested provides list) ─────────────────────── */
function SystemCardFields({
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
  const providesArray = useFieldArray({ control, name: `systems.${index}.providesList` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>System #{index + 1}</span>
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
        <label className={styles.label}>Description</label>
        <div className={styles.inputWrap}>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            placeholder="e.g. In one, you can come to our yoga Ayurveda panchakarma treatment centre in Rishikesh..."
            {...register(`systems.${index}.description`, { required: "Required" })}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>List Label</label>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. what to expect:"
            {...register(`systems.${index}.providesLabel`, { required: "Required" })}
          />
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>List Items</h3>
        <span className={styles.sectionBadge}>{providesArray.fields.length}/10</span>
      </div>
      <div className={styles.itemsList}>
        {providesArray.fields.map((field, pIndex) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Personal consultation with our Ayurveda doctor"
                  {...register(`systems.${index}.providesList.${pIndex}.text`, { required: true })}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.removeItemBtn}
              onClick={() => providesArray.remove(pIndex)}
              disabled={providesArray.fields.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {providesArray.fields.length < 10 && (
        <button type="button" className={styles.addBtn} onClick={() => providesArray.append({ text: "" })}>
          + Add List Item
        </button>
      )}
    </div>
  );
}