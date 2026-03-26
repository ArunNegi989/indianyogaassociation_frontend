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
   ACCREDITATION BADGE MANAGER
══════════════════════════════════════════ */
interface AccredBadgeItem {
  id: string;
  label: string;
  imgUrl: string;
  imgPreview: string;
  imgFile: File | null;
}

const DEFAULT_ACCRED_BADGES: AccredBadgeItem[] = [
  {
    id: "ab1",
    label: "Yoga Alliance USA",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  {
    id: "ab2",
    label: "Ministry of AYUSH",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  { id: "ab3", label: "RYS 200", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab4", label: "RYS 300", imgUrl: "", imgPreview: "", imgFile: null },
  { id: "ab5", label: "RYS 500", imgUrl: "", imgPreview: "", imgFile: null },
  {
    id: "ab6",
    label: "Made in India",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  {
    id: "ab7",
    label: "AYUSH Certified",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
];

function AccredBadgesManager({
  items,
  onChange,
}: {
  items: AccredBadgeItem[];
  onChange: (v: AccredBadgeItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof AccredBadgeItem, value: any) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const updateMany = useCallback(
    (id: string, patch: Partial<AccredBadgeItem>) => {
      onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      {
        id: `ab-${Date.now()}`,
        label: "",
        imgUrl: "",
        imgPreview: "",
        imgFile: null,
      },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>
              Badge {idx + 1}: {item.label || "New Badge"}
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
                  Badge Label
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.label}
                    placeholder="Yoga Alliance USA"
                    onChange={(e) => update(item.id, "label", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Image URL (optional)
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.imgUrl}
                    placeholder="https://…"
                    onChange={(e) => update(item.id, "imgUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Or Upload Badge Image
              </label>
              <SingleImg
                preview={item.imgPreview}
                badge="Badge"
                hint="PNG/SVG · 200×200px"
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
        ＋ Add Badge
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   COURSE CARD MANAGER
══════════════════════════════════════════ */
interface CourseCardItem {
  id: string;
  hours: string;
  title: string;
  desc: string;
  linkLabel: string;
  href: string;
  imgUrl: string;
  imgPreview: string;
  imgFile: File | null;
}

const DEFAULT_COURSES: CourseCardItem[] = [
  {
    id: "cc1",
    hours: "200",
    title: "200 Hour Yoga Teacher Training Course in India",
    desc: "",
    linkLabel: "200 Hour More Information",
    href: "#",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  {
    id: "cc2",
    hours: "300",
    title: "300 Hour Yoga Teacher Training Course in India",
    desc: "",
    linkLabel: "300 Hour More Information",
    href: "#",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  {
    id: "cc3",
    hours: "500",
    title: "500 Hour Yoga Teacher Training Course in India",
    desc: "",
    linkLabel: "500 Hour More Information",
    href: "#",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
];

function CourseCardsManager({
  items,
  onChange,
}: {
  items: CourseCardItem[];
  onChange: (v: CourseCardItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof CourseCardItem, value: any) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const updateMany = useCallback(
    (id: string, patch: Partial<CourseCardItem>) => {
      onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      {
        id: `cc-${Date.now()}`,
        hours: "",
        title: "",
        desc: "",
        linkLabel: "More Information",
        href: "#",
        imgUrl: "",
        imgPreview: "",
        imgFile: null,
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
              {item.hours ? `${item.hours} Hr Course` : "New Course"}
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
                  Hours Badge
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.hours}
                    placeholder="200"
                    onChange={(e) => update(item.id, "hours", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Button Link href
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.href}
                    placeholder="/200-hour-yoga-ttc"
                    onChange={(e) => update(item.id, "href", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Course Title
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.title}
                    placeholder="200 Hour Yoga Teacher Training Course in India"
                    onChange={(e) => update(item.id, "title", e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.fieldGroup} style={{ gridColumn: "1/-1" }}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                  Button Label
                </label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={item.linkLabel}
                    placeholder="200 Hour More Information"
                    onChange={(e) =>
                      update(item.id, "linkLabel", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Course Description
              </label>
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  rows={4}
                  value={item.desc}
                  placeholder="Describe the course…"
                  onChange={(e) => update(item.id, "desc", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Course Image URL (optional)
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.imgUrl}
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
                preview={item.imgPreview}
                badge="Course"
                hint="JPG/PNG/WEBP · 400×225px (16:9)"
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
        ＋ Add Course Card
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   LOCATION CARD MANAGER
══════════════════════════════════════════ */
interface LocationItem {
  id: string;
  name: string;
  desc: string;
}

const DEFAULT_LOCATIONS: LocationItem[] = [
  {
    id: "loc1",
    name: "Rishikesh",
    desc: "Revered as the world's yoga capital, nestled in the foothills of the Himalayas along the sacred Ganges River.",
  },
  {
    id: "loc2",
    name: "Goa",
    desc: "A vibrant coastal paradise known for its stunning beaches and lively culture.",
  },
];

function LocationsManager({
  items,
  onChange,
}: {
  items: LocationItem[];
  onChange: (v: LocationItem[]) => void;
}) {
  const update = (id: string, field: keyof LocationItem, value: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  const add = () =>
    onChange([...items, { id: `loc-${Date.now()}`, name: "", desc: "" }]);
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
              {item.name || "New Location"}
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
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Location Name
              </label>
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
        ＋ Add Location
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   QUOTE CARD MANAGER
══════════════════════════════════════════ */
interface QuoteCardItem {
  id: string;
  quote: string;
  imgAlt: string;
  imgUrl: string;
  imgPreview: string;
  imgFile: File | null;
}

const DEFAULT_QUOTES: QuoteCardItem[] = [
  {
    id: "qc1",
    quote: '"Everyday is a great day for yoga!"',
    imgAlt: "Yoga practice outdoors Rishikesh",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
  {
    id: "qc2",
    quote: '"Yoga is a mirror to look at ourselves from within"',
    imgAlt: "Group yoga by the Ganges Rishikesh",
    imgUrl: "",
    imgPreview: "",
    imgFile: null,
  },
];

function QuoteCardsManager({
  items,
  onChange,
}: {
  items: QuoteCardItem[];
  onChange: (v: QuoteCardItem[]) => void;
}) {
  const update = useCallback(
    (id: string, field: keyof QuoteCardItem, value: any) => {
      onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    },
    [items, onChange],
  );

  const updateMany = useCallback(
    (id: string, patch: Partial<QuoteCardItem>) => {
      onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    },
    [items, onChange],
  );

  const add = () =>
    onChange([
      ...items,
      {
        id: `qc-${Date.now()}`,
        quote: "",
        imgAlt: "",
        imgUrl: "",
        imgPreview: "",
        imgFile: null,
      },
    ]);
  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={styles.nestedCard}
          style={{ marginBottom: "0.8rem" }}
        >
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Quote Card {idx + 1}</span>
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
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Quote Text
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.quote}
                  placeholder='"Yoga is a way of life"'
                  onChange={(e) => update(item.id, "quote", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Image Alt Text
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.imgAlt}
                  placeholder="Yoga practice outdoors"
                  onChange={(e) => update(item.id, "imgAlt", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Image URL (optional)
              </label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  value={item.imgUrl}
                  placeholder="https://…"
                  onChange={(e) => update(item.id, "imgUrl", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>
                Or Upload Quote Image
              </label>
              <SingleImg
                preview={item.imgPreview}
                badge="Quote"
                hint="JPG/PNG/WEBP · 700×440px (16:10)"
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
        ＋ Add Quote Card
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   ARRIVAL & FEE LIST MANAGERS
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface PageFormValues {
  slug: string;
  status: "Active" | "Inactive";
  // Hero
  heroImgAlt: string;
  // Section 1
  heroTitle: string;
  heroSubTitle: string;
  introPara: string;
  // Section 2 — Locations + Courses
  rishikeshTitle: string;
  rishikeshPara: string;
  goaTitle: string;
  goaPara: string;
  // Who We Are
  whoWeAreTitle: string;
  whoWeArePara: string;
  // YTT Through AYM
  yytTitle: string;
  yytPara: string;
  // Why AYM
  whyAYMTitle: string;
  whyAYMPara1: string;
  whyAYMPara2: string;
  // Arrival & Departure
  arrivalTitle: string;
  // Includes in Fee
  feeTitle: string;
}

/* ══════════════════════════════════════════
   MAIN FORM
══════════════════════════════════════════ */
export default function AddEditYogaTTCIndiaPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  /* ── Images ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  /* ── Rich text refs ── */
  const introParaRef = useRef("");
  const whoWeAreParaRef = useRef("");
  const yytParaRef = useRef("");
  const whyAYMPara1Ref = useRef("");
  const whyAYMPara2Ref = useRef("");
  const whyAYMPara3Ref = useRef("");
  const rishikeshDetailParaRef = useRef("");
  const goaDetailParaRef = useRef("");

  /* ── Para lists ── */
  const introParaList = useParaList("ip1");
  const whyAYMParaList = useParaList("wp1");
  const rishikeshParaList = useParaList("rp1");
  const goaParaList = useParaList("gp1");

  /* ── Dynamic lists ── */
  const [accredBadges, setAccredBadges] = useState<AccredBadgeItem[]>(
    DEFAULT_ACCRED_BADGES,
  );
  const [courseCards, setCourseCards] =
    useState<CourseCardItem[]>(DEFAULT_COURSES);
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    defaultValues: {
      slug: "",
      status: "Active",
      heroImgAlt: "Yoga Students Group",
      heroTitle: "YOGA TEACHER TRAINING IN INDIA",
      heroSubTitle: "AYM YOGA SCHOOL – RISHIKESH, INDIA",
      whoWeAreTitle: "Who We Are",
      yytTitle: "Yoga Teacher Training in India through AYM Yoga School",
      rishikeshTitle: "Rishikesh",
      goaTitle: "Goa",
      whyAYMTitle: "Why AYM for Yoga Teachers Training Course?",
      arrivalTitle: "Arrival & Departure",
      feeTitle: "Includes in Fee",
    },
  });

  /* ── Fetch on edit ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/yoga-ttc-india");
        const d = res.data.data;

        if (!d) {
          setIsEdit(false); // ADD MODE
          return;
        }

        setIsEdit(true); // EDIT MODE

        // 🔽 FORM VALUES
        const keys: (keyof PageFormValues)[] = [
          "slug",
          "status",
          "heroImgAlt",
          "heroTitle",
          "heroSubTitle",
          "whoWeAreTitle",
          "yytTitle",
          "rishikeshTitle",
          "goaTitle",
          "whyAYMTitle",
          "arrivalTitle",
          "feeTitle",
        ];

        keys.forEach((k) => {
          if (d[k] !== undefined) {
            setValue(k, d[k] as any);
          }
        });

        introParaRef.current = d.introPara || "";
        whoWeAreParaRef.current = d.whoWeArePara || "";
        yytParaRef.current = d.yytPara || "";
        whyAYMPara1Ref.current = d.whyAYMPara1 || "";
        whyAYMPara2Ref.current = d.whyAYMPara2 || "";
        whyAYMPara3Ref.current = d.whyAYMPara3 || "";
        rishikeshDetailParaRef.current = d.rishikeshDetailPara || "";
        goaDetailParaRef.current = d.goaDetailPara || "";

        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);

        if (d.introParagraphs?.length)
          introParaList.loadFromArray(d.introParagraphs, "ip");
        if (d.whyAYMParagraphs?.length)
          whyAYMParaList.loadFromArray(d.whyAYMParagraphs, "wp");
        if (d.rishikeshParagraphs?.length)
          rishikeshParaList.loadFromArray(d.rishikeshParagraphs, "rp");
        if (d.goaParagraphs?.length)
          goaParaList.loadFromArray(d.goaParagraphs, "gp");

        if (Array.isArray(d.accredBadges)) {
          setAccredBadges(
            d.accredBadges.filter(Boolean).map((b: any, i: number) => ({
              id: b._id || `ab-${i}`,
              label: b.label || "",
              imgUrl: b.imgUrl || "",
              imgPreview: b.image ? BASE_URL + b.image : "",
              imgFile: null,
            })),
          );
        }
        if (Array.isArray(d.courseCards)) {
          setCourseCards(
            d.courseCards.filter(Boolean).map((c: any, i: number) => ({
              id: c._id || `cc-${i}`,
              hours: c.hours || "",
              title: c.title || "",
              desc: c.desc || "",
              linkLabel: c.linkLabel || "",
              href: c.href || "",
              imgUrl: c.imgUrl || "",
              imgPreview: c.image ? BASE_URL + c.image : "",
              imgFile: null,
            })),
          );
        }
        if (Array.isArray(d.locations)) {
          setLocations(d.locations.filter(Boolean));
        }

        if (Array.isArray(d.quoteCards)) {
          setQuoteCards(
            d.quoteCards.filter(Boolean).map((q: any, i: number) => ({
              id: q._id || `qc-${i}`,
              quote: q.quote || "",
              imgAlt: q.imgAlt || "",
              imgUrl: q.imgUrl || "",
              imgPreview: q.image ? BASE_URL + q.image : "",
              imgFile: null,
            })),
          );
        }

        if (d.arrivalList?.length) {
  setArrivalList(
    d.arrivalList.map((item: string) => item.trim())
  );
}
      if (d.feeList?.length) {
  setFeeList(
    d.feeList.map((item: string) => item.trim())
  );
}
      } catch (err) {
        toast.error("Failed to load");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);
  /* ── Submit ── */
  const onSubmit = async (data: PageFormValues) => {
    if (!heroFile && !heroPrev && !isEdit) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append("introPara", introParaRef.current);
      fd.append("whoWeArePara", whoWeAreParaRef.current);
      fd.append("yytPara", yytParaRef.current);
      fd.append("whyAYMPara1", whyAYMPara1Ref.current);
      fd.append("whyAYMPara2", whyAYMPara2Ref.current);
      fd.append("whyAYMPara3", whyAYMPara3Ref.current);
      fd.append("rishikeshDetailPara", rishikeshDetailParaRef.current);
      fd.append("goaDetailPara", goaDetailParaRef.current);

      fd.append(
        "introParagraphs",
        JSON.stringify(
          introParaList.ids
            .map((id) => cleanHTML(introParaList.ref.current[id]))
            .filter(Boolean),
        ),
      );

      fd.append(
        "whyAYMParagraphs",
        JSON.stringify(
          whyAYMParaList.ids
            .map((id) => cleanHTML(whyAYMParaList.ref.current[id]))
            .filter(Boolean),
        ),
      );

      fd.append(
        "rishikeshParagraphs",
        JSON.stringify(
          rishikeshParaList.ids
            .map((id) => cleanHTML(rishikeshParaList.ref.current[id]))
            .filter(Boolean),
        ),
      );

      fd.append(
        "goaParagraphs",
        JSON.stringify(
          goaParaList.ids
            .map((id) => cleanHTML(goaParaList.ref.current[id]))
            .filter(Boolean),
        ),
      );

      fd.append(
        "accredBadges",
        JSON.stringify(accredBadges.map(({ imgFile, imgPreview, ...r }) => r)),
      );
      fd.append(
        "courseCards",
        JSON.stringify(courseCards.map(({ imgFile, imgPreview, ...r }) => r)),
      );
      fd.append("locations", JSON.stringify(locations));
      fd.append(
        "quoteCards",
        JSON.stringify(quoteCards.map(({ imgFile, imgPreview, ...r }) => r)),
      );
     fd.append(
  "arrivalList",
  JSON.stringify(arrivalList.map((i) => i.trim()).filter(Boolean))
);

fd.append(
  "feeList",
  JSON.stringify(feeList.map((i) => i.trim()).filter(Boolean))
);

      accredBadges.forEach((b, i) => {
        if (b.imgFile) fd.append(`accredBadgeImage_${i}`, b.imgFile);
      });
      courseCards.forEach((c, i) => {
        if (c.imgFile) fd.append(`courseCardImage_${i}`, c.imgFile);
      });
      quoteCards.forEach((q, i) => {
        if (q.imgFile) fd.append(`quoteCardImage_${i}`, q.imgFile);
      });

      if (heroFile) fd.append("heroImage", heroFile);

      if (isEdit) {
        await api.put("/yoga-ttc-india/update", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page updated successfully");
      } else {
        await api.post("/yoga-ttc-india/create", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page created successfully");
      }
      setSubmitted(true);
      setTimeout(
        () => router.push("/admin/yogacourse/yoga-teacher-in-india"),
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
            Yoga TTC India Page {isEdit ? "Updated" : "Saved"}!
          </h2>
          <p className={styles.successText}>Redirecting to list…</p>
        </div>
      </div>
    );

  /* ══ RENDER ══ */
  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button
          className={styles.breadcrumbLink}
          onClick={() => router.push("/admin/yogacourse/yoga-teacher-in-india")}
        >
          Yoga TTC India
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? "Edit Page" : "Add New Page"}
        </span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit
              ? "Edit Yoga TTC India Page"
              : "Add New Yoga TTC India Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Badges · Who We Are · Locations · Courses · Why AYM · Quotes
            · Arrival · Fee
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
        <Sec title="Hero Section" badge="Top Banner Image">
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

        {/* ══ 2. PAGE HEADING ══ */}
        <Sec title="Page Heading" badge="H1 + Subtitle">
          <div className={styles.grid2}>
            <F label="Main H1 Title" req>
              <div
                className={`${styles.inputWrap} ${errors.heroTitle ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="YOGA TEACHER TRAINING IN INDIA"
                  {...register("heroTitle", { required: "Required" })}
                />
              </div>
              {errors.heroTitle && (
                <p className={styles.errorMsg}>⚠ {errors.heroTitle.message}</p>
              )}
            </F>
            <F label="Subtitle (School Name)">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="AYM YOGA SCHOOL – RISHIKESH, INDIA"
                  {...register("heroSubTitle")}
                />
              </div>
            </F>
          </div>
          <F
            label="Introduction Paragraph"
            hint="Main intro text below heading"
          >
            <StableJodit
              onSave={(v) => {
                introParaRef.current = v;
              }}
              value={introParaRef.current}
              h={200}
              ph="India, the birthplace of yoga, has shared its timeless yogic wisdom with the world…"
            />
          </F>
          <F label="Additional Intro Paragraphs">
            {introParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={introParaList.ids.length}
                onSave={introParaList.save}
                onRemove={introParaList.remove}
                value={introParaList.ref.current[id]}
                ph="Additional intro content…"
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

        {/* ══ 3. ACCREDITATION BADGES ══ */}
        <Sec title="Accreditation Badges" badge="7 Badges (with images)">
          <p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>
            ℹ Default 7 badges: Yoga Alliance USA, Ministry of AYUSH, RYS 200,
            RYS 300, RYS 500, Made in India, AYUSH Certified. Upload image for
            each badge or provide an image URL.
          </p>
          <AccredBadgesManager
            items={accredBadges}
            onChange={setAccredBadges}
          />
        </Sec>
        <D />

        {/* ══ 4. WHO WE ARE ══ */}
        <Sec title="Who We Are" badge="Vintage Card Section">
          <F label="Card Title" req>
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Who We Are"
                {...register("whoWeAreTitle")}
              />
            </div>
          </F>
          <F label="Card Paragraph">
            <StableJodit
              onSave={(v) => {
                whoWeAreParaRef.current = v;
              }}
              value={whoWeAreParaRef.current}
              h={200}
              ph="Founded in 2005, AYM Yoga School stands among the top yoga teacher training schools in India…"
            />
          </F>
        </Sec>
        <D />

        {/* ══ 5. YTT THROUGH AYM + LOCATIONS ══ */}
        <Sec title="Yoga Teacher Training Through AYM" badge="Locations Card">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Yoga Teacher Training in India through AYM Yoga School"
                {...register("yytTitle")}
              />
            </div>
          </F>
          <F label="Section Intro Paragraph">
            <StableJodit
              onSave={(v) => {
                yytParaRef.current = v;
              }}
              value={yytParaRef.current}
              h={150}
              ph="At AYM, we offer yoga teacher training in two distinct and inspiring locations in India…"
            />
          </F>
          <F label="Location Cards">
            <LocationsManager items={locations} onChange={setLocations} />
          </F>
        </Sec>
        <D />

        {/* ══ 6. RISHIKESH DETAIL ══ */}
        <Sec title="Rishikesh — Detail Section" badge="Section 2">
          <F label="Rishikesh Section Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Rishikesh"
                {...register("rishikeshTitle")}
              />
            </div>
          </F>
          <F label="Rishikesh Main Paragraph">
            <StableJodit
              onSave={(v) => {
                rishikeshDetailParaRef.current = v;
              }}
              value={rishikeshDetailParaRef.current}
              h={180}
              ph="If you're drawn to the spiritual energy of the holy city of Rishikesh…"
            />
          </F>
          <F label="Additional Rishikesh Paragraphs">
            {rishikeshParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={rishikeshParaList.ids.length}
                onSave={rishikeshParaList.save}
                onRemove={rishikeshParaList.remove}
                value={rishikeshParaList.ref.current[id]}
                ph="More about Rishikesh…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={rishikeshParaList.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 7. GOA DETAIL ══ */}
        <Sec title="Goa — Detail Section" badge="Section 2">
          <F label="Goa Section Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Goa"
                {...register("goaTitle")}
              />
            </div>
          </F>
          <F label="Goa Main Paragraph">
            <StableJodit
              onSave={(v) => {
                goaDetailParaRef.current = v;
              }}
              value={goaDetailParaRef.current}
              h={180}
              ph="If you are a beach person and want to learn yoga at the beachside…"
            />
          </F>
          <F label="Additional Goa Paragraphs">
            {goaParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={goaParaList.ids.length}
                onSave={goaParaList.save}
                onRemove={goaParaList.remove}
                value={goaParaList.ref.current[id]}
                ph="More about Goa…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={goaParaList.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 8. COURSE CARDS ══ */}
        <Sec title="Course Cards (200 / 300 / 500 Hr)" badge="3 Cards">
          <p className={styles.fieldHint} style={{ marginBottom: "0.8rem" }}>
            ℹ Default 3 courses: 200 hr, 300 hr, 500 hr. You can add more or
            remove as needed.
          </p>
          <CourseCardsManager items={courseCards} onChange={setCourseCards} />
        </Sec>
        <D />

        {/* ══ 9. WHY AYM ══ */}
        <Sec title="Why AYM Section" badge="Section 3">
          <F label="Section Title (H2)">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Why AYM for Yoga Teachers Training Course?"
                {...register("whyAYMTitle")}
              />
            </div>
          </F>
          <F label="Paragraph 1">
            <StableJodit
              onSave={(v) => {
                whyAYMPara1Ref.current = v;
              }}
              value={whyAYMPara1Ref.current}
              h={180}
              ph="Yoga is not just the study of asanas, aka yogic poses, but a way of life…"
            />
          </F>
          <F label="Paragraph 2">
            <StableJodit
              onSave={(v) => {
                whyAYMPara2Ref.current = v;
              }}
              value={whyAYMPara2Ref.current}
              h={180}
              ph="Our teacher training courses in India are approved by the Ministry of Ayush…"
            />
          </F>
          <F label="Paragraph 3 (Below Quote Cards)">
            <StableJodit
              onSave={(v) => {
                whyAYMPara3Ref.current = v;
              }}
              value={whyAYMPara3Ref.current}
              h={180}
              ph="We welcome you to our yoga school in India to feel the magic of yoga…"
            />
          </F>
          <F label="Additional Why AYM Paragraphs">
            {whyAYMParaList.ids.map((id, i) => (
              <RichListItem
                key={id}
                id={id}
                index={i}
                total={whyAYMParaList.ids.length}
                onSave={whyAYMParaList.save}
                onRemove={whyAYMParaList.remove}
                value={whyAYMParaList.ref.current[id]}
                ph="Additional Why AYM content…"
              />
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={whyAYMParaList.add}
            >
              ＋ Add Paragraph
            </button>
          </F>
        </Sec>
        <D />

        {/* ══ 10. QUOTE IMAGE CARDS ══ */}
        <Sec title="Quote Image Cards" badge="2 Cards with overlay quotes">
          <QuoteCardsManager items={quoteCards} onChange={setQuoteCards} />
        </Sec>
        <D />

        {/* ══ 11. ARRIVAL & DEPARTURE ══ */}
        <Sec title="Arrival & Departure" badge="Info Panel">
          <F label="Panel Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Arrival & Departure"
                {...register("arrivalTitle")}
              />
            </div>
          </F>
          <F label="Arrival List Items">
            <StrList
              items={arrivalList}
              label="Arrival Item"
              ph="Day before Start date: Arrival and Rest."
              onAdd={() => setArrivalList((p) => [...p, ""])}
              onRemove={(i) => {
                if (arrivalList.length <= 1) return;
                setArrivalList((p) => p.filter((_, idx) => idx !== i));
              }}
              onUpdate={(i, v) => {
                const n = [...arrivalList];
                n[i] = v;
                setArrivalList(n);
              }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 12. INCLUDES IN FEE ══ */}
        <Sec title="Includes in Fee" badge="Info Panel">
          <F label="Panel Title">
            <div className={styles.inputWrap}>
              <input
                className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Includes in Fee"
                {...register("feeTitle")}
              />
            </div>
          </F>
          <F label="Fee Includes List Items">
            <StrList
              items={feeList}
              label="Fee Item"
              ph="Accommodation and Food."
              onAdd={() => setFeeList((p) => [...p, ""])}
              onRemove={(i) => {
                if (feeList.length <= 1) return;
                setFeeList((p) => p.filter((_, idx) => idx !== i));
              }}
              onUpdate={(i, v) => {
                const n = [...feeList];
                n[i] = v;
                setFeeList(n);
              }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 13. PAGE SETTINGS ══ */}
        <Sec title="Page Settings" badge="SEO & Status">
          <div className={styles.grid2}>
            <F label="Slug" req>
              <div
                className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  placeholder="yoga-teacher-training-in-india"
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
          href="/admin/yogacourse/yoga-teacher-in-india"
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
              <span>✦</span> {isEdit ? "Update" : "Save"} Yoga TTC India Page
            </>
          )}
        </button>
      </div>
    </div>
  );
}
