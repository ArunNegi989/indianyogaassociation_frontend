"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Soundhealingadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface TextItem {
  text: string;
}
interface LevelItem {
  title: string;
  items: TextItem[];
}
interface BenCardItem {
  icon: string;
  title: string;
  text: string;
}
interface ExpectCardItem {
  icon: string;
  label: string;
  text: string;
}
interface WhyCardItem {
  n: string;
  title: string;
  text: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Intro section
  introTitle: string;
  introParagraphs: TextItem[];
  introSignatureText: string;
  introImageAlt: string;
  _introImagePreview?: string;
  introImageBadge: string;

  // What is Sound Healing section
  whatIsTitle: string;
  whatIsIntro: string;
  levels: LevelItem[];
  bowl1Alt: string;
  _bowl1Preview?: string;
  bowl2Alt: string;
  _bowl2Preview?: string;
  bowl3Alt: string;
  _bowl3Preview?: string;

  // Aim section
  aimEyebrow: string;
  aimTitle: string;
  aimParagraphs: TextItem[];
  pillsLabel: string;
  pills: TextItem[];
  aimImageAlt: string;
  _aimImagePreview?: string;
  aimImageBadge: string;
  aimQuoteText: string;
  aimQuoteAttribution: string;

  // Benefits section
  benefitsTitle: string;
  benefitsIntro: string;
  benCards: BenCardItem[];
  benefitsImageAlt: string;
  _benefitsImagePreview?: string;

  // Expect section
  expectTitle: string;
  expectIntro: string;
  expectCards: ExpectCardItem[];
  instrLabel: string;
  instruments: TextItem[];

  // Why join + cert banner
  whyJoinTitle: string;
  whyCards: WhyCardItem[];
  certBannerIcon: string;
  certBannerText: string;

  // Batch section intro (heading only — seat grid stays API-driven)
  batchSectionTag: string;
  batchSectionTitle: string;
  batchSectionSub: string;
}

const INITIAL: FormData = {
  heroImageAlt: "Singing bowl on mandala cloth",

  introTitle: "Best Sound Healing Therapy Training Courses in Rishikesh, India",
  introParagraphs: [
    {
      text: "Are you someone looking for inner peace? Every person has a unique path they take to find the inner peace where their true selves reside. The sound healing course is the best solution for you. At AYM yoga school, we are the best centers that help you learn the best yoga sound healing. Be it self-realization or spiritual explorations. Sound healing yoga courses are a way of adding life to your lifestyle. Therefore, today sound healing is the growing trend used for healing.",
    },
    {
      text: "Sound healing works on the principle of vibration and frequency, helping to restore balance within the body and mind. Through the use of instruments like singing bowls, gongs, and मंत्र (mantras), this practice allows you to release stress, calm your nervous system, and experience deep relaxation. At AYM Yoga School, our sound healing course is designed to guide you step-by-step, whether you are a beginner or someone looking to deepen your spiritual journey. By the end of the course, you not only understand the science behind sound but also learn how to use it as a powerful tool for personal healing and transformation.",
    },
  ],
  introSignatureText: "Heal through vibrations",
  introImageAlt: "Sound healing with singing bowls",
  introImageBadge: "Vibrational Healing",

  whatIsTitle: "What is a Sound Healing Course?",
  whatIsIntro:
    "Sound healing is a process that helps in releasing stress from the body. It has been demonstrated to be a successful process as this approach makes it simple to remove toxins from the body. The sound healing course relies on vibrational effects to reduce physical and mental stress. Overall, it profoundly affects a person's body and soul in addition to restoring mental equilibrium.",
  levels: [
    {
      title: "Level 1 — 2 Days · 3 Hours/Day",
      items: [
        { text: "Introduction & History of Sound Healing." },
        { text: "How to play the bowls." },
        { text: "Intro Drum Stick, Leather sticks & getting Creative with Sounds." },
        { text: "Intensity of Sound." },
        { text: "Charged water therapy." },
        { text: "Tingsha Aura Cleansing." },
        { text: "Bowl notes, Chakra notes." },
        { text: "Metals used and benefits." },
        { text: "Planet Connection." },
      ],
    },
    {
      title: "Level 2 — 3 Days · 3 Hours/Day",
      items: [
        { text: "Understanding Signals of body." },
        { text: "Sound Healing with intensity." },
        { text: "Group Healing Session." },
        { text: "Hot water Massage." },
        { text: "Stick Massage." },
        { text: "Sounds on herbs & Potli Sound." },
      ],
    },
    {
      title: "Level 3 — 5 Days · 3 Hours/Day",
      items: [
        { text: "Chakra theory & 5 body element." },
        { text: "Chakra balancing." },
        { text: "Diseases therapies." },
        { text: "Body Sound Massage." },
        { text: "Distance Healing." },
        { text: "Gong Therapy, Happy Pan, Rain stick, Shamanic Drum." },
        { text: "Herb information." },
        { text: "Brain Wave theory." },
        { text: "Nada Yoga." },
      ],
    },
  ],
  bowl1Alt: "Singing bowls arrangement",
  bowl2Alt: "Sound healing session",
  bowl3Alt: "Tibetan singing bowls",

  aimEyebrow: "AYM · Rishikesh",
  aimTitle: "What Does Sound Healing Aim at?",
  aimParagraphs: [
    {
      text: "Stress is a major reason behind every toxicity and negativity. And this is what yoga sound healing course aims at. It helps in improving the health and well-being of a person. Used over the years, it has successfully achieved a place in the modern industry.",
    },
    {
      text: "Sound healing aims to restore the body's natural frequencies and to cure humanity. Therefore, keeping in mind the well-being of humans and how badly stress can affect their lives, we at AYM have come up with a sound healing course in Rishikesh.",
    },
    {
      text: "This course not only focuses on healing others but also encourages deep personal transformation within yourself. As you progress, you begin to notice a shift in your emotional balance, mental clarity, and overall energy levels. The structured practices and guided sessions at AYM Yoga School help you develop a strong connection between mind, body, and soul. With consistent practice, sound healing becomes more than just a technique—it turns into a lifestyle that supports inner harmony, mindfulness, and lasting peace.",
    },
  ],
  pillsLabel: "What it restores",
  pills: [
    { text: "Natural Frequencies" },
    { text: "Mental Equilibrium" },
    { text: "Chakra Alignment" },
    { text: "Stress Release" },
    { text: "Spiritual Clarity" },
    { text: "Emotional Balance" },
    { text: "Inner Peace" },
  ],
  aimImageAlt: "Sound healing bowl",
  aimImageBadge: "Singing Bowl Therapy",
  aimQuoteText:
    "Sound is the medicine of the future — it works at the cellular level to restore what stress quietly takes away.",
  aimQuoteAttribution: "— Ancient Vedic Wisdom",

  benefitsTitle: "What are the Benefits of a Sound Healing Course?",
  benefitsIntro:
    "Why is sound healing so popular among youths? Sound healing has been growing, especially because of the benefits it offers — physical, mental, and emotional. Here are the most highly recognised benefits of our Sound Healing Courses in Rishikesh:",
  benCards: [
    { icon: "🧘", title: "Relaxing", text: "One of the greatest benefits of sound healing is deep relaxation. The noises penetrate our system, which as a result, helps in restoring it to balance." },
    { icon: "✨", title: "Eliminates Energetic Blockages", text: "The music's vibrations heal, open, clear, and balance the chakras before releasing trapped energy — acting as a deep tissue massage for the soul." },
    { icon: "🌿", title: "Improves Lifestyle", text: "Be it depression, anxiety, or tension — all are decreased by sound healing. It restores mental equilibrium and clarity, resulting in a greater sensation of well-being." },
    { icon: "❤️", title: "Improves Health", text: "From better sleep and lowered cholesterol to a decrease in chronic pain, blood pressure, and a lower risk of heart disease — all improved with sound healing." },
  ],
  benefitsImageAlt: "Sound healing teacher with bowls",

  expectTitle: "What can you Expect at AYM for Sound Healing Teacher Training Course?",
  expectIntro:
    "When looking for the best sound healing training course, you'll surely come across the Association for Yoga and Meditation. Whether you have past experience or are new in this field, you can acquire full knowledge and different forms of sound healing training courses. We place a lot of emphasis during training sessions on students deepening their own practice — cultivating skills and helping you create your distinctive teaching methods.",
  expectCards: [
    { icon: "🎓", label: "All Levels Welcome", text: "Beginners and experienced practitioners alike — complete knowledge from ground up." },
    { icon: "🧑‍🏫", label: "Expert Teachers", text: "Highly skilled, reputed instructors trained to teach in the most effective, friendly environment." },
    { icon: "📋", label: "Self-Assessment Skills", text: "Develop self-deepened evaluation and the ability to gauge your own instructional effectiveness." },
    { icon: "🍽️", label: "Meals & Amenities", text: "Top-notch meals and comfortable amenities available at an additional cost." },
    { icon: "📅", label: "Flexible Programs", text: "3-day and 7-day programs that fit your schedule and deepen your practice at your pace." },
    { icon: "🏔️", label: "Rishikesh Setting", text: "Learn in the spiritual capital of yoga, surrounded by the Himalayas and the sacred Ganges." },
  ],
  instrLabel: "Instruments & Therapies You Will Learn",
  instruments: [
    { text: "Singing Bowls" },
    { text: "Gong Therapy" },
    { text: "Shamanic Drum" },
    { text: "Tingsha" },
    { text: "Happy Pan" },
    { text: "Rain Stick" },
    { text: "Sound Baths" },
    { text: "Magnets" },
    { text: "Nada Yoga" },
    { text: "Brain Wave Theory" },
  ],

  whyJoinTitle: "Why Should You Join AYM?",
  whyCards: [
    { n: "01", title: "Licensed Courses", text: "We offer licensed sound healing yoga training courses recognised internationally, at highly affordable prices." },
    { n: "02", title: "Yoga Alliance Certified", text: "Graduates receive a Yoga Alliance, USA certificate — globally recognised and career-defining." },
    { n: "03", title: "Start Teaching Immediately", text: "Our certification lets you begin your own teaching journey the moment your course ends." },
    { n: "04", title: "Best Choice for Students", text: "Among the many YTT centres in Rishikesh, AYM stands apart for its quality, care, and community." },
  ],
  certBannerIcon: "🏅",
  certBannerText:
    "Students who successfully complete the <strong>sound healing certification program</strong> will receive a certificate from <strong>Yoga Alliance, USA</strong> — helping you start your own journey immediately after course completion.",

  batchSectionTag: "Upcoming Batches · 2026–2027",
  batchSectionTitle: "Sound Healing Teacher Training India",
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

/* ─────────────────────── Reusable: plain-text repeatable list (pills / instruments) ─────────────────────── */
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

/* ─────────────────────── Reusable: one level (title + list of items) ─────────────────────── */
function LevelFields({
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
  const itemsArray = useFieldArray({ control, name: `levels.${index}.items` });

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Level #{index + 1}</span>
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
        <label className={styles.label}>Level Title</label>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Level 1 — 2 Days · 3 Hours/Day"
            {...register(`levels.${index}.title`, { required: "Required" })}
          />
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Level Items</h3>
        <span className={styles.sectionBadge}>{itemsArray.fields.length}/15</span>
      </div>
      <div className={styles.itemsList}>
        {itemsArray.fields.map((field, i) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{i + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Introduction & History of Sound Healing."
                  {...register(`levels.${index}.items.${i}.text`, { required: true })}
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.removeItemBtn}
              onClick={() => itemsArray.remove(i)}
              disabled={itemsArray.fields.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {itemsArray.fields.length < 15 && (
        <button type="button" className={styles.addBtn} onClick={() => itemsArray.append({ text: "" })}>
          + Add Item
        </button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function SoundHealingAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [introImageFile, setIntroImageFile] = useState<File | null>(null);
  const [bowl1File, setBowl1File] = useState<File | null>(null);
  const [bowl2File, setBowl2File] = useState<File | null>(null);
  const [bowl3File, setBowl3File] = useState<File | null>(null);
  const [aimImageFile, setAimImageFile] = useState<File | null>(null);
  const [benefitsImageFile, setBenefitsImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "intro" | "whatis" | "aim" | "benefits" | "expect" | "batchintro"
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

  const levelsArray = useFieldArray({ control, name: "levels" });
  const benCardsArray = useFieldArray({ control, name: "benCards" });
  const expectCardsArray = useFieldArray({ control, name: "expectCards" });
  const whyCardsArray = useFieldArray({ control, name: "whyCards" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/sound-healing-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",

          introTitle: d.introTitle ?? INITIAL.introTitle,
          introParagraphs: d.introParagraphs?.length
            ? d.introParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.introParagraphs,
          introSignatureText: d.introSignatureText ?? INITIAL.introSignatureText,
          introImageAlt: d.introImageAlt ?? INITIAL.introImageAlt,
          _introImagePreview: d.introImage ? getImageUrl(d.introImage) : "",
          introImageBadge: d.introImageBadge ?? INITIAL.introImageBadge,

          whatIsTitle: d.whatIsTitle ?? INITIAL.whatIsTitle,
          whatIsIntro: d.whatIsIntro ?? INITIAL.whatIsIntro,
          levels: d.levels?.length
            ? d.levels.map((l: any) => ({ title: l.title, items: (l.items || []).map((t: string) => ({ text: t })) }))
            : INITIAL.levels,
          bowl1Alt: d.bowl1Alt ?? INITIAL.bowl1Alt,
          _bowl1Preview: d.bowl1Image ? getImageUrl(d.bowl1Image) : "",
          bowl2Alt: d.bowl2Alt ?? INITIAL.bowl2Alt,
          _bowl2Preview: d.bowl2Image ? getImageUrl(d.bowl2Image) : "",
          bowl3Alt: d.bowl3Alt ?? INITIAL.bowl3Alt,
          _bowl3Preview: d.bowl3Image ? getImageUrl(d.bowl3Image) : "",

          aimEyebrow: d.aimEyebrow ?? INITIAL.aimEyebrow,
          aimTitle: d.aimTitle ?? INITIAL.aimTitle,
          aimParagraphs: d.aimParagraphs?.length
            ? d.aimParagraphs.map((t: string) => ({ text: t }))
            : INITIAL.aimParagraphs,
          pillsLabel: d.pillsLabel ?? INITIAL.pillsLabel,
          pills: d.pills?.length ? d.pills.map((t: string) => ({ text: t })) : INITIAL.pills,
          aimImageAlt: d.aimImageAlt ?? INITIAL.aimImageAlt,
          _aimImagePreview: d.aimImage ? getImageUrl(d.aimImage) : "",
          aimImageBadge: d.aimImageBadge ?? INITIAL.aimImageBadge,
          aimQuoteText: d.aimQuoteText ?? INITIAL.aimQuoteText,
          aimQuoteAttribution: d.aimQuoteAttribution ?? INITIAL.aimQuoteAttribution,

          benefitsTitle: d.benefitsTitle ?? INITIAL.benefitsTitle,
          benefitsIntro: d.benefitsIntro ?? INITIAL.benefitsIntro,
          benCards: d.benCards?.length ? d.benCards : INITIAL.benCards,
          benefitsImageAlt: d.benefitsImageAlt ?? INITIAL.benefitsImageAlt,
          _benefitsImagePreview: d.benefitsImage ? getImageUrl(d.benefitsImage) : "",

          expectTitle: d.expectTitle ?? INITIAL.expectTitle,
          expectIntro: d.expectIntro ?? INITIAL.expectIntro,
          expectCards: d.expectCards?.length ? d.expectCards : INITIAL.expectCards,
          instrLabel: d.instrLabel ?? INITIAL.instrLabel,
          instruments: d.instruments?.length
            ? d.instruments.map((t: string) => ({ text: t }))
            : INITIAL.instruments,

          whyJoinTitle: d.whyJoinTitle ?? INITIAL.whyJoinTitle,
          whyCards: d.whyCards?.length ? d.whyCards : INITIAL.whyCards,
          certBannerIcon: d.certBannerIcon ?? INITIAL.certBannerIcon,
          certBannerText: d.certBannerText ?? INITIAL.certBannerText,

          batchSectionTag: d.batchSectionTag ?? INITIAL.batchSectionTag,
          batchSectionTitle: d.batchSectionTitle ?? INITIAL.batchSectionTitle,
          batchSectionSub: d.batchSectionSub ?? INITIAL.batchSectionSub,
        });
      } catch {
        toast.error("Failed to fetch sound healing section data");
        router.replace("/admin/dashboard/sound-healing-course/sound-healing-content");
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
  const handleIntroImage = makeImageHandler(setIntroImageFile, "_introImagePreview");
  const handleBowl1Image = makeImageHandler(setBowl1File, "_bowl1Preview");
  const handleBowl2Image = makeImageHandler(setBowl2File, "_bowl2Preview");
  const handleBowl3Image = makeImageHandler(setBowl3File, "_bowl3Preview");
  const handleAimImage = makeImageHandler(setAimImageFile, "_aimImagePreview");
  const handleBenefitsImage = makeImageHandler(setBenefitsImageFile, "_benefitsImagePreview");

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);

      formData.append("introTitle", data.introTitle);
      formData.append("introParagraphs", JSON.stringify(data.introParagraphs.map((p) => p.text)));
      formData.append("introSignatureText", data.introSignatureText);
      formData.append("introImageAlt", data.introImageAlt);
      formData.append("introImageBadge", data.introImageBadge);

      formData.append("whatIsTitle", data.whatIsTitle);
      formData.append("whatIsIntro", data.whatIsIntro);
      formData.append(
        "levels",
        JSON.stringify(data.levels.map((l) => ({ title: l.title, items: l.items.map((it) => it.text) })))
      );
      formData.append("bowl1Alt", data.bowl1Alt);
      formData.append("bowl2Alt", data.bowl2Alt);
      formData.append("bowl3Alt", data.bowl3Alt);

      formData.append("aimEyebrow", data.aimEyebrow);
      formData.append("aimTitle", data.aimTitle);
      formData.append("aimParagraphs", JSON.stringify(data.aimParagraphs.map((p) => p.text)));
      formData.append("pillsLabel", data.pillsLabel);
      formData.append("pills", JSON.stringify(data.pills.map((p) => p.text)));
      formData.append("aimImageAlt", data.aimImageAlt);
      formData.append("aimImageBadge", data.aimImageBadge);
      formData.append("aimQuoteText", data.aimQuoteText);
      formData.append("aimQuoteAttribution", data.aimQuoteAttribution);

      formData.append("benefitsTitle", data.benefitsTitle);
      formData.append("benefitsIntro", data.benefitsIntro);
      formData.append("benCards", JSON.stringify(data.benCards));
      formData.append("benefitsImageAlt", data.benefitsImageAlt);

      formData.append("expectTitle", data.expectTitle);
      formData.append("expectIntro", data.expectIntro);
      formData.append("expectCards", JSON.stringify(data.expectCards));
      formData.append("instrLabel", data.instrLabel);
      formData.append("instruments", JSON.stringify(data.instruments.map((p) => p.text)));

      formData.append("whyJoinTitle", data.whyJoinTitle);
      formData.append("whyCards", JSON.stringify(data.whyCards));
      formData.append("certBannerIcon", data.certBannerIcon);
      formData.append("certBannerText", data.certBannerText);

      formData.append("batchSectionTag", data.batchSectionTag);
      formData.append("batchSectionTitle", data.batchSectionTitle);
      formData.append("batchSectionSub", data.batchSectionSub);

      if (heroFile) formData.append("heroImage", heroFile);
      if (introImageFile) formData.append("introImage", introImageFile);
      if (bowl1File) formData.append("bowl1Image", bowl1File);
      if (bowl2File) formData.append("bowl2Image", bowl2File);
      if (bowl3File) formData.append("bowl3Image", bowl3File);
      if (aimImageFile) formData.append("aimImage", aimImageFile);
      if (benefitsImageFile) formData.append("benefitsImage", benefitsImageFile);

      if (isEdit && sectionId) {
        await api.put(`/sound-healing-section/${sectionId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/sound-healing-section", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/sound-healing-course/sound-healing-content"), 1500);
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
          <h2 className={styles.successTitle}>Sound Healing Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!errors.heroImageAlt,
    intro: !!(errors.introTitle || errors.introParagraphs || errors.introSignatureText || errors.introImageAlt || errors.introImageBadge),
    whatis: !!(errors.whatIsTitle || errors.whatIsIntro || errors.levels || errors.bowl1Alt || errors.bowl2Alt || errors.bowl3Alt),
    aim: !!(errors.aimTitle || errors.aimParagraphs || errors.pills || errors.aimImageAlt || errors.aimQuoteText),
    benefits: !!(errors.benefitsTitle || errors.benefitsIntro || errors.benCards || errors.benefitsImageAlt),
    expect: !!(errors.expectTitle || errors.expectIntro || errors.expectCards || errors.instruments || errors.whyJoinTitle || errors.whyCards || errors.certBannerText),
    batchintro: !!(errors.batchSectionTag || errors.batchSectionTitle || errors.batchSectionSub),
  };

  const tabLabels = {
    hero: "① Hero Image",
    intro: "② Intro",
    whatis: "③ What Is (Levels)",
    aim: "④ Aim Section",
    benefits: "⑤ Benefits",
    expect: "⑥ Expect / Why Join",
    batchintro: "⑦ Batch Section Intro",
  };

  const tabOrder = ["hero", "intro", "whatis", "aim", "benefits", "expect", "batchintro"] as const;

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/admin/dashboard/sound-healing-course/sound-healing-content" className={styles.breadcrumbLink}>
          Sound Healing
        </Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Sound Healing Section" : "Add Sound Healing Section"}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit
            ? "Update hero, intro, levels, aim, benefits and expect content"
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
          {/* ══════════ TAB 1 — HERO IMAGE ══════════ */}
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
                      <span className={styles.uploadIcon}>🎐</span>
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
                    placeholder="e.g. Singing bowl on mandala cloth"
                    {...register("heroImageAlt", { required: "Alt text is required" })}
                  />
                </div>
                {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
              </div>
            </div>
          )}

          {/* ══════════ TAB 2 — INTRO ══════════ */}
          {activeTab === "intro" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Best Sound Healing Therapy Training Courses in Rishikesh, India"
                    {...register("introTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <ParagraphList control={control} name="introParagraphs" label="Intro Paragraphs" max={5} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Signature Text</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Heal through vibrations"
                    {...register("introSignatureText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Intro Side Image</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleIntroImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._introImagePreview ? (
                    <img src={watchAll._introImagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
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
                      placeholder="e.g. Sound healing with singing bowls"
                      {...register("introImageAlt", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Vibrational Healing"
                      {...register("introImageBadge", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — WHAT IS (LEVELS) ══════════ */}
          {activeTab === "whatis" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. What is a Sound Healing Course?"
                    {...register("whatIsTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="whatIsIntro" label="Intro Paragraph" />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Level Cards</h3>
                <span className={styles.sectionBadge}>{levelsArray.fields.length}/6</span>
              </div>
              {levelsArray.fields.map((field, index) => (
                <LevelFields
                  key={field.id}
                  control={control}
                  register={register}
                  index={index}
                  onRemove={() => levelsArray.remove(index)}
                  canRemove={levelsArray.fields.length > 1}
                />
              ))}
              {levelsArray.fields.length < 6 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => levelsArray.append({ title: "", items: [{ text: "" }] })}
                >
                  + Add Level
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Three-Photo Row</h3>
              </div>

              <div className={styles.threeCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Photo 1</label>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleBowl1Image(e.target.files?.[0] || null)}
                    />
                    {watchAll._bowl1Preview ? (
                      <img src={watchAll._bowl1Preview} alt="preview" className={styles.imgPreview} />
                    ) : (
                      <span className={styles.uploadIcon}>📷</span>
                    )}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Alt text"
                      {...register("bowl1Alt", { required: true })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Photo 2</label>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleBowl2Image(e.target.files?.[0] || null)}
                    />
                    {watchAll._bowl2Preview ? (
                      <img src={watchAll._bowl2Preview} alt="preview" className={styles.imgPreview} />
                    ) : (
                      <span className={styles.uploadIcon}>📷</span>
                    )}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Alt text"
                      {...register("bowl2Alt", { required: true })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Photo 3</label>
                  <label className={styles.uploadArea}>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => handleBowl3Image(e.target.files?.[0] || null)}
                    />
                    {watchAll._bowl3Preview ? (
                      <img src={watchAll._bowl3Preview} alt="preview" className={styles.imgPreview} />
                    ) : (
                      <span className={styles.uploadIcon}>📷</span>
                    )}
                  </label>
                  <div className={styles.inputWrap} style={{ marginTop: "0.5rem" }}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Alt text"
                      {...register("bowl3Alt", { required: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 4 — AIM SECTION ══════════ */}
          {activeTab === "aim" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eyebrow Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. AYM · Rishikesh"
                      {...register("aimEyebrow", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title (H2)</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. What Does Sound Healing Aim at?"
                      {...register("aimTitle", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <ParagraphList control={control} name="aimParagraphs" label="Aim Paragraphs" max={5} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Pills Label</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. What it restores"
                    {...register("pillsLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="pills"
                label="Pills"
                placeholder="e.g. Natural Frequencies"
                max={12}
              />

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Right Side Image &amp; Quote</h3>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleAimImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._aimImagePreview ? (
                    <img src={watchAll._aimImagePreview} alt="preview" className={styles.imgPreview} />
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>🖼️</span>
                      <span className={styles.uploadText}>Click to upload or drag &amp; drop</span>
                      <span className={styles.uploadSubtext}>JPG, PNG, WEBP — max 5MB</span>
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
                      placeholder="e.g. Sound healing bowl"
                      {...register("aimImageAlt", { required: "Required" })}
                    />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="e.g. Singing Bowl Therapy"
                      {...register("aimImageBadge", { required: "Required" })}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Quote Text</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. Sound is the medicine of the future..."
                    {...register("aimQuoteText", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Quote Attribution</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. — Ancient Vedic Wisdom"
                    {...register("aimQuoteAttribution", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 5 — BENEFITS ══════════ */}
          {activeTab === "benefits" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. What are the Benefits of a Sound Healing Course?"
                    {...register("benefitsTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="benefitsIntro" label="Intro Paragraph" />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Benefit Cards</h3>
                <span className={styles.sectionBadge}>{benCardsArray.fields.length}/8</span>
              </div>
              {benCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Benefit #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => benCardsArray.remove(index)}
                      disabled={benCardsArray.fields.length <= 1}
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
                        {...register(`benCards.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Relaxing"
                        {...register(`benCards.${index}.title`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Benefit description"
                        {...register(`benCards.${index}.text`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {benCardsArray.fields.length < 8 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => benCardsArray.append({ icon: "✦", title: "", text: "" })}
                >
                  + Add Benefit
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Side Image</label>
                <label className={styles.uploadArea}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => handleBenefitsImage(e.target.files?.[0] || null)}
                  />
                  {watchAll._benefitsImagePreview ? (
                    <img src={watchAll._benefitsImagePreview} alt="preview" className={styles.imgPreview} />
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
                    placeholder="e.g. Sound healing teacher with bowls"
                    {...register("benefitsImageAlt", { required: "Required" })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 6 — EXPECT / WHY JOIN ══════════ */}
          {activeTab === "expect" && (
            <div className={styles.sectionBlock}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title (H2)</label>
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    rows={2}
                    placeholder="e.g. What can you Expect at AYM for Sound Healing Teacher Training Course?"
                    {...register("expectTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <RichTextField control={control} name="expectIntro" label="Intro Paragraph" />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Expect Cards</h3>
                <span className={styles.sectionBadge}>{expectCardsArray.fields.length}/10</span>
              </div>
              {expectCardsArray.fields.map((field, index) => (
                <div key={field.id} className={styles.nestedCard}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardBadge}>Card #{index + 1}</span>
                    <button
                      type="button"
                      className={styles.removeItemBtn}
                      style={{ marginLeft: "auto" }}
                      onClick={() => expectCardsArray.remove(index)}
                      disabled={expectCardsArray.fields.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                  <div className={styles.itemFieldsRow}>
                    <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="🎓"
                        {...register(`expectCards.${index}.icon`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. All Levels Welcome"
                        {...register(`expectCards.${index}.label`, { required: true })}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea}`}
                        rows={2}
                        placeholder="Card description"
                        {...register(`expectCards.${index}.text`, { required: true })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {expectCardsArray.fields.length < 10 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => expectCardsArray.append({ icon: "✦", label: "", text: "" })}
                >
                  + Add Card
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Instruments Label</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Instruments & Therapies You Will Learn"
                    {...register("instrLabel", { required: "Required" })}
                  />
                </div>
              </div>

              <TextItemList
                control={control}
                register={register}
                name="instruments"
                label="Instruments / Therapies"
                placeholder="e.g. Singing Bowls"
                max={16}
              />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>"Why Should You Join AYM?" Title</label>
                <div className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Why Should You Join AYM?"
                    {...register("whyJoinTitle", { required: "Required" })}
                  />
                </div>
              </div>

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Why-Join Cards</h3>
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
                    <div className={styles.inputWrap} style={{ maxWidth: "90px" }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="01"
                        {...register(`whyCards.${index}.n`, { required: true })}
                      />
                    </div>
                    <div className={styles.inputWrap} style={{ flex: 1 }}>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="e.g. Licensed Courses"
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
                  onClick={() =>
                    whyCardsArray.append({ n: String(whyCardsArray.fields.length + 1).padStart(2, "0"), title: "", text: "" })
                  }
                >
                  + Add Card
                </button>
              )}

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>✦</span>
                <h3 className={styles.sectionTitle}>Certificate Banner</h3>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Badge Icon</label>
                <div className={styles.inputWrap} style={{ maxWidth: "120px" }}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="🏅"
                    {...register("certBannerIcon", { required: true })}
                  />
                </div>
              </div>
              <RichTextField control={control} name="certBannerText" label="Banner Text" />
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
                    placeholder="e.g. Sound Healing Teacher Training India"
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
            <Link href="/admin/dashboard/sound-healing-course/sound-healing-content" className={styles.cancelBtn}>
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