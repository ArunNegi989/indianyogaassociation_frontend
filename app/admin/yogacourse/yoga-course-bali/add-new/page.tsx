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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

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

/* ─────────────────────────────────────────
   DUAL IMAGE FIELD — Upload OR URL
   Shows the preview from either source.
   Priority: uploaded file > url > nothing
───────────────────────────────────────── */
interface DualImageProps {
  badge?: string;
  hint: string;
  error?: string;
  /** Preview from existing DB path (already resolved to full URL) */
  existingPreview: string;
  onFileSelect: (f: File, localPreview: string) => void;
  onFileRemove: () => void;
  onUrlChange: (url: string) => void;
  urlValue: string;
  /** Active preview to show (caller manages this) */
  preview: string;
}

function DualImageField({
  badge,
  hint,
  error,
  preview,
  urlValue,
  onFileSelect,
  onFileRemove,
  onUrlChange,
}: DualImageProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {(["upload", "url"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              padding: "4px 14px",
              borderRadius: 6,
              border: `1.5px solid ${tab === t ? "#f15505" : "#e8d5b5"}`,
              background: tab === t ? "#fff5f0" : "white",
              color: tab === t ? "#f15505" : "#888",
              fontWeight: tab === t ? 700 : 400,
              fontSize: 12,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            {t === "upload" ? "📁 Upload File" : "🔗 Image URL"}
          </button>
        ))}
      </div>

      {/* Upload tab */}
      {tab === "upload" && (
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
                    onFileSelect(f, URL.createObjectURL(f));
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
                      onFileSelect(f, URL.createObjectURL(f));
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
                  onFileRemove();
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* URL tab */}
      {tab === "url" && (
        <div>
          <div className={styles.inputWrap} style={{ marginBottom: 10 }}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={urlValue}
              placeholder="https://example.com/image.jpg"
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>
          {urlValue && (
            <div
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                maxHeight: 200,
              }}
            >
              <img
                src={urlValue}
                alt="URL preview"
                style={{
                  width: "100%",
                  maxHeight: 200,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 10,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {badge && (
                <span
                  className={styles.imageBadge}
                  style={{ position: "absolute", top: 8, left: 8 }}
                >
                  {badge}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
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

/* ══ Dynamic list managers (same as before) ══ */

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
    body: "Home to various Hindu ceremonies and traditions. Since Bali is predominantly Hindu while the rest of Indonesia is Muslim, it creates a unique cultural vibe.",
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

interface CourseItem {
  id: string;
  hrs: string;
  tag: string;
  color: string;
  title: string;
  url: string;
  desc: string;
}
const DEFAULT_COURSES: CourseItem[] = [
  {
    id: "c1",
    hrs: "200",
    tag: "Foundation",
    color: "#F15505",
    title: "200-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "The internationally recognized standard certification to begin your journey as a yoga teacher.",
  },
  {
    id: "c2",
    hrs: "300",
    tag: "Advanced",
    color: "#f15505",
    title: "300-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "An advanced course for 200-hour certified teachers to expand their knowledge and skills.",
  },
  {
    id: "c3",
    hrs: "500",
    tag: "Mastery",
    color: "#7a3f00",
    title: "500-Hour Yoga Teacher Training in Bali",
    url: "/contact",
    desc: "A comprehensive, advanced-level program for those seeking complete mastery in yoga instruction.",
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
      {
        id: `c-${Date.now()}`,
        hrs: "",
        tag: "",
        color: "#F15505",
        title: "",
        url: "",
        desc: "",
      },
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
                    placeholder="#F15505"
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

function HighlightsManager({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const update = useCallback(
    (idx: number, val: string) => {
      const n = [...items];
      n[idx] = val;
      onChange(n);
    },
    [items, onChange],
  );
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

function DestHighlightsManager({
  items,
  onChange,
}: {
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const update = useCallback(
    (idx: number, val: string) => {
      const n = [...items];
      n[idx] = val;
      onChange(n);
    },
    [items, onChange],
  );
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

interface AYMSpecialItem {
  id: string;
  num: string;
  title: string;
  body: string;
}
const DEFAULT_AYM_SPECIAL: AYMSpecialItem[] = [
  {
    id: "as1",
    num: "01",
    title: "Steadiness of Practice",
    body: "Comprehensive knowledge of yoga techniques, skillfulness in yogic postures, and philosophy makes our curriculum the best yoga teacher training in Bali.",
  },
  {
    id: "as2",
    num: "02",
    title: "Coherent Structure",
    body: "We structured our curriculum so that even beginners and advanced practitioners obtain a comprehensive overview of Hatha Yoga.",
  },
  {
    id: "as3",
    num: "03",
    title: "Morning Rituals",
    body: "Our day begins with the practice of meditation, hatha yoga practice and morning chants; with personalised interaction to provide a family-like atmosphere.",
  },
  {
    id: "as4",
    num: "04",
    title: "Teaching Professionalisation",
    body: "During your yoga teacher training, we will provide plenty of opportunities to professionalise your teaching skills.",
  },
  {
    id: "as5",
    num: "05",
    title: "Yoga Alliance Standards",
    body: "Our curriculum meets the standards of the internationally acclaimed Yoga Alliance.",
  },
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
      {
        id: `as-${Date.now()}`,
        num: String(items.length + 1).padStart(2, "0"),
        title: "",
        body: "",
      },
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

/* ══ IMAGE STATE HELPER ══
   Each image has:
   - file: File | null  (upload)
   - preview: string    (local blob OR resolved DB url)
   - url: string        (external URL input)
   - error: string
*/
interface ImgState {
  file: File | null;
  preview: string; // blob or existing DB url
  url: string; // url-tab value
  error: string;
}
function initImg(): ImgState {
  return { file: null, preview: "", url: "", error: "" };
}

/* ══════════════════════════════════════════
   FORM VALUES
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  pageTitleH1: string;
  heroImgAlt: string;
  heroCaption?: string;
  introBannerTitle: string;
  introSuperLabel: string;
  introTitle: string;
  uniquePointsSectionTitle: string;
  uniquePointsSuperLabel: string;
  destSuperLabel: string;
  destTitle: string;
  coursesSuperLabel: string;
  coursesSectionTitle: string;
  highlightsSuperLabel: string;
  highlightsSectionTitle: string;
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

  /* ── Image states ── */
  const [heroImg, setHeroImg] = useState<ImgState>(initImg());
  const [groupImg, setGroupImg] = useState<ImgState>(initImg());
  const [templeImg, setTempleImg] = useState<ImgState>(initImg());
  const [riceImg, setRiceImg] = useState<ImgState>(initImg());
  const [practiceImg, setPracticeImg] = useState<ImgState>(initImg());
  const [teacherImg, setTeacherImg] = useState<ImgState>(initImg());
  const [gardenImg, setGardenImg] = useState<ImgState>(initImg());
  const [ubudImg, setUbudImg] = useState<ImgState>(initImg());

  /* Helper to build effective preview (file blob > url) */
  const effectivePreview = (s: ImgState) => s.preview || s.url;

  /* Helper to update a single image state field */
  const setImg = (setter: React.Dispatch<React.SetStateAction<ImgState>>) => ({
    onFileSelect: (f: File, p: string) =>
      setter((prev) => ({ ...prev, file: f, preview: p, error: "" })),
    onFileRemove: () =>
      setter((prev) => ({ ...prev, file: null, preview: "", error: "" })),
    onUrlChange: (u: string) =>
      setter((prev) => ({
        ...prev,
        url: u,
        file: null,
        preview: "",
        error: "",
      })),
  });

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
  const [uniquePoints, setUniquePoints] = useState<UniquePointItem[]>(
    DEFAULT_UNIQUE_POINTS,
  );
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
  const [aymSpecial, setAymSpecial] =
    useState<AYMSpecialItem[]>(DEFAULT_AYM_SPECIAL);

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
      pageTitleH1:
        "Bali: Take Your 200 Hour Yoga Teacher Training to the Next Level in Paradise",
      heroImgAlt: "Yoga Students Group",
      heroCaption: "Yoga Students Group",
      introBannerTitle:
        "Bali: Take Your 200 Hour Yoga Teacher Training to the Next Level in Paradise",
      introSuperLabel: "Sacred Island",
      introTitle: "What Make Bali Unique for Yoga Teacher Training in Bali",
      uniquePointsSectionTitle: "What Makes Bali Unique",
      uniquePointsSuperLabel: "Sacred Island",
      destSuperLabel: "Our Location",
      destTitle: "Our Destination",
      coursesSuperLabel: "Programmes",
      coursesSectionTitle: "Courses Provided",
      highlightsSuperLabel: "Curriculum",
      highlightsSectionTitle: "Highlights of the Courses",
      aymSpecialSuperLabel: "Why AYM",
      aymSpecialSectionTitle: "What makes AYM yoga school training special?",
      pullQuoteText:
        "Yoga is not about touching your toes. It is what you learn on the way down.",
      teacherCaptionText:
        "Experience the transformative power of yoga in the heart of Bali",
      footerTitle: "AYM Yoga School Bali",
      footerLoc: "Ubud, Bali, Indonesia",
      footerMail: "info@aymyogaschool.com",
      footerTag: "Yoga Alliance Certified · 200/300/500 Hour TTC · Since 2001",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    if (!isEdit) return;
    setLoadingData(true);
    api
      .get("/bali-page")
      .then((res) => {
        const d = res.data?.data;
        if (!d) return;

        const textFields: (keyof PageFormValues)[] = [
          "slug",
          "status",
          "pageTitleH1",
          "heroImgAlt",
          "heroCaption",
          "introBannerTitle",
          "introSuperLabel",
          "introTitle",
          "uniquePointsSectionTitle",
          "uniquePointsSuperLabel",
          "destSuperLabel",
          "destTitle",
          "coursesSuperLabel",
          "coursesSectionTitle",
          "highlightsSuperLabel",
          "highlightsSectionTitle",
          "aymSpecialSuperLabel",
          "aymSpecialSectionTitle",
          "pullQuoteText",
          "teacherCaptionText",
          "footerTitle",
          "footerLoc",
          "footerMail",
          "footerTag",
        ];
        textFields.forEach((k) => {
          if (d[k] !== undefined) setValue(k, d[k]);
        });

        /* Rich text refs */
        introTextRef.current = d.introBannerText || d.introText || "";
        uniquePointsCenterParaRef.current = d.uniquePointsCenterPara || "";
        destPara1Ref.current = d.destPara1 || "";
        destPara2Ref.current = d.destPara2 || "";
        coursesCenterParaRef.current = d.coursesCenterPara || "";
        highlightsPara1Ref.current = d.highlightsPara1 || "";
        highlightsPara2Ref.current = d.highlightsPara2 || "";

        /* Para lists */
        if (d.introParagraphs?.length)
          introParaList.loadFromArray(d.introParagraphs, "ip");
        if (d.uniquePointsParagraphs?.length)
          uniquePointsParaList.loadFromArray(d.uniquePointsParagraphs, "up");
        let aymParas = d.aymSpecialParagraphs;
        if (typeof aymParas === "string") {
          try {
            aymParas = JSON.parse(aymParas);
          } catch {
            aymParas = [];
          }
        }
        if (aymParas?.length) aymSpecialParaList.loadFromArray(aymParas, "asp");

        /* Images — set preview from existing DB path */
        const resolveImg = (path?: string) =>
          path ? (path.startsWith("http") ? path : BASE_URL + path) : "";
        setHeroImg((p) => ({ ...p, preview: resolveImg(d.heroImage) }));
        setGroupImg((p) => ({ ...p, preview: resolveImg(d.groupImage) }));
        setTempleImg((p) => ({ ...p, preview: resolveImg(d.templeImage) }));
        setRiceImg((p) => ({ ...p, preview: resolveImg(d.riceImage) }));
        setPracticeImg((p) => ({ ...p, preview: resolveImg(d.practiceImage) }));
        setTeacherImg((p) => ({ ...p, preview: resolveImg(d.teacherImage) }));
        setGardenImg((p) => ({ ...p, preview: resolveImg(d.gardenImage) }));
        setUbudImg((p) => ({ ...p, preview: resolveImg(d.ubudImage) }));

        /* Dynamic lists */
        if (d.uniquePoints?.length) setUniquePoints(d.uniquePoints);
        if (d.courses?.length) setCourses(d.courses);
        if (d.highlights?.length) setHighlights(d.highlights);
        if (d.destHighlights?.length) setDestHighlights(d.destHighlights);
        if (d.aymSpecial?.length) setAymSpecial(d.aymSpecial);
      })
      .catch(() => {
        toast.error("Failed to load page data");
        router.push("/admin/yogacourse/yoga-course-bali");
      })
      .finally(() => setLoadingData(false));
  }, [isEdit, pageId]);

  /* ── Submit ── */
  const onSubmit = async (data: PageFormValues) => {
    if (!effectivePreview(heroImg)) {
      setHeroImg((p) => ({ ...p, error: "Hero image is required" }));
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new FormData();

      /* Basic fields */
      Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ""));

      /* Rich text */
      fd.append("introBannerText", introTextRef.current || "");
      fd.append("introText", introTextRef.current || "");
      fd.append(
        "uniquePointsCenterPara",
        uniquePointsCenterParaRef.current || "",
      );
      fd.append("destPara1", destPara1Ref.current || "");
      fd.append("destPara2", destPara2Ref.current || "");
      fd.append("coursesCenterPara", coursesCenterParaRef.current || "");
      fd.append("highlightsPara1", highlightsPara1Ref.current || "");
      fd.append("highlightsPara2", highlightsPara2Ref.current || "");

      /* Para lists */
      fd.append(
        "introParagraphs",
        JSON.stringify(
          introParaList.ids.map((id) => introParaList.ref.current[id] || ""),
        ),
      );
      fd.append(
        "uniquePointsParagraphs",
        JSON.stringify(
          uniquePointsParaList.ids.map(
            (id) => uniquePointsParaList.ref.current[id] || "",
          ),
        ),
      );
      fd.append(
        "aymSpecialParagraphs",
        JSON.stringify(
          aymSpecialParaList.ids.map(
            (id) => aymSpecialParaList.ref.current[id] || "",
          ),
        ),
      );

      /* Dynamic lists */
      fd.append("uniquePoints", JSON.stringify(uniquePoints));
      fd.append("courses", JSON.stringify(courses));
      fd.append("highlights", JSON.stringify(highlights));
      fd.append("destHighlights", JSON.stringify(destHighlights));
      fd.append("aymSpecial", JSON.stringify(aymSpecial));

      /* Images — file takes priority; if no file, send URL (backend stores it as-is) */
      const appendImage = (fieldName: string, state: ImgState) => {
        if (state.file) {
          fd.append(fieldName, state.file);
        } else if (state.url) {
          // Send URL as a plain text field so backend can store it
          fd.append(`${fieldName}Url`, state.url);
        }
        // If only preview (existing DB path) — don't send anything; backend keeps existing
      };

      appendImage("heroImage", heroImg);
      appendImage("groupImage", groupImg);
      appendImage("templeImage", templeImg);
      appendImage("riceImage", riceImg);
      appendImage("practiceImage", practiceImg);
      appendImage("teacherImage", teacherImg);
      appendImage("gardenImage", gardenImg);
      appendImage("ubudImage", ubudImg);

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
      setTimeout(() => router.push("/admin/yogacourse/yoga-course-bali"), 1500);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Something went wrong",
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

  /* ── Shorthand handlers ── */
  const heroH = setImg(setHeroImg);
  const groupH = setImg(setGroupImg);
  const templeH = setImg(setTempleImg);
  const riceH = setImg(setRiceImg);
  const practiceH = setImg(setPracticeImg);
  const teacherH = setImg(setTeacherImg);
  const gardenH = setImg(setGardenImg);
  const ubudH = setImg(setUbudImg);

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
            Hero · Intro · Unique Points · Destination · Courses · Highlights ·
            AYM Special · Footer
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
        {/* ══ 1. HERO ══ */}
        <Sec title="Hero Section">
          <F label="Page H1 Heading" req>
            <div
              className={`${styles.inputWrap} ${errors.pageTitleH1 ? styles.inputError : ""}`}
            >
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("pageTitleH1", { required: "Required" })}
              />
            </div>
            {errors.pageTitleH1 && (
              <p className={styles.errorMsg}>⚠ {errors.pageTitleH1.message}</p>
            )}
          </F>
          <F
            label="Hero Image"
            req
            hint="Recommended 1180×540px · Upload a file OR paste an image URL"
          >
            <DualImageField
              badge="Hero"
              hint="JPG/PNG/WEBP · 1180×540px"
              error={heroImg.error}
              existingPreview={heroImg.preview}
              preview={effectivePreview(heroImg)}
              urlValue={heroImg.url}
              {...heroH}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                {...register("heroImgAlt")}
              />
            </div>
          </F>
          <F label="Hero Caption (optional)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("heroCaption")}
                placeholder="Yoga Students Group"
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. INTRO BANNER ══ */}
        <Sec title="Intro Banner" badge="What is Bali">
          <F label="Intro Banner Title">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("introBannerTitle")}
              />
            </div>
          </F>
          <F label="Intro Banner Text">
            <StableJodit
              onSave={(v) => {
                introTextRef.current = v;
              }}
              value={introTextRef.current}
              h={150}
              ph="Bali is an Island situated between the Indian and Pacific Ocean..."
            />
          </F>
          <F
            label="Additional Intro Paragraphs"
            hint="These appear below the banner text"
          >
            {introParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={introParaList.ids.length}
                onSave={introParaList.save}
                onRemove={introParaList.remove}
                value={introParaList.ref.current[id]}
                ph="Additional paragraph..."
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={introParaList.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 3. WHAT MAKES BALI UNIQUE ══ */}
        <Sec title="What Makes Bali Unique Section" badge="Sacred Island">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("introSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("introTitle")} />
            </div>
          </F>
          <F label="Center Paragraph">
            <StableJodit
              onSave={(v) => {
                uniquePointsCenterParaRef.current = v;
              }}
              value={uniquePointsCenterParaRef.current}
              h={200}
              ph="It is the home of various Hindus ceremonies and traditions..."
            />
          </F>
          <F label="Additional Paragraphs">
            {uniquePointsParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={uniquePointsParaList.ids.length}
                onSave={uniquePointsParaList.save}
                onRemove={uniquePointsParaList.remove}
                value={uniquePointsParaList.ref.current[id]}
                ph="Additional unique points paragraph..."
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={uniquePointsParaList.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
          <F label="Unique Points Cards">
            <UniquePointsManager
              items={uniquePoints}
              onChange={setUniquePoints}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. DESTINATION ══ */}
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
              onSave={(v) => {
                destPara1Ref.current = v;
              }}
              value={destPara1Ref.current}
              h={150}
              ph="Our AYM yoga school is situated in Ubud, the yoga capital of Bali..."
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => {
                destPara2Ref.current = v;
              }}
              value={destPara2Ref.current}
              h={150}
              ph="Filled with lush green paddy field, picturesque temple..."
            />
          </F>
          <F label="Destination Highlights (pills)">
            <DestHighlightsManager
              items={destHighlights}
              onChange={setDestHighlights}
            />
          </F>

          {/* Destination Images */}
          <F
            label="Group Image (Bottom Full-Width)"
            hint="Recommended 1100×700px · Upload OR URL"
          >
            <DualImageField
              badge="Group"
              hint="JPG/PNG/WEBP · 1100×700px"
              error={groupImg.error}
              existingPreview={groupImg.preview}
              preview={effectivePreview(groupImg)}
              urlValue={groupImg.url}
              {...groupH}
            />
          </F>
          <div className={styles.grid2}>
            <F label="Temple Image (Top-Left)" hint="Upload OR paste URL">
              <DualImageField
                badge="Temple"
                hint="JPG/PNG/WEBP · 900×600px"
                error={templeImg.error}
                existingPreview={templeImg.preview}
                preview={effectivePreview(templeImg)}
                urlValue={templeImg.url}
                {...templeH}
              />
            </F>
            <F
              label="Rice Terraces Image (Top-Right)"
              hint="Upload OR paste URL"
            >
              <DualImageField
                badge="Rice"
                hint="JPG/PNG/WEBP · 900×600px"
                error={riceImg.error}
                existingPreview={riceImg.preview}
                preview={effectivePreview(riceImg)}
                urlValue={riceImg.url}
                {...riceH}
              />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 5. FULL-WIDTH GARDEN IMAGE (between dest and courses) ══ */}
        <Sec
          title="Full-Width Break Image + Pull Quote"
          badge="Mid-Page Banner"
        >
          <F
            label="Garden / Break Image"
            hint="Recommended 1920×800px · Upload OR paste URL"
          >
            <DualImageField
              badge="Garden"
              hint="JPG/PNG/WEBP · Full width 1920×800px"
              error={gardenImg.error}
              existingPreview={gardenImg.preview}
              preview={effectivePreview(gardenImg)}
              urlValue={gardenImg.url}
              {...gardenH}
            />
          </F>
          <F
            label="Pull Quote Text"
            hint="Displayed centered over the garden image"
          >
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

        {/* ══ 6. COURSES ══ */}
        <Sec title="Courses Section" badge="200/300/500 Hour">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("coursesSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("coursesSectionTitle")}
              />
            </div>
          </F>
          <F label="Center Paragraph">
            <StableJodit
              onSave={(v) => {
                coursesCenterParaRef.current = v;
              }}
              value={coursesCenterParaRef.current}
              h={150}
              ph="Our curriculum caters to all the requirements of all yoga practitioners..."
            />
          </F>
          <F label="Courses Cards">
            <CoursesManager items={courses} onChange={setCourses} />
          </F>
        </Sec>
        <D />

        {/* ══ 7. HIGHLIGHTS ══ */}
        <Sec title="Highlights Section" badge="Curriculum">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("highlightsSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("highlightsSectionTitle")}
              />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => {
                highlightsPara1Ref.current = v;
              }}
              value={highlightsPara1Ref.current}
              h={150}
              ph="The keystone of our courses is comprehensive studies of Hatha Yoga..."
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => {
                highlightsPara2Ref.current = v;
              }}
              value={highlightsPara2Ref.current}
              h={150}
              ph="Extensive studies of yogic philosophy frame our training courses..."
            />
          </F>
          <F label="Highlights List">
            <HighlightsManager items={highlights} onChange={setHighlights} />
          </F>
          <div className={styles.grid2}>
            <F label="Practice Image (Left)" hint="Upload OR paste URL">
              <DualImageField
                badge="Practice"
                hint="JPG/PNG/WEBP · 900×600px"
                error={practiceImg.error}
                existingPreview={practiceImg.preview}
                preview={effectivePreview(practiceImg)}
                urlValue={practiceImg.url}
                {...practiceH}
              />
            </F>
            <F label="Teacher Image (Right)" hint="Upload OR paste URL">
              <DualImageField
                badge="Teacher"
                hint="JPG/PNG/WEBP · 900×600px"
                error={teacherImg.error}
                existingPreview={teacherImg.preview}
                preview={effectivePreview(teacherImg)}
                urlValue={teacherImg.url}
                {...teacherH}
              />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 8. WHAT MAKES AYM SPECIAL ══ */}
        <Sec title="What Makes AYM Special" badge="Why AYM">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("aymSpecialSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("aymSpecialSectionTitle")}
              />
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
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={aymSpecialParaList.add}
            >
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
          <F
            label="Ubud / Teacher Banner Image"
            hint="Recommended 1920×600px · Upload OR paste URL"
          >
            <DualImageField
              badge="Teacher Strip"
              hint="JPG/PNG/WEBP · Full width 1920×600px"
              error={ubudImg.error}
              existingPreview={ubudImg.preview}
              preview={effectivePreview(ubudImg)}
              urlValue={ubudImg.url}
              {...ubudH}
            />
          </F>
          <F label="Teacher Caption Text">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("teacherCaptionText")}
                placeholder="Experience the transformative power of yoga in the heart of Bali"
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 10. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div
                className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="bali-yoga-teacher-training"
                  {...register("slug", { required: "Slug is required" })}
                />
              </div>
              {errors.slug && (
                <p className={styles.errorMsg}>⚠ {errors.slug.message}</p>
              )}
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
          <div className={styles.grid2}>
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
                <input
                  className={styles.input}
                  type="email"
                  {...register("footerMail")}
                />
              </div>
            </F>
            <F label="Footer Tag">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("footerTag")} />
              </div>
            </F>
          </div>
        </Sec>
      </div>

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link
          href="/admin/yogacourse/yoga-course-bali"
          className={styles.cancelBtn}
        >
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
