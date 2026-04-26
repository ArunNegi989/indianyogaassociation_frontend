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

/* ─── Sub Section Wrapper ─── */
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
   COURSE CARD MANAGER
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
    description: "Our 200 hour yoga course is thoughtfully crafted to offer a deep understanding of yoga principles, techniques, and philosophy.",
    duration: "24 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "200 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "200 Hour Yoga Teacher Training",
    imgUrl: "",
    reverse: false,
  },
  {
    id: "cc2",
    title: "300 Hours Yoga Teacher Training in Rishikesh",
    description: "Our 300 hour yoga course is carefully designed to build upon the foundational knowledge.",
    duration: "28 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "300 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "300 Hour Yoga Teacher Training",
    imgUrl: "",
    reverse: true,
  },
  {
    id: "cc3",
    title: "500 Hours Yoga Teacher Training in Rishikesh",
    description: "Our 500 hour yoga course is designed to deepen your practice and refine your teaching skills.",
    duration: "56 Days.",
    certificate: "Yoga Alliance, USA and YCB, Ministry of AYUSH ( Optional ).",
    detailsLabel: "500 Hour Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "500 Hour Yoga Teacher Training",
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
                  placeholder="e.g. 200 Hours Yoga Teacher Training"
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
                    placeholder="e.g. View Details" onChange={(e) => update(item.id, "detailsLabel", e.target.value)} />
                </div>
              </F>
              <F label="Details Button Link">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.detailsHref}
                    placeholder="/courses/200-hour-ttc" onChange={(e) => update(item.id, "detailsHref", e.target.value)} />
                </div>
              </F>
            </div>
            <div className={styles.grid2}>
              <F label="Book Now Link">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.bookHref}
                    placeholder="/book/200-hour-ttc" onChange={(e) => update(item.id, "bookHref", e.target.value)} />
                </div>
              </F>
              <F label="Image Alt Text">
                <div className={styles.inputWrap}>
                  <input className={`${styles.input} ${styles.inputNoCount}`} value={item.imgAlt}
                    placeholder="Descriptive alt text" onChange={(e) => update(item.id, "imgAlt", e.target.value)} />
                </div>
              </F>
            </div>
            <F label="Course Image" hint="Recommended: 700×500px">
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
            <F label="Layout">
              <div className={styles.selectWrap}>
                <select className={styles.select} value={item.reverse ? "true" : "false"}
                  onChange={(e) => update(item.id, "reverse", e.target.value === "true")}>
                  <option value="false">Image Left, Text Right</option>
                  <option value="true">Image Right, Text Left</option>
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
    description: "Discover the transformative energy of traditional healing with the Ayurveda course.",
    duration: "7, 14 & 21 Days",
    certificate: "AYM YOGA SCHOOL.",
    detailsLabel: "Ayurveda Courses",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "Ayurveda Yoga Course",
    imgUrl: "",
    reverse: true,
  },
  {
    id: "sc2",
    title: "Sound Healing Course in Rishikesh",
    description: "Transform your well-being with the Sound Healing Course.",
    duration: "5 Days.",
    certificate: "Yoga Alliance, USA.",
    detailsLabel: "Sound Healing Details",
    detailsHref: "#",
    bookHref: "#",
    imgAlt: "Sound Healing Course",
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
        <div key={item.id} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
          <span className={styles.listNum}>{idx + 1}</span>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.text}
              placeholder="Link text" onChange={(e) => update(item.id, "text", e.target.value)} />
          </div>
          <div className={`${styles.inputWrap} ${styles.listInput}`} style={{ flex: 1 }}>
            <input className={`${styles.input} ${styles.inputNoCount}`} value={item.href}
              placeholder="/link-url" onChange={(e) => update(item.id, "href", e.target.value)} />
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
  heroTitle: string;
  accrSectionTitle: string;
  coursesSectionTitle: string;
  specialtySectionTitle: string;
  // Course Info Card Fields
  courseInfoCardTitle: string;
  courseInfoFeeLabel: string;
  courseInfoFeeFromText: string;
  courseInfoBookBtnText: string;
  courseInfoUsdPrice: number;
  courseInfoInrPrice: number;
  courseInfoOriginalUsdPrice: number;
  courseInfoOriginalInrPrice: number;
  // Media Gallery Fields
  contentBadgeText: string;
  contentTitleHighlight: string;
  mediaMainImageAlt: string;
  mediaMainVideoUrl: string;
  accrEyebrowText: string;
  accrTaglineText: string;
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

  /* ── Media Gallery Images ── */
  const [mediaMainFile, setMediaMainFile] = useState<File | null>(null);
  const [mediaMainPrev, setMediaMainPrev] = useState("");
  const [mediaSmallFiles, setMediaSmallFiles] = useState<Record<number, File>>({});
  const [mediaSmallPrevs, setMediaSmallPrevs] = useState<string[]>([]);
  const [mediaSmallImages, setMediaSmallImages] = useState([
    { imgUrl: "", alt: "Yoga Class", overlayText: "Yoga Practice" },
    { imgUrl: "", alt: "Meditation", overlayText: "Meditation" },
    { imgUrl: "", alt: "Ashram View", overlayText: "Ashram Life" },
  ]);
  const [trainingTags, setTrainingTags] = useState([
    { icon: "🧘", text: "200 Hour TTC" },
    { icon: "🕉️", text: "300 Hour TTC" },
    { icon: "✨", text: "500 Hour TTC" },
  ]);
  const [pillsItems, setPillsItems] = useState([
    { text: "✓ Yoga Alliance Certified" },
    { text: "✓ 6000+ Graduates" },
    { text: "✓ Since 2009" },
    { text: "✓ Top Rated School" },
  ]);

  /* ── Accreditation badge images ── */
  const [accredImgFiles, setAccredImgFiles] = useState<Record<string, File>>({});
  const [accredImgPrevs, setAccredImgPrevs] = useState<Record<string, string>>({});

  /* ── Course card images ── */
  const [courseImgFiles, setCourseImgFiles] = useState<Record<string, File>>({});
  const [courseImgPrevs, setCourseImgPrevs] = useState<Record<string, string>>({});

  /* ── Specialty course images ── */
  const [specialtyImgFiles, setSpecialtyImgFiles] = useState<Record<string, File>>({});
  const [specialtyImgPrevs, setSpecialtyImgPrevs] = useState<Record<string, string>>({});

  /* ── Rich text (body paragraphs) ── */
  const bodyParaList = useParaList("bp1");
  const bodyParaList2 = useParaList("bp2");

  /* ── Dynamic managers ── */
  const [accredBadges, setAccredBadges] = useState<AccredBadge[]>(DEFAULT_ACCRED);
  const [courseCards, setCourseCards] = useState<CourseCardData[]>(DEFAULT_COURSES);
  const [specialtyCourses, setSpecialtyCourses] = useState<CourseCardData[]>(DEFAULT_SPECIALTY);
  const [inlineLinks, setInlineLinks] = useState<InlineLink[]>([
    { id: "il1", text: "200 hour residential yoga teacher training", href: "#" },
    { id: "il2", text: "300 hour residential yoga teacher training", href: "#" },
    { id: "il3", text: "500 hours residential yoga teacher teaching certifications", href: "#" },
  ]);
  const [inlineLinks2, setInlineLinks2] = useState<InlineLink[]>([
    { id: "il4", text: "best yoga teacher training for beginner in rishikesh", href: "#" },
  ]);

  /* ── Course Info Details ── */
  const [courseInfoDetails, setCourseInfoDetails] = useState([
    { label: "DURATION", value: "24 Days", sub: "" },
    { label: "LEVEL", value: "Advanced", sub: "" },
    { label: "CERTIFICATION", value: "500 Hour", sub: "" },
    { label: "YOGA STYLE", value: "Multistyle", sub: "Ashtanga, Vinyasa & Hatha" },
    { label: "LANGUAGE", value: "English & Hindi", sub: "" },
    { label: "DATE", value: "Check batches below", sub: "" },
  ]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BestYogaSchoolFormValues>({
    defaultValues: {
      status: "Active",
      heroTitle: "Best Yoga Teacher Training Rishikesh – Best Yoga School Rishikesh",
      accrSectionTitle: "Our Accreditations – AYM Yoga School",
      coursesSectionTitle: "Our Yoga Teacher Training Courses",
      specialtySectionTitle: "Specialty Courses",
      courseInfoCardTitle: "COURSE DETAILS",
      courseInfoFeeLabel: "COURSE FEE",
      courseInfoFeeFromText: "starting from",
      courseInfoBookBtnText: "BOOK NOW",
      courseInfoUsdPrice: 999,
      courseInfoInrPrice: 82000,
      courseInfoOriginalUsdPrice: 1799,
      courseInfoOriginalInrPrice: 148000,
      contentBadgeText: "Welcome to AYM Yoga School",
      contentTitleHighlight: "Rishikesh",
      mediaMainImageAlt: "Yoga Teacher Training",
      mediaMainVideoUrl: "",
      accrEyebrowText: "Certified & Recognised",
      accrTaglineText: "Yoga Alliance USA & Ministry of AYUSH, Government of India",
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
          "courseInfoCardTitle", "courseInfoFeeLabel", "courseInfoFeeFromText",
          "courseInfoBookBtnText", "courseInfoUsdPrice", "courseInfoInrPrice",
          "courseInfoOriginalUsdPrice", "courseInfoOriginalInrPrice",
          "contentBadgeText", "contentTitleHighlight", "mediaMainImageAlt",
          "mediaMainVideoUrl", "accrEyebrowText", "accrTaglineText",
        ];
        keys.forEach((k) => { if (d[k] !== undefined) setValue(k, d[k]); });

        /* Images */
        if (d.heroImage) setHeroPrev(BASE_URL + d.heroImage);
        if (d.mediaMainImage) setMediaMainPrev(BASE_URL + d.mediaMainImage);
        
        /* Media Small Images */
        if (d.mediaSmallImages?.length) {
          setMediaSmallImages(d.mediaSmallImages);
          const previews = d.mediaSmallImages.map((img: any) => img.imgUrl ? BASE_URL + img.imgUrl : "");
          setMediaSmallPrevs(previews);
        }
        if (d.trainingTags?.length) setTrainingTags(d.trainingTags);
        if (d.pillsItems?.length) setPillsItems(d.pillsItems);

        /* Para lists */
        if (d.bodyParagraphs1?.length) bodyParaList.loadFromArray(d.bodyParagraphs1, "bp1-");
        if (d.bodyParagraphs2?.length) bodyParaList2.loadFromArray(d.bodyParagraphs2, "bp2-");

        /* Dynamic arrays */
        if (d.accredBadges?.length) setAccredBadges(d.accredBadges);
        if (d.courseCards?.length) setCourseCards(d.courseCards);
        if (d.specialtyCourses?.length) setSpecialtyCourses(d.specialtyCourses);
        if (d.inlineLinks?.length) setInlineLinks(d.inlineLinks);
        if (d.inlineLinks2?.length) setInlineLinks2(d.inlineLinks2);
        if (d.courseInfoDetails?.length) setCourseInfoDetails(d.courseInfoDetails);

        /* Accred image previews */
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
      fd.append("accredBadges", JSON.stringify(accredBadges));
      fd.append("courseCards", JSON.stringify(courseCards));
      fd.append("specialtyCourses", JSON.stringify(specialtyCourses));
      fd.append("inlineLinks", JSON.stringify(inlineLinks));
      fd.append("inlineLinks2", JSON.stringify(inlineLinks2));
      fd.append("courseInfoDetails", JSON.stringify(courseInfoDetails));
      fd.append("mediaSmallImages", JSON.stringify(mediaSmallImages));
      fd.append("trainingTags", JSON.stringify(trainingTags));
      fd.append("pillsItems", JSON.stringify(pillsItems));

      /* Hero image */
      if (heroFile) fd.append("heroImage", heroFile);
      
      /* Media Main Image */
      if (mediaMainFile) fd.append("mediaMainImage", mediaMainFile);
      
      /* Media Small Images */
      Object.entries(mediaSmallFiles).forEach(([idx, file]) => fd.append(`mediaSmallImage_${idx}`, file));

      /* Accred badge images */
      Object.entries(accredImgFiles).forEach(([id, f]) => fd.append(`accredImg_${id}`, f));

      /* Course card images */
      Object.entries(courseImgFiles).forEach(([id, f]) => fd.append(`courseImg_${id}`, f));

      /* Specialty course images */
      Object.entries(specialtyImgFiles).forEach(([id, f]) => fd.append(`specialtyImg_${id}`, f));

      if (isEdit) {
        await api.put("/best-yoga-school/update", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page updated successfully!");
      } else {
        await api.post("/best-yoga-school/create", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Page created successfully!");
      }
      setSubmitted(true);
      setTimeout(() => router.push("/admin/yogacourse/yoga-teacher-in-rishikesh"), 1500);
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
        <button className={styles.breadcrumbLink} onClick={() => router.push("/admin/yogacourse/yoga-teacher-in-rishikesh")}>
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
            Hero · Course Info Card · Media Gallery · Accreditations · Body Text · Courses · Specialty · Inline Links
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
        <Sec title="Hero Image" badge="Top of Page">
          <F label="Hero Image" req hint="Recommended: 1180×540px">
            <SingleImg
              preview={heroPrev} badge="Hero" hint="JPG/PNG/WEBP · 1180×540px"
              error={heroErr}
              onSelect={(f, p) => { setHeroFile(f); setHeroPrev(p); setHeroErr(""); }}
              onRemove={() => { setHeroFile(null); setHeroPrev(""); setHeroErr("Hero image is required"); }}
            />
          </F>
          <F label="Hero Title" req>
            <div className={`${styles.inputWrap} ${errors.heroTitle ? styles.inputError : ""}`}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Best Yoga Teacher Training Rishikesh"
                {...register("heroTitle", { required: "Required" })} />
            </div>
            {errors.heroTitle && <p className={styles.errorMsg}>⚠ {errors.heroTitle.message}</p>}
          </F>
        </Sec>
        <D />

        {/* ══ 2. COURSE INFO CARD SECTION ══ */}
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
                      <button type="button" className={styles.removeNestedBtn} onClick={() => setCourseInfoDetails(courseInfoDetails.filter((_, idx) => idx !== i))}>
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
                          <input className={styles.input} value={detail.sub || ""}
                            onChange={(e) => { const n = [...courseInfoDetails]; n[i] = { ...n[i], sub: e.target.value }; setCourseInfoDetails(n); }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} onClick={() => setCourseInfoDetails([...courseInfoDetails, { label: "", value: "", sub: "" }])}>
                ＋ Add Course Detail
              </button>
            </div>
          </F>

          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e8d5b5" }}>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", fontWeight: 600, color: "#3d1d00", marginBottom: "1rem" }}>💰 Course Card Pricing (Independent)</h4>
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

        {/* ══ 3. MEDIA GALLERY SECTION ══ */}
        <Sec title="Media Gallery" badge="Introduction Section Images">
          <F label="Content Badge Text">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("contentBadgeText")} placeholder="Welcome to AYM Yoga School" />
            </div>
          </F>
          <F label="Content Title Highlight Word">
            <div className={styles.inputWrap}>
              <input className={styles.input} {...register("contentTitleHighlight")} placeholder="Rishikesh" />
            </div>
          </F>
          
          <SubSec title="Main Media (Large Image/Video)">
            <F label="Main Image" hint="Recommended: 800×600px">
              <SingleImg
                preview={mediaMainPrev}
                badge="Main Media"
                hint="JPG/PNG/WEBP · 800×600px"
                error=""
                onSelect={(f, p) => { setMediaMainFile(f); setMediaMainPrev(p); }}
                onRemove={() => { setMediaMainFile(null); setMediaMainPrev(""); }}
              />
            </F>
            <F label="Main Image Alt Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("mediaMainImageAlt")} placeholder="Yoga Teacher Training" />
              </div>
            </F>
            <F label="Video URL (optional)">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("mediaMainVideoUrl")} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <p className={styles.fieldHint}>If provided, users can toggle between image and video</p>
            </F>
          </SubSec>
          
          <SubSec title="Small Images Grid (3 images)">
            <p className={styles.fieldHint}>These 3 small images appear below the main image</p>
            <div>
              {mediaSmallImages.map((item, idx) => (
                <div key={idx} className={styles.nestedCard} style={{ marginBottom: "0.8rem" }}>
                  <div className={styles.nestedCardHeader}>
                    <span className={styles.nestedCardNum}>Small Image {idx + 1}</span>
                    {mediaSmallImages.length > 1 && (
                      <button type="button" className={styles.removeNestedBtn} 
                        onClick={() => setMediaSmallImages(mediaSmallImages.filter((_, i) => i !== idx))}>
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div className={styles.nestedCardBody}>
                    <F label="Image">
                      <SingleImg
                        preview={mediaSmallPrevs[idx] || item.imgUrl || ""}
                        badge={`Small ${idx + 1}`}
                        hint="JPG/PNG/WEBP · 400×300px"
                        onSelect={(f, p) => {
                          const newFiles = { ...mediaSmallFiles, [idx]: f };
                          setMediaSmallFiles(newFiles);
                          const newPrevs = [...mediaSmallPrevs];
                          newPrevs[idx] = p;
                          setMediaSmallPrevs(newPrevs);
                        }}
                        onRemove={() => {
                          const newPrevs = [...mediaSmallPrevs];
                          newPrevs[idx] = "";
                          setMediaSmallPrevs(newPrevs);
                          const newFiles = { ...mediaSmallFiles };
                          delete newFiles[idx];
                          setMediaSmallFiles(newFiles);
                        }}
                      />
                    </F>
                    <F label="Alt Text">
                      <div className={styles.inputWrap}>
                        <input className={styles.input} value={item.alt || ""} placeholder="Image description"
                          onChange={(e) => {
                            const n = [...mediaSmallImages];
                            n[idx] = { ...n[idx], alt: e.target.value };
                            setMediaSmallImages(n);
                          }} />
                      </div>
                    </F>
                    <F label="Overlay Text">
                      <div className={styles.inputWrap}>
                        <input className={styles.input} value={item.overlayText || ""} placeholder="Yoga Practice"
                          onChange={(e) => {
                            const n = [...mediaSmallImages];
                            n[idx] = { ...n[idx], overlayText: e.target.value };
                            setMediaSmallImages(n);
                          }} />
                      </div>
                    </F>
                  </div>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setMediaSmallImages([...mediaSmallImages, { imgUrl: "", alt: "", overlayText: "" }])}>
                ＋ Add Small Image
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Training Tags">
            <p className={styles.fieldHint}>Tags shown below the images (icon + text)</p>
            <div>
              {trainingTags.map((tag, idx) => (
                <div key={idx} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <span className={styles.listNum}>{idx + 1}</span>
                  <div className={styles.inputWrap} style={{ flex: "0 0 80px" }}>
                    <input className={styles.input} value={tag.icon} placeholder="🧘"
                      onChange={(e) => { const n = [...trainingTags]; n[idx] = { ...n[idx], icon: e.target.value }; setTrainingTags(n); }} />
                  </div>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input className={styles.input} value={tag.text} placeholder="200 Hour TTC"
                      onChange={(e) => { const n = [...trainingTags]; n[idx] = { ...n[idx], text: e.target.value }; setTrainingTags(n); }} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} 
                    onClick={() => { if (trainingTags.length > 1) setTrainingTags(trainingTags.filter((_, i) => i !== idx)); }}
                    disabled={trainingTags.length <= 1}>✕</button>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setTrainingTags([...trainingTags, { icon: "✨", text: "" }])}>
                ＋ Add Training Tag
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Pills Items">
            <p className={styles.fieldHint}>Additional pill badges shown below training tags</p>
            <div>
              {pillsItems.map((pill, idx) => (
                <div key={idx} className={styles.listItemRow} style={{ marginBottom: "0.5rem", gap: "0.5rem" }}>
                  <span className={styles.listNum}>{idx + 1}</span>
                  <div className={`${styles.inputWrap} ${styles.listInput}`}>
                    <input className={styles.input} value={pill.text} placeholder="✓ Yoga Alliance Certified"
                      onChange={(e) => { const n = [...pillsItems]; n[idx] = { ...n[idx], text: e.target.value }; setPillsItems(n); }} />
                  </div>
                  <button type="button" className={styles.removeItemBtn} 
                    onClick={() => { if (pillsItems.length > 1) setPillsItems(pillsItems.filter((_, i) => i !== idx)); }}
                    disabled={pillsItems.length <= 1}>✕</button>
                </div>
              ))}
              <button type="button" className={styles.addItemBtn} 
                onClick={() => setPillsItems([...pillsItems, { text: "" }])}>
                ＋ Add Pill
              </button>
            </div>
          </SubSec>
          
          <SubSec title="Accreditations Header Text">
            <F label="Eyebrow Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("accrEyebrowText")} placeholder="Certified & Recognised" />
              </div>
            </F>
            <F label="Tagline Text">
              <div className={styles.inputWrap}>
                <input className={styles.input} {...register("accrTaglineText")} placeholder="Yoga Alliance USA & Ministry of AYUSH" />
              </div>
            </F>
          </SubSec>
        </Sec>
        <D />

        {/* ══ 4. BODY TEXT (First Block) ══ */}
        <Sec title="Body Text (First Block)" badge="Above Accreditations">
          <F label="Body Paragraphs">
            {bodyParaList.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={bodyParaList.ids.length}
                onSave={bodyParaList.save} onRemove={bodyParaList.remove}
                value={bodyParaList.ref.current[id]}
                ph="Best Yoga Teacher Training in Rishikesh is written on every school website's wall…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={bodyParaList.add}>＋ Add Paragraph</button>
          </F>
          <F label="Inline Links">
            <InlineLinkManager items={inlineLinks} onChange={setInlineLinks} />
          </F>
        </Sec>
        <D />

        {/* ══ 5. ACCREDITATIONS ══ */}
        <Sec title="Accreditations" badge="Certificate Grid">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Our Accreditations – AYM Yoga School"
                {...register("accrSectionTitle")} />
            </div>
          </F>
          <F label="Accreditation Badges">
            <AccredManager
              items={accredBadges} onChange={setAccredBadges}
              imgFiles={accredImgFiles} setImgFiles={setAccredImgFiles}
              imgPreviews={accredImgPrevs} setImgPreviews={setAccredImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 6. BODY TEXT (Second Block) ══ */}
        <Sec title="Body Text (Second Block)" badge="Below Accreditations">
          <F label="Body Paragraphs">
            {bodyParaList2.ids.map((id, i) => (
              <RichListItem key={id} id={id} index={i} total={bodyParaList2.ids.length}
                onSave={bodyParaList2.save} onRemove={bodyParaList2.remove}
                value={bodyParaList2.ref.current[id]}
                ph="The Association for Yoga and Meditation - the best yoga school in Rishikesh…" />
            ))}
            <button type="button" className={styles.addItemBtn} onClick={bodyParaList2.add}>＋ Add Paragraph</button>
          </F>
          <F label="Inline Links (Second Block)">
            <InlineLinkManager items={inlineLinks2} onChange={setInlineLinks2} />
          </F>
        </Sec>
        <D />

        {/* ══ 7. YOGA COURSES ══ */}
        <Sec title="Yoga Teacher Training Courses" badge="Section 2 — Course Cards">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Our Yoga Teacher Training Courses"
                {...register("coursesSectionTitle")} />
            </div>
          </F>
          <F label="Course Cards">
            <CourseCardManager
              items={courseCards} onChange={setCourseCards}
              imgFiles={courseImgFiles} setImgFiles={setCourseImgFiles}
              imgPreviews={courseImgPrevs} setImgPreviews={setCourseImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 8. SPECIALTY COURSES ══ */}
        <Sec title="Specialty Courses" badge="Section 3 — Ayurveda / Sound Healing">
          <F label="Section Title">
            <div className={styles.inputWrap}>
              <input className={`${styles.input} ${styles.inputNoCount}`}
                placeholder="Specialty Courses"
                {...register("specialtySectionTitle")} />
            </div>
          </F>
          <F label="Specialty Course Cards">
            <CourseCardManager
              items={specialtyCourses} onChange={setSpecialtyCourses}
              imgFiles={specialtyImgFiles} setImgFiles={setSpecialtyImgFiles}
              imgPreviews={specialtyImgPrevs} setImgPreviews={setSpecialtyImgPrevs}
            />
          </F>
        </Sec>
        <D />

        {/* ══ 9. PAGE SETTINGS ══ */}
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

      {/* Actions */}
      <div className={styles.formActions}>
        <Link href="/admin/yogacourse/yoga-teacher-in-rishikesh" className={styles.cancelBtn}>← Cancel</Link>
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