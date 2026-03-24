"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  uploader: { insertImageAsBase64URI: true }, height: 200, placeholder: "",
} as any;

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

/* ── Helpers ── */
function D() { return <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />; }
function Sec({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}><span className={styles.sectionIcon}>✦</span><h3 className={styles.sectionTitle}>{title}</h3>{badge && <span className={styles.sectionBadge}>{badge}</span>}</div>
      {children}
    </div>
  );
}
function F({ label, hint, req, children }: { label: string; hint?: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{req && <span className={styles.required}>*</span>}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      {children}
    </div>
  );
}

/* ── Lazy Jodit (ref-based) ── */
function LazyJodit({ label, hint, cr, err, clr, ph = "Start typing…", h = 200, required = false }: {
  label: string; hint?: string; cr: React.MutableRefObject<string>; err?: string; clr?: () => void;
  ph?: string; h?: number; required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "300px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const handleChange = useCallback((v: string) => { cr.current = v; if (clr && !isEmpty(v)) clr(); }, [cr, clr]);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}><span className={styles.labelIcon}>✦</span>{label}{required && <span className={styles.required}>*</span>}</label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
        {visible ? (
          <JoditEditor config={{ ...joditConfig, placeholder: ph, height: h }} onChange={handleChange} />
        ) : (
          <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>✦ Scroll to load editor…</div>
        )}
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* ── String List ── */
function StrList({ items, onAdd, onRemove, onUpdate, max = 30, ph, label }: {
  items: string[]; onAdd: () => void; onRemove: (i: number) => void; onUpdate: (i: number, v: string) => void; max?: number; ph?: string; label: string;
}) {
  return (
    <>
      <div className={styles.listItems}>
        {items.map((val, i) => (
          <div key={i} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={`${styles.input} ${styles.inputNoCount}`} value={val} placeholder={ph || "Enter item…"} onChange={e => onUpdate(i, e.target.value)} /></div>
            <button type="button" className={styles.removeItemBtn} onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>}
    </>
  );
}

/* ── Single image ── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string; onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
            <div className={styles.imageUploadPlaceholder}><span className={styles.imageUploadIcon}>🖼️</span><span className={styles.imageUploadText}>Click to Upload</span><span className={styles.imageUploadSub}>{hint}</span></div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}><span className={styles.imagePreviewAction}>✎ Change</span><input type="file" accept="image/*" className={styles.imagePreviewOverlayInput} onChange={e => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} /></div>
            <button type="button" className={styles.removeImageBtn} onClick={e => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ── Multi-image carousel uploader ── */
type ImgItem = { id: string; file: File | null; preview: string };
function MultiImg({ items, onAdd, onRemove, hint, label }: {
  items: ImgItem[]; onAdd: (f: File, p: string) => void; onRemove: (id: string) => void; hint: string; label: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.8rem" }}>
        {items.map(img => (
          <div key={img.id} style={{ position: "relative", width: 130, height: 95, borderRadius: 8, overflow: "hidden", border: "1px solid #e8d5b5" }}>
            <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button type="button" className={styles.removeImageBtn} style={{ top: 4, right: 4 }}
              onClick={() => onRemove(img.id)}>✕</button>
          </div>
        ))}
        <label style={{ width: 130, height: 95, borderRadius: 8, border: "2px dashed rgba(224,123,0,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "rgba(255,250,242,0.6)", gap: "0.3rem" }}>
          <span style={{ fontSize: "1.4rem", color: "rgba(224,123,0,0.5)" }}>＋</span>
          <span style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "0.72rem", color: "#a07840", fontStyle: "italic" }}>{hint}</span>
          <input type="file" accept="image/*" multiple style={{ display: "none" }}
            onChange={e => { Array.from(e.target.files || []).forEach(f => onAdd(f, URL.createObjectURL(f))); e.target.value = ""; }} />
        </label>
      </div>
      <p style={{ fontFamily: "Cormorant Garamond,serif", fontSize: "0.8rem", color: "#a07840", fontStyle: "italic", margin: 0 }}>
        {items.length} {label} uploaded. Click ＋ to add more.
      </p>
    </div>
  );
}

/* ── Form Data type ── */
interface FormData {
  slug: string; status: "Active" | "Inactive";
  // Evolution
  evolutionH2: string; markDistH3: string;
  // Career
  careerH3: string;
  // Fee Cards
  feeCard1Title: string; feeCard2Title: string;
  // FAQ
  faqH2: string;
  // Sections headings
  accomH3: string; foodH3: string;
  luxuryH2: string;
  featuresH2: string; scheduleH3: string;
  // Learning / Eligibility / Evaluation
  learningH2: string; eligibilityH2: string; evaluationH2: string;
  // Ethics
  ethicsH2: string; ethicsQuote: string;
  // Misconceptions
  misconH2: string;
  // Reviews
  reviewsH2: string; reviewsSubtext: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Add300hrContent2() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  /* ── Jodit refs ── */
  const evolutionIntroRef = useRef("");
  const eligibilityRef    = useRef("");
  const evaluationRef     = useRef("");
  const ethicsIntroRef    = useRef("");
  const misconIntroRef    = useRef("");
  const [evoErr,  setEvoErr]  = useState("");
  const [eligErr, setEligErr] = useState("");
  const [evalErr, setEvalErr] = useState("");

  /* ── Dynamic string lists ── */
  const [markDetails,    setMarkDetails]    = useState<string[]>([""]);
  const [careerItems,    setCareerItems]    = useState<string[]>([""]);
  const [feeCard1Items,  setFeeCard1Items]  = useState<string[]>([""]);
  const [feeCard2Items,  setFeeCard2Items]  = useState<string[]>([""]);
  const [luxuryFeatures, setLuxuryFeatures] = useState<string[]>([""]);
  const [featuresList,   setFeaturesList]   = useState<string[]>([""]);
  const [learningItems,  setLearningItems]  = useState<string[]>([""]);
  const [ethicsRules,    setEthicsRules]    = useState<string[]>([""]);
  const [misconItems,    setMisconItems]    = useState<string[]>([""]);

  /* ── Complex dynamic arrays ── */
  const [faqItems, setFaqItems] = useState([{ id: "faq1", question: "", answer: "" }]);
  const [scheduleItems, setScheduleItems] = useState([{ id: "s1", time: "", activity: "" }]);
  const [reviews, setReviews] = useState([{ id: "r1", name: "", role: "", initial: "", text: "" }]);
  const [youtubeVideos, setYoutubeVideos] = useState([{ id: "yt1", videoId: "", title: "" }]);

  /* ── Single images ── */
  const [diplomaFile, setDiplomaFile]         = useState<File | null>(null);
  const [diplomaPrev, setDiplomaPrev]         = useState("");
  const [yogaGardenFile, setYogaGardenFile]   = useState<File | null>(null);
  const [yogaGardenPrev, setYogaGardenPrev]   = useState("");

  /* ── Carousel image arrays ── */
  const [accomImages,    setAccomImages]    = useState<ImgItem[]>([]);
  const [foodImages,     setFoodImages]     = useState<ImgItem[]>([]);
  const [luxuryImages,   setLuxuryImages]   = useState<ImgItem[]>([]);
  const [scheduleImages, setScheduleImages] = useState<ImgItem[]>([]);

  /* carousel helpers */
  const addImg = (setter: React.Dispatch<React.SetStateAction<ImgItem[]>>) => (f: File, p: string) =>
    setter(prev => [...prev, { id: `img-${Date.now()}-${Math.random()}`, file: f, preview: p }]);
  const removeImg = (setter: React.Dispatch<React.SetStateAction<ImgItem[]>>) => (id: string) =>
    setter(prev => prev.filter(x => x.id !== id));

  /* nested item updater */
  const updNested = useCallback(<T,>(arr: T[], set: (v: T[]) => void, id: string, key: keyof T, val: string) => {
    set(arr.map((x: any) => x.id === id ? { ...x, [key]: val } : x) as T[]);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "", status: "Active",
      evolutionH2: "Evolution and certification",
      markDistH3: "Mark Distribution: 300 hour yoga teacher training course in india at AYM Yoga School",
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
      evaluationH2: "Evaluation and Certification — 300 Hour Yoga Teacher Training in India",
      ethicsH2: "Yoga ethics — Codes of conduct during 300 Hour Yoga TTC in Rishikesh at AYM",
      ethicsQuote: "The very heart of yoga is abhyasa means constant practice with steady effort in the direction you want to go.",
      misconH2: "Misconceptions about 300 hour yoga teacher training Rishikesh India",
      reviewsH2: "Student Reviews & Success Stories",
      reviewsSubtext: "Authentic stories of transformation from students who began just like you.",
    },
  });

  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (isEmpty(evolutionIntroRef.current)) { setEvoErr("Required");  hasErr = true; }
    if (isEmpty(eligibilityRef.current))    { setEligErr("Required"); hasErr = true; }
    if (isEmpty(evaluationRef.current))     { setEvalErr("Required"); hasErr = true; }
    if (hasErr) return;
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("evolutionIntro", evolutionIntroRef.current);
      fd.append("eligibilityText", eligibilityRef.current);
      fd.append("evaluationText", evaluationRef.current);
      fd.append("ethicsIntro", ethicsIntroRef.current);
      fd.append("misconIntro", misconIntroRef.current);

      markDetails.forEach(v   => fd.append("markDetails", v));
      careerItems.forEach(v   => fd.append("careerItems", v));
      feeCard1Items.forEach(v => fd.append("feeCard1Items", v));
      feeCard2Items.forEach(v => fd.append("feeCard2Items", v));
      luxuryFeatures.forEach(v => fd.append("luxuryFeatures", v));
      featuresList.forEach(v  => fd.append("featuresList", v));
      learningItems.forEach(v => fd.append("learningItems", v));
      ethicsRules.forEach(v   => fd.append("ethicsRules", v));
      misconItems.forEach(v   => fd.append("misconItems", v));

      fd.append("faqItems",      JSON.stringify(faqItems));
      fd.append("scheduleItems", JSON.stringify(scheduleItems));
      fd.append("reviews",       JSON.stringify(reviews));
      fd.append("youtubeVideos", JSON.stringify(youtubeVideos));

      if (diplomaFile)    fd.append("diplomaImage",    diplomaFile);
      if (yogaGardenFile) fd.append("yogaGardenImage", yogaGardenFile);
      accomImages.forEach(img => { if (img.file) fd.append("accomImages", img.file); });
      foodImages.forEach(img  => { if (img.file) fd.append("foodImages",  img.file); });
      luxuryImages.forEach(img => { if (img.file) fd.append("luxuryImages", img.file); });
      scheduleImages.forEach(img => { if (img.file) fd.append("scheduleImages", img.file); });

      await api.post("/yoga-300hr/content2/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/300hourscourse/300hr-content2"), 1500);
    } catch (e: any) { alert(e?.response?.data?.message || e?.message || "Something went wrong"); }
    finally { setIsSubmitting(false); }
  };

  if (submitted) return (
    <div className={styles.successScreen}><div className={styles.successCard}>
      <div className={styles.successOm}>ॐ</div><div className={styles.successCheck}>✓</div>
      <h2 className={styles.successTitle}>Content 2 Saved!</h2><p className={styles.successText}>Redirecting to list…</p>
    </div></div>
  );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/300hourscourse/300hr-content2")}>300 Hour Content Part 2</button>
        <span className={styles.breadcrumbSep}>›</span><span className={styles.breadcrumbCurrent}>Add New</span>
      </div>
      <div className={styles.pageHeader}><div className={styles.pageHeaderText}>
        <h1 className={styles.pageTitle}>Add New — 300hr Content Part 2</h1>
        <p className={styles.pageSubtitle}>Evolution · FAQ · Accommodation · Schedule · Reviews</p>
      </div></div>
      <div className={styles.ornament}><span>❧</span><div className={styles.ornamentLine}/><span>ॐ</span><div className={styles.ornamentLine}/><span>❧</span></div>

      <div className={styles.formCard}>

        {/* ════ 1. EVOLUTION & CERTIFICATION ════ */}
        <Sec title="Evolution and Certification">
          <F label="Section H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evolutionH2")} /></div></F>
          <LazyJodit label="Introduction Paragraph" cr={evolutionIntroRef} err={evoErr} clr={() => setEvoErr("")}
            ph="The primary purpose of an examination is to prepare students…" h={200} required />
          <F label="Mark Distribution H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("markDistH3")} /></div></F>
          <F label="Mark Distribution Details" hint="Each point: Total marks, theory marks, practical marks etc.">
            <StrList items={markDetails} label="Mark Detail" ph="Total Marks: 200 (Theory: 60 + Practical: 140)"
              onAdd={() => setMarkDetails(p => [...p, ""])}
              onRemove={i => setMarkDetails(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...markDetails]; a[i] = v; setMarkDetails(a); }} />
          </F>
        </Sec><D />

        {/* ════ 2. CAREER & FEE CARDS ════ */}
        <Sec title="Career Opportunities & Fee Cards">
          <F label="Career Section H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("careerH3")} /></div></F>
          <F label="Career Items">
            <StrList items={careerItems} label="Career" ph="Yoga Instructor at the health clubs"
              onAdd={() => setCareerItems(p => [...p, ""])}
              onRemove={i => setCareerItems(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...careerItems]; a[i] = v; setCareerItems(a); }} />
          </F>
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <div className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}><span className={styles.nestedCardNum}>Fee Card 1 (Light)</span></div>
                <div className={styles.nestedCardBody}>
                  <F label="Card Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeCard1Title")} /></div></F>
                  <F label="Card Items (one per line)">
                    <StrList items={feeCard1Items} label="Item" ph="Online Course Fee: 25,000 INR"
                      onAdd={() => setFeeCard1Items(p => [...p, ""])}
                      onRemove={i => setFeeCard1Items(p => p.filter((_, x) => x !== i))}
                      onUpdate={(i, v) => { const a = [...feeCard1Items]; a[i] = v; setFeeCard1Items(a); }} />
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
                      onAdd={() => setFeeCard2Items(p => [...p, ""])}
                      onRemove={i => setFeeCard2Items(p => p.filter((_, x) => x !== i))}
                      onUpdate={(i, v) => { const a = [...feeCard2Items]; a[i] = v; setFeeCard2Items(a); }} />
                  </F>
                </div>
              </div>
            </div>
          </div>
        </Sec><D />

        {/* ════ 3. FAQ ════ */}
        <Sec title="FAQ Section" badge={`${faqItems.length} items`}>
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("faqH2")} /></div></F>
          <F label="FAQ Items">
            {faqItems.map((faq, i) => (
              <div key={faq.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>FAQ {i + 1}</span>
                  {faqItems.length > 1 && (
                    <button type="button" className={styles.removeNestedBtn}
                      onClick={() => setFaqItems(p => p.filter(x => x.id !== faq.id))}>✕ Remove</button>
                  )}
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Question">
                    <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={faq.question} placeholder="Why 300 hour yoga TTC in Rishikesh at AYM?"
                      onChange={e => updNested(faqItems, setFaqItems, faq.id, "question", e.target.value)} /></div>
                  </F>
                  <F label="Answer">
                    <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={3} value={faq.answer}
                      placeholder="AYM Yoga School offers…"
                      onChange={e => updNested(faqItems, setFaqItems, faq.id, "answer", e.target.value)} /></div>
                  </F>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setFaqItems(p => [...p, { id: `faq-${Date.now()}`, question: "", answer: "" }])}>
              ＋ Add FAQ Item
            </button>
          </F>
        </Sec><D />

        {/* ════ 4. ACCOMMODATION CAROUSEL ════ */}
        <Sec title="Accommodation Carousel Images" badge={`${accomImages.length} images`}>
          <F label="Section H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("accomH3")} /></div></F>
          <F label="Accommodation Images" hint="JPG/PNG/WEBP · Multiple images supported">
            <MultiImg items={accomImages} onAdd={addImg(setAccomImages)} onRemove={removeImg(setAccomImages)} hint="Add image" label="accommodation images" />
          </F>
        </Sec><D />

        {/* ════ 5. FOOD CAROUSEL ════ */}
        <Sec title="Food Carousel Images" badge={`${foodImages.length} images`}>
          <F label="Section H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("foodH3")} /></div></F>
          <F label="Food Images" hint="JPG/PNG/WEBP · Multiple images supported">
            <MultiImg items={foodImages} onAdd={addImg(setFoodImages)} onRemove={removeImg(setFoodImages)} hint="Add image" label="food images" />
          </F>
        </Sec><D />

        {/* ════ 6. LUXURY ROOM ════ */}
        <Sec title="Luxury Room & Features">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("luxuryH2")} /></div></F>
          <F label="Luxury Features List">
            <StrList items={luxuryFeatures} label="Feature" ph="Swimming pool"
              onAdd={() => setLuxuryFeatures(p => [...p, ""])}
              onRemove={i => setLuxuryFeatures(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...luxuryFeatures]; a[i] = v; setLuxuryFeatures(a); }} />
          </F>
          <F label="Luxury Room Images" hint="Recommended 500×400px">
            <MultiImg items={luxuryImages} onAdd={addImg(setLuxuryImages)} onRemove={removeImg(setLuxuryImages)} hint="Add image" label="luxury images" />
          </F>
          <F label="Yoga Garden / Full-Width Image" hint="Wide banner image below luxury features">
            <SingleImg preview={yogaGardenPrev} badge="Garden" hint="Wide banner image"
              onSelect={(f, p) => { setYogaGardenFile(f); setYogaGardenPrev(p); }}
              onRemove={() => { setYogaGardenFile(null); setYogaGardenPrev(""); }} />
          </F>
        </Sec><D />

        {/* ════ 7. FEATURES & DAILY SCHEDULE ════ */}
        <Sec title="Features & Daily Schedule">
          <F label="Features Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("featuresH2")} /></div></F>
          <F label="Features List">
            <StrList items={featuresList} label="Feature" ph="Students with basic, intermediate, or advanced knowledge…"
              onAdd={() => setFeaturesList(p => [...p, ""])}
              onRemove={i => setFeaturesList(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...featuresList]; a[i] = v; setFeaturesList(a); }} />
          </F>
          <F label="Schedule H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("scheduleH3")} /></div></F>
          <F label="Daily Schedule Items" hint="Time → Activity pairs. Add/remove rows as needed.">
            {scheduleItems.map((s, i) => (
              <div key={s.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                <span className={styles.listNum}>{i + 1}</span>
                <div className={styles.inputWrap} style={{ width: 120, flexShrink: 0 }}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={s.time} placeholder="06:30 AM"
                    onChange={e => updNested(scheduleItems, setScheduleItems, s.id, "time", e.target.value)} />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={s.activity} placeholder="Pranayama And Meditation"
                    onChange={e => updNested(scheduleItems, setScheduleItems, s.id, "activity", e.target.value)} />
                </div>
                <button type="button" className={styles.removeItemBtn} onClick={() => setScheduleItems(p => p.filter(x => x.id !== s.id))} disabled={scheduleItems.length <= 1}>✕</button>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setScheduleItems(p => [...p, { id: `s-${Date.now()}`, time: "", activity: "" }])}>
              ＋ Add Schedule Row
            </button>
          </F>
          <F label="Schedule Side Images" hint="3 images shown beside the schedule table">
            <MultiImg items={scheduleImages} onAdd={addImg(setScheduleImages)} onRemove={removeImg(setScheduleImages)} hint="Add image" label="schedule images" />
          </F>
        </Sec><D />

        {/* ════ 8. LEARNING OUTCOMES ════ */}
        <Sec title="Learning Outcomes">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("learningH2")} /></div></F>
          <F label="Learning Outcome Items">
            <StrList items={learningItems} label="Outcome" ph="Upon completion, students will be awarded the prestigious 300-hour YTTC certification…"
              onAdd={() => setLearningItems(p => [...p, ""])}
              onRemove={i => setLearningItems(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...learningItems]; a[i] = v; setLearningItems(a); }} />
          </F>
        </Sec><D />

        {/* ════ 9. ELIGIBILITY ════ */}
        <Sec title="Eligibility Section">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("eligibilityH2")} /></div></F>
          <LazyJodit label="Eligibility Text" cr={eligibilityRef} err={eligErr} clr={() => setEligErr("")}
            ph="300 Hour yoga teacher certification is for individuals having a high degree of motivation…" h={200} required />
        </Sec><D />

        {/* ════ 10. EVALUATION & CERTIFICATION ════ */}
        <Sec title="Evaluation and Certification">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("evaluationH2")} /></div></F>
          <LazyJodit label="Evaluation Text" cr={evaluationRef} err={evalErr} clr={() => setEvalErr("")}
            ph="To accomplish a training certificate of 300 Hour yoga teacher training course students need…" h={200} required />
        </Sec><D />

        {/* ════ 11. YOGA ETHICS ════ */}
        <Sec title="Yoga Ethics — Code of Conduct">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("ethicsH2")} /></div></F>
          <LazyJodit label="Ethics Introduction (optional)" cr={ethicsIntroRef}
            ph="Yoga is a spiritual discipline that combines physical, mental and spiritual elements…" h={160} />
          <F label="Ethics Quote" hint="Displayed in styled quote block">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={2} {...register("ethicsQuote")} /></div>
          </F>
          <F label="Ethics Rules / Guidelines">
            <StrList items={ethicsRules} label="Rule" ph="Students need to be obedient in classes…"
              onAdd={() => setEthicsRules(p => [...p, ""])}
              onRemove={i => setEthicsRules(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...ethicsRules]; a[i] = v; setEthicsRules(a); }} />
          </F>
          <F label="Diploma / Graduation Image" hint="Full-width image below ethics rules">
            <SingleImg preview={diplomaPrev} badge="Diploma" hint="Students with diploma image"
              onSelect={(f, p) => { setDiplomaFile(f); setDiplomaPrev(p); }}
              onRemove={() => { setDiplomaFile(null); setDiplomaPrev(""); }} />
          </F>
        </Sec><D />

        {/* ════ 12. MISCONCEPTIONS ════ */}
        <Sec title="Misconceptions Section">
          <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("misconH2")} /></div></F>
          <LazyJodit label="Shake your myths — Intro Paragraph (optional)" cr={misconIntroRef}
            ph="The 300-hour yoga teacher training is often seen as merely an advanced step…" h={160} />
          <F label="Misconception Items">
            <StrList items={misconItems} label="Misconception" ph="You think you are signing up to learn yoga, but what you are truly learning about is yourself…"
              onAdd={() => setMisconItems(p => [...p, ""])}
              onRemove={i => setMisconItems(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...misconItems]; a[i] = v; setMisconItems(a); }} />
          </F>
        </Sec><D />

        {/* ════ 13. STUDENT REVIEWS ════ */}
        <Sec title="Student Reviews & YouTube Videos" badge={`${reviews.length} reviews · ${youtubeVideos.length} videos`}>
          <div className={styles.grid2}>
            <F label="Section H2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsH2")} /></div></F>
            <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("reviewsSubtext")} /></div></F>
          </div>
          <F label="Review Cards">
            {reviews.map((r, i) => (
              <div key={r.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Review {i + 1}</span>
                  {reviews.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setReviews(p => p.filter(x => x.id !== r.id))}>✕ Remove</button>}
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Name"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={r.name} placeholder="Karina Miller" onChange={e => updNested(reviews, setReviews, r.id, "name", e.target.value)} /></div></F>
                    <F label="Role"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={r.role} placeholder="Certified Yoga Teacher" onChange={e => updNested(reviews, setReviews, r.id, "role", e.target.value)} /></div></F>
                  </div>
                  <F label="Initial (shown if no avatar)" hint="Single letter, e.g. K">
                    <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={r.initial} placeholder="K" maxLength={2} onChange={e => updNested(reviews, setReviews, r.id, "initial", e.target.value)} /></div>
                  </F>
                  <F label="Review Text">
                    <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={4} value={r.text} placeholder="My experience at AYM Yoga School was amazing!…" onChange={e => updNested(reviews, setReviews, r.id, "text", e.target.value)} /></div>
                  </F>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setReviews(p => [...p, { id: `r-${Date.now()}`, name: "", role: "", initial: "", text: "" }])}>
              ＋ Add Review
            </button>
          </F>
          <F label="YouTube Videos" hint="Paste YouTube video ID (e.g. pXU4_SXdNdY)">
            {youtubeVideos.map((yt, i) => (
              <div key={yt.id} className={styles.nestedCard} style={{ marginBottom: "0.6rem" }}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Video {i + 1}</span>
                  {youtubeVideos.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => setYoutubeVideos(p => p.filter(x => x.id !== yt.id))}>✕ Remove</button>}
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="YouTube Video ID"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={yt.videoId} placeholder="pXU4_SXdNdY" onChange={e => updNested(youtubeVideos, setYoutubeVideos, yt.id, "videoId", e.target.value)} /></div></F>
                    <F label="Video Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={yt.title} placeholder="300 Hour Yoga TTC Review by Alex…" onChange={e => updNested(youtubeVideos, setYoutubeVideos, yt.id, "title", e.target.value)} /></div></F>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addItemBtn}
              onClick={() => setYoutubeVideos(p => [...p, { id: `yt-${Date.now()}`, videoId: "", title: "" }])}>
              ＋ Add YouTube Video
            </button>
          </F>
        </Sec><D />

        {/* ════ PAGE SETTINGS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="300-hour-yoga-ttc-content2" {...register("slug", { required: "Required" })} />
              </div>
              {errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}
            </F>
            <F label="Status">
              <div className={styles.selectWrap}>
                <select className={styles.select} {...register("status")}><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </F>
          </div>
        </Sec>

      </div>{/* end formCard */}

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/300hourscourse/300hr-content2" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> Save Content 2</>}
        </button>
      </div>
    </div>
  );
}