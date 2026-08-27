"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Yogaashramadmin.module.css";
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
interface StatItem {
  num: string;
  label: string;
}
interface TimelineItem {
  icon: string;
  title: string;
  text: string;
}
interface CoursePill {
  title: string;
  link: string;
}
interface IconLabelItem {
  icon: string;
  label: string;
}
interface WhyCard {
  num: string;
  label: string;
  title: string;
  desc: string;
}
interface ActivityItem {
  icon: string;
  text: string;
}
interface CourseLink {
  title: string;
  link: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Title
  mainTitle: string;

  // Feature image + quote
  featureImageAlt: string;
  _featurePreview?: string;
  quoteText: string;

  // Welcome — stats + paragraphs
  welcomeStats: StatItem[];
  welcomeParagraphs: ParagraphItem[];

  // Experience — timeline
  experienceTitle: string;
  experienceParagraphs: ParagraphItem[];
  timelineItems: TimelineItem[];

  // Best section (About Rishikesh + Courses Offered)
  bestSectionLabel: string;
  bestSectionTitle: string;
  aboutCardTitle: string;
  aboutCardText: string;
  certBadges: TextItem[];
  coursesCardTitle: string;
  coursesCardText: string;
  coursePills: CoursePill[];

  // Bottom ashram photo
  _ashramPhotoPreview?: string;
  ashramPhotoAlt: string;
  photoCaptionTitle: string;
  photoCaptionSub: string;

  // What is an Ashram
  whatSectionLabel: string;
  whatSectionTitle: string;
  whatIcons: IconLabelItem[];
  whatParagraphs: ParagraphItem[];
  pullquote: string;
  whatExtraParagraph: string;

  // Why is AYM best
  whySectionLabel: string;
  whySectionTitle: string;
  whySectionLink: string;
  whyParagraphs: ParagraphItem[];
  whyCards: WhyCard[];

  // Activities
  actSectionLabel: string;
  actSectionTitle: string;
  actIntroText: string;
  activities: ActivityItem[];
  actBottomText: string;
  coursesHeading: string;
  coursesList: CourseLink[];
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  mainTitle: "Yoga Ashrams in India",

  featureImageAlt: "Yoga Ashrams in India",
  quoteText: "Where spirituality meets serenity",

  welcomeStats: [
    { num: "2000+", label: "Years of Tradition" },
    { num: "500+", label: "Yoga Ashrams" },
    { num: "100+", label: "Countries Visited" },
  ],
  welcomeParagraphs: [{ text: "" }, { text: "" }],

  experienceTitle: "Enthralling experiences in Yoga Ashrams Rishikesh & Practice of Yoga & Mediation",
  experienceParagraphs: [{ text: "" }, { text: "" }],
  timelineItems: [
    { icon: "🧘", title: "Authentic Learning", text: "Learn yoga from pioneers who mastered techniques at Vedic Gurukuls" },
    { icon: "📚", title: "Comprehensive Training", text: "Foundation principles and science behind each yoga pose" },
    { icon: "👨‍🏫", title: "Expert Teachers", text: "Skilled masters who teach from heart, mind, and soul" },
    { icon: "🌿", title: "Peaceful Environment", text: "Large, comfortable ashram with seekers from worldwide" },
  ],

  bestSectionLabel: "Yoga Capital of the World",
  bestSectionTitle: "Yoga Ashrams in Rishikesh — Best Home for Yoga",
  aboutCardTitle: "About Rishikesh",
  aboutCardText: "",
  certBadges: [{ text: "Yoga Alliance USA" }, { text: "Intl. Yoga Federation" }],
  coursesCardTitle: "Courses Offered",
  coursesCardText: "",
  coursePills: [
    { title: "200 Hours Teacher Training", link: "/200-hour-yoga-teacher-training-rishikesh" },
    { title: "300 Hours Teacher Training", link: "/300-hours-yoga-teacher-training-rishikesh" },
    { title: "500 Hours Teacher Training", link: "/500-hour-yoga-teacher-training-india" },
  ],

  ashramPhotoAlt: "Yoga Ashram in Rishikesh",
  photoCaptionTitle: "Yoga Ashram in Rishikesh",
  photoCaptionSub: "AYM Yoga School · Rishikesh, Uttarakhand",

  whatSectionLabel: "Understanding the Space",
  whatSectionTitle: "What is an Ashram?",
  whatIcons: [
    { icon: "🏔", label: "Away from city" },
    { icon: "🧘", label: "Daily practice" },
    { icon: "📖", label: "Spiritual school" },
    { icon: "🌿", label: "Karma yoga" },
  ],
  whatParagraphs: [{ text: "" }, { text: "" }],
  pullquote: "The ashram is a home away from home — where students can stay, read, study and practice yoga in a peaceful, undisturbed environment.",
  whatExtraParagraph: "",

  whySectionLabel: "Our Difference",
  whySectionTitle: "Why is AYM Yoga Ashram best to learn yoga?",
  whySectionLink: "/yoga-ttc-rishikesh",
  whyParagraphs: [{ text: "" }, { text: "" }],
  whyCards: [
    { num: "01", label: "Location", title: "Free from distraction", desc: "Located away from the hustle of daily life, free from interruptions, with full focus on your practice." },
    { num: "02", label: "Teachers", title: "Experienced masters", desc: "Qualified teachers who teach different styles and aspects of yoga with heart, mind, and soul." },
    { num: "03", label: "Practice", title: "Holistic wellness", desc: "Regular yoga practice with various asanas allows people to have a healthy mind and body free of toxins." },
    { num: "04", label: "Purpose", title: "Life transformation", desc: "People find the true meaning of life and discover how they can serve themselves by serving others." },
  ],

  actSectionLabel: "Life at the Ashram",
  actSectionTitle: "Activities in AYM Rishikesh Yoga Ashram",
  actIntroText: "",
  activities: [
    { icon: "🙏", text: "Karma Yoga — students participate in ashram activities as service" },
    { icon: "🎶", text: "Keertans — singing of religious songs and mantras together" },
    { icon: "🎬", text: "Yoga & meditation films — curated viewing sessions" },
    { icon: "🛕", text: "Spiritual site visits — one excursion during the course" },
    { icon: "🌅", text: "Free Sundays — explore Rishikesh and nearby places of worship" },
    { icon: "💬", text: "Post-class discussions with teachers on all aspects of life" },
  ],
  actBottomText: "",
  coursesHeading: "Various yoga courses offered by AYM yoga ashram in Rishikesh:",
  coursesList: [
    { title: "100 Hour Yoga Teacher Training in Rishikesh", link: "/100-hour-yoga-teacher-training-in-rishikesh" },
    { title: "200 Hour Yoga Teacher Training in Rishikesh", link: "/200-hour-yoga-teacher-training-rishikesh" },
    { title: "300 Hour Yoga Teacher Training in Rishikesh", link: "/300-hours-yoga-teacher-training-rishikesh" },
    { title: "500 Hour Yoga Teacher Training in Rishikesh", link: "/500-hour-yoga-teacher-training-india" },
  ],
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

/* ─────────────────────── Reusable: plain-text repeatable list (tags / badges) ─────────────────────── */
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

/* ─────────────────────── Reusable: generic repeatable nested card ───────────────────────
   Renders N text/textarea fields inside a bordered card, for arrays of objects
   (timeline items, why cards, course pills, activities, icon+label, course links, etc). */
interface RepeatFieldDef {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
  maxWidth?: string;
}

function RepeatableObjectList({
  control,
  register,
  name,
  label,
  badgeLabel,
  fieldsDef,
  max,
  emptyItem,
  layout = "stacked",
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: string;
  label: string;
  badgeLabel: string;
  fieldsDef: RepeatFieldDef[];
  max: number;
  emptyItem: Record<string, string>;
  layout?: "stacked" | "row";
}) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className={styles.nestedCard}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardBadge}>{badgeLabel} #{index + 1}</span>
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

          {layout === "row" ? (
            <div className={styles.itemFieldsRow}>
              {fieldsDef.map((f) => (
                <div
                  key={f.name}
                  className={styles.inputWrap}
                  style={{ maxWidth: f.maxWidth, flex: f.maxWidth ? undefined : 1 }}
                >
                  <input
                    type="text"
                    className={styles.input}
                    placeholder={f.placeholder}
                    {...register(`${name}.${index}.${f.name}` as any, { required: true })}
                  />
                </div>
              ))}
            </div>
          ) : (
            fieldsDef.map((f) => (
              <div className={styles.fieldGroup} key={f.name} style={{ marginBottom: "0.8rem" }}>
                <label className={styles.label}>{f.label}</label>
                <div className={styles.inputWrap}>
                  {f.type === "textarea" ? (
                    <textarea
                      className={`${styles.input} ${styles.textarea}`}
                      rows={2}
                      placeholder={f.placeholder}
                      {...register(`${name}.${index}.${f.name}` as any, { required: true })}
                    />
                  ) : (
                    <input
                      type="text"
                      className={styles.input}
                      placeholder={f.placeholder}
                      {...register(`${name}.${index}.${f.name}` as any, { required: true })}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ))}

      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append(emptyItem as any)}>
          + Add {badgeLabel}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function AshramAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [featureFile, setFeatureFile] = useState<File | null>(null);
  const [ashramPhotoFile, setAshramPhotoFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "feature" | "welcome" | "experience" | "best" | "photo" | "what" | "why" | "activities"
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

  const welcomeStatsArray = useFieldArray({ control, name: "welcomeStats" });
  const certBadgesArray = useFieldArray({ control, name: "certBadges" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/yoga-ashram-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          featureImageAlt: d.featureImageAlt ?? INITIAL.featureImageAlt,
          _featurePreview: d.featureImage ? getImageUrl(d.featureImage) : "",
          quoteText: d.quoteText ?? INITIAL.quoteText,
          welcomeStats: d.welcomeStats?.length ? d.welcomeStats : INITIAL.welcomeStats,
          welcomeParagraphs: d.welcomeParagraphs?.length
            ? d.welcomeParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.welcomeParagraphs,
          experienceTitle: d.experienceTitle ?? INITIAL.experienceTitle,
          experienceParagraphs: d.experienceParagraphs?.length
            ? d.experienceParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.experienceParagraphs,
          timelineItems: d.timelineItems?.length ? d.timelineItems : INITIAL.timelineItems,
          bestSectionLabel: d.bestSectionLabel ?? INITIAL.bestSectionLabel,
          bestSectionTitle: d.bestSectionTitle ?? INITIAL.bestSectionTitle,
          aboutCardTitle: d.aboutCardTitle ?? INITIAL.aboutCardTitle,
          aboutCardText: d.aboutCardText ?? INITIAL.aboutCardText,
          certBadges: d.certBadges?.length ? d.certBadges.map((t: string) => ({ text: t })) : INITIAL.certBadges,
          coursesCardTitle: d.coursesCardTitle ?? INITIAL.coursesCardTitle,
          coursesCardText: d.coursesCardText ?? INITIAL.coursesCardText,
          coursePills: d.coursePills?.length ? d.coursePills : INITIAL.coursePills,
          _ashramPhotoPreview: d.ashramPhoto ? getImageUrl(d.ashramPhoto) : "",
          ashramPhotoAlt: d.ashramPhotoAlt ?? INITIAL.ashramPhotoAlt,
          photoCaptionTitle: d.photoCaptionTitle ?? INITIAL.photoCaptionTitle,
          photoCaptionSub: d.photoCaptionSub ?? INITIAL.photoCaptionSub,
          whatSectionLabel: d.whatSectionLabel ?? INITIAL.whatSectionLabel,
          whatSectionTitle: d.whatSectionTitle ?? INITIAL.whatSectionTitle,
          whatIcons: d.whatIcons?.length ? d.whatIcons : INITIAL.whatIcons,
          whatParagraphs: d.whatParagraphs?.length
            ? d.whatParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.whatParagraphs,
          pullquote: d.pullquote ?? INITIAL.pullquote,
          whatExtraParagraph: d.whatExtraParagraph ?? INITIAL.whatExtraParagraph,
          whySectionLabel: d.whySectionLabel ?? INITIAL.whySectionLabel,
          whySectionTitle: d.whySectionTitle ?? INITIAL.whySectionTitle,
          whySectionLink: d.whySectionLink ?? INITIAL.whySectionLink,
          whyParagraphs: d.whyParagraphs?.length
            ? d.whyParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.whyParagraphs,
          whyCards: d.whyCards?.length ? d.whyCards : INITIAL.whyCards,
          actSectionLabel: d.actSectionLabel ?? INITIAL.actSectionLabel,
          actSectionTitle: d.actSectionTitle ?? INITIAL.actSectionTitle,
          actIntroText: d.actIntroText ?? INITIAL.actIntroText,
          activities: d.activities?.length ? d.activities : INITIAL.activities,
          actBottomText: d.actBottomText ?? INITIAL.actBottomText,
          coursesHeading: d.coursesHeading ?? INITIAL.coursesHeading,
          coursesList: d.coursesList?.length ? d.coursesList : INITIAL.coursesList,
        });
      } catch {
        toast.error("Failed to fetch yoga ashram section data");
        router.replace("/admin/dashboard/yoga-ashram");
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

  const handleFeatureImage = (file: File | null) => {
    if (!file) return;
    setFeatureFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_featurePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAshramPhoto = (file: File | null) => {
    if (!file) return;
    setAshramPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_ashramPhotoPreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("mainTitle", data.mainTitle);
      formData.append("featureImageAlt", data.featureImageAlt);
      formData.append("quoteText", data.quoteText);
      formData.append("welcomeStats", JSON.stringify(data.welcomeStats));
      formData.append("welcomeParagraphs", JSON.stringify(data.welcomeParagraphs.map((p) => p.text)));
      formData.append("experienceTitle", data.experienceTitle);
      formData.append("experienceParagraphs", JSON.stringify(data.experienceParagraphs.map((p) => p.text)));
      formData.append("timelineItems", JSON.stringify(data.timelineItems));
      formData.append("bestSectionLabel", data.bestSectionLabel);
      formData.append("bestSectionTitle", data.bestSectionTitle);
      formData.append("aboutCardTitle", data.aboutCardTitle);
      formData.append("aboutCardText", data.aboutCardText);
      formData.append("certBadges", JSON.stringify(data.certBadges.map((p) => p.text)));
      formData.append("coursesCardTitle", data.coursesCardTitle);
      formData.append("coursesCardText", data.coursesCardText);
      formData.append("coursePills", JSON.stringify(data.coursePills));
      formData.append("ashramPhotoAlt", data.ashramPhotoAlt);
      formData.append("photoCaptionTitle", data.photoCaptionTitle);
      formData.append("photoCaptionSub", data.photoCaptionSub);
      formData.append("whatSectionLabel", data.whatSectionLabel);
      formData.append("whatSectionTitle", data.whatSectionTitle);
      formData.append("whatIcons", JSON.stringify(data.whatIcons));
      formData.append("whatParagraphs", JSON.stringify(data.whatParagraphs.map((p) => p.text)));
      formData.append("pullquote", data.pullquote);
      formData.append("whatExtraParagraph", data.whatExtraParagraph);
      formData.append("whySectionLabel", data.whySectionLabel);
      formData.append("whySectionTitle", data.whySectionTitle);
      formData.append("whySectionLink", data.whySectionLink);
      formData.append("whyParagraphs", JSON.stringify(data.whyParagraphs.map((p) => p.text)));
      formData.append("whyCards", JSON.stringify(data.whyCards));
      formData.append("actSectionLabel", data.actSectionLabel);
      formData.append("actSectionTitle", data.actSectionTitle);
      formData.append("actIntroText", data.actIntroText);
      formData.append("activities", JSON.stringify(data.activities));
      formData.append("actBottomText", data.actBottomText);
      formData.append("coursesHeading", data.coursesHeading);
      formData.append("coursesList", JSON.stringify(data.coursesList));

      if (heroFile) formData.append("heroImage", heroFile);
      if (featureFile) formData.append("featureImage", featureFile);
      if (ashramPhotoFile) formData.append("ashramPhoto", ashramPhotoFile);

      if (isEdit && sectionId) {
        await api.put(`/yoga-ashram-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/yoga-ashram-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-ashram"), 1500);
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
          <h2 className={styles.successTitle}>Yoga Ashram Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.mainTitle),
    feature: !!(errors.featureImageAlt || errors.quoteText),
    welcome: !!(errors.welcomeStats || errors.welcomeParagraphs),
    experience: !!(errors.experienceTitle || errors.experienceParagraphs || errors.timelineItems),
    best: !!(
      errors.bestSectionLabel ||
      errors.bestSectionTitle ||
      errors.aboutCardTitle ||
      errors.aboutCardText ||
      errors.certBadges ||
      errors.coursesCardTitle ||
      errors.coursesCardText ||
      errors.coursePills
    ),
    photo: !!(errors.ashramPhotoAlt || errors.photoCaptionTitle || errors.photoCaptionSub),
    what: !!(
      errors.whatSectionLabel ||
      errors.whatSectionTitle ||
      errors.whatIcons ||
      errors.whatParagraphs ||
      errors.pullquote ||
      errors.whatExtraParagraph
    ),
    why: !!(errors.whySectionLabel || errors.whySectionTitle || errors.whyParagraphs || errors.whyCards),
    activities: !!(
      errors.actSectionLabel ||
      errors.actSectionTitle ||
      errors.actIntroText ||
      errors.activities ||
      errors.actBottomText ||
      errors.coursesHeading ||
      errors.coursesList
    ),
  };

  const tabLabels = {
    hero: "① Hero & Title",
    feature: "② Feature Image",
    welcome: "③ Welcome",
    experience: "④ Experience",
    best: "⑤ Best Home",
    photo: "⑥ Ashram Photo",
    what: "⑦ What is Ashram",
    why: "⑧ Why AYM",
    activities: "⑨ Activities",
  };

  const tabOrder = [
    "hero", "feature", "welcome", "experience", "best", "photo", "what", "why", "activities",
  ] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-ashram" className={styles.breadcrumbLink}>
          Yoga Ashram
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga Ashram Section" : "Add Yoga Ashram Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit
            ? "Update hero, welcome, experience, best-home, photo, ashram info, why-choose and activities"
            : "Fill in every section of the Yoga Ashrams in India page"}
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
            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${
              tabErrors[tab] ? styles.tabBtnError : ""
            }`}
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
                      <span className={styles.uploadIcon}>🏔️</span>
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
                  Page Title (H1)<span className={styles.required}>*</span>
                </label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Ashrams in India"
                    {...register("mainTitle", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — FEATURE IMAGE ══════════ */}
          {activeTab === "feature" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Feature Image &amp; Quote</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Feature Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleFeatureImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._featurePreview ? (
                    <img src={watchAll._featurePreview} alt="preview" className={styles.imgPreview} />
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
                <label className={styles.label}>Feature Image Alt Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Ashrams in India"
                    {...register("featureImageAlt", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Quote (over image)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Where spirituality meets serenity"
                    {...register("quoteText", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — WELCOME ══════════ */}
          {activeTab === "welcome" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Welcome Stats</h3>
                <span className={styles.sectionBadge}>{welcomeStatsArray.fields.length}/6</span>
              </div>
              <div className={styles.itemsList}>
                {welcomeStatsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "110px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 500+"
                            {...register(`welcomeStats.${index}.num`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Yoga Ashrams"
                            {...register(`welcomeStats.${index}.label`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => welcomeStatsArray.remove(index)}
                      disabled={welcomeStatsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {welcomeStatsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => welcomeStatsArray.append({ num: "", label: "" })}
                >
                  + Add Stat
                </button>
              )}

              <div className={styles.formDivider} />

              <ParagraphList control={control} name="welcomeParagraphs" label="Welcome Paragraphs" max={5} />
            </div>
          )}

          {/* ══════════ TAB 4 — EXPERIENCE ══════════ */}
          {activeTab === "experience" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Enthralling experiences in Yoga Ashrams Rishikesh & Practice of Yoga & Mediation"
                    {...register("experienceTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="experienceParagraphs" label="Experience Paragraphs" max={4} />

              <div className={styles.formDivider} />

              <RepeatableObjectList
                control={control}
                register={register}
                name="timelineItems"
                label="Timeline / Feature Cards"
                badgeLabel="Timeline Item"
                max={6}
                emptyItem={{ icon: "🧘", title: "", text: "" }}
                fieldsDef={[
                  { name: "icon", label: "Icon (emoji)", placeholder: "🧘" },
                  { name: "title", label: "Title", placeholder: "e.g. Authentic Learning" },
                  { name: "text", label: "Description", placeholder: "Short description", type: "textarea" },
                ]}
              />
            </div>
          )}

          {/* ══════════ TAB 5 — BEST HOME FOR YOGA ══════════ */}
          {activeTab === "best" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Capital of the World"
                      {...register("bestSectionLabel", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Ashrams in Rishikesh — Best Home for Yoga"
                      {...register("bestSectionTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>About Rishikesh Card</h3>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. About Rishikesh"
                    {...register("aboutCardTitle", { required: "Required" })}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    placeholder="About Rishikesh & the ashram, styles offered, etc."
                    {...register("aboutCardText", { required: "Required" })}
                  />
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="certBadges"
                label="Certification Badges"
                placeholder="e.g. Yoga Alliance USA"
                max={6}
              />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Courses Offered Card</h3>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Courses Offered"
                    {...register("coursesCardTitle", { required: "Required" })}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Card Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={4}
                    placeholder="Durations, certifications, etc."
                    {...register("coursesCardText", { required: "Required" })}
                  />
                </div>
              </div>

              <RepeatableObjectList
                control={control}
                register={register}
                name="coursePills"
                label="Course Pills"
                badgeLabel="Course"
                max={6}
                emptyItem={{ title: "", link: "" }}
                layout="row"
                fieldsDef={[
                  { name: "title", label: "Title", placeholder: "e.g. 200 Hours Teacher Training" },
                  { name: "link", label: "Link", placeholder: "/200-hour-yoga-teacher-training-rishikesh", maxWidth: "260px" },
                ]}
              />
            </div>
          )}

          {/* ══════════ TAB 6 — ASHRAM PHOTO ══════════ */}
          {activeTab === "photo" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Ashram Photo</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleAshramPhoto(e.target.files?.[0] || null)}
                  />
                  {watchAll._ashramPhotoPreview ? (
                    <img src={watchAll._ashramPhotoPreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>📷</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
                    </>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Photo Alt Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Yoga Ashram in Rishikesh"
                    {...register("ashramPhotoAlt", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Caption Title</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Ashram in Rishikesh"
                      {...register("photoCaptionTitle", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Caption Subtitle</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. AYM Yoga School · Rishikesh, Uttarakhand"
                      {...register("photoCaptionSub", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 7 — WHAT IS AN ASHRAM ══════════ */}
          {activeTab === "what" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Understanding the Space"
                      {...register("whatSectionLabel", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. What is an Ashram?"
                      {...register("whatSectionTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <RepeatableObjectList
                control={control}
                register={register}
                name="whatIcons"
                label="Icon Blocks"
                badgeLabel="Icon"
                max={6}
                emptyItem={{ icon: "🏔", label: "" }}
                layout="row"
                fieldsDef={[
                  { name: "icon", label: "Icon", placeholder: "🏔", maxWidth: "90px" },
                  { name: "label", label: "Label", placeholder: "e.g. Away from city" },
                ]}
              />

              <div className={styles.formDivider} />

              <ParagraphList control={control} name="whatParagraphs" label="What-is-Ashram Paragraphs" max={4} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pullquote</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="Short highlighted quote"
                    {...register("pullquote", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Extra Paragraph (after pullquote)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="e.g. While living in an ashram, you must wake up early..."
                    {...register("whatExtraParagraph", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 8 — WHY IS AYM BEST ══════════ */}
          {activeTab === "why" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Our Difference"
                      {...register("whySectionLabel", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2, linked)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Why is AYM Yoga Ashram best to learn yoga?"
                      {...register("whySectionTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title Link (href)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="/yoga-ttc-rishikesh"
                    {...register("whySectionLink", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="whyParagraphs" label="Why-Choose Paragraphs" max={4} />

              <div className={styles.formDivider} />

              <RepeatableObjectList
                control={control}
                register={register}
                name="whyCards"
                label="Why-Choose Cards"
                badgeLabel="Card"
                max={6}
                emptyItem={{ num: "01", label: "", title: "", desc: "" }}
                fieldsDef={[
                  { name: "num", label: "Number", placeholder: "e.g. 01" },
                  { name: "label", label: "Label", placeholder: "e.g. Location" },
                  { name: "title", label: "Title", placeholder: "e.g. Free from distraction" },
                  { name: "desc", label: "Description", placeholder: "Short description", type: "textarea" },
                ]}
              />
            </div>
          )}

          {/* ══════════ TAB 9 — ACTIVITIES ══════════ */}
          {activeTab === "activities" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Label</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Life at the Ashram"
                      {...register("actSectionLabel", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Activities in AYM Rishikesh Yoga Ashram"
                      {...register("actSectionTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Intro Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="Short intro before the activities grid"
                    {...register("actIntroText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <RepeatableObjectList
                control={control}
                register={register}
                name="activities"
                label="Activity Cards"
                badgeLabel="Activity"
                max={10}
                emptyItem={{ icon: "🙏", text: "" }}
                layout="row"
                fieldsDef={[
                  { name: "icon", label: "Icon", placeholder: "🙏", maxWidth: "90px" },
                  { name: "text", label: "Text", placeholder: "e.g. Karma Yoga — students participate in ashram activities as service" },
                ]}
              />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Bottom Closing Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. At AYM, you have a lot to learn. Don't wait..."
                    {...register("actBottomText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Courses List Heading</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Various yoga courses offered by AYM yoga ashram in Rishikesh:"
                    {...register("coursesHeading", { required: "Required" })}
                  />
                </div>
              </div>

              <RepeatableObjectList
                control={control}
                register={register}
                name="coursesList"
                label="Courses List Links"
                badgeLabel="Course Link"
                max={8}
                emptyItem={{ title: "", link: "" }}
                layout="row"
                fieldsDef={[
                  { name: "title", label: "Title", placeholder: "e.g. 100 Hour Yoga Teacher Training in Rishikesh" },
                  { name: "link", label: "Link", placeholder: "/100-hour-yoga-teacher-training-in-rishikesh", maxWidth: "260px" },
                ]}
              />
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-ashram" className={styles.cancelBtn}>
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