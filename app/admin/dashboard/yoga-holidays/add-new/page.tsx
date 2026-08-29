"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Holidaysadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem { text: string }
interface StringItem { text: string }
interface TimeSlotItem { time: string; activity: string }
interface PricingCardItem { title: string; amount: string; detail: string; includes: string } // includes: comma-separated

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Section 1 — intro
  mainTitle: string;
  bodyParagraphs: ParagraphItem[];
  mediaImageAlt: string;
  _mediaImagePreview?: string;
  imageOverlayCaption: string;
  videoEmbedUrl: string;

  // Ayurveda callout + Benefits + CTA
  ayurvedaCalloutParagraphs: ParagraphItem[];
  benefitsHeading: string;
  benefits: StringItem[];
  ctaText: string;
  ctaButtonText: string;
  ctaButtonLink: string;

  // Section 2 — Shivir header + description + camp image
  shivirTitle: string;
  shivirSubtitle: string;
  descriptionParagraphs: ParagraphItem[];
  campImageAlt: string;
  _campImagePreview?: string;
  campImageCaption: string;

  // Dates & Duration
  datesHighlight: string;
  durationRange: string;
  dateNote: string;
  datePeriods: StringItem[];

  // Timetable
  timetableTitle: string;
  timetableSubtitle: string;
  timetableRows: TimeSlotItem[];

  // Pricing
  pricingCards: PricingCardItem[];

  // Enrollment
  enrollTitle: string;
  enrollSteps: StringItem[];
  seatsNote: string;

  // Eligibility
  eligibilityTitle: string;
  eligibilityText: string;

  // Guidelines
  guidelinesTitle: string;
  guidelines: StringItem[];

  // More Info + Dress Code
  moreInfoTitle: string;
  moreInfoParagraphs: ParagraphItem[];
  dressCodeTitle: string;
  dressCodeMen: string;
  dressCodeWomen: string;
  dressCodeNote: string;

  // How to Reach
  reachTitle: string;
  reachText: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  mainTitle: "Yoga Holidays in India / Yoga Vacations in India, Rishikesh at AYM Yoga Holiday Retreats",
  bodyParagraphs: [{ text: "" }, { text: "" }],
  mediaImageAlt: "Stunning View of Rishikesh - AYM Yoga Center",
  imageOverlayCaption: "Stunning View of Rishikesh — AYM Yoga Center",
  videoEmbedUrl: "",

  ayurvedaCalloutParagraphs: [{ text: "" }],
  benefitsHeading: "The benefits of our Yoga Holiday in Rishikesh :",
  benefits: [
    { text: "Peace of mind & clarity" },
    { text: "Relaxation" },
    { text: "Rejuvenation — Mind, Body & Soul" },
    { text: "Flexibility" },
    { text: "Strength — Physical & Mental" },
    { text: "Authentic Experience" },
    { text: "Lots of fun" },
  ],
  ctaText: "For more detail about yoga holiday packages / vacations in Rishikesh, India.",
  ctaButtonText: "Click Here to See Yoga Holidays Packages",
  ctaButtonLink: "/yoga-retreats-in-rishikesh",

  shivirTitle: "Yog Shivir Haridwar, Rishikesh, India",
  shivirSubtitle: "Yoga Camps in Rishikesh / Yoga Shivir Rishikesh",
  descriptionParagraphs: [{ text: "" }],
  campImageAlt: "Yoga Camp in Rishikesh - AYM",
  campImageCaption: "Morning Yoga Session at AYM Camp",

  datesHighlight: "Summer Yoga camps in Rishikesh conducted during school holidays",
  durationRange: "7 to 21 Days",
  dateNote: "Choose according to your convenience",
  datePeriods: [{ text: "15 May - 05 June" }, { text: "06 June - 27 June" }, { text: "30 June - 15 July" }],

  timetableTitle: "Daily Schedule",
  timetableSubtitle: "Yoga Shivir Timetable",
  timetableRows: [
    { time: "06:00 AM", activity: "Wake Up" },
    { time: "06:30 AM", activity: "Asana Practice" },
    { time: "08:00 AM", activity: "Tea & Snacks" },
    { time: "08:30 AM", activity: "Pranayama" },
    { time: "10:00 AM", activity: "Breakfast" },
    { time: "11:00 AM", activity: "Yoga Philosophy" },
    { time: "01:30 PM", activity: "Lunch" },
    { time: "02:00 PM", activity: "Rest Period" },
    { time: "03:30 PM", activity: "Asana & Meditation" },
    { time: "06:30 PM", activity: "Dinner" },
    { time: "08:00 PM", activity: "Mantra Chanting" },
    { time: "10:00 PM", activity: "Lights Out" },
  ],

  pricingCards: [
    { title: "Course Fee", amount: "1,700 INR", detail: "per day", includes: "Accommodation, Meals, Yoga Classes" },
    { title: "Meals", amount: "Satvic", detail: "Vegetarian Food", includes: "Healthy, Nutritious, Traditional" },
    { title: "Accommodation", amount: "Shared Room", detail: "Included in Package", includes: "Private Room Available, Extra Charges Apply" },
  ],

  enrollTitle: "How to Enroll?",
  enrollSteps: [
    { text: "Register 1 month in advance" },
    { text: "Pay 5,000 INR advance booking fee" },
    { text: "Submit personal details for registration" },
  ],
  seatsNote: "Seats are limited and fill quickly",

  eligibilityTitle: "Who Can Attend?",
  eligibilityText: "",

  guidelinesTitle: "Important Guidelines",
  guidelines: [
    { text: "Bring bed sheets, mosquito coils, torch, stationery items" },
    { text: "Dress code: Loose, light-colored clothing" },
    { text: "No mobile phones during yoga sessions" },
    { text: "Punctuality required for all sessions" },
    { text: "No smoking, alcohol, or intoxicants on campus" },
    { text: "No fast food or junk food during camp" },
    { text: "Report by 6:00 PM day before camp starts" },
    { text: "Stay until camp concludes after lunch" },
  ],

  moreInfoTitle: "More related information for yog shivir Rishikesh at AYM",
  moreInfoParagraphs: [{ text: "" }, { text: "" }],
  dressCodeTitle: "Dress code for Yoga sessions",
  dressCodeMen: "",
  dressCodeWomen: "",
  dressCodeNote: "",

  reachTitle: "How to Reach?",
  reachText: "",
};

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

const joditConfig = {
  readonly: false,
  height: 200,
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

/* ─────────────────────── Reusable: dynamic rich-text paragraph list ─────────────────────── */
function ParagraphList({ control, name, label, max = 8 }: { control: Control<FormData, any>; name: string; label: string; max?: number }) {
  const { fields, append, remove } = useFieldArray({ control, name: name as any });
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: "0.9rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>Paragraph {index + 1}</label>
            <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
          <div className={styles.editorWrap}>
            <Controller
              name={`${name}.${index}.text` as any}
              control={control}
              render={({ field: f }) => <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />}
            />
          </div>
        </div>
      ))}
      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>+ Add Paragraph</button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: dynamic plain-string list ─────────────────────── */
function StringList({
  control,
  register,
  name,
  label,
  placeholder = "Text",
  max = 15,
}: {
  control: Control<FormData, any>;
  register: any;
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
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>{label}</h3>
        <span className={styles.sectionBadge}>{fields.length}/{max}</span>
      </div>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} placeholder={placeholder} {...register(`${name}.${index}.text`, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {fields.length < max && (
        <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>+ Add</button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function HolidaysAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [mediaImageFile, setMediaImageFile] = useState<File | null>(null);
  const [campImageFile, setCampImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "callout" | "shivir" | "dates" | "enroll" | "moreinfo"
  >("hero");

  const { control, handleSubmit, register, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
    defaultValues: INITIAL,
    mode: "onChange",
  });

  const watchAll = watch();
  const timetableArray = useFieldArray({ control, name: "timetableRows" });
  const pricingArray = useFieldArray({ control, name: "pricingCards" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/holidays-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",

          mainTitle: d.mainTitle ?? INITIAL.mainTitle,
          bodyParagraphs: d.bodyParagraphs?.length ? d.bodyParagraphs.map((t: string) => ({ text: t })) : INITIAL.bodyParagraphs,
          mediaImageAlt: d.mediaImageAlt ?? INITIAL.mediaImageAlt,
          _mediaImagePreview: d.mediaImage ? getImageUrl(d.mediaImage) : "",
          imageOverlayCaption: d.imageOverlayCaption ?? INITIAL.imageOverlayCaption,
          videoEmbedUrl: d.videoEmbedUrl ?? "",

          ayurvedaCalloutParagraphs: d.ayurvedaCalloutParagraphs?.length
            ? d.ayurvedaCalloutParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.ayurvedaCalloutParagraphs,
          benefitsHeading: d.benefitsHeading ?? INITIAL.benefitsHeading,
          benefits: d.benefits?.length ? d.benefits.map((t: string) => ({ text: t })) : INITIAL.benefits,
          ctaText: d.ctaText ?? INITIAL.ctaText,
          ctaButtonText: d.ctaButtonText ?? INITIAL.ctaButtonText,
          ctaButtonLink: d.ctaButtonLink ?? INITIAL.ctaButtonLink,

          shivirTitle: d.shivirTitle ?? INITIAL.shivirTitle,
          shivirSubtitle: d.shivirSubtitle ?? INITIAL.shivirSubtitle,
          descriptionParagraphs: d.descriptionParagraphs?.length
            ? d.descriptionParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.descriptionParagraphs,
          campImageAlt: d.campImageAlt ?? INITIAL.campImageAlt,
          _campImagePreview: d.campImage ? getImageUrl(d.campImage) : "",
          campImageCaption: d.campImageCaption ?? INITIAL.campImageCaption,

          datesHighlight: d.datesHighlight ?? INITIAL.datesHighlight,
          durationRange: d.durationRange ?? INITIAL.durationRange,
          dateNote: d.dateNote ?? INITIAL.dateNote,
          datePeriods: d.datePeriods?.length ? d.datePeriods.map((t: string) => ({ text: t })) : INITIAL.datePeriods,

          timetableTitle: d.timetableTitle ?? INITIAL.timetableTitle,
          timetableSubtitle: d.timetableSubtitle ?? INITIAL.timetableSubtitle,
          timetableRows: d.timetableRows?.length ? d.timetableRows : INITIAL.timetableRows,

          pricingCards: d.pricingCards?.length
            ? d.pricingCards.map((p: any) => ({ ...p, includes: Array.isArray(p.includes) ? p.includes.join(", ") : p.includes ?? "" }))
            : INITIAL.pricingCards,

          enrollTitle: d.enrollTitle ?? INITIAL.enrollTitle,
          enrollSteps: d.enrollSteps?.length ? d.enrollSteps.map((t: string) => ({ text: t })) : INITIAL.enrollSteps,
          seatsNote: d.seatsNote ?? INITIAL.seatsNote,

          eligibilityTitle: d.eligibilityTitle ?? INITIAL.eligibilityTitle,
          eligibilityText: d.eligibilityText ?? "",

          guidelinesTitle: d.guidelinesTitle ?? INITIAL.guidelinesTitle,
          guidelines: d.guidelines?.length ? d.guidelines.map((t: string) => ({ text: t })) : INITIAL.guidelines,

          moreInfoTitle: d.moreInfoTitle ?? INITIAL.moreInfoTitle,
          moreInfoParagraphs: d.moreInfoParagraphs?.length
            ? d.moreInfoParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.moreInfoParagraphs,
          dressCodeTitle: d.dressCodeTitle ?? INITIAL.dressCodeTitle,
          dressCodeMen: d.dressCodeMen ?? "",
          dressCodeWomen: d.dressCodeWomen ?? "",
          dressCodeNote: d.dressCodeNote ?? "",

          reachTitle: d.reachTitle ?? INITIAL.reachTitle,
          reachText: d.reachText ?? "",
        });
      } catch {
        toast.error("Failed to fetch holidays section data");
        router.replace("/admin/dashboard/yoga-holidays");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, sectionId, reset, router]);

  /* ── Image handlers ── */
  const makeImageHandler = (previewField: keyof FormData, setter: (f: File | null) => void) => (file: File | null) => {
    if (!file) return;
    setter(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue(previewField as any, e.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleHeroImage = makeImageHandler("_heroPreview", setHeroFile);
  const handleMediaImage = makeImageHandler("_mediaImagePreview", setMediaImageFile);
  const handleCampImage = makeImageHandler("_campImagePreview", setCampImageFile);

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("mainTitle", data.mainTitle);
      formData.append("mediaImageAlt", data.mediaImageAlt);
      formData.append("imageOverlayCaption", data.imageOverlayCaption);
      formData.append("videoEmbedUrl", data.videoEmbedUrl);
      formData.append("benefitsHeading", data.benefitsHeading);
      formData.append("ctaText", data.ctaText);
      formData.append("ctaButtonText", data.ctaButtonText);
      formData.append("ctaButtonLink", data.ctaButtonLink);
      formData.append("shivirTitle", data.shivirTitle);
      formData.append("shivirSubtitle", data.shivirSubtitle);
      formData.append("campImageAlt", data.campImageAlt);
      formData.append("campImageCaption", data.campImageCaption);
      formData.append("datesHighlight", data.datesHighlight);
      formData.append("durationRange", data.durationRange);
      formData.append("dateNote", data.dateNote);
      formData.append("timetableTitle", data.timetableTitle);
      formData.append("timetableSubtitle", data.timetableSubtitle);
      formData.append("enrollTitle", data.enrollTitle);
      formData.append("seatsNote", data.seatsNote);
      formData.append("eligibilityTitle", data.eligibilityTitle);
      formData.append("eligibilityText", data.eligibilityText);
      formData.append("guidelinesTitle", data.guidelinesTitle);
      formData.append("moreInfoTitle", data.moreInfoTitle);
      formData.append("dressCodeTitle", data.dressCodeTitle);
      formData.append("dressCodeMen", data.dressCodeMen);
      formData.append("dressCodeWomen", data.dressCodeWomen);
      formData.append("dressCodeNote", data.dressCodeNote);
      formData.append("reachTitle", data.reachTitle);
      formData.append("reachText", data.reachText);

      formData.append("bodyParagraphs", JSON.stringify(data.bodyParagraphs.map((p) => p.text)));
      formData.append("ayurvedaCalloutParagraphs", JSON.stringify(data.ayurvedaCalloutParagraphs.map((p) => p.text)));
      formData.append("benefits", JSON.stringify(data.benefits.map((b) => b.text)));
      formData.append("descriptionParagraphs", JSON.stringify(data.descriptionParagraphs.map((p) => p.text)));
      formData.append("datePeriods", JSON.stringify(data.datePeriods.map((d) => d.text)));
      formData.append("timetableRows", JSON.stringify(data.timetableRows));
      formData.append(
        "pricingCards",
        JSON.stringify(
          data.pricingCards.map((p) => ({
            ...p,
            includes: p.includes.split(",").map((s) => s.trim()).filter(Boolean),
          }))
        )
      );
      formData.append("enrollSteps", JSON.stringify(data.enrollSteps.map((s) => s.text)));
      formData.append("guidelines", JSON.stringify(data.guidelines.map((g) => g.text)));
      formData.append("moreInfoParagraphs", JSON.stringify(data.moreInfoParagraphs.map((p) => p.text)));

      if (heroFile) formData.append("heroImage", heroFile);
      if (mediaImageFile) formData.append("mediaImage", mediaImageFile);
      if (campImageFile) formData.append("campImage", campImageFile);

      if (isEdit && sectionId) {
        await api.put(`/holidays-section/${sectionId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/holidays-section", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-holidays"), 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.formPage}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonCard}>
          {[...Array(5)].map((_, i) => <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />)}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Yoga Holidays Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.mainTitle),
    callout: !!(errors.benefitsHeading || errors.ctaButtonText),
    shivir: !!(errors.shivirTitle || errors.shivirSubtitle),
    dates: !!(errors.timetableTitle || errors.pricingCards),
    enroll: !!(errors.enrollTitle || errors.eligibilityTitle),
    moreinfo: !!(errors.moreInfoTitle || errors.reachTitle),
  };

  const tabLabels = {
    hero: "① Hero & Intro",
    callout: "② Callout, Benefits & CTA",
    shivir: "③ Shivir & Camp",
    dates: "④ Dates, Timetable & Pricing",
    enroll: "⑤ Enroll, Eligibility & Rules",
    moreinfo: "⑥ More Info & Reach",
  };

  const tabOrder = ["hero", "callout", "shivir", "dates", "enroll", "moreinfo"] as const;

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-holidays" className={styles.breadcrumbLink}>Yoga Holidays Section</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga Holidays Section" : "Add Yoga Holidays Section"}</h1>
        <p className={styles.pageSubtitle}>Fill in every section of the Yoga Holidays page</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

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
          {/* ══════════ TAB 1 — HERO & INTRO ══════════ */}
          {activeTab === "hero" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Hero Image</h3></div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Banner Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleHeroImage(e.target.files?.[0] || null)} />
                  {watchAll._heroPreview ? <img src={watchAll._heroPreview} alt="preview" className={styles.imgPreview} /> : (
                    <><span className={styles.uploadIcon}>🏔️</span><span className={styles.uploadText}>Click to upload</span></>
                  )}
                </label>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Image Alt Text</label>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} {...register("heroImageAlt", { required: "Required" })} />
                </div>
                {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Main Title (H1)<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.mainTitle ? styles.inputError : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("mainTitle", { required: "Required" })} />
                </div>
              </div>

              <ParagraphList control={control} name="bodyParagraphs" label="Intro Body Paragraphs" />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Side Media Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleMediaImage(e.target.files?.[0] || null)} />
                  {watchAll._mediaImagePreview ? <img src={watchAll._mediaImagePreview} alt="preview" className={styles.imgPreview} /> : (
                    <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Click to upload</span></>
                  )}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Media Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("mediaImageAlt")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Overlay Caption</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("imageOverlayCaption")} /></div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Video Embed URL</label>
                <p className={styles.fieldHint}>YouTube/Vimeo embed URL for the iframe (leave blank to hide video).</p>
                <div className={styles.inputWrap}>
                  <input type="text" className={styles.input} placeholder="https://www.youtube.com/embed/..." {...register("videoEmbedUrl")} />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — AYURVEDA CALLOUT, BENEFITS, CTA ══════════ */}
          {activeTab === "callout" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Ayurveda Callout</h3></div>
                <ParagraphList control={control} name="ayurvedaCalloutParagraphs" label="Callout Paragraphs" />
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Benefits Pills</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Benefits Heading</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("benefitsHeading", { required: "Required" })} /></div>
                </div>
                <StringList control={control} register={register} name="benefits" label="Benefit Pills" placeholder="e.g. Relaxation" />
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>CTA Bar</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>CTA Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("ctaText")} /></div>
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Button Text<span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrap} ${errors.ctaButtonText ? styles.inputError : ""}`}>
                      <input type="text" className={styles.input} {...register("ctaButtonText", { required: "Required" })} />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Button Link</label>
                    <div className={`${styles.inputWrap} ${styles.inputWithPrefix}`}>
                      <span className={styles.inputPrefix}>🔗</span>
                      <input type="text" className={`${styles.input} ${styles.inputPrefixed}`} placeholder="/yoga-retreats-in-rishikesh" {...register("ctaButtonLink")} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ══════════ TAB 3 — SHIVIR HEADER, DESCRIPTION, CAMP IMAGE ══════════ */}
          {activeTab === "shivir" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Shivir Header</h3></div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Shivir Title (H2)<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.shivirTitle ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} {...register("shivirTitle", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Shivir Subtitle (H3)<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.shivirSubtitle ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} {...register("shivirSubtitle", { required: "Required" })} />
                </div>
              </div>

              <ParagraphList control={control} name="descriptionParagraphs" label="Description Paragraphs" />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Camp Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleCampImage(e.target.files?.[0] || null)} />
                  {watchAll._campImagePreview ? <img src={watchAll._campImagePreview} alt="preview" className={styles.imgPreview} /> : (
                    <><span className={styles.uploadIcon}>🏕️</span><span className={styles.uploadText}>Click to upload</span></>
                  )}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Camp Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("campImageAlt")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Camp Image Caption</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("campImageCaption")} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — DATES, TIMETABLE, PRICING ══════════ */}
          {activeTab === "dates" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Dates & Duration</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Dates Highlight</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("datesHighlight")} /></div>
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Duration Range</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. 7 to 21 Days" {...register("durationRange")} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Date Note</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("dateNote")} /></div>
                  </div>
                </div>
                <StringList control={control} register={register} name="datePeriods" label="Date Periods" placeholder="e.g. 15 May - 05 June" max={12} />
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Daily Timetable</h3>
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Timetable Title</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("timetableTitle", { required: "Required" })} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Timetable Subtitle</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("timetableSubtitle")} /></div>
                  </div>
                </div>

                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.sectionBadge}>{timetableArray.fields.length}/24 rows</span>
                </div>
                <div className={styles.itemsList}>
                  {timetableArray.fields.map((field, index) => (
                    <div key={field.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{index + 1}</span>
                      <div className={styles.itemFields}>
                        <div className={styles.itemFieldsRow}>
                          <div className={styles.inputWrap} style={{ maxWidth: "130px" }}>
                            <input type="text" className={styles.input} placeholder="06:00 AM" {...register(`timetableRows.${index}.time`, { required: true })} />
                          </div>
                          <div className={styles.inputWrap} style={{ flex: 1 }}>
                            <input type="text" className={styles.input} placeholder="Activity" {...register(`timetableRows.${index}.activity`, { required: true })} />
                          </div>
                        </div>
                      </div>
                      <button type="button" className={styles.removeItemBtn} onClick={() => timetableArray.remove(index)} disabled={timetableArray.fields.length <= 1}>✕</button>
                    </div>
                  ))}
                </div>
                {timetableArray.fields.length < 24 && (
                  <button type="button" className={styles.addBtn} onClick={() => timetableArray.append({ time: "", activity: "" })}>+ Add Time Slot</button>
                )}
                <p className={styles.fieldHint} style={{ marginTop: "0.6rem" }}>Rows are shown as one ordered list and split into two columns automatically on the page.</p>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>✦</span>
                  <h3 className={styles.sectionTitle}>Pricing Cards</h3>
                  <span className={styles.sectionBadge}>{pricingArray.fields.length}/6</span>
                </div>
                <div className={styles.itemsList}>
                  {pricingArray.fields.map((field, index) => (
                    <div key={field.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{index + 1}</span>
                      <div className={styles.itemFields}>
                        <div className={styles.itemFieldsRow}>
                          <div className={styles.inputWrap} style={{ flex: 1 }}>
                            <input type="text" className={styles.input} placeholder="Card title" {...register(`pricingCards.${index}.title`, { required: true })} />
                          </div>
                          <div className={styles.inputWrap} style={{ flex: 1 }}>
                            <input type="text" className={styles.input} placeholder="Amount e.g. 1,700 INR" {...register(`pricingCards.${index}.amount`, { required: true })} />
                          </div>
                        </div>
                        <div className={styles.inputWrap}>
                          <input type="text" className={styles.input} placeholder="Detail e.g. per day" {...register(`pricingCards.${index}.detail`, { required: true })} />
                        </div>
                        <div className={styles.inputWrap}>
                          <input type="text" className={styles.input} placeholder="Includes — comma separated, e.g. Accommodation, Meals" {...register(`pricingCards.${index}.includes`)} />
                        </div>
                      </div>
                      <button type="button" className={styles.removeItemBtn} onClick={() => pricingArray.remove(index)} disabled={pricingArray.fields.length <= 1}>✕</button>
                    </div>
                  ))}
                </div>
                {pricingArray.fields.length < 6 && (
                  <button type="button" className={styles.addBtn} onClick={() => pricingArray.append({ title: "", amount: "", detail: "", includes: "" })}>+ Add Pricing Card</button>
                )}
              </div>
            </>
          )}

          {/* ══════════ TAB 5 — ENROLL, ELIGIBILITY, GUIDELINES ══════════ */}
          {activeTab === "enroll" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Enrollment</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Enroll Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.enrollTitle ? styles.inputError : ""}`}>
                    <input type="text" className={styles.input} {...register("enrollTitle", { required: "Required" })} />
                  </div>
                </div>
                <StringList control={control} register={register} name="enrollSteps" label="Enrollment Steps" placeholder="e.g. Register 1 month in advance" max={8} />
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Seats Note</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("seatsNote")} /></div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Eligibility</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eligibility Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.eligibilityTitle ? styles.inputError : ""}`}>
                    <input type="text" className={styles.input} {...register("eligibilityTitle", { required: "Required" })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eligibility Text</label>
                  <div className={styles.editorWrap}>
                    <Controller name="eligibilityText" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Guidelines</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Guidelines Title</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("guidelinesTitle")} /></div>
                </div>
                <StringList control={control} register={register} name="guidelines" label="Guideline Items" placeholder="e.g. No mobile phones during yoga sessions" max={15} />
              </div>
            </>
          )}

          {/* ══════════ TAB 6 — MORE INFO, DRESS CODE, REACH ══════════ */}
          {activeTab === "moreinfo" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>More Related Information</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.moreInfoTitle ? styles.inputError : ""}`}>
                    <input type="text" className={styles.input} {...register("moreInfoTitle", { required: "Required" })} />
                  </div>
                </div>
                <ParagraphList control={control} name="moreInfoParagraphs" label="Info / Rules Paragraphs" max={15} />
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Dress Code</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Dress Code Title</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("dressCodeTitle")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>For Men</label>
                  <div className={styles.editorWrap}>
                    <Controller name="dressCodeMen" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>For Women</label>
                  <div className={styles.editorWrap}>
                    <Controller name="dressCodeWomen" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Extra Dress Code Note</label>
                  <div className={styles.editorWrap}>
                    <Controller name="dressCodeNote" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>How to Reach</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Reach Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.reachTitle ? styles.inputError : ""}`}>
                    <input type="text" className={styles.input} {...register("reachTitle", { required: "Required" })} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Reach Text</label>
                  <div className={styles.editorWrap}>
                    <Controller name="reachText" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className={styles.formDivider} />

          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-holidays" className={styles.cancelBtn}>← Cancel</Link>
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
              {activeTab !== "moreinfo" ? (
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
                  {isSubmitting ? (<><span className={styles.spinner} /> Saving…</>) : (<><span>✦</span> {isEdit ? "Update Section" : "Save Section"}</>)}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}