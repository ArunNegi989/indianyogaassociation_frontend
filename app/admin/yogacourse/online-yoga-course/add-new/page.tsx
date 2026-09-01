"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../Onlinecourseadmin.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────── Types ─────────────────────── */
interface ParagraphItem { text: string }
interface StringItem { text: string }
interface IconTextItem { icon: string; title: string; desc: string }
interface CourseCardItem {
  title: string; duration: string; style: string; sessions: string; cert: string; fee: string;
  benefits: StringItem[];
  applyBtnText: string;
  bookBtnText: string;
}
interface FaqItem { q: string; a: string }
interface CurriculumItem {
  title: string; symbol: string; color: string; lines: StringItem[];
  preview?: string; file?: File; existingUrl?: string;
}
interface RecordedCourseItem {
  title: string; price: string; features: StringItem[];
  applyBtnText: string;
}
interface InfoBlockItem { heading: string; paragraphs: ParagraphItem[] }
interface OtherCourseItem {
  title: string; hours: string; price: string;
  preview?: string; file?: File; existingUrl?: string;
  enquireBtnText: string;
}

interface FormData {
  // Hero
  heroImageAlt: string;
  _heroPreview?: string;

  // Intro
  introEyebrow: string;
  introTitle: string;
  introParagraphs: ParagraphItem[];

  // Why Choose
  whyEyebrow: string;
  whyTitle: string;
  whyReasons: IconTextItem[];
  whyImageAlt: string;
  _whyImagePreview?: string;
  whyImageBadgeText: string;
  whyVideoEmbedUrl: string;
  whyVideoBadgeText: string;

  // Key Benefits
  benefitsEyebrow: string;
  benefitsTitle: string;
  keyBenefits: IconTextItem[];

  // Live Courses
  coursesEyebrow: string;
  coursesTitle: string;
  liveCourses: CourseCardItem[];

  // Seat Booking (header text only — batches come from the existing seat-booking API)
  seatBookingEyebrow: string;
  seatBookingTitle: string;
  seatBookingSubtitle: string;

  // Note + FAQs
  noteBoxText: string;
  faqEyebrow: string;
  faqTitle: string;
  faqs: FaqItem[];

  // Curriculum
  curriculumEyebrow: string;
  curriculumTitle: string;
  curriculumAreas: CurriculumItem[];

  // Recorded Courses + Info Blocks
  recordedEyebrow: string;
  recordedTitle: string;
  recordedCourses: RecordedCourseItem[];
  infoBlocks: InfoBlockItem[];

  // Other Courses
  otherEyebrow: string;
  otherTitle: string;
  otherCourses: OtherCourseItem[];
}

const INITIAL: FormData = {
  heroImageAlt: "Yoga Students Group",

  introEyebrow: "Rishikesh, India · Online",
  introTitle: "Online Yoga Teacher Training Course: Certify From Anywhere",
  introParagraphs: [{ text: "" }],

  whyEyebrow: "Why Choose Us",
  whyTitle: "Why Choose AYM Yoga School's Online Yoga Teacher Training Course?",
  whyReasons: [
    { icon: "🏆", title: "Learn from the Best", desc: "" },
    { icon: "📘", title: "Comprehensive Curriculum", desc: "" },
    { icon: "🎓", title: "Globally Recognized Certification", desc: "" },
    { icon: "🎥", title: "Interactive Live Sessions", desc: "" },
    { icon: "⏳", title: "Flexible Learning", desc: "" },
    { icon: "♾️", title: "Lifetime Access to Recordings", desc: "" },
    { icon: "👥", title: "Small Batch Sizes", desc: "" },
    { icon: "🏔️", title: "Rooted in Rishikesh Tradition", desc: "" },
    { icon: "🌐", title: "Multi-Language Support", desc: "" },
    { icon: "🤝", title: "Post-Course Mentorship", desc: "" },
  ],
  whyImageAlt: "Online yoga practice",
  whyImageBadgeText: "Since 2010 · Rishikesh",
  whyVideoEmbedUrl: "",
  whyVideoBadgeText: "Live Classes",

  benefitsEyebrow: "Key Benefits",
  benefitsTitle: "Key Benefits of Our Online Yoga Courses",
  keyBenefits: [
    { icon: "🌍", title: "Start Anytime, From Anywhere", desc: "" },
    { icon: "✅", title: "Yoga Alliance Certified", desc: "" },
    { icon: "🗓️", title: "Study at Your Own Pace", desc: "" },
  ],

  coursesEyebrow: "Live Online Courses",
  coursesTitle: "Our Live Online Yoga Teacher Training Courses",
  liveCourses: [
    {
      title: "200 Hour Live Online", duration: "24 Days", style: "Hatha Yoga and Ashtanga Yoga",
      sessions: "15 Days | 2 Classes Daily", cert: "Yoga Alliance, USA", fee: "399 USD / 20,000 INR",
      benefits: [{ text: "" }],
      applyBtnText: "Apply Now",
      bookBtnText: "Book Now",
    },
    {
      title: "300 Hour Live Online", duration: "28 Days", style: "Hatha Yoga and Multi-Style",
      sessions: "15 Days | 2 Classes Daily", cert: "Yoga Alliance, USA", fee: "499 USD / 25,000 INR",
      benefits: [{ text: "" }],
      applyBtnText: "Apply Now",
      bookBtnText: "Book Now",
    },
    {
      title: "Prenatal Live Online", duration: "7 Days", style: "Multi-Style (Gentle Hatha, Restorative, Breathwork & More)",
      sessions: "7 Days | 2 Classes Daily", cert: "Yoga Alliance, USA", fee: "399 USD / 20,000 INR",
      benefits: [{ text: "" }],
      applyBtnText: "Apply Now",
      bookBtnText: "Book Now",
    },
  ],

  seatBookingEyebrow: "Upcoming Batches",
  seatBookingTitle: "Live Online Yoga Teacher Training Schedule",
  seatBookingSubtitle: "Choose your batch & preferred course — prices include full live training access",

  noteBoxText: "",
  faqEyebrow: "FAQs",
  faqTitle: "About Live Yoga Training Course",
  faqs: [
    { q: "What are the eligibility criteria for joining this course?", a: "" },
    { q: "How do I register for these courses?", a: "" },
    { q: "How do I get the certification?", a: "" },
    { q: "What is the group size of each class?", a: "" },
    { q: "How are the courses designed?", a: "" },
  ],

  curriculumEyebrow: "Curriculum",
  curriculumTitle: "The Program Covers Following Basic Areas of Yoga",
  curriculumAreas: [
    { title: "Philosophy of Yoga", symbol: "☸", color: "#e53935", lines: [{ text: "20 hour live classes" }, { text: "5 hours e-books and assignments" }] },
    { title: "Introduction to Yogic Anatomy", symbol: "ॐ", color: "#F15505", lines: [{ text: "20 hour Anatomy live lectures" }, { text: "5 hours e-books self-study" }] },
    { title: "Pranayama and Meditation", symbol: "◉", color: "#f9a825", lines: [{ text: "30 hour live lecture and practice" }, { text: "Mudra, bandha, pranayama and meditation" }] },
    { title: "Adjusting and Assisting Tips", symbol: "✦", color: "#f9a825", lines: [{ text: "10 hours with hatha yoga + alignment" }, { text: "Art of adjustment through guidance" }] },
    { title: "Asana Practice", symbol: "❋", color: "#43a047", lines: [{ text: "35 hour Hatha yoga live classes" }, { text: "35 hour Ashtanga yoga live classes" }] },
    { title: "Teaching Methodology", symbol: "⬡", color: "#29b6f6", lines: [{ text: "10 hours Lecture on teaching practice" }, { text: "30 hours teaching practice and 10 feedback" }] },
  ],

  recordedEyebrow: "Self-Paced Learning",
  recordedTitle: "Fully Recorded Online Yoga Teacher Training Course",
  recordedCourses: [
    { title: "200 Hour Recorded Online Yoga Course", price: "$299", features: [{ text: "Yoga Manual" }, { text: "Recorded lectures on philosophy" }], applyBtnText: "Apply Now" },
    { title: "300 Hour Recorded Online Yoga Course", price: "$399", features: [{ text: "Yoga Manual" }, { text: "Recorded lectures on philosophy" }], applyBtnText: "Apply Now" },
  ],
  infoBlocks: [
    { heading: "The Advantages of Fully Online Courses", paragraphs: [{ text: "" }] },
    { heading: "How Do I Apply for These Courses?", paragraphs: [{ text: "" }] },
    { heading: "What Should I Do After the Registration Process?", paragraphs: [{ text: "" }] },
  ],

  otherEyebrow: "Specialised Programs",
  otherTitle: "Other Live Online Yoga Courses",
  otherCourses: [
    { title: "Hatha Yoga Alignment", hours: "35 Hour", price: "299 USD", enquireBtnText: "Enquire Now" },
    { title: "Pranayama and Meditation", hours: "20 Hour", price: "349 USD", enquireBtnText: "Enquire Now" },
    { title: "Ashtanga Vinyasa Primary Series", hours: "35 Hour", price: "299 USD", enquireBtnText: "Enquire Now" },
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

/* ─────────────────────── Reusable: dynamic rich-text paragraph list ─────────────────────── */
function ParagraphList({ control, name, label, max = 8 }: { control: Control<FormData, any>; name: string; label: string; max?: number }) {
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
            <label className={styles.label} style={{ marginBottom: 0 }}>Paragraph {index + 1}</label>
            <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
          <div className={styles.editorWrap}>
            <Controller name={`${name}.${index}.text` as any} control={control} render={({ field: f }) => <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />} />
          </div>
        </div>
      ))}
      {fields.length < max && <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>+ Add Paragraph</button>}
    </div>
  );
}

/* ─────────────────────── Reusable: dynamic plain-string list ─────────────────────── */
function StringList({ control, register, name, label, placeholder = "Text", max = 15 }: {
  control: Control<FormData, any>; register: any; name: string; label: string; placeholder?: string; max?: number;
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
                <input type="text" className={styles.input} placeholder={placeholder} {...register(`${name}.${index}.text`, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {fields.length < max && <button type="button" className={styles.addBtn} onClick={() => append({ text: "" } as any)}>+ Add</button>}
    </div>
  );
}

/* ─────────────────────── Reusable: icon + title + description list (why-reasons / key-benefits) ─────────────────────── */
function IconTextList({ control, register, name, max = 12 }: { control: Control<FormData, any>; register: any; name: "whyReasons" | "keyBenefits"; max?: number }) {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <>
      <div className={styles.itemsList}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>{index + 1}</span>
            <div className={styles.itemFields}>
              <div className={styles.itemFieldsRow}>
                <div className={styles.inputWrap} style={{ maxWidth: "70px" }}>
                  <input type="text" className={styles.input} placeholder="🏆" {...register(`${name}.${index}.icon`, { required: true })} />
                </div>
                <div className={styles.inputWrap} style={{ flex: 1 }}>
                  <input type="text" className={styles.input} placeholder="Title" {...register(`${name}.${index}.title`, { required: true })} />
                </div>
              </div>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="Description" {...register(`${name}.${index}.desc`, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(index)} disabled={fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {fields.length < max && <button type="button" className={styles.addBtn} onClick={() => append({ icon: "✦", title: "", desc: "" })}>+ Add Item</button>}
    </>
  );
}

/* ─────────────────────── Reusable: one live-course card (nested benefits list + button texts) ─────────────────────── */
function CourseCardFields({ control, register, index, onRemove, canRemove }: {
  control: Control<FormData, any>; register: UseFormRegister<FormData>; index: number; onRemove: () => void; canRemove: boolean;
}) {
  const benefitsArray = useFieldArray({ control, name: `liveCourses.${index}.benefits` });
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Course #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>✕</button>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`liveCourses.${index}.title`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Fee</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="399 USD / 20,000 INR" {...register(`liveCourses.${index}.fee`, { required: true })} /></div>
        </div>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Duration</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`liveCourses.${index}.duration`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Style</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`liveCourses.${index}.style`, { required: true })} /></div>
        </div>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Sessions</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`liveCourses.${index}.sessions`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Certificate</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`liveCourses.${index}.cert`, { required: true })} /></div>
        </div>
      </div>

      {/* ── Button texts (Apply Now / Book Now) ── */}
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Apply Button Text</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.input} placeholder="Apply Now" {...register(`liveCourses.${index}.applyBtnText`, { required: true })} />
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Book Button Text</label>
          <div className={styles.inputWrap}>
            <input type="text" className={styles.input} placeholder="Book Now" {...register(`liveCourses.${index}.bookBtnText`, { required: true })} />
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Key Benefits</h3>
        <span className={styles.sectionBadge}>{benefitsArray.fields.length}/10</span>
      </div>
      <div className={styles.itemsList}>
        {benefitsArray.fields.map((field, bIndex) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}>
                <input type="text" className={styles.input} placeholder="e.g. Expert-Led Live Training - Learn from experienced yoga masters." {...register(`liveCourses.${index}.benefits.${bIndex}.text`, { required: true })} />
              </div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => benefitsArray.remove(bIndex)} disabled={benefitsArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {benefitsArray.fields.length < 10 && (
        <button type="button" className={styles.addBtn} onClick={() => benefitsArray.append({ text: "" })}>+ Add Benefit</button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: one curriculum area (own image + nested lines list) ─────────────────────── */
function CurriculumItemFields({ control, register, setValue, watch, index, onRemove, canRemove }: {
  control: Control<FormData, any>; register: UseFormRegister<FormData>; setValue: any; watch: any;
  index: number; onRemove: () => void; canRemove: boolean;
}) {
  const linesArray = useFieldArray({ control, name: `curriculumAreas.${index}.lines` });
  const preview = watch(`curriculumAreas.${index}.preview`);

  const handleImage = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(`curriculumAreas.${index}.preview`, e.target?.result as string);
      setValue(`curriculumAreas.${index}.file`, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Area #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>✕</button>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Title</label>
        <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`curriculumAreas.${index}.title`, { required: true })} /></div>
      </div>
      <div className={styles.itemFieldsRow}>
        <div className={styles.inputWrap} style={{ maxWidth: "80px" }}>
          <input type="text" className={styles.input} placeholder="☸" {...register(`curriculumAreas.${index}.symbol`)} />
        </div>
        <div className={styles.colorFieldRow}>
          <input type="color" className={styles.colorInput} {...register(`curriculumAreas.${index}.color`)} />
        </div>
      </div>

      <div className={styles.fieldGroup} style={{ marginTop: "0.6rem" }}>
        <label className={styles.label}>Chakra / Area Image</label>
        <label className={styles.uploadArea}>
          <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleImage(e.target.files?.[0] || null)} />
          {preview ? <img src={preview} alt="preview" className={styles.imgPreview} /> : (
            <><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Click to upload</span></>
          )}
        </label>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Description Lines</h3>
        <span className={styles.sectionBadge}>{linesArray.fields.length}/6</span>
      </div>
      <div className={styles.itemsList}>
        {linesArray.fields.map((field, lIndex) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. 20 hour live classes" {...register(`curriculumAreas.${index}.lines.${lIndex}.text`, { required: true })} /></div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => linesArray.remove(lIndex)} disabled={linesArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {linesArray.fields.length < 6 && (
        <button type="button" className={styles.addBtn} onClick={() => linesArray.append({ text: "" })}>+ Add Line</button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: recorded course (nested features list + Apply button text) ─────────────────────── */
function RecordedCourseFields({ control, register, index, onRemove, canRemove }: {
  control: Control<FormData, any>; register: UseFormRegister<FormData>; index: number; onRemove: () => void; canRemove: boolean;
}) {
  const featuresArray = useFieldArray({ control, name: `recordedCourses.${index}.features` });
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Recorded Course #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>✕</button>
      </div>
      <div className={styles.twoCol}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Title</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`recordedCourses.${index}.title`, { required: true })} /></div>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Price</label>
          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="$299" {...register(`recordedCourses.${index}.price`, { required: true })} /></div>
        </div>
      </div>

      {/* ── Button text (Apply Now) ── */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Apply Button Text</label>
        <div className={styles.inputWrap}>
          <input type="text" className={styles.input} placeholder="Apply Now" {...register(`recordedCourses.${index}.applyBtnText`, { required: true })} />
        </div>
      </div>

      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Features</h3>
        <span className={styles.sectionBadge}>{featuresArray.fields.length}/10</span>
      </div>
      <div className={styles.itemsList}>
        {featuresArray.fields.map((field, fIndex) => (
          <div key={field.id} className={styles.itemRow}>
            <span className={styles.itemIndex}>#</span>
            <div className={styles.itemFields}>
              <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`recordedCourses.${index}.features.${fIndex}.text`, { required: true })} /></div>
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => featuresArray.remove(fIndex)} disabled={featuresArray.fields.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {featuresArray.fields.length < 10 && (
        <button type="button" className={styles.addBtn} onClick={() => featuresArray.append({ text: "" })}>+ Add Feature</button>
      )}
    </div>
  );
}

/* ─────────────────────── Reusable: info block (heading + nested rich paragraphs) ─────────────────────── */
function InfoBlockFields({ control, register, index, onRemove, canRemove }: {
  control: Control<FormData, any>; register: UseFormRegister<FormData>; index: number; onRemove: () => void; canRemove: boolean;
}) {
  const paragraphsArray = useFieldArray({ control, name: `infoBlocks.${index}.paragraphs` });
  return (
    <div className={styles.nestedCard}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardBadge}>Info Block #{index + 1}</span>
        <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={onRemove} disabled={!canRemove}>✕</button>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Heading</label>
        <div className={styles.inputWrap}><input type="text" className={styles.input} {...register(`infoBlocks.${index}.heading`, { required: true })} /></div>
      </div>
      <div className={styles.sectionHeader} style={{ marginBottom: "0.6rem" }}>
        <span className={styles.labelIcon}>✦</span>
        <h3 className={styles.sectionTitle} style={{ fontSize: "0.7rem" }}>Paragraphs</h3>
        <span className={styles.sectionBadge}>{paragraphsArray.fields.length}/6</span>
      </div>
      {paragraphsArray.fields.map((field, pIndex) => (
        <div key={field.id} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.itemFieldsRow} style={{ alignItems: "center", marginBottom: "0.4rem" }}>
            <label className={styles.label} style={{ marginBottom: 0 }}>Paragraph {pIndex + 1}</label>
            <button type="button" className={styles.removeItemBtn} style={{ marginLeft: "auto" }} onClick={() => paragraphsArray.remove(pIndex)} disabled={paragraphsArray.fields.length <= 1}>✕</button>
          </div>
          <div className={styles.editorWrap}>
            <Controller name={`infoBlocks.${index}.paragraphs.${pIndex}.text`} control={control} render={({ field: f }) => <JoditEditor value={f.value} config={joditConfig} onBlur={(c) => f.onChange(c)} />} />
          </div>
        </div>
      ))}
      {paragraphsArray.fields.length < 6 && (
        <button type="button" className={styles.addBtn} onClick={() => paragraphsArray.append({ text: "" })}>+ Add Paragraph</button>
      )}
    </div>
  );
}

/* ─────────────────────── Main ─────────────────────── */
export default function OnlineCourseAddEditPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const isEdit = !!params?.id && params.id !== "add-new";
  const sectionId = isEdit ? params.id : null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [whyImageFile, setWhyImageFile] = useState<File | null>(null);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<
    "hero" | "why" | "benefits" | "courses" | "seats" | "faq" | "curriculum" | "recorded"
  >("hero");

  const { control, handleSubmit, register, formState: { errors }, watch, setValue, reset } = useForm<FormData>({
    defaultValues: INITIAL,
    mode: "onChange",
  });

  const watchAll = watch();
  const liveCoursesArray = useFieldArray({ control, name: "liveCourses" });
  const faqsArray = useFieldArray({ control, name: "faqs" });
  const curriculumArray = useFieldArray({ control, name: "curriculumAreas" });
  const recordedArray = useFieldArray({ control, name: "recordedCourses" });
  const infoBlocksArray = useFieldArray({ control, name: "infoBlocks" });
  const otherCoursesArray = useFieldArray({ control, name: "otherCourses" });

  /* ── Fetch existing singleton data on edit ── */
  useEffect(() => {
    if (!isEdit || !sectionId) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/online-course-section/${sectionId}`);
        const d = res.data.data;
        reset({
          heroImageAlt: d.heroImageAlt ?? INITIAL.heroImageAlt,
          _heroPreview: d.heroImage ? getImageUrl(d.heroImage) : "",

          introEyebrow: d.introEyebrow ?? INITIAL.introEyebrow,
          introTitle: d.introTitle ?? INITIAL.introTitle,
          introParagraphs: d.introParagraphs?.length ? d.introParagraphs.map((t: string) => ({ text: t })) : INITIAL.introParagraphs,

          whyEyebrow: d.whyEyebrow ?? INITIAL.whyEyebrow,
          whyTitle: d.whyTitle ?? INITIAL.whyTitle,
          whyReasons: d.whyReasons?.length ? d.whyReasons : INITIAL.whyReasons,
          whyImageAlt: d.whyImageAlt ?? INITIAL.whyImageAlt,
          _whyImagePreview: d.whyImage ? getImageUrl(d.whyImage) : "",
          whyImageBadgeText: d.whyImageBadgeText ?? INITIAL.whyImageBadgeText,
          whyVideoEmbedUrl: d.whyVideoEmbedUrl ?? "",
          whyVideoBadgeText: d.whyVideoBadgeText ?? INITIAL.whyVideoBadgeText,

          benefitsEyebrow: d.benefitsEyebrow ?? INITIAL.benefitsEyebrow,
          benefitsTitle: d.benefitsTitle ?? INITIAL.benefitsTitle,
          keyBenefits: d.keyBenefits?.length ? d.keyBenefits : INITIAL.keyBenefits,

          coursesEyebrow: d.coursesEyebrow ?? INITIAL.coursesEyebrow,
          coursesTitle: d.coursesTitle ?? INITIAL.coursesTitle,
          liveCourses: d.liveCourses?.length
            ? d.liveCourses.map((c: any) => ({
                ...c,
                benefits: (c.benefits || []).map((t: string) => ({ text: t })),
                applyBtnText: c.applyBtnText ?? "Apply Now",
                bookBtnText: c.bookBtnText ?? "Book Now",
              }))
            : INITIAL.liveCourses,

          seatBookingEyebrow: d.seatBookingEyebrow ?? INITIAL.seatBookingEyebrow,
          seatBookingTitle: d.seatBookingTitle ?? INITIAL.seatBookingTitle,
          seatBookingSubtitle: d.seatBookingSubtitle ?? INITIAL.seatBookingSubtitle,

          noteBoxText: d.noteBoxText ?? "",
          faqEyebrow: d.faqEyebrow ?? INITIAL.faqEyebrow,
          faqTitle: d.faqTitle ?? INITIAL.faqTitle,
          faqs: d.faqs?.length ? d.faqs : INITIAL.faqs,

          curriculumEyebrow: d.curriculumEyebrow ?? INITIAL.curriculumEyebrow,
          curriculumTitle: d.curriculumTitle ?? INITIAL.curriculumTitle,
          curriculumAreas: d.curriculumAreas?.length
            ? d.curriculumAreas.map((c: any) => ({
                title: c.title, symbol: c.symbol, color: c.color,
                lines: (c.lines || []).map((t: string) => ({ text: t })),
                existingUrl: c.image ?? "", preview: c.image ? getImageUrl(c.image) : "",
              }))
            : INITIAL.curriculumAreas,

          recordedEyebrow: d.recordedEyebrow ?? INITIAL.recordedEyebrow,
          recordedTitle: d.recordedTitle ?? INITIAL.recordedTitle,
          recordedCourses: d.recordedCourses?.length
            ? d.recordedCourses.map((c: any) => ({
                ...c,
                features: (c.features || []).map((t: string) => ({ text: t })),
                applyBtnText: c.applyBtnText ?? "Apply Now",
              }))
            : INITIAL.recordedCourses,
          infoBlocks: d.infoBlocks?.length
            ? d.infoBlocks.map((b: any) => ({ heading: b.heading, paragraphs: (b.paragraphs || []).map((t: string) => ({ text: t })) }))
            : INITIAL.infoBlocks,

          otherEyebrow: d.otherEyebrow ?? INITIAL.otherEyebrow,
          otherTitle: d.otherTitle ?? INITIAL.otherTitle,
          otherCourses: d.otherCourses?.length
            ? d.otherCourses.map((c: any) => ({
                title: c.title, hours: c.hours, price: c.price,
                existingUrl: c.image ?? "", preview: c.image ? getImageUrl(c.image) : "",
                enquireBtnText: c.enquireBtnText ?? "Enquire Now",
              }))
            : INITIAL.otherCourses,
        });
      } catch {
        toast.error("Failed to fetch online course section data");
        router.replace("/admin/yogacourse/online-yoga-course");
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
  const handleWhyImage = makeImageHandler("_whyImagePreview", setWhyImageFile);

  const handleOtherCourseImage = (index: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(`otherCourses.${index}.preview`, e.target?.result as string);
      setValue(`otherCourses.${index}.file`, file);
    };
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("heroImageAlt", data.heroImageAlt);
      formData.append("introEyebrow", data.introEyebrow);
      formData.append("introTitle", data.introTitle);
      formData.append("whyEyebrow", data.whyEyebrow);
      formData.append("whyTitle", data.whyTitle);
      formData.append("whyImageAlt", data.whyImageAlt);
      formData.append("whyImageBadgeText", data.whyImageBadgeText);
      formData.append("whyVideoEmbedUrl", data.whyVideoEmbedUrl);
      formData.append("whyVideoBadgeText", data.whyVideoBadgeText);
      formData.append("benefitsEyebrow", data.benefitsEyebrow);
      formData.append("benefitsTitle", data.benefitsTitle);
      formData.append("coursesEyebrow", data.coursesEyebrow);
      formData.append("coursesTitle", data.coursesTitle);
      formData.append("seatBookingEyebrow", data.seatBookingEyebrow);
      formData.append("seatBookingTitle", data.seatBookingTitle);
      formData.append("seatBookingSubtitle", data.seatBookingSubtitle);
      formData.append("noteBoxText", data.noteBoxText);
      formData.append("faqEyebrow", data.faqEyebrow);
      formData.append("faqTitle", data.faqTitle);
      formData.append("curriculumEyebrow", data.curriculumEyebrow);
      formData.append("curriculumTitle", data.curriculumTitle);
      formData.append("recordedEyebrow", data.recordedEyebrow);
      formData.append("recordedTitle", data.recordedTitle);
      formData.append("otherEyebrow", data.otherEyebrow);
      formData.append("otherTitle", data.otherTitle);

      formData.append("introParagraphs", JSON.stringify(data.introParagraphs.map((p) => p.text)));
      formData.append("whyReasons", JSON.stringify(data.whyReasons));
      formData.append("keyBenefits", JSON.stringify(data.keyBenefits));
      // liveCourses: includes applyBtnText & bookBtnText via spread
      formData.append("liveCourses", JSON.stringify(data.liveCourses.map((c) => ({ ...c, benefits: c.benefits.map((b) => b.text) }))));
      formData.append("faqs", JSON.stringify(data.faqs));
      // recordedCourses: includes applyBtnText via spread
      formData.append("recordedCourses", JSON.stringify(data.recordedCourses.map((c) => ({ ...c, features: c.features.map((f) => f.text) }))));
      formData.append("infoBlocks", JSON.stringify(data.infoBlocks.map((b) => ({ heading: b.heading, paragraphs: b.paragraphs.map((p) => p.text) }))));

      if (heroFile) formData.append("heroImage", heroFile);
      if (whyImageFile) formData.append("whyImage", whyImageFile);

      // Curriculum: text data + per-index image
      formData.append(
        "curriculumData",
        JSON.stringify(data.curriculumAreas.map((c) => ({ title: c.title, symbol: c.symbol, color: c.color, lines: c.lines.map((l) => l.text) })))
      );
      data.curriculumAreas.forEach((c, i) => { if (c.file) formData.append(`curriculumImage_${i}`, c.file); });
      formData.append("existingCurriculumImages", JSON.stringify(data.curriculumAreas.map((c) => (c.file ? null : c.existingUrl ?? null))));

      // Other courses: text data (incl. enquireBtnText) + per-index image
      formData.append(
        "otherCoursesData",
        JSON.stringify(data.otherCourses.map((c) => ({ title: c.title, hours: c.hours, price: c.price, enquireBtnText: c.enquireBtnText })))
      );
      data.otherCourses.forEach((c, i) => { if (c.file) formData.append(`otherCourseImage_${i}`, c.file); });
      formData.append("existingOtherCourseImages", JSON.stringify(data.otherCourses.map((c) => (c.file ? null : c.existingUrl ?? null))));

      if (isEdit && sectionId) {
        await api.put(`/online-course-section/${sectionId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/online-course-section", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/online-yoga-course"), 1500);
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
        <div className={styles.skeletonCard}>{[...Array(5)].map((_, i) => <div key={i} className={styles.skeletonField} style={{ height: "52px" }} />)}</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Online Course Section {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting…</p>
        </div>
      </div>
    );
  }

  const tabErrors = {
    hero: !!(errors.heroImageAlt || errors.introTitle),
    why: !!(errors.whyTitle || errors.whyReasons),
    benefits: !!(errors.benefitsTitle || errors.keyBenefits),
    courses: !!(errors.coursesTitle || errors.liveCourses),
    seats: !!(errors.seatBookingTitle || errors.seatBookingSubtitle),
    faq: !!(errors.faqTitle || errors.faqs),
    curriculum: !!(errors.curriculumTitle || errors.curriculumAreas),
    recorded: !!(errors.recordedTitle || errors.recordedCourses || errors.otherCourses),
  };

  const tabLabels = {
    hero: "① Hero & Intro",
    why: "② Why Choose",
    benefits: "③ Key Benefits",
    courses: "④ Live Courses",
    seats: "⑤ Seat Booking Header",
    faq: "⑥ Note & FAQs",
    curriculum: "⑦ Curriculum",
    recorded: "⑧ Recorded & Other",
  };

  const tabOrder = ["hero", "why", "benefits", "courses", "seats", "faq", "curriculum", "recorded"] as const;

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <Link href="/admin/yogacourse/online-yoga-course" className={styles.breadcrumbLink}>Online Course Section</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit" : "Add"}</span>
      </div>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{isEdit ? "Edit Online Course Section" : "Add Online Course Section"}</h1>
        <p className={styles.pageSubtitle}>Fill in every section of the Online Yoga Course page. Batches themselves are managed separately in the Seat Booking admin.</p>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.tabNav}>
        {tabOrder.map((tab) => (
          <button key={tab} type="button" className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ""} ${tabErrors[tab] ? styles.tabBtnError : ""}`} onClick={() => setActiveTab(tab)}>
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
                  {watchAll._heroPreview ? <img src={watchAll._heroPreview} alt="preview" className={styles.imgPreview} /> : (<><span className={styles.uploadIcon}>🏔️</span><span className={styles.uploadText}>Click to upload</span></>)}
                </label>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Hero Image Alt Text</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("heroImageAlt", { required: "Required" })} /></div>
                {errors.heroImageAlt && <p className={styles.errorMsg}>⚠ {errors.heroImageAlt.message}</p>}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Intro Section</h3></div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Eyebrow Text</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Rishikesh, India · Online" {...register("introEyebrow")} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Main Title (H1)<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.introTitle ? styles.inputError : ""}`}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("introTitle", { required: "Required" })} />
                </div>
              </div>
              <ParagraphList control={control} name="introParagraphs" label="Intro Paragraphs" />
            </div>
          )}

          {/* ══════════ TAB 2 — WHY CHOOSE ══════════ */}
          {activeTab === "why" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eyebrow Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("whyEyebrow")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.whyTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("whyTitle", { required: "Required" })} /></div>
                </div>
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>Reasons</h3>
                <span className={styles.sectionBadge}>{watchAll.whyReasons?.length ?? 0}/12</span>
              </div>
              <IconTextList control={control} register={register} name="whyReasons" />

              <div className={styles.formDivider} />

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Side Image</label>
                <label className={styles.uploadArea}>
                  <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => handleWhyImage(e.target.files?.[0] || null)} />
                  {watchAll._whyImagePreview ? <img src={watchAll._whyImagePreview} alt="preview" className={styles.imgPreview} /> : (<><span className={styles.uploadIcon}>🖼️</span><span className={styles.uploadText}>Click to upload</span></>)}
                </label>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Alt Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("whyImageAlt")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Image Badge Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Since 2010 · Rishikesh" {...register("whyImageBadgeText")} /></div>
                </div>
              </div>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Video Embed URL</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="https://www.youtube.com/embed/..." {...register("whyVideoEmbedUrl")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Video Badge Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Live Classes" {...register("whyVideoBadgeText")} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ TAB 3 — KEY BENEFITS ══════════ */}
          {activeTab === "benefits" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eyebrow Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("benefitsEyebrow")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.benefitsTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("benefitsTitle", { required: "Required" })} /></div>
                </div>
              </div>
              <div className={styles.sectionHeader} style={{ marginTop: "0.6rem" }}>
                <span className={styles.labelIcon}>✦</span>
                <h3 className={styles.sectionTitle} style={{ fontSize: "0.74rem" }}>Benefit Cards</h3>
                <span className={styles.sectionBadge}>{watchAll.keyBenefits?.length ?? 0}/12</span>
              </div>
              <IconTextList control={control} register={register} name="keyBenefits" />
            </div>
          )}

          {/* ══════════ TAB 4 — LIVE COURSES ══════════ */}
          {activeTab === "courses" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eyebrow Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("coursesEyebrow")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.coursesTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("coursesTitle", { required: "Required" })} /></div>
                </div>
              </div>
              <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                <span className={styles.sectionBadge}>{liveCoursesArray.fields.length}/8 courses</span>
              </div>
              {liveCoursesArray.fields.map((field, index) => (
                <CourseCardFields key={field.id} control={control} register={register} index={index} onRemove={() => liveCoursesArray.remove(index)} canRemove={liveCoursesArray.fields.length > 1} />
              ))}
              {liveCoursesArray.fields.length < 8 && (
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() =>
                    liveCoursesArray.append({
                      title: "", duration: "", style: "", sessions: "", cert: "", fee: "",
                      benefits: [{ text: "" }],
                      applyBtnText: "Apply Now",
                      bookBtnText: "Book Now",
                    })
                  }
                >
                  + Add Course
                </button>
              )}
            </div>
          )}

          {/* ══════════ TAB 5 — SEAT BOOKING HEADER ══════════ */}
          {activeTab === "seats" && (
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Seat Booking Section Header</h3></div>
              <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
                The batch list itself (dates, seats, prices) is managed separately in the Seat Booking admin — this only controls the heading text shown above it.
              </p>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Eyebrow Text</label>
                <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="e.g. Upcoming Batches" {...register("seatBookingEyebrow")} /></div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.seatBookingTitle ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Live Online Yoga Teacher Training Schedule" {...register("seatBookingTitle", { required: "Required" })} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Subtitle<span className={styles.required}>*</span></label>
                <div className={`${styles.inputWrap} ${errors.seatBookingSubtitle ? styles.inputError : ""}`}>
                  <input type="text" className={styles.input} placeholder="e.g. Choose your batch & preferred course — prices include full live training access" {...register("seatBookingSubtitle", { required: "Required" })} />
                </div>
                {errors.seatBookingSubtitle && <p className={styles.errorMsg}>⚠ {errors.seatBookingSubtitle.message}</p>}
              </div>
            </div>
          )}

          {/* ══════════ TAB 6 — NOTE & FAQS ══════════ */}
          {activeTab === "faq" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Note Box</h3></div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Note Text</label>
                  <div className={styles.editorWrap}>
                    <Controller name="noteBoxText" control={control} render={({ field }) => <JoditEditor value={field.value} config={joditConfig} onBlur={(c) => field.onChange(c)} />} />
                  </div>
                </div>
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>FAQs</h3></div>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Eyebrow Text</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("faqEyebrow")} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrap} ${errors.faqTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("faqTitle", { required: "Required" })} /></div>
                  </div>
                </div>
                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.sectionBadge}>{faqsArray.fields.length}/15</span>
                </div>
                <div className={styles.itemsList}>
                  {faqsArray.fields.map((field, index) => (
                    <div key={field.id} className={styles.itemRow}>
                      <span className={styles.itemIndex}>{index + 1}</span>
                      <div className={styles.itemFields}>
                        <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Question" {...register(`faqs.${index}.q`, { required: true })} /></div>
                        <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="Answer" {...register(`faqs.${index}.a`, { required: true })} /></div>
                      </div>
                      <button type="button" className={styles.removeItemBtn} onClick={() => faqsArray.remove(index)} disabled={faqsArray.fields.length <= 1}>✕</button>
                    </div>
                  ))}
                </div>
                {faqsArray.fields.length < 15 && (
                  <button type="button" className={styles.addBtn} onClick={() => faqsArray.append({ q: "", a: "" })}>+ Add FAQ</button>
                )}
              </div>
            </>
          )}

          {/* ══════════ TAB 7 — CURRICULUM ══════════ */}
          {activeTab === "curriculum" && (
            <div className={styles.sectionBlock}>
              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Eyebrow Text</label>
                  <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("curriculumEyebrow")} /></div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                  <div className={`${styles.inputWrap} ${errors.curriculumTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("curriculumTitle", { required: "Required" })} /></div>
                </div>
              </div>
              <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                <span className={styles.sectionBadge}>{curriculumArray.fields.length}/10 areas</span>
              </div>
              {curriculumArray.fields.map((field, index) => (
                <CurriculumItemFields key={field.id} control={control} register={register} setValue={setValue} watch={watch} index={index} onRemove={() => curriculumArray.remove(index)} canRemove={curriculumArray.fields.length > 1} />
              ))}
              {curriculumArray.fields.length < 10 && (
                <button type="button" className={styles.addBtn} onClick={() => curriculumArray.append({ title: "", symbol: "✦", color: "#F15505", lines: [{ text: "" }] })}>+ Add Curriculum Area</button>
              )}
            </div>
          )}

          {/* ══════════ TAB 8 — RECORDED & OTHER COURSES ══════════ */}
          {activeTab === "recorded" && (
            <>
              <div className={styles.sectionBlock}>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Eyebrow Text</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("recordedEyebrow")} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Section Title<span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrap} ${errors.recordedTitle ? styles.inputError : ""}`}><input type="text" className={styles.input} {...register("recordedTitle", { required: "Required" })} /></div>
                  </div>
                </div>
                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.sectionBadge}>{recordedArray.fields.length}/6 recorded courses</span>
                </div>
                {recordedArray.fields.map((field, index) => (
                  <RecordedCourseFields key={field.id} control={control} register={register} index={index} onRemove={() => recordedArray.remove(index)} canRemove={recordedArray.fields.length > 1} />
                ))}
                {recordedArray.fields.length < 6 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => recordedArray.append({ title: "", price: "", features: [{ text: "" }], applyBtnText: "Apply Now" })}
                  >
                    + Add Recorded Course
                  </button>
                )}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>Info Blocks</h3><span className={styles.sectionBadge}>{infoBlocksArray.fields.length}/6</span></div>
                {infoBlocksArray.fields.map((field, index) => (
                  <InfoBlockFields key={field.id} control={control} register={register} index={index} onRemove={() => infoBlocksArray.remove(index)} canRemove={infoBlocksArray.fields.length > 1} />
                ))}
                {infoBlocksArray.fields.length < 6 && (
                  <button type="button" className={styles.addBtn} onClick={() => infoBlocksArray.append({ heading: "", paragraphs: [{ text: "" }] })}>+ Add Info Block</button>
                )}
              </div>

              <div className={styles.formDivider} />

              <div className={styles.sectionBlock}>
                <div className={styles.twoCol}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Eyebrow Text</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("otherEyebrow")} /></div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Section Title</label>
                    <div className={styles.inputWrap}><input type="text" className={styles.input} {...register("otherTitle")} /></div>
                  </div>
                </div>
                <div className={styles.sectionHeader} style={{ marginTop: "0.4rem" }}>
                  <span className={styles.sectionBadge}>{otherCoursesArray.fields.length}/8</span>
                </div>
                <div className={styles.itemsList}>
                  {otherCoursesArray.fields.map((field, index) => {
                    const preview = watchAll.otherCourses?.[index]?.preview;
                    return (
                      <div key={field.id} className={styles.itemRow}>
                        <div className={styles.itemThumbInputWrap}>
                          {preview ? <img src={preview} alt={`other ${index + 1}`} className={styles.itemThumb} /> : (
                            <div className={styles.itemThumb} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📷</div>
                          )}
                          <input type="file" accept="image/*" className={styles.imageTileInput} onChange={(e) => handleOtherCourseImage(index, e.target.files?.[0] || null)} />
                        </div>
                        <div className={styles.itemFields}>
                          <div className={styles.inputWrap}><input type="text" className={styles.input} placeholder="Title" {...register(`otherCourses.${index}.title`, { required: true })} /></div>
                          <div className={styles.itemFieldsRow}>
                            <div className={styles.inputWrap} style={{ flex: 1 }}><input type="text" className={styles.input} placeholder="Hours e.g. 35 Hour" {...register(`otherCourses.${index}.hours`, { required: true })} /></div>
                            <div className={styles.inputWrap} style={{ flex: 1 }}><input type="text" className={styles.input} placeholder="Price e.g. 299 USD" {...register(`otherCourses.${index}.price`, { required: true })} /></div>
                          </div>
                          <div className={styles.inputWrap}>
                            <input type="text" className={styles.input} placeholder="Enquire Button Text e.g. Enquire Now" {...register(`otherCourses.${index}.enquireBtnText`, { required: true })} />
                          </div>
                        </div>
                        <button type="button" className={styles.removeItemBtn} onClick={() => otherCoursesArray.remove(index)} disabled={otherCoursesArray.fields.length <= 1}>✕</button>
                      </div>
                    );
                  })}
                </div>
                {otherCoursesArray.fields.length < 8 && (
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => otherCoursesArray.append({ title: "", hours: "", price: "", enquireBtnText: "Enquire Now" })}
                  >
                    + Add Other Course
                  </button>
                )}
              </div>
            </>
          )}

          <div className={styles.formDivider} />

          <div className={styles.formActions}>
            <Link href="/admin/yogacourse/online-yoga-course" className={styles.cancelBtn}>← Cancel</Link>
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
              {activeTab !== "recorded" ? (
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