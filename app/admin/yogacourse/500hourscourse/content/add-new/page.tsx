"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ============================================================
// TYPES
// ============================================================

interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  pageMainH1: string;
  heroImgAlt: string;
  standApartH2: string;
  gainsH2: string;
  seatSectionH2: string;
  seatSectionSubtext: string;
  tableNoteText: string;
  tableNoteEmail: string;
  tableNoteAirportText: string;
  credibilityH2: string;
  durationH2: string;
  syllabusH2: string;
  eligibilityH3: string;
  evaluationH3: string;
  includedTitle: string;
  includedNote: string;
  notIncludedTitle: string;
  fictionH3: string;
  reviewsSectionH2: string;
  refundH3: string;
  refundPara: string;
  applyH3: string;
  applyPara: string;
  indianFeeH3: string;
}

interface IntroItem {
  paragraph: string;
  media: string;
  mediaAlt: string;
  mediaType: "image" | "video";
  mediaFile?: File;
}

interface ReviewItem {
  name: string;
  platform: string;
  initial: string;
  rating: number;
  text: string;
}

interface MultiImgItem {
  id: string;
  file?: File;
  preview: string;
  serverPath?: string;
}

interface SyllabusModule {
  label: string;
  text: string;
}

interface JoditEditorProps {
  onSave: (value: string) => void;
  value?: string;
  ph?: string;
  h?: number;
  err?: string;
}

interface MediaUploaderProps {
  preview: string;
  badge?: string;
  hint?: string;
  error?: string;
  onSelect: (file: File, previewUrl: string) => void;
  onRemove: () => void;
  type?: string;
  index?: number;
}

interface MultiImgProps {
  items: MultiImgItem[];
  onChange: (items: MultiImgItem[]) => void;
  hint?: string;
  max?: number;
  label?: string;
}

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

interface SecProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

interface FProps {
  label: string;
  hint?: string;
  req?: boolean;
  children: React.ReactNode;
}

interface ParaItem {
  id: string;
  value: string;
}

// ============================================================
// UTILITIES
// ============================================================

function makeConfig(ph: string, h: number) {
  return {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "middle" as const,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html" as const,
    buttons: [
      "bold", "italic", "underline", "strikethrough", "|",
      "font", "fontsize", "brush", "|", "paragraph", "align", "|",
      "ul", "ol", "|", "link", "|", "undo", "redo", "|",
      "selectall", "cut", "copy", "paste",
    ],
    uploader: { insertImageAsBase64URI: true },
    height: h,
    placeholder: ph,
    enter: "p" as const,
  };
}

function D() {
  return <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />;
}

function Sec({ title, badge, children }: SecProps) {
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

function F({ label, hint, req, children }: FProps) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

// ============================================================
// STABLE JODIT EDITOR
// ============================================================

const StableJodit = memo(function StableJodit({ onSave, value, ph = "Start typing…", h = 220, err }: JoditEditorProps) {
  const [visible, setVisible] = useState(false);
  const initialValue = useRef(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);
  const handleChange = useCallback((val: string) => onSaveRef.current(val), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
      {visible ? (
        <JoditEditor config={config} value={initialValue.current} onChange={handleChange} />
      ) : (
        <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

StableJodit.displayName = "StableJodit";

// ============================================================
// MEDIA UPLOADER
// ============================================================

function MediaUploader({ preview, badge, hint, error, onSelect, onRemove, type = "image", index = 0 }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isVideo = preview && (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov'));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelect(file, url);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div 
        className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}
        onClick={!preview ? handleClick : undefined}
      >
        <input
          type="file"
          accept={type === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif"}
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        
        {!preview ? (
          <div className={styles.imageUploadPlaceholder}>
            <span className={styles.imageUploadIcon}>{type === "video" ? "🎥" : "🖼️"}</span>
            <span className={styles.imageUploadText}>Click to Upload {type === "video" ? "Video" : "Image"}</span>
            <span className={styles.imageUploadSub}>{hint}</span>
          </div>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            {isVideo ? (
              <video src={preview} className={styles.imagePreview} controls />
            ) : (
              <img src={preview} alt="" className={styles.imagePreview} />
            )}
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction} onClick={handleClick}>✎ Change</span>
              <button type="button" className={styles.removeImageBtn} onClick={handleRemove}>✕</button>
            </div>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

// ============================================================
// MULTI IMAGE UPLOADER
// ============================================================

function MultiImg({ items, onChange, hint, max = 20, label = "Add Photos" }: MultiImgProps) {
  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: MultiImgItem[] = files.slice(0, max - items.length).map((f) => ({ 
      id: `img-${Date.now()}-${Math.random()}`, 
      file: f, 
      preview: URL.createObjectURL(f) 
    }));
    onChange([...items, ...newItems]);
    e.target.value = "";
  };

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  return (
    <div>
      {items.length === 0 && (
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem", minHeight: 148, border: "2px dashed rgba(224,123,0,0.35)", borderRadius: 10, background: "rgba(255,250,242,0.6)", cursor: "pointer", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "2rem", color: "rgba(224,123,0,0.4)" }}>🖼️</span>
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", fontWeight: 600, color: "#a07840", textTransform: "uppercase" }}>Click to Upload Photos</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "rgba(160,120,64,0.6)", fontStyle: "italic" }}>{hint}</span>
          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleAdd} />
        </label>
      )}
      {items.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
            {items.map((item) => (
              <div key={item.id} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid #e8d5b5", aspectRatio: "4/3", background: "#fdf7ee" }}>
                <img src={item.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button type="button" onClick={() => remove(item.id)} style={{ position: "absolute", top: 5, right: 5, width: "1.6rem", height: "1.6rem", borderRadius: "50%", background: "rgba(139,32,0,0.88)", border: "none", color: "#ffe0cc", fontSize: "0.6rem", cursor: "pointer", zIndex: 2 }}>✕</button>
              </div>
            ))}
            {items.length < max && (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.35rem", border: "2px dashed rgba(224,123,0,0.35)", borderRadius: 8, background: "rgba(255,250,242,0.6)", cursor: "pointer", aspectRatio: "4/3" }}>
                <span style={{ fontSize: "1.5rem", color: "rgba(224,123,0,0.5)" }}>＋</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem", color: "#a07840", fontStyle: "italic" }}>{label}</span>
                <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleAdd} />
              </label>
            )}
          </div>
          <p className={styles.fieldHint}>{hint} · <strong>{items.length}/{max}</strong> uploaded</p>
        </>
      )}
    </div>
  );
}

// ============================================================
// STAR RATING
// ============================================================

function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: (hover || value) >= star ? "#F15505" : "rgba(160,120,64,0.22)" }}>★</button>
      ))}
      {value > 0 && <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#a07840", fontStyle: "italic", marginLeft: "0.3rem" }}>{value} / 5</span>}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AddEdit500HrPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const isEdit = !!pageId && pageId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Single Images
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [shivaFile, setShivaFile] = useState<File | null>(null);
  const [shivaPrev, setShivaPrev] = useState("");
  const [evalImgFile, setEvalImgFile] = useState<File | null>(null);
  const [evalImgPrev, setEvalImgPrev] = useState("");

  // Multi Images
  const [accomImgs, setAccomImgs] = useState<MultiImgItem[]>([]);
  const [foodImgs, setFoodImgs] = useState<MultiImgItem[]>([]);

  // Enhanced Intro Items
  const [introItems, setIntroItems] = useState<IntroItem[]>([
    { paragraph: "Welcome to our transformative 500 hour yoga teacher training course in Rishikesh, India. This advanced program is designed for dedicated practitioners who want to deepen their practice and become certified yoga teachers.", media: "", mediaAlt: "Yoga teacher training in Rishikesh", mediaType: "image", mediaFile: undefined },
    { paragraph: "Our 500-hour Yoga Teacher Training is a comprehensive program that combines the wisdom of ancient yogic traditions with modern teaching methodologies. You'll learn advanced asanas, pranayama techniques, meditation practices, and yoga philosophy.", media: "", mediaAlt: "Advanced yoga practice", mediaType: "image", mediaFile: undefined },
  ]);

  // Dynamic Paragraph Lists
  const mkPara = (val = ""): ParaItem => ({ id: `p-${Date.now()}-${Math.random()}`, value: val });
  
  const [introParas, setIntroParas] = useState<ParaItem[]>([]);
  const [standApartParas, setStandApartParas] = useState<ParaItem[]>([]);
  const [gainsParas, setGainsParas] = useState<ParaItem[]>([]);
  const [credibilityParas, setCredibilityParas] = useState<ParaItem[]>([]);
  const [durationParas, setDurationParas] = useState<ParaItem[]>([]);
  const [syllabusParas, setSyllabusParas] = useState<ParaItem[]>([]);
  const [eligibilityParas, setEligibilityParas] = useState<ParaItem[]>([]);
  const [evaluationParas, setEvaluationParas] = useState<ParaItem[]>([]);
  const [fictionParas, setFictionParas] = useState<ParaItem[]>([]);

  // String Lists
  const [includedItems, setIncludedItems] = useState<string[]>([
    "6 days yoga, meditation, and theory classes in a week, Sunday is free day",
    "58 nights of accommodation with meals",
    "One AYM t-shirt",
    "One yoga Bag for books and study material.",
    "One tour to local attraction during the course.",
    "3 meals, tea, filtered water (seven days a week except for lunch on Sunday).",
    "Teaching material, Course manual, common yoga mat in studio (not personal)",
    "Yoga Anatomy, Teaching methodology, philosophy, Ayurveda theory classes",
    "Free Wi-Fi, self-service laundry (washing machine)",
    "Yoga Alliance recognized certification after graduation.",
  ]);
  const [notIncludedItems, setNotIncludedItems] = useState<string[]>([
    "Airfare.", "Airport pickup (Extra Charges Applicable).", "Bus/train transfer (Extra Charges Applicable).",
    "Spa/massage treatments (Extra Charges Applicable).", "Air conditioner room (Extra Charges Applicable).",
    "Heater for a room (Extra Charges Applicable).",
  ]);
  const [indianFees, setIndianFees] = useState<string[]>([
    "Dormitory: 44,999 INR", "Shared Room: 54,999 INR", "Private Room: 94,999 INR", "Luxury Room: 1,49,999 INR",
  ]);

  const [syllabusModules, setSyllabusModules] = useState<SyllabusModule[]>([
    { label: "The Yogic Philosophy:", text: "Here, you will learn the history of yoga, the various paths of yoga, Patanjali Yoga Sutras, etc." },
    { label: "Asana:", text: "Yoga Postures are taught in various styles (Hatha yoga, Ashtanga, Kundalini, Sivananda, power, flow, Iyengar style, etc.)" },
    { label: "Yoga Therapy:", text: "Sessions are planned in the second half of the 500 hours course on Yoga Therapy for the management of common diseases, etc." },
    { label: "Pranayama:", text: "Various types of breathing exercises are taught practically." },
    { label: "Meditation:", text: "Various methods of meditation are taught here." },
    { label: "Anatomy Sessions & Alignment Classes:", text: "These sessions give you an idea about the structure of the human body." },
    { label: "Yoga Teaching Techniques:", text: "Through these various techniques, you can manage a group of people when you conduct your yoga sessions." },
  ]);

  const [reviews, setReviews] = useState<ReviewItem[]>([
    { name: "", platform: "on Google", initial: "", rating: 5, text: "" },
  ]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<PageFormValues>({
    defaultValues: {
      slug: "500-hour-yoga-teacher-training-india", status: "Active",
      pageMainH1: "500 Hour Yoga Teacher Training Course in Rishikesh", heroImgAlt: "Yoga Students Group",
      standApartH2: "What makes AYM School's Yoga Teachers Training Courses stand apart from the rest?",
      gainsH2: "What do I gain from the 500 Hour Yoga Teacher Training Course in Rishikesh?",
      seatSectionH2: "500 Hour Yoga Teacher Training India – Upcoming Batches", seatSectionSubtext: "",
      tableNoteText: "Course Fee: 1649 USD (Including: Dormitory Stay and Food) | For the upgrade you accommodation send us E-mail. Available accommodation Categories: Shared, Private and Luxury.",
      tableNoteEmail: "", tableNoteAirportText: "Airport pick up from Delhi airport to Yoga school Rishikesh will cost 90 USD and Round Trip 150 USD.",
      credibilityH2: "What is The Credibility of This Course?", durationH2: "How Long is The Duration of The Course?",
      syllabusH2: "Overview of Syllabus", eligibilityH3: "What are the Eligibility Criteria?",
      evaluationH3: "Is there an Evaluation Process for the Course?",
      includedTitle: "Included in the package of 500-Hour Courses in India",
      includedNote: "All items in the above included list are part of the course package. And incase you opt out any of these items, we will not be initiating a refund for that particular item.",
      notIncludedTitle: "Not Included",
      fictionH3: "500 Hour Yoga Teacher Training in Rishikesh, India: Separating Fact from Fiction",
      reviewsSectionH2: "Student's Reviews",
      refundH3: "What are the Refund Rules for the Course Fee?",
      refundPara: "You can reserve your spot by paying an advance booking fee of 215 USD. However, for any reason, if you couldn't join on the given date, a refund cannot be issued, but you will be allowed to utilize the amount for booking another yoga TTC from AYM School within one year.",
      applyH3: "How to Apply for the Course?",
      applyPara: "Fill out the online application form, and once you get our approval you could transfer the initial advance payment fee (either through Paypal or through bank transfer) to reserve your seat. You will get an email acknowledgment once we receive the advance fee.",
      indianFeeH3: "500 Hour Course Fee for Indian Students",
    },
  });

  // ============================================================
  // FETCH DATA FOR EDIT
  // ============================================================

  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/yoga-500hr/content");
        const d = res.data.data;
        const fields: (keyof PageFormValues)[] = ["slug", "status", "pageMainH1", "heroImgAlt", "standApartH2", "gainsH2", "seatSectionH2", "seatSectionSubtext", "tableNoteText", "tableNoteEmail", "tableNoteAirportText", "credibilityH2", "durationH2", "syllabusH2", "eligibilityH3", "evaluationH3", "includedTitle", "includedNote", "notIncludedTitle", "fictionH3", "reviewsSectionH2", "refundH3", "refundPara", "applyH3", "applyPara", "indianFeeH3"];
        fields.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k]); });
        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.shivaImage) setShivaPrev(BASE_URL + d.shivaImage);
        if (d.evalImage) setEvalImgPrev(BASE_URL + d.evalImage);
        if (d.introItems?.length) {
          setIntroItems(d.introItems.map((item: any) => ({ 
            paragraph: item.paragraph || "", 
            media: item.media ? (item.media.startsWith("http") ? item.media : BASE_URL + item.media) : "", 
            mediaAlt: item.mediaAlt || "", 
            mediaType: item.mediaType || "image",
            mediaFile: undefined 
          })));
        }
        if (d.accomImages?.length) setAccomImgs(d.accomImages.map((src: string, i: number) => ({ id: `a${i}`, preview: BASE_URL + src, serverPath: src })));
        if (d.foodImages?.length) setFoodImgs(d.foodImages.map((src: string, i: number) => ({ id: `f${i}`, preview: BASE_URL + src, serverPath: src })));
        if (d.includedItems?.length) setIncludedItems(d.includedItems);
        if (d.notIncludedItems?.length) setNotIncludedItems(d.notIncludedItems);
        if (d.indianFees?.length) setIndianFees(d.indianFees);
        if (d.syllabusModules?.length) setSyllabusModules(d.syllabusModules);
        if (d.reviews?.length) setReviews(d.reviews);
        
        const toItems = (arr: string[] | undefined): ParaItem[] => arr?.length ? arr.map((v) => mkPara(v)) : [];
        if (d.introParas?.length) setIntroParas(toItems(d.introParas));
        if (d.standApartParas?.length) setStandApartParas(toItems(d.standApartParas));
        if (d.gainsParas?.length) setGainsParas(toItems(d.gainsParas));
        if (d.credibilityParas?.length) setCredibilityParas(toItems(d.credibilityParas));
        if (d.durationParas?.length) setDurationParas(toItems(d.durationParas));
        if (d.syllabusParas?.length) setSyllabusParas(toItems(d.syllabusParas));
        if (d.eligibilityParas?.length) setEligibilityParas(toItems(d.eligibilityParas));
        if (d.evaluationParas?.length) setEvaluationParas(toItems(d.evaluationParas));
        if (d.fictionParas?.length) setFictionParas(toItems(d.fictionParas));
      } catch {
        toast.error("Failed to load");
        router.push("/admin/yogacourse/500hourscourse/content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, pageId, router, setValue]);

  // ============================================================
  // SUBMIT HANDLER
  // ============================================================

  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev) { 
      setHeroErr("Hero image is required"); 
      return; 
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
      
      fd.append("introItems", JSON.stringify(introItems.map(item => ({ 
        paragraph: item.paragraph, 
        media: item.mediaFile ? "new_upload" : (item.media || "").replace(BASE_URL, ""), 
        mediaAlt: item.mediaAlt,
        mediaType: item.mediaType
      }))));
      introItems.forEach((item) => { if (item.mediaFile) fd.append(`introMedia`, item.mediaFile); });
      
      fd.append("introParas", JSON.stringify(introParas.map((p) => p.value)));
      fd.append("standApartParas", JSON.stringify(standApartParas.map((p) => p.value)));
      fd.append("gainsParas", JSON.stringify(gainsParas.map((p) => p.value)));
      fd.append("credibilityParas", JSON.stringify(credibilityParas.map((p) => p.value)));
      fd.append("durationParas", JSON.stringify(durationParas.map((p) => p.value)));
      fd.append("syllabusParas", JSON.stringify(syllabusParas.map((p) => p.value)));
      fd.append("eligibilityParas", JSON.stringify(eligibilityParas.map((p) => p.value)));
      fd.append("evaluationParas", JSON.stringify(evaluationParas.map((p) => p.value)));
      fd.append("fictionParas", JSON.stringify(fictionParas.map((p) => p.value)));
      fd.append("includedItems", JSON.stringify(includedItems));
      fd.append("notIncludedItems", JSON.stringify(notIncludedItems));
      fd.append("indianFees", JSON.stringify(indianFees));
      fd.append("syllabusModules", JSON.stringify(syllabusModules));
      fd.append("reviews", JSON.stringify(reviews));
      
      if (heroFile) fd.append("heroImage", heroFile);
      if (shivaFile) fd.append("shivaImage", shivaFile);
      if (evalImgFile) fd.append("evalImage", evalImgFile);
      
      const keptAccomPaths = accomImgs.filter((img) => img.serverPath).map((img) => img.serverPath as string);
      fd.append("existingAccomImages", JSON.stringify(keptAccomPaths));
      accomImgs.forEach((img) => { if (img.file) fd.append("accomImage", img.file); });
      
      const keptFoodPaths = foodImgs.filter((img) => img.serverPath).map((img) => img.serverPath as string);
      fd.append("existingFoodImages", JSON.stringify(keptFoodPaths));
      foodImgs.forEach((img) => { if (img.file) fd.append("foodImage", img.file); });
      
      if (isEdit) { 
        fd.append("_id", pageId); 
        await api.put(`/yoga-500hr/content/update/${pageId}`, fd, { headers: { "Content-Type": "multipart/form-data" } }); 
        toast.success("Page updated successfully"); 
      } else { 
        await api.post("/yoga-500hr/content/create", fd, { headers: { "Content-Type": "multipart/form-data" } }); 
        toast.success("Page created successfully"); 
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/500hourscourse/content"), 1500);
    } catch (e: any) { 
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (loadingData) return <div className={styles.loadingWrap}><span className={styles.spinner} /> Loading page data…</div>;
  if (submitted) return <div className={styles.successScreen}><div className={styles.successCard}><div className={styles.successOm}>ॐ</div><div className={styles.successCheck}>✓</div><h2 className={styles.successTitle}>500hr Page {isEdit ? "Updated" : "Saved"}!</h2><p className={styles.successText}>Redirecting to list…</p></div></div>;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/500hourscourse/content")}>500hr Content</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit 500 Hour Yoga TTC Page" : "Add New 500 Hour Yoga TTC Page"}</h1>
          <p className={styles.pageSubtitle}>Hero · Enhanced Intro · Stand Apart · Gains · Seat · Credibility · Syllabus · Included · Reviews · Footer</p>
        </div>
      </div>
      <div className={styles.ornament}><span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span></div>
      <div className={styles.formCard}>

        {/* HERO SECTION */}
        <Sec title="Hero Section" badge="Banner Image + H1">
          <F label="Page H1 Heading" req>
            <div className={`${styles.inputWrap} ${errors.pageMainH1 ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageMainH1", { required: "Required" })} />
            </div>
            {errors.pageMainH1 && <p className={styles.errorMsg}>⚠ {errors.pageMainH1.message}</p>}
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <MediaUploader 
              preview={heroPrev} 
              badge="Hero" 
              hint="JPG/PNG/WEBP · 1180×540px" 
              error={heroErr} 
              onSelect={(f: File, p: string) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }} 
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }} 
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroImgAlt")} /></div>
          </F>
        </Sec>
        <D />

        {/* ENHANCED INTRO SECTION */}
        <Sec title="Enhanced Intro Section" badge="Alternating Image-Text Layout">
          <F label="Intro Items" hint="Each item has a paragraph and an image/video. They will alternate left/right automatically on the frontend.">
            <div>
              {introItems.map((item, idx) => (
                <div key={idx} className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Item {idx + 1}</span>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button type="button" className={styles.removeNestedBtn} onClick={() => {
                        const newItems = [...introItems];
                        newItems[idx] = { ...newItems[idx], mediaType: item.mediaType === "image" ? "video" : "image", media: "", mediaFile: undefined };
                        setIntroItems(newItems);
                      }} style={{ background: "#f15505", color: "white", border: "none", padding: "0.2rem 0.6rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.7rem" }}>
                        Switch to {item.mediaType === "image" ? "Video" : "Image"}
                      </button>
                      {introItems.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setIntroItems(introItems.filter((_, i) => i !== idx))}>✕ Remove</button>}
                    </div>
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.fieldGroup} style={{ marginBottom: "1rem" }}>
                      <label className={styles.label} style={{ fontSize: "0.75rem" }}>Paragraph (Rich Text)</label>
                      <StableJodit value={item.paragraph} onSave={(val: string) => { const newItems = [...introItems]; newItems[idx] = { ...newItems[idx], paragraph: val }; setIntroItems(newItems); }} ph="Write your paragraph here..." h={200} />
                    </div>
                    <div className={styles.grid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} style={{ fontSize: "0.75rem" }}>{item.mediaType === "image" ? "Image" : "Video"}</label>
                        <MediaUploader 
                          key={`media-${idx}`}
                          preview={item.media || ""} 
                          badge={`Intro ${idx + 1}`} 
                          hint={item.mediaType === "image" ? "JPG/PNG/WEBP · 800×600px" : "MP4/WEBM · Max 50MB"} 
                          type={item.mediaType}
                          index={idx}
                          onSelect={(file: File, previewUrl: string) => { 
                            const newItems = [...introItems]; 
                            newItems[idx] = { ...newItems[idx], media: previewUrl, mediaFile: file }; 
                            setIntroItems(newItems); 
                          }} 
                          onRemove={() => { 
                            const newItems = [...introItems]; 
                            newItems[idx] = { ...newItems[idx], media: "", mediaFile: undefined }; 
                            setIntroItems(newItems); 
                          }} 
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} style={{ fontSize: "0.75rem" }}>Alt Text</label>
                        <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.mediaAlt || ""} placeholder="Description for accessibility" onChange={(e) => { const newItems = [...introItems]; newItems[idx] = { ...newItems[idx], mediaAlt: e.target.value }; setIntroItems(newItems); }} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setIntroItems([...introItems, { paragraph: "", media: "", mediaAlt: "", mediaType: "image", mediaFile: undefined }])}>＋ Add Intro Item</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* INTRO PARAGRAPHS (Fallback) */}
        <Sec title="Introduction Paragraphs (Fallback)" badge="Used if no Enhanced Intro Items exist">
          <F label="Section Heading (H1)" hint="Main title shown when using fallback mode">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageMainH1")} />
            </div>
          </F>
          <F label="Paragraphs" hint="These are used as fallback if no enhanced intro items are added above">
            <div>
              {introParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{introParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setIntroParas(introParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...introParas]; n[i] = { ...n[i], value: val }; setIntroParas(n); }} ph="Write introduction paragraph…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setIntroParas([...introParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* STAND APART */}
        <Sec title="What Makes AYM Stand Apart" badge="Card section">
          <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("standApartH2")} /></div></F>
          <F label="Paragraphs" hint="Rich text paragraphs for this section">
            <div>
              {standApartParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{standApartParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setStandApartParas(standApartParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...standApartParas]; n[i] = { ...n[i], value: val }; setStandApartParas(n); }} ph="Write what makes AYM stand apart…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setStandApartParas([...standApartParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* GAINS */}
        <Sec title="What Do I Gain Section" badge="Inside card block">
          <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("gainsH2")} /></div></F>
          <F label="Paragraphs" hint="Rich text paragraphs for Gains section">
            <div>
              {gainsParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{gainsParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setGainsParas(gainsParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...gainsParas]; n[i] = { ...n[i], value: val }; setGainsParas(n); }} ph="Write what students gain…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setGainsParas([...gainsParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
          <F label="Shiva / Yoga Image (shown below gains text)" hint="Recommended 900×480px">
            <MediaUploader preview={shivaPrev} badge="Gains" hint="JPG/PNG/WEBP · Wide banner" onSelect={(f: File, p: string) => { setShivaFile(f); setShivaPrev(p); }} onRemove={() => { setShivaFile(null); setShivaPrev(""); }} />
          </F>
        </Sec>
        <D />

        {/* SEAT SECTION */}
        <Sec title="Seat Booking Section — Headings Only" badge="⚠ Seat data managed separately">
          <div className={styles.infoBox}><span>ℹ️</span><span>Seat batches are managed from the <strong>Seats Management</strong> panel. Here you can only edit the heading and note text for this section.</span></div>
          <F label="Section H2 Title"><div className={styles.inputWrap}><input className={styles.input} {...register("seatSectionH2")} /></div></F>
          <F label="Sub-text below heading (optional)"><div className={styles.inputWrap}><input className={styles.input} {...register("seatSectionSubtext")} /></div></F>
          <F label="Table Note Text" hint="Shown below the seat table"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("tableNoteText")} /></div></F>
          <F label="Email for Accommodation Upgrade"><div className={styles.inputWrap}><input className={styles.input} {...register("tableNoteEmail")} /></div></F>
          <F label="Airport Pickup Note"><div className={styles.inputWrap}><input className={styles.input} {...register("tableNoteAirportText")} /></div></F>
        </Sec>
        <D />

        {/* ACCOMMODATION IMAGES */}
        <Sec title="Accommodation Images" badge="Carousel — up to 20">
          <F label="Upload Accommodation Photos" hint="JPG/PNG/WEBP · 400×300px each · Max 20">
            <MultiImg items={accomImgs} onChange={setAccomImgs} hint="400×300px recommended" max={20} label="Add Photos" />
          </F>
        </Sec>
        <D />

        {/* FOOD IMAGES */}
        <Sec title="Food Images" badge="Carousel — up to 20">
          <F label="Upload Food Photos" hint="JPG/PNG/WEBP · 400×300px each · Max 20">
            <MultiImg items={foodImgs} onChange={setFoodImgs} hint="400×300px recommended" max={20} label="Add Photos" />
          </F>
        </Sec>
        <D />

        {/* INDIAN FEES */}
        <Sec title="Indian Student Fee Chips" badge="Shown as fee chips">
          <F label="H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("indianFeeH3")} /></div></F>
          <F label="Fee Chips (one per line)">
            <div>
              <div className={styles.listItems}>
                {indianFees.map((val, i) => (
                  <div key={i} className={styles.listItemRow}>
                    <span className={styles.listNum}>{i + 1}</span>
                    <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={styles.input} value={val} onChange={(e) => { const n = [...indianFees]; n[i] = e.target.value; setIndianFees(n); }} /></div>
                    <button type="button" className={styles.removeItemBtn} onClick={() => { if (indianFees.length > 1) setIndianFees(indianFees.filter((_, idx) => idx !== i)); }}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={() => setIndianFees([...indianFees, ""])}>＋ Add Fee Chip</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* CREDIBILITY */}
        <Sec title="Credibility" badge="Inside card block">
          <F label="Credibility H2 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("credibilityH2")} /></div></F>
          <F label="Paragraphs">
            <div>
              {credibilityParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{credibilityParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setCredibilityParas(credibilityParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...credibilityParas]; n[i] = { ...n[i], value: val }; setCredibilityParas(n); }} ph="Write credibility info…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setCredibilityParas([...credibilityParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* DURATION */}
        <Sec title="Duration" badge="Inside card block">
          <F label="Duration H2 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("durationH2")} /></div></F>
          <F label="Paragraphs">
            <div>
              {durationParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{durationParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setDurationParas(durationParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...durationParas]; n[i] = { ...n[i], value: val }; setDurationParas(n); }} ph="Write duration info…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setDurationParas([...durationParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* SYLLABUS */}
        <Sec title="Overview of Syllabus" badge="Modules list">
          <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("syllabusH2")} /></div></F>
          <F label="Intro Paragraphs">
            <div>
              {syllabusParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{syllabusParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setSyllabusParas(syllabusParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...syllabusParas]; n[i] = { ...n[i], value: val }; setSyllabusParas(n); }} ph="Write syllabus intro…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setSyllabusParas([...syllabusParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
          <F label="Syllabus Modules">
            <div>
              {syllabusModules.map((mod, i) => (
                <div key={i} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Module {i + 1}</span>{syllabusModules.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setSyllabusModules(syllabusModules.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2}>
                      <div className={styles.fieldGroup}><label className={styles.label}>Label (bold)</label><div className={styles.inputWrap}><input className={styles.input} value={mod.label} onChange={(e) => { const n = [...syllabusModules]; n[i] = { ...n[i], label: e.target.value }; setSyllabusModules(n); }} /></div></div>
                      <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}><label className={styles.label}>Description</label><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} value={mod.text} onChange={(e) => { const n = [...syllabusModules]; n[i] = { ...n[i], text: e.target.value }; setSyllabusModules(n); }} /></div></div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setSyllabusModules([...syllabusModules, { label: "", text: "" }])}>＋ Add Module</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* ELIGIBILITY + EVALUATION */}
        <Sec title="Eligibility & Evaluation" badge="Two small cards + image">
          <div className={styles.grid2}>
            <div>
              <F label="Eligibility H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("eligibilityH3")} /></div></F>
              <F label="Eligibility Paragraphs">
                <div>
                  {eligibilityParas.map((para, i) => (
                    <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                      <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{eligibilityParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setEligibilityParas(eligibilityParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                      <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...eligibilityParas]; n[i] = { ...n[i], value: val }; setEligibilityParas(n); }} ph="Write eligibility criteria…" h={200} /></div>
                    </div>
                  ))}
                  <button type="button" className={styles.addItemBtn} onClick={() => setEligibilityParas([...eligibilityParas, mkPara()])}>＋ Add Paragraph</button>
                </div>
              </F>
              <F label="Evaluation H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("evaluationH3")} /></div></F>
              <F label="Evaluation Paragraphs">
                <div>
                  {evaluationParas.map((para, i) => (
                    <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                      <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{evaluationParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setEvaluationParas(evaluationParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                      <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...evaluationParas]; n[i] = { ...n[i], value: val }; setEvaluationParas(n); }} ph="Write evaluation process…" h={200} /></div>
                    </div>
                  ))}
                  <button type="button" className={styles.addItemBtn} onClick={() => setEvaluationParas([...evaluationParas, mkPara()])}>＋ Add Paragraph</button>
                </div>
              </F>
            </div>
            <div>
              <F label="Evaluation Side Image" hint="600×450px recommended">
                <MediaUploader preview={evalImgPrev} badge="Eval" hint="JPG/PNG/WEBP" onSelect={(f: File, p: string) => { setEvalImgFile(f); setEvalImgPrev(p); }} onRemove={() => { setEvalImgFile(null); setEvalImgPrev(""); }} />
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* INCLUDED / NOT INCLUDED */}
        <Sec title="Included / Not Included" badge="Two column list">
          <div className={styles.grid2}>
            <div>
              <F label="Included Section Title"><div className={styles.inputWrap}><input className={styles.input} {...register("includedTitle")} /></div></F>
              <F label="Included Items">
                <div>
                  <div className={styles.listItems}>
                    {includedItems.map((val, i) => (
                      <div key={i} className={styles.listItemRow}>
                        <span className={styles.listNum}>{i + 1}</span>
                        <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={styles.input} value={val} onChange={(e) => { const n = [...includedItems]; n[i] = e.target.value; setIncludedItems(n); }} /></div>
                        <button type="button" className={styles.removeItemBtn} onClick={() => { if (includedItems.length > 1) setIncludedItems(includedItems.filter((_, idx) => idx !== i)); }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className={styles.addItemBtn} onClick={() => setIncludedItems([...includedItems, ""])}>＋ Add Included Item</button>
                </div>
              </F>
              <F label="Included Note (bottom footnote)"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("includedNote")} /></div></F>
            </div>
            <div>
              <F label="Not Included Section Title"><div className={styles.inputWrap}><input className={styles.input} {...register("notIncludedTitle")} /></div></F>
              <F label="Not Included Items">
                <div>
                  <div className={styles.listItems}>
                    {notIncludedItems.map((val, i) => (
                      <div key={i} className={styles.listItemRow}>
                        <span className={styles.listNum}>{i + 1}</span>
                        <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={styles.input} value={val} onChange={(e) => { const n = [...notIncludedItems]; n[i] = e.target.value; setNotIncludedItems(n); }} /></div>
                        <button type="button" className={styles.removeItemBtn} onClick={() => { if (notIncludedItems.length > 1) setNotIncludedItems(notIncludedItems.filter((_, idx) => idx !== i)); }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className={styles.addItemBtn} onClick={() => setNotIncludedItems([...notIncludedItems, ""])}>＋ Add Not Included Item</button>
                </div>
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* FACT FROM FICTION */}
        <Sec title="Separating Fact from Fiction" badge="Bordered box section">
          <F label="Box H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("fictionH3")} /></div></F>
          <F label="Paragraphs">
            <div>
              {fictionParas.map((para, i) => (
                <div key={para.id} className={styles.nestedCard} style={{ marginBottom: "0.85rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Paragraph {i + 1}</span>{fictionParas.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setFictionParas(fictionParas.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}><StableJodit value={para.value} onSave={(val: string) => { const n = [...fictionParas]; n[i] = { ...n[i], value: val }; setFictionParas(n); }} ph="Write fact vs fiction content…" h={200} /></div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setFictionParas([...fictionParas, mkPara()])}>＋ Add Paragraph</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* STUDENT REVIEWS */}
        <Sec title="Student Reviews" badge="Star rating + Rich text review cards">
          <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("reviewsSectionH2")} /></div></F>
          <F label="Review Cards" hint="Each review has a 5-star rating and rich text body">
            <div>
              {reviews.map((r, i) => (
                <div key={i} className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
                  <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Review {i + 1}</span>{reviews.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))}>✕ Remove</button>}</div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2} style={{ marginBottom: "1rem" }}>
                      <div className={styles.fieldGroup}><label className={styles.label}>Reviewer Name</label><div className={styles.inputWrap}><input className={styles.input} value={r.name} onChange={(e) => { const n = [...reviews]; n[i] = { ...n[i], name: e.target.value }; setReviews(n); }} /></div></div>
                      <div className={styles.fieldGroup}><label className={styles.label}>Platform Label</label><div className={styles.inputWrap}><input className={styles.input} value={r.platform} onChange={(e) => { const n = [...reviews]; n[i] = { ...n[i], platform: e.target.value }; setReviews(n); }} /></div></div>
                      <div className={styles.fieldGroup}><label className={styles.label}>Initial (avatar fallback)</label><div className={styles.inputWrap}><input className={styles.input} value={r.initial} maxLength={2} onChange={(e) => { const n = [...reviews]; n[i] = { ...n[i], initial: e.target.value }; setReviews(n); }} /></div></div>
                    </div>
                    <div className={styles.fieldGroup}><label className={styles.label}>Star Rating</label><div className={styles.starRatingWrap}><StarRating value={r.rating} onChange={(val: number) => { const n = [...reviews]; n[i] = { ...n[i], rating: val }; setReviews(n); }} /></div></div>
                    <div className={styles.fieldGroup}><label className={styles.label}>Review Text <span className={styles.sectionBadge}>Rich Text</span></label><StableJodit value={r.text} onSave={(val: string) => { const n = [...reviews]; n[i] = { ...n[i], text: val }; setReviews(n); }} ph="Write the review here…" h={180} /></div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setReviews([...reviews, { name: "", platform: "on Google", initial: "", rating: 5, text: "" }])}>＋ Add Review</button>
            </div>
          </F>
        </Sec>
        <D />

        {/* REFUND + HOW TO APPLY */}
        <Sec title="Refund Rules & How to Apply" badge="Two info cards at bottom">
          <div className={styles.grid2}>
            <div>
              <F label="Refund Rules H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("refundH3")} /></div></F>
              <F label="Refund Paragraph"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={4} {...register("refundPara")} /></div></F>
            </div>
            <div>
              <F label="How to Apply H3 Heading"><div className={styles.inputWrap}><input className={styles.input} {...register("applyH3")} /></div></F>
              <F label="How to Apply Paragraph"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={4} {...register("applyPara")} /></div></F>
            </div>
          </div>
        </Sec>
        <D />

        {/* PAGE SETTINGS */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req><div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}><input className={styles.input} {...register("slug", { required: "Slug is required" })} /></div>{errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}</F>
            <F label="Status"><div className={styles.selectWrap}><select className={styles.select} {...register("status")}><option value="Active">Active</option><option value="Inactive">Inactive</option></select><span className={styles.selectArrow}>▾</span></div></F>
          </div>
        </Sec>

      </div>

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/500hourscourse/content" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> {isEdit ? "Update" : "Save"} 500hr Page</>}
        </button>
      </div>
    </div>
  );
}