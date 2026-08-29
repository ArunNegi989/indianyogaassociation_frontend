"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Innerawakeningadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface TextItem {
  text: string;
}
interface StatItem {
  value: string;
  label: string;
}
interface InsightCardItem {
  number: string;
  title: string;
  text: string;
}
interface ScheduleItem {
  time: string;
  activity: string;
}
interface GalleryImageItem {
  caption: string;
  subcaption: string;
  image?: string;
  _preview?: string;
}
interface TermItem {
  term: string;
  desc: string;
}

interface FormData {
  // Hero (top banner image)
  heroImageAlt: string;
  _heroPreview?: string;

  // Hero Title / Guru Section
  heroBadge: string;
  mainTitle: string;
  subTitle: string;
  whoTitle: string;
  maharishiIntro: string; // rich text
  maharishiImageAlt: string;
  _maharishiPreview?: string;
  imageCaption: string;
  heroStats: StatItem[];

  // What is the retreat section
  whatBadge: string;
  whatTitle: string;
  quoteText: string;
  bodyText: string; // rich text
  insightCards: InsightCardItem[];
  programNote: string;

  // Schedule section
  scheduleBadge: string;
  scheduleTitle: string;
  weeksBadge: string;
  weeksText: string;
  card1Title: string;
  points: TextItem[];
  cardFootnote: string;
  card2Title: string;
  morningLabel: string;
  morningItems: ScheduleItem[];
  breakText: string;
  eveningLabel: string;
  eveningItems: ScheduleItem[];

  // Gallery section
  galleryBadge: string;
  galleryTitle: string;
  gallerySubtitle: string;
  galleryImages: GalleryImageItem[];

  // Key concepts + who can participate
  definitionTitle: string;
  terms: TermItem[];
  participantTitle: string;
  participantList: TextItem[];

  // Fee section
  feeBadge: string;
  feeTitle: string;
  includedItems: TextItem[];
  pricingBadge: string;
  priceUSD: string;
  priceINR: string;
  pricingDesc: string;
  pricingNote: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  heroBadge: "Inner Awakening",
  mainTitle: "Inner Transformation Retreat",
  subTitle: "Awake Your Inner Self – with Yogiraj Sri Yogi Chetan Maharishi",
  whoTitle: "Who is Sri Maharishi?",
  maharishiIntro:
    "Yogi, Mystic, and Visionary. Himalayan Yogi Sri Maharishi belongs to the eternal Siddha Tradition, a lineage of perfected beings. He spent the last 30 years in meditation and practicing traditional Kriya Yoga at the Himalayas with enlightened gurus.",
  maharishiImageAlt: "Yogiraj Sri Yogi Chetan Maharishi",
  imageCaption: "Yogiraj Sri Yogi Chetan Maharishi",
  heroStats: [
    { value: "30+", label: "Years of Meditation" },
    { value: "Siddha", label: "Tradition" },
    { value: "Kriya", label: "Yoga Master" },
  ],

  whatBadge: "Discover",
  whatTitle: "What is the inner awakening retreat?",
  quoteText: "Why am I doing all of this? Who am I? What is my true purpose in this life?",
  bodyText:
    "We often go by in our daily lives in the automatic mode, running away from questions we don't know how to answer. When we are disconnected from our true selves, those questions are nearly impossible to be answered because we try to answer them by looking outside, in material things, in the personalities we've created for ourselves. But we are not our money; we are not our profession. So who are we?",
  insightCards: [
    {
      number: "01",
      title: "Inner Exploration",
      text: "The Inner Transformation retreat is an invitation for you to look deeply inside yourself and connect with your higher self. It is self-realization through constant self-inquiry and exploration of the inner states of the being.",
    },
    {
      number: "02",
      title: "Freedom Based",
      text: "Every person has their own path to reach inner tranquility. The retreat is based on freedom, presenting different methods, Eastern philosophies (Yoga, Jainism, Taoism), and techniques for each person to find their own practice.",
    },
  ],
  programNote: "This retreat consists of a foundation program, with an advanced master program also available.",

  scheduleBadge: "Program Details",
  scheduleTitle: "What is the schedule, what is inside the retreat?",
  weeksBadge: "Two weeks",
  weeksText: "of foundation retreat",
  card1Title: "7 Points of Inner Transformation",
  points: [
    { text: "Sublimation" },
    { text: "Culmination" },
    { text: "Transformation" },
    { text: "Sadhana" },
    { text: "Satsang" },
    { text: "Meditation" },
    { text: "Self-realization" },
  ],
  cardFootnote: "The first 6 points lead to the root of all things: self-realization",
  card2Title: "Daily Schedule - Draft Program",
  morningLabel: "Morning Session",
  morningItems: [
    { time: "6:30 - 8:00", activity: "Meditation" },
    { time: "8:00 - 8:30", activity: "Tea Break" },
    { time: "8:30 - 10:00", activity: "Satsang / Practice" },
    { time: "10:00 - 11:00", activity: "Breakfast" },
    { time: "11:00 - 12:30", activity: "Sadhana" },
  ],
  breakText: "LUNCH + Self Practice / Study - Free until 17:00",
  eveningLabel: "Evening Session",
  eveningItems: [
    { time: "17:00 - 19:30", activity: "Evening Sadhana" },
    { time: "19:30 - 20:30", activity: "Light Dinner" },
    { time: "21:00 - 22:00", activity: "Kirtan / Chanting" },
  ],

  galleryBadge: "Visual Journey",
  galleryTitle: "Moments of Inner Transformation",
  gallerySubtitle: "Experience the serene atmosphere and spiritual practices at our retreat",
  galleryImages: [
    { caption: "Sacred Prayer", subcaption: "Connecting with the divine" },
    { caption: "Deep Meditation", subcaption: "Guidance from the master" },
    { caption: "Blissful Offering", subcaption: "Surrender and devotion" },
  ],

  definitionTitle: "Key Concepts",
  terms: [
    { term: "Satsang", desc: "In Sanskrit, it means \"gathering together for the truth\" or, more simply, \"being with the truth\"" },
    { term: "Sadhana", desc: "Consists of deep practices and routine of surrendering the ego through various activities like meditation, chanting or prayer" },
    { term: "Self-realization", desc: "To know your inner self, to know the very love, to touch the absoluteness, to be in bliss" },
  ],
  participantTitle: "Who Can Participate?",
  participantList: [
    { text: "Anyone who has few hours sitting practice continuously effortlessly with calm mind" },
    { text: "Anyone who has finished at least 200 hour yoga teacher training or any other yoga certification" },
    { text: "Anyone who is searching for inner powers and willing to follow the ashram lifestyle during the retreat" },
  ],

  feeBadge: "Investment",
  feeTitle: "What's Included",
  includedItems: [
    { text: "Private Accommodation with Mountain View" },
    { text: "Sattvic Indian Food - 3 Meals/Day" },
    { text: "Herbal Tea / Lemon-Ginger Tea - 24X7" },
    { text: "Certificate and Course Material" },
    { text: "Airport Pickup from Dehradun Airport" },
  ],
  pricingBadge: "Retreat Ticket",
  priceUSD: "1000",
  priceINR: "70,000",
  pricingDesc:
    "The price includes two-week private room accommodation, Indian vegetarian food, a trip to spiritual temples around Rishikesh, and guidance from Yogi Guru for inner awakening.",
  pricingNote: "Limited seats available. Early booking recommended.",
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

/* ─────────────────────── Reusable: plain-text repeatable list (points / participant list / included items) ─────────────────────── */
function TextItemList({
  control,
  register,
  name,
  label,
  placeholder,
  max = 10,
  min = 1,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  placeholder?: string;
  max?: number;
  min?: number;
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
            <span className={styles.itemIndex}>{index + 1}</span>
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
              disabled={fields.length <= min}
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
export default function InnerAwakeningAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [maharishiFile, setMaharishiFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "guru" | "about" | "schedule" | "gallery" | "fee"
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

  const heroStatsArray = useFieldArray({ control, name: "heroStats" });
  const insightCardsArray = useFieldArray({ control, name: "insightCards" });
  const morningItemsArray = useFieldArray({ control, name: "morningItems" });
  const eveningItemsArray = useFieldArray({ control, name: "eveningItems" });
  const galleryImagesArray = useFieldArray({ control, name: "galleryImages" });
  const termsArray = useFieldArray({ control, name: "terms" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/inner-awakening-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",

          heroBadge: d.heroBadge ?? INITIAL.heroBadge,
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          subTitle: d.subTitle ?? INITIAL.subTitle,
          whoTitle: d.whoTitle ?? INITIAL.whoTitle,
          maharishiIntro: d.maharishiIntro ?? INITIAL.maharishiIntro,
          maharishiImageAlt: d.maharishiImageAlt ?? INITIAL.maharishiImageAlt,
          _maharishiPreview: d.maharishiImage ? getImageUrl(d.maharishiImage) : "",
          imageCaption: d.imageCaption ?? INITIAL.imageCaption,
          heroStats: d.heroStats?.length ? d.heroStats : INITIAL.heroStats,

          whatBadge: d.whatBadge ?? INITIAL.whatBadge,
          whatTitle: d.whatTitle ?? INITIAL.whatTitle,
          quoteText: d.quoteText ?? INITIAL.quoteText,
          bodyText: d.bodyText ?? INITIAL.bodyText,
          insightCards: d.insightCards?.length ? d.insightCards : INITIAL.insightCards,
          programNote: d.programNote ?? INITIAL.programNote,

          scheduleBadge: d.scheduleBadge ?? INITIAL.scheduleBadge,
          scheduleTitle: d.scheduleTitle ?? INITIAL.scheduleTitle,
          weeksBadge: d.weeksBadge ?? INITIAL.weeksBadge,
          weeksText: d.weeksText ?? INITIAL.weeksText,
          card1Title: d.card1Title ?? INITIAL.card1Title,
          points: d.points?.length ? d.points.map((t: string) => ({ text: t })) : INITIAL.points,
          cardFootnote: d.cardFootnote ?? INITIAL.cardFootnote,
          card2Title: d.card2Title ?? INITIAL.card2Title,
          morningLabel: d.morningLabel ?? INITIAL.morningLabel,
          morningItems: d.morningItems?.length ? d.morningItems : INITIAL.morningItems,
          breakText: d.breakText ?? INITIAL.breakText,
          eveningLabel: d.eveningLabel ?? INITIAL.eveningLabel,
          eveningItems: d.eveningItems?.length ? d.eveningItems : INITIAL.eveningItems,

          galleryBadge: d.galleryBadge ?? INITIAL.galleryBadge,
          galleryTitle: d.galleryTitle ?? INITIAL.galleryTitle,
          gallerySubtitle: d.gallerySubtitle ?? INITIAL.gallerySubtitle,
          galleryImages: d.galleryImages?.length
            ? d.galleryImages.map((g: any) => ({ ...g, _preview: g.image ? getImageUrl(g.image) : "" }))
            : INITIAL.galleryImages,

          definitionTitle: d.definitionTitle ?? INITIAL.definitionTitle,
          terms: d.terms?.length ? d.terms : INITIAL.terms,
          participantTitle: d.participantTitle ?? INITIAL.participantTitle,
          participantList: d.participantList?.length
            ? d.participantList.map((t: string) => ({ text: t }))
            : INITIAL.participantList,

          feeBadge: d.feeBadge ?? INITIAL.feeBadge,
          feeTitle: d.feeTitle ?? INITIAL.feeTitle,
          includedItems: d.includedItems?.length
            ? d.includedItems.map((t: string) => ({ text: t }))
            : INITIAL.includedItems,
          pricingBadge: d.pricingBadge ?? INITIAL.pricingBadge,
          priceUSD: d.priceUSD ?? INITIAL.priceUSD,
          priceINR: d.priceINR ?? INITIAL.priceINR,
          pricingDesc: d.pricingDesc ?? INITIAL.pricingDesc,
          pricingNote: d.pricingNote ?? INITIAL.pricingNote,
        });
        setGalleryFiles((d.galleryImages?.length ? d.galleryImages : INITIAL.galleryImages).map(() => null));
      } catch {
        toast.error("Failed to fetch inner awakening section data");
        router.replace("/admin/dashboard/inner-awakening");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Hero image handler ── */
  const handleHeroImage = (file: File | null) => {
    if (!file) return;
    setHeroFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_heroPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Maharishi image handler ── */
  const handleMaharishiImage = (file: File | null) => {
    if (!file) return;
    setMaharishiFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_maharishiPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Gallery image handler ── */
  const handleGalleryImage = (index: number, file: File | null) => {
    if (!file) return;
    setGalleryFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    const reader = new FileReader();
    reader.onload = (e) => setValue(`galleryImages.${index}._preview`, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);

      formData.append("heroBadge", data.heroBadge);
      formData.append("mainTitle", data.mainTitle);
      formData.append("subTitle", data.subTitle);
      formData.append("whoTitle", data.whoTitle);
      formData.append("maharishiIntro", data.maharishiIntro);
      formData.append("maharishiImageAlt", data.maharishiImageAlt);
      formData.append("imageCaption", data.imageCaption);
      formData.append("heroStats", JSON.stringify(data.heroStats));

      formData.append("whatBadge", data.whatBadge);
      formData.append("whatTitle", data.whatTitle);
      formData.append("quoteText", data.quoteText);
      formData.append("bodyText", data.bodyText);
      formData.append("insightCards", JSON.stringify(data.insightCards));
      formData.append("programNote", data.programNote);

      formData.append("scheduleBadge", data.scheduleBadge);
      formData.append("scheduleTitle", data.scheduleTitle);
      formData.append("weeksBadge", data.weeksBadge);
      formData.append("weeksText", data.weeksText);
      formData.append("card1Title", data.card1Title);
      formData.append("points", JSON.stringify(data.points.map((p) => p.text)));
      formData.append("cardFootnote", data.cardFootnote);
      formData.append("card2Title", data.card2Title);
      formData.append("morningLabel", data.morningLabel);
      formData.append("morningItems", JSON.stringify(data.morningItems));
      formData.append("breakText", data.breakText);
      formData.append("eveningLabel", data.eveningLabel);
      formData.append("eveningItems", JSON.stringify(data.eveningItems));

      formData.append("galleryBadge", data.galleryBadge);
      formData.append("galleryTitle", data.galleryTitle);
      formData.append("gallerySubtitle", data.gallerySubtitle);
      formData.append(
        "galleryImages",
        JSON.stringify(data.galleryImages.map((g) => ({ caption: g.caption, subcaption: g.subcaption, image: g.image })))
      );

      formData.append("definitionTitle", data.definitionTitle);
      formData.append("terms", JSON.stringify(data.terms));
      formData.append("participantTitle", data.participantTitle);
      formData.append("participantList", JSON.stringify(data.participantList.map((p) => p.text)));

      formData.append("feeBadge", data.feeBadge);
      formData.append("feeTitle", data.feeTitle);
      formData.append("includedItems", JSON.stringify(data.includedItems.map((p) => p.text)));
      formData.append("pricingBadge", data.pricingBadge);
      formData.append("priceUSD", data.priceUSD);
      formData.append("priceINR", data.priceINR);
      formData.append("pricingDesc", data.pricingDesc);
      formData.append("pricingNote", data.pricingNote);

      if (heroFile) formData.append("heroImage", heroFile);
      if (maharishiFile) formData.append("maharishiImage", maharishiFile);
      galleryFiles.forEach((file, i) => {
        if (file) formData.append(`galleryImage_${i}`, file);
      });

      if (isEdit && sectionId) {
        await api.put(`/inner-awakening-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/inner-awakening-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/inner-awakening"), 1500);
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
          <h2 className={styles.successTitle}>Inner Awakening Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!errors.heroImageAlt,
    guru: !!(errors.heroBadge || errors.mainTitle || errors.subTitle || errors.whoTitle || errors.maharishiIntro || errors.imageCaption || errors.heroStats),
    about: !!(errors.whatBadge || errors.whatTitle || errors.quoteText || errors.bodyText || errors.insightCards || errors.programNote),
    schedule: !!(errors.scheduleBadge || errors.scheduleTitle || errors.points || errors.morningItems || errors.eveningItems),
    gallery: !!(errors.galleryBadge || errors.galleryTitle || errors.galleryImages),
    fee: !!(errors.definitionTitle || errors.terms || errors.participantList || errors.includedItems || errors.priceUSD || errors.priceINR),
  };

  const tabLabels = {
    hero: "① Hero Banner",
    guru: "② Guru & Stats",
    about: "③ About Retreat",
    schedule: "④ Schedule",
    gallery: "⑤ Gallery",
    fee: "⑥ Concepts & Fee",
  };

  const tabOrder = ["hero", "guru", "about", "schedule", "gallery", "fee"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/inner-awakening" className={styles.breadcrumbLink}>
          Inner Awakening
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Inner Awakening Section" : "Add Inner Awakening Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, guru intro, schedule, gallery and fee info" : "Fill in every section of the Inner Awakening page"}
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
          {/* ══════════ TAB 1 — HERO BANNER ══════════ */}
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
                      <span className={styles.uploadIcon}>🏔️</span>
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
            </div>
          )}

          {/* ══════════ TAB 2 — GURU & STATS ══════════ */}
          {activeTab === "guru" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Title & Badge</h3>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Hero Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Inner Awakening"
                      {...register("heroBadge", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Sub Title</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Awake Your Inner Self – with Yogiraj..."
                      {...register("subTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Main Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Inner Transformation Retreat"
                    {...register("mainTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Who Is Sri Maharishi</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Who Section Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Who is Sri Maharishi?"
                    {...register("whoTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Guru Intro Paragraph</label>
                <div className={styles.editorWrap}>
                  <Controller
                    name="maharishiIntro"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />
                    )}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Guru Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleMaharishiImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._maharishiPreview ? (
                    <img src={watchAll._maharishiPreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🧘</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Guru Image Alt Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yogiraj Sri Yogi Chetan Maharishi"
                      {...register("maharishiImageAlt", { required: true })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Caption</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yogiraj Sri Yogi Chetan Maharishi"
                      {...register("imageCaption", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Hero Stats Row</h3>
                <span className={styles.sectionBadge}>{heroStatsArray.fields.length}/6</span>
              </div>
              <div className={styles.itemsList}>
                {heroStatsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "140px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 30+"
                            {...register(`heroStats.${index}.value`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Years of Meditation"
                            {...register(`heroStats.${index}.label`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => heroStatsArray.remove(index)}
                      disabled={heroStatsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {heroStatsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => heroStatsArray.append({ value: "", label: "" })}
                >
                  + Add Stat
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 3 — ABOUT RETREAT ══════════ */}
          {activeTab === "about" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>What Is The Retreat</h3>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Discover"
                      {...register("whatBadge", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Program Note</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. This retreat consists of a foundation program..."
                      {...register("programNote", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. What is the inner awakening retreat?"
                    {...register("whatTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Quote Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Why am I doing all of this? Who am I?..."
                    {...register("quoteText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Body Paragraph</label>
                <div className={styles.editorWrap}>
                  <Controller
                    name="bodyText"
                    control={control}
                    render={({ field }) => (
                      <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />
                    )}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Insight Cards</h3>
                <span className={styles.sectionBadge}>{insightCardsArray.fields.length}/4</span>
              </div>
              {insightCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Insight #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => insightCardsArray.remove(index)}
                      disabled={insightCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow} style={{ marginBottom: "0.6rem" }}>
                    <div className={styles.inputWrap} style={{ maxWidth: "90px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="01"
                        {...register(`insightCards.${index}.number`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Inner Exploration"
                        {...register(`insightCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.inputWrap}>
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      rows={3}
                      placeholder="Insight description text"
                      {...register(`insightCards.${index}.text`, { required: true })}
                    />
                  </div>
                </div>
              ))}
              {insightCardsArray.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => insightCardsArray.append({ number: "", title: "", text: "" })}
                >
                  + Add Insight Card
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 4 — SCHEDULE ══════════ */}
          {activeTab === "schedule" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Schedule Section Header</h3>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Schedule Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Program Details"
                      {...register("scheduleBadge", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Weeks Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Two weeks"
                      {...register("weeksBadge", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Schedule Title (H2)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. What is the schedule, what is inside the retreat?"
                    {...register("scheduleTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Weeks Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. of foundation retreat"
                    {...register("weeksText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>7 Points Card</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. 7 Points of Inner Transformation"
                    {...register("card1Title", { required: "Required" })}
                  />
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="points"
                label="Points List"
                placeholder="e.g. Sublimation"
                max={10}
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Footnote</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. The first 6 points lead to the root of all things..."
                    {...register("cardFootnote", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Daily Schedule Card</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Daily Schedule - Draft Program"
                    {...register("card2Title", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Morning Session Label</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Morning Session"
                    {...register("morningLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Morning Items</h3>
                <span className={styles.sectionBadge}>{morningItemsArray.fields.length}/10</span>
              </div>
              <div className={styles.itemsList}>
                {morningItemsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "160px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 6:30 - 8:00"
                            {...register(`morningItems.${index}.time`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Meditation"
                            {...register(`morningItems.${index}.activity`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => morningItemsArray.remove(index)}
                      disabled={morningItemsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {morningItemsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => morningItemsArray.append({ time: "", activity: "" })}
                >
                  + Add Morning Item
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Lunch / Break Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. LUNCH + Self Practice / Study - Free until 17:00"
                    {...register("breakText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Evening Session Label</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Evening Session"
                    {...register("eveningLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Evening Items</h3>
                <span className={styles.sectionBadge}>{eveningItemsArray.fields.length}/10</span>
              </div>
              <div className={styles.itemsList}>
                {eveningItemsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "160px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 17:00 - 19:30"
                            {...register(`eveningItems.${index}.time`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Evening Sadhana"
                            {...register(`eveningItems.${index}.activity`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => eveningItemsArray.remove(index)}
                      disabled={eveningItemsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {eveningItemsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => eveningItemsArray.append({ time: "", activity: "" })}
                >
                  + Add Evening Item
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 5 — GALLERY ══════════ */}
          {activeTab === "gallery" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Gallery Header</h3>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Gallery Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Visual Journey"
                      {...register("galleryBadge", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Gallery Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Moments of Inner Transformation"
                      {...register("galleryTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Gallery Subtitle</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Experience the serene atmosphere and spiritual practices..."
                    {...register("gallerySubtitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Gallery Images</h3>
                <span className={styles.sectionBadge}>{galleryImagesArray.fields.length}/3</span>
              </div>
              {galleryImagesArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Image #{index + 1}</span>
                  </div>
                  <div className={styles.itemFieldsRow} style={{ marginBottom: "0.7rem" }}>
                    <div className={styles.itemThumbInputWrap}>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.itemThumbInput}
                        onChange={(e) => handleGalleryImage(index, e.target.files?.[0] || null)}
                      />
                      {watchAll.galleryImages?.[index]?._preview ? (
                        <img src={watchAll.galleryImages[index]._preview} alt="" className={styles.itemThumb} />
                      ) : (
                        <div className={styles.itemThumbEmpty}>📷</div>
                      )}
                    </div>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Sacred Prayer (caption)"
                          {...register(`galleryImages.${index}.caption`, { required: true })}
                        />
                      </div>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Connecting with the divine (subcaption)"
                          {...register(`galleryImages.${index}.subcaption`, { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {galleryImagesArray.fields.length < 3 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => {
                    galleryImagesArray.append({ caption: "", subcaption: "" });
                    setGalleryFiles((prev) => [...prev, null]);
                  }}
                >
                  + Add Gallery Image
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 6 — CONCEPTS & FEE ══════════ */}
          {activeTab === "fee" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Key Concepts</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Definitions Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Key Concepts"
                    {...register("definitionTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Terms</h3>
                <span className={styles.sectionBadge}>{termsArray.fields.length}/6</span>
              </div>
              <div className={styles.itemsList}>
                {termsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Satsang"
                          {...register(`terms.${index}.term`, { required: true })}
                        />
                      </div>
                      <div className={styles.inputWrap}>
                        <textarea
                          className={`${styles.input} ${styles.textarea}`}
                          rows={2}
                          placeholder="e.g. In Sanskrit, it means gathering together for the truth..."
                          {...register(`terms.${index}.desc`, { required: true })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => termsArray.remove(index)}
                      disabled={termsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {termsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => termsArray.append({ term: "", desc: "" })}
                >
                  + Add Term
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Participant Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Who Can Participate?"
                    {...register("participantTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="participantList"
                label="Participant Criteria"
                placeholder="e.g. Anyone who has finished a 200 hour yoga TT..."
                max={8}
              />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>What's Included / Fee</h3>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Fee Badge</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Investment"
                      {...register("feeBadge", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Fee Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. What's Included"
                      {...register("feeTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="includedItems"
                label="Included Items"
                placeholder="e.g. Private Accommodation with Mountain View"
                max={10}
              />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pricing Badge</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Retreat Ticket"
                    {...register("pricingBadge", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Price (USD)<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.priceUSD ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 1000"
                      {...register("priceUSD", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Price (INR)<span className={styles.required}>*</span>
                  </label>
                  <div className={`${styles.inputWrap} ${errors.priceINR ? styles.inputError : ""}`}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. 70,000"
                      {...register("priceINR", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              {watchAll.priceUSD && watchAll.priceINR && (
                <div className={styles.pricePillPreview}>
                  💰 ${watchAll.priceUSD} / ₹{watchAll.priceINR}
                </div>
              )}

              <div className={styles.fieldGroup} style={{ marginTop: "1rem" }}>
                <label className={styles.label}>Pricing Description</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="e.g. The price includes two-week private room accommodation..."
                    {...register("pricingDesc", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pricing Note</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Limited seats available. Early booking recommended."
                    {...register("pricingNote", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/inner-awakening" className={styles.cancelBtn}>
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
              {activeTab !== "fee" ? (
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