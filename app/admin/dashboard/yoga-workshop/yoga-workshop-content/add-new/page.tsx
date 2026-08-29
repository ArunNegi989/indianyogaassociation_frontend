// FILE: src/app/admin/dashboard/yoga-meditation-workshop/meditation-content/add-new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../../../sound-healing-course/sound-healing-content/Soundhealingadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface TextItem { text: string; }
interface MethodCardItem { title: string; text: string; imageAlt: string; _preview?: string; }
interface WhyCardItem { icon: string; title: string; text: string; }
interface HighlightCardItem { icon: string; title: string; text: string; }

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;
  heroTitle: string;

  // What is Meditation
  whatIsTitle: string;
  whatIsParagraphs: TextItem[];
  videoUrl: string;

  // Meditation methods
  methodsSectionTitle: string;
  methodCards: MethodCardItem[];
  methodsClosingText: string;

  // Elevate section
  elevateTitle: string;
  elevateParagraph: string;
  elevateImageAlt: string;
  _elevateImagePreview?: string;

  // Why choose
  whyChooseTitle: string;
  whyCards: WhyCardItem[];

  // Schedule + highlights
  scheduleTitle: string;
  highlightsLabel: string;
  highlightCards: HighlightCardItem[];

  // Batch section intro (heading only — seat grid stays API-driven)
  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
  batchSectionDuration: string;

  // CTA section
  ctaBadgeText: string;
  ctaTitle: string;
  ctaPara1: string;
  ctaSubTitle: string;
  ctaPara2: string;
  ctaEnrollLink: string;
  ctaLearnMoreLink: string;
  ctaImageAlt: string;
  _ctaImagePreview?: string;
  ctaImageOverlayText: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",
  heroTitle: "Meditation Yoga Teacher Training Course in Rishikesh India",

  whatIsTitle: "What is Meditation?",
  whatIsParagraphs: [
    { text: "Meditation cannot be explained in words. Words serve as signposts, pointing toward something, but they are not the thing itself. As a great one once said, \"words are the fingers pointing towards the moon but they are not the moon itself.\"" },
    { text: "Meditation is that vast inner space within you — a constant and complete bliss and joy. It is the connection to something so much bigger, where you are connected to every living being in the universe. It is the space where you become the complete watcher of everything." },
    { text: "When you open yourself completely and surrender to God or the divine, that moment of surrender is when you fully accept your life is happening before you. You become the watcher, and everything works through you and for you. Meditation is digging deep within and constantly finding surprises about yourself, the world, the universe, and love. It is a beautiful process of unfolding or peeling to reach that complete, blissful core essence. Once you begin this inner journey, all desires vanish, and you want nothing but to go deeper." },
  ],
  videoUrl: "https://www.youtube.com/embed/jXMRM9kjtRY?autoplay=1&loop=1&playlist=jXMRM9kjtRY&mute=1&controls=0&modestbranding=1&rel=0",

  methodsSectionTitle: "What is your favorite method of meditation?",
  methodCards: [
    {
      title: "Vipassana Meditation",
      text: "Vipassana involves sitting in a comfortable meditative posture. Focus on your breathing and the fact that you are now sitting. As you breathe, repeat in your mind: \"in, out, sitting\" or \"rising, falling, sitting.\" You can focus either on your nostrils or on your abdomen. Repeat this a few times and keep your focus with the breath.",
      imageAlt: "Person practicing Vipassana meditation",
    },
    {
      title: "Active Meditation",
      text: "Active meditation uses the energy of the body to silence the mind. You use lots of energy before sitting still. This could involve exercises such as dancing or aerobatic movements. This type of meditation increases your blood circulation and heats up the body.",
      imageAlt: "Active meditation practice",
    },
    {
      title: "Static Meditation",
      text: "Static meditation is a practice in which the meditator sits still, focusing inward until reaching a meditative state. Over time, meditation can expand into every action throughout the day, including brushing teeth, walking, doing chores, practicing Yoga, working, and other aspects of daily life.",
      imageAlt: "Person in deep static meditation",
    },
  ],
  methodsClosingText:
    "If you are interested in exploring a meditation yoga course in Rishikesh, meditation yoga classes in Rishikesh, or yoga and meditation courses in India, there are numerous opportunities for all levels. Whether you are seeking a meditation course for beginners in Rishikesh, a mindfulness meditation course in India, or prefer an online meditation yoga course in India, you will find programs tailored to your needs.",

  elevateTitle: "Elevate Your Practice and Inspire Others",
  elevateParagraph:
    "Are you ready to take your yoga journey to the next level and empower others in their mindfulness practices? Our <strong>Meditation Yoga Teacher Training program</strong> is crafted for those eager to explore the dynamic relationship between meditation and yoga.",
  elevateImageAlt: "Yoga teacher training session",

  whyChooseTitle: "Why Choose Our Program?",
  whyCards: [
    { icon: "🌟", title: "Empowering Environment", text: "Traditional meditation is that kind of meditation in which one focuses on the self and tries to unite the self with the almighty. This practice is also known as moksha or nirvana." },
    { icon: "👨‍🏫", title: "Expert Instructors", text: "Our experienced teachers are passionate about sharing their knowledge and expertise with you. They will provide you with the tools and feedback necessary to help you lead confidently and clearly." },
    { icon: "📚", title: "Comprehensive Curriculum", text: "Our well-rounded curriculum covers essential topics, including yoga philosophy, anatomy, and meditation techniques." },
    { icon: "💪", title: "Practical Experience", text: "Get ready to step into your role as a teacher! Our program offers ample opportunities to lead meditation sessions and teach asanas." },
    { icon: "🦋", title: "Transformational Journey", text: "This training is designed for teaching and personal evolution. Cultivate profound insights and develop your mindfulness practice." },
    { icon: "🤝", title: "Building a Strong Community", text: "You'll connect with a network of driven individuals who share your passion. Together, you will share experiences and support one another." },
  ],

  scheduleTitle: "Meditation Course in Rishikesh – AYM Yoga School",
  highlightsLabel: "Program Highlights:",
  highlightCards: [
    { icon: "🧘‍♀️", title: "Daily Meditation & Yoga", text: "Daily meditation and yoga practices designed to ignite your confidence." },
    { icon: "🎯", title: "Engaging Workshops", text: "Engaging workshops on cutting-edge meditation techniques, breathwork, and mindfulness." },
    { icon: "📖", title: "Anatomy & Physiology", text: "In-depth exploration of the anatomy and physiology related to meditation." },
    { icon: "🕉️", title: "Eight Limbs of Yoga", text: "Thought-provoking discussions on the Eight Limbs of Yoga and various meditation traditions." },
    { icon: "💻", title: "Flexible Training", text: "Flexible training options, available both online and in-person, to accommodate your lifestyle." },
  ],

  batchSectionTag: "Upcoming Batches · 2025–2026",
  batchSectionTitle: "Meditation Yoga Teacher Training India",
  batchSectionSub: "Choose your dates & preferred accommodation — prices include tuition and meals",
  batchSectionDuration: "24 Days · Rishikesh, India",

  ctaBadgeText: "✦ Begin Your Journey ✦",
  ctaTitle: "Is This Meditation Program for You?",
  ctaPara1:
    "If you are passionate about yoga and eager to deepen your knowledge while sharing it with others, this training is for you. Whether you are a beginner or have extensive experience, we welcome dedicated individuals ready to embrace the powerful practice of mindfulness.",
  ctaSubTitle: "Embark on Your Transformative Journey",
  ctaPara2:
    "Enroll in our Meditation Yoga Teacher Training program and take a significant step toward enhancing your practice and impacting the lives of others. Together, we will cultivate a world of mindful living, one breath at a time.",
  ctaEnrollLink: "/yoga-registration",
  ctaLearnMoreLink: "/contact",
  ctaImageAlt: "Peaceful meditation",
  ctaImageOverlayText: "Start Your Journey Today",
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
export default function MeditationAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [elevateImageFile, setElevateImageFile] = useState<File | null>(null);
  const [ctaImageFile, setCtaImageFile] = useState<File | null>(null);
  const [methodImageFiles, setMethodImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "whatis" | "methods" | "elevate" | "highlights" | "batchintro" | "cta"
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

  const methodCardsArray = useFieldArray({ control, name: "methodCards" });
  const whyCardsArray = useFieldArray({ control, name: "whyCards" });
  const highlightCardsArray = useFieldArray({ control, name: "highlightCards" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/meditation-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          heroTitle: d.heroTitle ?? INITIAL.heroTitle,

          whatIsTitle: d.whatIsTitle ?? INITIAL.whatIsTitle,
          whatIsParagraphs: d.whatIsParagraphs?.length
            ? d.whatIsParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.whatIsParagraphs,
          videoUrl: d.videoUrl ?? INITIAL.videoUrl,

          methodsSectionTitle: d.methodsSectionTitle ?? INITIAL.methodsSectionTitle,
          methodCards: d.methodCards?.length
            ? d.methodCards.map((m: any, i: number) => ({
                title: m.title,
                text: m.text,
                imageAlt: m.imageAlt,
                _preview: m.image ? getImageUrl(m.image) : "",
              }))
            : INITIAL.methodCards,
          methodsClosingText: d.methodsClosingText ?? INITIAL.methodsClosingText,

          elevateTitle: d.elevateTitle ?? INITIAL.elevateTitle,
          elevateParagraph: d.elevateParagraph ?? INITIAL.elevateParagraph,
          elevateImageAlt: d.elevateImageAlt ?? INITIAL.elevateImageAlt,
          _elevateImagePreview: d.elevateImage ? getImageUrl(d.elevateImage) : "",

          whyChooseTitle: d.whyChooseTitle ?? INITIAL.whyChooseTitle,
          whyCards: d.whyCards?.length ? d.whyCards : INITIAL.whyCards,

          scheduleTitle: d.scheduleTitle ?? INITIAL.scheduleTitle,
          highlightsLabel: d.highlightsLabel ?? INITIAL.highlightsLabel,
          highlightCards: d.highlightCards?.length ? d.highlightCards : INITIAL.highlightCards,

          batchSectionTag: d.batchSectionTag ?? INITIAL.batchSectionTag,
          batchSectionTitle: d.batchSectionTitle ?? INITIAL.batchSectionTitle,
          batchSectionSub: d.batchSectionSub ?? INITIAL.batchSectionSub,
          batchSectionDuration: d.batchSectionDuration ?? INITIAL.batchSectionDuration,

          ctaBadgeText: d.ctaBadgeText ?? INITIAL.ctaBadgeText,
          ctaTitle: d.ctaTitle ?? INITIAL.ctaTitle,
          ctaPara1: d.ctaPara1 ?? INITIAL.ctaPara1,
          ctaSubTitle: d.ctaSubTitle ?? INITIAL.ctaSubTitle,
          ctaPara2: d.ctaPara2 ?? INITIAL.ctaPara2,
          ctaEnrollLink: d.ctaEnrollLink ?? INITIAL.ctaEnrollLink,
          ctaLearnMoreLink: d.ctaLearnMoreLink ?? INITIAL.ctaLearnMoreLink,
          ctaImageAlt: d.ctaImageAlt ?? INITIAL.ctaImageAlt,
          _ctaImagePreview: d.ctaImage ? getImageUrl(d.ctaImage) : "",
          ctaImageOverlayText: d.ctaImageOverlayText ?? INITIAL.ctaImageOverlayText,
        });
      } catch {
        toast.error("Failed to fetch meditation section data");
        router.replace("/admin/dashboard/yoga-workshop/yoga-workshop-content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Image handlers ── */
  const makeImageHandler =
    (setFile: (f: File | null) => void, field: keyof FormData) => (file: File | null) => {
      if (!file) return;
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setValue(field, e.target?.result as any);
      reader.readAsDataURL(file);
    };

  const handleHeroImage = makeImageHandler(setHeroFile, "_heroPreview");
  const handleElevateImage = makeImageHandler(setElevateImageFile, "_elevateImagePreview");
  const handleCtaImage = makeImageHandler(setCtaImageFile, "_ctaImagePreview");

  const handleMethodImage = (index: number, file: File | null) => {
    if (!file) return;
    setMethodImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    const reader = new FileReader();
    reader.onload = (e) => setValue(`methodCards.${index}._preview` as any, e.target?.result as any);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("heroTitle", data.heroTitle);

      formData.append("whatIsTitle", data.whatIsTitle);
      formData.append("whatIsParagraphs", JSON.stringify(data.whatIsParagraphs.map((p) => p.text)));
      formData.append("videoUrl", data.videoUrl);

      formData.append("methodsSectionTitle", data.methodsSectionTitle);
      formData.append(
        "methodCards",
        JSON.stringify(data.methodCards.map((m) => ({ title: m.title, text: m.text, imageAlt: m.imageAlt })))
      );
      formData.append("methodsClosingText", data.methodsClosingText);

      formData.append("elevateTitle", data.elevateTitle);
      formData.append("elevateParagraph", data.elevateParagraph);
      formData.append("elevateImageAlt", data.elevateImageAlt);

      formData.append("whyChooseTitle", data.whyChooseTitle);
      formData.append("whyCards", JSON.stringify(data.whyCards));

      formData.append("scheduleTitle", data.scheduleTitle);
      formData.append("highlightsLabel", data.highlightsLabel);
      formData.append("highlightCards", JSON.stringify(data.highlightCards));

      formData.append("batchSectionTag", data.batchSectionTag);
      formData.append("batchSectionTitle", data.batchSectionTitle);
      formData.append("batchSectionSub", data.batchSectionSub);
      formData.append("batchSectionDuration", data.batchSectionDuration);

      formData.append("ctaBadgeText", data.ctaBadgeText);
      formData.append("ctaTitle", data.ctaTitle);
      formData.append("ctaPara1", data.ctaPara1);
      formData.append("ctaSubTitle", data.ctaSubTitle);
      formData.append("ctaPara2", data.ctaPara2);
      formData.append("ctaEnrollLink", data.ctaEnrollLink);
      formData.append("ctaLearnMoreLink", data.ctaLearnMoreLink);
      formData.append("ctaImageAlt", data.ctaImageAlt);
      formData.append("ctaImageOverlayText", data.ctaImageOverlayText);

      if (heroFile) formData.append("heroImage", heroFile);
      if (elevateImageFile) formData.append("elevateImage", elevateImageFile);
      if (ctaImageFile) formData.append("ctaImage", ctaImageFile);
      methodImageFiles.forEach((file, i) => {
        if (file) formData.append(`methodImage${i}`, file);
      });

      if (isEdit && sectionId) {
        await api.put(`/meditation-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/meditation-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-workshop/yoga-workshop-content"), 1500);
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
          <h2 className={styles.successTitle}>Meditation Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.heroTitle),
    whatis: !!(errors.whatIsTitle || errors.whatIsParagraphs || errors.videoUrl),
    methods: !!(errors.methodsSectionTitle || errors.methodCards || errors.methodsClosingText),
    elevate: !!(errors.elevateTitle || errors.elevateParagraph || errors.elevateImageAlt || errors.whyChooseTitle || errors.whyCards),
    highlights: !!(errors.scheduleTitle || errors.highlightsLabel || errors.highlightCards),
    batchintro: !!(errors.batchSectionTag || errors.batchSectionTitle || errors.batchSectionSub || errors.batchSectionDuration),
    cta: !!(errors.ctaBadgeText || errors.ctaTitle || errors.ctaPara1 || errors.ctaSubTitle || errors.ctaPara2 || errors.ctaEnrollLink || errors.ctaLearnMoreLink || errors.ctaImageAlt),
  };

  const tabLabels = {
    hero: "① Hero",
    whatis: "② What Is Meditation",
    methods: "③ Meditation Methods",
    elevate: "④ Elevate / Why Choose",
    highlights: "⑤ Schedule / Highlights",
    batchintro: "⑥ Batch Section Intro",
    cta: "⑦ CTA Section",
  };

  const tabOrder = ["hero", "whatis", "methods", "elevate", "highlights", "batchintro", "cta"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-workshop/yoga-workshop-content" className={styles.breadcrumbLink}>
          Meditation TTC
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Meditation Section" : "Add Meditation Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit
            ? "Update hero, methods, why-choose and highlights content"
            : "Fill in the page content (seat batches are managed separately)"}
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
          {/* ══════════ TAB 1 — HERO ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Hero Banner Image</h3>
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
                <label className={styles.label}>
                  Hero Image Alt Text<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.heroImageAlt ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Students Group"
                    {...register("heroImageAlt", { required: "Alt text is required" })}
                  />
                </div>
                {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Hero Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.heroTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Meditation Yoga Teacher Training Course in Rishikesh India"
                    {...register("heroTitle", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — WHAT IS MEDITATION ══════════ */}
          {activeTab === "whatis" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. What is Meditation?"
                    {...register("whatIsTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="whatIsParagraphs" label="Paragraphs" max={5} />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Side Video</h3>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Video Embed URL<span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>YouTube embed URL shown beside the paragraphs</p>
                <div className={`${styles.inputWrap} ${errors.videoUrl ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="https://www.youtube.com/embed/..."
                    {...register("videoUrl", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — MEDITATION METHODS ══════════ */}
          {activeTab === "methods" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. What is your favorite method of meditation?"
                    {...register("methodsSectionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Method Cards</h3>
                <span className={styles.sectionBadge}>{methodCardsArray.fields.length}/6</span>
              </div>

              {methodCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Method #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => methodCardsArray.remove(index)}
                      disabled={methodCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Title</label>
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Vipassana Meditation"
                        {...register(`methodCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Description</label>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={4}
                        placeholder="Method description"
                        {...register(`methodCards.${index}.text`, { required: true })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Image</label>
                    <label className={styles.uploadArea}>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={(e) => handleMethodImage(index, e.target.files?.[0] || null)}
                      />
                      {watchAll.methodCards?.[index]?._preview ? (
                        <img src={watchAll.methodCards[index]._preview} alt="preview" className={styles.imgPreview} />
                      ) : (
                        <span className={styles.uploadIcon}>📷</span>
                      )}
                    </label>
                    <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Alt text"
                        {...register(`methodCards.${index}.imageAlt`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {methodCardsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    methodCardsArray.append({ title: "", text: "", imageAlt: "" })
                  }
                >
                  + Add Method Card
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Closing Paragraph</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    placeholder="Closing text after the method cards"
                    {...register("methodsClosingText", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — ELEVATE / WHY CHOOSE ══════════ */}
          {activeTab === "elevate" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Elevate Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Elevate Your Practice and Inspire Others"
                    {...register("elevateTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="elevateParagraph" label="Elevate Paragraph" />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Elevate Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleElevateImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._elevateImagePreview ? (
                    <img src={watchAll._elevateImagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                    </>
                  )}
                </label>
                <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Image alt text"
                    {...register("elevateImageAlt", { required: true })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Why Choose Our Program?" Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Why Choose Our Program?"
                    {...register("whyChooseTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Why-Choose Cards</h3>
                <span className={styles.sectionBadge}>{whyCardsArray.fields.length}/8</span>
              </div>
              {whyCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => whyCardsArray.remove(index)}
                      disabled={whyCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="🌟"
                        {...register(`whyCards.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Empowering Environment"
                        {...register(`whyCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Card description"
                        {...register(`whyCards.${index}.text`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {whyCardsArray.fields.length < 8 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => whyCardsArray.append({ icon: "✦", title: "", text: "" })}
                >
                  + Add Card
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 5 — SCHEDULE / HIGHLIGHTS ══════════ */}
          {activeTab === "highlights" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Meditation Course in Rishikesh – AYM Yoga School"
                    {...register("scheduleTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Highlights Label (H3)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Program Highlights:"
                    {...register("highlightsLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Highlight Cards</h3>
                <span className={styles.sectionBadge}>{highlightCardsArray.fields.length}/8</span>
              </div>
              {highlightCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => highlightCardsArray.remove(index)}
                      disabled={highlightCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="🧘‍♀️"
                        {...register(`highlightCards.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Daily Meditation & Yoga"
                        {...register(`highlightCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Card description"
                        {...register(`highlightCards.${index}.text`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {highlightCardsArray.fields.length < 8 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => highlightCardsArray.append({ icon: "✦", title: "", text: "" })}
                >
                  + Add Card
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 6 — BATCH SECTION INTRO ══════════ */}
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
                    placeholder="e.g. Upcoming Batches · 2025–2026"
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
                    placeholder="e.g. Meditation Yoga Teacher Training India"
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

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Duration Badge Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 24 Days · Rishikesh, India"
                    {...register("batchSectionDuration", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 7 — CTA SECTION ══════════ */}
          {activeTab === "cta" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Badge Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. ✦ Begin Your Journey ✦"
                    {...register("ctaBadgeText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>CTA Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Is This Meditation Program for You?"
                    {...register("ctaTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>First Paragraph</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    {...register("ctaPara1", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Sub Title (H3)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Embark on Your Transformative Journey"
                    {...register("ctaSubTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Second Paragraph</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    {...register("ctaPara2", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Enroll Now Button Link</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="/yoga-registration"
                      {...register("ctaEnrollLink", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Learn More Button Link</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="/contact"
                      {...register("ctaLearnMoreLink", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>CTA Side Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleCtaImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._ctaImagePreview ? (
                    <img src={watchAll._ctaImagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Alt Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Peaceful meditation"
                      {...register("ctaImageAlt", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Overlay Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Start Your Journey Today"
                      {...register("ctaImageOverlayText", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-meditation-workshop/meditation-content" className={styles.cancelBtn}>
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
              {activeTab !== "cta" ? (
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
                  className={styles.submitBtn}
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