"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Retreatadmin.module.css";
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
interface PackageItem {
  title: string;
  price: string;
}
interface OverviewItem {
  label: string;
  value: string;
}
interface StripItem {
  label: string;
  _preview?: string;
  image?: string;
}
interface BlockItem {
  title: string;
  paragraphs: ParagraphItem[];
  priceFrom: string;
  priceNote: string;
}
interface InfoBlockItem {
  title: string;
  paragraphs: ParagraphItem[];
}
interface RouteItem {
  icon: string;
  title: string;
  badge: string;
  desc: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Page
  pageTitle: string;

  // Section 1 — Intro
  s1Paragraphs: ParagraphItem[];
  s1Stats: StatItem[];
  _s1ImagePreview?: string;
  s1PanelTags: TextItem[];
  s1Caption: string;

  // Section 2 — Schedule & Pricing
  s2Title: string;
  s2Intro: string;
  packages: PackageItem[];
  overview: OverviewItem[];
  applyButtonText: string;
  applyButtonLink: string;

  // Section 3 — Photo strip + blocks
  photoStrip: StripItem[];
  s3Blocks: BlockItem[];

  // Section 4 — Blocks, info blocks, why choose, affordable
  s4Blocks: BlockItem[];
  infoBlocks: InfoBlockItem[];
  whyChooseText: string;
  affordableTitle: string;
  affordableParagraphs: ParagraphItem[];
  affordableCardTitle: string;
  affordableCardSub: string;
  affordableFeatures: TextItem[];

  // Reach
  reachTitle: string;
  reachParagraphs: ParagraphItem[];
  routes: RouteItem[];
  bookNowText: string;
  bookNowLink: string;
  paypalText: string;
  paypalLink: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  pageTitle: "The Best Yoga Retreats in Rishikesh, India",

  s1Paragraphs: [
    { text: "" },
    { text: "" },
    { text: "" },
  ],
  s1Stats: [
    { num: "3–14", label: "Day Programs" },
    { num: "500+", label: "Happy Students" },
    { num: "15+", label: "Years Experience" },
    { num: "All", label: "Levels Welcome" },
  ],
  s1PanelTags: [{ text: "Yoga Retreat" }, { text: "in" }, { text: "Rishikesh" }],
  s1Caption: "Est. 2010 · Tapovan, Rishikesh · Internationally Accredited",

  s2Title: "Schedule of Best Yoga Retreats in Rishikesh, India",
  s2Intro: "",
  packages: [
    { title: "3 Days Yoga Retreat in Rishikesh", price: "75 USD / 6000 INR" },
    { title: "3 Days Ayurveda Retreat in Rishikesh", price: "105 USD / 9000 INR" },
    { title: "7 Days Yoga Retreat in Rishikesh", price: "175 USD / 14,000 INR" },
  ],
  overview: [
    { label: "Level", value: "Beginner to Advance." },
    { label: "Duration", value: "3, 7, 14 Days." },
    { label: "Accommodation & Food", value: "Private / 3 Vegetarian meals." },
  ],
  applyButtonText: "Apply Now",
  applyButtonLink: "/yoga-registration",

  photoStrip: [
    { label: "Morning Practice" },
    { label: "Meditation" },
    { label: "Nature & Healing" },
  ],
  s3Blocks: [
    {
      title: "3 to 7 Days Yoga Retreat in Rishikesh",
      paragraphs: [{ text: "" }],
      priceFrom: "25 USD / ₹2,000 per day",
      priceNote: "Food & accommodation included.",
    },
  ],

  s4Blocks: [
    {
      title: "7 to 14 Days Yoga Retreats India",
      paragraphs: [{ text: "" }],
      priceFrom: "175–350 USD / ₹14,000–28,000",
      priceNote: "Private accommodation & meals included.",
    },
  ],
  infoBlocks: [
    { title: "Schedule of yoga classes", paragraphs: [{ text: "" }] },
    { title: "How to Book Yoga Retreat in Rishikesh?", paragraphs: [{ text: "" }] },
    { title: "Refund Rules", paragraphs: [{ text: "" }] },
  ],
  whyChooseText: "Why Choose AYM",
  affordableTitle: "Affordable Yoga Retreats in Rishikesh",
  affordableParagraphs: [{ text: "" }],
  affordableCardTitle: "What Makes AYM Special",
  affordableCardSub: "Our Highlights",
  affordableFeatures: [
    { text: "Highly qualified & experienced teachers" },
    { text: "Nourishing vegan & vegetarian meals" },
    { text: "Private accommodation included" },
  ],

  reachTitle: "How Can You Reach AYM Yoga School for Yoga Retreats in Rishikesh?",
  reachParagraphs: [{ text: "" }, { text: "" }],
  routes: [
    { icon: "✈️", title: "By Air — Recommended", badge: "Best", desc: "" },
    { icon: "🚗", title: "Direct Pick-up from Delhi", badge: "Extra Fee", desc: "" },
    { icon: "🚂", title: "By Train or Bus", badge: "Budget", desc: "" },
  ],
  bookNowText: "Yoga Retreats — Book Now",
  bookNowLink: "/yoga-registration",
  paypalText: "PayPal",
  paypalLink: "/200-hour-yoga-ttc-fees",
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

/* ─────────────────────── Reusable: plain-text repeatable list (tags / features) ─────────────────────── */
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

/* ─────────────────────── Reusable: one content block (title + paragraphs + price) ─────────────────────── */
function ContentBlockFields({
  control,
  register,
  name,
  index,
  onRemove,
  canRemove,
}: {
  control: Control<FormData, any>;
  register: UseFormRegister<FormData>;
  name: "s3Blocks" | "s4Blocks";
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Block #{index + 1}</span>
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
        <label className={styles.label}>Block Title (H2)</label>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. 3 to 7 Days Yoga Retreat in Rishikesh"
            {...register(`${name}.${index}.title`, { required: "Required" })}
          />
        </div>
      </div>

      <ParagraphList control={control} name={`${name}.${index}.paragraphs`} label="Paragraphs" max={4} />

      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Price From</label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 25 USD / ₹2,000 per day"
              {...register(`${name}.${index}.priceFrom`, { required: "Required" })}
            />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Price Note</label>
          <div className={styles.inputWrap}>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Food & accommodation included."
              {...register(`${name}.${index}.priceNote`, { required: "Required" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Reusable: one info block (title + paragraphs) ─────────────────────── */
function InfoBlockFields({
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
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Info Block #{index + 1}</span>
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
        <label className={styles.label}>Title (H2)</label>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. How to Book Yoga Retreat in Rishikesh?"
            {...register(`infoBlocks.${index}.title`, { required: "Required" })}
          />
        </div>
      </div>

      <ParagraphList control={control} name={`infoBlocks.${index}.paragraphs`} label="Paragraphs" max={4} />
    </div>
  );
}

/* ─────────────────────── Reusable: one route card ─────────────────────── */
function RouteFields({
  register,
  index,
  onRemove,
  canRemove,
}: {
  register: UseFormRegister<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Route #{index + 1}</span>
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
        <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
          <input
            type="text"
            className={styles.input}
            placeholder="✈️"
            {...register(`routes.${index}.icon`, { required: true })}
          />
        </div>
        <div className={styles.inputWrap} style={{ flex: 1 }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Route title"
            {...register(`routes.${index}.title`, { required: true })}
          />
        </div>
        <div className={styles.inputWrap} style={{ maxWidth: "140px" }}>
          <input
            type="text"
            className={styles.input}
            placeholder="Badge e.g. Best"
            {...register(`routes.${index}.badge`, { required: true })}
          />
        </div>
      </div>
      <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
        <div className={styles.inputWrap}>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            rows={2}
            placeholder="Route description"
            {...register(`routes.${index}.desc`, { required: true })}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function RetreatAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [s1ImageFile, setS1ImageFile] = useState<File | null>(null);
  const [stripFiles, setStripFiles] = useState<(File | null)[]>([null, null, null]);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "intro" | "schedule" | "blocks" | "why" | "reach"
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

  const statsArray = useFieldArray({ control, name: "s1Stats" });
  const packagesArray = useFieldArray({ control, name: "packages" });
  const overviewArray = useFieldArray({ control, name: "overview" });
  const photoStripArray = useFieldArray({ control, name: "photoStrip" });
  const s3BlocksArray = useFieldArray({ control, name: "s3Blocks" });
  const s4BlocksArray = useFieldArray({ control, name: "s4Blocks" });
  const infoBlocksArray = useFieldArray({ control, name: "infoBlocks" });
  const routesArray = useFieldArray({ control, name: "routes" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/yoga-retreat-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",
          pageTitle: d.pageTitle ?? INITIAL.pageTitle,
          s1Paragraphs: d.s1Paragraphs?.length ? d.s1Paragraphs.map((t: string) => ({ text: t })) : INITIAL.s1Paragraphs,
          s1Stats: d.s1Stats?.length ? d.s1Stats : INITIAL.s1Stats,
          _s1ImagePreview: d.s1Image ? getImageUrl(d.s1Image) : "",
          s1PanelTags: d.s1PanelTags?.length ? d.s1PanelTags.map((t: string) => ({ text: t })) : INITIAL.s1PanelTags,
          s1Caption: d.s1Caption ?? INITIAL.s1Caption,
          s2Title: d.s2Title ?? INITIAL.s2Title,
          s2Intro: d.s2Intro ?? INITIAL.s2Intro,
          packages: d.packages?.length ? d.packages : INITIAL.packages,
          overview: d.overview?.length ? d.overview : INITIAL.overview,
          applyButtonText: d.applyButtonText ?? INITIAL.applyButtonText,
          applyButtonLink: d.applyButtonLink ?? INITIAL.applyButtonLink,
          photoStrip: d.photoStrip?.length
            ? d.photoStrip.map((s: any) => ({ label: s.label, image: s.image, _preview: s.image ? getImageUrl(s.image) : "" }))
            : INITIAL.photoStrip,
          s3Blocks: d.s3Blocks?.length
            ? d.s3Blocks.map((b: any) => ({ ...b, paragraphs: (b.paragraphs || []).map((t: string) => ({ text: t })) }))
            : INITIAL.s3Blocks,
          s4Blocks: d.s4Blocks?.length
            ? d.s4Blocks.map((b: any) => ({ ...b, paragraphs: (b.paragraphs || []).map((t: string) => ({ text: t })) }))
            : INITIAL.s4Blocks,
          infoBlocks: d.infoBlocks?.length
            ? d.infoBlocks.map((b: any) => ({ ...b, paragraphs: (b.paragraphs || []).map((t: string) => ({ text: t })) }))
            : INITIAL.infoBlocks,
          whyChooseText: d.whyChooseText ?? INITIAL.whyChooseText,
          affordableTitle: d.affordableTitle ?? INITIAL.affordableTitle,
          affordableParagraphs: d.affordableParagraphs?.length
            ? d.affordableParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.affordableParagraphs,
          affordableCardTitle: d.affordableCardTitle ?? INITIAL.affordableCardTitle,
          affordableCardSub: d.affordableCardSub ?? INITIAL.affordableCardSub,
          affordableFeatures: d.affordableFeatures?.length
            ? d.affordableFeatures.map((t: string) => ({ text: t }))
            : INITIAL.affordableFeatures,
          reachTitle: d.reachTitle ?? INITIAL.reachTitle,
          reachParagraphs: d.reachParagraphs?.length
            ? d.reachParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.reachParagraphs,
          routes: d.routes?.length ? d.routes : INITIAL.routes,
          bookNowText: d.bookNowText ?? INITIAL.bookNowText,
          bookNowLink: d.bookNowLink ?? INITIAL.bookNowLink,
          paypalText: d.paypalText ?? INITIAL.paypalText,
          paypalLink: d.paypalLink ?? INITIAL.paypalLink,
        });
        setStripFiles((d.photoStrip?.length ? d.photoStrip : INITIAL.photoStrip).map(() => null));
      } catch {
        toast.error("Failed to fetch yoga retreat section data");
        router.replace("/admin/dashboard/yoga-retreat");
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

  /* ── Section 1 image handler ── */
  const handleS1Image = (file: File | null) => {
    if (!file) return;
    setS1ImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setValue("_s1ImagePreview", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Photo strip image handler ── */
  const handleStripImage = (index: number, file: File | null) => {
    if (!file) return;
    setStripFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    const reader = new FileReader();
    reader.onload = (e) => setValue(`photoStrip.${index}._preview`, e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("pageTitle", data.pageTitle);
      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("s1Paragraphs", JSON.stringify(data.s1Paragraphs.map((p) => p.text)));
      formData.append("s1Stats", JSON.stringify(data.s1Stats));
      formData.append("s1PanelTags", JSON.stringify(data.s1PanelTags.map((p) => p.text)));
      formData.append("s1Caption", data.s1Caption);
      formData.append("s2Title", data.s2Title);
      formData.append("s2Intro", data.s2Intro);
      formData.append("packages", JSON.stringify(data.packages));
      formData.append("overview", JSON.stringify(data.overview));
      formData.append("applyButtonText", data.applyButtonText);
      formData.append("applyButtonLink", data.applyButtonLink);
      formData.append(
        "photoStrip",
        JSON.stringify(data.photoStrip.map((s) => ({ label: s.label, image: s.image })))
      );
      formData.append(
        "s3Blocks",
        JSON.stringify(data.s3Blocks.map((b) => ({ ...b, paragraphs: b.paragraphs.map((p) => p.text) })))
      );
      formData.append(
        "s4Blocks",
        JSON.stringify(data.s4Blocks.map((b) => ({ ...b, paragraphs: b.paragraphs.map((p) => p.text) })))
      );
      formData.append(
        "infoBlocks",
        JSON.stringify(data.infoBlocks.map((b) => ({ ...b, paragraphs: b.paragraphs.map((p) => p.text) })))
      );
      formData.append("whyChooseText", data.whyChooseText);
      formData.append("affordableTitle", data.affordableTitle);
      formData.append("affordableParagraphs", JSON.stringify(data.affordableParagraphs.map((p) => p.text)));
      formData.append("affordableCardTitle", data.affordableCardTitle);
      formData.append("affordableCardSub", data.affordableCardSub);
      formData.append("affordableFeatures", JSON.stringify(data.affordableFeatures.map((p) => p.text)));
      formData.append("reachTitle", data.reachTitle);
      formData.append("reachParagraphs", JSON.stringify(data.reachParagraphs.map((p) => p.text)));
      formData.append("routes", JSON.stringify(data.routes));
      formData.append("bookNowText", data.bookNowText);
      formData.append("bookNowLink", data.bookNowLink);
      formData.append("paypalText", data.paypalText);
      formData.append("paypalLink", data.paypalLink);

      if (heroFile) formData.append("heroImage", heroFile);
      if (s1ImageFile) formData.append("s1Image", s1ImageFile);
      stripFiles.forEach((file, i) => {
        if (file) formData.append(`photoStripImage_${i}`, file);
      });

      if (isEdit && sectionId) {
        await api.put(`/yoga-retreat-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/yoga-retreat-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-retreat"), 1500);
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
          <h2 className={styles.successTitle}>Yoga Retreat Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.pageTitle),
    intro: !!(errors.s1Paragraphs || errors.s1Stats || errors.s1PanelTags || errors.s1Caption),
    schedule: !!(errors.s2Title || errors.s2Intro || errors.packages || errors.overview || errors.applyButtonText || errors.applyButtonLink),
    blocks: !!(errors.photoStrip || errors.s3Blocks || errors.s4Blocks || errors.infoBlocks),
    why: !!(errors.whyChooseText || errors.affordableTitle || errors.affordableParagraphs || errors.affordableFeatures),
    reach: !!(errors.reachTitle || errors.reachParagraphs || errors.routes || errors.bookNowText || errors.bookNowLink || errors.paypalText || errors.paypalLink),
  };

  const tabLabels = {
    hero: "① Hero & Title",
    intro: "② Intro Section",
    schedule: "③ Schedule & Pricing",
    blocks: "④ Retreat Blocks",
    why: "⑤ Why Choose",
    reach: "⑥ Reach & Routes",
  };

  const tabOrder = ["hero", "intro", "schedule", "blocks", "why", "reach"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/yoga-retreat" className={styles.breadcrumbLink}>
          Yoga Retreat
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga Retreat Section" : "Add Yoga Retreat Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? "Update hero, intro, pricing, blocks and reach info" : "Fill in every section of the Yoga Retreat page"}
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
                <div className={`${styles.inputWrap} ${errors.pageTitle ? styles.inputError : ""}`}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. The Best Yoga Retreats in Rishikesh, India"
                    {...register("pageTitle", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — INTRO SECTION ══════════ */}
          {activeTab === "intro" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Intro Text</h3>
              </div>

              <ParagraphList control={control} name="s1Paragraphs" label="Intro Paragraphs" max={5} />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Stats Row</h3>
                <span className={styles.sectionBadge}>{statsArray.fields.length}/6</span>
              </div>
              <div className={styles.itemsList}>
                {statsArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "110px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 500+"
                            {...register(`s1Stats.${index}.num`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Happy Students"
                            {...register(`s1Stats.${index}.label`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => statsArray.remove(index)}
                      disabled={statsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {statsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => statsArray.append({ num: "", label: "" })}
                >
                  + Add Stat
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Intro Side Image</label>
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

              <TextItemList
                control={control}
                register={register}
                name="s1PanelTags"
                label="Image Panel Tags"
                placeholder="e.g. Yoga Retreat"
                max={6}
              />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image Caption</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Est. 2010 · Tapovan, Rishikesh · Internationally Accredited"
                    {...register("s1Caption", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — SCHEDULE & PRICING ══════════ */}
          {activeTab === "schedule" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Schedule Section</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Schedule of Best Yoga Retreats in Rishikesh, India"
                    {...register("s2Title", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Intro Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder="Short paragraph before the pricing grid"
                    {...register("s2Intro", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Retreat Packages</h3>
                <span className={styles.sectionBadge}>{packagesArray.fields.length}/12</span>
              </div>
              <div className={styles.itemsList}>
                {packagesArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 7 Days Yoga Retreat in Rishikesh"
                            {...register(`packages.${index}.title`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ maxWidth: "220px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. 175 USD / 14,000 INR"
                            {...register(`packages.${index}.price`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => packagesArray.remove(index)}
                      disabled={packagesArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {packagesArray.fields.length < 12 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => packagesArray.append({ title: "", price: "" })}
                >
                  + Add Package
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Overview Items</h3>
                <span className={styles.sectionBadge}>{overviewArray.fields.length}/10</span>
              </div>
              <div className={styles.itemsList}>
                {overviewArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <span className={styles.itemIndex}>#</span>
                    <div className={styles.itemFields}>
                      <div className={styles.itemFieldsRow}>
                        <div className={styles.inputWrap} style={{ maxWidth: "220px" }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Level"
                            {...register(`overview.${index}.label`, { required: true })}
                          />
                        </div>
                        <div className={styles.inputWrap} style={{ flex: 1 }}>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Beginner to Advance."
                            {...register(`overview.${index}.value`, { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => overviewArray.remove(index)}
                      disabled={overviewArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {overviewArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => overviewArray.append({ label: "", value: "" })}
                >
                  + Add Overview Item
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>Apply Now Button</h3>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Button Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Apply Now"
                      {...register("applyButtonText", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Button Link</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. /yoga-registration"
                      {...register("applyButtonLink", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — RETREAT BLOCKS ══════════ */}
          {activeTab === "blocks" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Photo Strip</h3>
                <span className={styles.sectionBadge}>{photoStripArray.fields.length}/4</span>
              </div>
              <div className={styles.itemsList}>
                {photoStripArray.fields.map((field, index) => (
                  <div key={field.id} className={styles.itemRow}>
                    <div className={styles.itemThumbInputWrap}>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.itemThumbInput}
                        onChange={(e) => handleStripImage(index, e.target.files?.[0] || null)}
                      />
                      {watchAll.photoStrip?.[index]?._preview ? (
                        <img src={watchAll.photoStrip[index]._preview} alt="" className={styles.itemThumb} />
                      ) : (
                        <div className={styles.itemThumbEmpty}>📷</div>
                      )}
                    </div>
                    <div className={styles.itemFields}>
                      <div className={styles.inputWrap}>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder="e.g. Morning Practice"
                          {...register(`photoStrip.${index}.label`, { required: true })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      onClick={() => photoStripArray.remove(index)}
                      disabled={photoStripArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {photoStripArray.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => {
                    photoStripArray.append({ label: "" });
                    setStripFiles((prev) => [...prev, null]);
                  }}
                >
                  + Add Photo
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Short-Stay Blocks (3–7 Days)</h3>
                <span className={styles.sectionBadge}>{s3BlocksArray.fields.length}/4</span>
              </div>
              {s3BlocksArray.fields.map((field, index) => (
                <ContentBlockFields
                  key={field.id}
                  control={control}
                  register={register}
                  name="s3Blocks"
                  index={index}
                  onRemove={() => s3BlocksArray.remove(index)}
                  canRemove={s3BlocksArray.fields.length > 1}
                />
              ))}
              {s3BlocksArray.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    s3BlocksArray.append({ title: "", paragraphs: [{ text: "" }], priceFrom: "", priceNote: "" })
                  }
                >
                  + Add Block
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Long-Stay Blocks (7–14 Days)</h3>
                <span className={styles.sectionBadge}>{s4BlocksArray.fields.length}/4</span>
              </div>
              {s4BlocksArray.fields.map((field, index) => (
                <ContentBlockFields
                  key={field.id}
                  control={control}
                  register={register}
                  name="s4Blocks"
                  index={index}
                  onRemove={() => s4BlocksArray.remove(index)}
                  canRemove={s4BlocksArray.fields.length > 1}
                />
              ))}
              {s4BlocksArray.fields.length < 4 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    s4BlocksArray.append({ title: "", paragraphs: [{ text: "" }], priceFrom: "", priceNote: "" })
                  }
                >
                  + Add Block
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Info Blocks (Schedule / Booking / Refund)</h3>
                <span className={styles.sectionBadge}>{infoBlocksArray.fields.length}/6</span>
              </div>
              {infoBlocksArray.fields.map((field, index) => (
                <InfoBlockFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={index}
                  onRemove={() => infoBlocksArray.remove(index)}
                  canRemove={infoBlocksArray.fields.length > 1}
                />
              ))}
              {infoBlocksArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => infoBlocksArray.append({ title: "", paragraphs: [{ text: "" }] })}
                >
                  + Add Info Block
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 5 — WHY CHOOSE / AFFORDABLE ══════════ */}
          {activeTab === "why" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Divider Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Why Choose AYM"
                    {...register("whyChooseText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Affordable Block</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Affordable Yoga Retreats in Rishikesh"
                    {...register("affordableTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="affordableParagraphs" label="Affordable Paragraphs" max={5} />

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Card Title</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. What Makes AYM Special"
                      {...register("affordableCardTitle", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Card Subtitle</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Our Highlights"
                      {...register("affordableCardSub", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="affordableFeatures"
                label="Highlight Features"
                placeholder="e.g. Highly qualified & experienced teachers"
                max={10}
              />
            </div>
          )}

          {/* ══════════ TAB 6 — REACH & ROUTES ══════════ */}
          {activeTab === "reach" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. How Can You Reach AYM Yoga School for Yoga Retreats in Rishikesh?"
                    {...register("reachTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="reachParagraphs" label="Reach Paragraphs" max={5} />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.72rem" }}>CTA Buttons</h3>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Book Now Button Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Yoga Retreats — Book Now"
                      {...register("bookNowText", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Book Now Button Link</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. /yoga-registration"
                      {...register("bookNowLink", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>PayPal Button Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. PayPal"
                      {...register("paypalText", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>PayPal Button Link</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. /200-hour-yoga-ttc-fees"
                      {...register("paypalLink", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Route Cards</h3>
                <span className={styles.sectionBadge}>{routesArray.fields.length}/6</span>
              </div>
              {routesArray.fields.map((field, index) => (
                <RouteFields
                  key={field.id}
                  register={register}
                  index={index}
                  onRemove={() => routesArray.remove(index)}
                  canRemove={routesArray.fields.length > 1}
                />
              ))}
              {routesArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => routesArray.append({ icon: "🚗", title: "", badge: "", desc: "" })}
                >
                  + Add Route
                </button>
              )}
            </div>
          )}

          <div className={styles.formDivider} />

          {/* Form Actions */}
          <div className={styles.formActions}>
            <Link href="/admin/dashboard/yoga-retreat" className={styles.cancelBtn}>
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
              {activeTab !== "reach" ? (
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