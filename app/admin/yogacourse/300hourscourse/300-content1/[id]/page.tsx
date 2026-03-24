"use client";

import { use, useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const joditConfig = {
  readonly: false, toolbar: true, spellcheck: true, language: "en",
  toolbarButtonSize: "medium", toolbarAdaptive: false,
  showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false,
  askBeforePasteHTML: false, askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
  buttons: ["bold","italic","underline","strikethrough","|","font","fontsize","brush","|","paragraph","align","|","ul","ol","|","link","|","undo","redo","|","selectall","cut","copy","paste"],
  uploader: { insertImageAsBase64URI: true }, height: 220, placeholder: "",
} as any;

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

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

function InlineJodit({ value, onChange, ph = "Start typing…", h = 200, err, clr }: {
  value: string; onChange: (v: string) => void; ph?: string; h?: number; err?: string; clr?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "300px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
      {visible ? (
        <JoditEditor value={value} config={{ ...joditConfig, placeholder: ph, height: h }}
          onChange={v => { onChange(v); if (clr && !isEmpty(v)) clr(); }} />
      ) : (
        <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

function LazyJodit({ label, hint, cr, err, clr, ph = "Start typing…", h = 200, required = false, defaultValue = "" }: {
  label: string; hint?: string; cr: React.MutableRefObject<string>; err?: string; clr?: () => void;
  ph?: string; h?: number; required?: boolean; defaultValue?: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (defaultValue && !cr.current) cr.current = defaultValue; }, [defaultValue, cr]);
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
          <JoditEditor value={defaultValue} config={{ ...joditConfig, placeholder: ph, height: h }} onChange={handleChange} />
        ) : (
          <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13 }}>✦ Scroll to load editor…</div>
        )}
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

function DynamicRichList({ items, onAdd, onUpdate, onRemove, addLabel, ph }: {
  items: { id: string; content: string }[];
  onAdd: () => void; onUpdate: (id: string, v: string) => void; onRemove: (id: string) => void;
  addLabel: string; ph?: string;
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Paragraph {i + 1}</span>
            {items.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(item.id)}>✕ Remove</button>}
          </div>
          <div className={styles.nestedCardBody}>
            <InlineJodit value={item.content} onChange={v => onUpdate(item.id, v)} ph={ph} h={180} />
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {addLabel}</button>
    </div>
  );
}

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

interface ModuleState { num: number; label: string; title: string; content: string; subTitle: string; listItems: string[]; twoCol: boolean; }

const INIT_MODULES: ModuleState[] = [
  { num: 1, label: "Module 1", title: "Concept and Meaning of Yoga Therapy", content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 2, label: "Module 2", title: "Yoga Philosophy",                      content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 3, label: "Module 3", title: "Yoga Anatomy and Ayurveda",            content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 4, label: "Module 4", title: "Static Multi-style",                   content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 5, label: "Module 5", title: "Dynamic Multi-style",                  content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 6, label: "Module 6", title: "Kriya or Detoxification",              content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 7, label: "Module 7", title: "Teaching Practice",                    content: "", subTitle: "", listItems: [""], twoCol: false },
  { num: 8, label: "Module 8", title: "Pranayama and Meditation",             content: "", subTitle: "Meditation techniques", listItems: [""], twoCol: true },
  { num: 9, label: "Module 9", title: "Mantra Chanting",                      content: "", subTitle: "", listItems: [""], twoCol: false },
];

interface FormData {
  slug: string; status: "Active" | "Inactive"; pageMainH1: string; heroImgAlt: string; topSectionH2: string;
  overviewH2: string; overviewCertName: string; overviewLevel: string; overviewEligibility: string;
  overviewMinAge: string; overviewCredits: string; overviewLanguage: string;
  upcomingDatesH3: string; upcomingDatesSubtext: string;
  feeIncludedTitle: string; feeNotIncludedTitle: string; syllabusH2: string; syllabusIntroPara: string;
}

export default function Edit300hrContent1({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [pageLoading, setPageLoading]   = useState(true);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");

  const [introParagraphs, setIntroParagraphs] = useState([{ id: "ip1", content: "" }]);
  const [topParagraphs, setTopParagraphs]     = useState([{ id: "tp1", content: "" }]);

  const syllabusIntroRef = useRef("");
  const [sylDefVal, setSylDefVal] = useState("");
  const [sylErr, setSylErr] = useState("");

  const [modules, setModules] = useState<ModuleState[]>(INIT_MODULES);
  const [inclFee, setInclFee]       = useState<string[]>([""]);
  const [notInclFee, setNotInclFee] = useState<string[]>([""]);

  const addPara    = (set: React.Dispatch<React.SetStateAction<{id:string;content:string}[]>>) => set(p => [...p, { id: `para-${Date.now()}`, content: "" }]);
  const removePara = (set: React.Dispatch<React.SetStateAction<{id:string;content:string}[]>>, id: string) => set(p => p.filter(x => x.id !== id));
  const updatePara = (set: React.Dispatch<React.SetStateAction<{id:string;content:string}[]>>, id: string, v: string) => set(p => p.map(x => x.id === id ? { ...x, content: v } : x));

  const updMod     = useCallback((idx: number, key: keyof ModuleState, val: any) => setModules(p => p.map((m, i) => i === idx ? { ...m, [key]: val } : m)), []);
  const updModItem = useCallback((idx: number, ii: number, val: string) => setModules(p => p.map((m, i) => { if (i !== idx) return m; const a = [...m.listItems]; a[ii] = val; return { ...m, listItems: a }; })), []);
  const addModItem = useCallback((idx: number) => setModules(p => p.map((m, i) => i === idx ? { ...m, listItems: [...m.listItems, ""] } : m)), []);
  const removeModItem = useCallback((idx: number, ii: number) => setModules(p => p.map((m, i) => i === idx ? { ...m, listItems: m.listItems.filter((_, x) => x !== ii) } : m)), []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  /* ── Prefill ── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`/yoga-300hr/content1/${id}`);
        const d = res.data?.data;
        if (!d) return;

        reset({
          slug: d.slug, status: d.status, pageMainH1: d.pageMainH1, heroImgAlt: d.heroImgAlt,
          topSectionH2: d.topSectionH2 || "",
          overviewH2: d.overview?.h2 || "", overviewCertName: d.overview?.certName || "",
          overviewLevel: d.overview?.level || "", overviewEligibility: d.overview?.eligibility || "",
          overviewMinAge: d.overview?.minAge || "", overviewCredits: d.overview?.credits || "",
          overviewLanguage: d.overview?.language || "",
          upcomingDatesH3: d.upcomingDatesH3 || "", upcomingDatesSubtext: d.upcomingDatesSubtext || "",
          feeIncludedTitle: d.feeIncludedTitle || "", feeNotIncludedTitle: d.feeNotIncludedTitle || "",
          syllabusH2: d.syllabusH2 || "", syllabusIntroPara: "",
        });

        /* dynamic paragraphs */
        if (d.introParagraphs?.length) {
          setIntroParagraphs(d.introParagraphs.map((content: string, i: number) => ({ id: `ip${i}`, content })));
        }
        if (d.topParagraphs?.length) {
          setTopParagraphs(d.topParagraphs.map((content: string, i: number) => ({ id: `tp${i}`, content })));
        }

        /* syllabus intro */
        syllabusIntroRef.current = d.syllabusIntro || "";
        setSylDefVal(d.syllabusIntro || "");

        /* fee lists */
        if (d.includedFee?.length)    setInclFee(d.includedFee);
        if (d.notIncludedFee?.length) setNotInclFee(d.notIncludedFee);

        /* modules */
        if (d.modules?.length) setModules(d.modules);

        /* hero image */
        if (d.heroImage) setHeroPrev(`${BASE_URL}${d.heroImage}`);
      } catch { alert("Failed to load record."); }
      finally { setPageLoading(false); }
    };
    load();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (isEmpty(syllabusIntroRef.current)) { setSylErr("Required"); hasErr = true; }
    if (hasErr) return;
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
      introParagraphs.forEach((p, i) => fd.append(`introPara${i + 1}`, p.content));
      fd.append("introParagraphCount", String(introParagraphs.length));
      topParagraphs.forEach((p, i) => fd.append(`topPara${i + 1}`, p.content));
      fd.append("topParagraphCount", String(topParagraphs.length));
      fd.append("syllabusIntro", syllabusIntroRef.current);
      inclFee.forEach(v    => fd.append("includedFee", v));
      notInclFee.forEach(v => fd.append("notIncludedFee", v));
      fd.append("modules", JSON.stringify(modules));
      if (heroFile) fd.append("heroImage", heroFile);
      await api.put(`/yoga-300hr/content1/update/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/300hourscourse/300hr-content1"), 1500);
    } catch (e: any) { alert(e?.response?.data?.message || e?.message || "Something went wrong"); }
    finally { setIsSubmitting(false); }
  };

  if (pageLoading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className={styles.spinner} /><span style={{ marginLeft: 12 }}>Loading record…</span>
    </div>
  );
  if (submitted) return (
    <div className={styles.successScreen}><div className={styles.successCard}>
      <div className={styles.successOm}>ॐ</div><div className={styles.successCheck}>✓</div>
      <h2 className={styles.successTitle}>Content 1 Updated!</h2><p className={styles.successText}>Redirecting to list…</p>
    </div></div>
  );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/300hourscourse/300hr-content1")}>300 Hour Content Part 1</button>
        <span className={styles.breadcrumbSep}>›</span><span className={styles.breadcrumbCurrent}>Edit</span>
      </div>
      <div className={styles.pageHeader}><div className={styles.pageHeaderText}>
        <h1 className={styles.pageTitle}>Edit — 300hr Content Part 1</h1>
        <p className={styles.pageSubtitle}>Hero → Syllabus · Modules 1–9</p>
      </div></div>
      <div className={styles.ornament}><span>❧</span><div className={styles.ornamentLine}/><span>ॐ</span><div className={styles.ornamentLine}/><span>❧</span></div>

      <div className={styles.formCard}>

        {/* 1. HERO */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" req>
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageMainH1", { required: true })} /></div>
          </F>
          <F label="Hero Image" hint="Leave unchanged to keep existing image">
            <SingleImg preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px"
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); }} />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("heroImgAlt")} /></div>
          </F>
        </Sec><D />

        {/* 2. INTRO PARAGRAPHS */}
        <Sec title="Introduction Paragraphs" badge="Expandable">
          <DynamicRichList items={introParagraphs}
            onAdd={() => addPara(setIntroParagraphs)}
            onUpdate={(id, v) => updatePara(setIntroParagraphs, id, v)}
            onRemove={id => removePara(setIntroParagraphs, id)}
            addLabel="Intro Paragraph" ph="The 300 hour yoga teacher training course…" />
        </Sec><D />

        {/* 3. TOP SECTION */}
        <Sec title="Top Section — Second Heading & Paragraphs" badge="Expandable">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("topSectionH2")} /></div>
          </F>
          <F label="Top Section Paragraphs">
            <DynamicRichList items={topParagraphs}
              onAdd={() => addPara(setTopParagraphs)}
              onUpdate={(id, v) => updatePara(setTopParagraphs, id, v)}
              onRemove={id => removePara(setTopParagraphs, id)}
              addLabel="Paragraph" ph="AYM is one of the best 300 hour yoga teacher training schools…" />
          </F>
        </Sec><D />

        {/* 4. OVERVIEW */}
        <Sec title="Course Overview Box">
          <F label="Overview H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewH2")} /></div></F>
          <div className={styles.grid2}>
            <F label="Certification Name"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCertName")} /></div></F>
            <F label="Course Level"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLevel")} /></div></F>
          </div>
          <F label="Eligibility"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`} rows={2} {...register("overviewEligibility")} /></div></F>
          <div className={styles.grid3}>
            <F label="Min Age"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewMinAge")} /></div></F>
            <F label="Credits"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewCredits")} /></div></F>
            <F label="Language"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewLanguage")} /></div></F>
          </div>
        </Sec><D />

        {/* 5. UPCOMING DATES */}
        <Sec title="Upcoming Course Dates — Headings" badge="Data from DB">
          <div className={styles.grid2}>
            <F label="Section H3"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesH3")} /></div></F>
            <F label="Sub-text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesSubtext")} /></div></F>
          </div>
        </Sec><D />

        {/* 6. FEE */}
        <Sec title="Fee — Included & Not Included">
          <F label="Included Section Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeIncludedTitle")} /></div></F>
          <F label="Included Items">
            <StrList items={inclFee} label="Item" ph="Six days of yoga…"
              onAdd={() => setInclFee(p => [...p, ""])} onRemove={i => setInclFee(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...inclFee]; a[i] = v; setInclFee(a); }} />
          </F>
          <div style={{ marginTop: "1.2rem" }}>
            <F label="Not Included Section Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeNotIncludedTitle")} /></div></F>
          </div>
          <F label="Not Included Items">
            <StrList items={notInclFee} label="Item" ph="Any Airfare."
              onAdd={() => setNotInclFee(p => [...p, ""])} onRemove={i => setNotInclFee(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...notInclFee]; a[i] = v; setNotInclFee(a); }} />
          </F>
        </Sec><D />

        {/* 7. SYLLABUS */}
        <Sec title="Syllabus Section">
          <F label="Syllabus H2 Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} {...register("syllabusH2")} /></div></F>
          <LazyJodit label="Syllabus Introduction Paragraph" cr={syllabusIntroRef} err={sylErr} clr={() => setSylErr("")}
            defaultValue={sylDefVal} ph="Below is the summarized course syllabus…" h={200} required />
        </Sec><D />

        {/* 8–16. MODULES 1–9 */}
        {modules.map((mod, idx) => (
          <div key={mod.num}>
            <Sec title={`${mod.label}: ${mod.title}`}>
              <div className={styles.grid2}>
                <F label="Tab Label"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={mod.label} onChange={e => updMod(idx, "label", e.target.value)} /></div></F>
                <F label="Module Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={mod.title} onChange={e => updMod(idx, "title", e.target.value)} /></div></F>
              </div>
              <F label="Module Rich Content (Body Text)">
                <InlineJodit value={mod.content} onChange={v => updMod(idx, "content", v)} ph="This module covers…" h={200} />
              </F>
              <F label="Sub-Heading (optional)" hint="e.g. 'Meditation techniques' — shown above list">
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={mod.subTitle} placeholder="Optional sub-heading…" onChange={e => updMod(idx, "subTitle", e.target.value)} /></div>
              </F>
              <F label="Topic / Item List">
                <StrList items={mod.listItems} label="Item" ph="Enter topic or list item…"
                  onAdd={() => addModItem(idx)} onRemove={ii => removeModItem(idx, ii)}
                  onUpdate={(ii, v) => updModItem(idx, ii, v)} />
              </F>
              <F label="Two-Column Layout" hint="Enable for modules with many list items">
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={mod.twoCol} onChange={e => updMod(idx, "twoCol", e.target.checked)} style={{ width: 16, height: 16 }} />
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem", color: "#3d1d00" }}>Display list in two columns</span>
                </label>
              </F>
            </Sec><D />
          </div>
        ))}

        {/* PAGE SETTINGS */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="300-hour-yoga-teacher-training-rishikesh" {...register("slug", { required: "Required" })} />
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
      </div>

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/300hourscourse/300hr-content1" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <><span className={styles.spinner} /> Updating…</> : <><span>✦</span> Update Content 1</>}
        </button>
      </div>
    </div>
  );
}