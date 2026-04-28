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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
        margin: "0.4rem 0 1.8rem",
      }}
    />
  );
}

function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
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

function Field({ label, hint, req, children }: { label: string; hint?: string; req?: boolean; children: React.ReactNode }) {
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
  const initialValue = useRef(value || "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);

  const handleChange = useCallback((val: string) => {
    onSaveRef.current(val);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`${styles.joditWrap} ${err ? styles.joditError : ""}`} style={{ minHeight: h }}>
      {visible ? (
        <JoditEditor config={config} value={initialValue.current} onChange={handleChange} />
      ) : (
        <div
          style={{
            height: h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#faf8f4",
            border: "1px solid #e8d5b5",
            borderRadius: 8,
            color: "#bbb",
            fontSize: 13,
          }}
        >
          ✦ Scroll to load editor…
        </div>
      )}
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
});

function SingleImg({
  preview,
  badge,
  hint,
  error,
  onSelect,
  onRemove,
  accept = "image/*",
}: {
  preview: string;
  badge?: string;
  hint: string;
  error?: string;
  onSelect: (f: File, p: string) => void;
  onRemove: () => void;
  accept?: string;
}) {
  return (
    <div>
      <div
        className={`${styles.imageUploadZone} ${preview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}
      >
        {!preview ? (
          <>
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onSelect(f, URL.createObjectURL(f));
                  e.target.value = "";
                }
              }}
            />
            <div className={styles.imageUploadPlaceholder}>
              <span className={styles.imageUploadIcon}>🖼️</span>
              <span className={styles.imageUploadText}>Click to Upload</span>
              <span className={styles.imageUploadSub}>{hint}</span>
            </div>
          </>
        ) : (
          <div className={styles.imagePreviewWrap}>
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            {accept === "image/*" ? (
              <img src={preview} alt="" className={styles.imagePreview} />
            ) : (
              <video src={preview} className={styles.imagePreview} controls style={{ objectFit: "cover" }} />
            )}
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input
                type="file"
                accept={accept}
                className={styles.imagePreviewOverlayInput}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onSelect(f, URL.createObjectURL(f));
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <button
              type="button"
              className={styles.removeImageBtn}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
    </div>
  );
}

function StrList({
  items,
  onAdd,
  onRemove,
  onUpdate,
  max = 30,
  ph,
  label,
}: {
  items: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdate: (i: number, v: string) => void;
  max?: number;
  ph?: string;
  label: string;
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
              type="button"
              className={styles.removeItemBtn}
              onClick={() => onRemove(i)}
              disabled={items.length <= 1}
            >
              ✕
            </button>
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

function RichListItem({ id, index, total, onSave, onRemove, value, ph }: { id: string; index: number; total: number; onSave: (id: string, v: string) => void; onRemove: (id: string) => void; value?: string; ph?: string }) {
  const initialValue = useRef(value || "");
  const handleSave = useCallback((v: string) => { onSave(id, v); }, [id, onSave]);
  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => onRemove(id)}>✕ Remove</button>}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit onSave={handleSave} value={initialValue.current} ph={ph} h={180} />
      </div>
    </div>
  );
}

function useParaList(initId: string, initVal = "") {
  const [ids, setIds] = useState<string[]>([initId]);
  const ref = useRef<Record<string, string>>({ [initId]: initVal });
  const add = useCallback(() => { const id = `${initId}-${Date.now()}`; ref.current[id] = ""; setIds((p) => [...p, id]); }, [initId]);
  const remove = useCallback((id: string) => { delete ref.current[id]; setIds((p) => p.filter((x) => x !== id)); }, []);
  const save = useCallback((id: string, v: string) => { ref.current[id] = v; }, []);
  const loadFromArray = useCallback((arr: string[], prefix: string) => { const newIds: string[] = []; arr.forEach((p, i) => { const id = `${prefix}${i}`; newIds.push(id); ref.current[id] = p; }); setIds(newIds); }, []);
  return { ids, ref, add, remove, save, loadFromArray };
}

interface AccredBadgeItem {
  id: string; label: string; imgUrl: string; imgPreview: string; imgFile: File | null;
}

const DEFAULT_ACCRED_BADGES: AccredBadgeItem[] = [
  { id: "ab1", label: "Yoga Alliance USA", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab2", label: "Ministry of AYUSH", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab3", label: "RYS 200", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab4", label: "RYS 300", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab5", label: "RYS 500", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab6", label: "Made in India", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab7", label: "AYUSH Certified", imgUrl: "", imgPreview: "", imgFile: null },
];

function AccredBadgesManager({ items, onChange }: { items: AccredBadgeItem[]; onChange: (v: AccredBadgeItem[]) => void }) {
  const update = useCallback((id: string, field: keyof AccredBadgeItem, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);
  const updateMany = useCallback((id: string, patch: Partial<AccredBadgeItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [items, onChange]);
  const add = () => onChange([...items, { id: `ab-${Date.now()}`, label: "", imgUrl: "", imgPreview: "", imgFile: null }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Badge {idx + 1}: {item.label || "New Badge"}</span>
            {items.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Badge Label</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.label} placeholder="Yoga Alliance USA" onChange={(e) => update(item.id, "label", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image URL (optional)</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.imgUrl} placeholder="https://…" onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Badge Image</label>
              <SingleImg preview={item.imgPreview} badge="Badge" hint="PNG/SVG · 200×200px" error="" onSelect={(f, p) => updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })} onRemove={() => updateMany(item.id, { imgFile: null, imgPreview: "" })} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Badge</button>
    </div>
  );
}

interface CourseCardItem {
  id: string; hours: string; title: string; desc: string; linkLabel: string; href: string; imgUrl: string; imgPreview: string; imgFile: File | null;
}

const DEFAULT_COURSES: CourseCardItem[] = [
  { id: "cc1", hours: "200", title: "200 Hour Yoga Teacher Training Course in India", desc: "", linkLabel: "200 Hour More Information", href: "#", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "cc2", hours: "300", title: "300 Hour Yoga Teacher Training Course in India", desc: "", linkLabel: "300 Hour More Information", href: "#", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "cc3", hours: "500", title: "500 Hour Yoga Teacher Training Course in India", desc: "", linkLabel: "500 Hour More Information", href: "#", imgUrl: "", imgPreview: "", imgFile: null },
];

function CourseCardsManager({ items, onChange }: { items: CourseCardItem[]; onChange: (v: CourseCardItem[]) => void }) {
  const update = useCallback((id: string, field: keyof CourseCardItem, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);
  const updateMany = useCallback((id: string, patch: Partial<CourseCardItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [items, onChange]);
  const add = () => onChange([...items, { id: `cc-${Date.now()}`, hours: "", title: "", desc: "", linkLabel: "More Information", href: "#", imgUrl: "", imgPreview: "", imgFile: null }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>{item.hours ? `${item.hours} Hr Course` : "New Course"}</span>
            {items.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Hours Badge</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.hours} placeholder="200" onChange={(e) => update(item.id, "hours", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Button Link href</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.href} placeholder="/200-hour-yoga-ttc" onChange={(e) => update(item.id, "href", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Course Title</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.title} placeholder="200 Hour Yoga Teacher Training Course in India" onChange={(e) => update(item.id, "title", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Button Label</label>
                <div className={styles.inputWrap}>
                  <input className={styles.input} value={item.linkLabel} placeholder="200 Hour More Information" onChange={(e) => update(item.id, "linkLabel", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Course Description</label>
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={4} value={item.desc} placeholder="Describe the course…" onChange={(e) => update(item.id, "desc", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Course Image URL (optional)</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.imgUrl} placeholder="https://…" onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Course Image</label>
              <SingleImg preview={item.imgPreview} badge="Course" hint="JPG/PNG/WEBP · 400×225px (16:9)" error="" onSelect={(f, p) => updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })} onRemove={() => updateMany(item.id, { imgFile: null, imgPreview: "" })} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Course Card</button>
    </div>
  );
}

interface LocationItem { 
  id: string; 
  name: string; 
  desc: string; 
  image: string; 
  imageAlt: string;
  imgPreview: string;
  imgFile: File | null;
}

const DEFAULT_LOCATIONS: LocationItem[] = [
  { 
    id: "loc1", 
    name: "Rishikesh", 
    desc: "Revered as the world's yoga capital, nestled in the foothills of the Himalayas along the sacred Ganges River.",
    image: "",
    imageAlt: "Yoga Teacher Training in Rishikesh",
    imgPreview: "",
    imgFile: null,
  },
  { 
    id: "loc2", 
    name: "Goa", 
    desc: "A vibrant coastal paradise known for its stunning beaches and lively culture.",
    image: "",
    imageAlt: "Yoga Teacher Training in Goa",
    imgPreview: "",
    imgFile: null,
  },
];

function LocationsManager({ items, onChange }: { items: LocationItem[]; onChange: (v: LocationItem[]) => void }) {
  const update = (id: string, field: keyof LocationItem, value: any) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  
  const updateImage = (id: string, file: File | null, preview: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, imgFile: file, imgPreview: preview, image: "" } : i)));
  };
  
  const add = () => onChange([...items, { 
    id: `loc-${Date.now()}`, 
    name: "", 
    desc: "", 
    image: "", 
    imageAlt: "",
    imgPreview: "", 
    imgFile: null 
  }]);
  
  const remove = (id: string) => { 
    if (items.length <= 1) return; 
    onChange(items.filter((i) => i.id !== id)); 
  };
  
  return (
    <div>
      {items.map((item) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>{item.name || "New Location"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Location Name</label>
                <div className={styles.inputWrap}>
                  <input 
                    className={styles.input} 
                    value={item.name} 
                    placeholder="Rishikesh" 
                    onChange={(e) => update(item.id, "name", e.target.value)} 
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image Alt Text</label>
                <div className={styles.inputWrap}>
                  <input 
                    className={styles.input} 
                    value={item.imageAlt} 
                    placeholder="Yoga Teacher Training in Rishikesh" 
                    onChange={(e) => update(item.id, "imageAlt", e.target.value)} 
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Description</label>
              <div className={styles.inputWrap}>
                <textarea 
                  className={`${styles.input} ${styles.textarea}`} 
                  rows={3} 
                  value={item.desc} 
                  onChange={(e) => update(item.id, "desc", e.target.value)} 
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Location Image</label>
              <SingleImg 
                preview={item.imgPreview} 
                badge="Location" 
                hint="JPG/PNG/WEBP · 600×400px" 
                error="" 
                onSelect={(f, p) => updateImage(item.id, f, p)} 
                onRemove={() => updateImage(item.id, null, "")} 
              />
              {item.image && !item.imgPreview && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                  Current image: {item.image}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Location</button>
    </div>
  );
}

interface QuoteCardItem { id: string; quote: string; imgAlt: string; imgUrl: string; imgPreview: string; imgFile: File | null; }
const DEFAULT_QUOTES: QuoteCardItem[] = [
  { id: "qc1", quote: '"Everyday is a great day for yoga!"', imgAlt: "Yoga practice outdoors Rishikesh", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "qc2", quote: '"Yoga is a mirror to look at ourselves from within"', imgAlt: "Group yoga by the Ganges Rishikesh", imgUrl: "", imgPreview: "", imgFile: null },
];

function QuoteCardsManager({ items, onChange }: { items: QuoteCardItem[]; onChange: (v: QuoteCardItem[]) => void }) {
  const update = useCallback((id: string, field: keyof QuoteCardItem, value: any) => {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }, [items, onChange]);
  const updateMany = useCallback((id: string, patch: Partial<QuoteCardItem>) => {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, [items, onChange]);
  const add = () => onChange([...items, { id: `qc-${Date.now()}`, quote: "", imgAlt: "", imgUrl: "", imgPreview: "", imgFile: null }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((i) => i.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Quote Card {idx + 1}</span>
            {items.length > 1 && <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Quote Text</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.quote} placeholder='"Yoga is a way of life"' onChange={(e) => update(item.id, "quote", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image Alt Text</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.imgAlt} placeholder="Yoga practice outdoors" onChange={(e) => update(item.id, "imgAlt", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Image URL (optional)</label>
              <div className={styles.inputWrap}>
                <input className={styles.input} value={item.imgUrl} placeholder="https://…" onChange={(e) => update(item.id, "imgUrl", e.target.value)} />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Or Upload Quote Image</label>
              <SingleImg preview={item.imgPreview} badge="Quote" hint="JPG/PNG/WEBP · 700×440px (16:10)" error="" onSelect={(f, p) => updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })} onRemove={() => updateMany(item.id, { imgFile: null, imgPreview: "" })} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Quote Card</button>
    </div>
  );
}

interface PageFormValues {
  slug: string; status: "Active" | "Inactive"; heroImgAlt: string; heroTitle: string; heroSubTitle: string; introPara: string;
  rishikeshTitle: string; rishikeshPara: string; goaTitle: string; goaPara: string;
  whoWeAreTitle: string; whoWeArePara: string; yytTitle: string; yytPara: string;
  whyAYMTitle: string; whyAYMPara1: string; whyAYMPara2: string;
  arrivalTitle: string; feeTitle: string;
  mainTitle: string; mediaImageAlt: string; mediaImageCaption: string; videoUrl: string; videoPlaceholderText: string; videoEnabled: boolean;
  ayurvedaCalloutText: string; ayurvedaLinkText: string; ayurvedaLinkUrl: string; benefitsHeading: string; ctaText: string; ctaButtonText: string; ctaButtonUrl: string;
  whoWeAreVideoEnabled: boolean;
  rishikeshImageAlt: string; rishikeshImageBadge: string;
  goaImageAlt: string; goaImageBadge: string;
  whyAYMImageAlt: string; whyAYMImageBadge: string;
}

export default function AddEditYogaTTCIndiaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPrev, setMediaPrev] = useState("");
  
  const [whoWeAreVideoFile, setWhoWeAreVideoFile] = useState<File | null>(null);
  const [whoWeAreVideoPrev, setWhoWeAreVideoPrev] = useState("");
  const [whoWeAreVideoPosterFile, setWhoWeAreVideoPosterFile] = useState<File | null>(null);
  const [whoWeAreVideoPosterPrev, setWhoWeAreVideoPosterPrev] = useState("");
  
  const [rishikeshImageFile, setRishikeshImageFile] = useState<File | null>(null);
  const [rishikeshImagePrev, setRishikeshImagePrev] = useState("");
  const [goaImageFile, setGoaImageFile] = useState<File | null>(null);
  const [goaImagePrev, setGoaImagePrev] = useState("");
  
  const [whyAYMImageFile, setWhyAYMImageFile] = useState<File | null>(null);
  const [whyAYMImagePrev, setWhyAYMImagePrev] = useState("");

  const introParaRef = useRef("");
  const whoWeAreParaRef = useRef("");
  const yytParaRef = useRef("");
  const whyAYMPara1Ref = useRef("");
  const whyAYMPara2Ref = useRef("");
  const whyAYMPara3Ref = useRef("");
  const rishikeshDetailParaRef = useRef("");
  const goaDetailParaRef = useRef("");

  const introParaList = useParaList("ip1");
  const whyAYMParaList = useParaList("wp1");
  const rishikeshParaList = useParaList("rp1");
  const goaParaList = useParaList("gp1");

  const [accredBadges, setAccredBadges] = useState<AccredBadgeItem[]>(DEFAULT_ACCRED_BADGES);
  const [courseCards, setCourseCards] = useState<CourseCardItem[]>(DEFAULT_COURSES);
  const [locations, setLocations] = useState<LocationItem[]>(DEFAULT_LOCATIONS);
  const [quoteCards, setQuoteCards] = useState<QuoteCardItem[]>(DEFAULT_QUOTES);
  
  const [arrivalList, setArrivalList] = useState<string[]>([
    "Day before Start date: Arrival and Rest.",
    "Starting Date: Includes opening ceremony and orientation.",
    "Day-Off: Sunday will be off day.",
    "Last Day: Departure after 2 pm (no extra charge for the last night).",
    "Additional Stay: You are welcome to stay before or after the retreat by paying an additional charge of $20/day, includes all meals.",
  ]);
  
  const [feeList, setFeeList] = useState<string[]>([
    "Accommodation and Food.",
    "Yoga Classes.",
    "Course Materials. (Book, Printed Manual, Notebook and Bag.)",
    "T-shirt",
    "1 Outtour (Local Sightseeing.)",
    "One Ayurvedic Massage",
  ]);

  const [introParagraphs, setIntroParagraphs] = useState<string[]>([
    "Stress and anxiety result from being caught up in a hectic work schedule and rushing around daily. At AYM, we understand that it is hard to remain relaxed and calm with the pressures of today's society, which can leave you feeling drained, lethargic, and depleted. At The Association of Yoga and Meditation, we have strategically designed a one-week detoxing and invigorating programme. A yoga Holiday in India will leave you feeling rejuvenated and energetic. Your body will be more flexible, melting away any tension and stress — you will be ready to take on the world.",
    "AYM is one of the best places to visit if you're looking for a Yoga Retreat. It is among the top yoga holiday centres in India. Your yoga holiday in Rishikesh will give you tremendous, noticeable results in just one week. We have a variety of holiday retreats at AYM, such as Iyengar Yoga, Ashtanga Yoga, and Kundalini Yoga ranging from 7 to 10 days.",
    "These Yoga holidays are for everyone — whether you are a fitness lover, a peace seeker or want an honest, authentic experience that will enhance your overall health. You can expect to sweat, stretch and detoxify, leaving you feeling strong, fresh, and lean.",
    "You will practice many different styles of yoga where you will feel the energy rise within and have lots of fun simultaneously. This holiday is great for meeting like-minded individuals but also perfect if you want some alone time to get to know yourself more."
  ]);
  
  const [benefitsList, setBenefitsList] = useState<string[]>([
    "Peace of mind & clarity", "Relaxation", "Rejuvenation — Mind, Body & Soul",
    "Flexibility", "Strength — Physical & Mental", "Authentic Experience", "Lots of fun",
  ]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PageFormValues>({
    defaultValues: {
      slug: "", status: "Active", heroImgAlt: "Yoga Students Group",
      heroTitle: "YOGA TEACHER TRAINING IN INDIA", heroSubTitle: "AYM YOGA SCHOOL – RISHIKESH, INDIA",
      whoWeAreTitle: "Who We Are", yytTitle: "Yoga Teacher Training in India through AYM Yoga School",
      rishikeshTitle: "Rishikesh", goaTitle: "Goa", whyAYMTitle: "Why AYM for Yoga Teachers Training Course?",
      arrivalTitle: "Arrival & Departure", feeTitle: "Includes in Fee",
      mainTitle: "Yoga Holidays in India / Yoga Vacations in India, Rishikesh at AYM Yoga Holiday Retreats",
      mediaImageAlt: "Stunning View of Rishikesh - AYM Yoga Center",
      mediaImageCaption: "Stunning View of Rishikesh — AYM Yoga Center",
      videoUrl: "", videoPlaceholderText: "Watch: Life at AYM Rishikesh", videoEnabled: false,
      ayurvedaCalloutText: "Many things can be combined with Yoga Holidays in Rishikesh, such as meditation and Ayurveda. Yoga and Ayurveda Spa will enhance your well-being — stimulating your mind and transforming your body. Meditation will calm your mind and body, reducing anxiety and tension. Practising Yoga with Ayurveda will restore your inner vitality and give you a healthy mind, body and soul.",
      ayurvedaLinkText: "Yoga with Ayurveda", ayurvedaLinkUrl: "#",
      benefitsHeading: "The benefits of our Yoga Holiday in Rishikesh :",
      ctaText: "For more detail about yoga holiday packages / vacations in Rishikesh, India.",
      ctaButtonText: "Click Here to See Yoga Holidays Packages", ctaButtonUrl: "#",
      whoWeAreVideoEnabled: false,
      rishikeshImageAlt: "Yoga Teacher Training in Rishikesh",
      rishikeshImageBadge: "Rishikesh, India",
      goaImageAlt: "Yoga Teacher Training in Goa",
      goaImageBadge: "Goa, India",
      whyAYMImageAlt: "Why AYM Yoga School",
      whyAYMImageBadge: "Excellence in Yoga",
    },
  });

  const videoEnabled = watch("videoEnabled");
  const whoWeAreVideoEnabled = watch("whoWeAreVideoEnabled");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/yoga-ttc-india");
        const d = res.data.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);
        const keys: (keyof PageFormValues)[] = [
          "slug", "status", "heroImgAlt", "heroTitle", "heroSubTitle", "whoWeAreTitle", "yytTitle",
          "rishikeshTitle", "goaTitle", "whyAYMTitle", "arrivalTitle", "feeTitle",
          "mainTitle", "mediaImageAlt", "mediaImageCaption", "videoUrl", "videoPlaceholderText", "videoEnabled",
          "ayurvedaCalloutText", "ayurvedaLinkText", "ayurvedaLinkUrl", "benefitsHeading", "ctaText", "ctaButtonText", "ctaButtonUrl",
          "whoWeAreVideoEnabled", "rishikeshImageAlt", "rishikeshImageBadge", "goaImageAlt", "goaImageBadge",
          "whyAYMImageAlt", "whyAYMImageBadge"
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k]); });
        introParaRef.current = d.introPara || "";
        whoWeAreParaRef.current = d.whoWeArePara || "";
        yytParaRef.current = d.yytPara || "";
        whyAYMPara1Ref.current = d.whyAYMPara1 || "";
        whyAYMPara2Ref.current = d.whyAYMPara2 || "";
        whyAYMPara3Ref.current = d.whyAYMPara3 || "";
        rishikeshDetailParaRef.current = d.rishikeshDetailPara || "";
        goaDetailParaRef.current = d.goaDetailPara || "";
        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.mediaImage) setMediaPrev(BASE_URL + d.mediaImage);
        if (d.whoWeAreVideo) setWhoWeAreVideoPrev(BASE_URL + d.whoWeAreVideo);
        if (d.whoWeAreVideoPoster) setWhoWeAreVideoPosterPrev(BASE_URL + d.whoWeAreVideoPoster);
        if (d.rishikeshImage) setRishikeshImagePrev(BASE_URL + d.rishikeshImage);
        if (d.goaImage) setGoaImagePrev(BASE_URL + d.goaImage);
        if (d.whyAYMImage) setWhyAYMImagePrev(BASE_URL + d.whyAYMImage);
        if (d.introParagraphs?.length) setIntroParagraphs(d.introParagraphs);
        if (d.benefitsList?.length) setBenefitsList(d.benefitsList);
        if (d.introParagraphs?.length) introParaList.loadFromArray(d.introParagraphs, "ip");
        if (d.whyAYMParagraphs?.length) whyAYMParaList.loadFromArray(d.whyAYMParagraphs, "wp");
        if (d.rishikeshParagraphs?.length) rishikeshParaList.loadFromArray(d.rishikeshParagraphs, "rp");
        if (d.goaParagraphs?.length) goaParaList.loadFromArray(d.goaParagraphs, "gp");
        if (Array.isArray(d.accredBadges)) setAccredBadges(d.accredBadges.filter(Boolean).map((b: any, i: number) => ({ id: b._id || `ab-${i}`, label: b.label || "", imgUrl: b.imgUrl || "", imgPreview: b.image ? BASE_URL + b.image : "", imgFile: null })));
        if (Array.isArray(d.courseCards)) setCourseCards(d.courseCards.filter(Boolean).map((c: any, i: number) => ({ id: c._id || `cc-${i}`, hours: c.hours || "", title: c.title || "", desc: c.desc || "", linkLabel: c.linkLabel || "", href: c.href || "", imgUrl: c.imgUrl || "", imgPreview: c.image ? BASE_URL + c.image : "", imgFile: null })));
        if (Array.isArray(d.locations)) {
          setLocations(
            d.locations.filter(Boolean).map((loc: any, i: number) => ({
              id: loc._id || `loc-${i}`,
              name: loc.name || "",
              desc: loc.desc || "",
              image: loc.image || "",
              imageAlt: loc.imageAlt || "",
              imgPreview: loc.image ? BASE_URL + loc.image : "",
              imgFile: null,
            }))
          );
        }
        if (Array.isArray(d.quoteCards)) setQuoteCards(d.quoteCards.filter(Boolean).map((q: any, i: number) => ({ id: q._id || `qc-${i}`, quote: q.quote || "", imgAlt: q.imgAlt || "", imgUrl: q.imgUrl || "", imgPreview: q.image ? BASE_URL + q.image : "", imgFile: null })));
        if (d.arrivalList?.length) setArrivalList(d.arrivalList.map((item: string) => item.trim()));
        if (d.feeList?.length) setFeeList(d.feeList.map((item: string) => item.trim()));
      } catch (err) { toast.error("Failed to load"); } finally { setLoadingData(false); }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev && !isEdit) { setHeroErr("Hero image is required"); return; }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();
      Object.entries(data).forEach(([k, v]) => { if (typeof v === "boolean") fd.append(k, String(v)); else fd.append(k, v as string); });
      fd.append("introPara", introParaRef.current);
      fd.append("whoWeArePara", whoWeAreParaRef.current);
      fd.append("yytPara", yytParaRef.current);
      fd.append("whyAYMPara1", whyAYMPara1Ref.current);
      fd.append("whyAYMPara2", whyAYMPara2Ref.current);
      fd.append("whyAYMPara3", whyAYMPara3Ref.current);
      fd.append("rishikeshDetailPara", rishikeshDetailParaRef.current);
      fd.append("goaDetailPara", goaDetailParaRef.current);
      fd.append("introParagraphs", JSON.stringify(introParagraphs.filter(p => p.trim())));
      fd.append("benefitsList", JSON.stringify(benefitsList.filter(b => b.trim())));
      fd.append("introParagraphs", JSON.stringify(introParaList.ids.map((id) => cleanHTML(introParaList.ref.current[id])).filter(Boolean)));
      fd.append("whyAYMParagraphs", JSON.stringify(whyAYMParaList.ids.map((id) => cleanHTML(whyAYMParaList.ref.current[id])).filter(Boolean)));
      fd.append("rishikeshParagraphs", JSON.stringify(rishikeshParaList.ids.map((id) => cleanHTML(rishikeshParaList.ref.current[id])).filter(Boolean)));
      fd.append("goaParagraphs", JSON.stringify(goaParaList.ids.map((id) => cleanHTML(goaParaList.ref.current[id])).filter(Boolean)));
      fd.append("accredBadges", JSON.stringify(accredBadges.map(({ imgFile, imgPreview, ...r }) => r)));
      fd.append("courseCards", JSON.stringify(courseCards.map(({ imgFile, imgPreview, ...r }) => r)));
      fd.append("locations", JSON.stringify(locations.map(({ imgFile, imgPreview, ...rest }) => rest)));
      fd.append("quoteCards", JSON.stringify(quoteCards.map(({ imgFile, imgPreview, ...r }) => r)));
      fd.append("arrivalList", JSON.stringify(arrivalList.map((i) => i.trim()).filter(Boolean)));
      fd.append("feeList", JSON.stringify(feeList.map((i) => i.trim()).filter(Boolean)));
      
      accredBadges.forEach((b, i) => { if (b.imgFile) fd.append(`accredBadgeImage_${i}`, b.imgFile); });
      courseCards.forEach((c, i) => { if (c.imgFile) fd.append(`courseCardImage_${i}`, c.imgFile); });
      quoteCards.forEach((q, i) => { if (q.imgFile) fd.append(`quoteCardImage_${i}`, q.imgFile); });
      locations.forEach((loc, i) => { if (loc.imgFile) fd.append(`locationImage_${i}`, loc.imgFile); });
      
      if (heroFile) fd.append("heroImage", heroFile);
      if (mediaFile) fd.append("mediaImage", mediaFile);
      if (whoWeAreVideoFile) fd.append("whoWeAreVideo", whoWeAreVideoFile);
      if (whoWeAreVideoPosterFile) fd.append("whoWeAreVideoPoster", whoWeAreVideoPosterFile);
      if (rishikeshImageFile) fd.append("rishikeshImage", rishikeshImageFile);
      if (goaImageFile) fd.append("goaImage", goaImageFile);
      if (whyAYMImageFile) fd.append("whyAYMImage", whyAYMImageFile);
      
      if (isEdit) { await api.put("/yoga-ttc-india/update", fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Page updated successfully"); }
      else { await api.post("/yoga-ttc-india/create", fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Page created successfully"); }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/yoga-teacher-in-india"), 1500);
    } catch (e: any) { toast.error(e?.response?.data?.message || e?.message || "Something went wrong"); } finally { setIsSubmitting(false); }
  };

  if (loadingData) return <div className={styles.loadingWrap}><span className={styles.spinner} /><span>Loading page data…</span></div>;
  if (submitted) return <div className={styles.successScreen}><div className={styles.successCard}><div className={styles.successOm}>ॐ</div><div className={styles.successCheck}>✓</div><h2 className={styles.successTitle}>Yoga TTC India Page {isEdit ? "Updated" : "Saved"}!</h2><p className={styles.successText}>Redirecting to list…</p></div></div>;

  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/yoga-teacher-in-india")}>Yoga TTC India</button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>{isEdit ? "Edit Yoga TTC India Page" : "Add New Yoga TTC India Page"}</h1>
          <p className={styles.pageSubtitle}>Hero · Badges · Who We Are · Locations · Courses · Why AYM · Quotes · Arrival · Fee · Yoga Holidays · Section Images</p>
        </div>
      </div>
      <div className={styles.ornament}><span>❧</span><div className={styles.ornamentLine} /><span>ॐ</span><div className={styles.ornamentLine} /><span>❧</span></div>
      <div className={styles.formCard}>
        <Section title="Hero Section" badge="Top Banner Image">
          <Field label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px" error={heroErr} onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }} onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }} />
          </Field>
          <Field label="Hero Image Alt Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroImgAlt")} /></div></Field>
        </Section>
        <Divider />

        <Section title="Yoga Holidays Section" badge="Section 1">
          <Field label="Main H1 Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Holidays in India..." {...register("mainTitle")} /></div></Field>
          <Field label="Intro Paragraphs (Left Column)" hint="These appear in the left text column">
            <StrList items={introParagraphs} label="Paragraph" ph="Enter paragraph text..." onAdd={() => setIntroParagraphs(p => [...p, ""])} onRemove={(i) => setIntroParagraphs(p => p.filter((_, idx) => idx !== i))} onUpdate={(i, v) => { const n = [...introParagraphs]; n[i] = v; setIntroParagraphs(n); }} />
          </Field>
          <Field label="Media Image (Right Column)" hint="Recommended 800×600px"><SingleImg preview={mediaPrev} badge="Media" hint="JPG/PNG/WEBP · 800×600px" error="" onSelect={(f, p) => { setMediaFile(f); setMediaPrev(p); }} onRemove={() => { setMediaFile(null); setMediaPrev(""); }} /></Field>
          <Field label="Media Image Alt Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Stunning View of Rishikesh" {...register("mediaImageAlt")} /></div></Field>
          <Field label="Media Image Caption"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Stunning View of Rishikesh — AYM Yoga Center" {...register("mediaImageCaption")} /></div></Field>
          <Field label="Enable Video"><label className={styles.checkboxLabel}><input type="checkbox" {...register("videoEnabled")} /><span>Show Video Embed</span></label></Field>
          {videoEnabled && <Field label="Video URL" hint="YouTube or Vimeo embed URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="https://www.youtube.com/embed/VIDEO_ID" {...register("videoUrl")} /></div></Field>}
          <Field label="Video Placeholder Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Watch: Life at AYM Rishikesh" {...register("videoPlaceholderText")} /></div></Field>
        </Section>
        <Divider />

        <Section title="Ayurveda Callout" badge="Brown Highlight Box">
          <Field label="Callout Text"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={5} placeholder="Many things can be combined..." {...register("ayurvedaCalloutText")} /></div></Field>
          <div className={styles.grid2}>
            <Field label="Link Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga with Ayurveda" {...register("ayurvedaLinkText")} /></div></Field>
            <Field label="Link URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="#" {...register("ayurvedaLinkUrl")} /></div></Field>
          </div>
        </Section>
        <Divider />

        <Section title="Benefits Section" badge="Pills">
          <Field label="Benefits Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="The benefits of our Yoga Holiday..." {...register("benefitsHeading")} /></div></Field>
          <Field label="Benefits List"><StrList items={benefitsList} label="Benefit" ph="Peace of mind & clarity" onAdd={() => setBenefitsList(p => [...p, ""])} onRemove={(i) => setBenefitsList(p => p.filter((_, idx) => idx !== i))} onUpdate={(i, v) => { const n = [...benefitsList]; n[i] = v; setBenefitsList(n); }} /></Field>
        </Section>
        <Divider />

        <Section title="Call to Action" badge="Button Bar">
          <Field label="CTA Text"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="For more detail about yoga holiday packages..." {...register("ctaText")} /></div></Field>
          <div className={styles.grid2}>
            <Field label="Button Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Click Here to See Yoga Holidays Packages" {...register("ctaButtonText")} /></div></Field>
            <Field label="Button URL"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="#" {...register("ctaButtonUrl")} /></div></Field>
          </div>
        </Section>
        <Divider />

        <Section title="Page Heading" badge="H1 + Subtitle">
          <div className={styles.grid2}>
            <Field label="Main H1 Title" req><div className={`${styles.inputWrap} ${errors.heroTitle ? styles.inputError : ""}`}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="YOGA TEACHER TRAINING IN INDIA" {...register("heroTitle", { required: "Required" })} /></div>{errors.heroTitle && <p className={styles.errorMsg}>⚠ {errors.heroTitle.message}</p>}</Field>
            <Field label="Subtitle (School Name)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="AYM YOGA SCHOOL – RISHIKESH, INDIA" {...register("heroSubTitle")} /></div></Field>
          </div>
          <Field label="Introduction Paragraph" hint="Main intro text below heading"><StableJodit onSave={(v) => { introParaRef.current = v; }} value={introParaRef.current} h={200} ph="India, the birthplace of yoga, has shared its timeless yogic wisdom with the world…" /></Field>
          <Field label="Additional Intro Paragraphs">{introParaList.ids.map((id, i) => <RichListItem key={id} id={id} index={i} total={introParaList.ids.length} onSave={introParaList.save} onRemove={introParaList.remove} value={introParaList.ref.current[id]} ph="Additional intro content…" />)}<button type="button" className={styles.addItemBtn} onClick={introParaList.add}>＋ Add Paragraph</button></Field>
        </Section>
        <Divider />

        <Section title="Accreditation Badges" badge="7 Badges (with images)"><p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>ℹ Default 7 badges: Yoga Alliance USA, Ministry of AYUSH, RYS 200, RYS 300, RYS 500, Made in India, AYUSH Certified.</p><AccredBadgesManager items={accredBadges} onChange={setAccredBadges} /></Section>
        <Divider />

        <Section title="Who We Are" badge="Vintage Card Section">
          <Field label="Card Title" req><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Who We Are" {...register("whoWeAreTitle")} /></div></Field>
          <Field label="Card Paragraph"><StableJodit onSave={(v) => { whoWeAreParaRef.current = v; }} value={whoWeAreParaRef.current} h={200} ph="Founded in 2005, AYM Yoga School stands among the top yoga teacher training schools in India…" /></Field>
        </Section>
        <Divider />

        <Section title="Who We Are Video" badge="Upload Local Video">
          <Field label="Enable Video" hint="Toggle to show video">
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register("whoWeAreVideoEnabled")} />
              <span>Show Video for Who We Are Section</span>
            </label>
          </Field>
          {whoWeAreVideoEnabled && (
            <>
              <Field label="Upload Video File" hint="MP4, WebM, OGG - Max 50MB">
                <SingleImg
                  preview={whoWeAreVideoPrev}
                  badge="Video"
                  hint="MP4/WEBM/OGG · Recommended 1920×1080px"
                  error=""
                  accept="video/*"
                  onSelect={(f, p) => {
                    setWhoWeAreVideoFile(f);
                    setWhoWeAreVideoPrev(p);
                  }}
                  onRemove={() => {
                    setWhoWeAreVideoFile(null);
                    setWhoWeAreVideoPrev("");
                  }}
                />
              </Field>
              <Field label="Video Poster Image" hint="Thumbnail image shown before video plays">
                <SingleImg
                  preview={whoWeAreVideoPosterPrev}
                  badge="Poster"
                  hint="JPG/PNG/WEBP · 1920×1080px"
                  error=""
                  onSelect={(f, p) => {
                    setWhoWeAreVideoPosterFile(f);
                    setWhoWeAreVideoPosterPrev(p);
                  }}
                  onRemove={() => {
                    setWhoWeAreVideoPosterFile(null);
                    setWhoWeAreVideoPosterPrev("");
                  }}
                />
              </Field>
            </>
          )}
        </Section>
        <Divider />

        <Section title="Rishikesh Section" badge="Section 2 Images">
          <Field label="Rishikesh Image" hint="Recommended 900×600px">
            <SingleImg
              preview={rishikeshImagePrev}
              badge="Rishikesh"
              hint="JPG/PNG/WEBP · 900×600px"
              error=""
              onSelect={(f, p) => { setRishikeshImageFile(f); setRishikeshImagePrev(p); }}
              onRemove={() => { setRishikeshImageFile(null); setRishikeshImagePrev(""); }}
            />
          </Field>
          <Field label="Rishikesh Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Teacher Training in Rishikesh" {...register("rishikeshImageAlt")} />
            </div>
          </Field>
          <Field label="Rishikesh Image Badge Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Rishikesh, India" {...register("rishikeshImageBadge")} />
            </div>
          </Field>
        </Section>
        <Divider />

        <Section title="Goa Section" badge="Section 2 Images">
          <Field label="Goa Image" hint="Recommended 900×600px">
            <SingleImg
              preview={goaImagePrev}
              badge="Goa"
              hint="JPG/PNG/WEBP · 900×600px"
              error=""
              onSelect={(f, p) => { setGoaImageFile(f); setGoaImagePrev(p); }}
              onRemove={() => { setGoaImageFile(null); setGoaImagePrev(""); }}
            />
          </Field>
          <Field label="Goa Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Teacher Training in Goa" {...register("goaImageAlt")} />
            </div>
          </Field>
          <Field label="Goa Image Badge Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Goa, India" {...register("goaImageBadge")} />
            </div>
          </Field>
        </Section>
        <Divider />

        <Section title="Why AYM Section Image" badge="Dynamic Image">
          <Field label="Why AYM Image" hint="Recommended 900×600px">
            <SingleImg
              preview={whyAYMImagePrev}
              badge="Why AYM"
              hint="JPG/PNG/WEBP · 900×600px"
              error=""
              onSelect={(f, p) => { setWhyAYMImageFile(f); setWhyAYMImagePrev(p); }}
              onRemove={() => { setWhyAYMImageFile(null); setWhyAYMImagePrev(""); }}
            />
          </Field>
          <Field label="Why AYM Image Alt Text">
            <div className={styles.inputWrap}>
              <input 
                className={`${styles.input} ${styles.inputNoCount}`} 
                placeholder="Why AYM Yoga School" 
                {...register("whyAYMImageAlt")} 
              />
            </div>
          </Field>
          <Field label="Why AYM Image Badge Text">
            <div className={styles.inputWrap}>
              <input 
                className={`${styles.input} ${styles.inputNoCount}`} 
                placeholder="Excellence in Yoga" 
                {...register("whyAYMImageBadge")} 
              />
            </div>
          </Field>
        </Section>
        <Divider />

        <Section title="Yoga Teacher Training Through AYM" badge="Locations Card">
          <Field label="Section Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Teacher Training in India through AYM Yoga School" {...register("yytTitle")} /></div></Field>
          <Field label="Section Intro Paragraph"><StableJodit onSave={(v) => { yytParaRef.current = v; }} value={yytParaRef.current} h={150} ph="At AYM, we offer yoga teacher training in two distinct and inspiring locations in India…" /></Field>
          <Field label="Location Cards"><LocationsManager items={locations} onChange={setLocations} /></Field>
        </Section>
        <Divider />

        <Section title="Rishikesh — Detail Section" badge="Section 2">
          <Field label="Rishikesh Section Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Rishikesh" {...register("rishikeshTitle")} /></div></Field>
          <Field label="Rishikesh Main Paragraph"><StableJodit onSave={(v) => { rishikeshDetailParaRef.current = v; }} value={rishikeshDetailParaRef.current} h={180} ph="If you're drawn to the spiritual energy of the holy city of Rishikesh…" /></Field>
          <Field label="Additional Rishikesh Paragraphs">{rishikeshParaList.ids.map((id, i) => <RichListItem key={id} id={id} index={i} total={rishikeshParaList.ids.length} onSave={rishikeshParaList.save} onRemove={rishikeshParaList.remove} value={rishikeshParaList.ref.current[id]} ph="More about Rishikesh…" />)}<button type="button" className={styles.addItemBtn} onClick={rishikeshParaList.add}>＋ Add Paragraph</button></Field>
        </Section>
        <Divider />

        <Section title="Goa — Detail Section" badge="Section 2">
          <Field label="Goa Section Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Goa" {...register("goaTitle")} /></div></Field>
          <Field label="Goa Main Paragraph"><StableJodit onSave={(v) => { goaDetailParaRef.current = v; }} value={goaDetailParaRef.current} h={180} ph="If you are a beach person and want to learn yoga at the beachside…" /></Field>
          <Field label="Additional Goa Paragraphs">{goaParaList.ids.map((id, i) => <RichListItem key={id} id={id} index={i} total={goaParaList.ids.length} onSave={goaParaList.save} onRemove={goaParaList.remove} value={goaParaList.ref.current[id]} ph="More about Goa…" />)}<button type="button" className={styles.addItemBtn} onClick={goaParaList.add}>＋ Add Paragraph</button></Field>
        </Section>
        <Divider />

        <Section title="Course Cards (200 / 300 / 500 Hr)" badge="3 Cards"><CourseCardsManager items={courseCards} onChange={setCourseCards} /></Section>
        <Divider />

        <Section title="Why AYM Section Content" badge="Section 3">
          <Field label="Section Title (H2)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Why AYM for Yoga Teachers Training Course?" {...register("whyAYMTitle")} /></div></Field>
          <Field label="Paragraph 1"><StableJodit onSave={(v) => { whyAYMPara1Ref.current = v; }} value={whyAYMPara1Ref.current} h={180} ph="Yoga is not just the study of asanas, aka yogic poses, but a way of life…" /></Field>
          <Field label="Paragraph 2"><StableJodit onSave={(v) => { whyAYMPara2Ref.current = v; }} value={whyAYMPara2Ref.current} h={180} ph="Our teacher training courses in India are approved by the Ministry of Ayush…" /></Field>
          <Field label="Paragraph 3 (Below Quote Cards)"><StableJodit onSave={(v) => { whyAYMPara3Ref.current = v; }} value={whyAYMPara3Ref.current} h={180} ph="We welcome you to our yoga school in India to feel the magic of yoga…" /></Field>
          <Field label="Additional Why AYM Paragraphs">{whyAYMParaList.ids.map((id, i) => <RichListItem key={id} id={id} index={i} total={whyAYMParaList.ids.length} onSave={whyAYMParaList.save} onRemove={whyAYMParaList.remove} value={whyAYMParaList.ref.current[id]} ph="Additional Why AYM content…" />)}<button type="button" className={styles.addItemBtn} onClick={whyAYMParaList.add}>＋ Add Paragraph</button></Field>
        </Section>
        <Divider />

        <Section title="Quote Image Cards" badge="2 Cards with overlay quotes"><QuoteCardsManager items={quoteCards} onChange={setQuoteCards} /></Section>
        <Divider />

        <Section title="Arrival & Departure" badge="Info Panel">
          <Field label="Panel Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Arrival & Departure" {...register("arrivalTitle")} /></div></Field>
          <Field label="Arrival List Items"><StrList items={arrivalList} label="Arrival Item" ph="Day before Start date: Arrival and Rest." onAdd={() => setArrivalList((p) => [...p, ""])} onRemove={(i) => { if (arrivalList.length <= 1) return; setArrivalList((p) => p.filter((_, idx) => idx !== i)); }} onUpdate={(i, v) => { const n = [...arrivalList]; n[i] = v; setArrivalList(n); }} /></Field>
        </Section>
        <Divider />

        <Section title="Includes in Fee" badge="Info Panel">
          <Field label="Panel Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Includes in Fee" {...register("feeTitle")} /></div></Field>
          <Field label="Fee Includes List Items"><StrList items={feeList} label="Fee Item" ph="Accommodation and Food." onAdd={() => setFeeList((p) => [...p, ""])} onRemove={(i) => { if (feeList.length <= 1) return; setFeeList((p) => p.filter((_, idx) => idx !== i)); }} onUpdate={(i, v) => { const n = [...feeList]; n[i] = v; setFeeList(n); }} /></Field>
        </Section>
        <Divider />

        <Section title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <Field label="Slug" req><div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="yoga-teacher-training-in-india" {...register("slug", { required: "Slug is required" })} /></div>{errors.slug && <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>}</Field>
            <Field label="Status"><div className={styles.selectWrap}><select className={styles.select} {...register("status")}><option value="Active">Active</option><option value="Inactive">Inactive</option></select><span className={styles.selectArrow}>▾</span></div></Field>
          </div>
        </Section>
      </div>
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/yoga-teacher-in-india" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button" className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`} onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? <><span className={styles.spinner} /> Saving…</> : <><span>✦</span> {isEdit ? "Update" : "Save"} Yoga TTC India Page</>}</button>
      </div>
    </div>
  );
}