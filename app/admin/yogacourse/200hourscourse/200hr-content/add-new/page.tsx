"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const joditConfig = {
  readonly: false, toolbar: true, spellcheck: true, language: "en",
  toolbarButtonSize: "medium", toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: ["bold","italic","underline","strikethrough","|","font","fontsize","brush","|","paragraph","align","|","ul","ol","|","link","|","undo","redo","|","selectall","cut","copy","paste"],
  uploader: { insertImageAsBase64URI: true },
  height: 220, placeholder: "",
} as any;

function isEditorEmpty(html: string) { return html.replace(/<[^>]*>/g, "").trim() === ""; }

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
interface FormData {
  /* SEO */
  metaTitle: string; metaDesc: string; metaKeywords: string; slug: string; status: "Active" | "Inactive";
  /* Page Heading */
  pageMainH1: string;
  /* Hero */
  heroImgAlt: string;
  /* Stats */
  stat1Icon: string; stat1Val: string; stat1Title: string; stat1Desc: string;
  stat2Icon: string; stat2Val: string; stat2Title: string; stat2Desc: string;
  stat3Icon: string; stat3Val: string; stat3Title: string; stat3Desc: string;
  stat4Icon: string; stat4Val: string; stat4Title: string; stat4Desc: string;
  /* Aims */
  aimsH3: string; aimsKeyObjLabel: string;
  /* Overview */
  overviewH2: string; overviewCertName: string; overviewLevel: string;
  overviewEligibility: string; overviewMinAge: string; overviewCredits: string; overviewLanguage: string;
  /* Upcoming Dates (headings only — data from DB) */
  upcomingDatesH2: string; upcomingDatesSubtext: string; upcomingDatesNote: string;
  /* Fee */
  feeIncludedTitle: string; feeNotIncludedTitle: string;
  /* Syllabus */
  syllabusH3: string;
  /* Modules */
  mod1Title: string; mod1Intro: string;
  mod2Title: string; mod2Intro: string;
  mod3Title: string; mod3Intro: string;
  mod4Title: string; mod4Intro: string;
  mod5Title: string; mod5Intro: string;
  mod6Title: string; mod6Intro: string;
  mod7Title: string; mod7Intro: string;
  mod8Title: string; mod8Intro: string;
  /* Ashtanga */
  ashtangaH2: string; ashtangaSubtitle: string; ashtangaImgAlt: string;
  ashtangaPill1: string; ashtangaPill2: string; ashtangaPill3: string;
  /* Primary Series */
  primarySeriesH3: string; primarySeriesSubtext: string;
  /* Hatha */
  hathaH2: string; hathaSubtitle: string; hathaImgAlt: string;
  hathaPill1: string; hathaPill2: string; hathaPill3: string;
  /* Asanas */
  asanasH2: string; asanasSubtext: string;
  /* Evaluation */
  evalH2: string;
  /* Accommodation / Food */
  accommodationH2: string; foodH2: string;
  /* Luxury */
  luxuryH2: string;
  /* Indian Fee */
  indianFeeH2: string;
  /* Schedule */
  scheduleH2: string;
  /* More Info */
  moreInfoH2: string;
  eligibilityInfoTitle: string; eligibilityInfoText: string;
  visaPassportTitle: string;
  spanishChineseNote: string;
  /* CTA */
  ctaTitle: string; ctaSubtitle: string; ctaPhone: string; ctaApplyBtnText: string;
  /* New Programs */
  newProgramsH2: string; newProgramsSubtext: string;
  /* Global Cert */
  globalCertH2: string;
  /* Requirements */
  requirementsH2: string; requirementsImgAlt: string;
  /* What You Need */
  whatYouNeedH2: string;
  /* Best 200hr */
  best200HrH4: string;
  /* What's Included */
  whatsIncludedH4: string;
  /* Reviews */
  reviewsH2: string; reviewsSubtext: string;
  /* Videos */
  videosH2: string;
  video1Label: string; video1Url: string; video1Thumb: string;
  video2Label: string; video2Url: string; video2Thumb: string;
  video3Label: string; video3Url: string; video3Thumb: string;
  /* Booking */
  bookingH2: string;
  step1Icon: string; step1Title: string;
  step2Icon: string; step2Title: string;
  step3Icon: string; step3Title: string;
  step4Icon: string; step4Title: string;
  /* FAQ */
  faqH2: string;
}

/* ═══════════════════════════════════════════════════
   MULTI IMAGE UPLOAD
═══════════════════════════════════════════════════ */
function MultiImageUpload({ files, previews, hint, label = "Image", onSelect, onRemove, maxFiles = 8 }: {
  files: File[]; previews: string[]; hint: string; label?: string;
  onSelect: (f: File[], p: string[]) => void; onRemove: (i: number) => void; maxFiles?: number;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sel = Array.from(e.target.files || []);
    if (!sel.length) return;
    const nf = [...files, ...sel].slice(0, maxFiles);
    const np = [...previews, ...sel.map(f => URL.createObjectURL(f))].slice(0, maxFiles);
    onSelect(nf, np); e.target.value = "";
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "0.7rem" }}>
      {previews.map((p, i) => (
        <div key={i} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1.5px solid #e8d5b5" }}>
          <span className={styles.imageBadge}>{label} {i + 1}</span>
          <img src={p} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
          <button type="button" className={styles.removeImageBtn} onClick={() => onRemove(i)}>✕</button>
        </div>
      ))}
      {files.length < maxFiles && (
        <div className={styles.imageUploadZone} style={{ minHeight: 110, position: "relative" }}>
          <input type="file" accept="image/*" multiple onChange={handleChange}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 2, width: "100%", height: "100%" }} />
          <div className={styles.imageUploadPlaceholder}>
            <span className={styles.imageUploadIcon}>🖼️</span>
            <span className={styles.imageUploadText}>Add Photo</span>
            <span className={styles.imageUploadSub}>{hint}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SINGLE IMAGE UPLOAD
═══════════════════════════════════════════════════ */
function SingleImageUpload({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    onSelect(file, URL.createObjectURL(file)); e.target.value = "";
  };
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={handleChange} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="preview" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={handleChange} />
            </div>
            <button type="button" className={styles.removeImageBtn} onClick={e => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   JODIT — Required
═══════════════════════════════════════════════════ */
function JoditField({ label, hint, contentRef, error, onClearError, placeholder = "Start typing…", height = 200 }: {
  label: string; hint?: string; contentRef: React.MutableRefObject<string>;
  error?: string; onClearError: () => void; placeholder?: string; height?: number;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}<span className={styles.required}>*</span></label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={`${styles.joditWrap} ${error ? styles.joditError : ""}`}>
        <JoditEditor config={{ ...joditConfig, placeholder, height }}
          onChange={val => { contentRef.current = val; if (!isEditorEmpty(val)) onClearError(); }} />
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   JODIT — Optional
═══════════════════════════════════════════════════ */
function JoditOpt({ label, hint, contentRef, placeholder = "Start typing…", height = 180 }: {
  label: string; hint?: string; contentRef: React.MutableRefObject<string>; placeholder?: string; height?: number;
}) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div className={styles.joditWrap}>
        <JoditEditor config={{ ...joditConfig, placeholder, height }}
          onChange={val => { contentRef.current = val; }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STRING LIST FIELD
═══════════════════════════════════════════════════ */
function StringListField({ items, onAdd, onRemove, onUpdate, maxItems = 30, placeholder, label }: {
  items: string[]; onAdd: () => void; onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void; maxItems?: number; placeholder?: string; label: string;
}) {
  return (
    <>
      <div className={styles.listItems}>
        {items.map((val, i) => (
          <div key={i} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`} value={val}
                placeholder={placeholder || "Enter item..."} onChange={e => onUpdate(i, e.target.value)} />
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < maxItems && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════
   STAR RATING PICKER
═══════════════════════════════════════════════════ */
function StarRatingPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: "1.6rem",
            cursor: "pointer",
            color: star <= (hovered || value) ? "#f5a623" : "#d1c5b0",
            transition: "color 0.15s",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ marginLeft: "0.4rem", fontSize: "0.85rem", color: "#8a7560", fontWeight: 500 }}>
        {value > 0 ? `${value} / 5` : "No rating"}
      </span>
    </div>
  );
}

/* small helpers */
const D = () => <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />;

function Sec({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>✦</span>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {badge && <span className={styles.sectionBadge}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function F({ label, hint, req, children }: { label: string; hint?: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>{label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

function TxtInp({ reg, ph, rows }: { reg: any; ph?: string; rows?: number }) {
  if (rows) return <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={rows} placeholder={ph || ""} {...reg} /></div>;
  return <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder={ph || ""} {...reg} /></div>;
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function Yoga200AddNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Single Images ── */
  const [heroFile, setHeroFile]         = useState<File | null>(null);
  const [heroPrev, setHeroPrev]         = useState(""); const [heroErr, setHeroErr] = useState("");
  const [ashtangaFile, setAshtangaFile] = useState<File | null>(null); const [ashtangaPrev, setAshtangaPrev] = useState("");
  const [hathaFile, setHathaFile]       = useState<File | null>(null); const [hathaPrev, setHathaPrev]       = useState("");
  const [reqImgFile, setReqImgFile]     = useState<File | null>(null); const [reqImgPrev, setReqImgPrev]     = useState("");

  /* ── Multi Images ── */
  const [accomFiles, setAccomFiles]         = useState<File[]>([]); const [accomPrevs, setAccomPrevs]         = useState<string[]>([]);
  const [foodFiles, setFoodFiles]           = useState<File[]>([]); const [foodPrevs, setFoodPrevs]           = useState<string[]>([]);
  const [luxImgFiles, setLuxImgFiles]       = useState<File[]>([]); const [luxImgPrevs, setLuxImgPrevs]       = useState<string[]>([]);
  const [schedImgFiles, setSchedImgFiles]   = useState<File[]>([]); const [schedImgPrevs, setSchedImgPrevs]   = useState<string[]>([]);

  /* ── Jodit Refs ── */
  const ip1Ref = useRef(""); const ip2Ref = useRef(""); const ip3Ref = useRef(""); const ip4Ref = useRef("");
  const aimsIntroRef = useRef(""); const aimsOutroRef = useRef("");
  const syllabusIntroRef = useRef("");
  const mod1Ref = useRef(""); const mod2Ref = useRef(""); const mod3Ref = useRef(""); const mod4Ref = useRef("");
  const mod5Ref = useRef(""); const mod6Ref = useRef(""); const mod7Ref = useRef(""); const mod8Ref = useRef("");
  const ashtangaRef = useRef(""); const primaryRef = useRef(""); const hathaRef = useRef("");
  const evalRef = useRef(""); const schedDescRef = useRef(""); const visaRef = useRef("");
  const globalCert1Ref = useRef(""); const globalCert2Ref = useRef("");
  const req1Ref = useRef(""); const req2Ref = useRef(""); const req3Ref = useRef(""); const req4Ref = useRef("");
  const best200HrRef = useRef("");
  const step1Ref = useRef(""); const step2Ref = useRef(""); const step3Ref = useRef(""); const step4Ref = useRef("");
  // program desc refs (up to 20)
  const progRefs = useRef<React.MutableRefObject<string>[]>(Array.from({ length: 20 }, () => ({ current: "" })));
  // review text refs (up to 20)
  const revRefs = useRef<React.MutableRefObject<string>[]>(Array.from({ length: 20 }, () => ({ current: "" })));

  /* ── Jodit Errors ── */
  const [ip1Err, setIp1Err] = useState(""); const [ip2Err, setIp2Err] = useState("");
  const [ip3Err, setIp3Err] = useState(""); const [ip4Err, setIp4Err] = useState("");
  const [aimsErr, setAimsErr] = useState(""); const [sylErr, setSylErr] = useState("");
  const [astErr, setAstErr]   = useState(""); const [htErr, setHtErr]   = useState("");
  const [evErr, setEvErr]     = useState("");

  /* ── String Lists ── */
  const [aimsBullets, setAimsBullets]   = useState<string[]>([""]);
  const [inclFee, setInclFee]           = useState<string[]>([""]);
  const [notInclFee, setNotInclFee]     = useState<string[]>([""]);
  const [mod1Items, setMod1Items]       = useState<string[]>([""]);
  const [mod2Items, setMod2Items]       = useState<string[]>([""]);
  const [mod3Items, setMod3Items]       = useState<string[]>([""]);
  const [mod4Items, setMod4Items]       = useState<string[]>([""]);
  const [mod5Items, setMod5Items]       = useState<string[]>([""]);
  const [mod6Items, setMod6Items]       = useState<string[]>([""]);
  const [mod7Items, setMod7Items]       = useState<string[]>([""]);
  const [mod8Items, setMod8Items]       = useState<string[]>([""]);
  const [foundItems, setFoundItems]     = useState<string[]>([""]);
  const [luxFeatures, setLuxFeatures]   = useState<string[]>([""]);
  const [whatIncl, setWhatIncl]         = useState<string[]>([""]);
  const [instrLangs, setInstrLangs]     = useState<{ lang: string; note: string }[]>([{ lang: "", note: "" }]);
  const [indianFees, setIndianFees]     = useState<{ label: string; price: string }[]>([{ label: "", price: "" }]);
  const [schedRows, setSchedRows]       = useState<{ time: string; activity: string }[]>([{ time: "", activity: "" }]);
  const [hatha43, setHatha43]           = useState<{ n: string; name: string; sub: string }[]>([{ n: "1", name: "", sub: "" }]);
  const [weekGrid, setWeekGrid]         = useState<{ week: string; icon: string; t1: string; d1: string; t2: string; d2: string }[]>([
    { week: "Week 1", icon: "☀️", t1: "", d1: "", t2: "", d2: "" }
  ]);

  /* ── Dynamic Programs (unlimited add) ── */
  const [programs, setPrograms] = useState([
    { title: "200 Hour Course + Prenatal Yoga", duration: "3 Weeks + 1 Week", start: "03rd of Every Month", oldPrice: "$1148", price: "$1034 ( Dormitory )" },
    { title: "200 Hour Course + Ayurveda",      duration: "3 Weeks + 1 Week", start: "3rd of Every Month",  oldPrice: "$1088", price: "$980 ( Dormitory )"  },
    { title: "200 Hour Course + Sound Healing", duration: "3 Weeks + 1 Week", start: "3rd of Every Month",  oldPrice: "$1059", price: "$953 ( Dormitory )"  },
    { title: "200 Hour Course + Aerial Yoga",   duration: "3 Weeks + 1 Week", start: "3rd of Every Month",  oldPrice: "$1059", price: "$953 ( Dormitory )"  },
  ]);

  /* ── Dynamic Reviews (unlimited add) — now with star rating ── */
  const [reviews, setReviews] = useState([
    { name: "", role: "", rating: 5 },
    { name: "", role: "", rating: 5 },
    { name: "", role: "", rating: 5 },
  ]);

  /* ── FAQ ── */
  const [faqItems, setFaqItems] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  /* ── Know Q&A ── */
  const [knowQA, setKnowQA] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  /* ── form ── */
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      metaTitle: "", metaDesc: "", metaKeywords: "", slug: "", status: "Active",
      pageMainH1: "200 Hour Yoga Teacher Training in Rishikesh",
      heroImgAlt: "Yoga Students Group",
      stat1Icon: "🕐", stat1Val: "21+",   stat1Title: "Years of Excellence", stat1Desc: "Our syllabus has been developed over twenty years by dozens of experienced yoga masters.",
      stat2Icon: "👥", stat2Val: "9,075+",stat2Title: "Global Alumni",       stat2Desc: "Join the world's most famous AYM yoga teacher training alumni network.",
      stat3Icon: "⭐", stat3Val: "4.5",   stat3Title: "Star Rating",         stat3Desc: "Rated 4.5 stars on Google, Yoga Alliance, and Facebook by our trainees.",
      stat4Icon: "🔆", stat4Val: "200",   stat4Title: "Hour Certification",  stat4Desc: "Yoga Alliance approved certification recognized worldwide.",
      aimsH3: "200 Hour Yoga Teacher Training Rishikesh India - Aims & Objective",
      aimsKeyObjLabel: "The key aims and objectives of our 200 Hour Multi-Style Yoga Teacher Training Course in Rishikesh India is:",
      overviewH2: "Overview of 200 Hour Yoga Instructor Course Rishikesh India",
      overviewCertName: "200-hour yoga teacher training / Yoga Protocol Instructor (YPI)",
      overviewLevel: "Level-I",
      overviewEligibility: "Physically fit and open for all but it is suggested that the candidate should have passed 10th standard / secondary school certificate.",
      overviewMinAge: "No age limit", overviewCredits: "12 credits",
      overviewLanguage: "English; Hindi (Separate Groups)",
      upcomingDatesH2: "Upcoming Course Dates",
      upcomingDatesSubtext: "Choose your preferred accommodation. Prices include tuition and meals.",
      upcomingDatesNote: "Note: A $100 USD early bird discount is available on all accommodation types if booked 60 days in advance.",
      feeIncludedTitle: "Included in 200 Hour yoga ttc course in india",
      feeNotIncludedTitle: "Not Included in 200 hour yoga ttc course in Rishikesh",
      syllabusH3: "200 Hour Yoga Teacher Training In Rishikesh India - The Syllabus",
      mod1Title: "Module 1: The Philosophy of Yoga",            mod1Intro: "The course covers fundamental concepts underlying Ashtanga Yoga.",
      mod2Title: "Module 2: The Yogic Breathing Techniques/Pranayama", mod2Intro: "You will learn about different types of breathing used in pranayama.",
      mod3Title: "Module 3: The Shat Kriyas (Cleansing Detox)", mod3Intro: "This module gives you understanding of the detoxification process for healing the body.",
      mod4Title: "Module 4: Anatomy and Physiology",            mod4Intro: "Teacher will connect ancient science of yoga to the present science.",
      mod5Title: "Module 5: Knowledge of Meditation",           mod5Intro: "Meditation is the key part of yoga teacher training.",
      mod6Title: "Module 6: Mantras, Chants, and Prayers",      mod6Intro: "Mantras are coded in Sanskrit native language of India.",
      mod7Title: "Module 7: Mastering the Art of Teaching Yoga",mod7Intro: "This module gives you the confidence to take your yoga classes to the next level.",
      mod8Title: "Module 8: Knowledge of Asanas (Yoga Postures)",mod8Intro: "By the end of your training, you will have learned all the poses known in Ashtanga Yoga.",
      ashtangaH2: "Module 8.1: Ashtanga Vinyasa Yoga",
      ashtangaSubtitle: "Discover the transformative practice that synchronizes breath with movement",
      ashtangaImgAlt: "Ashtanga Vinyasa Yoga",
      ashtangaPill1: "📋 Breath-synchronized movement", ashtangaPill2: "🧠 Calms the mind", ashtangaPill3: "🕉️ Ancient practice with modern application",
      primarySeriesH3: "Primary Series Curriculum", primarySeriesSubtext: "All students of 200 hour yoga teacher training will practice primary series which includes:",
      hathaH2: "Module 8.2: Hatha Yoga",
      hathaSubtitle: "Discover the traditional, ancient and classical yoga practice",
      hathaImgAlt: "Hatha Yoga",
      hathaPill1: "📋 Traditional & Ancient Practice", hathaPill2: "🎓 YCB Certification Board Level-I", hathaPill3: "✋ Expert Guidance & Correction",
      asanasH2: "Hatha Yoga Asanas",
      asanasSubtext: "Master these essential postures as part of your comprehensive training",
      evalH2: "Evolution and certification",
      accommodationH2: "Accommodation", foodH2: "Food",
      luxuryH2: "LUXURY ROOM & FEATURES", indianFeeH2: "200 Hour Course Fee for Indian Students",
      scheduleH2: "200 Hour yoga teacher training in india - Yoga Class Schedule",
      moreInfoH2: "More Information: 200 Hour Yoga School in Rishikesh",
      eligibilityInfoTitle: "Eligibility criteria for attending 200 hour yoga teacher training India:",
      eligibilityInfoText: "A curious mind to learn and practice yoga, basic English knowledge, and self-discipline is all that you need.",
      visaPassportTitle: "Visa And Passport:",
      spanishChineseNote: "(For Spanish & Chinese medium of instruction, please inform us over an email for the confirmation of the course dates)",
      ctaTitle: "We welcome you to AYM School for a wonderful yogic experience!",
      ctaSubtitle: "Join us & become part of the 5000+ international yoga teachers who are proud alumni.",
      ctaPhone: "+91-9528023390", ctaApplyBtnText: "Apply Now",
      newProgramsH2: "Our New 200 Hour Yoga Programs",
      newProgramsSubtext: "Expand your teaching expertise with our specialized certification combinations",
      globalCertH2: "Learn the Art of Yoga and Meditation with Experts - Get Globally Certified",
      requirementsH2: "The requirements to be enrolled in this 200 hour Yoga Teacher Training program Rishikesh at AYM YOGA SCHOOL:",
      requirementsImgAlt: "Yoga practitioner",
      whatYouNeedH2: "What you need to know before start 200 hour yoga teacher training in Rishikesh",
      best200HrH4: "Best 200 hour yoga teacher training in India",
      whatsIncludedH4: "What's Included in Fee:",
      reviewsH2: "Student Reviews & Success Stories",
      reviewsSubtext: "Authentic stories of transformation from students who began just like you.",
      videosH2: "Video Testimonials",
      video1Label: "", video1Url: "", video1Thumb: "",
      video2Label: "", video2Url: "", video2Thumb: "",
      video3Label: "", video3Url: "", video3Thumb: "",
      bookingH2: "How to book your spot?",
      step1Icon: "💻", step1Title: "Apply Now",        step2Icon: "👍", step2Title: "Confirmation",
      step3Icon: "🏛",  step3Title: "Advance-Deposit", step4Icon: "📝", step4Title: "Refund Rules",
      faqH2: "Frequently Asked Questions",
    }
  });

  const w = watch();

  /* ── submit ── */
  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (isEditorEmpty(ip1Ref.current))         { setIp1Err("Required"); hasErr = true; }
    if (isEditorEmpty(ip2Ref.current))         { setIp2Err("Required"); hasErr = true; }
    if (isEditorEmpty(ip3Ref.current))         { setIp3Err("Required"); hasErr = true; }
    if (isEditorEmpty(ip4Ref.current))         { setIp4Err("Required"); hasErr = true; }
    if (isEditorEmpty(aimsIntroRef.current))   { setAimsErr("Required"); hasErr = true; }
    if (isEditorEmpty(syllabusIntroRef.current)){ setSylErr("Required"); hasErr = true; }
    if (isEditorEmpty(ashtangaRef.current))    { setAstErr("Required"); hasErr = true; }
    if (isEditorEmpty(hathaRef.current))       { setHtErr("Required");  hasErr = true; }
    if (isEditorEmpty(evalRef.current))        { setEvErr("Required");  hasErr = true; }
    if (!heroFile) { setHeroErr("Hero image is required"); hasErr = true; }
    if (hasErr) return;
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
      const richMap: [string, string][] = [
        ["introPara1", ip1Ref.current], ["introPara2", ip2Ref.current],
        ["introPara3", ip3Ref.current], ["introPara4", ip4Ref.current],
        ["aimsIntro", aimsIntroRef.current], ["aimsOutro", aimsOutroRef.current],
        ["syllabusIntro", syllabusIntroRef.current],
        ["mod1Body", mod1Ref.current], ["mod2Body", mod2Ref.current],
        ["mod3Body", mod3Ref.current], ["mod4Body", mod4Ref.current],
        ["mod5Body", mod5Ref.current], ["mod6Body", mod6Ref.current],
        ["mod7Body", mod7Ref.current], ["mod8Body", mod8Ref.current],
        ["ashtangaDesc", ashtangaRef.current], ["primaryIntro", primaryRef.current],
        ["hathaDesc", hathaRef.current], ["evalDesc", evalRef.current],
        ["scheduleDesc", schedDescRef.current], ["visaText", visaRef.current],
        ["globalCertPara1", globalCert1Ref.current], ["globalCertPara2", globalCert2Ref.current],
        ["reqPara1", req1Ref.current], ["reqPara2", req2Ref.current],
        ["reqPara3", req3Ref.current], ["reqPara4", req4Ref.current],
        ["best200HrPara", best200HrRef.current],
        ["step1Text", step1Ref.current], ["step2Text", step2Ref.current],
        ["step3Text", step3Ref.current], ["step4Text", step4Ref.current],
      ];
      richMap.forEach(([k, v]) => fd.append(k, v));
      programs.forEach((_, i) => fd.append(`prog${i}Desc`, progRefs.current[i].current));
      reviews.forEach((_, i)  => fd.append(`review${i}Text`, revRefs.current[i].current));
      aimsBullets.forEach(v  => fd.append("aimsBullets", v));
      inclFee.forEach(v      => fd.append("includedFee", v));
      notInclFee.forEach(v   => fd.append("notIncludedFee", v));
      [mod1Items,mod2Items,mod3Items,mod4Items,mod5Items,mod6Items,mod7Items,mod8Items]
        .forEach((arr, i) => arr.forEach(v => fd.append(`mod${i+1}Items`, v)));
      foundItems.forEach(v   => fd.append("foundationItems", v));
      luxFeatures.forEach(v  => fd.append("luxuryFeatures", v));
      whatIncl.forEach(v     => fd.append("whatIncluded", v));
      fd.append("scheduleRows",    JSON.stringify(schedRows));
      fd.append("instructionLangs",JSON.stringify(instrLangs));
      fd.append("indianFees",      JSON.stringify(indianFees));
      fd.append("hatha43",         JSON.stringify(hatha43));
      fd.append("weekGrid",        JSON.stringify(weekGrid));
      fd.append("programs",        JSON.stringify(programs));
      fd.append("reviews",         JSON.stringify(reviews));
      fd.append("faqItems",        JSON.stringify(faqItems));
      fd.append("knowQA",          JSON.stringify(knowQA));
      fd.append("heroImage", heroFile!);
      if (ashtangaFile)  fd.append("ashtangaImage",    ashtangaFile);
      if (hathaFile)     fd.append("hathaImage",        hathaFile);
      if (reqImgFile)    fd.append("requirementsImage", reqImgFile);
      accomFiles.forEach(f   => fd.append("accommodationImages", f));
      foodFiles.forEach(f    => fd.append("foodImages", f));
      luxImgFiles.forEach(f  => fd.append("luxuryImages", f));
      schedImgFiles.forEach(f => fd.append("scheduleImages", f));
      await api.post("/yoga-200hr/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/dashboard/yoga-200hr"), 1500);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally { setIsSubmitting(false); }
  };

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Page Saved!</h2>
        <p className={styles.successText}>Redirecting…</p>
      </div>
    </div>
  );

  /* ── row update helpers ── */
  const upd = <T,>(arr: T[], set: (v: T[]) => void, i: number, k: keyof T, v: string) => {
    const a = [...arr] as any[]; a[i] = { ...a[i], [k]: v }; set(a);
  };

  return (
    <div className={styles.formPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/dashboard/yoga-200hr")}>200 Hour Yoga</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add New Page</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Add New — 200 Hour Yoga Page</h1>
          <p className={styles.pageSubtitle}>Fill in every content field for the 200hr page</p>
        </div>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════════════════ 1. HERO ════════════════ */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" hint="Big title shown on the page">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageMainH1")} /></div>
          </F>
          <F label="Hero Image" req hint="Main banner — Recommended 1180×540px">
            <SingleImageUpload preview={heroPrev} badge="Hero" hint="SVG / JPG / PNG · 1180×540px" error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); }} />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroImgAlt")} /></div>
          </F>
        </Sec>

        <D />

        {/* ════════════════ 2. INTRO PARAGRAPHS ════════════════ */}
        <Sec title="Introduction Paragraphs">
          <JoditField label="Paragraph 1 — Main Introduction" contentRef={ip1Ref} error={ip1Err} onClearError={() => setIp1Err("")} placeholder="Yoga means union, connection…" height={200} />
          <JoditField label="Paragraph 2 — Years of Experience" contentRef={ip2Ref} error={ip2Err} onClearError={() => setIp2Err("")} placeholder="With 25 Years of Experience…" height={200} />
          <JoditField label="Paragraph 3 — Daily Schedule Overview" contentRef={ip3Ref} error={ip3Err} onClearError={() => setIp3Err("")} placeholder="Each day of the 200-hour course includes sessions…" height={200} />
          <JoditField label="Paragraph 4 — Yoga Alliance" contentRef={ip4Ref} error={ip4Err} onClearError={() => setIp4Err("")} placeholder="We are among the best 200-hour yoga ttc schools…" height={200} />
        </Sec>

        <D />

        {/* ════════════════ 3. STATS ════════════════ */}
        <Sec title="Stats Cards (4 cards)">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Stat Card {n}</span></div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid3}>
                  <F label="Icon (emoji)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Icon` as any)} /></div></F>
                  <F label="Value"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Val` as any)} /></div></F>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Title` as any)} /></div></F>
                </div>
                <F label="Description"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`stat${n}Desc` as any)} /></div></F>
              </div>
            </div>
          ))}
        </Sec>

        <D />

        {/* ════════════════ 4. AIMS ════════════════ */}
        <Sec title="Aims & Objectives Section">
          <F label="Section H3 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("aimsH3")} /></div>
          </F>
          <JoditField label="Aims Introduction Paragraph" contentRef={aimsIntroRef} error={aimsErr} onClearError={() => setAimsErr("")}
            placeholder="The 200 hour yoga teacher training in Rishikesh is carefully designed…" height={180} />
          <F label="'Key Objectives' Bold Label" hint="Bold sentence shown just before the bullet list">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("aimsKeyObjLabel")} /></div>
          </F>
          <F label="Aims Bullet Points">
            <StringListField items={aimsBullets} label="Aim" placeholder="To deepen personal practice…"
              onAdd={() => setAimsBullets([...aimsBullets, ""])}
              onRemove={i => setAimsBullets(aimsBullets.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...aimsBullets]; a[i] = v; setAimsBullets(a); }} />
          </F>
          <JoditOpt label="Aims Outro Paragraph" contentRef={aimsOutroRef}
            placeholder="The 200-hour yoga training at AYM Yoga School in Rishikesh offers…" height={180} />
        </Sec>

        <D />

        {/* ════════════════ 5. OVERVIEW ════════════════ */}
        <Sec title="Course Overview Box">
          <F label="Overview H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewH2")} /></div>
          </F>
          <div className={styles.grid2}>
            <F label="Certification Name"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCertName")} /></div></F>
            <F label="Course Level"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLevel")} /></div></F>
          </div>
          <F label="Requirement / Eligibility (full text)" hint="Shown as paragraph in overview box">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={2} {...register("overviewEligibility")} /></div>
          </F>
          <div className={styles.grid3}>
            <F label="Minimum Age"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewMinAge")} /></div></F>
            <F label="Credit Points"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCredits")} /></div></F>
            <F label="Language(s)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLanguage")} /></div></F>
          </div>
        </Sec>

        <D />

        {/* ════════════════ 6. UPCOMING DATES (headings/note only) ════════════════ */}
        {/* ⚠️ CHANGE: Removed "Table Note / Early Bird Discount Text" field — only H2 and sub-text remain */}
        <Sec title="Upcoming Course Dates — Headings Only" badge="Data from DB">
          <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
            ℹ️ Date rows are managed separately in the database. Here you only set the section headings.
          </p>
          <div className={styles.grid2}>
            <F label="Section H2 Heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesH2")} /></div>
            </F>
            <F label="Sub-text below heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesSubtext")} /></div>
            </F>
          </div>
        </Sec>

        <D />

        {/* ════════════════ 7. FEE INCLUDED / NOT INCLUDED ════════════════ */}
        <Sec title="Fee — Included & Not Included">
          <F label="Included Section Title">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeIncludedTitle")} /></div>
          </F>
          <F label="Included Items">
            <StringListField items={inclFee} label="Item" placeholder="Six days of yoga, meditation and theory classes…"
              onAdd={() => setInclFee([...inclFee, ""])}
              onRemove={i => setInclFee(inclFee.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...inclFee]; a[i] = v; setInclFee(a); }} />
          </F>
          <div style={{ marginTop: "1.2rem" }}>
            <F label="Not Included Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeNotIncludedTitle")} /></div>
            </F>
          </div>
          <F label="Not Included Items">
            <StringListField items={notInclFee} label="Item" placeholder="Any Airfare."
              onAdd={() => setNotInclFee([...notInclFee, ""])}
              onRemove={i => setNotInclFee(notInclFee.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...notInclFee]; a[i] = v; setNotInclFee(a); }} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 8. SYLLABUS ════════════════ */}
        <Sec title="Syllabus Section">
          <F label="Syllabus H3 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("syllabusH3")} /></div>
          </F>
          <JoditField label="Syllabus Introduction (YCB & Yoga Alliance)" contentRef={syllabusIntroRef} error={sylErr} onClearError={() => setSylErr("")}
            placeholder="It is our commitment as yoga school to provide a safe environment…" height={250} />
        </Sec>

        <D />

        {/* ════════════════ 9–16. MODULES 1–8 ════════════════ */}
        {([
          ["1", "Philosophy of Yoga",             mod1Items, setMod1Items, mod1Ref],
          ["2", "Pranayama",                      mod2Items, setMod2Items, mod2Ref],
          ["3", "Shat Kriyas (Cleansing Detox)",  mod3Items, setMod3Items, mod3Ref],
          ["4", "Anatomy and Physiology",         mod4Items, setMod4Items, mod4Ref],
          ["5", "Knowledge of Meditation",        mod5Items, setMod5Items, mod5Ref],
          ["6", "Mantras, Chants, and Prayers",   mod6Items, setMod6Items, mod6Ref],
          ["7", "Mastering the Art of Teaching",  mod7Items, setMod7Items, mod7Ref],
          ["8", "Knowledge of Asanas",            mod8Items, setMod8Items, mod8Ref],
        ] as const).map(([num, name, items, setItems, bodyRef]) => {
          const addI  = () => (setItems as any)([...(items as string[]), ""]);
          const rmI   = (i: number) => (setItems as any)((items as string[]).filter((_: any, x: number) => x !== i));
          const upI   = (i: number, v: string) => { const a = [...(items as string[])]; a[i] = v; (setItems as any)(a); };
          return (
            <div key={num}>
              <Sec title={`Module ${num}: ${name}`}>
                <F label="Module Title">
                  <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`mod${num}Title` as any)} /></div>
                </F>
                <F label="Module Introduction Text">
                  <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} {...register(`mod${num}Intro` as any)} /></div>
                </F>
                <F label="Module Topics List">
                  <StringListField items={items as string[]} label="Topic" placeholder="Topic item…"
                    onAdd={addI} onRemove={rmI} onUpdate={upI} />
                </F>
                <JoditOpt label="Module Extra Rich Text (optional)" contentRef={bodyRef as any} placeholder="Additional description in rich text…" height={160} />
              </Sec>
              <D />
            </div>
          );
        })}

        {/* ════════════════ 17. ASHTANGA ════════════════ */}
        <Sec title="Module 8.1 — Ashtanga Vinyasa Yoga">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ashtangaH2")} /></div>
          </F>
          <F label="Sub-heading / Tagline">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ashtangaSubtitle")} /></div>
          </F>
          <F label="Ashtanga Section Image" hint="Shown beside description — recommended 700×500px">
            <SingleImageUpload preview={ashtangaPrev} badge="Ashtanga" hint="JPG / PNG · 700×500px"
              onSelect={(f, p) => { setAshtangaFile(f); setAshtangaPrev(p); }}
              onRemove={() => { setAshtangaFile(null); setAshtangaPrev(""); }} />
          </F>
          <F label="Ashtanga Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Ashtanga Vinyasa Yoga" {...register("ashtangaImgAlt")} /></div>
          </F>
          <JoditField label="Ashtanga Description" contentRef={ashtangaRef} error={astErr} onClearError={() => setAstErr("")}
            placeholder="This form of yoga practice combines breath and body movements…" height={200} />
          <div className={styles.grid3}>
            {[1, 2, 3].map(n => (
              <F key={n} label={`Feature Pill ${n}`}>
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`ashtangaPill${n}` as any)} /></div>
              </F>
            ))}
          </div>
        </Sec>

        <D />

        {/* ════════════════ 18. PRIMARY SERIES ════════════════ */}
        <Sec title="Primary Series Curriculum">
          <F label="Section H3 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("primarySeriesH3")} /></div>
          </F>
          <F label="Sub-text below heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("primarySeriesSubtext")} /></div>
          </F>
          <JoditOpt label="Primary Series Introduction Paragraph" contentRef={primaryRef}
            placeholder="All students of 200 hour yoga teacher training will practice primary series…" height={180} />
          <F label="Foundation Items">
            <StringListField items={foundItems} label="Item" placeholder="Introduction to ashtanga vinyasa yoga and its guru"
              onAdd={() => setFoundItems([...foundItems, ""])}
              onRemove={i => setFoundItems(foundItems.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...foundItems]; a[i] = v; setFoundItems(a); }} />
          </F>
          {/* Week Grid */}
          <F label="Week-by-Week Grid Cards" hint="Each card: week label, icon, 2 practice items with descriptions">
            {weekGrid.map((w2, i) => (
              <div key={i} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Week Card {i + 1}</span>
                  <button type="button" className={styles.removeNestedBtn}
                    onClick={() => setWeekGrid(weekGrid.filter((_, x) => x !== i))}
                    disabled={weekGrid.length <= 1}>✕ Remove</button>
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Week Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.week} placeholder="Week 1" onChange={e => upd(weekGrid, setWeekGrid, i, "week", e.target.value)} /></div></F>
                    <F label="Icon (emoji)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.icon} placeholder="☀️" onChange={e => upd(weekGrid, setWeekGrid, i, "icon", e.target.value)} /></div></F>
                    <F label="Item 1 Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.t1} placeholder="Sun Salutation A" onChange={e => upd(weekGrid, setWeekGrid, i, "t1", e.target.value)} /></div></F>
                    <F label="Item 1 Description"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.d1} placeholder="Learning the foundational sequence…" onChange={e => upd(weekGrid, setWeekGrid, i, "d1", e.target.value)} /></div></F>
                    <F label="Item 2 Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.t2} placeholder="Sun Salutation B" onChange={e => upd(weekGrid, setWeekGrid, i, "t2", e.target.value)} /></div></F>
                    <F label="Item 2 Description"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={w2.d2} placeholder="Building strength and endurance…" onChange={e => upd(weekGrid, setWeekGrid, i, "d2", e.target.value)} /></div></F>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setWeekGrid([...weekGrid, { week: `Week ${weekGrid.length + 1}`, icon: "🧘", t1: "", d1: "", t2: "", d2: "" }])}>
              ＋ Add Week Card
            </button>
          </F>
        </Sec>

        <D />

        {/* ════════════════ 19. HATHA ════════════════ */}
        <Sec title="Module 8.2 — Hatha Yoga">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("hathaH2")} /></div>
          </F>
          <F label="Sub-heading / Tagline">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("hathaSubtitle")} /></div>
          </F>
          <F label="Hatha Section Image" hint="Shown beside description — recommended 700×500px">
            <SingleImageUpload preview={hathaPrev} badge="Hatha" hint="JPG / PNG · 700×500px"
              onSelect={(f, p) => { setHathaFile(f); setHathaPrev(p); }}
              onRemove={() => { setHathaFile(null); setHathaPrev(""); }} />
          </F>
          <F label="Hatha Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Hatha Yoga" {...register("hathaImgAlt")} /></div>
          </F>
          <JoditField label="Hatha Description" contentRef={hathaRef} error={htErr} onClearError={() => setHtErr("")}
            placeholder="Hatha yoga is the traditional, ancient and classical yoga…" height={200} />
          <div className={styles.grid3}>
            {[1, 2, 3].map(n => (
              <F key={n} label={`Feature Pill ${n}`}>
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`hathaPill${n}` as any)} /></div>
              </F>
            ))}
          </div>
        </Sec>

        <D />

        {/* ════════════════ 20. HATHA 43 ASANAS ════════════════ */}
        <Sec title="Hatha Yoga Asanas List" badge={`${hatha43.length} asanas`}>
          <div className={styles.grid2}>
            <F label="Section H2 Heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("asanasH2")} /></div>
            </F>
            <F label="Sub-text below heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("asanasSubtext")} /></div>
            </F>
          </div>
          {hatha43.map((a, i) => (
            <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
              <span className={styles.listNum}>{i + 1}</span>
              <div className={styles.inputWrap} style={{ width: 55, flexShrink: 0 }}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.n} placeholder="#" onChange={e => upd(hatha43, setHatha43, i, "n", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.name} placeholder="Asana name (e.g. Samasthiti, Tadasana)" onChange={e => upd(hatha43, setHatha43, i, "name", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={a.sub} placeholder="Sub name (e.g. Balance standing pose)" onChange={e => upd(hatha43, setHatha43, i, "sub", e.target.value)} />
              </div>
              <button type="button" className={styles.removeItemBtn} onClick={() => setHatha43(hatha43.filter((_, x) => x !== i))} disabled={hatha43.length <= 1}>✕</button>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setHatha43([...hatha43, { n: String(hatha43.length + 1), name: "", sub: "" }])}>＋ Add Asana</button>
        </Sec>

        <D />

        {/* ════════════════ 21. EVALUATION ════════════════ */}
        <Sec title="Evaluation & Certification">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evalH2")} /></div>
          </F>
          <JoditField label="Evaluation Description (marks, distribution)" contentRef={evalRef} error={evErr} onClearError={() => setEvErr("")}
            placeholder="There will be practical and theoretical exam…" height={220} />
        </Sec>

        <D />

        {/* ════════════════ 22. ACCOMMODATION IMAGES ════════════════ */}
        <Sec title="Accommodation">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("accommodationH2")} /></div>
          </F>
          <F label="Accommodation Images" hint="Shown in the photo slider — up to 8 photos">
            <MultiImageUpload files={accomFiles} previews={accomPrevs} hint="JPG/PNG · 400px wide" label="Room"
              onSelect={(f, p) => { setAccomFiles(f); setAccomPrevs(p); }}
              onRemove={i => { setAccomFiles(accomFiles.filter((_, x) => x !== i)); setAccomPrevs(accomPrevs.filter((_, x) => x !== i)); }}
              maxFiles={8} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 23. FOOD IMAGES ════════════════ */}
        <Sec title="Food">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("foodH2")} /></div>
          </F>
          <F label="Food Images" hint="Shown in the food photo slider — up to 8 photos">
            <MultiImageUpload files={foodFiles} previews={foodPrevs} hint="JPG/PNG · 400px wide" label="Food"
              onSelect={(f, p) => { setFoodFiles(f); setFoodPrevs(p); }}
              onRemove={i => { setFoodFiles(foodFiles.filter((_, x) => x !== i)); setFoodPrevs(foodPrevs.filter((_, x) => x !== i)); }}
              maxFiles={8} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 24. LUXURY ROOM ════════════════ */}
        <Sec title="Luxury Room & Features">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("luxuryH2")} /></div>
          </F>
          <F label="Luxury Features List">
            <StringListField items={luxFeatures} label="Feature" placeholder="Accommodation (Private)"
              onAdd={() => setLuxFeatures([...luxFeatures, ""])}
              onRemove={i => setLuxFeatures(luxFeatures.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...luxFeatures]; a[i] = v; setLuxFeatures(a); }} />
          </F>
          <F label="Luxury Room Images" hint="Images in the luxury grid — up to 4">
            <MultiImageUpload files={luxImgFiles} previews={luxImgPrevs} hint="JPG/PNG · 400px wide" label="Luxury" maxFiles={4}
              onSelect={(f, p) => { setLuxImgFiles(f); setLuxImgPrevs(p); }}
              onRemove={i => { setLuxImgFiles(luxImgFiles.filter((_, x) => x !== i)); setLuxImgPrevs(luxImgPrevs.filter((_, x) => x !== i)); }} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 25. INDIAN FEES ════════════════ */}
        <Sec title="Course Fee for Indian Students">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("indianFeeH2")} /></div>
          </F>
          {indianFees.map((fee, i) => (
            <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
              <span className={styles.listNum}>{i + 1}</span>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={fee.label} placeholder="Dormitory:" onChange={e => upd(indianFees, setIndianFees, i, "label", e.target.value)} />
              </div>
              <div className={`${styles.inputWrap} ${styles.listInput}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={fee.price} placeholder="20,999 INR" onChange={e => upd(indianFees, setIndianFees, i, "price", e.target.value)} />
              </div>
              <button type="button" className={styles.removeItemBtn} onClick={() => setIndianFees(indianFees.filter((_, x) => x !== i))} disabled={indianFees.length <= 1}>✕</button>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setIndianFees([...indianFees, { label: "", price: "" }])}>＋ Add Fee Tier</button>
        </Sec>

        <D />

        {/* ════════════════ 26. SCHEDULE ════════════════ */}
        <Sec title="Class Schedule">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("scheduleH2")} /></div>
          </F>
          <JoditOpt label="Schedule Introduction Paragraphs" contentRef={schedDescRef}
            placeholder="Planning on teaching yoga? This 200 RYT yoga teacher training…" height={180} />
          <F label="Schedule Rows (Time → Activity)">
            {schedRows.map((row, i) => (
              <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 200, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.time} placeholder="06:45 AM - 08:00 AM" onChange={e => upd(schedRows, setSchedRows, i, "time", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.activity} placeholder="Pranayama / Meditation" onChange={e => upd(schedRows, setSchedRows, i, "activity", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn} onClick={() => setSchedRows(schedRows.filter((_, x) => x !== i))} disabled={schedRows.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setSchedRows([...schedRows, { time: "", activity: "" }])}>＋ Add Row</button>
          </F>
          <F label="Schedule Section Images" hint="Images shown beside the schedule table — up to 4">
            <MultiImageUpload files={schedImgFiles} previews={schedImgPrevs} hint="JPG/PNG · 300px wide" label="Schedule" maxFiles={4}
              onSelect={(f, p) => { setSchedImgFiles(f); setSchedImgPrevs(p); }}
              onRemove={i => { setSchedImgFiles(schedImgFiles.filter((_, x) => x !== i)); setSchedImgPrevs(schedImgPrevs.filter((_, x) => x !== i)); }} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 27. MORE INFORMATION ════════════════ */}
        <Sec title="More Information Section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("moreInfoH2")} /></div>
          </F>
          {/* Instruction Languages */}
          <F label="Medium of Instruction Languages" hint="Each row: language name + note (e.g. course happens every month)">
            {instrLangs.map((row, i) => (
              <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 140, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.lang} placeholder="English" onChange={e => upd(instrLangs, setInstrLangs, i, "lang", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={row.note} placeholder="course happens every month" onChange={e => upd(instrLangs, setInstrLangs, i, "note", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn} onClick={() => setInstrLangs(instrLangs.filter((_, x) => x !== i))} disabled={instrLangs.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setInstrLangs([...instrLangs, { lang: "", note: "" }])}>＋ Add Language</button>
          </F>
          {/* Spanish / Chinese note */}
          <F label="Spanish & Chinese Note" hint="Text shown in parentheses after language list e.g. (For Spanish & Chinese…)">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("spanishChineseNote")} /></div>
          </F>
          {/* Eligibility */}
          <F label="Eligibility Criteria Sub-heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("eligibilityInfoTitle")} /></div>
          </F>
          <F label="Eligibility Criteria Text">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} {...register("eligibilityInfoText")} /></div>
          </F>
          {/* Visa */}
          <F label="Visa & Passport Sub-heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("visaPassportTitle")} /></div>
          </F>
          <JoditOpt label="Visa & Passport Information Paragraphs" contentRef={visaRef}
            placeholder="You may need to have a valid tourist visa…" height={200} />
        </Sec>

        <D />

        {/* ════════════════ 28. CTA BANNER ════════════════ */}
        <Sec title="CTA Banner">
          <F label="CTA Title">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaTitle")} /></div>
          </F>
          <div className={styles.grid3}>
            <F label="CTA Subtitle">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ctaSubtitle")} /></div>
            </F>
            <F label="Phone Number">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="+91-9528023390" {...register("ctaPhone")} /></div>
            </F>
            <F label="Apply Button Text">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Apply Now" {...register("ctaApplyBtnText")} /></div>
            </F>
          </div>
        </Sec>

        <D />

        {/* ════════════════ 29. NEW PROGRAMS (dynamic — unlimited) ════════════════ */}
        <Sec title="New 200 Hour Programs" badge={`${programs.length} programs`}>
          <div className={styles.grid2}>
            <F label="Section H2 Heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("newProgramsH2")} /></div>
            </F>
            <F label="Sub-text below heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("newProgramsSubtext")} /></div>
            </F>
          </div>
          {programs.map((prog, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Program {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setPrograms(programs.filter((_, x) => x !== i))}
                  disabled={programs.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.title} placeholder="200 Hour Course + Prenatal Yoga" onChange={e => upd(programs, setPrograms, i, "title", e.target.value)} /></div></F>
                  <F label="Duration"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.duration} placeholder="3 Weeks + 1 Week" onChange={e => upd(programs, setPrograms, i, "duration", e.target.value)} /></div></F>
                  <F label="Start Date"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.start} placeholder="03rd of Every Month" onChange={e => upd(programs, setPrograms, i, "start", e.target.value)} /></div></F>
                  <F label="Old Price (strikethrough)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.oldPrice} placeholder="$1148" onChange={e => upd(programs, setPrograms, i, "oldPrice", e.target.value)} /></div></F>
                  <F label="New Price"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={prog.price} placeholder="$1034 ( Dormitory )" onChange={e => upd(programs, setPrograms, i, "price", e.target.value)} /></div></F>
                </div>
                <JoditOpt label="Program Description" contentRef={progRefs.current[i]} placeholder="Program description…" height={140} />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn}
            onClick={() => setPrograms([...programs, { title: "", duration: "", start: "", oldPrice: "", price: "" }])}>
            ＋ Add New Program
          </button>
        </Sec>

        <D />

        {/* ════════════════ 30. GLOBALLY CERTIFIED ════════════════ */}
        <Sec title="Get Globally Certified Section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("globalCertH2")} /></div>
          </F>
          <JoditOpt label="Paragraph 1 — About Expert Teachers" contentRef={globalCert1Ref}
            placeholder="At Association for Yoga and Meditation, we have highly trained yoga teachers…" height={160} />
          <JoditOpt label="Paragraph 2 — Best 200hr School" contentRef={globalCert2Ref}
            placeholder="As the best 200 Hour Yoga Teacher Teaching Course in Rishikesh…" height={160} />
        </Sec>

        <D />

        {/* ════════════════ 31. REQUIREMENTS ════════════════ */}
        <Sec title="Requirements — Enrolment Section">
          <F label="Section Heading (H4 bold)" hint="e.g. The requirements to be enrolled…">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("requirementsH2")} /></div>
          </F>
          <F label="Requirements Section Image" hint="Shown beside the text — recommended 600×450px">
            <SingleImageUpload preview={reqImgPrev} badge="Requirements" hint="JPG / PNG · 600×450px"
              onSelect={(f, p) => { setReqImgFile(f); setReqImgPrev(p); }}
              onRemove={() => { setReqImgFile(null); setReqImgPrev(""); }} />
          </F>
          <F label="Requirements Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga practitioner" {...register("requirementsImgAlt")} /></div>
          </F>
          <JoditOpt label="Paragraph 1 — About RYT 200 / Yoga Alliance" contentRef={req1Ref}
            placeholder="AYM Yoga School provides a specialized 200 hour online yoga teacher training course…" height={160} />
          <JoditOpt label="Paragraph 2 — Basic Requirements" contentRef={req2Ref}
            placeholder="The basic requirements for a 200 hour RYT yoga training are…" height={160} />
          <JoditOpt label="Paragraph 3 — One Year Experience" contentRef={req3Ref}
            placeholder="The applicant must have, at the minimum, an entire year's Yoga experience…" height={140} />
          <JoditOpt label="Paragraph 4 — Anatomy Knowledge" contentRef={req4Ref}
            placeholder="The basics of anatomy should include some knowledge about muscles and joints…" height={140} />
        </Sec>

        <D />

        {/* ════════════════ 32. WHAT YOU NEED TO KNOW ════════════════ */}
        <Sec title="What You Need to Know — Q&A Blocks" badge={`${knowQA.length} blocks`}>
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("whatYouNeedH2")} /></div>
          </F>
          {knowQA.map((item, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Q&A Block {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setKnowQA(knowQA.filter((_, x) => x !== i))}
                  disabled={knowQA.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <F label="Question / Sub-heading">
                  <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.q} placeholder="What to expect in 200 hour yoga teacher training?" onChange={e => { const a = [...knowQA]; a[i] = { ...a[i], q: e.target.value }; setKnowQA(a); }} /></div>
                </F>
                <F label="Answer (separate paragraphs with double line break)">
                  <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={5} value={item.a} placeholder="Answer text…" onChange={e => { const a = [...knowQA]; a[i] = { ...a[i], a: e.target.value }; setKnowQA(a); }} /></div>
                </F>
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setKnowQA([...knowQA, { q: "", a: "" }])}>＋ Add Q&A Block</button>
        </Sec>

        <D />

        {/* ════════════════ 33. BEST 200HR ════════════════ */}
        <Sec title="Best 200 Hour Yoga Teacher Training — Paragraph">
          <F label="Sub-heading (H4)" hint="e.g. Best 200 hour yoga teacher training in India">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("best200HrH4")} /></div>
          </F>
          <JoditOpt label="Best 200hr Paragraph" contentRef={best200HrRef}
            placeholder="Where is the best yoga teacher training in the world? This is definitely in Rishikesh…" height={160} />
        </Sec>

        <D />

        {/* ════════════════ 34. WHAT'S INCLUDED IN FEE ════════════════ */}
        <Sec title="What's Included in Fee (Final List)">
          <F label="Sub-heading (H4)">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("whatsIncludedH4")} /></div>
          </F>
          <F label="Included Items">
            <StringListField items={whatIncl} label="Item" placeholder="Yoga course fee."
              onAdd={() => setWhatIncl([...whatIncl, ""])}
              onRemove={i => setWhatIncl(whatIncl.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...whatIncl]; a[i] = v; setWhatIncl(a); }} />
          </F>
        </Sec>

        <D />

        {/* ════════════════ 35. REVIEWS (dynamic — unlimited) — with Star Rating ════════════════ */}
        <Sec title="Student Reviews" badge={`${reviews.length} reviews`}>
          <div className={styles.grid2}>
            <F label="Section H2 Heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsH2")} /></div>
            </F>
            <F label="Sub-text below heading">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsSubtext")} /></div>
            </F>
          </div>
          {reviews.map((rev, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Review {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setReviews(reviews.filter((_, x) => x !== i))}
                  disabled={reviews.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Name">
                    <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={rev.name} placeholder="Belle Cheng" onChange={e => { const a = [...reviews]; a[i] = { ...a[i], name: e.target.value }; setReviews(a); }} /></div>
                  </F>
                  <F label="Role / Location">
                    <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={rev.role} placeholder="Certified Yoga Teacher" onChange={e => { const a = [...reviews]; a[i] = { ...a[i], role: e.target.value }; setReviews(a); }} /></div>
                  </F>
                </div>
                {/* ⚠️ CHANGE: Star rating field added */}
                <F label="Star Rating" hint="Click stars to set rating (1–5)">
                  <StarRatingPicker
                    value={rev.rating}
                    onChange={val => { const a = [...reviews]; a[i] = { ...a[i], rating: val }; setReviews(a); }}
                  />
                </F>
                <JoditOpt label="Review Text" contentRef={revRefs.current[i]} placeholder="Review text…" height={140} />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setReviews([...reviews, { name: "", role: "", rating: 5 }])}>＋ Add Review</button>
        </Sec>

        <D />

        {/* ════════════════ 36. VIDEO TESTIMONIALS ════════════════ */}
        <Sec title="Video Testimonials">
          <F label="Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("videosH2")} /></div>
          </F>
          {[1, 2, 3].map(n => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Video {n}</span></div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid3}>
                  <F label="Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Student Testimonial of AYM" {...register(`video${n}Label` as any)} /></div></F>
                  <F label="YouTube URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="https://youtube.com/watch?v=…" {...register(`video${n}Url` as any)} /></div></F>
                  <F label="Thumbnail URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="https://img.youtube.com/…" {...register(`video${n}Thumb` as any)} /></div></F>
                </div>
              </div>
            </div>
          ))}
        </Sec>

        <D />

        {/* ════════════════ 37. BOOKING STEPS ════════════════ */}
        <Sec title="How to Book — Steps (4)">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("bookingH2")} /></div>
          </F>
          {([
            [1, step1Ref], [2, step2Ref], [3, step3Ref], [4, step4Ref]
          ] as [number, React.MutableRefObject<string>][]).map(([n, ref]) => (
            <div key={n} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Step {n}</span></div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Icon (emoji)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`step${n}Icon` as any)} /></div></F>
                  <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register(`step${n}Title` as any)} /></div></F>
                </div>
                <JoditOpt label="Step Description" contentRef={ref} placeholder="Step description text…" height={130} />
              </div>
            </div>
          ))}
        </Sec>

        <D />

        {/* ════════════════ 38. FAQ ════════════════ */}
        <Sec title="Frequently Asked Questions" badge={`${faqItems.length} questions`}>
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("faqH2")} /></div>
          </F>
          {faqItems.map((item, i) => (
            <div key={i} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>FAQ {i + 1}</span>
                <button type="button" className={styles.removeNestedBtn}
                  onClick={() => setFaqItems(faqItems.filter((_, x) => x !== i))}
                  disabled={faqItems.length <= 1}>✕ Remove</button>
              </div>
              <div className={styles.nestedCardBody}>
                <F label="Question">
                  <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.q} placeholder="Is prior Yoga experience required to join the 200-hour YTT?" onChange={e => { const a = [...faqItems]; a[i] = { ...a[i], q: e.target.value }; setFaqItems(a); }} /></div>
                </F>
                <F label="Answer">
                  <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} value={item.a} placeholder="Answer text…" onChange={e => { const a = [...faqItems]; a[i] = { ...a[i], a: e.target.value }; setFaqItems(a); }} /></div>
                </F>
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])}>＋ Add FAQ</button>
        </Sec>

        <D />

        {/* ════════════════ 39. SEO & META — moved to bottom ════════════════ */}
        {/* ⚠️ CHANGE: SEO section moved from top to bottom */}
        <Sec title="SEO & Meta">
          <F label="Meta Title" req>
            <div className={`${styles.inputWrap} ${errors.metaTitle ? styles.inputError : ""}`}>
              <input className={styles.input} maxLength={70} placeholder="200 Hour Yoga Teacher Training in Rishikesh | AYM"
                {...register("metaTitle", { required: "Required" })} />
              <span className={`${styles.charCount} ${styles.charCountMid}`}>{w.metaTitle?.length ?? 0}/70</span>
            </div>
            {errors.metaTitle && <p className={styles.errorMsg}>⚠ {errors.metaTitle.message}</p>}
          </F>
          <F label="Meta Description" req>
            <div className={`${styles.inputWrap} ${errors.metaDesc ? styles.inputError : ""}`}>
              <textarea className={`${styles.input} ${styles.textarea}`} maxLength={160}
                placeholder="Short description for search engines..." {...register("metaDesc", { required: "Required" })} />
              <span className={styles.charCount}>{w.metaDesc?.length ?? 0}/160</span>
            </div>
            {errors.metaDesc && <p className={styles.errorMsg}>⚠ {errors.metaDesc.message}</p>}
          </F>
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="200-hour-yoga-teacher-training-rishikesh"
                  {...register("slug", { required: "Required" })} />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}
            </F>
            <F label="Meta Keywords">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="200 hour yoga, rishikesh..." {...register("metaKeywords")} /></div>
            </F>
          </div>
          <F label="Status">
            <div className={styles.selectWrap}>
              <select className={styles.select} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </F>
        </Sec>

      </div>{/* end formCard */}

      {/* ── Form Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/dashboard/yoga-200hr" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Page</>}
        </button>
      </div>

    </div>
  );
}