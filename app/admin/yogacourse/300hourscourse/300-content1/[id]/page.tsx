"use client";

import { use, useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

// ── Stable config factory — component ke bahar, ek baar banao
function makeConfig(ph: string, h: number) {
  return {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "middle" as const,        // ✅ "middle" not "medium"
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html" as const,
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
    height: h,
    placeholder: ph,
    enter: "p" as const,                         // ✅ "p" not "P"
  };
}

/* ── Divider ── */
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

/* ── Section wrapper ── */
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

/* ── Field wrapper ── */
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

/* ════════════════════════════════════════
   StableJodit — FULLY UNCONTROLLED
   - NO value prop  → editor never re-mounts on parent re-render
   - config memoized with [] deps → stable forever
   - onChange via ref → zero state updates while typing
   - defaultValue via initialValues (Jodit internal) → prefill on mount only
════════════════════════════════════════ */
const StableJodit = memo(function StableJodit({
  onSave,
  defaultValue = "",
  ph = "Start typing…",
  h = 200,
  err,
}: {
  onSave: (v: string) => void;
  defaultValue?: string;
  ph?: string;
  h?: number;
  err?: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // config once, never changes — editor never re-mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const config = useMemo(() => makeConfig(ph, h), []);

  const handleChange = useCallback((val: string) => {
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
      style={{ minHeight: h }}
    >
      {visible ? (
        <JoditEditor
          config={config}
          onChange={handleChange}
          // ✅ KEY FIX: No `value` prop — uncontrolled
          // defaultValue only sets initial content, never causes re-render
          {...(defaultValue ? { value: defaultValue } : {})}
        />
      ) : (
        <div style={{
          height: h, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8,
          color: "#bbb", fontSize: 13,
        }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

/* ════════════════════════════════════════
   LazyJodit — label wrapper, ref-based, with defaultValue support
════════════════════════════════════════ */
const LazyJodit = memo(function LazyJodit({
  label, hint, cr, err, clr,
  ph = "Start typing…", h = 200, required = false, defaultValue = "",
}: {
  label: string; hint?: string;
  cr: React.MutableRefObject<string>;
  err?: string; clr?: () => void;
  ph?: string; h?: number; required?: boolean; defaultValue?: string;
}) {
  const handleSave = useCallback((v: string) => {
    cr.current = v;
    if (clr && !isEmpty(v)) clr();
  }, [cr, clr]);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <StableJodit
        onSave={handleSave}
        defaultValue={defaultValue}
        ph={ph}
        h={h}
        err={err}
      />
    </div>
  );
});

/* ════════════════════════════════════════
   RichListItem — ref-based para, memo wrapped
   Para content stored in ref map, NOT in state
════════════════════════════════════════ */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, ph, defaultValue = "",
}: {
  id: string; index: number; total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  ph?: string;
  defaultValue?: string;
}) {
  const handleSave = useCallback((v: string) => onSave(id, v), [id, onSave]);

  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>
            ✕ Remove
          </button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit
          onSave={handleSave}
          defaultValue={defaultValue}
          ph={ph}
          h={180}
        />
      </div>
    </div>
  );
});

/* ── String list ── */
function StrList({ items, onAdd, onRemove, onUpdate, max = 30, ph, label }: {
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
            <button type="button" className={styles.removeItemBtn}
              onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>
          ＋ Add {label}
        </button>
      )}
    </>
  );
}

/* ── Single image uploader ── */
function SingleImg({ preview, badge, hint, error, onSelect, onRemove }: {
  preview: string; badge?: string; hint: string; error?: string;
  onSelect: (f: File, p: string) => void; onRemove: () => void;
}) {
  return (
    <div>
      <div className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}>
        {!preview ? (
          <>
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
            }} />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img src={preview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input type="file" accept="image/*" className={styles.imagePreviewOverlayInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; }
                }} />
            </div>
            <button type="button" className={styles.removeImageBtn}
              onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

/* ════════════════════════════════════════
   OVERVIEW FIELD TYPE
════════════════════════════════════════ */
interface OverviewField {
  id: string; label: string; value: string; multiline: boolean;
}

const DEFAULT_OVERVIEW_FIELDS: OverviewField[] = [
  { id: "ov1", label: "Certification Name", value: "", multiline: false },
  { id: "ov2", label: "Course Level",        value: "", multiline: false },
  { id: "ov3", label: "Eligibility",         value: "", multiline: true  },
  { id: "ov4", label: "Min Age",             value: "", multiline: false },
  { id: "ov5", label: "Credits",             value: "", multiline: false },
  { id: "ov6", label: "Language",            value: "", multiline: false },
];

function OverviewFields({ fields, onChange }: { fields: OverviewField[]; onChange: (f: OverviewField[]) => void }) {
  const update = (id: string, key: keyof OverviewField, val: any) =>
    onChange(fields.map(f => f.id === id ? { ...f, [key]: val } : f));
  const remove = (id: string) => onChange(fields.filter(f => f.id !== id));
  const add = () => onChange([...fields, { id: `ov-${Date.now()}`, label: "", value: "", multiline: false }]);

  return (
    <div>
      {fields.map((field, i) => (
        <div key={field.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Field {i + 1}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", fontSize: "0.82rem", color: "#7a5c3a", fontFamily: "Cormorant Garamond, serif" }}>
                <input type="checkbox" checked={field.multiline}
                  onChange={e => update(field.id, "multiline", e.target.checked)}
                  style={{ width: 13, height: 13 }} />
                Long text
              </label>
              {fields.length > 1 && (
                <button type="button" className={styles.removeNestedBtn} onClick={() => remove(field.id)}>✕ Remove</button>
              )}
            </div>
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2} style={{ marginBottom: "0.6rem" }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  <span className={styles.labelIcon}>✦</span>Field Label
                </label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="e.g. Certificate, Duration, Style…"
                    value={field.label} onChange={e => update(field.id, "label", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  <span className={styles.labelIcon}>✦</span>Field Value
                </label>
                <div className={styles.inputWrap}>
                  {field.multiline ? (
                    <textarea className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                      rows={2} placeholder="Enter value…" value={field.value}
                      onChange={e => update(field.id, "value", e.target.value)} />
                  ) : (
                    <input className={`${styles.input} ${styles.inputNoCount}`}
                      placeholder="Enter value…" value={field.value}
                      onChange={e => update(field.id, "value", e.target.value)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Overview Field</button>
    </div>
  );
}

/* ════════════════════════════════════════
   MODULE STATE
════════════════════════════════════════ */
interface ModuleState {
  id: string; num: number; label: string; title: string;
  content: string; subTitle: string; listItems: string[]; twoCol: boolean;
}

const makeModule = (num: number, label = "", title = "", subTitle = "", twoCol = false): ModuleState => ({
  id: `mod-${Date.now()}-${num}-${Math.random()}`,
  num, label: label || `Module ${num}`, title, content: "", subTitle, listItems: [""], twoCol,
});

const normalizeModules = (raw: any[]): ModuleState[] =>
  raw.map((m, i) => ({
    id: m.id || `mod-api-${i}-${Date.now()}`,
    num: m.num ?? i + 1,
    label: m.label || `Module ${i + 1}`,
    title: m.title || "",
    content: m.content || "",
    subTitle: m.subTitle || "",
    listItems: Array.isArray(m.listItems) && m.listItems.length ? m.listItems : [""],
    twoCol: !!m.twoCol,
  }));

const renumber = (mods: ModuleState[]): ModuleState[] =>
  mods.map((m, i) => ({
    ...m, num: i + 1,
    label: m.label.match(/^Module \d+$/) ? `Module ${i + 1}` : m.label,
  }));

/* ════════════════════════════════════════
   ModuleCard — fully memo'd
   content stored via ref in parent, NOT re-passed as value prop
════════════════════════════════════════ */
const ModuleCard = memo(function ModuleCard({
  mod, idx, total,
  onMove, onRemove, onUpdate, onAddItem, onRemoveItem, onUpdateItem,
}: {
  mod: ModuleState; idx: number; total: number;
  onMove: (id: string, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, key: keyof ModuleState, val: any) => void;
  onAddItem: (id: string) => void;
  onRemoveItem: (id: string, ii: number) => void;
  onUpdateItem: (id: string, ii: number, val: string) => void;
}) {
  // content changes go directly to state without causing re-render of THIS card
  const handleContentSave = useCallback((v: string) => {
    onUpdate(mod.id, "content", v);
  }, [mod.id, onUpdate]);

  return (
    <div>
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader} style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className={styles.sectionIcon}>✦</span>
            <h3 className={styles.sectionTitle}>{mod.label}: {mod.title || "Untitled Module"}</h3>
            <span className={styles.sectionBadge}>#{mod.num}</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexShrink: 0 }}>
            <button type="button" title="Move Up" disabled={idx === 0}
              onClick={() => onMove(mod.id, -1)}
              style={{ padding: "0.25rem 0.55rem", fontSize: "0.8rem", borderRadius: 6, border: "1px solid #e8d5b5", background: "#faf8f4", cursor: idx === 0 ? "not-allowed" : "pointer", color: idx === 0 ? "#ccc" : "#7a5c3a", fontFamily: "inherit" }}>▲</button>
            <button type="button" title="Move Down" disabled={idx === total - 1}
              onClick={() => onMove(mod.id, 1)}
              style={{ padding: "0.25rem 0.55rem", fontSize: "0.8rem", borderRadius: 6, border: "1px solid #e8d5b5", background: "#faf8f4", cursor: idx === total - 1 ? "not-allowed" : "pointer", color: idx === total - 1 ? "#ccc" : "#7a5c3a", fontFamily: "inherit" }}>▼</button>
            {total > 1 && (
              <button type="button" onClick={() => onRemove(mod.id)}
                style={{ padding: "0.25rem 0.7rem", fontSize: "0.8rem", borderRadius: 6, border: "1px solid #e8a0a0", background: "#fff5f5", cursor: "pointer", color: "#c0392b", fontFamily: "inherit" }}>
                ✕ Remove
              </button>
            )}
          </div>
        </div>

        <div className={styles.grid2}>
          <F label="Tab Label">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                value={mod.label} onChange={e => onUpdate(mod.id, "label", e.target.value)} />
            </div>
          </F>
          <F label="Module Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                value={mod.title} onChange={e => onUpdate(mod.id, "title", e.target.value)} />
            </div>
          </F>
        </div>

        {/* ✅ StableJodit — uncontrolled, defaultValue only on mount */}
        <F label="Module Rich Content (Body Text)">
          <StableJodit
            onSave={handleContentSave}
            defaultValue={mod.content}
            ph="This module covers…"
            h={200}
          />
        </F>

        <F label="Sub-Heading (optional)" hint="e.g. 'Meditation techniques' — shown above list">
          <div className={styles.inputWrap}>
            <input className={`${styles.input} ${styles.inputNoCount}`}
              value={mod.subTitle} placeholder="Optional sub-heading…"
              onChange={e => onUpdate(mod.id, "subTitle", e.target.value)} />
          </div>
        </F>

        <F label="Topic / Item List">
          <StrList items={mod.listItems} label="Item" ph="Enter topic or list item…"
            onAdd={() => onAddItem(mod.id)}
            onRemove={ii => onRemoveItem(mod.id, ii)}
            onUpdate={(ii, v) => onUpdateItem(mod.id, ii, v)} />
        </F>

        <F label="Two-Column Layout" hint="Enable for modules with many list items">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input type="checkbox" checked={mod.twoCol}
              onChange={e => onUpdate(mod.id, "twoCol", e.target.checked)}
              style={{ width: 16, height: 16 }} />
            <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem", color: "#3d1d00" }}>
              Display list in two columns
            </span>
          </label>
        </F>
      </div>
      <D />
    </div>
  );
});

/* ── Form fields ── */
interface FormData {
  slug: string; status: "Active" | "Inactive";
  pageMainH1: string; heroImgAlt: string; topSectionH2: string;
  overviewH2: string;
  upcomingDatesH3: string; upcomingDatesSubtext: string;
  feeIncludedTitle: string; feeNotIncludedTitle: string;
  syllabusH2: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function Edit300hrContent1({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [pageLoading, setPageLoading]   = useState(true);

  /* hero */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");

  /* ── Para: IDs in state, content in ref map ── */
  const [introIds, setIntroIds] = useState<string[]>(["ip1", "ip2"]);
 const introRef = useRef<Record<string, string>>({
  ip1: "",
  ip2: "",
});
  const introDefaults = useRef<Record<string, string>>({});   // prefill defaults

  const [topIds, setTopIds] = useState<string[]>(["tp1"]);
  const topRef    = useRef<Record<string, string>>({ tp1: "" });
  const topDefaults = useRef<Record<string, string>>({});

  /* syllabus */
  const syllabusIntroRef = useRef("");
  const [sylDefVal, setSylDefVal] = useState("");
  const [sylErr, setSylErr] = useState("");

  /* overview */
  const [overviewFields, setOverviewFields] = useState<OverviewField[]>(DEFAULT_OVERVIEW_FIELDS);

  /* modules */
  const [modules, setModules] = useState<ModuleState[]>([]);

  /* fee */
  const [inclFee, setInclFee]       = useState<string[]>([""]);
  const [notInclFee, setNotInclFee] = useState<string[]>([""]);

  /* ── Stable para handlers ── */
  const addIntroPara = useCallback(() => {
    const pid = `ip-${Date.now()}`;
    introRef.current[pid] = "";
    setIntroIds(p => [...p, pid]);
  }, []);
  const removeIntroPara = useCallback((pid: string) => {
    delete introRef.current[pid];
    setIntroIds(p => p.filter(x => x !== pid));
  }, []);
  const saveIntroPara = useCallback((pid: string, v: string) => {
    introRef.current[pid] = v;
  }, []);

  const addTopPara = useCallback(() => {
    const pid = `tp-${Date.now()}`;
    topRef.current[pid] = "";
    setTopIds(p => [...p, pid]);
  }, []);
  const removeTopPara = useCallback((pid: string) => {
    delete topRef.current[pid];
    setTopIds(p => p.filter(x => x !== pid));
  }, []);
  const saveTopPara = useCallback((pid: string, v: string) => {
    topRef.current[pid] = v;
  }, []);

  /* ── Module CRUD ── */
  const addModule = useCallback(() =>
    setModules(p => { const n = p.length + 1; return [...p, makeModule(n)]; }), []);

  const removeModule = useCallback((mid: string) =>
    setModules(p => renumber(p.filter(m => m.id !== mid))), []);

  const moveModule = useCallback((mid: string, dir: -1 | 1) =>
    setModules(p => {
      const idx = p.findIndex(m => m.id === mid);
      const next = idx + dir;
      if (next < 0 || next >= p.length) return p;
      const arr = [...p]; [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return renumber(arr);
    }), []);

  const updMod = useCallback((mid: string, key: keyof ModuleState, val: any) =>
    setModules(p => p.map(m => m.id === mid ? { ...m, [key]: val } : m)), []);

  const updModItem = useCallback((mid: string, ii: number, val: string) =>
    setModules(p => p.map(m => {
      if (m.id !== mid) return m;
      const a = [...m.listItems]; a[ii] = val; return { ...m, listItems: a };
    })), []);

  const addModItem = useCallback((mid: string) =>
    setModules(p => p.map(m => m.id === mid ? { ...m, listItems: [...m.listItems, ""] } : m)), []);

  const removeModItem = useCallback((mid: string, ii: number) =>
    setModules(p => p.map(m => m.id === mid ? { ...m, listItems: m.listItems.filter((_, x) => x !== ii) } : m)), []);

  const handleSylBlur = useCallback((v: string) => {
    syllabusIntroRef.current = v;
    if (!isEmpty(v)) setSylErr("");
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  /* ── Prefill from API ── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`/yoga-300hr/content1/${id}`);
        const d = res.data?.data;
        if (!d) return;

        reset({
          slug: d.slug, status: d.status,
          pageMainH1: d.pageMainH1, heroImgAlt: d.heroImgAlt,
          topSectionH2: d.topSectionH2 || "",
          overviewH2: d.overview?.h2 || d.overviewH2 || "",
          upcomingDatesH3: d.upcomingDatesH3 || "",
          upcomingDatesSubtext: d.upcomingDatesSubtext || "",
          feeIncludedTitle: d.feeIncludedTitle || "",
          feeNotIncludedTitle: d.feeNotIncludedTitle || "",
          syllabusH2: d.syllabusH2 || "",
        });

        /* intro paragraphs — populate ids + ref map + defaults */
       if (d.introParagraphs?.length) {
  const limitedParas = d.introParagraphs.slice(0, 2); // 👈 sirf 2 lo

  const ids = limitedParas.map((_: string, i: number) => `ip-api-${i}`);

  introRef.current = {};
  introDefaults.current = {};

  limitedParas.forEach((c: string, i: number) => {
    introRef.current[ids[i]] = c;
    introDefaults.current[ids[i]] = c;
  });

  setIntroIds(ids);
}
        /* top paragraphs */
       if (d.topParagraphs?.length) {
  const limitedParas = d.topParagraphs.slice(0, 2); // 👈 sirf 2 lo

  const ids = limitedParas.map((_: string, i: number) => `tp-api-${i}`);

  topRef.current = {};
  topDefaults.current = {};

  limitedParas.forEach((c: string, i: number) => {
    topRef.current[ids[i]] = c;
    topDefaults.current[ids[i]] = c;
  });

  setTopIds(ids);
}

        /* syllabus */
        syllabusIntroRef.current = d.syllabusIntro || "";
        setSylDefVal(d.syllabusIntro || "");

        /* fee */
        if (d.includedFee?.length)    setInclFee(d.includedFee);
        if (d.notIncludedFee?.length) setNotInclFee(d.notIncludedFee);

        /* overview fields */
        if (Array.isArray(d.overviewFields) && d.overviewFields.length) {
          setOverviewFields(
            d.overviewFields.map((f: any, i: number) => ({
              id: f.id || `ov-api-${i}`,
              label: f.label || "",
              value: f.value || "",
              multiline: !!f.multiline,
            }))
          );
        } else if (d.overview) {
          const ov = d.overview;
          const mapped: OverviewField[] = [
            { id: "ov1", label: "Certification Name", value: ov.certName    || "", multiline: false },
            { id: "ov2", label: "Course Level",        value: ov.level       || "", multiline: false },
            { id: "ov3", label: "Eligibility",         value: ov.eligibility || "", multiline: true  },
            { id: "ov4", label: "Min Age",             value: ov.minAge      || "", multiline: false },
            { id: "ov5", label: "Credits",             value: ov.credits     || "", multiline: false },
            { id: "ov6", label: "Language",            value: ov.language    || "", multiline: false },
          ].filter(f => f.value !== "");
          if (mapped.length) setOverviewFields(mapped);
        }

        /* modules */
        if (Array.isArray(d.modules) && d.modules.length)
          setModules(normalizeModules(d.modules));

        /* hero */
        if (d.heroImage) setHeroPrev(`${BASE_URL}${d.heroImage}`);
      } catch { alert("Failed to load record."); }
      finally { setPageLoading(false); }
    };
    load();
  }, [id]);

  /* ── Submit ── */
  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (isEmpty(syllabusIntroRef.current)) { setSylErr("Required"); hasErr = true; }
    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      introIds.forEach((pid, i) => fd.append(`introPara${i + 1}`, introRef.current[pid] || ""));
      fd.append("introParagraphCount", String(introIds.length));

      topIds.forEach((pid, i) => fd.append(`topPara${i + 1}`, topRef.current[pid] || ""));
      fd.append("topParagraphCount", String(topIds.length));

      fd.append("syllabusIntro", syllabusIntroRef.current);
      fd.append("overviewFields", JSON.stringify(overviewFields));

      inclFee.forEach(v    => fd.append("includedFee", v));
      notInclFee.forEach(v => fd.append("notIncludedFee", v));

      fd.append("modules", JSON.stringify(modules));

      if (heroFile) fd.append("heroImage", heroFile);

      await api.put(`/yoga-300hr/content1/update/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/300hourscourse/300-content1"), 1500);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally { setIsSubmitting(false); }
  };

  /* ── Loading / Success screens ── */
  if (pageLoading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className={styles.spinner} />
      <span style={{ marginLeft: 12 }}>Loading record…</span>
    </div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Content 1 Updated!</h2>
        <p className={styles.successText}>Redirecting to list…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/300hourscourse/300-content1")}>
          300 Hour Content Part 1
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Edit</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Edit — 300hr Content Part 1</h1>
          <p className={styles.pageSubtitle}>Hero → Syllabus · Modules (Dynamic)</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span>
        <div className={styles.ornamentLine} /><span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ════ 1. HERO ════ */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageMainH1", { required: true })} />
            </div>
          </F>
          <F label="Hero Image" hint="Leave unchanged to keep existing image">
            <SingleImg preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px"
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); }} />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ════ 2. INTRO PARAGRAPHS ════ */}
        <Sec title="Introduction Paragraphs" badge="Expandable">
          <p className={styles.fieldHint}>
            Main body text below the hero section.
          </p>
          {introIds.map((pid, i) => (
            <RichListItem
              key={pid} id={pid} index={i} total={introIds.length}
              onSave={saveIntroPara}
              onRemove={removeIntroPara}
              defaultValue={introDefaults.current[pid] || ""}
              ph="The 300 hour yoga teacher training course in Rishikesh…"
            />
          ))}
          <button type="button" className={styles.addItemBtn} onClick={addIntroPara}>
            ＋ Add Intro Paragraph
          </button>
        </Sec>
        <D />

        {/* ════ 3. TOP SECTION ════ */}
        <Sec title="Top Section — Second Heading & Paragraphs" badge="Expandable">
          <F label="Section H2 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("topSectionH2")} />
            </div>
          </F>
          <F label="Top Section Paragraphs">
            {topIds.map((pid, i) => (
              <RichListItem
                key={pid} id={pid} index={i} total={topIds.length}
                onSave={saveTopPara}
                onRemove={removeTopPara}
                defaultValue={topDefaults.current[pid] || ""}
                ph="AYM is one of the best 300 hour yoga teacher training schools…"
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addTopPara}>
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ════ 4. OVERVIEW ════ */}
        <Sec title="Course Overview Box" badge="Dynamic Fields">
          <F label="Overview H2 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("overviewH2")} />
            </div>
          </F>
          <p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>
            Add, remove, or reorder any overview field. Toggle "Long text" for multi-line values.
          </p>
          <OverviewFields fields={overviewFields} onChange={setOverviewFields} />
        </Sec>
        <D />

        {/* ════ 5. UPCOMING DATES ════ */}
        <Sec title="Upcoming Course Dates — Headings" badge="Data from DB">
          <div className={styles.grid2}>
            <F label="Section H3">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesH3")} />
              </div>
            </F>
            <F label="Sub-text">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("upcomingDatesSubtext")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ════ 6. FEE ════ */}
        <Sec title="Fee — Included & Not Included">
          <F label="Included Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeIncludedTitle")} />
            </div>
          </F>
          <F label="Included Items">
            <StrList items={inclFee} label="Item" ph="Six days of yoga…"
              onAdd={() => setInclFee(p => [...p, ""])}
              onRemove={i => setInclFee(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...inclFee]; a[i] = v; setInclFee(a); }} />
          </F>
          <div style={{ marginTop: "1.2rem" }}>
            <F label="Not Included Section Title">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} {...register("feeNotIncludedTitle")} />
              </div>
            </F>
          </div>
          <F label="Not Included Items">
            <StrList items={notInclFee} label="Item" ph="Any Airfare."
              onAdd={() => setNotInclFee(p => [...p, ""])}
              onRemove={i => setNotInclFee(p => p.filter((_, x) => x !== i))}
              onUpdate={(i, v) => { const a = [...notInclFee]; a[i] = v; setNotInclFee(a); }} />
          </F>
        </Sec>
        <D />

        {/* ════ 7. SYLLABUS ════ */}
        <Sec title="Syllabus Section">
          <F label="Syllabus H2 Heading">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("syllabusH2")} />
            </div>
          </F>
          <LazyJodit
            label="Syllabus Introduction Paragraph"
            cr={syllabusIntroRef}
            err={sylErr}
            clr={() => setSylErr("")}
            defaultValue={sylDefVal}
            ph="Below is the summarized course syllabus…"
            h={200}
            required
          />
        </Sec>
        <D />

        {/* ════ 8. MODULES ════ */}
        <Sec title="Course Modules" badge="Dynamic — Add / Remove / Reorder">
          <p className={styles.fieldHint} style={{ marginBottom: "1rem" }}>
            Modules are automatically renumbered when you add, remove, or reorder them.
          </p>
        </Sec>

        {modules.map((mod, idx) => (
          <ModuleCard
            key={mod.id}
            mod={mod} idx={idx} total={modules.length}
            onMove={moveModule}
            onRemove={removeModule}
            onUpdate={updMod}
            onAddItem={addModItem}
            onRemoveItem={removeModItem}
            onUpdateItem={updModItem}
          />
        ))}

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <button type="button" onClick={addModule}
            style={{ padding: "0.7rem 2rem", fontSize: "0.95rem", borderRadius: 8, border: "1.5px dashed #c9a96e", background: "#fffdf8", cursor: "pointer", color: "#7a5c3a", fontFamily: "Cormorant Garamond, serif", letterSpacing: "0.03em", transition: "all 0.2s" }}>
            ＋ Add New Module
          </button>
        </div>

        {/* ════ PAGE SETTINGS ════ */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="300-hour-yoga-teacher-training-rishikesh"
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

      </div>{/* end formCard */}

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/300hourscourse/300-content1" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting
            ? (<><span className={styles.spinner} /> Updating…</>)
            : (<><span>✦</span> Update Content 1</>)
          }
        </button>
      </div>
    </div>
  );
}