"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const cleanHTML = (val?: string): string => {
  if (!val) return "";
  const text = val.replace(/<[^>]*>/g, "").trim();
  return text ? val.trim() : "";
};

/* ─────────────────────────────────────────
   JODIT CONFIG
───────────────────────────────────────── */
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
      "font", "fontsize", "brush", "|",
      "paragraph", "align", "|",
      "ul", "ol", "|",
      "link", "|",
      "undo", "redo", "|",
      "selectall", "cut", "copy", "paste",
    ],
    uploader: { insertImageAsBase64URI: true },
    height: h,
    placeholder: ph,
    enter: "p" as const,
  };
}

/* ─── Divider ─── */
function D() {
  return (
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />
  );
}

/* ─── Section Wrapper ─── */
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

/* ─── Field Wrapper ─── */
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

/* ─── Stable Jodit ─── */
const StableJodit = memo(function StableJodit({
  onSave, value, ph = "Start typing…", h = 200, err,
}: { onSave: (v: string) => void; value?: string; ph?: string; h?: number; err?: string }) {
  const [visible, setVisible] = useState(false);
  const initialValue = useRef(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);
  const handleChange = useCallback((val: string) => { onSaveRef.current(val); }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "300px" });
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

/* ─── Rich Para List Item ─── */
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, value, ph,
}: { id: string; index: number; total: number; onSave: (id: string, v: string) => void; onRemove: (id: string) => void; value?: string; ph?: string }) {
  const initialValue = useRef(value || "");
  const handleSave = useCallback((v: string) => { onSave(id, v); }, [id, onSave]);
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>✕ Remove</button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit onSave={handleSave} value={initialValue.current} ph={ph} h={180} />
      </div>
    </div>
  );
});

/* ─── String List ─── */
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
              <input className={`${styles.input} ${styles.inputNoCount}`} value={val}
                placeholder={ph || "Enter item…"} onChange={(e) => onUpdate(i, e.target.value)} />
            </div>
            <button type="button" className={styles.removeItemBtn}
              onClick={() => onRemove(i)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      {items.length < max && (
        <button type="button" className={styles.addItemBtn} onClick={onAdd}>＋ Add {label}</button>
      )}
    </>
  );
}

/* ─── Single Image Uploader ─── */
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
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { onSelect(f, URL.createObjectURL(f)); e.target.value = ""; } }} />
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

/* ══════════════════════════════════════════
   PARA LIST HOOK
══════════════════════════════════════════ */
function useParaList(initId: string, initVal = "") {
  const [ids, setIds] = useState<string[]>([initId]);
  const ref = useRef<Record<string, string>>({ [initId]: initVal });
  const add = useCallback(() => {
    const id = `${initId}-${Date.now()}`;
    ref.current[id] = "";
    setIds((p) => [...p, id]);
  }, [initId]);
  const remove = useCallback((id: string) => {
    delete ref.current[id];
    setIds((p) => p.filter((x) => x !== id));
  }, []);
  const save = useCallback((id: string, v: string) => { ref.current[id] = v; }, []);
  const loadFromArray = useCallback((arr: string[], prefix: string) => {
    const newIds: string[] = [];
    arr.forEach((p, i) => { const id = `${prefix}${i}`; newIds.push(id); ref.current[id] = p; });
    setIds(newIds);
  }, []);
  return { ids, ref, add, remove, save, loadFromArray };
}

/* ══════════════════════════════════════════
   SYLLABUS MODULE MANAGER
══════════════════════════════════════════ */
interface SyllabusModule { id: string; title: string; items: string[]; }

const DEFAULT_SYLLABUS: SyllabusModule[] = [
  { id: "sm1", title: "Kundalini Yoga Philosophy & History of Yoga", items: ["Introduction to Kundalini Yoga and its Origins", "The Tradition of Kundalini Yoga: Yogi Bhajan's Teachings", "Core Concepts: Prana, Nadis, Chakras, and Kundalini Energy", "Patanjali's Eight Limbs of Yoga and Their Relevance", "The Aquarian Age and Kundalini Yoga's Role", "Sat Nam: Truth as Identity"] },
  { id: "sm2", title: "Hatha yoga asana (Physical Postures) & Kriyas", items: ["Introduction to Kundalini Yoga Asanas", "Detailed study of fundamental postures", "Alignment, Benefits, and Contraindications"] },
  { id: "sm3", title: "Pranayama & Breathwork", items: ["The Science of Breath in Kundalini Yoga", "Basic Pranayamas: Long Deep Breathing, Breath of Fire, Sitali, Bhastrika"] },
  { id: "sm4", title: "Mantra, Mudra, and Naad Yoga", items: ["The Role of Mantra in Kundalini Yoga", "Pronunciation and Chanting Practice"] },
  { id: "sm5", title: "Meditation & Dhyana", items: ["The Purpose and Types of Meditation in Kundalini Yoga", "Guided Meditations and Silent Practice"] },
  { id: "sm6", title: "Anatomy & Physiology", items: ["Yogic and Western Anatomy Overview", "The Chakra System: 7 Major Chakras"] },
  { id: "sm7", title: "Teaching Methodology & Practicum", items: ["Principles of Effective Teaching", "Sequencing Classes and Kriyas"] },
  { id: "sm8", title: "Yogic Lifestyle & Ethics", items: ["The Aquarian Teacher Code of Ethics", "Sattvic Diet and Lifestyle"] },
  { id: "sm9", title: "Self-Study & Assignments (30 marks)", items: ["Daily Practice Journal", "Written Assignments on Philosophy and Anatomy"] },
  { id: "sm10", title: "Assessment & Certification (170 marks)", items: ["Written Examination on Philosophy and Anatomy", "Practical Teaching Assessment", "Yoga Alliance USA Registered Certificate upon completion"] },
];

function SyllabusManager({ items, onChange }: { items: SyllabusModule[]; onChange: (v: SyllabusModule[]) => void }) {
  const updateTitle = (id: string, title: string) =>
    onChange(items.map((m) => (m.id === id ? { ...m, title } : m)));

  const updateItem = (id: string, idx: number, val: string) =>
    onChange(items.map((m) => m.id === id ? { ...m, items: m.items.map((it, i) => i === idx ? val : it) } : m));

  const addItem = (id: string) =>
    onChange(items.map((m) => m.id === id ? { ...m, items: [...m.items, ""] } : m));

  const removeItem = (id: string, idx: number) =>
    onChange(items.map((m) => m.id === id ? { ...m, items: m.items.filter((_, i) => i !== idx) } : m));

  const addModule = () =>
    onChange([...items, { id: `sm-${Date.now()}`, title: "", items: [""] }]);

  const removeModule = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((m) => m.id !== id));
  };

  return (
    <div>
      {items.map((mod, idx) => (
        <div key={mod.id} className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Module {idx + 1}: {mod.title || "New Module"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => removeModule(mod.id)}>✕ Remove Module</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Module Title</label>
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={mod.title}
                  placeholder="e.g. Pranayama & Breathwork"
                  onChange={(e) => updateTitle(mod.id, e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Module Topics</label>
              <div className={styles.listItems}>
                {mod.items.map((item, i) => (
                  <div key={i} className={styles.listItemRow}>
                    <span className={styles.listNum}>{i + 1}</span>
                    <div className={`${styles.inputWrap} ${styles.listInput}`}>
                      <input className={`${styles.input} ${styles.inputNoCount}`} value={item}
                        placeholder="Topic…" onChange={(e) => updateItem(mod.id, i, e.target.value)} />
                    </div>
                    <button type="button" className={styles.removeItemBtn}
                      onClick={() => removeItem(mod.id, i)} disabled={mod.items.length <= 1}>✕</button>
                  </div>
                ))}
              </div>
              <button type="button" className={styles.addItemBtn} onClick={() => addItem(mod.id)}>＋ Add Topic</button>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={addModule}>＋ Add Syllabus Module</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   HIGHLIGHT CARD MANAGER
══════════════════════════════════════════ */
interface HighlightCard { id: string; title: string; desc: string; }

const DEFAULT_HIGHLIGHTS: HighlightCard[] = [
  { id: "hc1", title: "Daily Guided Practices", desc: "Our Kundalini yoga teacher training programs have been carefully curated." },
  { id: "hc2", title: "Meditation and Breathing Techniques", desc: "We offer a practical and theoretical understanding of kundalini yoga." },
  { id: "hc3", title: "Mantra and Chanting", desc: "During the 300 hour Kundalini yoga teacher training in Rishikesh, we allow aspirants to experience the vibrational power of the mantras." },
  { id: "hc4", title: "Personalized Approach", desc: "We believe in creating a long-lasting relationship with our students." },
  { id: "hc5", title: "Fostering Connection", desc: "Students can find themselves in the company of like-minded individuals." },
];

function HighlightManager({ items, onChange }: { items: HighlightCard[]; onChange: (v: HighlightCard[]) => void }) {
  const update = (id: string, field: keyof HighlightCard, value: string) =>
    onChange(items.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  const add = () => onChange([...items, { id: `hc-${Date.now()}`, title: "", desc: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((h) => h.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Highlight {idx + 1}: {item.title || "New Highlight"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Title</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.title}
                    placeholder="e.g. Daily Guided Practices"
                    onChange={(e) => update(item.id, "title", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.desc}
                  placeholder="Describe this highlight…"
                  onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Highlight Card</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   WHY AYM CARD MANAGER
══════════════════════════════════════════ */
interface WhyCard { id: string; label: string; desc: string; }

const DEFAULT_WHY_CARDS: WhyCard[] = [
  { id: "wc1", label: "Tradition", desc: "We follow Ancient Traditional yoga of The Himalayas." },
  { id: "wc2", label: "Location", desc: "We are located in a peaceful, serene, and beautiful place in Rishikesh." },
  { id: "wc3", label: "Teacher", desc: "We have 14+ experienced teachers under the guidance of Yogi Chetan Mahesh." },
  { id: "wc4", label: "Courses", desc: "We offer different important yoga courses." },
  { id: "wc5", label: "Experiences", desc: "Until now, our ashram has trained more than 6000+ yoga teachers worldwide." },
  { id: "wc6", label: "Kundalini-Based Training", desc: "Our primary purpose is to awaken the latent energy of our students." },
];

function WhyCardManager({ items, onChange }: { items: WhyCard[]; onChange: (v: WhyCard[]) => void }) {
  const update = (id: string, field: keyof WhyCard, value: string) =>
    onChange(items.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  const add = () => onChange([...items, { id: `wc-${Date.now()}`, label: "", desc: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((c) => c.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Card {idx + 1}: {item.label || "New Card"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Label / Title</label>
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={item.label}
                  placeholder="e.g. Tradition" onChange={(e) => update(item.id, "label", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} value={item.desc}
                  placeholder="Short description…" onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Why Card</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   DAILY SCHEDULE MANAGER
══════════════════════════════════════════ */
interface ScheduleItem { id: string; time: string; activity: string; }

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: "sc1", time: "06:30 AM", activity: "Kundalini Pranayama and Meditation" },
  { id: "sc2", time: "08:00 AM", activity: "Tea" },
  { id: "sc3", time: "08:30 AM", activity: "Traditional Kundalini Tantra Theory & Asanas" },
  { id: "sc4", time: "10:00 AM", activity: "Breakfast" },
  { id: "sc5", time: "11:00 AM", activity: "Kundalini Philosophy" },
  { id: "sc6", time: "12:15 AM", activity: "Yoga Alignment & Adjustment" },
  { id: "sc7", time: "01:30 PM", activity: "Lunch - Rest/Self-Study" },
  { id: "sc8", time: "03:30 PM", activity: "Yoga & Spiritual Anatomy" },
  { id: "sc9", time: "05:30 PM", activity: "Classical Hatha Yoga" },
  { id: "sc10", time: "07:30 PM", activity: "Dinner" },
];

function ScheduleManager({ items, onChange }: { items: ScheduleItem[]; onChange: (v: ScheduleItem[]) => void }) {
  const update = (id: string, field: keyof ScheduleItem, value: string) =>
    onChange(items.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const add = () => onChange([...items, { id: `sc-${Date.now()}`, time: "", activity: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((s) => s.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", alignItems: "flex-start", gap: "0.5rem" }}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={styles.inputWrap} style={{ flex: "0 0 130px" }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.time}
              placeholder="06:30 AM" onChange={(e) => update(item.id, "time", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.activity}
              placeholder="Activity description…" onChange={(e) => update(item.id, "activity", e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn}
            onClick={() => remove(item.id)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Schedule Row</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface KundaliniFormValues {
  status: "Active" | "Inactive";
  // Sec 2 — What is Kundalini
  whatIsTitle: string;
  // Sec 3 — Activate
  activateTitle: string;
  // Benefits card
  benefitsTitle: string;
  benefitsIntro1: string;
  benefitsIntro2: string;
  // Highlights card
  highlightsTitle: string;
  highlightsIntro: string;
  // Sec 4 — Syllabus
  syllabusBigTitle: string;
  syllabusSchool: string;
  courseOverviewTitle: string;
  // Reading box
  readingBoxTitle: string;
  // Note box
  noteBoxTitle: string;
  noteBoxPara: string;
  // Sec 5 — Eligibility
  eligibilityTitle: string;
  // Sec 5 — Location
  locationTitle: string;
  // Sec 5 — Facilities
  facilitiesTitle: string;
  facilitiesIntro: string;
  // Sec 6 — Daily Schedule
  scheduleSectionTitle: string;
  // Sec 7 — Why AYM
  whyAYMTitle: string;
  // Sec 9 — Why Rishikesh card
  whyRishikeshTitle: string;
  spiritualTitle: string;
  naturalTitle: string;
  typesTitle: string;
  topSchoolsTitle: string;
  topSchoolsPara: string;
  // Refund
  refundTitle: string;
}

/* ══════════════════════════════════════════
   MAIN FORM COMPONENT
══════════════════════════════════════════ */
export default function KundaliniTTCAdminForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* ── Hero Image ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  /* ── Class Image (Section 7) ── */
  const [classFile, setClassFile] = useState<File | null>(null);
  const [classPrev, setClassPrev] = useState("");

  /* ── Schedule Images (Section 6 - 2 images) ── */
  const [schedImg1File, setSchedImg1File] = useState<File | null>(null);
  const [schedImg1Prev, setSchedImg1Prev] = useState("");
  const [schedImg2File, setSchedImg2File] = useState<File | null>(null);
  const [schedImg2Prev, setSchedImg2Prev] = useState("");

  /* ── Rich text refs ── */
  const courseOverviewParaRef = useRef("");
  const readingBoxNoteRef = useRef("");
  const facilitiesIntroRef = useRef("");
  const spiritualParaRef = useRef("");
  const naturalParaRef = useRef("");

  /* ── Para Lists ── */
  const whatIsParaList    = useParaList("wip1");
  const activateParaList  = useParaList("acp1");
  const eligibilityParaList = useParaList("elp1");
  const locationParaList  = useParaList("locp1");
  const readingItemsList  = useParaList("ri1");   // used differently (string list)

  /* ── Dynamic managers ── */
  const [syllabusModules, setSyllabusModules]   = useState<SyllabusModule[]>(DEFAULT_SYLLABUS);
  const [benefitItems, setBenefitItems]         = useState<string[]>(["It promotes spiritual growth, higher consciousness and self-awareness.", "This practice raises and balances energy, promoting overall well-being.", "It offers calmness to the mind and lowers stress and anxiety.", "Not only does it balance the nervous system, but it also improves flexibility and strengthens the immune system.", "As you take up kundalini Rishikesh yoga, it TTC enhances emotional intelligence, fosters inner peace and offers mental clarity.", "Kundalini yoga promotes self-growth, self-love, self-acceptance, self-healing, and cultivating intuition.", "It helps to overcome addictive behaviours and facilitates profound personal growth and spiritual evolution."]);
  const [highlightCards, setHighlightCards]     = useState<HighlightCard[]>(DEFAULT_HIGHLIGHTS);
  const [readingItems, setReadingItems]         = useState<string[]>(['"The Aquarian Teacher" by Yogi Bhajan', '"Hatha yoga pradipika: Bihar school of Yoga"', '"The Yoga Sutras of Patanjali"', "Aym Yoga School Training Manual of Kundalini Yoga TTC in Rishikesh."]);
  const [facilityItems, setFacilityItems]       = useState<string[]>(["Accommodation in spacious and furnished rooms with attached bathrooms.", "Guidance and access to highly skilled professionals in yoga.", "Access to study material includes online resources, yoga mats, books, and more.", "CCTV surveillance for extra security.", "Around-the-clock management support.", "Attend seminars, workshops, and other related events that promote yoga.", "Detox drinks and juices are offered.", "Vegetarian and healthy meals are provided three times a day.", "Access to free wifi and 24/7 hot water service is offered.", "A piece of Mala is provided to every student.", "Students are taken to nature excursions that elevate their experience.", "Kundalini yoga teacher training course certification is provided at the end of the course."]);
  const [scheduleItems, setScheduleItems]       = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [whyCards, setWhyCards]                 = useState<WhyCard[]>(DEFAULT_WHY_CARDS);
  const [typesItems, setTypesItems]             = useState<string[]>(["Beginner to advanced kundalini classes", "Kundalini yoga retreats and intensive courses", "Teacher training programs."]);
  const [refundItems, setRefundItems]           = useState<string[]>(["An advance course fee will not be refundable. Students can join us on other schedules in case of an emergency.", "If students cancel the course, we accept the cancellation, but the advance deposit will not be refunded in cancellation.", "There is no charge for course cancellation. The student has to inform by email.", "AYM Yoga School is not responsible for any mishappenings before the course schedule."]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<KundaliniFormValues>({
    defaultValues: {
      status: "Active",
      whatIsTitle: "What is Kundalini Yoga?",
      activateTitle: "Activate your Kundalini through the kundalini yoga TTC in rishikesh at AYM",
      benefitsTitle: "What are the Benefits of Kundalini Yoga?",
      benefitsIntro1: "Is Kundalini yoga the right choice for you?",
      benefitsIntro2: "You must know that enrolling in our Kundalini YTT course in Rishikesh at AYM will transform your personal and professional lives.",
      highlightsTitle: "Kundalini YTT Course Highlights at AYM in Rishikesh",
      highlightsIntro: "At AYM, we offer the best Kundalini yoga teacher training course in rishikesh for aspiring students.",
      syllabusBigTitle: "200-Hour Kundalini Yoga Teacher Training Syllabus",
      syllabusSchool: "Aym Yoga School",
      courseOverviewTitle: "Course Overview:",
      readingBoxTitle: "Required Reading: Kundalini Yoga teacher training 200 hours India",
      noteBoxTitle: "Note:",
      noteBoxPara: "The above syllabus is in accordance with the specific guidelines and vision of Best Kundalini Yoga teacher training India at Aym Yoga School.",
      eligibilityTitle: "Who Is Eligible to Join the Kundalini Yoga Teacher Training Course in Rishikesh?",
      locationTitle: "Is the Location Prime for Yoga Learning?",
      facilitiesTitle: "What Facilities are Included in the Course Fee?",
      facilitiesIntro: "Aspirants often worry that learning yoga will break the bank.",
      scheduleSectionTitle: "Daily Schedule",
      whyAYMTitle: "Why Choose AYM Yoga School?",
      whyRishikeshTitle: "Why choose Kundalini Yoga classes and training in rishikesh?",
      spiritualTitle: "Spiritual significance of Rishikesh:",
      naturalTitle: "Natural setting and serene environment of Rishikesh:",
      typesTitle: "Types of Kundalini Yoga Classes in Rishikesh",
      topSchoolsTitle: "Top Kundalini Yoga Schools and Centers in Rishikesh",
      topSchoolsPara: "In recent times, Kundalini yoga has become popular…",
      refundTitle: "Refund Policy - AYM Yoga School",
    },
  });

  /* ── Fetch existing data ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/kundalini-ttc-content/get");
        const d = res.data?.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);

        const keys: (keyof KundaliniFormValues)[] = [
          "status", "whatIsTitle", "activateTitle", "benefitsTitle", "benefitsIntro1",
          "benefitsIntro2", "highlightsTitle", "highlightsIntro", "syllabusBigTitle",
          "syllabusSchool", "courseOverviewTitle", "readingBoxTitle", "noteBoxTitle",
          "noteBoxPara", "eligibilityTitle", "locationTitle", "facilitiesTitle",
          "facilitiesIntro", "scheduleSectionTitle", "whyAYMTitle", "whyRishikeshTitle",
          "spiritualTitle", "naturalTitle", "typesTitle", "topSchoolsTitle",
          "topSchoolsPara", "refundTitle",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k] as any); });

        /* Rich text refs */
        courseOverviewParaRef.current = d.courseOverviewPara || "";
        readingBoxNoteRef.current     = d.readingBoxNote || "";
        facilitiesIntroRef.current    = d.facilitiesIntroRich || "";
        spiritualParaRef.current      = d.spiritualPara || "";
        naturalParaRef.current        = d.naturalPara || "";

        /* Images */
        if (d.heroImage)   setHeroPrev(BASE_URL + d.heroImage);
        if (d.classImage)  setClassPrev(BASE_URL + d.classImage);
        if (d.schedImg1)   setSchedImg1Prev(BASE_URL + d.schedImg1);
        if (d.schedImg2)   setSchedImg2Prev(BASE_URL + d.schedImg2);

        /* Para lists */
        if (d.whatIsParagraphs?.length)     whatIsParaList.loadFromArray(d.whatIsParagraphs, "wip");
        if (d.activateParagraphs?.length)   activateParaList.loadFromArray(d.activateParagraphs, "acp");
        if (d.eligibilityParagraphs?.length) eligibilityParaList.loadFromArray(d.eligibilityParagraphs, "elp");
        if (d.locationParagraphs?.length)   locationParaList.loadFromArray(d.locationParagraphs, "locp");

        /* Dynamic arrays */
        if (d.syllabusModules?.length)  setSyllabusModules(d.syllabusModules);
        if (d.benefitItems?.length)     setBenefitItems(d.benefitItems);
        if (d.highlightCards?.length)   setHighlightCards(d.highlightCards);
        if (d.readingItems?.length)     setReadingItems(d.readingItems);
        if (d.facilityItems?.length)    setFacilityItems(d.facilityItems);
        if (d.scheduleItems?.length)    setScheduleItems(d.scheduleItems);
        if (d.whyCards?.length)         setWhyCards(d.whyCards);
        if (d.typesItems?.length)       setTypesItems(d.typesItems);
        if (d.refundItems?.length)      setRefundItems(d.refundItems);
      } catch {
        toast.error("Failed to load existing content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  /* ── Submit ── */
  const onSubmit = async (data: KundaliniFormValues) => {
    if (!heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      /* Rich text */
      fd.append("courseOverviewPara", courseOverviewParaRef.current);
      fd.append("readingBoxNote", readingBoxNoteRef.current);
      fd.append("facilitiesIntroRich", facilitiesIntroRef.current);
      fd.append("spiritualPara", spiritualParaRef.current);
      fd.append("naturalPara", naturalParaRef.current);

      /* Para lists */
      fd.append("whatIsParagraphs", JSON.stringify(
        whatIsParaList.ids.map((id) => cleanHTML(whatIsParaList.ref.current[id])).filter(Boolean)
      ));
      fd.append("activateParagraphs", JSON.stringify(
        activateParaList.ids.map((id) => cleanHTML(activateParaList.ref.current[id])).filter(Boolean)
      ));
      fd.append("eligibilityParagraphs", JSON.stringify(
        eligibilityParaList.ids.map((id) => cleanHTML(eligibilityParaList.ref.current[id])).filter(Boolean)
      ));
      fd.append("locationParagraphs", JSON.stringify(
        locationParaList.ids.map((id) => cleanHTML(locationParaList.ref.current[id])).filter(Boolean)
      ));

      /* Dynamic arrays */
      fd.append("syllabusModules", JSON.stringify(syllabusModules));
      fd.append("benefitItems",    JSON.stringify(benefitItems.filter(Boolean)));
      fd.append("highlightCards",  JSON.stringify(highlightCards));
      fd.append("readingItems",    JSON.stringify(readingItems.filter(Boolean)));
      fd.append("facilityItems",   JSON.stringify(facilityItems.filter(Boolean)));
      fd.append("scheduleItems",   JSON.stringify(scheduleItems));
      fd.append("whyCards",        JSON.stringify(whyCards));
      fd.append("typesItems",      JSON.stringify(typesItems.filter(Boolean)));
      fd.append("refundItems",     JSON.stringify(refundItems.filter(Boolean)));

      /* Images */
      if (heroFile)     fd.append("heroImage",  heroFile);
      if (classFile)    fd.append("classImage", classFile);
      if (schedImg1File) fd.append("schedImg1", schedImg1File);
      if (schedImg2File) fd.append("schedImg2", schedImg2File);

      if (isEdit) {
        await api.put("/kundalini-ttc-content/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully!");
      } else {
        await api.post("/kundalini-ttc-content/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/kundalini-yoga-teacher-training"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading state ── */
  if (loadingData) return (
    <div className={styles.loadingWrap}>
      <span className={styles.spinner} />
      <span>Loading Kundalini TTC content…</span>
    </div>
  );

  /* ── Success state ── */
  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Kundalini TTC Page {isEdit ? "Updated" : "Saved"}!</h2>
        <p className={styles.successText}>Redirecting to list…</p>
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/kundalini-yoga-teacher-training")}>
          Kundalini TTC
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit Kundalini Yoga TTC Page" : "Add Kundalini Yoga TTC Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · What is Kundalini · Benefits · Highlights · Syllabus · Eligibility · Facilities · Schedule · Why AYM · Rishikesh · Refund
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ 1. HERO IMAGE ══ */}
        <Sec title="Hero Banner Image" badge="Section 1 — Top of Page">
          <F label="Hero Image" req hint="Recommended: 1440×600px · JPG/PNG/WEBP">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1440×600px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 2. WHAT IS KUNDALINI YOGA ══ */}
        <Sec title="What is Kundalini Yoga?" badge="Section 2 — Vintage Card">
          <F label="Card Title" req>
            <div className={`${styles.inputWrap} ${errors.whatIsTitle ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="What is Kundalini Yoga?" {...register("whatIsTitle", { required: "Required" })} />
            </div>
            {errors.whatIsTitle && <p className={styles.errorMsg}>⚠ {errors.whatIsTitle.message}</p>}
          </F>
          <F label="Paragraphs" hint="Add all paragraphs for this section. First para will appear at top.">
            {whatIsParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={whatIsParaList.ids.length}
                onSave={whatIsParaList.save} onRemove={whatIsParaList.remove}
                value={whatIsParaList.ref.current[id]}
                ph="When we talk about the awakening of Kundalini…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={whatIsParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 3. ACTIVATE KUNDALINI ══ */}
        <Sec title="Activate Your Kundalini" badge="Section 3 — Light Section">
          <F label="Section Heading" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Activate your Kundalini through the kundalini yoga TTC in rishikesh at AYM"
                {...register("activateTitle")} />
            </div>
          </F>
          <F label="Paragraphs" hint="Main body text for this section.">
            {activateParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={activateParaList.ids.length}
                onSave={activateParaList.save} onRemove={activateParaList.remove}
                value={activateParaList.ref.current[id]}
                ph="When approached with care, patience, proper guidance…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={activateParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 4. BENEFITS CARD ══ */}
        <Sec title="Benefits of Kundalini Yoga" badge="Section 3 — Inner Vintage Card">
          <F label="Card Title" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="What are the Benefits of Kundalini Yoga?" {...register("benefitsTitle")} />
            </div>
          </F>
          <div className={styles.grid2}>
            <F label="Intro Paragraph 1">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                  placeholder="Is Kundalini yoga the right choice for you?…"
                  {...register("benefitsIntro1")} />
              </div>
            </F>
            <F label="Intro Paragraph 2">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                  placeholder="You must know that enrolling in our Kundalini YTT course…"
                  {...register("benefitsIntro2")} />
              </div>
            </F>
          </div>
          <F label="Benefit Items" hint="Each item will appear as a numbered benefit row.">
            <StrList items={benefitItems} label="Benefit"
              ph="It promotes spiritual growth, higher consciousness…"
              onAdd={() => setBenefitItems((p) => [...p, ""])}
              onRemove={(i) => { if (benefitItems.length <= 1) return; setBenefitItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...benefitItems]; n[i] = v; setBenefitItems(n); }} />
          </F>
        </Sec>
        <D />

        {/* ══ 5. COURSE HIGHLIGHTS CARD ══ */}
        <Sec title="Course Highlights" badge="Section 3 — Inner Vintage Card">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Kundalini YTT Course Highlights at AYM in Rishikesh"
                {...register("highlightsTitle")} />
            </div>
          </F>
          <F label="Intro Paragraph">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                placeholder="At AYM, we offer the best Kundalini yoga teacher training course in rishikesh…"
                {...register("highlightsIntro")} />
            </div>
          </F>
          <F label="Highlight Cards" hint="Each card has a bold title and description.">
            <HighlightManager items={highlightCards} onChange={setHighlightCards} />
          </F>
        </Sec>
        <D />

        {/* ══ 6. SYLLABUS ACCORDION ══ */}
        <Sec title="200-Hr Syllabus" badge="Section 4 — Accordion">
          <div className={styles.grid2}>
            <F label="Main Syllabus Title" req>
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="200-Hour Kundalini Yoga Teacher Training Syllabus"
                  {...register("syllabusBigTitle")} />
              </div>
            </F>
            <F label="School Name (Subtitle)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Aym Yoga School" {...register("syllabusSchool")} />
              </div>
            </F>
          </div>
          <F label="Course Overview Label">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Course Overview:" {...register("courseOverviewTitle")} />
            </div>
          </F>
          <F label="Course Overview Paragraph">
            <StableJodit
              onSave={(v) => { courseOverviewParaRef.current = v; }}
              value={courseOverviewParaRef.current} h={180}
              ph="This comprehensive 200-hour Kundalini Yoga Teacher Training in India…" />
          </F>
          <F label="Syllabus Modules" hint="Each module = one accordion item. Add topics inside each module.">
            <SyllabusManager items={syllabusModules} onChange={setSyllabusModules} />
          </F>
          <F label="Required Reading Box — Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Required Reading: Kundalini Yoga teacher training 200 hours India"
                {...register("readingBoxTitle")} />
            </div>
          </F>
          <F label="Required Reading Items">
            <StrList items={readingItems} label="Reading Item"
              ph='"The Aquarian Teacher" by Yogi Bhajan'
              onAdd={() => setReadingItems((p) => [...p, ""])}
              onRemove={(i) => { if (readingItems.length <= 1) return; setReadingItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...readingItems]; n[i] = v; setReadingItems(n); }} />
          </F>
          <div className={styles.grid2}>
            <F label="Note Box — Label">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="Note:" {...register("noteBoxTitle")} />
              </div>
            </F>
            <F label="Note Box — Paragraph">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                  placeholder="The above syllabus is in accordance with…"
                  {...register("noteBoxPara")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 7. ELIGIBILITY ══ */}
        <Sec title="Eligibility" badge="Section 5 — Card 1">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Who Is Eligible to Join the Kundalini Yoga Teacher Training Course in Rishikesh?"
                {...register("eligibilityTitle")} />
            </div>
          </F>
          <F label="Paragraphs">
            {eligibilityParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={eligibilityParaList.ids.length}
                onSave={eligibilityParaList.save} onRemove={eligibilityParaList.remove}
                value={eligibilityParaList.ref.current[id]}
                ph="Wondering if you will ever get the chance to complete your dream…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={eligibilityParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 8. LOCATION CARD ══ */}
        <Sec title="Location — Is it Prime?" badge="Section 5 — Card 2">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Is the Location Prime for Yoga Learning?"
                {...register("locationTitle")} />
            </div>
          </F>
          <F label="Paragraphs">
            {locationParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={locationParaList.ids.length}
                onSave={locationParaList.save} onRemove={locationParaList.remove}
                value={locationParaList.ref.current[id]}
                ph="When learning yoga, we understand how much the surroundings…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={locationParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ══ 9. FACILITIES CARD ══ */}
        <Sec title="Facilities Included in Course Fee" badge="Section 5 — Card 3">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="What Facilities are Included in the Course Fee?"
                {...register("facilitiesTitle")} />
            </div>
          </F>
          <F label="Intro Paragraph">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                placeholder="Aspirants often worry that learning yoga will break the bank…"
                {...register("facilitiesIntro")} />
            </div>
          </F>
          <F label="Facility Items" hint="Each item appears as a numbered row.">
            <StrList items={facilityItems} label="Facility Item"
              ph="Accommodation in spacious and furnished rooms…"
              onAdd={() => setFacilityItems((p) => [...p, ""])}
              onRemove={(i) => { if (facilityItems.length <= 1) return; setFacilityItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...facilityItems]; n[i] = v; setFacilityItems(n); }} />
          </F>
        </Sec>
        <D />

        {/* ══ 10. DAILY SCHEDULE ══ */}
        <Sec title="Daily Schedule" badge="Section 6 — Time Table + Images">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Daily Schedule" {...register("scheduleSectionTitle")} />
            </div>
          </F>
          <F label="Schedule Rows" hint="Time (left column) + Activity (right column).">
            <ScheduleManager items={scheduleItems} onChange={setScheduleItems} />
          </F>
          <div className={styles.grid2}>
            <F label="Schedule Photo 1" hint="Portrait-style yoga image · 500×660px">
              <SingleImg preview={schedImg1Prev} badge="Photo 1" hint="JPG/PNG · portrait"
                error=""
                onSelect={(f, p) => { setSchedImg1File(f); setSchedImg1Prev(p); }}
                onRemove={() => { setSchedImg1File(null); setSchedImg1Prev(""); }} />
            </F>
            <F label="Schedule Photo 2" hint="Portrait-style yoga image · 500×660px">
              <SingleImg preview={schedImg2Prev} badge="Photo 2" hint="JPG/PNG · portrait"
                error=""
                onSelect={(f, p) => { setSchedImg2File(f); setSchedImg2Prev(p); }}
                onRemove={() => { setSchedImg2File(null); setSchedImg2Prev(""); }} />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 11. WHY CHOOSE AYM ══ */}
        <Sec title="Why Choose AYM Yoga School?" badge="Section 7 — Cards + Class Image">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Why Choose AYM Yoga School?" {...register("whyAYMTitle")} />
            </div>
          </F>
          <F label="Why Cards" hint="Each card shows a number, bold label and description.">
            <WhyCardManager items={whyCards} onChange={setWhyCards} />
          </F>
          <F label="Class Group Photo" hint="Wide yoga class photo below the cards · 1200×500px">
            <SingleImg preview={classPrev} badge="Class Photo" hint="JPG/PNG/WEBP · 1200×500px"
              error=""
              onSelect={(f, p) => { setClassFile(f); setClassPrev(p); }}
              onRemove={() => { setClassFile(null); setClassPrev(""); }} />
          </F>
        </Sec>
        <D />

        {/* ══ 12. WHY RISHIKESH CARD ══ */}
        <Sec title="Why Choose Rishikesh?" badge="Section 9 — Card 1">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Why choose Kundalini Yoga classes and training in rishikesh?"
                {...register("whyRishikeshTitle")} />
            </div>
          </F>

          {/* Spiritual significance sub-section */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Sub-section 1 — Spiritual Significance</span>
            </div>
            <div className={styles.nestedCardBody}>
              <F label="Sub-heading">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Spiritual significance of Rishikesh:"
                    {...register("spiritualTitle")} />
                </div>
              </F>
              <F label="Paragraph">
                <StableJodit onSave={(v) => { spiritualParaRef.current = v; }}
                  value={spiritualParaRef.current} h={150}
                  ph="Rishikesh, situated on the banks of the sacred Ganges River…" />
              </F>
            </div>
          </div>

          {/* Natural setting sub-section */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Sub-section 2 — Natural Setting</span>
            </div>
            <div className={styles.nestedCardBody}>
              <F label="Sub-heading">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Natural setting and serene environment of Rishikesh:"
                    {...register("naturalTitle")} />
                </div>
              </F>
              <F label="Paragraph">
                <StableJodit onSave={(v) => { naturalParaRef.current = v; }}
                  value={naturalParaRef.current} h={150}
                  ph="The tranquil ambiance, combined with the region's powerful energy…" />
              </F>
            </div>
          </div>

          {/* Types of classes */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Sub-section 3 — Types of Classes</span>
            </div>
            <div className={styles.nestedCardBody}>
              <F label="Sub-heading">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Types of Kundalini Yoga Classes in Rishikesh"
                    {...register("typesTitle")} />
                </div>
              </F>
              <F label="Bullet List Items">
                <StrList items={typesItems} label="Type Item"
                  ph="Beginner to advanced kundalini classes"
                  onAdd={() => setTypesItems((p) => [...p, ""])}
                  onRemove={(i) => { if (typesItems.length <= 1) return; setTypesItems((p) => p.filter((_, idx) => idx !== i)); }}
                  onUpdate={(i, v) => { const n = [...typesItems]; n[i] = v; setTypesItems(n); }} />
              </F>
            </div>
          </div>

          {/* Top Schools */}
          <div className={styles.nestedCard}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Sub-section 4 — Top Schools</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <F label="Sub-heading">
                  <div className={styles.inputWrap}>
                    <input className={`${styles.input} ${styles.inputNoCount}`}
                      placeholder="Top Kundalini Yoga Schools and Centers in Rishikesh"
                      {...register("topSchoolsTitle")} />
                  </div>
                </F>
                <F label="Paragraph">
                  <div className={styles.inputWrap}>
                    <textarea className={`${styles.input} ${styles.textarea}`} rows={3}
                      placeholder="In recent times, Kundalini yoga has become popular…"
                      {...register("topSchoolsPara")} />
                  </div>
                </F>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* ══ 13. REFUND POLICY ══ */}
        <Sec title="Refund Policy" badge="Section 9 — Card 2">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Refund Policy - AYM Yoga School" {...register("refundTitle")} />
            </div>
          </F>
          <F label="Refund Policy Items" hint="Each item appears as a numbered policy card.">
            <StrList items={refundItems} label="Policy Item"
              ph="An advance course fee will not be refundable…"
              onAdd={() => setRefundItems((p) => [...p, ""])}
              onRemove={(i) => { if (refundItems.length <= 1) return; setRefundItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...refundItems]; n[i] = v; setRefundItems(n); }} />
          </F>
        </Sec>
        <D />

        {/* ══ 14. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="Status">
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

      </div>{/* /formCard */}

      {/* Actions */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/kundalini-yoga-teacher-training" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Kundalini TTC Page</>
          )}
        </button>
      </div>
    </div>
  );
}