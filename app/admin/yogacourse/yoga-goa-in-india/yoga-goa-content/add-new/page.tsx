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

function D() {
  return (
    <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#e8d5b5,transparent)", margin: "0.4rem 0 1.8rem" }} />
  );
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
   SMART URL PARSER — AUTO EMBED CONVERTER
   Supports:
   ✅ YouTube watch?v=
   ✅ YouTube Shorts
   ✅ youtu.be/
   ✅ YouTube embed (already)
   ✅ Instagram Reel
   ✅ Direct video URL (.mp4 etc.)
══════════════════════════════════════════ */
type UrlPlatform = "youtube" | "youtube_short" | "instagram" | "direct" | "embed" | "unknown";

interface ParsedUrl {
  platform: UrlPlatform;
  videoId?: string;
  embedUrl: string;
  displayType: "iframe" | "video" | "none";
  label: string;
}

function buildYouTubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&modestbranding=1`;
}

function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExts = /\.(mp4|webm|ogg|mov|avi|mkv|m4v)(\?.*)?$/i;
  if (videoExts.test(url)) return true;
  const embedPatterns = /youtube\.com\/(embed|watch|shorts)|youtu\.be|instagram\.com/i;
  if (embedPatterns.test(url)) return false;
  if (url.startsWith("blob:") || url.startsWith("data:video")) return true;
  return false;
}

function parseVideoUrl(rawUrl: string): ParsedUrl {
  const url = rawUrl.trim();
  if (!url) return { platform: "unknown", embedUrl: "", displayType: "none", label: "" };

  // Direct video file
  if (isDirectVideoUrl(url)) {
    return { platform: "direct", embedUrl: url, displayType: "video", label: "Direct Video URL (.mp4 etc.)" };
  }

  // YouTube embed already
  const ytEmbedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (ytEmbedMatch) {
    const id = ytEmbedMatch[1];
    return { platform: "embed", videoId: id, embedUrl: buildYouTubeEmbed(id), displayType: "iframe", label: "YouTube Embed URL" };
  }

  // YouTube Shorts
  const ytShortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (ytShortsMatch) {
    const id = ytShortsMatch[1];
    return { platform: "youtube_short", videoId: id, embedUrl: buildYouTubeEmbed(id), displayType: "iframe", label: "YouTube Shorts → Auto-converted ✨" };
  }

  // YouTube watch?v=
  const ytWatchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (ytWatchMatch) {
    const id = ytWatchMatch[1];
    return { platform: "youtube", videoId: id, embedUrl: buildYouTubeEmbed(id), displayType: "iframe", label: "YouTube Watch URL → Auto-converted ✨" };
  }

  // youtu.be/XXXX
  const ytShortLinkMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (ytShortLinkMatch) {
    const id = ytShortLinkMatch[1];
    return { platform: "youtube", videoId: id, embedUrl: buildYouTubeEmbed(id), displayType: "iframe", label: "youtu.be link → Auto-converted ✨" };
  }

  // Instagram Reel / Post
  const igMatch = url.match(/instagram\.com\/(reel|p)\/([a-zA-Z0-9_-]+)/);
  if (igMatch) {
    const shortcode = igMatch[2];
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;
    return { platform: "instagram", videoId: shortcode, embedUrl, displayType: "iframe", label: "Instagram Reel → Auto-converted ✨" };
  }

  // Unknown fallback
  return { platform: "unknown", embedUrl: url, displayType: "iframe", label: "Custom embed URL" };
}

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface CoreProgram {
  id: string; hrs: string; tag: string; subHeading: string;
  desc: string; linkText: string; linkHref: string;
}
interface SpecialProgram { id: string; title: string; desc: string; }
interface Highlight { id: string; num: string; title: string; body: string; }
interface ScheduleRow { id: string; time: string; activity: string; }
interface InfoField { id: string; label: string; }
interface ReelVideo {
  id: string;
  label: string;
  videoUrl: string;
  videoFile: string;
}

/* ── Defaults ── */
const DEFAULT_CORE_PROGRAMS: CoreProgram[] = [
  { id: "cp1", hrs: "100", tag: "Foundation", subHeading: "100-Hour Yoga Teacher Training in Goa", desc: "A foundational course for beginners or those looking to deepen their personal practice.", linkText: "View Dates & Fees →", linkHref: "#dates" },
  { id: "cp2", hrs: "200", tag: "Standard",   subHeading: "200-Hour Yoga Teacher Training in Goa", desc: "The internationally recognized standard certification to begin your journey as a yoga teacher.", linkText: "View Dates & Fees →", linkHref: "#dates" },
  { id: "cp3", hrs: "300", tag: "Advanced",   subHeading: "300-Hour Yoga Teacher Training in Goa", desc: "An advanced course for 200-hour certified teachers to expand their knowledge and skills.", linkText: "View Dates & Fees →", linkHref: "#dates" },
  { id: "cp4", hrs: "500", tag: "Mastery",    subHeading: "500-Hour Yoga Teacher Training in Goa", desc: "A comprehensive, advanced-level program for those seeking complete mastery in yoga instruction.", linkText: "View Dates & Fees →", linkHref: "#dates" },
];
const DEFAULT_SPECIAL_PROGRAMS: SpecialProgram[] = [
  { id: "sp1", title: "200-Hour Yoga TTC with Sound Healing", desc: "Combine foundational yoga teacher training with the therapeutic power of sound healing." },
  { id: "sp2", title: "300-Hour Yoga TTC with Sound Healing", desc: "An advanced-level course integrating advanced yoga techniques with immersive sound healing modalities." },
];
const DEFAULT_HIGHLIGHTS: Highlight[] = [
  { id: "h1", num: "01", title: "Ayurvedic Massages",     body: "At our center in Goa, we provide ayurvedic massages, known for their detoxification, healing, and relaxing effects on the body." },
  { id: "h2", num: "02", title: "Strength & Flexibility", body: "During the yoga TTC, you can notice for yourself that your body's strength and flexibility improve considerably." },
  { id: "h3", num: "03", title: "Deep Meditation",        body: "We have designed several meditation practices in the course that soothes your nervous system and helps you relax your mind." },
  { id: "h4", num: "04", title: "Yogic Vegetarian Diet",  body: "Throughout your stay at our yoga school, you will be served a delicious yogic vegetarian diet." },
  { id: "h5", num: "05", title: "Experienced Teachers",   body: "Our teachers are highly experienced in the realm of yoga, and they will gently guide you in your yogic journey." },
];
const DEFAULT_SCHEDULE: ScheduleRow[] = [
  { id: "s1",  time: "06:30–07:30", activity: "Optional Early Morning Meditation" },
  { id: "s2",  time: "07:30–08:30", activity: "Morning Yoga Class" },
  { id: "s3",  time: "08:30–09:30", activity: "Breakfast" },
  { id: "s4",  time: "09:30–10:30", activity: "Deep Meditation" },
  { id: "s5",  time: "10:30–11:30", activity: "Pranayama Workshop" },
  { id: "s6",  time: "11:30–12:30", activity: "Anatomy & Physiology Class" },
  { id: "s7",  time: "12:30–01:30", activity: "Lunch" },
  { id: "s8",  time: "01:30–02:30", activity: "Yogic Psychology Class" },
  { id: "s9",  time: "02:30–03:30", activity: "Class on Ayurveda" },
  { id: "s10", time: "03:30–04:30", activity: "Hatha Yoga Class" },
  { id: "s11", time: "04:30–05:30", activity: "Vinyasa Yoga Class" },
  { id: "s12", time: "05:30–06:30", activity: "Yoga Philosophy Class" },
  { id: "s13", time: "06:30–07:30", activity: "Class on Yoga Sutras" },
  { id: "s14", time: "07:30–08:30", activity: "Dinner" },
  { id: "s15", time: "08:30–09:30", activity: "Musical Evening" },
  { id: "s16", time: "09:30–10:30", activity: "Yog Nidra" },
  { id: "s17", time: "10:30 pm",    activity: "Lights Out — Good Night" },
];
const DEFAULT_APPLY_FIELDS: InfoField[] = [
  { id: "af1", label: "Full Name" },
  { id: "af2", label: "Address" },
  { id: "af3", label: "Email" },
  { id: "af4", label: "Phone No" },
  { id: "af5", label: "Date of Birth" },
  { id: "af6", label: "Country" },
  { id: "af7", label: "Date of Joining" },
  { id: "af8", label: "Course Applied (200/100hr)" },
];
const DEFAULT_REEL_VIDEOS: ReelVideo[] = [
  { id: "rv1", label: "Morning Practice",  videoUrl: "https://www.youtube.com/embed/X-4RQYlTRtk?autoplay=1&mute=1&loop=1&playlist=X-4RQYlTRtk&controls=0&playsinline=1&modestbranding=1", videoFile: "" },
  { id: "rv2", label: "Pranayama Session", videoUrl: "https://www.youtube.com/embed/lYeh7tUMLHQ?autoplay=1&mute=1&loop=1&playlist=lYeh7tUMLHQ&controls=0&playsinline=1&modestbranding=1", videoFile: "" },
  { id: "rv3", label: "Beach Meditation",  videoUrl: "https://www.youtube.com/embed/EJ6K-rhqevE?autoplay=1&mute=1&loop=1&playlist=EJ6K-rhqevE&controls=0&playsinline=1&modestbranding=1", videoFile: "" },
  { id: "rv4", label: "Yoga Flow",         videoUrl: "https://www.youtube.com/embed/v7AYKMP6rOE?autoplay=1&mute=1&loop=1&playlist=v7AYKMP6rOE&controls=0&playsinline=1&modestbranding=1", videoFile: "" },
];

/* ════════════════════════════════════════
   MANAGER COMPONENTS
════════════════════════════════════════ */
function CoreProgramManager({ items, onChange }: { items: CoreProgram[]; onChange: (v: CoreProgram[]) => void }) {
  const update = (id: string, field: keyof CoreProgram, value: string) =>
    onChange(items.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const add = () => onChange([...items, { id: `cp-${Date.now()}`, hrs: "", tag: "", subHeading: "", desc: "", linkText: "View Dates & Fees →", linkHref: "#dates" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((p) => p.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Program {idx + 1}: {item.hrs ? `${item.hrs}hr — ${item.tag}` : "New Program"}</span>
            {items.length > 1 && (<button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>)}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid3}>
              <F label="Hours (e.g. 200)">
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.hrs} placeholder="200" onChange={(e) => update(item.id, "hrs", e.target.value)} /></div>
              </F>
              <F label="Tag">
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.tag} placeholder="Standard" onChange={(e) => update(item.id, "tag", e.target.value)} /></div>
              </F>
            </div>
            <F label="Card Sub Heading" hint="e.g. 200-Hour Yoga Teacher Training in Goa">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.subHeading} placeholder="200-Hour Yoga Teacher Training in Goa" onChange={(e) => update(item.id, "subHeading", e.target.value)} /></div>
            </F>
            <F label="Description">
              <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.desc} placeholder="Program description…" onChange={(e) => update(item.id, "desc", e.target.value)} /></div>
            </F>
            <div className={styles.grid2}>
              <F label="Link Button Text" hint="e.g. View Dates & Fees →">
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.linkText} placeholder="View Dates & Fees →" onChange={(e) => update(item.id, "linkText", e.target.value)} /></div>
              </F>
              <F label="Link Button URL (href)" hint="e.g. #dates or /yoga-registration">
                <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.linkHref} placeholder="#dates" onChange={(e) => update(item.id, "linkHref", e.target.value)} /></div>
              </F>
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Core Program</button>
    </div>
  );
}

function SpecialProgramManager({ items, onChange }: { items: SpecialProgram[]; onChange: (v: SpecialProgram[]) => void }) {
  const update = (id: string, field: keyof SpecialProgram, value: string) =>
    onChange(items.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  const add = () => onChange([...items, { id: `sp-${Date.now()}`, title: "", desc: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((p) => p.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Specialty {idx + 1}: {item.title || "New Specialty Program"}</span>
            {items.length > 1 && (<button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>)}
          </div>
          <div className={styles.nestedCardBody}>
            <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.title} placeholder="e.g. 200-Hour Yoga TTC with Sound Healing" onChange={(e) => update(item.id, "title", e.target.value)} /></div></F>
            <F label="Description"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.desc} placeholder="Specialty program description…" onChange={(e) => update(item.id, "desc", e.target.value)} /></div></F>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Specialty Program</button>
    </div>
  );
}

function HighlightManager({ items, onChange }: { items: Highlight[]; onChange: (v: Highlight[]) => void }) {
  const update = (id: string, field: keyof Highlight, value: string) =>
    onChange(items.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
  const add = () => onChange([...items, { id: `h-${Date.now()}`, num: String(items.length + 1).padStart(2, "0"), title: "", body: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((h) => h.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Highlight {idx + 1}: {item.title || "New Highlight"}</span>
            {items.length > 1 && (<button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>)}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <F label="Number Label (e.g. 01)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.num} placeholder="01" onChange={(e) => update(item.id, "num", e.target.value)} /></div></F>
              <F label="Title"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.title} placeholder="Ayurvedic Massages" onChange={(e) => update(item.id, "title", e.target.value)} /></div></F>
            </div>
            <F label="Description"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} value={item.body} placeholder="Highlight description…" onChange={(e) => update(item.id, "body", e.target.value)} /></div></F>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Highlight</button>
    </div>
  );
}

function ScheduleManager({ items, onChange }: { items: ScheduleRow[]; onChange: (v: ScheduleRow[]) => void }) {
  const update = (id: string, field: keyof ScheduleRow, value: string) =>
    onChange(items.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  const add = () => onChange([...items, { id: `s-${Date.now()}`, time: "", activity: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((s) => s.id !== id)); };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.scheduleRow} style={{ gap: "0.75rem", alignItems: "center", borderBottom: "1px solid #f5ede0", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
          <span className={styles.listNum} style={{ flexShrink: 0 }}>{idx + 1}</span>
          <div className={styles.inputWrap} style={{ flex: "0 0 180px" }}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.time} placeholder="06:30–07:30" onChange={(e) => update(item.id, "time", e.target.value)} /></div>
          <div className={styles.inputWrap} style={{ flex: 1 }}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.activity} placeholder="Activity name…" onChange={(e) => update(item.id, "activity", e.target.value)} /></div>
          <button type="button" className={styles.removeItemBtn} onClick={() => remove(item.id)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Schedule Row</button>
    </div>
  );
}

function ApplyFieldsManager({ items, onChange }: { items: InfoField[]; onChange: (v: InfoField[]) => void }) {
  const update = (id: string, value: string) => onChange(items.map((f) => (f.id === id ? { ...f, label: value } : f)));
  const add = () => onChange([...items, { id: `af-${Date.now()}`, label: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((f) => f.id !== id)); };
  return (
    <>
      <div className={styles.listItems}>
        {items.map((item, i) => (
          <div key={item.id} className={styles.listItemRow}>
            <span className={styles.listNum}>{i + 1}</span>
            <div className={`${styles.inputWrap} ${styles.listInput}`}><input className={`${styles.input} ${styles.inputNoCount}`} value={item.label} placeholder="e.g. Full Name" onChange={(e) => update(item.id, e.target.value)} /></div>
            <button type="button" className={styles.removeItemBtn} onClick={() => remove(item.id)} disabled={items.length <= 1}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Field</button>
    </>
  );
}

/* ════════════════════════════════════════
   REEL VIDEO MANAGER — SMART URL AUTO-CONVERTER
   Supports (paste any — embed ban jayega automatically):
   ✅ YouTube watch?v=XXXX
   ✅ YouTube Shorts /shorts/XXXX
   ✅ youtu.be/XXXX
   ✅ YouTube embed (already embed)
   ✅ Instagram Reel /reel/XXXX/
   ✅ Direct video URL (.mp4 etc.)
   ✅ File Upload (MP4/WEBM/MOV)
════════════════════════════════════════ */
function ReelVideoManager({
  items,
  onChange,
  videoFiles,
  setVideoFiles,
  videoPreviews,
  setVideoPreviews,
}: {
  items: ReelVideo[];
  onChange: (v: ReelVideo[]) => void;
  videoFiles: Record<string, File>;
  setVideoFiles: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  videoPreviews: Record<string, string>;
  setVideoPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [tabs, setTabs] = useState<Record<string, "url" | "file">>({});

  const getTab = (id: string): "url" | "file" => tabs[id] ?? "url";
  const setTab = (id: string, t: "url" | "file") => setTabs((p) => ({ ...p, [id]: t }));

  const update = (id: string, field: keyof ReelVideo, value: string) =>
    onChange(items.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const add = () => {
    const id = `rv-${Date.now()}`;
    onChange([...items, { id, label: "", videoUrl: "", videoFile: "" }]);
  };

  const remove = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((r) => r.id !== id));
    setVideoFiles((p) => { const n = { ...p }; delete n[id]; return n; });
    setVideoPreviews((p) => { const n = { ...p }; delete n[id]; return n; });
  };

  return (
    <div>
      {/* ── Supported formats hint box ── */}
      <div style={{
        background: "linear-gradient(135deg,#fdf6e8,#faf0d8)",
        border: "1px solid #e8d5b5", borderRadius: 10,
        padding: "0.85rem 1rem", marginBottom: "1rem",
        fontSize: "0.8rem", color: "#5a3a10", lineHeight: 1.7,
      }}>
        <strong style={{ display: "block", marginBottom: "0.4rem", color: "#3a1f00", fontSize: "0.82rem" }}>
          🎬 Koi bhi URL paste karo — embed automatically ban jayega:
        </strong>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.1rem 1rem" }}>
          <span>✅ YouTube Watch</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>youtube.com/watch?v=XXXX</span>
          <span>✅ YouTube Shorts</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>youtube.com/shorts/XXXX</span>
          <span>✅ youtu.be link</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>youtu.be/XXXX</span>
          <span>✅ Instagram Reel</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>instagram.com/reel/XXXX/</span>
          <span>✅ Direct Video</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>example.com/video.mp4</span>
          <span>✅ File Upload</span><span style={{ color: "#7a5c2a", fontFamily: "monospace", fontSize: "0.75rem" }}>MP4 / WEBM / MOV</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        {items.map((item, idx) => {
          const activeTab = getTab(item.id);
          const filePreview = videoPreviews[item.id] || "";
          const existingFile = item.videoFile ? BASE_URL + item.videoFile : "";
          const displayPreview = filePreview || existingFile;

          // Smart URL parsing
          const parsed = parseVideoUrl(item.videoUrl);
          const hasValidUrl = item.videoUrl.trim().length > 0;

          return (
            <div key={item.id} className={styles.nestedCard}>
              <div className={styles.nestedCardHeader}>
                <span className={styles.nestedCardNum}>
                  Reel {idx + 1}{item.label ? ` — ${item.label}` : ""}
                </span>
                {items.length > 1 && (
                  <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className={styles.nestedCardBody}>
                {/* Label */}
                <F label="Reel Label" hint="e.g. Morning Practice">
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${styles.inputNoCount}`}
                      value={item.label}
                      placeholder="Morning Practice"
                      onChange={(e) => update(item.id, "label", e.target.value)}
                    />
                  </div>
                </F>

                {/* Source Toggle */}
                <div style={{ display: "flex", gap: 0, marginBottom: "0.75rem", borderRadius: 8, overflow: "hidden", border: "1px solid #e8d5b5" }}>
                  {(["url", "file"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(item.id, t)}
                      style={{
                        flex: 1, padding: "0.45rem 0", fontSize: "0.8rem", fontWeight: 600,
                        border: "none", cursor: "pointer",
                        background: activeTab === t ? "#c8880a" : "#faf8f4",
                        color: activeTab === t ? "#fff" : "#7a5c2a",
                        transition: "background 0.2s",
                      }}
                    >
                      {t === "url" ? "🔗 Paste URL" : "📁 Upload File"}
                    </button>
                  ))}
                </div>

                {/* ── URL TAB ── */}
                {activeTab === "url" && (
                  <>
                    <F
                      label="Video URL"
                      hint="YouTube Shorts / Watch / Instagram Reel / Direct MP4 — sab support hai"
                    >
                      <div className={styles.inputWrap}>
                        <textarea
                          className={`${styles.input} ${styles.textarea}`}
                          rows={3}
                          value={item.videoUrl}
                          placeholder={
                            "Koi bhi URL paste karo:\nhttps://www.youtube.com/shorts/XXXX\nhttps://www.instagram.com/reel/XXXX/\nhttps://youtu.be/XXXX\nhttps://youtube.com/watch?v=XXXX"
                          }
                          onChange={(e) => update(item.id, "videoUrl", e.target.value)}
                        />
                      </div>
                    </F>

                    {/* Smart URL type indicator */}
                    {hasValidUrl && (
                      <div style={{
                        fontSize: "0.72rem", marginBottom: "0.4rem",
                        padding: "0.28rem 0.7rem", borderRadius: 20,
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        background: parsed.platform === "unknown" ? "#fdf0d5" : "#edfaf0",
                        color: parsed.platform === "unknown" ? "#7a5c2a" : "#2a6030",
                        border: `1px solid ${parsed.platform === "unknown" ? "#e8d5b5" : "#aadabb"}`,
                        fontWeight: 600,
                      }}>
                        {parsed.platform === "unknown" ? "⚠️" : "✅"} {parsed.label}
                        {parsed.videoId && parsed.platform !== "direct" && (
                          <span style={{ fontSize: "0.68rem", opacity: 0.75, fontWeight: 400 }}>
                            ID: {parsed.videoId}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Show auto-converted embed URL */}
                    {hasValidUrl && parsed.embedUrl && parsed.embedUrl !== item.videoUrl && parsed.platform !== "direct" && (
                      <div style={{
                        background: "#f5f0e8", border: "1px dashed #c8a060",
                        borderRadius: 8, padding: "0.5rem 0.75rem", marginBottom: "0.5rem",
                        fontSize: "0.7rem", color: "#5a3a10",
                      }}>
                        <strong>✨ Auto-converted embed URL (save hoga):</strong>
                        <div style={{
                          fontFamily: "monospace", wordBreak: "break-all",
                          marginTop: "0.2rem", color: "#3a2000", fontSize: "0.67rem",
                          lineHeight: 1.4,
                        }}>
                          {parsed.embedUrl}
                        </div>
                      </div>
                    )}

                    {/* Instagram warning */}
                    {parsed.platform === "instagram" && (
                      <div style={{
                        marginBottom: "0.5rem", fontSize: "0.72rem",
                        background: "#fff8e8", border: "1px solid #f0d080",
                        borderRadius: 8, padding: "0.4rem 0.7rem", color: "#7a5c00",
                        lineHeight: 1.5,
                      }}>
                        ⚠️ <strong>Instagram Note:</strong> Instagram reels sirf logged-in users ko dikhte hain. Website visitors ke liye video file upload karna better rahega (📁 Upload File tab use karo).
                      </div>
                    )}

                    {/* Preview */}
                    {hasValidUrl && parsed.displayType !== "none" && (
                      <div style={{
                        borderRadius: 8, overflow: "hidden",
                        aspectRatio: "9/16", background: "#000", maxHeight: 220,
                        position: "relative",
                      }}>
                        {parsed.displayType === "video" ? (
                          // eslint-disable-next-line jsx-a11y/media-has-caption
                          <video
                            src={parsed.embedUrl}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            controls playsInline muted
                          />
                        ) : (
                          <iframe
                            src={parsed.embedUrl}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title={`Preview ${idx + 1}`}
                          />
                        )}
                        {/* Platform badge */}
                        <div style={{
                          position: "absolute", top: 6, left: 6,
                          background: "rgba(0,0,0,0.6)", color: "#fff",
                          fontSize: "0.62rem", padding: "2px 8px", borderRadius: 20,
                          fontWeight: 700, backdropFilter: "blur(4px)",
                        }}>
                          {parsed.platform === "youtube_short" && "▶ YT Shorts"}
                          {parsed.platform === "youtube" && "▶ YouTube"}
                          {parsed.platform === "embed" && "▶ YT Embed"}
                          {parsed.platform === "instagram" && "📸 Instagram"}
                          {parsed.platform === "direct" && "🎬 Direct Video"}
                          {parsed.platform === "unknown" && "🔗 Embed"}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ── FILE UPLOAD TAB ── */}
                {activeTab === "file" && (
                  <>
                    <F label="Upload Video File" hint="MP4 / WEBM / MOV — max 100MB recommended">
                      <div style={{
                        border: "2px dashed #e8d5b5", borderRadius: 10,
                        padding: "1.2rem", textAlign: "center",
                        background: "#faf8f4", cursor: "pointer", position: "relative",
                      }}>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setVideoFiles((p) => ({ ...p, [item.id]: f }));
                              setVideoPreviews((p) => ({ ...p, [item.id]: URL.createObjectURL(f) }));
                            }
                            e.target.value = "";
                          }}
                        />
                        <div style={{ fontSize: "2rem" }}>🎬</div>
                        <div style={{ fontSize: "0.82rem", color: "#7a5c2a", marginTop: "0.3rem" }}>
                          {videoFiles[item.id] ? `✅ ${videoFiles[item.id].name}` : "Click to choose a video file"}
                        </div>
                        {!videoFiles[item.id] && existingFile && (
                          <div style={{ fontSize: "0.75rem", color: "#3d6000", marginTop: "0.25rem" }}>
                            Current: {item.videoFile}
                          </div>
                        )}
                      </div>
                    </F>

                    {displayPreview && (
                      <div style={{ marginTop: "0.5rem", borderRadius: 8, overflow: "hidden", aspectRatio: "9/16", background: "#000", maxHeight: 220 }}>
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video
                          src={displayPreview}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          controls playsInline muted
                        />
                      </div>
                    )}

                    {(videoFiles[item.id] || item.videoFile) && (
                      <button
                        type="button"
                        style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "#8a2c00", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        onClick={() => {
                          setVideoFiles((p) => { const n = { ...p }; delete n[item.id]; return n; });
                          setVideoPreviews((p) => { const n = { ...p }; delete n[item.id]; return n; });
                          update(item.id, "videoFile", "");
                        }}
                      >
                        ✕ Remove File
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Reel Video</button>
    </div>
  );
}

/* ════════════════════════════════════════
   FORM VALUES
════════════════════════════════════════ */
interface GoaFormValues {
  status: "Active" | "Inactive";
  heroAlt: string;
  introSuperLabel: string;
  introHeading: string;
  introLocation: string;
  introBestTime: string;
  programsSuperLabel: string;
  programsSectionTitle: string;
  programsSubNote: string;
  coreProgramsSectionHeading: string;
  specialProgramsSectionHeading: string;
  arambolDesc: string;
  highlightsSuperLabel: string;
  highlightsSectionTitle: string;
  highlightsSubNote: string;
  bestTimeHeading: string;
  bestTimeText: string;
  curriculumSuperLabel: string;
  curriculumSectionTitle: string;
  focusSectionTitle: string;
  focusBodyText: string;
  scheduleSuperLabel: string;
  scheduleSectionTitle: string;
  scheduleImageAlt: string;
  batchesSuperLabel: string;
  batchesSectionTitle: string;
  batchesNote: string;
  batchesNoteEmail: string;
  batchesAirportNote: string;
  gallerySuperLabel: string;
  gallerySectionTitle: string;
  address1: string;
  address2: string;
  address3: string;
  phone1: string;
  phone2: string;
  reachHeading: string;
  reachViaAir: string;
  applyEmail: string;
  applyDepositAmount: string;
  refundPolicy: string;
  rulesHref: string;
  footerCtaTitle: string;
  footerCtaSub: string;
  footerCtaDatesHref: string;
  footerCtaEmailHref: string;
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function GoaYogaAdminForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [loadingData, setLoadingData]   = useState(false);
  const [isEdit, setIsEdit]             = useState(false);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr,  setHeroErr]  = useState("");

  const [introBigFile,   setIntroBigFile]   = useState<File | null>(null);
  const [introBigPrev,   setIntroBigPrev]   = useState("");
  const [introSmallFile, setIntroSmallFile] = useState<File | null>(null);
  const [introSmallPrev, setIntroSmallPrev] = useState("");

  const [beachImgFiles, setBeachImgFiles] = useState<Record<string, File>>({});
  const [beachImgPrevs, setBeachImgPrevs] = useState<Record<string, string>>({});

  const [scheduleImgFile, setScheduleImgFile] = useState<File | null>(null);
  const [scheduleImgPrev, setScheduleImgPrev] = useState("");

  const [reelVideoFiles,    setReelVideoFiles]    = useState<Record<string, File>>({});
  const [reelVideoPreviews, setReelVideoPreviews] = useState<Record<string, string>>({});
  const [reelVideos,        setReelVideos]        = useState<ReelVideo[]>(DEFAULT_REEL_VIDEOS);

  const introParaList = useParaList("ip1");

  const [corePrograms,    setCorePrograms]    = useState<CoreProgram[]>(DEFAULT_CORE_PROGRAMS);
  const [specialPrograms, setSpecialPrograms] = useState<SpecialProgram[]>(DEFAULT_SPECIAL_PROGRAMS);
  const [highlights,      setHighlights]      = useState<Highlight[]>(DEFAULT_HIGHLIGHTS);
  const [learnings, setLearnings] = useState<string[]>([
    "Training programs focused on holistic development of your personality — physical, emotional, and spiritual realms.",
    "Daily meditation sessions planned to help manage stress and bring relaxation to the mind.",
    "Asana sessions alongside anatomy and physiology of the human body for deeper understanding.",
    "History, philosophy of yoga, pranayamas (yogic breathing techniques), meditation and Ayurvedic concepts.",
    "The art and science of designing and conducting your own yoga sessions with confidence.",
    "Create asana sequences effortlessly to lead students and guide them on their yogic journey.",
  ]);
  const [mainFocus, setMainFocus] = useState<string[]>([
    "Yoga Asanas (postures)", "Pranayama (breathing)", "Meditation & Nidra",
    "Yoga Philosophy", "Anatomy & Physiology", "Ayurveda",
    "Mantra Chanting", "Yoga Sutras", "Yogic Psychology",
  ]);
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(DEFAULT_SCHEDULE);
  const [applyFields,  setApplyFields]  = useState<InfoField[]>(DEFAULT_APPLY_FIELDS);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<GoaFormValues>({
    defaultValues: {
      status: "Active",
      heroAlt: "Yoga Students Group",
      introSuperLabel: "Why Goa?",
      introHeading: "Yoga Teacher Training in Goa",
      introLocation: "Arambol",
      introBestTime: "October to April",
      programsSuperLabel: "Courses",
      programsSectionTitle: "Our Certified Yoga Teacher Training Programs in Goa",
      programsSubNote: "AYM has a yoga school in Goa, India. Here, we offer yoga instructor training courses and a range of health and wellness-related courses.",
      coreProgramsSectionHeading: "Core Yoga Teacher Training Programs",
      specialProgramsSectionHeading: "Specialized Programs: Yoga & Sound Healing",
      arambolDesc: "AYM Yoga School in Goa is located at Arambol. Arambol Beach is a beautiful and serene destination located in Goa, India...",
      highlightsSuperLabel: "Experience",
      highlightsSectionTitle: "Key Highlights of Our Yoga Teachers' Training Program in Goa",
      highlightsSubNote: "While designing our yoga teacher training course in Goa, we have consciously added various fun activities to the program.",
      bestTimeHeading: "When is the best time to attend the yoga teachers' training course in Goa?",
      bestTimeText: "From December to February, the weather is pleasant and quite conducive for taking sun baths on the beaches here.",
      curriculumSuperLabel: "Curriculum",
      curriculumSectionTitle: "What will you learn from our yoga teachers' training course?",
      focusSectionTitle: "Main Focus on Yoga Teacher Training in Goa",
      focusBodyText: "The syllabus will be same as taught in Rishikesh. Highly experienced yoga and meditation teachers will be hired in Goa to teach students.",
      scheduleSuperLabel: "Daily Routine",
      scheduleSectionTitle: "Daily Schedule for 200-Hour Yoga Course",
      scheduleImageAlt: "Yoga by the river Goa",
      batchesSuperLabel: "Investment",
      batchesSectionTitle: "Yoga Teacher Training Goa — Upcoming Batches",
      batchesNote: "Course Fee includes Dormitory Stay and Food. For accommodation upgrades, email us.",
      batchesNoteEmail: "aymyogaschool@gmail.com",
      batchesAirportNote: "Airport pickup from Goa airport to Arambol Yoga School will cost extra. Contact us for details.",
      gallerySuperLabel: "Our Home",
      gallerySectionTitle: "AYM Yoga School Goa — Campus",
      address1: "Behind Lavish Restaurant",
      address2: "H.No. 621, Madhalawada, Arambol",
      address3: "Pernem, North Goa, 403512",
      phone1: "+91-9528023388",
      phone2: "+91-7500277709",
      reachHeading: "How to reach Arambol Beach, Goa",
      reachViaAir: "The international airport in Goa is at Dabolim. It is 29 kilometers away from Panaji. From there you could reach Arambol, either by cab or by local bus.",
      applyEmail: "aymyogaschool@gmail.com",
      applyDepositAmount: "$310 US",
      refundPolicy: "Please note that there won't be any refund, in case you are not able to come for the course due to any reason. However, you can attend in another batch within one year.",
      rulesHref: "#",
      footerCtaTitle: "Begin Your Sacred Journey in Goa",
      footerCtaSub: "Join thousands of students who have transformed their lives at AYM Yoga School on the pristine beaches of Arambol",
      footerCtaDatesHref: "#dates",
      footerCtaEmailHref: "mailto:aymyogaschool@gmail.com",
    },
  });

  /* ── Load existing data ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/goa-yoga-page/get");
        const d   = res.data?.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);

        const keys: (keyof GoaFormValues)[] = [
          "status", "heroAlt", "introSuperLabel", "introHeading", "introLocation", "introBestTime",
          "programsSuperLabel", "programsSectionTitle", "programsSubNote",
          "coreProgramsSectionHeading", "specialProgramsSectionHeading", "arambolDesc",
          "highlightsSuperLabel", "highlightsSectionTitle", "highlightsSubNote", "bestTimeHeading", "bestTimeText",
          "curriculumSuperLabel", "curriculumSectionTitle", "focusSectionTitle", "focusBodyText",
          "scheduleSuperLabel", "scheduleSectionTitle", "scheduleImageAlt",
          "batchesSuperLabel", "batchesSectionTitle", "batchesNote", "batchesNoteEmail", "batchesAirportNote",
          "gallerySuperLabel", "gallerySectionTitle",
          "address1", "address2", "address3", "phone1", "phone2",
          "reachHeading", "reachViaAir", "applyEmail", "applyDepositAmount", "refundPolicy", "rulesHref",
          "footerCtaTitle", "footerCtaSub", "footerCtaDatesHref", "footerCtaEmailHref",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k] as any); });

        if (d.heroImage)       setHeroPrev(BASE_URL + d.heroImage);
        if (d.introBigImage)   setIntroBigPrev(BASE_URL + d.introBigImage);
        if (d.introSmallImage) setIntroSmallPrev(BASE_URL + d.introSmallImage);
        if (d.scheduleImage)   setScheduleImgPrev(BASE_URL + d.scheduleImage);

        if (d.introParagraphs?.length) introParaList.loadFromArray(d.introParagraphs, "ip1-");

        if (d.corePrograms?.length)    setCorePrograms(d.corePrograms);
        if (d.specialPrograms?.length) setSpecialPrograms(d.specialPrograms);
        if (d.highlights?.length)      setHighlights(d.highlights);
        if (d.learnings?.length)       setLearnings(d.learnings);
        if (d.mainFocus?.length)       setMainFocus(d.mainFocus);
        if (d.scheduleRows?.length)    setScheduleRows(d.scheduleRows);
        if (d.applyFields?.length)     setApplyFields(d.applyFields);

        if (d.beachImages) {
          const prevs: Record<string, string> = {};
          d.beachImages.forEach((b: { id: string; imgUrl: string }) => {
            if (b.imgUrl) prevs[b.id] = BASE_URL + b.imgUrl;
          });
          setBeachImgPrevs(prevs);
        }

        if (d.reelVideos?.length) {
          const loaded: ReelVideo[] = d.reelVideos.map(
            (rv: any, i: number) => ({
              id:        rv._id || rv.id || `rv-loaded-${i}`,
              label:     rv.label     || "",
              videoUrl:  rv.videoUrl  || "",
              videoFile: rv.videoFile || "",
            })
          );
          setReelVideos(loaded);
        }
      } catch {
        toast.error("Failed to load existing content");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  /* ── Submit ── */
  const onSubmit = async (data: GoaFormValues) => {
    if (!heroFile && !heroPrev) { setHeroErr("Hero image is required"); return; }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      fd.append(
        "introParagraphs",
        JSON.stringify(
          introParaList.ids
            .map((id) => cleanHTML(introParaList.ref.current[id]))
            .filter(Boolean)
        )
      );

      fd.append("corePrograms",    JSON.stringify(corePrograms));
      fd.append("specialPrograms", JSON.stringify(specialPrograms));
      fd.append("highlights",      JSON.stringify(highlights));
      fd.append("learnings",       JSON.stringify(learnings));
      fd.append("mainFocus",       JSON.stringify(mainFocus));
      fd.append("scheduleRows",    JSON.stringify(scheduleRows));
      fd.append("applyFields",     JSON.stringify(applyFields));

      // ── Auto-convert URLs before saving ──
      // Raw YouTube Shorts / watch URLs get converted to embed URLs automatically
      const reelVideosToSave = reelVideos.map((rv) => ({
        ...rv,
        videoUrl: parseVideoUrl(rv.videoUrl).embedUrl || rv.videoUrl,
      }));
      fd.append("reelVideos", JSON.stringify(reelVideosToSave));

      if (heroFile)        fd.append("heroImage",        heroFile);
      if (introBigFile)    fd.append("introBigImage",    introBigFile);
      if (introSmallFile)  fd.append("introSmallImage",  introSmallFile);
      if (scheduleImgFile) fd.append("scheduleImage",    scheduleImgFile);

      Object.entries(beachImgFiles).forEach(([id, f]) =>
        fd.append(`beachImg_${id}`, f)
      );

      Object.entries(reelVideoFiles).forEach(([id, f]) =>
        fd.append(`reelVideo_${id}`, f)
      );

      if (isEdit) {
        await api.put("/goa-yoga-page/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Goa page updated successfully!");
      } else {
        await api.post("/goa-yoga-page/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Goa page created successfully!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/yoga-goa-in-india/yoga-goa-content"), 1500);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) return (
    <div className={styles.loadingWrap}>
      <span className={styles.spinner} />
      <span>Loading Goa Yoga page content…</span>
    </div>
  );

  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Goa Yoga Page {isEdit ? "Updated" : "Saved"}!</h2>
        <p className={styles.successText}>Redirecting to list…</p>
      </div>
    </div>
  );

  return (
    <div className={styles.formPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/yoga-goa-in-india/yoga-goa-content")}>
          Goa Yoga Page
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit Goa Yoga Teacher Training Page" : "Add Goa Yoga Teacher Training Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Why Goa Intro · Programs · Highlights · Curriculum · Schedule · Batches · Reel Videos · Address & Apply
          </p>
        </div>
      </div>

      <div className={styles.ornament}>
        <span>❧</span><div className={styles.ornamentLine} />
        <span>ॐ</span><div className={styles.ornamentLine} />
        <span>❧</span>
      </div>

      <div className={styles.formCard}>

        {/* ══ SEC 1: HERO IMAGE ══ */}
        <Sec title="Hero Image" badge="Top of Page">
          <F label="Hero Image" req hint="Recommended: 1180×540px · JPG/PNG/WEBP">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
          <F label="Hero Image Alt Text">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Students Group" {...register("heroAlt")} />
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ SEC 2: INTRO / WHY GOA ══ */}
        <Sec title="Why Goa — Intro Section" badge="Section 2">
          <div className={styles.grid2}>
            <F label="Super Label (small text above heading)">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Why Goa?" {...register("introSuperLabel")} />
              </div>
            </F>
            <F label="Section Heading" req>
              <div className={`${styles.inputWrap} ${errors.introHeading ? styles.inputError : ""}`}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Teacher Training in Goa" {...register("introHeading", { required: "Required" })} />
              </div>
              {errors.introHeading && <p className={styles.errorMsg}>⚠ {errors.introHeading.message}</p>}
            </F>
          </div>

          <F label="Intro Paragraphs" hint="Multiple paragraphs about Goa & AYM school. Use editor for formatting.">
            {introParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={introParaList.ids.length}
                onSave={introParaList.save} onRemove={introParaList.remove}
                value={introParaList.ref.current[id]}
                ph="Have you considered attending a yoga teacher training in Goa?…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={introParaList.add}>＋ Add Paragraph</button>
          </F>

          <div className={styles.grid2}>
            <F label="Location Name (bold in text)" hint="e.g. Arambol">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Arambol" {...register("introLocation")} />
              </div>
            </F>
            <F label="Best Time to Join (bold)" hint="e.g. October to April">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} placeholder="October to April" {...register("introBestTime")} />
              </div>
            </F>
          </div>

          <div className={styles.grid2}>
            <F label="Intro — Main Image (Stack Big)" hint="700×500px · beach / yoga scene">
              <SingleImg
                preview={introBigPrev} badge="Main" hint="JPG/PNG/WEBP · 700×500px"
                onSelect={(f, p) => { setIntroBigFile(f); setIntroBigPrev(p); }}
                onRemove={() => { setIntroBigFile(null); setIntroBigPrev(""); }}
              />
            </F>
            <F label="Intro — Accent Image (Stack Small)" hint="400×280px · overlay image">
              <SingleImg
                preview={introSmallPrev} badge="Accent" hint="JPG/PNG/WEBP · 400×280px"
                onSelect={(f, p) => { setIntroSmallFile(f); setIntroSmallPrev(p); }}
                onRemove={() => { setIntroSmallFile(null); setIntroSmallPrev(""); }}
              />
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ SEC 3: PROGRAMS ══ */}
        <Sec title="Programs Section" badge="Section 3 — Courses">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Courses" {...register("programsSuperLabel")} /></div>
            </F>
            <F label="Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Our Certified Yoga Teacher Training Programs in Goa" {...register("programsSectionTitle")} /></div>
            </F>
          </div>
          <F label="Section Sub Note">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="AYM has a yoga school in Goa, India…" {...register("programsSubNote")} /></div>
          </F>
          <F label="Core Programs Sub-Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Core Yoga Teacher Training Programs" {...register("coreProgramsSectionHeading")} /></div>
          </F>
          <F label="Core Programs" hint="Add/remove course tiers (100hr, 200hr, 300hr, 500hr, etc.)">
            <CoreProgramManager items={corePrograms} onChange={setCorePrograms} />
          </F>
          <F label="Specialty Programs Sub-Section Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Specialized Programs: Yoga & Sound Healing" {...register("specialProgramsSectionHeading")} /></div>
          </F>
          <F label="Specialty Programs" hint="Add specialized course offerings with title and description.">
            <SpecialProgramManager items={specialPrograms} onChange={setSpecialPrograms} />
          </F>
          <F label="Arambol Beach Description" hint="Paragraph below the program cards and beach photos.">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={4} placeholder="AYM Yoga School in Goa is located at Arambol…" {...register("arambolDesc")} /></div>
          </F>
          <F label="Arambol Beach Photos (3 images)" hint="Shown as a row of 3 photos below the Arambol description.">
            <div className={styles.grid3}>
              {["beach1", "beach2", "beach3"].map((key, i) => (
                <SingleImg
                  key={key}
                  preview={beachImgPrevs[key] || ""}
                  badge={`Beach ${i + 1}`}
                  hint="800×500px JPG/PNG"
                  onSelect={(f, p) => {
                    setBeachImgFiles((prev) => ({ ...prev, [key]: f }));
                    setBeachImgPrevs((prev) => ({ ...prev, [key]: p }));
                  }}
                  onRemove={() => {
                    setBeachImgFiles((prev) => { const n = { ...prev }; delete n[key]; return n; });
                    setBeachImgPrevs((prev) => { const n = { ...prev }; delete n[key]; return n; });
                  }}
                />
              ))}
            </div>
          </F>
        </Sec>
        <D />

        {/* ══ SEC 4: HIGHLIGHTS ══ */}
        <Sec title="Key Highlights" badge="Section 4">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Experience" {...register("highlightsSuperLabel")} /></div>
            </F>
            <F label="Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Key Highlights of Our Yoga Teachers' Training Program in Goa" {...register("highlightsSectionTitle")} /></div>
            </F>
          </div>
          <F label="Section Sub Note">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="While designing our yoga teacher training course in Goa…" {...register("highlightsSubNote")} /></div>
          </F>
          <F label="Highlight Cards" hint="Numbered highlights with title and description.">
            <HighlightManager items={highlights} onChange={setHighlights} />
          </F>
          <F label="Best Time Box — Heading">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="When is the best time to attend the yoga teachers' training course in Goa?" {...register("bestTimeHeading")} /></div>
          </F>
          <F label="Best Time Box — Body Text">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="From December to February, the weather is pleasant…" {...register("bestTimeText")} /></div>
          </F>
        </Sec>
        <D />

        {/* ══ SEC 5: CURRICULUM ══ */}
        <Sec title="What You Will Learn — Curriculum" badge="Section 5">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Curriculum" {...register("curriculumSuperLabel")} /></div>
            </F>
            <F label="Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="What will you learn from our yoga teachers' training course?" {...register("curriculumSectionTitle")} /></div>
            </F>
          </div>
          <F label="Learnings List" hint="Each item is a numbered learning point displayed in the grid.">
            <StrList items={learnings} label="Learning" ph="Training programs focused on holistic development…"
              onAdd={() => setLearnings((p) => [...p, ""])}
              onRemove={(i) => setLearnings((p) => p.filter((_, j) => j !== i))}
              onUpdate={(i, v) => setLearnings((p) => p.map((x, j) => (j === i ? v : x)))} />
          </F>
          <F label="Main Focus Section Title">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Main Focus on Yoga Teacher Training in Goa" {...register("focusSectionTitle")} /></div>
          </F>
          <F label="Main Focus Body Text" hint="Paragraph shown above the focus chips.">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="The syllabus will be same as taught in Rishikesh…" {...register("focusBodyText")} /></div>
          </F>
          <F label="Main Focus Chips" hint="Short tags shown as pills (e.g. Yoga Asanas, Pranayama…)">
            <StrList items={mainFocus} label="Focus Chip" ph="e.g. Yoga Asanas (postures)"
              onAdd={() => setMainFocus((p) => [...p, ""])}
              onRemove={(i) => setMainFocus((p) => p.filter((_, j) => j !== i))}
              onUpdate={(i, v) => setMainFocus((p) => p.map((x, j) => (j === i ? v : x)))} />
          </F>
        </Sec>
        <D />

        {/* ══ SEC 6: DAILY SCHEDULE ══ */}
        <Sec title="Daily Schedule" badge="Section 6">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Daily Routine" {...register("scheduleSuperLabel")} /></div>
            </F>
            <F label="Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Daily Schedule for 200-Hour Yoga Course" {...register("scheduleSectionTitle")} /></div>
            </F>
          </div>
          <F label="Schedule Side Image" hint="Shown beside the schedule table. Recommended: 700×800px">
            <SingleImg
              preview={scheduleImgPrev} badge="Schedule" hint="JPG/PNG/WEBP · 700×800px"
              onSelect={(f, p) => { setScheduleImgFile(f); setScheduleImgPrev(p); }}
              onRemove={() => { setScheduleImgFile(null); setScheduleImgPrev(""); }}
            />
          </F>
          <F label="Schedule Image Alt Text">
            <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga by the river Goa" {...register("scheduleImageAlt")} /></div>
          </F>
          <F label="Schedule Rows" hint="Add/edit time slots and activities for the daily schedule.">
            <ScheduleManager items={scheduleRows} onChange={setScheduleRows} />
          </F>
        </Sec>
        <D />

        {/* ══ SEC 7: BATCHES SECTION ══ */}
        <Sec title="Upcoming Batches Section" badge="Section 7 — Seat Booking">
          <div className={styles.grid2}>
            <F label="Super Label">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Investment" {...register("batchesSuperLabel")} /></div>
            </F>
            <F label="Section Title">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Yoga Teacher Training Goa — Upcoming Batches" {...register("batchesSectionTitle")} /></div>
            </F>
          </div>
          <F label="Table Note Text">
            <div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={2} placeholder="Course Fee includes Dormitory Stay and Food…" {...register("batchesNote")} /></div>
          </F>
          <div className={styles.grid2}>
            <F label="Email (shown in note link)">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="aymyogaschool@gmail.com" {...register("batchesNoteEmail")} /></div>
            </F>
            <F label="Airport Pickup Note">
              <div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Airport pickup from Goa airport to Arambol…" {...register("batchesAirportNote")} /></div>
            </F>
          </div>
        </Sec>
        <D />

        {/* ══ SEC 8: REEL VIDEOS ══ */}
        <Sec title="Reel Videos — Life at Ashram" badge="Section 8 — Videos">
          <ReelVideoManager
            items={reelVideos}
            onChange={setReelVideos}
            videoFiles={reelVideoFiles}
            setVideoFiles={setReelVideoFiles}
            videoPreviews={reelVideoPreviews}
            setVideoPreviews={setReelVideoPreviews}
          />
        </Sec>
        <D />

        {/* ══ SEC 9: ADDRESS + HOW TO REACH + APPLY + REFUND ══ */}
        <Sec title="Address, How to Reach & Apply" badge="Section 9 — Info Cards">
          <h4 style={{ fontSize: "0.88rem", color: "#4a2f0f", margin: "0 0 0.75rem", fontWeight: 700 }}>📍 Address</h4>
          <div className={styles.grid3}>
            <F label="Address Line 1"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Behind Lavish Restaurant" {...register("address1")} /></div></F>
            <F label="Address Line 2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="H.No. 621, Madhalawada, Arambol" {...register("address2")} /></div></F>
            <F label="Address Line 3 (City, Pin)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Pernem, North Goa, 403512" {...register("address3")} /></div></F>
          </div>
          <div className={styles.grid2}>
            <F label="Phone 1"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="+91-9528023388" {...register("phone1")} /></div></F>
            <F label="Phone 2"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="+91-7500277709" {...register("phone2")} /></div></F>
          </div>

          <div style={{ height: 1, background: "#f5ede0", margin: "1rem 0" }} />
          <h4 style={{ fontSize: "0.88rem", color: "#4a2f0f", margin: "0 0 0.75rem", fontWeight: 700 }}>✈️ How to Reach</h4>
          <F label="How to Reach — Card Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="How to reach Arambol Beach, Goa" {...register("reachHeading")} /></div></F>
          <F label="Via Air — Text"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="The international airport in Goa is at Dabolim…" {...register("reachViaAir")} /></div></F>

          <div style={{ height: 1, background: "#f5ede0", margin: "1rem 0" }} />
          <h4 style={{ fontSize: "0.88rem", color: "#4a2f0f", margin: "0 0 0.75rem", fontWeight: 700 }}>📝 How to Apply</h4>
          <div className={styles.grid2}>
            <F label="Application Email"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="aymyogaschool@gmail.com" {...register("applyEmail")} /></div></F>
            <F label="Deposit Amount to Confirm Seat"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="$310 US" {...register("applyDepositAmount")} /></div></F>
          </div>
          <F label="Application Form Fields" hint="Fields the student must send in the email application.">
            <ApplyFieldsManager items={applyFields} onChange={setApplyFields} />
          </F>

          <div style={{ height: 1, background: "#f5ede0", margin: "1rem 0" }} />
          <h4 style={{ fontSize: "0.88rem", color: "#4a2f0f", margin: "0 0 0.75rem", fontWeight: 700 }}>🔄 Refund Rules</h4>
          <F label="Refund Policy Text"><div className={styles.inputWrap}><textarea className={`${styles.input} ${styles.textarea}`} rows={3} placeholder="Please note that there won't be any refund…" {...register("refundPolicy")} /></div></F>
          <F label="Rules & Regulations Link (href)"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="/rules-and-regulations" {...register("rulesHref")} /></div></F>
        </Sec>
        <D />

        {/* ══ SEC 10: FOOTER CTA ══ */}
        <Sec title="Footer CTA Section" badge="Section 10 — Bottom Banner">
          <div className={styles.grid2}>
            <F label="CTA Heading"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Begin Your Sacred Journey in Goa" {...register("footerCtaTitle")} /></div></F>
            <F label="CTA Sub Text"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="Join thousands of students who have transformed their lives…" {...register("footerCtaSub")} /></div></F>
          </div>
          <div className={styles.grid2}>
            <F label="View Dates Button Link"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="#dates" {...register("footerCtaDatesHref")} /></div></F>
            <F label="Email Us Button Link"><div className={styles.inputWrap}><input className={`${styles.input} ${styles.inputNoCount}`} placeholder="mailto:aymyogaschool@gmail.com" {...register("footerCtaEmailHref")} /></div></F>
          </div>
        </Sec>
        <D />

        {/* ══ SEC 11: PAGE SETTINGS ══ */}
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

      {/* Form Actions */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/yoga-goa-in-india/yoga-goa-content" className={styles.cancelBtn}>
          ← Cancel
        </Link>
        <button
          type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Goa Yoga Page</>
          )}
        </button>
      </div>
    </div>
  );
}