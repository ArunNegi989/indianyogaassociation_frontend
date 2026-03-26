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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "font",
      "fontsize",
      "brush",
      "|",
      "paragraph",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "link",
      "|",
      "undo",
      "redo",
      "|",
      "selectall",
      "cut",
      "copy",
      "paste",
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
    <div
      style={{
        height: 1,
        background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)",
        margin: "0.4rem 0 1.8rem",
      }}
    />
  );
}

/* ─── Section wrapper ─── */
function Sec({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
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

/* ─── Field wrapper ─── */
function F({
  label,
  hint,
  req,
  children,
}: {
  label: string;
  hint?: string;
  req?: boolean;
  children: React.ReactNode;
}) {
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
  const [editorValue, setEditorValue] = useState(value || "");


  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);

 const handleChange = useCallback((val: string) => {
  setEditorValue(val);
  onSaveRef.current(val);
}, []);

useEffect(() => {
  setEditorValue(value || "");
}, [value]);

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
    <div
      ref={wrapRef}
      className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
      style={{ minHeight: h }}
    >
      {visible ? (
        <JoditEditor
          config={config}
          value={editorValue}
          onChange={handleChange}
        />
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

/* ─── Rich List Item ─── */
const RichListItem = memo(function RichListItem({
  id,
  index,
  total,
  onSave,
  onRemove,
  value,
  ph,
}: {
  id: string;
  index: number;
  total: number;
  onSave: (id: string, v: string) => void;
  onRemove: (id: string) => void;
  value?: string;
  ph?: string;
}) {
  const handleSave = useCallback(
    (v: string) => {
      onSave(id, v);
    },
    [id, onSave],
  );

  return (
    <div className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
      <div className={styles.nestedCardHeader}>
        <span className={styles.nestedCardNum}>Paragraph {index + 1}</span>
        {total > 1 && (
          <button
            type="button"
            className={styles.removeNestedBtn}
            onClick={() => onRemove(id)}
          >
            ✕ Remove
          </button>
        )}
      </div>
      <div className={styles.nestedCardBody}>
        <StableJodit
           onSave={handleSave}
  value={value || ""}
  key={value}
          ph={ph}
          h={180}
        />
      </div>
    </div>
  );
});

/* ─── String List ─── */
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

/* ─── Single Image Uploader ─── */
function SingleImg({
  preview,
  badge,
  hint,
  error,
  onSelect,
  onRemove,
}: {
  preview: string;
  badge?: string;
  hint: string;
  error?: string;
  onSelect: (f: File, p: string) => void;
  onRemove: () => void;
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
              accept="image/*"
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
            <img src={preview} alt="" className={styles.imagePreview} />
            <div className={styles.imagePreviewOverlay}>
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input
                type="file"
                accept="image/*"
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

/* ══════════════════════════════════════════
   DYNAMIC LIST MANAGERS
══════════════════════════════════════════ */

/* ── Unique Points Manager ── */
interface UniquePointItem {
  id: string;
  icon: string;
  title: string;
  body: string;
}
const DEFAULT_UNIQUE_POINTS: UniquePointItem[] = [
  {
    id: "up1",
    icon: "🛕",
    title: "Hindu Culture & Ceremonies",
    body: "Home to various Hindu ceremonies and traditions. Since Bali is predominantly Hindu while the rest of Indonesia is Muslim, it creates a unique cultural vibe — creating the daily fabric of life here.",
  },
  {
    id: "up2",
    icon: "🌿",
    title: "Spiritual Hub of Asia",
    body: "Travelers flock from all over the world to this health and wellness hotspot. The mixture of culture, spirituality and the warmth of Balinese people make it a hub for yogis.",
  },
  {
    id: "up3",
    icon: "🏝️",
    title: "Island of the Gods",
    body: "Bali is an island situated between the Indian and Pacific Ocean — the only island in Indonesia which follows Hinduism, home to sacred religious sites like Uluwatu Temple.",
  },
  {
    id: "up4",
    icon: "🌄",
    title: "Ubud — Yoga Capital",
    body: "Our AYM yoga school is situated in Ubud, the yoga capital of Bali, a city with countless yoga retreats, studios, lush green paddy fields, picturesque temples and healthy food restaurants.",
  },
];

function UniquePointsManager({
  items,
  onChange,
}: {
  items: UniquePointItem[];
  onChange: (v: UniquePointItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof UniquePointItem, value: string) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      { id: `up-${Date.now()}`, icon: "🌟", title: "", body: "" },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>
              Unique Point: {item.title || "New"}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeNestedBtn}
                onClick={() => remove(item.id)}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Icon Emoji
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.icon}
                    placeholder="🛕"
                    onChange={(e) => update(item.id, "icon", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Title
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.title}
                    placeholder="Hindu Culture & Ceremonies"
                    onChange={(e) => update(item.id, "title", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Body Text
              </label>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={3}
                  value={item.body}
                  onChange={(e) => update(item.id, "body", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Unique Point
      </button>
    </div>
  );
}

/* ── Courses Manager (UPDATED with Title and URL) ── */
interface CourseItem {
  id: string;
  hrs: string;
  tag: string;
  color: string;
  title: string;  // NEW: Full course title (e.g., "200-Hour Yoga Teacher Training in Bali")
  url: string;    // NEW: URL for the "Enquire →" button
  desc: string;
}
const DEFAULT_COURSES: CourseItem[] = [
  { 
    id: "c1", 
    hrs: "200", 
    tag: "Foundation", 
    color: "#e07b00", 
    title: "200-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "The internationally recognized standard certification to begin your journey as a yoga teacher. Ideal for beginners and those looking to deepen their personal practice." 
  },
  { 
    id: "c2", 
    hrs: "300", 
    tag: "Advanced", 
    color: "#b85e00", 
    title: "300-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "An advanced course for 200-hour certified teachers to expand their knowledge, skills and deepen their personal practice significantly." 
  },
  { 
    id: "c3", 
    hrs: "500", 
    tag: "Mastery", 
    color: "#7a3f00", 
    title: "500-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "A comprehensive, advanced-level program for those seeking complete mastery in yoga instruction. Internationally recognised qualification." 
  },
];

function CoursesManager({
  items,
  onChange,
}: {
  items: CourseItem[];
  onChange: (v: CourseItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof CourseItem, value: string) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      { id: `c-${Date.now()}`, hrs: "", tag: "", color: "#e07b00", title: "", url: "", desc: "" },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>
              {item.hrs}-Hour Course: {item.title || "New"}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeNestedBtn}
                onClick={() => remove(item.id)}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Hours
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.hrs}
                    placeholder="200"
                    onChange={(e) => update(item.id, "hrs", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Tag
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.tag}
                    placeholder="Foundation"
                    onChange={(e) => update(item.id, "tag", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Course Title
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.title}
                    placeholder="200-Hour Yoga Teacher Training in Bali"
                    onChange={(e) => update(item.id, "title", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Button URL
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.url}
                    placeholder="/contact or #apply"
                    onChange={(e) => update(item.id, "url", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Card Color (hex)
                </label>
                <div
                  className={styles.inputWrap}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="color"
                    value={item.color}
                    style={{
                      width: 40,
                      height: 36,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                    onChange={(e) => update(item.id, "color", e.target.value)}
                  />
                  <input
                    className={styles.input}
                    value={item.color}
                    placeholder="#e07b00"
                    onChange={(e) => update(item.id, "color", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Description
              </label>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={4}
                  value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Course
      </button>
    </div>
  );
}

/* ── Highlights Manager ── */
function HighlightsManager({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const update = useCallback((idx: number, val: string) => {
    const newItems = [...items];
    newItems[idx] = val;
    onChange(newItems);
  }, [items, onChange]);

  const add = () => onChange([...items, ""]);
  const remove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className={styles.listItemRow}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={item}
              placeholder="Comprehensive studies of Hatha Yoga..."
              onChange={(e) => update(idx, e.target.value)}
            />
          </div>
          <button
            type="button"
            className={styles.removeItemBtn}
            onClick={() => remove(idx)}
            disabled={items.length <= 1}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Highlight
      </button>
    </div>
  );
}

/* ── Destination Highlights Manager ── */
function DestHighlightsManager({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const update = useCallback((idx: number, val: string) => {
    const newItems = [...items];
    newItems[idx] = val;
    onChange(newItems);
  }, [items, onChange]);

  const add = () => onChange([...items, ""]);
  const remove = (idx: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className={styles.listItemRow}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={item}
              placeholder="Ubud Monkey Forest"
              onChange={(e) => update(idx, e.target.value)}
            />
          </div>
          <button
            type="button"
            className={styles.removeItemBtn}
            onClick={() => remove(idx)}
            disabled={items.length <= 1}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Destination Highlight
      </button>
    </div>
  );
}

/* ── AYM Special Manager ── */
interface AYMSpecialItem {
  id: string;
  num: string;
  title: string;
  body: string;
}
const DEFAULT_AYM_SPECIAL: AYMSpecialItem[] = [
  { id: "as1", num: "01", title: "Steadiness of Practice", body: "Comprehensive knowledge of yoga techniques, skillfulness in yogic postures, and philosophy makes our curriculum the best yoga teacher training in Bali." },
  { id: "as2", num: "02", title: "Coherent Structure", body: "We structured our curriculum so that even beginners and advanced practitioners obtain a comprehensive overview of Hatha Yoga." },
  { id: "as3", num: "03", title: "Morning Rituals", body: "Our day begins with the practice of meditation, hatha yoga practice and morning chants; with personalised interaction to provide a family-like atmosphere." },
  { id: "as4", num: "04", title: "Teaching Professionalisation", body: "During your yoga teacher training, we will provide plenty of opportunities to professionalise your teaching skills and help you market your new expertise." },
  { id: "as5", num: "05", title: "Yoga Alliance Standards", body: "Our curriculum meets the standards of the internationally acclaimed Yoga Alliance. Our best yoga teachers provide the best conditions so they grow as best instructors." },
];

function AYMSpecialManager({
  items,
  onChange,
}: {
  items: AYMSpecialItem[];
  onChange: (v: AYMSpecialItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof AYMSpecialItem, value: string) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      { id: `as-${Date.now()}`, num: String(items.length + 1).padStart(2, "0"), title: "", body: "" },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>
              Special: {item.title || "New"}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeNestedBtn}
                onClick={() => remove(item.id)}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Number
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.num}
                    placeholder="01"
                    onChange={(e) => update(item.id, "num", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Title
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.title}
                    placeholder="Steadiness of Practice"
                    onChange={(e) => update(item.id, "title", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Body Text
              </label>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={3}
                  value={item.body}
                  onChange={(e) => update(item.id, "body", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add AYM Special
      </button>
    </div>
  );
}

/* ── Chakras Manager ── */
interface ChakraItem {
  id: string;
  name: string;
  color: string;
  symbol: string;
  meaning: string;
  mantra: string;
}
const DEFAULT_CHAKRAS: ChakraItem[] = [
  { id: "ch1", name: "Muladhara", color: "#c0392b", symbol: "◼", meaning: "Root · Earth · Stability", mantra: "LAM" },
  { id: "ch2", name: "Svadhisthana", color: "#e67e22", symbol: "◉", meaning: "Sacral · Water · Creativity", mantra: "VAM" },
  { id: "ch3", name: "Manipura", color: "#f1c40f", symbol: "▲", meaning: "Solar Plexus · Fire · Power", mantra: "RAM" },
  { id: "ch4", name: "Anahata", color: "#27ae60", symbol: "✦", meaning: "Heart · Air · Love", mantra: "YAM" },
  { id: "ch5", name: "Vishuddha", color: "#2980b9", symbol: "◎", meaning: "Throat · Ether · Truth", mantra: "HAM" },
  { id: "ch6", name: "Ajna", color: "#8e44ad", symbol: "◈", meaning: "Third Eye · Light · Intuition", mantra: "OM" },
  { id: "ch7", name: "Sahasrara", color: "#9b59b6", symbol: "✿", meaning: "Crown · Cosmic · Consciousness", mantra: "AH" },
];

function ChakrasManager({
  items,
  onChange,
}: {
  items: ChakraItem[];
  onChange: (v: ChakraItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof ChakraItem, value: string) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      { id: `ch-${Date.now()}`, name: "", color: "#e07b00", symbol: "●", meaning: "", mantra: "" },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>
              Chakra: {item.name || "New"}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                className={styles.removeNestedBtn}
                onClick={() => remove(item.id)}
              >
                ✕ Remove
              </button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Name
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.name}
                    placeholder="Muladhara"
                    onChange={(e) => update(item.id, "name", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Symbol
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.symbol}
                    placeholder="◼"
                    onChange={(e) => update(item.id, "symbol", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Color (hex)
                </label>
                <div
                  className={styles.inputWrap}
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <input
                    type="color"
                    value={item.color}
                    style={{
                      width: 40,
                      height: 36,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                    }}
                    onChange={(e) => update(item.id, "color", e.target.value)}
                  />
                  <input
                    className={styles.input}
                    value={item.color}
                    placeholder="#c0392b"
                    onChange={(e) => update(item.id, "color", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Mantra
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.mantra}
                    placeholder="LAM"
                    onChange={(e) => update(item.id, "mantra", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Meaning
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.meaning}
                  placeholder="Root · Earth · Stability"
                  onChange={(e) => update(item.id, "meaning", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Chakra
      </button>
    </div>
  );
}

/* ── PARA LIST HOOK ── */
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
  const save = useCallback((id: string, v: string) => {
    ref.current[id] = v;
  }, []);
  const loadFromArray = useCallback((arr: string[], prefix: string) => {
    const newIds: string[] = [];
    arr.forEach((p, i) => {
      const id = `${prefix}${i}`;
      newIds.push(id);
      ref.current[id] = p;
    });
    setIds(newIds);
  }, []);
  return { ids, ref, add, remove, save, loadFromArray };
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  pageTitleH1: string;
  heroImgAlt: string;
  heroCaption?: string;
  introBannerTitle: string;
  introBannerText: string;
  introSuperLabel: string;
  introTitle: string;
  introParaCenter: string;
  uniquePointsSectionTitle: string;
  uniquePointsSuperLabel: string;
  uniquePointsCenterPara: string;
  destSuperLabel: string;
  destTitle: string;
  destPara1: string;
  destPara2: string;
  coursesSuperLabel: string;
  coursesSectionTitle: string;
  coursesCenterPara: string;
  highlightsSuperLabel: string;
  highlightsSectionTitle: string;
  highlightsPara1: string;
  highlightsPara2: string;
  aymSpecialSuperLabel: string;
  aymSpecialSectionTitle: string;
  pullQuoteText: string;
  teacherCaptionText: string;
  footerTitle: string;
  footerLoc: string;
  footerMail: string;
  footerTag: string;
}

/* ══════════════════════════════════════════
   MAIN FORM
══════════════════════════════════════════ */
export default function AddEditBaliPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params?.id as string;
  const isEdit = !!pageId && pageId !== "add-new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  /* ── Images ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [groupImagePrev, setGroupImagePrev] = useState("");
  const [templeImageFile, setTempleImageFile] = useState<File | null>(null);
  const [templeImagePrev, setTempleImagePrev] = useState("");
  const [riceImageFile, setRiceImageFile] = useState<File | null>(null);
  const [riceImagePrev, setRiceImagePrev] = useState("");
  const [practiceImageFile, setPracticeImageFile] = useState<File | null>(null);
  const [practiceImagePrev, setPracticeImagePrev] = useState("");
  const [teacherImageFile, setTeacherImageFile] = useState<File | null>(null);
  const [teacherImagePrev, setTeacherImagePrev] = useState("");
  const [gardenImageFile, setGardenImageFile] = useState<File | null>(null);
  const [gardenImagePrev, setGardenImagePrev] = useState("");
  const [ubudImageFile, setUbudImageFile] = useState<File | null>(null);
  const [ubudImagePrev, setUbudImagePrev] = useState("");

  /* ── Rich text refs ── */
  const introTextRef = useRef("");
  const uniquePointsCenterParaRef = useRef("");
  const destPara1Ref = useRef("");
  const destPara2Ref = useRef("");
  const coursesCenterParaRef = useRef("");
  const highlightsPara1Ref = useRef("");
  const highlightsPara2Ref = useRef("");

  /* ── Para lists ── */
  const introParaList = useParaList("ip1");
  const uniquePointsParaList = useParaList("up1");
  const aymSpecialParaList = useParaList("asp1");

  /* ── Dynamic lists ── */
  const [uniquePoints, setUniquePoints] = useState<UniquePointItem[]>(DEFAULT_UNIQUE_POINTS);
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [highlights, setHighlights] = useState<string[]>([
    "Comprehensive studies of Hatha Yoga, Kundalini yoga, and spiritual heart meditation",
    "Intense and regular practice of asanas (postures), Ashtanga yoga, vinyasa flow",
    "Purification techniques, breathing patterns, and meditations for full Hatha Yoga experience",
    "Extensive studies of yogic philosophy, meditation and mantra chanting",
    "Practice of pranayama and subtle energies channels of nadi and chakra",
  ]);
  const [destHighlights, setDestHighlights] = useState<string[]>([
    "Ubud Monkey Forest",
    "Tegalalang Rice Terraces",
    "Sacred Tirta Empul Temple",
    "Campuhan Ridge Walk",
    "Goa Gajah — Elephant Cave",
  ]);
  const [aymSpecial, setAymSpecial] = useState<AYMSpecialItem[]>(DEFAULT_AYM_SPECIAL);
  const [chakras, setChakras] = useState<ChakraItem[]>(DEFAULT_CHAKRAS);

  /* ── useForm ── */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      slug: "",
      status: "Active",
      pageTitleH1: "Bali: Take Your 200 Hour Yoga Teacher Training to the Next Level in Paradise",
      heroImgAlt: "Yoga Students Group",
      heroCaption: "Yoga Students Group",
      introBannerTitle: "Bali: Take Your 200 Hour Yoga Teacher Training to the Next Level in Paradise",
      introBannerText: "Bali is an Island situated between the Indian and Pacific Ocean and the only Island in Indonesia which follows Hinduism. The Island is home to a various religious site like Uluwatu Temple. Also known as the Islands of Gods and culture, it attracts tourists from all over the world.",
      introSuperLabel: "Sacred Island",
      introTitle: "What Make Bali Unique for Yoga Teacher Training in Bali",
      introParaCenter: "It is the home of various Hindus ceremonies and traditions. Travelers flock from all over the world to this health and wellness hotspot. Since Bali is predominantly Hindu while the rest of the country is Muslim, it creates a unique cultural vibe. All those Hindus ceremonies and traditions create the daily fabric of Life here, which make Bali very unique and sacred. Alike with the mixture of culture, spirituality and the warmth of Balinese people make it a hub for yogis and the best place for yoga teacher training.",
      uniquePointsSectionTitle: "What Makes Bali Unique",
      uniquePointsSuperLabel: "Sacred Island",
      uniquePointsCenterPara: "It is the home of various Hindus ceremonies and traditions. Travelers flock from all over the world to this health and wellness hotspot.",
      destSuperLabel: "Our Location",
      destTitle: "Our Destination",
      destPara1: "Our AYM yoga school is situated in Ubud, the yoga capital of Bali, a city with numerous yoga retreats and studios. It also homes to countless yogis who came from all over the world — which make Ubud an excellent setting for yoga teacher training.",
      destPara2: "Filled with lush green paddy field, picturesque temple, art galleries, colourful market, and countless healthy food restaurants, you will fall in love with the dazzling town.",
      coursesSuperLabel: "Programmes",
      coursesSectionTitle: "Courses Provided",
      coursesCenterPara: "Our curriculum caters to all the requirements of all yoga practitioners. If you want to immerse yourself in Yoga, meditation, and philosophy, we have training courses for you. Each training program is developed and run by our best Yoga teachers themselves. The programs vary from a yoga retreat to yoga teacher training of 200, 300 to 500 hours accreditations.",
      highlightsSuperLabel: "Curriculum",
      highlightsSectionTitle: "Highlights of the Courses",
      highlightsPara1: "The keystone of our courses is comprehensive studies of Hatha Yoga, Kundalini yoga, and spiritual heart meditation. Our Courses includes the intense and regular practice of asanas (postures), Ashtanga yoga, vinyasa flow. To introduce full aspects of Hatha Yoga, we incorporate purification techniques, breathing patterns, and meditations.",
      highlightsPara2: "Extensive studies of yogic philosophy frame our training courses, meditation and mantra chanting, the practice of pranayama and subtle energies channels of nadi and chakra.",
      aymSpecialSuperLabel: "Why AYM",
      aymSpecialSectionTitle: "What makes AYM yoga school training special?",
      pullQuoteText: "Yoga is not about touching your toes. It is what you learn on the way down.",
      teacherCaptionText: "Experience the transformative power of yoga in the heart of Bali",
      footerTitle: "AYM Yoga School Bali",
      footerLoc: "Ubud, Bali, Indonesia",
      footerMail: "info@aymyogaschool.com",
      footerTag: "Yoga Alliance Certified · 200/300/500 Hour TTC · Since 2001",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get(`/bali-page`);
        const d = res.data.data;
        
        const textFields: (keyof PageFormValues)[] = [
          "slug", "status", "pageTitleH1", "heroImgAlt", "heroCaption",
          "introBannerTitle", "introBannerText", "introSuperLabel", "introTitle",
          "introParaCenter", "uniquePointsSectionTitle", "uniquePointsSuperLabel",
          "uniquePointsCenterPara", "destSuperLabel", "destTitle", "destPara1",
          "destPara2", "coursesSuperLabel", "coursesSectionTitle", "coursesCenterPara",
          "highlightsSuperLabel", "highlightsSectionTitle", "highlightsPara1",
          "highlightsPara2", "aymSpecialSuperLabel", "aymSpecialSectionTitle",
          "pullQuoteText", "teacherCaptionText", "footerTitle", "footerLoc",
          "footerMail", "footerTag"
        ];
        textFields.forEach((k) => {
          if (d[k] !== undefined) setValue(k, d[k]);
        });

        /* Rich text refs */
        introTextRef.current = d.introText || "";
        uniquePointsCenterParaRef.current = d.uniquePointsCenterPara || "";
        destPara1Ref.current = d.destPara1 || "";
        destPara2Ref.current = d.destPara2 || "";
        coursesCenterParaRef.current = d.coursesCenterPara || "";
        highlightsPara1Ref.current = d.highlightsPara1 || "";
        highlightsPara2Ref.current = d.highlightsPara2 || "";

        /* Para lists */
        if (d.introParagraphs?.length) introParaList.loadFromArray(d.introParagraphs, "ip");
        if (d.uniquePointsParagraphs?.length) uniquePointsParaList.loadFromArray(d.uniquePointsParagraphs, "up");
       let aymParas = d.aymSpecialParagraphs;

if (typeof aymParas === "string") {
  try {
    aymParas = JSON.parse(aymParas);
  } catch {
    aymParas = [];
  }
}

if (aymParas?.length) {
  aymSpecialParaList.loadFromArray(aymParas, "asp");
}
        /* Images */
        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.groupImage) setGroupImagePrev(BASE_URL + d.groupImage);
        if (d.templeImage) setTempleImagePrev(BASE_URL + d.templeImage);
        if (d.riceImage) setRiceImagePrev(BASE_URL + d.riceImage);
        if (d.practiceImage) setPracticeImagePrev(BASE_URL + d.practiceImage);
        if (d.teacherImage) setTeacherImagePrev(BASE_URL + d.teacherImage);
        if (d.gardenImage) setGardenImagePrev(BASE_URL + d.gardenImage);
        if (d.ubudImage) setUbudImagePrev(BASE_URL + d.ubudImage);

        /* Dynamic lists */
        if (d.uniquePoints?.length) setUniquePoints(d.uniquePoints);
        if (d.courses?.length) setCourses(d.courses);
        if (d.highlights?.length) setHighlights(d.highlights);
        if (d.destHighlights?.length) setDestHighlights(d.destHighlights);
        if (d.aymSpecial?.length) setAymSpecial(d.aymSpecial);
        if (d.chakras?.length) setChakras(d.chakras);
      } catch {
        toast.error("Failed to load page data");
        router.push("/admin/yogacourse/yoga-course-bali");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [isEdit, pageId]);

  /* ── Submit ── */
 const onSubmit = async (data: PageFormValues) => {
  if (!heroFile && !heroPrev) {
    setHeroErr("Hero image is required");
    return;
  }

  try {
    setIsSubmitting(true);

    const fd = new FormData();

    /* =========================
       BASIC FIELDS
    ========================= */
    Object.entries(data).forEach(([k, v]) => {
  if (
    [
      "destPara1",
      "destPara2",
      "coursesCenterPara",
      "highlightsPara1",
      "highlightsPara2",
      "uniquePointsCenterPara",
      "introText",
    ].includes(k)
  ) {
    return; // skip (we handle manually)
  }

  fd.append(k, v ?? "");
});

    /* =========================
       HELPER (IMPORTANT)
    ========================= */
    const getString = (val: any) => {
      if (!val) return "";
      return Array.isArray(val) ? val.join(" ") : val;
    };

    /* =========================
       RICH TEXT (FIXED)
    ========================= */
    fd.append("introText", getString(introTextRef.current));
    fd.append(
      "uniquePointsCenterPara",
      getString(uniquePointsCenterParaRef.current)
    );
    fd.append("destPara1", getString(destPara1Ref.current));
    fd.append("destPara2", getString(destPara2Ref.current));
    fd.append(
      "coursesCenterPara",
      getString(coursesCenterParaRef.current)
    );
    fd.append("highlightsPara1", getString(highlightsPara1Ref.current));
    fd.append("highlightsPara2", getString(highlightsPara2Ref.current));

    /* =========================
       PARA LISTS (FIXED)
    ========================= */
    const introArr = introParaList.ids.map(
      (id) => introParaList.ref.current[id] || ""
    );

    const uniqueArr = uniquePointsParaList.ids.map(
      (id) => uniquePointsParaList.ref.current[id] || ""
    );

    const aymArr = aymSpecialParaList.ids.map(
      (id) => aymSpecialParaList.ref.current[id] || ""
    );

    fd.append("introParagraphs", JSON.stringify(introArr));
    fd.append("uniquePointsParagraphs", JSON.stringify(uniqueArr));
    fd.append("aymSpecialParagraphs", JSON.stringify(aymArr));

    /* =========================
       DYNAMIC LISTS
    ========================= */
    fd.append("uniquePoints", JSON.stringify(uniquePoints));
    fd.append("courses", JSON.stringify(courses));
    fd.append("highlights", JSON.stringify(highlights));
    fd.append("destHighlights", JSON.stringify(destHighlights));
    fd.append("aymSpecial", JSON.stringify(aymSpecial));
    fd.append("chakras", JSON.stringify(chakras));

    /* =========================
       IMAGES
    ========================= */
    if (heroFile) fd.append("heroImage", heroFile);
    if (groupImageFile) fd.append("groupImage", groupImageFile);
    if (templeImageFile) fd.append("templeImage", templeImageFile);
    if (riceImageFile) fd.append("riceImage", riceImageFile);
    if (practiceImageFile) fd.append("practiceImage", practiceImageFile);
    if (teacherImageFile) fd.append("teacherImage", teacherImageFile);
    if (gardenImageFile) fd.append("gardenImage", gardenImageFile);
    if (ubudImageFile) fd.append("ubudImage", ubudImageFile);

    /* =========================
       API CALL
    ========================= */
    if (isEdit) {
      fd.append("_id", pageId);

      await api.put("/bali-page", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Page updated successfully");
    } else {
      await api.post("/bali-page", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Page created successfully");
    }

    setSubmitted(true);
    setTimeout(() => {
      router.push("/admin/yogacourse/yoga-course-bali");
    }, 1500);
  } catch (e: any) {
    toast.error(
      e?.response?.data?.message ||
        e?.message ||
        "Something went wrong"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  if (loadingData)
    return (
      <div className={styles.loadingWrap}>
        <span className={styles.spinner} />
        <span>Loading page data…</span>
      </div>
    );
  if (submitted)
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>
            Bali Page {isEdit ? "Updated" : "Saved"}!
          </h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/yoga-course-bali")}
        >
          Bali Yoga Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Page" : "Add New Page"}
        </span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit Bali Yoga Page" : "Add New Bali Yoga Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Intro · Unique Points · Destination · Courses · Highlights · AYM Special · Chakras · Footer
          </p>
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
        {/* ══ 1. HERO SECTION ══ */}
        <Sec title="Hero Section">
          <F label="Page H1 Heading" req>
            <div className={`${styles.inputWrap} ${errors.pageTitleH1 ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("pageTitleH1", { required: "Required" })} />
            </div>
            {errors.pageTitleH1 && <p className={styles.errorMsg}>⚠ {errors.pageTitleH1.message}</p>}
          </F>
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev}
              badge="Hero"
              hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} {...register("heroImgAlt")} />
            </div>
          </F>
          <F label="Hero Caption (optional)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("heroCaption")} placeholder="Yoga Students Group" />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. INTRO BANNER ══ */}
        <Sec title="Intro Banner" badge="What is Bali">
          <F label="Intro Banner Title">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introBannerTitle")} />
            </div>
          </F>
          <F label="Intro Banner Text">
            <StableJodit
              onSave={(v) => { introTextRef.current = v; }}
             value={introTextRef.current || ""}
key={introTextRef.current}
              h={150}
              ph="Bali is an Island situated between the Indian and Pacific Ocean..."
            />
          </F>
        </Sec>
        <D />

        {/* ══ 3. WHAT MAKES BALI UNIQUE SECTION ══ */}
        <Sec title="What Makes Bali Unique Section" badge="Sacred Island">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introSuperLabel")} />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introTitle")} />
            </div>
          </F>
          <F label="Center Paragraph">
            <StableJodit
              onSave={(v) => { uniquePointsCenterParaRef.current = v; }}
             value={uniquePointsCenterParaRef.current || ""}
key={uniquePointsCenterParaRef.current}
              h={200}
              ph="It is the home of various Hindus ceremonies and traditions..."
            />
          </F>
          <F label="Unique Points Cards">
            <UniquePointsManager items={uniquePoints} onChange={setUniquePoints} />
          </F>
        </Sec>
        <D />

        {/* ══ 4. DESTINATION SECTION ══ */}
        <Sec title="Destination Section" badge="Ubud Location">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("destSuperLabel")} />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("destTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { destPara1Ref.current = v; }}
              value={destPara1Ref.current || ""}
key={destPara1Ref.current}
              h={150}
              ph="Our AYM yoga school is situated in Ubud, the yoga capital of Bali..."
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => { destPara2Ref.current = v; }}
             value={destPara2Ref.current || ""}
key={destPara2Ref.current}
              h={150}
              ph="Filled with lush green paddy field, picturesque temple..."
            />
          </F>
          <F label="Destination Highlights">
            <DestHighlightsManager items={destHighlights} onChange={setDestHighlights} />
          </F>

          {/* Destination Images */}
          <F label="Group Image (Main)" hint="Recommended 1100×700px">
            <SingleImg
              preview={groupImagePrev}
              badge="Group"
              hint="JPG/PNG/WEBP"
              onSelect={(f, p) => { setGroupImageFile(f); setGroupImagePrev(p); }}
              onRemove={() => { setGroupImageFile(null); setGroupImagePrev(""); }}
            />
          </F>
          <div className={styles.grid2}>
            <F label="Temple Image">
              <SingleImg
                preview={templeImagePrev}
                badge="Temple"
                hint="JPG/PNG/WEBP · 900×600px"
                onSelect={(f, p) => { setTempleImageFile(f); setTempleImagePrev(p); }}
                onRemove={() => { setTempleImageFile(null); setTempleImagePrev(""); }}
              />
            </F>
            <F label="Rice Terraces Image">
              <SingleImg
                preview={riceImagePrev}
                badge="Rice"
                hint="JPG/PNG/WEBP · 900×600px"
                onSelect={(f, p) => { setRiceImageFile(f); setRiceImagePrev(p); }}
                onRemove={() => { setRiceImageFile(null); setRiceImagePrev(""); }}
              />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 5. COURSES SECTION ══ */}
        <Sec title="Courses Section" badge="200/300/500 Hour">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("coursesSuperLabel")} />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("coursesSectionTitle")} />
            </div>
          </F>
          <F label="Center Paragraph">
            <StableJodit
              onSave={(v) => { coursesCenterParaRef.current = v; }}
             value={coursesCenterParaRef.current || ""}
key={coursesCenterParaRef.current}
              h={150}
              ph="Our curriculum caters to all the requirements of all yoga practitioners..."
            />
          </F>
          <F label="Courses Cards">
            <CoursesManager items={courses} onChange={setCourses} />
          </F>
        </Sec>
        <D />

        {/* ══ 6. HIGHLIGHTS SECTION ══ */}
        <Sec title="Highlights Section" badge="Curriculum">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("highlightsSuperLabel")} />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("highlightsSectionTitle")} />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => { highlightsPara1Ref.current = v; }}
              value={highlightsPara1Ref.current || ""}
key={highlightsPara1Ref.current}
              h={150}
              ph="The keystone of our courses is comprehensive studies of Hatha Yoga..."
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => { highlightsPara2Ref.current = v; }}
              value={highlightsPara2Ref.current || ""}
key={highlightsPara2Ref.current}
              h={150}
              ph="Extensive studies of yogic philosophy frame our training courses..."
            />
          </F>
          <F label="Highlights List">
            <HighlightsManager items={highlights} onChange={setHighlights} />
          </F>

          {/* Highlights Images */}
          <div className={styles.grid2}>
            <F label="Practice Image">
              <SingleImg
                preview={practiceImagePrev}
                badge="Practice"
                hint="JPG/PNG/WEBP · 900×600px"
                onSelect={(f, p) => { setPracticeImageFile(f); setPracticeImagePrev(p); }}
                onRemove={() => { setPracticeImageFile(null); setPracticeImagePrev(""); }}
              />
            </F>
            <F label="Teacher Image">
              <SingleImg
                preview={teacherImagePrev}
                badge="Teacher"
                hint="JPG/PNG/WEBP · 900×600px"
                onSelect={(f, p) => { setTeacherImageFile(f); setTeacherImagePrev(p); }}
                onRemove={() => { setTeacherImageFile(null); setTeacherImagePrev(""); }}
              />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 7. FULL-WIDTH GARDEN IMAGE ══ */}
        <Sec title="Full-Width Garden Image" badge="Pull Quote">
          <F label="Garden Image" hint="Recommended 1920×800px">
            <SingleImg
              preview={gardenImagePrev}
              badge="Garden"
              hint="JPG/PNG/WEBP · Full width"
              onSelect={(f, p) => { setGardenImageFile(f); setGardenImagePrev(p); }}
              onRemove={() => { setGardenImageFile(null); setGardenImagePrev(""); }}
            />
          </F>
          <F label="Pull Quote Text">
            <div className={styles.inputWrap}>
              <textarea
                className={`${styles.input} ${styles.textarea}`}
                rows={3}
                {...register("pullQuoteText")}
                placeholder="Yoga is not about touching your toes..."
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 8. WHAT MAKES AYM SPECIAL SECTION ══ */}
        <Sec title="What Makes AYM Special" badge="Why AYM">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("aymSpecialSuperLabel")} />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("aymSpecialSectionTitle")} />
            </div>
          </F>
          <F label="Additional Paragraphs">
            {aymSpecialParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={aymSpecialParaList.ids.length}
                onSave={aymSpecialParaList.save}
                onRemove={aymSpecialParaList.remove}
                value={aymSpecialParaList.ref.current[id]}
                ph="Additional information about AYM..."
              />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={aymSpecialParaList.add}>
              ＋ Add Paragraph
            </button>
          </F>
          <F label="AYM Special Cards">
            <AYMSpecialManager items={aymSpecial} onChange={setAymSpecial} />
          </F>
        </Sec>
        <D />

        {/* ══ 9. TEACHER PHOTO STRIP ══ */}
        <Sec title="Teacher Photo Strip" badge="Bottom Banner">
          <F label="Ubud/Teacher Image" hint="Recommended 1920×600px">
            <SingleImg
              preview={ubudImagePrev}
              badge="Teacher Strip"
              hint="JPG/PNG/WEBP · Full width"
              onSelect={(f, p) => { setUbudImageFile(f); setUbudImagePrev(p); }}
              onRemove={() => { setUbudImageFile(null); setUbudImagePrev(""); }}
            />
          </F>
          <F label="Teacher Caption Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("teacherCaptionText")} placeholder="Experience the transformative power of yoga in the heart of Bali" />
            </div>
          </F>
        </Sec>
        <D />

       

       

        {/* ══ 12. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="bali-yoga-teacher-training"
                  {...register("slug", { required: "Slug is required" })}
                />
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

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/yoga-course-bali" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} /> Saving…
            </>
          ) : (
            <>
              <span>✦</span> {isEdit ? "Update" : "Save"} Bali Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}