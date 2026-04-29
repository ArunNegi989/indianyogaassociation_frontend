"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const joditConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: [
    "bold","italic","underline","strikethrough","|",
    "font","fontsize","brush","|",
    "paragraph","align","|",
    "ul","ol","|",
    "link","|",
    "undo","redo","|",
    "selectall","cut","copy","paste",
  ],
  uploader: { insertImageAsBase64URI: true },
  height: 200,
  placeholder: "",
} as any;

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

/* ════════════════════════════════════════
   UI HELPERS
════════════════════════════════════════ */
function D() {
  return (
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />
  );
}

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
        <span className={styles.labelIcon}>✦</span>
        {label}
        {req && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

/* ────────────────────────────────────────
   LazyJodit — ref-based, uncontrolled
──────────────────────────────────────── */
function LazyJodit({
  label, hint, cr, err, clr, ph = "Start typing…", h = 200, required = false,
}: {
  label: string; hint?: string; cr: React.MutableRefObject<string>;
  err?: string; clr?: () => void; ph?: string; h?: number; required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const initialValueRef = useRef(cr.current);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleChange = useCallback(
    (v: string) => {
      cr.current = v;
      if (clr && !isEmpty(v)) clr();
    },
    [cr, clr]
  );

  const config = useMemo(() => ({ ...joditConfig, placeholder: ph, height: h }), [ph, h]);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
        {visible ? (
          <JoditEditor
            value={initialValueRef.current}
            config={config}
            onChange={handleChange}
          />
        ) : (
          <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>
            ✦ Scroll to load editor…
          </div>
        )}
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* ────────────────────────────────────────
   InlineJodit — fully uncontrolled
──────────────────────────────────────── */
const InlineJodit = ({
  onChange,
  initialValue = "",
  ph = "Start typing…",
  h = 180,
}: {
  onChange: (v: string) => void;
  initialValue?: string;
  ph?: string;
  h?: number;
}) => {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(initialValue);

  useEffect(() => { onChangeRef.current = onChange; });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stableOnChange = useCallback((v: string) => {
    onChangeRef.current(v);
  }, []);

  const config = useMemo(() => ({ ...joditConfig, placeholder: ph, height: h }), [ph, h]);

  return (
    <div ref={wrapRef} style={{ minHeight: h, border: "1px solid #e8d5b5", borderRadius: 8 }}>
      {visible ? (
        <JoditEditor
          value={initialValueRef.current}
          config={config}
          onChange={stableOnChange}
        />
      ) : (
        <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", borderRadius: 8, color: "#bbb", fontSize: 13 }}>
          ✦ Scroll to load editor…
        </div>
      )}
    </div>
  );
};

/* ── Dynamic Rich Paragraph List ── */
type ParaItem = { id: string; content: string };

function DynamicParaList({
  items, onAdd, onUpdate, onRemove, addLabel, ph,
}: {
  items: ParaItem[];
  onAdd: () => void;
  onUpdate: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  addLabel: string;
  ph?: string;
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Paragraph {i + 1}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(item.id)}>
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <InlineJodit
              initialValue={item.content}
              onChange={(v) => onUpdate(item.id, v)}
              ph={ph}
            />
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={onAdd}>
        ＋ Add {addLabel}
      </button>
    </div>
  );
}

const addPara = (set: React.Dispatch<React.SetStateAction<ParaItem[]>>) =>
  set((p) => [...p, { id: `para-${Date.now()}`, content: "" }]);
const removePara = (set: React.Dispatch<React.SetStateAction<ParaItem[]>>, id: string) =>
  set((p) => p.filter((x) => x.id !== id));
const updatePara = (set: React.Dispatch<React.SetStateAction<ParaItem[]>>, id: string, v: string) =>
  set((p) => p.map((x) => (x.id === id ? { ...x, content: v } : x)));

/* ── String List ── */
function StrList({
  items, onAdd, onRemove, onUpdate, max = 30, ph, label,
}: {
  items: string[]; onAdd: () => void; onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void; max?: number; ph?: string; label: string;
}) {
  return (
    <>
      <div className={styles.listItems}>
        {items.map((val, i) => (
          <div key={i} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                value={val}
                placeholder={ph || "Enter item…"}
                onChange={(e) => onUpdate(i, e.target.value)}
              />
            </div>
            <button type="button" className={styles.removeItemBtn} onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
      )}
    </>
  );
}

/* ── Single image ── */
function SingleImg({
  preview, badge, hint, error, onSelect, onRemove, existingUrl,
}: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void; existingUrl?: string;
}) {
  const displayPreview = preview || (existingUrl ? `${BASE_URL}${existingUrl}` : "");
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${displayPreview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!displayPreview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={displayPreview} alt="" className={styles.imagePreview} />
            {existingUrl && !preview && (
              <span style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.5)", color: "#fff", fontSize: "0.7rem", padding: "2px 6px", borderRadius: 4, fontFamily: "Cormorant Garamond,serif" }}>
                Current
              </span>
            )}
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
            </div>
            <button type="button" className={styles.removeImageBtn} onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ── Multi-image carousel uploader ── */
type ImgItem = { id: string; file: File | null; preview: string; existingUrl?: string };

function MultiImg({ items, onAdd, onRemove, hint, label }: {
  items: ImgItem[]; onAdd: (f: File, p: string) => void;
  onRemove: (id: string) => void; hint: string; label: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.8rem" }}>
        {items.map((img) => {
          const src = img.preview || (img.existingUrl ? `${BASE_URL}${img.existingUrl}` : "");
          return (
            <div key={img.id} style={{ position: "relative", width: 130, height: 95, borderRadius: 8, overflow: "hidden", border: "1px solid #e8d5b5" }}>
              {src && <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {img.existingUrl && !img.file && (
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: "0.65rem", textAlign: "center", padding: "2px 0", fontFamily: "Cormorant Garamond,serif" }}>
                  Existing
                </span>
              )}
              <button type="button" className={styles.removeImageBtn} style={{ top: 4, right: 4 }} onClick={() => onRemove(img.id)}>✕</button>
            </div>
          );
        })}
        <label style={{ width: 130, height: 95, borderRadius: 8, border: "2px dashed rgba(224,123,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(255,250,242,0.6)", gap: "0.3rem" }}>
          <span style={{ fontSize: "1.4rem", color: "rgba(224,123,0,0.5)" }}>＋</span>
          <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "0.72rem", color: "#a07840", fontStyle: "italic" }}>{hint}</span>
          <input type="file" accept="image/*" multiple style={{ display: "none" }}
            onChange={(e) => { Array.from(e.target.files || []).forEach((f) => onAdd(f, URL.createObjectURL(f))); e.target.value = ""; }} />
        </label>
      </div>
      <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "0.8rem", color: "#a07840", fontStyle: "italic", margin: 0 }}>
        {items.length} {label} uploaded.
      </p>
    </div>
  );
}

/* ── Star Rating ── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => onChange(star)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", fontSize: "1.6rem", lineHeight: 1, color: star <= (hovered || value) ? "#e8a800" : "#d9cfc0", transition: "color 0.15s" }}>★</button>
      ))}
      <span style={{ marginLeft: "0.4rem", fontFamily: "Cormorant Garamond,serif", fontSize: "0.9rem", color: "#7a5c3a" }}>
        {value > 0 ? `${value} / 5` : "Not rated"}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════
   TYPES
════════════════════════════════════════ */
interface FaqItem { id: string; question: string; answer: string }
interface ScheduleItem { id: string; time: string; activity: string }
interface ReviewItem { id: string; name: string; role: string; rating: number; text: string }
interface YouTubeItem {
  id: string; title: string; sourceType: "url" | "file";
  videoId: string; file: File | null; filePreview: string; existingFileUrl?: string;
}
interface FormData {
  slug: string; status: "Active" | "Inactive";
  evolutionH2: string;
  evolutionRightImageAlt: string;
  evolutionBadgeText: string;
  evolutionBadgeSubtext: string;
  markDistH3: string; markDistSubText: string;
  markTotalLabel: string; markTotalText: string;
  markTheoryLabel: string; markTheoryText: string;
  markPracticalLabel: string; markPracticalText: string;
  careerH3: string;
  feeCard1Title: string; feeCard2Title: string;
  faqH2: string; accomH3: string; foodH3: string;
  luxuryH2: string; featuresH2: string; scheduleH3: string;
  learningH2: string;
  // Learning Images
  learningImage1Alt: string; learningImage1Label: string;
  learningImage2Alt: string; learningImage2Label: string;
  learningImage3Alt: string; learningImage3Label: string;
  // Eligibility
  eligibilityH2: string; eligibilityTag: string;
  eligibilityImageAlt: string;
  // Evaluation
  evaluationH2: string;
  evaluationMainImageAlt: string;
  evaluationSmallImageAlt: string;
  evaluationBadgeLine1: string; evaluationBadgeLine2: string;
  // Ethics
  ethicsH2: string; ethicsNaturalisticPara: string; ethicsQuote: string;
  ethicsImage1Alt: string; ethicsImage1Label: string;
  ethicsImage2Alt: string; ethicsImage2Label: string;
  diplomaBadgeLine1: string; diplomaBadgeLine2: string;
  // Misconceptions
  misconH2: string;
  // Reviews
  reviewsH2: string; reviewsSubtext: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT — EDIT
════════════════════════════════════════ */
export default function Edit300hrContent2() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const markPracticalDetailRef = useRef("");

  // Evolution Right Side Image
  const [evolutionRightFile, setEvolutionRightFile] = useState<File | null>(null);
  const [evolutionRightPreview, setEvolutionRightPreview] = useState("");
  const [evolutionRightExisting, setEvolutionRightExisting] = useState("");

  // Learning Outcomes Mosaic Images
  const [learningImage1File, setLearningImage1File] = useState<File | null>(null);
  const [learningImage1Prev, setLearningImage1Prev] = useState("");
  const [learningImage1Existing, setLearningImage1Existing] = useState("");
  
  const [learningImage2File, setLearningImage2File] = useState<File | null>(null);
  const [learningImage2Prev, setLearningImage2Prev] = useState("");
  const [learningImage2Existing, setLearningImage2Existing] = useState("");
  
  const [learningImage3File, setLearningImage3File] = useState<File | null>(null);
  const [learningImage3Prev, setLearningImage3Prev] = useState("");
  const [learningImage3Existing, setLearningImage3Existing] = useState("");

  // Eligibility Image
  const [eligibilityImageFile, setEligibilityImageFile] = useState<File | null>(null);
  const [eligibilityImagePrev, setEligibilityImagePrev] = useState("");
  const [eligibilityImageExisting, setEligibilityImageExisting] = useState("");

  // Evaluation Images
  const [evaluationMainImageFile, setEvaluationMainImageFile] = useState<File | null>(null);
  const [evaluationMainImagePrev, setEvaluationMainImagePrev] = useState("");
  const [evaluationMainImageExisting, setEvaluationMainImageExisting] = useState("");
  
  const [evaluationSmallImageFile, setEvaluationSmallImageFile] = useState<File | null>(null);
  const [evaluationSmallImagePrev, setEvaluationSmallImagePrev] = useState("");
  const [evaluationSmallImageExisting, setEvaluationSmallImageExisting] = useState("");

  // Ethics Images
  const [ethicsImage1File, setEthicsImage1File] = useState<File | null>(null);
  const [ethicsImage1Prev, setEthicsImage1Prev] = useState("");
  const [ethicsImage1Existing, setEthicsImage1Existing] = useState("");
  
  const [ethicsImage2File, setEthicsImage2File] = useState<File | null>(null);
  const [ethicsImage2Prev, setEthicsImage2Prev] = useState("");
  const [ethicsImage2Existing, setEthicsImage2Existing] = useState("");

  // Paragraph arrays
  const [evolutionParas, setEvolutionParas] = useState<ParaItem[]>([{ id: "ep1", content: "" }]);
  const [eligibilityParas, setEligibilityParas] = useState<ParaItem[]>([{ id: "elp1", content: "" }]);
  const [evaluationParas, setEvaluationParas] = useState<ParaItem[]>([{ id: "evp1", content: "" }]);
  const [ethicsParas, setEthicsParas] = useState<ParaItem[]>([{ id: "etp1", content: "" }]);
  const [misconParas, setMisconParas] = useState<ParaItem[]>([{ id: "mp1", content: "" }]);

  // String arrays
  const [careerItems, setCareerItems] = useState<string[]>([""]);
  const [feeCard1Items, setFeeCard1Items] = useState<string[]>([""]);
  const [feeCard2Items, setFeeCard2Items] = useState<string[]>([""]);
  const [luxuryFeatures, setLuxuryFeatures] = useState<string[]>([""]);
  const [featuresList, setFeaturesList] = useState<string[]>([""]);
  const [learningItems, setLearningItems] = useState<string[]>([""]);
  const [ethicsRules, setEthicsRules] = useState<string[]>([""]);
  const [misconItems, setMisconItems] = useState<string[]>([""]);

  // Complex arrays
  const [faqItems, setFaqItems] = useState<FaqItem[]>([{ id: "faq1", question: "", answer: "" }]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ id: "s1", time: "", activity: "" }]);
  const [reviews, setReviews] = useState<ReviewItem[]>([{ id: "r1", name: "", role: "", rating: 5, text: "" }]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeItem[]>([
    { id: "yt1", title: "", sourceType: "url", videoId: "", file: null, filePreview: "" },
  ]);

  // Other images
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [diplomaPrev, setDiplomaPrev] = useState("");
  const [diplomaExisting, setDiplomaExisting] = useState("");
  const [yogaGardenFile, setYogaGardenFile] = useState<File | null>(null);
  const [yogaGardenPrev, setYogaGardenPrev] = useState("");
  const [yogaGardenExisting, setYogaGardenExisting] = useState("");

  // Carousel images
  const [accomImages, setAccomImages] = useState<ImgItem[]>([]);
  const [foodImages, setFoodImages] = useState<ImgItem[]>([]);
  const [luxuryImages, setLuxuryImages] = useState<ImgItem[]>([]);
  const [scheduleImages, setScheduleImages] = useState<ImgItem[]>([]);

  const addImg = (s: React.Dispatch<React.SetStateAction<ImgItem[]>>) => (f: File, p: string) =>
    s((prev) => [...prev, { id: `img-${Date.now()}-${Math.random()}`, file: f, preview: p }]);
  const removeImg = (s: React.Dispatch<React.SetStateAction<ImgItem[]>>) => (id: string) =>
    s((prev) => prev.filter((x) => x.id !== id));

  const updNested = useCallback(<T,>(arr: T[], set: (v: T[]) => void, id: string, key: keyof T, val: any) => {
    set(arr.map((x: any) => (x.id === id ? { ...x, [key]: val } : x)) as T[]);
  }, []);

  const updYt = (id: string, key: keyof YouTubeItem, val: any) =>
    setYoutubeVideos((p) => p.map((x) => (x.id === id ? { ...x, [key]: val } : x)));
  const setYtFile = (id: string, f: File) =>
    setYoutubeVideos((p) => p.map((x) => x.id === id ? { ...x, file: f, filePreview: URL.createObjectURL(f) } : x));
  const removeYtFile = (id: string) =>
    setYoutubeVideos((p) => p.map((x) => (x.id === id ? { ...x, file: null, filePreview: "" } : x)));

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  /* ════════════════
     FETCH
  ════════════════ */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/yoga-300hr/content2/");
        const d = res.data?.data || res.data;

        if (!d) {
          setFetchError("No content record found. Please create one first.");
          return;
        }

        reset({
          slug: d.slug ?? "",
          status: d.status ?? "Active",
          evolutionH2: d.evolutionH2 ?? "",
          evolutionRightImageAlt: d.evolutionRightImageAlt ?? "",
          evolutionBadgeText: d.evolutionBadgeText ?? "Yoga Alliance",
          evolutionBadgeSubtext: d.evolutionBadgeSubtext ?? "RYT 500 Certified",
          markDistH3: d.markDistH3 ?? "",
          markDistSubText: d.markDistSubText ?? "",
          markTotalLabel: d.markTotalLabel ?? "",
          markTotalText: d.markTotalText ?? "",
          markTheoryLabel: d.markTheoryLabel ?? "",
          markTheoryText: d.markTheoryText ?? "",
          markPracticalLabel: d.markPracticalLabel ?? "",
          markPracticalText: d.markPracticalText ?? "",
          careerH3: d.careerH3 ?? "",
          feeCard1Title: d.feeCard1Title ?? "",
          feeCard2Title: d.feeCard2Title ?? "",
          faqH2: d.faqH2 ?? "",
          accomH3: d.accomH3 ?? "",
          foodH3: d.foodH3 ?? "",
          luxuryH2: d.luxuryH2 ?? "",
          featuresH2: d.featuresH2 ?? "",
          scheduleH3: d.scheduleH3 ?? "",
          learningH2: d.learningH2 ?? "",
          // Learning Images
          learningImage1Alt: d.learningImage1Alt ?? "",
          learningImage1Label: d.learningImage1Label ?? "",
          learningImage2Alt: d.learningImage2Alt ?? "",
          learningImage2Label: d.learningImage2Label ?? "",
          learningImage3Alt: d.learningImage3Alt ?? "",
          learningImage3Label: d.learningImage3Label ?? "",
          // Eligibility
          eligibilityH2: d.eligibilityH2 ?? "",
          eligibilityTag: d.eligibilityTag ?? "",
          eligibilityImageAlt: d.eligibilityImageAlt ?? "",
          // Evaluation
          evaluationH2: d.evaluationH2 ?? "",
          evaluationMainImageAlt: d.evaluationMainImageAlt ?? "",
          evaluationSmallImageAlt: d.evaluationSmallImageAlt ?? "",
          evaluationBadgeLine1: d.evaluationBadgeLine1 ?? "",
          evaluationBadgeLine2: d.evaluationBadgeLine2 ?? "",
          // Ethics
          ethicsH2: d.ethicsH2 ?? "",
          ethicsNaturalisticPara: d.ethicsNaturalisticPara ?? "",
          ethicsQuote: d.ethicsQuote ?? "",
          ethicsImage1Alt: d.ethicsImage1Alt ?? "",
          ethicsImage1Label: d.ethicsImage1Label ?? "",
          ethicsImage2Alt: d.ethicsImage2Alt ?? "",
          ethicsImage2Label: d.ethicsImage2Label ?? "",
          diplomaBadgeLine1: d.diplomaBadgeLine1 ?? "",
          diplomaBadgeLine2: d.diplomaBadgeLine2 ?? "",
          // Misconceptions
          misconH2: d.misconH2 ?? "",
          // Reviews
          reviewsH2: d.reviewsH2 ?? "",
          reviewsSubtext: d.reviewsSubtext ?? "",
        });

        // Evolution image
        if (d.evolutionRightImage) setEvolutionRightExisting(d.evolutionRightImage);
        
        // Learning Images
        if (d.learningImage1) setLearningImage1Existing(d.learningImage1);
        if (d.learningImage2) setLearningImage2Existing(d.learningImage2);
        if (d.learningImage3) setLearningImage3Existing(d.learningImage3);
        
        // Eligibility Image
        if (d.eligibilityImage) setEligibilityImageExisting(d.eligibilityImage);
        
        // Evaluation Images
        if (d.evaluationMainImage) setEvaluationMainImageExisting(d.evaluationMainImage);
        if (d.evaluationSmallImage) setEvaluationSmallImageExisting(d.evaluationSmallImage);

        // Ethics Images
        if (d.ethicsImage1) setEthicsImage1Existing(d.ethicsImage1);
        if (d.ethicsImage2) setEthicsImage2Existing(d.ethicsImage2);

        // LazyJodit ref pre-fill
        if (d.markPracticalDetail) markPracticalDetailRef.current = d.markPracticalDetail;

        // Paragraph arrays
        const toPara = (arr: string[] | undefined, prefix: string): ParaItem[] =>
          arr?.length ? arr.map((content, i) => ({ id: `${prefix}${i}`, content })) : [{ id: `${prefix}0`, content: "" }];

        if (d.evolutionParas?.length) setEvolutionParas(toPara(d.evolutionParas, "ep"));
        if (d.eligibilityParas?.length) setEligibilityParas(toPara(d.eligibilityParas, "elp"));
        if (d.evaluationParas?.length) setEvaluationParas(toPara(d.evaluationParas, "evp"));
        if (d.ethicsParas?.length) setEthicsParas(toPara(d.ethicsParas, "etp"));
        if (d.misconParas?.length) setMisconParas(toPara(d.misconParas, "mp"));

        // String lists
        const toStr = (arr?: string[]) => (Array.isArray(arr) && arr.length ? arr : [""]);
        if (d.careerItems) setCareerItems(toStr(d.careerItems));
        if (d.feeCard1Items) setFeeCard1Items(toStr(d.feeCard1Items));
        if (d.feeCard2Items) setFeeCard2Items(toStr(d.feeCard2Items));
        if (d.luxuryFeatures) setLuxuryFeatures(toStr(d.luxuryFeatures));
        if (d.featuresList) setFeaturesList(toStr(d.featuresList));
        if (d.learningItems) setLearningItems(toStr(d.learningItems));
        if (d.ethicsRules) setEthicsRules(toStr(d.ethicsRules));
        if (d.misconItems) setMisconItems(toStr(d.misconItems));

        // FAQ
        if (d.faqItems?.length)
          setFaqItems(d.faqItems.map((f: any, i: number) => ({ id: `faq${i}`, question: f.question ?? "", answer: f.answer ?? "" })));

        // Schedule
        if (d.scheduleItems?.length)
          setScheduleItems(d.scheduleItems.map((s: any, i: number) => ({ id: `s${i}`, time: s.time ?? "", activity: s.activity ?? "" })));

        // Reviews
        if (d.reviews?.length)
          setReviews(d.reviews.map((r: any, i: number) => ({ id: `r${i}`, name: r.name ?? "", role: r.role ?? "", rating: r.rating ?? 5, text: r.text ?? "" })));

        // YouTube videos
        if (d.youtubeVideos?.length)
          setYoutubeVideos(d.youtubeVideos.map((yt: any, i: number) => ({
            id: yt.id || `yt${i}`,
            title: yt.title || "",
            sourceType: yt.type ?? "url",
            videoId: yt.videoId ?? "",
            file: null,
            filePreview: "",
            existingFileUrl: yt.videoFile ?? "",
          })));

        // Other images
        if (d.diplomaImage) setDiplomaExisting(d.diplomaImage);
        if (d.yogaGardenImage) setYogaGardenExisting(d.yogaGardenImage);

        // Carousel images
        const toImgItems = (urls: string[] | undefined): ImgItem[] =>
          (urls || []).map((url, i) => ({ id: `existing-${i}-${Math.random()}`, file: null, preview: "", existingUrl: url }));
        if (d.accomImages) setAccomImages(toImgItems(d.accomImages));
        if (d.foodImages) setFoodImages(toImgItems(d.foodImages));
        if (d.luxuryImages) setLuxuryImages(toImgItems(d.luxuryImages));
        if (d.scheduleImages) setScheduleImages(toImgItems(d.scheduleImages));
      } catch (e: any) {
        setFetchError(e?.response?.data?.message || e?.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    })();
  }, [reset]);

  /* ════════════════
     SUBMIT
  ════════════════ */
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      // Paragraph arrays
      fd.append("evolutionParas", JSON.stringify(evolutionParas.map((p) => p.content)));
      fd.append("eligibilityParas", JSON.stringify(eligibilityParas.map((p) => p.content)));
      fd.append("evaluationParas", JSON.stringify(evaluationParas.map((p) => p.content)));
      fd.append("ethicsParas", JSON.stringify(ethicsParas.map((p) => p.content)));
      fd.append("misconParas", JSON.stringify(misconParas.map((p) => p.content)));
      fd.append("markPracticalDetail", markPracticalDetailRef.current);

      // String arrays
      careerItems.forEach((v) => fd.append("careerItems", v));
      feeCard1Items.forEach((v) => fd.append("feeCard1Items", v));
      feeCard2Items.forEach((v) => fd.append("feeCard2Items", v));
      luxuryFeatures.forEach((v) => fd.append("luxuryFeatures", v));
      featuresList.forEach((v) => fd.append("featuresList", v));
      learningItems.forEach((v) => fd.append("learningItems", v));
      ethicsRules.forEach((v) => fd.append("ethicsRules", v));
      misconItems.forEach((v) => fd.append("misconItems", v));

      // Complex arrays
      fd.append("faqItems", JSON.stringify(faqItems));
      fd.append("scheduleItems", JSON.stringify(scheduleItems));
      fd.append("reviews", JSON.stringify(reviews.map((r) => ({ name: r.name, role: r.role, rating: r.rating, text: r.text }))));

      // YouTube videos
      const ytMeta = youtubeVideos.map((yt) => ({
        id: yt.id, title: yt.title, type: yt.sourceType, videoId: yt.videoId,
        existingFileUrl: yt.existingFileUrl ?? "",
      }));
      fd.append("youtubeVideosMeta", JSON.stringify(ytMeta));
      youtubeVideos.forEach((yt) => { if (yt.sourceType === "file" && yt.file) fd.append(`ytFile_${yt.id}`, yt.file); });

      // Evolution Right Side Image
      if (evolutionRightFile) fd.append("evolutionRightImage", evolutionRightFile);
      else if (evolutionRightExisting && !evolutionRightPreview) fd.append("evolutionRightImageKeep", "true");

      // Learning Outcomes Mosaic Images
      if (learningImage1File) fd.append("learningImage1", learningImage1File);
      else if (learningImage1Existing && !learningImage1Prev) fd.append("learningImage1Keep", "true");
      
      if (learningImage2File) fd.append("learningImage2", learningImage2File);
      else if (learningImage2Existing && !learningImage2Prev) fd.append("learningImage2Keep", "true");
      
      if (learningImage3File) fd.append("learningImage3", learningImage3File);
      else if (learningImage3Existing && !learningImage3Prev) fd.append("learningImage3Keep", "true");

      // Eligibility Image
      if (eligibilityImageFile) fd.append("eligibilityImage", eligibilityImageFile);
      else if (eligibilityImageExisting && !eligibilityImagePrev) fd.append("eligibilityImageKeep", "true");

      // Evaluation Images
      if (evaluationMainImageFile) fd.append("evaluationMainImage", evaluationMainImageFile);
      else if (evaluationMainImageExisting && !evaluationMainImagePrev) fd.append("evaluationMainImageKeep", "true");
      
      if (evaluationSmallImageFile) fd.append("evaluationSmallImage", evaluationSmallImageFile);
      else if (evaluationSmallImageExisting && !evaluationSmallImagePrev) fd.append("evaluationSmallImageKeep", "true");

      // Ethics Images
      if (ethicsImage1File) fd.append("ethicsImage1", ethicsImage1File);
      else if (ethicsImage1Existing && !ethicsImage1Prev) fd.append("ethicsImage1Keep", "true");
      
      if (ethicsImage2File) fd.append("ethicsImage2", ethicsImage2File);
      else if (ethicsImage2Existing && !ethicsImage2Prev) fd.append("ethicsImage2Keep", "true");

      // Other single images
      if (diplomaFile) fd.append("diplomaImage", diplomaFile);
      else if (diplomaExisting && !diplomaPrev) fd.append("diplomaImageKeep", "true");

      if (yogaGardenFile) fd.append("yogaGardenImage", yogaGardenFile);
      else if (yogaGardenExisting && !yogaGardenPrev) fd.append("yogaGardenImageKeep", "true");

      // Carousel images
      const appendCarousel = (imgArr: ImgItem[], newKey: string, keepKey: string) => {
        imgArr.forEach((img) => {
          if (img.file) fd.append(newKey, img.file);
          else if (img.existingUrl) fd.append(keepKey, img.existingUrl);
        });
      };
      appendCarousel(accomImages, "accomImages", "accomImagesKeep");
      appendCarousel(foodImages, "foodImages", "foodImagesKeep");
      appendCarousel(luxuryImages, "luxuryImages", "luxuryImagesKeep");
      appendCarousel(scheduleImages, "scheduleImages", "scheduleImagesKeep");

      await api.put("/yoga-300hr/content2/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/300hourscourse/300-content2"), 1500);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <div style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "2.5rem", color: "#c9a96e", animation: "spin 2s linear infinite" }}>ॐ</div>
        <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "1.1rem", color: "#7a5c3a", fontStyle: "italic" }}>Loading content…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  /* ── Fetch error ── */
  if (fetchError)
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
        <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "1.1rem", color: "#c0392b" }}>⚠ {fetchError}</p>
        <button onClick={() => router.push("/admin/yogacourse/300hourscourse/300-content2")}
          style={{ fontFamily: "Cormorant Garamond,serif", padding: "0.5rem 1.5rem", borderRadius: 8, border: "1px solid #e8d5b5", background: "#faf8f4", cursor: "pointer", color: "#7a5c3a" }}>
          ← Back to List
        </button>
      </div>
    );

  /* ── Success ── */
  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Content 2 Updated!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/300hourscourse/300-content2")}>
          300 Hour Content Part 2
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Edit — 300hr Content Part 2</h1>
          <p className={styles.pageSubtitle}>Evolution · Learning · Eligibility · Evaluation · Ethics</p>
        </div>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════ 1. EVOLUTION & CERTIFICATION ════ */}
        <Sec title="Evolution and Certification" badge="Dynamic Right Image">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evolutionH2")} /></div>
          </F>
          
          <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#faf8f4", borderRadius: 10, border: "1px solid #e8d5b5" }}>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, color: "#5a3a1a", fontSize: "0.95rem", marginBottom: "1rem" }}>✦ Right Side Image</p>
            <SingleImg
              preview={evolutionRightPreview}
              existingUrl={evolutionRightExisting}
              badge="Evolution Image"
              hint="Recommended 600×500px · JPG/PNG/WEBP"
              onSelect={(f, p) => { setEvolutionRightFile(f); setEvolutionRightPreview(p); }}
              onRemove={() => { setEvolutionRightFile(null); setEvolutionRightPreview(""); setEvolutionRightExisting(""); }}
            />
            <div className={styles.grid2} style={{ marginTop: "1rem" }}>
              <F label="Image Alt Text">
                <input className={styles.input} {...register("evolutionRightImageAlt")} placeholder="Yoga meditation in Rishikesh" />
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="Badge Text">
                <input className={styles.input} {...register("evolutionBadgeText")} placeholder="Yoga Alliance" />
              </F>
              <F label="Badge Subtext">
                <input className={styles.input} {...register("evolutionBadgeSubtext")} placeholder="RYT 500 Certified" />
              </F>
            </div>
          </div>

          <F label="Introduction Paragraphs">
            <DynamicParaList
              items={evolutionParas}
              onAdd={() => addPara(setEvolutionParas)}
              onUpdate={(id, v) => updatePara(setEvolutionParas, id, v)}
              onRemove={(id) => removePara(setEvolutionParas, id)}
              addLabel="Introduction Paragraph"
              ph="The primary purpose of an examination is to prepare students…"
            />
          </F>

          {/* Mark Distribution Block */}
          <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "#faf8f4", borderRadius: 10, border: "1px solid #e8d5b5" }}>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, color: "#5a3a1a", fontSize: "0.95rem", marginBottom: "1rem" }}>✦ Mark Distribution Block</p>
            <F label="Mark Distribution H3 Label">
              <input className={styles.input} {...register("markDistH3")} />
            </F>
            <F label="Mark Distribution Sub-text">
              <input className={styles.input} {...register("markDistSubText")} placeholder="e.g. The examination is divided as follows…" />
            </F>
            <div className={styles.grid2}>
              <F label="Total Marks — Label"><input className={styles.input} {...register("markTotalLabel")} /></F>
              <F label="Total Marks — Text"><input className={styles.input} {...register("markTotalText")} placeholder="e.g. 200 Marks" /></F>
            </div>
            <div className={styles.grid2}>
              <F label="Theory — Label"><input className={styles.input} {...register("markTheoryLabel")} /></F>
              <F label="Theory — Text"><input className={styles.input} {...register("markTheoryText")} placeholder="e.g. 60 Marks" /></F>
            </div>
            <div className={styles.grid2}>
              <F label="Practical — Label"><input className={styles.input} {...register("markPracticalLabel")} /></F>
              <F label="Practical — Text"><input className={styles.input} {...register("markPracticalText")} placeholder="e.g. 140 Marks" /></F>
            </div>
            <LazyJodit
              label="Practical Marks — Detailed Distribution"
              cr={markPracticalDetailRef}
              ph="It's further marks distribution is as: 1. Demonstration Skills…"
              h={220}
            />
          </div>
        </Sec>
        <D />

        {/* ════ 2. LEARNING OUTCOMES MOSAIC IMAGES ════ */}
        <Sec title="Learning Outcomes - Mosaic Images" badge="3 Images">
          <F label="Learning H2 Heading">
            <input className={styles.input} {...register("learningH2")} />
          </F>
          <F label="Learning Outcome Items">
            <StrList items={learningItems} label="Outcome" ph="Upon completion, students will be awarded…"
              onAdd={() => setLearningItems((p) => [...p, ""])}
              onRemove={(i) => setLearningItems((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...learningItems]; a[i] = v; setLearningItems(a); }}
            />
          </F>

          {/* Image 1 - Tall */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Image 1 (Tall - Left Side)</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Image">
                  <SingleImg
                    preview={learningImage1Prev}
                    existingUrl={learningImage1Existing}
                    badge="Image 1"
                    hint="Recommended 400×500px"
                    onSelect={(f, p) => { setLearningImage1File(f); setLearningImage1Prev(p); }}
                    onRemove={() => { setLearningImage1File(null); setLearningImage1Prev(""); setLearningImage1Existing(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("learningImage1Alt")} placeholder="Advanced yoga practice" />
                </F>
              </div>
              <F label="Overlay Label">
                <input className={styles.input} {...register("learningImage1Label")} placeholder="Advanced Practice" />
              </F>
            </div>
          </div>

          {/* Image 2 */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Image 2 (Top Right)</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Image">
                  <SingleImg
                    preview={learningImage2Prev}
                    existingUrl={learningImage2Existing}
                    badge="Image 2"
                    hint="Recommended 400×300px"
                    onSelect={(f, p) => { setLearningImage2File(f); setLearningImage2Prev(p); }}
                    onRemove={() => { setLearningImage2File(null); setLearningImage2Prev(""); setLearningImage2Existing(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("learningImage2Alt")} placeholder="Yoga certification ceremony" />
                </F>
              </div>
              <F label="Overlay Label">
                <input className={styles.input} {...register("learningImage2Label")} placeholder="Certification" />
              </F>
            </div>
          </div>

          {/* Image 3 */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Image 3 (Bottom Right)</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Image">
                  <SingleImg
                    preview={learningImage3Prev}
                    existingUrl={learningImage3Existing}
                    badge="Image 3"
                    hint="Recommended 400×300px"
                    onSelect={(f, p) => { setLearningImage3File(f); setLearningImage3Prev(p); }}
                    onRemove={() => { setLearningImage3File(null); setLearningImage3Prev(""); setLearningImage3Existing(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("learningImage3Alt")} placeholder="Graduation at AYM School" />
                </F>
              </div>
              <F label="Overlay Label">
                <input className={styles.input} {...register("learningImage3Label")} placeholder="Graduation" />
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ════ 3. ELIGIBILITY SECTION ════ */}
        <Sec title="Eligibility Section" badge="With Image">
          <F label="Section H2 Heading">
            <input className={styles.input} {...register("eligibilityH2")} />
          </F>
          <F label="Eligibility Tag">
            <input className={styles.input} {...register("eligibilityTag")} placeholder="Eligibility" />
          </F>
          <F label="Eligibility Paragraphs">
            <DynamicParaList
              items={eligibilityParas}
              onAdd={() => addPara(setEligibilityParas)}
              onUpdate={(id, v) => updatePara(setEligibilityParas, id, v)}
              onRemove={(id) => removePara(setEligibilityParas, id)}
              addLabel="Eligibility Paragraph"
              ph="300 Hour yoga teacher certification is for individuals having a high degree of motivation…"
            />
          </F>
          
          <div className={styles.nestedCard} style={{ marginTop: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Right Side Image</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Eligibility Image">
                  <SingleImg
                    preview={eligibilityImagePrev}
                    existingUrl={eligibilityImageExisting}
                    badge="Eligibility"
                    hint="Recommended 300×400px"
                    onSelect={(f, p) => { setEligibilityImageFile(f); setEligibilityImagePrev(p); }}
                    onRemove={() => { setEligibilityImageFile(null); setEligibilityImagePrev(""); setEligibilityImageExisting(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("eligibilityImageAlt")} placeholder="Yoga eligibility — student in practice" />
                </F>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* ════ 4. EVALUATION SECTION ════ */}
        <Sec title="Evaluation Section" badge="2 Images + Badge">
          <F label="Section H2 Heading">
            <input className={styles.input} {...register("evaluationH2")} />
          </F>
          <F label="Evaluation Paragraphs">
            <DynamicParaList
              items={evaluationParas}
              onAdd={() => addPara(setEvaluationParas)}
              onUpdate={(id, v) => updatePara(setEvaluationParas, id, v)}
              onRemove={(id) => removePara(setEvaluationParas, id)}
              addLabel="Evaluation Paragraph"
              ph="To accomplish a training certificate of 300 Hour yoga teacher training course students need…"
            />
          </F>

          {/* Main Image */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Main Evaluation Image (Large)</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Main Image">
                  <SingleImg
                    preview={evaluationMainImagePrev}
                    existingUrl={evaluationMainImageExisting}
                    badge="Main"
                    hint="Recommended 500×400px"
                    onSelect={(f, p) => { setEvaluationMainImageFile(f); setEvaluationMainImagePrev(p); }}
                    onRemove={() => { setEvaluationMainImageFile(null); setEvaluationMainImagePrev(""); setEvaluationMainImageExisting(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("evaluationMainImageAlt")} placeholder="Evaluation and certification ceremony" />
                </F>
              </div>
            </div>
          </div>

          {/* Small Image */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Small Evaluation Image (Bottom)</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Small Image">
                  <SingleImg
                    preview={evaluationSmallImagePrev}
                    existingUrl={evaluationSmallImageExisting}
                    badge="Small"
                    hint="Recommended 200×150px"
                    onSelect={(f, p) => { setEvaluationSmallImageFile(f); setEvaluationSmallImagePrev(p); }}
                    onRemove={() => { setEvaluationSmallImageFile(null); setEvaluationSmallImagePrev(""); setEvaluationSmallImageExisting(""); }}
                  />
                </F>
                <F label="Alt Text">
                  <input className={styles.input} {...register("evaluationSmallImageAlt")} placeholder="Students receiving certificates" />
                </F>
              </div>
            </div>
          </div>

          {/* Badge Text */}
          <div className={styles.grid2}>
            <F label="Badge Line 1">
              <input className={styles.input} {...register("evaluationBadgeLine1")} placeholder="Yoga Alliance USA" />
            </F>
            <F label="Badge Line 2">
              <input className={styles.input} {...register("evaluationBadgeLine2")} placeholder="Certification Awarded" />
            </F>
          </div>
        </Sec>
        <D />

        {/* ════ 5. YOGA ETHICS SECTION ════ */}
        <Sec title="Yoga Ethics — Code of Conduct" badge="2 Images + Diploma">
          <F label="Section H2">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("ethicsH2")} />
            </div>
          </F>
          
          <F label="Ethics Introduction Paragraphs">
            <DynamicParaList
              items={ethicsParas}
              onAdd={() => addPara(setEthicsParas)}
              onUpdate={(id, v) => updatePara(setEthicsParas, id, v)}
              onRemove={(id) => removePara(setEthicsParas, id)}
              addLabel="Ethics Paragraph"
              ph="Yoga is a spiritual discipline that combines physical, mental and spiritual elements…"
            />
          </F>

          <F label="Ethics Quote" hint="Displayed in styled quote block">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={2} {...register("ethicsQuote")} />
            </div>
          </F>

          {/* RIGHT SIDE DYNAMIC IMAGES PAIR */}
          <div style={{ marginTop: "1.5rem", marginBottom: "1rem", padding: "1rem", background: "#faf8f4", borderRadius: 10, border: "1px solid #e8d5b5" }}>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, color: "#5a3a1a", fontSize: "0.95rem", marginBottom: "1rem" }}>✦ Right Side Images (Pair)</p>
            
            {/* Image 1 - Left */}
            <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Image 1 (Left)</span>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Image">
                    <SingleImg
                      preview={ethicsImage1Prev}
                      existingUrl={ethicsImage1Existing}
                      badge="Ethics 1"
                      hint="Recommended 400×300px"
                      onSelect={(f, p) => { setEthicsImage1File(f); setEthicsImage1Prev(p); }}
                      onRemove={() => { setEthicsImage1File(null); setEthicsImage1Prev(""); setEthicsImage1Existing(""); }}
                    />
                  </F>
                  <F label="Alt Text">
                    <input className={styles.input} {...register("ethicsImage1Alt")} placeholder="Yoga ethics in practice" />
                  </F>
                </div>
                <F label="Overlay Label">
                  <input className={styles.input} {...register("ethicsImage1Label")} placeholder="Discipline in Practice" />
                </F>
              </div>
            </div>

            {/* Image 2 - Right */}
            <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>Image 2 (Right)</span>
              </div>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  <F label="Image">
                    <SingleImg
                      preview={ethicsImage2Prev}
                      existingUrl={ethicsImage2Existing}
                      badge="Ethics 2"
                      hint="Recommended 400×300px"
                      onSelect={(f, p) => { setEthicsImage2File(f); setEthicsImage2Prev(p); }}
                      onRemove={() => { setEthicsImage2File(null); setEthicsImage2Prev(""); setEthicsImage2Existing(""); }}
                    />
                  </F>
                  <F label="Alt Text">
                    <input className={styles.input} {...register("ethicsImage2Alt")} placeholder="AYM campus — yoga shala" />
                  </F>
                </div>
                <F label="Overlay Label">
                  <input className={styles.input} {...register("ethicsImage2Label")} placeholder="AYM Yoga Shala" />
                </F>
              </div>
            </div>
          </div>

          <F label="Naturalistic Power of Yoga — Intro Paragraph">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} {...register("ethicsNaturalisticPara")} />
            </div>
          </F>

          <F label="Ethics Rules / Guidelines">
            <StrList items={ethicsRules} label="Rule" ph="Students need to be obedient in classes…"
              onAdd={() => setEthicsRules((p) => [...p, ""])}
              onRemove={(i) => setEthicsRules((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...ethicsRules]; a[i] = v; setEthicsRules(a); }}
            />
          </F>

          {/* Diploma Section with Badge Text */}
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#faf8f4", borderRadius: 10, border: "1px solid #e8d5b5" }}>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, color: "#5a3a1a", fontSize: "0.95rem", marginBottom: "1rem" }}>✦ Diploma / Graduation Section</p>
            
            <F label="Diploma / Graduation Image" hint="Full-width image below ethics rules">
              <SingleImg
                preview={diplomaPrev}
                existingUrl={diplomaExisting}
                badge="Diploma"
                hint="Students with diploma image"
                onSelect={(f, p) => { setDiplomaFile(f); setDiplomaPrev(p); }}
                onRemove={() => { setDiplomaFile(null); setDiplomaPrev(""); setDiplomaExisting(""); }}
              />
            </F>
            
            <div className={styles.grid2} style={{ marginTop: "1rem" }}>
              <F label="Badge Line 1">
                <input className={styles.input} {...register("diplomaBadgeLine1")} placeholder="Yoga Alliance USA" />
              </F>
              <F label="Badge Line 2">
                <input className={styles.input} {...register("diplomaBadgeLine2")} placeholder="Certified Graduates" />
              </F>
            </div>
          </div>
        </Sec>
        <D />

        {/* ════ 6. CAREER & FEE CARDS ════ */}
        <Sec title="Career Opportunities & Fee Cards">
          <F label="Career Section H3">
            <input className={styles.input} {...register("careerH3")} />
          </F>
          <F label="Career Items">
            <StrList items={careerItems} label="Career" ph="Yoga Instructor"
              onAdd={() => setCareerItems((p) => [...p, ""])}
              onRemove={(i) => setCareerItems((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...careerItems]; a[i] = v; setCareerItems(a); }}
            />
          </F>
          
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <div className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Fee Card 1 (Light)</span></div>
                <div className={styles.nestedCardBody}>
                  <F label="Card Title"><input className={styles.input} {...register("feeCard1Title")} /></F>
                  <F label="Card Items">
                    <StrList items={feeCard1Items} label="Item" ph="Online Course Fee: 25,000 INR"
                      onAdd={() => setFeeCard1Items((p) => [...p, ""])}
                      onRemove={(i) => setFeeCard1Items((p) => p.filter((_, x) => x !== i))}
                      onUpdate={(i, v) => { const a = [...feeCard1Items]; a[i] = v; setFeeCard1Items(a); }}
                    />
                  </F>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Fee Card 2 (Dark)</span></div>
                <div className={styles.nestedCardBody}>
                  <F label="Card Title"><input className={styles.input} {...register("feeCard2Title")} /></F>
                  <F label="Card Items">
                    <StrList items={feeCard2Items} label="Item" ph="Offline Fee: 25,000 INR"
                      onAdd={() => setFeeCard2Items((p) => [...p, ""])}
                      onRemove={(i) => setFeeCard2Items((p) => p.filter((_, x) => x !== i))}
                      onUpdate={(i, v) => { const a = [...feeCard2Items]; a[i] = v; setFeeCard2Items(a); }}
                    />
                  </F>
                </div>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* ════ 7. FAQ ════ */}
        <Sec title="FAQ Section" badge={`${faqItems.length} items`}>
          <F label="Section H2">
            <input className={styles.input} {...register("faqH2")} />
          </F>
          <F label="FAQ Items">
            {faqItems.map((faq, i) => (
              <div key={faq.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>FAQ {i + 1}</span>
                  {faqItems.length > 1 && (
                    <button type="button" className={styles.removeNestedBtn} onClick={() => setFaqItems((p) => p.filter((x) => x.id !== faq.id))}>✕ Remove</button>
                  )}
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Question">
                    <input className={styles.input} value={faq.question} placeholder="Why 300 hour yoga TTC?"
                      onChange={(e) => updNested(faqItems, setFaqItems, faq.id, "question", e.target.value)} />
                  </F>
                  <F label="Answer">
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={faq.answer} placeholder="AYM Yoga School offers…"
                      onChange={(e) => updNested(faqItems, setFaqItems, faq.id, "answer", e.target.value)} />
                  </F>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setFaqItems((p) => [...p, { id: `faq-${Date.now()}`, question: "", answer: "" }])}>
              ＋ Add FAQ Item
            </button>
          </F>
        </Sec>
        <D />

        {/* ════ 8. ACCOMMODATION, FOOD, LUXURY ════ */}
        <Sec title="Accommodation Carousel Images" badge={`${accomImages.length} images`}>
          <F label="Section H3"><input className={styles.input} {...register("accomH3")} /></F>
          <MultiImg items={accomImages} onAdd={addImg(setAccomImages)} onRemove={removeImg(setAccomImages)} hint="Add image" label="accommodation images" />
        </Sec>
        <D />

        <Sec title="Food Carousel Images" badge={`${foodImages.length} images`}>
          <F label="Section H3"><input className={styles.input} {...register("foodH3")} /></F>
          <MultiImg items={foodImages} onAdd={addImg(setFoodImages)} onRemove={removeImg(setFoodImages)} hint="Add image" label="food images" />
        </Sec>
        <D />

        <Sec title="Luxury Room & Features">
          <F label="Section H2"><input className={styles.input} {...register("luxuryH2")} /></F>
          <F label="Luxury Features List">
            <StrList items={luxuryFeatures} label="Feature" ph="Swimming pool"
              onAdd={() => setLuxuryFeatures((p) => [...p, ""])}
              onRemove={(i) => setLuxuryFeatures((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...luxuryFeatures]; a[i] = v; setLuxuryFeatures(a); }}
            />
          </F>
          <F label="Luxury Room Images">
            <MultiImg items={luxuryImages} onAdd={addImg(setLuxuryImages)} onRemove={removeImg(setLuxuryImages)} hint="Add image" label="luxury images" />
          </F>
          <F label="Yoga Garden Banner Image">
            <SingleImg
              preview={yogaGardenPrev} existingUrl={yogaGardenExisting} badge="Garden" hint="Wide banner image"
              onSelect={(f, p) => { setYogaGardenFile(f); setYogaGardenPrev(p); }}
              onRemove={() => { setYogaGardenFile(null); setYogaGardenPrev(""); setYogaGardenExisting(""); }}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 9. FEATURES & SCHEDULE ════ */}
        <Sec title="Features & Daily Schedule">
          <F label="Features Section H2"><input className={styles.input} {...register("featuresH2")} /></F>
          <F label="Features List">
            <StrList items={featuresList} label="Feature" ph="Students with basic, intermediate, or advanced knowledge…"
              onAdd={() => setFeaturesList((p) => [...p, ""])}
              onRemove={(i) => setFeaturesList((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...featuresList]; a[i] = v; setFeaturesList(a); }}
            />
          </F>
          <F label="Schedule H3"><input className={styles.input} {...register("scheduleH3")} /></F>
          <F label="Daily Schedule Items">
            {scheduleItems.map((s, i) => (
              <div key={s.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 120 }}><input className={styles.input} value={s.time} placeholder="06:30 AM"
                  onChange={(e) => updNested(scheduleItems, setScheduleItems, s.id, "time", e.target.value)} /></div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={styles.input} value={s.activity} placeholder="Pranayama And Meditation"
                  onChange={(e) => updNested(scheduleItems, setScheduleItems, s.id, "activity", e.target.value)} /></div>
                <button type="button" className={styles.removeItemBtn} onClick={() => setScheduleItems((p) => p.filter((x) => x.id !== s.id))} disabled={scheduleItems.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setScheduleItems((p) => [...p, { id: `s-${Date.now()}`, time: "", activity: "" }])}>＋ Add Schedule Row</button>
          </F>
          <F label="Schedule Side Images">
            <MultiImg items={scheduleImages} onAdd={addImg(setScheduleImages)} onRemove={removeImg(setScheduleImages)} hint="Add image" label="schedule images" />
          </F>
        </Sec>
        <D />

        {/* ════ 10. MISCONCEPTIONS ════ */}
        <Sec title="Misconceptions Section">
          <F label="Section H2"><input className={styles.input} {...register("misconH2")} /></F>
          <F label="Intro Paragraphs">
            <DynamicParaList
              items={misconParas}
              onAdd={() => addPara(setMisconParas)}
              onUpdate={(id, v) => updatePara(setMisconParas, id, v)}
              onRemove={(id) => removePara(setMisconParas, id)}
              addLabel="Misconception Intro Paragraph"
              ph="The 300-hour yoga teacher training is often seen as merely an advanced step…"
            />
          </F>
          <F label="Misconception Items">
            <StrList items={misconItems} label="Misconception" ph="You think you are signing up to learn yoga…"
              onAdd={() => setMisconItems((p) => [...p, ""])}
              onRemove={(i) => setMisconItems((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...misconItems]; a[i] = v; setMisconItems(a); }}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 11. REVIEWS & YOUTUBE ════ */}
        <Sec title="Student Reviews & YouTube Videos" badge={`${reviews.length} reviews · ${youtubeVideos.length} videos`}>
          <div className={styles.grid2}>
            <F label="Section H2"><input className={styles.input} {...register("reviewsH2")} /></F>
            <F label="Sub-text"><input className={styles.input} {...register("reviewsSubtext")} /></F>
          </div>

          <F label="Review Cards">
            {reviews.map((r, i) => (
              <div key={r.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Review {i + 1}</span>
                  {reviews.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setReviews((p) => p.filter((x) => x.id !== r.id))}>✕ Remove</button>}
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Name"><input className={styles.input} value={r.name} onChange={(e) => updNested(reviews, setReviews, r.id, "name", e.target.value)} /></F>
                    <F label="Role"><input className={styles.input} value={r.role} onChange={(e) => updNested(reviews, setReviews, r.id, "role", e.target.value)} /></F>
                  </div>
                  <F label="Star Rating"><StarRating value={r.rating} onChange={(v) => updNested(reviews, setReviews, r.id, "rating", v)} /></F>
                  <F label="Review Text"><textarea className={`${styles.input} ${styles.textarea}`} rows={4} value={r.text} onChange={(e) => updNested(reviews, setReviews, r.id, "text", e.target.value)} /></F>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setReviews((p) => [...p, { id: `r-${Date.now()}`, name: "", role: "", rating: 5, text: "" }])}>＋ Add Review</button>
          </F>

          <F label="YouTube Videos">
            {youtubeVideos.map((yt, i) => (
              <div key={yt.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Video {i + 1}</span>
                  {youtubeVideos.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setYoutubeVideos((p) => p.filter((x) => x.id !== yt.id))}>✕ Remove</button>}
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Video Title"><input className={styles.input} value={yt.title} onChange={(e) => updYt(yt.id, "title", e.target.value)} /></F>
                  <F label="Video Source Type">
                    <div style={{ display: "flex", gap: "1.2rem" }}>
                      {(["url", "file"] as const).map((opt) => (
                        <label key={opt}><input type="radio" checked={yt.sourceType === opt} onChange={() => updYt(yt.id, "sourceType", opt)} /> {opt === "url" ? "YouTube URL" : "Upload File"}</label>
                      ))}
                    </div>
                  </F>
                  {yt.sourceType === "url" && (
                    <F label="YouTube Video ID"><input className={styles.input} value={yt.videoId} onChange={(e) => updYt(yt.id, "videoId", e.target.value)} placeholder="pXU4_SXdNdY" /></F>
                  )}
                  {yt.sourceType === "file" && (
                    <F label="Upload Video File">
                      {!yt.filePreview && yt.existingFileUrl && <video src={`${BASE_URL}${yt.existingFileUrl}`} controls style={{ maxWidth: 280 }} />}
                      <label style={{ display: "inline-block", padding: "0.5rem 1rem", border: "1px dashed #c9a96e", cursor: "pointer" }}>
                        {yt.filePreview ? "Change File" : (yt.existingFileUrl ? "Replace" : "Choose File")}
                        <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setYtFile(yt.id, f); }} />
                      </label>
                      {yt.filePreview && <button type="button" onClick={() => removeYtFile(yt.id)}>Remove</button>}
                    </F>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn} onClick={() => setYoutubeVideos((p) => [...p, { id: `yt-${Date.now()}`, title: "", sourceType: "url", videoId: "", file: null, filePreview: "" }])}>＋ Add Video</button>
          </F>
        </Sec>
        <D />

        {/* ════ PAGE SETTINGS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={styles.input} placeholder="300-hour-yoga-ttc-content2" {...register("slug", { required: "Required" })} />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}
            </F>
            <F label="Status">
              <select className={styles.select} {...register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </F>
          </div>
        </Sec>
      </div>

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/300hourscourse/300-content2" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update Content 2"}
        </button>
      </div>
    </div>
  );
}