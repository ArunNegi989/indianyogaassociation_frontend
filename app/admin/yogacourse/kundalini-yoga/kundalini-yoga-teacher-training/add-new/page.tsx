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

function D() {
  return <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />;
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

function SubSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>{title}</span>
      </div>
      <div className={styles.nestedCardBody}>{children}</div>
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
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Title</label>
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={item.title}
                  placeholder="e.g. Daily Guided Practices"
                  onChange={(e) => update(item.id, "title", e.target.value)} />
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

function LocationStatsManager({ items, onChange }: { items: { num: string; label: string }[]; onChange: (v: any[]) => void }) {
  const update = (i: number, field: string, val: string) => {
    const n = [...items];
    n[i] = { ...n[i], [field]: val };
    onChange(n);
  };
  const add = () => onChange([...items, { num: "", label: "" }]);
  const remove = (i: number) => { if (items.length <= 1) return; onChange(items.filter((_, idx) => idx !== i)); };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
          <span className={styles.listNum}>{i + 1}</span>
          <div className={styles.inputWrap} style={{ flex: "0 0 110px" }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.num}
              placeholder="e.g. 5000+" onChange={(e) => update(i, "num", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.label}
              placeholder="e.g. Years of yoga heritage" onChange={(e) => update(i, "label", e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn} onClick={() => remove(i)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Stat</button>
    </div>
  );
}

function EligibilityPillsManager({ items, onChange }: { items: { icon: string; text: string }[]; onChange: (v: any[]) => void }) {
  const update = (i: number, field: string, val: string) => {
    const n = [...items];
    n[i] = { ...n[i], [field]: val };
    onChange(n);
  };
  const add = () => onChange([...items, { icon: "✓", text: "" }]);
  const remove = (i: number) => { if (items.length <= 1) return; onChange(items.filter((_, idx) => idx !== i)); };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
          <span className={styles.listNum}>{i + 1}</span>
          <div className={styles.inputWrap} style={{ flex: "0 0 70px" }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.icon}
              placeholder="✓" onChange={(e) => update(i, "icon", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.text}
              placeholder="e.g. No prior yoga experience needed" onChange={(e) => update(i, "text", e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn} onClick={() => remove(i)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Pill</button>
    </div>
  );
}

interface FacilityIconCard { icon: string; label: string; desc: string; }

const DEFAULT_FACILITY_ICON_CARDS: FacilityIconCard[] = [
  { icon: "🏠", label: "Accommodation", desc: "Spacious furnished rooms with attached bathrooms" },
  { icon: "👨‍🏫", label: "Expert Guidance", desc: "Access to highly skilled yoga professionals" },
  { icon: "📚", label: "Study Materials", desc: "Online resources, yoga mats, books, and more" },
  { icon: "📹", label: "CCTV Security", desc: "24/7 surveillance for your safety & peace of mind" },
  { icon: "🕐", label: "24/7 Support", desc: "Around-the-clock management assistance" },
  { icon: "🎓", label: "Workshops", desc: "Seminars, workshops, and yoga-related events" },
  { icon: "🥤", label: "Detox Drinks", desc: "Fresh detox drinks and juices daily" },
  { icon: "🥗", label: "3 Meals Daily", desc: "Vegetarian and healthy meals three times a day" },
  { icon: "📶", label: "Free Wifi", desc: "Free wifi and 24/7 hot water service" },
  { icon: "📿", label: "Mala Provided", desc: "A piece of Mala gifted to every student" },
  { icon: "🌿", label: "Nature Excursions", desc: "Guided trips to elevate your experience" },
  { icon: "📜", label: "Certification", desc: "Yoga Alliance TTC certificate upon completion" },
];

function FacilityIconCardsManager({ items, onChange }: { items: FacilityIconCard[]; onChange: (v: FacilityIconCard[]) => void }) {
  const update = (i: number, field: keyof FacilityIconCard, val: string) => {
    const n = [...items];
    n[i] = { ...n[i], [field]: val };
    onChange(n);
  };
  const add = () => onChange([...items, { icon: "✦", label: "", desc: "" }]);
  const remove = (i: number) => { if (items.length <= 1) return; onChange(items.filter((_, idx) => idx !== i)); };

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={styles.nestedCard} style={{ marginBottom: "0.6rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Card {i + 1}: {item.label || "New Card"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(i)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Icon (emoji)</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.icon}
                    placeholder="🏠" onChange={(e) => update(i, "icon", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Label</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.label}
                    placeholder="Accommodation" onChange={(e) => update(i, "label", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.desc}
                    placeholder="Short description…" onChange={(e) => update(i, "desc", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Facility Card</button>
    </div>
  );
}

interface KundaliniFormValues {
  status: "Active" | "Inactive";
  whatIsTitle: string;
  whatIsImageAlt: string;
  activateTitle: string;
  activateImageAlt: string;
  benefitsTitle: string;
  benefitsIntro1: string;
  benefitsIntro2: string;
  highlightsTitle: string;
  highlightsIntro: string;
  syllabusBigTitle: string;
  syllabusSchool: string;
  courseOverviewTitle: string;
  curriculumImageAlt: string;
  sylHeaderBgImageAlt: string;
  courseOverviewBadgeText: string;
  readingBoxTitle: string;
  noteBoxTitle: string;
  noteBoxPara: string;
  eligibilityTitle: string;
  eligibilityImageAlt: string;
  eligibilityBadgeTitle: string;
  eligibilityBadgeSub: string;
  eligibilityChip1Num: string;
  eligibilityChip1Label: string;
  eligibilityChip2Num: string;
  eligibilityChip2Label: string;
  locationTitle: string;
  locationBannerImageAlt: string;
  locationStackTopImageAlt: string;
  locationStackTopLabel: string;
  locationStackBottomImageAlt: string;
  locationStackBottomLabel: string;
  facilitiesTitle: string;
  facilitiesIntro: string;
  facilitiesVideoUrl: string;
  facilitiesVideoTag: string;
  facilitiesVideoText: string;
  scheduleSectionTitle: string;
  scheduleTagLine: string;
  scheduleHeaderSub: string;
  scheduleNoteIcon: string;
  scheduleNoteText: string;
  scheduleQuoteText: string;
  scheduleQuoteAuthor: string;
  scheduleImg1Tag: string;
  scheduleImg2Tag: string;
  whyAYMTitle: string;
  whyRishikeshTitle: string;
  whyRishikeshBannerImageAlt: string;
  whyRishikeshBannerTag: string;
  spiritualTitle: string;
  spiritualIcon: string;
  naturalTitle: string;
  naturalIcon: string;
  typesTitle: string;
  typesIcon: string;
  topSchoolsTitle: string;
  topSchoolsIcon: string;
  aymPillText: string;
  topSchoolsPara: string;
  refundTitle: string;
  refundTagLine: string;
  refundHeaderSub: string;
  courseInfoCardTitle: string;
  courseInfoFeeLabel: string;
  courseInfoFeeFromText: string;
  courseInfoBookBtnText: string;
  courseInfoUsdPrice: number;
  courseInfoInrPrice: number;
  courseInfoOriginalUsdPrice: number;
  courseInfoOriginalInrPrice: number;
}

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

  /* ── What Is Kundalini Image ── */
  const [whatIsImgFile, setWhatIsImgFile] = useState<File | null>(null);
  const [whatIsImgPrev, setWhatIsImgPrev] = useState("");

  /* ── Activate Section Image ── */
  const [activateImgFile, setActivateImgFile] = useState<File | null>(null);
  const [activateImgPrev, setActivateImgPrev] = useState("");

  /* ── Curriculum Image ── */
  const [curriculumImgFile, setCurriculumImgFile] = useState<File | null>(null);
  const [curriculumImgPrev, setCurriculumImgPrev] = useState("");

  /* ── Syllabus Header Background Image ── */
  const [sylHeaderBgFile, setSylHeaderBgFile] = useState<File | null>(null);
  const [sylHeaderBgPrev, setSylHeaderBgPrev] = useState("");

  /* ── Eligibility Image ── */
  const [eligibilityImgFile, setEligibilityImgFile] = useState<File | null>(null);
  const [eligibilityImgPrev, setEligibilityImgPrev] = useState("");

  /* ── Location Banner Image ── */
  const [locationBannerFile, setLocationBannerFile] = useState<File | null>(null);
  const [locationBannerPrev, setLocationBannerPrev] = useState("");

  /* ── Location Stack Top Image ── */
  const [locationStackTopFile, setLocationStackTopFile] = useState<File | null>(null);
  const [locationStackTopPrev, setLocationStackTopPrev] = useState("");

  /* ── Location Stack Bottom Image ── */
  const [locationStackBottomFile, setLocationStackBottomFile] = useState<File | null>(null);
  const [locationStackBottomPrev, setLocationStackBottomPrev] = useState("");

  /* ── Facilities Video Poster ── */
  const [facilitiesPosterFile, setFacilitiesPosterFile] = useState<File | null>(null);
  const [facilitiesPosterPrev, setFacilitiesPosterPrev] = useState("");

  /* ── Class Image ── */
  const [classFile, setClassFile] = useState<File | null>(null);
  const [classPrev, setClassPrev] = useState("");

  /* ── Schedule Images ── */
  const [schedImg1File, setSchedImg1File] = useState<File | null>(null);
  const [schedImg1Prev, setSchedImg1Prev] = useState("");
  const [schedImg2File, setSchedImg2File] = useState<File | null>(null);
  const [schedImg2Prev, setSchedImg2Prev] = useState("");

  /* ── Why Rishikesh Banner Image ── */
  const [whyRishikeshBannerFile, setWhyRishikeshBannerFile] = useState<File | null>(null);
  const [whyRishikeshBannerPrev, setWhyRishikeshBannerPrev] = useState("");

  /* ── Rich text refs ── */
  const courseOverviewParaRef = useRef("");
  const readingBoxNoteRef = useRef("");
  const facilitiesIntroRichRef = useRef("");
  const spiritualParaRef = useRef("");
  const naturalParaRef = useRef("");

  /* ── Para Lists ── */
  const whatIsParaList      = useParaList("wip1");
  const activateParaList    = useParaList("acp1");
  const eligibilityParaList = useParaList("elp1");
  const locationParaList    = useParaList("locp1");

  /* ── Dynamic managers ── */
  const [syllabusModules, setSyllabusModules]         = useState<SyllabusModule[]>(DEFAULT_SYLLABUS);
  const [benefitItems, setBenefitItems]               = useState<string[]>(["It promotes spiritual growth, higher consciousness and self-awareness.", "This practice raises and balances energy, promoting overall well-being.", "It offers calmness to the mind and lowers stress and anxiety.", "Not only does it balance the nervous system, but it also improves flexibility and strengthens the immune system.", "As you take up kundalini Rishikesh yoga, it TTC enhances emotional intelligence, fosters inner peace and offers mental clarity.", "Kundalini yoga promotes self-growth, self-love, self-acceptance, self-healing, and cultivating intuition.", "It helps to overcome addictive behaviours and facilitates profound personal growth and spiritual evolution."]);
  const [highlightCards, setHighlightCards]           = useState<HighlightCard[]>(DEFAULT_HIGHLIGHTS);
  const [readingItems, setReadingItems]               = useState<string[]>(['"The Aquarian Teacher" by Yogi Bhajan', '"Hatha yoga pradipika: Bihar school of Yoga"', '"The Yoga Sutras of Patanjali"', "Aym Yoga School Training Manual of Kundalini Yoga TTC in Rishikesh."]);
  const [facilityItems, setFacilityItems]             = useState<string[]>(["Accommodation in spacious and furnished rooms with attached bathrooms.", "Guidance and access to highly skilled professionals in yoga.", "Access to study material includes online resources, yoga mats, books, and more.", "CCTV surveillance for extra security.", "Around-the-clock management support.", "Attend seminars, workshops, and other related events that promote yoga.", "Detox drinks and juices are offered.", "Vegetarian and healthy meals are provided three times a day.", "Access to free wifi and 24/7 hot water service is offered.", "A piece of Mala is provided to every student.", "Students are taken to nature excursions that elevate their experience.", "Kundalini yoga teacher training course certification is provided at the end of the course."]);
  const [facilityIconCards, setFacilityIconCards]     = useState<FacilityIconCard[]>(DEFAULT_FACILITY_ICON_CARDS);
  const [scheduleItems, setScheduleItems]             = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [whyCards, setWhyCards]                       = useState<WhyCard[]>(DEFAULT_WHY_CARDS);
  const [typesItems, setTypesItems]                   = useState<string[]>(["Beginner to advanced kundalini classes", "Kundalini yoga retreats and intensive courses", "Teacher training programs."]);
  const [refundItems, setRefundItems]                 = useState<string[]>(["An advance course fee will not be refundable. Students can join us on other schedules in case of an emergency.", "If students cancel the course, we accept the cancellation, but the advance deposit will not be refunded in cancellation.", "There is no charge for course cancellation. The student has to inform by email.", "AYM Yoga School is not responsible for any mishappenings before the course schedule."]);
  const [locationStats, setLocationStats]             = useState<{ num: string; label: string }[]>([
    { num: "3", label: "Rivers confluence" },
    { num: "2500+", label: "Metres altitude" },
    { num: "100+", label: "Years of yoga legacy" },
    { num: "∞", label: "Himalayan energy" },
  ]);
  const [eligibilityPills, setEligibilityPills]       = useState<{ icon: string; text: string }[]>([
    { icon: "✓", text: "No prior yoga experience needed" },
    { icon: "✓", text: "No age restriction" },
    { icon: "✓", text: "All nationalities welcome" },
    { icon: "✓", text: "Open to all fitness levels" },
  ]);
  const [courseInfoDetails, setCourseInfoDetails]     = useState([
    { label: "DURATION", value: "24 Days", sub: "" },
    { label: "LEVEL", value: "Beginner to Advanced", sub: "" },
    { label: "CERTIFICATION", value: "200 Hour", sub: "" },
    { label: "YOGA STYLE", value: "Kundalini Yoga", sub: "As taught by Yogi Bhajan" },
    { label: "LANGUAGE", value: "English & Hindi", sub: "" },
    { label: "DATE", value: "Check batches below", sub: "" },
  ]);

  /* ── Schedule Dynamic Fields ── */
  const [schedulePhaseLabels, setSchedulePhaseLabels] = useState([
    { label: "🌅 Morning Practice", color: "#e8720c" },
    { label: "☀️ Midday Session", color: "#c8890a" },
    { label: "🌙 Evening Practice", color: "#7a3a9a" },
  ]);
  const [scheduleStats, setScheduleStats] = useState([
    { icon: "⏰", num: "14+", label: "Hrs Practice" },
    { icon: "🧘", num: "3", label: "Sessions Daily" },
    { icon: "🌿", num: "3", label: "Meals Daily" },
    { icon: "📖", num: "4+", label: "Theory Hrs" },
  ]);

  /* ── Section 9 - Why Rishikesh Banner Stats ── */
  const [whyRishikeshBannerStats, setWhyRishikeshBannerStats] = useState([
    { num: "5000+", label: "Years of yoga heritage" },
    { num: "200+", label: "Ashrams & schools" },
    { num: "3", label: "Sacred rivers" },
    { num: "∞", label: "Himalayan serenity" },
  ]);

  /* ── Section 9 - Refund Trust Items ── */
  const [refundTrustItems, setRefundTrustItems] = useState([
    { icon: "📩", text: "All cancellations must be made via email" },
    { icon: "🔒", text: "Your deposit secures your seat" },
    { icon: "🔄", text: "Flexible rebooking to future batches" },
  ]);

  /* ── Section 9 - Refund Icons & Colors ── */
  const [refundIcons, setRefundIcons] = useState(["💰", "❌", "📧", "⚠️"]);
  const [refundColors, setRefundColors] = useState([
    { color: "#3d6000", bg: "rgba(61,96,0,0.07)", border: "rgba(61,96,0,0.2)" },
    { color: "#8a2c00", bg: "rgba(138,44,0,0.07)", border: "rgba(138,44,0,0.2)" },
    { color: "#1a6fa8", bg: "rgba(26,111,168,0.07)", border: "rgba(26,111,168,0.2)" },
    { color: "#c8890a", bg: "rgba(200,137,10,0.07)", border: "rgba(200,137,10,0.2)" }
  ]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<KundaliniFormValues>({
    defaultValues: {
      status: "Active",
      whatIsTitle: "What is Kundalini Yoga?",
      whatIsImageAlt: "Kundalini Yoga meditation practice",
      activateTitle: "Activate your Kundalini through the kundalini yoga TTC in rishikesh at AYM",
      activateImageAlt: "Kundalini Yoga practice",
      benefitsTitle: "What are the Benefits of Kundalini Yoga?",
      benefitsIntro1: "Is Kundalini yoga the right choice for you?",
      benefitsIntro2: "You must know that enrolling in our Kundalini YTT course in Rishikesh at AYM will transform your personal and professional lives.",
      highlightsTitle: "Kundalini YTT Course Highlights at AYM in Rishikesh",
      highlightsIntro: "At AYM, we offer the best Kundalini yoga teacher training course in rishikesh for aspiring students.",
      syllabusBigTitle: "200-Hour Kundalini Yoga Teacher Training Syllabus",
      syllabusSchool: "Aym Yoga School",
      courseOverviewTitle: "Course Overview:",
      curriculumImageAlt: "Kundalini Yoga teacher training class",
      sylHeaderBgImageAlt: "Kundalini Yoga syllabus header background",
      courseOverviewBadgeText: "Learn · Practice · Teach",
      readingBoxTitle: "Required Reading: Kundalini Yoga teacher training 200 hours India",
      noteBoxTitle: "Note:",
      noteBoxPara: "The above syllabus is in accordance with the specific guidelines and vision of Best Kundalini Yoga teacher training India at Aym Yoga School.",
      eligibilityTitle: "Who Is Eligible to Join the Kundalini Yoga Teacher Training Course in Rishikesh?",
      eligibilityImageAlt: "Yoga students practicing",
      eligibilityBadgeTitle: "Open to All",
      eligibilityBadgeSub: "No prerequisites required",
      eligibilityChip1Num: "0",
      eligibilityChip1Label: "Age Limit",
      eligibilityChip2Num: "All",
      eligibilityChip2Label: "Backgrounds",
      locationTitle: "Is the Location Prime for Yoga Learning?",
      locationBannerImageAlt: "Rishikesh mountains",
      locationStackTopImageAlt: "Yoga class",
      locationStackTopLabel: "Practice Hall",
      locationStackBottomImageAlt: "Ashram view",
      locationStackBottomLabel: "Himalayan Setting",
      facilitiesTitle: "What Facilities are Included in the Course Fee?",
      facilitiesIntro: "Aspirants often worry that learning yoga will break the bank.",
      facilitiesVideoUrl: "",
      facilitiesVideoTag: "LIVE · BREATHE · GROW",
      facilitiesVideoText: "Everything you need for a transformative 24-day residential experience",
      scheduleSectionTitle: "Daily Schedule",
      scheduleTagLine: "24-DAY RESIDENTIAL PROGRAM",
      scheduleHeaderSub: "A carefully structured day balancing intense practice with rest, study &amp; spiritual integration.",
      scheduleNoteIcon: "📌",
      scheduleNoteText: "Schedule may vary slightly by week. Self-study &amp; personal practice time is built into each day.",
      scheduleQuoteText: "Sadhana is the foundation. When you practice every day with discipline and devotion, transformation becomes inevitable.",
      scheduleQuoteAuthor: "— Yogi Bhajan",
      scheduleImg1Tag: "Morning Practice",
      scheduleImg2Tag: "Evening Sadhana",
      whyAYMTitle: "Why Choose AYM Yoga School?",
      whyRishikeshTitle: "Why choose Kundalini Yoga classes and training in rishikesh?",
      whyRishikeshBannerImageAlt: "Rishikesh Himalayan landscape",
      whyRishikeshBannerTag: "Sacred City · Yoga Capital of the World",
      spiritualTitle: "Spiritual significance of Rishikesh:",
      spiritualIcon: "🕉️",
      naturalTitle: "Natural setting and serene environment of Rishikesh:",
      naturalIcon: "🌿",
      typesTitle: "Types of Kundalini Yoga Classes in Rishikesh",
      typesIcon: "📋",
      topSchoolsTitle: "Top Kundalini Yoga Schools and Centers in Rishikesh",
      topSchoolsIcon: "🏆",
      aymPillText: "AYM Yoga School — Ranked among Rishikesh's finest",
      topSchoolsPara: "In recent times, Kundalini yoga has become popular…",
      refundTitle: "Refund Policy - AYM Yoga School",
      refundTagLine: "TRANSPARENCY & TRUST",
      refundHeaderSub: "We believe in clear, fair policies. Here's everything you need to know about our cancellation terms.",
      courseInfoCardTitle: "COURSE DETAILS",
      courseInfoFeeLabel: "COURSE FEE",
      courseInfoFeeFromText: "starting from",
      courseInfoBookBtnText: "BOOK NOW",
      courseInfoUsdPrice: 999,
      courseInfoInrPrice: 82000,
      courseInfoOriginalUsdPrice: 1799,
      courseInfoOriginalInrPrice: 148000,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/kundalini-ttc-content/get");
        const d = res.data?.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);

        const keys: (keyof KundaliniFormValues)[] = [
          "status", "whatIsTitle", "whatIsImageAlt", "activateTitle", "activateImageAlt",
          "benefitsTitle", "benefitsIntro1", "benefitsIntro2", "highlightsTitle", "highlightsIntro",
          "syllabusBigTitle", "syllabusSchool", "courseOverviewTitle", "curriculumImageAlt",
          "sylHeaderBgImageAlt", "courseOverviewBadgeText", "readingBoxTitle",
          "noteBoxTitle", "noteBoxPara", "eligibilityTitle", "eligibilityImageAlt",
          "eligibilityBadgeTitle", "eligibilityBadgeSub", "eligibilityChip1Num", "eligibilityChip1Label",
          "eligibilityChip2Num", "eligibilityChip2Label", "locationTitle", "locationBannerImageAlt",
          "locationStackTopImageAlt", "locationStackTopLabel", "locationStackBottomImageAlt",
          "locationStackBottomLabel", "facilitiesTitle", "facilitiesIntro", "facilitiesVideoUrl",
          "facilitiesVideoTag", "facilitiesVideoText", "scheduleSectionTitle", "scheduleTagLine",
          "scheduleHeaderSub", "scheduleNoteIcon", "scheduleNoteText", "scheduleQuoteText",
          "scheduleQuoteAuthor", "scheduleImg1Tag", "scheduleImg2Tag", "whyAYMTitle",
          "whyRishikeshTitle", "whyRishikeshBannerImageAlt", "whyRishikeshBannerTag",
          "spiritualTitle", "spiritualIcon", "naturalTitle", "naturalIcon", "typesTitle",
          "typesIcon", "topSchoolsTitle", "topSchoolsIcon", "aymPillText", "topSchoolsPara",
          "refundTitle", "refundTagLine", "refundHeaderSub", "courseInfoCardTitle",
          "courseInfoFeeLabel", "courseInfoFeeFromText", "courseInfoBookBtnText",
          "courseInfoUsdPrice", "courseInfoInrPrice", "courseInfoOriginalUsdPrice",
          "courseInfoOriginalInrPrice",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k]); });

        courseOverviewParaRef.current  = d.courseOverviewPara || "";
        readingBoxNoteRef.current      = d.readingBoxNote || "";
        facilitiesIntroRichRef.current = d.facilitiesIntroRich || "";
        spiritualParaRef.current       = d.spiritualPara || "";
        naturalParaRef.current         = d.naturalPara || "";

        if (d.heroImage)               setHeroPrev(BASE_URL + d.heroImage);
        if (d.whatIsImage)             setWhatIsImgPrev(BASE_URL + d.whatIsImage);
        if (d.activateImage)           setActivateImgPrev(BASE_URL + d.activateImage);
        if (d.curriculumImage)         setCurriculumImgPrev(BASE_URL + d.curriculumImage);
        if (d.sylHeaderBgImage)        setSylHeaderBgPrev(BASE_URL + d.sylHeaderBgImage);
        if (d.eligibilityImage)        setEligibilityImgPrev(BASE_URL + d.eligibilityImage);
        if (d.locationBannerImage)     setLocationBannerPrev(BASE_URL + d.locationBannerImage);
        if (d.locationStackTopImage)   setLocationStackTopPrev(BASE_URL + d.locationStackTopImage);
        if (d.locationStackBottomImage) setLocationStackBottomPrev(BASE_URL + d.locationStackBottomImage);
        if (d.facilitiesVideoPoster)   setFacilitiesPosterPrev(BASE_URL + d.facilitiesVideoPoster);
        if (d.classImage)              setClassPrev(BASE_URL + d.classImage);
        if (d.schedImg1)               setSchedImg1Prev(BASE_URL + d.schedImg1);
        if (d.schedImg2)               setSchedImg2Prev(BASE_URL + d.schedImg2);
        if (d.whyRishikeshBannerImage) setWhyRishikeshBannerPrev(BASE_URL + d.whyRishikeshBannerImage);

        if (d.whatIsParagraphs?.length)      whatIsParaList.loadFromArray(d.whatIsParagraphs, "wip");
        if (d.activateParagraphs?.length)    activateParaList.loadFromArray(d.activateParagraphs, "acp");
        if (d.eligibilityParagraphs?.length) eligibilityParaList.loadFromArray(d.eligibilityParagraphs, "elp");
        if (d.locationParagraphs?.length)    locationParaList.loadFromArray(d.locationParagraphs, "locp");

        if (d.syllabusModules?.length)   setSyllabusModules(d.syllabusModules);
        if (d.benefitItems?.length)      setBenefitItems(d.benefitItems);
        if (d.highlightCards?.length)    setHighlightCards(d.highlightCards);
        if (d.readingItems?.length)      setReadingItems(d.readingItems);
        if (d.facilityItems?.length)     setFacilityItems(d.facilityItems);
        if (d.facilityIconCards?.length) setFacilityIconCards(d.facilityIconCards);
        if (d.scheduleItems?.length)     setScheduleItems(d.scheduleItems);
        if (d.whyCards?.length)          setWhyCards(d.whyCards);
        if (d.typesItems?.length)        setTypesItems(d.typesItems);
        if (d.refundItems?.length)       setRefundItems(d.refundItems);
        if (d.locationStats?.length)     setLocationStats(d.locationStats);
        if (d.eligibilityPills?.length)  setEligibilityPills(d.eligibilityPills);
        if (d.courseInfoDetails?.length) setCourseInfoDetails(d.courseInfoDetails);
        if (d.schedulePhaseLabels?.length) setSchedulePhaseLabels(d.schedulePhaseLabels);
        if (d.scheduleStats?.length)     setScheduleStats(d.scheduleStats);
        if (d.whyRishikeshBannerStats?.length) setWhyRishikeshBannerStats(d.whyRishikeshBannerStats);
        if (d.refundTrustItems?.length)  setRefundTrustItems(d.refundTrustItems);
        if (d.refundIcons?.length)       setRefundIcons(d.refundIcons);
        if (d.refundColors?.length)      setRefundColors(d.refundColors);
      } catch {
        toast.error("Failed to load existing content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: KundaliniFormValues) => {
    if (!heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("courseOverviewPara",  courseOverviewParaRef.current);
      fd.append("readingBoxNote",      readingBoxNoteRef.current);
      fd.append("facilitiesIntroRich", facilitiesIntroRichRef.current);
      fd.append("spiritualPara",       spiritualParaRef.current);
      fd.append("naturalPara",         naturalParaRef.current);

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

      fd.append("syllabusModules",   JSON.stringify(syllabusModules));
      fd.append("benefitItems",      JSON.stringify(benefitItems.filter(Boolean)));
      fd.append("highlightCards",    JSON.stringify(highlightCards));
      fd.append("readingItems",      JSON.stringify(readingItems.filter(Boolean)));
      fd.append("facilityItems",     JSON.stringify(facilityItems.filter(Boolean)));
      fd.append("facilityIconCards", JSON.stringify(facilityIconCards));
      fd.append("scheduleItems",     JSON.stringify(scheduleItems));
      fd.append("whyCards",          JSON.stringify(whyCards));
      fd.append("typesItems",        JSON.stringify(typesItems.filter(Boolean)));
      fd.append("refundItems",       JSON.stringify(refundItems.filter(Boolean)));
      fd.append("locationStats",     JSON.stringify(locationStats));
      fd.append("eligibilityPills",  JSON.stringify(eligibilityPills));
      fd.append("courseInfoDetails", JSON.stringify(courseInfoDetails));
      fd.append("schedulePhaseLabels", JSON.stringify(schedulePhaseLabels));
      fd.append("scheduleStats",     JSON.stringify(scheduleStats));
      fd.append("whyRishikeshBannerStats", JSON.stringify(whyRishikeshBannerStats));
      fd.append("refundTrustItems",  JSON.stringify(refundTrustItems));
      fd.append("refundIcons",       JSON.stringify(refundIcons));
      fd.append("refundColors",      JSON.stringify(refundColors));

      if (heroFile)                fd.append("heroImage", heroFile);
      if (whatIsImgFile)           fd.append("whatIsImage", whatIsImgFile);
      if (activateImgFile)         fd.append("activateImage", activateImgFile);
      if (curriculumImgFile)       fd.append("curriculumImage", curriculumImgFile);
      if (sylHeaderBgFile)         fd.append("sylHeaderBgImage", sylHeaderBgFile);
      if (eligibilityImgFile)      fd.append("eligibilityImage", eligibilityImgFile);
      if (locationBannerFile)      fd.append("locationBannerImage", locationBannerFile);
      if (locationStackTopFile)    fd.append("locationStackTopImage", locationStackTopFile);
      if (locationStackBottomFile) fd.append("locationStackBottomImage", locationStackBottomFile);
      if (facilitiesPosterFile)    fd.append("facilitiesVideoPoster", facilitiesPosterFile);
      if (classFile)               fd.append("classImage", classFile);
      if (schedImg1File)           fd.append("schedImg1", schedImg1File);
      if (schedImg2File)           fd.append("schedImg2", schedImg2File);
      if (whyRishikeshBannerFile)  fd.append("whyRishikeshBannerImage", whyRishikeshBannerFile);

      if (isEdit) {
        await api.put("/kundalini-ttc-content/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully!");
      } else {
        await api.post("/kundalini-ttc-content/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return (
    <div className={styles.loadingWrap}>
      <span className={styles.spinner} />
      <span>Loading Kundalini TTC content…</span>
    </div>
  );

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

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training")}>
          Kundalini TTC
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit Kundalini Yoga TTC Page" : "Add Kundalini Yoga TTC Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Course Info Card · What is Kundalini · Activate & Benefits · Syllabus · Eligibility · Location · Facilities · Schedule · Why AYM · Why Rishikesh · Refund
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>
        {/* HERO IMAGE */}
        <Sec title="Hero Banner Image" badge="Top of Page">
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

        {/* COURSE INFO CARD */}
        <Sec title="Course Info Card" badge="Dynamic Pricing & Details">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseInfoCardTitle")} placeholder="COURSE DETAILS" />
            </div>
          </F>
          <F label="Fee Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseInfoFeeLabel")} placeholder="COURSE FEE" />
            </div>
          </F>
          <F label="Fee 'Starting From' Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseInfoFeeFromText")} placeholder="starting from" />
            </div>
          </F>
          <F label="Book Button Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseInfoBookBtnText")} placeholder="BOOK NOW" />
            </div>
          </F>

          <F label="Course Details Items">
            <div>
              {courseInfoDetails.map((detail, i) => (
                <div key={i} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Detail {i + 1}</span>
                    {courseInfoDetails.length > 1 && (
                      <button type="button" className={styles.removeNestedBtn}
                        onClick={() => setCourseInfoDetails(courseInfoDetails.filter((_, idx) => idx !== i))}>
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Label</label>
                        <div className={styles.inputWrap}>
                          <input className={styles.input} value={detail.label} placeholder="DURATION"
                            onChange={(e) => { const n = [...courseInfoDetails]; n[i] = { ...n[i], label: e.target.value }; setCourseInfoDetails(n); }} />
                        </div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Value</label>
                        <div className={styles.inputWrap}>
                          <input className={styles.input} value={detail.value} placeholder="24 Days"
                            onChange={(e) => { const n = [...courseInfoDetails]; n[i] = { ...n[i], value: e.target.value }; setCourseInfoDetails(n); }} />
                        </div>
                      </div>
                      <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                        <label className={styles.label}>Subtext (optional)</label>
                        <div className={styles.inputWrap}>
                          <input className={styles.input} value={detail.sub || ""} placeholder="As taught by Yogi Bhajan"
                            onChange={(e) => { const n = [...courseInfoDetails]; n[i] = { ...n[i], sub: e.target.value }; setCourseInfoDetails(n); }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn}
                onClick={() => setCourseInfoDetails([...courseInfoDetails, { label: "", value: "", sub: "" }])}>
                ＋ Add Course Detail
              </button>
            </div>
          </F>

          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e8d5b5" }}>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", fontWeight: 600, color: "#3d1d00", marginBottom: "0.5rem" }}>
              💰 Course Card Pricing (Independent of batch pricing)
            </h4>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>USD Current Price</label>
                <div className={styles.inputWrap}>
                  <input type="number" className={styles.input} {...register("courseInfoUsdPrice")} placeholder="999" />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>INR Current Price</label>
                <div className={styles.inputWrap}>
                  <input type="number" className={styles.input} {...register("courseInfoInrPrice")} placeholder="82000" />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>USD Original Price</label>
                <div className={styles.inputWrap}>
                  <input type="number" className={styles.input} {...register("courseInfoOriginalUsdPrice")} placeholder="1799" />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>INR Original Price</label>
                <div className={styles.inputWrap}>
                  <input type="number" className={styles.input} {...register("courseInfoOriginalInrPrice")} placeholder="148000" />
                </div>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* WHAT IS KUNDALINI YOGA */}
        <Sec title="What is Kundalini Yoga?" badge="Vintage Card">
          <F label="Card Title" req>
            <div className={`${styles.inputWrap} ${errors.whatIsTitle ? styles.inputError : ""}`}>
              <input className={styles.input} {...register("whatIsTitle", { required: "Required" })} />
            </div>
          </F>
          <F label="Section Image">
            <SingleImg preview={whatIsImgPrev} badge="What Is Kundalini" hint="JPG/PNG/WEBP · 800×600px" error=""
              onSelect={(f, p) => { setWhatIsImgFile(f); setWhatIsImgPrev(p); }}
              onRemove={() => { setWhatIsImgFile(null); setWhatIsImgPrev(""); }} />
          </F>
          <F label="Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("whatIsImageAlt")} />
            </div>
          </F>
          <F label="Paragraphs">
            {whatIsParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={whatIsParaList.ids.length}
                onSave={whatIsParaList.save} onRemove={whatIsParaList.remove}
                value={whatIsParaList.ref.current[id]} />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={whatIsParaList.add}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ACTIVATE & BENEFITS */}
        <Sec title="Activate & Benefits" badge="Light Section">
          <F label="Section Heading" req>
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("activateTitle")} />
            </div>
          </F>
          <F label="Section Image">
            <SingleImg preview={activateImgPrev} badge="Activate Section" hint="JPG/PNG/WEBP · 800×600px" error=""
              onSelect={(f, p) => { setActivateImgFile(f); setActivateImgPrev(p); }}
              onRemove={() => { setActivateImgFile(null); setActivateImgPrev(""); }} />
          </F>
          <F label="Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("activateImageAlt")} />
            </div>
          </F>
          <F label="Paragraphs">
            {activateParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={activateParaList.ids.length}
                onSave={activateParaList.save} onRemove={activateParaList.remove}
                value={activateParaList.ref.current[id]} />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={activateParaList.add}>＋ Add Paragraph</button>
          </F>

          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e8d5b5" }}>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", fontWeight: 600, color: "#3d1d00", marginBottom: "1rem" }}>✨ Benefits Card</h4>
            <F label="Benefits Card Title" req>
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("benefitsTitle")} />
              </div>
            </F>
            <div className={styles.grid2}>
              <F label="Intro Paragraph 1">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("benefitsIntro1")} />
              </F>
              <F label="Intro Paragraph 2">
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("benefitsIntro2")} />
              </F>
            </div>
            <F label="Benefit Items">
              <StrList items={benefitItems} label="Benefit"
                onAdd={() => setBenefitItems((p) => [...p, ""])}
                onRemove={(i) => { if (benefitItems.length <= 1) return; setBenefitItems((p) => p.filter((_, idx) => idx !== i)); }}
                onUpdate={(i, v) => { const n = [...benefitItems]; n[i] = v; setBenefitItems(n); }} />
            </F>
          </div>
        </Sec>
        <D />

        {/* COURSE HIGHLIGHTS */}
        <Sec title="Course Highlights" badge="Vintage Card">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("highlightsTitle")} />
            </div>
          </F>
          <F label="Intro Paragraph">
            <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("highlightsIntro")} />
          </F>
          <F label="Highlight Cards">
            <HighlightManager items={highlightCards} onChange={setHighlightCards} />
          </F>
        </Sec>
        <D />

        {/* SYLLABUS / CURRICULUM */}
        <Sec title="200-Hr Syllabus" badge="Accordion + Images">
          <div className={styles.grid2}>
            <F label="Main Syllabus Title" req>
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("syllabusBigTitle")} />
              </div>
            </F>
            <F label="School Name">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("syllabusSchool")} />
              </div>
            </F>
          </div>

          <SubSec title="Syllabus Header Background">
            <F label="Header Background Image">
              <SingleImg preview={sylHeaderBgPrev} badge="Syllabus Header BG" hint="JPG/PNG/WEBP · 1440×500px" error=""
                onSelect={(f, p) => { setSylHeaderBgFile(f); setSylHeaderBgPrev(p); }}
                onRemove={() => { setSylHeaderBgFile(null); setSylHeaderBgPrev(""); }} />
            </F>
            <F label="Header Background Alt Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("sylHeaderBgImageAlt")} />
              </div>
            </F>
          </SubSec>

          <F label="Course Overview Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseOverviewTitle")} />
            </div>
          </F>
          <F label="Course Overview Badge Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("courseOverviewBadgeText")} />
            </div>
          </F>
          <F label="Course Overview Paragraph">
            <StableJodit onSave={(v) => { courseOverviewParaRef.current = v; }} value={courseOverviewParaRef.current} />
          </F>

          <SubSec title="Curriculum Section Image">
            <F label="Curriculum Image">
              <SingleImg preview={curriculumImgPrev} badge="Curriculum" hint="JPG/PNG/WEBP · 700×500px" error=""
                onSelect={(f, p) => { setCurriculumImgFile(f); setCurriculumImgPrev(p); }}
                onRemove={() => { setCurriculumImgFile(null); setCurriculumImgPrev(""); }} />
            </F>
            <F label="Curriculum Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("curriculumImageAlt")} />
              </div>
            </F>
          </SubSec>

          <F label="Syllabus Modules">
            <SyllabusManager items={syllabusModules} onChange={setSyllabusModules} />
          </F>

          <F label="Required Reading Box Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("readingBoxTitle")} />
            </div>
          </F>
          <F label="Required Reading Items">
            <StrList items={readingItems} label="Reading Item"
              onAdd={() => setReadingItems((p) => [...p, ""])}
              onRemove={(i) => { if (readingItems.length <= 1) return; setReadingItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...readingItems]; n[i] = v; setReadingItems(n); }} />
          </F>
          <div className={styles.grid2}>
            <F label="Note Box Label">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("noteBoxTitle")} />
              </div>
            </F>
            <F label="Note Box Paragraph">
              <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("noteBoxPara")} />
            </F>
          </div>
        </Sec>
        <D />

        {/* ELIGIBILITY */}
        <Sec title="Eligibility" badge="Card + Image + Chips + Pills">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("eligibilityTitle")} />
            </div>
          </F>

          <SubSec title="Section Image">
            <F label="Eligibility Image">
              <SingleImg preview={eligibilityImgPrev} badge="Eligibility" hint="JPG/PNG/WEBP · 600×750px" error=""
                onSelect={(f, p) => { setEligibilityImgFile(f); setEligibilityImgPrev(p); }}
                onRemove={() => { setEligibilityImgFile(null); setEligibilityImgPrev(""); }} />
            </F>
            <F label="Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("eligibilityImageAlt")} />
              </div>
            </F>
          </SubSec>

          <SubSec title="Image Badge & Floating Chips">
            <div className={styles.grid2}>
              <F label="Badge Title">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityBadgeTitle")} />
                </div>
              </F>
              <F label="Badge Subtitle">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityBadgeSub")} />
                </div>
              </F>
              <F label="Chip 1 Number">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityChip1Num")} />
                </div>
              </F>
              <F label="Chip 1 Label">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityChip1Label")} />
                </div>
              </F>
              <F label="Chip 2 Number">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityChip2Num")} />
                </div>
              </F>
              <F label="Chip 2 Label">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("eligibilityChip2Label")} />
                </div>
              </F>
            </div>
          </SubSec>

          <F label="Paragraphs">
            {eligibilityParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={eligibilityParaList.ids.length}
                onSave={eligibilityParaList.save} onRemove={eligibilityParaList.remove}
                value={eligibilityParaList.ref.current[id]} />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={eligibilityParaList.add}>＋ Add Paragraph</button>
          </F>

          <SubSec title="Eligibility Pills">
            <EligibilityPillsManager items={eligibilityPills} onChange={setEligibilityPills} />
          </SubSec>
        </Sec>
        <D />

        {/* LOCATION */}
        <Sec title="Location" badge="Banner + Images + Stats">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("locationTitle")} />
            </div>
          </F>

          <SubSec title="Location Banner Image">
            <F label="Banner Image">
              <SingleImg preview={locationBannerPrev} badge="Location Banner" hint="JPG/PNG/WEBP · 1440×500px" error=""
                onSelect={(f, p) => { setLocationBannerFile(f); setLocationBannerPrev(p); }}
                onRemove={() => { setLocationBannerFile(null); setLocationBannerPrev(""); }} />
            </F>
            <F label="Banner Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("locationBannerImageAlt")} />
              </div>
            </F>
          </SubSec>

          <SubSec title="Location Banner Stats">
            <LocationStatsManager items={locationStats} onChange={setLocationStats} />
          </SubSec>

          <F label="Paragraphs">
            {locationParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={locationParaList.ids.length}
                onSave={locationParaList.save} onRemove={locationParaList.remove}
                value={locationParaList.ref.current[id]} />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={locationParaList.add}>＋ Add Paragraph</button>
          </F>

          <SubSec title="Location Stack Images">
            <div className={styles.grid2}>
              <F label="Top Image">
                <SingleImg preview={locationStackTopPrev} badge="Top Image" hint="JPG/PNG/WEBP · 500×300px" error=""
                  onSelect={(f, p) => { setLocationStackTopFile(f); setLocationStackTopPrev(p); }}
                  onRemove={() => { setLocationStackTopFile(null); setLocationStackTopPrev(""); }} />
              </F>
              <F label="Bottom Image">
                <SingleImg preview={locationStackBottomPrev} badge="Bottom Image" hint="JPG/PNG/WEBP · 500×300px" error=""
                  onSelect={(f, p) => { setLocationStackBottomFile(f); setLocationStackBottomPrev(p); }}
                  onRemove={() => { setLocationStackBottomFile(null); setLocationStackBottomPrev(""); }} />
              </F>
            </div>
            <div className={styles.grid2} style={{ marginTop: "0.75rem" }}>
              <F label="Top Image Alt Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("locationStackTopImageAlt")} />
                </div>
              </F>
              <F label="Bottom Image Alt Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("locationStackBottomImageAlt")} />
                </div>
              </F>
              <F label="Top Image Label">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("locationStackTopLabel")} />
                </div>
              </F>
              <F label="Bottom Image Label">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("locationStackBottomLabel")} />
                </div>
              </F>
            </div>
          </SubSec>
        </Sec>
        <D />

        {/* FACILITIES */}
        <Sec title="Facilities" badge="Card + Icon Grid">
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("facilitiesTitle")} />
            </div>
          </F>
          <F label="Intro Paragraph (plain text)">
            <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("facilitiesIntro")} />
          </F>
          <F label="Intro Paragraph (Rich Text)">
            <StableJodit onSave={(v) => { facilitiesIntroRichRef.current = v; }} value={facilitiesIntroRichRef.current} />
          </F>

          <SubSec title="Facilities Video Banner">
            <F label="Video URL (MP4)">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("facilitiesVideoUrl")} placeholder="https://cdn.example.com/video.mp4" />
              </div>
            </F>
            <F label="Video Poster Image">
              <SingleImg preview={facilitiesPosterPrev} badge="Video Poster" hint="JPG/PNG/WEBP · 1440×600px" error=""
                onSelect={(f, p) => { setFacilitiesPosterFile(f); setFacilitiesPosterPrev(p); }}
                onRemove={() => { setFacilitiesPosterFile(null); setFacilitiesPosterPrev(""); }} />
            </F>
            <div className={styles.grid2}>
              <F label="Video Tag Line">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("facilitiesVideoTag")} />
                </div>
              </F>
              <F label="Video Overlay Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("facilitiesVideoText")} />
                </div>
              </F>
            </div>
          </SubSec>

          <SubSec title="Facility Icon Cards">
            <FacilityIconCardsManager items={facilityIconCards} onChange={setFacilityIconCards} />
          </SubSec>

          <F label="Facility List Items">
            <StrList items={facilityItems} label="Facility Item"
              onAdd={() => setFacilityItems((p) => [...p, ""])}
              onRemove={(i) => { if (facilityItems.length <= 1) return; setFacilityItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...facilityItems]; n[i] = v; setFacilityItems(n); }} />
          </F>
        </Sec>
        <D />

        {/* DAILY SCHEDULE */}
        <Sec title="Daily Schedule" badge="Time Table + Images + Stats + Quote">
          <F label="Section Tag Line">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("scheduleTagLine")} placeholder="24-DAY RESIDENTIAL PROGRAM" />
            </div>
          </F>
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("scheduleSectionTitle")} placeholder="Daily Schedule" />
            </div>
          </F>
          <F label="Header Subtitle">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("scheduleHeaderSub")} />
            </div>
          </F>
          <F label="Schedule Rows">
            <ScheduleManager items={scheduleItems} onChange={setScheduleItems} />
          </F>
          
          <SubSec title="Phase Labels (Colors & Icons)">
            <div>
              {schedulePhaseLabels.map((phase, idx) => (
                <div key={idx} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Phase {idx + 1}</span>
                    {schedulePhaseLabels.length > 1 && (
                      <button type="button" className={styles.removeNestedBtn} 
                        onClick={() => setSchedulePhaseLabels(schedulePhaseLabels.filter((_, i) => i !== idx))}>
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Label (with emoji)</label>
                        <div className={styles.inputWrap}>
                          <input className={styles.input} value={phase.label} placeholder="🌅 Morning Practice"
                            onChange={(e) => { const n = [...schedulePhaseLabels]; n[idx] = { ...n[idx], label: e.target.value }; setSchedulePhaseLabels(n); }} />
                        </div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Color (hex)</label>
                        <div className={styles.inputWrap}>
                          <input className={styles.input} value={phase.color} placeholder="#e8720c"
                            onChange={(e) => { const n = [...schedulePhaseLabels]; n[idx] = { ...n[idx], color: e.target.value }; setSchedulePhaseLabels(n); }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setSchedulePhaseLabels([...schedulePhaseLabels, { label: "", color: "#000000" }])}>
                ＋ Add Phase
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Bottom Note Strip">
            <div className={styles.grid2}>
              <F label="Note Icon">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("scheduleNoteIcon")} placeholder="📌" />
                </div>
              </F>
              <F label="Note Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("scheduleNoteText")} />
                </div>
              </F>
            </div>
          </SubSec>
          
          <SubSec title="Schedule Stats">
            <div>
              {scheduleStats.map((stat, idx) => (
                <div key={idx} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <span className={styles.listNum}>{idx + 1}</span>
                  <div className={styles.inputWrap} style={{ flex: "0 0 70px" }}>
                    <input className={styles.input} value={stat.icon} placeholder="⏰"
                      onChange={(e) => { const n = [...scheduleStats]; n[idx] = { ...n[idx], icon: e.target.value }; setScheduleStats(n); }} />
                  </div>
                  <div className={styles.inputWrap} style={{ flex: "0 0 80px" }}>
                    <input className={styles.input} value={stat.num} placeholder="14+"
                      onChange={(e) => { const n = [...scheduleStats]; n[idx] = { ...n[idx], num: e.target.value }; setScheduleStats(n); }} />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input className={styles.input} value={stat.label} placeholder="Hrs Practice"
                      onChange={(e) => { const n = [...scheduleStats]; n[idx] = { ...n[idx], label: e.target.value }; setScheduleStats(n); }} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} 
                    onClick={() => { if (scheduleStats.length > 1) setScheduleStats(scheduleStats.filter((_, i) => i !== idx)); }}
                    disabled={scheduleStats.length <= 1}>✕</button>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setScheduleStats([...scheduleStats, { icon: "", num: "", label: "" }])}>
                ＋ Add Stat
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Quote Card">
            <F label="Quote Text">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("scheduleQuoteText")} />
              </div>
            </F>
            <F label="Quote Author">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("scheduleQuoteAuthor")} placeholder="— Yogi Bhajan" />
              </div>
            </F>
          </SubSec>
          
          <div className={styles.grid2}>
            <SubSec title="Schedule Photo 1">
              <F label="Image">
                <SingleImg preview={schedImg1Prev} badge="Photo 1" hint="JPG/PNG · portrait" error=""
                  onSelect={(f, p) => { setSchedImg1File(f); setSchedImg1Prev(p); }}
                  onRemove={() => { setSchedImg1File(null); setSchedImg1Prev(""); }} />
              </F>
              <F label="Image Tag Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("scheduleImg1Tag")} placeholder="Morning Practice" />
                </div>
              </F>
            </SubSec>
            <SubSec title="Schedule Photo 2">
              <F label="Image">
                <SingleImg preview={schedImg2Prev} badge="Photo 2" hint="JPG/PNG · portrait" error=""
                  onSelect={(f, p) => { setSchedImg2File(f); setSchedImg2Prev(p); }}
                  onRemove={() => { setSchedImg2File(null); setSchedImg2Prev(""); }} />
              </F>
              <F label="Image Tag Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("scheduleImg2Tag")} placeholder="Evening Sadhana" />
                </div>
              </F>
            </SubSec>
          </div>
        </Sec>
        <D />

        {/* WHY CHOOSE AYM */}
        <Sec title="Why Choose AYM" badge="Cards + Class Image">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("whyAYMTitle")} />
            </div>
          </F>
          <F label="Why Cards">
            <WhyCardManager items={whyCards} onChange={setWhyCards} />
          </F>
          <F label="Class Group Photo">
            <SingleImg preview={classPrev} badge="Class Photo" hint="JPG/PNG/WEBP · 1200×500px" error=""
              onSelect={(f, p) => { setClassFile(f); setClassPrev(p); }}
              onRemove={() => { setClassFile(null); setClassPrev(""); }} />
          </F>
        </Sec>
        <D />

        {/* WHY RISHIKESH BANNER SECTION */}
        <Sec title="Why Rishikesh Banner" badge="Section 9 - Top Banner">
          <F label="Banner Image" hint="Full-width banner image · Recommended: 1440×500px">
            <SingleImg preview={whyRishikeshBannerPrev} badge="Rishikesh Banner" hint="JPG/PNG/WEBP · 1440×500px" error=""
              onSelect={(f, p) => { setWhyRishikeshBannerFile(f); setWhyRishikeshBannerPrev(p); }}
              onRemove={() => { setWhyRishikeshBannerFile(null); setWhyRishikeshBannerPrev(""); }} />
          </F>
          <F label="Banner Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("whyRishikeshBannerImageAlt")} placeholder="Rishikesh Himalayan landscape" />
            </div>
          </F>
          <F label="Banner Tag Line">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("whyRishikeshBannerTag")} placeholder="Sacred City · Yoga Capital of the World" />
            </div>
          </F>
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("whyRishikeshTitle")} />
            </div>
          </F>
          
          <SubSec title="Banner Stats">
            <p className={styles.fieldHint}>Statistics shown on the banner overlay</p>
            <div>
              {whyRishikeshBannerStats.map((stat, idx) => (
                <div key={idx} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <span className={styles.listNum}>{idx + 1}</span>
                  <div className={styles.inputWrap} style={{ flex: "0 0 100px" }}>
                    <input className={styles.input} value={stat.num} placeholder="5000+"
                      onChange={(e) => { const n = [...whyRishikeshBannerStats]; n[idx] = { ...n[idx], num: e.target.value }; setWhyRishikeshBannerStats(n); }} />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input className={styles.input} value={stat.label} placeholder="Years of yoga heritage"
                      onChange={(e) => { const n = [...whyRishikeshBannerStats]; n[idx] = { ...n[idx], label: e.target.value }; setWhyRishikeshBannerStats(n); }} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} 
                    onClick={() => { if (whyRishikeshBannerStats.length > 1) setWhyRishikeshBannerStats(whyRishikeshBannerStats.filter((_, i) => i !== idx)); }}
                    disabled={whyRishikeshBannerStats.length <= 1}>✕</button>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setWhyRishikeshBannerStats([...whyRishikeshBannerStats, { num: "", label: "" }])}>
                ＋ Add Stat
              </button>
            </div>
          </SubSec>
        </Sec>
        <D />

        {/* SPIRITUAL & NATURAL PILLARS */}
        <Sec title="Spiritual & Natural Pillars" badge="Section 9 - Left Column">
          <div className={styles.grid2}>
            <SubSec title="Spiritual Pillar">
              <F label="Icon">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("spiritualIcon")} placeholder="🕉️" />
                </div>
              </F>
              <F label="Title">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("spiritualTitle")} />
                </div>
              </F>
              <F label="Content (Rich Text)">
                <StableJodit onSave={(v) => { spiritualParaRef.current = v; }} value={spiritualParaRef.current} />
              </F>
            </SubSec>
            <SubSec title="Natural Pillar">
              <F label="Icon">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("naturalIcon")} placeholder="🌿" />
                </div>
              </F>
              <F label="Title">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("naturalTitle")} />
                </div>
              </F>
              <F label="Content (Rich Text)">
                <StableJodit onSave={(v) => { naturalParaRef.current = v; }} value={naturalParaRef.current} />
              </F>
            </SubSec>
          </div>
        </Sec>
        <D />

        {/* TYPES & TOP SCHOOLS */}
        <Sec title="Types & Top Schools" badge="Section 9 - Right Column">
          <div className={styles.grid2}>
            <SubSec title="Types of Kundalini Classes">
              <F label="Icon">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("typesIcon")} placeholder="📋" />
                </div>
              </F>
              <F label="Title">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("typesTitle")} />
                </div>
              </F>
              <F label="List Items">
                <StrList items={typesItems} label="Type Item"
                  onAdd={() => setTypesItems((p) => [...p, ""])}
                  onRemove={(i) => { if (typesItems.length <= 1) return; setTypesItems((p) => p.filter((_, idx) => idx !== i)); }}
                  onUpdate={(i, v) => { const n = [...typesItems]; n[i] = v; setTypesItems(n); }} />
              </F>
            </SubSec>
            <SubSec title="Top Schools">
              <F label="Icon">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("topSchoolsIcon")} placeholder="🏆" />
                </div>
              </F>
              <F label="Title">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("topSchoolsTitle")} />
                </div>
              </F>
              <F label="Paragraph">
                <div className={styles.inputWrap}>
                  <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("topSchoolsPara")} />
                </div>
              </F>
              <F label="AYM Pill Text">
                <div className={styles.inputWrap}>
                  <input className={styles.input} {...register("aymPillText")} placeholder="AYM Yoga School — Ranked among Rishikesh's finest" />
                </div>
              </F>
            </SubSec>
          </div>
        </Sec>
        <D />

        {/* REFUND POLICY SECTION */}
        <Sec title="Refund Policy" badge="Section 9 - Refund Cards">
          <F label="Section Tag Line">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("refundTagLine")} placeholder="TRANSPARENCY & TRUST" />
            </div>
          </F>
          <F label="Card Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("refundTitle")} />
            </div>
          </F>
          <F label="Header Subtitle">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={2} {...register("refundHeaderSub")} />
            </div>
          </F>
          
          <SubSec title="Refund Policy Items">
            <p className={styles.fieldHint}>Each item appears as a numbered policy card. Icons cycle through the list below.</p>
            <StrList items={refundItems} label="Policy Item"
              onAdd={() => setRefundItems((p) => [...p, ""])}
              onRemove={(i) => { if (refundItems.length <= 1) return; setRefundItems((p) => p.filter((_, idx) => idx !== i)); }}
              onUpdate={(i, v) => { const n = [...refundItems]; n[i] = v; setRefundItems(n); }} />
          </SubSec>
          
          <SubSec title="Refund Icons (Cycle Order)">
            <p className={styles.fieldHint}>Icons that cycle through the policy cards (in order)</p>
            <div className={styles.listItemRow} style={{ gap: "0.5rem", flexWrap: "wrap" }}>
              {refundIcons.map((icon, idx) => (
                <div key={idx} className={styles.inputWrap} style={{ flex: "0 0 80px" }}>
                  <input className={styles.input} value={icon} placeholder="💰"
                    onChange={(e) => { const n = [...refundIcons]; n[idx] = e.target.value; setRefundIcons(n); }} />
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setRefundIcons([...refundIcons, "✨"])}>
                ＋ Add Icon
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Refund Card Colors">
            <p className={styles.fieldHint}>Colors for each policy card (cycles in order)</p>
            <div>
              {refundColors.map((color, idx) => (
                <div key={idx} className={styles.nestedCard} style={{ marginBottom: "0.5rem" }}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Card {idx + 1} Colors</span>
                    {refundColors.length > 1 && (
                      <button type="button" className={styles.removeNestedBtn} 
                        onClick={() => setRefundColors(refundColors.filter((_, i) => i !== idx))}>
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid3}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Color (hex)</label>
                        <input className={styles.input} value={color.color} placeholder="#3d6000"
                          onChange={(e) => { const n = [...refundColors]; n[idx] = { ...n[idx], color: e.target.value }; setRefundColors(n); }} />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Background</label>
                        <input className={styles.input} value={color.bg} placeholder="rgba(61,96,0,0.07)"
                          onChange={(e) => { const n = [...refundColors]; n[idx] = { ...n[idx], bg: e.target.value }; setRefundColors(n); }} />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Border</label>
                        <input className={styles.input} value={color.border} placeholder="rgba(61,96,0,0.2)"
                          onChange={(e) => { const n = [...refundColors]; n[idx] = { ...n[idx], border: e.target.value }; setRefundColors(n); }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setRefundColors([...refundColors, { color: "#000000", bg: "rgba(0,0,0,0.07)", border: "rgba(0,0,0,0.2)" }])}>
                ＋ Add Color Set
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Refund Trust Strip">
            <p className={styles.fieldHint}>Bottom trust badges with icons and text</p>
            <div>
              {refundTrustItems.map((item, idx) => (
                <div key={idx} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <span className={styles.listNum}>{idx + 1}</span>
                  <div className={styles.inputWrap} style={{ flex: "0 0 80px" }}>
                    <input className={styles.input} value={item.icon} placeholder="📩"
                      onChange={(e) => { const n = [...refundTrustItems]; n[idx] = { ...n[idx], icon: e.target.value }; setRefundTrustItems(n); }} />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input className={styles.input} value={item.text} placeholder="All cancellations must be made via email"
                      onChange={(e) => { const n = [...refundTrustItems]; n[idx] = { ...n[idx], text: e.target.value }; setRefundTrustItems(n); }} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} 
                    onClick={() => { if (refundTrustItems.length > 1) setRefundTrustItems(refundTrustItems.filter((_, i) => i !== idx)); }}
                    disabled={refundTrustItems.length <= 1}>✕</button>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setRefundTrustItems([...refundTrustItems, { icon: "", text: "" }])}>
                ＋ Add Trust Item
              </button>
            </div>
          </SubSec>
        </Sec>
        <D />

        {/* PAGE SETTINGS */}
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
      </div>

      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/kundalini-yoga/kundalini-yoga-teacher-training" className={styles.cancelBtn}>
          ← Cancel
        </Link>
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