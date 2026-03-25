"use client";

import { useState, useRef, useCallback, useEffect, memo, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const isEmpty = (html: string) => html.replace(/<[^>]*>/g, "").trim() === "";

// Stable config factory
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

// Divider
function D() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
      margin: "0.4rem 0 1.8rem",
    }} />
  );
}

// Section wrapper
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

// Field wrapper
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

// Stable Jodit Component
const StableJodit = memo(function StableJodit({
  onSave,
  value,
  ph = "Start typing…",
  h = 200,
  err,
}: {
  onSave: (v: string) => void;
  value?: string;
  ph?: string;
  h?: number;
  err?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const config = useMemo(() => makeConfig(ph, h), [ph, h]);

  const handleChange = useCallback((val: string) => {
    setContent(val);
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);

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
        <JoditEditor config={config} value={content} onChange={handleChange} />
      ) : (
        <div style={{
          height: h, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#faf8f4", border: "1px solid #e8d5b5", borderRadius: 8, color: "#bbb", fontSize: 13,
        }}>
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

// Rich List Item
const RichListItem = memo(function RichListItem({
  id, index, total, onSave, onRemove, value, ph,
}: {
  id: string; index: number; total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  value?: string;
  ph?: string;
}) {
  const [initialized, setInitialized] = useState(false);
  const contentRef = useRef(value || "");

  useEffect(() => {
    if (value && !initialized) {
      contentRef.current = value;
      setInitialized(true);
    }
  }, [value, initialized]);

  const handleSave = useCallback((v: string) => {
    contentRef.current = v;
    onSave(id, v);
  }, [id, onSave]);

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
        <StableJodit onSave={handleSave} value={contentRef.current} ph={ph} h={180} />
      </div>
    </div>
  );
});

// String List
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
            <button
              type="button" className={styles.removeItemBtn}
              onClick={() => onRemove(i)} disabled={items.length <= 1}
            >✕</button>
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

// Single Image Uploader
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

// ========== DYNAMIC LIST MANAGERS ==========

interface AyurvedaCourseItem {
  id: string;
  level: string;
  fee: string;
  days: string;
  cert: string;
  imgUrl?: string;
  imgFile?: File | null;
  imgPreview?: string;
}

const DEFAULT_AYURVEDA_COURSES: AyurvedaCourseItem[] = [
  {
    id: "ac1",
    level: "Beginner",
    fee: "405 USD",
    days: "7 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "ac2",
    level: "Intermediate",
    fee: "800 USD",
    days: "15 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "ac3",
    level: "Advance",
    fee: "1000 USD",
    days: "20 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
];

function AyurvedaCoursesManager({ items, onChange }: { items: AyurvedaCourseItem[]; onChange: (items: AyurvedaCourseItem[]) => void }) {
  const update = (id: string, field: keyof AyurvedaCourseItem, value: any) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    const newId = `ac-${Date.now()}`;
    onChange([...items, { id: newId, level: "", fee: "", days: "", cert: "Ayurveda Experience Certificate", imgUrl: "", imgPreview: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Ayurveda {item.level || "New"} Course</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Level</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.level} placeholder="Beginner / Intermediate / Advance"
                    onChange={(e) => update(item.id, "level", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Fee</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.fee} placeholder="405 USD"
                    onChange={(e) => update(item.id, "fee", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Duration</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.days} placeholder="7 Days"
                    onChange={(e) => update(item.id, "days", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certification</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.cert} placeholder="Ayurveda Experience Certificate"
                    onChange={(e) => update(item.id, "cert", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Course Image URL</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.imgUrl || ""} placeholder="https://example.com/image.jpg"
                  onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Course Image</label>
              <SingleImg
                preview={item.imgPreview || ""}
                badge="Course"
                hint="JPG/PNG/WEBP · Recommended 600×400px"
                error=""
                onSelect={(f, p) => {
                  update(item.id, "imgFile", f);
                  update(item.id, "imgPreview", p);
                  update(item.id, "imgUrl", "");
                }}
                onRemove={() => {
                  update(item.id, "imgFile", null);
                  update(item.id, "imgPreview", "");
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Ayurveda Course</button>
    </div>
  );
}

interface PanchaKarmaCourseItem {
  id: string;
  level: string;
  fee: string;
  days: string;
  cert: string;
  imgUrl?: string;
  imgFile?: File | null;
  imgPreview?: string;
}

const DEFAULT_PANCHAKARMA_COURSES: PanchaKarmaCourseItem[] = [
  {
    id: "pk1",
    level: "Beginner",
    fee: "330 USD",
    days: "7 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "pk2",
    level: "Intermediate",
    fee: "470 USD",
    days: "10 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "pk3",
    level: "Advance",
    fee: "653 USD",
    days: "14 Days",
    cert: "Ayurveda Experience Certificate",
    imgUrl: "",
    imgPreview: "",
  },
];

function PanchaKarmaCoursesManager({ items, onChange }: { items: PanchaKarmaCourseItem[]; onChange: (items: PanchaKarmaCourseItem[]) => void }) {
  const update = (id: string, field: keyof PanchaKarmaCourseItem, value: any) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    const newId = `pk-${Date.now()}`;
    onChange([...items, { id: newId, level: "", fee: "", days: "", cert: "Ayurveda Experience Certificate", imgUrl: "", imgPreview: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Panchakarma {item.level || "New"} Course</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Level</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.level} placeholder="Beginner / Intermediate / Advance"
                    onChange={(e) => update(item.id, "level", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Fee</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.fee} placeholder="330 USD"
                    onChange={(e) => update(item.id, "fee", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Duration</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.days} placeholder="7 Days"
                    onChange={(e) => update(item.id, "days", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certification</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.cert} placeholder="Ayurveda Experience Certificate"
                    onChange={(e) => update(item.id, "cert", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Course Image URL</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.imgUrl || ""} placeholder="https://example.com/image.jpg"
                  onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Course Image</label>
              <SingleImg
                preview={item.imgPreview || ""}
                badge="Course"
                hint="JPG/PNG/WEBP · Recommended 600×400px"
                error=""
                onSelect={(f, p) => {
                  update(item.id, "imgFile", f);
                  update(item.id, "imgPreview", p);
                  update(item.id, "imgUrl", "");
                }}
                onRemove={() => {
                  update(item.id, "imgFile", null);
                  update(item.id, "imgPreview", "");
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Panchakarma Course</button>
    </div>
  );
}

interface TherapyItem {
  id: string;
  num: string;
  name: string;
  desc: string;
  icon: string;
}

const DEFAULT_THERAPIES: TherapyItem[] = [
  { id: "t1", num: "1", name: "Abhyanga", desc: "A herbal oil massage designed to deeply penetrate the skin...", icon: "🌿" },
  { id: "t2", num: "—", name: "Shirodhara", desc: "Administered gently and methodically by pouring warm herbalized oil over the forehead...", icon: "🫙" },
  { id: "t3", num: "2", name: "Garshana", desc: "A kind of treatment which consists of a dry lymphatic skin...", icon: "✋" },
];

function TherapiesManager({ items, onChange }: { items: TherapyItem[]; onChange: (items: TherapyItem[]) => void }) {
  const update = (id: string, field: keyof TherapyItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    const newId = `th-${Date.now()}`;
    onChange([...items, { id: newId, num: String(items.length + 1), name: "", desc: "", icon: "🌿" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Therapy: {item.name || "New"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Number/Order</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.num} placeholder="1"
                    onChange={(e) => update(item.id, "num", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Icon Emoji</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.icon} placeholder="🌿"
                    onChange={(e) => update(item.id, "icon", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Therapy Name</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.name} placeholder="Abhyanga"
                    onChange={(e) => update(item.id, "name", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Therapy</button>
    </div>
  );
}

interface DoshaItem {
  id: string;
  name: string;
  elements: string;
  symbol: string;
  desc: string;
}

const DEFAULT_DOSHAS: DoshaItem[] = [
  { id: "d1", name: "Vata", elements: "Air & Ether", symbol: "🌬️", desc: "Governs movement, breathing, circulation and the nervous system." },
  { id: "d2", name: "Pitta", elements: "Fire & Water", symbol: "🔥", desc: "Governs digestion, metabolism and energy production." },
  { id: "d3", name: "Kapha", elements: "Water & Earth", symbol: "🌊", desc: "Governs structure, lubrication and growth." },
];

function DoshasManager({ items, onChange }: { items: DoshaItem[]; onChange: (items: DoshaItem[]) => void }) {
  const update = (id: string, field: keyof DoshaItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    const newId = `d-${Date.now()}`;
    onChange([...items, { id: newId, name: "", elements: "", symbol: "🌿", desc: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Dosha: {item.name || "New"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Dosha Name</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.name} placeholder="Vata"
                    onChange={(e) => update(item.id, "name", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Elements</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.elements} placeholder="Air & Ether"
                    onChange={(e) => update(item.id, "elements", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Symbol Emoji</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.symbol} placeholder="🌬️"
                    onChange={(e) => update(item.id, "symbol", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={2} value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Dosha</button>
    </div>
  );
}

interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
}

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "7:00", activity: "Hatha yoga asana class" },
  { id: "s2", time: "8:15", activity: "Herbal tea with snacks" },
  { id: "s3", time: "8:30", activity: "Ayurveda practice" },
];

function ScheduleManager({ items, onChange }: { items: ScheduleItem[]; onChange: (items: ScheduleItem[]) => void }) {
  const update = (id: string, field: keyof ScheduleItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    onChange([...items, { id: `s-${Date.now()}`, time: "", activity: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Schedule Item</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Time</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.time} placeholder="7:00"
                    onChange={(e) => update(item.id, "time", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Activity</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.activity} placeholder="Hatha yoga asana class"
                    onChange={(e) => update(item.id, "activity", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Schedule Item</button>
    </div>
  );
}

interface YogaPricingItem {
  id: string;
  hrs: string;
  title: string;
  price: string;
  note: string;
}

const DEFAULT_YOGA_PRICING: YogaPricingItem[] = [
  { id: "yp1", hrs: "200", title: "200 hour yoga ttc in India", price: "950 USD", note: "Accommodation Shared by two & Meals 100 USD per week" },
  { id: "yp2", hrs: "300", title: "300 hour yoga ttc in India", price: "1250 USD", note: "Accommodation Shared by two & Meal 100 USD per week" },
  { id: "yp3", hrs: "500", title: "500 hour yoga ttc in India", price: "2200 USD", note: "Accommodation Shared by two & Meal 100 USD per week" },
];

function YogaPricingManager({ items, onChange }: { items: YogaPricingItem[]; onChange: (items: YogaPricingItem[]) => void }) {
  const update = (id: string, field: keyof YogaPricingItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    onChange([...items, { id: `yp-${Date.now()}`, hrs: "", title: "", price: "", note: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Yoga Pricing</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Hours</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.hrs} placeholder="200"
                    onChange={(e) => update(item.id, "hrs", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Title</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.title} placeholder="200 hour yoga ttc in India"
                    onChange={(e) => update(item.id, "title", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Price</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.price} placeholder="950 USD"
                    onChange={(e) => update(item.id, "price", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Note</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.note} placeholder="Accommodation Shared..."
                    onChange={(e) => update(item.id, "note", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Yoga Pricing</button>
    </div>
  );
}

interface MassageTypeItem {
  id: string;
  num: string;
  name: string;
  desc: string;
}

const DEFAULT_MASSAGE_TYPES: MassageTypeItem[] = [
  { id: "mt1", num: "1", name: "Ayurvedic Massage", desc: "This type of massage starts with a head massage, shoulder massage, special back massage, massage of feet, hand massage followed by face massage in the end. Ayurveda Massage in Rishikesh includes a great variety of strokes/touches that are given all kinds of people who suffer from single or all 3 kinds of dosha namely 'Vata,' 'Pitta' and 'Kapha.' People with 'Vata' dosha receive fewer strokes and less pressure, people with 'Pitta' dosha are given medium pressure and medium strokes while people with 'Kapha' dosha are given fuller strokes and good pressure." }
];

function MassageTypesManager({ items, onChange }: { items: MassageTypeItem[]; onChange: (items: MassageTypeItem[]) => void }) {
  const update = (id: string, field: keyof MassageTypeItem, value: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const add = () => {
    const newId = `mt-${Date.now()}`;
    onChange([...items, { id: newId, num: String(items.length + 1), name: "", desc: "" }]);
  };
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(i => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Massage Type: {item.name || "New"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Number</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.num} onChange={(e) => update(item.id, "num", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Name</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.name} placeholder="Ayurvedic Massage"
                    onChange={(e) => update(item.id, "name", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={6} value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Massage Type</button>
    </div>
  );
}

// ========== MAIN FORM COMPONENT ==========

interface FormData {
  slug: string;
  status: "Active" | "Inactive";
  pageTitleH1: string;
  heroImgAlt: string;
  introSuperLabel: string;
  introTitle: string;
  spaWelcomeText: string;
  doshasTitle: string;
  doshasSuperLabel: string;
  doshasDescription: string;
  coursesSectionTitle: string;
  coursesSuperLabel: string;
  ayurvedaCoursesInIndiaHeading: string;
  ayurvedaCoursesInIndiaDescription: string;
  panchakarmaHeading: string;
  panchakarmaDescription: string;
  panchakarmaBeginnerLevel: string;
  panchakarmaBeginnerFee: string;
  panchakarmaBeginnerDays: string;
  panchakarmaBeginnerCert: string;
  panchakarmaIntermediateLevel: string;
  panchakarmaIntermediateFee: string;
  panchakarmaIntermediateDays: string;
  panchakarmaIntermediateCert: string;
  panchakarmaAdvanceLevel: string;
  panchakarmaAdvanceFee: string;
  panchakarmaAdvanceDays: string;
  panchakarmaAdvanceCert: string;
  spicesStripTitle: string;
  ayurvedaMassageCoursesHeading: string;
  yogaMassageTrainingHeading: string;
  yogaMassageDuration: string;
  yogaMassageCost: string;
  yogaMassageDates: string;
  spiritualEnvironmentTitle: string;
  spiritualEnvironmentSuperLabel: string;
  spiritualEnvironmentDescription: string;
  pricingSectionTitle: string;
  pricingSuperLabel: string;
  applySuperLabel: string;
  applyTitle: string;
  applyText: string;
  footerTitle: string;
  footerLoc: string;
  footerMail: string;
  footerTag: string;
  registrationAdvanceFee: string;
  registrationText: string;
}

export default function AddEditAyurvedaPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const isEdit = !!pageId && pageId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Images
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  const [spicesStripFile, setSpicesStripFile] = useState<File | null>(null);
  const [spicesStripPrev, setSpicesStripPrev] = useState("");

  const [sunsetFile, setSunsetFile] = useState<File | null>(null);
  const [sunsetPrev, setSunsetPrev] = useState("");

  // Introduction Section Right Image
  const [introRightImageFile, setIntroRightImageFile] = useState<File | null>(null);
  const [introRightImagePrev, setIntroRightImagePrev] = useState("");
  const [introRightImageErr, setIntroRightImageErr] = useState("");

  // Rich text refs
  const introText1Ref = useRef("");
  const introText2Ref = useRef("");
  const introListRef = useRef("");
  const spaBoxTextRef = useRef("");
  const panchakarmaPara1Ref = useRef("");
  const panchakarmaPara2Ref = useRef("");
  const panchakarmaPara3Ref = useRef("");
  const spiritualEnvironmentTextRef = useRef("");
  const registrationBoxTextRef = useRef("");
  const ayurvedaMassageCoursesDescriptionRef = useRef("");
  const yogaMassageTrainingDescriptionRef = useRef("");
  const sunsetDescriptionRef = useRef("");

  // Paragraph arrays
  const [topParaIds, setTopParaIds] = useState<string[]>(["tp1"]);
  const topParaRef = useRef<Record<string, string>>({ tp1: "" });

  const [introParaIds, setIntroParaIds] = useState<string[]>(["ip1"]);
  const introParaRef = useRef<Record<string, string>>({ ip1: "" });

  const [panchakarmaParaIds, setPanchakarmaParaIds] = useState<string[]>(["pp1"]);
  const panchakarmaParaRef = useRef<Record<string, string>>({ pp1: "" });

  const [ayurvedaCoursesInIndiaParaIds, setAyurvedaCoursesInIndiaParaIds] = useState<string[]>(["acip1"]);
  const ayurvedaCoursesInIndiaParaRef = useRef<Record<string, string>>({ acip1: "" });

  const [ayurvedaMassageParaIds, setAyurvedaMassageParaIds] = useState<string[]>(["amp1"]);
  const ayurvedaMassageParaRef = useRef<Record<string, string>>({ amp1: "" });

  const [yogaMassageTrainingParaIds, setYogaMassageTrainingParaIds] = useState<string[]>(["ymtp1"]);
  const yogaMassageTrainingParaRef = useRef<Record<string, string>>({ ymtp1: "" });

  const [sunsetParaIds, setSunsetParaIds] = useState<string[]>(["sp1"]);
  const sunsetParaRef = useRef<Record<string, string>>({ sp1: "" });

  // Dynamic lists
  const [ayurvedaCourses, setAyurvedaCourses] = useState<AyurvedaCourseItem[]>(DEFAULT_AYURVEDA_COURSES);
  const [panchaKarmaCourses, setPanchaKarmaCourses] = useState<PanchaKarmaCourseItem[]>(DEFAULT_PANCHAKARMA_COURSES);
  const [therapies, setTherapies] = useState<TherapyItem[]>(DEFAULT_THERAPIES);
  const [doshas, setDoshas] = useState<DoshaItem[]>(DEFAULT_DOSHAS);
  const [dailySchedule, setDailySchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [syllabus, setSyllabus] = useState<string[]>([
    "Fundamental principle of Ayurveda",
    "Learning Body constitution",
    "Decision about appropriate massage therapies",
    "Practice of Ayurveda oil massage",
    "Learning shiro abhyangam (Head Massage)",
  ]);
  const [included, setIncluded] = useState<string[]>([
    "3 meals, Indian veg.",
    "Two yoga classes",
    "Ayurveda package",
    "Free Wi-Fi",
    "AYM Ayurveda Kit",
  ]);
  const [yogaPricing, setYogaPricing] = useState<YogaPricingItem[]>(DEFAULT_YOGA_PRICING);
  const [massageTypes, setMassageTypes] = useState<MassageTypeItem[]>(DEFAULT_MASSAGE_TYPES);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      slug: "",
      status: "Active",
      pageTitleH1: "Introductory Course in Ayurveda in Rishikesh India",
      heroImgAlt: "Yoga Students Group",
      introSuperLabel: "Ancient Science of Life",
      introTitle: "Introductory Course in Ayurveda in Rishikesh India",
      spaWelcomeText: "Welcome to Ayurveda Spa at AYM Yoga School",
      doshasTitle: "Tridosha — The Three Doshas",
      doshasSuperLabel: "The Three Bio-Energies",
      doshasDescription: "Ayurveda prescribes Panchakarma therapies for cleansing body toxins...",
      coursesSectionTitle: "Ayurveda Courses in Rishikesh",
      coursesSuperLabel: "Programmes",
      ayurvedaCoursesInIndiaHeading: "Ayurveda Courses in India",
      ayurvedaCoursesInIndiaDescription: "AYM Kerala Panchakarma Center in Rishikesh, India has come up with various Ayurveda treatment and massage courses...",
      panchakarmaHeading: "About Panchakarma",
      panchakarmaDescription: "PANCHAKARMA is a set of five karma procedures...",
      panchakarmaBeginnerLevel: "Beginner",
      panchakarmaBeginnerFee: "330 USD",
      panchakarmaBeginnerDays: "7 Days",
      panchakarmaBeginnerCert: "Ayurveda Experience Certificate",
      panchakarmaIntermediateLevel: "Intermediate",
      panchakarmaIntermediateFee: "470 USD",
      panchakarmaIntermediateDays: "10 Days",
      panchakarmaIntermediateCert: "Ayurveda Experience Certificate",
      panchakarmaAdvanceLevel: "Advance",
      panchakarmaAdvanceFee: "653 USD",
      panchakarmaAdvanceDays: "14 Days",
      panchakarmaAdvanceCert: "Ayurveda Experience Certificate",
      spicesStripTitle: "Yoga and Panchakarma Training Course in India",
      ayurvedaMassageCoursesHeading: "Ayurveda Massage Courses Offered at AYM",
      yogaMassageTrainingHeading: "Yoga and Ayurvedic Massage Training in India",
      yogaMassageDuration: "7 – 10 days",
      yogaMassageCost: "28,000 – 40,000 INR",
      yogaMassageDates: "Open every month on 10th",
      spiritualEnvironmentTitle: "Spiritual Environment in Rishikesh",
      spiritualEnvironmentSuperLabel: "Sacred Setting",
      spiritualEnvironmentDescription: "To make the yoga experience eternal and remarkable...",
      pricingSectionTitle: "Details of Price for Different Courses",
      pricingSuperLabel: "Investment",
      applySuperLabel: "Enrolment",
      applyTitle: "How to Apply",
      applyText: "Fill the application form and send it to aymyogaschool@gmail.com",
      footerTitle: "AYM Ayurveda Clinic & Panchakarma Centre",
      footerLoc: "Rishikesh, Uttarakhand, India",
      footerMail: "aymyogaschool@gmail.com",
      footerTag: "5000 Years of Ancient Wisdom · Yoga Alliance Certified · AYM Est. 2001",
      registrationAdvanceFee: "210 US Dollars",
      registrationText: "To book your place in Ayurveda Center in Rishikesh you need to deposit 210 US Dollars advance fee.",
    },
  });

  // Fetch data for edit
  useEffect(() => {
    if (isEdit) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const res = await api.get(`/ayurveda-course/${pageId}`);
          const data = res.data.data;

          // Set form values
          setValue("slug", data.slug);
          setValue("status", data.status);
          setValue("pageTitleH1", data.pageTitleH1);
          setValue("heroImgAlt", data.heroImgAlt);
          setValue("introSuperLabel", data.introSuperLabel);
          setValue("introTitle", data.introTitle);
          setValue("spaWelcomeText", data.spaWelcomeText);
          setValue("doshasTitle", data.doshasTitle);
          setValue("doshasSuperLabel", data.doshasSuperLabel);
          setValue("doshasDescription", data.doshasDescription);
          setValue("coursesSectionTitle", data.coursesSectionTitle);
          setValue("coursesSuperLabel", data.coursesSuperLabel);
          setValue("ayurvedaCoursesInIndiaHeading", data.ayurvedaCoursesInIndiaHeading);
          setValue("ayurvedaCoursesInIndiaDescription", data.ayurvedaCoursesInIndiaDescription);
          setValue("panchakarmaHeading", data.panchakarmaHeading);
          setValue("panchakarmaDescription", data.panchakarmaDescription);
          setValue("panchakarmaBeginnerLevel", data.panchakarmaBeginnerLevel);
          setValue("panchakarmaBeginnerFee", data.panchakarmaBeginnerFee);
          setValue("panchakarmaBeginnerDays", data.panchakarmaBeginnerDays);
          setValue("panchakarmaBeginnerCert", data.panchakarmaBeginnerCert);
          setValue("panchakarmaIntermediateLevel", data.panchakarmaIntermediateLevel);
          setValue("panchakarmaIntermediateFee", data.panchakarmaIntermediateFee);
          setValue("panchakarmaIntermediateDays", data.panchakarmaIntermediateDays);
          setValue("panchakarmaIntermediateCert", data.panchakarmaIntermediateCert);
          setValue("panchakarmaAdvanceLevel", data.panchakarmaAdvanceLevel);
          setValue("panchakarmaAdvanceFee", data.panchakarmaAdvanceFee);
          setValue("panchakarmaAdvanceDays", data.panchakarmaAdvanceDays);
          setValue("panchakarmaAdvanceCert", data.panchakarmaAdvanceCert);
          setValue("spicesStripTitle", data.spicesStripTitle);
          setValue("ayurvedaMassageCoursesHeading", data.ayurvedaMassageCoursesHeading);
          setValue("yogaMassageTrainingHeading", data.yogaMassageTrainingHeading);
          setValue("yogaMassageDuration", data.yogaMassageDuration);
          setValue("yogaMassageCost", data.yogaMassageCost);
          setValue("yogaMassageDates", data.yogaMassageDates);
          setValue("spiritualEnvironmentTitle", data.spiritualEnvironmentTitle);
          setValue("spiritualEnvironmentSuperLabel", data.spiritualEnvironmentSuperLabel);
          setValue("spiritualEnvironmentDescription", data.spiritualEnvironmentDescription);
          setValue("pricingSectionTitle", data.pricingSectionTitle);
          setValue("pricingSuperLabel", data.pricingSuperLabel);
          setValue("applySuperLabel", data.applySuperLabel);
          setValue("applyTitle", data.applyTitle);
          setValue("applyText", data.applyText);
          setValue("footerTitle", data.footerTitle);
          setValue("footerLoc", data.footerLoc);
          setValue("footerMail", data.footerMail);
          setValue("footerTag", data.footerTag);
          setValue("registrationAdvanceFee", data.registrationAdvanceFee);
          setValue("registrationText", data.registrationText);

          // Set rich text content
          introText1Ref.current = data.introText1 || "";
          introText2Ref.current = data.introText2 || "";
          introListRef.current = data.introList || "";
          spaBoxTextRef.current = data.spaBoxText || "";
          panchakarmaPara1Ref.current = data.panchakarmaPara1 || "";
          panchakarmaPara2Ref.current = data.panchakarmaPara2 || "";
          panchakarmaPara3Ref.current = data.panchakarmaPara3 || "";
          spiritualEnvironmentTextRef.current = data.spiritualEnvironmentText || "";
          registrationBoxTextRef.current = data.registrationBoxText || "";
          ayurvedaMassageCoursesDescriptionRef.current = data.ayurvedaMassageCoursesDescription || "";
          yogaMassageTrainingDescriptionRef.current = data.yogaMassageTrainingDescription || "";
          sunsetDescriptionRef.current = data.sunsetDescription || "";

          // Set images
          if (data.heroImage) setHeroPrev(data.heroImage);
          if (data.spicesStripImage) setSpicesStripPrev(data.spicesStripImage);
          if (data.sunsetImage) setSunsetPrev(data.sunsetImage);
          if (data.introRightImage) setIntroRightImagePrev(data.introRightImage);

          // Set paragraphs
          if (data.topParagraphs) {
            const newIds: string[] = [];
            data.topParagraphs.forEach((p: string, i: number) => {
              const id = `tp${i}`;
              newIds.push(id);
              topParaRef.current[id] = p;
            });
            setTopParaIds(newIds);
          }

          if (data.introParagraphs) {
            const newIds: string[] = [];
            data.introParagraphs.forEach((p: string, i: number) => {
              const id = `ip${i}`;
              newIds.push(id);
              introParaRef.current[id] = p;
            });
            setIntroParaIds(newIds);
          }

          if (data.panchakarmaParagraphs) {
            const newIds: string[] = [];
            data.panchakarmaParagraphs.forEach((p: string, i: number) => {
              const id = `pp${i}`;
              newIds.push(id);
              panchakarmaParaRef.current[id] = p;
            });
            setPanchakarmaParaIds(newIds);
          }

          if (data.ayurvedaCoursesInIndiaParagraphs) {
            const newIds: string[] = [];
            data.ayurvedaCoursesInIndiaParagraphs.forEach((p: string, i: number) => {
              const id = `acip${i}`;
              newIds.push(id);
              ayurvedaCoursesInIndiaParaRef.current[id] = p;
            });
            setAyurvedaCoursesInIndiaParaIds(newIds);
          }

          if (data.ayurvedaMassageParagraphs) {
            const newIds: string[] = [];
            data.ayurvedaMassageParagraphs.forEach((p: string, i: number) => {
              const id = `amp${i}`;
              newIds.push(id);
              ayurvedaMassageParaRef.current[id] = p;
            });
            setAyurvedaMassageParaIds(newIds);
          }

          if (data.yogaMassageTrainingParagraphs) {
            const newIds: string[] = [];
            data.yogaMassageTrainingParagraphs.forEach((p: string, i: number) => {
              const id = `ymtp${i}`;
              newIds.push(id);
              yogaMassageTrainingParaRef.current[id] = p;
            });
            setYogaMassageTrainingParaIds(newIds);
          }

          if (data.sunsetParagraphs) {
            const newIds: string[] = [];
            data.sunsetParagraphs.forEach((p: string, i: number) => {
              const id = `sp${i}`;
              newIds.push(id);
              sunsetParaRef.current[id] = p;
            });
            setSunsetParaIds(newIds);
          }

          // Set dynamic lists
          if (data.ayurvedaCourses) setAyurvedaCourses(data.ayurvedaCourses);
          if (data.panchaKarmaCourses) setPanchaKarmaCourses(data.panchaKarmaCourses);
          if (data.therapies) setTherapies(data.therapies);
          if (data.doshas) setDoshas(data.doshas);
          if (data.dailySchedule) setDailySchedule(data.dailySchedule);
          if (data.syllabus) setSyllabus(data.syllabus);
          if (data.included) setIncluded(data.included);
          if (data.yogaPricing) setYogaPricing(data.yogaPricing);
          if (data.massageTypes) setMassageTypes(data.massageTypes);
        } catch (error) {
          toast.error("Failed to load page data");
          router.push("/admin/ayurveda-course/list");
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [isEdit, pageId, router, setValue]);

  // Para handlers
  const addTopPara = useCallback(() => {
    const id = `tp-${Date.now()}`;
    topParaRef.current[id] = "";
    setTopParaIds(p => [...p, id]);
  }, []);
  const removeTopPara = useCallback((id: string) => {
    delete topParaRef.current[id];
    setTopParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurTopPara = useCallback((id: string, v: string) => {
    topParaRef.current[id] = v;
  }, []);

  const addIntroPara = useCallback(() => {
    const id = `ip-${Date.now()}`;
    introParaRef.current[id] = "";
    setIntroParaIds(p => [...p, id]);
  }, []);
  const removeIntroPara = useCallback((id: string) => {
    delete introParaRef.current[id];
    setIntroParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurIntroPara = useCallback((id: string, v: string) => {
    introParaRef.current[id] = v;
  }, []);

  const addPanchakarmaPara = useCallback(() => {
    const id = `pp-${Date.now()}`;
    panchakarmaParaRef.current[id] = "";
    setPanchakarmaParaIds(p => [...p, id]);
  }, []);
  const removePanchakarmaPara = useCallback((id: string) => {
    delete panchakarmaParaRef.current[id];
    setPanchakarmaParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurPanchakarmaPara = useCallback((id: string, v: string) => {
    panchakarmaParaRef.current[id] = v;
  }, []);

  const addAyurvedaCoursesInIndiaPara = useCallback(() => {
    const id = `acip-${Date.now()}`;
    ayurvedaCoursesInIndiaParaRef.current[id] = "";
    setAyurvedaCoursesInIndiaParaIds(p => [...p, id]);
  }, []);
  const removeAyurvedaCoursesInIndiaPara = useCallback((id: string) => {
    delete ayurvedaCoursesInIndiaParaRef.current[id];
    setAyurvedaCoursesInIndiaParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurAyurvedaCoursesInIndiaPara = useCallback((id: string, v: string) => {
    ayurvedaCoursesInIndiaParaRef.current[id] = v;
  }, []);

  const addAyurvedaMassagePara = useCallback(() => {
    const id = `amp-${Date.now()}`;
    ayurvedaMassageParaRef.current[id] = "";
    setAyurvedaMassageParaIds(p => [...p, id]);
  }, []);
  const removeAyurvedaMassagePara = useCallback((id: string) => {
    delete ayurvedaMassageParaRef.current[id];
    setAyurvedaMassageParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurAyurvedaMassagePara = useCallback((id: string, v: string) => {
    ayurvedaMassageParaRef.current[id] = v;
  }, []);

  const addYogaMassageTrainingPara = useCallback(() => {
    const id = `ymtp-${Date.now()}`;
    yogaMassageTrainingParaRef.current[id] = "";
    setYogaMassageTrainingParaIds(p => [...p, id]);
  }, []);
  const removeYogaMassageTrainingPara = useCallback((id: string) => {
    delete yogaMassageTrainingParaRef.current[id];
    setYogaMassageTrainingParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurYogaMassageTrainingPara = useCallback((id: string, v: string) => {
    yogaMassageTrainingParaRef.current[id] = v;
  }, []);

  const addSunsetPara = useCallback(() => {
    const id = `sp-${Date.now()}`;
    sunsetParaRef.current[id] = "";
    setSunsetParaIds(p => [...p, id]);
  }, []);
  const removeSunsetPara = useCallback((id: string) => {
    delete sunsetParaRef.current[id];
    setSunsetParaIds(p => p.filter(x => x !== id));
  }, []);
  const blurSunsetPara = useCallback((id: string, v: string) => {
    sunsetParaRef.current[id] = v;
  }, []);

  // String list handlers
  const addSyllabus = useCallback(() => setSyllabus(p => [...p, ""]), []);
  const updateSyllabus = useCallback((i: number, v: string) => {
    const newItems = [...syllabus];
    newItems[i] = v;
    setSyllabus(newItems);
  }, [syllabus]);
  const removeSyllabus = useCallback((i: number) => {
    if (syllabus.length <= 1) return;
    setSyllabus(p => p.filter((_, idx) => idx !== i));
  }, [syllabus]);

  const addIncluded = useCallback(() => setIncluded(p => [...p, ""]), []);
  const updateIncluded = useCallback((i: number, v: string) => {
    const newItems = [...included];
    newItems[i] = v;
    setIncluded(newItems);
  }, [included]);
  const removeIncluded = useCallback((i: number) => {
    if (included.length <= 1) return;
    setIncluded(p => p.filter((_, idx) => idx !== i));
  }, [included]);

  const onSubmit = async (data: FormData) => {
    let hasErr = false;
    if (!heroFile && !heroPrev) { setHeroErr("Hero image is required"); hasErr = true; }
    if (hasErr) return;

    try {
      setIsSubmitting(true);
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      // Rich text fields
      fd.append("introText1", introText1Ref.current);
      fd.append("introText2", introText2Ref.current);
      fd.append("introList", introListRef.current);
      fd.append("spaBoxText", spaBoxTextRef.current);
      fd.append("panchakarmaPara1", panchakarmaPara1Ref.current);
      fd.append("panchakarmaPara2", panchakarmaPara2Ref.current);
      fd.append("panchakarmaPara3", panchakarmaPara3Ref.current);
      fd.append("spiritualEnvironmentText", spiritualEnvironmentTextRef.current);
      fd.append("registrationBoxText", registrationBoxTextRef.current);
      fd.append("ayurvedaMassageCoursesDescription", ayurvedaMassageCoursesDescriptionRef.current);
      fd.append("yogaMassageTrainingDescription", yogaMassageTrainingDescriptionRef.current);
      fd.append("sunsetDescription", sunsetDescriptionRef.current);

      // Paragraph arrays
      topParaIds.forEach((id, i) => fd.append(`topParagraphs[${i}]`, topParaRef.current[id] || ""));
      introParaIds.forEach((id, i) => fd.append(`introParagraphs[${i}]`, introParaRef.current[id] || ""));
      panchakarmaParaIds.forEach((id, i) => fd.append(`panchakarmaParagraphs[${i}]`, panchakarmaParaRef.current[id] || ""));
      ayurvedaCoursesInIndiaParaIds.forEach((id, i) => fd.append(`ayurvedaCoursesInIndiaParagraphs[${i}]`, ayurvedaCoursesInIndiaParaRef.current[id] || ""));
      ayurvedaMassageParaIds.forEach((id, i) => fd.append(`ayurvedaMassageParagraphs[${i}]`, ayurvedaMassageParaRef.current[id] || ""));
      yogaMassageTrainingParaIds.forEach((id, i) => fd.append(`yogaMassageTrainingParagraphs[${i}]`, yogaMassageTrainingParaRef.current[id] || ""));
      sunsetParaIds.forEach((id, i) => fd.append(`sunsetParagraphs[${i}]`, sunsetParaRef.current[id] || ""));

      // Dynamic lists - Prepare course data with image files
      const ayurvedaCoursesWithImages = ayurvedaCourses.map(course => {
        const { imgFile, imgPreview, ...rest } = course;
        return rest;
      });

      const panchaKarmaCoursesWithImages = panchaKarmaCourses.map(course => {
        const { imgFile, imgPreview, ...rest } = course;
        return rest;
      });

      fd.append("ayurvedaCourses", JSON.stringify(ayurvedaCoursesWithImages));
      fd.append("panchaKarmaCourses", JSON.stringify(panchaKarmaCoursesWithImages));
      fd.append("therapies", JSON.stringify(therapies));
      fd.append("doshas", JSON.stringify(doshas));
      fd.append("dailySchedule", JSON.stringify(dailySchedule));
      fd.append("syllabus", JSON.stringify(syllabus));
      fd.append("included", JSON.stringify(included));
      fd.append("yogaPricing", JSON.stringify(yogaPricing));
      fd.append("massageTypes", JSON.stringify(massageTypes));

      // Append Ayurveda course image files
      ayurvedaCourses.forEach((course, idx) => {
        if (course.imgFile) {
          fd.append(`ayurvedaCourseImage_${idx}`, course.imgFile);
        }
      });

      // Append Panchakarma course image files
      panchaKarmaCourses.forEach((course, idx) => {
        if (course.imgFile) {
          fd.append(`panchaKarmaCourseImage_${idx}`, course.imgFile);
        }
      });

      // Images
      if (heroFile) fd.append("heroImage", heroFile);
      if (spicesStripFile) fd.append("spicesStripImage", spicesStripFile);
      if (sunsetFile) fd.append("sunsetImage", sunsetFile);
      if (introRightImageFile) fd.append("introRightImage", introRightImageFile);

      if (isEdit) {
        fd.append("_id", pageId);
        await api.put(`/ayurveda-course/update/${pageId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page updated successfully");
      } else {
        await api.post("/ayurveda-course/create", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page created successfully");
      }

      setSubmitted(true);
      setTimeout(() => router.push("/admin/ayurveda-course/list"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.spinner} />
        <span>Loading page data…</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Ayurveda Page {isEdit ? "Updated" : "Saved"}!</h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/ayurveda-course/list")}>
          Ayurveda Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit Ayurveda Course Page" : "Add New Ayurveda Course Page"}</h1>
          <p className={styles.pageSubtitle}>Hero · Introduction · Doshas · Courses · Therapies · Schedule · Pricing · CTA</p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span>
        <div className={styles.ornamentLine} />
        <span>ॐ</span>
        <div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>
        {/* ========== HERO SECTION ========== */}
        <Sec title="Hero Section">
          <F label="Page Main H1 Heading" req>
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageTitleH1", { required: "Page title is required" })} />
            </div>
            {errors.pageTitleH1 && <p className={styles.errorMsg}>⚠ {errors.pageTitleH1.message}</p>}
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px" error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }} />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Students Group" {...register("heroImgAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ========== INTRODUCTION SECTION ========== */}
        <Sec title="Introduction Section" badge="Ancient Science of Life">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introSuperLabel")} />
            </div>
          </F>
          <F label="Introduction Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introTitle")} />
            </div>
          </F>
          <F label="Introduction Text Paragraph 1">
            <StableJodit onSave={(v) => { introText1Ref.current = v; }} value={introText1Ref.current} h={150} />
          </F>
          <F label="Introduction Text Paragraph 2">
            <StableJodit onSave={(v) => { introText2Ref.current = v; }} value={introText2Ref.current} h={150} />
          </F>
          <F label="Introduction List Items (HTML)">
            <StableJodit onSave={(v) => { introListRef.current = v; }} value={introListRef.current} ph="<li>How to bring harmony between nature and body</li>" h={120} />
          </F>
          <F label="Introduction Right Side Image" hint="Recommended 600×500px">
            <SingleImg preview={introRightImagePrev} badge="Intro Image" hint="JPG/PNG/WEBP · 600×500px" error={introRightImageErr}
              onSelect={(f, p) => { setIntroRightImageFile(f); setIntroRightImagePrev(p); setIntroRightImageErr(""); }}
              onRemove={() => { setIntroRightImageFile(null); setIntroRightImagePrev(""); }} />
          </F>
          <F label="Additional Introduction Paragraphs">
            {introParaIds.map((id, i) => (
              <RichListItem
                key={id} id={id} index={i} total={introParaIds.length}
                onSave={blurIntroPara} onRemove={removeIntroPara}
                value={introParaRef.current[id]}
                ph="Additional information about Ayurveda..."
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addIntroPara}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ========== SPA WELCOME BOX ========== */}
        <Sec title="Spa Welcome Box">
          <F label="Spa Welcome Text">
            <div className={styles.inputWrap}>
              <textarea className={`${styles.input} ${styles.textarea}`} rows={3} {...register("spaWelcomeText")} />
            </div>
          </F>
          <F label="Spa Box Description (Rich Text)">
            <StableJodit onSave={(v) => { spaBoxTextRef.current = v; }} value={spaBoxTextRef.current} h={150} />
          </F>
        </Sec>
        <D />

        {/* ========== DOSHAS SECTION ========== */}
        <Sec title="Doshas Section" badge="Tridosha">
          <F label="Doshas Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("doshasSuperLabel")} />
            </div>
          </F>
          <F label="Doshas Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("doshasTitle")} />
            </div>
          </F>
          <F label="Doshas Description">
            <StableJodit onSave={(v) => { setValue("doshasDescription", v); }} value={register("doshasDescription").value} h={100} />
          </F>
          <DoshasManager items={doshas} onChange={setDoshas} />
        </Sec>
        <D />

        {/* ========== COURSES SECTION ========== */}
        <Sec title="Courses Section" badge="Ayurveda & Panchakarma">
          <F label="Courses Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("coursesSuperLabel")} />
            </div>
          </F>
          <F label="Courses Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("coursesSectionTitle")} />
            </div>
          </F>
          <F label="Ayurveda Courses (with Image Upload)">
            <AyurvedaCoursesManager items={ayurvedaCourses} onChange={setAyurvedaCourses} />
          </F>
          <F label="Panchakarma Courses (with Image Upload)">
            <PanchaKarmaCoursesManager items={panchaKarmaCourses} onChange={setPanchaKarmaCourses} />
          </F>
        </Sec>
        <D />

     
        <D />

        {/* ========== PANCHAKARMA SECTION ========== */}
        <Sec title="Panchakarma Section" badge="About Panchakarma">
          <F label="Ayurveda Courses in India Heading">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("ayurvedaCoursesInIndiaHeading")} />
            </div>
          </F>
          <F label="Panchakarma Heading">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("panchakarmaHeading")} />
            </div>
          </F>
           <F label="Panchakarma Main Description">
            <StableJodit onSave={(v) => { panchakarmaPara1Ref.current = v; }} value={panchakarmaPara1Ref.current} h={150} />
          </F>
          <F label="Additional Description Paragraph 1">
            <StableJodit onSave={(v) => { panchakarmaPara2Ref.current = v; }} value={panchakarmaPara2Ref.current} h={120} />
          </F>
          <F label="Additional Description Paragraph 2">
            <StableJodit onSave={(v) => { panchakarmaPara3Ref.current = v; }} value={panchakarmaPara3Ref.current} h={120} />
          </F>
          
       

         
          
          <F label="Therapies">
            <TherapiesManager items={therapies} onChange={setTherapies} />
          </F>
        </Sec>
        <D />

        {/* ========== SPICES STRIP ========== */}
        <Sec title="Spices Image Strip">
          <F label="Strip Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("spicesStripTitle")} />
            </div>
          </F>
          <F label="Spices Strip Image" hint="Recommended 1920×600px">
            <SingleImg preview={spicesStripPrev} badge="Strip" hint="JPG/PNG/WEBP · Full width image"
              onSelect={(f, p) => { setSpicesStripFile(f); setSpicesStripPrev(p); }}
              onRemove={() => { setSpicesStripFile(null); setSpicesStripPrev(""); }} />
          </F>
             {/* Panchakarma Beginner Course Fields */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Panchakarma Beginner Course</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Level</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaBeginnerLevel")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Fee</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaBeginnerFee")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Duration</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaBeginnerDays")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certification</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaBeginnerCert")} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panchakarma Intermediate Course Fields */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Panchakarma Intermediate Course</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Level</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaIntermediateLevel")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Fee</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaIntermediateFee")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Duration</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaIntermediateDays")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certification</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaIntermediateCert")} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panchakarma Advance Course Fields */}
          <div className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
            <div className={styles.nestedCardHeader}>
              <span className={styles.nestedCardNum}>Panchakarma Advance Course</span>
            </div>
            <div className={styles.nestedCardBody}>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Level</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaAdvanceLevel")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Fee</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaAdvanceFee")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Duration</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaAdvanceDays")} />
                  </div>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certification</label>
                  <div className={styles.inputWrap}>
                    <input className={styles.input} {...register("panchakarmaAdvanceCert")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sec>
        <D />

        {/* ========== MASSAGE COURSES SECTION ========== */}
        <Sec title="Ayurveda Massage Courses" badge="Massage Training">
          <F label="Ayurveda Massage Courses Heading">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("ayurvedaMassageCoursesHeading")} />
            </div>
          </F>
          <F label="Ayurveda Massage Courses Description (Rich Text)">
            <StableJodit onSave={(v) => { ayurvedaMassageCoursesDescriptionRef.current = v; }} 
              value={ayurvedaMassageCoursesDescriptionRef.current} h={150} />
          </F>
          <F label="Additional Massage Courses Paragraphs">
            {ayurvedaMassageParaIds.map((id, i) => (
              <RichListItem
                key={id} id={id} index={i} total={ayurvedaMassageParaIds.length}
                onSave={blurAyurvedaMassagePara} onRemove={removeAyurvedaMassagePara}
                value={ayurvedaMassageParaRef.current[id]}
                ph="Additional information about massage courses..."
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addAyurvedaMassagePara}>＋ Add Paragraph</button>
          </F>
          <F label="Massage Types">
            <MassageTypesManager items={massageTypes} onChange={setMassageTypes} />
          </F>
        </Sec>
        <D />

        {/* ========== YOGA & MASSAGE TRAINING SECTION ========== */}
        <Sec title="Yoga & Ayurvedic Massage Training" badge="Training Details">
          <F label="Training Heading">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("yogaMassageTrainingHeading")} />
            </div>
          </F>
          <div className={styles.grid2}>
            <F label="Duration">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("yogaMassageDuration")} />
              </div>
            </F>
            <F label="Cost">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("yogaMassageCost")} />
              </div>
            </F>
            <F label="Dates">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("yogaMassageDates")} />
              </div>
            </F>
          </div>
          <F label="Training Description (Rich Text)">
            <StableJodit onSave={(v) => { yogaMassageTrainingDescriptionRef.current = v; }} 
              value={yogaMassageTrainingDescriptionRef.current} h={150} />
          </F>
          <F label="Additional Training Paragraphs">
            {yogaMassageTrainingParaIds.map((id, i) => (
              <RichListItem
                key={id} id={id} index={i} total={yogaMassageTrainingParaIds.length}
                onSave={blurYogaMassageTrainingPara} onRemove={removeYogaMassageTrainingPara}
                value={yogaMassageTrainingParaRef.current[id]}
                ph="Additional information about training..."
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addYogaMassageTrainingPara}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ========== TRAINING SCHEDULE & SYLLABUS ========== */}
        <Sec title="Training Schedule & Syllabus" badge="Schedule">
          <F label="Daily Schedule">
            <ScheduleManager items={dailySchedule} onChange={setDailySchedule} />
          </F>
          <F label="Syllabus">
            <StrList
              items={syllabus} label="Syllabus Item" ph="Fundamental principle of Ayurveda"
              onAdd={addSyllabus} onRemove={removeSyllabus} onUpdate={updateSyllabus}
            />
          </F>
          <F label="What's Included">
            <StrList
              items={included} label="Included Item" ph="3 meals, Indian veg."
              onAdd={addIncluded} onRemove={removeIncluded} onUpdate={updateIncluded}
            />
          </F>
          <F label="Registration Box Text">
            <StableJodit onSave={(v) => { registrationBoxTextRef.current = v; }} value={registrationBoxTextRef.current} h={120} />
          </F>
          <div className={styles.grid2}>
            <F label="Advance Fee Amount">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("registrationAdvanceFee")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ========== SPIRITUAL ENVIRONMENT ========== */}
        <Sec title="Spiritual Environment">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("spiritualEnvironmentSuperLabel")} />
            </div>
          </F>
          <F label="Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("spiritualEnvironmentTitle")} />
            </div>
          </F>
          <F label="Description">
            <StableJodit onSave={(v) => { spiritualEnvironmentTextRef.current = v; }} value={spiritualEnvironmentTextRef.current} h={150} />
          </F>
          <F label="Sunset/Environment Image" hint="Recommended 1200×800px">
            <SingleImg preview={sunsetPrev} badge="Spiritual" hint="JPG/PNG/WEBP"
              onSelect={(f, p) => { setSunsetFile(f); setSunsetPrev(p); }}
              onRemove={() => { setSunsetFile(null); setSunsetPrev(""); }} />
          </F>
          <F label="Sunset Image Description">
            <StableJodit onSave={(v) => { sunsetDescriptionRef.current = v; }} value={sunsetDescriptionRef.current} h={120} />
          </F>
          <F label="Additional Spiritual Environment Paragraphs">
            {sunsetParaIds.map((id, i) => (
              <RichListItem
                key={id} id={id} index={i} total={sunsetParaIds.length}
                onSave={blurSunsetPara} onRemove={removeSunsetPara}
                value={sunsetParaRef.current[id]}
                ph="Additional information about spiritual environment..."
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={addSunsetPara}>＋ Add Paragraph</button>
          </F>
        </Sec>
        <D />

        {/* ========== PRICING SECTION ========== */}
        <Sec title="Pricing Section" badge="Investment">
          <F label="Pricing Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("pricingSuperLabel")} />
            </div>
          </F>
          <F label="Pricing Section Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("pricingSectionTitle")} />
            </div>
          </F>
          <F label="Yoga TTC Pricing">
            <YogaPricingManager items={yogaPricing} onChange={setYogaPricing} />
          </F>
        </Sec>
        <D />

        {/* ========== HOW TO APPLY SECTION ========== */}
        <Sec title="How to Apply Section" badge="Enrolment">
          <F label="Apply Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("applySuperLabel")} />
            </div>
          </F>
          <F label="Apply Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("applyTitle")} />
            </div>
          </F>
          <F label="Apply Text">
            <StableJodit onSave={(v) => { setValue("applyText", v); }} value={register("applyText").value} h={120} />
          </F>
        </Sec>
        <D />

        {/* ========== FOOTER SECTION ========== */}
        <Sec title="Footer Section">
          <F label="Footer Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("footerTitle")} />
            </div>
          </F>
          <F label="Footer Location">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("footerLoc")} />
            </div>
          </F>
          <F label="Footer Email">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("footerMail")} />
            </div>
          </F>
          <F label="Footer Tag Line">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("footerTag")} />
            </div>
          </F>
        </Sec>
        <D />

       
        <D />

        {/* ========== PAGE SETTINGS ========== */}
        <Sec title="Page Settings">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="ayurveda-course-rishikesh"
                  {...register("slug", { required: "Slug is required" })} />
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
        <Link href="/admin/ayurveda-course/list" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting
            ? (<><span className={styles.spinner} /> Saving…</>)
            : (<><span>✦</span> {isEdit ? "Update" : "Save"} Ayurveda Page</>)
          }
        </button>
      </div>
    </div>
  );
}