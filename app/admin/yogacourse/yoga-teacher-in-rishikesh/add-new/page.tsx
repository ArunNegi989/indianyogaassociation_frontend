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
   ACCREDITATION BADGE MANAGER
══════════════════════════════════════════ */
interface AccredBadge { id: string; label: string; badge: string; imgUrl: string; }

const DEFAULT_ACCRED: AccredBadge[] = [
  { id: "ab1", label: "RYS 200 – Yoga Alliance", badge: "RYS 200", imgUrl: "" },
  { id: "ab2", label: "RYS 300 – Yoga Alliance", badge: "RYS 300", imgUrl: "" },
  { id: "ab3", label: "RYS 500 – Yoga Alliance", badge: "RYS 500", imgUrl: "" },
  { id: "ab4", label: "Yoga Certification Board – Ministry of AYUSH", badge: "YCB", imgUrl: "" },
];

function AccredManager({
  items, onChange, imgFiles, setImgFiles, imgPreviews, setImgPreviews,
}: {
  items: AccredBadge[];
  onChange: (v: AccredBadge[]) => void;
  imgFiles: Record<string, File>;
  setImgFiles: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  imgPreviews: Record<string, string>;
  setImgPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const update = (id: string, field: keyof AccredBadge, value: string) =>
    onChange(items.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  const add = () => onChange([...items, { id: `ab-${Date.now()}`, label: "", badge: "", imgUrl: "" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((a) => a.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Badge {idx + 1}: {item.badge || "New Badge"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <div className={styles.grid2}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Badge Short Text</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.badge}
                    placeholder="e.g. RYS 200" onChange={(e) => update(item.id, "badge", e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} style={{ fontSize: "0.8rem" }}>Label / Caption</label>
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.label}
                    placeholder="e.g. RYS 200 – Yoga Alliance" onChange={(e) => update(item.id, "label", e.target.value)} />
                </div>
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} style={{ fontSize: "0.8rem" }}>Certificate Image</label>
              <SingleImg
                preview={imgPreviews[item.id] || item.imgUrl || ""}
                badge={item.badge}
                hint="PNG/JPG · 400×400px certificate logo"
                onSelect={(f, p) => {
                  setImgFiles((prev) => ({ ...prev, [item.id]: f }));
                  setImgPreviews((prev) => ({ ...prev, [item.id]: p }));
                }}
                onRemove={() => {
                  setImgFiles((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                  setImgPreviews((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                  update(item.id, "imgUrl", "");
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Accreditation Badge</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   COURSE CARD MANAGER  (200/300/500 hr)
══════════════════════════════════════════ */
interface CourseCardData {
  id: string;
  title: string;
  description: string;
  duration: string;
  certificate: string;
  detailsLabel: string;
  detailsHref: string;
  bookHref: string;
  imgAlt: string;
  imgUrl: string;
  reverse: boolean;
}

const DEFAULT_COURSES: CourseCardData[] = [
  {
    id: "cc1",
    title: "200 Hours Yoga Teacher Training in Rishikesh",
    description: "Our 200 hour yoga course is thoughtfully crafted to offer a deep understanding of yoga principles, techniques, and philosophy. This comprehensive course covers various yoga practices, including asanas, pranayama, meditation, anatomy, and teaching methodology.",
    duration: "24 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "200 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "200 Hour Yoga Teacher Training Rishikesh — students in Vrikshasana",
    imgUrl: "",
    reverse: false,
  },
  {
    id: "cc2",
    title: "300 Hours Yoga Teacher Training in Rishikesh",
    description: "Our 300 hour yoga course is carefully designed to build upon the foundational knowledge gained in the 200-hour course. This advanced program delves deeper into yoga philosophy, advanced asanas, pranayama techniques, meditation, subtle anatomy, and the art of teaching.",
    duration: "28 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "300 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "300 Hour Yoga Teacher Training Rishikesh — advanced class",
    imgUrl: "",
    reverse: true,
  },
  {
    id: "cc3",
    title: "500 Hours Yoga Teacher Training in Rishikesh",
    description: "Our 500 hour yoga course is designed to deepen your practice and refine your teaching skills. This advanced program explores yoga philosophy, advanced asanas, pranayama techniques, meditation, subtle anatomy, and the art of teaching.",
    duration: "56 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "500 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "500 Hour Yoga Teacher Training Rishikesh — large group class",
    imgUrl: "",
    reverse: false,
  },
];

function CourseCardManager({
  items, onChange, imgFiles, setImgFiles, imgPreviews, setImgPreviews,
}: {
  items: CourseCardData[];
  onChange: (v: CourseCardData[]) => void;
  imgFiles: Record<string, File>;
  setImgFiles: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  imgPreviews: Record<string, string>;
  setImgPreviews: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const update = (id: string, field: keyof CourseCardData, value: string | boolean) =>
    onChange(items.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  const add = () => onChange([...items, {
    id: `cc-${Date.now()}`, title: "", description: "", duration: "", certificate: "",
    detailsLabel: "View Details", detailsHref: "#", bookHref: "#", imgAlt: "", imgUrl: "", reverse: false,
  }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((c) => c.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.nestedCard} style={{ marginBottom: "1rem" }}>
          <div className={styles.nestedCardHeader}>
            <span className={styles.nestedCardNum}>Course Card {idx + 1}: {item.title || "New Course"}</span>
            {items.length > 1 && (
              <button type="button" className={styles.removeNestedBtn} onClick={() => remove(item.id)}>✕ Remove</button>
            )}
          </div>
          <div className={styles.nestedCardBody}>
            <F label="Course Title">
              <div className={styles.inputWrap}>
                <input className={`${styles.input} ${styles.inputNoCount}`} value={item.title}
                  placeholder="e.g. 200 Hours Yoga Teacher Training in Rishikesh"
                  onChange={(e) => update(item.id, "title", e.target.value)} />
              </div>
            </F>
            <F label="Description">
              <div className={styles.inputWrap}>
                <textarea className={`${styles.input} ${styles.textarea}`} rows={4} value={item.description}
                  placeholder="Course description…"
                  onChange={(e) => update(item.id, "description", e.target.value)} />
              </div>
            </F>
            <div className={styles.grid2}>
              <F label="Duration">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.duration}
                    placeholder="e.g. 24 Days." onChange={(e) => update(item.id, "duration", e.target.value)} />
                </div>
              </F>
              <F label="Certificate">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.certificate}
                    placeholder="e.g. Yoga Alliance, USA" onChange={(e) => update(item.id, "certificate", e.target.value)} />
                </div>
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="Details Button Label">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.detailsLabel}
                    placeholder="e.g. 200 Hour Details" onChange={(e) => update(item.id, "detailsLabel", e.target.value)} />
                </div>
              </F>
              <F label="Details Button Link (href)">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.detailsHref}
                    placeholder="/courses/200-hour-yoga-ttc" onChange={(e) => update(item.id, "detailsHref", e.target.value)} />
                </div>
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="Book Now Link (href)">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.bookHref}
                    placeholder="/book/200-hour-ttc" onChange={(e) => update(item.id, "bookHref", e.target.value)} />
                </div>
              </F>
              <F label="Image Alt Text">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.imgAlt}
                    placeholder="Descriptive alt text for SEO" onChange={(e) => update(item.id, "imgAlt", e.target.value)} />
                </div>
              </F>
            </div>
            <F label="Course Image" hint="Recommended: 700×500px · JPG/PNG/WEBP">
              <SingleImg
                preview={imgPreviews[item.id] || item.imgUrl || ""}
                badge={`Course ${idx + 1}`}
                hint="JPG/PNG/WEBP · 700×500px"
                onSelect={(f, p) => {
                  setImgFiles((prev) => ({ ...prev, [item.id]: f }));
                  setImgPreviews((prev) => ({ ...prev, [item.id]: p }));
                }}
                onRemove={() => {
                  setImgFiles((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                  setImgPreviews((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
                  update(item.id, "imgUrl", "");
                }}
              />
            </F>
            <F label="Layout" hint="Controls whether the image appears on left or right side.">
              <div className={styles.selectWrap}>
                <select className={styles.select} value={item.reverse ? "true" : "false"}
                  onChange={(e) => update(item.id, "reverse", e.target.value === "true")}>
                  <option value="false">Image Left, Text Right (Normal)</option>
                  <option value="true">Image Right, Text Left (Reversed)</option>
                </select>
                <span className={styles.selectArrow}>▾</span>
              </div>
            </F>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Course Card</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SPECIALTY COURSE CARD MANAGER
══════════════════════════════════════════ */
const DEFAULT_SPECIALTY: CourseCardData[] = [
  {
    id: "sc1",
    title: "Ayurveda Yoga Course in Rishikesh",
    description: "Discover the transformative energy of traditional healing with the Ayurveda course at AYM Yoga School in Rishikesh. Our comprehensive program offers in-depth knowledge of Ayurvedic principles, herbal treatments, and lifestyle practices.",
    duration: "7, 14 & 21 Days",
    certificate: "AYM YOGA SCHOOL.",
    detailsLabel: "Ayurveda Courses",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "Ayurveda Yoga Course Rishikesh — shirodhara treatment",
    imgUrl: "",
    reverse: true,
  },
  {
    id: "sc2",
    title: "Sound Healing Course in Rishikesh",
    description: "Transform your well-being with the Sound Healing Course at AYM Yoga School in Rishikesh. Our expert instructors guide you through ancient techniques that harness the power of sound for relaxation and healing.",
    duration: "5 Days.",
    certificate: "Yoga Alliance, USA.",
    detailsLabel: "Sound Healing Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "Sound Healing Course Rishikesh — singing bowls",
    imgUrl: "",
    reverse: false,
  },
];

/* ══════════════════════════════════════════
   INLINE LINK MANAGER
══════════════════════════════════════════ */
interface InlineLink { id: string; text: string; href: string; }

function InlineLinkManager({ items, onChange }: { items: InlineLink[]; onChange: (v: InlineLink[]) => void }) {
  const update = (id: string, field: keyof InlineLink, value: string) =>
    onChange(items.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  const add = () => onChange([...items, { id: `il-${Date.now()}`, text: "", href: "#" }]);
  const remove = (id: string) => { if (items.length <= 1) return; onChange(items.filter((l) => l.id !== id)); };

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", alignItems: "flex-start", gap: "0.5rem" }}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.text}
              placeholder="Link text e.g. 200 hour residential yoga teacher training in rishikesh"
              onChange={(e) => update(item.id, "text", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.href}
              placeholder="/courses/200-hour-ttc"
              onChange={(e) => update(item.id, "href", e.target.value)} />
          </div>
          <button type="button" className={styles.removeItemBtn}
            onClick={() => remove(item.id)} disabled={items.length <= 1}>✕</button>
        </div>
      ))}
      <button type="button" className={styles.addItemBtn} onClick={add}>＋ Add Inline Link</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   FORM VALUES INTERFACE
══════════════════════════════════════════ */
interface BestYogaSchoolFormValues {
  status: "Active" | "Inactive";
  // Sec 1 — Hero
  heroTitle: string;
  // Sec 1 — Accreditations
  accrSectionTitle: string;
  // Sec 2 — Body Text
  // Sec 3 — Courses
  coursesSectionTitle: string;
  // Sec 4 — Specialty Courses
  specialtySectionTitle: string;
}

/* ══════════════════════════════════════════
   MAIN FORM COMPONENT
══════════════════════════════════════════ */
export default function BestYogaSchoolAdminForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* ── Hero Image ── */
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPrev, setHeroPrev] = useState("");
  const [heroErr, setHeroErr] = useState("");

  /* ── Accreditation badge images ── */
  const [accredImgFiles, setAccredImgFiles] = useState<Record<string, File>>({});
  const [accredImgPrevs, setAccredImgPrevs] = useState<Record<string, string>>({});

  /* ── Course card images ── */
  const [courseImgFiles, setCourseImgFiles] = useState<Record<string, File>>({});
  const [courseImgPrevs, setCourseImgPrevs] = useState<Record<string, string>>({});

  /* ── Specialty course images ── */
  const [specialtyImgFiles, setSpecialtyImgFiles] = useState<Record<string, File>>({});
  const [specialtyImgPrevs, setSpecialtyImgPrevs] = useState<Record<string, string>>({});

  /* ── Rich text (body paragraphs section 1) ── */
  const bodyParaList = useParaList("bp1");
  const bodyParaList2 = useParaList("bp2"); // second set of body paras (after accred section)

  /* ── Dynamic managers ── */
  const [accredBadges, setAccredBadges]     = useState<AccredBadge[]>(DEFAULT_ACCRED);
  const [courseCards, setCourseCards]         = useState<CourseCardData[]>(DEFAULT_COURSES);
  const [specialtyCourses, setSpecialtyCourses] = useState<CourseCardData[]>(DEFAULT_SPECIALTY);
  const [inlineLinks, setInlineLinks]         = useState<InlineLink[]>([
    { id: "il1", text: "200 hour residential yoga teacher training in rishikesh", href: "#" },
    { id: "il2", text: "300 hour residential yoga teacher training in rishikesh", href: "#" },
    { id: "il3", text: "500 hours residential yoga teacher teaching certifications in Rishikesh India", href: "#" },
  ]);
  const [inlineLinks2, setInlineLinks2]       = useState<InlineLink[]>([
    { id: "il4", text: "best yoga teacher training for beginner in rishikesh", href: "#" },
  ]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BestYogaSchoolFormValues>({
    defaultValues: {
      status: "Active",
      heroTitle: "Best Yoga Teacher Training Rishikesh – Best Yoga School Rishikesh",
      accrSectionTitle: "Our Accreditations – AYM Yoga School",
      coursesSectionTitle: "Our Yoga Teacher Training Courses",
      specialtySectionTitle: "Specialty Courses",
    },
  });

  /* ── Fetch existing data ── */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const res = await api.get("/best-yoga-school/get");
        const d = res.data?.data;
        if (!d) { setIsEdit(false); return; }
        setIsEdit(true);

        const keys: (keyof BestYogaSchoolFormValues)[] = [
          "status", "heroTitle", "accrSectionTitle", "coursesSectionTitle", "specialtySectionTitle",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k] as any); });

        /* Images */
        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);

        /* Para lists */
        if (d.bodyParagraphs1?.length)  bodyParaList.loadFromArray(d.bodyParagraphs1, "bp1-");
        if (d.bodyParagraphs2?.length)  bodyParaList2.loadFromArray(d.bodyParagraphs2, "bp2-");

        /* Dynamic arrays */
        if (d.accredBadges?.length)       setAccredBadges(d.accredBadges);
        if (d.courseCards?.length)         setCourseCards(d.courseCards);
        if (d.specialtyCourses?.length)    setSpecialtyCourses(d.specialtyCourses);
        if (d.inlineLinks?.length)         setInlineLinks(d.inlineLinks);
        if (d.inlineLinks2?.length)        setInlineLinks2(d.inlineLinks2);

        /* Accred image previews from server */
        if (d.accredBadges) {
          const prevs: Record<string, string> = {};
          d.accredBadges.forEach((b: AccredBadge) => { if (b.imgUrl) prevs[b.id] = BASE_URL + b.imgUrl; });
          setAccredImgPrevs(prevs);
        }
        /* Course image previews */
        if (d.courseCards) {
          const prevs: Record<string, string> = {};
          d.courseCards.forEach((c: CourseCardData) => { if (c.imgUrl) prevs[c.id] = BASE_URL + c.imgUrl; });
          setCourseImgPrevs(prevs);
        }
        /* Specialty image previews */
        if (d.specialtyCourses) {
          const prevs: Record<string, string> = {};
          d.specialtyCourses.forEach((c: CourseCardData) => { if (c.imgUrl) prevs[c.id] = BASE_URL + c.imgUrl; });
          setSpecialtyImgPrevs(prevs);
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
  const onSubmit = async (data: BestYogaSchoolFormValues) => {
    if (!heroFile && !heroPrev) {
      setHeroErr("Hero image is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const fd = new window.FormData();

      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));

      /* Para lists */
      fd.append("bodyParagraphs1", JSON.stringify(
        bodyParaList.ids.map((id) => cleanHTML(bodyParaList.ref.current[id])).filter(Boolean)
      ));
      fd.append("bodyParagraphs2", JSON.stringify(
        bodyParaList2.ids.map((id) => cleanHTML(bodyParaList2.ref.current[id])).filter(Boolean)
      ));

      /* Dynamic arrays */
      fd.append("accredBadges",      JSON.stringify(accredBadges));
      fd.append("courseCards",       JSON.stringify(courseCards));
      fd.append("specialtyCourses",  JSON.stringify(specialtyCourses));
      fd.append("inlineLinks",       JSON.stringify(inlineLinks));
      fd.append("inlineLinks2",      JSON.stringify(inlineLinks2));

      /* Hero image */
      if (heroFile) fd.append("heroImage", heroFile);

      /* Accred badge images — key: accredImg_{id} */
      Object.entries(accredImgFiles).forEach(([id, f]) => fd.append(`accredImg_${id}`, f));

      /* Course card images — key: courseImg_{id} */
      Object.entries(courseImgFiles).forEach(([id, f]) => fd.append(`courseImg_${id}`, f));

      /* Specialty course images — key: specialtyImg_{id} */
      Object.entries(specialtyImgFiles).forEach(([id, f]) => fd.append(`specialtyImg_${id}`, f));

      if (isEdit) {
        await api.put("/best-yoga-school/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully!");
      } else {
        await api.post("/best-yoga-school/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/best-yoga-school"), 1500);
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
      <span>Loading Best Yoga School content…</span>
    </div>
  );

  /* ── Success state ── */
  if (submitted) return (
    <div className={styles.successScreen}>
      <div className={styles.successCard}>
        <div className={styles.successOm}>ॐ</div>
        <div className={styles.successCheck}>✓</div>
        <h2 className={styles.successTitle}>Best Yoga School Page {isEdit ? "Updated" : "Saved"}!</h2>
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
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/best-yoga-school")}>
          Best Yoga School
        </button>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{isEdit ? "Edit Page" : "Add New Page"}</span>
      </div>

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>
            {isEdit ? "Edit Best Yoga School Page" : "Add Best Yoga School Page"}
          </h1>
          <p className={styles.pageSubtitle}>
            Hero · Accreditations · Body Text · Courses (200/300/500hr) · Specialty Courses · Inline Links
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
        <Sec title="Hero Image" badge="Section 1 — Top of Page">
          <F label="Hero Image" req hint="Recommended: 1180×540px · JPG/PNG/WEBP">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 2. HERO INTRO + BODY TEXT ══ */}
        <Sec title="Hero Title & Body Text" badge="Section 1 — Intro Block">
          <F label="Page / Hero Title" req>
            <div className={`${styles.inputWrap} ${errors.heroTitle ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Best Yoga Teacher Training Rishikesh – Best Yoga School Rishikesh"
                {...register("heroTitle", { required: "Required" })} />
            </div>
            {errors.heroTitle && <p className={styles.errorMsg}>⚠ {errors.heroTitle.message}</p>}
          </F>

          <F label="Body Paragraphs (First Block)" hint="Paragraphs appearing above the accreditation badges. First paragraph is shown by default.">
            {bodyParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={bodyParaList.ids.length}
                onSave={bodyParaList.save} onRemove={bodyParaList.remove}
                value={bodyParaList.ref.current[id]}
                ph="Best Yoga Teacher Training in Rishikesh is written on every school website's wall…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={bodyParaList.add}>＋ Add Paragraph</button>
          </F>

          <F label="Inline Links (First Block)" hint="Links embedded inside the paragraph text above (e.g. 200 hr, 300 hr, 500 hr links).">
            <InlineLinkManager items={inlineLinks} onChange={setInlineLinks} />
          </F>
        </Sec>
        <D />

        {/* ══ 3. ACCREDITATIONS ══ */}
        <Sec title="Accreditations" badge="Section 1 — Certificate Grid">
          <F label="Accreditations Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Our Accreditations – AYM Yoga School"
                {...register("accrSectionTitle")} />
            </div>
          </F>
          <F label="Accreditation Badges" hint="Each badge shows a short code, caption label, and certificate image.">
            <AccredManager
              items={accredBadges} onChange={setAccredBadges}
              imgFiles={accredImgFiles} setImgFiles={setAccredImgFiles}
              imgPreviews={accredImgPrevs} setImgPreviews={setAccredImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 4. BODY TEXT BLOCK 2 ══ */}
        <Sec title="Body Text (Below Accreditations)" badge="Section 1 — Continuation">
          <F label="Body Paragraphs (Second Block)" hint="Paragraphs appearing below the accreditation badges.">
            {bodyParaList2.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={bodyParaList2.ids.length}
                onSave={bodyParaList2.save} onRemove={bodyParaList2.remove}
                value={bodyParaList2.ref.current[id]}
                ph="At AYM, we conduct the best yoga course in Rishikesh…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={bodyParaList2.add}>＋ Add Paragraph</button>
          </F>

          <F label="Inline Links (Second Block)" hint="Links embedded inside the second block of paragraphs.">
            <InlineLinkManager items={inlineLinks2} onChange={setInlineLinks2} />
          </F>
        </Sec>
        <D />

        {/* ══ 5. YOGA COURSES (200 / 300 / 500 hr) ══ */}
        <Sec title="Yoga Teacher Training Courses" badge="Section 2 — Course Cards">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Our Yoga Teacher Training Courses"
                {...register("coursesSectionTitle")} />
            </div>
          </F>
          <F label="Course Cards" hint="Each card = one course with title, description, duration, certificate, links and image.">
            <CourseCardManager
              items={courseCards} onChange={setCourseCards}
              imgFiles={courseImgFiles} setImgFiles={setCourseImgFiles}
              imgPreviews={courseImgPrevs} setImgPreviews={setCourseImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 6. SPECIALTY COURSES ══ */}
        <Sec title="Specialty Courses" badge="Section 3 — Ayurveda / Sound Healing etc.">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Specialty Courses"
                {...register("specialtySectionTitle")} />
            </div>
          </F>
          <F label="Specialty Course Cards" hint="Same layout as main courses — add Ayurveda, Sound Healing, etc.">
            <CourseCardManager
              items={specialtyCourses} onChange={setSpecialtyCourses}
              imgFiles={specialtyImgFiles} setImgFiles={setSpecialtyImgFiles}
              imgPreviews={specialtyImgPrevs} setImgPreviews={setSpecialtyImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 7. PAGE SETTINGS ══ */}
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
        <Link href="/admin/yogacourse/best-yoga-school" className={styles.cancelBtn}>← Cancel</Link>
        <button type="button"
          className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnLoading : ""}`}
          onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className={styles.spinner} /> Saving…</>
          ) : (
            <><span>✦</span> {isEdit ? "Update" : "Save"} Best Yoga School Page</>
          )}
        </button>
      </div>
    </div>
  );
}