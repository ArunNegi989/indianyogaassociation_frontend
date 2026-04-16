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

/* ─── Stable Jodit ───
   ✅ FIX (Cursor Jump):
   - initialValue sirf ek baar mount par read hoti hai (useRef se)
   - value prop ka useEffect HATA DIYA — yahi cursor ko pehle
     position par jump karata tha har keystroke par
   - onChange se sirf parent ka ref update hota hai, editor ka
     internal state disturb nahi hota
─── */
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
  const initialValue = useRef(value || ""); // mount par ek baar set, baad mein nahi
  const wrapRef = useRef<HTMLDivElement>(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const config = useMemo(() => makeConfig(ph, h), [ph, h]);

  // Sirf parent ko notify karo — editor ka state khud manage karta hai
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
    <div
      ref={wrapRef}
      className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
      style={{ minHeight: h }}
    >
      {visible ? (
        <JoditEditor
          config={config}
          value={initialValue.current}
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
  const initialValue = useRef(value || "");
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
          value={initialValue.current}
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

/* ── Ayurveda Courses ── */
interface AyurvedaCourseItem {
  id: string;
  level: string;
  fee: string;
  days: string;
  cert: string;
  color: string;
  image?: string;
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
    color: "#F15505",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "ac2",
    level: "Intermediate",
    fee: "800 USD",
    days: "15 Days",
    cert: "Ayurveda Experience Certificate",
    color: "#f15505",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "ac3",
    level: "Advance",
    fee: "1000 USD",
    days: "20 Days",
    cert: "Ayurveda Experience Certificate",
    color: "#7a3f00",
    imgUrl: "",
    imgPreview: "",
  },
];

function AyurvedaCoursesManager({
  items,
  onChange,
}: {
  items: AyurvedaCourseItem[];
  onChange: (v: AyurvedaCourseItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof AyurvedaCourseItem, value: any) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  // ✅ ek saath multiple fields — image upload stale closure fix
  const updateMany = useCallback(
    (id: string, patch: Partial<AyurvedaCourseItem>) => {
      onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      {
        id: `ac-${Date.now()}`,
        level: "",
        fee: "",
        days: "",
        cert: "Ayurveda Experience Certificate",
        color: "#F15505",
        imgUrl: "",
        imgPreview: "",
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
              Ayurveda {item.level || "New"} Course
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
                  Level
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.level}
                    placeholder="Beginner / Intermediate / Advance"
                    onChange={(e) => update(item.id, "level", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Fee
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.fee}
                    placeholder="405 USD"
                    onChange={(e) => update(item.id, "fee", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Duration
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.days}
                    placeholder="7 Days"
                    onChange={(e) => update(item.id, "days", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Certification
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.cert}
                    placeholder="Ayurveda Experience Certificate"
                    onChange={(e) => update(item.id, "cert", e.target.value)}
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
                Course Image URL (optional)
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.imgUrl || ""}
                  placeholder="https://…"
                  onChange={(e) => update(item.id, "imgUrl", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Or Upload Course Image
              </label>
              <SingleImg
                preview={item.imgPreview || ""}
                badge="Course"
                hint="JPG/PNG/WEBP · 600×400px"
                error=""
                onSelect={(f, p) =>
                  updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })
                }
                onRemove={() =>
                  updateMany(item.id, { imgFile: null, imgPreview: "" })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Ayurveda Course
      </button>
    </div>
  );
}

/* ── Panchakarma Courses ── */
interface PanchaKarmaCourseItem {
  id: string;
  level: string;
  fee: string;
  days: string;
  cert: string;
  color: string;
  image?: string;
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
    color: "#F15505",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "pk2",
    level: "Intermediate",
    fee: "470 USD",
    days: "10 Days",
    cert: "Ayurveda Experience Certificate",
    color: "#888888",
    imgUrl: "",
    imgPreview: "",
  },
  {
    id: "pk3",
    level: "Advance",
    fee: "653 USD",
    days: "14 Days",
    cert: "Ayurveda Experience Certificate",
    color: "#F15505",
    imgUrl: "",
    imgPreview: "",
  },
];

function PanchaKarmaCoursesManager({
  items,
  onChange,
}: {
  items: PanchaKarmaCourseItem[];
  onChange: (v: PanchaKarmaCourseItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof PanchaKarmaCourseItem, value: any) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const updateMany = useCallback(
    (id: string, patch: Partial<PanchaKarmaCourseItem>) => {
      onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      {
        id: `pk-${Date.now()}`,
        level: "",
        fee: "",
        days: "",
        cert: "Ayurveda Experience Certificate",
        color: "#F15505",
        imgUrl: "",
        imgPreview: "",
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
              Panchakarma {item.level || "New"} Course
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
                  Level
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.level}
                    placeholder="Beginner / Intermediate / Advance"
                    onChange={(e) => update(item.id, "level", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Fee
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.fee}
                    placeholder="330 USD"
                    onChange={(e) => update(item.id, "fee", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Duration
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.days}
                    placeholder="7 Days"
                    onChange={(e) => update(item.id, "days", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Certification
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.cert}
                    placeholder="Ayurveda Experience Certificate"
                    onChange={(e) => update(item.id, "cert", e.target.value)}
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
                Course Image URL (optional)
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.imgUrl || ""}
                  placeholder="https://…"
                  onChange={(e) => update(item.id, "imgUrl", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Or Upload Course Image
              </label>
              <SingleImg
                preview={item.imgPreview || ""}
                badge="Course"
                hint="JPG/PNG/WEBP · 600×400px"
                error=""
                onSelect={(f, p) =>
                  updateMany(item.id, { imgFile: f, imgPreview: p, imgUrl: "" })
                }
                onRemove={() =>
                  updateMany(item.id, { imgFile: null, imgPreview: "" })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Panchakarma Course
      </button>
    </div>
  );
}

/* ── Therapies Manager ── */
interface TherapyItem {
  id: string;
  num: string;
  name: string;
  desc: string;
  icon: string;
}
const DEFAULT_THERAPIES: TherapyItem[] = [
  {
    id: "t1",
    num: "1",
    name: "Abhyanga",
    desc: "A herbal oil massage designed to deeply penetrate the skin…",
    icon: "🌿",
  },
  {
    id: "t2",
    num: "—",
    name: "Shirodhara",
    desc: "Administered gently and methodically by pouring warm herbalized oil…",
    icon: "🫙",
  },
  {
    id: "t3",
    num: "2",
    name: "Garshana",
    desc: "A kind of treatment which consists of a dry lymphatic skin…",
    icon: "✋",
  },
  {
    id: "t4",
    num: "3",
    name: "Swedana",
    desc: "An herbal steam bath…",
    icon: "♨️",
  },
  {
    id: "t5",
    num: "4",
    name: "Pizichili",
    desc: "A process in which continuous stream of warm herbal oil is poured…",
    icon: "💧",
  },
  {
    id: "t6",
    num: "5",
    name: "Udvartana",
    desc: "A kind of deep penetrating herbal paste used to give a lymphatic massage…",
    icon: "🌾",
  },
];
function TherapiesManager({
  items,
  onChange,
}: {
  items: TherapyItem[];
  onChange: (v: TherapyItem[]) => void;
}) {
  const update = (id: string, field: keyof TherapyItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([
      ...items,
      {
        id: `th-${Date.now()}`,
        num: String(items.length + 1),
        name: "",
        desc: "",
        icon: "🌿",
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
              Therapy: {item.name || "New"}
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
                  Number/Order
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.num}
                    placeholder="1"
                    onChange={(e) => update(item.id, "num", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Icon Emoji
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.icon}
                    placeholder="🌿"
                    onChange={(e) => update(item.id, "icon", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Therapy Name
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.name}
                    placeholder="Abhyanga"
                    onChange={(e) => update(item.id, "name", e.target.value)}
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
                  rows={3}
                  value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Therapy
      </button>
    </div>
  );
}

/* ── Doshas Manager ── */
interface DoshaItem {
  id: string;
  name: string;
  elements: string;
  color: string;
  symbol: string;
  desc: string;
}
const DEFAULT_DOSHAS: DoshaItem[] = [
  {
    id: "d1",
    name: "Vata",
    elements: "Air & Ether",
    color: "#5b8dd9",
    symbol: "🌬️",
    desc: "Governs movement, breathing, circulation and the nervous system.",
  },
  {
    id: "d2",
    name: "Pitta",
    elements: "Fire & Water",
    color: "#F15505",
    symbol: "🔥",
    desc: "Governs digestion, metabolism and energy production.",
  },
  {
    id: "d3",
    name: "Kapha",
    elements: "Water & Earth",
    color: "#27ae60",
    symbol: "🌊",
    desc: "Governs structure, lubrication and growth.",
  },
];
function DoshasManager({
  items,
  onChange,
}: {
  items: DoshaItem[];
  onChange: (v: DoshaItem[]) => void;
}) {
  const update = (id: string, field: keyof DoshaItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([
      ...items,
      {
        id: `d-${Date.now()}`,
        name: "",
        elements: "",
        color: "#F15505",
        symbol: "🌿",
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
              Dosha: {item.name || "New"}
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
                  Dosha Name
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.name}
                    placeholder="Vata"
                    onChange={(e) => update(item.id, "name", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Elements
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.elements}
                    placeholder="Air & Ether"
                    onChange={(e) =>
                      update(item.id, "elements", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Symbol Emoji
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.symbol}
                    placeholder="🌬️"
                    onChange={(e) => update(item.id, "symbol", e.target.value)}
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
                    placeholder="#5b8dd9"
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
                  rows={2}
                  value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Dosha
      </button>
    </div>
  );
}

/* ── Schedule Manager ── */
interface ScheduleItem {
  id: string;
  time: string;
  activity: string;
}
const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: "s1", time: "7:00", activity: "Hatha yoga asana class" },
  { id: "s2", time: "8:15", activity: "Herbal tea with snacks" },
  { id: "s3", time: "8:30", activity: "Ayurveda practice" },
  { id: "s4", time: "10:00", activity: "Breakfast" },
  { id: "s5", time: "11:00", activity: "Ayurveda lecture" },
  { id: "s6", time: "1:00", activity: "Lunch" },
  { id: "s7", time: "5:30", activity: "Hatha yoga" },
  { id: "s8", time: "7:00", activity: "Dinner" },
];
function ScheduleManager({
  items,
  onChange,
}: {
  items: ScheduleItem[];
  onChange: (v: ScheduleItem[]) => void;
}) {
  const update = (id: string, field: keyof ScheduleItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([...items, { id: `s-${Date.now()}`, time: "", activity: "" }]);
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
            <span className={styles.nestedCardNum}>Schedule Item</span>
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
                  Time
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.time}
                    placeholder="7:00"
                    onChange={(e) => update(item.id, "time", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Activity
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.activity}
                    placeholder="Hatha yoga asana class"
                    onChange={(e) =>
                      update(item.id, "activity", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Schedule Item
      </button>
    </div>
  );
}

/* ── Yoga Pricing Manager ── */
interface YogaPricingItem {
  id: string;
  hrs: string;
  title: string;
  price: string;
  note: string;
}
const DEFAULT_YOGA_PRICING: YogaPricingItem[] = [
  {
    id: "yp1",
    hrs: "200",
    title: "200 hour yoga ttc in India",
    price: "950 USD",
    note: "Accommodation Shared by two & Meals 100 USD per week",
  },
  {
    id: "yp2",
    hrs: "300",
    title: "300 hour yoga ttc in India",
    price: "1250 USD",
    note: "Accommodation Shared by two & Meal 100 USD per week",
  },
  {
    id: "yp3",
    hrs: "500",
    title: "500 hour yoga ttc in India",
    price: "2200 USD",
    note: "Accommodation Shared by two & Meal 100 USD per week",
  },
];
function YogaPricingManager({
  items,
  onChange,
}: {
  items: YogaPricingItem[];
  onChange: (v: YogaPricingItem[]) => void;
}) {
  const update = (id: string, field: keyof YogaPricingItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([
      ...items,
      { id: `yp-${Date.now()}`, hrs: "", title: "", price: "", note: "" },
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
            <span className={styles.nestedCardNum}>Yoga Pricing</span>
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
                  Title
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.title}
                    placeholder="200 hour yoga ttc in India"
                    onChange={(e) => update(item.id, "title", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Price
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.price}
                    placeholder="950 USD"
                    onChange={(e) => update(item.id, "price", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Note
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.note}
                    placeholder="Accommodation Shared…"
                    onChange={(e) => update(item.id, "note", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Yoga Pricing
      </button>
    </div>
  );
}

/* ── Massage Types Manager ── */
interface MassageTypeItem {
  id: string;
  num: string;
  name: string;
  desc: string;
}
const DEFAULT_MASSAGE_TYPES: MassageTypeItem[] = [
  {
    id: "mt1",
    num: "1",
    name: "Ayurvedic Massage",
    desc: "This type of massage starts with a head massage, shoulder massage, special back massage…",
  },
];
function MassageTypesManager({
  items,
  onChange,
}: {
  items: MassageTypeItem[];
  onChange: (v: MassageTypeItem[]) => void;
}) {
  const update = (id: string, field: keyof MassageTypeItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([
      ...items,
      {
        id: `mt-${Date.now()}`,
        num: String(items.length + 1),
        name: "",
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
              Massage Type: {item.name || "New"}
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
                    onChange={(e) => update(item.id, "num", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Name
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.name}
                    placeholder="Ayurvedic Massage"
                    onChange={(e) => update(item.id, "name", e.target.value)}
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
                  rows={5}
                  value={item.desc}
                  onChange={(e) => update(item.id, "desc", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>
        ＋ Add Massage Type
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
   ✅ FIX: "FormData" → "PageFormValues"
   Browser ke built-in FormData class se naam clash hota tha.
   Isliye `new FormData()` likhne par TypeScript apna interface
   inject kar deta tha — "Unexpected field" error aata tha.
   Ab `new window.FormData()` + rename dono milke fix karte hain.
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  pageTitleH1: string;
  heroImgAlt: string;
  introSuperLabel: string;
  introTitle: string;
  spaWelcomeText: string;
  doshasSuperLabel: string;
  doshasTitle: string;
  coursesSuperLabel: string;
  coursesSectionTitle: string;
  ayurvedaCoursesInIndiaTitle: string;
  panchakarmaHeading: string;
  spicesStripTitle: string;
  ayurvedaMassageCoursesHeading: string;
  yogaMassageTrainingHeading: string;
  yogaMassageDuration: string;
  yogaMassageCost: string;
  yogaMassageDates: string;
  registrationAdvanceFee: string;
  registrationPaymentLink: string;
  spiritualEnvironmentSuperLabel: string;
  spiritualEnvironmentTitle: string;
  pricingSuperLabel: string;
  pricingSectionTitle: string;
  applySuperLabel: string;
  applyTitle: string;
  applyNowHref: string;
  applyNowEmail: string;
  browseCoursesHref: string;
  footerTitle: string;
  footerLoc: string;
  footerMail: string;
  footerTag: string;
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
   MAIN FORM
══════════════════════════════════════════ */
export default function AddEditAyurvedaPage() {
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
  const [introRightFile, setIntroRightFile] = useState<File | null>(null);
  const [introRightPrev, setIntroRightPrev] = useState("");
  const [spicesFile, setSpicesFile] = useState<File | null>(null);
  const [spicesPrev, setSpicesPrev] = useState("");
  const [sunsetFile, setSunsetFile] = useState<File | null>(null);
  const [sunsetPrev, setSunsetPrev] = useState("");

  /* ── Rich text refs ── */
  const introText1Ref = useRef("");
  const introText2Ref = useRef("");
  const introListRef = useRef("");
  const spaBoxTextRef = useRef("");
  const doshasDescRef = useRef("");
  const pkPara1Ref = useRef("");
  const pkPara2Ref = useRef("");
  const pkPara3Ref = useRef("");
  const massagePara1Ref = useRef("");
  const massagePara2Ref = useRef("");
  const trainingDescRef = useRef("");
  const registrationBoxRef = useRef("");
  const spiritualCenterParaRef = useRef("");
  const spiritualBottomParaRef = useRef("");
  const applyTextRef = useRef("");

  /* ── Para lists ── */
  const introPara = useParaList("ip1");
  const pkPara = useParaList("pp1");
  const massagePara = useParaList("amp1");
  const trainingPara = useParaList("ymtp1");
  const spiritualPara = useParaList("sp1");

  /* ── Dynamic lists ── */
  const [ayurvedaCourses, setAyurvedaCourses] = useState<AyurvedaCourseItem[]>(
    DEFAULT_AYURVEDA_COURSES,
  );
  const [panchaKarmaCourses, setPanchaKarmaCourses] = useState<
    PanchaKarmaCourseItem[]
  >(DEFAULT_PANCHAKARMA_COURSES);
  const [therapies, setTherapies] = useState<TherapyItem[]>(DEFAULT_THERAPIES);
  const [doshas, setDoshas] = useState<DoshaItem[]>(DEFAULT_DOSHAS);
  const [dailySchedule, setDailySchedule] =
    useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [syllabus, setSyllabus] = useState<string[]>([
    "Fundamental principle of Ayurveda",
    "Learning Body constitution",
    "Decision about appropriate massage therapies",
    "Practice of Ayurveda oil massage",
    "Learning shiro abhyangam (Head Massage)",
    "Padho abhyangam (Foot massage)",
    "Mukha Abhyangam (Face massage)",
  ]);
  const [included, setIncluded] = useState<string[]>([
    "3 meals, Indian veg.",
    "Two yoga classes",
    "Ayurveda package",
    "Free Wi-Fi",
    "AYM Ayurveda Kit",
  ]);
  const [yogaPricing, setYogaPricing] =
    useState<YogaPricingItem[]>(DEFAULT_YOGA_PRICING);
  const [massageTypes, setMassageTypes] = useState<MassageTypeItem[]>(
    DEFAULT_MASSAGE_TYPES,
  );

  /* ✅ FIX: useForm<PageFormValues> — browser FormData se koi conflict nahi */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      slug: "",
      status: "Active",
      pageTitleH1: "Introductory Course in Ayurveda in Rishikesh India",
      heroImgAlt: "Yoga Students Group",
      introSuperLabel: "Ancient Science of Life",
      introTitle: "Introductory Course in Ayurveda in Rishikesh India",
      spaWelcomeText: "Welcome to Ayurveda Spa at AYM Yoga School",
      doshasSuperLabel: "The Three Bio-Energies",
      doshasTitle: "Tridosha — The Three Doshas",
      coursesSuperLabel: "Programmes",
      coursesSectionTitle: "Ayurveda Courses in Rishikesh",
      ayurvedaCoursesInIndiaTitle: "Ayurveda Courses in India",
      panchakarmaHeading: "About Panchakarma",
      spicesStripTitle: "Yoga and Panchakarma Training Course in India",
      ayurvedaMassageCoursesHeading: "Ayurveda Massage Courses Offered at AYM",
      yogaMassageTrainingHeading:
        "Yoga and Ayurvedic Massage Training in India",
      yogaMassageDuration: "7 – 10 days",
      yogaMassageCost: "28,000 – 40,000 INR",
      yogaMassageDates: "Open every month on 10th",
      registrationAdvanceFee: "210 US Dollars",
      registrationPaymentLink: "#",
      spiritualEnvironmentSuperLabel: "Sacred Setting",
      spiritualEnvironmentTitle: "Spiritual Environment in Rishikesh",
      pricingSuperLabel: "Investment",
      pricingSectionTitle: "Details of Price for Different Courses",
      applySuperLabel: "Enrolment",
      applyTitle: "How to Apply",
      applyNowHref: "mailto:aymyogaschool@gmail.com",
      applyNowEmail: "aymyogaschool@gmail.com",
      browseCoursesHref: "#courses",
      footerTitle: "AYM Ayurveda Clinic & Panchakarma Centre",
      footerLoc: "Rishikesh, Uttarakhand, India",
      footerMail: "aymyogaschool@gmail.com",
      footerTag:
        "5000 Years of Ancient Wisdom · Yoga Alliance Certified · AYM Est. 2001",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    if (!isEdit) return;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get(`/ayurveda-course/${pageId}`);
        const d = res.data.data;
        (
          [
            "slug",
            "status",
            "pageTitleH1",
            "heroImgAlt",
            "introSuperLabel",
            "introTitle",
            "spaWelcomeText",
            "doshasSuperLabel",
            "doshasTitle",
            "coursesSuperLabel",
            "coursesSectionTitle",
            "ayurvedaCoursesInIndiaTitle",
            "panchakarmaHeading",
            "spicesStripTitle",
            "ayurvedaMassageCoursesHeading",
            "yogaMassageTrainingHeading",
            "yogaMassageDuration",
            "yogaMassageCost",
            "yogaMassageDates",
            "registrationAdvanceFee",
            "registrationPaymentLink",
            "spiritualEnvironmentSuperLabel",
            "spiritualEnvironmentTitle",
            "pricingSuperLabel",
            "pricingSectionTitle",
            "applySuperLabel",
            "applyTitle",
            "applyNowHref",
            "applyNowEmail",
            "browseCoursesHref",
            "footerTitle",
            "footerLoc",
            "footerMail",
            "footerTag",
          ] as (keyof PageFormValues)[]
        ).forEach((k) => {
          if (d[k] !== undefined) setValue(k, d[k]);
        });

        /* Rich text: sirf ref update karo — StableJodit initialValue.current se read karega
           is wajah se cursor jump nahi hoga */
        introText1Ref.current = d.introText1 || "";
        introText2Ref.current = d.introText2 || "";
        introListRef.current = d.introList || "";
        spaBoxTextRef.current = d.spaBoxText || "";
        doshasDescRef.current = d.doshasDescription || "";
        pkPara1Ref.current = d.pkPara1 || "";
        pkPara2Ref.current = d.pkPara2 || "";
        pkPara3Ref.current = d.pkPara3 || "";
        massagePara1Ref.current = d.massagePara1 || "";
        massagePara2Ref.current = d.massagePara2 || "";
        trainingDescRef.current = d.trainingDesc || "";
        registrationBoxRef.current = d.registrationBoxText || "";
        spiritualCenterParaRef.current = d.spiritualCenterPara || "";
        spiritualBottomParaRef.current = d.spiritualBottomPara || "";
        applyTextRef.current = d.applyText || "";

        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.introRightImage) setIntroRightPrev(BASE_URL + d.introRightImage);
        if (d.spicesStripImage) setSpicesPrev(BASE_URL + d.spicesStripImage);
        if (d.sunsetImage) setSunsetPrev(BASE_URL + d.sunsetImage);

        if (d.introParagraphs?.length)
          introPara.loadFromArray(d.introParagraphs, "ip");
        if (d.pkParagraphs?.length) pkPara.loadFromArray(d.pkParagraphs, "pp");
        if (d.massageParagraphs?.length)
          massagePara.loadFromArray(d.massageParagraphs, "amp");
        if (d.trainingParagraphs?.length)
          trainingPara.loadFromArray(d.trainingParagraphs, "ymtp");
        if (d.spiritualParagraphs?.length)
          spiritualPara.loadFromArray(d.spiritualParagraphs, "sp");

if (Array.isArray(d?.ayurvedaCourses)) {
  setAyurvedaCourses(
    d.ayurvedaCourses.map((item: any) => ({
      ...item,
      imgPreview: item?.image ? BASE_URL + item.image : "",
      imgFile: null,
    })),
  );
}

if (Array.isArray(d?.panchaKarmaCourses)) {
  setPanchaKarmaCourses(
    d.panchaKarmaCourses.map((item: any) => ({
      ...item,
      imgPreview: item?.image ? BASE_URL + item.image : "",
      imgFile: null,
    })),
  );
}
        if (d.therapies?.length) setTherapies(d.therapies);
        if (d.doshas?.length) setDoshas(d.doshas);
        if (d.dailySchedule?.length) setDailySchedule(d.dailySchedule);
        if (d.syllabus?.length) setSyllabus(d.syllabus);
        if (d.included?.length) setIncluded(d.included);
        if (d.yogaPricing?.length) setYogaPricing(d.yogaPricing);
        if (d.massageTypes?.length) setMassageTypes(d.massageTypes);
      } catch {
        toast.error("Failed to load");
        router.push("/admin/yogacourse/yoga-ayurveda-teacher");
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

      /* ✅ FIX: window.FormData — PageFormValues interface se zero conflict */
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("introText1", introText1Ref.current);
      fd.append("introText2", introText2Ref.current);
      fd.append("introList", introListRef.current);
      fd.append("spaBoxText", spaBoxTextRef.current);
      fd.append("doshasDescription", doshasDescRef.current);
      fd.append("pkPara1", pkPara1Ref.current);
      fd.append("pkPara2", pkPara2Ref.current);
      fd.append("pkPara3", pkPara3Ref.current);
      fd.append("massagePara1", massagePara1Ref.current);
      fd.append("massagePara2", massagePara2Ref.current);
      fd.append("trainingDesc", trainingDescRef.current);
      fd.append("registrationBoxText", registrationBoxRef.current);
      fd.append("spiritualCenterPara", spiritualCenterParaRef.current);
      fd.append("spiritualBottomPara", spiritualBottomParaRef.current);
      fd.append("applyText", applyTextRef.current);

      introPara.ids.forEach((id, i) =>
        fd.append(`introParagraphs[${i}]`, introPara.ref.current[id] || ""),
      );
      pkPara.ids.forEach((id, i) =>
        fd.append(`pkParagraphs[${i}]`, pkPara.ref.current[id] || ""),
      );
      massagePara.ids.forEach((id, i) =>
        fd.append(`massageParagraphs[${i}]`, massagePara.ref.current[id] || ""),
      );
      trainingPara.ids.forEach((id, i) =>
        fd.append(
          `trainingParagraphs[${i}]`,
          trainingPara.ref.current[id] || "",
        ),
      );
      spiritualPara.ids.forEach((id, i) =>
        fd.append(
          `spiritualParagraphs[${i}]`,
          spiritualPara.ref.current[id] || "",
        ),
      );

      fd.append(
        "ayurvedaCourses",
        JSON.stringify(
          ayurvedaCourses.map(({ imgFile, imgPreview, ...r }) => r),
        ),
      );
      fd.append(
        "panchaKarmaCourses",
        JSON.stringify(
          panchaKarmaCourses.map(({ imgFile, imgPreview, ...r }) => r),
        ),
      );
      fd.append("therapies", JSON.stringify(therapies));
      fd.append("doshas", JSON.stringify(doshas));
      fd.append("dailySchedule", JSON.stringify(dailySchedule));
      fd.append("syllabus", JSON.stringify(syllabus));
      fd.append("included", JSON.stringify(included));
      fd.append("yogaPricing", JSON.stringify(yogaPricing));
      fd.append("massageTypes", JSON.stringify(massageTypes));

      ayurvedaCourses.forEach((c, i) => {
        if (c.imgFile) fd.append(`ayurvedaCourseImage_${i}`, c.imgFile);
      });
      panchaKarmaCourses.forEach((c, i) => {
        if (c.imgFile) fd.append(`panchaKarmaCourseImage_${i}`, c.imgFile);
      });

      if (heroFile) fd.append("heroImage", heroFile);
      if (introRightFile) fd.append("introRightImage", introRightFile);
      if (spicesFile) fd.append("spicesStripImage", spicesFile);
      if (sunsetFile) fd.append("sunsetImage", sunsetFile);

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
      setTimeout(
        () => router.push("/admin/yogacourse/yoga-ayurveda-teacher"),
        1500,
      );
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
            Ayurveda Page {isEdit ? "Updated" : "Saved"}!
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
          onClick={() => router.push("/admin/yogacourse/yoga-ayurveda-teacher")}
        >
          Ayurveda Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Page" : "Add New Page"}
        </span>
      </div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit
              ? "Edit Ayurveda Course Page"
              : "Add New Ayurveda Course Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Intro · Doshas · Courses · Panchakarma · Massage · Schedule ·
            Pricing · Apply · Footer
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
          <F label="Hero Image" req hint="Recommended 1180×540px">
            <SingleImg
              preview={heroPrev}
              badge="Hero"
              hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => {
                setHeroFile(f);
                setHeroPrev(p);
                setHeroErr("");
              }}
              onRemove={() => {
                setHeroFile(null);
                setHeroPrev("");
                setHeroErr("Hero image is required");
              }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Students Group"
                {...register("heroImgAlt")}
              />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ 2. INTRODUCTION ══ */}
        <Sec title="Introduction Section" badge="Left text + Right image">
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
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => {
                introText1Ref.current = v;
              }}
              value={introText1Ref.current}
              h={150}
              ph="Welcome to Ayurveda Clinic and Panchakarma centre at AYM…"
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => {
                introText2Ref.current = v;
              }}
              value={introText2Ref.current}
              h={150}
              ph="Ayurveda gives lots of importance to prevention along with the cure…"
            />
          </F>
          <F label="Intro List Items (ol)">
            <StableJodit
              onSave={(v) => {
                introListRef.current = v;
              }}
              value={introListRef.current}
              h={120}
              ph="<li>How to bring harmony between the nature and the body</li>"
            />
          </F>
          <F label="Right Side Image" hint="Recommended 600×500px">
            <SingleImg
              preview={introRightPrev}
              badge="Intro"
              hint="JPG/PNG/WEBP · 600×500px"
              error=""
              onSelect={(f, p) => {
                setIntroRightFile(f);
                setIntroRightPrev(p);
              }}
              onRemove={() => {
                setIntroRightFile(null);
                setIntroRightPrev("");
              }}
            />
          </F>
          <F label="Additional Intro Paragraphs">
            {introPara.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={introPara.ids.length}
                onSave={introPara.save}
                onRemove={introPara.remove}
                value={introPara.ref.current[id]}
                ph="Additional information about Ayurveda…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={introPara.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 3. SPA WELCOME BOX ══ */}
        <Sec title="Spa Welcome Box" badge="Full-width info box">
          <F label="Spa Welcome Heading / Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("spaWelcomeText")}
                placeholder="Welcome to Ayurveda Spa at AYM Yoga School"
              />
            </div>
          </F>
          <F label="Spa Box Body Text (Rich Text)">
            <StableJodit
              onSave={(v) => {
                spaBoxTextRef.current = v;
              }}
              value={spaBoxTextRef.current}
              h={160}
              ph="Ayurveda is the ancient science of life, how to live life healthy and happy…"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. DOSHAS SECTION ══ */}
        <Sec title="Doshas Section" badge="Tridosha">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("doshasSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("doshasTitle")} />
            </div>
          </F>
          <F label="Center Paragraph">
            <StableJodit
              onSave={(v) => {
                doshasDescRef.current = v;
              }}
              value={doshasDescRef.current}
              h={120}
              ph="Ayurveda prescribes Panchakarma therapies for cleansing body toxins…"
            />
          </F>
          <F label="Dosha Cards">
            <DoshasManager items={doshas} onChange={setDoshas} />
          </F>
        </Sec>
        <D />

        {/* ══ 5. COURSES SECTION ══ */}
        <Sec title="Courses Section" badge="Ayurveda & Panchakarma tabs">
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
          <F label="Ayurveda Tab Courses">
            <AyurvedaCoursesManager
              items={ayurvedaCourses}
              onChange={setAyurvedaCourses}
            />
          </F>
          <F label="Panchakarma Tab Courses">
            <PanchaKarmaCoursesManager
              items={panchaKarmaCourses}
              onChange={setPanchaKarmaCourses}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 6. AYURVEDA COURSES IN INDIA + PANCHAKARMA ══ */}
        <Sec
          title="Ayurveda Courses in India / Panchakarma"
          badge="panchBox + therapies"
        >
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("ayurvedaCoursesInIndiaTitle")}
              />
            </div>
          </F>
          <F label="Panchakarma Box Heading">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("panchakarmaHeading")}
              />
            </div>
          </F>
          <F label="Panchakarma Paragraph 1">
            <StableJodit
              onSave={(v) => {
                pkPara1Ref.current = v;
              }}
              value={pkPara1Ref.current}
              h={150}
              ph="PANCHAKARMA is a set of five karma 'procedures' that detoxify and rejuvenate the body…"
            />
          </F>
          <F label="Panchakarma Paragraph 2">
            <StableJodit
              onSave={(v) => {
                pkPara2Ref.current = v;
              }}
              value={pkPara2Ref.current}
              h={130}
              ph="Ayurveda is the science and art of healing and appropriate living…"
            />
          </F>
          <F label="Panchakarma Paragraph 3">
            <StableJodit
              onSave={(v) => {
                pkPara3Ref.current = v;
              }}
              value={pkPara3Ref.current}
              h={110}
              ph="AYM Kerala Panchakarma Center in Rishikesh includes five kinds of therapies…"
            />
          </F>
          <F label="Additional Panchakarma Paragraphs">
            {pkPara.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={pkPara.ids.length}
                onSave={pkPara.save}
                onRemove={pkPara.remove}
                value={pkPara.ref.current[id]}
                ph="Additional panchakarma content…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={pkPara.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
          <F label="Therapies">
            <TherapiesManager items={therapies} onChange={setTherapies} />
          </F>
        </Sec>
        <D />

        {/* ══ 7. SPICES IMAGE STRIP ══ */}
        <Sec title="Spices Image Strip" badge="Full-width overlay banner">
          <F label="Strip Title (H3)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("spicesStripTitle")}
              />
            </div>
          </F>
          <F label="Spices Strip Image" hint="Recommended 1920×600px">
            <SingleImg
              preview={spicesPrev}
              badge="Strip"
              hint="JPG/PNG/WEBP · Full width"
              onSelect={(f, p) => {
                setSpicesFile(f);
                setSpicesPrev(p);
              }}
              onRemove={() => {
                setSpicesFile(null);
                setSpicesPrev("");
              }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 8. PANCHAKARMA FULL CARDS ══ */}
        <Sec
          title="Panchakarma Full Cards (below strip)"
          badge="Same data as tab — reused"
        >
          <p className={styles.fieldHint} style={{ marginBottom: "0.5rem" }}>
            ℹ These cards use the same Panchakarma course data entered above. No
            extra fields needed.
          </p>
        </Sec>
        <D />

        {/* ══ 9. AYURVEDA MASSAGE COURSES ══ */}
        <Sec title="Ayurveda Massage Courses" badge="2 paras + massage types">
          <F label="Section Heading (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("ayurvedaMassageCoursesHeading")}
              />
            </div>
          </F>
          <F label="Center Paragraph 1">
            <StableJodit
              onSave={(v) => {
                massagePara1Ref.current = v;
              }}
              value={massagePara1Ref.current}
              h={140}
              ph="AYM Kerala Panchakarma Center in Rishikesh, India has come up with various Ayurveda treatment and massage courses…"
            />
          </F>
          <F label="Center Paragraph 2">
            <StableJodit
              onSave={(v) => {
                massagePara2Ref.current = v;
              }}
              value={massagePara2Ref.current}
              h={130}
              ph="There are different types of massages that are offered to relieve a person's mind & body…"
            />
          </F>
          <F label="Additional Massage Paragraphs">
            {massagePara.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={massagePara.ids.length}
                onSave={massagePara.save}
                onRemove={massagePara.remove}
                value={massagePara.ref.current[id]}
                ph="Additional massage courses content…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={massagePara.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
          <F label="Massage Types">
            <MassageTypesManager
              items={massageTypes}
              onChange={setMassageTypes}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 10. YOGA & AYURVEDIC MASSAGE TRAINING ══ */}
        <Sec
          title="Yoga & Ayurvedic Massage Training"
          badge="Schedule · Syllabus · Included"
        >
          <F label="Section Heading (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("yogaMassageTrainingHeading")}
              />
            </div>
          </F>
          <div className={styles.grid2}>
            <F label="Duration">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("yogaMassageDuration")}
                />
              </div>
            </F>
            <F label="Cost">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("yogaMassageCost")}
                />
              </div>
            </F>
            <F label="Dates">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("yogaMassageDates")}
                />
              </div>
            </F>
          </div>
          <F label="Training Description (Rich Text)">
            <StableJodit
              onSave={(v) => {
                trainingDescRef.current = v;
              }}
              value={trainingDescRef.current}
              h={130}
              ph="Additional training description…"
            />
          </F>
          <F label="Additional Training Paragraphs">
            {trainingPara.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={trainingPara.ids.length}
                onSave={trainingPara.save}
                onRemove={trainingPara.remove}
                value={trainingPara.ref.current[id]}
                ph="Additional information about training…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={trainingPara.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
          <F label="Daily Schedule">
            <ScheduleManager
              items={dailySchedule}
              onChange={setDailySchedule}
            />
          </F>
          <F label="Syllabus Items">
            <StrList
              items={syllabus}
              label="Syllabus Item"
              ph="Fundamental principle of Ayurveda"
              onAdd={() => setSyllabus((p) => [...p, ""])}
              onRemove={(i) => {
                if (syllabus.length <= 1) return;
                setSyllabus((p) => p.filter((_, idx) => idx !== i));
              }}
              onUpdate={(i, v) => {
                const n = [...syllabus];
                n[i] = v;
                setSyllabus(n);
              }}
            />
          </F>
          <F label="What's Included in Fees">
            <StrList
              items={included}
              label="Included Item"
              ph="3 meals, Indian veg."
              onAdd={() => setIncluded((p) => [...p, ""])}
              onRemove={(i) => {
                if (included.length <= 1) return;
                setIncluded((p) => p.filter((_, idx) => idx !== i));
              }}
              onUpdate={(i, v) => {
                const n = [...included];
                n[i] = v;
                setIncluded(n);
              }}
            />
          </F>
          <F label="Registration Box Text (Rich Text)">
            <StableJodit
              onSave={(v) => {
                registrationBoxRef.current = v;
              }}
              value={registrationBoxRef.current}
              h={110}
              ph="To book your place in Ayurveda Center in Rishikesh you need to deposit…"
            />
          </F>
          <div className={styles.grid2}>
            <F label="Advance Fee Amount">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("registrationAdvanceFee")}
                  placeholder="210 US Dollars"
                />
              </div>
            </F>
            <F label="Payment Options Link href">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("registrationPaymentLink")}
                  placeholder="#payment"
                />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 11. SPIRITUAL ENVIRONMENT ══ */}
        <Sec title="Spiritual Environment" badge="Sacred Setting">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("spiritualEnvironmentSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("spiritualEnvironmentTitle")}
              />
            </div>
          </F>
          <F label="Centered Paragraph (above image)">
            <StableJodit
              onSave={(v) => {
                spiritualCenterParaRef.current = v;
              }}
              value={spiritualCenterParaRef.current}
              h={150}
              ph="To make the yoga experience eternal and remarkable, we have established our yoga place…"
            />
          </F>
          <F label="Sunset / Environment Image" hint="Recommended 1200×800px">
            <SingleImg
              preview={sunsetPrev}
              badge="Spiritual"
              hint="JPG/PNG/WEBP"
              onSelect={(f, p) => {
                setSunsetFile(f);
                setSunsetPrev(p);
              }}
              onRemove={() => {
                setSunsetFile(null);
                setSunsetPrev("");
              }}
            />
          </F>
          <F label="Paragraph Below Image">
            <StableJodit
              onSave={(v) => {
                spiritualBottomParaRef.current = v;
              }}
              value={spiritualBottomParaRef.current}
              h={150}
              ph="Ashrams, ancient as well as new, can be found along the banks of the Ganges in Rishikesh…"
            />
          </F>
          <F label="Additional Spiritual Paragraphs">
            {spiritualPara.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={spiritualPara.ids.length}
                onSave={spiritualPara.save}
                onRemove={spiritualPara.remove}
                value={spiritualPara.ref.current[id]}
                ph="Additional spiritual environment content…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={spiritualPara.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 12. PRICING ══ */}
        <Sec title="Pricing Section" badge="Investment">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("pricingSuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("pricingSectionTitle")}
              />
            </div>
          </F>
          <F label="Yoga TTC Pricing Cards">
            <YogaPricingManager items={yogaPricing} onChange={setYogaPricing} />
          </F>
        </Sec>
        <D />

        {/* ══ 13. HOW TO APPLY ══ */}
        <Sec title="How to Apply" badge="Enrolment">
          <F label="Super Label">
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                {...register("applySuperLabel")}
              />
            </div>
          </F>
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("applyTitle")} />
            </div>
          </F>
          <F label="Apply Text (Rich Text)">
            <StableJodit
              onSave={(v) => {
                applyTextRef.current = v;
              }}
              value={applyTextRef.current}
              h={130}
              ph="Fill the application form and send it to aymyogaschool@gmail.com. After approval…"
            />
          </F>
          <div className={styles.grid2}>
            <F label="'Apply Now' Button href">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("applyNowHref")}
                  placeholder="mailto:aymyogaschool@gmail.com"
                />
              </div>
            </F>
            <F label="Contact Email">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("applyNowEmail")}
                  placeholder="aymyogaschool@gmail.com"
                />
              </div>
            </F>
            <F label="'Browse Courses' Button href">
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  {...register("browseCoursesHref")}
                  placeholder="#courses"
                />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 14. FOOTER ══ */}
        <Sec title="Footer Section">
          <div className={styles.grid2}>
            <F label="Footer Title">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("footerTitle")} />
              </div>
            </F>
            <F label="Location">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("footerLoc")} />
              </div>
            </F>
            <F label="Email">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("footerMail")} />
              </div>
            </F>
            <F label="Tag Line">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("footerTag")} />
              </div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ 15. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div
                className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="ayurveda-course-rishikesh"
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
        </Sec>
      </div>
      {/* /formCard */}

      {/* ── Actions ── */}
      <div className={styles.formActions}>
        <Link
          href="/admin/yogacourse/yoga-ayurveda-teacher"
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
              <span>✦</span> {isEdit ? "Update" : "Save"} Ayurveda Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}
