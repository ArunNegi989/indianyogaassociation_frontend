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
   FIX: initialValueRef prevents Jodit from
   resetting when parent re-renders.
──────────────────────────────────────── */
function LazyJodit({
  label, hint, cr, err, clr, ph = "Start typing…", h = 200, required = false,
}: {
  label: string; hint?: string; cr: React.MutableRefObject<string>;
  err?: string; clr?: () => void; ph?: string; h?: number; required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  // KEY FIX: capture initial value once — never re-pass updated value to Jodit
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
      if (clr && v.replace(/<[^>]*>/g, "").trim() !== "") clr();
    },
    [cr, clr]
  );

  // KEY FIX: memoize config so Jodit never remounts due to config object change
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
   FIX: initialValueRef.current is passed as
   `value` so Jodit NEVER gets a new value
   prop after mount → no reset, no focus loss.
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
  // KEY FIX: capture initial value in ref — never changes after mount
  const initialValueRef = useRef(initialValue);

  // Always keep the ref pointing at latest onChange
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

  // Stable callback — reads latest onChange via ref
  const stableOnChange = useCallback((v: string) => {
    onChangeRef.current(v);
  }, []);

  // KEY FIX: memoize config to prevent Jodit from remounting
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
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
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
          <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { Array.from(e.target.files || []).forEach((f) => onAdd(f, URL.createObjectURL(f))); e.target.value = ""; }} />
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
interface YouTubeItem { id: string; title: string; sourceType: "url" | "file"; videoId: string; file: File | null; filePreview: string }

interface FormData {
  slug: string; status: "Active" | "Inactive";
  evolutionH2: string;
  markDistH3: string; markDistSubText: string;
  markTotalLabel: string; markTotalText: string;
  markTheoryLabel: string; markTheoryText: string;
  markPracticalLabel: string; markPracticalText: string;
  careerH3: string;
  feeCard1Title: string; feeCard2Title: string;
  faqH2: string; accomH3: string; foodH3: string;
  luxuryH2: string; featuresH2: string; scheduleH3: string;
  learningH2: string;
  eligibilityH2: string; eligibilityTag: string;
  evaluationH2: string;
  ethicsH2: string; ethicsNaturalisticPara: string; ethicsQuote: string;
  misconH2: string;
  reviewsH2: string; reviewsSubtext: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT — ADD
════════════════════════════════════════ */
export default function Add300hrContent2() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const markPracticalDetailRef = useRef("");

  const [evolutionParas, setEvolutionParas] = useState<ParaItem[]>([{ id: "ep1", content: "" }]);
  const [eligibilityParas, setEligibilityParas] = useState<ParaItem[]>([{ id: "elp1", content: "" }]);
  const [evaluationParas, setEvaluationParas] = useState<ParaItem[]>([{ id: "evp1", content: "" }]);
  const [ethicsParas, setEthicsParas] = useState<ParaItem[]>([{ id: "etp1", content: "" }]);
  const [misconParas, setMisconParas] = useState<ParaItem[]>([{ id: "mp1", content: "" }]);

  const [careerItems, setCareerItems] = useState<string[]>([""]);
  const [feeCard1Items, setFeeCard1Items] = useState<string[]>([""]);
  const [feeCard2Items, setFeeCard2Items] = useState<string[]>([""]);
  const [luxuryFeatures, setLuxuryFeatures] = useState<string[]>([""]);
  const [featuresList, setFeaturesList] = useState<string[]>([""]);
  const [learningItems, setLearningItems] = useState<string[]>([""]);
  const [ethicsRules, setEthicsRules] = useState<string[]>([""]);
  const [misconItems, setMisconItems] = useState<string[]>([""]);

  const [faqItems, setFaqItems] = useState<FaqItem[]>([{ id: "faq1", question: "", answer: "" }]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ id: "s1", time: "", activity: "" }]);
  const [reviews, setReviews] = useState<ReviewItem[]>([{ id: "r1", name: "", role: "", rating: 5, text: "" }]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeItem[]>([{ id: "yt1", title: "", sourceType: "url", videoId: "", file: null, filePreview: "" }]);

  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [diplomaPrev, setDiplomaPrev] = useState("");
  const [yogaGardenFile, setYogaGardenFile] = useState<File | null>(null);
  const [yogaGardenPrev, setYogaGardenPrev] = useState("");

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "", status: "Active",
      evolutionH2: "Evolution and certification",
      markDistH3: "Mark Distribution: 300 hour yoga teacher training course in india at AYM Yoga School",
      markDistSubText: "",
      markTotalLabel: "Total Marks of 300 hour yoga ttc examination", markTotalText: "",
      markTheoryLabel: "In theory examination", markTheoryText: "",
      markPracticalLabel: "Practical examination", markPracticalText: "",
      careerH3: "Scope & Career Opportunities",
      feeCard1Title: "300 Hour Yoga Teacher Training Online",
      feeCard2Title: "300 Hour Yoga Teacher Training Course",
      faqH2: "300 Hour Yoga Teacher Training in India",
      accomH3: "Accommodation", foodH3: "Food",
      luxuryH2: "LUXURY ROOM & FEATURES",
      featuresH2: "300 Hour Yoga Teacher Training in Rishikesh — Features",
      scheduleH3: "Daily Schedule",
      learningH2: "Learning Outcomes of 300 Hour yoga teacher training course in Rishikesh",
      eligibilityH2: "300 Hour Yoga Teacher Training in Rishikesh",
      eligibilityTag: "Eligibility",
      evaluationH2: "Evaluation and Certification — 300 Hour Yoga Teacher Training in India",
      ethicsH2: "Yoga ethics — Codes of conduct during 300 Hour Yoga TTC in Rishikesh at AYM",
      ethicsNaturalisticPara: "According to yoga gurus, to actualize the naturalistic power of yoga one must have to follow proper yoga ethics and discipline or we can say Yama and Niyamas. Here are some guidelines we marked for our students to follow at our yoga school.",
      ethicsQuote: "The very heart of yoga is abhyasa means constant practice with steady effort in the direction you want to go.",
      misconH2: "Misconceptions about 300 hour yoga teacher training Rishikesh India",
      reviewsH2: "Student Reviews & Success Stories",
      reviewsSubtext: "Authentic stories of transformation from students who began just like you.",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("evolutionParas", JSON.stringify(evolutionParas.map((p) => p.content)));
      fd.append("eligibilityParas", JSON.stringify(eligibilityParas.map((p) => p.content)));
      fd.append("evaluationParas", JSON.stringify(evaluationParas.map((p) => p.content)));
      fd.append("ethicsParas", JSON.stringify(ethicsParas.map((p) => p.content)));
      fd.append("misconParas", JSON.stringify(misconParas.map((p) => p.content)));
      fd.append("markPracticalDetail", markPracticalDetailRef.current);

      careerItems.forEach((v) => fd.append("careerItems", v));
      feeCard1Items.forEach((v) => fd.append("feeCard1Items", v));
      feeCard2Items.forEach((v) => fd.append("feeCard2Items", v));
      luxuryFeatures.forEach((v) => fd.append("luxuryFeatures", v));
      featuresList.forEach((v) => fd.append("featuresList", v));
      learningItems.forEach((v) => fd.append("learningItems", v));
      ethicsRules.forEach((v) => fd.append("ethicsRules", v));
      misconItems.forEach((v) => fd.append("misconItems", v));

      fd.append("faqItems", JSON.stringify(faqItems));
      fd.append("scheduleItems", JSON.stringify(scheduleItems));
      fd.append("reviews", JSON.stringify(reviews.map((r) => ({ name: r.name, role: r.role, rating: r.rating, text: r.text }))));

      const ytMeta = youtubeVideos.map((yt) => ({ id: yt.id, title: yt.title, type: yt.sourceType, videoId: yt.videoId }));
      fd.append("youtubeVideosMeta", JSON.stringify(ytMeta));
      youtubeVideos.forEach((yt) => { if (yt.sourceType === "file" && yt.file) fd.append(`ytFile_${yt.id}`, yt.file); });

      if (diplomaFile) fd.append("diplomaImage", diplomaFile);
      if (yogaGardenFile) fd.append("yogaGardenImage", yogaGardenFile);
      accomImages.forEach((img) => { if (img.file) fd.append("accomImages", img.file); });
      foodImages.forEach((img) => { if (img.file) fd.append("foodImages", img.file); });
      luxuryImages.forEach((img) => { if (img.file) fd.append("luxuryImages", img.file); });
      scheduleImages.forEach((img) => { if (img.file) fd.append("scheduleImages", img.file); });

      await api.post("/yoga-300hr/content2/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/300hourscourse/300-content2"), 1500);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Content 2 Saved!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/300hourscourse/300-content2")}>
          300 Hour Content Part 2
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Add New</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Add New — 300hr Content Part 2</h1>
          <p className={styles.pageSubtitle}>Evolution · FAQ · Accommodation · Schedule · Reviews</p>
        </div>
      </div>
      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════ 1. EVOLUTION ════ */}
        <Sec title="Evolution and Certification">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("evolutionH2")} />
            </div>
          </F>
          <F label="Introduction Paragraphs" hint="Add as many paragraphs as needed." req>
            <DynamicParaList
              items={evolutionParas}
              onAdd={() => addPara(setEvolutionParas)}
              onUpdate={(id, v) => updatePara(setEvolutionParas, id, v)}
              onRemove={(id) => removePara(setEvolutionParas, id)}
              addLabel="Introduction Paragraph"
              ph="The primary purpose of an examination is to prepare students…"
            />
          </F>
          <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "#faf8f4", borderRadius: 10, border: "1px solid #e8d5b5" }}>
            <p style={{ fontFamily: "Cormorant Garamond,serif", fontWeight: 600, color: "#5a3a1a", fontSize: "0.95rem", marginBottom: "1rem" }}>✦ Mark Distribution Block</p>
            <F label="Mark Distribution H3 Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markDistH3")} /></div>
            </F>
            <F label="Mark Distribution Sub-text" hint="Short description below H3 (optional)">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markDistSubText")} placeholder="e.g. The examination is divided as follows…" /></div>
            </F>
            <div className={styles.grid2} style={{ marginTop: "0.8rem" }}>
              <F label="Total Marks — Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markTotalLabel")} /></div></F>
              <F label="Total Marks — Value"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markTotalText")} placeholder="e.g. 200 Marks" /></div></F>
            </div>
            <div className={styles.grid2}>
              <F label="Theory — Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markTheoryLabel")} /></div></F>
              <F label="Theory — Value"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markTheoryText")} placeholder="e.g. 60 Marks" /></div></F>
            </div>
            <div className={styles.grid2}>
              <F label="Practical — Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markPracticalLabel")} /></div></F>
              <F label="Practical — Value"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markPracticalText")} placeholder="e.g. 140 Marks" /></div></F>
            </div>
            <LazyJodit
              label="Practical Marks — Detailed Distribution"
              hint="Full breakdown of practical marks"
              cr={markPracticalDetailRef}
              ph="It's further marks distribution is as: 1. Demonstration Skills…"
              h={220}
            />
          </div>
        </Sec>
        <D />

        {/* ════ 2. CAREER & FEE CARDS ════ */}
        <Sec title="Career Opportunities & Fee Cards">
          <F label="Career Section H3">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("careerH3")} /></div>
          </F>
          <F label="Career Items">
            <StrList
              items={careerItems} label="Career" ph="Yoga Instructor at the health clubs"
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
                  <F label="Card Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeCard1Title")} /></div></F>
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
                  <F label="Card Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeCard2Title")} /></div></F>
                  <F label="Card Items">
                    <StrList items={feeCard2Items} label="Item" ph="Offline Fee: 25,000 INR - Dorm Shared"
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

        {/* ════ 3. FAQ ════ */}
        <Sec title="FAQ Section" badge={`${faqItems.length} items`}>
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("faqH2")} /></div>
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
                    <div className={styles.inputWrap}>
                      <input className={`${styles.input} ${styles.inputNoCount}`} value={faq.question} placeholder="Why 300 hour yoga TTC in Rishikesh at AYM?"
                        onChange={(e) => updNested(faqItems, setFaqItems, faq.id, "question", e.target.value)} />
                    </div>
                  </F>
                  <F label="Answer">
                    <div className={styles.inputWrap}>
                      <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} value={faq.answer} placeholder="AYM Yoga School offers…"
                        onChange={(e) => updNested(faqItems, setFaqItems, faq.id, "answer", e.target.value)} />
                    </div>
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

        {/* ════ 4. ACCOMMODATION ════ */}
        <Sec title="Accommodation Carousel Images" badge={`${accomImages.length} images`}>
          <F label="Section H3">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("accomH3")} /></div>
          </F>
          <F label="Accommodation Images" hint="JPG/PNG/WEBP · Multiple images supported">
            <MultiImg items={accomImages} onAdd={addImg(setAccomImages)} onRemove={removeImg(setAccomImages)} hint="Add image" label="accommodation images" />
          </F>
        </Sec>
        <D />

        {/* ════ 5. FOOD ════ */}
        <Sec title="Food Carousel Images" badge={`${foodImages.length} images`}>
          <F label="Section H3">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("foodH3")} /></div>
          </F>
          <F label="Food Images" hint="JPG/PNG/WEBP · Multiple images supported">
            <MultiImg items={foodImages} onAdd={addImg(setFoodImages)} onRemove={removeImg(setFoodImages)} hint="Add image" label="food images" />
          </F>
        </Sec>
        <D />

        {/* ════ 6. LUXURY ROOM ════ */}
        <Sec title="Luxury Room & Features">
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("luxuryH2")} /></div>
          </F>
          <F label="Luxury Features List">
            <StrList items={luxuryFeatures} label="Feature" ph="Swimming pool"
              onAdd={() => setLuxuryFeatures((p) => [...p, ""])}
              onRemove={(i) => setLuxuryFeatures((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...luxuryFeatures]; a[i] = v; setLuxuryFeatures(a); }}
            />
          </F>
          <F label="Luxury Room Images" hint="Recommended 500×400px">
            <MultiImg items={luxuryImages} onAdd={addImg(setLuxuryImages)} onRemove={removeImg(setLuxuryImages)} hint="Add image" label="luxury images" />
          </F>
          <F label="Yoga Garden / Full-Width Banner Image" hint="Wide banner image below luxury features">
            <SingleImg
              preview={yogaGardenPrev} badge="Garden" hint="Wide banner image"
              onSelect={(f, p) => { setYogaGardenFile(f); setYogaGardenPrev(p); }}
              onRemove={() => { setYogaGardenFile(null); setYogaGardenPrev(""); }}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 7. FEATURES & SCHEDULE ════ */}
        <Sec title="Features & Daily Schedule">
          <F label="Features Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("featuresH2")} /></div>
          </F>
          <F label="Features List">
            <StrList items={featuresList} label="Feature" ph="Students with basic, intermediate, or advanced knowledge…"
              onAdd={() => setFeaturesList((p) => [...p, ""])}
              onRemove={(i) => setFeaturesList((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...featuresList]; a[i] = v; setFeaturesList(a); }}
            />
          </F>
          <F label="Schedule H3">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("scheduleH3")} /></div>
          </F>
          <F label="Daily Schedule Items" hint="Time → Activity pairs.">
            {scheduleItems.map((s, i) => (
              <div key={s.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 120, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={s.time} placeholder="06:30 AM"
                    onChange={(e) => updNested(scheduleItems, setScheduleItems, s.id, "time", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={s.activity} placeholder="Pranayama And Meditation"
                    onChange={(e) => updNested(scheduleItems, setScheduleItems, s.id, "activity", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn}
                  onClick={() => setScheduleItems((p) => p.filter((x) => x.id !== s.id))} disabled={scheduleItems.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setScheduleItems((p) => [...p, { id: `s-${Date.now()}`, time: "", activity: "" }])}>
              ＋ Add Schedule Row
            </button>
          </F>
          <F label="Schedule Side Images" hint="Images shown beside the schedule table">
            <MultiImg items={scheduleImages} onAdd={addImg(setScheduleImages)} onRemove={removeImg(setScheduleImages)} hint="Add image" label="schedule images" />
          </F>
        </Sec>
        <D />

        {/* ════ 8. LEARNING OUTCOMES ════ */}
        <Sec title="Learning Outcomes">
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("learningH2")} /></div>
          </F>
          <F label="Learning Outcome Items" hint="Each item is displayed as a separate point.">
            <StrList items={learningItems} label="Outcome" ph="Upon completion, students will be awarded the prestigious 300-hour YTTC certification…"
              onAdd={() => setLearningItems((p) => [...p, ""])}
              onRemove={(i) => setLearningItems((p) => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...learningItems]; a[i] = v; setLearningItems(a); }}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 9. ELIGIBILITY ════ */}
        <Sec title="Eligibility Section">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("eligibilityH2")} /></div>
          </F>
          <F label="Eligibility Tag" hint="Short tag label, e.g. 'Eligibility'">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("eligibilityTag")} placeholder="Eligibility" /></div>
          </F>
          <F label="Eligibility Paragraphs" hint="Add as many paragraphs as needed." req>
            <DynamicParaList
              items={eligibilityParas}
              onAdd={() => addPara(setEligibilityParas)}
              onUpdate={(id, v) => updatePara(setEligibilityParas, id, v)}
              onRemove={(id) => removePara(setEligibilityParas, id)}
              addLabel="Eligibility Paragraph"
              ph="300 Hour yoga teacher certification is for individuals having a high degree of motivation…"
            />
          </F>
        </Sec>
        <D />

        {/* ════ 10. EVALUATION ════ */}
        <Sec title="Evaluation and Certification">
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evaluationH2")} /></div>
          </F>
          <F label="Evaluation Paragraphs" hint="Add as many paragraphs as needed." req>
            <DynamicParaList
              items={evaluationParas}
              onAdd={() => addPara(setEvaluationParas)}
              onUpdate={(id, v) => updatePara(setEvaluationParas, id, v)}
              onRemove={(id) => removePara(setEvaluationParas, id)}
              addLabel="Evaluation Paragraph"
              ph="To accomplish a training certificate of 300 Hour yoga teacher training course students need…"
            />
          </F>
        </Sec>
        <D />

        {/* ════ 11. YOGA ETHICS ════ */}
        <Sec title="Yoga Ethics — Code of Conduct">
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ethicsH2")} /></div>
          </F>
          <F label="Ethics Introduction Paragraphs (optional)" hint="Any extra paragraphs before the guidelines list.">
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
          <F label="Naturalistic Power of Yoga — Intro Paragraph" hint="The paragraph starting 'According to yoga gurus…'">
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
          <F label="Diploma / Graduation Image" hint="Full-width image below ethics rules">
            <SingleImg
              preview={diplomaPrev} badge="Diploma" hint="Students with diploma image"
              onSelect={(f, p) => { setDiplomaFile(f); setDiplomaPrev(p); }}
              onRemove={() => { setDiplomaFile(null); setDiplomaPrev(""); }}
            />
          </F>
        </Sec>
        <D />

        {/* ════ 12. MISCONCEPTIONS ════ */}
        <Sec title="Misconceptions Section">
          <F label="Section H2">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("misconH2")} /></div>
          </F>
          <F label="Shake Your Myths — Intro Paragraphs (optional)" hint="Add introductory paragraphs before the misconception list.">
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

        {/* ════ 13. REVIEWS & YOUTUBE ════ */}
        <Sec title="Student Reviews & YouTube Videos" badge={`${reviews.length} reviews · ${youtubeVideos.length} videos`}>
          <div className={styles.grid2}>
            <F label="Section H2">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsH2")} /></div>
            </F>
            <F label="Sub-text">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsSubtext")} /></div>
            </F>
          </div>
          <F label="Review Cards">
            {reviews.map((r, i) => (
              <div key={r.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Review {i + 1}</span>
                  {reviews.length > 1 && (
                    <button type="button" className={styles.removeNestedBtn} onClick={() => setReviews((p) => p.filter((x) => x.id !== r.id))}>✕ Remove</button>
                  )}
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Name">
                      <div className={styles.inputWrap}>
                        <input className={`${styles.input} ${styles.inputNoCount}`} value={r.name} placeholder="Karina Miller"
                          onChange={(e) => updNested(reviews, setReviews, r.id, "name", e.target.value)} />
                      </div>
                    </F>
                    <F label="Role">
                      <div className={styles.inputWrap}>
                        <input className={`${styles.input} ${styles.inputNoCount}`} value={r.role} placeholder="Certified Yoga Teacher"
                          onChange={(e) => updNested(reviews, setReviews, r.id, "role", e.target.value)} />
                      </div>
                    </F>
                  </div>
                  <F label="Star Rating">
                    <StarRating value={r.rating} onChange={(v) => updNested(reviews, setReviews, r.id, "rating", v)} />
                  </F>
                  <F label="Review Text">
                    <div className={styles.inputWrap}>
                      <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={4} value={r.text} placeholder="My experience at AYM Yoga School was amazing!…"
                        onChange={(e) => updNested(reviews, setReviews, r.id, "text", e.target.value)} />
                    </div>
                  </F>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setReviews((p) => [...p, { id: `r-${Date.now()}`, name: "", role: "", rating: 5, text: "" }])}>
              ＋ Add Review
            </button>
          </F>
          <F label="YouTube Videos" hint="Each video supports YouTube URL or direct video file upload.">
            {youtubeVideos.map((yt, i) => (
              <div key={yt.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Video {i + 1}</span>
                  {youtubeVideos.length > 1 && (
                    <button type="button" className={styles.removeNestedBtn} onClick={() => setYoutubeVideos((p) => p.filter((x) => x.id !== yt.id))}>✕ Remove</button>
                  )}
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Video Title">
                    <div className={styles.inputWrap}>
                      <input className={`${styles.input} ${styles.inputNoCount}`} value={yt.title} placeholder="300 Hour Yoga TTC Review by Alex…"
                        onChange={(e) => updYt(yt.id, "title", e.target.value)} />
                    </div>
                  </F>
                  <F label="Video Source Type">
                    <div style={{ display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
                      {(["url", "file"] as const).map((opt) => (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontFamily: "Cormorant Garamond,serif", fontSize: "0.92rem", color: "#5a3a1a" }}>
                          <input type="radio" name={`ytSourceType-${yt.id}`} checked={yt.sourceType === opt} onChange={() => updYt(yt.id, "sourceType", opt)} style={{ width: 14, height: 14 }} />
                          {opt === "url" ? "🔗 YouTube URL (Video ID)" : "📁 Upload Video File"}
                        </label>
                      ))}
                    </div>
                  </F>
                  {yt.sourceType === "url" && (
                    <F label="YouTube Video ID" hint="e.g. pXU4_SXdNdY — the part after watch?v=">
                      <div className={styles.inputWrap}>
                        <input className={`${styles.input} ${styles.inputNoCount}`} value={yt.videoId} placeholder="pXU4_SXdNdY"
                          onChange={(e) => updYt(yt.id, "videoId", e.target.value)} />
                      </div>
                      {yt.videoId && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <img src={`https://img.youtube.com/vi/${yt.videoId}/mqdefault.jpg`} alt="YouTube thumbnail"
                            style={{ width: 200, borderRadius: 6, border: "1px solid #e8d5b5" }} />
                        </div>
                      )}
                    </F>
                  )}
                  {yt.sourceType === "file" && (
                    <F label="Upload Video File" hint="MP4/WebM/MOV · Max recommended 200MB">
                      {!yt.filePreview ? (
                        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: 8, border: "1.5px dashed #c9a96e", background: "#fffdf8", cursor: "pointer", fontFamily: "Cormorant Garamond,serif", fontSize: "0.9rem", color: "#7a5c3a" }}>
                          📁 Choose Video File
                          <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setYtFile(yt.id, f); e.target.value = ""; }} />
                        </label>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                          <video src={yt.filePreview} controls style={{ maxWidth: 280, borderRadius: 8, border: "1px solid #e8d5b5" }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.8rem", borderRadius: 6, border: "1px solid #e8d5b5", background: "#faf8f4", cursor: "pointer", fontFamily: "Cormorant Garamond,serif", fontSize: "0.85rem", color: "#7a5c3a" }}>
                              ✎ Change
                              <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setYtFile(yt.id, f); e.target.value = ""; }} />
                            </label>
                            <button type="button" onClick={() => removeYtFile(yt.id)}
                              style={{ padding: "0.35rem 0.8rem", borderRadius: 6, border: "1px solid #e8a0a0", background: "#fff5f5", cursor: "pointer", color: "#c0392b", fontFamily: "Cormorant Garamond,serif", fontSize: "0.85rem" }}>
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </F>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setYoutubeVideos((p) => [...p, { id: `yt-${Date.now()}`, title: "", sourceType: "url", videoId: "", file: null, filePreview: "" }])}>
              ＋ Add Video
            </button>
          </F>
        </Sec>
        <D />

        {/* ════ PAGE SETTINGS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="300-hour-yoga-ttc-content2"
                  {...register("slug", { required: "Required" })} />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}
            </F>
            <F label="Status">
              <div className={styles.selectWrap}>
                <select className={styles.select} {...register("status")}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </F>
          </div>
        </Sec>
      </div>

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/300hourscourse/300-content2" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (<><span className={styles.spinner} /> Saving…</>) : (<><span>✦</span> Save Content 2</>)}
        </button>
      </div>
    </div>
  );
}