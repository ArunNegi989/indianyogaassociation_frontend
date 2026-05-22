"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "@/assets/style/Admin/yogacourse/200hourscourse/Yoga200hr.module.css";
import api from "@/lib/api";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

/* ─────────────────────────── Helpers ─────────────────────────── */
function decodeJoditHTML(value: string): string {
  if (!value) return value;
  const pattern = /__HTML__:([\w+/=]+):__HTML__/g;
  return value.replace(pattern, (_, b64) => {
    try {
      return atob(b64);
    } catch {
      return _;
    }
  });
}

const safeHTML = (v: any): string => {
  if (typeof v !== "string") return "";
  const decoded = decodeJoditHTML(v);
  return typeof decoded === "string" ? decoded.trim() : "";
};

function isEmptyHtml(html: string) {
  return (
    decodeJoditHTML(html || "")
      .replace(/<[^>]*>/g, "")
      .trim() === ""
  );
}

function toEmbedUrl(url: string): string {
  if (!url) return "";
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt)
    return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&modestbranding=1&rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm)
    return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&loop=1&muted=1&background=1`;
  return url;
}

/* ─────────────────────────── Constants ─────────────────────────── */
const JODIT_CONFIG_BASE = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium" as const,
  toolbarAdaptive: false,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: "insert_clear_html",
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
  placeholder: "",
  processPasteHTML: false,
  cleanHTML: { fillEmptyParagraph: false },
  disabled: false,
  editorCssClass: "",
} as any;

const FILTER_OPTIONS = [
  "All Poses",
  "Standing",
  "Sitting",
  "Lying",
  "Balancing",
] as const;

/* ─────────────────────────── UI Helpers ─────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════
   ControlledJodit — FIXED cursor jump bug
   
   ROOT CAUSE: passing `value` (state) to JoditEditor on every
   parent re-render causes Jodit to reset cursor to beginning.
   
   FIX: stableInitValue ref is set ONCE per component lifecycle
   (i.e., per `key` remount). Since it's a ref (not state),
   parent re-renders don't push new values into JoditEditor.
   When editorKey changes, component fully remounts via key prop,
   so useRef(value) correctly initialises with fresh data.
═══════════════════════════════════════════════════════════ */
function ControlledJodit({
  label,
  hint,
  value,
  onChange,
  err,
  ph = "Start typing…",
  h = 200,
  required = false,
  editorKey = "default",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  err?: string;
  ph?: string;
  h?: number;
  required?: boolean;
  editorKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const isMountedRef = useRef(false);
  const mountValueRef = useRef(value);

  // ✅ FIX: stable ref initialised once per mount — does NOT update on re-renders
  const stableInitValue = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

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
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    isMountedRef.current = false;
    mountValueRef.current = value;
    // When editorKey changes, component remounts → stableInitValue re-inits via useRef(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  const config = React.useMemo(
    () => ({
      ...JODIT_CONFIG_BASE,
      placeholder: ph,
      height: h,
      disabled: false,
      readonly: false,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [editorKey],
  );

  const handleChange = useCallback((v: string) => {
    const decoded = decodeJoditHTML(v);
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      const stripped = decoded.replace(/<[^>]*>/g, "").trim();
      if (!stripped && mountValueRef.current) return;
    }
    onChangeRef.current(decoded);
  }, []);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div
        ref={wrapRef}
        className={`${styles.joditWrap} ${err ? styles.joditError : ""}`}
        style={{ minHeight: h }}
      >
        {visible ? (
          <JoditEditor
            key={editorKey}
            value={stableInitValue.current} // ✅ stable — never causes cursor reset
            config={config}
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
      </div>
      {err && <p className={styles.errorMsg}>⚠ {err}</p>}
    </div>
  );
}

/* DynamicParaEditor — same cursor fix applied */
function DynamicParaEditor({
  value,
  onChange,
  ph,
  editorKey = "para",
}: {
  value: string;
  onChange: (v: string) => void;
  ph: string;
  editorKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const isMountedRef = useRef(false);
  const mountValueRef = useRef(value);

  // ✅ FIX: stable init value — set once per component lifecycle
  const stableInitValue = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

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
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    isMountedRef.current = false;
    mountValueRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  const config = React.useMemo(
    () => ({
      ...JODIT_CONFIG_BASE,
      placeholder: ph,
      height: 200,
      disabled: false,
      readonly: false,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [editorKey],
  );

  const handleChange = useCallback((v: string) => {
    const decoded = decodeJoditHTML(v);
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      const stripped = decoded.replace(/<[^>]*>/g, "").trim();
      if (!stripped && mountValueRef.current) return;
    }
    onChangeRef.current(decoded);
  }, []);

  return (
    <div ref={wrapRef} style={{ minHeight: 200 }}>
      {visible ? (
        <JoditEditor
          key={editorKey}
          value={stableInitValue.current} // ✅ stable
          config={config}
          onChange={handleChange}
        />
      ) : (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            border: "1px solid #e8d5b5",
            borderRadius: 8,
            color: "#bbb",
            fontSize: 13,
          }}
        >
          ✦ Scroll to load editor…
        </div>
      )}
    </div>
  );
}

/* ModuleBodyEditor — same cursor fix applied */
function ModuleBodyEditor({
  value,
  onChange,
  editorKey = "mod",
}: {
  value: string;
  onChange: (v: string) => void;
  idx: number;
  editorKey?: string;
}) {
  const [visible, setVisible] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const isMountedRef = useRef(false);
  const mountValueRef = useRef(value);

  // ✅ FIX: stable init value
  const stableInitValue = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

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
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    isMountedRef.current = false;
    mountValueRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorKey]);

  const config = React.useMemo(
    () => ({
      ...JODIT_CONFIG_BASE,
      placeholder: "Additional description…",
      height: 160,
      disabled: false,
      readonly: false,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [editorKey],
  );

  const handleChange = useCallback((v: string) => {
    const decoded = decodeJoditHTML(v);
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      const stripped = decoded.replace(/<[^>]*>/g, "").trim();
      if (!stripped && mountValueRef.current) return;
    }
    onChangeRef.current(decoded);
  }, []);

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>Module Extra Rich Text
        (optional)
      </label>
      <div ref={wrapRef} style={{ minHeight: 160 }}>
        {visible ? (
          <JoditEditor
            key={editorKey}
            value={stableInitValue.current} // ✅ stable
            config={config}
            onChange={handleChange}
          />
        ) : (
          <div
            style={{
              height: 160,
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
      </div>
    </div>
  );
}

/* ─────────────────────────── StrList ─────────────────────────── */
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

/* ─────────────────────────── SingleImg — FIXED image display ─────────────────────────── */
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
  const BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const displayPreview =
    preview?.startsWith("http") || preview?.startsWith("blob:")
      ? preview
      : preview
        ? `${BASE}${preview}`
        : "";

  return (
    <div>
      {/* ✅ FIX: position:relative ensures absolute input works; min-height gives click area */}
      <div
        className={`${styles.imageUploadZone} ${displayPreview ? styles.hasImage : ""} ${error ? styles.inputError : ""}`}
        style={{ position: "relative", minHeight: 120 }}
      >
        {!displayPreview ? (
          <>
            {/* ✅ FIX: file input absolutely fills the zone so entire area is clickable */}
            <input
              type="file"
              accept="image/*"
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                zIndex: 2,
                width: "100%",
                height: "100%",
              }}
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
          /* ✅ FIX: explicit width/height on img so it actually renders */
          <div
            className={styles.imagePreviewWrap}
            style={{ position: "relative", width: "100%", minHeight: 120 }}
          >
            {badge && <span className={styles.imageBadge}>{badge}</span>}
            <img
              src={displayPreview}
              alt={badge || "preview"}
              className={styles.imagePreview}
              style={{
                display: "block",
                width: "100%",
                maxHeight: 240,
                objectFit: "cover",
                borderRadius: 6,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              className={styles.imagePreviewOverlay}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <span className={styles.imagePreviewAction}>✎ Change</span>
              <input
                type="file"
                accept="image/*"
                className={styles.imagePreviewOverlayInput}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  zIndex: 3,
                }}
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
              style={{ position: "absolute", top: 6, right: 6, zIndex: 4 }}
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

/* ─────────────────────────── MultiImageUpload ─────────────────────────── */
function MultiImageUpload({
  files,
  previews,
  hint,
  label = "Image",
  onSelect,
  onRemove,
  maxFiles = 8,
}: {
  files: File[];
  previews: string[];
  hint: string;
  label?: string;
  onSelect: (f: File[], p: string[]) => void;
  onRemove: (i: number) => void;
  maxFiles?: number;
}) {
  const BASE = process.env.NEXT_PUBLIC_API_URL || "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sel = Array.from(e.target.files || []);
    if (!sel.length) return;
    const nf = [...files, ...sel].slice(0, maxFiles);
    const np = [...previews, ...sel.map((f) => URL.createObjectURL(f))].slice(
      0,
      maxFiles,
    );
    onSelect(nf, np);
    e.target.value = "";
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
        gap: "0.7rem",
      }}
    >
      {previews.map((p, i) => {
        const displayP =
          p?.startsWith("http") || p?.startsWith("blob:") ? p : `${BASE}${p}`;
        return (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: 8,
              overflow: "hidden",
              border: "1.5px solid #e8d5b5",
            }}
          >
            <span className={styles.imageBadge}>
              {label} {i + 1}
            </span>
            <img
              src={displayP}
              alt=""
              style={{
                width: "100%",
                height: 110,
                objectFit: "cover",
                display: "block",
              }}
            />
            <button
              type="button"
              className={styles.removeImageBtn}
              style={{ position: "absolute", top: 6, right: 6, zIndex: 4 }}
              onClick={() => onRemove(i)}
            >
              ✕
            </button>
          </div>
        );
      })}
      {previews.length < maxFiles && (
        <div
          className={styles.imageUploadZone}
          style={{ minHeight: 110, position: "relative" }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              zIndex: 2,
              width: "100%",
              height: "100%",
            }}
          />
          <div className={styles.imageUploadPlaceholder}>
            <span className={styles.imageUploadIcon}>🖼️</span>
            <span className={styles.imageUploadText}>Add Photo</span>
            <span className={styles.imageUploadSub}>{hint}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── VideoField ─────────────────────────── */
function VideoField({
  urlValue,
  onUrlChange,
  file,
  filePreview,
  onFileSelect,
  onFileRemove,
  label,
  hint,
}: {
  urlValue: string;
  onUrlChange: (v: string) => void;
  file: File | null;
  filePreview: string;
  onFileSelect: (f: File, p: string) => void;
  onFileRemove: () => void;
  label: string;
  hint?: string;
}) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const embedPreview = mode === "url" ? toEmbedUrl(urlValue) : "";
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>✦</span>
        {label}
      </label>
      {hint && <p className={styles.fieldHint}>{hint}</p>}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.8rem" }}>
        {(["url", "upload"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 6,
              border: "1.5px solid",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              borderColor: mode === m ? "#b8860b" : "#e8d5b5",
              background: mode === m ? "#b8860b" : "transparent",
              color: mode === m ? "#fff" : "#8a7560",
            }}
          >
            {m === "url"
              ? "🔗 URL (YouTube / Instagram / Vimeo)"
              : "📁 Upload Video File"}
          </button>
        ))}
      </div>
      {mode === "url" && (
        <div>
          <div className={styles.inputWrap}>
            <input
              className={`${styles.input} ${styles.inputNoCount}`}
              value={urlValue}
              placeholder="https://www.youtube.com/watch?v=…"
              onChange={(e) => onUrlChange(e.target.value)}
            />
          </div>
          {urlValue && embedPreview && (
            <div
              style={{
                marginTop: "0.7rem",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e8d5b5",
                maxWidth: 480,
                aspectRatio: "16/9",
              }}
            >
              <iframe
                src={embedPreview}
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Video preview"
              />
            </div>
          )}
        </div>
      )}
      {mode === "upload" && (
        <div>
          {!filePreview ? (
            <div
              className={styles.imageUploadZone}
              style={{
                cursor: "pointer",
                position: "relative",
                minHeight: 120,
              }}
            >
              <input
                type="file"
                accept="video/*"
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                  zIndex: 2,
                  width: "100%",
                  height: "100%",
                }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onFileSelect(f, URL.createObjectURL(f));
                    e.target.value = "";
                  }
                }}
              />
              <div className={styles.imageUploadPlaceholder}>
                <span className={styles.imageUploadIcon}>🎬</span>
                <span className={styles.imageUploadText}>
                  Click to Upload Video
                </span>
                <span className={styles.imageUploadSub}>
                  MP4, WebM, MOV supported
                </span>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative", maxWidth: 480 }}>
              <video
                src={filePreview}
                controls
                style={{
                  width: "100%",
                  borderRadius: 8,
                  border: "1px solid #e8d5b5",
                }}
              />
              <button
                type="button"
                className={styles.removeImageBtn}
                style={{ position: "absolute", top: 6, right: 6 }}
                onClick={onFileRemove}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Types ─────────────────────────── */
interface ModuleRow {
  title: string;
  intro: string;
  items: string[];
  body: string;
}
interface ProgramItem {
  title: string;
  duration: string;
  start: string;
  oldPrice: string;
  price: string;
  desc: string;
  imageFile: File | null;
  imagePreview: string;
}
interface IndianFeeItem {
  label: string;
  price: string;
}
interface ScheduleRowItem {
  time: string;
  activity: string;
}
interface FaqItem {
  q: string;
  a: string;
}
interface KnowQAItem {
  q: string;
  a: string;
}
interface WeekGridItem {
  week: string;
  icon: string;
  t1: string;
  d1: string;
  t2: string;
  d2: string;
}
interface HathaAsana {
  n: string;
  name: string;
  sub: string;
  filter: string;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FORM
═══════════════════════════════════════════════════════════════ */
export default function Yoga200HourCombinedForm() {
  const router = useRouter();
  const params = useParams();
  const contentId = params?.id || params?.contentId || params?.slug;
  const isEditMode = !!contentId && contentId !== "new";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState("init");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    defaultValues: {
      status: "Active",
      slug: "",
      pageMainH1: "200 Hour Yoga Teacher Training in Rishikesh",
      heroImgAlt: "Yoga Students Group",
      courseCardHeaderLabel: "COURSE DETAILS",
      courseCardItem1Label: "DURATION",
      courseCardItem1Value: "26 Days",
      courseCardItem2Label: "LEVEL",
      courseCardItem2Value: "All Levels",
      courseCardItem3Label: "CERTIFICATION",
      courseCardItem3Value: "200 Hour",
      courseCardItem4Label: "YOGA STYLE",
      courseCardItem4Value: "Multistyle",
      courseCardItem4Sub: "Ashtanga, Vinyasa & Hatha",
      courseCardItem5Label: "LANGUAGE",
      courseCardItem5Value: "English & Hindi",
      courseCardItem6Label: "DATE",
      courseCardItem6Value: "1st of every month",
      courseCardFeeLabel: "COURSE FEE",
      courseCardFeeFrom: "starting from",
      courseCardOldPrice: "1000",
      courseCardNewPrice: "699",
      courseCardPriceCurrency: "USD",
      courseCardBookBtnText: "BOOK NOW",
      courseCardBookBtnUrl: "#dates-fees",
      videoBadgeText: "Yoga Teacher Training · Rishikesh",
      stat1Icon: "🕐",
      stat1Val: "21+",
      stat1Title: "Years of Excellence",
      stat1Desc:
        "Our syllabus has been developed over twenty years by dozens of experienced yoga masters.",
      stat2Icon: "👥",
      stat2Val: "9,075+",
      stat2Title: "Global Alumni",
      stat2Desc:
        "Join the world's most famous AYM yoga teacher training alumni network.",
      stat3Icon: "⭐",
      stat3Val: "4.5",
      stat3Title: "Star Rating",
      stat3Desc:
        "Rated 4.5 stars on Google, Yoga Alliance, and Facebook by our trainees.",
      stat4Icon: "🔆",
      stat4Val: "200",
      stat4Title: "Hour Certification",
      stat4Desc: "Yoga Alliance approved certification recognized worldwide.",
      aimsH3:
        "200 Hour Yoga Teacher Training Rishikesh India - Aims & Objective",
      aimsKeyObjLabel:
        "The key aims and objectives of our 200 Hour Multi-Style Yoga Teacher Training Course in Rishikesh India is:",
      overviewH2: "Overview of 200 Hour Yoga Instructor Course Rishikesh India",
      overviewSubPara:
        "A comprehensive certification program designed to transform passionate practitioners into confident, knowledgeable yoga teachers.",
      overviewCertLabel: "Name of the certification",
      overviewCertName:
        "200-hour yoga teacher training / Yoga Protocol Instructor (YPI)",
      overviewLevelLabel: "Course level",
      overviewLevel: "Level-I",
      overviewEligLabel: "Requirement/Eligibility",
      overviewEligibility: "Physically fit and open for all.",
      overviewAgeLabel: "Minimum age",
      overviewMinAge: "No age limit",
      overviewCreditsLabel: "Credit points for certificate",
      overviewCredits: "12 credits",
      overviewLangLabel: "Language",
      overviewLanguage: "English; Hindi (Separate Groups)",
      feeIncludedTitle: "Included in 200 Hour yoga ttc course in india",
      feeNotIncludedTitle:
        "Not Included in 200 hour yoga ttc course in Rishikesh",
      syllabusH3:
        "200 Hour Yoga Teacher Training In Rishikesh India - The Syllabus",
      ashtangaH2: "Module 8.1: Ashtanga Vinyasa Yoga",
      ashtangaSubtitle:
        "Discover the transformative practice that synchronizes breath with movement",
      ashtangaImgAlt: "Ashtanga Vinyasa Yoga",
      ashtangaPill1: "📋 Breath-synchronized movement",
      ashtangaPill2: "🧠 Calms the mind",
      ashtangaPill3: "🕉️ Ancient practice with modern application",
      primarySeriesH3: "Primary Series Curriculum",
      primarySeriesSubtext:
        "All students of 200 hour yoga teacher training will practice primary series which includes:",
      upcomingDatesSubtext:
        "Choose your dates & preferred accommodation — prices include tuition and meals",
      batchSectionTag: "Upcoming Batches · 2026–2027",
      upcomingDatesH2: "200 Hour Yoga Teacher Training India",
      hathaH2: "Module 8.2: Hatha Yoga",
      hathaSubtitle:
        "Discover the traditional, ancient and classical yoga practice",
      hathaImgAlt: "Hatha Yoga",
      hathaPill1: "📋 Traditional & Ancient Practice",
      hathaPill2: "🎓 YCB Certification Board Level-I",
      hathaPill3: "✋ Expert Guidance & Correction",
      asanasH2: "Hatha Yoga Asanas",
      asanasSubtext:
        "Master these essential postures as part of your comprehensive training",
      evalH2: "Evaluation & Certification",
      luxuryH2: "Luxury Room & Facilities",
      indianFeeH2: "Course Fee for Indian Students",
      scheduleH2: "Daily Schedule",
      moreInfoH2: "More Information",
      globalCertH2: "Get Globally Certified",
      requirementsH2: "Requirements for Enrollment",
      whatYouNeedH2: "What You Need to Know",
      best200HrH4: "Why Choose AYM for Your 200 Hour Training?",
      whatsIncludedH4: "What's Included in the Course Fee",
      faqH2: "Frequently Asked Questions",
      bookingH2: "How to Book Your Spot",
      metaTitle:
        "200 Hour Yoga Teacher Training in Rishikesh | AYM Yoga School",
      metaDesc:
        "Join our Yoga Alliance certified 200 hour yoga teacher training in Rishikesh. Learn Ashtanga, Hatha, Vinyasa with experienced teachers.",
      metaKeywords:
        "200 hour yoga teacher training, yoga in rishikesh, yoga certification",
      ctaTitle:
        "We welcome you to AYM School for a wonderful yogic experience!",
      ctaSubtitle:
        "Join us & become part of the 5000+ international yoga teachers who are proud alumni of the AYM School.",
      ctaApplyBtnText: "Apply Now",
      ctaApplyUrl: "/yoga-registration?type=200hr",
      ctaPhone: "919528023390",
      whatsappNumber: "919528023390",
      whatsappBtnText: "💬 WhatsApp Us",
      spanishChineseNote:
        "Spanish & Chinese translations available upon request",
      // ── NEW FIELDS ──
      eligibilityInfoTitle:
        "Eligibility Criteria for attending 200 Hour Yoga Teacher Training India",
      eligibilityInfoText:
        "A curious mind to learn and practice yoga, basic English knowledge, and self-discipline is all that you need for applying for this course! There is no upper age limit for the program. However, if you are below 15 years, you need to write to us.",
      visaPassportTitle: "Visa & Passport Information",
    },
  });

  /* ── Image States ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [ashtangaFile, setAshtangaFile] = useState<File | null>(null);
  const [ashtangaPrev, setAshtangaPrev] = useState("");
  const [hathaFile, setHathaFile] = useState<File | null>(null);
  const [hathaPrev, setHathaPrev] = useState("");
  const [reqImgFile, setReqImgFile] = useState<File | null>(null);
  const [reqImgPrev, setReqImgPrev] = useState("");
  const [luxImgFiles, setLuxImgFiles] = useState<File[]>([]);
  const [luxImgPrevs, setLuxImgPrevs] = useState<string[]>([]);
  const [schedImgFiles, setSchedImgFiles] = useState<File[]>([]);
  const [schedImgPrevs, setSchedImgPrevs] = useState<string[]>([]);
  const [aimsImgFile, setAimsImgFile] = useState<File | null>(null);
  const [aimsImgPrev, setAimsImgPrev] = useState("");
  const [primaryImgFile, setPrimaryImgFile] = useState<File | null>(null);
  const [primaryImgPrev, setPrimaryImgPrev] = useState("");

  /* ── Video State ── */
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPrev, setVideoPrev] = useState("");

  /* ── Rich text ── */
  const [introParas, setIntroParas] = useState<string[]>(["", "", "", ""]);
  const [aimsIntroPars, setAimsIntroPars] = useState<string[]>([""]);
  const [syllabusParas, setSyllabusParas] = useState<string[]>([""]);
  const [aimsOutro, setAimsOutro] = useState("");
  const [ashtangaDesc, setAshtangaDesc] = useState("");
  const [primaryIntro, setPrimaryIntro] = useState("");
  const [hathaDesc, setHathaDesc] = useState("");
  const [evalDesc, setEvalDesc] = useState("");
  const [schedDesc, setSchedDesc] = useState("");
  const [visaDesc, setVisaDesc] = useState("");
  const [globalCert1, setGlobalCert1] = useState("");
  const [globalCert2, setGlobalCert2] = useState("");
  const [req1, setReq1] = useState("");
  const [req2, setReq2] = useState("");
  const [req3, setReq3] = useState("");
  const [req4, setReq4] = useState("");
  const [best200Hr, setBest200Hr] = useState("");
  const [step1Desc, setStep1Desc] = useState("");
  const [step2Desc, setStep2Desc] = useState("");
  const [step3Desc, setStep3Desc] = useState("");
  const [step4Desc, setStep4Desc] = useState("");

  /* ── Validation Errors ── */
  const [introErr, setIntroErr] = useState("");
  const [aimsErr, setAimsErr] = useState("");
  const [sylErr, setSylErr] = useState("");
  const [astErr, setAstErr] = useState("");
  const [htErr, setHtErr] = useState("");
  const [evErr, setEvErr] = useState("");

  /* ── String Lists ── */
  const [aimsBullets, setAimsBullets] = useState<string[]>([""]);
  const [inclFee, setInclFee] = useState<string[]>(["", ""]);
  const [notInclFee, setNotInclFee] = useState<string[]>(["", ""]);
  const [foundItems, setFoundItems] = useState<string[]>([""]);
  const [luxFeatures, setLuxFeatures] = useState<string[]>(["", ""]);
  const [whatIncl, setWhatIncl] = useState<string[]>(["", ""]);
  const [instrLangs, setInstrLangs] = useState([
    { lang: "", note: "" },
    { lang: "", note: "" },
  ]);
  const [indianFees, setIndianFees] = useState<IndianFeeItem[]>([
    { label: "", price: "" },
    { label: "", price: "" },
  ]);
  const [schedRows, setSchedRows] = useState<ScheduleRowItem[]>([
    { time: "", activity: "" },
    { time: "", activity: "" },
  ]);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    { q: "", a: "" },
    { q: "", a: "" },
  ]);
  const [knowQA, setKnowQA] = useState<KnowQAItem[]>([
    { q: "", a: "" },
    { q: "", a: "" },
  ]);

  /* ── Modules ── */
  const [modules, setModules] = useState<ModuleRow[]>([
    {
      title: "Module 1: The Philosophy of Yoga",
      intro: "The course covers fundamental concepts underlying Ashtanga Yoga.",
      items: [""],
      body: "",
    },
    {
      title: "Module 2: The Yogic Breathing Techniques/Pranayama",
      intro:
        "You will learn about different types of breathing used in pranayama.",
      items: [""],
      body: "",
    },
    {
      title: "Module 3: The Shat Kriyas (Cleansing Detox)",
      intro:
        "This module gives you understanding of the detoxification process.",
      items: [""],
      body: "",
    },
    {
      title: "Module 4: Anatomy and Physiology",
      intro:
        "Teacher will connect ancient science of yoga to the present science.",
      items: [""],
      body: "",
    },
    {
      title: "Module 5: Knowledge of Meditation",
      intro: "Meditation is the key part of yoga teacher training.",
      items: [""],
      body: "",
    },
    {
      title: "Module 6: Mantras, Chants, and Prayers",
      intro: "Mantras are coded in Sanskrit native language of India.",
      items: [""],
      body: "",
    },
    {
      title: "Module 7: Mastering the Art of Teaching Yoga",
      intro:
        "This module gives you the confidence to take your yoga classes to the next level.",
      items: [""],
      body: "",
    },
    {
      title: "Module 8: Knowledge of Asanas (Yoga Postures)",
      intro:
        "By the end of your training, you will have learned all the poses.",
      items: [""],
      body: "",
    },
  ]);

  /* ── Programs ── */
  const makeEmptyProg = (): ProgramItem => ({
    title: "",
    duration: "",
    start: "",
    oldPrice: "",
    price: "",
    desc: "",
    imageFile: null,
    imagePreview: "",
  });
  const [programs, setPrograms] = useState<ProgramItem[]>([
    makeEmptyProg(),
    makeEmptyProg(),
    makeEmptyProg(),
    makeEmptyProg(),
  ]);

  /* ── Hatha Asanas & Week Grid ── */
  const [hatha43, setHatha43] = useState<HathaAsana[]>([
    { n: "1", name: "", sub: "", filter: "All Poses" },
  ]);
  const [weekGrid, setWeekGrid] = useState<WeekGridItem[]>([
    { week: "Week 1", icon: "☀️", t1: "", d1: "", t2: "", d2: "" },
  ]);

  /* ── Programs H2/Subtext ── */
  const [programsH2, setProgramsH2] = useState("");
  const [programsSubtext, setProgramsSubtext] = useState("");

  const upd = useCallback(
    <T,>(arr: T[], set: (v: T[]) => void, i: number, k: keyof T, v: string) => {
      const a = [...arr] as any[];
      a[i] = { ...a[i], [k]: v };
      set(a);
    },
    [],
  );

  const addModule = () =>
    setModules((prev) => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: New Module`,
        intro: "",
        items: [""],
        body: "",
      },
    ]);
  const removeModule = (i: number) =>
    setModules((prev) => prev.filter((_, x) => x !== i));
  const updateModule = (i: number, key: "title" | "intro", val: string) =>
    setModules((prev) => {
      const a = [...prev];
      a[i] = { ...a[i], [key]: val };
      return a;
    });
  const updateModuleBody = (i: number, val: string) =>
    setModules((prev) => {
      const a = [...prev];
      a[i] = { ...a[i], body: decodeJoditHTML(val) };
      return a;
    });
  const updateModuleItem = (modI: number, itemI: number, val: string) =>
    setModules((prev) => {
      const a = [...prev];
      const items = [...a[modI].items];
      items[itemI] = val;
      a[modI] = { ...a[modI], items };
      return a;
    });
  const addModuleItem = (modI: number) =>
    setModules((prev) => {
      const a = [...prev];
      a[modI] = { ...a[modI], items: [...a[modI].items, ""] };
      return a;
    });
  const removeModuleItem = (modI: number, itemI: number) =>
    setModules((prev) => {
      const a = [...prev];
      a[modI] = {
        ...a[modI],
        items: a[modI].items.filter((_, x) => x !== itemI),
      };
      return a;
    });

  /* ── Fetch Data for Edit Mode ── */
  useEffect(() => {
    if (!isEditMode || !params.id) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await api.get(`/yoga-200hr/content/${params.id}`);
        const d = res.data?.data;
        if (!d) return;

        const simpleFields = [
          "slug",
          "status",
          "pageMainH1",
          "heroImgAlt",
          "courseCardHeaderLabel",
          "courseCardItem1Label",
          "courseCardItem1Value",
          "courseCardItem2Label",
          "courseCardItem2Value",
          "courseCardItem3Label",
          "courseCardItem3Value",
          "courseCardItem4Label",
          "courseCardItem4Value",
          "courseCardItem4Sub",
          "courseCardItem5Label",
          "courseCardItem5Value",
          "courseCardItem6Label",
          "courseCardItem6Value",
          "courseCardFeeLabel",
          "courseCardFeeFrom",
          "courseCardOldPrice",
          "courseCardNewPrice",
          "courseCardPriceCurrency",
          "courseCardBookBtnText",
          "courseCardBookBtnUrl",
          "videoBadgeText",
          "aimsH3",
          "aimsKeyObjLabel",
          "overviewH2",
          "overviewSubPara",
          "overviewCertLabel",
          "overviewCertName",
          "overviewLevelLabel",
          "overviewLevel",
          "overviewEligLabel",
          "overviewEligibility",
          "overviewAgeLabel",
          "overviewMinAge",
          "overviewCreditsLabel",
          "overviewCredits",
          "overviewLangLabel",
          "overviewLanguage",
          "feeIncludedTitle",
          "feeNotIncludedTitle",
          "syllabusH3",
          "ashtangaH2",
          "ashtangaSubtitle",
          "ashtangaImgAlt",
          "ashtangaPill1",
          "ashtangaPill2",
          "ashtangaPill3",
          "primarySeriesH3",
          "primarySeriesSubtext",
          "upcomingDatesSubtext",
          "batchSectionTag",
          "upcomingDatesH2",
          "hathaH2",
          "hathaSubtitle",
          "hathaImgAlt",
          "hathaPill1",
          "hathaPill2",
          "hathaPill3",
          "asanasH2",
          "asanasSubtext",
          "evalH2",
          "luxuryH2",
          "indianFeeH2",
          "scheduleH2",
          "moreInfoH2",
          "globalCertH2",
          "requirementsH2",
          "requirementsImgAlt",
          "whatYouNeedH2",
          "best200HrH4",
          "whatsIncludedH4",
          "faqH2",
          "bookingH2",
          "metaTitle",
          "metaDesc",
          "metaKeywords",
          "ctaTitle",
          "ctaSubtitle",
          "ctaApplyBtnText",
          "ctaApplyUrl",
          "ctaPhone",
          "whatsappNumber",
          "whatsappBtnText",
          "spanishChineseNote",
          // ── NEW FIELDS ──
          "eligibilityInfoTitle",
          "eligibilityInfoText",
          "visaPassportTitle",
          "step1Icon",
          "step1Title",
          "step2Icon",
          "step2Title",
          "step3Icon",
          "step3Title",
          "step4Icon",
          "step4Title",
        ];
        simpleFields.forEach((key) => {
          if (d[key] !== undefined && d[key] !== null) setValue(key, d[key]);
        });

        if (d.newProgramsH2) setProgramsH2(d.newProgramsH2);
        if (d.newProgramsSubtext) setProgramsSubtext(d.newProgramsSubtext);

        if (d.stats && Array.isArray(d.stats)) {
          d.stats.forEach((stat: any, i: number) => {
            setValue(`stat${i + 1}Icon`, stat.icon || "");
            setValue(`stat${i + 1}Val`, stat.value || "");
            setValue(`stat${i + 1}Title`, stat.title || "");
            setValue(`stat${i + 1}Desc`, stat.desc || "");
          });
        }

        if (d.heroImage) setHeroPrev(d.heroImage);
        if (d.ashtangaImage) setAshtangaPrev(d.ashtangaImage);
        if (d.hathaImage) setHathaPrev(d.hathaImage);
        if (d.reqImage) setReqImgPrev(d.reqImage);
        if (d.luxImages?.length) setLuxImgPrevs(d.luxImages);
        if (d.schedImages?.length) setSchedImgPrevs(d.schedImages);
        if (d.aimsImage) setAimsImgPrev(d.aimsImage);
        if (d.primarySeriesImage) setPrimaryImgPrev(d.primarySeriesImage);
        if (d.videoUrl) setVideoUrl(d.videoUrl);

        const introPArr: string[] = [];
        for (let i = 1; i <= 10; i++) {
          if (d[`introPara${i}`])
            introPArr.push(decodeJoditHTML(d[`introPara${i}`]));
        }
        if (introPArr.length) setIntroParas(introPArr);

        if (d.aimsIntro?.length)
          setAimsIntroPars(d.aimsIntro.map(decodeJoditHTML));
        if (d.syllabusIntro?.length)
          setSyllabusParas(d.syllabusIntro.map(decodeJoditHTML));

        setAimsOutro(d.aimsOutro ? decodeJoditHTML(d.aimsOutro) : "");
        setAshtangaDesc(d.ashtangaDesc ? decodeJoditHTML(d.ashtangaDesc) : "");
        setPrimaryIntro(d.primaryIntro ? decodeJoditHTML(d.primaryIntro) : "");
        setHathaDesc(d.hathaDesc ? decodeJoditHTML(d.hathaDesc) : "");
        setEvalDesc(d.evalDesc ? decodeJoditHTML(d.evalDesc) : "");
        setSchedDesc(d.schedDesc ? decodeJoditHTML(d.schedDesc) : "");
        setVisaDesc(
          d.visaPassportDesc ? decodeJoditHTML(d.visaPassportDesc) : "",
        );
        setGlobalCert1(d.globalCert1 ? decodeJoditHTML(d.globalCert1) : "");
        setGlobalCert2(d.globalCert2 ? decodeJoditHTML(d.globalCert2) : "");
        setReq1(d.req1 ? decodeJoditHTML(d.req1) : "");
        setReq2(d.req2 ? decodeJoditHTML(d.req2) : "");
        setReq3(d.req3 ? decodeJoditHTML(d.req3) : "");
        setReq4(d.req4 ? decodeJoditHTML(d.req4) : "");
        setBest200Hr(d.best200Hr ? decodeJoditHTML(d.best200Hr) : "");
        setStep1Desc(
          d.bookingStep1Desc ? decodeJoditHTML(d.bookingStep1Desc) : "",
        );
        setStep2Desc(
          d.bookingStep2Desc ? decodeJoditHTML(d.bookingStep2Desc) : "",
        );
        setStep3Desc(
          d.bookingStep3Desc ? decodeJoditHTML(d.bookingStep3Desc) : "",
        );
        setStep4Desc(
          d.bookingStep4Desc ? decodeJoditHTML(d.bookingStep4Desc) : "",
        );

        if (d.aimsBullets?.length) setAimsBullets(d.aimsBullets);
        if (d.includedFee?.length) setInclFee(d.includedFee);
        if (d.notIncludedFee?.length) setNotInclFee(d.notIncludedFee);
        if (d.foundationItems?.length) setFoundItems(d.foundationItems);
        if (d.luxFeatures?.length) setLuxFeatures(d.luxFeatures);
        if (d.whatIncl?.length) setWhatIncl(d.whatIncl);
        if (d.instrLangs?.length) setInstrLangs(d.instrLangs);
        if (d.indianFees?.length) setIndianFees(d.indianFees);
        if (d.schedRows?.length) setSchedRows(d.schedRows);
        if (d.faqItems?.length) setFaqItems(d.faqItems);
        if (d.knowQA?.length) setKnowQA(d.knowQA);

        if (d.modules?.length) {
          setModules(
            d.modules.map((m: any) => ({
              title: m.title || "",
              intro: m.intro || "",
              items: m.items?.length ? m.items : [""],
              body: decodeJoditHTML(m.body || ""),
            })),
          );
        }
        if (d.programs?.length) {
          setPrograms(
            d.programs.map((p: any) => ({
              title: p.title || "",
              duration: p.duration || "",
              start: p.start || "",
              oldPrice: p.oldPrice || "",
              price: p.price || "",
              desc: decodeJoditHTML(p.desc || ""),
              imageFile: null,
              imagePreview: p.image || "",
            })),
          );
        }
        if (d.hatha43?.length) setHatha43(d.hatha43);
        if (d.weekGrid?.length) setWeekGrid(d.weekGrid);

        setEditorKey(`loaded-${Date.now()}`);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isEditMode, params.id, setValue]);

  /* ══════════════════════════════════════════════════════════
     SUBMIT
  ══════════════════════════════════════════════════════════ */
  const runSubmit = async (data: any) => {
    let hasErr = false;

    if (!isEditMode && !heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      hasErr = true;
    } else {
      setHeroErr("");
    }
    if (!introParas.some((r) => !isEmptyHtml(r))) {
      setIntroErr("At least one paragraph is required");
      hasErr = true;
    } else {
      setIntroErr("");
    }
    if (!aimsIntroPars.some((r) => !isEmptyHtml(r))) {
      setAimsErr("At least one aims paragraph is required");
      hasErr = true;
    } else {
      setAimsErr("");
    }
    if (!syllabusParas.some((r) => !isEmptyHtml(r))) {
      setSylErr("At least one syllabus paragraph is required");
      hasErr = true;
    } else {
      setSylErr("");
    }
    if (!isEditMode && isEmptyHtml(ashtangaDesc)) {
      setAstErr("Required");
      hasErr = true;
    } else {
      setAstErr("");
    }
    if (!isEditMode && isEmptyHtml(hathaDesc)) {
      setHtErr("Required");
      hasErr = true;
    } else {
      setHtErr("");
    }
    if (!isEditMode && isEmptyHtml(evalDesc)) {
      setEvErr("Required");
      hasErr = true;
    } else {
      setEvErr("");
    }

    if (hasErr) {
      const firstErr = document.querySelector("[data-err='true']");
      if (firstErr)
        firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setIsSubmitting(true);
      const fd = new globalThis.FormData();

      const skipInLoop = new Set([
        "stat1Icon",
        "stat1Val",
        "stat1Title",
        "stat1Desc",
        "stat2Icon",
        "stat2Val",
        "stat2Title",
        "stat2Desc",
        "stat3Icon",
        "stat3Val",
        "stat3Title",
        "stat3Desc",
        "stat4Icon",
        "stat4Val",
        "stat4Title",
        "stat4Desc",
      ]);

      for (const key in data) {
        if (skipInLoop.has(key)) continue;
        const val = data[key];
        if (val === undefined || val === null) {
          fd.set(key, "");
          continue;
        }
        if (Array.isArray(val)) {
          val.forEach((v) => fd.append(key, String(v)));
        } else if (typeof val === "object") {
          fd.set(key, JSON.stringify(val));
        } else {
          fd.set(key, String(val));
        }
      }

      fd.set("newProgramsH2", programsH2);
      fd.set("newProgramsSubtext", programsSubtext);

      introParas.forEach((v, i) => fd.append(`introPara${i + 1}`, safeHTML(v)));
      fd.append("introParaCount", String(introParas.length));
      aimsIntroPars.forEach((v, i) =>
        fd.append(`aimsIntro${i + 1}`, safeHTML(v)),
      );
      fd.append("aimsIntroCount", String(aimsIntroPars.length));
      syllabusParas.forEach((v, i) =>
        fd.append(`syllabusIntro${i + 1}`, safeHTML(v)),
      );
      fd.append("syllabusIntroCount", String(syllabusParas.length));

      fd.set("aimsOutro", safeHTML(aimsOutro));
      fd.set("ashtangaDesc", safeHTML(ashtangaDesc));
      fd.set("primaryIntro", safeHTML(primaryIntro));
      fd.set("hathaDesc", safeHTML(hathaDesc));
      fd.set("evalDesc", safeHTML(evalDesc));
      fd.set("schedDesc", safeHTML(schedDesc));
      fd.set("visaPassportDesc", safeHTML(visaDesc));
      fd.set("globalCert1", safeHTML(globalCert1));
      fd.set("globalCert2", safeHTML(globalCert2));
      fd.set("req1", safeHTML(req1));
      fd.set("req2", safeHTML(req2));
      fd.set("req3", safeHTML(req3));
      fd.set("req4", safeHTML(req4));
      fd.set("best200Hr", safeHTML(best200Hr));
      fd.set("bookingStep1Desc", safeHTML(step1Desc));
      fd.set("bookingStep2Desc", safeHTML(step2Desc));
      fd.set("bookingStep3Desc", safeHTML(step3Desc));
      fd.set("bookingStep4Desc", safeHTML(step4Desc));

      for (let i = 1; i <= 4; i++) {
        fd.set(`stat${i}Icon`, data[`stat${i}Icon`] || "");
        fd.set(`stat${i}Val`, data[`stat${i}Val`] || "");
        fd.set(`stat${i}Title`, data[`stat${i}Title`] || "");
        fd.set(`stat${i}Desc`, data[`stat${i}Desc`] || "");
      }

      aimsBullets.forEach((v) => fd.append("aimsBullets", v));
      
      // ========== FIXED: Fees as JSON strings ==========
      // Send fees as JSON strings instead of multiple entries
      fd.append("includedFee", JSON.stringify(inclFee.filter(v => v.trim() !== "")));
      fd.append("notIncludedFee", JSON.stringify(notInclFee.filter(v => v.trim() !== "")));
      // =================================================
      
      foundItems.forEach((v) => fd.append("foundationItems", v));

      fd.set("luxFeatures", JSON.stringify(luxFeatures));
      fd.set("whatIncl", JSON.stringify(whatIncl));
      fd.set("instrLangs", JSON.stringify(instrLangs));
      fd.set("indianFees", JSON.stringify(indianFees));
      fd.set("schedRows", JSON.stringify(schedRows));
      fd.set("faqItems", JSON.stringify(faqItems));
      fd.set("knowQA", JSON.stringify(knowQA));

      fd.set(
        "modules",
        JSON.stringify(
          modules.map((m) => ({
            title: m.title,
            intro: m.intro,
            items: m.items,
            body: safeHTML(m.body),
          })),
        ),
      );
      fd.set("hatha43", JSON.stringify(hatha43));
      fd.set("weekGrid", JSON.stringify(weekGrid));

      fd.set(
        "programs",
        JSON.stringify(
          programs.map((p) => ({
            title: p.title,
            duration: p.duration,
            start: p.start,
            oldPrice: p.oldPrice,
            price: p.price,
            desc: safeHTML(p.desc),
            image: p.imageFile ? "" : p.imagePreview,
          })),
        ),
      );
      programs.forEach((p, i) => {
        if (p.imageFile) fd.append(`programImage${i}`, p.imageFile);
      });

      const existingLux = luxImgPrevs.filter(
        (p) => p && !p.startsWith("blob:"),
      );
      const existingSched = schedImgPrevs.filter(
        (p) => p && !p.startsWith("blob:"),
      );
      fd.set("existingLuxImages", JSON.stringify(existingLux));
      fd.set("existingSchedImages", JSON.stringify(existingSched));
      if (!heroFile && heroPrev && !heroPrev.startsWith("blob:"))
        fd.set("existingHeroImage", heroPrev);
      if (!ashtangaFile && ashtangaPrev && !ashtangaPrev.startsWith("blob:"))
        fd.set("existingAshtangaImage", ashtangaPrev);
      if (!hathaFile && hathaPrev && !hathaPrev.startsWith("blob:"))
        fd.set("existingHathaImage", hathaPrev);
      if (!reqImgFile && reqImgPrev && !reqImgPrev.startsWith("blob:"))
        fd.set("existingReqImage", reqImgPrev);
      if (!aimsImgFile && aimsImgPrev && !aimsImgPrev.startsWith("blob:"))
        fd.set("existingAimsImage", aimsImgPrev);
      if (
        !primaryImgFile &&
        primaryImgPrev &&
        !primaryImgPrev.startsWith("blob:")
      )
        fd.set("existingPrimaryImage", primaryImgPrev);

      if (videoFile) fd.set("videoFile", videoFile);
      else if (videoUrl?.trim()) fd.set("videoUrl", videoUrl.trim());

      if (heroFile) fd.set("heroImage", heroFile);
      if (ashtangaFile) fd.set("ashtangaImage", ashtangaFile);
      if (hathaFile) fd.set("hathaImage", hathaFile);
      if (reqImgFile) fd.set("reqImage", reqImgFile);
      if (aimsImgFile) fd.set("aimsImage", aimsImgFile);
      if (primaryImgFile) fd.set("primarySeriesImage", primaryImgFile);
      luxImgFiles.forEach((f) => fd.append("luxImages", f));
      schedImgFiles.forEach((f) => fd.append("schedImages", f));

      const url = isEditMode
        ? `/yoga-200hr/content/update/${params.id}`
        : "/yoga-200hr/content/create";
      await api({
        method: isEditMode ? "put" : "post",
        url,
        data: fd,
        headers: { "Content-Type": undefined },
      });

      setSubmitted(true);
      setTimeout(
        () => router.push("/admin/yogacourse/200hourscourse/200hr-content"),
        1500,
      );
    } catch (e: any) {
      console.error("Submission error:", e);
      alert(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveClick = () => {
    handleSubmit(runSubmit)();
  };

  /* ── Loading & Success ── */
  if (loading) {
    return (
      <div className={styles.formPage}>
        <div className={styles.loadingScreen}>
          <div className={styles.loadingOm}>ॐ</div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successOm}>ॐ</div>
          <div className={styles.successCheck}>✓</div>
          <h2 className={styles.successTitle}>Content Saved Successfully!</h2>
          <p className={styles.successText}>Redirecting to list...</p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className={styles.formPage}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <button
          type="button"
          className={styles.breadcrumbLink}
          onClick={() =>
            router.push("/admin/yogacourse/200hourscourse/200hr-content")
          }
        >
          200 Hour Content
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>
          {isEditMode ? "Edit" : "Add New"} Content
        </span>
      </div>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEditMode ? "Edit" : "Add New"} — 200 Hour Yoga Content
          </h1>
          <p className={styles.pageSubtitle}>
            Complete content management for 200 Hour Yoga Teacher Training page
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          noValidate
        >
          {/* ════════ SECTION 1: Hero ════════ */}
          <Sec title="1. Hero Section">
            <F label="Page Main H1 Heading" req>
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("pageMainH1", { required: "Required" })}
                />
              </div>
              {errors.pageMainH1 && (
                <p className={styles.errorMsg}>
                  ⚠ {errors.pageMainH1.message as string}
                </p>
              )}
            </F>
            <F
              label="Hero Image"
              req={!isEditMode}
              hint="Recommended 1180×540px"
            >
              <SingleImg
                preview={heroPrev}
                badge="Hero"
                hint="JPG/PNG · 1180×540px"
                error={heroErr}
                onSelect={(f, p) => {
                  setHeroFile(f);
                  setHeroPrev(p);
                  setHeroErr("");
                }}
                onRemove={() => {
                  setHeroFile(null);
                  setHeroPrev("");
                }}
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
          </Sec>
          <D />

          {/* ════════ SECTION 2: Course Card ════════ */}
          <Sec title="2. Course Info Card" badge="6 detail rows + price">
            <F label="Card Header Label" hint="e.g. COURSE DETAILS">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("courseCardHeaderLabel")}
                />
              </div>
            </F>
            {[
              { n: 1, rowLabel: "Duration" },
              { n: 2, rowLabel: "Level" },
              { n: 3, rowLabel: "Certification" },
              { n: 5, rowLabel: "Language" },
              { n: 6, rowLabel: "Date" },
            ].map(({ n, rowLabel }) => (
              <div key={n}>
                <p
                  style={{
                    color: "#b8860b",
                    fontWeight: 700,
                    marginBottom: "0.6rem",
                    fontSize: "0.85rem",
                  }}
                >
                  ── Detail Row {n} ({rowLabel}) ──
                </p>
                <div className={styles.grid2}>
                  <F label="Label">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        {...register(`courseCardItem${n}Label`)}
                      />
                    </div>
                  </F>
                  <F label="Value">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        {...register(`courseCardItem${n}Value`)}
                      />
                    </div>
                  </F>
                </div>
              </div>
            ))}
            <p
              style={{
                color: "#b8860b",
                fontWeight: 700,
                marginBottom: "0.6rem",
                fontSize: "0.85rem",
              }}
            >
              ── Detail Row 4 (Yoga Style) ──
            </p>
            <div className={styles.grid3}>
              <F label="Label">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardItem4Label")}
                  />
                </div>
              </F>
              <F label="Value">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardItem4Value")}
                  />
                </div>
              </F>
              <F label="Sub-line">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardItem4Sub")}
                  />
                </div>
              </F>
            </div>
            <p
              style={{
                color: "#b8860b",
                fontWeight: 700,
                margin: "1.2rem 0 0.6rem",
                fontSize: "0.85rem",
              }}
            >
              ── Course Fee Panel ──
            </p>
            <div className={styles.grid2}>
              <F label="Fee Label">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardFeeLabel")}
                  />
                </div>
              </F>
              <F label='"starting from" Text'>
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardFeeFrom")}
                  />
                </div>
              </F>
            </div>
            <div className={styles.grid3}>
              <F label="Old Price">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardOldPrice")}
                  />
                </div>
              </F>
              <F label="New Price">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardNewPrice")}
                  />
                </div>
              </F>
              <F label="Currency">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardPriceCurrency")}
                  />
                </div>
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="Book Button Text">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardBookBtnText")}
                  />
                </div>
              </F>
              <F label="Book Button URL">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("courseCardBookBtnUrl")}
                  />
                </div>
              </F>
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 3: Intro Paragraphs ════════ */}
          <Sec title="3. Introduction Paragraphs" badge="Dynamic">
            {introErr && (
              <p
                className={styles.errorMsg}
                style={{ marginBottom: "0.8rem" }}
                data-err="true"
              >
                ⚠ {introErr}
              </p>
            )}
            {introParas.map((val, i) => (
              <div
                key={`intro-${i}`}
                style={{
                  position: "relative",
                  marginBottom: "1.2rem",
                  border: "1px solid #e8d5b5",
                  borderRadius: 10,
                  padding: "1rem",
                  background: "#faf8f4",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#b8860b",
                      fontSize: "0.85rem",
                    }}
                  >
                    Paragraph {i + 1}
                  </span>
                  {introParas.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setIntroParas((prev) => prev.filter((_, x) => x !== i))
                      }
                      style={{
                        background: "#fee",
                        border: "1px solid #fbb",
                        color: "#c00",
                        borderRadius: 6,
                        padding: "0.2rem 0.7rem",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <DynamicParaEditor
                  value={val}
                  onChange={(v) =>
                    setIntroParas((prev) => {
                      const a = [...prev];
                      a[i] = v;
                      return a;
                    })
                  }
                  ph="Enter paragraph content…"
                  editorKey={`intro-${i}-${editorKey}`}
                />
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() => setIntroParas((prev) => [...prev, ""])}
            >
              ＋ Add Paragraph
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 4: Stats Cards ════════ */}
          <Sec title="4. Stats Cards">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Stat Card {n}</span>
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid3}>
                    <F label="Icon">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          {...register(`stat${n}Icon`)}
                        />
                      </div>
                    </F>
                    <F label="Value">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          {...register(`stat${n}Val`)}
                        />
                      </div>
                    </F>
                    <F label="Title">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          {...register(`stat${n}Title`)}
                        />
                      </div>
                    </F>
                  </div>
                  <F label="Description">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        {...register(`stat${n}Desc`)}
                      />
                    </div>
                  </F>
                </div>
              </div>
            ))}
          </Sec>
          <D />

          {/* ════════ SECTION 5: Video ════════ */}
          <Sec title="5. Video Section">
            <F label="Video Badge Text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("videoBadgeText")}
                />
              </div>
            </F>
            <VideoField
              label="Hero Video (YouTube / Vimeo / Upload)"
              hint="Paste YouTube/Vimeo URL or upload video file"
              urlValue={videoUrl}
              onUrlChange={setVideoUrl}
              file={videoFile}
              filePreview={videoPrev}
              onFileSelect={(f, p) => {
                setVideoFile(f);
                setVideoPrev(p);
              }}
              onFileRemove={() => {
                setVideoFile(null);
                setVideoPrev("");
              }}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 6: Aims & Objectives ════════ */}
          <Sec title="6. Aims & Objectives">
            <F label="Section H3 Heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("aimsH3")}
                />
              </div>
            </F>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Aims Introduction
                Paragraphs<span className={styles.required}>*</span>
              </label>
              {aimsErr && (
                <p
                  className={styles.errorMsg}
                  style={{ marginBottom: "0.6rem" }}
                  data-err="true"
                >
                  ⚠ {aimsErr}
                </p>
              )}
              {aimsIntroPars.map((val, i) => (
                <div
                  key={`aims-${i}`}
                  style={{
                    position: "relative",
                    marginBottom: "1.2rem",
                    border: "1px solid #e8d5b5",
                    borderRadius: 10,
                    padding: "1rem",
                    background: "#faf8f4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#b8860b",
                        fontSize: "0.85rem",
                      }}
                    >
                      Aims Introduction {i + 1}
                    </span>
                    {aimsIntroPars.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setAimsIntroPars((prev) =>
                            prev.filter((_, x) => x !== i),
                          )
                        }
                        style={{
                          background: "#fee",
                          border: "1px solid #fbb",
                          color: "#c00",
                          borderRadius: 6,
                          padding: "0.2rem 0.7rem",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <DynamicParaEditor
                    value={val}
                    onChange={(v) =>
                      setAimsIntroPars((prev) => {
                        const a = [...prev];
                        a[i] = v;
                        return a;
                      })
                    }
                    ph="The 200 hour yoga teacher training is carefully designed…"
                    editorKey={`aims-${i}-${editorKey}`}
                  />
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() => setAimsIntroPars((prev) => [...prev, ""])}
              >
                ＋ Add Aims Paragraph
              </button>
            </div>
            <F label="Key Objectives Label">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("aimsKeyObjLabel")}
                />
              </div>
            </F>
            <F label="Aims Bullet Points">
              <StrList
                items={aimsBullets}
                label="Aim"
                ph="To deepen personal practice…"
                onAdd={() => setAimsBullets([...aimsBullets, ""])}
                onRemove={(i) =>
                  setAimsBullets(aimsBullets.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const a = [...aimsBullets];
                  a[i] = v;
                  setAimsBullets(a);
                }}
              />
            </F>
            <F label="Aims & Objectives Image" hint="716×537px">
              <SingleImg
                preview={aimsImgPrev}
                badge="Aims"
                hint="JPG/PNG · 716×537px"
                onSelect={(f, p) => {
                  setAimsImgFile(f);
                  setAimsImgPrev(p);
                }}
                onRemove={() => {
                  setAimsImgFile(null);
                  setAimsImgPrev("");
                }}
              />
            </F>
            <ControlledJodit
              label="Aims Outro Paragraph"
              value={aimsOutro}
              onChange={setAimsOutro}
              ph="The 200-hour yoga training at AYM Yoga School offers…"
              h={180}
              editorKey={`aimsOutro-${editorKey}`}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 7: Course Overview ════════ */}
          <Sec title="7. Course Overview">
            <F label="Overview H2 Heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("overviewH2")}
                />
              </div>
            </F>
            <F label="Overview Sub-Paragraph">
              <div className={styles.inputWrap}>
                <textarea
                  className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                  rows={3}
                  {...register("overviewSubPara")}
                />
              </div>
            </F>
            <div className={styles.nestedCard}>
              <div className={styles.nestedCardBody}>
                <div className={styles.grid2}>
                  {[
                    ["overviewCertLabel", "overviewCertName"],
                    ["overviewLevelLabel", "overviewLevel"],
                    ["overviewEligLabel", "overviewEligibility"],
                    ["overviewAgeLabel", "overviewMinAge"],
                    ["overviewCreditsLabel", "overviewCredits"],
                    ["overviewLangLabel", "overviewLanguage"],
                  ].map(([lKey, vKey]) => (
                    <React.Fragment key={lKey}>
                      <F label="Label">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            {...register(lKey)}
                          />
                        </div>
                      </F>
                      <F label="Value">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            {...register(vKey)}
                          />
                        </div>
                      </F>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 8: Upcoming Dates ════════ */}
          <Sec title="8. Upcoming Dates Section">
            <div className={styles.grid2}>
              <F label="Section Tag">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("batchSectionTag")}
                  />
                </div>
              </F>
              <F label="Main H2 Heading">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("upcomingDatesH2")}
                  />
                </div>
              </F>
            </div>
            <F label="Sub-text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("upcomingDatesSubtext")}
                />
              </div>
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 9: Fee Inclusions ════════ */}
          <Sec title="9. Course Fee Inclusions & Exclusions">
            <F label="Included Section Title">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("feeIncludedTitle")}
                />
              </div>
            </F>
            <F label="Included Items">
              <StrList
                items={inclFee}
                label="Item"
                ph="Six days of yoga, meditation and theory classes…"
                onAdd={() => setInclFee([...inclFee, ""])}
                onRemove={(i) => setInclFee(inclFee.filter((_, x) => x !== i))}
                onUpdate={(i, v) => {
                  const a = [...inclFee];
                  a[i] = v;
                  setInclFee(a);
                }}
              />
            </F>
            <F label="Not Included Section Title">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("feeNotIncludedTitle")}
                />
              </div>
            </F>
            <F label="Not Included Items">
              <StrList
                items={notInclFee}
                label="Item"
                ph="Any Airfare."
                onAdd={() => setNotInclFee([...notInclFee, ""])}
                onRemove={(i) =>
                  setNotInclFee(notInclFee.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const a = [...notInclFee];
                  a[i] = v;
                  setNotInclFee(a);
                }}
              />
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 10: Syllabus ════════ */}
          <Sec title="10. Syllabus Section">
            <F label="Syllabus H3 Heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("syllabusH3")}
                />
              </div>
            </F>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                <span className={styles.labelIcon}>✦</span>Syllabus Introduction
                Paragraphs<span className={styles.required}>*</span>
              </label>
              {sylErr && (
                <p
                  className={styles.errorMsg}
                  style={{ marginBottom: "0.6rem" }}
                  data-err="true"
                >
                  ⚠ {sylErr}
                </p>
              )}
              {syllabusParas.map((val, i) => (
                <div
                  key={`syl-${i}`}
                  style={{
                    position: "relative",
                    marginBottom: "1.2rem",
                    border: "1px solid #e8d5b5",
                    borderRadius: 10,
                    padding: "1rem",
                    background: "#faf8f4",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#b8860b",
                        fontSize: "0.85rem",
                      }}
                    >
                      Syllabus Paragraph {i + 1}
                    </span>
                    {syllabusParas.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSyllabusParas((prev) =>
                            prev.filter((_, x) => x !== i),
                          )
                        }
                        style={{
                          background: "#fee",
                          border: "1px solid #fbb",
                          color: "#c00",
                          borderRadius: 6,
                          padding: "0.2rem 0.7rem",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <DynamicParaEditor
                    value={val}
                    onChange={(v) =>
                      setSyllabusParas((prev) => {
                        const a = [...prev];
                        a[i] = v;
                        return a;
                      })
                    }
                    ph="It is our commitment as yoga school…"
                    editorKey={`syllabus-${i}-${editorKey}`}
                  />
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() => setSyllabusParas((prev) => [...prev, ""])}
              >
                ＋ Add Syllabus Paragraph
              </button>
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 11: Modules ════════ */}
          <Sec title="11. Syllabus Modules" badge={`${modules.length} modules`}>
            {modules.map((mod, i) => (
              <div
                key={i}
                className={styles.nestedCard}
                style={{ marginBottom: "1rem" }}
              >
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Module {i + 1}</span>
                  <button
                    type="button"
                    className={styles.removeNestedBtn}
                    onClick={() => removeModule(i)}
                    disabled={modules.length <= 1}
                  >
                    ✕ Remove Module
                  </button>
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Module Title">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        value={mod.title}
                        onChange={(e) =>
                          updateModule(i, "title", e.target.value)
                        }
                      />
                    </div>
                  </F>
                  <F label="Module Intro">
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                        rows={3}
                        value={mod.intro}
                        onChange={(e) =>
                          updateModule(i, "intro", e.target.value)
                        }
                      />
                    </div>
                  </F>
                  <F label="Topics List">
                    <div className={styles.listItems}>
                      {mod.items.map((item, j) => (
                        <div key={j} className={styles.listItemRow}>
                          <span className={styles.listNum}>{j + 1}</span>
                          <div
                            className={`${styles.inputWrap} ${styles.listInput}`}
                          >
                            <input
                              className={`${styles.input} ${styles.inputNoCount}`}
                              value={item}
                              onChange={(e) =>
                                updateModuleItem(i, j, e.target.value)
                              }
                            />
                          </div>
                          <button
                            type="button"
                            className={styles.removeItemBtn}
                            onClick={() => removeModuleItem(i, j)}
                            disabled={mod.items.length <= 1}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.addItemBtn}
                      onClick={() => addModuleItem(i)}
                    >
                      ＋ Add Topic
                    </button>
                  </F>
                  <ModuleBodyEditor
                    value={mod.body}
                    onChange={(v) => updateModuleBody(i, v)}
                    idx={i}
                    editorKey={`module-${i}-${editorKey}`}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              style={{
                background: "linear-gradient(135deg,#b8860b,#d4a017)",
                color: "#fff",
                border: "none",
                padding: "0.7rem 1.5rem",
                borderRadius: 8,
                fontWeight: 700,
                cursor: "pointer",
              }}
              onClick={addModule}
            >
              ＋ Add New Module
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 12: Ashtanga ════════ */}
          <Sec title="12. Ashtanga Vinyasa Yoga">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("ashtangaH2")}
                />
              </div>
            </F>
            <F label="Sub-heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("ashtangaSubtitle")}
                />
              </div>
            </F>
            <F label="Ashtanga Image" hint="700×500px">
              <SingleImg
                preview={ashtangaPrev}
                badge="Ashtanga"
                hint="JPG/PNG · 700×500px"
                onSelect={(f, p) => {
                  setAshtangaFile(f);
                  setAshtangaPrev(p);
                }}
                onRemove={() => {
                  setAshtangaFile(null);
                  setAshtangaPrev("");
                }}
              />
            </F>
            <F label="Image Alt Text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("ashtangaImgAlt")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Ashtanga Description"
              value={ashtangaDesc}
              onChange={(v) => {
                setAshtangaDesc(v);
                if (!isEmptyHtml(v)) setAstErr("");
              }}
              err={astErr}
              ph="This form of yoga practice combines breath and body movements…"
              required
              editorKey={`ashtanga-${editorKey}`}
            />
            <div className={styles.grid3}>
              {[1, 2, 3].map((n) => (
                <F key={n} label={`Feature Pill ${n}`}>
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${styles.inputNoCount}`}
                      {...register(`ashtangaPill${n}`)}
                    />
                  </div>
                </F>
              ))}
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 13: Primary Series ════════ */}
          <Sec title="13. Primary Series Curriculum">
            <F label="Section H3">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("primarySeriesH3")}
                />
              </div>
            </F>
            <F label="Sub-text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("primarySeriesSubtext")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Primary Series Intro"
              value={primaryIntro}
              onChange={setPrimaryIntro}
              ph="All students of 200 hour yoga teacher training will practice primary series…"
              h={180}
              editorKey={`primary-${editorKey}`}
            />
            <F label="Foundation Items">
              <StrList
                items={foundItems}
                label="Item"
                ph="Introduction to ashtanga vinyasa yoga"
                onAdd={() => setFoundItems([...foundItems, ""])}
                onRemove={(i) =>
                  setFoundItems(foundItems.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const a = [...foundItems];
                  a[i] = v;
                  setFoundItems(a);
                }}
              />
            </F>
            <F label="Week-by-Week Grid">
              {weekGrid.map((wk, i) => (
                <div
                  key={i}
                  className={styles.nestedCard}
                  style={{ marginBottom: "0.8rem" }}
                >
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>
                      Week Card {i + 1}
                    </span>
                    <button
                      type="button"
                      className={styles.removeNestedBtn}
                      onClick={() =>
                        setWeekGrid(weekGrid.filter((_, x) => x !== i))
                      }
                      disabled={weekGrid.length <= 1}
                    >
                      ✕ Remove
                    </button>
                  </div>
                  <div className={styles.nestedCardBody}>
                    <div className={styles.grid2}>
                      <F label="Week Label">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.week}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "week",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                      <F label="Icon">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.icon}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "icon",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                      <F label="Item 1 Title">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.t1}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "t1",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                      <F label="Item 1 Desc">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.d1}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "d1",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                      <F label="Item 2 Title">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.t2}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "t2",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                      <F label="Item 2 Desc">
                        <div className={styles.inputWrap}>
                          <input
                            className={`${styles.input} ${styles.inputNoCount}`}
                            value={wk.d2}
                            onChange={(e) =>
                              upd(
                                weekGrid,
                                setWeekGrid,
                                i,
                                "d2",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </F>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() =>
                  setWeekGrid([
                    ...weekGrid,
                    {
                      week: `Week ${weekGrid.length + 1}`,
                      icon: "🧘",
                      t1: "",
                      d1: "",
                      t2: "",
                      d2: "",
                    },
                  ])
                }
              >
                ＋ Add Week Card
              </button>
            </F>
            <F label="Primary Series Curriculum Image" hint="735×950px">
              <SingleImg
                preview={primaryImgPrev}
                badge="Primary Series"
                hint="JPG/PNG · 735×950px"
                onSelect={(f, p) => {
                  setPrimaryImgFile(f);
                  setPrimaryImgPrev(p);
                }}
                onRemove={() => {
                  setPrimaryImgFile(null);
                  setPrimaryImgPrev("");
                }}
              />
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 14: Hatha Yoga ════════ */}
          <Sec title="14. Hatha Yoga">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("hathaH2")}
                />
              </div>
            </F>
            <F label="Sub-heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("hathaSubtitle")}
                />
              </div>
            </F>
            <F label="Hatha Image" hint="700×500px">
              <SingleImg
                preview={hathaPrev}
                badge="Hatha"
                hint="JPG/PNG · 700×500px"
                onSelect={(f, p) => {
                  setHathaFile(f);
                  setHathaPrev(p);
                }}
                onRemove={() => {
                  setHathaFile(null);
                  setHathaPrev("");
                }}
              />
            </F>
            <F label="Image Alt Text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("hathaImgAlt")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Hatha Description"
              value={hathaDesc}
              onChange={(v) => {
                setHathaDesc(v);
                if (!isEmptyHtml(v)) setHtErr("");
              }}
              err={htErr}
              ph="Hatha yoga is the traditional, ancient and classical yoga…"
              required
              editorKey={`hatha-${editorKey}`}
            />
            <div className={styles.grid3}>
              {[1, 2, 3].map((n) => (
                <F key={n} label={`Feature Pill ${n}`}>
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${styles.inputNoCount}`}
                      {...register(`hathaPill${n}`)}
                    />
                  </div>
                </F>
              ))}
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 15: Hatha Asanas ════════ */}
          <Sec title="15. Hatha Yoga Asanas" badge={`${hatha43.length} asanas`}>
            <div className={styles.grid2}>
              <F label="Section H2">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("asanasH2")}
                  />
                </div>
              </F>
              <F label="Sub-text">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("asanasSubtext")}
                  />
                </div>
              </F>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.4rem 0",
                marginBottom: "0.2rem",
                borderBottom: "1px solid #e8d5b5",
              }}
            >
              {[
                "#",
                "No.",
                "Asana Name",
                "Sub Name",
                "Filter Category",
                "",
              ].map((h, i) => (
                <span
                  key={i}
                  style={{
                    width:
                      i === 0
                        ? 32
                        : i === 1
                          ? 55
                          : i === 4
                            ? 130
                            : i === 5
                              ? 32
                              : undefined,
                    flex: i === 2 || i === 3 ? 1 : undefined,
                    fontSize: 11,
                    color: "#b8860b",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {hatha43.map((a, i) => (
              <div
                key={i}
                className={styles.listItemRow}
                style={{
                  marginBottom: "0.4rem",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <span className={styles.listNum}>{i + 1}</span>
                <div
                  className={styles.inputWrap}
                  style={{ width: 55, flexShrink: 0 }}
                >
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={a.n}
                    onChange={(e) =>
                      upd(hatha43, setHatha43, i, "n", e.target.value)
                    }
                  />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={a.name}
                    placeholder="e.g. Tadasana"
                    onChange={(e) =>
                      upd(hatha43, setHatha43, i, "name", e.target.value)
                    }
                  />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={a.sub}
                    placeholder="e.g. Mountain pose"
                    onChange={(e) =>
                      upd(hatha43, setHatha43, i, "sub", e.target.value)
                    }
                  />
                </div>
                <div
                  className={styles.selectWrap}
                  style={{ width: 130, flexShrink: 0 }}
                >
                  <select
                    className={styles.select}
                    value={a.filter}
                    onChange={(e) =>
                      upd(hatha43, setHatha43, i, "filter", e.target.value)
                    }
                  >
                    {FILTER_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}>▾</span>
                </div>
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() => setHatha43(hatha43.filter((_, x) => x !== i))}
                  disabled={hatha43.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() =>
                setHatha43([
                  ...hatha43,
                  {
                    n: String(hatha43.length + 1),
                    name: "",
                    sub: "",
                    filter: "All Poses",
                  },
                ])
              }
            >
              ＋ Add Asana
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 16: Programs ════════ */}
          <Sec title="16. Programs" badge={`${programs.length} programs`}>
            <div className={styles.grid2}>
              <F label="Section H2">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={programsH2}
                    placeholder="Our Programs"
                    onChange={(e) => setProgramsH2(e.target.value)}
                  />
                </div>
              </F>
              <F label="Sub-text">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={programsSubtext}
                    placeholder="Choose the program that suits you best"
                    onChange={(e) => setProgramsSubtext(e.target.value)}
                  />
                </div>
              </F>
            </div>
            {programs.map((prog, i) => (
              <div key={i} className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Program {i + 1}</span>
                  <button
                    type="button"
                    className={styles.removeNestedBtn}
                    onClick={() =>
                      setPrograms(programs.filter((_, x) => x !== i))
                    }
                    disabled={programs.length <= 1}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Title">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          value={prog.title}
                          placeholder="e.g. Shared Room"
                          onChange={(e) =>
                            upd(
                              programs,
                              setPrograms,
                              i,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </F>
                    <F label="Duration">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          value={prog.duration}
                          placeholder="e.g. 26 Days"
                          onChange={(e) =>
                            upd(
                              programs,
                              setPrograms,
                              i,
                              "duration",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </F>
                    <F label="Start Date">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          value={prog.start}
                          placeholder="e.g. 1st of every month"
                          onChange={(e) =>
                            upd(
                              programs,
                              setPrograms,
                              i,
                              "start",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </F>
                    <F label="Old Price">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          value={prog.oldPrice}
                          placeholder="e.g. 1000"
                          onChange={(e) =>
                            upd(
                              programs,
                              setPrograms,
                              i,
                              "oldPrice",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </F>
                    <F label="New Price">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          value={prog.price}
                          placeholder="e.g. 699"
                          onChange={(e) =>
                            upd(
                              programs,
                              setPrograms,
                              i,
                              "price",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </F>
                  </div>
                  <F label="Program Image" hint="JPG/PNG · 600×400px">
                    <SingleImg
                      preview={prog.imagePreview}
                      badge={`Program ${i + 1}`}
                      hint="JPG/PNG · 600×400px"
                      onSelect={(f, p) => {
                        const np = [...programs];
                        np[i] = { ...np[i], imageFile: f, imagePreview: p };
                        setPrograms(np);
                      }}
                      onRemove={() => {
                        const np = [...programs];
                        np[i] = { ...np[i], imageFile: null, imagePreview: "" };
                        setPrograms(np);
                      }}
                    />
                  </F>
                  <ControlledJodit
                    label="Program Description"
                    value={prog.desc}
                    onChange={(v) => {
                      const np = [...programs];
                      np[i] = { ...np[i], desc: v };
                      setPrograms(np);
                    }}
                    ph="Program description…"
                    h={140}
                    editorKey={`prog-${i}-${editorKey}`}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() => setPrograms([...programs, makeEmptyProg()])}
            >
              ＋ Add Program
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 17: Evaluation ════════ */}
          <Sec title="17. Evaluation & Certification">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("evalH2")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Evaluation Description"
              value={evalDesc}
              onChange={(v) => {
                setEvalDesc(v);
                if (!isEmptyHtml(v)) setEvErr("");
              }}
              err={evErr}
              ph="There will be practical and theoretical exam…"
              required
              editorKey={`eval-${editorKey}`}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 18: Luxury Facilities ════════ */}
          <Sec title="18. Luxury Facilities">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("luxuryH2")}
                />
              </div>
            </F>
            <F label="Luxury Features">
              <StrList
                items={luxFeatures}
                label="Feature"
                ph="Accommodation (Private)"
                onAdd={() => setLuxFeatures([...luxFeatures, ""])}
                onRemove={(i) =>
                  setLuxFeatures(luxFeatures.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const a = [...luxFeatures];
                  a[i] = v;
                  setLuxFeatures(a);
                }}
              />
            </F>
            <F label="Luxury Images" hint="Up to 4 images">
              <MultiImageUpload
                files={luxImgFiles}
                previews={luxImgPrevs}
                hint="JPG/PNG · 400px wide"
                label="Luxury"
                maxFiles={4}
                onSelect={(f, p) => {
                  setLuxImgFiles(f);
                  setLuxImgPrevs(p);
                }}
                onRemove={(i) => {
                  setLuxImgFiles(luxImgFiles.filter((_, x) => x !== i));
                  setLuxImgPrevs(luxImgPrevs.filter((_, x) => x !== i));
                }}
              />
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 19: Indian Fees ════════ */}
          <Sec title="19. Indian Fees">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("indianFeeH2")}
                />
              </div>
            </F>
            {indianFees.map((fee, i) => (
              <div
                key={i}
                className={styles.listItemRow}
                style={{ marginBottom: "0.5rem" }}
              >
                <span className={styles.listNum}>{i + 1}</span>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={fee.label}
                    placeholder="Dormitory:"
                    onChange={(e) =>
                      upd(indianFees, setIndianFees, i, "label", e.target.value)
                    }
                  />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={fee.price}
                    placeholder="20,999 INR"
                    onChange={(e) =>
                      upd(indianFees, setIndianFees, i, "price", e.target.value)
                    }
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() =>
                    setIndianFees(indianFees.filter((_, x) => x !== i))
                  }
                  disabled={indianFees.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() =>
                setIndianFees([...indianFees, { label: "", price: "" }])
              }
            >
              ＋ Add Fee Tier
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 20: Daily Schedule ════════ */}
          <Sec title="20. Daily Schedule">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("scheduleH2")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Schedule Introduction"
              value={schedDesc}
              onChange={setSchedDesc}
              ph="Planning on teaching yoga?…"
              h={180}
              editorKey={`sched-${editorKey}`}
            />
            {schedRows.map((row, i) => (
              <div
                key={i}
                className={styles.listItemRow}
                style={{ marginBottom: "0.5rem" }}
              >
                <span className={styles.listNum}>{i + 1}</span>
                <div
                  className={styles.inputWrap}
                  style={{ width: 200, flexShrink: 0 }}
                >
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={row.time}
                    placeholder="06:45 AM - 08:00 AM"
                    onChange={(e) =>
                      upd(schedRows, setSchedRows, i, "time", e.target.value)
                    }
                  />
                </div>
                <div className={`${styles.inputWrap} ${styles.listInput}`}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    value={row.activity}
                    placeholder="Pranayama / Meditation"
                    onChange={(e) =>
                      upd(
                        schedRows,
                        setSchedRows,
                        i,
                        "activity",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeItemBtn}
                  onClick={() =>
                    setSchedRows(schedRows.filter((_, x) => x !== i))
                  }
                  disabled={schedRows.length <= 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() =>
                setSchedRows([...schedRows, { time: "", activity: "" }])
              }
            >
              ＋ Add Row
            </button>
            <F label="Schedule Images" hint="Up to 4 images">
              <MultiImageUpload
                files={schedImgFiles}
                previews={schedImgPrevs}
                hint="JPG/PNG · 300px wide"
                label="Schedule"
                maxFiles={4}
                onSelect={(f, p) => {
                  setSchedImgFiles(f);
                  setSchedImgPrevs(p);
                }}
                onRemove={(i) => {
                  setSchedImgFiles(schedImgFiles.filter((_, x) => x !== i));
                  setSchedImgPrevs(schedImgPrevs.filter((_, x) => x !== i));
                }}
              />
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 21: More Information ════════ */}
          <Sec title="21. More Information">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("moreInfoH2")}
                />
              </div>
            </F>
            <F label="Instruction Languages">
              {instrLangs.map((row, i) => (
                <div
                  key={i}
                  className={styles.listItemRow}
                  style={{ marginBottom: "0.5rem" }}
                >
                  <span className={styles.listNum}>{i + 1}</span>
                  <div
                    className={styles.inputWrap}
                    style={{ width: 140, flexShrink: 0 }}
                  >
                    <input
                      className={`${styles.input} ${styles.inputNoCount}`}
                      value={row.lang}
                      placeholder="English"
                      onChange={(e) =>
                        upd(
                          instrLangs,
                          setInstrLangs,
                          i,
                          "lang",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input
                      className={`${styles.input} ${styles.inputNoCount}`}
                      value={row.note}
                      placeholder="course happens every month"
                      onChange={(e) =>
                        upd(
                          instrLangs,
                          setInstrLangs,
                          i,
                          "note",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.removeItemBtn}
                    onClick={() =>
                      setInstrLangs(instrLangs.filter((_, x) => x !== i))
                    }
                    disabled={instrLangs.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addItemBtn}
                onClick={() =>
                  setInstrLangs([...instrLangs, { lang: "", note: "" }])
                }
              >
                ＋ Add Language
              </button>
            </F>

            {/* Spanish & Chinese Note */}
            <F label="Spanish & Chinese Note">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("spanishChineseNote")}
                />
              </div>
            </F>

            {/* ════ NEW FIELDS: Eligibility Criteria ════ */}
            <div
              style={{
                background: "linear-gradient(135deg,#fffdf7,#faf4e6)",
                border: "1.5px solid #e8d5b5",
                borderRadius: 10,
                padding: "1.2rem 1.4rem",
                marginTop: "1rem",
              }}
            >
              <p
                style={{
                  color: "#b8860b",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                  letterSpacing: "0.04em",
                }}
              >
                ── Eligibility Criteria Block ──
              </p>
              <F
                label="Eligibility Criteria Heading"
                hint="e.g. Eligibility Criteria for attending 200 Hour Yoga Teacher Training India"
              >
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="Eligibility Criteria for attending 200 Hour Yoga Teacher Training India"
                    {...register("eligibilityInfoTitle")}
                  />
                </div>
              </F>
              <F
                label="Eligibility Criteria Paragraph"
                hint="Displayed below the heading as a descriptive paragraph"
              >
                <div className={styles.inputWrap}>
                  <textarea
                    className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                    rows={4}
                    placeholder="A curious mind to learn and practice yoga, basic English knowledge, and self-discipline is all that you need for applying for this course! There is no upper age limit for the program. However, if you are below 15 years, you need to write to us."
                    {...register("eligibilityInfoText")}
                  />
                </div>
              </F>
            </div>

            {/* Visa & Passport */}
            <div style={{ marginTop: "1.2rem" }}>
              <F label="Visa & Passport Title">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("visaPassportTitle")}
                  />
                </div>
              </F>
              <ControlledJodit
                label="Visa & Passport Description"
                value={visaDesc}
                onChange={setVisaDesc}
                ph="You may need to have a valid tourist visa…"
                h={200}
                editorKey={`visa-${editorKey}`}
              />
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 22: Global Cert ════════ */}
          <Sec title="22. Get Globally Certified">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("globalCertH2")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Paragraph 1"
              value={globalCert1}
              onChange={setGlobalCert1}
              ph="At Association for Yoga and Meditation…"
              h={160}
              editorKey={`gc1-${editorKey}`}
            />
            <ControlledJodit
              label="Paragraph 2"
              value={globalCert2}
              onChange={setGlobalCert2}
              ph="As the best 200 Hour Yoga Teacher Teaching Course…"
              h={160}
              editorKey={`gc2-${editorKey}`}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 23: Requirements ════════ */}
          <Sec title="23. Requirements for Enrollment">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("requirementsH2")}
                />
              </div>
            </F>
            <F label="Requirements Image" hint="600×450px">
              <SingleImg
                preview={reqImgPrev}
                badge="Requirements"
                hint="JPG/PNG · 600×450px"
                onSelect={(f, p) => {
                  setReqImgFile(f);
                  setReqImgPrev(p);
                }}
                onRemove={() => {
                  setReqImgFile(null);
                  setReqImgPrev("");
                }}
              />
            </F>
            <F label="Image Alt Text">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("requirementsImgAlt")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Paragraph 1"
              value={req1}
              onChange={setReq1}
              ph="AYM Yoga School provides…"
              h={160}
              editorKey={`req1-${editorKey}`}
            />
            <ControlledJodit
              label="Paragraph 2"
              value={req2}
              onChange={setReq2}
              ph="The basic requirements for a 200 hour RYT…"
              h={160}
              editorKey={`req2-${editorKey}`}
            />
            <ControlledJodit
              label="Paragraph 3"
              value={req3}
              onChange={setReq3}
              ph="The applicant must have…"
              h={140}
              editorKey={`req3-${editorKey}`}
            />
            <ControlledJodit
              label="Paragraph 4"
              value={req4}
              onChange={setReq4}
              ph="The basics of anatomy should include…"
              h={140}
              editorKey={`req4-${editorKey}`}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 24: What You Need to Know ════════ */}
          <Sec
            title="24. What You Need to Know"
            badge={`${knowQA.length} blocks`}
          >
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("whatYouNeedH2")}
                />
              </div>
            </F>
            {knowQA.map((item, i) => (
              <div key={i} className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>
                    Q&A Block {i + 1}
                  </span>
                  <button
                    type="button"
                    className={styles.removeNestedBtn}
                    onClick={() => setKnowQA(knowQA.filter((_, x) => x !== i))}
                    disabled={knowQA.length <= 1}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Question">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        value={item.q}
                        onChange={(e) => {
                          const a = [...knowQA];
                          a[i] = { ...a[i], q: e.target.value };
                          setKnowQA(a);
                        }}
                      />
                    </div>
                  </F>
                  <F label="Answer">
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                        rows={5}
                        value={item.a}
                        onChange={(e) => {
                          const a = [...knowQA];
                          a[i] = { ...a[i], a: e.target.value };
                          setKnowQA(a);
                        }}
                      />
                    </div>
                  </F>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() => setKnowQA([...knowQA, { q: "", a: "" }])}
            >
              ＋ Add Q&A Block
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 25: Why AYM ════════ */}
          <Sec title="25. Why Choose AYM">
            <F label="Sub-heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("best200HrH4")}
                />
              </div>
            </F>
            <ControlledJodit
              label="Best 200hr Paragraph"
              value={best200Hr}
              onChange={setBest200Hr}
              ph="Where is the best yoga teacher training in the world?…"
              h={160}
              editorKey={`best-${editorKey}`}
            />
          </Sec>
          <D />

          {/* ════════ SECTION 26: What's Included ════════ */}
          <Sec title="26. What's Included">
            <F label="Sub-heading">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("whatsIncludedH4")}
                />
              </div>
            </F>
            <F label="Included Items">
              <StrList
                items={whatIncl}
                label="Item"
                ph="Yoga course fee."
                onAdd={() => setWhatIncl([...whatIncl, ""])}
                onRemove={(i) =>
                  setWhatIncl(whatIncl.filter((_, x) => x !== i))
                }
                onUpdate={(i, v) => {
                  const a = [...whatIncl];
                  a[i] = v;
                  setWhatIncl(a);
                }}
              />
            </F>
          </Sec>
          <D />

          {/* ════════ SECTION 27: Booking Steps ════════ */}
          <Sec title="27. Booking Steps">
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("bookingH2")}
                />
              </div>
            </F>
            {(
              [
                { num: 1, desc: step1Desc, setDesc: setStep1Desc },
                { num: 2, desc: step2Desc, setDesc: setStep2Desc },
                { num: 3, desc: step3Desc, setDesc: setStep3Desc },
                { num: 4, desc: step4Desc, setDesc: setStep4Desc },
              ] as const
            ).map(({ num, desc, setDesc }) => (
              <div key={num} className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>Step {num}</span>
                </div>
                <div className={styles.nestedCardBody}>
                  <div className={styles.grid2}>
                    <F label="Icon">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          {...register(`step${num}Icon`)}
                        />
                      </div>
                    </F>
                    <F label="Title">
                      <div className={styles.inputWrap}>
                        <input
                          className={`${styles.input} ${styles.inputNoCount}`}
                          {...register(`step${num}Title`)}
                        />
                      </div>
                    </F>
                  </div>
                  <ControlledJodit
                    label="Step Description"
                    value={desc}
                    onChange={setDesc as (v: string) => void}
                    ph={`Step ${num} description…`}
                    h={130}
                    editorKey={`step${num}-${editorKey}`}
                  />
                </div>
              </div>
            ))}
          </Sec>
          <D />

          {/* ════════ SECTION 28: FAQ ════════ */}
          <Sec title="28. FAQ" badge={`${faqItems.length} questions`}>
            <F label="Section H2">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("faqH2")}
                />
              </div>
            </F>
            {faqItems.map((item, i) => (
              <div key={i} className={styles.nestedCard}>
                <div className={styles.nestedCardHeader}>
                  <span className={styles.nestedCardNum}>FAQ {i + 1}</span>
                  <button
                    type="button"
                    className={styles.removeNestedBtn}
                    onClick={() =>
                      setFaqItems(faqItems.filter((_, x) => x !== i))
                    }
                    disabled={faqItems.length <= 1}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className={styles.nestedCardBody}>
                  <F label="Question">
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${styles.inputNoCount}`}
                        value={item.q}
                        onChange={(e) => {
                          const a = [...faqItems];
                          a[i] = { ...a[i], q: e.target.value };
                          setFaqItems(a);
                        }}
                      />
                    </div>
                  </F>
                  <F label="Answer">
                    <div className={styles.inputWrap}>
                      <textarea
                        className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                        rows={3}
                        value={item.a}
                        onChange={(e) => {
                          const a = [...faqItems];
                          a[i] = { ...a[i], a: e.target.value };
                          setFaqItems(a);
                        }}
                      />
                    </div>
                  </F>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addItemBtn}
              onClick={() => setFaqItems([...faqItems, { q: "", a: "" }])}
            >
              ＋ Add FAQ
            </button>
          </Sec>
          <D />

          {/* ════════ SECTION 29: CTA ════════ */}
          <Sec title="29. CTA Banner">
            <F label="Title">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("ctaTitle")}
                />
              </div>
            </F>
            <div className={styles.grid3}>
              <F label="Subtitle">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("ctaSubtitle")}
                  />
                </div>
              </F>
              <F label="Phone Number">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("ctaPhone")}
                  />
                </div>
              </F>
              <F label="Apply Button Text">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("ctaApplyBtnText")}
                  />
                </div>
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="WhatsApp Number">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("whatsappNumber")}
                  />
                </div>
              </F>
              <F label="WhatsApp Button Text">
                <div className={styles.inputWrap}>
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    {...register("whatsappBtnText")}
                  />
                </div>
              </F>
            </div>
          </Sec>
          <D />

          {/* ════════ SECTION 30: SEO ════════ */}
          <Sec title="30. SEO & Page Settings">
            <F label="Meta Title" req>
              <div
                className={`${styles.inputWrap} ${errors.metaTitle ? styles.inputError : ""}`}
              >
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("metaTitle", { required: "Required" })}
                />
              </div>
              {errors.metaTitle && (
                <p className={styles.errorMsg}>
                  ⚠ {errors.metaTitle.message as string}
                </p>
              )}
            </F>
            <F label="Meta Description" req>
              <div
                className={`${styles.inputWrap} ${errors.metaDesc ? styles.inputError : ""}`}
              >
                <textarea
                  className={`${styles.input} ${styles.textarea} ${styles.inputNoCount}`}
                  rows={3}
                  {...register("metaDesc", { required: "Required" })}
                />
              </div>
              {errors.metaDesc && (
                <p className={styles.errorMsg}>
                  ⚠ {errors.metaDesc.message as string}
                </p>
              )}
            </F>
            <F label="Meta Keywords">
              <div className={styles.inputWrap}>
                <input
                  className={`${styles.input} ${styles.inputNoCount}`}
                  {...register("metaKeywords")}
                />
              </div>
            </F>
            <div className={styles.grid2}>
              <F label="Slug" req>
                <div
                  className={`${styles.inputWrap} ${errors.slug ? styles.inputError : ""}`}
                >
                  <input
                    className={`${styles.input} ${styles.inputNoCount}`}
                    placeholder="200-hour-yoga-teacher-training-rishikesh"
                    {...register("slug", { required: "Required" })}
                  />
                </div>
                {errors.slug && (
                  <p className={styles.errorMsg}>
                    ⚠ {errors.slug.message as string}
                  </p>
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

          {/* ── Save Button ── */}
          <div
            className={styles.formActions}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "1rem",
              borderTop: "2px solid #f0e8d8",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              position: "sticky",
              bottom: 0,
              background: "#fff",
              zIndex: 10,
              padding: "1rem 1.5rem",
              boxShadow: "0 -4px 20px rgba(184,134,11,0.08)",
            }}
          >
            <button
              type="button"
              className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
              disabled={isSubmitting}
              onClick={handleSaveClick}
              style={{ minWidth: 200, fontSize: 16 }}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} /> Saving…
                </>
              ) : (
                <>
                  <span>✦</span> {isEditMode ? "Update" : "Save All"} Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}